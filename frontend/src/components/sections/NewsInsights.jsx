import React from "react";
import { Link } from "react-router-dom";
import SectionHeading from "../ui/SectionHeading";
import NewsCard from "../news/NewsCard";
import { useReveal } from "../../hooks/useReveal";
import { sortedArticles } from "../../data/news";
import "../map/locations.css";
import "../news/news.css";

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal(0.1);
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`reveal ${visible ? "visible" : ""} ${className}`}>{children}</div>;
}

export default function NewsInsights() {
  const [featured, ...rest] = sortedArticles;
  const side = rest.slice(0, 3);

  return (
    <section id="news" className="nw-section relative overflow-hidden py-24">
      <div className="nw-dots pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="nw-orb pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#2350d0]/10 blur-3xl" aria-hidden="true" />
      <div className="nw-orb pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#3f9a24]/10 blur-3xl" style={{ animationDelay: "-6s" }} aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-end">
          <SectionHeading eyebrow="Stay informed" title="News & Insights"
            intro="Company updates and practical ideas to help you get more from your supply chain." />
          <Link to="/news" className="nw-link mb-10 inline-flex flex-none items-center rounded-full border border-brand-navy px-5 py-2 text-sm font-medium text-brand-navy transition hover:bg-brand-navy hover:text-white">
            View all news <span className="nw-arrow ml-2">&rarr;</span>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3"><NewsCard article={featured} variant="featured" /></Reveal>
          <div className="flex flex-col gap-4 lg:col-span-2">
            {side.map((a, i) => (
              <Reveal key={a.slug} delay={(i + 1) * 120} className="flex-1">
                <NewsCard article={a} index={i + 1} variant="compact" />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}