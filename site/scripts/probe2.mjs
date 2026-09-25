import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const all = [];
p.on('response', r => { if (r.request().resourceType()==='image') all.push(r.status() + ' ' + r.url()) });
await p.goto('https://www.rfsportscars.com/', { waitUntil: 'networkidle', timeout: 60000 });
for (let i = 0; i < 12; i++) { await p.mouse.wheel(0, 700); await p.waitForTimeout(500); }
await p.waitForTimeout(2000);
const cards = await p.$$eval('a[href*="-c-"]', as => as.map(a => ({ href: a.href, img: (a.querySelector('img')||{}).currentSrc || '', bg: getComputedStyle(a).backgroundImage, text: a.innerText.slice(0,80) })));
console.log(JSON.stringify(cards, null, 1));
const imgs = await p.$$eval('img', is => is.map(i => [i.currentSrc||i.src, i.naturalWidth, i.naturalHeight, i.alt].join(' | ')));
console.log(imgs.join('\n'));
console.log(all.filter(u=>!/theme|userway/.test(u)).join('\n'));
await b.close();
