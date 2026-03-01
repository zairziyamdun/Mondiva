"use client"

import { useState, useEffect } from "react"
import { Heart, Minus, Plus, ShoppingBag, Star, Truck } from "lucide-react"
import type { Product, Review } from "@/lib/types"
import { formatPrice, cn } from "@/lib/utils"
import { getCurrentPrice, hasActiveDiscount, getDiscountPercent } from "@/lib/utils/pricing"
import { normalizeReview } from "@/lib/types"
import type { ApiReview } from "@/lib/types"
import { api } from "@/lib/api"
import { useCart } from "@/lib/cart-store"
import { useFavorites } from "@/lib/favorites-store"
import { Button } from "@/components/ui/button"

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "")
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState<Review[]>([])
  const { addToCart } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const liked = isFavorite(product.id)
  const currentPrice = getCurrentPrice(product)
  const discountPercent = getDiscountPercent(product)
  const outOfStock = product.stock <= 0
  const lowStock = product.stock > 0 && product.stock < 5

  useEffect(() => {
    api.get<ApiReview[]>(`/api/reviews/product/${product.id}`).then((res) => {
      if (res.ok && Array.isArray(res.data)) {
        const list = res.data.map((r) => normalizeReview(r)).filter(Boolean) as Review[]
        setReviews(list.filter((r) => r.isApproved))
      }
    })
  }, [product.id])

  const productReviews = reviews

  const handleAddToCart = () => {
    if (!selectedSize) return
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity,
      price: currentPrice,
    })
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Gallery */}
      <div className="space-y-4">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-secondary">
          <img
            src={product.images[selectedImage] || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          {discountPercent != null && discountPercent > 0 && (
            <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              -{discountPercent}%
            </span>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setSelectedImage(i)}
                className={cn(
                  "aspect-square w-20 overflow-hidden rounded-xl border-2 transition-colors",
                  selectedImage === i ? "border-foreground" : "border-transparent",
                )}
              >
                <img src={img || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{product.brand}</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-foreground lg:text-4xl">{product.name}</h1>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={`star-${product.id}-${i}`}
                className={cn(
                  "h-4 w-4",
                  i < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-border",
                )}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.rating} ({product.reviewCount} отзывов)
          </span>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-2xl font-bold text-foreground">{formatPrice(currentPrice)}</span>
          {product.oldPrice != null && (
            <span className="text-lg text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>

        {/* Description */}
        <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>

        {/* Color */}
        <div className="mt-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Цвет: {selectedColor}
          </h3>
          <div className="flex gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm transition-colors",
                  selectedColor === color
                    ? "border-foreground bg-foreground text-primary-foreground"
                    : "border-border text-foreground hover:border-foreground",
                )}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="mt-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Размер</h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors",
                  selectedSize === size
                    ? "border-foreground bg-foreground text-primary-foreground"
                    : "border-border text-foreground hover:border-foreground",
                )}
              >
                {size}
              </button>
            ))}
          </div>
          {!selectedSize && (
            <p className="mt-1.5 text-xs text-accent">Выберите размер</p>
          )}
        </div>

        {/* Quantity */}
        <div className="mt-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Количество</h3>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="h-10 w-10"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center text-sm font-semibold text-foreground">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="h-10 w-10"
              disabled={quantity >= product.stock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {lowStock && (
            <p className="mt-1.5 text-xs text-amber-600">Осталось мало ({product.stock} шт.)</p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-3">
          <Button
            size="lg"
            className="flex-1 rounded-full"
            disabled={!selectedSize || outOfStock}
            onClick={handleAddToCart}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            {outOfStock ? "Нет в наличии" : "Добавить в корзину"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-4 bg-transparent"
            onClick={() => toggleFavorite(product.id)}
          >
            <Heart className={cn("h-5 w-5", liked && "fill-accent text-accent")} />
          </Button>
        </div>

        {/* Delivery */}
        <div className="mt-8 rounded-2xl bg-secondary p-4">
          <div className="flex items-start gap-3">
            <Truck className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Бесплатная доставка от 5 000 &#8381;</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Курьер, СДЭК, Почта России - 2-5 рабочих дней</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {productReviews.length > 0 && (
          <div className="mt-10">
            <h3 className="mb-4 font-serif text-xl font-bold text-foreground">Отзывы</h3>
            <div className="space-y-4">
              {productReviews.map((review) => (
                <div key={review.id} className="rounded-2xl bg-secondary p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{review.userName}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={`review-${review.id}-star-${i}`}
                          className={cn(
                            "h-3 w-3",
                            i < review.rating ? "fill-amber-400 text-amber-400" : "text-border",
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.text}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{review.createdAt}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
