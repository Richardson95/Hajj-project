"use client";

import Link from "next/link";
import { BadgeCheck, Heart, Plus, Star, Truck } from "lucide-react";
import { Icon } from "@/components/icon";
import { Pill } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { vendorById } from "@/lib/data/marketplace";
import { naira, riyal } from "@/lib/format";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/cn";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, savedProducts, toggleSaved } = useApp();
  const { toast } = useToast();
  const vendor = vendorById(product.vendorId);
  const saved = savedProducts.includes(product.id);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition duration-300 hover:-translate-y-1 hover:border-forest-800/25 hover:shadow-[0_22px_50px_-36px_rgba(1,68,33,0.7)]">
      <Link
        href={`/app/marketplace/${product.id}`}
        className={cn(
          "relative grid aspect-4/3 place-items-center bg-linear-to-br text-white",
          product.tone,
        )}
      >
        <div className="pattern-islamic absolute inset-0 opacity-40" />
        <Icon name={product.icon} className="relative size-14 opacity-90" />
        {product.compareAtSAR ? (
          <span className="absolute top-2.5 left-2.5 rounded-lg bg-gold-500 px-2 py-1 text-[0.625rem] font-bold text-forest-950">
            Save {Math.round(((product.compareAtSAR - product.priceSAR) / product.compareAtSAR) * 100)}%
          </span>
        ) : null}
      </Link>

      <button
        type="button"
        onClick={() => toggleSaved(product.id)}
        aria-label={saved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
        aria-pressed={saved}
        className="absolute top-2.5 right-2.5 z-10"
      >
        <span
          className={cn(
            "grid size-8 place-items-center rounded-lg backdrop-blur-sm transition",
            saved ? "bg-rose-600 text-white" : "bg-black/25 text-white hover:bg-black/40",
          )}
        >
          <Heart className={cn("size-4", saved && "fill-current")} />
        </span>
      </button>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/app/marketplace/${product.id}`} className="min-w-0">
          <h3 className="line-clamp-2 text-[0.875rem] leading-snug font-semibold text-ink">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1 flex items-center gap-1 truncate text-[0.6875rem] text-muted">
          {vendor.name}
          {vendor.verified ? (
            <BadgeCheck className="size-3 shrink-0 text-forest-700 dark:text-gold-400" />
          ) : null}
        </p>

        <div className="mt-2 flex items-center gap-2 text-[0.6875rem]">
          <span className="tabular inline-flex items-center gap-1 font-semibold text-gold-700 dark:text-gold-400">
            <Star className="size-3 fill-current" />
            {product.rating}
          </span>
          <span className="text-muted">
            ({product.reviews.toLocaleString("en-NG")})
          </span>
          <span className="tabular ml-auto inline-flex items-center gap-1 text-muted">
            <Truck className="size-3" />
            {product.deliveryHours === 0 ? "On the day" : `${product.deliveryHours}h`}
          </span>
        </div>

        <div className="mt-3 flex items-end justify-between gap-2 border-t border-line pt-3">
          <div className="min-w-0">
            <p className="tabular text-base font-extrabold text-ink">
              {riyal(product.priceSAR)}
            </p>
            <p className="tabular truncate text-[0.6875rem] text-muted">
              ≈ {naira(product.priceNGN)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              addToCart(product.id);
              toast({
                title: "Added to cart",
                description: `${product.name} · ${riyal(product.priceSAR)}`,
              });
            }}
            aria-label={`Add ${product.name} to cart`}
            className="grid size-9 shrink-0 place-items-center rounded-xl bg-forest-800 text-white transition hover:bg-forest-700 dark:bg-forest-600 dark:hover:bg-forest-500"
          >
            <Plus className="size-4" />
          </button>
        </div>

        {product.stock < 120 ? (
          <p className="mt-2">
            <Pill tone="warning">Only {product.stock} left</Pill>
          </p>
        ) : null}
      </div>
    </article>
  );
}
