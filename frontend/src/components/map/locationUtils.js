const rad = (d) => (d * Math.PI) / 180;

// Straight-line (great-circle) distance in km between two {lat, lng}
export const km = (a, b) => {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};

// Warehouses within ~12 km share one pin (e.g. Canduman + Maguikay in Mandaue City)
export function clusterLocations(list, thresholdKm = 12) {
  const out = [];
  list.forEach((l) => {
    const c = out.find((x) => km(x, l) < thresholdKm);
    if (c) {
      c.members.push(l);
      c.lat = c.members.reduce((s, m) => s + m.lat, 0) / c.members.length;
      c.lng = c.members.reduce((s, m) => s + m.lng, 0) / c.members.length;
    } else {
      out.push({ id: l.id, lat: l.lat, lng: l.lng, members: [l] });
    }
  });
  return out.map((c) => ({ ...c, area: c.members[0].area || c.members[0].short || c.members[0].name }));
}

const q = (l) => encodeURIComponent(`${l.address}, Philippines`);
const hasPin = (l) => Boolean(l.mapUrl);

// "View on Google Maps": the company's own pin when we have it, otherwise an address search
export const mapsSearch = (l) => l.mapUrl || `https://www.google.com/maps/search/?api=1&query=${q(l)}`;
// "Get directions": exact coordinates when pinned, otherwise the address
export const mapsDirections = (l) =>
  `https://www.google.com/maps/dir/?api=1&destination=${hasPin(l) ? `${l.lat},${l.lng}` : q(l)}`;
// Embeddable preview (no API key needed)
export const mapsEmbed = (l) =>
  `https://maps.google.com/maps?q=${hasPin(l) ? `${l.lat},${l.lng}` : q(l)}&z=17&output=embed`;