import React, { useMemo } from "react";
import "./locations.css";
import { ISLANDS, MAP_W, MAP_H, project } from "./philippinePaths";

const REGIONS = [
  { label: "LUZON", lat: 16.6, lng: 121.2 },
  { label: "VISAYAS", lat: 11.35, lng: 124.9 },
  { label: "MINDANAO", lat: 7.9, lng: 124.6 },
];

const arc = (a, b) => {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  return `M${a.x} ${a.y} Q${mx} ${my - dist * 0.28} ${b.x} ${b.y}`;
};

export default function PhilippineMap({ locations, selectedId, onSelect }) {
  const pts = useMemo(() => locations.map((l) => ({ loc: l, ...project(l.lat, l.lng) })), [locations]);
  const selected = pts.find((p) => p.loc.id === selectedId);
  // Draw the selected marker last so it sits on top in the crowded Metro Manila area
  const ordered = [...pts].sort((a, b) => (a.loc.id === selectedId) - (b.loc.id === selectedId));

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-slate-200 p-4 overflow-hidden">
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="w-full max-h-[640px] mx-auto" role="group" aria-label="Map of Arrowgo hubs across the Philippines">
        <defs>
          <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f4f7ff" /><stop offset="1" stopColor="#e3ebff" />
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1a3594" floodOpacity=".18" />
          </filter>
        </defs>

        <g filter="url(#shadow)">
          {ISLANDS.map((d, i) => (
            <path key={i} d={d} className="map-island" style={{ animationDelay: `${Math.min(i * 25, 700)}ms` }}
              fill="url(#land)" stroke="#1a3594" strokeOpacity=".35" strokeWidth=".8" strokeLinejoin="round" />
          ))}
        </g>

        {REGIONS.map((r) => {
          const { x, y } = project(r.lat, r.lng);
          return <text key={r.label} x={x} y={y} textAnchor="middle" className="map-label" fontSize="9" letterSpacing="3" fill="#1a3594" opacity=".28">{r.label}</text>;
        })}

        {/* Animated routes from the selected hub to every other visible hub */}
        {selected && pts.filter((p) => p.loc.id !== selectedId).map((p) => (
          <path key={p.loc.id} d={arc(selected, p)} className="route" fill="none" stroke="#3f9a24" strokeWidth="1.4" strokeLinecap="round" opacity=".7" />
        ))}

        {ordered.map(({ loc, x, y }, i) => {
          const active = loc.id === selectedId;
          const left = loc.labelSide === "left";
          return (
            <g key={loc.id} tabIndex={0} role="button" aria-label={`${loc.name}${active ? " (selected)" : ""}`} aria-pressed={active}
              onClick={() => onSelect(loc.id)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(loc.id); } }}
              className="map-marker cursor-pointer" style={{ animationDelay: `${900 + i * 120}ms` }}>
              {active && <circle cx={x} cy={y} r="7" fill="#3f9a24" className="pulse" />}
              <circle cx={x} cy={y} r="13" className="focus-ring" fill="none" stroke="#3f9a24" strokeWidth="2" />
              <circle cx={x} cy={y} r={active ? 8 : 5.5} className="dot" fill={active ? "#3f9a24" : "#1a3594"} stroke="#fff" strokeWidth="2" />
              <text x={left ? x - 13 : x + 13} y={y + 4} textAnchor={left ? "end" : "start"} fontSize={active ? 12 : 10.5}
                fontWeight={active ? 700 : 500} fill="#1a3594" stroke="#fff" strokeWidth="3" paintOrder="stroke" className="map-label">
                {loc.name}
              </text>
              <circle cx={x} cy={y} r="10" fill="transparent" /> {/* touch target */}
            </g>
          );
        })}
      </svg>
      <p className="absolute bottom-3 left-4 text-[11px] text-slate-400">Simplified coastline - for illustration</p>
    </div>
  );
}