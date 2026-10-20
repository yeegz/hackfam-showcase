/* Hackfam · final · drawn imagery (from direction A, with B's proof charts and C's kit objects).
   Posters lay themselves out for the frame they are given (portrait, landscape, thumb) so nothing is blindly cropped.
   Covers are drawn at 16:9 and only ever shown at 16:9. No generated pattern element is a solid dot (P0-22).
   All poster type is Mona Sans: one typeface in the product, including generated posters. */

let __uid = 0;
const uid = (p) => `${p}${++__uid}`;

function shade(hex, f) { // f < 0 darker, > 0 lighter
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const t = f < 0 ? 0 : 255, p = Math.abs(f);
  r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function rng(seed) { let s = seed * 9301 + 49297; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }

/* ---------- Avatars (illustrated, 64 grid) ---------- */
function avatarSVG(id, size = 48) {
  const p = PEOPLE[id]; const a = p.av;
  const skinD = shade(a.skin, -0.28), hc = a.hc;
  let back = '', front = '';
  switch (a.hair) {
    case 'long':
      back = `<path fill="${hc}" d="M19 31C17.6 17 24.6 13.2 32 13.2S46.6 17 45 31l1.4 16.6c-3.4 1.6-7 1-8.8-1V34H26.4v12.6c-1.8 2-5.4 2.6-8.8 1Z"/>`;
      front = `<path fill="${hc}" d="M21 29c-.8-9.8 4.4-13.6 11-13.6 6.8 0 11.8 3.8 11 13.6-1.4-5-4.8-7.4-9.4-7.6-3.2 2.4-8 4-12.6 7.6Z"/>`; break;
    case 'bob':
      back = `<path fill="${hc}" d="M19.6 32C18.2 18 25 14 32 14s13.8 4 12.4 18l.2 7c-2.6 1.6-5.6 1.2-7-.4H26.4c-1.4 1.6-4.4 2-7 .4Z"/>`;
      front = `<path fill="${hc}" d="M20.8 28c-.6-9.4 4.4-12.8 11.2-12.8S44.4 18.6 43.2 28c-.6-2.4-1.4-3.6-2.4-4H23.2c-1 .4-1.8 1.6-2.4 4Z"/>`; break;
    case 'braid':
      back = `<path fill="${hc}" d="M20 31c-1.2-13 5-17 12-17s13.2 4 12 17l-.6 6H20.6Z"/>`;
      front = `<path fill="${hc}" d="M21.2 28.4c-.6-9.2 4.4-12.8 10.8-12.8 6.6 0 11.4 3.6 10.8 12.8-1.6-4.4-4.6-6.6-8.4-6.8-1.4 1.6-2.6 2.2-2.4 2.2-1.6-1.2-6.4-.8-10.8 4.6Z"/>`
        + [0, 1, 2, 3].map(i => `<ellipse fill="${hc}" cx="${43.2 + i * 0.5}" cy="${38 + i * 5.2}" rx="3" ry="3.2"/>`).join(''); break;
    case 'curly':
      back = [[21, 24, 6], [25.6, 17.6, 6.4], [32.6, 15.2, 6.8], [39.6, 17.6, 6.4], [44, 24.4, 5.8], [19.6, 31.4, 5], [44.6, 31.6, 5]]
        .map(([x, y, r]) => `<circle fill="${hc}" cx="${x}" cy="${y}" r="${r}"/>`).join('');
      front = [[26.4, 21.4, 3.6], [31.6, 20, 3.9], [37, 21.2, 3.6]].map(([x, y, r]) => `<circle fill="${hc}" cx="${x}" cy="${y}" r="${r}"/>`).join(''); break;
    case 'puff':
      back = `<circle fill="${hc}" cx="32" cy="12.6" r="9"/>`;
      front = `<path fill="${hc}" d="M21.4 27.6C21 19.6 25.8 16 32 16s11 3.6 10.6 11.6c-2.2-4.4-5.8-6-10.6-6s-8.4 1.6-10.6 6Z"/>`; break;
    case 'buzz':
      front = `<path fill="${hc}" opacity=".92" d="M21.4 27c0-7.4 4.6-10.6 10.6-10.6S42.6 19.6 42.6 27c-2.2-5-6-6.4-10.6-6.4S23.6 22 21.4 27Z"/>`; break;
    case 'fringe':
      front = `<path fill="${hc}" d="M20.8 29c-.8-10.4 4.4-14 11.2-14S44 18.6 43.2 29H42c-.4-3.6-1.6-5.4-3.2-6.2v2.6c-4-.6-9-.6-13.6.2v-2.8c-1.6 1-2.8 2.8-3.2 6.2Z"/>`; break;
    case 'wavy':
      front = `<path fill="${hc}" d="M21 28.5C19.8 18.5 25 14.8 32.2 14.8s12.4 4.2 10.8 13.7c-1-3.9-2.4-5.9-4.6-6.5-1.8 1.6-4.4 1.4-6-.2-1.8 1.8-5 2-7 .8-2.2 1-3.6 3-4.4 5.9Z"/>`; break;
    case 'short':
      front = `<path fill="${hc}" d="M21.2 28c-.6-9 4.3-12.4 10.8-12.4 6.8 0 11.6 3.8 10.8 12.4-1.2-4.4-4.2-6.8-10.2-6.6-5.6.2-9.6 1.8-11.4 6.6Z"/>`; break;
  }
  const hijab = a.hair === 'hijab';
  const shirt = `<path fill="${a.shirt}" d="M8 64c1-12 11-18 24-18s23 6 24 18Z"/>`;
  const neck = hijab ? '' : `<path fill="${skinD}" d="M27.4 35h9.2v10.4c0 2.4-2 4.4-4.6 4.4s-4.6-2-4.6-4.4Z"/>`;
  const wrap = hijab ? `<path fill="${hc}" d="M17.6 33C16.6 18 23.6 12.4 32 12.4S47.4 18 46.4 33c-.4 7-3.4 11.6-6.4 14.6l8 4.4c-4 4-10 5-16 5s-12-1-16-5l8-4.4c-3-3-6-7.6-6.4-14.6Z"/><ellipse cx="32" cy="30" rx="12" ry="13.8" fill="${shade(hc, 0.14)}"/>` : '';
  const ears = hijab ? '' : `<ellipse fill="${a.skin}" cx="21.6" cy="30.4" rx="2.1" ry="3"/><ellipse fill="${a.skin}" cx="42.4" cy="30.4" rx="2.1" ry="3"/>`;
  const head = `<ellipse fill="${a.skin}" cx="32" cy="29.4" rx="10.6" ry="12.6"/>`;
  let beard = '';
  if (a.beard) beard = `<path fill="${hc}" opacity="${a.beard === 'stubble' ? 0.32 : 1}" d="M21.6 30.4c.2 8.2 4.2 12.6 10.4 12.6s10.2-4.4 10.4-12.6c-1.2 4-3.2 6.2-5.8 6.8-1.4-1.2-2.8-1.6-4.6-1.6s-3.2.4-4.6 1.6c-2.6-.6-4.6-2.8-5.8-6.8Z"/>`;
  const mouthCol = a.beard === 'full' ? shade(a.skin, 0.25) : shade(a.skin, -0.42);
  const face = `<path stroke="${hc}" stroke-width="1.3" stroke-linecap="round" fill="none" d="M25.8 25.9q2.2-1.1 4.3-.1M33.9 25.8q2.1-1 4.3.1"/>`
    + `<circle fill="#221A16" cx="28" cy="29.6" r="1.35"/><circle fill="#221A16" cx="36" cy="29.6" r="1.35"/>`
    + `<path stroke="${skinD}" stroke-width="1.2" stroke-linecap="round" fill="none" d="M32.2 31.2q-.9 2.6.6 3.2"/>`
    + `<path stroke="${mouthCol}" stroke-width="1.4" stroke-linecap="round" fill="none" d="M29.3 37q2.7 2 5.4 0"/>`;
  const glasses = a.glasses ? `<g fill="#ffffff" fill-opacity=".14" stroke="#1C1D20" stroke-width="1.25"><rect x="24.2" y="26.8" width="6.6" height="5.6" rx="2.2"/><rect x="33.2" y="26.8" width="6.6" height="5.6" rx="2.2"/></g><path stroke="#1C1D20" stroke-width="1.2" fill="none" d="M30.8 29q1.2-.8 2.4 0"/>` : '';
  return `<svg class="av-svg" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" fill="${a.bg}"/>${back}${hijab ? wrap : ''}${shirt}${neck}${ears}${head}${beard}${face}${front}${glasses}</svg>`;
}

/* ---------- Event posters ---------- */
function posterSVG(id, w, h) {
  const fn = POSTERS[id];
  const inner = fn(w, h);
  return `<svg class="poster-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${inner}</svg>`;
}
const T = (x, y, s, txt, o = {}) => `<text x="${x}" y="${y}" font-size="${s}" font-weight="${o.w || 800}" style="font-stretch:${o.st || 125}%;letter-spacing:${o.ls || -0.02}em${o.ff ? ';font-family:' + o.ff : ''}${o.it ? ';font-style:italic' : ''}" fill="${o.fill}" ${o.anchor ? `text-anchor="${o.anchor}"` : ''}>${txt}</text>`;

const POSTERS = {
  lisbon(w, h) {
    const E = EVENTS.lisbon.c, ink = E.ink, s = Math.min(w, h), land = w / h > 1.25, thumb = s < 120;
    const pid = uid('az');
    let ax, aw, ay, ah;
    if (thumb) { aw = w * 0.62; ax = w * 0.19; ay = h * 0.14; ah = h * 0.86; }
    else if (land) { aw = Math.min(w * 0.3, h * 0.78); ax = w - aw - w * 0.06; ay = h * 0.1; ah = h * 0.9; }
    else { aw = w * 0.42; ax = w * 0.5; ay = h * 0.07; ah = h * 0.52; }
    const t = aw / 3;
    const tile = `<pattern id="${pid}" width="${t}" height="${t}" patternUnits="userSpaceOnUse" x="${ax}" y="${ay}">
      <rect width="${t}" height="${t}" fill="#F6F3EA"/>
      <path fill="${ink}" d="M0 0h${t * .3}a${t * .3} ${t * .3} 0 0 1-${t * .3} ${t * .3}Z M${t} 0v${t * .3}a${t * .3} ${t * .3} 0 0 1-${t * .3}-${t * .3}Z M${t} ${t}h-${t * .3}a${t * .3} ${t * .3} 0 0 1 ${t * .3}-${t * .3}Z M0 ${t}v-${t * .3}a${t * .3} ${t * .3} 0 0 1 ${t * .3} ${t * .3}Z"/>
      <path fill="${ink}" d="M${t / 2} ${t * .2}L${t * .8} ${t / 2}L${t / 2} ${t * .8}L${t * .2} ${t / 2}Z"/>
      <path d="M${t / 2} ${t * .4}L${t * .6} ${t / 2}L${t / 2} ${t * .6}L${t * .4} ${t / 2}Z" fill="#F2C43D"/>
      <path stroke="${ink}" stroke-width="${Math.max(1, t * .025)}" d="M${t / 2} 0v${t * .12}M${t / 2} ${t}v-${t * .12}M0 ${t / 2}h${t * .12}M${t} ${t / 2}h-${t * .12}"/></pattern>`;
    const r = aw / 2;
    const arch = `M${ax} ${ay + ah}V${ay + r}A${r} ${r} 0 0 1 ${ax + aw} ${ay + r}V${ay + ah}Z`;
    let out = `<defs>${tile}</defs><rect width="${w}" height="${h}" fill="${E.base}"/>
      <path d="${arch}" fill="url(#${pid})"/><path d="${arch}" fill="none" stroke="${ink}" stroke-width="${Math.max(2, s * .014)}"/>`;
    if (thumb) return out + `<rect x="0" y="${h * .66}" width="${w}" height="${h * .34}" fill="${E.base}"/>` + T(w * .12, h * .9, s * .26, '7–8', { fill: ink, st: 112, w: 850 });
    const pad = s * 0.08;
    if (land) {
      const fs = Math.min(h * 0.19, (ax - pad * 2) / 5.4);
      const by = h - pad;
      out += T(pad, by - fs * 2.04, fs, 'Lisboa', { fill: ink }) + T(pad, by - fs * 1.02, fs, 'Build', { fill: ink }) + T(pad, by, fs, 'Weekend', { fill: ink });
      out += T(pad, pad + fs * 0.42, fs * 0.42, '7–8 Nov · LX Factory', { fill: ink, st: 100, w: 650, ls: 0 });
    } else {
      const fs = Math.min(w * 0.135, h * 0.11);
      const by = h - pad;
      out += T(pad, by - fs * 2.04, fs, 'Lisboa', { fill: ink }) + T(pad, by - fs * 1.02, fs, 'Build', { fill: ink }) + T(pad, by, fs, 'Weekend', { fill: ink });
      out += T(pad, pad + fs * 0.62, fs * 0.62, '7–8', { fill: ink, st: 110, w: 850 }) + T(pad, pad + fs * 1.24, fs * 0.36, 'November', { fill: ink, st: 100, w: 650, ls: 0 });
      out += T(pad, pad + fs * 1.72, fs * 0.3, 'LX Factory', { fill: ink, st: 100, w: 560, ls: 0 });
    }
    return out;
  },
  lagos(w, h) {
    const E = EVENTS.lagos.c, s = Math.min(w, h), land = w / h > 1.25, thumb = s < 120;
    const cx = land ? w * 0.76 : w * 0.7, cy = land ? h * 0.42 : h * 0.3, R = s * (land ? 0.36 : 0.3);
    let out = `<rect width="${w}" height="${h}" fill="${E.base}"/>`;
    const r = rng(4);
    const step = s * 0.07;
    for (let y = step; y < h * (land ? 1 : 0.62); y += step) for (let x = step; x < w; x += step) {
      if (Math.hypot(x - cx, y - cy) < R * 1.12) continue;
      const big = r() > .82, lw = s * (big ? .05 : .03), lh = s * .012;
      out += `<rect x="${x - lw / 2}" y="${y - lh / 2}" width="${lw}" height="${lh}" rx="${lh / 2}" fill="#fff" opacity=".45" transform="rotate(${(Math.round(x + y) % 2) ? 45 : -45} ${x} ${y})"/>`;
    }
    out += `<circle cx="${cx}" cy="${cy}" r="${R * 0.62}" fill="#FF8B5E"/>`;
    for (let i = 0; i < 5; i++) out += `<circle cx="${cx}" cy="${cy}" r="${R * (0.72 + i * 0.075)}" fill="none" stroke="#fff" stroke-width="${s * 0.014}" ${i % 2 ? 'stroke-dasharray="' + s * .03 + ' ' + s * .02 + '"' : ''}/>`;
    out += `<path d="M${cx - R * .62} ${cy} h${R * 1.24}" stroke="${E.base}" stroke-width="${s * .03}"/>`;
    if (thumb) return out + T(w * .1, h * .9, s * .24, '14', { fill: '#fff', st: 80, w: 900 });
    const pad = s * 0.08;
    const fs = land ? Math.min(h * 0.24, w * 0.11) : Math.min(w * 0.19, h * 0.15);
    out += T(pad, h - pad - fs * 0.95, fs, 'Yaba', { fill: '#fff', st: 75, w: 900, ls: -0.01 });
    out += T(pad, h - pad, fs, 'Civic Hack', { fill: '#fff', st: 75, w: 900, ls: -0.01 });
    out += T(pad, pad + fs * 0.32, fs * 0.3, '14–15 Nov · Lagos', { fill: '#FFD2BF', st: 100, w: 650, ls: 0 });
    return out;
  },
  seoul(w, h) {
    const E = EVENTS.seoul.c, ink = E.ink, s = Math.min(w, h), land = w / h > 1.25, thumb = s < 120;
    let out = `<rect width="${w}" height="${h}" fill="${E.base}"/>`;
    const cols = land ? 7 : 4, gw = land ? w * 0.52 : w * 0.84, cell = gw / cols, gx = land ? w - gw - s * .06 : w * 0.08, gy = s * 0.07;
    const pad0 = s * 0.08, fs0 = land ? 0 : Math.min(w * 0.15, h * 0.12), textTop = h - pad0 - fs0 * 2.6;
    const rows = land ? Math.floor((h - gy * 2) / cell) : Math.max(1, Math.min(3, Math.floor((textTop - gy) / cell)));
    const r = rng(9);
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
      const x = gx + j * cell, y = gy + i * cell, c = cell * 0.82, k = Math.floor(r() * 5);
      const col = (i + j) % 3 === 0 ? '#FFD3DA' : ink;
      if (k === 0) out += `<circle cx="${x + c / 2}" cy="${y + c / 2}" r="${c / 2}" fill="${col}"/>`;
      else if (k === 1) out += `<rect x="${x}" y="${y}" width="${c}" height="${c}" rx="${c * .18}" fill="${col}"/>`;
      else if (k === 2) out += `<path d="M${x} ${y + c}V${y + c / 2}a${c / 2} ${c / 2} 0 0 1 ${c} 0V${y + c}Z" fill="${col}"/>`;
      else if (k === 3) out += `<path d="M${x + c / 2} ${y}L${x + c} ${y + c}H${x}Z" fill="${col}"/>`;
      else out += `<rect x="${x + c * .1}" y="${y + c * .1}" width="${c * .8}" height="${c * .8}" rx="${c * .4}" fill="none" stroke="${col}" stroke-width="${c * .14}"/>`;
    }
    if (thumb) return out + `<rect y="${h * .66}" width="${w}" height="${h * .34}" fill="${E.base}"/>` + T(w * .1, h * .92, s * .24, '21', { fill: ink, st: 100, w: 900 });
    const pad = s * 0.08;
    const fs = land ? Math.min(h * 0.2, (w - gw - pad * 3) / 4.6) : Math.min(w * 0.15, h * 0.12);
    out += T(pad, h - pad - fs * 1.0, fs, 'Seoul', { fill: ink, st: 100, w: 880 });
    out += T(pad, h - pad, fs, 'Night Build', { fill: ink, st: 100, w: 880 });
    out += `<text x="${pad}" y="${h - pad - fs * 2.1}" font-size="${fs * 0.36}" font-weight="700" fill="${ink}" style="font-family:'Apple SD Gothic Neo','Noto Sans KR',sans-serif">서울 나이트 빌드${land ? '' : ' · 21–22 Nov'}</text>`;
    if (land) out += T(pad, pad + fs * .42, fs * .4, '21–22 Nov · Seongsu', { fill: ink, st: 100, w: 650, ls: 0 });
    return out;
  },
  toronto(w, h) {
    const E = EVENTS.toronto.c, ink = E.ink, s = Math.min(w, h), land = w / h > 1.25, thumb = s < 120;
    let out = `<rect width="${w}" height="${h}" fill="${E.base}"/>`;
    const top = land ? h * 0.12 : h * 0.1, bot = land ? h * 0.9 : h * 0.58, x0 = land ? w * 0.56 : 0;
    const n = thumb ? 6 : 9;
    for (let i = 0; i < n; i++) {
      const y = top + (bot - top) * i / (n - 1), A = s * 0.025 * (1 + (i % 3) * .4), L = s * (0.28 + (i % 2) * .08);
      let d = `M${x0 - 10} ${y}`;
      for (let x = x0 - 10; x <= w + 10; x += 6) d += ` L${x.toFixed(1)} ${(y + Math.sin((x + i * 23) / L * Math.PI * 2) * A).toFixed(1)}`;
      out += `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${Math.max(1.2, s * 0.011)}" opacity="${0.35 + i / n * 0.65}"/>`;
    }
    out += `<circle cx="${land ? w * .3 : w * .76}" cy="${land ? h * .3 : h * .2}" r="${s * .09}" fill="#F7F3E4"/>`;
    if (thumb) return out + `<rect y="${h * .62}" width="${w}" height="${h * .38}" fill="${E.base}"/>` + T(w * .1, h * .92, s * .26, '28', { fill: ink, st: 100, w: 850 });
    const pad = s * 0.08;
    const fs = land ? Math.min(h * 0.27, w * 0.1) : Math.min(w * 0.21, h * 0.16);
    out += T(pad, h - pad - fs * 0.62, fs * 0.92, 'Lakeshore', { fill: ink, w: 300, st: 75, ls: -0.01 });
    out += T(pad, h - pad, fs * 0.42, land ? 'Climate Hack' : 'Climate Hack · 28–29 Nov', { fill: ink, st: 110, w: 750, ls: -0.01 });
    if (land) out += T(pad, pad + fs * .3, fs * .3, '28–29 Nov · Toronto', { fill: ink, st: 100, w: 650, ls: 0 });
    return out;
  },
  kl(w, h) {
    const E = EVENTS.kl.c, ink = E.ink, s = Math.min(w, h), land = w / h > 1.25, thumb = s < 120;
    let out = `<rect width="${w}" height="${h}" fill="${E.base}"/>`;
    const d = s * (thumb ? 0.22 : 0.15), top = land ? 0 : 0, bot = land ? h : h * 0.6, x0 = land ? w * 0.5 : 0;
    let lines = '';
    for (let k = -Math.ceil((bot - top) / d) - 1; x0 + k * d < w + d; k++) {
      const b = k * d;
      lines += `<path d="M${x0 + b} ${top} L${x0 + b + (bot - top)} ${bot}" /><path d="M${x0 + b} ${bot} L${x0 + b + (bot - top)} ${top}" />`;
    }
    const cp = uid('kl');
    out += `<defs><clipPath id="${cp}"><rect x="${x0}" y="${top}" width="${w - x0}" height="${bot - top}"/></clipPath></defs>`;
    out += `<g clip-path="url(#${cp})"><g stroke="${ink}" stroke-width="${Math.max(1.2, s * .012)}" fill="none">${lines}</g>`;
    for (let i = 0; top + i * d <= bot + d; i++) for (let j = 0; x0 + j * d <= w + d; j++) {
      const x = x0 + j * d, y = top + i * d;
      const q = d * 0.18;
      out += `<path d="M${x} ${y - q}L${x + q} ${y}L${x} ${y + q}L${x - q} ${y}Z" fill="${(i + j) % 2 ? '#FFD27A' : ink}"/>`;
    }
    out += `</g>`;
    if (thumb) return out + `<rect y="${h * .62}" width="${w}" height="${h * .38}" fill="${E.base}"/>` + T(w * .1, h * .92, s * .26, '5–6', { fill: ink, st: 110, w: 850 });
    const pad = s * 0.08;
    const fs = land ? Math.min(h * 0.18, (x0 - pad * 2) / 4.2) : Math.min(w * 0.13, h * 0.1);
    out += T(pad, h - pad - fs * 2.04, fs, 'KL', { fill: ink }) + T(pad, h - pad - fs * 1.02, fs, 'Fintech', { fill: ink }) + T(pad, h - pad, fs, 'Sprint', { fill: ink });
    if (land) out += T(pad, pad + fs * .4, fs * .4, '5–6 Dec · Kuala Lumpur', { fill: ink, st: 100, w: 650, ls: 0 });
    return out;
  },
  osw(w, h) {
    const E = EVENTS.osw.c, ink = E.ink, s = Math.min(w, h), land = w / h > 1.25, thumb = s < 120;
    let out = `<rect width="${w}" height="${h}" fill="${E.base}"/>`;
    const cx = thumb ? w / 2 : land ? w * 0.74 : w * 0.62, cy = thumb ? h * .42 : land ? h * 0.5 : h * 0.34, R = s * (thumb ? .36 : land ? .4 : .32);
    const c = s * (thumb ? .07 : .045), g = c * 0.28, r = rng(21);
    for (let y = cy - R; y < cy + R; y += c + g) for (let x = cx - R; x < cx + R; x += c + g) {
      const dd = Math.hypot(x + c / 2 - cx, y + c / 2 - cy);
      if (dd > R) continue;
      const lat = Math.abs(Math.sin((x - cx) / R * 2.4)) * 0.5 + r() * 0.5;
      const op = lat > .8 ? 1 : lat > .6 ? .62 : lat > .4 ? .32 : .12;
      out += `<rect x="${x}" y="${y}" width="${c}" height="${c}" rx="${c * .2}" fill="${ink}" opacity="${op}"/>`;
    }
    if (thumb) return out;
    const pad = s * 0.08;
    const fs = land ? Math.min(h * 0.17, (cx - R - pad * 2) / 5.2) : Math.min(w * 0.12, h * 0.1);
    out += T(pad, h - pad - fs * 1.02, fs, 'Open Source', { fill: ink, st: 112, w: 820 });
    out += T(pad, h - pad, fs, 'Weekend', { fill: ink, st: 112, w: 820 });
    out += T(pad, pad + fs * .42, fs * .38, 'Online · 48 h · 12–13 Dec', { fill: ink, st: 100, w: 600, ls: 0 });
    return out;
  },
};

/* ---------- Project covers (16:9) ---------- */
function coverSVG(id) {
  const fn = COVERS[id];
  return `<svg class="cover-svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${fn()}</svg>`;
}
const t9 = (x, y, s, txt, fill, w = 650, st = 100, anchor) => `<text x="${x}" y="${y}" font-size="${s}" font-weight="${w}" fill="${fill}" style="font-stretch:${st}%" ${anchor ? `text-anchor="${anchor}"` : ''}>${txt}</text>`;
const COVERS = {
  paragem() {
    const rows = [['205', '#F7C948', 'Campanhã', '2 min'], ['300', '#E86F5A', 'Hospital S. João', '6 min'], ['501', '#6FC3D3', 'Matosinhos Mar', '11 min']];
    return `<rect width="320" height="180" fill="#0E3B43"/><path d="M0 150h320" stroke="#185158" stroke-width="2"/>
      <rect x="47" y="92" width="6" height="88" rx="2" fill="#8FB0AE"/>
      <rect x="21" y="52" width="58" height="44" rx="9" fill="#F7C948"/>
      <rect x="34" y="62" width="32" height="18" rx="4" fill="#0E3B43"/><rect x="38" y="65" width="10" height="7" rx="1.5" fill="#F7C948"/><rect x="52" y="65" width="10" height="7" rx="1.5" fill="#F7C948"/>
      <circle cx="40" cy="83" r="3" fill="#0E3B43"/><circle cx="60" cy="83" r="3" fill="#0E3B43"/>
      <rect x="96" y="28" width="206" height="120" rx="12" fill="#0A262C" stroke="#1E5A61" stroke-width="1.5"/>
      ${t9(112, 50, 10.5, 'Bolhão · towards the river', '#8FB0AE', 600)}
      ${rows.map((r, i) => `<rect x="112" y="${62 + i * 26}" width="34" height="18" rx="4" fill="${r[1]}"/>${t9(129, 75 + i * 26, 10.5, r[0], '#0A262C', 800, 100, 'middle')}${t9(154, 75 + i * 26, 11, r[2], '#E8F1F0', 600)}${t9(288, 75 + i * 26, 11, r[3], '#F7C948', 750, 100, 'end')}`).join('')}
`;
  },
  susu() {
    const cx = 150, cy = 96, R = 56, cols = ['#9E427B', '#2B2230', '#E9B44C', '#C7638F', '#2B2230', '#9E427B', '#E9B44C', '#2B2230'];
    let dots = '';
    for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + i * Math.PI / 4; dots += `<circle cx="${cx + Math.cos(a) * R}" cy="${cy + Math.sin(a) * R}" r="${i === 4 ? 14 : 11}" fill="${cols[i]}" ${i === 4 ? 'stroke="#FFF6EE" stroke-width="3"' : ''}/>`; }
    return `<rect width="320" height="180" fill="#F6D7C3"/>
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#9E427B" stroke-width="2" stroke-dasharray="4 5"/>
      ${dots}
      <ellipse cx="${cx}" cy="${cy + 14}" rx="20" ry="6" fill="#B98A2E"/><rect x="${cx - 20}" y="${cy - 2}" width="40" height="16" fill="#E9B44C"/><ellipse cx="${cx}" cy="${cy - 2}" rx="20" ry="6" fill="#F3CB6E"/>
      <ellipse cx="${cx}" cy="${cy - 8}" rx="20" ry="6" fill="#B98A2E"/><rect x="${cx - 20}" y="${cy - 20}" width="40" height="12" fill="#E9B44C"/><ellipse cx="${cx}" cy="${cy - 20}" rx="20" ry="6" fill="#F3CB6E"/>
      <rect x="226" y="20" width="80" height="58" rx="10" fill="#FFF6EE"/>${t9(236, 39, 9.5, 'Week 5 of 8', '#7A4A5E', 650)}${t9(236, 56, 12, 'Ama', '#2B2230', 800)}${t9(236, 70, 9.5, 'receives', '#7A4A5E', 600)}`;
  },
  seen() {
    return `<rect width="320" height="180" fill="#E9E6E0"/><path d="M0 160h320" stroke="#D6D1C8" stroke-width="2"/>
      <rect x="62" y="52" width="70" height="84" fill="#3A3226"/><rect x="68" y="58" width="58" height="72" fill="#D9C7A4"/><circle cx="97" cy="84" r="12" fill="#C2552F"/><path d="M68 116 l16-12 13 8 13-11 16 14v15H68Z" fill="#6E7C5A"/>
      <rect x="146" y="30" width="76" height="98" fill="#3A3226"/><rect x="152" y="36" width="64" height="86" fill="#F1ECE2"/>${[0, 1, 2, 3, 4].map(i => `<rect x="${157 + i * 11.5}" y="42" width="7" height="74" fill="${['#2C4A6B', '#C2552F', '#E9B44C', '#2C4A6B', '#7C8E6A'][i]}"/>`).join('')}
      <rect x="236" y="44" width="68" height="68" fill="#3A3226"/><rect x="242" y="50" width="56" height="56" fill="#2C4A6B"/><path d="M248 96 270 64 292 96Z" fill="#F1ECE2"/><circle cx="285" cy="62" r="6" fill="#E9B44C"/>
      <rect x="136" y="136" width="96" height="34" rx="8" fill="#FFFFFF" stroke="#7C50A8" stroke-width="2"/><rect x="145" y="146" width="58" height="5" rx="2.5" fill="#3B3A44"/><rect x="145" y="156" width="40" height="5" rx="2.5" fill="#9C98A6"/><circle cx="220" cy="153" r="6.5" fill="#7C50A8"/><path d="m217 153 2.2 2.2 4-4.2" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  },
  tide() {
    let c = '';
    for (let i = 0; i < 6; i++) c += `<ellipse cx="${110 + i * 4}" cy="${84 - i * 2}" rx="${100 - i * 15}" ry="${62 - i * 9}" fill="none" stroke="#2C5A7A" stroke-width="1.5" transform="rotate(-12 110 84)"/>`;
    return `<rect width="320" height="180" fill="#0F2A3F"/>${c}
      <path d="M-10 150 C60 128 90 150 150 120 S250 80 330 96" fill="none" stroke="#3E9CCB" stroke-width="16" stroke-linecap="round" opacity=".55"/>
      <path d="M-10 150 C60 128 90 150 150 120 S250 80 330 96" fill="none" stroke="#5CC2F2" stroke-width="6" stroke-linecap="round"/>
      ${[[150, 112], [196, 100], [238, 90], [118, 132], [270, 70]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i < 3 ? 9 : 6}" fill="#EEB154" opacity="${i < 3 ? .28 : .2}"/><circle cx="${x}" cy="${y}" r="3.6" fill="#EEB154"/>`).join('')}
      <rect x="216" y="18" width="88" height="44" rx="8" fill="#0A1E2D" stroke="#24506D"/>${t9(226, 36, 10, 'High risk', '#EEB154', 700)}${t9(226, 52, 11.5, '3 streets', '#E2EEF6', 700)}`;
  },
  turnos() {
    let g = '';
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    days.forEach((d, i) => g += t9(106 + i * 30, 52, 9.5, d, '#4E7351', 700, 100, 'middle'));
    const fill = { '0,1': 1, '0,4': 1, '1,0': 1, '1,2': 2, '1,5': 1, '2,1': 1, '2,3': 1, '2,6': 2, '3,0': 1, '3,4': 1 };
    for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) {
      const k = fill[`${r},${c}`];
      g += `<rect x="${92 + c * 30}" y="${60 + r * 27}" width="27" height="22" rx="5" fill="${k === 1 ? '#267D30' : k === 2 ? '#86D489' : '#FFFFFF'}" stroke="${k ? 'none' : '#CFE3D0'}"/>`;
    }
    g += `<path d="M158 82 C166 108 236 104 248 120" fill="none" stroke="#14451A" stroke-width="2.5" stroke-dasharray="5 4"/><path d="m240 118 8 2 1-8" fill="none" stroke="#14451A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    return `<rect width="320" height="180" fill="#E5F2E6"/>${g}`;
  },
  huerta() {
    let tr = '';
    const r = rng(3);
    for (let i = 0; i < 14; i++) { const y = 20 + i * 11, x = 10 + r() * 60; tr += `<path d="M0 ${y}H${x}l10 10H${x + 60 + r() * 40}" /><circle cx="${x + 70 + r() * 40}" cy="${y + 10}" r="3"/>`; }
    return `<rect width="320" height="180" fill="#2F3A1E"/><g stroke="#C3C55A" stroke-width="1.6" fill="none" opacity=".5">${tr}</g>
      <rect x="170" y="96" width="112" height="60" rx="6" fill="#3E4A26" stroke="#C3C55A" stroke-width="1.5"/><rect x="214" y="112" width="26" height="26" rx="3" fill="#1D2412"/>${[0, 1, 2, 3].map(i => `<path d="M${218 + i * 6} 108v4M${218 + i * 6} 138v4" stroke="#C3C55A" stroke-width="1.5"/>`).join('')}
      <path d="M226 96 C226 70 222 54 226 40" stroke="#9BD36A" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M226 62 C206 60 196 48 196 34 C214 34 226 44 226 62Z" fill="#9BD36A"/><path d="M226 52 C244 50 256 38 258 24 C238 24 226 36 226 52Z" fill="#B9E38A"/>
      ${t9(186, 150, 10, 'Moisture 41%', '#E7E7C3', 650)}`;
  },
};

/* Team cover for Late Line (any size). */
function lateLineSVG(w, h) {
  const E = EVENTS.lisbon.c;
  const stops = [0.08, 0.27, 0.46, 0.64, 0.83];
  let d = `M${-10} ${h * .9}`;
  d += ` C${w * .2} ${h * .9} ${w * .26} ${h * .64} ${w * .46} ${h * .67} S${w * .72} ${h * .92} ${w + 10} ${h * .76}`;
  let st = '';
  const pid = uid('ll');
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="${w}" height="${h}" fill="${E.dBase}"/>
    ${Array.from({ length: 12 }, (_, i) => `<path d="M${i * w / 11} 0 L${i * w / 11 - h * .4} ${h}" stroke="#1A3576" stroke-width="1"/>`).join('')}
    <path id="${pid}" d="${d}" fill="none" stroke="${E.base}" stroke-width="5" stroke-linecap="round"/>
    ${stops.map((t) => { const x = t * w; return ''; }).join('')}
    ${[[.12, .87], [.3, .7], [.5, .68], [.7, .86], [.9, .8]].map(([x, y], i) => `<circle cx="${x * w}" cy="${y * h}" r="${i === 2 ? 7 : 5}" fill="${i === 2 ? E.base : E.dBase}" stroke="${E.base}" stroke-width="3"/>`).join('')}
    <circle cx="${w * .64}" cy="${h * .5}" r="${h * .085}" fill="#F6F0DA"/><circle cx="${w * .64 + h * .04}" cy="${h * .48}" r="${h * .078}" fill="${E.dBase}"/>
    ${[[.08, .52], [.22, .46], [.4, .52], [.82, .5], [.94, .62], [.55, .56]].map(([x, y]) => `<circle cx="${x * w}" cy="${y * h}" r="1.3" fill="#F6F0DA" opacity=".7"/>`).join('')}
  </svg>`;
}


/* Small venue map: streets, water, the venue pin. Uses theme tokens. Lisbon gets its bridge. */
function mapSVG(w, h, o = {}) {
  let streets = '';
  const r = rng((o.label || 'x').length * 7);
  for (let i = 0; i < 9; i++) streets += `<path d="M${-20 + i * 46 + r() * 10} 0 L${20 + i * 40} ${h * .62}" />`;
  for (let i = 0; i < 4; i++) streets += `<path d="M0 ${12 + i * 16 + r() * 4} L${w} ${i * 12}" />`;
  const water = o.water ? `<path d="M0 ${h * .7} C${w * .3} ${h * .62} ${w * .6} ${h * .74} ${w} ${h * .64} V${h} H0Z" style="fill:var(--map-water)"/><text x="${w - 12}" y="${h - 10}" font-size="10.5" font-weight="600" text-anchor="end" style="fill:var(--map-label)">${o.water}</text>` : '';
  const bridge = o.bridge ? `<path d="M${w * .2} ${h * .18} L${w * .32} ${h}" stroke="#C8402E" stroke-width="4"/><path d="M${w * .2} ${h * .18} L${w * .32} ${h}" stroke="#E5654F" stroke-width="1.5" stroke-dasharray="3 5"/>` : '';
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="${w}" height="${h}" style="fill:var(--map-land)"/>
    <g style="stroke:var(--map-street)" stroke-width="2" fill="none">${streets}</g>
    ${water}${bridge}
    <g transform="translate(${w * .42 - 12} ${h * .28 - 26})"><path d="M12 30s-9-8.6-9-15.4a9 9 0 0 1 18 0C21 21.4 12 30 12 30Z" style="fill:var(--ink)"/><circle cx="12" cy="14.6" r="3.4" style="fill:var(--surface)"/></g>
    <text x="${w * .42 + 14}" y="${h * .34}" font-size="11.5" font-weight="700" style="fill:var(--ink)">${o.label || ''}</text>
  </svg>`;
}

/* ---------- Two more posters: a CTF and a game jam (the builder events beyond hackathons) ---------- */
POSTERS.ctf = function (w, h) {
  const E = EVENTS.ctf.c, ink = E.ink, p2 = '#2E8C78', s = Math.min(w, h), land = w / h > 1.25, thumb = s < 120;
  let out = `<rect width="${w}" height="${h}" fill="${E.base}"/>`;
  const x0 = land ? w * 0.56 : 0, y1 = land ? h : h * (thumb ? 0.6 : 0.56), cell = s * (thumb ? 0.22 : 0.16);
  const cp = uid('cf');
  out += `<defs><clipPath id="${cp}"><rect x="${x0}" y="0" width="${w - x0}" height="${y1}"/></clipPath></defs><g clip-path="url(#${cp})">`;
  let lat = '';
  for (let k = -12; k < 24; k++) { const b = x0 + k * cell; lat += `<path d="M${b} 0 L${b + y1} ${y1}"/><path d="M${b} ${y1} L${b + y1} 0"/>`; }
  out += `<g stroke="${p2}" stroke-width="${Math.max(1, s * .008)}" fill="none">${lat}</g>`;
  const r = rng(31);
  for (let i = 0; i * cell < y1 + cell; i++) for (let j = 0; x0 + j * cell < w + cell; j++) {
    if (r() > 0.42) continue;
    const x = x0 + j * cell, y = i * cell, f = cell * 0.46;
    out += `<path d="M${x} ${y - f * .9}V${y + f * .55}" stroke="${ink}" stroke-width="${Math.max(1.2, s * .012)}"/><path d="M${x} ${y - f * .9}h${f}l-${f * .3} ${f * .32} ${f * .3} ${f * .32}H${x}z" fill="${ink}"/>`;
  }
  out += `</g>`;
  if (thumb) return out + `<rect y="${h * .62}" width="${w}" height="${h * .38}" fill="${E.base}"/>` + T(w * .1, h * .92, s * .24, '14–15', { fill: ink, st: 90, w: 850 });
  const pad = s * 0.08;
  const fs = land ? Math.min(h * 0.24, (x0 - pad * 2) / 4.4) : Math.min(w * 0.2, h * 0.15);
  out += T(pad, h - pad - fs * 0.98, fs, 'Flagline', { fill: ink, st: 100, w: 850 });
  out += T(pad, h - pad, fs, 'CTF', { fill: ink, st: 125, w: 850 });
  out += T(pad, pad + fs * 0.34, fs * 0.3, '14–15 Nov · Online', { fill: ink, st: 100, w: 650, ls: 0 });
  return out;
};
POSTERS.jam = function (w, h) {
  const E = EVENTS.jam.c, ink = E.ink, p2 = '#C2477F', s = Math.min(w, h), land = w / h > 1.25, thumb = s < 120;
  let out = `<rect width="${w}" height="${h}" fill="${E.base}"/>`;
  const x0 = land ? w * 0.54 : 0, top = land ? h * 0.08 : h * 0.06, bot = land ? h * 0.92 : h * (thumb ? 0.6 : 0.56), u = s * (thumb ? 0.11 : 0.075);
  const cols = Math.ceil((w - x0) / u), r = rng(12);
  for (let c = 0; c < cols; c++) {
    const n = Math.max(1, Math.min(Math.floor((bot - top) / u), Math.floor(c * 0.75) + 1 + (r() > .7 ? 1 : 0)));
    for (let k = 0; k < n; k++) {
      const x = x0 + c * u, y = bot - (k + 1) * u, edge = k === n - 1;
      out += `<rect x="${x + u * .06}" y="${y + u * .06}" width="${u * .88}" height="${u * .88}" rx="${u * .14}" fill="${edge ? ink : p2}" ${edge ? '' : 'opacity=".55"'}/>`;
    }
  }
  const px = x0 + u * 1.5, py = bot - u * 3.4;
  out += `<rect x="${px}" y="${py}" width="${u * 1.1}" height="${u * 1.4}" rx="${u * .24}" fill="#FFFFFF"/><rect x="${px + u * .62}" y="${py + u * .38}" width="${u * .2}" height="${u * .32}" fill="${ink}"/>`;
  if (thumb) return out + `<rect y="${h * .64}" width="${w}" height="${h * .36}" fill="${E.base}"/>` + T(w * .1, h * .92, s * .24, '27–29', { fill: ink, st: 90, w: 850 });
  const pad = s * 0.08;
  const fs = land ? Math.min(h * 0.22, (x0 - pad * 2) / 4.6) : Math.min(w * 0.16, h * 0.12);
  out += T(pad, h - pad - fs * 1.0, fs, 'Retiro', { fill: ink, st: 125, w: 860 });
  out += T(pad, h - pad, fs, 'Game Jam', { fill: ink, st: 110, w: 860 });
  out += T(pad, pad + fs * 0.4, fs * 0.36, '27–29 Nov · Madrid', { fill: ink, st: 100, w: 650, ls: 0 });
  return out;
};

/* ---------- Role-pattern hero: when someone has no project cover (DS §6.3). Theme-aware through CSS vars. ---------- */
const ROLE_FAMILY = { fe: 'slots', be: 'steps', mob: 'bars', ml: 'lattice', data: 'bars2', des: 'waves', prod: 'rings', hw: 'tiles' };
function roleHeroSVG(role, seed = 3) {
  const W = 320, H = 180, u = H / 12, fam = ROLE_FAMILY[role], r = rng(seed + role.length * 5);
  const g = `var(--rh-${role})`, ink = `var(--rhi-${role})`;
  let p = '';
  if (fam === 'slots') for (let y = 0; y < 6; y++) for (let x = 0; x < 11; x++) {
    const open = (x + y * 2) % 3 === 2, X = x * 2.4 * u + u * .6 + (y % 2) * u * 1.2, Y = y * 2.2 * u + u * .5;
    p += `<rect x="${X}" y="${Y}" width="${u * 1.6}" height="${u * 1.7}" rx="${u * .35}" ${open ? `fill="none" style="stroke:${ink}" stroke-width="${u * .18}" stroke-dasharray="${u * .45} ${u * .3}"` : `style="fill:${ink}"`}/>`;
  }
  if (fam === 'tiles') for (let y = 0; y < 7; y++) for (let x = 0; x < 12; x++) {
    const X = x * 2 * u, Y = y * 2 * u, k = Math.floor(r() * 4), R = u * 2;
    const c = [`M${X} ${Y}h${R}a${R} ${R} 0 0 1-${R} ${R}z`, `M${X + R} ${Y}v${R}a${R} ${R} 0 0 1-${R}-${R}z`, `M${X + R} ${Y + R}h-${R}a${R} ${R} 0 0 1 ${R}-${R}z`, `M${X} ${Y + R}v-${R}a${R} ${R} 0 0 1 ${R} ${R}z`][k];
    p += `<path d="${c}" style="fill:${ink}" opacity="${(x + y) % 3 ? .9 : .45}"/>`;
  }
  if (fam === 'steps') for (let x = 0; x < 16; x++) { const n = 1 + ((x * 3) % 7); p += `<rect x="${x * 1.25 * u * 1.6}" y="${H - n * u * 1.4}" width="${u * 1.8}" height="${n * u * 1.4}" style="fill:${ink}" opacity="${.35 + (x % 3) * .25}"/>`; }
  if (fam === 'bars' || fam === 'bars2') for (let x = 0; x < 22; x++) { const hh = (0.25 + r() * 0.7) * H; p += `<rect x="${x * 1.2 * u + (fam === 'bars2' ? u * .6 : 0)}" y="${H - hh}" width="${u * .7}" height="${hh}" rx="${u * .2}" style="fill:${ink}" opacity="${.4 + r() * .6}"/>`; }
  if (fam === 'lattice') for (let k = -14; k < 28; k++) p += `<path d="M${k * 1.6 * u} 0 L${k * 1.6 * u + H} ${H}M${k * 1.6 * u} ${H} L${k * 1.6 * u + H} 0" style="stroke:${ink}" stroke-width="${u * .3}" opacity=".55"/>`;
  if (fam === 'waves') for (let i = 0; i < 9; i++) { let d = `M-10 ${i * 1.5 * u + u}`; for (let x = -10; x <= W + 10; x += 8) d += ` L${x} ${(i * 1.5 * u + u + Math.sin((x + i * 30) / 40) * u * .8).toFixed(1)}`; p += `<path d="${d}" fill="none" style="stroke:${ink}" stroke-width="${u * .35}" opacity="${.4 + (i % 3) * .2}"/>`; }
  if (fam === 'rings') for (let i = 1; i < 14; i++) p += `<path d="M${W} ${H - i * u * 1.3}A${i * u * 1.3} ${i * u * 1.3} 0 0 0 ${W - i * u * 1.3} ${H}" fill="none" style="stroke:${ink}" stroke-width="${u * .4}" opacity="${.35 + (i % 3) * .2}"/>`;
  return `<svg class="cover-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="${W}" height="${H}" style="fill:${g}"/>${p}</svg>`;
}

/* ---------- Proof (direction B, drawn to DS §7.11) ---------- */
/* Weekly activity, 26 weeks: levels 0–4 and the weeks with a hackathon weekend. Seeded fixture data. */
function mulberry(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function weeksOf(seed) {
  const r = mulberry(seed * 7 + 3), lv = [];
  let mood = 0.4 + r() * 0.3;
  for (let i = 0; i < 26; i++) {
    mood = Math.min(1, Math.max(0, mood + (r() - 0.5) * 0.45));
    const v = r() < 0.16 ? 0 : Math.max(0.08, mood * (0.55 + r() * 0.5));
    lv.push(v === 0 ? 0 : v < 0.3 ? 1 : v < 0.55 ? 2 : v < 0.8 ? 3 : 4);
  }
  const marks = [Math.floor(r() * 6) + 4, Math.floor(r() * 6) + 16];
  marks.forEach(m => (lv[m] = 4));
  return { lv, marks, active: lv.filter(x => x > 0).length };
}
const LV_H = [2, 6, 10, 14, 18];
/* Build rhythm. size 'xs' = the card's proof strip; 'm' = profile; returns a self-sized SVG. */
function rhythmSVG(seed, role, o = {}) {
  const wk = weeksOf(seed), bw = o.bar || 4, gap = o.gap ?? 2, k = (o.h || 18) / 18, W = 26 * (bw + gap) - gap, H = 18 * k + (o.ticks === false ? 0 : 5);
  let s = `<svg class="rhythm" viewBox="0 0 ${W} ${H}" ${o.fluid ? '' : `width="${W}" height="${H}"`} aria-hidden="true">`;
  wk.lv.forEach((l, i) => {
    const x = i * (bw + gap), bh = LV_H[l] * k;
    s += `<rect x="${x}" y="${18 * k - bh}" width="${bw}" height="${bh}" rx="${Math.min(1, bw / 4)}" style="fill:${l ? `var(--rt-${role})` : 'var(--line-strong)'}"/>`;
    if (o.ticks !== false && wk.marks.includes(i)) s += `<rect x="${x - .5}" y="${18 * k + 3}" width="${bw + 1}" height="2" style="fill:var(--ink)"/>`;
  });
  return s + '</svg>';
}
/* Shipped, last 12 months: slot-shaped marks on a month axis, titles alternating above. */
const MONTHS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
function shippedSVG(items, role, o = {}) {
  const W = o.w || 300, compact = o.compact, H = compact ? 18 : 62, ax = compact ? 13 : 46, step = (W - 8) / 11;
  let s = `<svg class="shipline" viewBox="0 0 ${W} ${H}" ${o.fluid ? '' : `width="${W}" height="${H}"`} aria-hidden="true">`;
  s += `<rect x="0" y="${ax}" width="${W}" height="1" style="fill:var(--control)"/>`;
  for (let i = 0; i < 12; i++) s += `<rect x="${4 + i * step - .5}" y="${ax - 2}" width="1" height="5" style="fill:var(--control)"/>`;
  if (!compact) [0, 3, 6, 9].forEach(i => s += `<text x="${4 + i * step}" y="${H - 1}" font-size="11" font-weight="580" style="fill:var(--ink-3)" text-anchor="${i ? 'middle' : 'start'}">${MONTHS[i]}</text>`);
  items.forEach((it, j) => {
    const x = 4 + it.m * step;
    s += `<rect x="${x - 2}" y="${ax - (compact ? 10 : 12) + 1}" width="4" height="${compact ? 10 : 12}" rx="2" style="fill:var(--rt-${role})"/>`;
    if (!compact) s += `<text x="${x}" y="${j % 2 ? 26 : 13}" font-size="11.5" font-weight="620" style="fill:var(--ink)" text-anchor="${it.m > 9 ? 'end' : it.m < 1 ? 'start' : 'middle'}">${it.t}</text>`;
  });
  return s + '</svg>';
}
