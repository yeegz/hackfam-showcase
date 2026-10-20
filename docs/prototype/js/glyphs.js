/* Hackfam glyphs: one custom set, from direction B's flat-cut grammar.
   24 grid, 1.75 stroke, butt caps and mitre joins (cut terminals), closed shapes at the slot corner (r 1.5–2),
   so tabs, roles and the slot strip share one shape. `f` is the filled form for the active tab or a committed state.
   Stroke never thins below ~1.45 px on screen: 24 → 1.75, 20 → 1.9, 18 → 2.0, 16 → 2.15, 14 → 2.3 (viewBox units). */
const SLOT_R = 1.5;
const G = {
  /* ---- tabs (5) ---- */
  events: {
    o: '<path d="M4.5 6.5h15A1.5 1.5 0 0 1 21 8v2.1a2 2 0 0 0 0 3.8V16a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16v-2.1a2 2 0 0 0 0-3.8V8a1.5 1.5 0 0 1 1.5-1.5z"/><path d="M9.5 7.6v8.8" stroke-dasharray="1.6 1.9"/>',
    f: '<path fill="currentColor" d="M4.5 6.5h15A1.5 1.5 0 0 1 21 8v2.1a2 2 0 0 0 0 3.8V16a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16v-2.1a2 2 0 0 0 0-3.8V8a1.5 1.5 0 0 1 1.5-1.5z"/><path stroke="var(--nav-bg)" d="M9.5 7.6v8.8" stroke-dasharray="1.6 1.9"/>',
  },
  discover: {
    o: '<path d="M8.5 3.5H18A1.5 1.5 0 0 1 19.5 5v12"/><rect x="4.5" y="6.5" width="11.5" height="14" rx="1.5"/>',
    f: '<path d="M8.5 3.5H18A1.5 1.5 0 0 1 19.5 5v12"/><rect fill="currentColor" x="4.5" y="6.5" width="11.5" height="14" rx="1.5"/>',
  },
  teams: {
    o: '<rect x="2.75" y="5" width="5.2" height="14" rx="1.5"/><rect x="9.4" y="5" width="5.2" height="14" rx="1.5"/><rect x="16.05" y="5" width="5.2" height="14" rx="1.5" stroke-dasharray="2.3 1.7"/>',
    f: '<rect fill="currentColor" x="2.75" y="5" width="5.2" height="14" rx="1.5"/><rect fill="currentColor" x="9.4" y="5" width="5.2" height="14" rx="1.5"/><rect x="16.05" y="5" width="5.2" height="14" rx="1.5" stroke-dasharray="2.3 1.7"/>',
  },
  chats: {
    o: '<path d="M5 4.5h14A1.5 1.5 0 0 1 20.5 6v8.5A1.5 1.5 0 0 1 19 16h-8l-4.5 4v-4H5a1.5 1.5 0 0 1-1.5-1.5V6A1.5 1.5 0 0 1 5 4.5z"/><path d="M7.5 8.75h9M7.5 11.75h5.5"/>',
    f: '<path fill="currentColor" d="M5 4.5h14A1.5 1.5 0 0 1 20.5 6v8.5A1.5 1.5 0 0 1 19 16h-8l-4.5 4v-4H5a1.5 1.5 0 0 1-1.5-1.5V6A1.5 1.5 0 0 1 5 4.5z"/><path stroke="var(--nav-bg)" d="M7.5 8.75h9M7.5 11.75h5.5"/>',
  },
  you: {
    o: '<circle cx="12" cy="8.25" r="3.75"/><path d="M4.75 20.5c.7-4 3.5-6.25 7.25-6.25s6.55 2.25 7.25 6.25"/>',
    f: '<circle fill="currentColor" cx="12" cy="8.25" r="3.75"/><path fill="currentColor" d="M4.75 20.5c.7-4 3.5-6.25 7.25-6.25s6.55 2.25 7.25 6.25z"/>',
  },
  /* ---- deck and actions ---- */
  interested: { /* two strokes merging into one: the product's "like", never a heart */
    o: '<path d="M6.5 3.5v3.5c0 4.2 5.5 5 5.5 9.5v4M17.5 3.5v3.5c0 4.2-5.5 5-5.5 9.5"/>',
    f: '<g stroke-width="2.7"><path d="M6.5 3.5v3.5c0 4.2 5.5 5 5.5 9.5v4M17.5 3.5v3.5c0 4.2-5.5 5-5.5 9.5"/></g>',
  },
  pass: { o: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>' },
  undo: { o: '<path d="M8.5 6.5 4.5 10.5l4 4"/><path d="M4.5 10.5h9.5a5 5 0 0 1 0 10h-3"/>' },
  save: {
    o: '<path d="M7 3.5h10A1.5 1.5 0 0 1 18.5 5v15.5L12 16l-6.5 4.5V5A1.5 1.5 0 0 1 7 3.5z"/>',
    f: '<path fill="currentColor" d="M7 3.5h10A1.5 1.5 0 0 1 18.5 5v15.5L12 16l-6.5 4.5V5A1.5 1.5 0 0 1 7 3.5z"/>',
  },
  note: { o: '<path d="M4.5 11.5c0-3.4 1.4-5.4 4-6.4M13.5 11.5c0-3.4 1.4-5.4 4-6.4"/><rect x="4.5" y="11.5" width="5.5" height="6" rx="1.5"/><rect x="13.5" y="11.5" width="5.5" height="6" rx="1.5"/>' },
  /* ---- utility ---- */
  bell: { o: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z"/><path d="M10 21h4"/>' },
  search: { o: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5.5 5.5"/>' },
  back: { o: '<path d="M14.5 5l-7 7 7 7"/>' },
  chevR: { o: '<path d="M9.5 5l7 7-7 7"/>' },
  chevD: { o: '<path d="M6.5 9.5l5.5 5.5 5.5-5.5"/>' },
  share: { o: '<path d="M12 3.5V15M7.5 8 12 3.5 16.5 8"/><path d="M8.5 11.5h-2A1.5 1.5 0 0 0 5 13v6a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-6a1.5 1.5 0 0 0-1.5-1.5h-2"/>' },
  cal: { o: '<rect x="4" y="5.5" width="16" height="15" rx="1.5"/><path d="M4 10h16M8.5 3v4.5M15.5 3v4.5"/>' },
  calAdd: { o: '<rect x="4" y="5.5" width="16" height="15" rx="1.5"/><path d="M4 10h16M8.5 3v4.5M15.5 3v4.5M12 12.75v5M9.5 15.25h5"/>' },
  pin: { o: '<path d="M12 21s6.5-6.3 6.5-11.2a6.5 6.5 0 0 0-13 0C5.5 14.7 12 21 12 21z"/><circle cx="12" cy="10" r="2.25"/>' },
  clock: { o: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>' },
  globe: { o: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.4 3.4 5 3.4 8.5s-1 6.1-3.4 8.5c-2.4-2.4-3.4-5-3.4-8.5s1-6.1 3.4-8.5z"/>' },
  link: { o: '<path d="M10 14l4-4M8.6 11.4l-2 2a3.1 3.1 0 0 0 4.4 4.4l2-2M15.4 12.6l2-2a3.1 3.1 0 0 0-4.4-4.4l-2 2"/>' },
  repo: { o: '<circle cx="7" cy="5.5" r="2"/><circle cx="7" cy="18.5" r="2"/><circle cx="17" cy="7.5" r="2"/><path d="M7 7.5v9M17 9.5c0 4.5-10 2.5-10 7"/>' },
  submit: { o: '<path d="M4 14v4.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V14"/><path d="M12 15.5V4M7.5 8.5 12 4l4.5 4.5"/>' },
  frame: { o: '<path d="M8.5 3.5v17M15.5 3.5v17M3.5 8.5h17M3.5 15.5h17"/>' },
  flag: { o: '<path d="M5.5 21V3.5M5.5 4h12.5l-2.5 4.25L18 12.5H5.5"/>' },
  check: { o: '<path d="M5 12.5l4.5 4.5L19 7.5"/>' },
  more: { o: '<path stroke-width="2.6" d="M5.5 10.6v2.8M12 10.6v2.8M18.5 10.6v2.8"/>' }, /* three marks: an action, never a status */
  edit: { o: '<path d="M4.5 19.5h4L19 9l-4-4L4.5 15.5z"/><path d="M13 7l4 4"/>' },
  ext: { o: '<path d="M13.5 4.5h6v6M19.5 4.5 11 13"/><path d="M17.5 14v4.5A1.5 1.5 0 0 1 16 20H6a1.5 1.5 0 0 1-1.5-1.5V8A1.5 1.5 0 0 1 6 6.5h4.5"/>' },
  plus: { o: '<path d="M12 5v14M5 12h14"/>' },
  people: { o: '<circle cx="9" cy="9" r="3.25"/><path d="M3 19.5c.6-3.3 2.9-5 6-5s5.4 1.7 6 5"/><path d="M15 6a3.25 3.25 0 0 1 0 6.3M17 14.7c2.2.5 3.6 2.1 4 4.8"/>' },
  send: { o: '<path d="M4 12h13M11.5 6.5l6 5.5-6 5.5"/>' },
  lock: { o: '<rect x="5" y="10.5" width="14" height="10" rx="1.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>' },
  tune: { o: '<path d="M3.5 7h9M17.5 7h3M3.5 17h3M10.5 17h10"/><circle cx="15" cy="7" r="2.25"/><circle cx="8.5" cy="17" r="2.25"/>' },
  list: { o: '<path d="M9 6.5h11M9 12h11M9 17.5h11M4 6.5h2.5M4 12h2.5M4 17.5h2.5"/>' },
  project: { o: '<rect x="3.5" y="5" width="17" height="14" rx="1.5"/><path d="m3.5 16 5-5 4 4 2.5-2.5 5.5 5.5"/><rect x="14.75" y="7.75" width="2.5" height="2.5" rx=".5"/>' },
  text: { o: '<path d="M5 7h14M5 12h14M5 17h8.5"/>' },
  tag: { o: '<path d="M4 4.5h7.5l8.5 8.5-7 7-8.5-8.5z"/><rect x="7.25" y="7.75" width="2" height="2" rx=".5"/>' },
  slot: { o: '<rect x="3" y="5.5" width="8" height="13" rx="1.5"/><rect x="13" y="5.5" width="8" height="13" rx="1.5" stroke-dasharray="2.3 1.7"/>' },
  person: { o: '<rect x="4.5" y="3.5" width="15" height="17" rx="2"/><circle cx="12" cy="10" r="2.75"/><path d="M7.5 17.5c.8-2.2 2.4-3.3 4.5-3.3s3.7 1.1 4.5 3.3"/>' },
  arrowR: { o: '<path d="M4.5 12h15M13.5 6l6 6-6 6"/>' },
  settings: { o: '<path d="M12 3.5l7.4 4.25v8.5L12 20.5l-7.4-4.25v-8.5z"/><circle cx="12" cy="12" r="2.75"/>' },
  copy: { o: '<rect x="8.5" y="8.5" width="11" height="11" rx="1.5"/><path d="M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/>' },
  sidebar: { o: '<rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/><path d="M9.5 4.5v15"/>' },
  venue: { o: '<path d="M4.5 20.5V9.5L12 4l7.5 5.5v11z"/><path d="M10 20.5v-5.5h4v5.5"/>' },
  place: { o: '<path d="M12 21s6.5-6.3 6.5-11.2a6.5 6.5 0 0 0-13 0C5.5 14.7 12 21 12 21z"/><circle cx="12" cy="10" r="2.25"/>' },
  /* ---- link kinds and accounts ---- */
  idcard: { o: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><circle cx="8.5" cy="10.5" r="2"/><path d="M5.5 16c.5-1.6 1.6-2.4 3-2.4s2.5.8 3 2.4M14 9.5h4.5M14 13h4.5"/>' },
  mergereq: { o: '<circle cx="6.5" cy="5.5" r="2"/><circle cx="6.5" cy="18.5" r="2"/><circle cx="17.5" cy="18.5" r="2"/><path d="M6.5 7.5v9M17.5 16.5V10a3 3 0 0 0-3-3h-4M12.5 4.5 10 7l2.5 2.5"/>' },
  voice: { o: '<path d="M4.5 15v-3a7.5 7.5 0 0 1 15 0v3"/><rect x="3.5" y="13.5" width="4" height="6" rx="1.5"/><rect x="16.5" y="13.5" width="4" height="6" rx="1.5"/>' },
  /* ---- roles (8) ---- */
  fe: { o: '<rect x="3" y="4.5" width="18" height="15" rx="1.5"/><path d="M3 8.5h18M10 11.5l-2.5 2.75L10 17M14 11.5l2.5 2.75L14 17"/>' },
  be: { o: '<rect x="4" y="4" width="16" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="16" height="6.5" rx="1.5"/><path d="M7 7.25h2.5M7 16.75h2.5"/>' },
  mob: { o: '<rect x="6.5" y="2.5" width="11" height="19" rx="2"/><path d="M10.5 18.5h3"/>' },
  ml: { o: '<circle cx="5.5" cy="6.5" r="2"/><circle cx="18.5" cy="6.5" r="2"/><circle cx="12" cy="11.5" r="2"/><circle cx="12" cy="19" r="2"/><path d="M7.3 7.8l3 2.4M16.7 7.8l-3 2.4M12 13.5V17"/>' },
  data: { o: '<path d="M3.5 20.5h17M6 20.5v-7M10.5 20.5V6M15 20.5v-10M19.5 20.5V9"/>' },
  des: { o: '<path d="M12 21 6 11.5 12 3l6 8.5z"/><path d="M12 3v7.75"/><circle cx="12" cy="12.5" r="1.75"/>' },
  prod: { o: '<rect x="3.5" y="4" width="17" height="11.5" rx="1.5"/><path d="M12 15.5v5M8 20.5h8M7 12l3-3 2.5 2 4-4"/>' },
  hw: { o: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 3.5V7M14 3.5V7M10 17v3.5M14 17v3.5M3.5 10H7M3.5 14H7M17 10h3.5M17 14h3.5"/>' },
  /* ---- what people build at (10) ---- */
  hackathon: { o: '<rect x="5" y="5" width="14" height="10" rx="1.5"/><path d="M2.5 18.5h19M10.5 8 8.5 10l2 2M13.5 8l2 2-2 2"/>' },
  ai: { o: '<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><circle cx="8.5" cy="9" r="1.75"/><circle cx="15.5" cy="9" r="1.75"/><circle cx="12" cy="15.5" r="1.75"/><path d="M10.25 9h3.5M9.4 10.5l1.7 3.4M14.6 10.5l-1.7 3.4"/>' },
  ctf: { o: '<path d="M5.5 21V3.5"/><path d="M5.5 4.5h13v8.5h-13"/><path d="M9 7.25l2 1.5-2 1.5M12.5 10.5h3"/>' },
  jam: { o: '<path d="M7 7.5h10a4.5 4.5 0 0 1 4.5 4.5v2.5a3 3 0 0 1-5.4 1.8L14.5 14h-5l-1.6 2.3a3 3 0 0 1-5.4-1.8V12A4.5 4.5 0 0 1 7 7.5z"/><path d="M7.5 9.75v4.5M5.25 12h4.5M15 10.75h1.75M16.75 13h1.75"/>' },
  datathon: { o: '<path d="M3.5 3.5v17h17"/><path d="M6.5 15.5l4-5 3.5 3 5-6.5"/>' },
  buildathon: { o: '<rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5"/><rect x="13" y="13" width="7.5" height="7.5" rx="1.5"/><rect x="8.25" y="3.5" width="7.5" height="7.5" rx="1.5"/>' },
  startup: { o: '<path d="M4 9.5 5.5 4.5h13L20 9.5z"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-5h4v5"/>' },
  sprint: { o: '<rect x="3.5" y="3.5" width="8" height="8" rx="1.5"/><rect x="12.5" y="3.5" width="8" height="8" rx="1.5"/><rect x="3.5" y="12.5" width="8" height="8" rx="1.5"/><path d="M12.5 16.5h8M16.5 12.5v8"/>' },
  robotics: { o: '<rect x="4.5" y="7.5" width="15" height="12" rx="2"/><path d="M12 7.5V4M9.5 4h5M9.5 16.75h5M2.5 12v4M21.5 12v4"/><rect x="8" y="11" width="2.5" height="2.5" rx=".5"/><rect x="13.5" y="11" width="2.5" height="2.5" rx=".5"/>' },
  oss: { o: '<circle cx="6.5" cy="5.5" r="2"/><circle cx="17.5" cy="5.5" r="2"/><circle cx="12" cy="18.5" r="2"/><path d="M6.5 7.5V9a3 3 0 0 0 3 3h5a3 3 0 0 0 3-3V7.5M12 12v4.5"/>' },
};
const STROKE_AT = { 14: 2.3, 16: 2.15, 18: 2, 20: 1.9, 24: 1.75 };
function icon(name, opts = {}) {
  const set = G[name];
  if (!set) return '';
  const size = opts.size || 24;
  const body = opts.filled && set.f ? set.f : set.o;
  const sw = opts.stroke || STROKE_AT[size] || (size < 20 ? 2.1 : 1.75);
  return `<svg class="ic ${opts.cls || ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="4" aria-hidden="true">${body}</svg>`;
}
/* The mark: three slots, two filled and one open. */
function markSVG(h = 20) {
  return `<svg class="mark" viewBox="0 0 28 20" height="${h}" width="${h * 1.4}" aria-hidden="true"><rect x="0.5" y="1" width="7.6" height="18" rx="2" fill="currentColor"/><rect x="10.2" y="1" width="7.6" height="18" rx="2" fill="currentColor"/><rect x="20.65" y="1.75" width="6.1" height="16.5" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"/></svg>`;
}
