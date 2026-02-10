"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Heart, Package, RotateCcw, Settings, User } from "lucide-react"
import { users, orders, returnRequests, products, formatPrice } from "@/lib/mock-data"
import { useFavorites } from "@/lib/favorites-store"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const mockUser = users[0]
const mockOrders = orders.filter((o) => o.userId === mockUser.id)
const mockReturns = returnRequests.filter((r) => r.userId === mockUser.id)

const tabs = [
  { id: "profile", label: "Профиль", icon: Settings },
  { id: "orders", label: "Заказы", icon: Package },
  { id: "returns", label: "Возвраты", icon: RotateCcw },
  { id: "favorites", label: "Избранное", icon: Heart },
]

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Ожидает", variant: "secondary" },
  confirmed: { label: "Подтверждён", variant: "outline" },
  processing: { label: "В обработке", variant: "outline" },
  shipped: { label: "Отправлен", variant: "default" },
  in_transit: { label: "В пути", variant: "default" },
  delivered: { label: "Доставлен", variant: "default" },
  cancelled: { label: "Отменён", variant: "destructive" },
  approved: { label: "Одобрен", variant: "default" },
  rejected: { label: "Отклонён", variant: "destructive" },
  refunded: { label: "Возврат средств", variant: "default" },
}

export function AccountContent() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") || "profile"
  const [activeTab, setActiveTab] = useState(initialTab)
  const { ids: favoriteIds } = useFavorites()
  const favoriteProducts = products.filter((p) => favoriteIds.includes(p.id))

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
          <User className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">{mockUser.name}</h1>
          <p className="text-sm text-muted-foreground">{mockUser.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-2 overflow-x-auto border-b border-border pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === "profile" && (
        <div className="max-w-lg space-y-4 rounded-2xl bg-card p-6 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-foreground">Личные данные</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs text-muted-foreground">Имя</Label>
              <Input defaultValue={mockUser.name} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <Input defaultValue={mockUser.email} className="mt-1" />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Телефон</Label>
            <Input defaultValue={mockUser.phone || ""} className="mt-1" />
          </div>
          <Button className="rounded-full">Сохранить</Button>
        </div>
      )}

      {/* Orders tab */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {mockOrders.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">У вас пока нет заказов</p>
          ) : (
            mockOrders.map((order) => (
              <div key={order.id} className="rounded-2xl bg-card p-4 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.createdAt}</p>
                  </div>
                  <Badge variant={statusLabels[order.status]?.variant || "secondary"}>
                    {statusLabels[order.status]?.label || order.status}
                  </Badge>
                </div>
                <div className="mt-4 space-y-2">
                  {order.items.map((item) => (
                    <div key={`${item.productId}-${item.size}`} className="flex items-center gap-3 text-sm">
                      <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-12 w-9 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.size} / {item.color} x{item.quantity}</p>
                      </div>
                      <span className="text-sm text-foreground">{formatPrice(item.price)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between border-t border-border pt-3">
                  <span className="text-sm text-muted-foreground">Итого</span>
                  <span className="font-semibold text-foreground">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Returns tab */}
      {activeTab === "returns" && (
        <div className="space-y-4">
          {mockReturns.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">Нет запросов на возврат</p>
          ) : (
            mockReturns.map((ret) => (
              <div key={ret.id} className="rounded-2xl bg-card p-4 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{ret.id}</p>
                    <p className="text-xs text-muted-foreground">Заказ: {ret.orderId}</p>
                  </div>
                  <Badge variant={statusLabels[ret.status]?.variant || "secondary"}>
                    {statusLabels[ret.status]?.label || ret.status}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Причина: {ret.reason}</p>
                <p className="mt-1 text-xs text-muted-foreground">{ret.createdAt}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Favorites tab */}
      {activeTab === "favorites" && (
        <div>
          {favoriteProducts.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              В избранном пока ничего нет. Нажмите на сердечко на карточке товара, чтобы добавить.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {favoriteProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
