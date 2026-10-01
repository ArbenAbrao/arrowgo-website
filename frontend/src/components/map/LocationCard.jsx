import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCountUp } from "../../hooks/useReveal";
import { clusterLocations, km, mapsDirections, mapsEmbed, mapsSearch } from "./locationUtils";

const PIN = "M12 22s7-6.500 7-12a7 7 0 10-14 0c0 5.500 7 12 7 12zm0-9a3 3 0 100-6 3 3 0 000 6z";

function Icon({ d, className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function Tile({ value, label, suffix = "", text }) {
  const n = useCountUp(typeof value === "number" ? value : 0);
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-center transition hover:-translate-y-0.5 hover:bg-[#dbe7ff]/50">
      <div className="text-lg font-semibold text-brand-navy">{text ?? <>{n.toLocaleString()}{suffix}</>}</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}

export default function LocationCard({ location, allLocations = [], serviceNames = {}, onSelect = () => {} }) {
  const [preview, setPreview] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setPreview(false); setLoaded(false); }, [location?.id]);
  const info = useMemo(() => {
    if (!location) return null;
    const clusters = clusterLocations(allLocations);
    const mine = clusters.find((c) => c.members.some((m) => m.id === location.id));
    const others = clusters
      .filter((c) => c !== mine)
      .map((c) => ({ id: c.members[0].id, area: c.area, km: Math.max(10, Math.round(km(mine, c) / 10) * 10) }))
      .sort((a, b) => a.km - b.km);
    return { siblings: mine ? mine.members : [location], others, max: Math.max(1, ...others.map((o) => o.km)) };
  }, [location, allLocations]);

  if (!location) return null;
  const idx = allLocations.findIndex((l) => l.id === location.id);
  const { name, region, island, address, type, blurb, sqm, hours, phone, email, contact, facilities = [], highlights = [], services = [] } = location;
  const details = [
    ["Business hours", hours], ["Floor area", sqm ? `${Number(sqm).toLocaleString()} sq. m` : null],
    ["Contact", contact], ["Phone", phone], ["Email", email],
  ].filter(([, v]) => v);

  return (
    // key replays the entrance animation and count-ups whenever the selection changes
    <article key={location.id} className="card-in loc-card relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <span className="pointer-events-none absolute -right-2 -top-4 select-none font-mono text-8xl font-bold text-[#2350d0]/[.06]">
        {String(idx + 1).padStart(2, "0")}
      </span>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2350d0] via-[#3f9a24] to-[#2350d0]" />

      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-green/10 px-3 py-0.5 text-xs font-semibold text-brand-green">{type || "Warehouse"}</span>
          <span className="rounded-full bg-brand-mist px-3 py-0.5 text-xs font-medium text-brand-navy">{island}</span>
          {allLocations.length > 0 && <span className="text-xs text-slate-400">Warehouse {idx + 1} of {allLocations.length}</span>}
        </div>
        <h3 className="mt-3 text-2xl text-brand-navy">{name}</h3>
        <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-500"><Icon d={PIN} className="mt-0.5 h-4 w-4 flex-none text-brand-green" />{address}</p>
        <p className="mt-0.5 pl-[22px] text-xs text-slate-400">{region}</p>

        <p className="mt-4 text-slate-600">{blurb || `One of Arrowgo's ${allLocations.length || ""} warehouses across the Philippines, serving ${location.province || region}.`}</p>

        {/* sibling warehouses sharing this pin */}
        {info.siblings.length > 1 && (
          <div className="mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-slate-400">{info.siblings.length} warehouses in {location.area}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {info.siblings.map((s, i) => (
                <button key={s.id} onClick={() => onSelect(s.id)} aria-pressed={s.id === location.id} style={{ animationDelay: `${i * 80}ms` }}
                  className={`tab-in rounded-full border px-3 py-1 text-sm transition active:scale-95 ${s.id === location.id ? "border-brand-navy bg-brand-navy text-white shadow" : "border-slate-300 text-slate-600 hover:border-brand-blue"}`}>
                  {s.short || s.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 grid grid-cols-3 gap-2">
          <Tile value={services.length} label="Services" />
          {info.others[0] ? <Tile value={info.others[0].km} suffix=" km" label="Nearest hub" /> : <Tile text="-" label="Nearest hub" />}
          <Tile text={island} label="Island group" />
        </div>

        {/* services */}
        {services.length > 0 && (
          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-slate-400">Services</p>
            <ul className="mt-2 flex flex-wrap gap-2 text-sm">
              {services.map((slug) => (
                <li key={slug}>
                  <Link className="inline-block rounded-full border border-brand-blue/30 px-3 py-1 text-brand-blue transition hover:-translate-y-0.5 hover:bg-brand-blue hover:text-white hover:shadow" to={`/solutions/${slug}`}>
                    {serviceNames[slug] || slug}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {facilities.length > 0 && (
          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-slate-400">Facilities</p>
            <ul className="mt-2 flex flex-wrap gap-2">{facilities.map((f) => <li key={f} className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs text-slate-600">{f}</li>)}</ul>
          </div>
        )}

        {highlights.length > 0 && (
          <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
            {highlights.map((h) => (
              <li key={h} className="flex gap-2"><Icon d="M5 13l4 4L19 7" className="mt-0.5 h-4 w-4 flex-none text-brand-green" />{h}</li>
            ))}
          </ul>
        )}

        {details.length > 0 && (
          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {details.map(([k, v]) => (
              <div key={k}><dt className="text-[11px] uppercase tracking-wider text-slate-400">{k}</dt><dd className="text-slate-700">{v}</dd></div>
            ))}
          </dl>
        )}

        {/* distances to the other hubs */}
        {info.others.length > 0 && (
          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-slate-400">Distance to our other hubs <span className="normal-case tracking-normal">(approx. straight line)</span></p>
            <ul className="mt-3 space-y-2">
              {info.others.map((o, i) => (
                <li key={o.id}>
                  <button onClick={() => onSelect(o.id)} className="group w-full text-left">
                    <span className="flex items-center justify-between text-sm">
                      <span className="text-slate-700 transition group-hover:text-brand-blue">{o.area}</span>
                      <span className="font-mono text-xs text-slate-500">{o.km.toLocaleString()} km</span>
                    </span>
                    <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <span className="bar-grow block h-full rounded-full bg-gradient-to-r from-[#2350d0] to-[#3f9a24]"
                        style={{ width: `${(o.km / info.max) * 100}%`, animationDelay: `${300 + i * 90}ms` }} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* pinpoint preview (Google Maps embed, loaded only when opened) */}
        <button onClick={() => { setPreview(!preview); setLoaded(true); }} aria-expanded={preview}
          className="mt-6 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-brand-navy transition hover:border-brand-blue hover:bg-white">
          <span className="flex items-center gap-2"><Icon d={PIN} className="h-4 w-4 text-brand-green" /> Pinpoint on the map</span>
          <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform duration-300 ${preview ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
        </button>
        <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${preview ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="overflow-hidden">
            {loaded && (
              <iframe title={`Map of ${name}`} src={mapsEmbed(location)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen
                className="mt-3 h-64 w-full rounded-xl border border-slate-200" />
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <a href={mapsDirections(location)} target="_blank" rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2350d0] to-[#1a3594] px-5 py-2 text-sm font-medium text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95">
            Get directions <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
          </a>
          <a href={mapsSearch(location)} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-brand-navy px-5 py-2 text-sm font-medium text-brand-navy transition hover:bg-brand-navy hover:text-white active:scale-95">
            <Icon d={PIN} className="h-4 w-4" /> View on Google Maps
          </a>
        </div>
      </div>
    </article>
  );
}