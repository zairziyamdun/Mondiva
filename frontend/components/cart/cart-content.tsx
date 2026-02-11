"use client"

import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function CartContent() {
  const { items, total, updateQuantity, removeFromCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-border" />
        <h2 className="mt-4 font-serif text-xl font-semibold text-foreground">Корзина пуста</h2>
        <p className="mt-2 text-sm text-muted-foreground">Добавьте товары из каталога</p>
        <Link href="/catalog" className="mt-6">
          <Button className="rounded-full px-8">Перейти в каталог</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Items */}
      <div className="lg:col-span-2">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size}-${item.color}`}
              className="flex gap-4 rounded-2xl bg-card p-4 shadow-sm"
            >
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="h-28 w-20 rounded-xl object-cover sm:h-32 sm:w-24"
              />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">{item.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.color} / {item.size}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 bg-transparent"
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 bg-transparent"
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => removeFromCart(item.productId, item.size, item.color)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-2xl bg-card p-6 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-foreground">Итого</h2>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Товары ({items.reduce((s, i) => s + i.quantity, 0)})</span>
              <span className="text-foreground">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Доставка</span>
              <span className="text-foreground">{total >= 5000 ? "Бесплатно" : formatPrice(500)}</span>
            </div>
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <div className="flex justify-between">
              <span className="font-semibold text-foreground">К оплате</span>
              <span className="text-lg font-bold text-foreground">
                {formatPrice(total >= 5000 ? total : total + 500)}
              </span>
            </div>
          </div>
          <Link href="/checkout" className="mt-6 block">
            <Button className="w-full rounded-full" size="lg">
              Оформить заказ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
