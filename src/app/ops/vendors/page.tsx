"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CircleCheck,
  CircleX,
  Eye,
  EyeOff,
  Gavel,
  Info,
  Pencil,
  Plus,
  Search,
  Star,
  Store,
  Trash2,
} from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataRow, EmptyState, PageHeader } from "@/components/ui/misc";
import { Checkbox, Field, Select, TextArea, TextInput } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { ICONS, Icon, type IconName } from "@/components/icon";
import { DisputePill, OpsTable, TD, VendorPill } from "@/components/ops/ops-ui";
import { useOps } from "@/lib/ops/store";
import { NEW_VENDOR_DEFAULTS } from "@/lib/ops/seed";
import type { Dispute, OpsVendor } from "@/lib/ops/types";
import { CATEGORY_META, NGN_PER_SAR } from "@/lib/data/marketplace";
import type { Product, ProductCategory } from "@/lib/types";
import { formatDate, formatDateTime, riyal } from "@/lib/format";
import { cn } from "@/lib/cn";

type Tab = "products" | "vendors" | "applications" | "disputes";
const TABS: Tab[] = ["products", "vendors", "applications", "disputes"];
const CATEGORIES = Object.keys(CATEGORY_META) as ProductCategory[];
const DROP_OFFS: Product["deliversTo"] = ["Hotel", "Mina Tent", "Aziziyah", "Madinah Hotel"];
const ICON_NAMES = Object.keys(ICONS) as IconName[];

export default function OpsMarketplacePage() {
  return (
    <Suspense fallback={null}>
      <MarketplaceConsole />
    </Suspense>
  );
}

function MarketplaceConsole() {
  const ops = useOps();
  const params = useSearchParams();
  const initial = params.get("tab");
  const [tab, setTab] = useState<Tab>(TABS.includes(initial as Tab) ? (initial as Tab) : "products");

  const pending = ops.vendors.filter((v) => v.status === "pending").length;
  const active = ops.vendors.filter((v) => v.status === "approved" || v.status === "suspended").length;
  const openDisputes = ops.disputes.filter((d) => d.status === "open").length;

  return (
    <>
      <PageHeader
        title="Marketplace"
        description="HajjPath posts every product. Vendors supply the goods; only admins list, edit or remove items."
      />

      <Tabs
        items={[
          { id: "products", label: "Products", count: ops.products.length },
          { id: "vendors", label: "Vendors", count: active },
          { id: "applications", label: "Applications", count: pending },
          { id: "disputes", label: "Disputes", count: openDisputes },
        ]}
        value={tab}
        onChange={setTab}
        className="mb-5"
      />

      {tab === "products" ? <Products /> : null}
      {tab === "vendors" ? <Vendors /> : null}
      {tab === "applications" ? <Applications /> : null}
      {tab === "disputes" ? <Disputes /> : null}
    </>
  );
}

/* -------------------------------- Products -------------------------------- */

function Products() {
  const { products, vendors, hiddenProducts, toggleProductHidden, deleteProduct } = useOps();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const vendorName = (id: string) => vendors.find((v) => v.id === id)?.name ?? "Unknown vendor";

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        (vendors.find((v) => v.id === p.vendorId)?.name ?? "").toLowerCase().includes(q),
    );
  }, [products, vendors, query]);

  return (
    <>
      <Card>
        <CardBody className="flex flex-col gap-3 border-b border-line md:flex-row md:items-center md:justify-between">
          <div className="relative md:w-80">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
            <TextInput
              aria-label="Search products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Product or vendor"
              className="pl-10"
            />
          </div>
          <Button onClick={() => setEditing("new")}>
            <Plus className="size-4" />
            Post a product
          </Button>
        </CardBody>
        {visible.length === 0 ? (
          <div className="p-5">
            <EmptyState icon={<Store className="size-6" />} title="No products" description="Post the first product to open the market." />
          </div>
        ) : (
          <OpsTable head={["Product", "Vendor", "Price", "Stock", "Listing", ""]}>
            {visible.map((p) => {
              const hidden = hiddenProducts.includes(p.id);
              const vendor = vendors.find((v) => v.id === p.vendorId);
              const vendorOff = vendor?.status !== "approved";
              return (
                <tr key={p.id} className="hover:bg-surface-muted/50">
                  <td className={TD}>
                    <div className="flex items-center gap-3">
                      <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg bg-linear-to-br text-white", p.tone)}>
                        <Icon name={p.icon} className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-ink">{p.name}</p>
                        <p className="text-xs text-muted">{CATEGORY_META[p.category].label}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`${TD} text-muted`}>{vendorName(p.vendorId)}</td>
                  <td className={`${TD} tabular whitespace-nowrap`}>{riyal(p.priceSAR)}</td>
                  <td className={`${TD} tabular`}>{p.stock}</td>
                  <td className={TD}>
                    {hidden ? (
                      <Pill tone="neutral">Hidden</Pill>
                    ) : vendorOff ? (
                      <Pill tone="warning">Vendor inactive</Pill>
                    ) : (
                      <Pill tone="positive">Live</Pill>
                    )}
                  </td>
                  <td className={`${TD} whitespace-nowrap text-right`}>
                    <Button size="sm" variant="ghost" aria-label={`Edit ${p.name}`} onClick={() => setEditing(p)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={hidden ? `Relist ${p.name}` : `Hide ${p.name}`}
                      onClick={() => toggleProductHidden(p.id, p.name)}
                    >
                      {hidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                    </Button>
                    <Button size="sm" variant="ghost" aria-label={`Delete ${p.name}`} onClick={() => setDeleting(p)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </OpsTable>
        )}
      </Card>

      {editing ? (
        <ProductModal product={editing === "new" ? null : editing} onClose={() => setEditing(null)} />
      ) : null}

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title={`Delete ${deleting?.name ?? "product"}?`}
        description="It disappears from the marketplace and from pilgrims' saved items. Past orders keep their record."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (!deleting) return;
                deleteProduct(deleting.id);
                toast({ title: `${deleting.name} deleted`, tone: "info" });
                setDeleting(null);
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">To take it down temporarily, hide it instead.</p>
      </Modal>
    </>
  );
}

function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { vendors, saveProduct } = useOps();
  const { toast } = useToast();
  const activeVendors = vendors.filter((v) => v.status === "approved");

  const [name, setName] = useState(product?.name ?? "");
  const [vendorId, setVendorId] = useState(product?.vendorId ?? activeVendors[0]?.id ?? "");
  const [category, setCategory] = useState<ProductCategory>(product?.category ?? "ihram");
  const [priceSAR, setPriceSAR] = useState(product ? String(product.priceSAR) : "");
  const [compareAt, setCompareAt] = useState(product?.compareAtSAR ? String(product.compareAtSAR) : "");
  const [stock, setStock] = useState(product ? String(product.stock) : "");
  const [deliveryHours, setDeliveryHours] = useState(product ? String(product.deliveryHours) : "24");
  const [deliversTo, setDeliversTo] = useState<Product["deliversTo"]>(product?.deliversTo ?? ["Hotel"]);
  const [icon, setIcon] = useState<IconName>(product?.icon ?? CATEGORY_META.ihram.icon);
  const [description, setDescription] = useState(product?.description ?? "");
  const [tags, setTags] = useState(product?.tags.join(", ") ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function save() {
    const price = Number(priceSAR);
    const compare = compareAt ? Number(compareAt) : undefined;
    const qty = Number(stock);
    const hours = Number(deliveryHours);
    const next: Record<string, string> = {};
    if (name.trim().length < 3) next.name = "Give the product a clear name.";
    if (!vendorId) next.vendor = "Choose the vendor who supplies it.";
    if (!price || price <= 0) next.price = "Enter the price in Riyal.";
    if (compare !== undefined && (!compare || compare <= price)) next.compare = "The original price must be higher than the price.";
    if (!Number.isInteger(qty) || qty < 0) next.stock = "Enter a whole number.";
    if (!hours || hours <= 0) next.hours = "Enter the delivery time in hours.";
    if (deliversTo.length === 0) next.deliversTo = "Pick at least one drop-off point.";
    if (description.trim().length < 20) next.description = "Describe it in at least 20 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;

    saveProduct({
      id: product?.id,
      name: name.trim(),
      vendorId,
      category,
      priceSAR: price,
      priceNGN: Math.round(price * NGN_PER_SAR),
      compareAtSAR: compare,
      stock: qty,
      deliveryHours: hours,
      deliversTo,
      icon,
      tone: CATEGORY_META[category].tone,
      description: description.trim(),
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      rating: product?.rating ?? 0,
      reviews: product?.reviews ?? 0,
    });
    toast({
      title: product ? "Product updated" : "Product posted",
      description: product ? name.trim() : `${name.trim()} is now live in the marketplace.`,
    });
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={product ? `Edit ${product.name}` : "Post a product"}
      description="Pilgrims see changes in the marketplace straight away."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>{product ? "Save changes" : "Post product"}</Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Product name" required error={errors.name} htmlFor="pr-name" className="sm:col-span-2">
          <TextInput id="pr-name" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Vendor" required error={errors.vendor} htmlFor="pr-vendor">
          <Select id="pr-vendor" value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
            {activeVendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Category" htmlFor="pr-category">
          <Select
            id="pr-category"
            value={category}
            onChange={(e) => {
              const next = e.target.value as ProductCategory;
              setCategory(next);
              if (!product) setIcon(CATEGORY_META[next].icon);
            }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_META[c].label}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="Price"
          required
          error={errors.price}
          htmlFor="pr-price"
          hint={Number(priceSAR) > 0 ? `About ₦${Math.round(Number(priceSAR) * NGN_PER_SAR).toLocaleString("en-NG")}` : undefined}
        >
          <TextInput id="pr-price" prefix="SAR" inputMode="decimal" value={priceSAR} onChange={(e) => setPriceSAR(e.target.value.replace(/[^\d.]/g, ""))} />
        </Field>
        <Field label="Original price" error={errors.compare} htmlFor="pr-compare" hint="Optional. Shows the item as discounted.">
          <TextInput id="pr-compare" prefix="SAR" inputMode="decimal" value={compareAt} onChange={(e) => setCompareAt(e.target.value.replace(/[^\d.]/g, ""))} />
        </Field>
        <Field label="Stock" required error={errors.stock} htmlFor="pr-stock">
          <TextInput id="pr-stock" inputMode="numeric" value={stock} onChange={(e) => setStock(e.target.value.replace(/\D/g, ""))} />
        </Field>
        <Field label="Delivery time (hours)" required error={errors.hours} htmlFor="pr-hours">
          <TextInput id="pr-hours" inputMode="numeric" value={deliveryHours} onChange={(e) => setDeliveryHours(e.target.value.replace(/\D/g, ""))} />
        </Field>
        <Field label="Delivers to" required error={errors.deliversTo} className="sm:col-span-2">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {DROP_OFFS.map((d) => (
              <Checkbox
                key={d}
                label={d}
                checked={deliversTo.includes(d)}
                onChange={(e) =>
                  setDeliversTo((cur) => (e.target.checked ? [...cur, d] : cur.filter((x) => x !== d)))
                }
              />
            ))}
          </div>
        </Field>
        <Field label="Icon" htmlFor="pr-icon" className="sm:col-span-2">
          <div className="flex items-center gap-3">
            <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl bg-linear-to-br text-white", CATEGORY_META[category].tone)}>
              <Icon name={icon} className="size-5" />
            </span>
            <Select id="pr-icon" value={icon} onChange={(e) => setIcon(e.target.value as IconName)}>
              {ICON_NAMES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </div>
        </Field>
        <Field label="Description" required error={errors.description} htmlFor="pr-desc" className="sm:col-span-2">
          <TextArea id="pr-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <Field label="Tags" htmlFor="pr-tags" hint="Comma separated, used for search." className="sm:col-span-2">
          <TextInput id="pr-tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ihram, cotton, men" />
        </Field>
      </div>
    </Modal>
  );
}

/* --------------------------------- Vendors -------------------------------- */

function Vendors() {
  const { vendors, setVendorStatus } = useOps();
  const { toast } = useToast();
  const [editing, setEditing] = useState<OpsVendor | "new" | null>(null);
  const list = vendors.filter((v) => v.status === "approved" || v.status === "suspended");

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-start gap-2 text-sm text-muted">
          <Info className="mt-0.5 size-4 shrink-0" />
          Suspending a vendor takes all their products out of the marketplace.
        </p>
        <Button size="sm" onClick={() => setEditing("new")}>
          <Plus className="size-4" />
          Add vendor
        </Button>
      </div>
      <Card>
        <OpsTable head={["Vendor", "Categories", "Rating", "Orders fulfilled", "Status", ""]}>
          {list.map((v) => (
            <tr key={v.id} className="hover:bg-surface-muted/50">
              <td className={TD}>
                <p className="font-semibold text-ink">{v.name}</p>
                <p className="text-xs text-muted">{v.location}</p>
              </td>
              <td className={`${TD} text-xs text-muted`}>{v.categories.map((c) => CATEGORY_META[c].label).join(", ")}</td>
              <td className={`${TD} tabular whitespace-nowrap`}>
                {v.rating ? (
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-3.5 fill-gold-500 text-gold-500" />
                    {v.rating.toFixed(1)}
                  </span>
                ) : (
                  "New"
                )}
              </td>
              <td className={`${TD} tabular`}>{v.fulfilled.toLocaleString("en-NG")}</td>
              <td className={TD}>
                <VendorPill status={v.status} />
              </td>
              <td className={`${TD} whitespace-nowrap text-right`}>
                <Button size="sm" variant="ghost" aria-label={`Edit ${v.name}`} onClick={() => setEditing(v)}>
                  <Pencil className="size-4" />
                </Button>
                {v.status === "approved" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setVendorStatus(v.id, "suspended");
                      toast({ title: `${v.name} suspended`, description: "Their products are hidden from pilgrims.", tone: "warning" });
                    }}
                  >
                    Suspend
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      setVendorStatus(v.id, "approved");
                      toast({ title: `${v.name} reinstated` });
                    }}
                  >
                    Reinstate
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </OpsTable>
      </Card>
      {editing ? <VendorModal vendor={editing === "new" ? null : editing} onClose={() => setEditing(null)} /> : null}
    </>
  );
}

function VendorModal({ vendor, onClose }: { vendor: OpsVendor | null; onClose: () => void }) {
  const { saveVendor } = useOps();
  const { toast } = useToast();
  const [name, setName] = useState(vendor?.name ?? "");
  const [location, setLocation] = useState(vendor?.location ?? "");
  const [contact, setContact] = useState(vendor?.contact ?? "");
  const [responseTime, setResponseTime] = useState(vendor?.responseTime ?? "Replies within the hour");
  const [categories, setCategories] = useState<ProductCategory[]>(vendor?.categories ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function save() {
    const next: Record<string, string> = {};
    if (name.trim().length < 3) next.name = "Enter the business name.";
    if (location.trim().length < 3) next.location = "Enter where they operate.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact.trim())) next.contact = "Enter a contact email.";
    if (categories.length === 0) next.categories = "Pick at least one category.";
    setErrors(next);
    if (Object.keys(next).length) return;
    const base = vendor ?? {
      ...NEW_VENDOR_DEFAULTS,
      verified: true,
      status: "approved" as const,
      appliedAt: new Date().toISOString(),
    };
    saveVendor({
      ...base,
      id: vendor?.id,
      name: name.trim(),
      location: location.trim(),
      contact: contact.trim(),
      responseTime: responseTime.trim() || "Replies within the hour",
      categories,
    });
    toast({ title: vendor ? "Vendor updated" : `${name.trim()} added`, description: vendor ? undefined : "You can now post their products." });
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={vendor ? `Edit ${vendor.name}` : "Add a vendor"}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>{vendor ? "Save changes" : "Add vendor"}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Business name" required error={errors.name} htmlFor="vd-name">
          <TextInput id="vd-name" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Location" required error={errors.location} htmlFor="vd-loc">
          <TextInput id="vd-loc" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ajyad Street, Makkah" />
        </Field>
        <Field label="Contact email" required error={errors.contact} htmlFor="vd-contact">
          <TextInput id="vd-contact" type="email" value={contact} onChange={(e) => setContact(e.target.value)} />
        </Field>
        <Field label="Response time shown to pilgrims" htmlFor="vd-response">
          <TextInput id="vd-response" value={responseTime} onChange={(e) => setResponseTime(e.target.value)} />
        </Field>
        <Field label="Categories" required error={errors.categories}>
          <div className="grid gap-2 sm:grid-cols-2">
            {CATEGORIES.map((c) => (
              <Checkbox
                key={c}
                label={CATEGORY_META[c].label}
                checked={categories.includes(c)}
                onChange={(e) => setCategories((cur) => (e.target.checked ? [...cur, c] : cur.filter((x) => x !== c)))}
              />
            ))}
          </div>
        </Field>
      </div>
    </Modal>
  );
}

/* ------------------------------ Applications ------------------------------ */

function Applications() {
  const { vendors, setVendorStatus } = useOps();
  const { toast } = useToast();
  const pending = vendors.filter((v) => v.status === "pending");

  if (pending.length === 0) {
    return <EmptyState icon={<Store className="size-6" />} title="No applications waiting" description="Businesses that ask to supply HajjPath appear here." />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {pending.map((v) => (
        <Card key={v.id}>
          <CardBody>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-bold text-ink">{v.name}</p>
                <p className="text-xs text-muted">{v.location}</p>
              </div>
              <VendorPill status={v.status} />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {v.categories.map((c) => (
                <Pill key={c} tone="neutral">
                  {CATEGORY_META[c].label}
                </Pill>
              ))}
            </div>
            {v.note ? <p className="mt-3 text-sm leading-relaxed text-muted">{v.note}</p> : null}
            <dl className="mt-3">
              <DataRow label="Contact" value={v.contact} />
              <DataRow label="Applied" value={formatDateTime(v.appliedAt)} />
            </dl>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setVendorStatus(v.id, "rejected");
                  toast({ title: `${v.name} rejected`, tone: "warning" });
                }}
              >
                <CircleX className="size-4" />
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setVendorStatus(v.id, "approved");
                  toast({ title: `${v.name} approved`, description: "Post their products from the Products tab." });
                }}
              >
                <CircleCheck className="size-4" />
                Approve
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

/* -------------------------------- Disputes -------------------------------- */

function Disputes() {
  const { disputes } = useOps();
  const [resolving, setResolving] = useState<{ dispute: Dispute; outcome: "refunded" | "released" } | null>(null);

  if (disputes.length === 0) {
    return <EmptyState icon={<Gavel className="size-6" />} title="No disputes" />;
  }

  return (
    <>
      <div className="space-y-4">
        {disputes.map((d) => (
          <Card key={d.id}>
            <CardBody>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-base font-bold text-ink">Order {d.orderId}</p>
                  <p className="text-xs text-muted">
                    {d.buyer} vs {d.vendorName} · opened {formatDate(d.openedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="tabular text-sm font-bold text-ink">{riyal(d.amountSAR)}</span>
                  <DisputePill status={d.status} />
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink/85">{d.reason}</p>
              {d.resolutionNote ? (
                <p className="mt-3 rounded-xl bg-surface-muted p-3 text-xs leading-relaxed text-muted">{d.resolutionNote}</p>
              ) : null}
              {d.status === "open" ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setResolving({ dispute: d, outcome: "refunded" })}>
                    Refund buyer
                  </Button>
                  <Button size="sm" onClick={() => setResolving({ dispute: d, outcome: "released" })}>
                    Release to vendor
                  </Button>
                </div>
              ) : null}
            </CardBody>
          </Card>
        ))}
      </div>
      {resolving ? (
        <ResolveModal dispute={resolving.dispute} outcome={resolving.outcome} onClose={() => setResolving(null)} />
      ) : null}
    </>
  );
}

function ResolveModal({
  dispute,
  outcome,
  onClose,
}: {
  dispute: Dispute;
  outcome: "refunded" | "released";
  onClose: () => void;
}) {
  const { resolveDispute } = useOps();
  const { toast } = useToast();
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const label = outcome === "refunded" ? "Refund the buyer" : "Release escrow to the vendor";

  function confirm() {
    if (note.trim().length < 10) {
      setError("Record why (at least 10 characters). Both parties see this.");
      return;
    }
    resolveDispute(dispute.id, outcome, note);
    toast({ title: "Dispute resolved", description: `${label} on ${dispute.orderId}.` });
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={label}
      description={`${dispute.orderId} · ${riyal(dispute.amountSAR)} held in escrow`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={confirm}>Confirm</Button>
        </>
      }
    >
      <Field label="Resolution note" required error={error ?? undefined} htmlFor="dsp-note">
        <TextArea
          id="dsp-note"
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setError(null);
          }}
          placeholder="e.g. Courier log confirms only one set was dispatched."
        />
      </Field>
    </Modal>
  );
}
