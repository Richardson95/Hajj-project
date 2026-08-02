"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * `false` during server render and the hydration pass, `true` afterwards.
 * Lets a component read browser-only state without a setState-in-effect.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

function subscribeScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

/** Tracks whether the window has scrolled past a threshold. */
export function useScrolledPast(threshold = 8): boolean {
  return useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > threshold,
    () => false,
  );
}

function subscribeMedia(query: string) {
  return (callback: () => void) => {
    const media = window.matchMedia(query);
    media.addEventListener("change", callback);
    return () => media.removeEventListener("change", callback);
  };
}

const DARK_QUERY = "(prefers-color-scheme: dark)";
const subscribeDark = subscribeMedia(DARK_QUERY);

/** Tracks the operating system colour-scheme preference. */
export function usePrefersDark(): boolean {
  return useSyncExternalStore(
    subscribeDark,
    () => window.matchMedia(DARK_QUERY).matches,
    () => false,
  );
}
