import { chromium } from 'playwright';
const [url, out, w = 1440, h = 900, full] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
await p.screenshot({ path: out, fullPage: !!full });
await b.close();
