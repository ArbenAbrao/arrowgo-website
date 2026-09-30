import React from "react";

export default function LocationList({ locations, selectedId, onSelect }) {
  return (
    <ul className="divide-y divide-slate-200 border rounded-lg overflow-hidden bg-white" aria-label="Browse locations">
      {locations.map((loc) => {
        const active = loc.id === selectedId;
        return (
          <li key={loc.id} className="fade-up" style={{ animationDelay: `${locations.indexOf(loc) * 60}ms` }}>
            <button onClick={() => onSelect(loc.id)} aria-current={active}
              className={`list-item w-full flex items-center justify-between px-4 py-3 text-left border-l-4 ${active ? "bg-brand-mist border-brand-green font-medium" : "border-transparent hover:bg-slate-50"}`}>
              <span>{loc.name}<span className="ml-2 text-xs text-slate-400">{loc.region}</span></span>
              <span className={`text-xs transition-transform ${active ? "translate-x-0 text-brand-green" : "-translate-x-1 opacity-0"}`}>Selected</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}