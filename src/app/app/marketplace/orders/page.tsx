"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CircleCheck,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
  TriangleAlert,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState, PageHeader, Stat } from "@/components/ui/misc";
import { SegmentedControl } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { Icon } from "@/components/icon";
import { useApp } from "@/lib/store";
import { ORDER_STATUS_META, productById, vendorById } from "@/lib/data/marketplace";
import { formatDateTime, riyal } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/cn";

type Filter = "all" | "open" | "delivered";

const TRACK_STEPS: OrderStatus[] = [
  "escrow-held",
  "preparing",
  "out-for-delivery",
  "delivered",
];

export default function OrdersPage() {
  const { orders } = useApp();
  const { toast } = useToast();
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(
    () =>
      orders.filter((o) => {
        if (filter === "open") return !["delivered", "cancelled"].includes(o.status);
        if (filter === "delivered") return o.status === "delivered";
        return true;
      }),
    [orders, filter],
  );

  const inEscrow = orders
    .filter((o) => !["delivered", "cancelled"].includes(o.status))
    .reduce((s, o) => s + o.totalSAR, 0);
  const delivered = orders.filter((o) => o.status === "delivered").length;

  return (
    <>
      <PageHeader
        title="My orders"
        description="Track every delivery and release payment only when the goods are in your hands."
        action={
          <ButtonLink href="/app/marketplace" variant="outline">
            <ShoppingBag className="size-4" />
            Marketplace
          </ButtonLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Orders placed"
          value={orders.length}
          detail={`${delivered} delivered so far`}
          icon={<Package className="size-4" />}
        />
        <Stat
          label="Held in escrow"
          value={riyal(inEscrow)}
          detail="Released only when you confirm delivery"
          icon={<ShieldCheck className="size-4" />}
          tone="gold"
        />
        <Stat
          label="In transit"
          value={orders.filter((o) => o.status === "out-for-delivery").length}
          detail="Riders currently on the way to you"
          icon={<Truck className="size-4" />}
          tone="info"
        />
      </div>

      <SegmentedControl
        className="mt-5"
        items={[
          { id: "all", label: "All", count: orders.length },
          {
            id: "open",
            label: "In progress",
            count: orders.filter((o) => !["delivered", "cancelled"].includes(o.status))
              .length,
          },
          { id: "delivered", label: "Delivered", count: delivered },
        ]}
        value={filter}
        onChange={(f) => setFilter(f as Filter)}
      />

      {visible.length === 0 ? (
        <EmptyState
          className="mt-5"
          icon={<Package className="size-6" />}
          title="No orders here"
          description="Everything you order from the marketplace will appear here with live tracking."
          action={
            <ButtonLink href="/app/marketplace">Browse the marketplace</ButtonLink>
          }
        />
      ) : (
        <div className="mt-5 space-y-5">
          {visible.map((order) => {
            const meta = ORDER_STATUS_META[order.status];
            const stepIndex = TRACK_STEPS.indexOf(order.status);
            const cancelled = order.status === "cancelled";

            return (
              <Card key={order.id}>
                <CardHeader
                  title={
                    <span className="flex flex-wrap items-center gap-2">
                      Order {order.id.toUpperCase()}
                      <span
                        className={cn(
                          "rounded-lg px-2 py-0.5 text-[0.6875rem] font-semibold",
                          meta.tone,
                        )}
                      >
                        {meta.label}
                      </span>
                    </span>
                  }
                  description={
                    <span suppressHydrationWarning>
                      Placed {formatDateTime(order.placedAt)} · {order.courier}
                    </span>
                  }
                  action={
                    <span className="tabular text-sm font-extrabold text-ink">
                      {riyal(order.totalSAR)}
                    </span>
                  }
                />

                <CardBody className="space-y-5">
                  {/* Tracker */}
                  {!cancelled ? (
                    <div>
                      <div className="flex items-center">
                        {TRACK_STEPS.map((step, i) => {
                          const done = i <= stepIndex;
                          return (
                            <div key={step} className="flex flex-1 items-center last:flex-none">
                              <div className="flex flex-col items-center gap-1.5">
                                <span
                                  className={cn(
                                    "grid size-7 place-items-center rounded-full text-[0.625rem] font-bold transition",
                                    done
                                      ? "bg-forest-800 text-white dark:bg-forest-600"
                                      : "bg-surface-muted text-muted",
                                  )}
                                >
                                  {done ? (
                                    <CircleCheck className="size-4" />
                                  ) : (
                                    i + 1
                                  )}
                                </span>
                                <span
                                  className={cn(
                                    "hidden text-center text-[0.625rem] leading-tight font-medium sm:block",
                                    done ? "text-ink" : "text-muted",
                                  )}
                                >
                                  {ORDER_STATUS_META[step].label}
                                </span>
                              </div>
                              {i < TRACK_STEPS.length - 1 ? (
                                <span
                                  className={cn(
                                    "mx-2 h-0.5 flex-1 rounded-full transition",
                                    i < stepIndex
                                      ? "bg-forest-800 dark:bg-forest-600"
                                      : "bg-line",
                                  )}
                                />
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-muted">
                        {meta.description}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-50/60 p-3.5 dark:bg-rose-950/25">
                      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-rose-600" />
                      <p className="text-xs leading-relaxed text-muted">
                        {meta.description}
                      </p>
                    </div>
                  )}

                  {/* Items */}
                  <ul className="space-y-3">
                    {order.lines.map((line) => {
                      const product = productById(line.productId);
                      if (!product) return null;
                      const vendor = vendorById(product.vendorId);
                      return (
                        <li key={line.productId} className="flex items-center gap-3">
                          <Link
                            href={`/app/marketplace/${product.id}`}
                            className={cn(
                              "grid size-12 shrink-0 place-items-center rounded-xl bg-linear-to-br text-white",
                              product.tone,
                            )}
                          >
                            <Icon name={product.icon} className="size-5 opacity-90" />
                          </Link>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[0.8125rem] font-semibold text-ink">
                              {product.name}
                            </p>
                            <p className="truncate text-xs text-muted">
                              {vendor.name} · {line.qty} ×{" "}
                              <span className="tabular">{riyal(product.priceSAR)}</span>
                            </p>
                          </div>
                          <p className="tabular shrink-0 text-[0.8125rem] font-bold text-ink">
                            {riyal(product.priceSAR * line.qty)}
                          </p>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Delivery */}
                  <div className="flex flex-wrap items-center gap-3 rounded-xl bg-surface-muted p-3.5">
                    <MapPin className="size-4 shrink-0 text-forest-700 dark:text-gold-400" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.8125rem] font-semibold text-ink">
                        {order.deliverTo}
                      </p>
                      <p className="text-xs text-muted">{order.eta}</p>
                    </div>
                    <Pill tone={cancelled ? "danger" : "neutral"}>{order.courier}</Pill>
                  </div>

                  {/* Actions */}
                  {!cancelled && order.status !== "delivered" ? (
                    <div className="flex flex-wrap gap-3">
                      <Button
                        size="sm"
                        onClick={() =>
                          toast({
                            title: "Delivery confirmed",
                            description: `${riyal(order.totalSAR)} released to the vendor. Thank you.`,
                          })
                        }
                      >
                        <CircleCheck className="size-3.5" />
                        Confirm delivery
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          toast({
                            title: "Dispute opened",
                            description:
                              "A HajjPath agent will review this within one business day. Your escrow balance is untouched.",
                            tone: "warning",
                          })
                        }
                      >
                        Report a problem
                      </Button>
                    </div>
                  ) : null}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
