import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, productById } from "@/lib/data/marketplace";
import { ProductDetail } from "@/components/app/product-detail";

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
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = productById(id);
  if (!product) notFound();

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 4);

  return <ProductDetail product={product} related={related} />;
}
