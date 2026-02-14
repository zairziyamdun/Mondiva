"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Heart, Loader2, Package, RotateCcw, Settings, User } from "lucide-react"
import { formatPrice, formatDate } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useFavorites } from "@/lib/favorites-store"
import { api } from "@/lib/api"
import type { Order, ReturnRequest, Product } from "@/lib/types"
import { normalizeOrder, normalizeReturnRequest, normalizeProduct } from "@/lib/types"
import type { ApiOrder, ApiReturnRequest, ApiProduct } from "@/lib/types"
import { ProductCard } from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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
  const tabFromUrl = searchParams.get("tab") || "profile"
  const [activeTab, setActiveTab] = useState(tabFromUrl)
  const { user } = useAuth()
  const { ids: favoriteIds } = useFavorites()

  const [orders, setOrders] = useState<Order[]>([])
  const [returns, setReturns] = useState<ReturnRequest[]>([])
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [returnsLoading, setReturnsLoading] = useState(true)
  const [favoritesLoading, setFavoritesLoading] = useState(false)
  const [ordersError, setOrdersError] = useState<string | null>(null)
  const [returnsError, setReturnsError] = useState<string | null>(null)

  // Синхронизация вкладки с URL
  useEffect(() => {
    setActiveTab(tabFromUrl)
  }, [tabFromUrl])

  // Загрузка заказов: GET /api/orders/my
  useEffect(() => {
    if (!user) return
    setOrdersLoading(true)
    setOrdersError(null)
    api
      .get<ApiOrder[]>("/api/orders/my")
      .then((res) => {
        if (res.ok) {
          setOrders((res.data ?? []).map((o) => normalizeOrder(o)).filter(Boolean) as Order[])
        } else {
          setOrdersError(res.error?.message ?? "Не удалось загрузить заказы")
        }
      })
      .catch(() => setOrdersError("Не удалось загрузить заказы"))
      .finally(() => setOrdersLoading(false))
  }, [user])

  // Загрузка возвратов: GET /api/returns/my
  useEffect(() => {
    if (!user) return
    setReturnsLoading(true)
    setReturnsError(null)
    api
      .get<ApiReturnRequest[]>("/api/returns/my")
      .then((res) => {
        if (res.ok) {
          setReturns((res.data ?? []).map((r) => normalizeReturnRequest(r)).filter(Boolean) as ReturnRequest[])
        } else {
          setReturnsError(res.error?.message ?? "Не удалось загрузить возвраты")
        }
      })
      .catch(() => setReturnsError("Не удалось загрузить возвраты"))
      .finally(() => setReturnsLoading(false))
  }, [user])

  // Загрузка товаров для избранного: GET /api/products, фильтр по favoriteIds
  useEffect(() => {
    if (activeTab !== "favorites" || favoriteIds.length === 0) {
      setFavoriteProducts([])
      return
    }
    setFavoritesLoading(true)
    api
      .get<ApiProduct[]>("/api/products")
      .then((res) => {
        if (res.ok && res.data) {
          const list = Array.isArray(res.data) ? res.data : []
          const normalized = list.map((p) => normalizeProduct(p)).filter(Boolean) as Product[]
          setFavoriteProducts(normalized.filter((p) => favoriteIds.includes(p.id)))
        } else {
          setFavoriteProducts([])
        }
      })
      .catch(() => setFavoriteProducts([]))
      .finally(() => setFavoritesLoading(false))
  }, [activeTab, favoriteIds.length, favoriteIds.join(",")])

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
          <User className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">{user?.name ?? ""}</h1>
          <p className="text-sm text-muted-foreground">{user?.email ?? ""}</p>
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

      {/* Profile tab — данные из useAuth (GET /api/users/me при инициализации) */}
      {activeTab === "profile" && (
        <div className="max-w-lg space-y-4 rounded-2xl bg-card p-6 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-foreground">Личные данные</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs text-muted-foreground">Имя</Label>
              <Input defaultValue={user?.name ?? ""} className="mt-1" readOnly />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <Input defaultValue={user?.email ?? ""} className="mt-1" readOnly />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Телефон</Label>
            <Input defaultValue={user?.phone ?? ""} className="mt-1" placeholder="Не указан" readOnly />
          </div>
          <p className="text-xs text-muted-foreground">Изменение профиля будет доступно в следующей версии.</p>
        </div>
      )}

      {/* Orders tab */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {ordersLoading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Загрузка заказов...</span>
            </div>
          ) : ordersError ? (
            <p className="py-12 text-center text-sm text-destructive">{ordersError}</p>
          ) : orders.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">У вас пока нет заказов</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="rounded-2xl bg-card p-4 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                  <Badge variant={statusLabels[order.status]?.variant || "secondary"}>
                    {statusLabels[order.status]?.label || order.status}
                  </Badge>
                </div>
                <div className="mt-4 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={`${String(item.productId)}-${item.size}-${idx}`} className="flex items-center gap-3 text-sm">
                      <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-12 w-9 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.size} / {item.color} x{item.quantity}</p>
                      </div>
                      <span className="text-sm text-foreground">{formatPrice(item.price * item.quantity)}</span>
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
          {returnsLoading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Загрузка возвратов...</span>
            </div>
          ) : returnsError ? (
            <p className="py-12 text-center text-sm text-destructive">{returnsError}</p>
          ) : returns.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">Нет запросов на возврат</p>
          ) : (
            returns.map((ret) => (
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
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(ret.createdAt)}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Favorites tab */}
      {activeTab === "favorites" && (
        <div>
          {favoritesLoading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Загрузка...</span>
            </div>
          ) : favoriteProducts.length === 0 ? (
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
