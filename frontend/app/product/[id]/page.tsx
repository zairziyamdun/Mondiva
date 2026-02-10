import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductDetail } from "@/components/product/product-detail"
import { products } from "@/lib/mock-data"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = products.find((p) => p.id === id)

  if (!product) {
    return (
      <>
        <SiteHeader />
        <main className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-2xl font-bold text-foreground">Товар не найден</h1>
            <p className="mt-2 text-sm text-muted-foreground">Возможно, он был удалён или перемещён</p>
          </div>
        </main>
        <SiteFooter />
      </>
    )
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
