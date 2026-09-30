import React from "react";
import { useReveal } from "../../hooks/useReveal";

export default function SectionHeading({ eyebrow, title, intro, light = false }) {
  const [ref, visible] = useReveal();
  return (
    <header ref={ref} className={`max-w-2xl mb-10 reveal ${visible ? "visible" : ""}`}>
      {eyebrow && (
        <p className={`text-xs font-semibold uppercase tracking-[.2em] mb-3 ${light ? "text-emerald-300" : "text-brand-green"}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`text-3xl md:text-4xl ${light ? "text-white" : "text-brand-navy"}`}>{title}</h2>
      <span className={`block mt-4 h-1 rounded-full transition-all duration-700 ${visible ? "w-16" : "w-0"} ${light ? "bg-emerald-300" : "bg-brand-green"}`} />
      {intro && <p className={`mt-4 ${light ? "text-slate-300" : "text-slate-600"}`}>{intro}</p>}
    </header>
  );
}