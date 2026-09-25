import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const all = [];
p.on('response', r => all.push(r.request().resourceType() + ' ' + r.status() + ' ' + r.url()));
await p.goto('https://www.rfsportscars.com/1974-de-tomaso-pantera-custom-c-655/', { waitUntil: 'networkidle', timeout: 60000 });
for (let i = 0; i < 8; i++) { await p.mouse.wheel(0, 700); await p.waitForTimeout(600); }
await p.waitForTimeout(2000);
const html = await p.content();
const m = [...new Set(html.match(/https?:[^"' )]+?\.(?:jpe?g|png|webp)[^"' )]*/gi) || [])];
console.log('HTML imgs', m.filter(u => !/theme/.test(u)).slice(0, 30));
console.log(all.filter(l => !/\.(css|js)|font|google|facebook|analytics/.test(l)).slice(0, 80).join('\n'));
await p.screenshot({ path: '_capture/pantera-page.png' });
await b.close();
