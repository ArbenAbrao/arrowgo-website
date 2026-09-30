// SAMPLE CONTENT - the Arrowgo website has no published news yet, so these are placeholder articles
// written from the company's own topics (cargo liability, scalability, cold chain, hubs, people).
// Replace titles, dates and text with your real posts. Body: plain strings; a string starting with "## " is a heading.
// `image` uses the pictures already in frontend/public/. Use null to show the logo placeholder.
export const articles = [
  {
    slug: "cargo-liability-when-you-outsource",
    title: "Why cargo liability matters when you outsource your logistics",
    category: "Insights",
    date: "2026-09-22",
    readTime: "3 min read",
    image: "/3pl.png",
    excerpt: "Handing your goods to a partner should never mean carrying the risk alone. Here is what to look for.",
    body: [
      "When you outsource storage or transport, the biggest question is simple: who is responsible if something goes wrong? Too often the answer is buried in the fine print.",
      "## Responsibility should start at handover",
      "At Arrowgo, we assume liability for your cargo as soon as it is turned over to us. From that moment, the goods are our responsibility, which lets you plan with confidence instead of worrying about the gaps between handoffs.",
      "## What to ask any logistics partner",
      "Ask exactly when liability begins and ends, how incidents are reported, and how quickly you will hear from someone. A partner who can answer these clearly is usually a partner who has thought about them carefully.",
    ],
  },
  {
    slug: "scale-logistics-without-fixed-costs",
    title: "Scale your logistics up or down without the fixed costs",
    category: "Insights",
    date: "2026-09-15",
    readTime: "4 min read",
    image: "/supply-chain.png",
    excerpt: "Demand is never flat. Flexible capacity lets you follow it day by day instead of building for the peak.",
    body: [
      "Owning warehouses, vehicles and equipment ties up capital and leaves you paying for capacity you do not always use. For many businesses, flexibility is worth more than ownership.",
      "## No initial capital",
      "With Arrowgo, we provide the equipment and resources needed to move and store your cargo. That reduces both the upfront capital you need and your ongoing operational costs.",
      "## Trim or grow, day by day",
      "You can increase or reduce your capacity as your volumes change, without worrying about the logistics behind it. Our team handles the planning so your team can stay focused on selling and growing.",
    ],
  },
  {
    slug: "cold-chain-basics",
    title: "Cold chain basics: keeping perishables in range from pickup to delivery",
    category: "Cold Chain",
    date: "2026-09-08",
    readTime: "4 min read",
    image: "/cold-chain.png",
    excerpt: "A cold chain is only as strong as its weakest handoff. A quick guide to the points that matter most.",
    body: [
      "Perishable and temperature-sensitive goods need a consistent range at every step, not just in storage. A single warm handoff can undo careful work elsewhere.",
      "## Think in legs, not facilities",
      "Map every leg: pickup, storage, loading, transport and final delivery. Each one needs the right equipment, trained people and a clear owner responsible for the temperature.",
      "## Monitor and document",
      "Regular monitoring and simple records make it easier to spot issues early and to show customers that their goods stayed within range. Our cold chain and temperature-controlled solutions are built around this end-to-end view.",
    ],
  },
  {
    slug: "lcl-collection-hubs-for-smaller-shippers",
    title: "How LCL collection hubs help smaller shippers",
    category: "Logistics",
    date: "2026-08-28",
    readTime: "3 min read",
    image: "/lcl.png",
    excerpt: "You do not need a full container to ship well. Consolidation makes smaller loads practical and affordable.",
    body: [
      "Not every shipment fills a container. Less-than-container-load (LCL) shipping lets several smaller loads share the same container, so you pay for the space you actually use.",
      "## Where hubs come in",
      "Collection hubs gather smaller loads, sort them and consolidate them into a single movement. That saves you from building volume before you can ship and keeps your inventory moving.",
      "## Good fit for growing businesses",
      "If your volumes are still growing or vary by season, LCL keeps shipping flexible. Ask us which of our hubs is closest to your suppliers and customers.",
    ],
  },
  {
    slug: "our-hubs-from-luzon-to-mindanao",
    title: "Our hubs from Luzon to Mindanao: one connected network",
    category: "Company News",
    date: "2026-08-19",
    readTime: "2 min read",
    image: "/transporting.png",
    excerpt: "Marilao, Taguig, Cebu, Palawan, Davao and Bacolod: how our hubs work together across the country.",
    body: [
      "Arrowgo operates hubs in Marilao, Taguig, Cebu, Palawan, Davao and Bacolod, giving customers a connected footprint across Luzon, Visayas and Mindanao.",
      "## One network, many entry points",
      "Each hub serves its local market while staying linked to the rest of the network, so cargo can move between regions without starting over at every stop.",
      "## Find the hub near you",
      "Use the interactive map on our homepage to see which services each hub offers and how to reach them.",
    ],
  },
  {
    slug: "investing-in-our-people",
    title: "Investing in our people: workforce development at Arrowgo",
    category: "Company News",
    date: "2026-08-05",
    readTime: "3 min read",
    image: "/warehousing.png",
    excerpt: "Better service starts with a better team. Why we treat workforce development as the heart of improvement.",
    body: [
      "Arrowgo believes in continuous improvement, in both our resources and our services. Our workforce is at the heart of that, because great logistics is delivered by people.",
      "## Accountability and standards",
      "We encourage self-discipline and make clear that every employee owns the standards of conduct and performance, aligned with our vision, mission and values.",
      "## Growing together",
      "By investing in training and development, we make sure our team is ready for the changing needs of our clients, and that we can keep producing work we are proud of.",
    ],
  },
];

export const sortedArticles = [...articles].sort((a, b) => b.date.localeCompare(a.date));
export const categories = [...new Set(articles.map((a) => a.category))];

export const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });