"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { formatPrice, formatDate } from "@/lib/utils"
import { api } from "@/lib/api"
import type { ApiOrder, ApiUser } from "@/lib/types"
import { normalizeOrder, normalizeUser } from "@/lib/types"
import type { Order, User } from "@/lib/types"
import type { OrderStatus } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const statusMap: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Ожидает", variant: "secondary" },
  confirmed: { label: "Подтверждён", variant: "outline" },
  processing: { label: "В обработке", variant: "outline" },
  shipped: { label: "Отправлен", variant: "default" },
  in_transit: { label: "В пути", variant: "default" },
  delivered: { label: "Доставлен", variant: "default" },
  cancelled: { label: "Отменён", variant: "destructive" },
}

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "in_transit",
  "delivered",
  "cancelled",
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    const [ordersRes, usersRes] = await Promise.all([
      api.get<ApiOrder[]>("/api/orders"),
      api.get<ApiUser[]>("/api/users"),
    ])
    if (ordersRes.ok) {
      setOrders((ordersRes.data ?? []).map((o) => normalizeOrder(o)).filter(Boolean) as Order[])
    } else {
      setError(ordersRes.error?.message ?? "Не удалось загрузить заказы")
    }
    if (usersRes.ok) {
      setUsers((usersRes.data ?? []).map((u) => normalizeUser(u)).filter(Boolean) as User[])
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const userById = (id: string) => users.find((u) => u.id === id)

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId)
    const res = await api.patch<ApiOrder>(`/api/orders/${orderId}/status`, { status })
    setUpdatingId(null)
    if (res.ok && res.data) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? normalizeOrder(res.data as ApiOrder)! : o))
      )
    }
  }

  return (
    <AdminShell title="Заказы" description="Управление заказами клиентов">
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Загрузка...</span>
        </div>
      ) : error ? (
        <p className="py-8 text-center text-destructive">{error}</p>
      ) : (
        <div className="rounded-2xl bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="p-4">Заказ</th>
                  <th className="p-4">Клиент</th>
                  <th className="p-4">Товары</th>
                  <th className="p-4">Сумма</th>
                  <th className="p-4">Статус</th>
                  <th className="p-4">Дата</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const user = userById(order.userId)
                  return (
                    <tr key={order.id} className="border-b border-border last:border-0">
                      <td className="p-4 font-medium text-foreground">{order.id}</td>
                      <td className="p-4">
                        <p className="text-foreground">{user?.name ?? "N/A"}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </td>
                      <td className="p-4 text-foreground">{order.items.length} шт.</td>
                      <td className="p-4 font-medium text-foreground">{formatPrice(order.total)}</td>
                      <td className="p-4">
                        <Select
                          value={order.status}
                          onValueChange={(v) => handleStatusChange(order.id, v as OrderStatus)}
                          disabled={updatingId === order.id}
                        >
                          <SelectTrigger className="h-8 w-36 text-xs">
                            {updatingId === order.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((value) => (
                              <SelectItem key={value} value={value}>
                                {statusMap[value].label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4 text-muted-foreground">{formatDate(order.createdAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">Нет заказов</p>
          )}
        </div>
      )}
    </AdminShell>
  )
}
