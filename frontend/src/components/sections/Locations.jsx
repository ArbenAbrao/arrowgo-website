import React, { useEffect, useMemo, useState } from "react";
import SectionHeading from "../ui/SectionHeading";
import PhilippineMap from "../map/PhilippineMap";
import ServiceFilter from "../map/ServiceFilter";
import LocationCard from "../map/LocationCard";
import LocationList from "../map/LocationList";
import { useReveal, useCountUp } from "../../hooks/useReveal";
import "../map/locations.css";

function Headline({ value, label, active }) {
  const n = useCountUp(value, active);
  return (
    <div>
      <div className="text-3xl font-semibold text-brand-navy">{n}</div>
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}

export default function Locations({ locations, services }) {
  const [service, setService] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [gridRef, gridVisible] = useReveal();

  const filtered = useMemo(
    () => (service ? locations.filter((l) => l.services.includes(service)) : locations),
    [locations, service]
  );
  const serviceNames = useMemo(() => Object.fromEntries(services.map((s) => [s.slug, s.name])), [services]);
  const counts = useMemo(
    () => ({ "": locations.length, ...Object.fromEntries(services.map((s) => [s.slug, locations.filter((l) => l.services.includes(s.slug)).length])) }),
    [locations, services]
  );
  const regionCount = useMemo(() => new Set(locations.map((l) => l.region)).size, [locations]);

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
    <section id="locations" className="py-20 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Nationwide coverage" title="Our Philippine network"
          intro="From Luzon to Mindanao, our hubs keep your cargo moving. Filter by service, then select a marker or browse the list." />

        <div className="mb-8 flex gap-10">
          <Headline value={locations.length} label="Hubs" active={gridVisible} />
          <Headline value={regionCount} label="Regions" active={gridVisible} />
          <Headline value={services.length} label="Services" active={gridVisible} />
        </div>

        <ServiceFilter services={services} value={service} onChange={setService} counts={counts} />

        {filtered.length === 0 ? (
          <p className="mt-8 text-slate-600">No locations offer this service yet. Choose another service or view all locations.</p>
        ) : (
          <div ref={gridRef} className={`mt-8 grid gap-8 lg:grid-cols-[1fr_1fr] reveal ${gridVisible ? "visible" : ""}`}>
            <PhilippineMap locations={filtered} selectedId={selectedId} onSelect={setSelectedId} />
            <div className="space-y-4">
              <div onTouchStart={(e) => setStartX(e.touches[0].clientX)} onTouchEnd={onTouchEnd}
                onKeyDown={(e) => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); }}
                tabIndex={0} aria-label="Selected location. Use left and right arrow keys or swipe to change.">
                <LocationCard location={filtered[index]} serviceNames={serviceNames} />
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <button onClick={() => step(-1)} className="rounded-full border px-3 py-1 transition hover:bg-white hover:shadow active:scale-95" aria-label="Previous hub">Prev</button>
                <span>{index + 1} / {filtered.length}</span>
                <button onClick={() => step(1)} className="rounded-full border px-3 py-1 transition hover:bg-white hover:shadow active:scale-95" aria-label="Next hub">Next</button>
              </div>
              <LocationList locations={filtered} selectedId={selectedId} onSelect={setSelectedId} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}