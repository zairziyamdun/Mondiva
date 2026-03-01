"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import type { Product } from "@/lib/types"
import { formatPrice, cn } from "@/lib/utils"
import { getCurrentPrice, hasActiveDiscount, getDiscountPercent } from "@/lib/utils/pricing"
import { useFavorites } from "@/lib/favorites-store"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const liked = isFavorite(product.id)
  const currentPrice = getCurrentPrice(product)
  const discountPercent = getDiscountPercent(product)

  return (
    <div className="group relative rounded-2xl transition-shadow duration-300 hover:shadow-lg">
      {/* Image */}
      <Link href={`/product/${product.slug || product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-secondary">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                New
              </span>
            )}
            {discountPercent != null && discountPercent > 0 && (
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                -{discountPercent}%
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Favorite */}
      <button
        type="button"
        onClick={() => toggleFavorite(product.id)}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-colors hover:bg-background"
        aria-label="Добавить в избранное"
      >
        <Heart
          className={cn("h-4 w-4 transition-colors", liked ? "fill-accent text-accent" : "text-foreground")}
        />
      </button>

      {/* Info */}
      <div className="mt-3 space-y-1">
        <p className="text-xs text-muted-foreground">{product.brand}</p>
        <Link href={`/product/${product.slug || product.id}`}>
          <h3 className="text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-accent">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{formatPrice(currentPrice)}</span>
          {product.oldPrice != null && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
