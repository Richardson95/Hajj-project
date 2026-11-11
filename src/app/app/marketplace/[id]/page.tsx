import type { Metadata } from "next";
import { PRODUCTS, productById } from "@/lib/data/marketplace";
import { ProductRoute } from "@/components/app/product-route";

/* Seeded products are prebuilt; products an admin posts later render on demand. */
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = productById(id);
  return product
    ? { title: product.name, description: product.description }
    : { title: "Makkah market" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductRoute id={id} />;
}
