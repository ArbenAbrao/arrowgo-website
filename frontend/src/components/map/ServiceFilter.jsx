import React from "react";

const base = "px-4 py-1.5 rounded-full text-sm border border-brand-navy transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green";
const on = "bg-brand-navy text-white shadow-md";

export default function ServiceFilter({ services, value, onChange, counts = {} }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter locations by service">
      <button onClick={() => onChange("")} aria-pressed={value === ""} className={`${base} ${value === "" ? on : ""}`}>
        All{counts[""] != null && <span className="ml-1.5 opacity-70">{counts[""]}</span>}
      </button>
      {services.map((s) => (
        <button key={s.slug} onClick={() => onChange(s.slug)} aria-pressed={value === s.slug} className={`${base} ${value === s.slug ? on : ""}`}>
          {s.name}{counts[s.slug] != null && <span className="ml-1.5 opacity-70">{counts[s.slug]}</span>}
        </button>
      ))}
    </div>
  );
}