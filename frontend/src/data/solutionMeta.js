// Shared by Solutions.jsx and SolutionDetail.jsx.
// Pictures live in frontend/public/. A service can still override with `image: "/your-file.png"` in its data.
export const LOGO = "/LOGO2.png"; // matches the file name in public/ (case-sensitive on most hosts)

const box = "M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8";
export const ICONS = {
  warehousing: "M3 21V9l9-6 9 6v12M9 21v-7h6v7",
  "3pl": "M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M10 11a4 4 0 100-8 4 4 0 000 8zM21 21v-2a4 4 0 00-3-3.870M16 3.130a4 4 0 010 7.750",
  "supply-chain": "M10 13a5 5 0 007.070 0l3-3a5 5 0 00-7.070-7.070l-1 1M14 11a5 5 0 00-7.070 0l-3 3a5 5 0 007.070 7.070l1-1",
  "cold-chain": "M12 2v20M4.900 7l14.200 10M4.900 17L19.100 7M9 3l3 2 3-2M9 21l3-2 3 2",
  "temperature-controlled": "M14 14.760V3.500a2.500 2.500 0 00-5 0v11.260a4.500 4.500 0 105 0z",
  transport: "M1 6h13v10H1zM14 10h4l3 3v3h-7M6 19a2 2 0 100-4 2 2 0 000 4zM17 19a2 2 0 100-4 2 2 0 000 4z",
  "lcl-hubs": box,
  "on-demand": "M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2",
};
export const iconFor = (slug) => ICONS[slug] || box;

// Rotating palette taken from the globe / hero.
export const TONES = [
  "from-[#2350d0] via-[#1a3594] to-[#0a1640]",
  "from-[#1a3594] via-[#2350d0] to-[#3f9a24]",
  "from-[#0a1640] via-[#1a3594] to-[#2350d0]",
  "from-[#3f9a24] via-[#2350d0] to-[#1a3594]",
];

// Picture for each solution (files in frontend/public/)
export const IMAGES = {
  warehousing: "/warehousing.png",
  "3pl": "/3pl.png",
  "supply-chain": "/supply-chain.png",
  "cold-chain": "/cold-chain.png",
  "temperature-controlled": "/temperature-controlled.png",
  transport: "/transporting.png",
  "lcl-hubs": "/lcl.png",
  "on-demand": "/on-demand-bookings.png",
};
export const imageFor = (service) => service.image || IMAGES[service.slug] || null;