import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HeroSection } from "@/components/home/hero-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { NewArrivalsSection } from "@/components/home/new-arrivals-section"
import { PopularSection } from "@/components/home/popular-section"
import { SaleSection } from "@/components/home/sale-section"
import { PromoSection } from "@/components/home/promo-section"
import { getBaseUrl } from "@/lib/api"
import { normalizeCategory, normalizeProduct } from "@/lib/types"
import type { Category, Product } from "@/lib/types"

async function fetchHomeData(): Promise<{ categories: Category[]; products: Product[] }> {
  const base = getBaseUrl()
  try {
    const [catRes, prodRes] = await Promise.all([
      fetch(`${base}/api/categories`, { next: { revalidate: 60 } }),
      fetch(`${base}/api/products`, { next: { revalidate: 60 } }),
    ])
    const catJson = await catRes.json()
    const prodJson = await prodRes.json()
    const categories = (Array.isArray(catJson) ? catJson : []).map((c) => normalizeCategory(c)).filter(Boolean) as Category[]
    const products = (Array.isArray(prodJson) ? prodJson : []).map((p) => normalizeProduct(p)).filter(Boolean) as Product[]
    return { categories, products }
  } catch {
    return { categories: [], products: [] }
  }
}

export default async function HomePage() {
  const { categories, products } = await fetchHomeData()

  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <CategoriesSection categories={categories} />
        <NewArrivalsSection products={products} />
        <PromoSection />
        <PopularSection products={products} />
        <SaleSection products={products} />
      </main>
      <SiteFooter />
    </>
  )
}
