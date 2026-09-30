import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import NewsCard from "../components/news/NewsCard";
import { useReveal } from "../hooks/useReveal";
import { sortedArticles, categories } from "../data/news";
import "../components/map/locations.css";
import "../components/news/news.css";

export default function News() {
  const [cat, setCat] = useState("");
  const [ref, visible] = useReveal();
  useEffect(() => window.scrollTo(0, 0), []);

  const list = useMemo(() => (cat ? sortedArticles.filter((a) => a.category === cat) : sortedArticles), [cat]);
  const chip = (on) => `rounded-full border border-brand-navy px-4 py-1.5 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95 ${on ? "bg-brand-navy text-white shadow-md" : "bg-white text-brand-navy"}`;

  return (
    <main className="nw-section relative overflow-hidden pb-24 pt-28">
      <div className="nw-dots pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="nw-orb pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-[#2350d0]/10 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-6">
        <Link to="/" className="nw-link text-sm text-brand-blue"><span className="mr-1 inline-block">&larr;</span> Back to home</Link>

        <header ref={ref} className={`reveal mt-4 max-w-2xl ${visible ? "visible" : ""}`}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[.2em] text-brand-green">Stay informed</p>
          <h1 className="text-4xl md:text-5xl text-brand-navy">News & Insights</h1>
          <span className={`mt-4 block h-1 rounded-full bg-brand-green transition-all duration-700 ${visible ? "w-16" : "w-0"}`} />
          <p className="mt-4 text-slate-600">Company updates and practical ideas to help you get more from your supply chain.</p>
        </header>

        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter articles by category">
          <button onClick={() => setCat("")} aria-pressed={cat === ""} className={chip(cat === "")}>All</button>
          {categories.map((c) => (
            <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={chip(cat === c)}>{c}</button>
          ))}
        </div>

        <div key={cat} className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((a, i) => (
            <div key={a.slug} className="nw-pop" style={{ animationDelay: `${i * 80}ms` }}>
              <NewsCard article={a} index={i} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}