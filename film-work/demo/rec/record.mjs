// Frame-exact recorder for the real bestvpsforme site.
//
// The page's clock is frozen (Playwright clock) and stepped 1/FPS s per frame; every CSS animation
// and transition is paused and set to its exact time; then the frame is captured at 2× (3840×2160).
// The cursor is a real mouse (so hovers, the lantern and row highlights happen), but it is drawn
// later by the compositor from the logged track. Every click, pick and page change is logged with
// its time to events.json, which the soundtrack is composed against.
//
//   node record.mjs <take|all>      → ~/film-work/demo/takes/<take>/{f00000.jpg…, track.json}
import { createRequire } from 'node:module';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
const require = createRequire('/home/tlab/film-work/node_modules/');
const { chromium } = require('playwright-core');

const BASE = 'http://127.0.0.1:3300';
const ROOT = '/home/tlab/film-work/demo/takes';
const FPS = 30;
const DT = 1000 / FPS;
const T0 = new Date('2026-11-03T20:00:00Z');

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

class Take {
  constructor(name, page, cdp) {
    this.name = name;
    this.page = page;
    this.cdp = cdp;
    this.dir = `${ROOT}/${name}`;
    this.n = 0;
    this.cursor = { x: 2000, y: 1150 };
    this.track = [];
    this.events = [];
    this.inflight = 0;
    // Link prefetches (`_rsc=`) can stay open forever; they never change what's on screen.
    const counted = (r) => !r.url().includes('_rsc=');
    page.on('request', (r) => counted(r) && this.inflight++);
    page.on('requestfinished', (r) => counted(r) && this.inflight--);
    page.on('requestfailed', (r) => counted(r) && this.inflight--);
    rmSync(this.dir, { recursive: true, force: true });
    mkdirSync(this.dir, { recursive: true });
  }
  get t() {
    return this.n * DT;
  }
  log(type, extra = {}) {
    this.events.push({ t: +(this.t / 1000).toFixed(4), frame: this.n, type, ...extra });
  }
  async idle(limit = 4000) {
    const end = Date.now() + limit;
    while (this.inflight > 0 && Date.now() < end) await new Promise((r) => setTimeout(r, 15));
  }
  /** One frame: move the real mouse, advance the page clock, pin animations, capture. */
  async frame() {
    const { page } = this;
    await page.mouse.move(this.cursor.x, this.cursor.y);
    await page.clock.runFor(DT);
    await this.idle();
    const vt = this.t;
    await page.evaluate((vt) => {
      const born = (window.__born ??= new WeakMap());
      for (const a of document.getAnimations()) {
        if (!born.has(a)) {
          born.set(a, vt);
          a.pause();
        }
        a.currentTime = Math.max(0, vt - born.get(a));
      }
    }, vt);
    const { data } = await this.cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 93, fromSurface: true, captureBeyondViewport: false });
    writeFileSync(`${this.dir}/f${String(this.n).padStart(5, '0')}.jpg`, Buffer.from(data, 'base64'));
    const scrollY = await page.evaluate(() => window.scrollY);
    this.track.push({ x: +this.cursor.x.toFixed(1), y: +this.cursor.y.toFixed(1), down: !!this.down, scrollY });
    this.n++;
  }
  async hold(ms) {
    for (let i = 0; i < Math.round(ms / DT); i++) await this.frame();
  }
  /** Glide the cursor to a point (or an element's centre) on a gentle arc, slowing at the end. */
  async move(to, ms = 600) {
    const target = typeof to === 'string' ? await this.center(to) : to;
    const from = { ...this.cursor };
    const dx = target.x - from.x;
    const dy = target.y - from.y;
    const bend = Math.min(80, Math.hypot(dx, dy) * 0.12);
    const n = Math.max(1, Math.round(ms / DT));
    for (let i = 1; i <= n; i++) {
      const e = ease(i / n);
      const arc = Math.sin(Math.PI * e) * bend;
      const len = Math.hypot(dx, dy) || 1;
      this.cursor = { x: from.x + dx * e + (-dy / len) * arc, y: from.y + dy * e + (dx / len) * arc };
      await this.frame();
    }
    return target;
  }
  async center(sel) {
    const b = await this.page.locator(sel).first().boundingBox();
    if (!b) throw new Error(`no box for ${sel}`);
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  }
  async box(sel, label) {
    const b = await this.page.locator(sel).first().boundingBox();
    if (b) this.log('box', { label, x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) });
    return b;
  }
  /** A real click at the cursor; the press shows for two frames. */
  async click(label) {
    this.log('click', { label, x: Math.round(this.cursor.x), y: Math.round(this.cursor.y) });
    this.down = true;
    await this.page.mouse.down();
    await this.frame();
    await this.page.mouse.up();
    this.down = false;
    await this.frame();
  }
  async scrollTo(y, ms = 800) {
    const from = await this.page.evaluate(() => window.scrollY);
    const n = Math.max(1, Math.round(ms / DT));
    for (let i = 1; i <= n; i++) {
      const v = from + (y - from) * ease(i / n);
      await this.page.evaluate((v) => window.scrollTo(0, v), v);
      await this.frame();
    }
  }
  save(extra = {}) {
    writeFileSync(`${this.dir}/track.json`, JSON.stringify({ fps: FPS, scale: 2, frames: this.n, track: this.track, events: this.events, ...extra }, null, 0));
    console.log(`${this.name}: ${this.n} frames (${(this.n / FPS).toFixed(2)} s), ${this.events.length} events`);
  }
}

async function open(browser, name, url) {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2, colorScheme: 'dark', reducedMotion: 'no-preference' });
  await ctx.clock.install({ time: T0 });
  await ctx.clock.pauseAt(T0);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => {
    throw new Error(`page error in ${name}: ${e.message}`);
  });
  await page.route('**/api/analytics/**', (r) => r.fulfill({ status: 204, body: '' }));
  await page.route('**/go/**', (r) => r.fulfill({ status: 204, body: '' }));
  const cdp = await ctx.newCDPSession(page);
  const take = new Take(name, page, cdp);
  await page.goto(BASE + url, { waitUntil: 'load' });
  // From here on the take never leaves its page: the last click of a take (Show the plans,
  // the pail, Visit) is the cut point; the next take opens that page fresh.
  await page.route('**/*', (r) => (r.request().isNavigationRequest() && r.request().frame() === page.mainFrame() ? r.fulfill({ status: 204, body: '' }) : r.continue()));
  await page.evaluate(() => document.fonts.ready);
  await take.idle();
  return { take, page, ctx };
}

/* ── the takes ─────────────────────────────────────────────────────────────────── */
const TAKES = {
  // 1 · Tell it what you need: three picks, the crab and its shells react, "✓ This one."
  async hero(browser) {
    const { take, ctx } = await open(browser, 'hero', '/');
    await take.box('#home-title', 'h1');
    await take.box('.finder', 'finder');
    await take.box('#scene', 'scene');
    await take.hold(1400);
    for (const [label, opt, name] of [['Memory', '4 GB or more', 'ram'], ['Budget', 'Under $10/mo', 'price'], ['Region', 'Europe', 'region']]) {
      await take.move(`button[aria-label^="${label}"]`, 650);
      await take.box(`button[aria-label^="${label}"]`, `dd-${name}`);
      await take.click(`open-${name}`);
      await take.hold(240);
      await take.move(`[role="option"]:has-text("${opt}")`, 420);
      await take.click(`pick-${name}`);
      take.log('count', { label: name, value: await take.page.locator('#fitCount').innerText() });
      await take.hold(name === 'region' ? 2900 : 1900);
    }
    await take.box('#fitCount', 'count');
    await take.box('.pshell.win, .pshell', 'winner');
    await take.box('#heroCrab', 'crab');
    const href = await take.page.locator('#fitGo').getAttribute('href');
    await take.move('#fitGo', 700);
    await take.box('#fitGo', 'go');
    await take.hold(300);
    await take.click('go');
    await take.hold(200);
    take.save({ href, count: await take.page.locator('#fitCount').innerText() });
    await ctx.close();
    return href;
  },
  // 1 → 2 · the list, real prices and ratings; tick three plans into the pail
  async catalog(browser, href = '/catalog?ram=4&price=10&regions=europe') {
    const { take, page, ctx } = await open(browser, 'catalog', href);
    await take.box('h1', 'h1');
    await take.box('tr:has(input[data-pick])', 'row0');
    await take.hold(900);
    // glide along the first row: Trustpilot, then the price in euros
    await take.move('tr:has(input[data-pick]) >> nth=0 >> td.c-trust, tr:has(input[data-pick]) >> nth=0 >> [class*=tp]', 800).catch(async () => take.move({ x: 1200, y: 420 }, 800));
    await take.box('tr:has(input[data-pick]) >> nth=0 >> td >> nth=-3', 'trust');
    await take.hold(500);
    await take.move('tr:has(input[data-pick]) >> nth=0 >> td >> nth=-2', 600);
    await take.box('tr:has(input[data-pick]) >> nth=0 >> td >> nth=-2', 'price');
    await take.hold(700);
    const ids = await page.locator('input[data-pick]').evaluateAll((els) => els.slice(0, 3).map((e) => e.dataset.pick));
    for (const [i, id] of ids.entries()) {
      await take.move(`label:has(input[data-pick="${id}"])`, i ? 380 : 650);
      await take.click(`pick-${i + 1}`);
      await take.hold(i === 2 ? 1300 : 650);
    }
    await take.box('#pailBtn', 'pail');
    await take.move('#pailBtn', 750);
    await take.hold(250);
    const cmp = await page.locator('#pailBtn').getAttribute('href');
    await take.click('pail');
    await take.hold(200);
    take.save({ ids, compare: cmp });
    await ctx.close();
    return { ids, cmp };
  },
  // 2 · the compare page: the thread sews the plans together; fold to what differs; "Lowest"
  async compare(browser, cmp = '/compare?id=time4vps-linux-4&id=alphavps-alpha-c4g&id=alphavps-alpha-c6g') {
    const { take, page, ctx } = await open(browser, 'compare', cmp);
    await take.box('h1', 'h1');
    await take.box('table, .cmp', 'table');
    await take.hold(2200);
    await take.move('text=Only show what differs', 800);
    await take.box('text=Only show what differs', 'differs');
    await take.click('differs');
    await take.hold(1400);
    await take.box('text=Lowest', 'lowest');
    await take.move('text=Lowest', 700);
    await take.hold(1500);
    take.save();
    await ctx.close();
  },
  // 3 · you pick, and buy direct: the receipt, its evidence thread, the Visit button
  async offer(browser, id = 'time4vps-linux-4') {
    const { take, page, ctx } = await open(browser, 'offer', `/offers/${id}`);
    await take.box('h1', 'h1');
    await take.box('[class*=receipt]', 'receipt');
    await take.hold(900);
    // the receipt line itself (a button): pointing at it draws the thread to its evidence
    await take.move('button.rline:has-text("Advertised")', 800);
    await take.box('button.rline:has-text("Advertised")', 'advertised');
    await take.hold(1600);
    await take.box('#evid', 'evidence');
    await take.move('a:has-text("Visit")', 800);
    await take.box('a:has-text("Visit")', 'visit');
    await take.box('text=Direct link', 'direct');
    await take.hold(500);
    await take.click('visit');
    await take.hold(1300);
    take.save();
    await ctx.close();
  },
};

const which = process.argv[2] ?? 'all';
const browser = await chromium.launch({ args: ['--use-angle=vulkan', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars'] });
try {
  if (which === 'all') {
    const href = await TAKES.hero(browser);
    const { ids, cmp } = await TAKES.catalog(browser, href);
    await TAKES.compare(browser, cmp);
    await TAKES.offer(browser, ids[0]);
  } else await TAKES[which](browser, ...process.argv.slice(3));
} finally {
  await browser.close();
}
