import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";

// [label, href, section id used for the active-link highlight]
const links = [
  ["Solutions", "/#solutions", "solutions"],
  ["Locations", "/#locations", "locations"],
  ["Facilities", "/#facilities", "facilities"],
  ["About", "/#about", "about"],
  ["News", "/#news", "news"],
];
// Sections watched while scrolling the home page ("clients" clears the highlight)
const WATCH = ["solutions", "clients", "locations", "facilities", "about", "news"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(null);
  const [pill, setPill] = useState({ left: 0, width: 0, show: false });
  const linkRefs = useRef({});
  const listRef = useRef(null);
  const { pathname } = useLocation();

  // Shrink + solidify after scrolling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change or Escape
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Scroll-spy: highlight the section in view (home page), or News on /news pages
  useEffect(() => {
    if (pathname.startsWith("/news")) { setActive("news"); return undefined; }
    if (pathname !== "/") { setActive(null); return undefined; }
    const els = WATCH.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length || !("IntersectionObserver" in window)) return undefined;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id === "clients" ? null : e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    const onTop = () => window.scrollY < 200 && setActive(null);
    window.addEventListener("scroll", onTop, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", onTop); };
  }, [pathname]);

  // Slide the highlight pill under the active link
  useLayoutEffect(() => {
    const place = () => {
      const el = linkRefs.current[active];
      const list = listRef.current;
      if (!el || !list) return setPill((p) => ({ ...p, show: false }));
      const a = el.getBoundingClientRect();
      const b = list.getBoundingClientRect();
      setPill({ left: a.left - b.left, width: a.width, show: true });
    };
    place();
    const t = setTimeout(place, 1200); // re-measure once the entrance animation has finished
    window.addEventListener("resize", place);
    return () => { clearTimeout(t); window.removeEventListener("resize", place); };
  }, [active]);

  return (
    <header
      className={`nav-bar nav-enter fixed top-0 inset-x-0 z-30 border-b ${
        scrolled
          ? "nav-scrolled bg-white/90 backdrop-blur-xl border-slate-200 shadow-[0_10px_30px_-14px_rgba(26,53,148,.35)]"
          : "bg-white/60 backdrop-blur-md border-transparent"
      }`}
    >
      <nav className={`nav-inner mx-auto max-w-6xl flex items-center justify-between px-6 ${scrolled ? "py-2" : "py-3.5"}`} aria-label="Main">
        <Link to="/" className="nav-brand flex items-center gap-3" aria-label="Arrowgo Logistics Inc. home">
          <img src="/LOGO2.png" alt="" className={`nav-logo-img w-auto ${scrolled ? "h-8" : "h-10"}`} />
          <span className="leading-tight">
            <span className="nav-brand-text block text-xl font-bold tracking-wide">ARROWGO</span>
            <span className="block text-[10px] tracking-[0.35em] text-brand-navy">LOGISTICS INC.</span>
          </span>
        </Link>

        {/* desktop */}
        <div className="hidden md:flex items-center gap-4">
          <ul ref={listRef} className="relative flex items-center text-sm text-slate-700">
            <span aria-hidden="true" className="nav-pill" style={{ left: pill.left, width: pill.width, opacity: pill.show ? 1 : 0 }} />
            {links.map(([label, href, id], i) => (
              <li key={href} className="nav-item" style={{ "--i": i }}>
                <a href={href} ref={(n) => (linkRefs.current[id] = n)} aria-current={active === id ? "true" : undefined}
                  className={`nav-link relative z-10 block rounded-full px-4 py-2 ${active === id ? "font-medium text-brand-navy" : ""}`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a href="/#contact" className="nav-cta nav-item inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-white" style={{ "--i": links.length }}>
            <span className="nav-dot h-1.5 w-1.5 rounded-full bg-emerald-300" aria-hidden="true" />
            Contact us <span className="nav-arrow" aria-hidden="true">&rarr;</span>
          </a>
        </div>

        {/* mobile toggle */}
        <button className="nav-burger md:hidden p-2 text-brand-navy" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
      </nav>

      {/* mobile panel */}
      <div id="menu" className={`nav-panel md:hidden absolute top-full inset-x-0 border-b border-slate-200 bg-white/95 backdrop-blur-xl p-6 shadow-lg ${open ? "open" : ""}`}>
        <ul className="space-y-1 text-lg text-slate-700">
          {links.map(([label, href, id], i) => (
            <li key={href} style={{ "--i": i }}>
              <a href={href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}
                className={`block rounded-lg px-3 py-2.5 transition-colors hover:bg-brand-mist ${active === id ? "bg-brand-mist font-medium text-brand-navy" : ""}`}>
                {label}
              </a>
            </li>
          ))}
          <li style={{ "--i": links.length }} className="pt-3">
            <a href="/#contact" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}
              className="nav-cta flex items-center justify-center gap-2 rounded-full px-5 py-3 font-medium text-white">
              Contact us <span className="nav-arrow" aria-hidden="true">&rarr;</span>
            </a>
          </li>
        </ul>
      </div>

      <span className="nav-line" aria-hidden="true" />
    </header>
  );
}