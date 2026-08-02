"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Truck,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/ui/misc";
import { RadioCard, TextInput, Field } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { Icon } from "@/components/icon";
import { useApp, useCartSummary } from "@/lib/store";
import { NGN_PER_SAR, vendorById } from "@/lib/data/marketplace";
import { naira, riyal } from "@/lib/format";
import { cn } from "@/lib/cn";

const DROP_OFFS = [
  {
    id: "Anjum Makkah · Room 1418",
    title: "Anjum Makkah · Room 1418",
    detail: "Your group hotel, 600m from the Haram. Reception accepts deliveries 24 hours.",
  },
  {
    id: "Aziziyah Residence · Block C, Flat 9",
    title: "Aziziyah Residence · Block C, Flat 9",
    detail: "Pre-Hajj accommodation used from 5–8 Dhul-Hijjah.",
  },
  {
    id: "Mina Camp · Street 56 · Tent 214",
    title: "Mina Camp · Street 56 · Tent 214",
    detail: "Riders meet you at the Al-Amanah banner on the service road.",
  },
];

export default function CartPage() {
  const router = useRouter();
  const { setCartQty, removeFromCart, clearCart, placeOrder } = useApp();
  const { lines, itemCount, subtotalSAR, deliverySAR, totalSAR } = useCartSummary();
  const { toast } = useToast();

  const [dropOff, setDropOff] = useState(DROP_OFFS[0].id);
  const [instructions, setInstructions] = useState("");
  const [placing, setPlacing] = useState(false);

  function checkout() {
    setPlacing(true);
    window.setTimeout(() => {
      const order = placeOrder(
        instructions.trim() ? `${dropOff} — ${instructions.trim()}` : dropOff,
      );
      setPlacing(false);
      if (!order) return;
      toast({
        title: "Order placed — funds held in escrow",
        description: `${riyal(order.totalSAR)} will be released only when you confirm delivery.`,
      });
      router.push("/app/marketplace/orders");
    }, 900);
  }

  if (itemCount === 0) {
    return (
      <>
        <Link
          href="/app/marketplace"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-ink"
        >
          <ChevronLeft className="size-4" />
          Marketplace
        </Link>
        <PageHeader title="Your cart" className="mt-4" />
        <EmptyState
          icon={<ShoppingCart className="size-6" />}
          title="Your cart is empty"
          description="Ihram sets, rehydration salts and a certified ram are the three most ordered items before Dhul-Hijjah."
          action={
            <ButtonLink href="/app/marketplace">
              <ShoppingBag className="size-4" />
              Browse the marketplace
            </ButtonLink>
          }
        />
      </>
    );
  }

  return (
    <>
      <Link
        href="/app/marketplace"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-ink"
      >
        <ChevronLeft className="size-4" />
        Continue shopping
      </Link>

      <PageHeader
        className="mt-4"
        title="Your cart"
        description={`${itemCount} ${itemCount === 1 ? "item" : "items"} ready for delivery in the Kingdom.`}
        action={
          <Button variant="ghost" onClick={clearCart}>
            <Trash2 className="size-4" />
            Empty cart
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          {/* Items */}
          <Card>
            <CardHeader title="Items" description={`${itemCount} in this order`} />
            <ul className="divide-y divide-line">
              {lines.map(({ product, qty }) => {
                const vendor = vendorById(product.vendorId);
                return (
                  <li key={product.id} className="flex gap-4 p-5">
                    <Link
                      href={`/app/marketplace/${product.id}`}
                      className={cn(
                        "grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-linear-to-br text-white",
                        product.tone,
                      )}
                    >
                      <Icon name={product.icon} className="size-8 opacity-90" />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link href={`/app/marketplace/${product.id}`}>
                        <p className="text-[0.9375rem] leading-snug font-semibold text-ink">
                          {product.name}
                        </p>
                      </Link>
                      <p className="mt-0.5 text-xs text-muted">{vendor.name}</p>
                      <p className="mt-1">
                        <Pill tone="neutral">
                          {product.deliveryHours === 0
                            ? "Performed on the ritual day"
                            : `Delivers in ${product.deliveryHours}h`}
                        </Pill>
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <div className="flex items-center rounded-lg border border-line">
                          <button
                            type="button"
                            onClick={() => setCartQty(product.id, qty - 1)}
                            aria-label={`Decrease ${product.name}`}
                            className="grid size-8 place-items-center rounded-l-lg text-muted transition hover:bg-surface-muted hover:text-ink"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="tabular w-9 text-center text-xs font-bold text-ink">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setCartQty(product.id, qty + 1)}
                            aria-label={`Increase ${product.name}`}
                            className="grid size-8 place-items-center rounded-r-lg text-muted transition hover:bg-surface-muted hover:text-ink"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition hover:text-rose-600"
                        >
                          <Trash2 className="size-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="tabular text-sm font-bold text-ink">
                        {riyal(product.priceSAR * qty)}
                      </p>
                      <p className="tabular text-[0.6875rem] text-muted">
                        {naira(product.priceNGN * qty)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>

          {/* Delivery */}
          <Card>
            <CardHeader
              title="Where should this go?"
              description="Riders cover the Haram district, Aziziyah, Mina and central Madinah."
              icon={<Truck className="size-4" />}
            />
            <CardBody className="space-y-3">
              {DROP_OFFS.map((d) => (
                <RadioCard
                  key={d.id}
                  checked={dropOff === d.id}
                  onSelect={() => setDropOff(d.id)}
                  title={d.title}
                  description={d.detail}
                />
              ))}
              <Field
                label="Delivery instructions"
                hint="Optional — a landmark or a phone number for the rider."
                htmlFor="cart-instructions"
              >
                <TextInput
                  id="cart-instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Call on arrival, I am in the green Al-Amanah band."
                />
              </Field>
            </CardBody>
          </Card>
        </div>

        {/* Summary */}
        <div className="space-y-5 lg:sticky lg:top-22 lg:self-start">
          <Card>
            <CardHeader title="Order summary" />
            <CardBody className="space-y-3">
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="tabular font-semibold text-ink">
                  {riyal(subtotalSAR)}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="text-muted">Delivery</span>
                <span className="tabular font-semibold text-ink">
                  {deliverySAR === 0 ? "Free" : riyal(deliverySAR)}
                </span>
              </div>
              {deliverySAR > 0 ? (
                <p className="text-xs leading-relaxed text-muted">
                  Add {riyal(200 - subtotalSAR)} more for free delivery.
                </p>
              ) : null}
              <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
                <span className="text-sm font-semibold text-ink">Total</span>
                <div className="text-right">
                  <p className="tabular text-xl font-extrabold text-ink">
                    {riyal(totalSAR)}
                  </p>
                  <p className="tabular text-xs text-muted">
                    ≈ {naira(totalSAR * NGN_PER_SAR)}
                  </p>
                </div>
              </div>

              <Button size="lg" block onClick={checkout} disabled={placing}>
                {placing ? "Placing order…" : "Pay into escrow"}
              </Button>

              <p className="flex items-start gap-2 text-xs leading-relaxed text-muted">
                <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-forest-700 dark:text-gold-400" />
                Your money is held by HajjPath and released to the vendor only after you
                confirm delivery in the app.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-3 text-xs leading-relaxed text-muted">
              <p className="text-[0.8125rem] font-bold text-ink">Before you pay</p>
              <p>
                Livestock and sacrifice orders are performed at the appointed ritual time
                and cannot be cancelled after 8 Dhul-Hijjah. Everything else can be
                cancelled free of charge until the vendor dispatches.
              </p>
              <p>
                Prices are quoted in Saudi Riyal. The Naira figure is indicative at{" "}
                <span className="tabular font-semibold text-ink">
                  ₦{NGN_PER_SAR.toLocaleString("en-NG")}
                </span>{" "}
                to 1 SAR and is confirmed at settlement.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
