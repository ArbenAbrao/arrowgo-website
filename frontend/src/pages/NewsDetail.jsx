import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NewsCard, { Cover } from "../components/news/NewsCard";
import { useReveal } from "../hooks/useReveal";
import { articles, sortedArticles, formatDate } from "../data/news";
import "../components/map/locations.css";
import "../components/news/news.css";

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal(0.08);
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`reveal ${visible ? "visible" : ""} ${className}`}>{children}</div>;
}

export default function NewsDetail() {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);
  const [copied, setCopied] = useState(false);
  const bar = useRef(null);

  // Start at the top for each article, and drive the reading-progress bar
  useEffect(() => {
    window.scrollTo(0, 0);
    setCopied(false);
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? Math.min(1, window.scrollY / h) : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  if (!article) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-32">
        <h1 className="text-3xl text-brand-navy">Article not found</h1>
        <Link to="/news" className="mt-4 inline-block text-brand-blue underline">Back to all news</Link>
      </main>
    );
  }

  const index = sortedArticles.findIndex((a) => a.slug === slug);
  const related = sortedArticles.filter((a) => a.slug !== slug).slice(0, 3);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <main className="nw-section relative overflow-hidden pb-24 pt-28">
      <div ref={bar} className="nw-progress" aria-hidden="true" />
      <div className="nw-dots pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="nw-orb pointer-events-none absolute -right-24 top-32 h-80 w-80 rounded-full bg-[#2350d0]/10 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-4xl px-6">
        <Link to="/news" className="nw-link text-sm text-brand-blue"><span className="mr-1 inline-block">&larr;</span> All news</Link>

        <Reveal className="mt-4">
          <div className="relative overflow-hidden rounded-3xl">
            <Cover article={article} index={index} className="h-72 md:h-96" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1640]/90 via-[#0a1640]/35 to-transparent" />
            <div className="absolute bottom-0 p-6 text-white md:p-10">
              <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ring-1 ring-white/30 backdrop-blur">{article.category}</span>
              <h1 className="mt-4 max-w-2xl text-2xl leading-snug md:text-4xl">{article.title}</h1>
            </div>
          </div>
        </Reveal>

        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <p>{formatDate(article.date)} <span className="mx-1.5">&bull;</span> {article.readTime}</p>
          <div className="flex gap-2">
            <button onClick={copy} className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-slate-700 transition hover:border-brand-blue hover:text-brand-blue active:scale-95">
              {copied ? "Link copied" : "Copy link"}
            </button>
            <a href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
              className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-slate-700 transition hover:border-brand-blue hover:text-brand-blue active:scale-95">
              Email
            </a>
          </div>
        </div>

        <Reveal className="mx-auto mt-6 max-w-3xl">
          <p className="border-l-4 border-brand-green pl-4 text-xl leading-relaxed text-brand-navy">{article.excerpt}</p>
          {article.body.map((b, i) =>
            b.startsWith("## ") ? (
              <h2 key={i} className="mt-10 text-2xl text-brand-navy">{b.slice(3)}</h2>
            ) : (
              <p key={i} className="mt-4 text-lg leading-relaxed text-slate-700">{b}</p>
            )
          )}
        </Reveal>

        <Reveal className="mx-auto mt-14 max-w-3xl">
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#1a3594] to-[#2350d0] p-7 text-white md:flex-row md:items-center">
            <div>
              <h3 className="text-xl">Need a logistics partner you can count on?</h3>
              <p className="mt-1 text-slate-200">Tell us what you need to move or store.</p>
            </div>
            <Link to="/#contact" className="nw-link inline-flex flex-none items-center rounded-full bg-white px-6 py-2.5 font-medium text-brand-navy transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95">
              Talk to us <span className="nw-arrow ml-2">&rarr;</span>
            </Link>
          </div>
        </Reveal>

        <Reveal className="mt-16">
          <h2 className="text-2xl md:text-3xl text-brand-navy">More to read</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((a, i) => <NewsCard key={a.slug} article={a} index={i} />)}
          </div>
        </Reveal>
      </div>
    </main>
  );
}