"use client";

import { PackageX } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";
import { ProductDetail } from "@/components/app/product-detail";
import { useCatalog } from "@/lib/catalog";

/** Looks the product up in the admin-managed catalogue, so new listings work too. */
export function ProductRoute({ id }: { id: string }) {
  const { products } = useCatalog();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <EmptyState
        icon={<PackageX className="size-6" />}
        title="This item is no longer available"
        description="It may have been removed from the marketplace or sold out."
        action={<ButtonLink href="/app/marketplace">Back to the market</ButtonLink>}
      />
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return <ProductDetail product={product} related={related} />;
}
