import { createRequire } from 'module';
const require = createRequire('/home/tlab/film-work/demo/app/package.json');
const { chromium } = require('playwright');
const dir = process.argv[2];
const b = await chromium.launch({ executablePath: '/home/tlab/.cache/ms-playwright/chromium-1254/chrome-linux64/chrome', args: ['--no-sandbox'] });
const shot = async (file, w, h, out, wait) => {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('file://' + dir + '/' + file);
  if (wait) await p.waitForFunction(() => document.title === 'ready', null, { timeout: 15000 });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: dir + '/' + out });
  await p.close();
};
await shot('banner.html', 2560, 1440, 'banner.png', true);
await shot('logo.html', 800, 800, 'logo.png', false);
await b.close();
console.log('rendered');
