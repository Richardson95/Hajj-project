"use client";

import { useCallback, useMemo } from "react";
import { useOps } from "./ops/store";
import type { HajjPackage, Product, Vendor } from "./types";

/**
 * Read hooks for everything the operations team edits. Pilgrim-facing client
 * components read through these instead of importing seed data directly, so
 * an admin change shows up across the app immediately.
 */

const FALLBACK_VENDOR: Vendor = {
  id: "unknown",
  name: "HajjPath Marketplace",
  location: "Makkah",
  rating: 0,
  ratingCount: 0,
  verified: true,
  since: 2026,
  categories: [],
  tone: "from-forest-700 to-forest-900",
  responseTime: "Handled by HajjPath",
  fulfilled: 0,
};

export function useCatalog() {
  const { products: all, vendors: opsVendors, hiddenProducts } = useOps();

  const vendors = useMemo<Vendor[]>(
    () => opsVendors.filter((v) => v.status === "approved"),
    [opsVendors],
  );

  /** What pilgrims can see and buy: not hidden, and from an active vendor. */
  const products = useMemo<Product[]>(
    () =>
      all.filter(
        (p) => !hiddenProducts.includes(p.id) && vendors.some((v) => v.id === p.vendorId),
      ),
    [all, hiddenProducts, vendors],
  );

  const productById = useCallback(
    (id: string): Product | undefined => all.find((p) => p.id === id),
    [all],
  );

  const vendorById = useCallback(
    (id: string): Vendor => opsVendors.find((v) => v.id === id) ?? FALLBACK_VENDOR,
    [opsVendors],
  );

  return { products, allProducts: all, vendors, productById, vendorById };
}

export function usePackages() {
  const { packages } = useOps();
  const packageById = useCallback(
    (id: string): HajjPackage => packages.find((p) => p.id === id) ?? packages[0],
    [packages],
  );
  return { packages, packageById };
}

export function useChecklist() {
  return useOps().checklist;
}

export function useItinerary() {
  return useOps().itinerary;
}

export function useGroup() {
  return useOps().group;
}
