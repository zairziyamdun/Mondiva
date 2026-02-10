import Link from "next/link"
import { categories } from "@/lib/mock-data"

export function CategoriesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
      <div className="mb-10 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Коллекции
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-foreground lg:text-4xl">
          Категории
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/catalog?category=${cat.slug}`}
            className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
          >
            <img
              src={cat.image || "/placeholder.svg"}
              alt={cat.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-serif text-lg font-semibold tracking-wide text-primary-foreground">
                {cat.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
