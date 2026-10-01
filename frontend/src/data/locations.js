// Arrowgo warehouse directory.
// Coordinates and `mapUrl` come from the company's Google Maps pins. Puerto Princesa has no pin yet:
// add its link as `mapUrl` (and exact lat/lng) and the card will switch to the exact location automatically.
//
// TODO (confirm / fill in): `services` per warehouse. Optional detail fields are shown automatically when present:
//   sqm, hours, phone, email, contact, facilities: [..], highlights: [..], blurb: "..."
const services = ["warehousing", "3pl"]; // placeholder - edit per warehouse (add "cold-chain", "temperature-controlled", ...)

export const fallbackLocations = [
  {
    id: "marilao-mdc", name: "Marilao, Bulacan (MDC)", short: "Marilao", area: "Marilao",
    address: "Marilao, Bulacan", province: "Bulacan", region: "Central Luzon (Region III)", island: "Luzon",
    lat: 14.7697045, lng: 120.9554326, mapUrl: "https://maps.app.goo.gl/jQKnjrd14NTt1M8d9", labelSide: "left", type: "Warehouse", services, facilities: [],
  },
  {
    id: "taguig", name: "Taguig City", short: "Taguig", area: "Taguig",
    address: "Taguig City, Metro Manila", province: "Metro Manila", region: "National Capital Region", island: "Luzon",
    lat: 14.5392813, lng: 121.0894079, mapUrl: "https://maps.app.goo.gl/6jcqewqqLa7ZCFyp9", labelSide: "right", type: "Warehouse", services, facilities: [],
  },
  {
    id: "puerto-princesa", name: "Puerto Princesa, Palawan", short: "Puerto Princesa", area: "Puerto Princesa",
    address: "Puerto Princesa City, Palawan", province: "Palawan", region: "MIMAROPA (Region IV-B)", island: "Luzon",
    lat: 9.7392, lng: 118.7353, mapUrl: null, labelSide: "left", type: "Warehouse", services, facilities: [],
  },
  {
    id: "canduman-mandaue", name: "Canduman, Mandaue City, Cebu", short: "Canduman", area: "Mandaue, Cebu",
    address: "Canduman, Mandaue City, Cebu", province: "Cebu", region: "Central Visayas (Region VII)", island: "Visayas",
    lat: 10.3608979, lng: 123.9295332, mapUrl: "https://maps.app.goo.gl/mK3gdqZjjQeSLuGJ8", labelSide: "right", type: "Warehouse", services, facilities: [],
  },
  {
    id: "maguikay-mandaue", name: "Maguikay, Mandaue City, Cebu", short: "Maguikay", area: "Mandaue, Cebu",
    address: "Maguikay, Mandaue City, Cebu", province: "Cebu", region: "Central Visayas (Region VII)", island: "Visayas",
    lat: 10.3390797, lng: 123.9345721, mapUrl: "https://maps.app.goo.gl/z5QgfW7wPjqyQubj6", labelSide: "right", type: "Warehouse", services, facilities: [],
  },
  {
    id: "davao", name: "Davao City", short: "Davao", area: "Davao",
    address: "Davao City, Davao Region", province: "Davao del Sur", region: "Davao Region (Region XI)", island: "Mindanao",
    lat: 7.1190234, lng: 125.6329144, mapUrl: "https://maps.app.goo.gl/Rvgc1FRwTNopBbpg9", labelSide: "left", type: "Warehouse", services, facilities: [],
  },
];