import React from "react";

// Vertical warehouse selector. Stretches to the same height as the map and detail cards beside it.
export default function LocationList({ locations, selectedId, onSelect }) {
  return (
    <nav aria-label="Browse warehouses" className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-slate-400">All warehouses</p>
        <span className="rounded-full bg-brand-navy px-2 py-0.5 font-mono text-[10px] text-white">{locations.length}</span>
      </div>
      <ol className="flex flex-1 flex-col gap-2">
        {locations.map((loc, i) => {
          const active = loc.id === selectedId;
          return (
            <li key={loc.id} className="fade-up flex-1" style={{ animationDelay: `${i * 70}ms` }}>
              <button onClick={() => onSelect(loc.id)} aria-current={active ? "true" : undefined}
                className={`group relative flex h-full min-h-[64px] w-full items-center gap-3 overflow-hidden rounded-xl border p-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                  active ? "border-brand-green bg-[#dbe7ff]/50 shadow-md" : "border-slate-200 bg-white hover:border-brand-blue/40"}`}>
                <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-full font-mono text-xs transition-all duration-300 ${
                  active ? "bg-brand-green text-white shadow" : "bg-slate-100 text-slate-500 group-hover:bg-[#2350d0] group-hover:text-white"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-sm leading-snug ${active ? "font-semibold text-brand-navy" : "text-slate-700"}`}>{loc.name}</span>
                  <span className="mt-0.5 block text-xs text-slate-400">{loc.island}{loc.province ? ` / ${loc.province}` : ""}</span>
                </span>
                <span aria-hidden="true" className={`flex-none text-brand-green transition-all duration-300 ${active ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-70"}`}>&rarr;</span>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#2350d0] to-[#3f9a24] transition-all duration-500 ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}