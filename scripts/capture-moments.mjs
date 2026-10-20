// Captures the four signature moments of the Hackfam design prototype frame by frame.
// Every Web Animation in the phone frame is paused and scrubbed to t = 0..END ms, so frames are exact.
// Usage (from the private repo root, which has Playwright installed):
//   PLAYWRIGHT_DIR=$PWD/node_modules/.pnpm/playwright@1.64.1/node_modules/playwright \
//   node ~/Documents/hackfam-showcase/scripts/capture-moments.mjs <prototypeDir> <outDir> [theme]
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_DIR || 'playwright');
const [protoDir, outDir, theme = 'dark'] = process.argv.slice(2);
const url = pathToFileURL(path.join(protoDir, 'index.html')).href;
const STEP = 40, END = 1240;

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
const box = (fid) => page.evaluate((s) => { const el = document.querySelector(s); el.scrollIntoView({ block: 'start', behavior: 'instant' }); const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, width: b.width, height: b.height }; }, sel(fid));

async function sweep(name, fid) {
  const dir = path.join(outDir, `${name}-${theme}`);
  fs.mkdirSync(dir, { recursive: true });
  const clip = await box(fid);
  let i = 0;
  for (let t = 0; t <= END; t += STEP) {
    await scrub(fid, t);
    await page.waitForTimeout(30);
    await page.screenshot({ path: path.join(dir, String(i++).padStart(3, '0') + '.png'), clip });
  }
  await release(); await finishAll(fid); await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(dir, String(i++).padStart(3, '0') + '.png'), clip });
  console.log('frames', name, i);
}

// 1. Join the pool: the wristband snaps shut.
await hold(); await tap('#f-event [data-act="join"]'); await sweep('snap', 'f-event');

// 2. Event match: "<name> said yes too", the avatar flies into the open slot.
await tap('#f-discover [data-act="pass"]');
await page.waitForFunction(() => document.querySelector('#f-discover .deck .card[data-depth="0"]')?.dataset.id === 'ines');
await page.waitForTimeout(400);
await hold(); await tap('#f-discover [data-act="int"]'); await sweep('match', 'f-discover');

// 3. Anyone connection: the build rhythms interlock.
await tap('#f-anyone [data-act="pass"]');
await page.waitForFunction(() => document.querySelector('#f-anyone .deck .card[data-depth="0"]')?.dataset.id === 'hyunwoo');
await page.waitForTimeout(400);
await hold(); await tap('#f-anyone [data-act="int"]'); await sweep('connect', 'f-anyone');

// 4. A slot request accepted: the seat fills.
await hold(); await tap('#f-team [data-act="accept"]'); await sweep('seat', 'f-team');

await browser.close();
