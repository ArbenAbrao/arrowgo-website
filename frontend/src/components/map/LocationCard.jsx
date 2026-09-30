import React from "react";
import { Link } from "react-router-dom";
import { useCountUp } from "../../hooks/useReveal";

function Stat({ value, label, suffix = "" }) {
  const n = useCountUp(value);
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
      <div className="text-lg font-semibold text-brand-navy">{n.toLocaleString()}{suffix}</div>
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}

export default function LocationCard({ location, serviceNames }) {
  if (!location) return null;
  const { name, region, address, type, blurb, established, sqm, staff, hours, facilities, services } = location;
  return (
    // key forces the entrance animation and count-ups to replay on every selection
    <article key={location.id} className="card-in rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          {type && <span className="inline-block mb-2 rounded-full bg-brand-mist px-3 py-0.5 text-xs font-medium text-brand-navy">{type}</span>}
          <h3 className="text-2xl text-brand-navy">{name}</h3>
          <p className="text-sm text-slate-500">{region} - {address}</p>
        </div>
        {established && <span className="text-xs text-slate-400 whitespace-nowrap">Since {established}</span>}
      </div>

      {blurb && <p className="mt-3 text-slate-600">{blurb}</p>}

      {(sqm || staff) && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {sqm && <Stat value={sqm} label="Sq. meters" />}
          {staff && <Stat value={staff} label="Team members" />}
          <Stat value={services.length} label="Services" />
        </div>
      )}

      {hours && <p className="mt-4 text-sm"><span className="text-brand-navy">Hours:</span> {hours}</p>}
      <p className="mt-2 text-sm"><span className="text-brand-navy">Facilities:</span> {facilities.join(", ")}</p>

      <ul className="mt-4 flex flex-wrap gap-2 text-sm">
        {services.map((slug) => (
          <li key={slug}>
            <Link className="inline-block rounded-full border border-brand-blue/30 px-3 py-1 text-brand-blue transition hover:bg-brand-blue hover:text-white" to={`/solutions/${slug}`}>
              {serviceNames[slug] || slug}
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}