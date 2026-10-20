/* Hackfam · final · application: shared App (state, actions, moments), the Phone shell and the Deck. */

function freshState(opts = {}) {
  const onbStart = opts.onb || 'build';
  return {
    wk: 'all',
    joined: { lisbon: true, osw: true }, saved: { lisbon: true, osw: true, seoul: true }, registered: { lisbon: true },
    scope: opts.scope || 'lisbon', lastEvent: 'lisbon',
    deck: { list: DECK, i: 0, hist: [], mode: 'cards', pencil: null, decided: {}, saved: 0 },
    deckAny: { list: DECK_ANY, i: 0, hist: [], mode: 'cards', pencil: null, decided: {}, saved: 2 },
    people: MY_PEOPLE.map(s => ({ ...s })),
    team: { filled: false, declined: false, check: TEAM_DAY.checklist.map(c => c.done), left: TEAM_DAY.leftSec, final: false },
    you: { view: 'card', tagline: null, project: null },
    onb: {
      step: onbStart, build: new Set(onbStart === 'build' ? [] : ['hackathon', 'ctf', 'oss']), acc: {}, links: [],
      main: null, also: [], skills: [], err: null, start: onbStart,
    },
    matched: {}, sent: {},
  };
}

class App {
  /* ---------- sheets ---------- */
  openSheet(html, after) {
    this.closeSheet(true);
    const scrim = document.createElement('div'); scrim.className = 'scrim'; scrim.dataset.act = 'closesheet';
    const sh = document.createElement('div'); sh.className = 'sheet'; sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-modal', 'true');
    setHTML(sh, `<div class="grab"></div>${html}`);
    if (this.kind !== 'phone') { sh.style.cssText = 'left:auto;right:16px;bottom:16px;top:16px;width:400px;border-radius:24px;max-height:none'; }
    this.layer.append(scrim, sh); this.sheet = [scrim, sh];
    if (RM.on) { anim(scrim, [{ opacity: 0 }, { opacity: 1 }], { dur: 150 }); anim(sh, [{ opacity: 0 }, { opacity: 1 }], { dur: 180 }); }
    else { anim(scrim, [{ opacity: 0 }, { opacity: 1 }], { dur: 180, ease: 'ease-out' }); anim(sh, this.kind !== 'phone' ? [{ transform: 'translateX(110%)' }, { transform: 'none' }] : [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], { ease: 'sheet' }); }
    after && after(sh);
    measureCells(sh);
    return sh;
  }
  closeSheet(instant) {
    if (!this.sheet) return; const [scrim, sh] = this.sheet; this.sheet = null;
    if (instant) { scrim.remove(); sh.remove(); return; }
    anim(scrim, [{ opacity: 1 }, { opacity: 0 }], { dur: 150 });
    const a = anim(sh, RM.on ? [{ opacity: 1 }, { opacity: 0 }] : this.kind !== 'phone' ? [{ transform: 'none' }, { transform: 'translateX(110%)' }] : [{ transform: 'translateY(0)' }, { transform: 'translateY(105%)' }], { dur: 200, ease: 'cubic-bezier(.4,0,1,1)' });
    a.onfinish = () => { scrim.remove(); sh.remove(); };
  }
  linkSheet(url) { this.openSheet(`<h3>Open link</h3><div class="sheet-row">${icon('link')}<div class="sheet-row-m"><b>${esc(url)}</b><span>Opens in your browser</span></div></div><div class="sheet-act"><button class="btn btn-line" data-act="copy" data-url="${esc(url)}">Copy link</button><button class="btn btn-ink" data-act="closesheet">Done</button></div>`); }
  calSheet(id) {
    const e = EVENTS[id];
    this.openSheet(`<h3>Add to calendar</h3><div class="sheet-row">${icon('clock')}<div class="sheet-row-m"><b>${e.whenEvent}${e.format === 'Online' ? '' : ' ' + e.tzName}</b><span>${e.whenYou || e.tzName}</span></div></div><div class="sheet-act"><button class="btn btn-ink" data-act="ics" data-id="${id}">${icon('calAdd', { size: 20 })}Add to calendar</button></div>`);
  }
  planSheet(id) {
    const e = EVENTS[id];
    this.openSheet(`<h3>Add ${e.name} to your calendar?</h3><div class="sheet-row">${icon('clock')}<div class="sheet-row-m"><b>${e.whenEvent}${e.format === 'Online' ? '' : ' ' + e.tzName}</b><span>${e.whenYou || e.tzName}</span></div></div>${e.format !== 'Online' ? `<button class="sheet-row" data-act="link" data-url="maps: ${e.venue}, ${e.city}">${icon('place')}<span class="sheet-row-m"><b>Open in Maps</b><span>${e.venue}, ${e.city}</span></span>${icon('chevR', { size: 18 })}</button>` : ''}<div class="sheet-act"><button class="btn btn-line" data-act="closesheet">Not now</button><button class="btn btn-ink" data-act="ics" data-id="${id}">Add to calendar</button></div>`);
  }
  shareSheet(id) {
    const e = EVENTS[id], url = `${APP_SLUG}.app/e/${e.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    this.openSheet(`<h3>Share ${e.name}</h3><div class="sheet-row ev-scope" style="${evVars(id)}">${poster(id, 42, 52, '', 'span', 'style="width:42px;height:52px;border-radius:9px;flex:none"')}<div class="sheet-row-m"><b>${url}</b><span>Opens for anyone, signed in or not</span></div></div><div class="sheet-act"><button class="btn btn-line" data-act="copy" data-url="https://${url}">Copy link</button><button class="btn btn-ink" data-act="nshare" data-url="https://${url}" data-t="${e.name}">Share</button></div>`);
  }
  ics(id) {
    const e = EVENTS[id], u = ICS_UTC[id];
    const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//${APP_NAME}//Preview//EN`, 'BEGIN:VEVENT', `UID:${id}@${APP_SLUG}.preview`, 'DTSTAMP:20261019T090000Z', `DTSTART:${u[0]}`, `DTEND:${u[1]}`, `SUMMARY:${e.name}`, `LOCATION:${e.venue}\\, ${e.city}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' })); a.download = `${id}.ics`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  copy(btn) {
    try { navigator.clipboard && navigator.clipboard.writeText(btn.dataset.url).catch(() => {}); } catch (e) {}
    const was = btn.textContent; btn.textContent = 'Copied'; setTimeout(() => { if (btn.isConnected) btn.textContent = was; }, 2000);
  }

  /* ---------- discover helpers ---------- */
  deckState() { return this.state.scope === 'anyone' ? this.state.deckAny : this.state.deck; }
  updateStrip() {
    const strip = $('[data-strip]', this.view); if (!strip) return;
    const any = this.state.scope === 'anyone', pen = this.deckState().pencil, d = this.deckState();
    if (any) {
      const ppl = this.state.people;
      const compact = ppl.length >= 5;
      setHTML(strip, ppl.map(s => s.who ? slotM(s, { compact }) : `<div class="slot open" data-role="any" style="--rc:var(--ink);--rct:var(--ink)"><span class="hatch"></span>${icon('plus', { size: 18 })}<span class="slot-l">Next</span><span class="ring"></span></div>`).join(''));
      $$('.slot-l', strip).forEach(el => fitText(el, 100, 75));
      setHTML($('[data-teaml]', this.view), `<span>Your people, ${ppl.filter(s => s.who).length} connections</span><span data-savedn>${d.saved} saved</span>`);
      return;
    }
    const slots = MY_TEAM.slots.map(s => (!s.who && pen && PEOPLE[pen].role === s.role) ? { ...s, pencil: pen } : s);
    setHTML(strip, slots.map(s => slotM(s)).join(''));
    $$('.slot-l', strip).forEach(el => fitText(el, 100, 75));
    const filled = slots.filter(s => s.who).length, open = slots.filter(s => !s.who && !s.pencil).map(s => ROLES[s.role].short);
    setHTML($('[data-teaml]', this.view), `<span>${MY_TEAM.name}, ${filled} of 4 roles filled</span><span>${open.length ? open.join(' and ') + ' open' : 'Every slot spoken for'}</span>`);
  }
  previewSlot(id, amt, armed) {
    const strip = $('[data-strip]', this.view); if (!strip) return;
    $$('.slot.open', strip).forEach(s => {
      const on = id && (s.dataset.role === PEOPLE[id].role || s.dataset.role === 'any');
      if (on && s.dataset.role === 'any') { s.style.setProperty('--rct', `var(--rt-${PEOPLE[id].role})`); }
      s.style.setProperty('--pv', on ? amt : 0); s.classList.toggle('armed', !!(on && armed));
      const g = $('.ghost', s); if (g) { if (on && amt > 0 && !g.firstChild) setHTML(g, `<span class="av" style="width:22px;height:22px">${avatarSVG(id)}</span>`); if (!on || amt <= 0) g.replaceChildren(); }
    });
  }
  renderList() {
    const ul = $('.dlist', this.view), d = this.deckState(), any = this.state.scope === 'anyone';
    setHTML(ul, d.list.map(id => { const p = PEOPLE[id], dec = d.decided[id]; return `<li class="${dec ? 'done' : ''}" style="${roleVars(p.role)}">${av(id)}<div class="dlist-m"><b>${p.name}</b><span>${ROLES[p.role].name}</span><div class="t-small">${dec ? (dec === 'save' ? 'Saved for later' : dec > 0 ? 'Interested' : 'Passed') : (any ? p.anyReasons : p.reasons)[0][1]}</div></div>${dec ? '' : `<button class="icon-btn" data-act="lpass" data-id="${id}" aria-label="Pass on ${p.first}">${icon('pass', { size: 20 })}</button><button class="icon-btn yes" data-act="lint" data-id="${id}" aria-label="Interested in ${p.first}">${icon('interested', { size: 20 })}</button>`}</li>`; }).join(''));
  }
  showUndo(text) {
    this.hideUndo(true);
    const wrap = $('.deck-wrap', this.view); if (!wrap) return;
    const bar = frag(`<div class="undo-bar" role="status">${esc(text)}<button data-act="undo">Undo</button><i></i></div>`).firstElementChild;
    wrap.appendChild(bar); this.undoEl = bar;
    if (!RM.on) { anim(bar, [{ opacity: 0, transform: 'translate(-50%, 8px)' }, { opacity: 1, transform: 'translate(-50%, 0)' }], { ease: 'snap', fill: 'none' }); anim($('i', bar), [{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], { dur: 5000, ease: 'linear' }); }
    this.undoTimer = setTimeout(() => this.hideUndo(), 5000);
  }
  hideUndo(instant) {
    clearTimeout(this.undoTimer); const b = this.undoEl; this.undoEl = null; if (!b || !b.isConnected) return;
    if (instant || RM.on) { b.remove(); return; }
    anim(b, [{ opacity: 1 }, { opacity: 0 }], { dur: 150 }).onfinish = () => b.remove();
  }

  /* ---------- Moment: "{name} said yes too" (A). The avatar flies into the open slot, the slot clicks. ---------- */
  matchMoment(id, fromRect) {
    const p = PEOPLE[id], sc = this.state.scope, e = EVENTS[sc];
    this.state.matched[id] = true;
    const host = document.createElement('div'); host.className = 'match ev-scope'; host.style.cssText = evVars(sc);
    host.setAttribute('role', 'dialog'); host.setAttribute('aria-label', `${p.first} said yes too`);
    const slot = (s) => {
      if (s.who) return `<div class="slot">${icon(s.role, { size: 20 })}${av(s.who)}<div><b>${PEOPLE[s.who].first}</b><small>${ROLES[s.role].short}</small></div></div>`;
      if (s.role === p.role) return `<div class="slot open target"><span class="hatch"></span><span class="ring"></span><span class="ring2"></span>${icon(s.role, { size: 20 })}${av(id)}<div class="m-t" style="position:relative;width:100%"><div class="t-open"><b>${ROLES[s.role].short}</b><small>Open</small></div><div class="t-pen" style="position:absolute;left:0;bottom:0"><b>${p.first}</b><small>Pencilled</small></div></div></div>`;
      return `<div class="slot open"><span class="ring"></span>${icon(s.role, { size: 20 })}<span style="height:60px"></span><div><b>${ROLES[s.role].short}</b><small>Open</small></div></div>`;
    };
    setHTML(host, `<div class="m-bg"></div><div class="m-inner">
      <div class="m-ev">${poster(sc, 60, 60)}${e.name}</div>
      <h2 class="m-title">${p.first} said yes&nbsp;too</h2>
      <p class="m-sub">${p.first} and you both want to build at ${e.name}.</p>
      <div class="strip on-band m-strip">${MY_TEAM.slots.map(slot).join('')}</div>
      <div class="m-act"><button class="btn btn-band" data-act="sayhi" data-id="${id}">${icon('chats', { size: 20 })}Say hi</button><button class="btn btn-band-line" data-act="keep">Keep looking</button></div>
    </div><div class="m-fly">${avatarSVG(id)}</div>`);
    this.layer.appendChild(host); this.screen.classList.add('ov');
    const fly = $('.m-fly', host), target = $('.slot.target', host);
    if (RM.on) {
      fly.remove(); $('.av', target).style.opacity = 1; $('.hatch', target).style.clipPath = 'none'; $('.ring', target).style.opacity = 0; $('.ring2', target).style.opacity = 1; $('.t-open', target).style.opacity = 0;
      anim(host, [{ opacity: 0 }, { opacity: 1 }], { dur: 200 }); haptic('merge'); this.moment = []; return;
    }
    $('.t-pen', target).style.opacity = 0;
    const scr = this.screen, src = relRect($('[data-strip]', this.view), scr), sR = relRect($('.m-strip', host), scr), tAv = relRect($('.av', target), scr);
    const W = scr.clientWidth, H = scr.clientHeight, A = [];
    A.push(anim($('.m-bg', host), [{ clipPath: `inset(${src.y}px ${W - src.x - src.w}px ${H - src.y - src.h}px ${src.x}px round 10px)` }, { clipPath: 'inset(0px 0px 0px 0px round 0px)' }], { ease: 'standard', delay: 0 }));
    const dx = (src.x + src.w / 2) - (sR.x + sR.w / 2), dy = (src.y + src.h / 2) - (sR.y + sR.h / 2);
    A.push(anim($('.m-strip', host), [{ transform: `translate(${dx}px,${dy}px) scale(${src.w / sR.w},${src.h / sR.h})`, opacity: 0 }, { opacity: 1, offset: .22 }, { transform: 'none', opacity: 1 }], { ease: 'snap' }));
    const f = fromRect || { x: 40, y: 330, w: 72, h: 72 }, AW = 60;
    const p0 = { x: f.x, y: Math.max(110, f.y) }, p2 = { x: tAv.x, y: tAv.y };
    const chord = Math.hypot(p2.x - p0.x, p2.y - p0.y), c = { x: (p0.x + p2.x) / 2, y: Math.min(p0.y, p2.y) - chord * .3 };
    const kf = [];
    for (let i = 0; i <= 12; i++) { const t = i / 12, x = (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * c.x + t * t * p2.x, y = (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * c.y + t * t * p2.y; kf.push({ transform: `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${lerp(f.w / AW, 1, t).toFixed(3)}) rotate(${lerp(-12, 0, t).toFixed(1)}deg)`, offset: t }); }
    fly.style.transformOrigin = '0 0';
    A.push(anim(fly, kf, { ease: 'celebrate', delay: 140, dur: 640 }));
    A.push(anim(fly, [{ opacity: 1 }, { opacity: 0 }], { dur: 1, delay: 779 }));
    const T0 = 620;
    A.push(anim($('.av', target), [{ opacity: 0 }, { opacity: 1 }], { dur: 1, delay: 778 }));
    A.push(anim($('.hatch', target), [{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)' }], { ease: 'standard', dur: 260, delay: T0 }));
    A.push(anim($('.ring', target), [{ opacity: 1 }, { opacity: 0 }], { dur: 140, delay: T0 }));
    A.push(anim($('.ring2', target), [{ opacity: 0 }, { opacity: 1 }], { dur: 140, delay: T0 }));
    A.push(anim(target, [{ transform: 'scale(1)' }, { transform: 'scale(1.06)', offset: .35 }, { transform: 'scale(1)' }], { dur: 360, delay: T0 + 20, ease: 'cubic-bezier(.3,.7,.3,1)' }));
    const sl = $$('.slot', host), ti = sl.indexOf(target);
    if (sl[ti - 1]) A.push(anim(sl[ti - 1], [{ transform: 'translateX(0)' }, { transform: 'translateX(-4px)', offset: .35 }, { transform: 'translateX(0)' }], { dur: 340, delay: T0 + 20, ease: 'cubic-bezier(.3,.7,.3,1)' }));
    if (sl[ti + 1]) A.push(anim(sl[ti + 1], [{ transform: 'translateX(0)' }, { transform: 'translateX(4px)', offset: .35 }, { transform: 'translateX(0)' }], { dur: 340, delay: T0 + 20, ease: 'cubic-bezier(.3,.7,.3,1)' }));
    A.push(anim($('.t-open', target), [{ opacity: 1 }, { opacity: 0 }], { dur: 120, delay: T0 - 40 }));
    A.push(anim($('.t-pen', target), [{ opacity: 0 }, { opacity: 1 }], { dur: 180, delay: T0 + 40 }));
    A.push(anim($('.m-ev', host), [{ opacity: 0 }, { opacity: 1 }], { dur: 200, delay: 300 }));
    A.push(anim($('.m-title', host), [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { ease: 'standard', delay: 700 }));
    A.push(anim($('.m-sub', host), [{ opacity: 0 }, { opacity: 1 }], { dur: 210, delay: 760 }));
    A.push(anim($('.m-act', host), [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { ease: 'standard', delay: 820 }));
    this.moment = A; this.armSkip(host);
    this.later(() => haptic('merge'), T0);
  }

  /* ---------- Moment: interlocking build rhythms (B), for a connection in Anyone. ---------- */
  connectMoment(id) {
    const p = PEOPLE[id], me = PEOPLE.sami;
    this.state.matched[id] = true;
    const a = weeksOf(me.proof.seed).lv, b = weeksOf(p.proof.seed).lv, both = a.map((v, i) => v > 0 && b[i] > 0), n = both.filter(Boolean).length;
    const host = document.createElement('div'); host.className = 'zip-o ev-scope'; host.style.cssText = `${evVars('anyone')};--zt:${ROLE_ON_DARK[p.role]}`;
    host.setAttribute('role', 'dialog'); host.setAttribute('aria-label', `Connected with ${p.first}. Building in ${n} of the same weeks.`);
    setHTML(host, `<div class="m-bg"></div><div class="m-inner">
      <div class="m-ev"><span class="scope-tile">${icon('slot', { size: 18 })}</span>Anyone</div>
      <div class="zip"><div class="rs me"></div><div class="rs them"></div><div class="rs bridges" style="bottom:38px;height:4px"></div>
        <div class="ends"><span class="end me"><span class="eslot">${av('sami')}</span>You</span><span class="end them"><span class="eslot"><span class="fill"></span>${av(id)}</span>${p.first}</span></div></div>
      <p class="zip-stat">Building in ${n} of the same weeks</p>
      <h2 class="m-title">Connected</h2>
      <p class="m-sub">Ask each other onto any future team.</p>
      <div class="m-act"><button class="btn btn-band" data-act="sayhi" data-id="${id}">${icon('chats', { size: 20 })}Say hi</button><button class="btn btn-band-line" data-act="keep">Keep looking</button></div>
    </div>`);
    this.layer.appendChild(host); this.screen.classList.add('ov');
    const zip = $('.zip', host), W = zip.clientWidth, step = W / 26, bw = Math.max(4, Math.min(6, step * .38));
    const bar = (v, i, off, cls) => `<i class="${both[i] ? 'both' : ''}" style="left:${(i * step + off).toFixed(2)}px;width:${bw}px;height:${v ? 10 + v * 18 : 3}px"></i>`;
    setHTML($('.rs.me', host), a.map((v, i) => bar(v, i, 0)).join(''));
    setHTML($('.rs.them', host), b.map((v, i) => bar(v, i, step / 2)).join(''));
    setHTML($('.rs.bridges', host), both.map((x, i) => x ? `<b class="bridge" style="left:${(i * step - 1).toFixed(2)}px;width:${(step / 2 + bw + 2).toFixed(2)}px"></b>` : '').join(''));
    const mine = $('.rs.me', host), theirs = $('.rs.them', host);
    const dim = $$('.rs.me i:not(.both), .rs.them i:not(.both)', host), lift = $$('.rs i.both', host), bridges = $$('.bridge', host);
    const fill = $('.end.them .fill', host), endMe = $('.end.me', host), endThem = $('.end.them', host);
    if (RM.on) {
      dim.forEach(x => x.style.opacity = .26); lift.forEach(x => x.style.transform = 'scaleY(1.12)'); bridges.forEach(x => x.style.opacity = 1); fill.style.clipPath = 'inset(0 0 0 0)';
      anim(host, [{ opacity: 0 }, { opacity: 1 }], { dur: 200 }); haptic('zip'); this.moment = []; return;
    }
    const scr = this.screen, src = relRect($('[data-strip]', this.view), scr), Ws = scr.clientWidth, H = scr.clientHeight, A = [];
    A.push(anim($('.m-bg', host), [{ clipPath: `inset(${src.y}px ${Ws - src.x - src.w}px ${H - src.y - src.h}px ${src.x}px round 10px)` }, { clipPath: 'inset(0px 0px 0px 0px round 0px)' }], { ease: 'standard' }));
    A.push(anim($('.m-ev', host), [{ opacity: 0 }, { opacity: 1 }], { dur: 200, delay: 150 }));
    A.push(anim(mine, [{ transform: `translateX(${-W - 40}px)` }, { transform: 'translateX(0)' }], { ease: 'zip', delay: 90 }));
    A.push(anim(theirs, [{ transform: `translateX(${W + 40}px)` }, { transform: 'translateX(0)' }], { ease: 'zip', delay: 90 }));
    A.push(anim(endMe, [{ opacity: 0, transform: 'translateX(-24px)' }, { opacity: 1, transform: 'none' }], { ease: 'zip', delay: 90 }));
    A.push(anim(endThem, [{ opacity: 0, transform: 'translateX(24px)' }, { opacity: 1, transform: 'none' }], { ease: 'zip', delay: 90 }));
    const T = 510;
    dim.forEach(x => A.push(anim(x, [{ opacity: 1 }, { opacity: .26 }], { dur: 300, delay: T, ease: 'linear' })));
    lift.forEach(x => A.push(anim(x, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(1.12)' }], { ease: 'celebrate', delay: T })));
    bridges.forEach((x, k) => A.push(anim(x, [{ opacity: 0, transform: 'scaleX(.3)' }, { opacity: 1, transform: 'scaleX(1)' }], { ease: 'snap', delay: T + k * 8 })));
    A.push(anim(fill, [{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { ease: 'standard', dur: 260, delay: T }));
    A.push(anim($('.end.me .eslot', host), [{ transform: 'translateX(0)' }, { transform: 'translateX(4px)', offset: .35 }, { transform: 'translateX(0)' }], { dur: 340, delay: T + 20, ease: 'cubic-bezier(.3,.7,.3,1)' }));
    A.push(anim($('.end.them .eslot', host), [{ transform: 'translateX(0) scale(1)' }, { transform: 'translateX(-4px) scale(1.06)', offset: .35 }, { transform: 'none' }], { dur: 360, delay: T + 20, ease: 'cubic-bezier(.3,.7,.3,1)' }));
    A.push(anim($('.zip-stat', host), [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { ease: 'standard', delay: T + 60 }));
    A.push(anim($('.m-title', host), [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { ease: 'standard', delay: T + 120 }));
    A.push(anim($('.m-sub', host), [{ opacity: 0 }, { opacity: 1 }], { dur: 210, delay: T + 200 }));
    A.push(anim($('.m-act', host), [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { ease: 'standard', delay: T + 280 }));
    this.moment = A; this.armSkip(host);
    this.later(() => haptic('zip'), T);
  }
  armSkip(host) {
    host.addEventListener('pointerdown', (ev) => { if ((this.moment || []).some(a => a.playState === 'running')) { ev.stopPropagation(); ev.preventDefault(); this.moment.forEach(a => a.finish()); host.dataset.skipped = 1; } }, true);
    host.addEventListener('click', (ev) => { if (host.dataset.skipped) { delete host.dataset.skipped; ev.stopPropagation(); ev.preventDefault(); } }, true);
  }
  later(fn, ms) { if (window.__holdTimers) { (window.__held ||= []).push(fn); return; } (this.timers ||= []).push(setTimeout(fn, ms)); }
  endMoment(then) {
    const host = $('.match, .zip-o', this.layer); if (!host) { then && then(); return; }
    anim(host, [{ opacity: 1 }, { opacity: 0 }], { dur: 150 }).onfinish = () => { host.remove(); this.screen.classList.remove('ov'); then && then(); };
  }

  /* ---------- Moment: the wristband snap (C) when you join a pool ---------- */
  join(btn, id) {
    const pageRoot = btn.closest('.evd-host') || this.view, page = $('.page', pageRoot), top = page ? page.scrollTop : 0;
    const e = EVENTS[id], poolBefore = e.pool, feBefore = e.roles.fe;
    this.state.joined[id] = true; this.state.saved[id] = true;
    this.snapping = id; this.rerenderEvent(id); this.snapping = null;
    const host = this.evRoot(), np = $('.page', host); if (np) np.scrollTop = top;
    const wrap = $('[data-joinwrap]', host), b = $('.band', wrap), poolEl = $('[data-pool]', host), feEl = $('.legend [data-r="fe"]', host);
    setCells(poolEl, poolBefore, { instant: true }); setCells(feEl, feBefore, { instant: true });
    const rung = $$('.rung', host)[1];
    if (RM.on) { anim(b, [{ opacity: 0 }, { opacity: 1 }], { dur: 150 }); const seat = $('.seat', b); if (seat) seat.style.clipPath = 'none'; setCells(poolEl, poolBefore + 1, { instant: true }); setCells(feEl, feBefore + 1, { instant: true }); haptic('snap'); return; }
    const ghost = frag(`<button class="btn btn-acc" style="position:absolute;inset:0;width:100%" tabindex="-1" aria-hidden="true">${icon('interested', { size: 20 })}Join the pool</button>`).firstElementChild; wrap.appendChild(ghost);
    const A = [];
    A.push(anim(ghost, [{ opacity: 1 }, { opacity: 0 }], { dur: 120 }));
    A.push(anim(b, [{ clipPath: 'inset(0 100% 0 0 round 14px 9px 9px 14px)' }, { clipPath: 'inset(0 0% 0 0 round 14px 9px 9px 14px)' }], { dur: 320, ease: 'cubic-bezier(.2,.8,.2,1)' }));
    A.push(anim($('.band-t', b), [{ opacity: 0 }, { opacity: 1 }], { dur: 160, delay: 180 }));
    A.push(anim($('.clasp', b), [{ transform: 'scale(0) rotate(-40deg)' }, { transform: 'scale(1.22) rotate(6deg)', offset: .62 }, { transform: 'scale(1) rotate(0deg)' }], { dur: 300, delay: 250, ease: 'cubic-bezier(.3,.7,.4,1)' }));
    A.push(anim($('.seat', b), [{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { dur: 140, delay: 400, ease: 'cubic-bezier(.2,.8,.2,1)' }));
    A.push(anim($('.go', b), [{ opacity: 0, transform: 'translateX(-8px)' }, { opacity: 1, transform: 'none' }], { dur: 200, delay: 430, ease: 'cubic-bezier(.2,.8,.2,1)' }));
    A.push(anim($('.rf', rung), [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], { ease: 'standard', dur: 300, delay: 430 }));
    A.push(anim($('[data-ya-line]', host), [{ opacity: 0 }, { opacity: 1 }], { dur: 210, delay: 450 }));
    this.moment = A; this.snapAnims = A;
    this.later(() => { haptic('snap'); setCells(poolEl, poolBefore + 1); setCells(feEl, feBefore + 1); ghost.remove(); }, 430);
  }
  toggleReg(btn, id) {
    const on = !this.state.registered[id]; this.state.registered[id] = on; if (on) this.state.saved[id] = true;
    btn.setAttribute('aria-checked', on); haptic('select');
    const host = this.evRoot(), rungs = $$('.rung', host);
    const r3 = rungs[2], r1 = rungs[0];
    r3.classList.toggle('on', on); setHTML(r3, `<span class="rf"></span>${on ? icon('check', { size: 16 }) : ''}Registered`);
    if (on && !r1.classList.contains('on')) { r1.classList.add('on'); setHTML(r1, `<span class="rf"></span>${icon('check', { size: 16 })}Saved`); const sv = $('[data-act="save"]', host); if (sv) { sv.setAttribute('aria-pressed', true); setHTML(sv, icon('save', { filled: true })); } }
    if (on && !RM.on) anim($('.rf', r3), [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], { ease: 'standard', dur: 300 });
    const s = $('[data-status]', host); if (s && !this.state.joined[id]) { s.textContent = on ? 'Registered' : EVENTS[id].status; }
    if (on) this.later(() => this.planSheet(id), 320);
  }
  evRoot() { return this.view; }
  rerenderEvent() { const page = $('.page', this.view), top = page ? page.scrollTop : 0; this.render(); const np = $('.page', this.view); if (np) np.scrollTop = top; }

  /* ---------- Moment: the seat (A) — a pencilled slot becomes a seated member ---------- */
  fillSlot() {
    const page = $('.page', this.view), strip = $('[data-tstrip]', page), slot = $('.slot.pencil', strip), req = $('[data-req]', page);
    if (!slot || !req) return;
    this.state.team.filled = true;
    if (RM.on) { const top = page.scrollTop; this.render(); $('.page', this.view).scrollTop = top; anim($('[data-tstrip]', this.view), [{ opacity: .4 }, { opacity: 1 }], { dur: 200, fill: 'none' }); haptic('full'); return; }
    const scr = this.screen, from = relRect($('.av', req), scr), to = relRect($('.s-av', slot), scr);
    const fly = document.createElement('div'); fly.className = 'm-fly'; fly.style.cssText = `width:${from.w}px;height:${from.h}px;border-radius:30%;transform-origin:0 0`;
    setHTML(fly, avatarSVG('ines')); this.layer.appendChild(fly);
    const sv = getComputedStyle(slot), inkC = getComputedStyle(this.screen).getPropertyValue('--ink').trim(), onC = getComputedStyle(this.screen).getPropertyValue('--on-role').trim();
    const A = [];
    const midX = (from.x + to.x) / 2, midY = Math.min(from.y, to.y) - 40;
    A.push(anim(fly, [{ transform: `translate(${from.x}px,${from.y}px)` }, { transform: `translate(${midX}px,${midY}px) scale(1.08)`, offset: .45 }, { transform: `translate(${to.x}px,${to.y}px) scale(${to.w / from.w})` }], { ease: 'snap', dur: 440 }));
    A.push(anim(fly, [{ opacity: 1 }, { opacity: 0 }], { dur: 1, delay: 440 }));
    A.push(anim($('.av', req), [{ opacity: 1 }, { opacity: 0 }], { dur: 1 }));
    A.push(anim($('.fill', slot), [{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)' }], { ease: 'standard', dur: 360, delay: 80 }));
    A.push(anim($('.hatch', slot), [{ opacity: 1 }, { opacity: 0 }], { dur: 160, delay: 300 }));
    A.push(anim($('.ring', slot), [{ opacity: 1 }, { opacity: 0 }], { dur: 160, delay: 300 }));
    A.push(anim(slot, [{ color: inkC }, { color: onC }], { dur: 120, delay: 300, ease: 'linear' }));
    A.push(anim($('.s-av .ghost', slot), [{ opacity: .55 }, { opacity: 0 }], { dur: 1, delay: 0 }));
    A.push(anim($('.s-av .real', slot), [{ opacity: 0 }, { opacity: 1 }], { dur: 1, delay: 440 }));
    A.push(anim($('.now', slot), [{ opacity: 1 }, { opacity: 0 }], { dur: 100, delay: 280 }));
    A.push(anim($('.later', slot), [{ opacity: 0 }, { opacity: 1 }], { dur: 200, delay: 400 }));
    A.push(anim(slot, [{ transform: 'scale(1)' }, { transform: 'scale(.95)', offset: .3 }, { transform: 'scale(1.035)', offset: .66 }, { transform: 'scale(1)' }], { dur: 440, delay: 440, ease: 'cubic-bezier(.3,.6,.3,1)' }));
    const sl = $$('.slot', strip), si = sl.indexOf(slot);
    if (sl[si - 1]) A.push(anim(sl[si - 1], [{ transform: 'translateX(0)' }, { transform: 'translateX(-4px)', offset: .4 }, { transform: 'translateX(0)' }], { dur: 300, delay: 480 }));
    A.push(anim(req, [{ height: req.offsetHeight + 'px', opacity: 1, marginTop: '18px', paddingTop: '12px', paddingBottom: '12px' }, { height: '0px', opacity: 0, marginTop: '0px', paddingTop: '0px', paddingBottom: '0px' }], { ease: 'standard', dur: 320, delay: 440 }));
    A.push(anim($('.strip-lock', strip), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { ease: 'standard', dur: 240, delay: 700 }));
    A.push(anim($('[data-whodes]', page), [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1)' }], { ease: 'snap', delay: 820 }));
    this.moment = A;
    this.later(() => haptic('seat'), 440);
    this.later(() => { rollWords($('[data-coverage]', page), 'Team full'); strip.classList.add('full'); haptic('full'); }, 700);
    this.later(() => this.renderTabs && this.renderTabs(), 760);
  }
  /* Countdown (DS §7.12): "{h} h {min} min" each minute; seconds only in the event's final hour. */
  cdParts() {
    const t = this.state.team, s = t.left;
    if (t.final) return { a: String(Math.floor(s / 60)), ua: 'min', b: String(s % 60).padStart(2, '0'), ub: 's' };
    const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60;
    return h >= 48 ? { a: String(Math.floor(h / 24)), ua: 'd', b: String(h % 24), ub: 'h' } : { a: String(h), ua: 'h', b: String(m).padStart(2, '0'), ub: 'min' };
  }
  tick() {
    const t = this.state.team; if (t.left <= 0) return;
    t.left -= t.final ? 1 : 60;
    const p = this.cdParts();
    setCells($('[data-cd-a]', this.view), p.a, { instant: t.final && false });
    setCells($('[data-cd-b]', this.view), p.b, { instant: t.final });
  }
  bumpStrength(change) {
    const before = $('[data-score]', this.view).textContent;
    const w0 = {}; $$('[data-g]', this.view).forEach(b => w0[b.dataset.g] = b.style.width);
    change();
    const page = $('.page', this.view), top = page.scrollTop; this.render(); $('.page', this.view).scrollTop = top;
    const el = $('[data-score]', this.view), now = el.textContent; setCells(el, before, { instant: true }); setCells(el, now);
    $$('[data-g]', this.view).forEach(b => { const w1 = b.style.width; if (w0[b.dataset.g] === w1) return; b.style.transition = 'none'; b.style.width = w0[b.dataset.g]; void b.offsetWidth; b.style.transition = ''; b.style.width = w1; });
  }
  pickRole(tile) {
    const o = this.state.onb, r = tile.dataset.r; o.err = null;
    if (o.main === r) { o.main = null; }
    else if (!o.main) { o.main = r; o.also = o.also.filter(x => x !== r); }
    else if (o.also.includes(r)) o.also = o.also.filter(x => x !== r);
    else if (o.also.length >= 2) { o.err = 'You can add up to two more roles.'; haptic('error'); tile.classList.remove('shake'); void tile.offsetWidth; tile.classList.add('shake'); const h = $('[data-hint]', this.view); setHTML(h, roleHint(o)); h.classList.add('err'); return; }
    else o.also.push(r);
    haptic('select');
    $$('.role-tile', this.view).forEach(t => {
      const k = t.dataset.r, was = t.classList.contains('main'), wasAlso = t.classList.contains('also');
      t.classList.toggle('main', o.main === k); t.classList.toggle('also', o.also.includes(k));
      t.setAttribute('aria-pressed', o.main === k || o.also.includes(k));
      $('.rt-tag', t).textContent = o.main === k ? 'Main' : 'Also';
      if (k === r && !RM.on && (o.main === k || o.also.includes(k)) && !(was || wasAlso)) anim($('.stk', t), [{ transform: `rotate(${ROLES[k].tilt - 24}deg) scale(1.35) translateY(-6px)` }, { transform: `rotate(${ROLES[k].tilt}deg) scale(1)` }], { ease: 'celebrate', dur: 420, fill: 'none' });
      if (o.main === k && !was && !RM.on) anim($('.rt-fill', t), [{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)' }], { ease: 'standard', dur: 320, fill: 'none' });
    });
    const h = $('[data-hint]', this.view); setHTML(h, roleHint(o)); h.classList.remove('err');
    $('.steps i.cur', this.view).style.setProperty('--sp', o.main ? 1 : 0);
    $('[data-act="onbnext"]', this.view).disabled = !o.main;
    const ys = $('[data-yourslot]', this.view); setHTML(ys, yourSlot(o));
    const m = $('[data-main]', ys);
    if (m && r === o.main && !RM.on) { m.prepend(frag('<span class="fill" style="clip-path:inset(0 100% 0 0)"></span>')); m.style.background = 'transparent'; const a = anim($('.fill', m), [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], { ease: 'standard', dur: 340 }); a.onfinish = () => { m.style.background = ''; }; }
  }
  onbGo(step, dir = 'push') { const o = this.state.onb; o.step = step; o.err = null; this.render(dir); }

  /* ---------- input ---------- */
  onInput(e) { const t = e.target; if (t.matches('[data-q]')) this.renderSearch(t.value); }
  renderSearch(q) {
    const box = $('[data-results]', this.layer); if (!box) return;
    const s = q.trim().toLowerCase(), ids = ALL_ORDER.filter(id => !s || (EVENTS[id].name + ' ' + EVENTS[id].city + ' ' + EVENTS[id].kind).toLowerCase().includes(s));
    setHTML(box, ids.length ? ids.map(id => `<button class="sheet-row ev-scope" style="${evVars(id)}" data-act="openev" data-id="${id}">${poster(id, 40, 50, '', 'span', 'style="width:40px;height:50px;border-radius:9px;flex:none"')}<span class="sheet-row-m"><b>${EVENTS[id].name}</b><span>${EVENTS[id].days}, ${EVENTS[id].city}</span></span>${icon('chevR', { size: 18 })}</button>`).join('') : `<p class="empty-row" style="padding:12px 0">No events match.</p>`);
  }
  onSubmit(e) {
    const lf = e.target.closest('form[data-linkform]');
    if (lf) { e.preventDefault(); this.addLink(lf); return; }
    const f = e.target.closest('form[data-chat]'); if (!f) return; e.preventDefault();
    const ta = $('textarea', f), v = ta.value.trim(); if (!v) return;
    (this.state.sent[f.dataset.chat] ||= []).push(v); ta.value = '';
    const body = $('.convo-body', this.view); const b = document.createElement('div'); b.className = 'bub me'; b.textContent = v; body.appendChild(b); body.scrollTop = body.scrollHeight;
    if (!RM.on) anim(b, [{ transform: 'translateY(8px) scale(.98)', opacity: 0 }, { transform: 'none', opacity: 1 }], { ease: 'snap', fill: 'none' });
  }
  addLink(form) {
    const inp = $('input', form), raw = inp.value.trim(), msg = $('[data-linkmsg]', this.view); if (!raw) return;
    const domain = raw.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase();
    if (/tinder|bumble|hinge|onlyfans|fansly/.test(domain)) { msg.textContent = `That link can’t go on ${APP_NAME}.`; haptic('error'); return; }
    const kind = LINK_KINDS.find(k => k[3].replace('https://', '').split('/')[0] && domain.includes(k[3].split('/')[0].replace('.com', '').replace('.org', '').replace('.co', '').replace('.net', '').replace('.io', ''))) || LINK_KINDS[7];
    msg.textContent = `Checking ${domain}`;
    const btn = $('button', form); btn.disabled = true;
    setTimeout(() => {
      const cant = domain.includes('behance');
      this.state.onb.links.push({ domain: raw.replace(/^https?:\/\//, ''), glyph: kind[2], ok: !cant });
      haptic(cant ? 'error' : 'select'); this.render();
      const m = $('[data-linkmsg]', this.view); if (m) m.textContent = cant ? `We can’t check ${domain} links. It’ll show on your profile but won’t count.` : '';
    }, RM.on ? 200 : 650);
  }
  onKey(e) {
    if (!this.deck || e.target.matches('input,textarea')) return;
    if (e.key === 'ArrowLeft') { this.deck.button(-1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { this.deck.button(1); e.preventDefault(); }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') { this.deck.undo(); e.preventDefault(); }
  }
  switchScope(sc) {
    if (sc === this.state.scope) return;
    const band = $('.dc-band', this.view), from = band ? getComputedStyle(band).backgroundColor : null;
    this.hideUndo(true);
    if (sc !== 'anyone') this.state.lastEvent = sc;
    this.state.scope = sc; haptic('select'); this.render();
    const nb = $('.dc-band', this.view);
    if (nb && from && !RM.on) { const to = getComputedStyle(nb).backgroundColor; anim(nb, [{ backgroundColor: from }, { backgroundColor: to }], { dur: 400, ease: 'linear', fill: 'none' }); }
  }

  /* ---------- clicks ---------- */
  onClick(e) {
    const tab = e.target.closest('[data-tab]');
    if (tab) { this.setTab(tab.dataset.tab); return; }
    const op = e.target.closest('[data-open]');
    if (op) { e.preventDefault(); this.open(op.dataset.open); return; }
    const a = e.target.closest('[data-act]'); if (!a) return;
    const act = a.dataset.act, id = a.dataset.id, st = this.state;
    if (a.tagName === 'A') e.preventDefault();
    switch (act) {
      case 'back': this.back(); break;
      case 'closesheet': this.closeSheet(); break;
      case 'copy': this.copy(a); break;
      case 'nshare': if (navigator.share) navigator.share({ title: a.dataset.t, url: a.dataset.url }).catch(() => {}); else this.copy(a); break;
      case 'link': this.linkSheet(a.dataset.url); break;
      case 'ics': this.ics(id); this.closeSheet(); break;
      case 'cal': this.calSheet(id); break;
      case 'share': this.shareSheet(id); break;
      case 'wk': st.wk = a.dataset.k; haptic('select'); { const page = $('.page', this.view); this.render(); if (st.wk !== 'all') $('.page', this.view).scrollTop = 0; } break;
      case 'rowsave': { const s = st.saved[id] = !st.saved[id]; if (!s) delete st.registered[id]; a.setAttribute('aria-pressed', s); a.setAttribute('aria-label', s ? 'Saved' : 'Save'); setHTML(a, icon('save', { filled: s, size: 20 })); haptic('select'); if (!RM.on) anim(a, [{ transform: 'scale(.86)' }, { transform: 'scale(1)' }], { ease: 'snap', fill: 'none' }); break; }
      case 'save': {
        if (st.joined[id]) { a.animate([{ transform: 'translateX(-3px)' }, { transform: 'none' }], { duration: 160 }); break; }
        const s = st.saved[id] = !st.saved[id]; if (!s) delete st.registered[id];
        haptic('select'); this.rerenderEvent(id); const nb = $('[data-act="save"]', this.evRoot()); if (nb && !RM.on) anim(nb, [{ transform: 'scale(.86)' }, { transform: 'scale(1)' }], { ease: 'snap', fill: 'none' }); break;
      }
      case 'join': this.join(a, id); break;
      case 'reg': this.toggleReg(a, id); break;
      case 'search': this.openSheet(`<h3>Search</h3><input class="field" type="search" data-q placeholder="Event, city or kind" aria-label="Search events"><div data-results></div>`, (sh) => { this.renderSearch(''); setTimeout(() => $('input', sh).focus({ preventScroll: true }), 60); }); break;
      case 'openev': this.closeSheet(true); this.open(`event:${id}`); break;
      case 'inbox': this.openSheet(`<h3>Inbox</h3>${[['kofi', 'Kofi asked for the Product slot', 'Night Tram, 2 h ago', 'gotoTeams'], ['seoul', 'Seoul Night Build changed its venue', 'Changed by the organiser, yesterday', 'openev']].map(([w, b, s, act]) => `<button class="sheet-row" data-act="${act}" data-id="${w}">${w === 'kofi' ? av(w) : `<span class="ev-scope" style="${evVars(w)}">${poster(w, 42, 42, '', 'span', 'style="width:42px;height:42px;border-radius:12px;display:block"')}</span>`}<span class="sheet-row-m"><b>${b}</b><span>${s}</span></span>${icon('chevR', { size: 18 })}</button>`).join('')}`); break;
      case 'gotoTeams': this.closeSheet(true); this.setTab('teams'); break;
      case 'scope': {
        const sc = a.dataset.scope;
        if (sc !== 'anyone' && st.scope !== 'anyone') { this.evSwitch(); break; }
        this.switchScope(sc); break;
      }
      case 'pickscope': { this.closeSheet(true); this.switchScope(a.dataset.scope); break; }
      case 'pass': this.deck && this.deck.button(-1); break;
      case 'int': this.deck && this.deck.button(1); break;
      case 'later': this.deck && this.deck.save(); break;
      case 'undo': this.hideUndo(); this.deck && this.deck.undo(); break;
      case 'mode': { const d = this.deckState(); d.mode = d.mode === 'cards' ? 'list' : 'cards'; this.render(); break; }
      case 'lpass': case 'lint': { const dir = act === 'lint' ? 1 : -1, d = this.deckState(); const from = relRect($(`.dlist li:nth-child(${d.list.indexOf(id) + 1}) .av`, this.view), this.screen); d.decided[id] = dir; haptic(dir > 0 ? 'interested' : 'pass'); this.renderList(); if (dir > 0) this.maybeMutual(id, from); break; }
      case 'keep': this.endMoment(() => this.afterMoment(false)); break;
      case 'sayhi': this.endMoment(() => this.afterMoment(true, id)); break;
      case 'iiy': { const sc = st.scope === 'anyone' ? 'anyone' : st.lastEvent; const sh = this.openSheet(`<h3>Interested in you</h3>${INTERESTED_IN_YOU.map(w => `<div class="sheet-row" style="${roleVars(PEOPLE[w].role)}">${av(w)}<span class="sheet-row-m"><b>${PEOPLE[w].name}</b><span style="color:var(--rct);font-weight:650">${ROLES[PEOPLE[w].role].name}</span></span><button class="btn sm btn-acc" data-act="iiyback" data-id="${w}">Interested</button></div>`).join('')}`); sh.classList.add('ev-scope'); sh.style.cssText += ';' + evVars(sc); break; }
      case 'iiyback': a.replaceWith(frag(`<span class="t-small" style="font-weight:700;color:var(--ink)">${st.scope === 'anyone' ? 'Connected' : 'Said yes too'}</span>`)); haptic('interested'); break;
      case 'report': this.openSheet(`<h3>${PEOPLE[id].first}</h3><button class="sheet-row" data-act="closesheet">${icon('flag')}<span class="sheet-row-m"><b>Report something on this card</b><span>Goes to a person on our team, not ${PEOPLE[id].first}</span></span></button><button class="sheet-row" data-act="closesheet">${icon('pass')}<span class="sheet-row-m"><b>Block ${PEOPLE[id].first}</b><span>You stop seeing each other everywhere</span></span></button>`); break;
      case 'accept': this.fillSlot(); break;
      case 'decline': st.team.declined = true; this.render(); break;
      case 'check': { const i = +a.dataset.i, c = st.team.check; c[i] = !c[i]; a.setAttribute('aria-checked', c[i]); a.closest('li').classList.toggle('done', c[i]); setCells($('[data-ccount]', this.view), c.filter(Boolean).length); haptic('select'); if (c[i] && !RM.on) anim(a, [{ transform: 'scale(.8)' }, { transform: 'scale(1)' }], { ease: 'snap', fill: 'none' }); break; }
      case 'teammore': this.openSheet(`<h3>Night Tram</h3>${[['edit', 'Edit roles and slots'], ['share', 'Share team link'], ['person', 'Transfer captain'], ['pass', 'Leave team']].map(([i, l]) => `<button class="sheet-row" data-act="closesheet">${icon(i)}<span class="sheet-row-m"><b>${l}</b></span></button>`).join('')}`); break;
      case 'pv': st.you.view = a.dataset.v; { const top = $('.page', this.view).scrollTop; this.render(); $('.page', this.view).scrollTop = top; } break;
      case 'tagline': this.openSheet(`<h3>Tagline</h3><input class="field" maxlength="60" placeholder="Frontend for transit and maps" data-tagline aria-label="Tagline"><div class="sheet-act"><button class="btn btn-line" data-act="closesheet">Cancel</button><button class="btn btn-ink" data-act="savetag">Save</button></div>`); break;
      case 'savetag': { const v = $('[data-tagline]', this.layer).value.trim() || 'Frontend for transit and maps'; this.closeSheet(); setTimeout(() => this.bumpStrength(() => st.you.tagline = v), 180); break; }
      case 'addproject': this.openSheet(`<h3>New project</h3><input class="field" placeholder="Title" data-ptitle aria-label="Project title"><input class="field" placeholder="What it does, in a line" aria-label="Summary"><div class="sheet-act"><button class="btn btn-line" data-act="closesheet">Cancel</button><button class="btn btn-ink" data-act="saveproj">Save</button></div>`); break;
      case 'saveproj': this.closeSheet(); setTimeout(() => this.bumpStrength(() => st.you.project = true), 180); break;
      case 'prompt': this.openSheet(`<h3>Answer a prompt</h3>${['I’m the teammate who…', 'The part I always volunteer for…', 'A problem I’d love to solve…'].map(q => `<button class="sheet-row" data-act="closesheet">${icon('note')}<span class="sheet-row-m"><b>${q}</b></span>${icon('chevR', { size: 18 })}</button>`).join('')}`); break;
      case 'howto': this.openSheet(`<h3>How strength works</h3><div class="howto">A checklist of what teammates use to decide. It isn’t a rating of you, and nobody else sees it.<table>${[['Basics', 50, [['Avatar', 5], ['Name and username', 5], ['Main role', 10], ['Three skills', 10], ['First prompt', 10], ['Hackathons so far', 5], ['Languages', 5]]], ['Your work', 30, [['GitHub or a work link', 15], ['First project', 15]]], ['Depth', 20, [['Second prompt', 5], ['Third prompt', 5], ['Themes', 5], ['Tagline', 5]]]].map(([g, w, items]) => `<tr class="grp"><td>${g}</td><td>${w}</td></tr>` + items.map(([l, n]) => `<tr><td>${l}</td><td>${n}</td></tr>`).join('')).join('')}</table>Live at 50, Shows your work at 75, Complete at 100.</div>`); break;
      case 'edit': this.openSheet(`<h3>${esc(a.dataset.sec)}</h3><p class="howto">Saves as you go. Changes show on your card right away.</p><div class="sheet-act"><button class="btn btn-ink" data-act="closesheet">Done</button></div>`); break;
      case 'bt': { const k = a.dataset.k, b = st.onb.build; b.has(k) ? b.delete(k) : b.add(k); st.onb.err = null; haptic('select'); a.setAttribute('aria-pressed', b.has(k)); if (b.has(k) && !RM.on) anim(a, [{ transform: 'scale(.96)' }, { transform: 'scale(1)' }], { ease: 'snap', fill: 'none' }); const h = $('[data-hint]', this.view); h.classList.remove('err'); setHTML(h, b.size ? `<b>${b.size} picked.</b> Pick as many as are true.` : 'Pick as many as are true.'); const nx = $('[data-act="onbnext"]', this.view); nx.setAttribute('aria-disabled', !b.size); $('.steps i.cur', this.view).style.setProperty('--sp', b.size ? 1 : 0); break; }
      case 'onbnext': {
        const o = st.onb;
        if (o.step === 'build') { if (!o.build.size) { o.err = 'Pick at least one.'; haptic('error'); const h = $('[data-hint]', this.view); h.textContent = o.err; h.classList.add('err'); break; } this.onbGo('connect'); break; }
        if (o.step === 'connect') { this.onbGo('role'); break; }
        if (o.step === 'role') { this.onbGo('skills'); break; }
        break;
      }
      case 'nothing': this.onbGo('role'); break;
      case 'onbback': { const o = st.onb, prev = { connect: 'build', role: 'connect', skills: 'role' }[o.step]; if (prev) this.onbGo(prev, 'pop'); else if (!RM.on) anim(a, [{ transform: 'translateX(-4px)' }, { transform: 'none' }], { ease: 'snap', fill: 'none' }); break; }
      case 'connect': {
        const k = a.dataset.k; a.disabled = true; setHTML(a, `<span style="display:inline-flex;gap:2px">${'<i style="width:4px;height:12px;border-radius:1px;background:currentColor;opacity:.5"></i>'.repeat(3)}</span>Connect`);
        setTimeout(() => { st.onb.acc[k] = true; haptic('select'); this.render(); }, RM.on ? 150 : 700); break;
      }
      case 'kind': { const k = LINK_KINDS.find(x => x[0] === a.dataset.k), inp = $('[data-linkin]', this.view); inp.value = k[3]; inp.focus(); haptic('select'); break; }
      case 'role': this.pickRole(a); break;
      case 'skill': { const s = a.dataset.s, k = st.onb.skills; k.includes(s) ? k.splice(k.indexOf(s), 1) : k.push(s); haptic('select'); this.render(); break; }
      case 'onbdone': this.state.onb = freshState({ onb: st.onb.start }).onb; this.render('pop'); break;
    }
  }
  evSwitch() {
    const cur = this.state.lastEvent;
    this.openSheet(`<h3>Discover in</h3>${['anyone', 'lisbon', 'osw', 'seoul'].map(ev => {
      const sub = ev === 'anyone' ? 'Builders open to future teams' : ev === 'lisbon' ? `${EVENTS.lisbon.pool} in the pool` : ev === 'osw' ? 'In the pool. Deck opens Sat 5 Dec' : 'Saved. Join the pool to see who’s going';
      const ok = ev === 'anyone' || ev === 'lisbon';
      return `<button class="sheet-row ev-scope" style="${evVars(ev)}" data-act="${ok ? 'pickscope' : (ev === 'seoul' ? 'openev' : 'noop')}" data-scope="${ev}" data-id="${ev}">${ev === 'anyone' ? `<span style="width:42px;height:42px;border-radius:12px;background:var(--eb);color:var(--ei);display:grid;place-items:center;flex:none">${icon('slot')}</span>` : poster(ev, 42, 42, '', 'span', 'style="width:42px;height:42px;border-radius:12px;display:block;flex:none"')}<span class="sheet-row-m"><b>${EVENTS[ev].name}</b><span>${sub}</span></span>${ev === cur && this.state.scope !== 'anyone' ? icon('check') : ''}</button>`;
    }).join('')}`);
  }
  maybeMutual(id, fromRect) {
    const any = this.state.scope === 'anyone', p = PEOPLE[id];
    if (any ? (p.anyMutual && !this.state.matched[id]) : (p.mutual && !this.state.matched[id])) { any ? this.connectMoment(id) : this.matchMoment(id, fromRect); return true; }
    return false;
  }
  afterMoment(sayHi, id) {
    const any = this.state.scope === 'anyone', last = Object.keys(this.state.matched).at(-1);
    if (any) { const ppl = this.state.people; if (!ppl.some(s => s.who === last)) ppl.splice(ppl.length - 1, 0, { role: PEOPLE[last].role, who: last }); }
    else this.deckState().pencil = last;
    if (sayHi) { this.toChat(id); return; }
    this.updateStrip();
    if (!RM.on) { const s = any ? $$('[data-strip] .slot.filled', this.view).at(-1) : $('[data-strip] .slot.pencil', this.view); if (s) anim(s, [{ transform: 'scale(1.06)' }, { transform: 'none' }], { ease: 'snap', fill: 'none' }); }
    this.renderTabs && this.renderTabs();
  }
}
const ICS_UTC = { lisbon: ['20261107T090000Z', '20261108T170000Z'], seoul: ['20261121T100000Z', '20261122T040000Z'], lagos: ['20261114T080000Z', '20261115T170000Z'], toronto: ['20261128T140000Z', '20261129T220000Z'], kl: ['20261205T010000Z', '20261206T090000Z'], osw: ['20261212T140000Z', '20261214T140000Z'], ctf: ['20261114T090000Z', '20261115T210000Z'], jam: ['20261127T170000Z', '20261129T170000Z'] };

/* ---------- Phone ---------- */
const TABS = [['events', 'Events'], ['discover', 'Discover'], ['teams', 'Teams'], ['chats', 'Chats'], ['you', 'You']];
class Phone extends App {
  constructor(host, start, opts = {}) {
    super();
    this.kind = 'phone'; this.host = host; this.opts = opts;
    this.stack = { events: ['events'], discover: ['discover'], teams: ['team'], chats: ['chats'], you: ['you'] };
    this.onb = start.startsWith('onb');
    this.state = opts.state || freshState({ scope: start === 'anyone' ? 'anyone' : 'lisbon', onb: this.onb ? start.split('-')[1] : 'build' });
    if (start === 'event') { this.tab = 'events'; this.stack.events.push(`event:${opts.event || 'seoul'}`); }
    else this.tab = { events: 'events', discover: 'discover', anyone: 'discover', team: 'teams', teams: 'teams', you: 'you', chats: 'chats' }[start] || 'events';
    if (opts.chat) this.stack.chats.push(`chat:${opts.chat}`);
    this.build(); this.render();
  }
  build() {
    setHTML(this.host, `<div class="screen ${this.onb || this.opts.embedded ? 'no-tabs' : ''}">
      <div class="sb ev-scope"><span class="sb-time">9:41</span><span class="sb-island"></span><span class="sb-r">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden="true"><path d="M8 2.6c2.3 0 4.4.9 6 2.4l1.2-1.3A10.4 10.4 0 0 0 8 .8 10.4 10.4 0 0 0 .8 3.7L2 5c1.6-1.5 3.7-2.4 6-2.4Zm0 3.6c1.3 0 2.5.5 3.4 1.3l1.2-1.3A6.7 6.7 0 0 0 8 4.4c-1.8 0-3.4.7-4.6 1.8l1.2 1.3c.9-.8 2.1-1.3 3.4-1.3Zm0 3.5c-.6 0-1.1.2-1.5.6L8 12l1.5-1.7c-.4-.4-.9-.6-1.5-.6Z"/></svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none" aria-hidden="true"><rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="18" height="9" rx="2" fill="currentColor"/><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity=".45"/></svg>
      </span></div>
      <div class="view"></div><nav class="tabbar" aria-label="Tabs"></nav><div class="layer"></div><div class="home-ind"></div></div>`);
    this.screen = $('.screen', this.host); this.view = $('.view', this.screen); this.layer = $('.layer', this.screen);
    this.tabbar = $('.tabbar', this.screen); this.sb = $('.sb', this.screen);
    this.screen.addEventListener('click', (e) => this.onClick(e));
    this.screen.addEventListener('input', (e) => this.onInput(e));
    this.screen.addEventListener('submit', (e) => this.onSubmit(e));
    this.screen.addEventListener('keydown', (e) => this.onKey(e));
  }
  route() { return this.onb ? 'onb' : this.stack[this.tab].at(-1); }
  open(r) { this.stack[this.tab].push(r); this.render('push'); }
  back() { if (this.stack[this.tab].length > 1) { this.stack[this.tab].pop(); this.render('pop'); } }
  setTab(t) {
    if (this.opts.embedded && this.opts.onTab && t !== this.tab) { this.opts.onTab(t); return; }
    if (t === this.tab) this.stack[t] = [this.stack[t][0]];
    this.tab = t; this.closeSheet(true); this.render();
  }
  toChat(id) { this.stack.chats = ['chats', `chat:${id}`]; if (this.opts.embedded && this.opts.onTab) { this.opts.onTab('chats', id); return; } this.tab = 'chats'; this.render(); }
  render(kind) {
    if (this.deck) { this.deck.destroy(); this.deck = null; }
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    this.hideUndo(true);
    const [name, arg] = this.route().split(':');
    setHTML(this.view, R[name](this, arg));
    this.sb.style.cssText = this.sbInk === 'band' ? evVars(this.sbEv || 'lisbon') + ';color:var(--ei)' : this.sbInk ? `color:${this.sbInk}` : '';
    this.renderTabs();
    this.after(name, arg);
    if ((kind === 'push' || kind === 'pop')) {
      if (RM.on) anim(this.view, [{ opacity: 0 }, { opacity: 1 }], { dur: 160, fill: 'none' });
      else { anim(this.view, [{ transform: `translateX(${kind === 'push' ? 60 : -60}px)` }, { transform: 'translateX(0)' }], { ease: 'standard', fill: 'none' }); anim(this.view, [{ opacity: 0 }, { opacity: 1 }], { dur: 210, fill: 'none' }); }
    }
  }
  renderTabs() {
    if (this.onb) return;
    const n = { discover: 3, teams: this.state.team.filled || this.state.team.declined ? 0 : 1, chats: 2 + Object.keys(this.state.matched).length };
    setHTML(this.tabbar, TABS.map(([t, l]) => {
      const cur = t === this.tab;
      return `<button class="tab" data-tab="${t}" ${cur ? 'aria-current="page"' : ''} aria-label="${l}${n[t] ? `, ${n[t]} new` : ''}"><span class="gwrap">${icon(t, { filled: cur })}${n[t] ? cntSVG(n[t]) : ''}</span><span>${l}</span></button>`;
    }).join(''));
  }
  after(name) {
    measureCells(this.view);
    $$('[data-fit]', this.view).forEach(el => fitText(el, 125, 75));
    $$('.strip .slot-l', this.view).forEach(el => fitText(el, 100, 75));
    $$('[data-fitband]', this.view).forEach(el => fitText(el, 110, 75));
    if (name === 'discover') { this.updateStrip(); if (this.deckState().mode === 'cards') this.deck = new Deck(this, $('.deck', this.view)); else this.renderList(); }
    if (name === 'team') this.timer = setInterval(() => this.tick(), this.state.team.final ? 1000 : 60000);
    if (name === 'chat') { const b = $('.convo-body', this.view); b.scrollTop = b.scrollHeight; }
    this.screen.classList.remove('sb-solid');
    const pg = $('.page', this.view); if (pg) pg.addEventListener('scroll', () => this.screen.classList.toggle('sb-solid', pg.scrollTop > 24), { passive: true });
  }
}

/* ---------- Deck: drag, threshold, fling, spring-back, promote, undo, save for later ---------- */
class Deck {
  constructor(ph, el) { this.ph = ph; this.el = el; this.s = ph.deckState(); this.any = ph.state.scope === 'anyone'; this.pos = { x: 0, y: 0 }; this.stackP = { p: 0 }; this.armed = false; this.sign = 1; this.layout(); }
  destroy() { this.anims && this.anims.forEach(a => a && a.stop && a.stop()); this.spring && this.spring.stop(); this.dead = true; }
  flush() {
    if (!this.committing) return;
    this.anims && this.anims.forEach(a => a && a.stop && a.stop()); this.anims = null;
    if (this.pendingFinish) { const f = this.pendingFinish; this.pendingFinish = null; f(); }
    else { this.committing = false; this.pos = { x: 0, y: 0 }; this.stackP.p = 0; this.setStack(0); this.apply(); }
  }
  ids() { return this.s.list.slice(this.s.i, this.s.i + 3); }
  layout() {
    const ids = this.ids();
    if (!ids.length) {
      setHTML(this.el, this.any
        ? `<div class="deck-end"><h2>You’ve seen everyone for today</h2><p>New builders show up here as they join.</p><button class="btn btn-line" data-act="mode">${icon('list', { size: 20 })}Browse people</button></div>`
        : `<div class="deck-end"><h2>That’s everyone new today</h2><p>New cards at 00:00 your time.</p><button class="btn btn-line" data-act="mode">${icon('list', { size: 20 })}Browse the list</button></div>`);
      this.cards = []; this.ph.previewSlot(null); this.syncButtons(); this.ph.onTop && this.ph.onTop(null); return;
    }
    setHTML(this.el, ids.map((id, i) => cardHTML(id, { depth: i, any: this.any })).reverse().join(''));
    this.cards = $$('.card', this.el).reverse();
    this.W = this.el.clientWidth; this.H = this.el.clientHeight;
    this.pos = { x: 0, y: 0 }; this.armed = false;
    this.cards.forEach((c, i) => { c.dataset.depth = i; c.style.zIndex = 10 - i; });
    this.setStack(0); this.apply();
    $$('[data-fit]', this.cards[0]).forEach(el => fitText(el, 125, 75));
    this.bind(this.cards[0]); this.syncButtons(); this.ph.previewSlot(null);
    this.ph.onTop && this.ph.onTop(ids[0]);
  }
  syncButtons() {
    const u = $('[data-act="undo"].sq', this.ph.view); if (u) u.disabled = !this.s.hist.length;
    const empty = !this.ids().length; $$('[data-act="pass"],[data-act="int"],[data-act="later"]', this.ph.view).forEach(b => b.disabled = empty);
  }
  tf(el, x, y, r, s) { el.style.transform = `translate3d(${x}px,${y}px,0) rotate(${r}deg) scale(${s})`; }
  setStack(p) {
    const [, c2, c3] = this.cards;
    if (c2) this.tf(c2, 0, lerp(10, 0, p), 0, lerp(.95, 1, p));
    if (c3) this.tf(c3, 0, lerp(20, 10, p), 0, lerp(.9, .95, p));
  }
  apply(exiting) {
    const top = this.cards[0]; if (!top) return;
    const W = this.W, x = this.pos.x;
    const r = RM.on || this.saving ? 0 : this.sign * clamp(x / W, exiting ? -1.5 : -1, exiting ? 1.5 : 1) * 12;
    this.tf(top, x, this.pos.y, r || 0, 1);
    const yes = smooth(.12 * W, .33 * W, x), no = smooth(.12 * W, .33 * W, -x);
    const sy = $('.stamp-yes', top), sn = $('.stamp-no', top);
    sy.style.opacity = yes; sy.style.transform = `scale(${lerp(.92, 1, yes)})`;
    sn.style.opacity = no; sn.style.transform = `scale(${lerp(.92, 1, no)})`;
    top.style.setProperty('--lift', clamp(Math.abs(x) / (.33 * W), 0, 1));
    if (!this.committing) this.setStack(Math.min(Math.abs(x) / (.33 * W), 1));
    const armed = Math.abs(x) >= .33 * W;
    if (!this.committing && armed !== this.armed) { this.armed = armed; haptic(armed ? 'armed' : 'disarm'); }
    if (!this.committing) this.ph.previewSlot(top.dataset.id, x > 0 ? smooth(.04 * W, .33 * W, x) : 0, x > 0 && armed);
  }
  bind(top) {
    this.sign = 1;
    top.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('.note-sheet')) return;
      if (this.committing) { this.flush(); return; }
      this.p0 = { x: e.clientX, y: e.clientY }; this.drag = false; this.samples = [{ x: e.clientX, y: e.clientY, t: performance.now() }];
      const rc = top.getBoundingClientRect(); this.sign = (e.clientY - rc.top) < rc.height * .6 ? 1 : -1;
      top.style.transformOrigin = this.sign > 0 ? '50% 100%' : '50% 0%';
      if (this.spring) { this.spring.stop(); this.spring = null; this.drag = true; try { top.setPointerCapture(e.pointerId); } catch (_) {} }
      this.base = { ...this.pos };
    });
    top.addEventListener('pointermove', (e) => {
      if (!this.p0) return;
      const dx = e.clientX - this.p0.x, dy = e.clientY - this.p0.y;
      if (!this.drag) {
        if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) { this.drag = true; this.ph.hideUndo(); try { top.setPointerCapture(e.pointerId); } catch (_) {} top.classList.add('dragging'); }
        else if (Math.abs(dy) > 10) { this.p0 = null; return; } else return;
      }
      e.preventDefault();
      this.samples.push({ x: e.clientX, y: e.clientY, t: performance.now() }); if (this.samples.length > 8) this.samples.shift();
      this.pos.x = this.base.x + dx; this.pos.y = this.base.y + dy * .6;
      this.apply();
    });
    const up = () => {
      if (!this.p0) return; const wasDrag = this.drag; this.p0 = null; this.drag = false; top.classList.remove('dragging');
      if (!wasDrag) return;
      const now = performance.now(), recent = this.samples.filter(s => now - s.t < 100), a = recent[0] || this.samples[0], b = this.samples.at(-1);
      const dt = Math.max(16, b.t - a.t) / 1000, v = { x: (b.x - a.x) / dt, y: (b.y - a.y) / dt };
      if (now - b.t > 80) { v.x = 0; v.y = 0; }
      const dx = this.pos.x, W = this.W;
      const reversed = Math.abs(v.x) > 300 && Math.sign(v.x) !== Math.sign(dx);
      const commit = !reversed && (Math.abs(dx) >= .33 * W || (Math.abs(v.x) >= 900 && Math.sign(v.x) === Math.sign(dx) && Math.abs(dx) >= .08 * W) || Math.abs(dx + .12 * v.x) >= .40 * W);
      if (commit) this.commit(Math.sign(dx) || 1, v); else this.springBack(v);
    };
    top.addEventListener('pointerup', up); top.addEventListener('pointercancel', up);
    top.addEventListener('click', (e) => { const like = e.target.closest('[data-like]'); if (like) { e.stopPropagation(); this.noteFor(like); } });
  }
  springBack(v) {
    if (RM.on) { this.pos = { x: 0, y: 0 }; this.apply(); return; }
    this.spring = runSpring(this.pos, { x: 0, y: 0 }, 'deckReturn', { x: v.x, y: v.y * .6 }, () => this.apply(), () => { this.spring = null; });
  }
  button(dir) { this.flush(); if (!this.cards[0]) return; this.sign = 1; this.cards[0].style.transformOrigin = '50% 100%'; this.commit(dir, { x: dir * 1600, y: 0 }, { synthetic: true }); }
  noteFor(like) {
    const top = this.cards[0]; if (!top || this.committing || !top.contains(like)) return;
    const sec = like.closest('.cs, .card-cover'), p = PEOPLE[top.dataset.id];
    const label = sec.classList.contains('card-cover') ? p.project.title : `“${$('.q', sec).textContent}”`;
    $$('.like[aria-pressed="true"]', top).forEach(l => l.setAttribute('aria-pressed', 'false')); $$('.cs.liked', top).forEach(s => s.classList.remove('liked'));
    like.setAttribute('aria-pressed', 'true'); setHTML(like, icon('interested', { filled: true, size: 20 })); if (sec.classList.contains('cs')) sec.classList.add('liked');
    haptic('select');
    let sh = $('.note-sheet', top); if (sh) sh.remove();
    top.append(frag(`<div class="note-sheet"><p>Interested, on <b>${label}</b></p><textarea placeholder="Add a note (optional)" aria-label="Note"></textarea><div class="note-row"><button class="btn sm btn-line" data-note="cancel">Cancel</button><button class="btn sm btn-acc" data-note="send">Send</button></div></div>`));
    sh = $('.note-sheet', top);
    if (!RM.on) anim(sh, [{ transform: 'translateY(100%)' }, { transform: 'none' }], { ease: 'sheet', fill: 'none' });
    $('textarea', sh).focus({ preventScroll: true });
    sh.addEventListener('click', (e) => {
      const b = e.target.closest('[data-note]'); if (!b) return; e.stopPropagation();
      if (b.dataset.note === 'cancel') { sh.remove(); like.setAttribute('aria-pressed', 'false'); setHTML(like, icon('interested', { size: 20 })); sec.classList.remove('liked'); return; }
      $('.stamp-yes span', top).textContent = 'Interested, with a note';
      sh.remove(); this.commit(1, { x: 1600, y: 0 }, { synthetic: true });
    });
  }
  commit(dir, v, o = {}) {
    const top = this.cards[0], id = top.dataset.id, W = this.W, p = PEOPLE[id];
    this.committing = true; this.spring && this.spring.stop(); this.spring = null;
    this.s.hist.push({ id, dir }); this.s.decided[id] = dir; this.syncButtons();
    haptic(dir > 0 ? 'interested' : 'pass');
    this.ph.previewSlot(id, dir > 0 ? 1 : 0, dir > 0);
    const mutual = dir > 0 && (this.any ? p.anyMutual : p.mutual) && !this.ph.state.matched[id];
    const avRect = mutual ? relRect($('.card-id .av', top), this.ph.screen) : null;
    let finished = false;
    const finish = () => { if (finished || this.dead) return; finished = true; this.pendingFinish = null; this.committing = false; this.s.i += 1; this.layout(); };
    this.pendingFinish = finish;
    if (!mutual) this.ph.showUndo(dir > 0 ? `Sent to ${p.first}` : 'Passed');
    if (RM.on) {
      const a = anim(top, [{ opacity: 1 }, { opacity: 0 }], { dur: 150 });
      a.onfinish = () => { if (finished) return; finish(); if (this.cards[0]) anim(this.cards[0], [{ opacity: 0 }, { opacity: 1 }], { dur: 200, fill: 'none' }); };
      if (mutual) this.ph.maybeMutual(id, avRect);
      return;
    }
    if (o.synthetic) this.pos.y = 0;
    const tx = dir * (1.2 * W + .2 * Math.abs(this.pos.x)), ty = this.pos.y + (o.synthetic ? -40 : .1 * v.y);
    let n = 0; const both = () => { if (++n === 2) finish(); };
    this.anims = [
      runSpring(this.pos, { x: tx, y: ty }, 'deckExit', { x: dir * Math.max(Math.abs(v.x), 1400), y: v.y }, () => this.apply(true), both, { until: (s) => Math.abs(s.x) > W * 1.12 }),
      runSpring(this.stackP, { p: 1 }, 'deckPromote', {}, (s) => this.setStack(s.p), () => { this.stackP.p = 0; both(); }, { eps: .004 }),
    ];
    if (mutual) this.ph.maybeMutual(id, avRect);
  }
  /* Save for later (P0-21): private, never notifies; the card lifts out upward and the saved count rolls. */
  save() {
    this.flush(); const top = this.cards[0]; if (!top) return;
    const id = top.dataset.id;
    this.committing = true; this.s.hist.push({ id, dir: 'save' }); this.s.decided[id] = 'save'; this.s.saved = (this.s.saved || 0) + 1; this.syncButtons();
    haptic('save'); this.ph.showUndo('Saved for later');
    const sn = $('[data-savedn]', this.ph.view); if (sn) sn.textContent = `${this.s.saved} saved`;
    let finished = false;
    const finish = () => { if (finished || this.dead) return; finished = true; this.pendingFinish = null; this.committing = false; this.saving = false; this.s.i += 1; this.layout(); };
    this.pendingFinish = finish;
    if (RM.on) { anim(top, [{ opacity: 1 }, { opacity: 0 }], { dur: 150 }).onfinish = () => { finish(); if (this.cards[0]) anim(this.cards[0], [{ opacity: 0 }, { opacity: 1 }], { dur: 200, fill: 'none' }); }; return; }
    this.saving = true; let n = 0; const both = () => { if (++n === 2) finish(); };
    this.anims = [
      runSpring(this.pos, { x: 0, y: -this.H * 1.25 }, 'deckExit', { x: 0, y: -1600 }, () => this.apply(true), both, { until: (s) => s.y < -this.H * 1.1 }),
      runSpring(this.stackP, { p: 1 }, 'deckPromote', {}, (s) => this.setStack(s.p), () => { this.stackP.p = 0; both(); }, { eps: .004 }),
    ];
  }
  undo() {
    this.flush();
    if (!this.s.hist.length) return;
    const last = this.s.hist.pop(); this.s.i -= 1; delete this.s.decided[last.id];
    if (last.dir === 'save') { this.s.saved -= 1; const sn = $('[data-savedn]', this.ph.view); if (sn) sn.textContent = `${this.s.saved} saved`; }
    if (this.ph.state.matched[last.id]) { delete this.ph.state.matched[last.id]; if (this.s.pencil === last.id) this.s.pencil = null; this.ph.state.people = this.ph.state.people.filter(s => s.who !== last.id); this.ph.updateStrip(); this.ph.renderTabs && this.ph.renderTabs(); }
    haptic('undo');
    this.layout();
    const top = this.cards[0];
    if (RM.on) { anim(top, [{ opacity: 0 }, { opacity: 1 }], { dur: 200, fill: 'none' }); return; }
    this.sign = 1; top.style.transformOrigin = '50% 100%';
    this.pos = last.dir === 'save' ? { x: 0, y: -1.2 * this.H } : { x: last.dir * 1.3 * this.W, y: -40 }; this.committing = true; this.saving = last.dir === 'save'; this.apply(true);
    this.stackP.p = 1; this.setStack(1);
    let n = 0; const both = () => { if (++n === 2) { this.committing = false; this.saving = false; this.apply(); } };
    this.anims = [
      runSpring(this.pos, { x: 0, y: 0 }, 'undo', {}, () => this.apply(true), both),
      runSpring(this.stackP, { p: 0 }, 'deckPromote', {}, (s) => this.setStack(s.p), () => { this.stackP.p = 0; both(); }, { eps: .004 }),
    ];
  }
}
