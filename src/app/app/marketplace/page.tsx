"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  ChevronRight,
  Clock,
  Coins,
  Heart,
  Package,
  Search,
  ShieldCheck,
  ShoppingCart,
  Star,
  Store,
  Truck,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/ui/misc";
import { TextInput, Select } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/tabs";
import { Icon } from "@/components/icon";
import { ProductCard } from "@/components/app/product-card";
import { useApp, useCartSummary } from "@/lib/store";
import { CATEGORY_META, PRODUCTS, VENDORS } from "@/lib/data/marketplace";
import { riyal } from "@/lib/format";
import type { ProductCategory } from "@/lib/types";
import { cn } from "@/lib/cn";

type Sort = "popular" | "price-low" | "price-high" | "fastest";

const SORTS: { id: Sort; label: string }[] = [
  { id: "popular", label: "Most popular" },
  { id: "price-low", label: "Price: low to high" },
  { id: "price-high", label: "Price: high to low" },
  { id: "fastest", label: "Fastest delivery" },
];

const CATEGORIES = Object.keys(CATEGORY_META) as ProductCategory[];

export default function MarketplacePage() {
  const { savedProducts } = useApp();
  const { itemCount, totalSAR } = useCartSummary();

  const [category, setCategory] = useState<ProductCategory | "all" | "saved">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("popular");

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = PRODUCTS.filter((p) => {
      if (category === "saved") return savedProducts.includes(p.id);
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-low") return a.priceSAR - b.priceSAR;
      if (sort === "price-high") return b.priceSAR - a.priceSAR;
      if (sort === "fastest") return a.deliveryHours - b.deliveryHours;
      return b.reviews - a.reviews;
    });
  }, [category, query, sort, savedProducts]);

  return (
    <>
      <PageHeader
        title="Makkah marketplace"
        description="Verified vendors in Makkah and Madinah, delivering to your hotel, Aziziyah or your Mina tent."
        action={
          <ButtonLink href="/app/marketplace/cart">
            <ShoppingCart className="size-4" />
            Cart
            {itemCount > 0 ? (
              <span className="tabular ml-1 rounded-md bg-white/20 px-1.5 py-0.5 text-[0.6875rem] font-bold">
                {itemCount}
              </span>
            ) : null}
          </ButtonLink>
        }
      />

      {/* Escrow banner */}
      <Card className="mb-5 border-forest-700/25 bg-forest-50/50 dark:bg-forest-950/40">
        <CardBody className="flex flex-wrap items-center gap-4 py-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-forest-800 text-white">
            <ShieldCheck className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">Every order is escrow protected</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted">
              Your payment is held by HajjPath and released to the vendor only after you
              confirm delivery. Vendors are physically inspected and re-verified each
              season.
            </p>
          </div>
          {itemCount > 0 ? (
            <ButtonLink href="/app/marketplace/cart" variant="outline" size="sm">
              {itemCount} in cart · {riyal(totalSAR)}
            </ButtonLink>
          ) : null}
        </CardBody>
      </Card>

      {/* Categories */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {CATEGORIES.map((c) => {
          const meta = CATEGORY_META[c];
          const count = PRODUCTS.filter((p) => p.category === c).length;
          const on = category === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(on ? "all" : c)}
              aria-pressed={on}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border p-3.5 text-center transition",
                on
                  ? "border-forest-700 bg-forest-50 ring-2 ring-forest-800/15 dark:bg-forest-950/60"
                  : "border-line bg-surface hover:border-forest-800/30",
              )}
            >
              <span
                className={cn(
                  "grid size-10 place-items-center rounded-xl bg-linear-to-br text-white",
                  meta.tone,
                )}
              >
                <Icon name={meta.icon} className="size-5" />
              </span>
              <span className="text-[0.6875rem] leading-tight font-semibold text-ink">
                {meta.label}
              </span>
              <span className="tabular text-[0.625rem] text-muted">{count} items</span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="mt-5">
        <CardBody className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1 lg:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <TextInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Ihram, dates, power bank…"
              className="pl-9"
              aria-label="Search the marketplace"
            />
          </div>

          <SegmentedControl
            size="sm"
            items={[
              { id: "all", label: "All", count: PRODUCTS.length },
              { id: "saved", label: "Saved", count: savedProducts.length },
            ]}
            value={category === "saved" ? "saved" : "all"}
            onChange={(v) => setCategory(v === "saved" ? "saved" : "all")}
            className="w-auto"
          />

          <div className="lg:ml-auto lg:w-56">
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              aria-label="Sort products"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Grid */}
      <div className="mt-5">
        <p className="mb-4 text-sm text-muted">
          {products.length} {products.length === 1 ? "product" : "products"}
          {category !== "all" && category !== "saved"
            ? ` in ${CATEGORY_META[category].label}`
            : ""}
        </p>

        {products.length === 0 ? (
          <EmptyState
            icon={category === "saved" ? <Heart className="size-6" /> : <Package className="size-6" />}
            title={category === "saved" ? "Nothing saved yet" : "No products matched"}
            description={
              category === "saved"
                ? "Tap the heart on any product to keep it here for later."
                : "Try a different category or clear your search."
            }
            action={
              <Button variant="outline" onClick={() => { setCategory("all"); setQuery(""); }}>
                Show everything
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* Vendors */}
      <Card className="mt-8">
        <CardHeader
          title="Verified vendors"
          description="Physically inspected in Makkah and Madinah, re-verified every season."
          icon={<Store className="size-4" />}
          action={
            <ButtonLink href="/app/marketplace/orders" variant="ghost" size="sm">
              My orders
              <ChevronRight className="size-3.5" />
            </ButtonLink>
          }
        />
        <CardBody className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VENDORS.map((v) => (
            <div
              key={v.id}
              className="flex items-start gap-3 rounded-2xl border border-line bg-surface-muted/50 p-4"
            >
              <span
                className={cn(
                  "grid size-11 shrink-0 place-items-center rounded-xl bg-linear-to-br text-sm font-bold text-white",
                  v.tone,
                )}
              >
                {v.name.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 truncate text-[0.8125rem] font-bold text-ink">
                  {v.name}
                  {v.verified ? (
                    <BadgeCheck className="size-3.5 shrink-0 text-forest-700 dark:text-gold-400" />
                  ) : null}
                </p>
                <p className="truncate text-xs text-muted">{v.location}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6875rem] text-muted">
                  <span className="tabular inline-flex items-center gap-1 font-semibold text-gold-700 dark:text-gold-400">
                    <Star className="size-3 fill-current" />
                    {v.rating}
                  </span>
                  <span className="tabular">
                    {v.fulfilled.toLocaleString("en-NG")} orders
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3" />
                    {v.responseTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Delivery info */}
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Truck,
            title: "Delivery to where you are",
            body: "Hotel rooms in Makkah and Madinah, Aziziyah flats, and directly to your Mina tent during Tashriq.",
          },
          {
            icon: ShieldCheck,
            title: "Escrow settlement",
            body: "Money leaves escrow only when you confirm delivery, or 72 hours after an undisputed delivery.",
          },
          {
            icon: Coins,
            title: "Dual currency",
            body: "Every price is shown in Saudi Riyal and the Naira equivalent so you always know what you are spending.",
          },
        ].map((f) => (
          <Card key={f.title}>
            <CardBody>
              <span className="grid size-10 place-items-center rounded-xl bg-forest-50 text-forest-800 dark:bg-forest-950 dark:text-gold-300">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-[0.9375rem] font-bold text-ink">{f.title}</h3>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">{f.body}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </>
  );
}
