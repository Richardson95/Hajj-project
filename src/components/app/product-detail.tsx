"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  ChevronLeft,
  Clock,
  Heart,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Store,
  Truck,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, Pill } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { DataRow } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { Icon } from "@/components/icon";
import { ProductCard } from "./product-card";
import { useApp } from "@/lib/store";
import { CATEGORY_META, vendorById } from "@/lib/data/marketplace";
import { naira, riyal } from "@/lib/format";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/cn";

export function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { addToCart, savedProducts, toggleSaved } = useApp();
  const { toast } = useToast();
  const [qty, setQty] = useState(1);

  const vendor = vendorById(product.vendorId);
  const meta = CATEGORY_META[product.category];
  const saved = savedProducts.includes(product.id);

  return (
    <>
      <Link
        href="/app/marketplace"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-ink"
      >
        <ChevronLeft className="size-4" />
        Marketplace
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        {/* Visual */}
        <div className="space-y-4">
          <div
            className={cn(
              "relative grid aspect-square place-items-center overflow-hidden rounded-3xl bg-linear-to-br text-white",
              product.tone,
            )}
          >
            <div className="pattern-islamic absolute inset-0 opacity-40" />
            <Icon name={product.icon} className="relative size-32 opacity-90" />
            {product.compareAtSAR ? (
              <span className="absolute top-4 left-4 rounded-xl bg-gold-500 px-3 py-1.5 text-xs font-bold text-forest-950">
                Save {riyal(product.compareAtSAR - product.priceSAR)}
              </span>
            ) : null}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              {
                icon: Truck,
                label: "Delivery",
                value:
                  product.deliveryHours === 0
                    ? "On the ritual day"
                    : `${product.deliveryHours} hours`,
              },
              { icon: Package, label: "In stock", value: `${product.stock} units` },
              { icon: ShieldCheck, label: "Payment", value: "Escrow held" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-line bg-surface p-3.5 text-center"
              >
                <s.icon className="mx-auto size-4 text-forest-700 dark:text-gold-400" />
                <p className="mt-2 text-[0.625rem] tracking-wider text-muted uppercase">
                  {s.label}
                </p>
                <p className="mt-0.5 text-[0.8125rem] font-bold text-ink">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{meta.label}</Badge>
            {product.tags.map((t) => (
              <Pill key={t} tone="neutral">
                {t}
              </Pill>
            ))}
          </div>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <span className="tabular inline-flex items-center gap-1.5 text-sm font-bold text-gold-700 dark:text-gold-400">
              <Star className="size-4 fill-current" />
              {product.rating}
              <span className="font-normal text-muted">
                ({product.reviews.toLocaleString("en-NG")} reviews)
              </span>
            </span>
            <Link
              href="/app/marketplace"
              className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-ink"
            >
              <Store className="size-4" />
              {vendor.name}
              {vendor.verified ? (
                <BadgeCheck className="size-3.5 text-forest-700 dark:text-gold-400" />
              ) : null}
            </Link>
          </div>

          <div className="mt-6 flex items-end gap-3">
            <p className="tabular text-4xl font-extrabold tracking-tight text-ink">
              {riyal(product.priceSAR)}
            </p>
            {product.compareAtSAR ? (
              <p className="tabular mb-1 text-lg text-muted line-through">
                {riyal(product.compareAtSAR)}
              </p>
            ) : null}
          </div>
          <p className="tabular mt-1 text-sm text-muted">
            ≈ {naira(product.priceNGN)} at today&apos;s indicative rate
          </p>

          <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">
            {product.description}
          </p>

          {/* Quantity + cart */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl border border-line bg-surface">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="grid size-11 place-items-center rounded-l-xl text-muted transition hover:bg-surface-muted hover:text-ink"
              >
                <Minus className="size-4" />
              </button>
              <span className="tabular w-12 text-center text-sm font-bold text-ink">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                aria-label="Increase quantity"
                className="grid size-11 place-items-center rounded-r-xl text-muted transition hover:bg-surface-muted hover:text-ink"
              >
                <Plus className="size-4" />
              </button>
            </div>

            <Button
              size="lg"
              className="flex-1"
              onClick={() => {
                addToCart(product.id, qty);
                toast({
                  title: `${qty} × ${product.name} added`,
                  description: `${riyal(product.priceSAR * qty)} held in escrow at checkout.`,
                });
              }}
            >
              <ShoppingCart className="size-4" />
              Add to cart · {riyal(product.priceSAR * qty)}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => toggleSaved(product.id)}
              aria-pressed={saved}
              aria-label={saved ? "Remove from saved" : "Save for later"}
              className="px-4"
            >
              <Heart className={cn("size-4", saved && "fill-current text-rose-600")} />
            </Button>
          </div>

          <ButtonLink
            href="/app/marketplace/cart"
            variant="ghost"
            size="sm"
            className="mt-3"
          >
            Go to cart
          </ButtonLink>

          {/* Delivery zones */}
          <Card className="mt-6">
            <CardHeader
              title="Delivers to"
              description="Choose the exact drop-off point at checkout."
              icon={<Truck className="size-4" />}
            />
            <CardBody className="flex flex-wrap gap-2">
              {product.deliversTo.map((z) => (
                <Pill key={z} tone="positive">
                  {z}
                </Pill>
              ))}
            </CardBody>
          </Card>

          {/* Vendor */}
          <Card className="mt-4">
            <CardBody>
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "grid size-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br text-sm font-bold text-white",
                    vendor.tone,
                  )}
                >
                  {vendor.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                    {vendor.name}
                    {vendor.verified ? (
                      <BadgeCheck className="size-4 text-forest-700 dark:text-gold-400" />
                    ) : null}
                  </p>
                  <p className="text-xs text-muted">{vendor.location}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.6875rem] text-muted">
                    <span className="tabular inline-flex items-center gap-1 font-semibold text-gold-700 dark:text-gold-400">
                      <Star className="size-3 fill-current" />
                      {vendor.rating} ({vendor.ratingCount.toLocaleString("en-NG")})
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" />
                      {vendor.responseTime}
                    </span>
                    <span>On HajjPath since {vendor.since}</span>
                  </div>
                </div>
              </div>

              <dl className="mt-4 border-t border-line pt-2">
                <DataRow
                  label="Orders fulfilled"
                  value={vendor.fulfilled.toLocaleString("en-NG")}
                />
                <DataRow
                  label="Verification"
                  value={
                    vendor.verified
                      ? "Physically inspected this season"
                      : "Pending re-verification"
                  }
                />
                <DataRow
                  label="Categories"
                  value={vendor.categories
                    .map((c) => CATEGORY_META[c].label)
                    .join(", ")}
                />
              </dl>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Escrow note */}
      <Card className="mt-6 border-forest-700/25 bg-forest-50/50 dark:bg-forest-950/40">
        <CardBody className="flex flex-wrap items-center gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-forest-800 text-white">
            <ShieldCheck className="size-5" />
          </span>
          <p className="min-w-0 flex-1 text-xs leading-relaxed text-muted">
            <strong className="text-ink">How escrow works.</strong> When you pay, HajjPath
            holds the money. The vendor sees a confirmed order and dispatches. You confirm
            delivery in the app and the vendor is paid within 48 hours. If something is
            wrong, raise a dispute and HajjPath reviews it within one business day —
            refunds come from the escrow float, not from a negotiation at your hotel door.
          </p>
        </CardBody>
      </Card>

      {/* Related */}
      {related.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-lg font-bold text-ink">More in {meta.label}</h2>
          <p className="mt-0.5 mb-4 text-sm text-muted">{meta.blurb}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
