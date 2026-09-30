import React, { useRef } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "../ui/SectionHeading";
import { useReveal } from "../../hooks/useReveal";
import { LOGO, TONES, iconFor, imageFor } from "../../data/solutionMeta";
import "../map/locations.css";
import "./solutions.css";

function Icon({ d, className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function SolutionCard({ s, index }) {
  const cardRef = useRef(null);
  const [revealRef, visible] = useReveal(0.1);
  const img = imageFor(s);
  const num = String(index + 1).padStart(2, "0");

  const onMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div ref={revealRef} style={{ transitionDelay: `${(index % 4) * 110}ms` }} className={`reveal h-full ${visible ? "visible" : ""}`}>
      <article ref={cardRef} onMouseMove={onMove}
        className="sol-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {/* picture */}
        <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${TONES[index % TONES.length]}`}>
          {img ? (
            <img src={img} alt={s.name} loading="lazy" className="sol-photo h-full w-full object-cover" />
          ) : (
            <>
              <div className="sol-img-dots absolute inset-0" />
              <img src={LOGO} alt="" aria-hidden="true" onError={(e) => (e.currentTarget.style.display = "none")}
                className="sol-logo absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 object-contain opacity-50" />
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          <span className="absolute left-4 top-3 font-mono text-3xl font-bold text-white/25 transition-colors group-hover:text-white/60">{num}</span>
          <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur transition-all duration-300 group-hover:rotate-12 group-hover:bg-white group-hover:text-[#2350d0]">
            <Icon d={iconFor(s.slug)} />
          </span>
        </div>

        {/* content */}
        <div className="relative flex flex-1 flex-col p-5">
          <h3 className="text-lg font-semibold text-brand-navy">{s.name}</h3>

          <dl className="mt-4 space-y-3 text-sm">
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <dt className="text-[10px] font-semibold uppercase tracking-[.18em] text-slate-400">Need</dt>
              <dd className="mt-0.5 text-slate-600">{s.need}</dd>
            </div>
            <div className="rounded-lg border-l-2 border-brand-green bg-[#2350d0]/5 px-3 py-2">
              <dt className="text-[10px] font-semibold uppercase tracking-[.18em] text-brand-green">Solution</dt>
              <dd className="mt-0.5 text-slate-700">{s.solution}</dd>
            </div>
          </dl>

          <p className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-[#b5caf5] bg-[#dbe7ff]/50 px-3 py-1 text-xs text-brand-navy">
            <Icon d="M12 22s7-6.500 7-12a7 7 0 10-14 0c0 5.500 7 12 7 12zm0-9a3 3 0 100-6 3 3 0 000 6z" className="h-3.5 w-3.5 text-brand-green" />
            {s.coverage}
          </p>

          <Link to={`/solutions/${s.slug}`} className="sol-link mt-auto pt-5 font-medium text-brand-blue focus:outline-none focus-visible:underline">
            View details <span className="sol-arrow">&rarr;</span>
          </Link>
          <span className="sol-bar absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#2350d0] to-[#3f9a24]" />
        </div>

        <div className="sol-spot pointer-events-none absolute inset-0" />
        <div className="sol-shine" />
      </article>
    </div>
  );
}

export default function Solutions({ services }) {
  const [ctaRef, ctaVisible] = useReveal();
  return (
    <section id="solutions" className="sol-section relative overflow-hidden py-24">
      <div className="sol-dots pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="sol-orb pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#2350d0]/10 blur-3xl" aria-hidden="true" />
      <div className="sol-orb pointer-events-none absolute -left-24 bottom-10 h-80 w-80 rounded-full bg-[#3f9a24]/10 blur-3xl" style={{ animationDelay: "-6s" }} aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="What we do" title="Solutions for every step of the chain"
          intro="Find the need you have, the solution we offer and where it is available." />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => <SolutionCard key={s.slug} s={s} index={i} />)}
        </div>

        <div ref={ctaRef} className={`reveal mt-14 flex flex-col items-start justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#1a3594] to-[#2350d0] p-8 text-white md:flex-row md:items-center ${ctaVisible ? "visible" : ""}`}>
          <div>
            <h3 className="text-xl md:text-2xl">Not sure which solution fits?</h3>
            <p className="mt-1 text-slate-200">Tell us what you need to move or store and we will point you to the right hub.</p>
          </div>
          <a href="#contact" className="sol-link inline-flex flex-none items-center rounded-full bg-white px-6 py-2.5 font-medium text-brand-navy transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95">
            Talk to us <span className="sol-arrow ml-2">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}