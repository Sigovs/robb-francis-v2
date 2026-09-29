// ds.html: reads every token from the live stylesheet, so the page documents what the build actually ships.
import Lenis from 'lenis';

const root = getComputedStyle(document.documentElement);
const tok = (name) => root.getPropertyValue(name).trim();
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Lenis on every page (DNA90); in-page links glide with it
if (!reduce) {
  const lenis = new Lenis({ lerp: 0.09, anchors: { offset: -80 } });
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}

// ---- colour: resolve a token to rgba through the browser, then WCAG contrast against the ground ----
const probe = document.createElement('span');
document.body.append(probe);
const rgba = (css) => {
  probe.style.color = ''; probe.style.color = css;
  const m = getComputedStyle(probe).color.match(/[\d.]+/g).map(Number);
  return { r: m[0], g: m[1], b: m[2], a: m[3] ?? 1 };
};
const over = (c, bg) => ({ r: c.r * c.a + bg.r * (1 - c.a), g: c.g * c.a + bg.g * (1 - c.a), b: c.b * c.a + bg.b * (1 - c.a) });
const lum = ({ r, g, b }) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; })
  .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const hex = ({ r, g, b }) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

const ground = rgba(tok('--c-ground'));
document.querySelectorAll('.ds-sw').forEach((el) => {
  const name = el.dataset.token, value = tok(name), c = rgba(value);
  const flat = over(c, ground), r = ratio(flat, ground);
  const light = lum(flat) > 0.4;
  el.innerHTML = `
    <div class="ds-sw__chip" style="background:var(${name});color:${light ? '#12161d' : '#eceef1'}">${el.hasAttribute('data-text') ? '<span>Aa</span>' : ''}</div>
    <div class="ds-sw__body">
      <span class="ds-sw__name">${name}</span>
      <span class="ds-sw__val">${value}${c.a < 1 ? ` · on ground ${hex(flat)}` : ''}</span>
      <span class="ds-sw__note">${el.dataset.note}</span>
      ${el.hasAttribute('data-text') ? `<span class="ds-sw__ratio">${r.toFixed(1)}:1 on --c-ground${r >= 4.5 ? ' · AA' : r >= 3 ? ' · 3:1 marks only' : ''}</span>` : ''}
    </div>`;
});

// ---- type: measure each specimen as rendered at this width ----
const px = (v) => `${Math.round(parseFloat(v) * 10) / 10}px`;
document.querySelectorAll('.ds-spec').forEach((el) => {
  const t = el.querySelector('.ds-m-target'), cs = getComputedStyle(t);
  const fam = cs.fontFamily.split(',')[0].replace(/"/g, '');
  const lh = cs.lineHeight === 'normal' ? 'normal' : (parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)).toFixed(2);
  const ls = cs.letterSpacing === 'normal' ? '0' : `${(parseFloat(cs.letterSpacing) / parseFloat(cs.fontSize)).toFixed(3)}em`;
  el.querySelector('.ds-m').textContent = `${fam} ${cs.fontWeight} · ${px(cs.fontSize)} / ${lh} · tracking ${ls}`;
});
document.fonts?.ready.then(() => document.querySelectorAll('.ds-spec').length);

// ---- space and sizes ----
const toPx = (v) => { probe.style.width = v; probe.style.display = 'block'; const w = probe.getBoundingClientRect().width; probe.style.width = ''; probe.style.display = ''; return w; };
document.querySelectorAll('[data-scale] > div').forEach((el) => {
  const name = el.dataset.token, v = tok(name), w = toPx(v);
  el.className = 'ds-scale__row';
  el.innerHTML = `<b>${name}</b><span>${v} · ${Math.round(w)}px</span><i class="ds-scale__bar" style="width:${w}px"></i>`;
});
document.querySelectorAll('[data-sizes] > div').forEach((el) => {
  const name = el.dataset.token || el.dataset.name, v = el.dataset.static || tok(name);
  el.className = 'ds-table__row';
  el.innerHTML = `<b>${name}</b><span>${v}</span><em>${el.dataset.note}</em>`;
});

// ---- motion: plot each easing and run a dot along it ----
document.querySelectorAll('[data-ease]').forEach((el) => {
  const name = el.dataset.ease, v = tok(name);
  const [x1, y1, x2, y2] = (v.match(/-?\d*\.?\d+/g) || [0, 0, 1, 1]).map(Number);
  const W = 160, H = 100;
  el.className = 'ds-ease';
  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" aria-hidden="true">
      <line x1="0" y1="${H}" x2="${W}" y2="${H}" stroke="var(--c-hair)" />
      <line x1="0" y1="0" x2="0" y2="${H}" stroke="var(--c-hair)" />
      <path d="M0 ${H} C ${x1 * W} ${H - y1 * H}, ${x2 * W} ${H - y2 * H}, ${W} 0" fill="none" stroke="var(--c-ink)" stroke-width="1.5" />
    </svg>
    <div class="ds-ease__track"><i class="ds-ease__dot"></i></div>
    <b>${name}</b><span>${v}</span><span>${el.dataset.note}</span>`;
});
const play = () => {
  if (reduce) return;
  document.querySelectorAll('.ds-ease').forEach((el) => {
    const dot = el.querySelector('.ds-ease__dot'), track = el.querySelector('.ds-ease__track');
    const name = el.querySelector('b').textContent;
    dot.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${track.clientWidth - dot.offsetWidth}px)` }],
      { duration: parseFloat(tok('--dur-4')), easing: tok(name), fill: 'forwards' });
  });
};
document.querySelector('[data-replay]')?.addEventListener('click', play);
new IntersectionObserver((es, io) => { if (es.some((e) => e.isIntersecting)) { play(); io.disconnect(); } }, { threshold: 0.4 })
  .observe(document.querySelector('[data-motion]'));
