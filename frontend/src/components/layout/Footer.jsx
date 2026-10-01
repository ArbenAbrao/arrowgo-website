import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useInView from "../../hooks/useInView";
import "./footer.css";

const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/arrowgologisticsofficial/", icon: "facebook" },
  { label: "Instagram", href: "https://www.instagram.com/arrowgologisticsincofficial", icon: "instagram" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/arrowgo-logistics-official/", icon: "linkedin" },
];

// Same section links as the navbar
const EXPLORE = [
  ["Solutions", "/#solutions"],
  ["Locations", "/#locations"],
  ["Facilities", "/#facilities"],
  ["About", "/#about"],
  ["News", "/#news"],
];

const SOLUTIONS = [
  ["Warehousing", "warehousing"],
  ["Third-party logistics (3PL)", "3pl"],
  ["Supply chain management", "supply-chain"],
  ["Cold chain management", "cold-chain"],
  ["Transport & distribution", "transport"],
  ["LCL collection hubs", "lcl-hubs"],
];

const TICKER = ["Warehousing", "Third-party logistics", "Supply chain management", "Cold chain", "Land, sea & air freight", "LCL collection hubs"];

const EMAIL = "query@arrowgologistics.com";
const MAPS = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Arrowgo Logistics WH 8001 Mabato Rd. Ibayo-Tipas, Taguig City, Philippines");

function Icon({ name }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  switch (name) {
    case "facebook":
      return <svg {...common}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>;
    case "instagram":
      return <svg {...common}><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>;
    case "linkedin":
      return <svg {...common}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>;
    case "mail":
      return <svg {...common}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;
    case "pin":
      return <svg {...common}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>;
    case "up":
      return <svg {...common}><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></svg>;
    case "out":
      return <svg {...common}><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg>;
    default:
      return null;
  }
}

export default function Footer() {
  const [ref, inView] = useInView({ threshold: 0.12 });
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (inView) setSeen(true);
  }, [inView]);

  const rise = (i) => ({ className: `ft-rise ${seen ? "in" : ""}`, style: { "--i": i } });
  const year = new Date().getFullYear();

  return (
    <footer id="contact" ref={ref} className="ft relative overflow-hidden bg-gradient-to-b from-white via-brand-mist/70 to-white">
      <span className={`ft-line ${seen ? "in" : ""}`} aria-hidden="true" />

      <div className="mx-auto max-w-6xl px-6 pt-20">
        {/* ---------- call to action ---------- */}
        <section {...rise(0)} className={`${rise(0).className} ft-cta relative overflow-hidden rounded-3xl p-8 text-white md:p-12`} aria-labelledby="ft-cta-title">
          <span className="ft-stripe ft-stripe-a" aria-hidden="true" />
          <span className="ft-stripe ft-stripe-b" aria-hidden="true" />
          <div className="relative max-w-xl">
            <h2 id="ft-cta-title" className="text-3xl leading-tight md:text-4xl">Let&rsquo;s keep your supply chain moving.</h2>
            <p className="mt-4 text-blue-100">
              Warehousing, cold chain, freight and distribution across the Philippines. Tell us what you need to move or store.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href={`mailto:${EMAIL}`} className="ft-btn inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-brand-navy">
                <span className="ft-dot h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                Email us <span className="ft-arrow" aria-hidden="true">&rarr;</span>
              </a>
              <a href="/#locations" className="ft-ghost inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-white">
                Explore Locations <span className="ft-arrow" aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </section>

        {/* ---------- services ticker (decorative) ---------- */}
        <div className="ft-ticker mt-10 overflow-hidden" aria-hidden="true">
          <div className="ft-ticker-track flex w-max items-center gap-10 text-sm text-slate-500">
            {[...TICKER, ...TICKER].map((t, i) => (
              <span key={i} className="flex items-center gap-10 whitespace-nowrap">
                {t}
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand-blue to-brand-green" />
              </span>
            ))}
          </div>
        </div>

        {/* ---------- main grid ---------- */}
        <div className="grid gap-12 py-16 md:grid-cols-12">
          <div {...rise(1)} className={`${rise(1).className} md:col-span-4`}>
            <Link to="/" className="ft-brand inline-flex items-center gap-3" aria-label="Arrowgo Logistics Inc. home">
              <img src="/LOGO2.png" alt="" className="ft-logo h-11 w-auto" />
              <span className="leading-tight">
                <span className="ft-brand-text block text-2xl font-bold tracking-wide">ARROWGO</span>
                <span className="block text-[10px] tracking-[0.35em] text-brand-navy">LOGISTICS INC.</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-slate-600">One-stop-shop logistics solutions and services.</p>
            <p className="ft-tag mt-3 inline-block text-lg font-semibold italic text-brand-green">
              moving excellence!
              <svg viewBox="0 0 160 10" className="block h-2 w-full" preserveAspectRatio="none" aria-hidden="true">
                <path d="M2 7 C 40 2, 100 2, 158 4" fill="none" stroke="#3f9a24" strokeWidth="2" strokeLinecap="round" pathLength="100" className="ft-swoosh" />
              </svg>
            </p>
            <ul className="mt-7 flex gap-3">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Arrowgo on ${s.label}`} className="ft-social grid h-11 w-11 place-items-center rounded-full">
                    <Icon name={s.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav {...rise(2)} className={`${rise(2).className} md:col-span-2`} aria-label="Explore">
            <p className="ft-head">Explore</p>
            <ul className="mt-4 space-y-1">
              {EXPLORE.map(([label, href]) => (
                <li key={href}><a href={href} className="ft-link">{label}</a></li>
              ))}
            </ul>
          </nav>

          <nav {...rise(3)} className={`${rise(3).className} md:col-span-3`} aria-label="Solutions">
            <p className="ft-head">Solutions</p>
            <ul className="mt-4 space-y-1">
              {SOLUTIONS.map(([label, slug]) => (
                <li key={slug}><Link to={`/solutions/${slug}`} className="ft-link">{label}</Link></li>
              ))}
            </ul>
          </nav>

          <div {...rise(4)} className={`${rise(4).className} md:col-span-3`}>
            <p className="ft-head">Contact</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={MAPS} target="_blank" rel="noopener noreferrer" className="ft-contact group flex gap-3">
                  <span className="ft-bubble"><Icon name="pin" /></span>
                  <span className="text-sm leading-relaxed text-slate-600">
                    Arrowgo-Logistics Inc.<br />
                    WH 8001 Mabato Rd. Ibayo-Tipas,<br />
                    Taguig City, Philippines
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="ft-contact group flex items-center gap-3">
                  <span className="ft-bubble"><Icon name="mail" /></span>
                  <span className="text-sm text-slate-600">{EMAIL}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ---------- bottom bar ---------- */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 py-6 text-sm text-slate-500">
          <p>&copy; {year} Arrowgo Logistics Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {/* TODO: link the approved privacy notice */}
            <a href="#privacy" className="ft-link">Privacy notice</a>
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="ft-top inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-brand-navy">
              Back to top <span className="ft-up"><Icon name="up" /></span>
            </button>
          </div>
        </div>
      </div>

      {/* cropped wordmark */}
      <div className="ft-mark" aria-hidden="true">ARROWGO</div>
    </footer>
  );
}