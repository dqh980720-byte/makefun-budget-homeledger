// HomeLedger — charts.
// Small hand-rolled SVG charts: a donut for the spending split and
// horizontal budget bars (spent vs budget per category). No library, no
// network, nothing fetched at run time.

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function money(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

// Donut chart. slices: [{label, value, color}]. Centre shows the total.
export function donutChart(slices, totalLabel) {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const r = 100;
  const inner = 62;
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  let angle = -Math.PI / 2;
  const paths = slices
    .filter((s) => s.value > 0)
    .map((s) => {
      const frac = s.value / total;
      const a0 = angle;
      const a1 = angle + frac * Math.PI * 2;
      angle = a1;
      const large = frac > 0.5 ? 1 : 0;
      const x0 = cx + r * Math.cos(a0);
      const y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1);
      const y1 = cy + r * Math.sin(a1);
      const xi1 = cx + inner * Math.cos(a1);
      const yi1 = cy + inner * Math.sin(a1);
      const xi0 = cx + inner * Math.cos(a0);
      const yi0 = cy + inner * Math.sin(a0);
      return `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${s.color}"><title>${esc(s.label)}: ${money(s.value)}</title></path>`;
    })
    .join('');
  const legend = slices
    .map((s) => `<div class="legend-row"><span class="swatch" style="background:${s.color}"></span>${esc(s.label)} — <strong>${money(s.value)}</strong></div>`)
    .join('');
  return `<div class="donut-wrap"><svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending split donut chart" class="donut">${paths}` +
    `<text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="22" font-weight="800" fill="#1f2a44">${money(total)}</text>` +
    `<text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="12" fill="#5a6478">${esc(totalLabel)}</text></svg>` +
    `<div class="legend">${legend}</div></div>`;
}

// Budget bars: for each category, spent vs budget with an over-budget flag.
export function budgetBars(rows) {
  const width = 640;
  const rowH = 52;
  const height = rows.length * rowH + 8;
  const padL = 150;
  const padR = 110;
  const max = Math.max(...rows.map((r) => Math.max(r.spent, r.budget)), 1);
  const bars = rows
    .map((r, i) => {
      const y = 6 + i * rowH;
      const bw = ((width - padL - padR) * r.budget) / max;
      const sw = ((width - padL - padR) * r.spent) / max;
      const over = r.spent > r.budget;
      return `<text x="${padL - 10}" y="${y + 16}" text-anchor="end" font-size="13" font-weight="700" fill="#1f2a44">${esc(r.label)}</text>` +
        `<rect x="${padL}" y="${y}" width="${bw.toFixed(1)}" height="18" rx="4" fill="#dfe5ef"/>` +
        `<rect x="${padL}" y="${y}" width="${Math.max(sw, 2).toFixed(1)}" height="18" rx="4" fill="${over ? '#c2402a' : r.color}"/>` +
        `<text x="${padL + Math.max(bw, sw) + 8}" y="${y + 15}" font-size="12" fill="#1f2a44">${money(r.spent)} of ${money(r.budget)}${over ? ' — over' : ''}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Spent versus budget by category" class="chart">${bars}</svg>`;
}
