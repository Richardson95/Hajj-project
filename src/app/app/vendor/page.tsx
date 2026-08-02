"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  ChartLine,
  CircleCheck,
  Clock,
  HandCoins,
  Package,
  Plus,
  Star,
  Store,
  Truck,
  Users,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader, Stat } from "@/components/ui/misc";
import { ProgressBar } from "@/components/ui/progress";
import { SegmentedControl } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { Icon } from "@/components/icon";
import {
  CATEGORY_META,
  ORDER_STATUS_META,
  PRODUCTS,
  VENDOR_ORDERS,
  VENDORS,
} from "@/lib/data/marketplace";
import { formatDateTime, naira, riyal } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/cn";

type Filter = "all" | "open" | "delivered" | "cancelled";

const VENDOR = VENDORS[0];

export default function VendorPortalPage() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<Filter>("all");

  const catalogue = PRODUCTS.filter((p) => p.vendorId === VENDOR.id);

  const orders = useMemo(
    () =>
      VENDOR_ORDERS.filter((o) => {
        if (filter === "open")
          return ["escrow-held", "preparing", "out-for-delivery"].includes(o.status);
        if (filter === "delivered") return o.status === "delivered";
        if (filter === "cancelled") return o.status === "cancelled";
        return true;
      }),
    [filter],
  );

  const grossSAR = VENDOR_ORDERS.filter((o) => o.status !== "cancelled").reduce(
    (s, o) => s + o.amountSAR,
    0,
  );
  const commission = Math.round(grossSAR * 0.08);
  const payout = grossSAR - commission;
  const pending = VENDOR_ORDERS.filter((o) =>
    ["escrow-held", "preparing", "out-for-delivery"].includes(o.status),
  ).length;

  return (
    <>
      <PageHeader
        title="Vendor portal"
        description="Orders, catalogue and settlement for your Makkah storefront."
        action={
          <Button
            onClick={() =>
              toast({
                title: "Product listing opened",
                description: "Add a name, Riyal price, stock level and delivery zones.",
                tone: "info",
              })
            }
          >
            <Plus className="size-4" />
            List a product
          </Button>
        }
      />

      {/* Vendor header */}
      <Card className="mb-5 overflow-hidden">
        <div className={cn("relative bg-linear-to-br p-6 text-white sm:p-7", VENDOR.tone)}>
          <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-35" />
          <div className="relative flex flex-wrap items-center gap-5">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white/15 text-xl font-extrabold backdrop-blur-sm">
              {VENDOR.name.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="flex flex-wrap items-center gap-2 text-2xl font-extrabold">
                {VENDOR.name}
                {VENDOR.verified ? <BadgeCheck className="size-5" /> : null}
              </h2>
              <p className="mt-1 text-sm text-white/70">{VENDOR.location}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-white/65">
                <span className="tabular inline-flex items-center gap-1.5 font-semibold">
                  <Star className="size-3.5 fill-current" />
                  {VENDOR.rating} ({VENDOR.ratingCount.toLocaleString("en-NG")} reviews)
                </span>
                <span className="tabular">
                  {VENDOR.fulfilled.toLocaleString("en-NG")} orders fulfilled
                </span>
                <span>On HajjPath since {VENDOR.since}</span>
              </div>
            </div>
            <Badge tone="gold" className="bg-white/20 text-white ring-white/30">
              Verified this season
            </Badge>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Gross this season"
          value={riyal(grossSAR)}
          detail={`≈ ${naira(grossSAR * 2150)} at today's rate`}
          icon={<ChartLine className="size-4" />}
        />
        <Stat
          label="Net payout"
          value={riyal(payout)}
          detail={`After ${riyal(commission)} platform commission (8%)`}
          icon={<HandCoins className="size-4" />}
          tone="positive"
        />
        <Stat
          label="Open orders"
          value={pending}
          detail="Awaiting preparation or delivery"
          icon={<Package className="size-4" />}
          tone="gold"
        />
        <Stat
          label="Products listed"
          value={catalogue.length}
          detail={`${catalogue.reduce((s, p) => s + p.stock, 0).toLocaleString("en-NG")} units in stock`}
          icon={<Store className="size-4" />}
          tone="info"
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        {/* Orders */}
        <Card>
          <CardHeader
            title="Incoming orders"
            description={`${orders.length} of ${VENDOR_ORDERS.length} shown`}
            icon={<Truck className="size-4" />}
          />
          <CardBody className="pb-0">
            <SegmentedControl
              size="sm"
              items={[
                { id: "all", label: "All", count: VENDOR_ORDERS.length },
                { id: "open", label: "Open", count: pending },
                {
                  id: "delivered",
                  label: "Delivered",
                  count: VENDOR_ORDERS.filter((o) => o.status === "delivered").length,
                },
                {
                  id: "cancelled",
                  label: "Cancelled",
                  count: VENDOR_ORDERS.filter((o) => o.status === "cancelled").length,
                },
              ]}
              value={filter}
              onChange={(f) => setFilter(f as Filter)}
            />
          </CardBody>

          <ul className="mt-4 divide-y divide-line">
            {orders.map((o) => {
              const meta = ORDER_STATUS_META[o.status as OrderStatus];
              return (
                <li key={o.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[0.8125rem] font-semibold text-ink">
                          {o.product}
                        </p>
                        <span
                          className={cn(
                            "rounded-lg px-2 py-0.5 text-[0.625rem] font-semibold",
                            meta.tone,
                          )}
                        >
                          {meta.label}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        {o.buyer} · {o.qty} unit{o.qty > 1 ? "s" : ""} ·{" "}
                        <span className="tabular">{o.id.toUpperCase()}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        <span suppressHydrationWarning>{formatDateTime(o.placedAt)}</span>{" "}
                        · {o.deliverTo}
                      </p>
                    </div>
                    <p className="tabular shrink-0 text-sm font-bold text-ink">
                      {riyal(o.amountSAR)}
                    </p>
                  </div>

                  {["escrow-held", "preparing"].includes(o.status) ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          toast({
                            title: `Order ${o.id.toUpperCase()} accepted`,
                            description: "A rider has been requested for pickup.",
                          })
                        }
                      >
                        <CircleCheck className="size-3.5" />
                        {o.status === "escrow-held" ? "Accept order" : "Mark ready"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          toast({
                            title: "Buyer notified",
                            description: `${o.buyer} has been told the item is out of stock and refunded from escrow.`,
                            tone: "warning",
                          })
                        }
                      >
                        Out of stock
                      </Button>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </Card>

        {/* Sidebar */}
        <div className="space-y-5">
          <Card>
            <CardHeader
              title="Settlement"
              description="Paid within 48 hours of confirmed delivery."
              icon={<HandCoins className="size-4" />}
            />
            <CardBody className="space-y-3">
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="text-muted">Gross sales</span>
                <span className="tabular font-semibold text-ink">{riyal(grossSAR)}</span>
              </div>
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="text-muted">Commission (8%)</span>
                <span className="tabular font-semibold text-rose-700 dark:text-rose-400">
                  −{riyal(commission)}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
                <span className="text-sm font-semibold text-ink">Net payout</span>
                <span className="tabular text-lg font-extrabold text-ink">
                  {riyal(payout)}
                </span>
              </div>
              <Button
                size="sm"
                block
                onClick={() =>
                  toast({
                    title: "Payout requested",
                    description: `${riyal(payout)} will reach your Saudi account within 48 hours.`,
                  })
                }
              >
                Request payout
              </Button>
              <p className="text-xs leading-relaxed text-muted">
                Only funds from confirmed deliveries are eligible. Orders still in escrow
                appear here once the buyer confirms.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Performance"
              description="How buyers rate your storefront."
              icon={<Users className="size-4" />}
            />
            <CardBody className="space-y-4">
              <ProgressBar value={98} label="On-time delivery" showValue tone="positive" />
              <ProgressBar value={96} label="Order acceptance" showValue />
              <ProgressBar value={92} label="Response within 15 min" showValue tone="gold" />
              <p className="flex items-start gap-2 text-xs leading-relaxed text-muted">
                <Clock className="mt-0.5 size-3.5 shrink-0 text-forest-700 dark:text-gold-400" />
                Ratings below 4.0 trigger a support review rather than an instant
                delisting — an agent will call you first.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Catalogue */}
      <Card className="mt-5">
        <CardHeader
          title="Your catalogue"
          description={`${catalogue.length} products live in the marketplace`}
          icon={<Store className="size-4" />}
        />
        <CardBody className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {catalogue.map((p) => (
            <div
              key={p.id}
              className="flex gap-3 rounded-2xl border border-line bg-surface-muted/50 p-4"
            >
              <span
                className={cn(
                  "grid size-12 shrink-0 place-items-center rounded-xl bg-linear-to-br text-white",
                  p.tone,
                )}
              >
                <Icon name={p.icon} className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-[0.8125rem] leading-snug font-semibold text-ink">
                  {p.name}
                </p>
                <p className="tabular mt-1 text-sm font-bold text-ink">
                  {riyal(p.priceSAR)}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <Pill tone={p.stock < 120 ? "warning" : "positive"}>
                    {p.stock} in stock
                  </Pill>
                  <Pill tone="neutral">{CATEGORY_META[p.category].label}</Pill>
                </div>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </>
  );
}
