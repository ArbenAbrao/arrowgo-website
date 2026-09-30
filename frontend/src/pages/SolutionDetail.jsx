import React from "react";
import { Link, useParams } from "react-router-dom";
import { useReveal } from "../hooks/useReveal";
import { LOGO, TONES, iconFor, imageFor } from "../data/solutionMeta";
import "../components/map/locations.css";
import "../components/sections/solutions.css";

function Icon({ d, className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`reveal ${visible ? "visible" : ""} ${className}`}>{children}</div>;
}

const PIN = "M12 22s7-6.500 7-12a7 7 0 10-14 0c0 5.500 7 12 7 12zm0-9a3 3 0 100-6 3 3 0 000 6z";

export default function SolutionDetail({ services, locations }) {
  const { slug } = useParams();
  const index = services.findIndex((s) => s.slug === slug);
  const service = services[index];

  if (!service) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-32">
        <h1 className="text-3xl text-brand-navy">Solution not found</h1>
        <Link to="/" className="mt-4 inline-block text-brand-blue underline">Back to all solutions</Link>
      </main>
    );
  }
  const img = imageFor(service);
  const where = locations.filter((l) => l.services.includes(slug));
  const others = services.filter((s) => s.slug !== slug).slice(0, 3);
  const facts = [
    { label: "Customer need", text: service.need, icon: "M12 22a10 10 0 100-20 10 10 0 000 20zM12 8v4M12 16h.01", tone: "text-brand-navy" },
    { label: "Our solution", text: service.solution, icon: "M5 13l4 4L19 7", tone: "text-brand-green" },
    { label: "Coverage", text: service.coverage, icon: PIN, tone: "text-brand-blue" },
  ];

  return (
    <main className="sol-section relative overflow-hidden pb-24 pt-28">
      <div className="sol-dots pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="sol-orb pointer-events-none absolute -right-32 top-32 h-96 w-96 rounded-full bg-[#2350d0]/10 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl px-6">
        <Link to="/#solutions" className="sol-link text-sm text-brand-blue"><span className="mr-1 inline-block">&larr;</span> All solutions</Link>

        {/* banner */}
        <Reveal className="mt-4">
          <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${TONES[index % TONES.length]} p-8 md:p-12`}>
            <div className="sol-img-dots absolute inset-0" />
            {img ? (
              <>
                <img src={img} alt={service.name} className="sol-photo absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a1640]/90 via-[#0a1640]/55 to-[#0a1640]/10" />
              </>
            ) : (
              <img src={LOGO} alt="" aria-hidden="true" onError={(e) => (e.currentTarget.style.display = "none")}
                className="sol-logo absolute -right-4 top-1/2 hidden h-56 w-56 -translate-y-1/2 object-contain opacity-30 md:block" />
            )}
            <div className="relative max-w-xl text-white">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur">
                <Icon d={iconFor(slug)} className="h-6 w-6" />
              </span>
              <h1 className="mt-5 text-3xl md:text-5xl">{service.name}</h1>
              <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm backdrop-blur">
                <Icon d={PIN} className="h-4 w-4 text-emerald-300" /> {service.coverage}
              </p>
            </div>
          </div>
        </Reveal>

        {/* need / solution / coverage */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {facts.map((f, i) => (
            <Reveal key={f.label} delay={i * 120}>
              <div className="sol-card h-full rounded-2xl border border-slate-200 bg-white p-6">
                <span className={`flex h-10 w-10 items-center justify-center rounded-lg bg-[#dbe7ff]/70 ${f.tone}`}><Icon d={f.icon} /></span>
                <h2 className="mt-4 text-xs font-semibold uppercase tracking-[.18em] text-slate-400">{f.label}</h2>
                <p className="mt-2 text-slate-700">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* available at */}
        <Reveal className="mt-14">
          <h2 className="text-2xl md:text-3xl text-brand-navy">Available at</h2>
          {where.length ? (
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {where.map((l, i) => (
                <li key={l.id} className="fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <Link to="/#locations" className="sol-card flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-green/10 text-brand-green"><Icon d={PIN} className="h-4 w-4" /></span>
                    <span>
                      <span className="block font-medium text-brand-navy">{l.name}</span>
                      {l.region && <span className="text-xs text-slate-500">{l.region}</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-slate-600">No locations listed for this service yet.</p>
          )}
        </Reveal>

        {/* other solutions */}
        <Reveal className="mt-14">
          <h2 className="text-2xl md:text-3xl text-brand-navy">Other solutions</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {others.map((o) => (
              <Link key={o.slug} to={`/solutions/${o.slug}`} className="sol-card sol-link group rounded-xl border border-slate-200 bg-white p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dbe7ff]/70 text-brand-blue"><Icon d={iconFor(o.slug)} /></span>
                <h3 className="mt-3 font-semibold text-brand-navy">{o.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{o.solution}</p>
                <span className="mt-3 inline-block text-sm text-brand-blue">View details <span className="sol-arrow">&rarr;</span></span>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </main>
  );
}