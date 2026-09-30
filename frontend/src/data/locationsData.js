// Sample data - replace services/slugs with your real ones.
export const services = [
  { slug: "warehousing", name: "Warehousing" },
  { slug: "freight", name: "Freight Forwarding" },
  { slug: "last-mile", name: "Last-Mile Delivery" },
  { slug: "cold-chain", name: "Cold Chain" },
];

export const locations = [
  { id: "marilao", name: "Marilao", region: "Luzon", address: "Marilao, Bulacan", lat: 14.7581, lng: 120.9483, labelSide: "left",
    type: "Distribution Hub", established: 2015, sqm: 18000, staff: 240, hours: "Mon-Sat, 6:00 AM - 10:00 PM",
    blurb: "Our northern gateway to Central and North Luzon, minutes from NLEX.",
    facilities: ["Bulk warehouse", "Cross-dock", "Truck bays"], services: ["warehousing", "freight", "last-mile"] },
  { id: "taguig", name: "Taguig", region: "Luzon", address: "Taguig, Metro Manila", lat: 14.5176, lng: 121.0509, labelSide: "right",
    type: "Metro Fulfillment Center", established: 2018, sqm: 9500, staff: 160, hours: "Daily, 24 hours",
    blurb: "Same-day fulfillment for the Metro Manila market.",
    facilities: ["Pick & pack floor", "Returns center", "Sorting line"], services: ["warehousing", "last-mile", "cold-chain"] },
  { id: "cebu", name: "Cebu", region: "Visayas", address: "Metro Cebu", lat: 10.3157, lng: 123.8854, labelSide: "right",
    type: "Regional Hub", established: 2017, sqm: 12000, staff: 130, hours: "Mon-Sat, 6:00 AM - 9:00 PM",
    blurb: "The connecting point for Visayas inter-island shipping.",
    facilities: ["Port access", "Cross-dock", "Container yard"], services: ["warehousing", "freight", "last-mile"] },
  { id: "palawan", name: "Palawan", region: "MIMAROPA", address: "Puerto Princesa City", lat: 9.7392, lng: 118.7353, labelSide: "left",
    type: "Island Gateway", established: 2021, sqm: 3500, staff: 45, hours: "Mon-Sat, 7:00 AM - 6:00 PM",
    blurb: "Reliable service to the Philippines' last frontier.",
    facilities: ["Airport-side depot", "Small-parcel sorting"], services: ["freight", "last-mile"] },
  { id: "davao", name: "Davao", region: "Mindanao", address: "Davao City", lat: 7.1907, lng: 125.4553, labelSide: "right",
    type: "Mindanao Hub", established: 2016, sqm: 14000, staff: 150, hours: "Mon-Sat, 6:00 AM - 9:00 PM",
    blurb: "Anchor hub for Mindanao distribution.",
    facilities: ["Bulk warehouse", "Cold storage", "Truck bays"], services: ["warehousing", "freight", "cold-chain", "last-mile"] },
  { id: "bacolod", name: "Bacolod", region: "Visayas", address: "Bacolod City, Negros Occidental", lat: 10.6765, lng: 122.9509, labelSide: "left",
    type: "Regional Hub", established: 2019, sqm: 7000, staff: 85, hours: "Mon-Sat, 6:00 AM - 8:00 PM",
    blurb: "Serving Western Visayas and the sugar-belt economy.",
    facilities: ["Warehouse", "Cross-dock"], services: ["warehousing", "last-mile", "freight"] },
];