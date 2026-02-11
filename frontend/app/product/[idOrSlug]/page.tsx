import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductDetail } from "@/components/product/product-detail"
import { getBaseUrl } from "@/lib/api"
import { normalizeProduct } from "@/lib/types"
import type { Product } from "@/lib/types"

async function fetchProduct(idOrSlug: string): Promise<Product | null> {
  const base = getBaseUrl()
  try {
    const res = await fetch(`${base}/api/products/${encodeURIComponent(idOrSlug)}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return normalizeProduct(data) as Product
  } catch {
    return null
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ idOrSlug: string }>
}) {
  const { idOrSlug } = await params
  const product = await fetchProduct(idOrSlug)

  if (!product) {
    notFound()
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <ProductDetail product={product} />
      </main>
      <SiteFooter />
    </>
  )
}
