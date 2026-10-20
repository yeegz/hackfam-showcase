/* Hackfam · final · phone screens. Each returns markup for the current state; the App wires behaviour. */
const R = {};

/* ---------- Events home: weekend chips (C), wristbands for your events (C), poster-tinted rails (A) ---------- */
R.events = (app) => {
  app.sbInk = null;
  const st = app.state, wk = st.wk;
  const chips = `<div class="wk" role="group" aria-label="Weekends"><button class="all" data-act="wk" data-k="all" aria-pressed="${wk === 'all'}"><b>All</b></button>${WEEKENDS.map(([k, m, d]) => `<button data-act="wk" data-k="${k}" aria-pressed="${wk === k}" aria-label="${m} ${d}"><small>${m}</small><b>${d}</b></button>`).join('')}<button data-act="wk" data-k="later" aria-pressed="${wk === 'later'}"><small>Dec</small><b>Later</b></button></div>`;
  const head = `<div class="top"><h1 class="t-dl">Events</h1><div class="acts"><button class="icon-btn" data-act="search" aria-label="Search events">${icon('search')}</button><button class="bell-btn" data-act="inbox" aria-label="Inbox, 2 unread">${icon('bell')}<span class="n">2</span></button></div></div>`;
  if (wk !== 'all') {
    const ids = ALL_ORDER.filter(id => wk === 'later' ? false : EVENTS[id].wk === wk);
    const mine = ids.filter(id => st.joined[id]), rest = ids.filter(id => !st.joined[id]);
    const label = wk === 'later' ? 'Later' : WEEKENDS.find(w => w[0] === wk).slice(1).join(' ');
    return `<div class="page">${head}${chips}
      <div class="sec-h"><h2 class="t-title">${label}</h2><span class="t-meta">${ids.length ? `${ids.length} event${ids.length > 1 ? 's' : ''}` : ''}</span></div>
      ${mine.length ? `<div class="bands">${mine.map(id => wristband(id, { tag: 'button', attrs: `data-open="event:${id}"` })).join('')}</div>` : ''}
      <div class="evrows" style="padding-bottom:24px">${rest.map(id => evRow(id, st)).join('') || (mine.length ? '' : `<p class="empty-row">Nothing listed that weekend yet. <button class="link-btn" data-act="wk" data-k="all">Show all</button></p>`)}</div></div>`;
  }
  const months = { Nov: ALL_ORDER.filter(id => EVENTS[id].month === 'Nov'), Dec: ALL_ORDER.filter(id => EVENTS[id].month === 'Dec') };
  return `<div class="page">${head}${chips}
    <div class="sec-h"><h2 class="t-title">Your events</h2></div>
    <div class="bands">${['lisbon', 'osw'].map(id => wristband(id, { tag: 'button', attrs: `data-open="event:${id}" aria-label="${EVENTS[id].name}, ${EVENTS[id].inDays}"` })).join('')}</div>
    <div class="sec-h"><h2 class="t-title">For you</h2><button class="btn-quiet" data-act="wk" data-k="all">See all</button></div>
    <div class="rail">${FOR_YOU.map(id => evCard(id)).join('')}</div>
    <div class="sec-h" style="padding-bottom:0"><h2 class="t-title">All events</h2></div>
    ${Object.entries(months).map(([m, ids]) => `<p class="month-h">${m === 'Nov' ? 'November' : 'December'}</p><div class="evrows">${ids.map(id => evRow(id, st)).join('')}</div>`).join('')}
    <div style="height:24px"></div></div>`;
};

/* ---------- Event detail: poster-tinted hero (A), dual zones, the ladder, Join the pool → wristband snap (C) ---------- */
R.event = (app, id) => {
  const e = EVENTS[id], st = app.state, joined = !!st.joined[id], saved = !!st.saved[id] || joined, reg = !!st.registered[id];
  app.sbInk = 'band'; app.sbEv = id;
  const roles = { ...e.roles }; if (joined && !e.joined) roles.fe += 1;
  const pool = e.pool + (joined && !e.joined ? 1 : 0);
  const mapOpts = { lisbon: { label: 'LX Factory', water: 'Tejo', bridge: true }, seoul: { label: 'Seongsu-dong', water: 'Han river' }, lagos: { label: 'CcHub', water: 'Lagos Lagoon' }, toronto: { label: 'MaRS', water: 'Lake Ontario' }, kl: { label: 'Common Ground' }, jam: { label: 'Matadero', water: 'Manzanares' } }[id];
  const online = e.format === 'Online';
  const rung = (on, label, gl) => `<span class="rung ${on ? 'on' : ''}"><span class="rf"></span>${on ? icon('check', { size: 16 }) : ''}${label}</span>`;
  return `<div class="page ev-scope" style="${evVars(id)}">
    <div class="evd-hero">${poster(id, 358, 250)}
      <div class="evd-bar"><button class="fbtn" data-act="back" aria-label="Back">${icon('back')}</button><span class="sp"></span>
      <button class="fbtn" data-act="share" data-id="${id}" aria-label="Share">${icon('share')}</button></div></div>
    <div class="evd-head"><h1>${e.name}</h1><p class="t-meta">By ${e.host}, ${e.kind.toLowerCase() === 'hackathon' ? 'a hackathon' : e.kind}</p>
      <p class="evd-status ${e.soon ? 'em' : ''}" data-status>${joined ? (e.joined && id === 'lisbon' ? e.status : 'You’re in the pool, no team yet') : (reg ? 'Registered' : e.status)}</p></div>
    <ul class="facts">
      <li class="fact">${icon('clock', { size: 20 })}<div class="fact-m"><b>${e.whenEvent}${online ? '' : ` ${e.tzName}`}</b>${online ? `<span>${e.tzName}</span>` : e.whenYou ? `<span><strong>${e.whenYou}</strong></span>` : ''}</div><button class="mini" data-act="cal" data-id="${id}">${icon('calAdd', { size: 16 })}Add</button></li>
      <li class="fact">${icon(online ? 'globe' : 'venue', { size: 20 })}<div class="fact-m"><b>${online ? 'Online' : `${e.venue}, ${e.city}`}</b><span>${e.address}</span>${mapOpts ? `<div class="map">${mapSVG(326, 104, mapOpts)}</div>` : ''}</div></li>
      <li class="fact">${icon('teams', { size: 20 })}<div class="fact-m"><b>${e.team}, ${e.hours} hours</b><span>${e.cost}, ${e.lang}</span></div></li>
      ${e.regCloses ? `<li class="fact">${icon('cal', { size: 20 })}<div class="fact-m"><b>Registration closes ${e.regCloses}</b><span>On ${e.host}’s site</span></div></li>` : ''}
    </ul>
    <section class="you-at" data-youat><h2 class="t-title">You at this event</h2>
      <div class="rungs" role="list" aria-label="Saved, in the pool, registered">${rung(saved, 'Saved')}${rung(joined, 'In the pool')}${rung(reg, 'Registered')}</div>
      <p class="t-meta" style="margin-top:10px" data-ya-line>${joined ? `Your card is live in ${e.name}.` : `Joining the pool doesn’t register you for ${e.name}.`}</p>
      <div class="ya-row">${icon('ext', { size: 20 })}<div class="ya-m"><b>Register on ${e.host}</b><span>${e.regCloses ? `Closes ${e.regCloses}` : 'On the official site'}</span></div><button class="btn sm btn-line" data-act="link" data-url="${e.host.toLowerCase().replace(/[^a-z]+/g, '')}.org/register">Open</button></div>
      <div class="ya-row">${icon('check', { size: 20 })}<div class="ya-m"><b>I’ve registered</b><span>Only you and your team see this.</span></div><button class="toggle" role="switch" aria-checked="${reg}" aria-label="I’ve registered" data-act="reg" data-id="${id}"></button></div>
    </section>
    <section class="agg"><h2 class="t-title">The pool</h2>
      <p class="agg-big"><b class="cells" data-pool>${digits(pool)}</b> builders, <b>${e.teamsForming}</b> teams forming</p>
      ${rolebar(roles, 'lg', joined ? 'fe' : null)}
      <ul class="legend">${ROLE_ORDER.map(r => `<li style="${roleVars(r)}" class="${joined && r === 'fe' ? 'me' : ''}">${icon(r, { size: 18 })}${ROLES[r].short}<b class="cells" data-r="${r}">${digits(roles[r])}</b></li>`).join('')}</ul>
      ${e.known ? `<div class="known"><span class="facepile" style="--fp-ring:var(--canvas)">${e.known.map(k => av(k)).join('')}</span>Inês and 2 others you know are going</div>` : ''}
      <div class="openslots"><p>Open slots in forming teams</p><div class="strip m">${Object.entries(e.open).map(([r, n]) => `<div class="slot open" style="${roleVars(r)}"><span style="display:flex;align-items:center;gap:6px;color:var(--rct);min-width:0">${icon(r, { size: 18 })}<span class="slot-l" style="color:var(--ink)">${ROLES[r].short}</span></span><b style="color:var(--ink)">${n}</b><span class="ring"></span></div>`).join('')}</div></div>
    </section>
    <section class="about"><h2 class="t-title">About</h2><p>${e.about}</p></section>
  </div>
  <div class="evd-act ev-scope" style="${evVars(id)}">
    <div class="joinwrap" data-joinwrap>${joined
      ? wristband(id, { meta: `In the pool, ${e.dShort}`, holes: false, openClasp: app.snapping === id, right: `<button class="go" data-tab="discover">Discover${icon('arrowR', { size: 16 })}</button>` })
      : `<button class="btn btn-acc" data-act="join" data-id="${id}">${icon('interested', { size: 20 })}Join the pool</button>`}</div>
    <button class="icon-btn line" data-act="save" data-id="${id}" aria-pressed="${saved}" aria-label="${saved ? 'Saved' : 'Save'}" style="width:52px;height:52px;border-radius:14px">${icon('save', { filled: saved })}</button>
  </div>`;
};

/* ---------- Discover: scope switch {Event | Anyone}, strip, deck, actions ---------- */
R.discover = (app) => {
  const sc = app.state.scope, any = sc === 'anyone', ev = app.state.lastEvent, e = EVENTS[ev], d = app.deckState();
  app.sbInk = 'band'; app.sbEv = sc;
  return `<div class="dc ev-scope" style="${evVars(sc)}">
    ${R.band(app)}
    <div class="dc-team"><div class="strip-h" data-teaml></div><div class="strip m" data-strip></div></div>
    <div class="deck-wrap">${d.mode === 'cards' ? '<div class="deck" aria-live="polite"></div>' : '<ul class="dlist"></ul>'}</div>
    ${d.mode === 'cards' ? R.deckActs(app) : ''}
  </div>`;
};
R.band = (app) => {
  const sc = app.state.scope, any = sc === 'anyone', ev = app.state.lastEvent, e = EVENTS[ev];
  return `<div class="dc-band">
    <div class="dc-row">
      <div class="scope" role="tablist" aria-label="Discover in">
        <button class="ev" role="tab" aria-selected="${!any}" data-act="scope" data-scope="${ev}" aria-label="${e.name}${any ? '' : ', change event'}">${poster(ev, 64, 64)}<span class="scope-t"><b data-fitband>${e.name}</b><small>${e.pool} in the pool${any ? '' : icon('chevD', { size: 14 })}</small></span></button>
        <button class="any" role="tab" aria-selected="${any}" data-act="scope" data-scope="anyone">${any ? `<span class="scope-t"><b>Anyone</b><small>1,840 open</small></span>` : `${icon('slot', { size: 20 })}<b style="font-size:15px;font-weight:740">Anyone</b>`}</button>
      </div>
      <button class="iiy" data-act="iiy" aria-label="3 people interested in you"><span class="facepile">${INTERESTED_IN_YOU.map(id => av(id)).join('')}</span>3</button>
    </div></div>`;
};
R.deckActs = (app) => {
  const d = app.deckState();
  return `<div class="dc-act">
    <button class="sq" data-act="undo" aria-label="Undo last" ${d.hist.length ? '' : 'disabled'}>${icon('undo')}</button>
    <button class="btn btn-line" data-act="pass">${icon('pass', { size: 20 })}Pass</button>
    <button class="sq" data-act="later" aria-label="Save for later">${icon('save')}</button>
    <button class="btn btn-acc" data-act="int">${icon('interested', { size: 20 })}Interested</button>
  </div>`;
};

/* ---------- Team: slot strip and seat (A), condensed countdown (C), checklist, chat entry ---------- */
R.team = (app) => {
  const t = TEAM_DAY, e = EVENTS.lisbon, ts = app.state.team, filled = ts.filled, declined = ts.declined;
  app.sbInk = '#F6F0DA';
  const done = ts.check.filter(Boolean).length;
  const slots = t.slots.map((s) => {
    const rv = roleVars(s.role);
    if (s.who) return `<div class="slot filled" style="${rv}">${icon(s.role, { size: 18 })}${s.note ? `<span class="cap">${s.note}</span>` : ''}<div class="s-av">${av(s.who)}</div><div class="s-t"><b data-fit>${PEOPLE[s.who].first}</b><small>${ROLES[s.role].short}</small></div></div>`;
    if (filled) return `<div class="slot filled" style="${rv}">${icon(s.role, { size: 18 })}<div class="s-av">${av(s.request)}</div><div class="s-t"><b data-fit>${PEOPLE[s.request].first}</b><small>${ROLES[s.role].short}</small></div></div>`;
    if (declined) return `<div class="slot open" style="${rv}"><span class="hatch"></span>${icon(s.role, { size: 18 })}<div class="s-av"></div><div class="s-t"><b>${ROLES[s.role].short}</b><small>Open</small></div><span class="ring"></span></div>`;
    return `<div class="slot pencil" data-seat style="${rv}"><span class="fill"></span><span class="hatch"></span>${icon(s.role, { size: 18 })}<div class="s-av"><span class="av ghost">${avatarSVG(s.request)}</span><span class="av real" style="opacity:0">${avatarSVG(s.request)}</span></div><div class="s-t s-names"><span class="now"><b><span class="plate" style="padding:0 3px">${PEOPLE[s.request].first}?</span></b><small><span class="plate" style="padding:0 3px">Asked</span></small></span><span class="later"><b data-fit>${PEOPLE[s.request].first}</b><small>${ROLES[s.role].short}</small></span></div><span class="ring"></span></div>`;
  }).join('');
  const req = t.slots.find(s => s.request);
  const cd = app.cdParts();
  return `<div class="page ev-scope" style="${evVars('lisbon')}">
    <header class="tm-band">${lateLineSVG(390, 148)}<div class="tm-bar"><span class="tm-ev">${poster('lisbon', 24, 24)}${e.name}</span><button class="fbtn" data-act="teammore" aria-label="Team options">${icon('more')}</button></div></header>
    <div class="tm-head"><h1 data-fit>${t.name}</h1><p class="t-meta">Building ${t.project}, ${t.clock}</p></div>
    <section class="tm-clock" aria-label="Submissions close in ${cd.a} ${cd.ua} ${cd.b} ${cd.ub}">
      <div class="tm-clock-top"><span class="t-meta" style="font-weight:620;color:var(--ink)">Submissions close in</span><span class="t-small">${ts.final ? 'Event day, final hour' : 'Event day'}</span></div>
      <div class="cd"><span class="t-cd cells" data-cd-a>${digits(cd.a)}</span><small data-cd-ua>${cd.ua}</small><span class="t-cd cells" data-cd-b>${digits(cd.b)}</span><small data-cd-ub>${cd.ub}</small></div>
      <p class="cd-zones">Sun 8 Nov, 15:00 Lisbon · 16:00 your time</p>
      <div class="track" aria-hidden="true">${Array.from({ length: 32 }, (_, i) => { const el = ts.final ? 31 : 25; return `<i class="${i < el ? 'on' : i === el ? 'now' : ''}"></i>`; }).join('')}</div>
      <div class="track-l"><span>Sat 09:00</span><span>Sun 17:00</span></div>
    </section>
    <section class="tm-slots"><div class="tm-sec-h"><h2 class="t-title">Slots</h2><span class="count"><span class="wroll" data-coverage><span class="a">${filled ? 'Team full' : declined ? '3 of 4 roles filled' : '3 of 4 roles filled'}</span><span class="b"></span></span></span></div>
      <div class="strip l ${filled ? 'full' : ''}" data-tstrip>${slots}<span class="strip-lock"></span></div>
      ${filled || declined ? '' : `<div class="req" data-req>${av(req.request)}<div class="req-m"><b>${PEOPLE[req.request].name}</b><span>Asked for Design, matched Thu</span></div><button class="icon-btn line" data-act="decline" aria-label="Not now">${icon('pass', { size: 20 })}</button><button class="btn sm btn-acc" data-act="accept">Accept</button></div>`}
    </section>
    <section class="check"><div class="tm-sec-h"><h2 class="t-title">This weekend</h2><span class="count"><b class="cells" data-ccount>${digits(done)}</b><span style="margin-left:3px">of 6</span></span></div>
      <ul>${t.checklist.map((c, i) => `<li class="${ts.check[i] ? 'done' : ''}"><button class="cbox" role="checkbox" aria-checked="${ts.check[i]}" data-act="check" data-i="${i}" aria-label="${c.t}">${icon('check', { size: 16 })}</button><span class="check-t">${c.t}</span><span class="who">${c.who ? av(c.who) : `<span class="open-who"></span><span class="av" data-whodes style="opacity:${filled ? 1 : 0}">${avatarSVG('ines')}</span>`}</span></li>`).join('')}</ul></section>
    <section class="tlinks"><h2 class="t-title" style="margin-bottom:4px">Links</h2>${t.links.map(l => `<a href="#" data-act="link" data-url="${l.sub}">${icon(l.icon, { size: 20 })}<div class="tlinks-m"><b>${l.label}</b><span>${l.sub}</span></div>${icon('ext', { size: 18 })}</a>`).join('')}</section>
  </div>
  <div class="tm-dock"><button class="tm-chat" data-open="chat:team" aria-label="Team chat, 2 unread">${av('ifeoma')}<div class="tm-chat-m"><b>Team chat</b><span>Ifeoma: ${t.chat.text}</span></div><span class="n">2</span></button></div>`;
};

/* ---------- You: strength breakdown (B), role and kudos stickers (C), how others see you (A) ---------- */
R.you = (app) => {
  const p = PEOPLE.sami, st = app.state.you;
  app.sbInk = null;
  const work = 15 + (st.project ? 15 : 0), depth = 5 + (st.tagline ? 5 : 0), score = 50 + work + depth;
  const level = score >= 100 ? ['Complete', ''] : score >= 75 ? ['Shows your work', ''] : ['Live', 'People in your pools can see your card.'];
  const nextLv = score >= 100 ? '' : score >= 75 ? 'Complete at 100%' : 'Shows your work at 75%';
  const next = [];
  if (!st.project) next.push(['addproject', 'project', 'Add a project', 'About 2 min, shows at the top of your card', 15]);
  if (!st.tagline) next.push(['tagline', 'text', 'Add a tagline', 'About 30 s, shows under your name', 5]);
  next.push(['prompt', 'note', 'Answer another prompt', 'About 1 min, shows on your card', 5]);
  const seg = (k, label, have, max) => `<span class="st-seg" style="flex:${max} 1 0"><i><b data-g="${k}" style="width:${have / max * 100}%"></b></i><span>${label}<br><em>${have}/${max}</em></span></span>`;
  return `<div class="page">
    <div class="you-top"><span class="you-av">${av('sami')}${sticker('fe', 28)}</span><div class="you-top-m"><h1 data-fit>${p.name}</h1><p class="t-meta">@${p.handle}, ${p.city}</p></div><button class="btn sm btn-line" data-act="edit" data-sec="Basics">${icon('edit', { size: 18 })}Edit</button></div>
    <section class="strength" aria-label="Profile strength ${score} percent, ${level[0]}">
      <div class="st-top"><h2 class="t-title">Profile strength</h2><span class="st-num"><span class="t-numl cells" data-score>${digits(score)}</span><small>%</small></span></div>
      <div class="st-bar" aria-hidden="true">${seg('ready', 'Basics', 50, 50)}${seg('work', 'Your work', work, 30)}${seg('depth', 'Depth', depth, 20)}</div>
      <p class="st-level"><b>${level[0]}.</b> ${level[1]}</p>${nextLv ? `<p class="st-next-lv">${nextLv}</p>` : ''}
      ${next.slice(0, 2).map(n => `<button class="st-next" data-act="${n[0]}">${icon(n[1], { size: 20 })}<span class="st-next-m"><b>${n[2]}</b><span>${n[3]}</span></span><span class="gain">+${n[4]}%</span>${icon('chevR', { size: 18 })}</button>`).join('')}
      <p class="st-foot">${icon('lock', { size: 14 })}Only you can see this ·&nbsp;<button class="link-btn" data-act="howto">How this works</button></p>
    </section>
    <section class="lid" aria-label="Roles and kudos">
      <div class="lid-roles"><span class="lid-role">${sticker('fe', 40)}<span class="lr-t"><b>Frontend</b><span>Main role</span></span></span><span class="lid-role">${sticker('mob', 34)}<span class="lr-t"><b>Mobile</b><span>Also</span></span></span></div>
      <div class="kudos">${KUDOS.top.map(k => kudoHTML(k, '')).join('')}</div>
      <p class="kudos-l">Kudos from ${KUDOS.teammates} teammates across ${KUDOS.events} events</p>
    </section>
    <div class="pv-h"><h2 class="t-title">How others see you</h2><div class="seg" role="tablist"><button role="tab" aria-selected="${st.view === 'card'}" data-act="pv" data-v="card">Card</button><button role="tab" aria-selected="${st.view === 'full'}" data-act="pv" data-v="full">Full</button></div></div>
    <p class="as-seen">${icon('people', { size: 16 })}As seen in&nbsp;<b>Lisboa Build Weekend</b></p>
    ${st.view === 'card'
      ? `<div class="pv-card ev-scope" style="${evVars('lisbon')}">${cardHTML('sami', { preview: true, depth: 'pv' })}</div>`
      : `<div class="pv-full ev-scope" style="${evVars('lisbon')}">${profileHTML('sami').replace(/<ul class="why">[\s\S]*?<\/ul>/, '<div class="why"><span class="why-h">Reasons appear here</span><span class="pv-sample">Each person sees their own.</span></div>')}</div>`}
    <p class="pv-note">${icon('lock', { size: 14 })}Never shown: email, birth date, exact location, strength.</p>
    <div class="edit-list">${[['person', 'Basics', 'Name, photo, handle'], ['hackathon', 'What you build at', 'Hackathons, CTFs, open source'], ['fe', 'Roles', 'Frontend, also Mobile'], ['tag', 'Skills and themes', '4 skills'], ['note', 'Prompts', '1 of 3'], ['repo', 'Connected work', 'GitHub verified'], ['project', 'Projects', st.project ? '1' : 'None yet'], ['settings', 'Settings', '']].map(([i, b, s]) => `<button data-act="edit" data-sec="${b}">${icon(i, { size: 20 })}<b>${b}</b><span>${s}</span>${icon('chevR', { size: 18 })}</button>`).join('')}</div>
  </div>`;
};

/* ---------- Chats ---------- */
R.chats = (app) => {
  app.sbInk = null;
  const rows = [];
  if (app.state.matched.ines) rows.push(`<button data-open="chat:ines" class="unread" style="${roleVars('des')}">${av('ines')}<span class="clist-m"><b>Inês Carvalho</b><span>Said yes too in Lisboa Build Weekend</span></span><span class="clist-r"><time>now</time><span class="n">1</span></span></button>`);
  if (app.state.matched.hyunwoo) rows.push(`<button data-open="chat:hyunwoo" class="unread">${av('hyunwoo')}<span class="clist-m"><b>Park Hyun-woo</b><span>Connected. Ask each other onto any future team.</span></span><span class="clist-r"><time>now</time><span class="n">1</span></span></button>`);
  rows.push(`<button data-open="chat:team" class="unread ev-scope" style="${evVars('lisbon')}"><span class="team-glyph">${icon('teams', { filled: true })}</span><span class="clist-m"><b>Night Tram</b><span>Ifeoma: Arrivals API is up. Preview link is in the repo readme.</span></span><span class="clist-r"><time>10:32</time><span class="n">2</span></span></button>`);
  rows.push(`<button data-open="chat:kofi">${av('kofi')}<span class="clist-m"><b>Kofi Asante</b><span>Happy to pitch. What’s the idea?</span></span><span class="clist-r"><time>Thu</time></span></button>`);
  return `<div class="page"><div class="top"><h1 class="t-dl">Chats</h1></div><div class="clist">${rows.join('')}</div></div>`;
};
const CONVOS = {
  ines: { who: 'ines', sub: 'Design / UX, Porto', ctx: 'Said yes too in Lisboa Build Weekend', ev: 'lisbon', msgs: [], draft: 'Hi Inês, I’m Sami, frontend on Night Tram. Paragem is lovely. Want to talk about our Design slot?' },
  hyunwoo: { who: 'hyunwoo', sub: 'ML / AI, Lisbon', ctx: 'Connected in Anyone, today', ev: null, msgs: [], draft: 'Hi Hyun-woo, Seen is great. Up for a team at the next one?' },
  kofi: { who: 'kofi', sub: 'Product / Pitch, Lisbon', ctx: 'Said yes too in Lisboa Build Weekend, Thu', ev: 'lisbon', msgs: [['me', 'Hi Kofi, want to pitch for Night Tram? We’re building a late-night transit tracker.'], ['kofi', 'Happy to pitch. What’s the idea?']], draft: '' },
  team: { team: true, sub: '4 people, Lisboa Build Weekend', ctx: 'Team chat started Thu', ev: 'lisbon', msgs: [['kofi', 'Pitch outline is in the doc. Two minutes, one user, no slides.'], ['me', 'Board is wired to the mock feed.'], ['ifeoma', 'Arrivals API is up. Preview link is in the repo readme.']], draft: '' },
};
R.chat = (app, id) => {
  app.sbInk = null;
  const c = CONVOS[id], mine = app.state.sent[id] || [];
  const head = c.team
    ? `<span class="team-glyph ev-scope" style="${evVars('lisbon')};width:38px;height:38px;border-radius:12px">${icon('teams', { filled: true, size: 20 })}</span><div><b>Night Tram</b><span>${c.sub}</span></div>`
    : `${av(c.who)}<div><b>${PEOPLE[c.who].name}</b><span>${c.sub}</span></div>`;
  const msgs = c.msgs.map(([w, t]) => w === 'me' ? `<div class="bub me">${t}</div>` : `${c.team ? `<div class="bub-who">${PEOPLE[w].first}</div>` : ''}<div class="bub">${t}</div>`).join('') + mine.map(t => `<div class="bub me">${esc(t)}</div>`).join('');
  const ctx = c.ev ? `<span class="ctx ev-scope" style="${evVars(c.ev)}">${poster(c.ev, 26, 26)}${c.ctx}</span>` : `<span class="ctx"><span class="scope-tile" style="display:grid;place-items:center;box-shadow:inset 0 0 0 1.5px var(--ink)">${icon('slot', { size: 16 })}</span>${c.ctx}</span>`;
  return `<div class="convo">
    <div class="convo-top"><button class="icon-btn" data-act="back" aria-label="Back">${icon('back')}</button>${head}</div>
    <div class="convo-body">${ctx}${msgs}</div>
    <form class="composer" data-chat="${id}"><textarea aria-label="Message" placeholder="Message">${mine.length ? '' : c.draft}</textarea><button class="icon-btn" aria-label="Send">${icon('send')}</button></form>
  </div>`;
};

/* ---------- Onboarding: purpose first (P0-25), slot progress (A), role stickers (C) ---------- */
const ONB_STEP = { build: 2, connect: 3, role: 6, skills: 7 };
const SKILLS = { fe: ['React', 'TypeScript', 'Vue', 'CSS', 'Svelte', 'Accessibility', 'WebGL', 'Next.js'], be: ['Node', 'Go', 'Postgres', 'Python', 'Rust', 'Redis'], mob: ['Flutter', 'Swift', 'Kotlin', 'React Native'], ml: ['PyTorch', 'LLM apps', 'Vision', 'RAG'], data: ['SQL', 'dbt', 'Pandas', 'GIS'], des: ['Figma', 'Prototyping', 'Research', 'Motion'], prod: ['Pitching', 'Scoping', 'Interviews', 'Keynote'], hw: ['ESP32', 'Arduino', 'KiCad', 'CAD'] };
function stepsHTML(n, sp) {
  return `<div class="steps" role="progressbar" aria-valuemin="1" aria-valuemax="10" aria-valuenow="${n}" aria-label="Step ${n} of 10">${Array.from({ length: 10 }, (_, i) => `<i class="${i < n - 1 ? 'on' : i === n - 1 ? 'cur' : ''}" ${i === n - 1 ? `style="--sp:${sp}"` : ''}></i>`).join('')}</div>`;
}
R.onb = (app) => {
  app.sbInk = null;
  const o = app.state.onb, n = ONB_STEP[o.step];
  const top = (sp) => `<div class="onb-top"><button class="icon-btn" data-act="onbback" aria-label="Back">${icon('back')}</button>${stepsHTML(n, sp)}<span class="onb-n">${n} of 10</span></div>`;
  if (o.step === 'build') {
    return `<div class="onb">${top(o.build.size ? 1 : 0)}
      <div class="onb-body"><div class="onb-q"><h1>What do you build at?</h1><p class="onb-hint ${o.err ? 'err' : ''}" data-hint aria-live="polite">${o.err || (o.build.size ? `<b>${o.build.size} picked.</b> Pick as many as are true.` : 'Pick as many as are true.')}</p></div>
      <div class="bt-grid" role="group" aria-label="What do you build at">${BUILD_TYPES.map(([k, l]) => `<button class="bt" data-act="bt" data-k="${k}" aria-pressed="${o.build.has(k)}">${icon(k)}<b>${l}</b><span class="tick">${icon('check', { size: 16 })}</span></button>`).join('')}</div></div>
      <div class="onb-foot"><button class="btn btn-ink" style="flex:1" data-act="onbnext" aria-disabled="${!o.build.size}">Continue</button></div></div>`;
  }
  if (o.step === 'connect') {
    const order = connectOrder(o.build);
    const any = Object.values(o.acc).some(Boolean) || o.links.some(l => l.ok);
    return `<div class="onb">${top(any ? 1 : 0)}
      <div class="onb-body"><div class="onb-q"><h1>Connect your work</h1></div>
      <div class="conn">${order.map(k => { const a = ACCOUNTS[k], on = o.acc[k]; return `<div class="conn-row">${icon(a.glyph)}<div class="conn-m"><b>${a.name}</b>${on ? `<span class="ok">${a.verified ? `${icon('check', { size: 14 })}${a.done}, verified` : `${icon('check', { size: 14 })}${a.done}`}</span>` : a.sub ? `<span>${a.sub}</span>` : ''}</div>${on ? '' : `<button class="btn sm btn-line" data-act="connect" data-k="${k}">Connect</button>`}</div>`; }).join('')}</div>
      <div class="add-link"><h2>Add a link</h2>
        <form class="field-row" data-linkform novalidate><input type="text" inputmode="url" autocomplete="url" placeholder="Devpost, CTFtime, Kaggle, Dribbble, itch.io, your site" aria-label="Work link" data-linkin><button class="btn sm btn-line" style="height:50px;border-radius:14px">Add</button></form>
        <p class="t-small" data-linkmsg aria-live="polite" style="margin-top:6px;min-height:16px"></p>
        ${o.links.length ? `<ul class="added">${o.links.map(l => `<li>${icon(l.glyph, { size: 18 })}${esc(l.domain)}<span>${l.ok ? 'Self-reported' : 'Shows on your profile, doesn’t count'}</span></li>`).join('')}</ul>` : ''}
        <div class="kinds">${LINK_KINDS.map(([k, l, g]) => `<button class="chip" data-act="kind" data-k="${k}">${icon(g, { size: 16 })}${l}</button>`).join('')}</div>
      </div></div>
      <div class="onb-foot col"><button class="btn btn-ink" data-act="onbnext" ${any ? '' : 'disabled'}>Continue</button><button class="btn btn-quiet" data-act="nothing" style="height:44px">Nothing to show yet</button></div></div>`;
  }
  if (o.step === 'skills') {
    const list = [...SKILLS[o.main], ...o.also.flatMap(r => SKILLS[r].slice(0, 3))];
    return `<div class="onb">${top(Math.min(o.skills.length, 3) / 3)}
      <div class="onb-body"><div class="onb-q"><h1>Your top three skills</h1><p class="onb-hint" data-hint>${o.skills.length < 3 ? `${3 - o.skills.length} to go.` : `<b>Three picked.</b> Add more if they’re true.`}</p></div>
      <div class="kinds" style="padding:6px 16px 0;margin:0">${list.map(s => `<button class="chip" data-act="skill" data-s="${s}" aria-pressed="${o.skills.includes(s)}">${o.skills.includes(s) ? icon('check', { size: 16 }) : ''}${s}</button>`).join('')}</div></div>
      <div class="onb-foot"><div class="strip">${yourSlot(o)}</div><button class="btn btn-ink" data-act="onbdone" ${o.skills.length >= 3 ? '' : 'disabled'}>Continue</button></div></div>`;
  }
  return `<div class="onb">${top(o.main ? 1 : 0)}
    <div class="onb-body"><div class="onb-q"><h1>What do you do on a team?</h1><p class="onb-hint ${o.err ? 'err' : ''}" aria-live="polite" data-hint>${roleHint(o)}</p></div>
    <div class="demand ev-scope" style="${evVars('lisbon')}" aria-label="Teams at Lisboa Build Weekend need Design 9 and Product 6">${poster('lisbon', 64, 64, '', 'span', 'style="width:28px;height:28px;border-radius:8px;flex:none"')}<span>needs</span><span>${sticker('des', 24)}Design ×9</span><span>${sticker('prod', 24)}Product ×6</span></div>
    <div class="roles" role="group" aria-label="Roles">${ROLE_ORDER.map(r => `<button class="role-tile ${o.main === r ? 'main' : o.also.includes(r) ? 'also' : ''}" data-act="role" data-r="${r}" style="${roleVars(r)}" aria-pressed="${o.main === r || o.also.includes(r)}"><span class="rt-fill"></span>${sticker(r, 34)}<b>${ROLES[r].name}</b><small>${ROLES[r].desc}</small><span class="rt-tag">${o.main === r ? 'Main' : 'Also'}</span></button>`).join('')}</div></div>
    <div class="onb-foot"><div class="strip" data-yourslot>${yourSlot(o)}</div><button class="btn btn-ink" data-act="onbnext" ${o.main ? '' : 'disabled'}>Continue</button></div></div>`;
};
function connectOrder(build) {
  if (build.has('ctf')) return ['github', 'discord', 'linkedin', 'gitlab'];
  if (build.has('jam')) return ['github', 'discord', 'gitlab', 'linkedin'];
  if (build.size && [...build].every(b => b === 'sprint' || b === 'startup')) return ['linkedin', 'github', 'discord', 'gitlab'];
  return ['github', 'linkedin', 'gitlab', 'discord'];
}
function roleHint(o) {
  if (o.err) return o.err;
  if (!o.main) return 'Tap your main role.';
  if (!o.also.length) return `Main: <b>${ROLES[o.main].name}</b>. Up to two more you’d also take on.`;
  if (o.also.length === 1) return `Also <b>${ROLES[o.also[0]].short}</b>. One more if it’s true.`;
  return `<b>Three roles.</b> Tap one to remove it.`;
}
function yourSlot(o) {
  if (!o.main) return `<div class="slot open" style="--rc:var(--ink);--rct:var(--ink)"><span class="ring"></span>${icon('person', { size: 20 })}<span class="slot-l">Your slot</span></div>`;
  return `<div class="slot filled" data-main style="${roleVars(o.main)};flex:2.4 1 0">${av('sami')}<span class="slot-l">Sami<small>${ROLES[o.main].name}</small></span></div>` +
    o.also.map(r => `<div class="slot open armed" style="${roleVars(r)};justify-content:center"><span class="hatch" style="--pv:1"></span><span class="ring"></span><span style="color:var(--rct)">${icon(r, { size: 20 })}</span></div>`).join('');
}
