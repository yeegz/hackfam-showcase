/* Hackfam · final combined prototype · preview fixtures.
   Every person, event, team and number here is fictional review data.
   The viewer is Sami Haddad, frontend, in Madrid. "Today" is Mon 19 Oct 2026. */

/* The product name is a working title. It lives here and only here: the page title, the review bar, the desktop
   wordmark, share links, calendar files and every line of copy that names the product read it. */
const APP_NAME = 'Hackfam';
const APP_SLUG = APP_NAME.toLowerCase().replace(/[^a-z0-9]+/g, '');

const ROLES = {
  fe:   { name: 'Frontend',        short: 'Frontend', desc: 'Web apps, React, CSS', tilt: -6 },
  be:   { name: 'Backend',         short: 'Backend',  desc: 'APIs, databases, infra', tilt: 4 },
  mob:  { name: 'Mobile',          short: 'Mobile',   desc: 'iOS, Android, Flutter', tilt: -3 },
  ml:   { name: 'ML / AI',         short: 'ML',       desc: 'Models, LLM apps', tilt: 6 },
  data: { name: 'Data',            short: 'Data',     desc: 'Analysis, pipelines, charts', tilt: -5 },
  des:  { name: 'Design / UX',     short: 'Design',   desc: 'Product design, research', tilt: 5 },
  prod: { name: 'Product / Pitch', short: 'Product',  desc: 'Scope, story, the demo', tilt: -7 },
  hw:   { name: 'Hardware',        short: 'Hardware', desc: 'Electronics, IoT', tilt: 3 },
};
const ROLE_ORDER = ['fe', 'be', 'mob', 'ml', 'data', 'des', 'prod', 'hw'];

/* What people build at (research/17 §4.3, tile order fixed). */
const BUILD_TYPES = [
  ['hackathon', 'Hackathons'], ['ai', 'AI challenges'], ['ctf', 'CTFs'], ['jam', 'Game jams'], ['datathon', 'Datathons'],
  ['buildathon', 'Buildathons'], ['startup', 'Startup weekends'], ['sprint', 'Design sprints'], ['robotics', 'Robotics'], ['oss', 'Open source sprints'],
];

/* Connect your work (research/17 §4.4). Accounts are linked identities; links are pasted and checked. */
const ACCOUNTS = {
  github:   { name: 'GitHub',   glyph: 'repo',    sub: 'Fills in your languages and projects', done: '@samih', verified: true },
  linkedin: { name: 'LinkedIn', glyph: 'idcard',  sub: `${APP_NAME} keeps your LinkedIn name and photo`, done: 'Connected' },
  gitlab:   { name: 'GitLab',   glyph: 'mergereq', done: '@samih', verified: true },
  discord:  { name: 'Discord',  glyph: 'voice',   done: 'Connected' },
};
const LINK_KINDS = [
  ['devpost', 'Devpost', 'project', 'devpost.com/'], ['ctftime', 'CTFtime', 'ctf', 'ctftime.org/team/'], ['kaggle', 'Kaggle', 'data', 'kaggle.com/'],
  ['hf', 'Hugging Face', 'ml', 'huggingface.co/'], ['behance', 'Behance', 'sprint', 'behance.net/'], ['dribbble', 'Dribbble', 'des', 'dribbble.com/'],
  ['itch', 'itch.io', 'jam', 'itch.io/profile/'], ['site', 'Your site', 'globe', 'https://'],
];

const ME = { id: 'sami', home: 'Madrid', tz: 'Europe/Madrid' };

/* Event colours are content: each poster lends its pair to its own pool (hand-set here; derived in HCT in production, DS §2.4).
   base/ink = band light; dBase/dInk = band dark; acc/onAcc = primary action light; accD/onAccD = dark; txt/txtD = event colour as text on neutrals. */
const EVENTS = {
  lisbon: {
    id: 'lisbon', name: 'Lisboa Build Weekend', kind: 'Hackathon', city: 'Lisbon', venue: 'LX Factory', address: 'Rua Rodrigues de Faria 103, Alcântara',
    days: 'Sat 7 – Sun 8 Nov', dShort: '7–8 Nov', wk: 'n07', month: 'Nov',
    whenEvent: 'Sat 7 Nov, 09:00 – Sun 8 Nov, 17:00', tzName: 'Lisbon time', whenYou: '10:00 – 18:00 your time',
    inDays: 'in 19 days', format: 'In person', hours: 32, team: 'Teams of 2–4', teamMax: 4, theme: 'Cities that work', lang: 'English, Portuguese',
    host: 'Lisboa Tech Collective', cost: 'Free', regCloses: 'Sat 31 Oct', pool: 212, teamsForming: 23,
    roles: { fe: 54, be: 41, mob: 19, ml: 33, data: 15, des: 18, prod: 22, hw: 10 }, open: { des: 9, prod: 6, hw: 4 },
    status: 'Your team: 2 of 4 roles filled',
    about: 'Thirty-two hours at LX Factory under the bridge. Build something that makes a city easier to live in: transport, housing, public space, the paperwork in between.',
    c: { base: '#F2C43D', ink: '#16357E', dBase: '#13295F', dInk: '#F2C43D', acc: '#1D45A6', onAcc: '#FFFFFF', accD: '#F2C43D', onAccD: '#10224F', txt: '#1D45A6', txtD: '#F2C43D' },
    joined: true, myTeam: 'Night Tram',
  },
  osw: {
    id: 'osw', name: 'Open Source Weekend', kind: 'Open source sprint', city: 'Online', venue: 'Online', address: 'Discord and GitHub',
    days: 'Sat 12 – Mon 14 Dec', dShort: '12–14 Dec', wk: 'd12', month: 'Dec',
    whenEvent: 'Sat 12 Dec, 15:00 – Mon 14 Dec, 15:00 your time', tzName: '14:00 GMT, event time', whenYou: '',
    inDays: 'in 54 days', format: 'Online', hours: 48, team: 'Teams of up to 6', teamMax: 6, theme: 'Ship a first release', lang: 'English',
    host: 'OSW Volunteers', cost: 'Free', regCloses: null, pool: 640, teamsForming: 81,
    roles: { fe: 160, be: 150, mob: 40, ml: 98, data: 61, des: 39, prod: 52, hw: 40 }, open: { des: 22, prod: 14 },
    status: 'You’re in the pool, no team yet',
    about: 'Forty-eight hours, any time zone. Pick an open-source project and ship its next release with people you meet here.',
    c: { base: '#17191E', ink: '#C9F03E', dBase: '#1D2128', dInk: '#C9F03E', acc: '#17191E', onAcc: '#FFFFFF', accD: '#C9F03E', onAccD: '#121408', txt: '#4E6400', txtD: '#C9F03E' },
    joined: true,
  },
  ctf: {
    id: 'ctf', name: 'Flagline CTF', kind: 'CTF', city: 'Online', venue: 'Online', address: 'CTFd board and Discord',
    days: 'Sat 14 – Sun 15 Nov', dShort: '14–15 Nov', wk: 'n14', month: 'Nov',
    whenEvent: 'Sat 14 Nov, 10:00 – Sun 15 Nov, 22:00 your time', tzName: '09:00 GMT, event time', whenYou: '',
    format: 'Online', hours: 36, team: 'Teams of up to 4', teamMax: 4, theme: 'Web and crypto', lang: 'English',
    host: 'Porto Security Club', cost: 'Free', regCloses: 'Fri 30 Oct', pool: 96, teamsForming: 14,
    roles: { fe: 12, be: 30, mob: 4, ml: 9, data: 8, des: 2, prod: 3, hw: 28 }, open: { be: 5, hw: 3 },
    status: 'Registration closes Fri 30 Oct', soon: true, reason: ['ctf', 'You picked CTFs'],
    about: 'Thirty-six hours of web, crypto and hardware challenges. Beginner track on Saturday morning.',
    c: { base: '#0F3D3A', ink: '#B8F2CF', dBase: '#0A2A28', dInk: '#8FF0C0', acc: '#0F6B5E', onAcc: '#FFFFFF', accD: '#8FF0C0', onAccD: '#062421', txt: '#0F6B5E', txtD: '#8FF0C0' },
  },
  lagos: {
    id: 'lagos', name: 'Yaba Civic Hack', kind: 'Hackathon', city: 'Lagos', venue: 'Co-Creation Hub, Yaba', address: '294 Herbert Macaulay Way, Yaba',
    days: 'Sat 14 – Sun 15 Nov', dShort: '14–15 Nov', wk: 'n14', month: 'Nov',
    whenEvent: 'Sat 14 Nov, 09:00 – Sun 15 Nov, 18:00', tzName: 'Lagos time', whenYou: 'Same time as you',
    format: 'In person', hours: 33, team: 'Teams of 3–5', teamMax: 5, theme: 'Public services', lang: 'English',
    host: 'Yaba Builders', cost: 'Free', regCloses: 'Sat 7 Nov', pool: 148, teamsForming: 17,
    roles: { fe: 31, be: 34, mob: 22, ml: 18, data: 14, des: 11, prod: 12, hw: 6 }, open: { fe: 7, des: 7, hw: 3 },
    status: '148 builders in the pool', reason: ['slot', '7 teams need Frontend'],
    about: 'Two days in Yaba building tools for the services people queue for.',
    c: { base: '#11825A', ink: '#FFFFFF', dBase: '#0B4D36', dInk: '#8BE3BC', acc: '#0E7752', onAcc: '#FFFFFF', accD: '#5DD3A0', onAccD: '#06291C', txt: '#0E7752', txtD: '#5DD3A0' },
  },
  seoul: {
    id: 'seoul', name: 'Seoul Night Build', kind: 'Hackathon', city: 'Seoul', venue: 'Seongsu-dong', address: 'Seongsu-dong, Seongdong-gu',
    days: 'Sat 21 – Sun 22 Nov', dShort: '21–22 Nov', wk: 'n21', month: 'Nov',
    whenEvent: 'Sat 21 Nov, 19:00 – Sun 22 Nov, 13:00', tzName: 'Seoul time', whenYou: 'Sat 11:00 – Sun 05:00 your time',
    format: 'In person', hours: 18, team: 'Teams of 4', teamMax: 4, theme: 'After dark', lang: 'English, Korean',
    host: 'Seongsu Makers', cost: '₩10,000', regCloses: 'Sat 14 Nov', pool: 301, teamsForming: 40,
    roles: { fe: 70, be: 52, mob: 46, ml: 61, data: 20, des: 25, prod: 19, hw: 8 }, open: { fe: 12, des: 12, prod: 9 },
    status: '301 builders in the pool', reason: ['people', 'Inês and 2 others you know are going'], known: ['ines', 'kofi', 'mei'],
    about: 'Overnight in Seongsu. Doors at seven, demos at noon. Build for the city after dark: night buses, late shifts, quiet streets.',
    c: { base: '#EC4D66', ink: '#2B0A16', dBase: '#4A1222', dInk: '#FF9DAD', acc: '#C42F49', onAcc: '#FFFFFF', accD: '#FF8FA2', onAccD: '#2B0A16', txt: '#B42A43', txtD: '#FF9DAD' },
    saved: true,
  },
  toronto: {
    id: 'toronto', name: 'Lakeshore Climate Hack', kind: 'Hackathon', city: 'Toronto', venue: 'MaRS Discovery District', address: '101 College St',
    days: 'Sat 28 – Sun 29 Nov', dShort: '28–29 Nov', wk: 'n28', month: 'Nov',
    whenEvent: 'Sat 28 Nov, 09:00 – Sun 29 Nov, 17:00', tzName: 'Toronto time', whenYou: '15:00 – 23:00 your time',
    format: 'Hybrid', hours: 32, team: 'Teams of 2–5', teamMax: 5, theme: 'Water and heat', lang: 'English, French',
    host: 'Lakeshore Climate Lab', cost: 'Free', regCloses: 'Fri 20 Nov', pool: 176, teamsForming: 21,
    roles: { fe: 36, be: 30, mob: 12, ml: 29, data: 33, des: 15, prod: 14, hw: 7 }, open: { des: 6, hw: 4 },
    status: '176 builders in the pool', reason: ['tag', 'You picked climate'],
    about: 'Climate tools for the Great Lakes, on site in Toronto or remote.',
    c: { base: '#A8DCDC', ink: '#0A4850', dBase: '#0B3439', dInk: '#A8DCDC', acc: '#0D6670', onAcc: '#FFFFFF', accD: '#8AD3D6', onAccD: '#062A2E', txt: '#0D6670', txtD: '#8AD3D6' },
  },
  jam: {
    id: 'jam', name: 'Retiro Game Jam', kind: 'Game jam', city: 'Madrid', venue: 'Medialab Matadero', address: 'Plaza de Legazpi 8',
    days: 'Fri 27 – Sun 29 Nov', dShort: '27–29 Nov', wk: 'n28', month: 'Nov',
    whenEvent: 'Fri 27 Nov, 18:00 – Sun 29 Nov, 18:00', tzName: 'Madrid time', whenYou: '',
    format: 'In person', hours: 48, team: 'Teams of 2–4', teamMax: 4, theme: 'Theme announced at the start', lang: 'Spanish, English',
    host: 'Jammers Madrid', cost: 'Free', regCloses: 'Fri 20 Nov', pool: 0, teamsForming: 0,
    roles: { fe: 6, be: 3, mob: 2, ml: 1, data: 1, des: 5, prod: 1, hw: 1 }, open: { des: 2 },
    status: 'New pool', reason: ['people', 'Lucía is going'],
    about: 'Forty-eight hours, one secret theme, any engine. Doors open Friday evening.',
    c: { base: '#F4B6C8', ink: '#3A0D2E', dBase: '#3A0D2E', dInk: '#F4B6C8', acc: '#9C2A6B', onAcc: '#FFFFFF', accD: '#F79AC0', onAccD: '#2A0820', txt: '#9C2A6B', txtD: '#F79AC0' },
  },
  kl: {
    id: 'kl', name: 'KL Fintech Sprint', kind: 'Hackathon', city: 'Kuala Lumpur', venue: 'Common Ground, Bukit Bintang', address: 'Jalan Bukit Bintang',
    days: 'Sat 5 – Sun 6 Dec', dShort: '5–6 Dec', wk: 'd05', month: 'Dec',
    whenEvent: 'Sat 5 Dec, 09:00 – Sun 6 Dec, 17:00', tzName: 'Kuala Lumpur time', whenYou: 'Sat 02:00 – Sun 10:00 your time',
    format: 'In person', hours: 32, team: 'Teams of 3–4', teamMax: 4, theme: 'Money for everyone', lang: 'English, Malay',
    host: 'KL Fintech Society', cost: 'Free', regCloses: 'Sat 28 Nov', pool: 133, teamsForming: 15,
    roles: { fe: 28, be: 30, mob: 21, ml: 14, data: 16, des: 9, prod: 11, hw: 4 }, open: { des: 5, prod: 4 },
    status: 'Has a payments track', reason: ['people', 'Kofi is going'],
    about: 'Payments, savings and credit for people banks overlook.',
    c: { base: '#F1872C', ink: '#4B1417', dBase: '#4A1D10', dInk: '#FFB070', acc: '#B04C12', onAcc: '#FFFFFF', accD: '#FFA45C', onAccD: '#3A1206', txt: '#A44610', txtD: '#FFA45C' },
  },
};
/* Weekend chips (DS §7.6): Sat–Sun weekends for a Madrid viewer, each with at least one listed event. */
const WEEKENDS = [['n07', 'Nov', '7–8'], ['n14', 'Nov', '14–15'], ['n21', 'Nov', '21–22'], ['n28', 'Nov', '28–29'], ['d05', 'Dec', '5–6'], ['d12', 'Dec', '12–13']];
const FOR_YOU = ['seoul', 'ctf', 'lagos', 'toronto', 'kl'];
const ALL_ORDER = ['lisbon', 'ctf', 'lagos', 'seoul', 'toronto', 'jam', 'kl', 'osw'];

/* Anyone scope (P0-21): builders open to future teams. Neutral band, no poster owns it. */
EVENTS.anyone = {
  id: 'anyone', name: 'Anyone', pool: 1840, poolLabel: '1,840 open to future teams',
  c: { base: '#111419', ink: '#FFFFFF', dBase: '#22252B', dInk: '#F1F3F6', acc: '#111419', onAcc: '#FFFFFF', accD: '#F1F3F6', onAccD: '#0B0C0F', txt: '#111419', txtD: '#F1F3F6' },
};
/* Past events, only for the colours of kudos stickers. */
const PAST = {
  porto: { name: 'Porto Mobility Jam', year: '2025', base: '#2F5BD3', ink: '#FFFFFF', dBase: '#1B2F6B', dInk: '#A9C1FF' },
  madrid: { name: 'Madrid Health Hack', year: '2025', base: '#E9F2D6', ink: '#24510F', dBase: '#20381A', dInk: '#C8E7A2' },
  valencia: { name: 'Valencia Open Data Day', year: '2026', base: '#FFB59A', ink: '#5A1A08', dBase: '#4C1C10', dInk: '#FFB59A' },
};

/* Your people: connections from earlier mutual interest, then one open "Next". */
const MY_PEOPLE = [{ role: 'prod', who: 'kofi' }, { role: 'be', who: 'ifeoma' }, { role: 'be', who: 'daniel' }, { role: 'any', who: null }];

/* proof.kind: 'rhythm' (GitHub weekly levels) or 'shipped' (12-month timeline, months 0 = Nov 2025 … 11 = Oct 2026). */
const PEOPLE = {
  sami: {
    id: 'sami', name: 'Sami Haddad', first: 'Sami', handle: 'samih', role: 'fe', also: ['mob'], city: 'Madrid', exp: '3–5 hackathons', langs: 'English, Spanish, Arabic',
    av: { skin: '#C68863', hair: 'wavy', hc: '#2A1E18', shirt: '#2D3E66', bg: '#D7E3F4', beard: 'stubble' },
    skills: ['React', 'TypeScript', 'WebGL', 'Accessibility'],
    prompts: [{ q: 'At 3 a.m. you’ll find me…', a: 'Fixing the one layout bug nobody else can see.' }],
    proof: { kind: 'rhythm', seed: 7, commits: 684, langs: 'TypeScript, GLSL, Swift' }, project: null, links: ['github.com/samih', 'sami.dev'],
  },
  ifeoma: { id: 'ifeoma', name: 'Ifeoma Obi', first: 'Ifeoma', role: 'be', city: 'Lisbon', av: { skin: '#6F4630', hair: 'puff', hc: '#1B1512', shirt: '#0F7B76', bg: '#CDEBE7' } },
  kofi: {
    id: 'kofi', name: 'Kofi Asante', first: 'Kofi', role: 'prod', city: 'Lisbon', exp: '6+ hackathons', overlap: '1 h behind you',
    av: { skin: '#5A3726', hair: 'buzz', hc: '#141110', shirt: '#9E427B', bg: '#F2D6E6', beard: 'full', glasses: true },
    skills: ['Pitching', 'Scoping', 'Fintech', 'User interviews', 'Keynote'],
    reasons: [['slot', 'Fills your Product slot'], ['events', 'Pitched at 6 hackathons'], ['clock', '1 h behind you']],
    anyReasons: [['slot', 'Product, a role you look for'], ['events', 'Also going to Lisboa Build Weekend'], ['clock', '9 h overlap']],
    prompts: [
      { q: 'The part I always volunteer for…', a: 'The pitch. Three minutes on stage is my favourite part of the weekend.' },
      { q: 'When the demo breaks, I…', a: 'Switch to the recorded video and keep talking like nothing happened.' },
    ],
    proof: { kind: 'shipped', items: [{ m: 1, t: 'Susu Circle' }, { m: 4, t: 'Pitch kit' }, { m: 7, t: 'Mesa' }, { m: 10, t: 'Fare Fair' }], src: 'From Devpost' },
    project: { id: 'susu', title: 'Susu Circle', line: 'A rotating savings group in your pocket.', award: '2nd place', where: 'Accra Fintech Jam 2026' },
    links: ['kofiasante.co', 'devpost.com/kofi-a'],
  },
  ines: {
    id: 'ines', name: 'Inês Carvalho', first: 'Inês', role: 'des', city: 'Porto', exp: '3–5 hackathons', overlap: '1 h behind you',
    av: { skin: '#EFC6A6', hair: 'long', hc: '#5B3B25', shirt: '#AB4046', bg: '#F6D9D6' },
    skills: ['Figma', 'Prototyping', 'Design systems', 'Motion', 'User research'],
    reasons: [['slot', 'Fills your Design slot'], ['events', 'Also going to Open Source Weekend'], ['clock', '1 h behind you']],
    anyReasons: [['slot', 'Design, a role you look for'], ['tag', 'Both picked transport'], ['events', 'Also going to Lisboa Build Weekend']],
    prompts: [
      { q: 'I’m the teammate who…', a: 'Sketches the demo flow on paper before anyone opens an editor.' },
      { q: 'A problem I’d love to solve…', a: 'Bus stops that tell you the truth about when the bus is coming.' },
    ],
    proof: { kind: 'shipped', items: [{ m: 0, t: 'Paragem' }, { m: 3, t: 'Bairro map' }, { m: 6, t: 'Tram signs' }, { m: 9, t: 'Paragem 2' }, { m: 11, t: 'Ferry kit' }], src: 'From Dribbble and her site' },
    project: { id: 'paragem', title: 'Paragem', line: 'Honest arrival boards for Porto’s bus stops.', award: 'Built at', where: 'Porto Mobility Jam 2025' },
    links: ['inescarvalho.design', 'dribbble.com/inesc'],
    mutual: true,
  },
  hyunwoo: {
    id: 'hyunwoo', name: 'Park Hyun-woo', first: 'Hyun-woo', role: 'ml', city: 'Lisbon', exp: '1–2 hackathons', overlap: '1 h behind you',
    av: { skin: '#EBC39C', hair: 'fringe', hc: '#16130F', shirt: '#7C50A8', bg: '#E6DDF2', glasses: true },
    skills: ['PyTorch', 'Vision', 'LLM apps', 'FastAPI'],
    reasons: [['slot', 'Your team has no ML yet'], ['tag', 'Also picked transport'], ['clock', '1 h behind you']],
    anyReasons: [['tag', 'Both picked transport'], ['globe', 'Teams in English and Korean'], ['clock', '9 h overlap']],
    prompts: [
      { q: 'An idea I can’t stop thinking about…', a: 'Alt text for every photo in a city archive, checked by the people in them.' },
      { q: 'I do my best work when…', a: 'The scope is small and the deadline is real.' },
    ],
    proof: { kind: 'rhythm', seed: 23, commits: 958, langs: 'Python, Rust' },
    project: { id: 'seen', title: 'Seen', line: 'Describes archive photos for screen readers, with curators in the loop.', award: 'Best use of AI', where: 'Lisbon AI Weekend 2026' },
    links: ['github.com/hwpark', 'huggingface.co/hwpark'],
    anyMutual: true,
  },
  priya: {
    id: 'priya', name: 'Priya Raman', first: 'Priya', role: 'data', city: 'London', exp: '3–5 hackathons', overlap: '1 h behind you',
    av: { skin: '#B97A57', hair: 'braid', hc: '#1A1411', shirt: '#965900', bg: '#F3E3C8' },
    skills: ['SQL', 'dbt', 'Observable', 'GIS'],
    reasons: [['slot', 'Data, not on your team yet'], ['events', 'Also going to Open Source Weekend'], ['clock', '1 h behind you']],
    anyReasons: [['events', 'Also going to Open Source Weekend'], ['tag', 'Both picked cities and climate'], ['clock', '9 h overlap']],
    prompts: [{ q: 'A bug that taught me something…', a: 'Time zones. It is always time zones.' }],
    proof: { kind: 'rhythm', seed: 5, commits: 377, langs: 'SQL, Python, JavaScript' },
    project: { id: 'tide', title: 'Tidewatch', line: 'Street-level flood risk from open sensor data.', award: 'Used by', where: 'two councils' },
    links: ['priyaraman.io', 'observablehq.com/@priya'],
  },
  lucia: {
    id: 'lucia', name: 'Lucía Ferreyra', first: 'Lucía', role: 'mob', city: 'Madrid', exp: '1–2 hackathons', overlap: 'Same time as you',
    av: { skin: '#D9A47F', hair: 'curly', hc: '#3B2A20', shirt: '#267D30', bg: '#D8EDD9' },
    skills: ['Flutter', 'Kotlin', 'Firebase'],
    reasons: [['slot', 'Could pair with you on the app'], ['globe', 'Speaks Spanish too'], ['clock', 'Same time as you']],
    anyReasons: [['place', 'Also in Madrid'], ['globe', 'Speaks Spanish too'], ['events', 'Also going to Retiro Game Jam']],
    prompts: [{ q: 'Something I built that people actually used…', a: 'A shift-swap app the nurses at my mum’s hospital still open every week.' }],
    proof: { kind: 'rhythm', seed: 13, commits: 290, langs: 'Dart, Kotlin' },
    project: { id: 'turnos', title: 'Turnos', line: 'Shift swaps for hospital staff without the group chat chaos.', award: 'Built at', where: 'Madrid Health Hack 2025' },
    links: ['github.com/luferreyra'],
  },
  seun: {
    id: 'seun', name: 'Oluwaseun Adebayo-Williams', first: 'Oluwaseun', role: 'hw', city: 'Lisbon', exp: '6+ hackathons', overlap: '1 h behind you',
    av: { skin: '#4A2E22', hair: 'short', hc: '#120E0C', shirt: '#6F6E00', bg: '#E7E7C3', beard: 'full' },
    skills: ['ESP32', 'KiCad', 'Embedded C', 'LoRa'],
    reasons: [['slot', 'Hardware for the sensor ideas'], ['events', 'Won at Yaba Civic Hack'], ['clock', '1 h behind you']],
    anyReasons: [['tag', 'Both picked cities and climate'], ['events', 'Won at Yaba Civic Hack'], ['clock', '9 h overlap']],
    prompts: [{ q: 'My long-build fuel is…', a: 'Tea, a soldering iron and one very long playlist.' }],
    proof: { kind: 'rhythm', seed: 17, commits: 164, langs: 'C, Python' },
    project: null, links: ['seun.build'],
  },
  aisha: { id: 'aisha', name: 'Aisha Rahim', first: 'Aisha', role: 'data', city: 'Lisbon', av: { skin: '#C9926B', hair: 'hijab', hc: '#2F4858', shirt: '#2F4858', bg: '#D8E4EA' } },
  daniel: { id: 'daniel', name: 'Daniel Kowalski', first: 'Daniel', role: 'be', city: 'Warsaw', av: { skin: '#F0CFB4', hair: 'short', hc: '#A0703A', shirt: '#00807B', bg: '#D4ECEA', glasses: true } },
  mei: { id: 'mei', name: 'Mei Tanaka', first: 'Mei', role: 'mob', city: 'Lisbon', av: { skin: '#F2D0B0', hair: 'bob', hc: '#141210', shirt: '#267D30', bg: '#DCEFDC' } },
};

const DECK = ['kofi', 'ines', 'hyunwoo', 'priya', 'lucia', 'seun'];
const DECK_ANY = ['lucia', 'hyunwoo', 'priya', 'seun', 'kofi'];
const INTERESTED_IN_YOU = ['aisha', 'daniel', 'mei'];

/* Your team at Lisboa Build Weekend, the week before: two of four filled. */
const MY_TEAM = { name: 'Night Tram', event: 'lisbon', slots: [{ role: 'fe', who: 'sami' }, { role: 'be', who: 'ifeoma' }, { role: 'des', who: null }, { role: 'prod', who: null }] };

/* Team page snapshot: Saturday morning of the event (event-day mode). */
const TEAM_DAY = {
  name: 'Night Tram', project: 'Late Line', event: 'lisbon', clock: 'Sat 7 Nov, 10:41 Lisbon',
  leftSec: (28 * 60 + 19) * 60, totalMin: 30 * 60,
  slots: [{ role: 'fe', who: 'sami', note: 'Captain' }, { role: 'be', who: 'ifeoma' }, { role: 'prod', who: 'kofi' }, { role: 'des', who: null, request: 'ines' }],
  checklist: [
    { t: 'Register the team with the organiser', done: true, who: 'sami' },
    { t: 'Lock the idea and the one demo path', done: true, who: 'kofi' },
    { t: 'Repo, CI and a preview link', done: true, who: 'ifeoma' },
    { t: 'Design pass on the arrivals screen', done: false, who: null },
    { t: 'Record the two-minute demo', done: false, who: 'kofi' },
    { t: 'Submit before Sun 15:00', done: false, who: 'sami' },
  ],
  links: [{ icon: 'repo', label: 'Repository', sub: 'github.com/night-tram/late-line' }, { icon: 'submit', label: 'Submission page', sub: 'Draft, not submitted' }, { icon: 'frame', label: 'Design file', sub: 'Late Line flows' }],
  chat: { who: 'ifeoma', text: 'Arrivals API is up. Preview link is in the repo readme.', unread: 2 },
};

/* Kudos you received after past events (PS §10.4 tags). Stickers are printed in the colours of the event they came from. */
const KUDOS = { teammates: 6, events: 3, top: [['calm_in_chaos', 'Calm in chaos', 'madrid', -4], ['clean_code', 'Clean, careful code', 'porto', 3], ['reliable', 'Did what they said', 'valencia', -2]] };
