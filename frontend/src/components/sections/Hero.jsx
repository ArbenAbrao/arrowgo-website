import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import GlobePreview from "../globe/GlobePreview";
import Button from "../ui/Button";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";
import { useCountUp } from "../../hooks/useReveal";
import "./hero.css";

// Quick routes into the solution pages, taken from the brief's service list.
const highlights = [
  { slug: "warehousing", label: "Warehousing" },
  { slug: "cold-chain", label: "Cold chain" },
  { slug: "transport", label: "Land, sea & air freight" },
  { slug: "lcl-hubs", label: "LCL hubs" },
];

const rise = (delay) => ({ "--d": `${delay}s` });

function Stat({ value, label, delay }) {
  const n = useCountUp(value, true, 1400);
  return (
    <div className="hx-stat hx-rise rounded-xl border border-white/70 bg-white/60 px-4 py-3 shadow-sm backdrop-blur" style={rise(delay)}>
      <div className="text-2xl font-semibold text-brand-navy">{n}</div>
      <div className="text-[11px] uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}

export default function Hero({ services = [], locations = [] }) {
  const reduced = usePrefersReducedMotion();
  const [idx, setIdx] = useState(0);
  const rootRef = useRef(null);

  // Cycle the highlighted need every few seconds (static when reduced motion is on)
  useEffect(() => {
    if (reduced) return undefined;
    const id = setInterval(() => setIdx((i) => (i + 1) % highlights.length), 3200);
    return () => clearInterval(id);
  }, [reduced]);

  // Mouse parallax + cursor spotlight (CSS variables, no re-render)
  const onMove = (e) => {
    if (reduced || !rootRef.current) return;
    const r = rootRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    const s = rootRef.current.style;
    s.setProperty("--px", ((x - 0.5) * 2).toFixed(3));
    s.setProperty("--py", ((y - 0.5) * 2).toFixed(3));
    s.setProperty("--mx", `${x * 100}%`);
    s.setProperty("--my", `${y * 100}%`);
  };

  const current = highlights[idx];
  const need = services.find((s) => s.slug === current.slug)?.need;
  const regionCount = useMemo(() => new Set(locations.map((l) => l.region).filter(Boolean)).size, [locations]);

  const line1 = ["Your", "supply", "chain."];

  return (
    <section ref={rootRef} onMouseMove={onMove}
      className="hx-root relative overflow-hidden text-brand-navy min-h-[92vh] flex items-center pt-28 pb-24">
      {/* background layers */}
      <div className="hx-grid absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="hx-spot absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="hx-par absolute -right-40 top-1/4 pointer-events-none" style={{ "--k": "-30px" }} aria-hidden="true">
        <div className="hx-orb h-[36rem] w-[36rem] rounded-full bg-[#2350d0]/15 blur-3xl" />
      </div>
      <div className="hx-par absolute -left-32 bottom-0 pointer-events-none" style={{ "--k": "24px" }} aria-hidden="true">
        <div className="hx-orb h-96 w-96 rounded-full bg-[#3f9a24]/15 blur-3xl" style={{ animationDelay: "-6s" }} />
      </div>

      <div className="relative mx-auto max-w-6xl w-full px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="hx-rise inline-flex items-center gap-2 rounded-full border border-[#b5caf5] bg-white/70 px-3 py-1 text-xs font-medium text-brand-navy backdrop-blur" style={rise(0)}>
            <span className="hx-ping h-2 w-2 rounded-full bg-[#3f9a24]" />
            Nationwide logistics network
          </p>

          <h1 className="mt-5 text-4xl md:text-6xl leading-tight" aria-label="Your supply chain. Connected.">
            <span aria-hidden="true">
              {line1.map((w, i) => (
                <span key={w} className="hx-word mr-[.25em]" style={{ "--i": i }}>{w}</span>
              ))}
            </span>
            <br />
            <span aria-hidden="true" className="inline-block">
              <span className="hx-word hx-grad" style={{ "--i": 3 }}>Connected.</span>
              <span className="hx-underline" />
            </span>
          </h1>

          <p className="hx-rise mt-6 text-slate-600 max-w-md" style={rise(0.7)}>
            Connected solutions for warehousing, cold chain, freight and distribution, across the Philippines.
          </p>

          <div className="hx-rise mt-8 flex flex-wrap items-center gap-4" style={rise(0.9)}>
            <Button href="#solutions" className="hx-btn">Explore Solutions <span className="hx-arrow">&rarr;</span></Button>
            <Button href="#locations" variant="ghost" className="hx-link">Explore Locations <span className="hx-arrow">&rarr;</span></Button>
          </div>

          <div className="hx-rise mt-10" style={rise(1.1)}>
            <p className="text-sm text-slate-500">What do you need to move or store?</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {highlights.map((h, i) => {
                const on = i === idx && !reduced;
                return (
                  <li key={h.slug}>
                    <Link to={`/solutions/${h.slug}`}
                      className={`hx-chip inline-block rounded-full border px-3 py-1 text-sm ${
                        on ? "border-[#2350d0] bg-[#2350d0]/10 text-brand-navy" : "border-slate-300 bg-white/50 text-slate-700 hover:border-[#2350d0]"
                      }`}>
                      {h.label}
                      {on && <span className="hx-progress" aria-hidden="true" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {need && (
              <p key={current.slug} className="need-fade mt-4 min-h-[3rem] max-w-md text-sm text-slate-600">{need}</p>
            )}
          </div>

          {locations.length > 0 && (
            <div className="mt-8 flex gap-3">
              <Stat value={locations.length} label="Hubs" delay={1.3} />
              {regionCount > 0 && <Stat value={regionCount} label="Regions" delay={1.4} />}
              {services.length > 0 && <Stat value={services.length} label="Services" delay={1.5} />}
            </div>
          )}
        </div>

        {/* Globe with orbit rings, floating badges and parallax */}
        <div className="hx-par relative" style={{ "--k": "14px" }}>
          <div className="hx-globe-in relative">
            <div className="hx-ring inset-[-6%]" style={{ "--t": "46s" }} aria-hidden="true" />
            <div className="hx-ring inset-[-14%]" style={{ "--t": "70s", "--c": "#2350d0", animationDirection: "reverse" }} aria-hidden="true" />
            <GlobePreview locations={locations} services={services} />

            <div className="hx-badge hidden sm:flex absolute -left-4 top-10 items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-xs text-brand-navy backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#3f9a24]" /> {locations.length || "Nationwide"} {locations.length ? "hubs nationwide" : "network"}
            </div>
            <div className="hx-badge hidden sm:flex absolute -right-2 top-1/2 items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-xs text-brand-navy backdrop-blur" style={{ animationDelay: "-2s" }}>
              <span className="h-2 w-2 rounded-full bg-[#2350d0]" /> Land, sea &amp; air
            </div>
            <div className="hx-badge hidden sm:flex absolute left-6 bottom-24 items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-xs text-brand-navy backdrop-blur" style={{ animationDelay: "-3.5s" }}>
              <span className="h-2 w-2 rounded-full bg-[#7dc35a]" /> Cold chain ready
            </div>
          </div>
        </div>
      </div>

      <a href="#solutions" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-500 hover:text-brand-blue flex flex-col items-center gap-2">
        Scroll to solutions
        <span className="relative block h-8 w-5 rounded-full border border-slate-400" aria-hidden="true">
          <span className="hx-wheel absolute left-1/2 top-1.5 h-1.5 w-1 -translate-x-1/2 rounded-full bg-[#2350d0]" />
        </span>
      </a>
    </section>
  );
}