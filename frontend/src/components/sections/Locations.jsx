import React, { useEffect, useMemo, useState } from "react";
import SectionHeading from "../ui/SectionHeading";
import PhilippineMap from "../map/PhilippineMap";
import LocationCard from "../map/LocationCard";
import LocationList from "../map/LocationList";
import { clusterLocations } from "../map/locationUtils";
import { useReveal, useCountUp } from "../../hooks/useReveal";
import "../map/locations.css";

function Headline({ value, label, active }) {
  const n = useCountUp(value, active);
  return (
    <div className="rounded-xl border border-white/70 bg-white/60 px-5 py-3 shadow-sm backdrop-blur transition hover:-translate-y-1">
      <div className="text-3xl font-semibold text-brand-navy">{n}</div>
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}

const seg = (on) =>
  `relative rounded-full px-5 py-2 text-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green active:scale-95 ${on ? "bg-gradient-to-r from-[#2350d0] to-[#1a3594] text-white shadow-lg" : "text-slate-600 hover:text-brand-navy"}`;

export default function Locations({ locations, services }) {
  const [island, setIsland] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [gridRef, gridVisible] = useReveal();

  const filtered = useMemo(
    () => locations.filter((l) => !island || l.island === island),
    [locations, island]
  );
  const serviceNames = useMemo(() => Object.fromEntries(services.map((s) => [s.slug, s.name])), [services]);
  const islands = useMemo(() => [...new Set(locations.map((l) => l.island).filter(Boolean))], [locations]);
  const cityCount = useMemo(() => clusterLocations(locations).length, [locations]);

  useEffect(() => {
    if (!filtered.find((l) => l.id === selectedId)) setSelectedId(filtered[0]?.id ?? null);
  }, [filtered, selectedId]);

  const index = filtered.findIndex((l) => l.id === selectedId);
  const step = (d) => filtered.length && setSelectedId(filtered[(index + d + filtered.length) % filtered.length].id);

  const [startX, setStartX] = useState(null);
  const onTouchEnd = (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    setStartX(null);
  };

  return (
    <section id="locations" className="loc-section relative overflow-hidden py-24">
      <div className="loc-dots pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="loc-orb pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#2350d0]/10 blur-3xl" aria-hidden="true" />
      <div className="loc-orb pointer-events-none absolute -left-24 bottom-10 h-80 w-80 rounded-full bg-[#3f9a24]/10 blur-3xl" style={{ animationDelay: "-6s" }} aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow="Nationwide coverage" title="Our warehouses across the Philippines"
            intro="From Luzon to Mindanao, our warehouses keep your cargo moving. Pick an island group, then select a pin or browse the list." />
          <div className="mb-10 flex flex-none gap-3">
            <Headline value={locations.length} label="Warehouses" active={gridVisible} />
            <Headline value={cityCount} label="Cities" active={gridVisible} />
            <Headline value={islands.length} label="Island groups" active={gridVisible} />
          </div>
        </div>

        <div className="inline-flex flex-wrap gap-1 rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm backdrop-blur" role="group" aria-label="Filter by island group">
          <button onClick={() => setIsland("")} aria-pressed={island === ""} className={seg(island === "")}>All islands</button>
          {islands.map((i) => (
            <button key={i} onClick={() => setIsland(i)} aria-pressed={island === i} className={seg(island === i)}>
              {i}<span className={`ml-2 rounded-full px-1.5 text-xs ${island === i ? "bg-white/25" : "bg-slate-100 text-slate-500"}`}>{locations.filter((l) => l.island === i).length}</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-8 text-slate-600">No warehouses match this filter. Choose another option or view all warehouses.</p>
        ) : (
          <div ref={gridRef} className={`reveal mt-8 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[minmax(0,3.6fr)_minmax(0,5fr)_minmax(0,6.4fr)] ${gridVisible ? "visible" : ""}`}>
            {/* three aligned cards: vertical warehouse list | map | details */}
            <LocationList locations={filtered} selectedId={selectedId} onSelect={setSelectedId} />
            <PhilippineMap locations={filtered} selectedId={selectedId} onSelect={setSelectedId} />
            <div className="space-y-4 lg:col-span-2 xl:col-span-1">
              <div onTouchStart={(e) => setStartX(e.touches[0].clientX)} onTouchEnd={onTouchEnd}
                onKeyDown={(e) => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); }}
                tabIndex={0} aria-label="Selected warehouse. Use left and right arrow keys or swipe to change.">
                <LocationCard location={filtered[index]} allLocations={locations} serviceNames={serviceNames} onSelect={setSelectedId} />
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <button onClick={() => step(-1)} className="rounded-full border bg-white px-4 py-1.5 transition hover:-translate-x-0.5 hover:shadow active:scale-95" aria-label="Previous warehouse">&larr; Prev</button>
                <span className="font-mono">{String(index + 1).padStart(2, "0")} / {String(filtered.length).padStart(2, "0")}</span>
                <button onClick={() => step(1)} className="rounded-full border bg-white px-4 py-1.5 transition hover:translate-x-0.5 hover:shadow active:scale-95" aria-label="Next warehouse">Next &rarr;</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}