/* Hackfam · final · core: utilities, motion tokens, haptics, shared builders.
   Plain scripts (no modules) so the board opens from file://. Anything a person types is escaped with esc(). */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const frag = (s) => document.createRange().createContextualFragment(s);
const setHTML = (el, s) => el.replaceChildren(frag(s));
const root = document.documentElement;
const RM = { get on() { return root.dataset.motion === 'reduced'; } };

/* ---------- Motion tokens (DS §9.1): springs, mass 1. Compiled to CSS linear() at load. ---------- */
const SPR = {
  tap: [987, 62.8], snap: [439, 37.7], standard: [247, 31.4], sheet: [195, 26.5],
  deckReturn: [247, 25.1], deckPromote: [322, 32.3], deckExit: [632, 50.3], undo: [195, 23.7], celebrate: [131, 16.0],
  zip: [224, 27.5], /* 420 ms, bounce 0.08: the rhythm interlock (B) */
};
function springEase(k, c) {
  let x = 0, v = 0, t = 0; const dt = 1 / 1000, pts = [0];
  while (t < 2.5) { const a = -k * (x - 1) - c * v; v += a * dt; x += v * dt; t += dt; pts.push(x); if (t > .08 && Math.abs(x - 1) < .002 && Math.abs(v) < .03) break; }
  const n = 40, stops = [];
  for (let i = 0; i <= n; i++) stops.push(i === n ? 1 : +pts[Math.round(i / n * (pts.length - 1))].toFixed(4));
  return { easing: `linear(${stops.join(', ')})`, duration: Math.round(t * 1000) };
}
const EASE = {};
for (const k in SPR) { EASE[k] = springEase(...SPR[k]); root.style.setProperty(`--e-${k}`, EASE[k].easing); root.style.setProperty(`--d-${k}`, EASE[k].duration + 'ms'); }
window.__EASE = EASE;
function anim(el, kf, o = {}) {
  if (!el) return null;
  const e = EASE[o.ease];
  return el.animate(kf, { duration: o.dur ?? (e ? e.duration : 250), easing: e ? e.easing : (o.ease || 'cubic-bezier(.2,.7,.2,1)'), delay: o.delay || 0, fill: o.fill || 'both' });
}
/* Velocity-seeded spring on plain numbers (the deck). Interruptible. */
function runSpring(state, target, name, vel, onFrame, onDone, opts = {}) {
  const [k, c] = SPR[name]; const keys = Object.keys(target); const v = {};
  keys.forEach(kk => v[kk] = (vel && vel[kk]) || 0);
  let last = performance.now(), id, alive = true; const eps = opts.eps ?? .3;
  function step(now) {
    if (!alive) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    const n = Math.max(1, Math.ceil(dt * 240)), h = dt / n;
    for (let i = 0; i < n; i++) for (const kk of keys) { const a = -k * (state[kk] - target[kk]) - c * v[kk]; v[kk] += a * h; state[kk] += v[kk] * h; }
    const rest = keys.every(kk => Math.abs(state[kk] - target[kk]) < eps && Math.abs(v[kk]) < eps * 12);
    if (rest) keys.forEach(kk => state[kk] = target[kk]);
    onFrame(state);
    if (rest || (opts.until && opts.until(state))) { alive = false; onDone && onDone(); return; }
    id = requestAnimationFrame(step);
  }
  id = requestAnimationFrame(step);
  return { stop() { alive = false; cancelAnimationFrame(id); } };
}

/* ---------- Haptics (simulated here; the map is in README) ---------- */
let lastHaptic = 0;
const HAPTICS = {
  armed: 'Rigid 0.5 · crossed the threshold', disarm: 'Soft 0.35 · back under', interested: 'Medium · Interested', pass: 'Light · Pass', save: 'Light · Saved for later',
  select: 'Selection', merge: 'Merge pattern · said yes too', zip: 'Merge pattern · rhythms lock', seat: 'Rigid 0.7 · slot filled', full: 'Success · team full',
  error: 'Error · not allowed', snap: 'Success · wristband snaps, card is live', undo: 'Soft 0.5 · undo',
};
function haptic(kind) {
  const now = performance.now(); if (now - lastHaptic < 80) return; lastHaptic = now;
  const el = $('#haptic'); if (el) setHTML(el, `Haptic: <b>${HAPTICS[kind] || kind}</b>`);
  try { navigator.vibrate && navigator.vibrate(kind === 'merge' || kind === 'zip' ? [12, 70, 24] : 8); } catch (e) {}
}

/* ---------- Builders ---------- */
const av = (id, cls = '') => `<span class="av ${cls}" role="img" aria-label="${PEOPLE[id].name}">${avatarSVG(id)}</span>`;
const poster = (id, w, h, cls = '', tag = 'span', attrs = '') => `<${tag} class="poster ${cls}" ${attrs}>${posterSVG(id, w, h)}</${tag}>`;
const evVars = (id) => { const c = EVENTS[id].c; return `--eb-l:${c.base};--ei-l:${c.ink};--eb-d:${c.dBase};--ei-d:${c.dInk};--acc-l:${c.acc};--on-acc-l:${c.onAcc};--acc-d:${c.accD};--on-acc-d:${c.onAccD};--etx-l:${c.txt};--etx-d:${c.txtD}`; };
const roleVars = (r) => `--rc:var(--rf-${r});--rct:var(--rt-${r});--rf:var(--rf-${r})`;
const rolebar = (counts, cls = '', me) => `<div class="rolebar ${cls}" aria-hidden="true">${ROLE_ORDER.map(r => `<i style="${roleVars(r)};flex:${counts[r]} 1 0" class="${me === r ? 'me' : ''}" data-r="${r}"></i>`).join('')}</div>`;
/* Role colour that reads on the always-dark neutral band (the Anyone overlay). */
const ROLE_ON_DARK = { fe: '#7AC3FF', be: '#2FD8D0', mob: '#86D489', ml: '#D1A8FF', data: '#EEB154', des: '#FF9A9B', prod: '#F99BD1', hw: '#C3C55A' };

/* Names fit their slot (DS §3.3): start wide, narrow to 75, then wrap or ellipsize. */
function fitText(el, max = 125, min = 75) {
  /* Measure the text itself (a Range), not scrollWidth, so sub-pixel overflow at 2x never leaves an ellipsis. */
  const cs = getComputedStyle(el), room = () => el.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - parseFloat(cs.borderLeftWidth) - parseFloat(cs.borderRightWidth);
  const r = document.createRange(), over = () => { r.selectNodeContents(el); return r.getBoundingClientRect().width > room() + 0.05; };
  let st = max; el.style.fontStretch = st + '%';
  while (over() && st > min) { st -= 5; el.style.fontStretch = Math.max(st, min) + '%'; }
  if (over() && el.dataset.fit === 'wrap') { el.style.whiteSpace = 'normal'; el.style.textOverflow = 'clip'; }
}
function relRect(el, screen) { const a = el.getBoundingClientRect(), s = screen.getBoundingClientRect(); return { x: a.left - s.left, y: a.top - s.top, w: a.width, h: a.height }; }

/* Counts (DS §8.2): a numeral in the tab's own type, a 2 px halo in the bar colour, no shape behind it. */
function cntSVG(n) {
  const t = n > 9 ? '9+' : String(n), w = t.length * 8 + 4;
  return `<svg class="cnt" width="${w}" height="14" viewBox="0 0 ${w} 14" aria-hidden="true"><text x="2" y="11.5">${t}</text></svg>`;
}

/* Fixed digit cells: every digit sits in a cell the width of the widest digit at that style. */
const digits = (str) => String(str).split('').map(ch => /\d/.test(ch) ? `<span class="dg"><span>${ch}</span></span>` : `<span>${ch}</span>`).join('');
const cellCache = new Map();
function measureCells(scope) {
  $$('.cells', scope).forEach(el => {
    const cs = getComputedStyle(el), key = `${cs.fontSize}|${cs.fontStretch}|${cs.fontWeight}`;
    if (!cellCache.has(key)) {
      const m = document.createElement('span'); m.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;left:0;top:0'; el.appendChild(m);
      let mx = 0; for (let d = 0; d <= 9; d++) { m.textContent = String(d); mx = Math.max(mx, m.getBoundingClientRect().width); }
      m.remove(); cellCache.set(key, (mx / parseFloat(cs.fontSize)).toFixed(3) + 'em');
    }
    el.style.setProperty('--dc', cellCache.get(key));
  });
}
/* Roll only the cells that changed: the old digit leaves upward, the new enters from below (snap). */
function setCells(el, str, opts = {}) {
  if (!el) return;
  const s = String(str), cells = $$('.dg', el), ds = s.replace(/\D/g, '');
  if (cells.length !== ds.length || el.textContent.replace(/\D/g, '').length !== cells.length || s.replace(/\d/g, '') !== el.textContent.replace(/\d/g, '')) {
    setHTML(el, digits(s)); measureCells(el.parentElement || el); return;
  }
  cells.forEach((c, i) => {
    const cur = c.firstElementChild, nv = ds[i];
    if (cur.textContent === nv) return;
    if (RM.on || opts.instant) { cur.textContent = nv; return; }
    const nx = document.createElement('span'); nx.className = 'nx'; nx.textContent = nv; c.appendChild(nx);
    anim(cur, [{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }], { ease: 'snap' });
    const a = anim(nx, [{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }], { ease: 'snap' });
    a.onfinish = () => { cur.textContent = nv; cur.getAnimations().forEach(x => x.cancel()); nx.remove(); };
  });
}
/* A word roll (coverage words): old line leaves upward, the new one enters from below. */
function rollWords(el, text) {
  if (!el) return;
  const a = $('.a', el), b = $('.b', el);
  if (!a || a.textContent === text) return;
  if (RM.on) { a.textContent = text; return; }
  b.textContent = text;
  anim(a, [{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }], { ease: 'snap' });
  const an = anim(b, [{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }], { ease: 'snap' });
  an.onfinish = () => { a.textContent = text; a.getAnimations().forEach(x => x.cancel()); b.getAnimations().forEach(x => x.cancel()); };
}

/* Stickers (C), slot-cornered: a role is a sticker with a white die-cut edge and a fixed tilt. */
const sticker = (r, s = 32, tilt) => `<span class="stk" style="--rf:var(--rf-${r});--s:${s}px;--tilt:${tilt ?? ROLES[r].tilt}deg" role="img" aria-label="${ROLES[r].name}">${icon(r, { size: 24 })}</span>`;
function kudoHTML([code, label, ev, tilt], pos) {
  const p = PAST[ev];
  return `<span class="kudo" style="--kb:${p.base};--ki:${p.ink};--kbd:${p.dBase};--kid:${p.dInk};--tilt:${tilt}deg;${pos}" data-kudo="${code}"><b>${label}</b><small>${p.name}</small></span>`;
}

/* Wristband (C): the ticket for an event you joined. The clasp is a slot; the holes are punched slots. */
function wristband(id, o = {}) {
  const e = EVENTS[id], words = Array.from({ length: 7 }, (_, i) => `<span style="transform:translateX(${-i * 37}px)">${(e.name + '\u2003').repeat(8)}</span>`).join('');
  const tag = o.tag || 'div';
  const team = e.myTeam
    ? `<span class="minis" aria-hidden="true">${MY_TEAM.slots.map(s => `<i class="${s.who ? 'f' : ''}"></i>`).join('')}</span><span class="band-tm">${e.myTeam}, 2 of 4 roles filled</span>`
    : `<span class="band-tm">In the pool, no team yet</span>`;
  const body = o.right != null
    ? `<span class="band-t"><span class="band-name">${e.name}</span><span class="band-meta">${o.meta}</span></span>${o.right}`
    : `<span class="band-t"><span class="band-name">${e.name}</span><span class="band-meta">${e.dShort}, ${e.city}, ${e.inDays}</span><span class="band-row">${team}</span></span>`;
  return `<${tag} class="band ev-scope ${o.right != null ? 'one' : ''} ${o.cls || ''}" style="${evVars(id)}${o.style ? ';' + o.style : ''}" ${o.attrs || ''}>
    <span class="band-print" aria-hidden="true">${words}</span>
    <span class="clasp" aria-hidden="true">${o.openClasp ? '<i class="open"></i><i class="seat" style="position:absolute"></i>' : '<i></i>'}</span>
    ${body}${o.holes === false ? '' : '<span class="holes" aria-hidden="true"><i></i><i></i><i></i></span>'}</${tag}>`;
}

/* Slots (A) */
function slotM(s, o = {}) {
  const rv = o.band ? '' : `style="${roleVars(s.role)}"`;
  if (s.who) return `<div class="slot filled" data-role="${s.role}" ${rv}>${av(s.who)}${o.compact ? '' : `<span class="slot-l">${PEOPLE[s.who].first}</span>`}<span class="ring"></span></div>`;
  if (s.pencil) return `<div class="slot pencil" data-role="${s.role}" ${rv}><span class="hatch"></span>${av(s.pencil)}<span class="slot-l plate">${PEOPLE[s.pencil].first}</span><span class="ring"></span></div>`;
  return `<div class="slot open" data-role="${s.role}" ${rv}><span class="hatch"></span>${icon(s.role, { size: 18 })}${o.compact ? '' : `<span class="slot-l">${ROLES[s.role].short}</span>`}<span class="ghost"></span><span class="ring"></span></div>`;
}
function slotS(s) {
  if (s.who) return `<div class="slot filled" style="${roleVars(s.role)}">${av(s.who)}</div>`;
  return `<div class="slot open" style="${roleVars(s.role)}">${icon(s.role, { size: 16 })}<span class="ring"></span></div>`;
}

/* Proof (B): the card's one-line strip and the full section. Rhythm when present, else the shipped timeline. */
function proofStripHTML(p) {
  const pr = p.proof; if (!pr) return '';
  if (pr.kind === 'rhythm') { const wk = weeksOf(pr.seed); return `<div class="pstrip">${rhythmSVG(pr.seed, p.role, { bar: 3, gap: 2, h: 18 })}<span class="pstrip-t"><b>${wk.active} active weeks</b><span>${icon('check', { size: 14 })}GitHub verified</span></span></div>`; }
  return `<div class="pstrip">${shippedSVG(pr.items, p.role, { w: 128, compact: true })}<span class="pstrip-t"><b>${pr.items.length} shipped this year</b><span>Self-reported</span></span></div>`;
}
function proofFullHTML(p) {
  const pr = p.proof; if (!pr) return '';
  const proj = p.project ? `<p class="t-meta" style="margin-top:10px;color:var(--ink-2)"><b style="color:var(--ink);font-weight:700">${p.project.title}.</b> ${p.project.line} ${p.project.award} ${p.project.where}.</p>` : '';
  if (pr.kind === 'rhythm') {
    const wk = weeksOf(pr.seed);
    return `<section class="cs proof"><div class="proof-h"><span>Build rhythm, last 26 weeks</span><b>${wk.active} active</b></div><div class="chart">${rhythmSVG(pr.seed, p.role, { bar: 7, gap: 4, h: 36, fluid: true })}</div><p class="src">${icon('repo', { size: 16 })}${pr.commits} commits, from GitHub. Ticks mark hackathon weekends.</p>${proj}</section>`;
  }
  return `<section class="cs proof"><div class="proof-h"><span>Shipped, last 12 months</span><b>${pr.items.length} things</b></div><div class="chart">${shippedSVG(pr.items, p.role, { w: 300, fluid: true })}</div><p class="src">${icon('link', { size: 16 })}${pr.src}. Self-reported.</p>${proj}</section>`;
}
function promptHTML(pr, i) {
  return `<section class="cs prompt" data-sec="p${i}"><p class="q">${pr.q}</p><p class="a">${pr.a}</p><button class="like" data-like="p${i}" aria-label="Interested, on this answer" aria-pressed="false">${icon('interested', { size: 20 })}</button></section>`;
}
/* The deck card: A's card + B's project-cover hero and proof strip; role-pattern hero when there is no project. */
function cardHTML(id, o = {}) {
  const p = PEOPLE[id], role = p.role;
  const hero = p.project ? coverSVG(p.project.id) : roleHeroSVG(role);
  const why = o.preview
    ? `<div class="why"><span class="why-h">Reasons appear here</span><span class="pv-sample">Each person sees their own, like “Fills your Frontend slot”.</span></div>`
    : `<ul class="why"><li class="why-h">Why ${p.first} is here</li>${(o.any ? p.anyReasons : p.reasons).map((r, i) => `<li class="${i === 0 ? 'key' : ''}">${icon(r[0], { size: 16 })}${r[1]}</li>`).join('')}</ul>`;
  return `<article class="card" data-id="${id}" style="${roleVars(role)}" aria-label="${p.name}, ${ROLES[role].name}" ${o.depth != null ? `data-depth="${o.depth}"` : ''}>
    <div class="card-scroll">
      <div class="card-cover"><div class="cover">${hero}</div>${p.project ? `<button class="like" data-like="proj" aria-label="Interested, on ${p.project.title}" aria-pressed="false">${icon('interested', { size: 20 })}</button>` : ''}</div>
      <div class="card-id">${av(id)}<div class="card-id-t"><h2 class="card-name" data-fit="wrap">${p.name}</h2></div></div>
      <p class="card-role">${icon(role, { size: 18 })}${ROLES[role].name}<span>${p.city}, ${p.exp}</span></p>
      ${proofStripHTML(p)}
      ${why}
      <ul class="skills">${p.skills.map(s => `<li>${s}</li>`).join('')}</ul>
      ${p.prompts[0] ? promptHTML(p.prompts[0], 0) : ''}
      ${proofFullHTML(p)}
      ${p.prompts[1] ? promptHTML(p.prompts[1], 1) : ''}
      <div class="links">${p.links.map(l => `<a href="#" data-act="link" data-url="${l}">${icon('link', { size: 18 })}${l}</a>`).join('')}</div>
      ${o.preview ? '<div style="height:16px"></div>' : `<div class="card-foot"><button data-act="report" data-id="${id}">${icon('flag', { size: 16 })}Report or block</button></div>`}
    </div>
    <span class="card-edge" aria-hidden="true"></span>
    <div class="stamp stamp-yes" aria-hidden="true">${icon('interested', { filled: true, size: 18 })}<span>Interested</span></div>
    <div class="stamp stamp-no" aria-hidden="true">${icon('pass', { size: 18 })}Pass</div>
  </article>`;
}
/* The profile pane on iPad and desktop: the full profile and every reason for the top card. */
function profileHTML(id, o = {}) {
  const p = PEOPLE[id], role = p.role;
  const head = o.pane
    ? `<div class="pane-id">${av(id)}<span><b>${p.name}</b><span><span style="color:var(--rct);font-weight:650">${ROLES[role].name}</span>, ${p.city}, ${p.overlap || p.exp}</span></span></div>`
    : `<div class="card-cover"><div class="cover">${p.project ? coverSVG(p.project.id) : roleHeroSVG(role)}</div></div>
    <div class="card-id">${av(id)}<div class="card-id-t"><h2 class="card-name" data-fit>${p.name}</h2></div></div>
    <p class="card-role">${icon(role, { size: 18 })}${ROLES[role].name}<span>${p.city}, ${p.exp}, ${p.overlap || ''}</span></p>
    ${proofStripHTML(p)}`;
  return `<div style="${roleVars(role)}" data-pane-id="${id}">
    ${head}
    <ul class="why"><li class="why-h">Why ${p.first} is here</li>${(o.any ? p.anyReasons : p.reasons).map((r, i) => `<li class="${i === 0 ? 'key' : ''}">${icon(r[0], { size: 16 })}${r[1]}</li>`).join('')}</ul>
    <ul class="skills">${p.skills.map(s => `<li>${s}</li>`).join('')}</ul>
    ${p.prompts.map((pr, i) => promptHTML(pr, i)).join('')}
    ${proofFullHTML(p)}
    <div class="links">${p.links.map(l => `<a href="#" data-act="link" data-url="${l}">${icon('link', { size: 18 })}${l}</a>`).join('')}</div>
  </div>`;
}

/* Event rail card: poster on top, body in the poster's own colours, one status line and one reason. */
function evCard(id, o = {}) {
  const e = EVENTS[id];
  return `<button class="evc ev-scope" style="${evVars(id)}" data-open="event:${id}" aria-label="${e.name}">
    ${poster(id, 320, 180)}
    <span class="evc-b"><b>${e.name}</b><span class="when">${e.dShort}, ${e.city}</span><span class="st ${e.soon ? 'em' : ''}">${e.status}</span>
    ${e.reason && !o.noReason ? `<span class="evc-why">${icon(e.reason[0], { size: 16 })}${e.reason[1]}</span>` : ''}</span></button>`;
}
function evRow(id, st) {
  const e = EVENTS[id], saved = st && st.saved[id];
  return `<div class="evrow"><button class="press" data-open="event:${id}" style="display:flex;gap:14px;align-items:center;flex:1;min-width:0;text-align:left">${poster(id, 56, 70)}<span class="evrow-m"><span class="k">${e.kind}</span><b>${e.name}</b><span class="t-meta">${e.days}, ${e.city}</span><span class="t-meta">${st && st.joined[id] ? (id === 'lisbon' ? e.status : 'You’re in the pool, no team yet') : e.status}</span></span></button>
    <button class="icon-btn save-g" data-act="rowsave" data-id="${id}" aria-pressed="${!!saved}" aria-label="${saved ? 'Saved' : 'Save'}">${icon('save', { filled: !!saved, size: 20 })}</button></div>`;
}
