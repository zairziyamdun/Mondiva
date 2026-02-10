"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { products } from "@/lib/mock-data"
import { ProductCard } from "@/components/product-card"

export function PopularSection() {
  const popularProducts = products.filter((p) => p.isPopular).slice(0, 4)

  return (
    <section className="px-4 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Хиты продаж
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-foreground lg:text-4xl">
              Популярное
            </h2>
          </div>
          <Link
            href="/catalog?sort=popular"
            className="hidden items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-accent sm:flex"
          >
            Смотреть все
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
