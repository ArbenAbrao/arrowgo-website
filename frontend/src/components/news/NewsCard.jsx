import React from "react";
import { Link } from "react-router-dom";
import { LOGO, TONES } from "../../data/solutionMeta";
import { formatDate } from "../../data/news";
import "../map/locations.css";
import "./news.css";

const CHIP = {
  Insights: "bg-[#2350d0] text-white",
  "Cold Chain": "bg-[#1a3594] text-white",
  Logistics: "bg-[#3f9a24] text-white",
  "Company News": "bg-white text-brand-navy",
};

export function Cover({ article, index = 0, className = "" }) {
  return (
    <div className={`${className.includes("absolute") ? "" : "relative"} overflow-hidden bg-gradient-to-br ${TONES[index % TONES.length]} ${className}`}>
      {article.image ? (
        <img src={article.image} alt="" loading="lazy" className="nw-img h-full w-full object-cover" />
      ) : (
        <>
          <div className="nw-img-dots absolute inset-0" />
          <img src={LOGO} alt="" aria-hidden="true" onError={(e) => (e.currentTarget.style.display = "none")}
            className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 object-contain opacity-50" />
        </>
      )}
    </div>
  );
}

function Chip({ category }) {
  return <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${CHIP[category] || CHIP.Insights}`}>{category}</span>;
}

function Meta({ article, light = false }) {
  return (
    <p className={`text-xs ${light ? "text-white/80" : "text-slate-500"}`}>
      {formatDate(article.date)} <span className="mx-1.5">&bull;</span> {article.readTime}
    </p>
  );
}

// variant: "featured" (big image card), "compact" (horizontal), "default" (vertical grid card)
export default function NewsCard({ article, index = 0, variant = "default" }) {
  const to = `/news/${article.slug}`;

  if (variant === "featured") {
    return (
      <Link to={to} className="nw-card group flex h-full min-h-[440px] overflow-hidden rounded-2xl border border-slate-200">
        <Cover article={article} index={index} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1640]/95 via-[#0a1640]/50 to-transparent" />
        <div className="relative mt-auto p-7 text-white md:p-9">
          <div className="flex items-center gap-3"><Chip category={article.category} /><Meta article={article} light /></div>
          <h3 className="nw-title mt-4 inline text-2xl leading-snug md:text-3xl">{article.title}</h3>
          <p className="mt-4 max-w-xl text-slate-200">{article.excerpt}</p>
          <span className="mt-5 inline-block font-medium text-emerald-300">Read article <span className="nw-arrow">&rarr;</span></span>
        </div>
        <div className="nw-shine" />
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link to={to} className="nw-card group flex h-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <Cover article={article} index={index} className="w-32 flex-none sm:w-40" />
        <div className="flex flex-1 flex-col justify-center p-4">
          <div className="flex items-center gap-2"><Chip category={article.category} /></div>
          <h3 className="nw-title mt-2 self-start text-base font-semibold leading-snug text-brand-navy">{article.title}</h3>
          <div className="mt-2"><Meta article={article} /></div>
        </div>
        <div className="nw-shine" />
      </Link>
    );
  }

  return (
    <Link to={to} className="nw-card group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="relative">
        <Cover article={article} index={index} className="h-48" />
        <span className="absolute left-4 top-4"><Chip category={article.category} /></span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Meta article={article} />
        <h3 className="nw-title mt-2 self-start text-lg font-semibold leading-snug text-brand-navy">{article.title}</h3>
        <p className="mt-2 text-sm text-slate-600">{article.excerpt}</p>
        <span className="mt-auto pt-4 font-medium text-brand-blue">Read more <span className="nw-arrow">&rarr;</span></span>
      </div>
      <div className="nw-shine" />
    </Link>
  );
}