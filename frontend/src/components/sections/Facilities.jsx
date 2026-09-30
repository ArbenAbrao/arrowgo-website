import React, { useRef } from "react";
import SectionHeading from "../ui/SectionHeading";
import { useReveal } from "../../hooks/useReveal";
import "../map/locations.css";
import "../map/facilities.css";

// Logo shown inside photo placeholders. Put logo2.png in frontend/public/ (or change this path).
const LOGO = "/logo2.png";

// Add `image: "/photos/warehouse.jpg"` (from /public) to any item and the photo replaces the placeholder.
const items = [
  { id: "01", label: "Warehouse", desc: "Secure, organized storage for your cargo.", tags: ["Racking", "Cross-dock", "Inventory control"], icon: "M3 21V9l9-6 9 6v12M9 21v-7h6v7", image: null },
  { id: "02", label: "Cold room", desc: "Temperature-controlled storage for sensitive goods.", tags: ["Chilled", "Monitored", "Cold chain"], icon: "M12 2v20M4.900 7l14.200 10M4.900 17L19.100 7M9 3l3 2 3-2M9 21l3-2 3 2", image: null },
  { id: "03", label: "Collection hub", desc: "Drop-off, sorting and consolidation close to you.", tags: ["Sorting", "Consolidation", "Pick-up"], icon: "M12 22s7-6.500 7-12a7 7 0 10-14 0c0 5.500 7 12 7 12zm0-9a3 3 0 100-6 3 3 0 000 6z", image: null },
  { id: "04", label: "Transport", desc: "Fleet and equipment to move cargo across the country.", tags: ["Fleet", "Nationwide", "Tracking"], icon: "M1 6h13v10H1zM14 10h4l3 3v3h-7M6 19a2 2 0 100-4 2 2 0 000 4zM17 19a2 2 0 100-4 2 2 0 000 4z", image: null },
];

const MARQUEE = ["Warehouse", "Cold room", "Collection hub", "Transport", "Nationwide network", "Scalable capacity"];

function Icon({ d, className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function FacilityCard({ item, index }) {
  const ref = useRef(null);
  const [revealRef, visible] = useReveal(0.1);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(px - 0.5) * 10}deg`);
    el.style.setProperty("--rx", `${(0.5 - py) * 10}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div ref={revealRef} style={{ transitionDelay: `${index * 120}ms` }} className={`reveal ${visible ? "visible" : ""}`}>
      <figure ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
        className="fac-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
        {/* Photo area */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#1a3594] via-[#132a75] to-[#0a1640]">
          {item.image ? (
            <img src={item.image} alt={`${item.label} facility`} loading="lazy" className="fac-img h-full w-full object-cover" />
          ) : (
            <>
              <div className="fac-grid-bg absolute inset-0 opacity-60" />
              <img src={LOGO} alt="" aria-hidden="true" onError={(e) => (e.currentTarget.style.display = "none")}
                className="fac-logo absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 object-contain opacity-30 transition-opacity duration-500 group-hover:opacity-70 md:h-28 md:w-28" />
              <span className="absolute bottom-3 right-3 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-wider text-white/70">
                Photo coming soon
              </span>
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1640]/90 via-transparent to-transparent" />
          <span className="absolute left-4 top-3 font-mono text-4xl font-bold text-white/15 transition-colors group-hover:text-emerald-300/50">{item.id}</span>
          <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-emerald-300 ring-1 ring-white/20 backdrop-blur transition-all duration-300 group-hover:bg-brand-green group-hover:text-white group-hover:rotate-12">
            <Icon d={item.icon} />
          </span>
        </div>

        {/* Text */}
        <figcaption className="relative p-5 text-white">
          <h3 className="text-xl">{item.label}</h3>
          <p className="mt-1.5 text-sm text-slate-300">{item.desc}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <li key={t} className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] text-slate-200 transition-colors group-hover:border-emerald-300/50">{t}</li>
            ))}
          </ul>
          <span className="mt-4 block h-0.5 w-0 rounded bg-brand-green transition-all duration-500 group-hover:w-full" />
        </figcaption>

        <div className="fac-spot pointer-events-none absolute inset-0" />
        <div className="fac-shine" />
      </figure>
    </div>
  );
}

export default function Facilities() {
  return (
    <section id="facilities" className="fac-section relative overflow-hidden py-24">
      {/* ambient background */}
      <div className="fac-orb pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-brand-blue/30 blur-3xl" aria-hidden="true" />
      <div className="fac-orb pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-brand-green/20 blur-3xl" style={{ animationDelay: "-6s" }} aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading light eyebrow="Built for your cargo" title="Facilities"
          intro="The warehouses, cold rooms, hubs and fleet behind every Arrowgo solution." />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => <FacilityCard key={item.id} item={item} index={i} />)}
        </div>
      </div>

      {/* scrolling ribbon */}
      <div className="relative mt-20 overflow-hidden border-y border-white/10 py-4" aria-hidden="true">
        <div className="fac-marquee flex w-max gap-12 whitespace-nowrap text-sm uppercase tracking-[.3em] text-white/40">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="flex items-center gap-12">{m}<span className="text-emerald-300/60">&#9670;</span></span>
          ))}
        </div>
      </div>
    </section>
  );
}