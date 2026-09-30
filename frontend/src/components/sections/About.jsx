import React, { useState } from "react";
import SectionHeading from "../ui/SectionHeading";
import { useReveal } from "../../hooks/useReveal";
import "../map/locations.css";

// Content adapted from arrowgo-logistics.com (typos cleaned up).
const PILLARS = [
  {
    id: "mission",
    label: "Our Mission",
    icon: "M12 2l3 7h7l-5.5 4.5L18.5 21 12 16.8 5.5 21 7.5 13.5 2 9h7z",
    text: "To provide innovative and superior logistics solutions to our valued clients. As our clients' business partners, we understand their individual needs, customize our solutions, and deliver services beyond their expectations. Our name will be synonymous with integrity, efficiency and quality service, so that together we grow without limits.",
  },
  {
    id: "vision",
    label: "Our Vision",
    icon: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12zm11 3a3 3 0 100-6 3 3 0 000 6z",
    text: "To be a prestigious, nationwide operator and the leading logistics solutions provider, offering world-class services and systems to various industries in the country and abroad.",
  },
  {
    id: "improvement",
    label: "Continuous Improvement",
    icon: "M3 17l6-6 4 4 8-8M15 7h6v6",
    text: "We keep improving our resources and services to meet the changing needs of our clients. Our workforce is the heart of that improvement, so we invest in its development to stay aligned with our vision, mission and thrust.",
  },
];

const WHY = [
  { title: "Cargo liability, from handover", body: "Arrowgo assumes liability for your cargo as soon as it is turned over to us.", icon: "M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" },
  { title: "No initial capital", body: "We provide all the equipment and resources needed to move and store your cargo, reducing your capital and operational costs.", icon: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" },
  { title: "Scalable operations", body: "Trim or increase your capacity day by day without worrying about the logistics behind it.", icon: "M4 20V10M10 20V4M16 20v-8M22 20H2" },
  { title: "Value-added services", body: "Tailor-fit services, fully customizable, including your company logo, to make the service truly yours.", icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM19 12l2-1-2-4-2 .5-1.5-1 .5-2-4-1-1 2h-2l-1-2-4 1 .5 2L3 8.500 1 9l2 4 2-.5L6.500 14l-.5 2 4 1 1-2h2l1 2 4-1-.5-2z" },
];

const COMMITMENTS = [
  "Self-discipline and accountability: every employee owns the standards of conduct and performance.",
  "Standards of conduct aligned with our vision, mission, values and government regulations.",
  "Empowering customers through clear, consistent communication.",
  "Reliable, consistent client experience by avoiding unnecessary costs and building our workforce.",
];

function Icon({ d, className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`reveal ${visible ? "visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

export default function About() {
  const [active, setActive] = useState("mission");
  const pillar = PILLARS.find((p) => p.id === active);

  return (
    <section id="about" className="relative overflow-hidden py-20 bg-slate-50">
      {/* soft decorative glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-mist blur-3xl opacity-70" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Who we are"
          title="About Arrowgo"
          intro="A logistics partner built on integrity, efficiency and quality service. We take on the moving and storing of your cargo so you can focus on growing your business."
        />

        {/* Mission / Vision / Improvement - tabs */}
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <div role="tablist" aria-label="Company statements" className="flex lg:flex-col gap-2 overflow-x-auto">
              {PILLARS.map((p) => {
                const on = p.id === active;
                return (
                  <button key={p.id} role="tab" aria-selected={on} onClick={() => setActive(p.id)}
                    className={`flex items-center gap-3 whitespace-nowrap rounded-xl border px-4 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green ${
                      on ? "bg-brand-navy text-white border-brand-navy shadow-lg" : "bg-white text-brand-navy border-slate-200 hover:shadow"
                    }`}>
                    <Icon d={p.icon} className={`h-5 w-5 ${on ? "text-emerald-300" : "text-brand-green"}`} />
                    <span className="font-medium">{p.label}</span>
                  </button>
                );
              })}
            </div>

            <article key={pillar.id} role="tabpanel" className="card-in rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-mist text-brand-navy">
                <Icon d={pillar.icon} />
              </span>
              <h3 className="mt-4 text-2xl text-brand-navy">{pillar.label}</h3>
              <p className="mt-3 text-lg leading-relaxed text-slate-600">{pillar.text}</p>
            </article>
          </div>
        </Reveal>

        {/* Why choose */}
        <div className="mt-20">
          <Reveal><h3 className="text-2xl md:text-3xl text-brand-navy">Why choose Arrowgo?</h3></Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={i * 100}>
                <div className="group h-full rounded-xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-green hover:shadow-xl">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-mist text-brand-navy transition-colors duration-300 group-hover:bg-brand-green group-hover:text-white">
                    <Icon d={w.icon} />
                  </span>
                  <h4 className="mt-4 text-lg text-brand-navy">{w.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{w.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Commitments */}
        <Reveal className="mt-20">
          <div className="rounded-2xl bg-brand-navy p-8 md:p-10 text-white">
            <h3 className="text-2xl md:text-3xl">Our commitments</h3>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {COMMITMENTS.map((c, i) => (
                <li key={c} className="fade-up flex gap-3 text-slate-200" style={{ animationDelay: `${i * 120}ms` }}>
                  <Icon d="M5 13l4 4L19 7" className="mt-0.5 h-5 w-5 flex-none text-emerald-300" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <a href="#locations" className="mt-8 inline-block rounded-full bg-brand-green px-6 py-2.5 font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95">
              See our hubs nationwide
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}