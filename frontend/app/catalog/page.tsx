import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CatalogContent } from "@/components/catalog/catalog-content"

export default function CatalogPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground lg:text-4xl">Каталог</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Вся коллекция премиальной женской одежды MonDiva
          </p>
        </div>
        <CatalogContent />
      </main>
      <SiteFooter />
    </>
  )
}
