const geoResults = $input.all();
const originals = $('Load Pending Orders').all();

if (originals.length === 1 && originals[0].json._empty) {
  return [{
    json: {
      empty: true,
      markdown: '# Delivery Plan\n\nNo pending orders right now.'
    }
  }];
}

const enriched = originals.map((item, i) => {
  const order = item.json;
  const geoRaw = geoResults[i] ? geoResults[i].json : null;
  let lat = null;
  let lon = null;
  const result = Array.isArray(geoRaw) ? geoRaw[0] : geoRaw;
  if (result && result.lat) {
    lat = parseFloat(result.lat);
    lon = parseFloat(result.lon);
  }
  return { ...order, lat, lon, geocodeFailed: lat === null };
});

function haversine(a, b) {
  if (a.lat == null || b.lat == null) return Infinity;
  const R = 6371;
  const toRad = (d) => d * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function optimize(stops) {
  if (stops.length <= 1) return stops;
  const valid = stops.filter(s => s.lat != null);
  const invalid = stops.filter(s => s.lat == null);
  if (valid.length === 0) return stops;
  const route = [valid[0]];
  const remaining = valid.slice(1);
  while (remaining.length > 0) {
    const current = route[route.length - 1];
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const d = haversine(current, remaining[i]);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    route.push(remaining.splice(bestIdx, 1)[0]);
  }
  return [...route, ...invalid];
}

const saturday = optimize(enriched.filter(o => o.day === 'Saturday'));
const sunday = optimize(enriched.filter(o => o.day === 'Sunday'));

function formatDay(label, stops) {
  if (stops.length === 0) return `## ${label}\n\nNo deliveries planned.\n\n`;
  let total = 0;
  let unpaid = 0;
  let md = `## ${label} (${stops.length} ${stops.length === 1 ? 'stop' : 'stops'})\n\n`;
  stops.forEach((s, i) => {
    total += s.total;
    if (!s.paid) unpaid += s.total;
    md += `### Stop ${i + 1}: ${s.customer}\n`;
    md += `- Order ID: ${s.id}\n`;
    md += `- Phone: ${s.phone}\n`;
    md += `- Address: ${s.address}\n`;
    md += `- Items: ${s.items}\n`;
    md += `- Total: $${s.total.toFixed(2)} ${s.paid ? '[PAID]' : '[COLLECT ON DELIVERY]'}\n`;
    if (s.notes) md += `- Notes: ${s.notes}\n`;
    if (s.geocodeFailed) md += `- [WARN] Address could not be geocoded, placed at end of route\n`;
    md += '\n';
  });
  md += `**${label} totals:** $${total.toFixed(2)} revenue`;
  if (unpaid > 0) md += `, $${unpaid.toFixed(2)} to collect on route`;
  md += '\n\n';
  return md;
}

const planDate = new Date().toISOString().slice(0, 10);
const markdown =
  `# Delivery Plan (${planDate})\n\n` +
  `${enriched.length} total orders, ${saturday.length} Saturday, ${sunday.length} Sunday.\n\n` +
  formatDay('Saturday', saturday) +
  formatDay('Sunday', sunday) +
  `---\n\nRoutes optimized by nearest-neighbor on geocoded coordinates from Nominatim/OpenStreetMap.\n\nMark orders fulfilled in workflow static data once delivered.\n`;

return [{
  json: {
    planDate,
    markdown,
    saturday: {
      stops: saturday.length,
      revenue: saturday.reduce((s, o) => s + o.total, 0),
      toCollect: saturday.filter(o => !o.paid).reduce((s, o) => s + o.total, 0),
      orders: saturday
    },
    sunday: {
      stops: sunday.length,
      revenue: sunday.reduce((s, o) => s + o.total, 0),
      toCollect: sunday.filter(o => !o.paid).reduce((s, o) => s + o.total, 0),
      orders: sunday
    }
  }
}];
