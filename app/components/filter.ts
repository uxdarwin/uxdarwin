"use client";

import { useSyncExternalStore } from "react";
import type { Brand } from "../content/profile";

// Company filter shared by the Experience card ("Show projects") and the feed.
// Mirrored to ?company= so a filtered feed can be linked to.
let current: Brand | null = null;
const listeners = new Set<() => void>();

function read(): Brand | null {
  if (typeof window === "undefined") return null;
  return (new URLSearchParams(window.location.search).get("company") as Brand | null) ?? null;
}

let booted = false;
function boot() {
  if (booted || typeof window === "undefined") return;
  booted = true;
  current = read();
  window.addEventListener("popstate", () => {
    current = read();
    listeners.forEach((l) => l());
  });
}

export function setCompany(brand: Brand | null) {
  boot();
  current = brand;
  const url = new URL(window.location.href);
  if (brand) url.searchParams.set("company", brand);
  else url.searchParams.delete("company");
  window.history.replaceState(window.history.state, "", url);
  listeners.forEach((l) => l());
}

export function useCompany() {
  return useSyncExternalStore(
    (cb) => {
      boot();
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => {
      boot();
      return current;
    },
    () => null,
  );
}
