// Captures four short feature tours from the Hackfam design prototype, one per area of the app.
// Web Animations are scrubbed frame by frame (exact); taps, drags and scrolls are captured as they render.
// Each tour folder gets numbered PNGs plus durations.json (ms per frame) for build-gifs.py.
// Usage (from the private repo root, which has Playwright installed):
//   PLAYWRIGHT_DIR=$PWD/node_modules/.pnpm/playwright@1.64.1/node_modules/playwright \
//   node ~/Documents/hackfam-showcase/scripts/capture-tours.mjs <prototypeDir> <outDir> [theme]
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_DIR || 'playwright');
const [protoDir, outDir, theme = 'dark'] = process.argv.slice(2);
const url = pathToFileURL(path.join(protoDir, 'index.html')).href;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1500, height: 1300 }, deviceScaleFactor: 1 });
page.setDefaultTimeout(60000);
await page.goto(`${url}?theme=${theme}&motion=full`);
await page.waitForSelector('body[data-ready]');
await page.evaluate(() => document.body.classList.add('shooting'));
await page.waitForTimeout(500);

const sel = (fid) => `#${fid} .screen`;
const tap = (s) => page.evaluate((q) => { const el = document.querySelector(q); if (!el) throw new Error('no ' + q); el.click(); }, s);
const hold = () => page.evaluate(() => { window.__holdTimers = true; window.__held = []; });
const release = () => page.evaluate(() => { window.__holdTimers = false; (window.__held || []).forEach(f => f()); window.__held = []; });
const finishAll = (fid) => page.evaluate((s) => document.querySelector(s).getAnimations({ subtree: true }).forEach(a => a.finish()), sel(fid));
const scrub = (fid, ms) => page.evaluate(([s, t]) => window.__scrub(document.querySelector(s), t), [sel(fid), ms]);
const scrollPage = (fid, y) => page.evaluate(([s, yy]) => { const p = document.querySelector(s + ' .page'); if (p) p.scrollTo({ top: yy, behavior: 'instant' }); }, [sel(fid), y]);
const clipOf = (fid) => page.evaluate((s) => { const el = document.querySelector(s); el.scrollIntoView({ block: 'start', behavior: 'instant' }); const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, width: b.width, height: b.height }; }, sel(fid));

class Tour {
  constructor(name) { this.dir = path.join(outDir, `${name}-${theme}`); fs.rmSync(this.dir, { recursive: true, force: true }); fs.mkdirSync(this.dir, { recursive: true }); this.n = 0; this.durations = []; }
  async frame(fid, ms) { const clip = await clipOf(fid); await page.screenshot({ path: path.join(this.dir, String(this.n++).padStart(3, '0') + '.png'), clip }); this.durations.push(ms); }
  async live(fid, total, every = 70) { for (let t = 0; t < total; t += every) { await page.waitForTimeout(every); await this.frame(fid, every); } }
  async sweep(fid, end, step = 40) { for (let t = 0; t <= end; t += step) { await scrub(fid, t); await page.waitForTimeout(25); await this.frame(fid, step); } }
  save() { fs.writeFileSync(path.join(this.dir, 'durations.json'), JSON.stringify(this.durations)); console.log('tour', path.basename(this.dir), this.n, 'frames', this.durations.reduce((a, b) => a + b, 0), 'ms'); }
}

async function drag(tour, fid, dx, steps) {
  await clipOf(fid);
  const card = page.locator(`#${fid} .deck .card[data-depth="0"]`);
  const b = await card.boundingBox();
  const x0 = b.x + b.width / 2, y0 = b.y + 150;
  await page.mouse.move(x0, y0); await page.mouse.down();
  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(x0 + (dx * i) / steps, y0 - i * 1.5);
    await page.waitForTimeout(16);
    if (i % 2 === 0) await tour.frame(fid, 55);
  }
  return { x0, y0 };
}

// 1. Events: browse, filter a weekend, open an event, join the pool (the wristband snaps).
{
  const t = new Tour('tour-events');
  await t.frame('f-events', 1500);
  await tap('#f-events [data-act="wk"][data-k="n14"]'); await t.live('f-events', 280); await t.frame('f-events', 1300);
  await tap('#f-events [data-act="wk"][data-k="all"]');
  await t.frame('f-event', 1300);
  await hold(); await tap('#f-event [data-act="join"]'); await t.sweep('f-event', 880);
  await release(); await finishAll('f-event'); await page.waitForTimeout(700); await t.frame('f-event', 900);
  await scrollPage('f-event', 470); await page.waitForTimeout(200); await t.frame('f-event', 1700);
  t.save();
}

// 2. Discover: pass one card by hand, drag the next right, and both say yes.
{
  const t = new Tour('tour-discover');
  await t.frame('f-discover', 1300);
  const p1 = await drag(t, 'f-discover', -230, 16);
  await page.mouse.up(); await t.live('f-discover', 420);
  await page.waitForFunction(() => document.querySelector('#f-discover .deck .card[data-depth="0"]')?.dataset.id === 'ines');
  await t.frame('f-discover', 700);
  await drag(t, 'f-discover', 170, 14);
  await t.frame('f-discover', 500);
  await hold();
  const b = await page.locator('#f-discover .deck .card[data-depth="0"]').boundingBox();
  await page.mouse.move(b.x + b.width / 2 + 220, b.y + 140, { steps: 3 }); await page.mouse.up();
  await t.sweep('f-discover', 1160);
  await release(); await finishAll('f-discover'); await page.waitForTimeout(500); await t.frame('f-discover', 2000);
  void p1;
  t.save();
}

// 3. Teams: accept a request (the seat fills), tick the checklist, switch to the final hour.
{
  const t = new Tour('tour-team');
  await t.frame('f-team', 1300);
  await hold(); await tap('#f-team [data-act="accept"]'); await t.sweep('f-team', 960);
  await release(); await finishAll('f-team'); await page.waitForTimeout(900); await t.frame('f-team', 1400);
  await scrollPage('f-team', 380); await page.waitForTimeout(250); await t.frame('f-team', 800);
  await tap('#f-team [data-act="check"][data-i="1"]'); await t.live('f-team', 280); await t.frame('f-team', 1100);
  await scrollPage('f-team', 0); await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelector('#f-team [data-kind="final"]').click()); await t.live('f-team', 350); await t.frame('f-team', 1900);
  await page.evaluate(() => document.querySelector('#f-team [data-kind="final"]').click());
  t.save();
}

// 4. Onboarding: say what you build at, connect your work, pick your roles.
{
  const t = new Tour('tour-onboarding');
  await t.frame('f-onb-build', 1200);
  for (const k of ['hackathon', 'ctf', 'jam']) { await tap(`#f-onb-build [data-k="${k}"]`); await t.live('f-onb-build', 140); await t.frame('f-onb-build', 380); }
  await t.frame('f-onb-build', 600);
  await t.frame('f-onb-connect', 1000);
  await tap('#f-onb-connect [data-act="connect"][data-k="github"]'); await t.live('f-onb-connect', 980, 120); await t.frame('f-onb-connect', 1100);
  await t.frame('f-onb-role', 900);
  for (const r of ['fe', 'mob']) { await tap(`#f-onb-role [data-r="${r}"]`); await t.live('f-onb-role', 560); await t.frame('f-onb-role', 500); }
  await t.frame('f-onb-role', 1500);
  t.save();
}

await browser.close();
