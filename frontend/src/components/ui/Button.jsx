import React from "react";
import { Link } from "react-router-dom";

const styles = {
  primary: "bg-brand-blue text-white hover:bg-brand-navy",
  ghost: "text-brand-navy hover:text-brand-blue",
  outline: "border border-brand-navy text-brand-navy hover:bg-brand-mist",
};

export default function Button({ to, href, variant = "primary", className = "", children, ...rest }) {
  const cls = `inline-flex items-center px-6 py-3 rounded-md font-medium transition-colors ${styles[variant]} ${className}`;
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>;
  return <button className={cls} {...rest}>{children}</button>;
}