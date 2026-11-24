"use client";

import { useEffect, useState } from "react";
import type { Tenure } from "../content/profile";

function monthsFor(t: Tenure, now: Date) {
  if (t.kind === "fixed") return t.months;
  // Inclusive month count, the way LinkedIn shows tenure.
  return (now.getFullYear() - t.start.year) * 12 + (now.getMonth() + 1 - t.start.month) + 1;
}

export function formatTenure(months: number) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts: string[] = [];
  if (y) parts.push(`${y} ${y === 1 ? "yr" : "yrs"}`);
  if (m) parts.push(`${m} ${m === 1 ? "mo" : "mos"}`);
  return parts.join(" ") || "1 mo";
}

/** Ongoing roles are recomputed in the browser so the label never goes stale between deploys. */
export function TenureLabel({ tenure, className }: { tenure: Tenure; className?: string }) {
  const [label, setLabel] = useState(() => formatTenure(monthsFor(tenure, new Date())));
  useEffect(() => {
    if (tenure.kind === "ongoing") setLabel(formatTenure(monthsFor(tenure, new Date())));
  }, [tenure]);
  return (
    <span className={className} suppressHydrationWarning>
      {label}
    </span>
  );
}
