"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { products } from "@/lib/mock-data"
import { ProductCard } from "@/components/product-card"

export function NewArrivalsSection() {
  const newProducts = products.filter((p) => p.isNew).slice(0, 4)

  return (
    <section className="bg-secondary/50 px-4 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Только что добавлено
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-foreground lg:text-4xl">
              Новинки
            </h2>
          </div>
          <Link
            href="/catalog?filter=new"
            className="hidden items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-accent sm:flex"
          >
            Все новинки
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/catalog?filter=new"
            className="flex items-center gap-1 text-sm font-medium text-foreground"
          >
            Все новинки
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
