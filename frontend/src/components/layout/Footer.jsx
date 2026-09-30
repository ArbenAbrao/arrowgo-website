import React from "react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-50 border-t border-slate-200 text-slate-600">
      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-10 md:grid-cols-3 items-start">
        <div>
          <img src="/LOGO3.png" alt="Arrowgo Logistics Inc. - moving excellence!" className="h-24 w-auto" />
        </div>
        <div className="text-sm">
          <p className="text-brand-navy text-base">Contact</p>
          {/* TODO: verified contact details only */}
          <p className="mt-2">Email: TODO</p>
          <p>Phone: TODO</p>
          <p>Address: TODO</p>
        </div>
        <div className="text-sm">
          <p className="text-brand-navy text-base">Policies</p>
          {/* TODO: link approved policy pages (e.g. privacy notice) */}
          <p className="mt-2"><a href="#privacy" className="hover:text-brand-blue">Privacy notice</a></p>
        </div>
      </div>
    </footer>
  );
}