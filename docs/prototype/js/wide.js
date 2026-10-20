/* Hackfam · final · iPad (rail, medium) and desktop (sidebar, large) compositions, per adaptive-layout-spec §3 and §6.
   Events and Discover are composed for each width; the other tabs open the phone screen in a 430 column (labelled in README). */
const W = {};
W.events = (app) => {
  const st = app.state, desk = app.kind === 'desk', wk = st.wk, cols = desk ? 3 : 2;
  const chips = `<div class="wk" role="group" aria-label="Weekends" ${desk ? 'style="padding:0;margin-left:auto"' : ''}><button class="all" data-act="wk" data-k="all" aria-pressed="${wk === 'all'}"><b>All</b></button>${WEEKENDS.map(([k, m, d]) => `<button data-act="wk" data-k="${k}" aria-pressed="${wk === k}"><small>${m}</small><b>${d}</b></button>`).join('')}<button data-act="wk" data-k="later" aria-pressed="${wk === 'later'}"><small>Dec</small><b>Later</b></button></div>`;
  const title = `<div class="wide-title"><h1>Events</h1>${desk ? chips : `<span style="margin-left:auto"></span><button class="icon-btn" data-act="search" aria-label="Search events">${icon('search')}</button>`}</div>${desk ? '' : chips}`;
  if (wk !== 'all') {
    const ids = ALL_ORDER.filter(id => wk !== 'later' && EVENTS[id].wk === wk);
    return `<div class="scroll"><div class="wide-pad">${title}<div class="sec-h"><h2 class="t-title">${wk === 'later' ? 'Later' : WEEKENDS.find(w => w[0] === wk).slice(1).join(' ')}</h2></div>
      <div class="grid" style="grid-template-columns:repeat(${cols},1fr)">${ids.map(id => st.joined[id] ? `<div style="grid-column:1/-1">${wristband(id, { tag: 'button', attrs: `data-open="event:${id}"` })}</div>` : evCard(id)).join('') || `<p class="empty-row">Nothing listed that weekend yet.</p>`}</div></div></div>`;
  }
  const e = EVENTS.lisbon;
  const words = Array.from({ length: 14 }, (_, i) => `<span style="transform:translateX(${-i * 41}px)">${(e.name + ' ').repeat(8)}</span>`).join('');
  const feature = `<article class="feature ev-scope" style="${evVars('lisbon')}" aria-label="${e.name}, going">
    ${poster('lisbon', desk ? 260 : 277, 300, '', 'button', `data-open="event:lisbon" aria-label="${e.name}" style="display:block;width:100%;height:100%"`)}
    <div class="feature-b"><span class="band-print" aria-hidden="true">${words}</span>
      <div class="ftop"><span class="clasp" aria-hidden="true"><i></i></span><span class="when">Going, ${e.inDays}</span></div>
      <h2>${e.name}</h2>
      <p>${e.whenEvent} ${e.tzName}<br>${e.whenYou}, ${e.venue}</p>
      <div class="ft-team"><div class="strip-h"><span>${MY_TEAM.name}, 2 of 4 roles filled</span><span>Design and Product open</span></div><div class="strip m on-band">${MY_TEAM.slots.map(s => slotM(s, { band: true })).join('')}</div></div>
      <div class="ft-act"><button class="btn sm btn-band" data-tab="discover">Open deck</button><button class="btn sm btn-band-line" data-tab="teams">Team</button><button class="btn sm btn-band-line" data-open="event:lisbon">Details</button></div>
    </div></article>`;
  const waiting = `<div class="wait"><h3>Waiting on you<span>3</span></h3>
    <div class="sheet-row" style="${roleVars('prod')}">${av('kofi')}<span class="sheet-row-m"><b>Kofi asked for Product</b><span>Night Tram, 2 h ago</span></span><button class="btn sm btn-line" data-tab="teams">Review</button></div>
    <div class="sheet-row">${av('aisha')}<span class="sheet-row-m"><b>Aisha is interested</b><span>Data, Lisboa Build Weekend</span></span><button class="btn sm btn-line" data-tab="discover">Look</button></div>
    <div class="sheet-row">${icon('note', { size: 20 })}<span class="sheet-row-m"><b>Answer a second prompt</b><span>Your card shows 1 of 3</span></span><button class="btn sm btn-line" data-tab="you">Answer</button></div></div>`;
  const forYou = (desk ? [...FOR_YOU, 'jam'] : FOR_YOU.slice(0, 4)).map(id => evCard(id)).join('');
  return `<div class="scroll"><div class="wide-pad">${title}
    <div class="sec-h"><h2 class="t-title">Your events</h2></div>
    ${desk ? `<div style="display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr);gap:20px;align-items:start">${feature}<div style="display:grid;gap:12px">${waiting}${wristband('osw', { tag: 'button', attrs: 'data-open="event:osw"' })}</div></div>` : `${feature}<div class="bands" style="padding:0;margin-top:12px">${wristband('osw', { tag: 'button', attrs: 'data-open="event:osw"' })}</div>`}
    <div class="sec-h"><h2 class="t-title">For you</h2><button class="btn-quiet" data-act="wk" data-k="all">See all</button></div>
    <div class="grid" style="grid-template-columns:repeat(${cols},minmax(0,1fr))">${forYou}</div>
    <div class="sec-h"><h2 class="t-title">All events</h2></div>
    <div class="evrows" style="padding:0;max-width:720px">${ALL_ORDER.map(id => evRow(id, st)).join('')}</div>
  </div></div>`;
};
W.discover = (app) => {
  const sc = app.state.scope;
  app.sbEv = sc;
  return `<div class="wd ev-scope" style="${evVars(sc)}">${R.band(app)}
    <div class="wd-body"><div class="wd-left">
      <div class="dc-team"><div class="strip-h" data-teaml></div><div class="strip m" data-strip></div></div>
      <div class="deck-wrap"><div class="deck" aria-live="polite"></div></div>
      ${R.deckActs(app)}
    </div><aside class="pane" data-pane aria-label="Profile"></aside></div></div>`;
};
const WIDE_TABS = [['events', 'Events'], ['discover', 'Discover'], ['teams', 'Teams'], ['chats', 'Chats'], ['you', 'You']];
class Wide extends App {
  constructor(host, form, start) {
    super();
    this.host = host; this.form = form; this.kind = form === 'rail' ? 'ipad' : 'desk';
    this.state = freshState(); this.tab = start; this.paneEvent = null;
    this.build(); this.render();
  }
  build() {
    const tablet = this.kind === 'ipad';
    setHTML(this.host, tablet
      ? `<div class="screen wide-host"><div class="sb"><span class="sb-time">9:41 Mon 19 Oct</span><span class="sb-r">${'<svg width="25" height="12" viewBox="0 0 27 13" fill="none" aria-hidden="true"><rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="18" height="9" rx="2" fill="currentColor"/></svg>'}</span></div><div class="wide rail"><nav class="nav" aria-label="Primary"></nav><div class="main"></div></div><div class="layer"></div><div class="home-ind"></div></div>`
      : `<div class="desk wide-host"><div class="wide sidebar"><nav class="nav" aria-label="Primary"></nav><div class="main"></div></div><div class="layer"></div></div>`);
    this.screen = $(tablet ? '.screen' : '.desk', this.host); this.nav = $('.nav', this.screen); this.view = $('.main', this.screen); this.layer = $('.layer', this.screen);
    this.screen.addEventListener('click', (e) => { if (e.target.closest('[data-embed]')) return; this.onClick(e); });
    this.screen.addEventListener('input', (e) => { if (e.target.closest('[data-embed]')) return; this.onInput(e); });
    this.screen.addEventListener('submit', (e) => { if (e.target.closest('[data-embed]')) return; this.onSubmit(e); });
    this.screen.addEventListener('keydown', (e) => this.onKey(e));
  }
  renderTabs() {
    const n = { discover: 3, teams: this.state.team.filled || this.state.team.declined ? 0 : 1, chats: 2 + Object.keys(this.state.matched).length };
    if (this.kind === 'ipad') {
      setHTML(this.nav, `<span class="mark-w">${markSVG(18)}</span><button class="navi" data-act="search" aria-label="Search"><span class="gw">${icon('search')}</span></button>
        ${WIDE_TABS.map(([t, l]) => `<button class="navi" data-tab="${t}" ${t === this.tab ? 'aria-current="page"' : ''} aria-label="${l}${n[t] ? `, ${n[t]} new` : ''}"><span class="gw"><span style="position:relative;display:block">${icon(t, { filled: t === this.tab })}${n[t] ? cntSVG(n[t]) : ''}</span></span>${l}</button>`).join('')}
        <span class="sp"></span><button class="navi" data-act="inbox" aria-label="Notifications, 2 unread"><span class="gw"><span style="position:relative;display:block">${icon('bell')}${cntSVG(2)}</span></span>Inbox</button><button class="navi" data-act="edit" data-sec="Settings"><span class="gw">${icon('settings')}</span>Settings</button>`);
    } else {
      setHTML(this.nav, `<span class="logo">${markSVG(20)}${esc(APP_NAME.toLowerCase())}</span><label class="side-search">${icon('search', { size: 20 })}<input type="search" placeholder="Search events" data-act="search" readonly aria-label="Search events"></label>
        ${WIDE_TABS.map(([t, l]) => `<button class="navi" data-tab="${t}" ${t === this.tab ? 'aria-current="page"' : ''}>${t === 'you' ? av('sami') : icon(t, { filled: t === this.tab })}${t === 'you' ? 'Sami Haddad' : l}${n[t] ? `<span class="n">${n[t]}</span>` : ''}</button>`).join('')}
        <span class="sp"></span><button class="navi" data-act="inbox">${icon('bell')}Notifications<span class="n">2</span></button><button class="navi" data-act="edit" data-sec="Settings">${icon('settings')}Settings</button>`);
    }
  }
  render() {
    if (this.deck) { this.deck.destroy(); this.deck = null; }
    this.hideUndo(true); this.closeSheet(true);
    this.renderTabs();
    if (this.tab === 'events') setHTML(this.view, W.events(this));
    else if (this.tab === 'discover') setHTML(this.view, W.discover(this));
    else {
      setHTML(this.view, `<div class="embed" data-embed><div></div></div>`);
      const start = { teams: 'team', chats: 'chats', you: 'you' }[this.tab];
      this.embedded = new Phone($('.embed > div', this.view), start, { embedded: true, state: this.state, chat: this.pendingChat, onTab: (t, chat) => { this.tab = t; this.pendingChat = chat; this.render(); } });
      this.pendingChat = null;
    }
    measureCells(this.view);
    $$('.strip .slot-l', this.view).forEach(el => fitText(el, 100, 75));
    $$('[data-fitband]', this.view).forEach(el => fitText(el, 110, 75));
    if (this.tab === 'discover') { this.updateStrip(); this.deck = new Deck(this, $('.deck', this.view)); }
    if (this.paneEvent && this.tab === 'events') this.openPane(this.paneEvent, true);
  }
  onTop(id) {
    const pane = $('[data-pane]', this.view); if (!pane) return;
    if (!id) { setHTML(pane, `<p class="pane-h">${this.state.scope === 'anyone' ? `Saved: ${this.state.deckAny.saved} people` : 'Interested in you: 3'}</p>`); return; }
    if (pane.dataset.id === id) return; pane.dataset.id = id;
    setHTML(pane, `<p class="pane-h">The rest of the profile</p>${profileHTML(id, { any: this.state.scope === 'anyone', pane: true })}`);
    pane.scrollTop = 0;
    $$('[data-fit]', pane).forEach(el => fitText(el, 125, 75));
    if (!RM.on) anim(pane.firstElementChild.nextElementSibling, [{ opacity: 0 }, { opacity: 1 }], { dur: 210, fill: 'none' });
  }
  open(r) {
    const [k, arg] = r.split(':');
    if (k === 'event') this.openPane(arg);
    if (k === 'chat') { this.pendingChat = arg; this.tab = 'chats'; this.paneEvent = null; this.render(); }
  }
  openPane(id, instant) {
    this.paneEvent = id;
    let d = $('.side-pane', this.view); if (d) d.remove();
    const html = R.event(this, id).replace('data-act="back" aria-label="Back"', 'data-act="back" aria-label="Close"');
    this.view.append(frag(`<aside class="side-pane evd-host ev-scope" style="${evVars(id)}" aria-label="${EVENTS[id].name}">${html}</aside>`));
    d = $('.side-pane', this.view);
    const closeBtn = $('[data-act="back"]', d); if (closeBtn) setHTML(closeBtn, icon('pass'));
    measureCells(d);
    if (!instant && !RM.on) anim(d, [{ transform: 'translateX(60px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { ease: 'standard', fill: 'none' });
  }
  evRoot() { return $('.side-pane', this.view) || this.view; }
  rerenderEvent(id) {
    const d = $('.side-pane', this.view), page = d && $('.page', d), top = page ? page.scrollTop : 0;
    this.openPane(id || this.paneEvent, true);
    const np = $('.side-pane .page', this.view); if (np) np.scrollTop = top;
  }
  back() {
    const d = $('.side-pane', this.view); this.paneEvent = null; if (!d) return;
    if (RM.on) d.remove(); else anim(d, [{ opacity: 1 }, { opacity: 0, transform: 'translateX(40px)' }], { dur: 150 }).onfinish = () => d.remove();
  }
  setTab(t) { this.tab = t; this.paneEvent = null; this.render(); }
  toChat(id) { this.pendingChat = id; this.tab = 'chats'; this.render(); }
}

/* ---------- Boot ---------- */
const apps = {};
function boot() {
  $$('[data-phone]').forEach(el => { apps[el.closest('.frame').id] = new Phone(el, el.dataset.phone, { event: el.dataset.event }); });
  $$('[data-wide]').forEach(el => { apps[el.closest('.frame').id] = new Wide(el, el.dataset.form, el.dataset.wide); });
  window.__apps = apps;
}
function setTheme(t) { root.dataset.theme = t; $$('[data-theme-btn]').forEach(b => b.setAttribute('aria-pressed', b.dataset.themeBtn === t)); }
function setMotion(m) { root.dataset.motion = m; $$('[data-motion-btn]').forEach(b => b.setAttribute('aria-pressed', b.dataset.motionBtn === m)); }
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-theme-btn]'); if (t) setTheme(t.dataset.themeBtn);
  const m = e.target.closest('[data-motion-btn]'); if (m) setMotion(m.dataset.motionBtn);
  const r = e.target.closest('[data-replay]'); if (!r) return;
  const fid = r.dataset.replay, kind = r.dataset.kind, ph = apps[fid];
  ph.layer.replaceChildren(); ph.sheet = null; (ph.timers || []).forEach(clearTimeout); ph.timers = [];
  if (kind === 'deck') { const keep = ph.state.scope; const s = freshState({ scope: keep }); Object.assign(ph.state, { deck: s.deck, deckAny: s.deckAny, matched: {}, people: s.people }); ph.tab = 'discover'; ph.stack && (ph.stack.discover = ['discover']); ph.render(); }
  if (kind === 'seat') { ph.state.team.filled = false; ph.state.team.declined = false; ph.tab = 'teams'; ph.stack.teams = ['team']; ph.render(); setTimeout(() => $('[data-act="accept"]', ph.view)?.click(), 400); }
  if (kind === 'final') { const t = ph.state.team; t.final = !t.final; t.left = t.final ? 46 * 60 + 30 : TEAM_DAY.leftSec; r.textContent = t.final ? 'Back to Saturday' : 'Final hour'; const top = $('.page', ph.view).scrollTop; ph.render(); $('.page', ph.view).scrollTop = top; }
  if (kind === 'join') { delete ph.state.joined.seoul; delete ph.state.registered.seoul; ph.state.saved.seoul = true; ph.render(); setTimeout(() => $('[data-act="join"]', ph.view)?.click(), 300); }
});
document.title = `${APP_NAME} final system`;
$$('[data-app-name]').forEach(el => { el.textContent = APP_NAME; });
const params = new URLSearchParams(location.search);
setTheme(params.get('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
setMotion(params.get('motion') || (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'full'));
Promise.all([document.fonts.load('700 16px "Mona Sans"'), document.fonts.load('800 16px "Mona Sans"')]).catch(() => {}).finally(() => { boot(); document.body.dataset.ready = 1; });
/* Review hook for screenshots: pause every animation inside an element at a time (ms). */
window.__scrub = (el, ms) => el.getAnimations({ subtree: true }).forEach(a => { a.pause(); a.currentTime = ms; });
