/* bestvpsforme "The Shore" design mockup. Static, no build step.
   Data: data.js, a local fixture snapshot exported from the dev server.
   Plan: docs/design/V1_SHORE_DESIGN_PLAN.md */
(() => {
  'use strict';

  const D = window.BVP || [];
  const META = window.BVP_META || {};
  const byId = new Map(D.map((o) => [o.id, o]));
  const root = document.documentElement;
  const app = document.getElementById('app');
  const live = document.getElementById('live');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => mq.matches || root.classList.contains('rm');
  const finePointer = matchMedia('(pointer: fine)');
  const timers = new Set();
  const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); return t; };
  const clearTimers = () => { timers.forEach(clearTimeout); timers.clear(); };
  const say = (msg) => { live.textContent = ''; requestAnimationFrame(() => { live.textContent = msg; }); };

  /* ── Formatting ─────────────────────────────────── */
  const money = (v) => (v == null || !Number.isFinite(v) ? null : `$${v.toFixed(2)}`);
  const fmtDate = (iso) => {
    if (!iso) return 'date not published';
    const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  };
  const gb = (v) => (v == null ? null : v < 1 ? `${Math.round(v * 1024)} MB` : `${+v.toFixed(1)} GB`);
  const diskTxt = (v) => (v == null ? null : v >= 1000 ? `${+(v / 1000).toFixed(1)} TB` : `${v} GB`);
  const bwTxt = (o) => (o.bw != null ? (o.bw >= 1 ? `${+o.bw.toFixed(1)} TB` : `${Math.round(o.bw * 1000)} GB`) : null);
  const UNK = '<span class="unk">Not published</span>';
  const ICON = (id, cls = '') => `<svg class="ico ${cls}" aria-hidden="true" focusable="false"><use href="#i-${id}"/></svg>`;
  const RV = `<span class="rv" title="Reviewed 3-year price">${ICON('check')}<span class="sr-only">Reviewed 3-year price</span></span>`;
  const rateOf = (o) => (o.cur === 'USD' ? 1 : o.fx ?? null);
  const conv = (o, v) => { const r = rateOf(o); return v == null || r == null ? null : v * r; };

  /* ── Regions and filters (same rules as src/lib/catalog.ts) ── */
  const EU = new Set(['AT', 'BE', 'BG', 'CH', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GB', 'UK', 'GR', 'HR', 'HU', 'IE', 'IS', 'IT', 'LT', 'LU', 'LV', 'NL', 'NO', 'PL', 'PT', 'RO', 'RS', 'SE', 'SI', 'SK']);
  const NA = new Set(['US', 'CA']);
  const AS = new Set(['AE', 'BH', 'CN', 'HK', 'ID', 'IL', 'IN', 'JP', 'KR', 'MY', 'PH', 'PK', 'QA', 'SA', 'SG', 'TH', 'TR', 'TW', 'VN']);
  const OC = new Set(['AU', 'NZ', 'PG', 'FJ', 'NC', 'PF', 'VU', 'SB', 'WS', 'TO', 'GU', 'MP', 'AS']);
  const code = (loc) => { const m = /^[a-z]{2}\b/i.exec(String(loc).trim()); return m ? m[0].toUpperCase() : null; };
  const band = (loc) => { const c = code(loc); if (!c) return null; if (EU.has(c)) return 'europe'; if (NA.has(c)) return 'na'; if (AS.has(c)) return 'asia'; if (OC.has(c)) return 'oceania'; return null; };
  const inBand = (o, b) => (o.loc || []).some((l) => band(l) === b);
  const RAM_STEPS = [1, 2, 4, 8, 16];
  const PRICE_STEPS = [5, 10, 25, 50];
  const REGIONS = [['europe', 'Europe'], ['na', 'N. America'], ['asia', 'Asia'], ['oceania', 'Oceania']];
  const REGION_NAME = Object.fromEntries(REGIONS);
  const FLAGS = [['contract', 'No long contracts'], ['flat', 'Flat renewal price'], ['ipv4', 'IPv4 included']];
  const FLAG_NAME = Object.fromEntries(FLAGS);
  const SORTS = { value: 'Value score', price: 'Price', ram: 'Memory', cpu: 'CPU', disk: 'Storage', bw: 'Transfer', tp: 'Trustpilot' };
  const defDir = (s) => (s === 'value' || s === 'price' ? 'asc' : 'desc');
  const PER = [24, 48, 96];
  const SORT_KEY = { value: (o) => o.rank, price: (o) => o.usd, ram: (o) => o.ram, cpu: (o) => o.vcpu, disk: (o) => o.disk, bw: (o) => o.bw, tp: (o) => o.tp };
  const flagMatch = (o, f) => (f === 'contract' ? o.term != null && o.term <= 1 : f === 'ipv4' ? o.ipv4 === 'included' : Boolean(o.tr && o.ren != null && o.ren <= o.eff * 1.02));

  /* Filter model mirrors src/lib/catalog.ts filterOffers: every number is a floor or a ceiling. */
  const RANGES = {
    ram: { label: 'Memory', icon: 'ram', steps: [null, 1, 2, 4, 8, 16, 32, 64], txt: (v) => `${gb(v)} or more` },
    cpu: { label: 'CPU', icon: 'cpu', steps: [null, 1, 2, 4, 6, 8, 16], txt: (v) => `${v} vCPU or more` },
    disk: { label: 'Storage', icon: 'disk', steps: [null, 20, 40, 80, 100, 200, 400], txt: (v) => `${diskTxt(v)} or more` },
    price: { label: 'Budget per month', icon: 'tag', steps: [3, 5, 7, 10, 15, 20, 25, 30, 50, 100, null], txt: (v) => `Up to $${v}/mo`, max: true },
  };
  const TP_STEPS = [[null, 'Any'], [3.5, '3.5+'], [4, '4.0+'], [4.5, '4.5+']];
  const CC = { AT: 'Austria', AU: 'Australia', BR: 'Brazil', CA: 'Canada', DE: 'Germany', DK: 'Denmark', ES: 'Spain', FI: 'Finland', FR: 'France', GB: 'United Kingdom', IN: 'India', IT: 'Italy', JP: 'Japan', LT: 'Lithuania', LU: 'Luxembourg', NL: 'Netherlands', PL: 'Poland', RO: 'Romania', SE: 'Sweden', SG: 'Singapore', US: 'United States' };
  const cName = (c) => CC[c] || c;
  const blankQ = () => ({ q: '', ram: null, cpu: null, disk: null, price: null, tp: null, regions: [], loc: [], prov: [], flags: [] });
  function matches(o, c) {
    const q = (c.q || '').trim().toLowerCase();
    if (q && !`${o.p} ${o.name}`.toLowerCase().includes(q)) return false;
    if (c.ram && (o.ram == null || o.ram < c.ram)) return false;
    if (c.cpu && (o.vcpu == null || o.vcpu < c.cpu)) return false;
    if (c.disk && (o.disk == null || o.disk < c.disk)) return false;
    if (c.price && (o.usd == null || o.usd > c.price)) return false;
    if (c.prov?.length && !c.prov.includes(o.pid)) return false;
    if (c.loc?.length && !(o.loc || []).some((l) => c.loc.includes(code(l)))) return false;
    if (c.regions?.length && !c.regions.some((r) => inBand(o, r))) return false;
    for (const f of c.flags || []) if (!flagMatch(o, f)) return false;
    if (c.tp && (o.tp == null || o.tp < c.tp)) return false;
    return true;
  }
  function parseQ(qs) {
    const q = new URLSearchParams(qs || '');
    const num = (k) => { const v = Number(q.get(k)); return q.get(k) && Number.isFinite(v) && v > 0 ? v : null; };
    return {
      q: q.get('q') || '',
      ram: num('ram'),
      cpu: num('cpu'),
      disk: num('disk'),
      price: num('price'),
      loc: (q.get('loc') || '').split(',').filter((c) => CC[c]),
      prov: (q.get('prov') || '').split(',').filter(Boolean),
      regions: (q.get('regions') || '').split(',').filter((r) => REGION_NAME[r]),
      flags: (q.get('flags') || '').split(',').filter((f) => FLAG_NAME[f]),
      tp: [3.5, 4, 4.5].includes(Number(q.get('tp'))) ? Number(q.get('tp')) : null,
      sort: SORTS[q.get('sort')] ? q.get('sort') : 'value',
      dir: ['asc', 'desc'].includes(q.get('dir')) ? q.get('dir') : defDir(SORTS[q.get('sort')] ? q.get('sort') : 'value'),
      per: PER.includes(num('per')) ? num('per') : PER.includes(Number(localStorage.getItem('shore-per'))) ? Number(localStorage.getItem('shore-per')) : 24,
      view: ['list', 'cards'].includes(q.get('view')) ? q.get('view') : localStorage.getItem('shore-view') === 'cards' ? 'cards' : 'list',
      page: num('page') || 1,
    };
  }
  function qstr(c) {
    const p = new URLSearchParams();
    if (c.q?.trim()) p.set('q', c.q.trim());
    if (c.ram) p.set('ram', c.ram);
    if (c.cpu) p.set('cpu', c.cpu);
    if (c.disk) p.set('disk', c.disk);
    if (c.price) p.set('price', c.price);
    if (c.loc?.length) p.set('loc', c.loc.join(','));
    if (c.prov?.length) p.set('prov', c.prov.join(','));
    if (c.regions?.length) p.set('regions', c.regions.join(','));
    if (c.flags?.length) p.set('flags', c.flags.join(','));
    if (c.tp) p.set('tp', c.tp);
    if (c.sort && c.sort !== 'value') p.set('sort', c.sort);
    if (c.sort && c.dir && c.dir !== defDir(c.sort)) p.set('dir', c.dir);
    if (c.per && c.per !== 24) p.set('per', c.per);
    if (c.view === 'cards') p.set('view', 'cards');
    if (c.page > 1) p.set('page', c.page);
    const s = p.toString().replace(/%2C/g, ',');
    return s ? `?${s}` : '';
  }
  function sortList(list, s, dir = defDir(s)) {
    const f = SORT_KEY[s] || SORT_KEY.value;
    const k = dir === 'asc' ? 1 : -1;
    return [...list].sort((x, y) => { const a = f(x); const b = f(y); if (a == null || b == null) return a == null && b == null ? x.rank - y.rank : a == null ? 1 : -1; return (a - b) * k || x.rank - y.rank; });
  }
  const onePer = (list, n) => { const seen = new Set(); const out = []; for (const o of list) { if (seen.has(o.pid) || o.usd == null) continue; seen.add(o.pid); out.push(o); if (out.length === n) break; } return out; };
  function relaxOptions(c) {
    const opts = [];
    const down = (k) => { const st = RANGES[k].steps.filter((x) => x != null); const i = st.indexOf(c[k]); return i > 0 ? st[i - 1] : null; };
    if (c.q?.trim()) opts.push({ label: `Drop the search “${c.q.trim()}”`, next: { ...c, q: '' } });
    if (c.ram) opts.push({ label: down('ram') ? `Allow ${gb(down('ram'))} RAM` : 'Any memory', next: { ...c, ram: down('ram') } });
    if (c.cpu) opts.push({ label: down('cpu') ? `Allow ${down('cpu')} vCPU` : 'Any CPU', next: { ...c, cpu: down('cpu') } });
    if (c.disk) opts.push({ label: down('disk') ? `Allow ${diskTxt(down('disk'))} storage` : 'Any storage', next: { ...c, disk: down('disk') } });
    if (c.price) { const st = RANGES.price.steps; const i = st.indexOf(c.price); const up = i >= 0 ? st[i + 1] : null; opts.push({ label: up ? `Budget up to $${up}` : 'Any budget', next: { ...c, price: up } }); }
    if (c.regions?.length) opts.push({ label: 'Any region', next: { ...c, regions: [] } });
    if (c.loc?.length) opts.push({ label: 'Any country', next: { ...c, loc: [] } });
    if (c.prov?.length) opts.push({ label: 'Any provider', next: { ...c, prov: [] } });
    (c.flags || []).forEach((f) => opts.push({ label: `Drop “${FLAG_NAME[f]}”`, next: { ...c, flags: c.flags.filter((x) => x !== f) } }));
    if (c.tp) opts.push({ label: `Drop “Trustpilot ${c.tp.toFixed(1)}+”`, next: { ...c, tp: null } });
    return opts.map((o) => ({ ...o, n: D.filter((p) => matches(p, o.next)).length })).filter((o) => o.n > 0).sort((a, b) => b.n - a.n).slice(0, 3);
  }

  /* ── Needs (finder + catalog filters) ───────────── */
  const loadNeeds = () => { try { const n = JSON.parse(sessionStorage.getItem('shore-needs') || 'null'); return n && typeof n === 'object' ? { ram: n.ram || null, price: n.price || null, regions: n.regions || [] } : { ram: null, price: null, regions: [] }; } catch { return { ram: null, price: null, regions: [] }; } };
  const saveNeeds = (n) => sessionStorage.setItem('shore-needs', JSON.stringify({ ram: n.ram, price: n.price, regions: n.regions || [] }));
  const hasNeeds = (n) => Boolean(n && (n.ram || n.price || n.regions?.length));
  const needsTxt = (n) => [n.ram ? `${gb(n.ram)}+ RAM` : null, n.price ? `under $${n.price}/mo` : null, n.regions?.length ? n.regions.map((r) => REGION_NAME[r]).join(' or ') : null].filter(Boolean).join(', ');
  function verdict(o, n) {
    if (!hasNeeds(n)) return null;
    const bad = [];
    const unknown = [];
    if (n.ram) { if (o.ram == null) unknown.push('memory'); else if (o.ram < n.ram) bad.push(['small', `${gb(o.ram)} RAM. You need ${gb(n.ram)}.`]); }
    if (n.price) { if (o.usd == null) unknown.push('price'); else if (o.usd > n.price) bad.push(['pricey', `${money(o.usd)}/mo. Your budget is $${n.price}.`]); }
    if (n.regions?.length && !n.regions.some((r) => inBand(o, r))) bad.push(['far', `Not in ${n.regions.map((r) => REGION_NAME[r]).join(' or ')}.`]);
    if (bad.length) return { k: bad[0][0], title: { small: 'Too small.', pricey: 'Too pricey.', far: 'Not on your shore.' }[bad[0][0]], lines: bad.map((b) => b[1]), pose: 'error' };
    if (unknown.length) return { k: 'unknown', title: 'Can’t tell yet.', lines: [`The ${unknown.join(' and ')} ${unknown.length > 1 ? 'are' : 'is'} not published.`], pose: 'quirk' };
    const why = [n.ram ? `${gb(o.ram)} RAM (you need ${gb(n.ram)})` : null, n.price ? `${money(o.usd)}/mo (budget $${n.price})` : null, n.regions?.length ? `in ${n.regions.map((r) => REGION_NAME[r]).join(' or ')}` : null].filter(Boolean).join(' · ');
    return { k: 'fit', title: 'This one.', lines: [`Fits your needs: ${why}.`], pose: 'success' };
  }

  /* ── Characters (Patchwork kit from design_system/brand/characters/v2) ── */
  let PW = null;
  function kit() {
    if (PW) return PW;
    PW = (window.STYLES || []).find((s) => s.id === 'patchwork') || null;
    if (PW) { const st = document.createElement('style'); st.textContent = PW.css; document.head.append(st); }
    return PW;
  }
  let uid = 0;
  const VB = { bvp: '26 50 118 74', twargaops: '34 40 90 84', logo: '33 72 76 50', call: '0 40 116 84' };
  function pet(kind, state = 'idle', vb = kind) {
    const k = kit();
    if (!k) return '';
    const id = `pw${uid++}`;
    return `<svg class="pet s-patchwork k-${kind}" viewBox="${VB[vb]}" data-state="${state}" style="--accent:${kind === 'bvp' ? 'var(--violet)' : 'var(--amber)'}" aria-hidden="true" focusable="false">${k.draw(kind, id)}</svg>`;
  }
  function setPose(svg, state) {
    if (!svg) return;
    if (svg.dataset.state === state) { if (state !== 'quirk') return; svg.dataset.state = 'idle'; requestAnimationFrame(() => { svg.dataset.state = state; }); return; }
    svg.dataset.state = state;
  }
  const SHELL_D = 'M34 6c11.6 0 19.6 8.4 19.6 19.8 0 11.6-8.6 19.6-20.2 19.6-8.2 0-14.2-4.6-16-11.6 4 1.9 9.8.9 11.6-4.2 1.9-5.3-1.3-9.9-6.2-10.8C24.6 11.4 28.6 6 34 6z';
  const LOGO = { hetzner: 'hetzner.svg', contabo: 'contabo.svg', netcup: 'netcup.svg', ovh: 'ovh.svg', ovhcloud: 'ovh.svg', digitalocean: 'digitalocean.svg', vultr: 'vultr.svg', linode: 'linode.svg', 'akamai-linode': 'akamai.svg', 'aws-ec2': 'amazonwebservices.svg', 'aws-lightsail': 'lightsail.svg', 'google-cloud': 'googlecloud.svg', 'oracle-cloud': 'oracle-official.svg', greencloudvps: 'greencloud.png', 'cherry-servers': 'cherryservers-mark.svg', 'ssd-nodes': 'ssdnodes.jpg', racknerd: 'racknerd.png', hostinger: 'hostinger.svg', time4vps: 'time4vps.png', kamatera: 'kamatera.png', upcloud: 'upcloud.svg', scaleway: 'scaleway.svg', ionos: 'ionos.svg', webdock: 'webdock.png', infomaniak: 'infomaniak.svg', nineteen84: 'nineteen84.png', alphavps: 'alphavps.png', greencloud: 'greencloud.png', servarica: 'servarica.png', hosthatch: 'hosthatch.svg', '20i': 'marks/20i.png', 'alibaba-cloud': 'marks/alibaba-cloud.png', 'atlantic-net': 'marks/atlantic-net.png', buyvm: 'marks/buyvm.png', 'clouding-io': 'marks/clouding-io.png', dreamhost: 'marks/dreamhost.svg', fastcomet: 'marks/fastcomet.png', flokinet: 'marks/flokinet.svg', hostkey: 'marks/hostkey.png', hostsailor: 'marks/hostsailor.png', hostwinds: 'marks/hostwinds.png', interserver: 'marks/interserver.png', knownhost: 'marks/knownhost.png', leaseweb: 'marks/leaseweb.png', 'liquid-web': 'marks/liquid-web.png', 'microsoft-azure': 'marks/microsoft-azure.png', namecheap: 'marks/namecheap.png', njalla: 'marks/njalla.png', privex: 'marks/privex.png', ramnode: 'marks/ramnode.png', scalahosting: 'marks/scalahosting.png', yourserver: 'marks/yourserver.png' };
  const logoSrc = (pid) => (LOGO[pid] ? `logos/${LOGO[pid]}` : null);
  let shUid = 0;
  const shellSvg = (o) => {
    const src = o ? logoSrc(o.pid) : null;
    const plate = src
      ? `<g transform="rotate(-6 36 25)"><rect class="sh-plate-shadow" x="25.2" y="14.8" width="23" height="23" rx="5.5"/><rect class="sh-plate" x="24" y="13.6" width="23" height="23" rx="5.5"/><image href="${src}" x="26.5" y="16.1" width="18" height="18" preserveAspectRatio="xMidYMid meet"/></g>`
      : '<path class="sh-spiral" d="M37 26.2a2.6 2.6 0 1 1-2.6-2.6 5.4 5.4 0 1 1 5.4 5.4 8.6 8.6 0 1 1-8.6-8.6"/>';
    return `<svg class="sh" viewBox="0 0 60 52" aria-hidden="true" focusable="false"><ellipse class="sh-shadow" cx="33" cy="48.5" rx="20" ry="2.4"/><path class="sh-fill" d="${SHELL_D}"/><path class="sh-hatch" d="${SHELL_D}"/><path class="sh-seam" d="${SHELL_D}"/>${plate}</svg>`;
  };;
  const babyVM = () => `<svg class="vm" viewBox="0 0 48 44" aria-hidden="true" focusable="false"><ellipse class="vm-shadow" cx="24" cy="41.5" rx="15" ry="2"/><g class="vm-in"><path class="vm-foot" d="M16 36v4M32 36v4"/><rect class="vm-body" x="7" y="6" width="34" height="30" rx="8"/><rect class="vm-seam" x="9.2" y="8.2" width="29.6" height="25.6" rx="6.4"/><circle class="vm-eye" cx="18" cy="20" r="3"/><circle class="vm-eye" cx="30" cy="20" r="3"/><path class="vm-mouth" d="M21 27q3 2.4 6 0"/></g></svg>`;
  const bigPail = (n = 0) => `<svg class="bigpail" viewBox="0 0 34 30" aria-hidden="true" focusable="false"><g class="pail__shells">${pailShells(n)}</g><path class="pail__body" d="M5 12h24l-2.6 14.4a2.4 2.4 0 0 1-2.4 2H10a2.4 2.4 0 0 1-2.4-2z"/><path class="pail__seam" d="M6.4 18.5h21.2"/><path class="pail__handle" d="M7.5 12C7.5 6.5 11.6 3 17 3s9.5 3.5 9.5 9"/></svg>`;
  const pailShells = (n) => Array.from({ length: Math.min(n, 4) }, (_, i) => `<circle cx="${10 + i * 4.7}" cy="${11 - (i % 2) * 1.6}" r="3"/>`).join('');
  const FELT = ['#3b3270', '#2e4a5c', '#5a3a2c', '#2f4a35', '#4a2f4a', '#38405e'];
  const feltOf = (s) => FELT[[...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) % FELT.length];
  const initials = (name) => name.replace(/[^A-Za-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const pmark = (o, cls = '') => { const src = logoSrc(o.pid); return src ? `<span class="pm pm--logo ${cls}" aria-hidden="true"><img src="${src}" alt="" loading="lazy" decoding="async"></span>` : `<span class="pm ${cls}" style="--pmc:${feltOf(o.pid)}" aria-hidden="true">${esc(initials(o.p))}</span>`; };
  const STAR_D = 'M10 1.6l2.5 5.2 5.7.8-4.1 4 1 5.6L10 14.5l-5.1 2.7 1-5.6-4.1-4 5.7-.8z';
  let stUid = 0;
  const stars = (score) => {
    const id = `stc${stUid++}`;
    const w = (Math.max(0, Math.min(5, score)) / 5) * 100;
    const row = (cls) => [0, 1, 2, 3, 4].map((i) => `<path class="${cls}" transform="translate(${i * 20} 0)" d="${STAR_D}"/>`).join('');
    return `<svg class="stars" viewBox="0 0 100 19" aria-hidden="true" focusable="false"><clipPath id="${id}"><rect width="${w.toFixed(1)}" height="19"/></clipPath>${row('st-off')}<g clip-path="url(#${id})">${row('st-on')}</g></svg>`;
  };
  const rating = (o) => (o.tp == null ? '<span class="rating rating--none">No Trustpilot rating yet</span>' : `<span class="rating">${stars(o.tp)}<b class="num">${o.tp.toFixed(1)}</b><span>Trustpilot · ${(o.tpc ?? 0).toLocaleString('en-US')} reviews</span><span class="sr-only">${o.tp.toFixed(1)} out of 5</span></span>`);
  const locTxt = (o) => { const cs = [...new Set((o.loc || []).map(code).filter(Boolean))]; return cs.length ? cs.slice(0, 3).join(', ') + (cs.length > 3 ? ` +${cs.length - 3}` : '') : 'Location not published'; };

  /* ── Pail (compare selection) ───────────────────── */
  let pail = (() => { try { return JSON.parse(localStorage.getItem('shore-pail') || '[]').filter((id) => byId.has(id)).slice(0, 4); } catch { return []; } })();
  function paintPail() {
    const btn = $('#pailBtn');
    btn.dataset.n = pail.length;
    btn.setAttribute('aria-label', `Compare, ${pail.length} of 4 plans selected`);
    $('#pailCount').textContent = pail.length;
    $('#pailShells').innerHTML = pailShells(pail.length);
  }
  function savePail() { localStorage.setItem('shore-pail', JSON.stringify(pail)); paintPail(); }
  function bobPail() { const p = $('.pail'); p.classList.remove('bob'); void p.getBoundingClientRect(); p.classList.add('bob'); }
  function fly(fromEl, o) {
    if (!fromEl || reduced()) { bobPail(); return; }
    const a = fromEl.getBoundingClientRect();
    const b = $('.pail').getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'flyer';
    el.innerHTML = shellSvg(o);
    document.body.append(el);
    const x0 = a.left + a.width / 2 - 15; const y0 = a.top + a.height / 2 - 13;
    const dx = b.left + b.width / 2 - 15 - x0; const dy = b.top - 2 - y0;
    el.style.left = `${x0}px`; el.style.top = `${y0}px`;
    const anim = el.animate([
      { transform: 'translate(0,0) scale(1) rotate(0deg)' },
      { transform: `translate(${dx * 0.55}px, ${dy * 0.55 - 70}px) scale(.95) rotate(-140deg)`, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(.5) rotate(-260deg)`, opacity: 0.85 },
    ], { duration: 360, easing: 'cubic-bezier(.3,.7,.3,1)' });
    anim.onfinish = () => { el.remove(); bobPail(); };
  }
  function toast(msg, pose = 'error', tone = 'warn') {
    let t = $('#toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); document.body.append(t); }
    t.className = `toast toast--${tone}`;
    t.innerHTML = `<span class="toast__art">${pet('bvp', pose)}</span><span>${esc(msg)}</span>`;
    void t.offsetWidth;
    t.classList.add('on');
    clearTimeout(t.hideT);
    t.hideT = setTimeout(() => t.classList.remove('on'), 3400);
  }
  function brandPose(p) {
    const s = $('#brandCrab .pet');
    if (!s) return;
    setPose(s, p);
    clearTimeout(brandPose.t);
    brandPose.t = setTimeout(() => setPose(s, 'idle'), 1600);
  }
  function togglePail(id, fromEl) {
    const o = byId.get(id);
    if (pail.includes(id)) { pail = pail.filter((x) => x !== id); savePail(); say(`Removed ${o.name}. ${pail.length} of 4 selected.`); return true; }
    if (pail.length >= 4) { toast('Your pail is full. Compare up to 4 plans; remove one first.'); brandPose('error'); return false; }
    pail.push(id); savePail(); fly(fromEl, o); brandPose('success'); say(`Added ${o.name}. ${pail.length} of 4 selected.`);
    const c = $('#pailCount'); c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop');
    return true;
  }

  /* ── Count roll ─────────────────────────────────── */
  function roll(el, to, ms = 260) {
    if (!el) return;
    const from = Number(el.dataset.v || 0);
    el.dataset.v = to;
    if (reduced() || from === to) { el.textContent = to; return; }
    const t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / ms); el.textContent = Math.round(from + (to - from) * (1 - (1 - k) ** 3)); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  /* ── Cost shell (36 months, one turn per year) ── */
  function costPlan(o) {
    const rate = rateOf(o);
    if (!o.tr) return { ok: false, reason: 'Billing terms for this plan are not reviewed yet.' };
    if (rate == null) return { ok: false, reason: `No dated exchange rate for ${o.cur}, so we don’t convert it.` };
    const im = o.introM ?? o.upfront ?? 0;
    const intro = (o.intro ?? o.eff) * rate;
    const ren = o.ren != null ? o.ren * rate : null;
    if (im === 0 && ren != null && Math.abs(ren - o.eff * rate) > 0.005) return { ok: false, reason: 'The renewal differs from today’s price, but the intro length is not published.' };
    const same = ren != null && Math.abs(intro - ren) < 0.005;
    const months = Array.from({ length: 36 }, (_, m) => {
      if (m < im) return { cost: intro, kind: same ? 'base' : 'intro' };
      if (ren == null) return { cost: null, kind: 'unknown' };
      return { cost: ren, kind: im > 0 && !same ? 'renew' : 'base' };
    });
    const setup = o.setup != null ? o.setup * rate : null;
    const known = months.every((m) => m.cost != null);
    const total = o.real != null && setup != null && known ? Math.round((setup + months.reduce((s, m) => s + m.cost, 0)) * 100) / 100 : null;
    const missing = [setup == null ? 'setup fee' : null, ren == null ? 'renewal price' : null].filter(Boolean);
    return { ok: true, months, setup, total, missing };
  }
  const KIND = { intro: 'Intro price', renew: 'Renewal price', base: 'Monthly price', unknown: 'Not published' };
  function runsOf(months) {
    const out = [];
    months.forEach((m, i) => { const last = out[out.length - 1]; if (last && last.kind === m.kind && last.cost === m.cost) last.b = i + 1; else out.push({ a: i + 1, b: i + 1, kind: m.kind, cost: m.cost }); });
    return out;
  }
  function costChart(plan) {
    const W = 720; const top = 34; const base = 168; const bw = 15; const gap = 5; const step = bw + gap;
    const mx = Math.max(...plan.months.map((m) => m.cost || 0), 0.01);
    const hOf = (c) => Math.max(6, ((base - top) * c) / mx);
    let s = `<svg class="cc" viewBox="0 0 ${W} 206" role="img" aria-labelledby="ccT" focusable="false"><title id="ccT">What you pay in each of the first 36 months. Taller bars cost more.</title>`;
    [12, 24].forEach((m) => { const x = m * step - gap / 2; s += `<path class="cc-year" d="M${x} ${top - 10}V${base + 8}"/>`; });
    [0, 1, 2].forEach((y) => { s += `<text class="cc-yl" x="${(y * 12 + 6) * step - gap / 2}" y="${base + 30}">Year ${y + 1}</text>`; });
    plan.months.forEach((m, i) => {
      const x = i * step;
      const tip = `Month ${i + 1}: ${m.cost == null ? 'not published' : `${money(m.cost)} · ${KIND[m.kind].toLowerCase()}`}`;
      if (m.cost == null) s += `<rect class="cc-bar cc-k-unknown" x="${x}" y="${base - 40}" width="${bw}" height="40" rx="3" style="--i:${i}" data-tip="${esc(tip)}"/>`;
      else { const h = hOf(m.cost); s += `<rect class="cc-bar cc-k-${m.kind}" x="${x}" y="${(base - h).toFixed(1)}" width="${bw}" height="${h.toFixed(1)}" rx="3" style="--i:${i}" data-tip="${esc(tip)}"/>`; }
    });
    s += `<path class="cc-base" d="M0 ${base}H${W}"/>`;
    runsOf(plan.months).forEach((r) => {
      const h = r.cost == null ? 40 : hOf(r.cost);
      s += `<text class="cc-lab" x="${(r.a - 1) * step}" y="${(base - h - 10).toFixed(1)}">${r.cost == null ? 'Not published' : `${money(r.cost)}/mo`}</text>`;
    });
    return `${s}</svg>`;
  }
  function costStrip(plan) {
    if (!plan.ok) return `<span class="unk">${esc(plan.reason)}</span>`;
    const runs = runsOf(plan.months);
    return `<div class="strip"><div class="strip__bar" aria-hidden="true">${runs.map((r) => `<span class="strip__seg strip__seg--${r.kind}" style="flex:${r.b - r.a + 1}"></span>`).join('')}</div><div class="strip__legend">${runs.map((r) => `<span><i class="sw sw--${r.kind}"></i>${r.b - r.a + 1} mo at ${r.cost != null ? `<b class="num">${money(r.cost)}</b>` : 'a price not published'}</span>`).join('')}</div></div>`;
  }
  function costShellHtml(o, plan) {
    if (!plan.ok) {
      return `<div class="cost cost--none"><div class="cost__side"><p class="cost__big">No 36-month view yet</p><p class="cost__sub">${esc(plan.reason)} Until then you see the advertised price, and the receipt marks every missing fact.</p></div></div>`;
    }
    const runs = runsOf(plan.months);
    const head = plan.total != null
      ? `<p class="cost__big"><b class="num">${money(plan.total)}</b> over 36 months</p><p class="cost__sub">${money(plan.total / 36)}/mo on average, setup included.</p>`
      : `<p class="cost__big">36-month total: not computable</p><p class="cost__sub">The ${plan.missing.join(' and ')} ${plan.missing.length > 1 ? 'are' : 'is'} not published, so we don’t add it up.</p>`;
    return `<div class="cost"><div class="cost__chart" data-draw>${costChart(plan)}</div><div class="cost__side">${head}
      <ul class="runs">${runs.map((r) => `<li><span class="sw sw--${r.kind}"></span><span>Month${r.b > r.a ? `s ${r.a}–${r.b}` : ` ${r.a}`} · ${KIND[r.kind]}</span><b class="num">${r.cost != null ? `${money(r.cost)}/mo` : 'Not published'}</b></li>`).join('')}
      <li><span class="sw sw--knot"></span><span>Setup fee, paid once</span><b class="num">${plan.setup != null ? money(plan.setup) : 'Not published'}</b></li></ul>
      <details><summary>Show every month as a table</summary><table class="mtable"><thead><tr><th scope="col">Months</th><th scope="col">Type</th><th scope="col">Per month</th></tr></thead><tbody>${runs.map((r) => `<tr><td class="num">${r.a}${r.b > r.a ? `–${r.b}` : ''}</td><td>${KIND[r.kind]}</td><td class="num">${r.cost != null ? money(r.cost) : 'Not published'}</td></tr>`).join('')}</tbody></table></details>
    </div></div>`;
  }

  /* ── Home: the shore ─────────────────────────────── */
  const STARS = [[700, 70, 1], [820, 160, 0.7], [900, 52, 0.9], [990, 220, 0.6], [1080, 110, 1], [1160, 36, 0.8], [1330, 250, 0.7], [1400, 92, 0.9], [760, 280, 0.5], [1050, 310, 0.6], [1250, 340, 0.5], [1380, 370, 0.6], [640, 40, 0.6], [940, 350, 0.5], [1200, 200, 0.6]];
  const SKY = `<svg class="hero__sky" viewBox="0 0 1440 400" preserveAspectRatio="xMaxYMin slice" aria-hidden="true" focusable="false">${STARS.map(([x, y, s], i) => `<path class="${i % 3 ? '' : 'tw'}" style="--d:${((i * 0.9) % 4).toFixed(1)}s" d="M${x} ${y - 4 * s}Q${x} ${y} ${x - 4 * s} ${y}Q${x} ${y} ${x} ${y + 4 * s}Q${x} ${y} ${x + 4 * s} ${y}Q${x} ${y} ${x} ${y - 4 * s}Z"/>`).join('')}</svg>`;
  const MOON = '<div class="moon" aria-hidden="true"><svg viewBox="-110 -110 220 220" focusable="false"><circle class="moon__halo" r="70"/><circle class="moon__ring" r="78"/><circle class="moon__ring moon__ring--2" r="104"/><g class="sun"><path class="sun__rays" d="M0-58v12M0 46v12M-58 0h12M46 0h12M-41-41l8 8M33 33l8 8M-41 41l8-8M33-33l8-8"/><circle class="sun__body" r="32"/><circle class="sun__seam" r="27"/></g><path class="moon__body" d="M-8-34A34 34 0 1 0 30 16 27 27 0 1 1-8-34Z"/><path class="moon__seam" d="M-8-34A34 34 0 1 0 30 16 27 27 0 1 1-8-34Z"/></svg></div>';
  const BUBBLE = { idle: 'Too small. Too pricey. This one.', working: 'Checking shells…', success: 'This one.', error: 'Nothing fits. Loosen one need?' };
  const reasonFor = (o, n) => (n.ram && (o.ram == null || o.ram < n.ram) ? 'Too small' : n.price && (o.usd == null || o.usd > n.price) ? 'Too pricey' : n.regions?.length && !n.regions.some((r) => inBand(o, r)) ? 'Other region' : null);
  const shellScale = (ram) => (ram == null ? 1 : Math.min(1.14, Math.max(0.9, 0.9 + 0.06 * Math.log2(Math.max(ram, 0.5) / 0.5))));
  const specLine = (o) => [o.vcpu != null ? `${o.vcpu} vCPU` : null, gb(o.ram), diskTxt(o.disk)].filter(Boolean).join(' · ');
  let homeIntro = false;
  let homeResize = null;
  let homeIO = null;

  function shellNode(o) {
    const a = document.createElement('a');
    a.className = 'pshell';
    a.href = `#offer/${o.id}`;
    a.dataset.id = o.id;
    a.style.setProperty('--s', shellScale(o.ram).toFixed(2));
    a.innerHTML = `<span class="why" aria-hidden="true"></span><span class="ribbon" aria-hidden="true">${ICON('check')}This one.</span><span class="ptag" aria-hidden="true"><span class="ptag__p"><b>${money(o.usd)}</b><small>/mo</small></span><span class="ptag__r">${o.ram != null ? `${esc(gb(o.ram))} RAM` : 'RAM not published'}</span></span><span class="pshell__thread" aria-hidden="true"></span>${shellSvg(o)}<span class="pshell__name" aria-hidden="true">${esc(o.p)}</span><span class="sr-only">${esc(o.name)} by ${esc(o.p)}: ${esc(gb(o.ram) || 'memory not published')} RAM, ${money(o.usd)} a month.</span>`;
    return a;
  }

  function callCrab() {
    const wrap = document.createElement('div');
    wrap.innerHTML = pet('bvp', 'idle', 'call');
    const svg = wrap.firstElementChild;
    if (!svg) return '';
    svg.classList.add('call-crab');
    const piece = (d, fab) => `<path class="pw-shadow" d="${d}"/><path class="pw-fab ${fab}" d="${d}"/><path class="pw-seam" d="${d}"/>`;
    svg.insertAdjacentHTML('beforeend', `<g class="call">
      <g class="call-ring"><path d="M34.2 76.4a6 6 0 0 1 1.6-6.2"/><path d="M30.8 78a10 10 0 0 1 2.8-10.8"/></g>
      ${piece('M53 104C49 102.4 46.4 98.4 45.4 93.2L49.4 92.4C50.2 96 52 98.8 55.2 100.2Z', 'f-crab')}
      <g class="call-phone"><g transform="rotate(16 41.5 79)">${piece('M40 71h3a2.5 2.5 0 0 1 2.5 2.5v11a2.5 2.5 0 0 1-2.5 2.5h-3a2.5 2.5 0 0 1-2.5-2.5v-11a2.5 2.5 0 0 1 2.5-2.5Z', 'f-phone')}<rect class="call-screen" x="38.8" y="73.4" width="5.4" height="8.6" rx="1"/></g></g>
      ${piece('M38.6 89a4.8 3.8 0 1 0 9.6 0a4.8 3.8 0 1 0-9.6 0Z', 'f-crab')}
      <g class="call-bubble">${piece('M7 46h25a5 5 0 0 1 5 5v6a5 5 0 0 1-5 5h-5l-3 5-4-5h-13a5 5 0 0 1-5-5v-6a5 5 0 0 1 5-5Z', 'f-bubble')}<circle class="call-talk" cx="13.5" cy="54" r="1.6"/><circle class="call-talk" cx="19.5" cy="54" r="1.6"/><circle class="call-talk" cx="25.5" cy="54" r="1.6"/></g>
    </g>`);
    return svg.outerHTML;
  }

  function renderHome() {
    const n = loadNeeds();
    const ex = byId.get('hostinger-kvm-2') || D.find((o) => o.tr && o.introM) || D[0];
    const picks = onePer(D, 5);
    const stepNeeds = { ram: 4, price: 10, regions: ['europe'] };
    const stepFit = D.filter((o) => matches(o, stepNeeds)).length;
    const opt = (v, cur, label) => `<option value="${v}"${cur === v ? ' selected' : ''}>${label}</option>`;
    const exRows = [
      ex.tr && ex.introM ? [`First ${ex.introM} months`, `<b class="num">${money(conv(ex, ex.intro ?? ex.eff))}/mo</b>`] : ['Monthly price', `<b class="num">${money(ex.usd)}/mo</b>`],
      ['Renews at', ex.tr && ex.ren != null ? `<b class="num">${money(conv(ex, ex.ren))}/mo</b>` : `<span class="unk">${ex.tr ? 'Not published' : 'Not reviewed yet'}</span>`],
      ['Setup fee', ex.setup != null ? `<b class="num">${money(conv(ex, ex.setup))}</b>` : '<span class="unk">Not published</span>'],
    ];
    app.innerHTML = `<div class="page page--home">
      <section class="hero night" aria-labelledby="home-title">
        ${SKY}${MOON}
        <div class="hero__copy">
          <h1 id="home-title">The right server,<br>at an honest price.</h1>
          <p class="hero__lead">We compare VPS plans on intro price, renewal, setup fee and contract. Tell the crab what your project needs.</p>
          <form class="finder" id="finder" novalidate>
            <div class="finder__grid">
              <div class="field"><label for="f-ram">Memory</label><select class="select" id="f-ram" name="ram"><option value="">Any</option>${RAM_STEPS.map((v) => opt(v, n.ram, `${gb(v)} or more`)).join('')}</select></div>
              <div class="field"><label for="f-price">Budget</label><select class="select" id="f-price" name="price"><option value="">Any</option>${PRICE_STEPS.map((v) => opt(v, n.price, `Under $${v}/mo`)).join('')}</select></div>
              <div class="field"><label for="f-region">Region</label><select class="select" id="f-region" name="region"><option value="">Anywhere</option>${REGIONS.map(([id, l]) => opt(id, n.regions[0], l)).join('')}</select></div>
            </div>
            <div class="finder__out">
              <p class="finder__count"><b class="num" id="fitCount">0</b><span id="fitWord">plans fit</span></p>
              <a class="btn btn--primary" id="fitGo" href="#catalog"><span id="fitGoTxt">Show the plans</span>${ICON('arrow', 'ico--arrow')}</a>
            </div>
            <div class="finder__relax" id="finderRelax"></div>
          </form>
        </div>
        <div class="hero__shore" id="scene">
          <div class="hero__sea" aria-hidden="true"><span class="hero__glint"><i></i><i></i><i></i></span></div>
          <div class="hero__swash" aria-hidden="true"></div>
          <div class="hero__beach" aria-hidden="true"><i class="pebble" style="left:12%;top:70%"></i><i class="pebble" style="left:41%;top:84%"></i><i class="pebble pebble--s" style="left:63%;top:62%"></i><i class="pebble" style="left:86%;top:80%"></i></div>
          <div class="hero__scrim" aria-hidden="true"></div>
          <div class="hero__lantern" aria-hidden="true"></div>
          <div class="crabbox" aria-hidden="true">
            <p class="bubble" id="bubble">${BUBBLE.idle}</p>
            <div class="crabbox__crab" id="heroCrab">${pet('bvp', 'idle')}</div>
            <div class="crabbox__vm" id="vm">${babyVM()}</div>
          </div>
          <ol class="shells" aria-label="Top plans for your needs, one per provider">${[0, 1, 2, 3].map((i) => `<li class="slot slot-${i}" aria-hidden="true"></li>`).join('')}</ol>
        </div>
      </section>

      <section class="proof" aria-label="Catalog facts">
        <div class="proof__in wrap">
          <div class="stat">${ICON('shell')}<b class="num" data-count="${META.count}">${META.count}</b><span>VPS plans compared</span></div>
          <div class="stat">${ICON('pin')}<b class="num" data-count="${META.providers}">${META.providers}</b><span>hosting providers</span></div>
          <div class="stat">${ICON('lantern')}<b class="num">${fmtDate(META.snapshot)}</b><span>latest price check</span></div>
          <div class="stat">${ICON('tag')}<b class="num">0</b><span>paid rankings. Commission never changes the order.</span></div>
        </div>
      </section>

      <section class="sec wrap" aria-labelledby="board-h">
        <div class="sec__head">
          <div><h2 id="board-h">Ranked by value score</h2><p class="sec__sub">The best plan from each provider. Price, RAM per dollar, Trustpilot and evidence decide the order. Commission doesn’t.</p></div>
          <a class="pill" href="#catalog">All ${META.count} plans${ICON('arrow', 'ico--arrow')}</a>
        </div>
        <ol class="board">${picks.map((o, i) => `<li class="${i === 0 ? 'top' : ''}"><span class="board__rank num">${i + 1}</span>${pmark(o)}<a class="board__name" href="#offer/${o.id}">${esc(o.name)}<span>${esc(o.p)} · ${esc(locTxt(o))}</span></a><span class="board__spec num">${specLine(o)}</span><span class="board__price"><b class="num">${money(o.usd)}</b><small>/mo</small>${o.real != null ? RV : ''}</span></li>`).join('')}</ol>
      </section>

      <section class="how wrap" aria-labelledby="how-h">
        <div class="how__head">
          <h2 id="how-h">How the crab reads the fine print</h2>
          <p>Three steps, the same for every plan in the catalog.</p>
        </div>
        <ol class="how__steps">
          <li class="step"><span class="step__knot num" aria-hidden="true">1</span><div class="step__body">
            <h3>Tell it what your project needs</h3>
            <p>Memory, budget and region. Plans that don’t fit step aside, and you see why.</p>
            <a class="tile night" data-pose="working" href="#catalog${qstr(stepNeeds)}" aria-label="See the ${stepFit} plans with 4 GB RAM or more, under $10 a month, in Europe"><span class="tile__art">${pet('bvp', 'idle')}</span><span class="tile__ui"><span class="patch patch--static">4 GB+ RAM</span><span class="patch patch--static">Under $10</span><span class="patch patch--static">Europe</span><span class="tile__note"><b class="num">${stepFit}</b> plans fit these needs today ${ICON('arrow', 'ico--arrow')}</span></span></a>
          </div></li>
          <li class="step"><span class="step__knot num" aria-hidden="true">2</span><div class="step__body">
            <h3>It reads the fine print</h3>
            <p>Intro price, renewal, setup fee and contract, each with a date. Missing facts say “Not published”.</p>
            <a class="tile night" data-pose="quirk" href="#offer/${ex.id}" aria-label="Open the price receipt for ${esc(ex.name)} by ${esc(ex.p)}"><span class="tile__art">${pet('bvp', 'idle')}</span><span class="tile__ui"><span class="mini-r">${exRows.map(([l, v]) => `<span class="mini-r__line"><span>${esc(l)}</span>${v}<i aria-hidden="true"></i></span>`).join('')}</span><span class="tile__note">${esc(ex.p)} ${esc(ex.name)} · checked ${fmtDate(ex.checked)} ${ICON('arrow', 'ico--arrow')}</span></span></a>
          </div></li>
          <li class="step"><span class="step__knot num" aria-hidden="true">3</span><div class="step__body">
            <h3>You pick, and buy direct</h3>
            <p>The button goes straight to the provider. Paid links are labelled and never change the order.</p>
            <a class="tile night" data-pose="success" href="#offer/${ex.id}" aria-label="See ${esc(ex.name)} by ${esc(ex.p)}"><span class="tile__art">${pet('bvp', 'idle')}</span><span class="tile__ui"><span class="mini-shell">${shellSvg(ex)}</span><span class="ribbon">${ICON('check')}This one.</span><span class="tile__note">${ex.aff ? 'Ad: we may earn a commission. It never changes the order.' : 'Direct link. No commission on this plan.'} ${ICON('arrow', 'ico--arrow')}</span></span></a>
          </div></li>
        </ol>
      </section>

      <section class="contact night" aria-labelledby="contact-h">
        <div class="contact__crab" aria-hidden="true">${callCrab()}</div>
        <div class="contact__text">
          <h2 id="contact-h">Ring the crab.</h2>
          <p>A price that changed, a plan we missed, or a project you want a second opinion on? Send it over. A person reads every message.</p>
          <p class="contact__links">
            <a class="btn btn--primary" href="mailto:hello@bestvpsforme.com">hello@bestvpsforme.com</a>
            <a class="btn" href="#corrections">Send a price correction</a>
            <a class="btn" href="https://x.com/Twarga_Dev" target="_blank" rel="noopener">@Twarga_Dev on X</a>
          </p>
        </div>
      </section>
    </div>`;
    heroWire();
    const wash = () => { const sc = $('#scene'); if (!sc || reduced()) return; sc.classList.remove('washing'); void sc.offsetWidth; sc.classList.add('washing'); later(wash, 11000); };
    later(wash, 1700);
    return 'Compare VPS plans';
  }

  function heroWire() {
    const form = $('#finder');
    const scene = $('#scene');
    const crab = $('#heroCrab .pet');
    const bubble = $('#bubble');
    const vm = $('#vm');
    const slots = $$('.slot', scene);
    let token = 0;
    const visible = () => slots.filter((s) => getComputedStyle(s).display !== 'none');
    const needs = () => ({ ram: Number(form.ram.value) || null, price: Number(form.price.value) || null, regions: form.region.value ? [form.region.value] : [] });
    const speak = (k) => { bubble.textContent = BUBBLE[k]; bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop'); };
    const crown = (id) => $$('.pshell', scene).forEach((s) => s.classList.toggle('win', s.dataset.id === id));

    function place(picks, animate) {
      const vis = visible();
      slots.filter((s) => !vis.includes(s)).forEach((s) => s.replaceChildren());
      const want = picks.slice(0, vis.length);
      const ids = new Set(want.map((o) => o.id));
      const kept = new Set();
      vis.forEach((s) => {
        const el = s.firstElementChild;
        if (el && ids.has(el.dataset.id)) { kept.add(el.dataset.id); el.classList.remove('leave', 'out'); return; }
        s.replaceChildren();
      });
      const free = vis.filter((s) => !s.firstElementChild);
      let k = 0;
      want.filter((o) => !kept.has(o.id)).forEach((o) => {
        const s = free.shift();
        if (!s) return;
        const el = shellNode(o);
        if (animate) { el.classList.add('enter'); el.style.setProperty('--k', k++); }
        s.append(el);
      });
      slots.forEach((s) => s.setAttribute('aria-hidden', s.firstElementChild ? 'false' : 'true'));
      crown(null);
      return want;
    }

    function update() {
      const n = needs();
      saveNeeds(n);
      const fit = D.filter((o) => matches(o, n));
      const picks = onePer(fit, 4);
      roll($('#fitCount'), fit.length);
      $('#fitWord').textContent = fit.length === 1 ? 'plan fits' : 'plans fit';
      $('#fitGo').href = `#catalog${qstr(n)}`;
      $('#fitGoTxt').textContent = fit.length ? `Show the ${fit.length} plan${fit.length === 1 ? '' : 's'}` : 'Open the catalog';
      vm.style.setProperty('--vm', n.ram >= 16 ? 1.45 : n.ram >= 4 ? 1.22 : 1);
      $('#finderRelax').innerHTML = fit.length ? '' : relaxOptions({ ...blankQ(), ...n }).map((r) => `<button type="button" class="chip" data-relax='${esc(JSON.stringify(r.next))}'>${esc(r.label)} → <b>${r.n}</b></button>`).join('');
      return { n, fit, picks };
    }

    function run() {
      const { n, fit, picks } = update();
      const my = ++token;
      const fast = reduced();
      say(`${fit.length} ${fit.length === 1 ? 'plan fits' : 'plans fit'}.`);
      crown(null);
      const ids = new Set(picks.slice(0, visible().length).map((o) => o.id));
      $$('.pshell', scene).forEach((el) => {
        el.classList.remove('enter');
        const why = reasonFor(byId.get(el.dataset.id), n);
        el.classList.toggle('out', Boolean(why));
        $('.why', el).textContent = why || '';
      });
      setPose(crab, 'working');
      speak('working');
      vm.classList.remove('happy', 'shiver');
      later(() => {
        if (my !== token) return;
        if (!picks.length) {
          setPose(crab, 'error');
          speak('error');
          vm.classList.add('shiver');
          return;
        }
        $$('.pshell', scene).forEach((el) => { if (!ids.has(el.dataset.id)) el.classList.add('leave'); });
        later(() => {
          if (my !== token) return;
          const want = place(picks, !fast);
          setPose(crab, 'success');
          speak('success');
          vm.classList.add('happy');
          later(() => { if (my === token && want[0]) crown(want[0].id); }, fast ? 0 : 260 + want.length * 90);
          later(() => { if (my === token) { setPose(crab, 'idle'); vm.classList.remove('happy'); } }, 2600);
        }, fast ? 0 : 300);
      }, fast ? 0 : 950);
    }

    const init = update();
    const first = place(init.picks, !reduced() && !homeIntro);
    homeIntro = true;
    if (hasNeeds(init.n) && first[0]) { speak('success'); later(() => crown(first[0].id), reduced() ? 0 : 700); }

    form.addEventListener('change', run);
    form.addEventListener('submit', (e) => { e.preventDefault(); location.hash = $('#fitGo').getAttribute('href'); });
    form.addEventListener('click', (e) => {
      const b = e.target.closest('[data-relax]');
      if (!b) return;
      const next = JSON.parse(b.dataset.relax);
      form.ram.value = next.ram || '';
      form.price.value = next.price || '';
      form.region.value = next.regions?.[0] || '';
      ddSync(form);
      run();
    });

    if (finePointer.matches) {
      let raf = 0; let px = 0; let py = 0;
      scene.addEventListener('pointermove', (e) => {
        const r = scene.getBoundingClientRect();
        px = e.clientX - r.left; py = e.clientY - r.top;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          scene.style.setProperty('--mx', `${px}px`);
          scene.style.setProperty('--my', `${py}px`);
          $$('.pshell', scene).forEach((s) => { const b = s.getBoundingClientRect(); s.classList.toggle('lit', !s.classList.contains('out') && Math.hypot(b.left + b.width / 2 - r.left - px, b.top + b.height / 2 - r.top - py) < 110); });
        });
      });
      scene.addEventListener('pointerleave', () => { scene.style.setProperty('--mx', '-600px'); $$('.pshell.lit', scene).forEach((s) => s.classList.remove('lit')); });
    }

    homeIO = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      homeIO.unobserve(e.target);
      const el = e.target;
      if (el.dataset.count && !reduced()) { el.dataset.v = '0'; el.textContent = '0'; roll(el, Number(el.dataset.count), 900); }
      if (el.dataset.pose) { const svg = $('.pet', el); setPose(svg, el.dataset.pose); later(() => setPose(svg, 'idle'), 3200); }
    }), { threshold: 0.5 });
    $$('[data-count], [data-pose]', app).forEach((el) => homeIO.observe(el));
  }

  /* ── Catalog ─────────────────────────────────────── */
  let CQ = null;
  let catState = 'ok';
  const stepIdx = (k, v) => { const st = RANGES[k].steps; if (v == null) return st.indexOf(null); const i = st.findIndex((x) => x != null && x >= v); return i < 0 ? st.length - 1 : i; };
  const rangeTxt = (k, v) => (v == null ? (k === 'price' ? 'Any budget' : 'Any') : RANGES[k].txt(v));
  function rangeHtml(k) {
    const R = RANGES[k]; const st = R.steps; const i = stepIdx(k, CQ[k]);
    const ends = [st[0], st[st.length - 1]].map((v) => (v == null ? 'Any' : k === 'price' ? `$${v}` : k === 'ram' ? gb(v) : k === 'disk' ? diskTxt(v) : `${v}`));
    return `<div class="fl fl--rng" data-k="${k}"><div class="fl__h"><label for="r-${k}">${ICON(R.icon)}${R.label}</label><output id="o-${k}" for="r-${k}">${esc(rangeTxt(k, CQ[k]))}</output></div>
      <input class="rng" type="range" id="r-${k}" data-rng="${k}" min="0" max="${st.length - 1}" step="1" value="${i}" aria-valuetext="${esc(rangeTxt(k, CQ[k]))}" style="--p:${((i / (st.length - 1)) * 100).toFixed(2)}%">
      <div class="rng__ends" aria-hidden="true"><span>${ends[0]}</span><span>${ends[1]}</span></div></div>`;
  }
  function checklist(id, label, items, sel, search) {
    return `<details class="fl fl--list" id="${id}"${sel.length ? ' open' : ''}><summary><span>${label}</span><span class="fl__n num" data-n="${id}">${sel.length ? sel.length : ''}</span></summary>
      ${search ? `<label class="search search--sm">${ICON('search')}<span class="sr-only">Search ${label.toLowerCase()}</span><input type="search" data-find="${id}" placeholder="Search" autocomplete="off"></label>` : ''}
      <ul class="cl">${items.map(([v, l, n]) => `<li data-name="${esc(l.toLowerCase())}"><label class="ck"><input type="checkbox" data-g="${id === 'fl-prov' ? 'prov' : 'loc'}" value="${esc(v)}"${sel.includes(v) ? ' checked' : ''}><span class="ck__box" aria-hidden="true">${ICON('check')}</span><span class="ck__l">${esc(l)}</span><span class="ck__n num">${n}</span></label></li>`).join('')}</ul></details>`;
  }
  function railHtml() {
    const chip = (g, v, label, on) => `<button type="button" class="chip" data-g="${g}" data-v="${v}" aria-pressed="${on}">${label}</button>`;
    const provs = [...new Map(D.map((o) => [o.pid, o.p])).entries()].map(([v, l]) => [v, l, D.filter((o) => o.pid === v).length]).sort((a, b) => a[1].localeCompare(b[1]));
    const cs = Object.keys(CC).map((c) => [c, cName(c), D.filter((o) => (o.loc || []).some((l) => code(l) === c)).length]).filter((x) => x[2]).sort((a, b) => a[1].localeCompare(b[1]));
    const more = activeMore();
    return `<div class="rail__head"><h2>Filters</h2><button class="icon-btn" type="button" id="closeSheet" aria-label="Close filters">${ICON('close')}</button></div>
      <div class="rail__body">
      <label class="search search--rail">${ICON('search')}<span class="sr-only">Search plans or providers</span><input type="search" id="fq" placeholder="Search plans or providers" value="${esc(CQ.q)}" autocomplete="off"></label>
      ${rangeHtml('ram')}
      ${rangeHtml('price')}
      <fieldset class="fl"><legend>${ICON('pin')}Region</legend><div class="chips">${REGIONS.map(([id, l]) => chip('regions', id, l, CQ.regions.includes(id))).join('')}</div></fieldset>
      <details class="more" id="more"${more ? ' open' : ''}><summary><span>More filters</span><span class="fl__n num" id="moreN">${more || ''}</span></summary>
        ${rangeHtml('cpu')}
        ${rangeHtml('disk')}
        <div class="fl"><div class="fl__h"><span class="fl__lab" id="tpL">${ICON('star')}Trustpilot rating</span></div><div class="seg seg--sm seg--fill" role="group" aria-labelledby="tpL">${TP_STEPS.map(([v, l]) => `<button type="button" data-tp="${v ?? ''}" aria-pressed="${(CQ.tp ?? null) === v}">${l}</button>`).join('')}</div></div>
        <fieldset class="fl"><legend>${ICON('check')}Honest terms</legend><div class="tg">${FLAGS.map(([id, l]) => `<label class="tgl"><input type="checkbox" role="switch" data-g="flags" value="${id}"${CQ.flags.includes(id) ? ' checked' : ''}><span class="tgl__t" aria-hidden="true"></span><span>${l}</span></label>`).join('')}</div></fieldset>
        ${checklist('fl-prov', 'Providers', provs, CQ.prov, true)}
        ${checklist('fl-loc', 'Countries', cs, CQ.loc, false)}
      </details>
      <button type="button" class="linkish rail__clear" data-drop="all">Reset all filters</button>
      </div>
      <div class="rail__foot"><button class="btn btn--primary" type="button" id="applySheet">Show <span class="num" id="sheetCount">0</span> plans</button></div>`;
  }
  const activeMore = () => (CQ.cpu ? 1 : 0) + (CQ.disk ? 1 : 0) + (CQ.tp ? 1 : 0) + CQ.flags.length + CQ.prov.length + CQ.loc.length;
  function renderCatalog(qs) {
    CQ = parseQ(qs);
    catState = 'ok';
    app.innerHTML = `<div class="page wrap">
      <div class="cat-head">
        <div><h1 class="ptitle">VPS plans</h1><p class="cat-meta"><span class="num" id="catCount">0</span> results · Snapshot ${fmtDate(META.snapshot)}</p></div>
        <div class="cat-tools">
          <button class="btn btn--filters" type="button" id="openSheet" aria-controls="rail" aria-expanded="false">${ICON('shell')}Filters <span class="num" id="fCount"></span></button>
          <label class="sortl" for="sort"><span>Sort by</span><select class="select select--sm" id="sort">${Object.entries(SORTS).map(([k, l]) => `<option value="${k}"${CQ.sort === k ? ' selected' : ''}>${l}</option>`).join('')}</select></label>
          <button class="pill dirbtn" type="button" id="dirBtn">${ICON('sort')}<span id="dirTxt">${dirTxt(CQ.sort, CQ.dir)}</span></button>
          <div class="seg seg--view" role="group" aria-label="View"><button type="button" data-view="list" aria-pressed="${CQ.view === 'list'}">${ICON('list')}<span>List</span></button><button type="button" data-view="cards" aria-pressed="${CQ.view === 'cards'}">${ICON('grid')}<span>Cards</span></button></div>
        </div>
      </div>
      <div class="cat">
        <aside class="rail" id="rail" aria-label="Filters">${railHtml()}</aside>
        <section aria-label="Results">
          <div class="patches" id="patches"></div>
          <p class="disclose">${ICON('tag')}<span>Links marked <b>Ad</b> may earn us a commission. They never change the order.</span></p>
          <div id="results"></div>
        </section>
      </div>
    </div>
    <div class="scrim" id="scrim" hidden></div>`;
    const rail = $('#rail');
    let rq = 0;
    const live = () => { CQ.page = 1; if (!rq) rq = requestAnimationFrame(() => { rq = 0; paintResults(); }); };
    rail.addEventListener('click', (e) => {
      const c = e.target.closest('.chip');
      const t = e.target.closest('[data-tp]');
      if (t) { CQ.tp = t.dataset.tp ? Number(t.dataset.tp) : null; live(); return; }
      if (e.target.closest('[data-drop="all"]')) { Object.assign(CQ, blankQ()); rail.innerHTML = railHtml(); enhanceSelects(rail); wireRail(); live(); say('Filters reset.'); return; }
      if (!c) return;
      const { g, v } = c.dataset;
      CQ[g] = CQ[g].includes(v) ? CQ[g].filter((x) => x !== v) : [...CQ[g], v];
      live();
    });
    rail.addEventListener('input', (e) => {
      const r = e.target.closest('[data-rng]');
      if (r) { const k = r.dataset.rng; CQ[k] = RANGES[k].steps[Number(r.value)]; syncRange(k); live(); return; }
      const f = e.target.closest('[data-find]');
      if (f) { const t = f.value.trim().toLowerCase(); $$(`#${f.dataset.find} .cl li`, rail).forEach((li) => { li.hidden = Boolean(t) && !li.dataset.name.includes(t); }); return; }
      if (e.target.id === 'fq') { CQ.q = e.target.value; clearTimeout(rail.qt); rail.qt = setTimeout(live, 180); }
    });
    rail.addEventListener('change', (e) => {
      const i = e.target;
      const g = i.dataset?.g;
      if (g === 'flags' || g === 'prov' || g === 'loc') { CQ[g] = i.checked ? [...new Set([...CQ[g], i.value])] : CQ[g].filter((x) => x !== i.value); live(); }
    });
    const wireRail = () => { $('#closeSheet').addEventListener('click', closeSheet); $('#applySheet').addEventListener('click', closeSheet); };
    $('#sort').addEventListener('change', (e) => { CQ.sort = e.target.value; CQ.dir = defDir(CQ.sort); CQ.page = 1; paintResults(); say(`Sorted by ${SORTS[CQ.sort]}, ${dirTxt(CQ.sort, CQ.dir).toLowerCase()}.`); });
    $('#dirBtn').addEventListener('click', () => { CQ.dir = CQ.dir === 'asc' ? 'desc' : 'asc'; CQ.page = 1; paintResults(); say(`${dirTxt(CQ.sort, CQ.dir)}.`); });
    $$('[data-view]').forEach((b) => b.addEventListener('click', () => { CQ.view = b.dataset.view; localStorage.setItem('shore-view', CQ.view); paintResults(); say(`${CQ.view === 'cards' ? 'Card' : 'List'} view.`); }));
    const openSheet = () => { rail.classList.add('open'); $('#scrim').hidden = false; $('#openSheet').setAttribute('aria-expanded', 'true'); $('input, button.chip, select', $('.rail__body', rail))?.focus(); };
    const closeSheet = () => { rail.classList.remove('open'); $('#scrim').hidden = true; $('#openSheet').setAttribute('aria-expanded', 'false'); $('#openSheet').focus(); };
    $('#openSheet').addEventListener('click', openSheet);
    wireRail();
    $('#scrim').addEventListener('click', closeSheet);
    rail.addEventListener('keydown', (e) => { if (e.key === 'Escape' && rail.classList.contains('open')) closeSheet(); });
    $('#patches').addEventListener('click', (e) => {
      const b = e.target.closest('[data-drop]');
      if (!b) return;
      const [g, v] = b.dataset.drop.split(':');
      if (g === 'all') Object.assign(CQ, blankQ());
      else if (['regions', 'flags', 'loc', 'prov'].includes(g)) CQ[g] = CQ[g].filter((x) => x !== v);
      else CQ[g] = g === 'q' ? '' : null;
      CQ.page = 1;
      rail.innerHTML = railHtml(); enhanceSelects(rail); wireRail();
      paintResults();
    });
    wirePicks($('#results'));
    $('#results').addEventListener('click', (e) => {
      const p = e.target.closest('[data-page]');
      const so = e.target.closest('[data-sort]');
      if (so) { const k = so.dataset.sort; CQ.dir = CQ.sort === k ? (CQ.dir === 'asc' ? 'desc' : 'asc') : defDir(k); CQ.sort = k; CQ.page = 1; paintResults(); $(`[data-sort="${k}"]`)?.focus(); say(`Sorted by ${SORTS[k]}, ${dirTxt(CQ.sort, CQ.dir).toLowerCase()}.`); return; }
      const pp = e.target.closest('[data-per]');
      if (pp) { CQ.per = Number(pp.dataset.per); localStorage.setItem('shore-per', CQ.per); CQ.page = 1; paintResults(); $(`[data-per="${CQ.per}"]`)?.focus(); say(`${CQ.per} plans per page.`); return; }
      if (p) { CQ.page = Number(p.dataset.page); paintResults(); $('.cat-head').scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' }); return; }
      const r = e.target.closest('[data-relax]');
      if (r) { Object.assign(CQ, JSON.parse(r.dataset.relax), { page: 1 }); const rl = $('#rail'); rl.innerHTML = railHtml(); enhanceSelects(rl); $('#closeSheet').addEventListener('click', () => $('#scrim').click()); $('#applySheet').addEventListener('click', () => $('#scrim').click()); paintResults(); return; }
      if (e.target.closest('[data-retry]')) { catState = 'ok'; paintResults(); }
    });
    paintResults(true);
    return 'VPS plans';
  }
  function syncRange(k) {
    const r = $(`#r-${k}`); if (!r) return;
    const i = stepIdx(k, CQ[k]); const t = rangeTxt(k, CQ[k]);
    r.value = i; r.style.setProperty('--p', `${((i / (RANGES[k].steps.length - 1)) * 100).toFixed(2)}%`);
    r.setAttribute('aria-valuetext', t); $(`#o-${k}`).textContent = t;
    r.closest('.fl').classList.toggle('on', CQ[k] != null);
  }
  function syncRail() {
    const rail = $('#rail'); if (!rail) return;
    Object.keys(RANGES).forEach(syncRange);
    $$('.chip[data-g]', rail).forEach((c) => c.setAttribute('aria-pressed', String(CQ[c.dataset.g].includes(c.dataset.v))));
    $$('[data-tp]', rail).forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.tp ? Number(b.dataset.tp) : null) === (CQ.tp ?? null))));
    $$('input[type="checkbox"][data-g]', rail).forEach((i) => { i.checked = CQ[i.dataset.g].includes(i.value); });
    const fq = $('#fq', rail); if (fq && document.activeElement !== fq) fq.value = CQ.q;
    $('[data-n="fl-prov"]', rail).textContent = CQ.prov.length || '';
    $('[data-n="fl-loc"]', rail).textContent = CQ.loc.length || '';
    $('#moreN', rail).textContent = activeMore() || '';
  }
  function patchesHtml() {
    const p = [];
    const patch = (label, drop) => `<span class="patch">${esc(label)}<button type="button" data-drop="${drop}" aria-label="Remove filter: ${esc(label)}">${ICON('close')}</button></span>`;
    if (CQ.q.trim()) p.push(patch(`“${CQ.q.trim()}”`, 'q'));
    if (CQ.ram) p.push(patch(`${gb(CQ.ram)}+ RAM`, 'ram'));
    if (CQ.price) p.push(patch(`Up to $${CQ.price}`, 'price'));
    if (CQ.cpu) p.push(patch(`${CQ.cpu}+ vCPU`, 'cpu'));
    if (CQ.disk) p.push(patch(`${diskTxt(CQ.disk)}+ storage`, 'disk'));
    CQ.regions.forEach((r) => p.push(patch(REGION_NAME[r], `regions:${r}`)));
    CQ.loc.forEach((c) => p.push(patch(cName(c), `loc:${c}`)));
    CQ.prov.forEach((v) => p.push(patch(D.find((o) => o.pid === v)?.p || v, `prov:${v}`)));
    CQ.flags.forEach((f) => p.push(patch(FLAG_NAME[f], `flags:${f}`)));
    if (CQ.tp) p.push(patch(`Trustpilot ${CQ.tp.toFixed(1)}+`, 'tp'));
    if (p.length > 1) p.push('<button type="button" class="linkish" data-drop="all">Clear all</button>');
    return p.join('');
  }
  const activeCount = () => (CQ.q.trim() ? 1 : 0) + (CQ.ram ? 1 : 0) + (CQ.price ? 1 : 0) + CQ.regions.length + activeMore();
  const stateArt = (pose, extra = '') => `<div class="state__art night">${pet('bvp', pose)}${extra}</div>`;
  const fishArt = (sign = 'No servers here') => `<div class="state__art fish night" aria-hidden="true"><svg class="fish__rod" viewBox="0 0 240 180" focusable="false"><path class="fish__pole" d="M96 128 L188 34"/><path class="fish__line" d="M188 34 Q206 78 204 118"/><g class="fish__bob"><path class="fish__ring" d="M190 124q14 -6 28 0"/><circle cx="204" cy="118" r="5.5"/><path d="M198.5 118h11"/></g></svg>${pet('twargaops', 'idle')}<span class="fish__sign">${esc(sign)}</span></div>`;
  const walkArt = () => `<div class="walk night" aria-hidden="true"><span class="walk__sea"></span><span class="walk__bear">${pet('twargaops', 'working')}</span></div>`;
  function paintResults(first) {
    const res = $('#results');
    saveNeeds(CQ);
    history.replaceState(null, '', `#catalog${qstr(CQ)}`);
    syncRail();
    syncTools();
    $('#patches').innerHTML = patchesHtml();
    const n = activeCount();
    $('#fCount').textContent = n ? `(${n})` : '';
    if (catState === 'loading') {
      res.innerHTML = `<div class="loading-row" role="status">${walkArt()}<div><h2 class="h3" style="margin:0">Walking the shoreline…</h2><p class="fine">The Keeper is loading plans for your filters.</p></div></div>
        <table class="rows skel" aria-hidden="true"><tbody>${Array.from({ length: 6 }, () => '<tr><td><span></span></td><td><span></span><span class="w2" style="margin-top:8px"></span></td><td><span class="w3"></span></td><td><span class="w3"></span></td><td><span class="w3"></span></td><td><span class="w3"></span></td><td><span class="w2"></span></td></tr>').join('')}</tbody></table>`;
      return;
    }
    if (catState === 'nodata') {
      roll($('#catCount'), 0);
      res.innerHTML = `<div class="state" role="status">${stateArt('sleep')}<div><h2>The tide is out.</h2><p>Plan data is unavailable right now. We don’t show old prices in its place.</p><div class="row"><button class="btn btn--primary" type="button" data-retry>Try again</button></div></div></div>`;
      return;
    }
    const list = sortList(D.filter((o) => matches(o, CQ)), CQ.sort, CQ.dir);
    roll($('#catCount'), list.length);
    $('#sheetCount').textContent = list.length;
    if (!first) say(`${list.length} plans.`);
    if (!list.length) {
      const relax = relaxOptions(CQ);
      res.innerHTML = `<div class="state">${fishArt('Nothing fits')}<div><h2>Nothing fits these needs.</h2><p>No plan in this snapshot matches every filter. Loosen one:</p>
        <div class="relax">${relax.map((r) => `<button type="button" class="chip" data-relax='${esc(JSON.stringify(r.next))}'>${esc(r.label)} → <b>${r.n} plans</b></button>`).join('') || `<button type="button" class="chip" data-relax='${esc(JSON.stringify(blankQ()))}'>Clear all filters</button>`}</div></div></div>`;
      return;
    }
    const per = CQ.per;
    const pages = Math.ceil(list.length / per);
    CQ.page = Math.min(Math.max(1, CQ.page), pages);
    const a = (CQ.page - 1) * per;
    const slice = list.slice(a, a + per);
    res.innerHTML = `${CQ.view === 'cards' ? `<ul class="cards">${slice.map((o) => cardHtml(o)).join('')}</ul>` : ledgerHtml(slice)}${pagerHtml(a, slice.length, list.length, CQ.page, pages, per)}`;
  }

  /* ── Offer ──────────────────────────────────────── */
  function receiptLines(o, plan) {
    let host = 'the provider site';
    try { host = new URL(o.url).host.replace(/^www\./, ''); } catch { /* keep default */ }
    const checked = fmtDate(o.checked);
    const L = [];
    const ev = (t, d, link) => ({ t, d, link });
    L.push({ label: 'Advertised', val: money(conv(o, o.adv ?? o.eff)), unit: '/mo', ev: ev('Advertised monthly price', `From the provider’s pricing page (${host}). Checked ${checked}.`, o.url) });
    if (o.tr && o.introM) L.push({ label: `First ${o.introM} months`, val: money(conv(o, o.intro ?? o.eff)), unit: '/mo', ev: ev('Intro period', `Intro price and length from the provider’s billing terms, reviewed by bestvpsforme. Snapshot ${checked}.`, o.url) });
    L.push({ label: 'Renews at', val: o.tr ? money(conv(o, o.ren)) : null, unit: '/mo', unk: o.tr ? 'Not published' : 'Not reviewed yet', ev: o.tr ? ev('Renewal price', o.ren != null ? `From the billing terms, reviewed by bestvpsforme. Snapshot ${checked}.` : 'The provider does not publish a renewal price. Confirm it at checkout.', o.url) : ev('Renewal price', 'We have not reviewed this plan’s billing terms yet, so we don’t show a renewal price.') });
    L.push({ label: 'Due today', val: money(conv(o, o.cash)), ev: ev('Due today', o.cash != null ? `The first charge at checkout. Checked ${checked}.` : 'Not published. Some plans bill several months up front; confirm at checkout.', o.cash != null ? o.url : null) });
    L.push({ label: 'Setup fee', val: money(conv(o, o.setup)), ev: ev('Setup fee', o.setup != null ? `From the provider’s pricing page. Checked ${checked}.` : 'Not published. Confirm at checkout.', o.setup != null ? o.url : null) });
    L.push({ label: 'Commitment', val: o.term == null ? null : o.term <= 1 ? 'Monthly' : `${o.term} months`, ev: ev('Commitment', o.term != null ? `Billing term from the provider. Checked ${checked}.` : 'Not published.', o.term != null ? o.url : null) });
    if (o.cur !== 'USD') L.push({ label: `Converted from ${o.cur}`, val: o.fx ? `× ${o.fx}` : null, ev: ev('Exchange rate', o.fx ? `Prices are shown in USD at a dated rate (${fmtDate(o.fxDate)}). The provider charges in ${o.cur}.` : 'No dated exchange rate, so we don’t convert this price.') });
    L.push({ label: '3-year total', strong: true, val: plan.ok && plan.total != null ? money(plan.total) : null, unk: 'Not computable', ev: ev('3-year total', plan.ok && plan.total != null ? 'Setup fee plus 36 months of reviewed prices. Same math as the cost shell below.' : `Not computable: ${plan.ok ? `the ${plan.missing.join(' and ')} ${plan.missing.length > 1 ? 'are' : 'is'} not published` : plan.reason.toLowerCase().replace(/\.$/, '')}.`) });
    return L;
  }
  function trueCost(o, plan) {
    if (o.usd == null) return '';
    const L = []; let sum = o.usd; let floor = false; let ok = true;
    const add = (l, v, unk) => L.push({ l, v, unk });
    add('Advertised price', `${money(o.usd)}/mo`);
    if (!plan.ok) { ok = false; add('Renewal and fees', null, 'Not reviewed yet'); }
    else {
      const known = plan.months.filter((m) => m.cost != null);
      const avg = known.reduce((s, m) => s + m.cost, 0) / Math.max(1, known.length);
      if (known.length < 36) { floor = true; add('Renewal price', null, 'Not published'); }
      const up = avg - o.usd;
      if (Math.abs(up) >= 0.005) { add(up > 0 ? 'Renewal, spread over 3 years' : 'Intro discount, over 3 years', `${up > 0 ? '+' : '−'}${money(Math.abs(up))}/mo`); sum += up; }
      else add('Renewal', 'Same price');
      if (plan.setup != null) { if (plan.setup > 0) { add('Setup fee, spread over 3 years', `+${money(plan.setup / 36)}/mo`); sum += plan.setup / 36; } else add('Setup fee', 'None'); }
      else { floor = true; add('Setup fee', null, 'Not published'); }
    }
    if (o.ipv4 === 'extra') { floor = true; add('IPv4 address', null, 'Extra, price not published'); }
    else if (o.ipv4 === 'included') add('IPv4 address', 'Included');
    else { floor = true; add('IPv4 address', null, 'Confirm at checkout'); }
    if (o.vat === 'unknown') { floor = true; add('Tax (VAT)', null, 'Not published'); }
    const head = ok ? `<b class="num">${floor ? 'At least ' : ''}${money(sum)}</b><small>/mo</small>` : '<b>Can’t add up yet</b>';
    return `<div class="tc" id="tc"><button class="tc__tag" type="button" id="tcBtn" aria-expanded="false" aria-controls="tcBody"><span class="tc__stitch" aria-hidden="true"></span>${ICON('tag')}<span class="tc__label">See the true monthly cost</span><span class="tc__chev" aria-hidden="true"></span></button>
      <div class="tc__body" id="tcBody" role="region" aria-label="True monthly cost"><div class="tc__in"><ul class="tc__lines">${L.map((x) => `<li><span>${esc(x.l)}</span>${x.v ? `<b class="num">${esc(x.v)}</b>` : `<span class="unk">${esc(x.unk)}</span>`}</li>`).join('')}</ul><p class="tc__sum"><span>True monthly cost</span><span>${head}</span></p><p class="fine">${floor ? 'Some costs are not published, so this is the lowest it can be.' : 'Every cost is published and included.'}</p></div></div></div>`;
  }
  function hwCells(o) {
    const cell = (icon, l, v, s) => `<div><p class="hw__l">${ICON(icon)}${l}</p><p class="hw__v">${v ?? '—'}</p><p class="hw__s">${s ?? ''}</p></div>`;
    const yn = (v) => (v == null ? null : v ? 'Included' : 'Not included');
    const ipv4 = { included: 'Included', extra: 'Extra cost', 'location-dependent': 'Depends on location', unknown: null }[o.ipv4] ?? null;
    return [
      cell('cpu', 'CPU', o.vcpu != null ? `${o.vcpu} vCPU` : null, o.cpu || (o.vcpu == null ? 'Not published' : '')),
      cell('ram', 'Memory', gb(o.ram), o.ram == null ? 'Not published' : ''),
      cell('disk', 'Storage', diskTxt(o.disk), o.dk || (o.disk == null ? 'Not published' : '')),
      cell('transfer', 'Transfer', bwTxt(o), bwTxt(o) ? 'per month' : 'Not published'),
      cell('pin', 'IPv4', ipv4, ipv4 ? '' : 'Confirm at checkout'),
      cell('shell', 'Backups', yn(o.backups), o.backups == null ? 'Confirm at checkout' : ''),
      cell('lantern', 'Management', o.managed == null ? null : o.managed ? 'Managed' : 'Self-managed', o.managed == null ? 'Confirm at checkout' : ''),
      cell('pin', 'Locations', o.loc?.length ? String(new Set(o.loc.map(code).filter(Boolean)).size || o.loc.length) : null, locTxt(o)),
    ].join('');
  }
  function renderOffer(id, qs) {
    const o = byId.get(id);
    const qn = parseQ(qs);
    const n = hasNeeds(qn) ? qn : loadNeeds();
    const v = verdict(o, n);
    const plan = costPlan(o);
    const lines = receiptLines(o, plan);
    const sibs = D.filter((x) => x.pid === o.pid && x.id !== o.id).slice(0, 4);
    const inPail = pail.includes(o.id);
    const big = o.real != null
      ? `<p class="bp__label"><span>3-year real price</span><span class="rvchip">${ICON('check')}Reviewed</span></p><p class="bp"><b class="num">${money(o.real)}</b><small>/mo</small></p><p class="bp__sub">Average over 36 months, setup and renewals included.</p>`
      : `<p class="bp__label"><span>Price per month</span><span>${esc(o.cur)}</span></p><p class="bp"><b class="num">${money(o.usd) ?? '—'}</b><small>/mo</small></p><p class="bp__sub">${o.tr ? 'Advertised price. A 3-year average needs every fee reviewed.' : 'Advertised price. Billing terms are not reviewed yet.'}</p>`;
    app.innerHTML = `<div class="page wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#catalog">Plans</a><span aria-hidden="true">/</span><a href="#provider/${o.pid}">${esc(o.p)}</a><span aria-hidden="true">/</span><span aria-current="page">${esc(o.name)}</span></nav>
      <div class="offer">
        <div>
          <div class="idline">${pmark(o, 'pm--lg')}<div><p class="idline__name"><a href="#provider/${o.pid}">${esc(o.p)}</a><span> · HQ ${esc(o.hq || 'not published')}</span></p><p class="idline__meta">${rating(o)}${o.tp != null ? `<span class="idline__date">· checked ${fmtDate(o.tpDate)}</span>` : ''}</p></div></div>
          <h1>${esc(o.name)}</h1>
          <div class="tags"><span class="tagchip">${ICON('lantern')}Price checked ${fmtDate(o.checked)}</span>${o.tr ? `<span class="tagchip tagchip--fit">${ICON('check')}Billing terms reviewed</span>` : '<span class="tagchip tagchip--warn">Billing terms not reviewed yet</span>'}</div>
          ${v ? `<div class="verdict verdict--${v.k}"><div class="verdict__art night">${pet('bvp', v.pose)}</div><div><p class="verdict__t">${esc(v.title)}</p>${v.lines.map((l) => `<p>${esc(l)}</p>`).join('')}<p class="verdict__needs">Your needs: ${esc(needsTxt(n))} · <a href="#catalog${qstr(n)}">change</a></p></div></div>` : '<p class="needs-hint">Set your needs in the <a href="#home">finder</a> or the <a href="#catalog">catalog filters</a>, and the crab tells you if this plan fits.</p>'}
          <h2 class="h3">Hardware and extras</h2>
          <div class="hw">${hwCells(o)}</div>
          ${o.fit || o.catch ? `<div class="notes">${o.fit ? `<div class="note note--fit"><h3>${ICON('check')}Good for</h3><p>${esc(o.fit)}</p></div>` : ''}${o.catch ? `<div class="note note--catch"><h3>${ICON('hook')}The catch</h3><p>${esc(o.catch)}</p></div>` : ''}</div>` : ''}
        </div>
        <aside class="receipt" aria-label="Price receipt">
          <div class="receipt__crab">${pet('bvp', o.real != null ? 'success' : 'idle')}</div>
          <div class="receipt__card" id="rcard">
            <svg class="threads" id="threads" aria-hidden="true" focusable="false"></svg>
            ${big}
            ${trueCost(o, plan)}
            <ul class="rlines">${lines.map((l, i) => `<li><button type="button" class="rline${l.strong ? ' rline--total' : ''}" data-i="${i}" aria-describedby="evid"><span>${esc(l.label)}</span>${l.val ? `<span class="num">${esc(l.val)}${l.unit ? `<small>${l.unit}</small>` : ''}</span>` : `<span class="unk">${esc(l.unk || 'Not published')}</span>`}<span class="knot" aria-hidden="true"></span></button></li>`).join('')}</ul>
            <div class="evidence" id="evid"><h3>${ICON('lantern')}<span id="evT">Where these numbers come from</span></h3><p id="evD">Point at a line, or tab to it, to see its source and date.</p><p id="evL"></p></div>
            <a class="btn btn--primary btn--block" href="${esc(o.url)}" target="_blank" rel="noopener">Visit ${esc(o.p)}${ICON('out')}</a>
            <button class="btn btn--block" type="button" id="pickOffer" aria-pressed="${inPail}">${ICON('pail')}<span>${inPail ? 'In your compare pail' : 'Pick for compare'}</span></button>
            <p class="linkline">${ICON('tag')}<span>${o.aff ? '<b>Ad.</b> We may earn a commission. It never changes the order.' : '<b>Direct link.</b> No commission on this plan. The button goes straight to the provider.'}</span></p>
            ${o.vat === 'unknown' ? '<p class="fine">VAT basis unknown.</p>' : ''}
            <p class="fine"><a href="#corrections?plan=${o.id}">Report a wrong price</a></p>
          </div>
        </aside>
      </div>
      <section class="cshell-sec" aria-labelledby="csh">
        <div class="sec__head"><h2 id="csh">Your first 36 months</h2><p>What you pay each month, and when the price jumps.</p></div>
        ${costShellHtml(o, plan)}
      </section>
      ${sibs.length ? `<section class="sibs" aria-labelledby="sib-h"><div class="sec__head"><h2 id="sib-h">More from ${esc(o.p)}</h2></div><ol class="board">${sibs.map((x) => `<li><span class="board__rank num">#${x.rank}</span>${pmark(x)}<a class="board__name" href="#offer/${x.id}">${esc(x.name)}<span>${esc(locTxt(x))}</span></a><span class="board__spec num">${[x.vcpu != null ? `${x.vcpu} vCPU` : null, gb(x.ram), diskTxt(x.disk)].filter(Boolean).join(' · ')}</span><span class="board__price"><b class="num">${money(x.usd) ?? '—'}</b><small>/mo</small>${x.real != null ? RV : ''}</span></li>`).join('')}</ol></section>` : ''}
    </div>`;
    const crab = $('.receipt__crab .pet');
    if (o.real != null) later(() => setPose(crab, 'idle'), 2600);
    const show = (btn) => {
      const l = lines[Number(btn.dataset.i)];
      $$('.rline.on').forEach((b) => b.classList.remove('on'));
      btn.classList.add('on');
      $('#evT').textContent = l.ev.t;
      $('#evD').textContent = l.ev.d;
      $('#evL').innerHTML = l.ev.link ? `<a href="${esc(l.ev.link)}" target="_blank" rel="noopener">Open the source${ICON('out')}</a>` : '';
      drawThread(btn);
    };
    $('#tcBtn')?.addEventListener('click', (e) => { const b = e.currentTarget; const on = b.getAttribute('aria-expanded') !== 'true'; b.setAttribute('aria-expanded', String(on)); $('#tc').classList.toggle('open', on); if (on && !reduced()) { $('#tc').classList.remove('unpick'); void b.offsetWidth; $('#tc').classList.add('unpick'); } });
    $$('.rline').forEach((b) => { b.addEventListener('pointerenter', () => show(b)); b.addEventListener('focus', () => show(b)); b.addEventListener('click', () => show(b)); });
    $('#pickOffer').addEventListener('click', (e) => {
      const btn = e.currentTarget;
      togglePail(o.id, btn);
      const on = pail.includes(o.id);
      btn.setAttribute('aria-pressed', String(on));
      $('span', btn).textContent = on ? 'In your compare pail' : 'Pick for compare';
    });
    return o.name;
  }
  function drawThread(btn) {
    const card = $('#rcard');
    const svg = $('#threads');
    const c = card.getBoundingClientRect();
    const k = $('.knot', btn).getBoundingClientRect();
    const e = $('#evid').getBoundingClientRect();
    const x1 = k.left + k.width / 2 - c.left; const y1 = k.top + k.height / 2 - c.top;
    const x2 = e.right - c.left - 22; const y2 = e.top - c.top;
    const mx = Math.max(x1, x2) + 16;
    svg.setAttribute('viewBox', `0 0 ${c.width.toFixed(0)} ${c.height.toFixed(0)}`);
    svg.innerHTML = `<path class="${reduced() ? '' : 'draw'}" d="M${x1.toFixed(1)} ${y1.toFixed(1)}C${mx.toFixed(1)} ${(y1 + 14).toFixed(1)} ${mx.toFixed(1)} ${(y2 - 34).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}"/><circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="3.2"/>`;
  }

  /* ── Compare ─────────────────────────────────────── */
  function renderCompare() {
    const list = pail.map((id) => byId.get(id)).filter(Boolean);
    if (!list.length) {
      app.innerHTML = `<div class="page wrap"><div class="cmp-head"><h1 class="ptitle">Compare plans</h1><p class="lead">Pick up to 4 plans. We line up prices, renewals and hardware side by side.</p></div>
        <div class="state state--pail">${stateArt('idle', bigPail(0))}<div><h2>Your pail is empty.</h2><p>Tick <b>Compare</b> on any plan in the catalog. The crab carries it here.</p><div class="row"><a class="btn btn--primary" href="#catalog">Open the catalog${ICON('arrow', 'ico--arrow')}</a></div></div></div></div>`;
      return 'Compare plans';
    }
    const n = loadNeeds();
    const plans = list.map(costPlan);
    const m = (v) => (v == null ? null : money(v));
    const R = (label, get, fmt, best, html) => ({ label, get, fmt, best, html });
    const ipv4 = { included: 'Included', extra: 'Extra cost', 'location-dependent': 'Depends on location' };
    const sections = [
      ['Price', 'tag', [
        R('First 36 months', (o, i) => plans[i], null, null, (p) => costStrip(p)),
        R('Price per month', (o) => o.usd, (v) => `${m(v)}/mo`, 'min'),
        R('3-year average', (o) => o.real, (v) => `${m(v)}/mo`, 'min'),
        R('Due today', (o) => conv(o, o.cash), m, 'min'),
        R('Renews at', (o) => (o.tr ? conv(o, o.ren) : null), (v) => `${m(v)}/mo`, 'min'),
        R('Setup fee', (o) => conv(o, o.setup), m, 'min'),
        R('Contract', (o) => o.term, (v) => (v <= 1 ? 'Monthly' : `${v} months`), null),
      ]],
      ['Hardware', 'cpu', [
        R('CPU', (o) => o.vcpu, (v) => `${v} vCPU`, 'max'),
        R('Memory', (o) => o.ram, gb, 'max'),
        R('Storage', (o) => o.disk, diskTxt, 'max'),
        R('Transfer', (o) => o.bw, (v) => bwTxt({ bw: v }), 'max'),
      ]],
      ['Trust', 'lantern', [
        R('Trustpilot', (o) => o.tp, null, 'max', (v, o) => rating(o)),
        R('IPv4 address', (o) => (o.ipv4 && o.ipv4 !== 'unknown' ? o.ipv4 : null), (v) => ipv4[v] || v, null),
        R('Price checked', (o) => o.checked, fmtDate, null),
      ]],
    ];
    let body = '';
    let nDiff = 0;
    sections.forEach(([name, icon, rows]) => {
      body += `<tr class="cmp-sec"><th scope="rowgroup" colspan="${list.length + 1}"><span>${ICON(icon)}${name}</span></th></tr>`;
      const none = [];
      rows.forEach((r) => {
        const vals = list.map((o, i) => r.get(o, i));
        if (vals.every((v) => v == null)) { none.push(r.label); return; }
        const differ = list.length > 1 && new Set(vals.map((v) => JSON.stringify(v ?? null))).size > 1;
        if (differ) nDiff += 1;
        let lead = -1;
        const known = vals.map((v, i) => [v, i]).filter(([v]) => v != null);
        if (r.best && known.length > 1) {
          const best = r.best === 'min' ? Math.min(...known.map(([v]) => v)) : Math.max(...known.map(([v]) => v));
          const winners = known.filter(([v]) => v === best);
          if (winners.length === 1) lead = winners[0][1];
        }
        body += `<tr class="${differ ? 'diff' : 'same'}" style="--r:${nDiff}"><th scope="row">${r.label}</th>${vals.map((v, i) => `<td>${v == null ? UNK : r.html ? r.html(v, list[i]) : `<span class="v num">${esc(r.fmt(v))}</span>`}${i === lead ? `<span class="best">${r.best === 'min' ? 'Lowest' : 'Highest'}</span>` : ''}</td>`).join('')}</tr>`;
      });
      if (none.length) body += `<tr class="cmp-none"><th scope="row">Not published</th><td colspan="${list.length}">No selected plan publishes: ${esc(none.join(', '))}.</td></tr>`;
    });
    app.innerHTML = `<div class="page wrap">
      <div class="cmp-head"><h1 class="ptitle">Compare plans</h1><p class="lead">${list.length} of 4 plans in your pail.${hasNeeds(n) ? ` Fit checks use your needs: ${esc(needsTxt(n))}.` : ''}</p></div>
      ${list.length > 1 ? `<div class="cmp-tools"><span class="cmp-tools__n"><i class="cmp-tools__sw" aria-hidden="true"></i><b class="num">${nDiff}</b> rows differ</span><label class="cmp-tools__t"><input type="checkbox" id="onlyDiff"> Only show what differs</label></div>` : ''}
      <div class="cmp-wrap" id="cmpWrap"><svg class="sew" id="sew" aria-hidden="true" focusable="false"></svg><table class="cmp"><thead><tr><th scope="col" class="cmp-corner"><span class="cmp-corner__crab" aria-hidden="true">${pet('bvp', 'idle')}</span><span class="sr-only">Plan</span></th>${list.map((o) => {
        const v = verdict(o, n);
        return `<th scope="col"><div class="colhead"><a class="colhead__shell" href="#offer/${o.id}" tabindex="-1" aria-hidden="true">${shellSvg(o)}</a><a class="colhead__name" href="#offer/${o.id}">${esc(o.name)}</a><span class="colhead__sub">${esc(o.p)}</span><span class="colhead__price"><b class="num">${money(o.usd) ?? '—'}</b><small>/mo</small>${o.real != null ? RV : ''}</span>${v ? `<span class="vchip vchip--${v.k}">${esc(v.title)}</span>` : ''}<button class="linkish" type="button" data-unpick="${o.id}">Remove<span class="sr-only"> ${esc(o.name)}</span></button></div></th>`;
      }).join('')}</tr></thead><tbody>${body}</tbody></table></div>
      <p class="fine cmp-note">Bars show what you pay each month for 36 months: amber is the intro price, violet the regular price. “Lowest” and “Highest” mark one clear best value; ties get no label.</p>
    </div>`;
    $$('[data-unpick]').forEach((b) => b.addEventListener('click', () => { togglePail(b.dataset.unpick); renderCompare(); }));
    $('#onlyDiff')?.addEventListener('change', (e) => $('#cmpWrap').classList.toggle('only-diff', e.target.checked));
    sew(true);
    homeResize = () => sew(false);
    return 'Compare plans';
  }
  function sew(anim) {
    const wrap = $('#cmpWrap'); const svg = $('#sew');
    if (!wrap || !svg) return;
    const sh = $$('.colhead__shell', wrap);
    const tbl = $('.cmp', wrap);
    if (sh.length < 2) { tbl.classList.add('lit'); return; }
    const w = wrap.getBoundingClientRect();
    const pts = sh.map((s) => { const r = s.getBoundingClientRect(); return [r.left + r.width * 0.55 - w.left + wrap.scrollLeft, r.bottom - 6 - w.top]; });
    let d = `M${(pts[0][0] - 30).toFixed(1)} ${pts[0][1].toFixed(1)}L${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length; i += 1) { const a = pts[i - 1]; const b = pts[i]; d += `Q${((a[0] + b[0]) / 2).toFixed(1)} ${(Math.max(a[1], b[1]) + 30).toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`; }
    const last = pts[pts.length - 1];
    d += 'l26 -4';
    svg.setAttribute('width', tbl.offsetWidth); svg.setAttribute('height', tbl.offsetHeight);
    svg.innerHTML = `<path class="sew__shadow" d="${d}"/><path class="sew__thread" d="${d}"/>${pts.map(([x, y], i) => `<circle class="sew__knot" style="--i:${i}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4"/>`).join('')}<g class="sew__needle" transform="translate(${(last[0] + 26).toFixed(1)} ${(last[1] - 4).toFixed(1)}) rotate(-12)"><path d="M0 0h18"/><ellipse cx="15" cy="0" rx="2.2" ry="1"/></g>`;
    if (!anim || reduced()) { svg.classList.remove('sewing'); tbl.classList.add('lit'); return; }
    svg.classList.remove('sewing'); void svg.offsetWidth; svg.classList.add('sewing');
    tbl.classList.remove('lit');
    later(() => tbl.classList.add('lit'), 750);
  }

  function render404() {
    app.innerHTML = `<div class="page wrap"><div class="state state--404">${fishArt()}<div><h1 class="ptitle">Nothing biting here.</h1><p>Error 404. The Keeper cast a line, but this page doesn’t exist, or the plan left the catalog.</p><div class="row"><a class="btn btn--primary" href="#catalog">Browse VPS plans</a><a class="btn" href="#home">Home</a></div></div></div></div>`;
    return 'Page not found';
  }

  /* ── Catalog parts: ledger table, plan cards, pager ─────── */
  const METER = { vcpu: [1, 2, 4, 8, 16], ram: [1, 2, 4, 8, 16], disk: [25, 50, 100, 200, 400], bw: [1, 2, 4, 8, 16] };
  const lvl = (k, v) => (v == null ? 0 : Math.max(1, METER[k].filter((t) => v >= t).length));
  const meter = (k, v) => `<span class="mtr" aria-hidden="true">${[1, 2, 3, 4, 5].map((i) => `<i${i <= lvl(k, v) ? ' class="on"' : ''}></i>`).join('')}</span>`;
  const unitSplit = (t) => { const m = /^([\d.,]+)\s*(.*)$/.exec(t || ''); return m ? [m[1], m[2]] : [t, '']; };
  const ramPair = (v) => (v == null ? null : v < 1 ? [String(Math.round(v * 1024)), 'MB'] : [String(+v.toFixed(1)), 'GB']);
  const diskPair = (v) => (v == null ? null : v >= 1000 ? [String(+(v / 1000).toFixed(1)), 'TB'] : [String(v), 'GB']);
  const cpuPair = (o) => (o.vcpu != null ? [String(o.vcpu), 'vCPU'] : null);
  const bwPair = (o) => (bwTxt(o) ? unitSplit(bwTxt(o)) : null);
  const specVal = (k, pair, raw) => (pair ? `<span class="spec__v"><b>${esc(pair[0])}</b><small>${esc(pair[1])}</small></span>${meter(k, raw)}` : UNK);
  const TP_STAR = '<svg viewBox="0 0 20 20" focusable="false"><path d="M10 2.2l2.3 5 5.4.6-4 3.7 1.1 5.4L10 14.2l-4.8 2.7 1.1-5.4-4-3.7 5.4-.6z"/></svg>';
  const kfmt = (n) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n));
  function tpBadge(o, full = false) {
    if (o.tp == null) return `<span class="tp tp--none">${full ? 'No Trustpilot rating yet' : 'No rating'}</span>`;
    const tone = o.tp >= 4 ? 'g' : o.tp >= 3 ? 'y' : o.tp >= 2 ? 'o' : 'r';
    const n = o.tpc ?? 0;
    return `<span class="tp tp--${tone}" data-tip="Trustpilot ${o.tp.toFixed(1)} of 5 · ${n.toLocaleString('en-US')} reviews · checked ${fmtDate(o.tpDate)}"><span class="tp__sq" aria-hidden="true">${TP_STAR}</span><b class="num" aria-hidden="true">${o.tp.toFixed(1)}</b><small aria-hidden="true">${full ? `Trustpilot · ${n.toLocaleString('en-US')} reviews` : `(${kfmt(n)})`}</small><span class="sr-only">Trustpilot ${o.tp.toFixed(1)} out of 5, ${n} reviews</span></span>`;
  }
  function renewLine(o) {
    if (o.usd == null) return '';
    if (!o.tr) return '<span class="rn rn--unk">Terms not reviewed</span>';
    const r = conv(o, o.ren);
    if (r == null) return '<span class="rn rn--unk">Renewal not published</span>';
    if (r > o.usd * 1.02) return `<span class="rn rn--up">${ICON('arrow', 'ico--up')}Renews ${money(r)}</span>`;
    if (r < o.usd * 0.98) return `<span class="rn rn--flat">Renews lower, ${money(r)}</span>`;
    return `<span class="rn rn--flat">${ICON('check')}Flat price</span>`;
  }
  const pickBox = (o, on) => `<label class="pick"><input type="checkbox" data-pick="${o.id}"${on ? ' checked' : ''}><span class="pick__box" aria-hidden="true">${ICON('check')}</span><span class="pick__txt" aria-hidden="true">Compare</span><span class="sr-only">Compare ${esc(o.name)} by ${esc(o.p)}</span></label>`;
  function ledgerRow(o) {
    const on = pail.includes(o.id);
    return `<tr data-row="${o.id}" class="${on ? 'picked' : ''}">
      <td class="c-pick">${pickBox(o, on)}</td>
      <td class="c-plan"><div class="plan">${pmark(o)}<div><a class="plan__name" href="#offer/${o.id}">${esc(o.name)}</a><span class="plan__sub"><span class="plan__rank num">#${o.rank}</span>${esc(o.p)} · ${esc(locTxt(o))}</span></div></div></td>
      <td class="spec c-cpu" data-l="CPU">${specVal('vcpu', cpuPair(o), o.vcpu)}${o.cpu ? `<span class="sub">${esc(o.cpu)}</span>` : ''}</td>
      <td class="spec c-ram" data-l="Memory">${specVal('ram', ramPair(o.ram), o.ram)}</td>
      <td class="spec c-disk" data-l="Storage">${specVal('disk', diskPair(o.disk), o.disk)}${o.dk ? `<span class="sub">${esc(o.dk)}</span>` : ''}</td>
      <td class="spec c-bw" data-l="Transfer">${specVal('bw', bwPair(o), o.bw)}</td>
      <td class="c-tp">${tpBadge(o)}</td>
      <td class="c-price"><span class="price"><b class="num">${money(o.usd) ?? '—'}</b><small>/mo</small>${o.real != null ? RV : ''}</span>${renewLine(o)}</td>
      <td class="c-act"><a class="go" href="${esc(o.url)}" target="_blank" rel="noopener" data-tip="Visit ${esc(o.p)}"><span class="sr-only">Visit ${esc(o.p)} (opens provider site)</span>${ICON('out')}</a>${o.aff ? '<span class="ad">Ad</span>' : ''}</td>
    </tr>`;
  }
  const COLS = [['cpu', 'c-cpu', 'CPU', 'cpu'], ['ram', 'c-ram', 'Memory', 'ram'], ['disk', 'c-disk', 'Storage', 'disk'], ['bw', 'c-bw', 'Transfer', 'transfer'], ['tp', 'c-tp', 'Trustpilot', 'star'], ['price', 'c-price', 'Price', 'tag']];
  function ledgerHtml(slice) {
    const th = ([k, cls, label, icon]) => {
      const on = CQ.sort === k;
      return `<th scope="col" class="${cls}${on ? ' on' : ''}"${on ? ` aria-sort="${CQ.dir === 'asc' ? 'ascending' : 'descending'}"` : ''}><button type="button" class="sorth" data-sort="${k}">${icon ? ICON(icon) : ''}<span>${label}</span><span class="sorth__ar" aria-hidden="true"></span></button></th>`;
    };
    return `<table class="ledger sorted-${CQ.sort} dir-${CQ.dir}"><caption class="sr-only">VPS plans. Column headers sort the list.</caption><thead><tr><th scope="col" class="c-pick"><span class="sr-only">Compare</span>${ICON('pail')}</th>${th(['value', 'c-plan', 'Plan', ''])}${COLS.map(th).join('')}<th scope="col" class="c-act"><span class="sr-only">Provider link</span></th></tr></thead><tbody>${slice.map(ledgerRow).join('')}</tbody></table>`;
  }
  function cardHtml(o, deal = false) {
    const on = pail.includes(o.id);
    const sp = (k, icon, label, pair, raw) => `<div class="pc__s pc__s--${k}"><span class="pc__l">${ICON(icon)}${label}</span>${specVal(k, pair, raw)}</div>`;
    const dealHtml = deal ? `<div class="pc__deal"><p><span>First ${o.introM} months</span><b class="num">${money(conv(o, o.intro ?? o.eff))}/mo</b></p><p><span>Then</span><b class="num">${money(conv(o, o.ren))}/mo</b></p>${costStrip(costPlan(o))}</div>` : '';
    return `<li class="pc${on ? ' picked' : ''}" data-row="${o.id}">
      <div class="pc__top">${pmark(o)}<div class="pc__who"><a class="pc__p" href="#provider/${o.pid}">${esc(o.p)}</a><span class="pc__loc">${esc(locTxt(o))}</span></div><span class="pc__rank num" data-tip="Value rank">#${o.rank}</span></div>
      <a class="pc__name" href="#offer/${o.id}">${esc(o.name)}</a>
      <div class="pc__price"><p class="price price--lg"><b class="num">${money(o.usd) ?? '—'}</b><small>/mo</small>${o.real != null ? RV : ''}</p>${renewLine(o)}</div>
      ${dealHtml}
      <div class="pc__specs">${sp('vcpu', 'cpu', 'CPU', cpuPair(o), o.vcpu)}${sp('ram', 'ram', 'Memory', ramPair(o.ram), o.ram)}${sp('disk', 'disk', 'Storage', diskPair(o.disk), o.disk)}${sp('bw', 'transfer', 'Transfer', bwPair(o), o.bw)}</div>
      <div class="pc__tp">${tpBadge(o)}</div>
      <div class="pc__foot">${pickBox(o, on)}${o.aff ? '<span class="ad">Ad</span>' : ''}<a class="btn btn--sm" href="${esc(o.url)}" target="_blank" rel="noopener">Visit${ICON('out')}<span class="sr-only"> ${esc(o.p)} (opens provider site)</span></a></div>
    </li>`;
  }
  function pageNums(cur, n) {
    const a = [...new Set([1, n, cur - 1, cur, cur + 1].filter((x) => x >= 1 && x <= n))].sort((x, y) => x - y);
    const out = [];
    a.forEach((x, i) => { if (i && x - a[i - 1] > 1) out.push('…'); out.push(x); });
    return out;
  }
  function pagerHtml(a, shown, total, page, pages, per) {
    return `<nav class="pager" aria-label="Pages">
      <div class="pager__per"><span id="perL">Per page</span><div class="seg seg--sm" role="group" aria-labelledby="perL">${PER.map((n) => `<button type="button" data-per="${n}" aria-pressed="${per === n}">${n}</button>`).join('')}</div></div>
      <span class="pager__range num">${a + 1}–${a + shown} of ${total}</span>
      ${pages > 1 ? `<div class="pager__btns"><button class="pgb" type="button" data-page="${page - 1}"${page === 1 ? ' disabled' : ''}><span class="sr-only">Previous page</span>${ICON('arrow', 'ico--back')}</button>${pageNums(page, pages).map((x) => (x === '…' ? '<span class="pg-gap" aria-hidden="true">…</span>' : `<button class="pgb num" type="button" data-page="${x}"${x === page ? ' aria-current="page"' : ''}><span class="sr-only">Page </span>${x}</button>`)).join('')}<button class="pgb" type="button" data-page="${page + 1}"${page === pages ? ' disabled' : ''}><span class="sr-only">Next page</span>${ICON('arrow')}</button></div>` : ''}
    </nav>`;
  }
  const dirTxt = (s, d) => ({ value: d === 'asc' ? 'Best first' : 'Best last', price: d === 'asc' ? 'Lowest first' : 'Highest first', tp: d === 'desc' ? 'Best rated first' : 'Lowest rated first' }[s] || (d === 'desc' ? 'Most first' : 'Least first'));
  function syncTools() {
    const s = $('#sort'); if (s) { s.value = CQ.sort; s._ddSync?.(); }
    const t = $('#dirTxt'); if (t) t.textContent = dirTxt(CQ.sort, CQ.dir);
    $('#dirBtn')?.classList.toggle('asc', CQ.dir === 'asc');
    $$('[data-view]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === CQ.view)));
  }
  function wirePicks(root) {
    root.addEventListener('change', (e) => {
      const inp = e.target.closest('[data-pick]');
      if (!inp) return;
      const ok = togglePail(inp.dataset.pick, inp.closest('.pick'));
      if (!ok) inp.checked = false;
      inp.closest('[data-row]')?.classList.toggle('picked', pail.includes(inp.dataset.pick));
    });
  }

  /* ── Providers ───────────────────────────────────── */
  const PROV = (() => {
    const m = new Map();
    D.forEach((o) => {
      let p = m.get(o.pid);
      if (!p) {
        let site = null;
        try { site = new URL(o.url).origin; } catch { /* no site */ }
        p = { pid: o.pid, p: o.p, hq: o.hq, tp: o.tp, tpc: o.tpc, tpDate: o.tpDate, site, plans: [], locs: new Set() };
        m.set(o.pid, p);
      }
      p.plans.push(o);
      (o.loc || []).forEach((l) => { const c = code(l); if (c) p.locs.add(c); });
    });
    m.forEach((p) => {
      p.plans.sort((a, b) => a.rank - b.rank);
      const pr = p.plans.map((o) => o.usd).filter((v) => v != null);
      p.from = pr.length ? Math.min(...pr) : null;
      p.reviewed = p.plans.filter((o) => o.tr).length;
      p.best = p.plans[0].rank;
    });
    return m;
  })();
  const provCard = (p) => `<li class="pv"><a class="pv__a" href="#provider/${p.pid}"><span class="pv__shell">${shellSvg(p)}</span><span class="pv__name">${esc(p.p)}</span><span class="pv__hq">HQ ${esc(p.hq || 'not published')} · ${p.locs.size ? `${p.locs.size} ${p.locs.size === 1 ? 'country' : 'countries'}` : 'locations not published'}</span></a>${tpBadge(p)}<dl class="pv__facts"><div><dt>Plans</dt><dd class="num">${p.plans.length}</dd></div><div><dt>From</dt><dd class="num">${p.from != null ? money(p.from) : '—'}</dd></div><div><dt>Reviewed</dt><dd class="num">${p.reviewed}/${p.plans.length}</dd></div></dl></li>`;
  function renderProviders(qs) {
    const q = new URLSearchParams(qs || '');
    const SO = [['value', 'Best plan'], ['price', 'Lowest price'], ['tp', 'Trustpilot'], ['plans', 'Most plans'], ['name', 'Name']];
    let sort = SO.some(([k]) => k === q.get('sort')) ? q.get('sort') : 'value';
    let term = q.get('q') || '';
    app.innerHTML = `<div class="page wrap">
      <div class="cat-head"><div><h1 class="ptitle">Providers</h1><p class="cat-meta"><span class="num" id="pvCount">${PROV.size}</span> hosting providers · ${META.count} plans · Snapshot ${fmtDate(META.snapshot)}</p></div>
        <div class="cat-tools"><label class="search">${ICON('search')}<span class="sr-only">Search providers</span><input type="search" id="pvq" placeholder="Search providers" value="${esc(term)}" autocomplete="off"></label><label class="sortl" for="pvs"><span>Sort by</span><select class="select select--sm" id="pvs">${SO.map(([k, l]) => `<option value="${k}"${k === sort ? ' selected' : ''}>${l}</option>`).join('')}</select></label></div></div>
      <ul class="pgrid" id="pgrid"></ul></div>`;
    const F = { value: (a, b) => a.best - b.best, price: (a, b) => (a.from ?? 1e9) - (b.from ?? 1e9), tp: (a, b) => (b.tp ?? -1) - (a.tp ?? -1) || a.best - b.best, plans: (a, b) => b.plans.length - a.plans.length || a.best - b.best, name: (a, b) => a.p.localeCompare(b.p) };
    const paint = () => {
      const t = term.trim().toLowerCase();
      const list = [...PROV.values()].filter((p) => !t || p.p.toLowerCase().includes(t)).sort(F[sort]);
      $('#pvCount').textContent = list.length;
      $('#pgrid').innerHTML = list.length ? list.map(provCard).join('') : `<li class="none">${fishArt('Nobody by that name')}<div><h2>No provider matches “${esc(term)}”.</h2><p>Try a shorter name, or browse every plan.</p><div class="row"><a class="btn btn--primary" href="#catalog">Browse VPS plans</a></div></div></li>`;
      const p = new URLSearchParams();
      if (t) p.set('q', term.trim());
      if (sort !== 'value') p.set('sort', sort);
      history.replaceState(null, '', `#providers${p.toString() ? `?${p}` : ''}`);
    };
    $('#pvq').addEventListener('input', (e) => { term = e.target.value; paint(); });
    $('#pvs').addEventListener('change', (e) => { sort = e.target.value; paint(); });
    paint();
    return 'Providers';
  }
  function renderProvider(pid) {
    const p = PROV.get(pid);
    const catches = [...new Set(p.plans.map((o) => o.catch).filter(Boolean))].slice(0, 4);
    const locs = [...p.locs];
    app.innerHTML = `<div class="page wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#providers">Providers</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.p)}</span></nav>
      <header class="phead"><span class="phead__shell" aria-hidden="true">${shellSvg(p)}</span><div><h1 class="ptitle">${esc(p.p)}</h1><p class="phead__meta"><span>HQ ${esc(p.hq || 'not published')}</span>${tpBadge(p, true)}</p></div>${p.site ? `<a class="btn btn--primary" href="${esc(p.site)}" target="_blank" rel="noopener">Visit ${esc(p.p)}${ICON('out')}</a>` : ''}</header>
      <div class="pstats">
        <div><b class="num">${p.plans.length}</b><span>plans in the catalog</span></div>
        <div><b class="num">${p.from != null ? money(p.from) : '—'}</b><span>lowest monthly price</span></div>
        <div><b class="num">${p.reviewed}/${p.plans.length}</b><span>billing terms reviewed</span></div>
        <div><b class="num">${locs.length || '—'}</b><span>${locs.length ? esc(locs.slice(0, 6).join(', ') + (locs.length > 6 ? ` +${locs.length - 6}` : '')) : 'Locations not published'}</span></div>
      </div>
      ${catches.length ? `<section aria-labelledby="c-h"><h2 class="h3" id="c-h">Read before you buy</h2><div class="notes">${catches.map((c) => `<div class="note note--catch"><h3>${ICON('hook')}The catch</h3><p>${esc(c)}</p></div>`).join('')}</div></section>` : ''}
      <section class="psec" aria-labelledby="pl-h"><div class="sec__head"><h2 id="pl-h">All ${p.plans.length} plan${p.plans.length === 1 ? '' : 's'}</h2><a class="pill" href="#catalog">Compare with other providers${ICON('arrow', 'ico--arrow')}</a></div><ul class="cards">${p.plans.map((o) => cardHtml(o)).join('')}</ul></section>
    </div>`;
    wirePicks($('.page', app));
    return p.p;
  }

  /* ── Special offers ──────────────────────────────── */
  function renderOffers(qs) {
    const q = new URLSearchParams(qs || '');
    const F = { all: ['All deals', () => true], cheap: ['Intro under $5', (o) => conv(o, o.intro ?? o.eff) < 5], short: ['Intro of 12 months or less', (o) => o.introM <= 12] };
    let f = F[q.get('f')] ? q.get('f') : 'all';
    const deals = D.filter((o) => o.tr && o.introM && o.ren != null && o.usd != null && conv(o, o.ren) > conv(o, o.intro ?? o.eff) + 0.005).sort((a, b) => (a.real ?? 1e9) - (b.real ?? 1e9) || a.rank - b.rank);
    const flat = onePer(D.filter((o) => flagMatch(o, 'flat') && flagMatch(o, 'contract')), 6);
    app.innerHTML = `<div class="page wrap">
      <header class="doc__head"><p class="kicker">Special offers</p><h1 class="ptitle">Intro deals, with the renewal up front.</h1><p class="lead">Every deal shows the intro price, how long it lasts and what you pay after. Sorted by the real 3-year cost, not by the size of the discount.</p></header>
      <div class="offers-bar"><div class="seg" role="group" aria-label="Filter deals">${Object.entries(F).map(([k, [l]]) => `<button type="button" data-f="${k}" aria-pressed="${k === f}">${l}</button>`).join('')}</div><p class="cat-meta"><span class="num" id="dealN">0</span> deals</p></div>
      <ul class="cards" id="deals"></ul>
      <section class="psec" aria-labelledby="flat-h"><div class="sec__head"><div><h2 id="flat-h">No-surprise plans</h2><p class="sec__sub">Monthly billing, and the price stays the same when it renews. One per provider.</p></div><a class="pill" href="#catalog?flags=contract,flat">See all${ICON('arrow', 'ico--arrow')}</a></div><ul class="cards">${flat.map((o) => cardHtml(o)).join('')}</ul></section>
    </div>`;
    const pg = $('.page', app);
    const paint = () => {
      const list = deals.filter(F[f][1]);
      $('#dealN').textContent = list.length;
      $('#deals').innerHTML = list.length ? list.slice(0, 24).map((o) => cardHtml(o, true)).join('') : `<li class="none">${fishArt('No deals today')}<div><h2>No intro deal matches.</h2><p>Try another filter, or look at the no-surprise plans below.</p></div></li>`;
      $$('[data-f]', pg).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.f === f)));
      history.replaceState(null, '', `#special-offers${f !== 'all' ? `?f=${f}` : ''}`);
    };
    pg.addEventListener('click', (e) => { const b = e.target.closest('[data-f]'); if (!b) return; f = b.dataset.f; paint(); say(`${$('#dealN').textContent} deals.`); });
    wirePicks(pg);
    paint();
    return 'Special offers';
  }

  /* ── Long-form pages: guides, method, legal ──────── */
  const needsLabel = (n) => [needsTxt(n), ...(n.flags || []).map((f) => FLAG_NAME[f].toLowerCase())].filter(Boolean).join(', ');
  const boardLi = (o, i) => `<li><span class="board__rank num">${i + 1}</span>${pmark(o)}<a class="board__name" href="#offer/${o.id}">${esc(o.name)}<span>${esc(o.p)} · ${esc(locTxt(o))}</span></a><span class="board__spec num">${specLine(o)}</span><span class="board__price"><b class="num">${money(o.usd)}</b><small>/mo</small>${o.real != null ? RV : ''}</span></li>`;
  function docShell({ crumbs = '', kicker, title, lead, sections, key, note = '', after = '' }) {
    return `<div class="page wrap doc">${crumbs}<header class="doc__head">${kicker ? `<p class="kicker">${kicker}</p>` : ''}<h1 class="ptitle">${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}${note}</header>
      <div class="doc__body"><nav class="toc" aria-label="On this page"><p>On this page</p><ol>${sections.map(([id, h]) => `<li><a href="#${key}/${id}" data-jump="${id}">${esc(h)}</a></li>`).join('')}</ol></nav>
      <article class="prose">${sections.map(([id, h, html]) => `<section id="s-${id}" aria-labelledby="h-${id}"><h2 id="h-${id}" tabindex="-1">${esc(h)}</h2>${html}</section>`).join('')}</article></div>${after}</div>`;
  }
  function wireToc(arg) {
    const toc = $('.toc', app);
    if (!toc) return;
    const links = $$('[data-jump]', toc);
    toc.addEventListener('click', (e) => {
      const a = e.target.closest('[data-jump]');
      if (!a) return;
      e.preventDefault();
      const h = $(`#h-${a.dataset.jump}`);
      h?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
      h?.focus({ preventScroll: true });
      history.replaceState(null, '', a.getAttribute('href'));
    });
    homeIO = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) links.forEach((l) => l.classList.toggle('on', `s-${l.dataset.jump}` === en.target.id)); }), { rootMargin: '-90px 0px -65% 0px' });
    $$('.prose > section', app).forEach((s) => homeIO.observe(s));
    if (arg && $(`#h-${arg}`)) later(() => $(`#h-${arg}`).scrollIntoView({ block: 'start' }), 20);
  }
  const ul = (items) => `<ul>${items.map((x) => `<li>${x}</li>`).join('')}</ul>`;
  const callout = (t, tone = '') => `<div class="callout${tone ? ` callout--${tone}` : ''}">${ICON(tone === 'warn' ? 'hook' : 'lantern')}<p>${t}</p></div>`;
  const GUIDES = [
    { slug: 'how-much-memory', kicker: 'Start here', pose: 'working', mins: 4, title: 'How much memory does your project need?', sum: 'Memory is the spec you run out of first. Size it from the app you run, then leave room.', needs: { ram: 2 },
      body: [
        ['start', 'Start from the app, not the plan', `<p>Pick memory from what you will run, then compare prices. These are common starting points for a single small project:</p><table class="mini-t"><thead><tr><th scope="col">Project</th><th scope="col">Memory to start with</th></tr></thead><tbody><tr><td>Personal VPN</td><td class="num">512 MB – 1 GB</td></tr><tr><td>Static site or small API</td><td class="num">1 GB</td></tr><tr><td>WordPress with a database</td><td class="num">2 GB</td></tr><tr><td>Docker stack with a few services</td><td class="num">4 GB</td></tr><tr><td>Database for a growing app</td><td class="num">4 – 8 GB</td></tr></tbody></table>`],
        ['headroom', 'Leave headroom', `<p>The system, updates and log spikes use memory too. If your app needs 1.5 GB, a 2 GB plan runs close to the edge; 4 GB lets it breathe.</p>${callout('When a server runs out of memory, Linux stops a process to save itself. Usually that is your database.')}`],
        ['cpu', 'When to pay for CPU instead', `<p>More vCPU helps with builds, video, compression and busy APIs. A blog or VPN rarely needs more than one or two. Shared vCPU is fine for most small projects; dedicated CPU matters when the server is busy all day.</p>`],
      ] },
    { slug: 'intro-vs-renewal', kicker: 'Pricing', pose: 'quirk', mins: 3, title: 'The intro price is not the price', sum: 'A $3 plan that renews at $12 costs more over three years than a flat $6 plan. Here is how to read it.', needs: { flags: ['flat'] },
      body: [
        ['how', 'How intro pricing works', `<p>Many providers charge less for the first months, often if you pay a long term up front. After that, the plan renews at the regular price.</p>${ul(['<b>Intro price</b>: what the first months cost.', '<b>Intro length</b>: how many months the intro lasts.', '<b>Renewal</b>: what every month costs after that.'])}`],
        ['math', 'Do the 3-year math', `<p>Add the intro months, the renewal months and the setup fee, then divide by 36. That is the number we call the <b>3-year real price</b>, and it is why the catalog marks some prices with a reviewed tick.</p>${callout('If a provider does not publish the renewal, we can’t add it up. You’ll see “Not computable” instead of a guess.', 'warn')}`],
        ['flat', 'When flat pricing wins', `<p>If you are not sure you will keep the server for years, monthly billing with a flat renewal keeps you free to leave. Use the <b>Flat renewal price</b> filter in the catalog.</p>`],
      ] },
    { slug: 'wordpress', kicker: 'Use case', pose: 'success', mins: 4, title: 'A VPS for a WordPress site', sum: 'Two gigabytes of memory, a backup plan and a server close to your readers.', needs: { ram: 2, price: 10 },
      body: [
        ['size', 'What size to pick', `<p>WordPress, PHP and a MySQL or MariaDB database fit in 2 GB for a small site. Add caching before you add memory.</p>`],
        ['where', 'Pick a location near your readers', `<p>A server in the same region as most visitors loads faster. Use the region filter, then check the exact city on the provider page.</p>`],
        ['backups', 'Backups are your job', `<p>Many VPS plans don’t include backups. Where the provider doesn’t say, we write “Confirm at checkout” on the plan page. Budget for snapshots or an off-site copy.</p>`],
      ] },
    { slug: 'vpn', kicker: 'Use case', pose: 'idle', mins: 3, title: 'A VPS for your own VPN', sum: 'Small memory, plenty of transfer, and an IPv4 address included.', needs: { ram: 1, price: 5 },
      body: [
        ['size', 'Small is enough', `<p>WireGuard runs well on 512 MB to 1 GB. Transfer matters more than CPU, so check the monthly transfer allowance.</p>`],
        ['ipv4', 'Check the IPv4 address', `<p>Some cheap plans are IPv6-only or charge extra for IPv4. Many networks still need IPv4, so use the <b>IPv4 included</b> filter.</p>`],
        ['location', 'Location decides what you can reach', `<p>Your traffic appears to come from the server’s country. Pick it on purpose.</p>`],
      ] },
    { slug: 'docker', kicker: 'Use case', pose: 'working', mins: 4, title: 'Running a Docker stack', sum: 'Four gigabytes, fast storage, and room to grow your compose file.', needs: { ram: 4, price: 25 },
      body: [
        ['size', 'Count the containers', `<p>A reverse proxy, an app, a database and a cache add up quickly. 4 GB is a comfortable start for a handful of services.</p>`],
        ['disk', 'Images fill disks', `<p>Docker images and volumes grow. Pick NVMe or SSD storage with room to spare, and prune old images.</p>`],
        ['term', 'Avoid long lock-in while you experiment', `<p>Stacks change. Monthly billing lets you resize or move without losing a prepaid year.</p>`],
      ] },
    { slug: 'ipv4-and-extras', kicker: 'Pricing', pose: 'error', mins: 3, title: 'IPv4, setup fees and other extras', sum: 'The small costs that turn a $4 plan into a $7 one, and how we mark them.', needs: { flags: ['ipv4'] },
      body: [
        ['ipv4', 'IPv4 addresses', `<p>IPv4 addresses are scarce. Some providers include one, some charge monthly, some vary by location. The plan page tells you which, or says it isn’t published.</p>`],
        ['setup', 'Setup fees', `<p>A one-time fee at checkout. We spread it over 36 months in the true monthly cost so you can compare it fairly.</p>`],
        ['tax', 'Tax', `<p>Prices may or may not include VAT. When the basis is unknown, the plan says so, and the true monthly cost becomes an “at least” number.</p>`],
      ] },
  ];
  function renderGuides() {
    app.innerHTML = `<div class="page wrap"><header class="doc__head"><p class="kicker">Guides</p><h1 class="ptitle">Pick a server without the guesswork.</h1><p class="lead">Short guides that end in real plans from the catalog. Nothing here is sponsored.</p></header>
      <ul class="ggrid">${GUIDES.map((g) => `<li class="gc"><a href="#guide/${g.slug}"><span class="tile__art night" aria-hidden="true">${pet('bvp', g.pose)}</span><span class="gc__b"><span class="kicker">${esc(g.kicker)}</span><span class="gc__t">${esc(g.title)}</span><span class="gc__s">${esc(g.sum)}</span><span class="gc__m">${g.mins} min read · ${D.filter((o) => matches(o, g.needs)).length} plans fit</span></span></a></li>`).join('')}</ul></div>`;
    return 'Guides';
  }
  function renderGuide(slug, arg) {
    const g = GUIDES.find((x) => x.slug === slug);
    const n = { ...blankQ(), ram: g.needs.ram || null, price: g.needs.price || null, flags: g.needs.flags || [] };
    const fit = sortList(D.filter((o) => matches(o, n)), 'value', 'asc');
    const more = GUIDES.filter((x) => x.slug !== slug).slice(0, 3);
    const plans = `<p>${fit.length} plans in today’s snapshot match <b>${esc(needsLabel(n))}</b>. The best one from each provider:</p><ol class="board">${onePer(fit, 5).map(boardLi).join('')}</ol><p class="row"><a class="btn btn--primary" href="#catalog${qstr(n)}">See all ${fit.length} plans${ICON('arrow', 'ico--arrow')}</a></p>`;
    app.innerHTML = docShell({
      key: `guide/${slug}`,
      crumbs: `<nav class="crumbs" aria-label="Breadcrumb"><a href="#guides">Guides</a><span aria-hidden="true">/</span><span aria-current="page">${esc(g.title)}</span></nav>`,
      kicker: `${esc(g.kicker)} · ${g.mins} min read`, title: esc(g.title), lead: esc(g.sum),
      sections: [...g.body, ['plans', 'Plans that fit', plans]],
      after: `<section class="psec" aria-labelledby="more-h"><div class="sec__head"><h2 id="more-h">More guides</h2></div><ul class="ggrid ggrid--3">${more.map((x) => `<li class="gc"><a href="#guide/${x.slug}"><span class="gc__b"><span class="kicker">${esc(x.kicker)}</span><span class="gc__t">${esc(x.title)}</span><span class="gc__s">${esc(x.sum)}</span></span></a></li>`).join('')}</ul></section>`,
    });
    wireToc(arg);
    return g.title;
  }
  const DRAFT = callout('Draft wording for design review. Final text needs a legal review before launch.', 'warn');
  const DOCS = {
    methodology: { kicker: 'How we compare', title: 'Every number has a source and a date.', lead: 'What we check on each plan, how the value score orders them, and what we do when a fact is missing.', sections: [
      ['check', 'What we check on every plan', `<p>Each plan gets a price receipt. Every line links to where it came from and when we checked it.</p>${ul(['Advertised monthly price', 'Intro price and how many months it lasts', 'Renewal price', 'Setup fee and what is due today', 'Contract length', 'IPv4 address: included, extra, or depends on location', 'CPU, memory, storage, transfer and locations', 'Trustpilot score and review count, with the date we read it'])}`],
      ['score', 'How the value score orders plans', `<p>The default order uses four ingredients:</p><ol class="ingr"><li>${ICON('tag')}<b>Price</b><span>What you pay each month, renewals included when they are published.</span></li><li>${ICON('ram')}<b>Memory per dollar</b><span>How much RAM each dollar buys.</span></li><li>${ICON('star')}<b>Trustpilot</b><span>Score and review count from the provider’s public page.</span></li><li>${ICON('lantern')}<b>Evidence</b><span>Plans with reviewed billing terms rank above guesses.</span></li></ol>${callout('Commission is not an ingredient. A plan with an affiliate link and one without get the same score for the same facts.')}`],
      ['missing', 'When a fact is missing', `<p>If a provider doesn’t publish something, we write <b>Not published</b>. We never fill the gap with an estimate. A missing renewal or setup fee means the 3-year total says <b>Not computable</b>, and the true monthly cost becomes an <b>at least</b> number.</p>`],
      ['money', 'How we make money', `<p>Some provider links are affiliate links. They are marked <b>Ad</b>, and we may earn a commission if you buy. Plans without a commission are listed and ranked the same way. Read the <a href="#affiliate">affiliate disclosure</a>.</p>`],
      ['fx', 'Currencies and tax', `<p>Prices are shown in US dollars. When a provider charges in another currency we convert at a dated rate, shown on the receipt. If there is no dated rate, we don’t convert. Tax basis is shown when the provider publishes it.</p>`],
      ['fix', 'Corrections', `<p>Prices change. If you see a wrong number, <a href="#corrections">send a correction</a> with the source. A person checks it against the provider’s page before the snapshot changes.</p>`],
    ] },
    privacy: { kicker: 'Legal', title: 'Privacy', lead: 'Short version: no accounts, no ad trackers, and your compare list stays in your browser.', note: DRAFT, sections: [
      ['collect', 'What we collect', `${ul(['<b>Nothing to sign up for.</b> You can use every page without an account.', '<b>Your browser keeps your choices.</b> The compare list, theme and view settings are stored in your browser’s local storage. Your needs from the finder last only for the browser session.', '<b>Server logs.</b> Like every website, our server records requests (IP address, browser, page) to keep the site running and safe. Logs are deleted after a short period.', '<b>Messages you send.</b> If you email us or send a correction, we keep the message and your email address to reply.'])}`],
      ['links', 'Provider links', `<p>When you click through to a provider, their site has its own privacy policy. Affiliate links may let the provider know that you came from us.</p>`],
      ['rights', 'Your choices', `<p>Clear your browser storage to remove your compare list and settings. To see or delete a message you sent us, write to <a href="mailto:hello@bestvpsforme.com">hello@bestvpsforme.com</a>.</p>`],
    ] },
    terms: { kicker: 'Legal', title: 'Terms of use', lead: 'bestvpsforme is a comparison guide. The provider’s checkout is the final word on price.', note: DRAFT, sections: [
      ['info', 'Information, not an offer', `<p>We show prices and terms as published by providers on the date shown. Prices change. Confirm everything at checkout before you buy.</p>`],
      ['nowarranty', 'No guarantee', `<p>We work to keep the data correct and say when a fact is missing, but we can’t guarantee every number. We are not responsible for a provider’s service.</p>`],
      ['use', 'Fair use', `<p>You can link to any page and quote our data with a link back. Please don’t copy the catalog in bulk or load the site in ways that slow it down for others.</p>`],
      ['changes', 'Changes', `<p>We may update these terms. The date at the top of this page will change when we do.</p>`],
    ] },
    affiliate: { kicker: 'Legal', title: 'Affiliate disclosure', lead: 'Some links earn us a commission. They never change the order.', note: DRAFT, sections: [
      ['what', 'What “Ad” means', `<p>A link marked <span class="ad">Ad</span> is an affiliate link. If you buy through it, the provider may pay us a commission. You pay the same price.</p>`],
      ['order', 'It never changes the order', `<p>The value score uses price, memory per dollar, Trustpilot and evidence. Commission is not part of it. See <a href="#methodology/score">how we compare</a>.</p>`],
      ['direct', 'Direct links', `<p>Plans without a commission are listed, ranked and linked the same way. Their button says <b>Direct link</b> on the plan page.</p>`],
    ] },
  };
  function renderDoc(key, arg) {
    const d = DOCS[key];
    app.innerHTML = docShell({ ...d, key });
    wireToc(arg);
    return key === 'methodology' ? 'How we compare' : d.title;
  }
  function renderUpdates() {
    const by = new Map();
    D.forEach((o) => { const k = (o.checked || '').slice(0, 7); if (k) by.set(k, (by.get(k) || 0) + 1); });
    const months = [...by.entries()].sort((a, b) => b[0].localeCompare(a[0]));
    const max = Math.max(1, ...months.map(([, n]) => n));
    const mName = (k) => new Date(`${k}-01T00:00:00Z`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    const reviewed = D.filter((o) => o.tr).length;
    app.innerHTML = `<div class="page wrap"><header class="doc__head"><p class="kicker">Updates</p><h1 class="ptitle">What changed, and when.</h1><p class="lead">Each snapshot is a full re-read of the catalog. Price checks are counted by the month they were made.</p></header>
      <ol class="tl">
        <li><time datetime="${META.snapshot}">${fmtDate(META.snapshot)}</time><h2>New catalog snapshot</h2><p>${META.count} plans from ${META.providers} providers. ${reviewed} have reviewed billing terms.</p><p class="row"><a class="pill" href="#catalog">Open the catalog${ICON('arrow', 'ico--arrow')}</a></p></li>
        ${months.map(([k, n]) => `<li><time datetime="${k}">${mName(k)}</time><h2><span class="num">${n}</span> price${n === 1 ? '' : 's'} checked</h2><span class="tl__bar" style="--w:${((n / max) * 100).toFixed(1)}%" aria-hidden="true"></span></li>`).join('')}
      </ol></div>`;
    return 'Updates';
  }
  function renderCorrections(qs) {
    const pre = byId.get(new URLSearchParams(qs || '').get('plan') || '');
    const lab = (o) => `${o.p} · ${o.name}`;
    const byLab = new Map(D.map((o) => [lab(o), o]));
    app.innerHTML = `<div class="page wrap"><div class="corr" id="corrBox">
      <div><header class="doc__head"><p class="kicker">Corrections</p><h1 class="ptitle">Spotted a wrong price?</h1><p class="lead">Send us the source. A person checks it against the provider’s page and updates the snapshot. No account needed.</p></header>
      <form class="form" id="corr" novalidate>
        <div class="field"><label for="c-plan">Plan</label><input class="input" id="c-plan" name="plan" list="c-plans" value="${pre ? esc(lab(pre)) : ''}" placeholder="Start typing a provider or plan" autocomplete="off" aria-describedby="e-plan"><datalist id="c-plans">${D.map((o) => `<option value="${esc(lab(o))}"></option>`).join('')}</datalist><p class="err" id="e-plan"></p></div>
        <div class="field"><label for="c-what">What is wrong</label><select class="select" id="c-what" name="what">${['Monthly price', 'Renewal price', 'Setup fee', 'Contract length', 'Hardware', 'Locations', 'IPv4 address', 'Something else'].map((x) => `<option>${x}</option>`).join('')}</select></div>
        <div class="field"><label for="c-val">The correct value</label><input class="input" id="c-val" name="val" placeholder="For example: renews at $12.99/mo" aria-describedby="e-val"><p class="err" id="e-val"></p></div>
        <div class="field"><label for="c-src">Source link</label><input class="input" id="c-src" name="src" type="url" inputmode="url" placeholder="https://provider.com/pricing" aria-describedby="h-src e-src"><p class="hint" id="h-src">The provider’s own pricing page works best.</p><p class="err" id="e-src"></p></div>
        <div class="field"><label for="c-mail">Email <span class="opt">optional</span></label><input class="input" id="c-mail" name="mail" type="email" autocomplete="email" aria-describedby="h-mail e-mail"><p class="hint" id="h-mail">Only to tell you when it’s fixed. Never shared.</p><p class="err" id="e-mail"></p></div>
        <div class="row"><button class="btn btn--primary" type="submit">Send the correction${ICON('arrow', 'ico--arrow')}</button></div>
      </form></div>
      <div class="corr__art" aria-hidden="true">${stateArt('working')}</div>
    </div></div>`;
    $('#corr').addEventListener('submit', (e) => {
      e.preventDefault();
      const f = e.currentTarget;
      const errs = {};
      const plan = byLab.get(f.plan.value.trim());
      if (!plan) errs.plan = 'Pick a plan from the list.';
      if (!f.val.value.trim()) errs.val = 'Tell us the correct value.';
      let okUrl = false;
      try { okUrl = /^https?:$/.test(new URL(f.src.value.trim()).protocol); } catch { okUrl = false; }
      if (!okUrl) errs.src = 'Paste a full link that starts with https://';
      if (f.mail.value.trim() && !f.mail.checkValidity()) errs.mail = 'Check the email address, or leave it empty.';
      ['plan', 'val', 'src', 'mail'].forEach((k) => { $(`#e-${k}`).textContent = errs[k] || ''; f[k].toggleAttribute('aria-invalid', Boolean(errs[k])); });
      const first = Object.keys(errs)[0];
      if (first) { f[first].focus(); say(errs[first]); return; }
      $('#corrBox').outerHTML = `<div class="state" role="status">${stateArt('success')}<div><h1 class="ptitle">Thanks. The crab is on it.</h1><p>We’ll check <b>${esc(f.what.value.toLowerCase())}</b> for <b>${esc(plan.p)} ${esc(plan.name)}</b> against your source.${f.mail.value.trim() ? ' We’ll email you when it’s fixed.' : ''}</p><p class="fine">Mockup: nothing was sent.</p><div class="row"><a class="btn btn--primary" href="#offer/${plan.id}">Back to the plan</a><a class="btn" href="#catalog">Browse plans</a></div></div></div>`;
      app.focus();
      say('Correction sent. Thanks.');
    });
    return 'Send a correction';
  }

  /* ── Dropdowns: styled listbox over a native <select> (the select keeps value + change events) ── */
  let ddN = 0;
  function enhanceSelects(root = document) {
    $$('select.select:not([data-dd])', root).forEach((sel) => {
      sel.dataset.dd = '1';
      const n = ddN++;
      const lab = sel.id ? $(`label[for="${sel.id}"]`) : null;
      const labTxt = lab ? (($('span', lab) || lab).textContent.trim()) : sel.getAttribute('aria-label') || 'Choose';
      const wrap = document.createElement('div');
      wrap.className = `dd${sel.classList.contains('select--sm') ? ' dd--sm' : ''}`;
      wrap.innerHTML = `<button type="button" class="${sel.className} dd__btn" id="dd${n}" aria-haspopup="listbox" aria-expanded="false" aria-controls="ddl${n}"><span class="dd__v"></span></button><ul class="dd__list" id="ddl${n}" role="listbox" tabindex="-1" aria-label="${esc(labTxt)}" hidden>${[...sel.options].map((o, i) => `<li role="option" id="ddo${n}-${i}" data-i="${i}" aria-selected="false"><span>${esc(o.textContent)}</span>${ICON('check')}</li>`).join('')}</ul>`;
      sel.before(wrap);
      wrap.append(sel);
      sel.hidden = true;
      sel.tabIndex = -1;
      if (lab) lab.htmlFor = `dd${n}`;
      const btn = $('.dd__btn', wrap); const list = $('.dd__list', wrap); const opts = $$('[role="option"]', list);
      let act = 0;
      const sync = () => {
        const i = Math.max(0, sel.selectedIndex);
        $('.dd__v', btn).textContent = sel.options[i]?.textContent || '';
        btn.setAttribute('aria-label', `${labTxt}: ${sel.options[i]?.textContent || ''}`);
        opts.forEach((o, k) => o.setAttribute('aria-selected', String(k === i)));
      };
      sel._ddSync = sync;
      const setAct = (i) => { act = (i + opts.length) % opts.length; opts.forEach((o, k) => o.classList.toggle('act', k === act)); list.setAttribute('aria-activedescendant', opts[act].id); opts[act].scrollIntoView({ block: 'nearest' }); };
      const open = () => {
        if (!list.hidden) return;
        $$('.dd.open').forEach((d) => d._ddClose?.(false));
        list.hidden = false; wrap.classList.add('open'); btn.setAttribute('aria-expanded', 'true');
        const r = btn.getBoundingClientRect();
        wrap.classList.toggle('up', innerHeight - r.bottom < Math.min(list.scrollHeight, 300) + 16 && r.top > innerHeight - r.bottom);
        setAct(Math.max(0, sel.selectedIndex));
        list.focus({ preventScroll: true });
      };
      const close = (focus = true) => { if (list.hidden) return; list.hidden = true; wrap.classList.remove('open', 'up'); btn.setAttribute('aria-expanded', 'false'); if (focus) btn.focus(); };
      wrap._ddClose = close;
      const pick = (i) => { const changed = sel.selectedIndex !== i; sel.selectedIndex = i; sync(); close(); if (changed) sel.dispatchEvent(new Event('change', { bubbles: true })); };
      btn.addEventListener('click', (e) => { e.preventDefault(); if (list.hidden) open(); else close(); });
      btn.addEventListener('keydown', (e) => { if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); open(); if (e.key === 'ArrowUp') setAct(act - 1); } });
      list.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); const o = e.target.closest('[role="option"]'); if (o) pick(Number(o.dataset.i)); });
      list.addEventListener('pointermove', (e) => { const o = e.target.closest('[role="option"]'); if (o && Number(o.dataset.i) !== act) setAct(Number(o.dataset.i)); });
      list.addEventListener('keydown', (e) => {
        const k = e.key;
        if (k === 'ArrowDown') setAct(act + 1);
        else if (k === 'ArrowUp') setAct(act - 1);
        else if (k === 'Home') setAct(0);
        else if (k === 'End') setAct(opts.length - 1);
        else if (k === 'Enter' || k === ' ') pick(act);
        else if (k === 'Escape') close();
        else if (k === 'Tab') { close(false); return; }
        else if (k.length === 1) { const i = opts.findIndex((o, x) => x > act && o.textContent.trim().toLowerCase().startsWith(k.toLowerCase())); const j = i >= 0 ? i : opts.findIndex((o) => o.textContent.trim().toLowerCase().startsWith(k.toLowerCase())); if (j >= 0) setAct(j); return; }
        else return;
        e.preventDefault();
      });
      list.addEventListener('focusout', (e) => { if (!wrap.contains(e.relatedTarget)) close(false); });
      sel.addEventListener('change', sync);
      sync();
    });
  }
  const ddSync = (root = document) => $$('select[data-dd]', root).forEach((s) => s._ddSync?.());
  document.addEventListener('pointerdown', (e) => { $$('.dd.open').forEach((d) => { if (!d.contains(e.target)) d._ddClose?.(false); }); });

  /* ── Shared behaviour ──────────────────────────── */
  let io = null;
  function sleepers() {
    io?.disconnect();
    io = new IntersectionObserver((entries) => entries.forEach((e) => {
      e.target.classList.toggle('asleep', !e.isIntersecting);
      if (e.isIntersecting && e.target.matches('[data-draw]') && !reduced()) { e.target.classList.add('cs-draw'); e.target.removeAttribute('data-draw'); }
    }), { threshold: 0.15 });
    $$('.pet, .hero__shore, [data-draw]').forEach((el) => io.observe(el));
  }
  const tip = document.createElement('div');
  tip.className = 'tip';
  tip.setAttribute('aria-hidden', 'true');
  document.body.append(tip);
  document.addEventListener('pointerover', (e) => { const t = e.target.closest?.('[data-tip]'); if (!t) return; tip.textContent = t.dataset.tip; tip.classList.add('on'); });
  document.addEventListener('pointermove', (e) => { if (!tip.classList.contains('on')) return; tip.style.left = `${e.clientX}px`; tip.style.top = `${e.clientY}px`; });
  document.addEventListener('pointerout', (e) => { if (e.target.closest?.('[data-tip]')) tip.classList.remove('on'); });

  function route(focus) {
    clearTimers();
    homeResize = null;
    homeIO?.disconnect();
    homeIO = null;
    const raw = location.hash.slice(1) || 'home';
    if (raw === 'app' || raw === 'top') return;
    const [path, qs] = raw.split('?');
    const [name, arg] = path.split('/');
    let title;
    if (name === 'home' || name === '') title = renderHome();
    else if (name === 'catalog') title = renderCatalog(qs);
    else if (name === 'offer' && byId.has(decodeURIComponent(arg || ''))) title = renderOffer(decodeURIComponent(arg), qs);
    else if (name === 'compare') title = renderCompare();
    else if (name === 'special-offers') title = renderOffers(qs);
    else if (name === 'providers') title = renderProviders(qs);
    else if (name === 'provider' && PROV.has(decodeURIComponent(arg || ''))) title = renderProvider(decodeURIComponent(arg));
    else if (name === 'guides') title = renderGuides();
    else if (name === 'guide' && GUIDES.some((g) => g.slug === arg)) title = renderGuide(arg, path.split('/')[2]);
    else if (DOCS[name]) title = renderDoc(name, arg);
    else if (name === 'updates') title = renderUpdates();
    else if (name === 'corrections') title = renderCorrections(qs);
    else title = render404();
    document.title = `${title} · bestvpsforme · Shore mockup`;
    const navKey = { catalog: 'catalog', offer: 'catalog', 'special-offers': 'special-offers', providers: 'providers', provider: 'providers', guides: 'guides', guide: 'guides', methodology: 'methodology' }[name];
    $$('.nav a').forEach((a) => { if (a.dataset.nav === navKey) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    $('.top').classList.remove('open');
    $('#menuBtn')?.setAttribute('aria-expanded', 'false');
    window.scrollTo(0, 0);
    if (focus) app.focus({ preventScroll: true });
    sleepers();
    enhanceSelects(app);
  }

  function go(h) {
    if (location.hash !== h) history.pushState(null, '', h);
    route(true);
  }

  function shell() {
    kit();
    paintPail();
    $('#brandCrab').innerHTML = pet('bvp', 'idle', 'logo');
    $('#footBear').innerHTML = pet('twargaops', 'idle');
    $('#footCrab').innerHTML = pet('bvp', 'idle');
    $('#footMeta').textContent = `${META.count} plans, ${META.providers} providers, snapshot ${fmtDate(META.snapshot)}. ${META.source}`;
    $('.foot__shore').innerHTML = '<path class="fill" d="M0 22C120 12 240 30 360 20S600 10 720 22 960 32 1080 20 1320 12 1440 22V40H0Z"/><path class="seam" d="M0 22C120 12 240 30 360 20S600 10 720 22 960 32 1080 20 1320 12 1440 22"/>';
    const top = $('.top');
    const menu = $('#menuBtn');
    const closeMenu = () => { top.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); };
    menu.addEventListener('click', () => { const open = top.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); if (open) $('#nav a').focus(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && top.classList.contains('open')) { closeMenu(); menu.focus(); } });
    const themeBtn = $('#themeBtn');
    const syncTheme = () => themeBtn.setAttribute('aria-label', root.dataset.theme === 'night' ? 'Switch to day theme' : 'Switch to night theme');
    syncTheme();
    themeBtn.addEventListener('click', () => {
      const toNight = root.dataset.theme !== 'night';
      const flip = () => { root.dataset.theme = toNight ? 'night' : 'day'; localStorage.setItem('shore-theme', root.dataset.theme); syncTheme(); };
      top.classList.remove('waving'); void top.offsetWidth; if (!reduced()) top.classList.add('waving');
      if (reduced() || !document.startViewTransition) { flip(); return; }
      const r = themeBtn.getBoundingClientRect();
      root.style.setProperty('--lx', `${(r.left + r.width / 2).toFixed(0)}px`);
      root.style.setProperty('--ly', `${(r.top + r.height / 2).toFixed(0)}px`);
      root.classList.add(toNight ? 'to-night' : 'to-day');
      themeBtn.classList.remove('lit'); void themeBtn.offsetWidth; themeBtn.classList.add('lit');
      document.startViewTransition(flip).finished.finally(() => root.classList.remove('to-night', 'to-day'));
    });
    top.insertAdjacentHTML('beforeend', '<span class="tide-line" aria-hidden="true"><i></i></span>');
    let tq = 0;
    const tide = () => { tq = 0; const max = document.documentElement.scrollHeight - innerHeight; root.style.setProperty('--tide', max > 40 ? Math.min(1, Math.max(0, scrollY / max)).toFixed(4) : 0); top.classList.toggle('tidal', max > 40); };
    addEventListener('scroll', () => { if (!tq) tq = requestAnimationFrame(tide); }, { passive: true });
    addEventListener('resize', tide);
    new MutationObserver(() => requestAnimationFrame(tide)).observe(app, { childList: true });
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[aria-disabled="true"]');
      if (!a) return;
      e.preventDefault();
      closeMenu();
      toast(`“${a.textContent.trim()}” is not part of this mockup yet.`, 'quirk', 'info');
    });
    $('.skip').addEventListener('click', (e) => { e.preventDefault(); app.focus(); });
    const review = $('.review');
    const rt = $('#reviewToggle');
    const setReview = (open) => { review.dataset.open = String(open); rt.setAttribute('aria-expanded', String(open)); };
    setReview(false);
    rt.addEventListener('click', () => setReview(review.dataset.open !== 'true'));
    $('#rmToggle').checked = mq.matches;
    $('#rmToggle').addEventListener('change', (e) => { root.classList.toggle('rm', e.target.checked); });
    review.addEventListener('click', (e) => {
      const b = e.target.closest('[data-review]');
      if (!b) return;
      const act = b.dataset.review;
      if (act === 'fill') { pail = ['hostinger-kvm-2', 'liquid-web-lw-2g', 'ionos-vps-m-plus'].filter((id) => byId.has(id)); if (pail.length < 3) pail = [...new Set([...pail, ...D.slice(0, 3).map((o) => o.id)])].slice(0, 3); savePail(); go('#compare'); return; }
      if (act === 'clear') { pail = []; savePail(); go('#compare'); return; }
      if (!location.hash.startsWith('#catalog')) go('#catalog');
      if (act === 'loading') { catState = 'loading'; paintResults(); later(() => { catState = 'ok'; paintResults(); }, 1800); }
      if (act === 'nodata') { catState = 'nodata'; paintResults(); }
      if (act === 'empty') { catState = 'ok'; Object.assign(CQ, blankQ(), { ram: 16, price: 5, regions: ['oceania'], page: 1 }); $('#rail').innerHTML = railHtml(); enhanceSelects($('#rail')); paintResults(); }
    });
    document.addEventListener('visibilitychange', () => root.classList.toggle('tab-hidden', document.hidden));
    mq.addEventListener('change', () => { $('#rmToggle').checked = mq.matches; });
    let rz = 0;
    addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => homeResize?.(), 140); });
  }
  shell();
  addEventListener('hashchange', () => route(true));
  route(false);
})();
