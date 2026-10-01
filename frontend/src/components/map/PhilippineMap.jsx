import React, { useEffect, useMemo, useRef, useState } from "react";
import "./locations.css";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";
import { ISLANDS, MAP_W, MAP_H, project } from "./philippinePaths";
import { clusterLocations } from "./locationUtils";

const REGIONS = [
  { label: "LUZON", lat: 16.6, lng: 121.2 },
  { label: "VISAYAS", lat: 11.35, lng: 124.9 },
  { label: "MINDANAO", lat: 7.9, lng: 124.6 },
];
const MERIDIANS = [118, 120, 122, 124, 126];
const PARALLELS = [6, 8, 10, 12, 14, 16, 18, 20];
const FOCUS_ZOOM = 2.3;

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const arc = (a, b) => {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${mx.toFixed(1)} ${(my - dist * 0.28).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
};

export default function PhilippineMap({ locations, selectedId, onSelect }) {
  const reduced = usePrefersReducedMotion();
  const svgRef = useRef(null);
  const vbRef = useRef([0, 0, MAP_W, MAP_H]);
  const [focus, setFocus] = useState(false);

  const clusters = useMemo(() => clusterLocations(locations).map((c) => ({ ...c, ...project(c.lat, c.lng) })), [locations]);
  const islandCounts = useMemo(() => {
    const m = {};
    locations.forEach((l) => { if (l.island) m[l.island] = (m[l.island] || 0) + 1; });
    return Object.entries(m);
  }, [locations]);
  const sel = clusters.find((c) => c.members.some((m) => m.id === selectedId));
  const ordered = [...clusters].sort((a, b) => (a === sel) - (b === sel)); // selected drawn last (on top)

  // Fly the camera: animate the viewBox to the selected hub (focus) or back to the whole country
  const target = useMemo(() => {
    if (!focus || !sel) return [0, 0, MAP_W, MAP_H];
    const w = MAP_W / FOCUS_ZOOM, h = MAP_H / FOCUS_ZOOM;
    return [clamp(sel.x - w / 2, 0, MAP_W - w), clamp(sel.y - h / 2, 0, MAP_H - h), w, h];
  }, [focus, sel?.x, sel?.y]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return undefined;
    const apply = (v) => {
      vbRef.current = v;
      el.setAttribute("viewBox", v.map((n) => n.toFixed(2)).join(" "));
      el.style.setProperty("--ms", Math.max(v[2] / MAP_W, 0.42).toFixed(3)); // keep markers a constant on-screen size
    };
    if (reduced) { apply(target); return undefined; }
    const from = [...vbRef.current];
    const t0 = performance.now();
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / 1000);
      const e = ease(p);
      apply(from.map((f, i) => f + (target[i] - f) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduced]);

  const pick = (c) => {
    if (c.members.length > 1 && c === sel) {
      const i = c.members.findIndex((m) => m.id === selectedId);
      onSelect(c.members[(i + 1) % c.members.length].id);
    } else onSelect(c.members[0].id);
  };

  const seg = (on) => `rounded-full px-3 py-1 transition ${on ? "bg-brand-navy text-white shadow" : "text-slate-600 hover:text-brand-navy"}`;

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-sky-50 via-white to-sky-50 p-4 shadow-sm">
      <div className="map-scan" aria-hidden="true" />

      {/* overlays */}
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs text-brand-navy shadow backdrop-blur">
        <span className="live-dot relative h-2 w-2 rounded-full bg-[#3f9a24]" />
        {locations.length} {locations.length === 1 ? "warehouse" : "warehouses"}
      </div>
      <div className="absolute right-4 top-4 z-10 flex gap-1 rounded-full bg-white/80 p-1 text-xs shadow backdrop-blur" role="group" aria-label="Map view">
        <button onClick={() => setFocus(false)} aria-pressed={!focus} className={seg(!focus)}>Nationwide</button>
        <button onClick={() => setFocus(true)} aria-pressed={focus} className={seg(focus)}>Focus hub</button>
      </div>
      <svg viewBox="0 0 40 40" className="absolute bottom-4 right-4 z-10 h-12 w-12 text-brand-navy" aria-hidden="true">
        <circle cx="20" cy="20" r="18" fill="white" fillOpacity=".8" stroke="currentColor" strokeOpacity=".25" />
        <path d="M20 7 L24 20 L20 18 L16 20 Z" fill="#3f9a24" />
        <path d="M20 33 L24 20 L20 22 L16 20 Z" fill="currentColor" fillOpacity=".35" />
        <text x="20" y="6.500" textAnchor="middle" fontSize="6" fontWeight="700" fill="currentColor">N</text>
      </svg>

      {/* island-group legend (fills the corner and doubles as a summary) */}
      <ul className="absolute bottom-4 left-4 z-10 space-y-1.5" aria-label="Warehouses by island group">
        {islandCounts.map(([name, n], i) => (
          <li key={name} className="fade-up flex items-center gap-2 rounded-full bg-white/85 py-1 pl-2.5 pr-1.5 text-xs text-brand-navy shadow backdrop-blur" style={{ animationDelay: `${1200 + i * 120}ms` }}>
            <span className="h-2 w-2 rounded-full bg-[#3f9a24]" />
            {name}
            <span className="rounded-full bg-brand-navy px-1.5 font-mono text-[10px] text-white">{n}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-1 items-center">
      <svg ref={svgRef} viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="mx-auto w-full max-h-[760px]" role="group"
        aria-label="Map of Arrowgo warehouses across the Philippines" style={{ "--ms": 1 }}>
        <defs>
          <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f4f7ff" /><stop offset="1" stopColor="#e3ebff" />
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1a3594" floodOpacity=".18" />
          </filter>
        </defs>

        {/* faint coordinate grid */}
        <g stroke="#2350d0" strokeOpacity=".07" strokeWidth=".6" aria-hidden="true">
          {MERIDIANS.map((lng) => { const a = project(21.5, lng), b = project(4, lng); return <line key={lng} x1={a.x} y1="0" x2={b.x} y2={MAP_H} />; })}
          {PARALLELS.map((lat) => { const a = project(lat, 116); return <line key={lat} x1="0" y1={a.y} x2={MAP_W} y2={a.y} />; })}
        </g>

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

        {/* routes from the selected hub, with cargo packets travelling along them */}
        {sel && clusters.filter((c) => c !== sel).map((c, i) => {
          const d = arc(sel, c);
          return (
            <g key={`${sel.id}-${c.id}`}>
              <path d={d} className="route" fill="none" stroke="#3f9a24" strokeWidth="1.4" strokeLinecap="round" opacity=".7" />
              {!reduced && (
                <circle r="2.4" fill="#3f9a24" stroke="#3f9a24" strokeOpacity=".3" strokeWidth="5">
                  <animateMotion dur={`${3 + i * 0.5}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" path={d} />
                </circle>
              )}
            </g>
          );
        })}

        {ordered.map((c, i) => {
          const active = c === sel;
          const m0 = c.members[0];
          const left = m0.labelSide === "left";
          const label = c.area;
          return (
            <g key={c.id} transform={`translate(${c.x.toFixed(1)} ${c.y.toFixed(1)})`}>
              <g tabIndex={0} role="button" aria-pressed={active} className="map-marker cursor-pointer" style={{ animationDelay: `${900 + i * 120}ms` }}
                aria-label={`${label}${c.members.length > 1 ? `, ${c.members.length} warehouses` : ""}${active ? " (selected)" : ""}`}
                onClick={() => pick(c)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(c); } }}>
                <g className="map-ms">
                  <circle r="7" className="ring-soft" fill="#1a3594" style={{ animationDelay: `${i * 0.6}s` }} />
                  {active && <circle r="7" fill="#3f9a24" className="pulse" />}
                  <circle r="13" className="focus-ring" fill="none" stroke="#3f9a24" strokeWidth="2" />
                  <circle r={active ? 8 : 5.5} className="dot" fill={active ? "#3f9a24" : "#1a3594"} stroke="#fff" strokeWidth="2" />
                  {c.members.length > 1 && (
                    <g transform="translate(9 -9)">
                      <circle r="6" fill="#3f9a24" stroke="#fff" strokeWidth="1.5" />
                      <text textAnchor="middle" y="2.600" fontSize="7.500" fontWeight="700" fill="#fff">{c.members.length}</text>
                    </g>
                  )}
                  <text x={left ? -13 : 13} y="4" textAnchor={left ? "end" : "start"} fontSize={active ? 12 : 10.5} fontWeight={active ? 700 : 500}
                    fill="#1a3594" stroke="#fff" strokeWidth="3" paintOrder="stroke" className="map-label">{label}</text>
                  <circle r="12" fill="transparent" />
                </g>
              </g>
            </g>
          );
        })}
      </svg>
      </div>
      <p className="mt-1 text-center text-[11px] text-slate-400">Simplified coastline, pin positions approximate</p>
    </div>
  );
}