import React, { useState } from "react";
import { Link } from "react-router-dom";

const links = [
  ["Solutions", "/#solutions"],
  ["Locations", "/#locations"],
  ["Facilities", "/#facilities"],
  ["About", "/#about"],
  ["News", "/#news"],
  ["Contact", "/#contact"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
      <nav className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3" aria-label="Main">
        <Link to="/" className="flex items-center gap-3" aria-label="Arrowgo Logistics Inc. home">
          <img src="/LOGO2.png" alt="" className="h-10 w-auto" />
          <span className="leading-tight">
            <span className="block text-xl font-bold tracking-wide text-brand-navy">ARROWGO</span>
            <span className="block text-[10px] tracking-[0.35em] text-brand-navy">LOGISTICS INC.</span>
          </span>
        </Link>
        <button
          className="md:hidden text-brand-navy"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen(!open)}
        >
          Menu
        </button>
        <ul
          id="menu"
          className={`${open ? "flex" : "hidden"} md:flex flex-col md:flex-row gap-6 absolute md:static top-full inset-x-0 bg-white md:bg-transparent border-b md:border-0 border-slate-200 p-6 md:p-0 text-slate-700`}
        >
          {links.map(([label, href]) => (
            <li key={href}>
              <a href={href} onClick={() => setOpen(false)} className="hover:text-brand-blue">{label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}