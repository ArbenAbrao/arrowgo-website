import React, { useMemo, useState } from "react";
import { useReveal, useCountUp } from "../../hooks/useReveal";
import "./clients.css";

/*
  Client logos: save each file in frontend/public/clients/ using the `slug` below,
  e.g. public/clients/nutriasia.png. If a file is missing, a clean wordmark tile is shown instead.
  Use logos you have permission to display.
*/
const CLIENTS = [
  { name: "NutriAsia", slug: "nutriasia" },
  { name: "Nippon Express", slug: "nippon-express" },
  { name: "Seaoil", slug: "seaoil" },
  { name: "Bo's Coffee", slug: "bos-coffee" },
  { name: "Pick-up Coffee", slug: "pick-up-coffee" },
  { name: "Asahi", slug: "asahi" },
  { name: "Lumitek", slug: "lumitek" },
  { name: "IKEA", slug: "ikea" },
  { name: "HEY Philippines Corporation", slug: "HEY-Philippines-Corporation" },
  { name: "Hanearl", slug: "hanearl" },
  { name: "Bell-Kenz Pharma", slug: "bell-kenz-pharma" },
  { name: "Mason & Yang", slug: "Mason-Yang" },
  { name: "Toyota Financial Services", slug: "toyota-financial-services" },
];

const TONES = [
  "from-[#2350d0] to-[#1a3594]",
  "from-[#3f9a24] to-[#2350d0]",
  "from-[#1a3594] to-[#0a1640]",
  "from-[#2350d0] to-[#3f9a24]",
];

const initials = (name) =>
  name.split(/[\s-]+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

function Tile({ client, tone, dup = false }) {
  const [missing, setMissing] = useState(false);
  return (
    <li aria-hidden={dup || undefined} className={`cl-tile ${dup ? "cl-dup" : ""} flex h-20 w-56 flex-none items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 shadow-sm`}>
      {!missing ? (
        <img src={`/clients/${client.slug}.png`} alt={client.name} loading="lazy" onError={() => setMissing(true)}
          className="cl-logo max-h-12 max-w-full object-contain" />
      ) : (
        <span className="flex items-center gap-3">
          <span className={`cl-mono flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gradient-to-br ${tone} text-sm font-bold text-white`}>
            {initials(client.name)}
          </span>
          <span className="text-left text-sm font-semibold leading-tight text-brand-navy">{client.name}</span>
        </span>
      )}
    </li>
  );
}

function Row({ items, reverse = false, duration = 45 }) {
  // The list is rendered twice so the -50% translate loops seamlessly.
  return (
    <div className="cl-row cl-mask overflow-hidden py-2">
      <ul className={`cl-track ${reverse ? "reverse" : ""}`} style={{ "--dur": `${duration}s` }}>
        {items.map((c, i) => <Tile key={c.slug} client={c} tone={TONES[i % TONES.length]} />)}
        {items.map((c, i) => <Tile key={`d-${c.slug}`} client={c} tone={TONES[i % TONES.length]} dup />)}
      </ul>
    </div>
  );
}

export default function Clients() {
  const [ref, visible] = useReveal(0.1);
  const count = useCountUp(CLIENTS.length, visible, 1200);
  const [rowA, rowB] = useMemo(() => {
    const mid = Math.ceil(CLIENTS.length / 2);
    return [CLIENTS.slice(0, mid), CLIENTS.slice(mid)];
  }, []);

  return (
    <section id="clients" className="cl-section relative overflow-hidden py-24" aria-labelledby="clients-title">
      <div className="cl-orb pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-[#2350d0]/10 blur-3xl" aria-hidden="true" />
      <div className="cl-orb pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#3f9a24]/10 blur-3xl" style={{ animationDelay: "-6s" }} aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div ref={ref} className={`reveal mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end ${visible ? "visible" : ""}`}>
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.2em] text-brand-green">Our clients</p>
            <h2 id="clients-title" className="text-3xl md:text-4xl text-brand-navy">Trusted by leading brands</h2>
            <span className={`mt-4 block h-1 rounded-full bg-brand-green transition-all duration-700 ${visible ? "w-16" : "w-0"}`} />
            <p className="mt-4 text-slate-600">From food and beverage to pharma, energy and automotive finance, businesses across industries rely on Arrowgo to keep their supply chain moving.</p>
          </div>
          <div className="rounded-2xl border border-[#b5caf5] bg-white/70 px-6 py-4 text-center backdrop-blur">
            <div className="text-4xl font-semibold text-brand-navy">{count}</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500">Partner brands</div>
          </div>
        </div>
      </div>

      {/* full-width marquee rows */}
      <div className="relative">
        <Row items={rowA} duration={45} />
        <Row items={rowB} reverse duration={52} />
      </div>
    </section>
  );
}