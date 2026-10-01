import React, { useRef } from "react";
import SectionHeading from "../ui/SectionHeading";
import { useReveal } from "../../hooks/useReveal";
import "../map/locations.css";
import "../map/facilities.css";

// Pictures live in frontend/public/ (the same ones used by Solutions and News).
// Edit `image` to swap a photo. `span` sets the card width on large screens (bento layout).
const items = [
  { id: "01", label: "Warehouse", desc: "Secure, organized storage for your cargo.", tags: ["Racking", "Cross-dock", "Inventory control"], image: "/warehousing.png", span: "lg:col-span-7",
    icon: "M3 21V9l9-6 9 6v12M9 21v-7h6v7" },
  { id: "02", label: "Cold room", desc: "Temperature-controlled storage for sensitive goods.", tags: ["Chilled", "Monitored", "Cold chain"], image: "/cold-chain.png", span: "lg:col-span-5",
    icon: "M12 2v20M4.900 7l14.200 10M4.900 17L19.100 7M9 3l3 2 3-2M9 21l3-2 3 2" },
  { id: "03", label: "Collection hub", desc: "Drop-off, sorting and consolidation close to you.", tags: ["Sorting", "Consolidation", "Pick-up"], image: "/lcl.png", span: "lg:col-span-5",
    icon: "M12 22s7-6.500 7-12a7 7 0 10-14 0c0 5.500 7 12 7 12zm0-9a3 3 0 100-6 3 3 0 000 6z" },
  { id: "04", label: "Transport", desc: "Fleet and equipment to move cargo across the country.", tags: ["Fleet", "Nationwide", "Tracking"], image: "/transporting.png", span: "lg:col-span-7",
    icon: "M1 6h13v10H1zM14 10h4l3 3v3h-7M6 19a2 2 0 100-4 2 2 0 000 4zM17 19a2 2 0 100-4 2 2 0 000 4z" },
];

// Photo strip under the cards
const GALLERY = [
  { label: "Warehousing", image: "/warehousing.png" },
  { label: "Third-party logistics", image: "/3pl.png" },
  { label: "Supply chain", image: "/supply-chain.png" },
  { label: "Cold chain", image: "/cold-chain.png" },
  { label: "Temperature-controlled", image: "/temperature-controlled.png" },
  { label: "Transport", image: "/transporting.png" },
  { label: "LCL hubs", image: "/lcl.png" },
  { label: "On-demand", image: "/on-demand-bookings.png" },
];

function Icon({ d, className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const hide = (e) => { e.currentTarget.style.display = "none"; };

function FacilityCard({ item, index }) {
  const ref = useRef(null);
  const [revealRef, visible] = useReveal(0.1);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(px - 0.5) * 5}deg`);
    el.style.setProperty("--rx", `${(0.5 - py) * 5}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <div ref={revealRef} style={{ transitionDelay: `${(index % 2) * 140}ms` }} className={`reveal ${item.span} ${visible ? "visible" : ""}`}>
      <figure ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
        className="fac-card group relative h-[380px] overflow-hidden rounded-3xl border border-white bg-gradient-to-br from-[#2350d0] to-[#1a3594] shadow-[0_24px_50px_-26px_rgba(26,53,148,.5)] md:h-[430px]">
        <img src={item.image} alt={`${item.label} at Arrowgo`} loading="lazy" onError={hide} className="fac-img absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1640]/45 via-transparent to-[#0a1640]/10" />

        <span className="absolute left-6 top-5 font-mono text-5xl font-bold text-white/70 drop-shadow transition-colors duration-300 group-hover:text-white">{item.id}</span>
        <span className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-brand-blue shadow-lg ring-1 ring-white backdrop-blur transition-all duration-300 group-hover:rotate-12 group-hover:bg-brand-green group-hover:text-white">
          <Icon d={item.icon} />
        </span>

        <figcaption className="fac-panel absolute inset-x-4 bottom-4 rounded-2xl border border-white/80 bg-white/85 p-5 backdrop-blur-md">
          <h3 className="text-xl text-brand-navy">{item.label}</h3>
          <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <li key={t} className="rounded-full border border-[#b5caf5] bg-[#dbe7ff]/50 px-2.5 py-0.5 text-[11px] text-brand-navy transition-colors group-hover:border-brand-green/50 group-hover:bg-brand-green/10">{t}</li>
            ))}
          </ul>
          <span className="mt-4 block h-0.5 w-0 rounded bg-gradient-to-r from-[#2350d0] to-[#3f9a24] transition-all duration-500 group-hover:w-full" />
        </figcaption>

        <div className="fac-spot pointer-events-none absolute inset-0" />
        <div className="fac-shine" />
      </figure>
    </div>
  );
}

function Tile({ g, dup = false }) {
  return (
    <li aria-hidden={dup || undefined} className={`fac-tile ${dup ? "fac-dup" : ""} relative h-40 w-64 flex-none overflow-hidden rounded-2xl border border-white bg-gradient-to-br from-[#2350d0] to-[#1a3594] shadow-md`}>
      <img src={g.image} alt={dup ? "" : g.label} loading="lazy" onError={hide} draggable={false} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1640]/60 via-transparent to-transparent" />
      <span className="absolute bottom-3 left-3 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-brand-navy backdrop-blur">{g.label}</span>
    </li>
  );
}

export default function Facilities() {
  const [hRef, hVisible] = useReveal();
  return (
    <section id="facilities" className="fac-section relative overflow-hidden py-24">
      <div className="fac-dots pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="fac-orb pointer-events-none absolute -right-28 top-16 h-96 w-96 rounded-full bg-[#2350d0]/10 blur-3xl" aria-hidden="true" />
      <div className="fac-orb pointer-events-none absolute -left-24 bottom-24 h-80 w-80 rounded-full bg-[#3f9a24]/10 blur-3xl" style={{ animationDelay: "-6s" }} aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div ref={hRef} className={`reveal flex flex-col items-start justify-between gap-2 md:flex-row md:items-end ${hVisible ? "visible" : ""}`}>
          <SectionHeading eyebrow="Built for your cargo" title="Facilities"
            intro="The warehouses, cold rooms, hubs and fleet behind every Arrowgo solution." />
          <a href="#locations" className="group mb-10 inline-flex flex-none items-center rounded-full border border-brand-navy px-5 py-2 text-sm font-medium text-brand-navy transition hover:bg-brand-navy hover:text-white">
            See our warehouses <span className="ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
          {items.map((item, i) => <FacilityCard key={item.id} item={item} index={i} />)}
        </div>
      </div>

      {/* photo strip */}
      <div className="relative mt-20">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[.3em] text-slate-400">Across every step of the chain</p>
        <div className="fac-row fac-mask overflow-hidden py-3">
          <ul className="fac-track">
            {GALLERY.map((g) => <Tile key={g.label} g={g} />)}
            {GALLERY.map((g) => <Tile key={`d-${g.label}`} g={g} dup />)}
          </ul>
        </div>
      </div>
    </section>
  );
}