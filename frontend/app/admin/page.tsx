"use client"

import { useState, useEffect } from "react"
import { DollarSign, Loader2, Package, ShoppingCart, Users } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { formatPrice, formatDate } from "@/lib/utils"
import { api } from "@/lib/api"
import type { ApiOrder, ApiUser } from "@/lib/types"
import { normalizeOrder, normalizeUser } from "@/lib/types"
import type { Order, User } from "@/lib/types"

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [productsCount, setProductsCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        api.get<ApiOrder[]>("/api/orders"),
        api.get<ApiUser[]>("/api/users"),
        api.get<unknown[]>("/api/products"),
      ])
      if (ordersRes.ok) {
        setOrders((ordersRes.data ?? []).map((o) => normalizeOrder(o)).filter(Boolean) as Order[])
      }
      if (usersRes.ok) {
        setUsers((usersRes.data ?? []).map((u) => normalizeUser(u)).filter(Boolean) as User[])
      }
      if (productsRes.ok && Array.isArray(productsRes.data)) {
        setProductsCount(productsRes.data.length)
      }
      if (!ordersRes.ok && !usersRes.ok) {
        setError("Не удалось загрузить данные")
      }
      setLoading(false)
    }
    load()
  }, [])

  const revenue = orders.reduce((s, o) => s + o.total, 0)
  const clientsCount = users.filter((u) => u.role === "user").length
  const userById = (id: string) => users.find((u) => u.id === id)

  const stats = [
    { label: "Выручка", value: formatPrice(revenue), icon: DollarSign },
    { label: "Заказы", value: String(orders.length), icon: ShoppingCart },
    { label: "Товары", value: String(productsCount), icon: Package },
    { label: "Клиенты", value: String(clientsCount), icon: Users },
  ]

  return (
    <AdminShell title="Дашборд" description="Обзор ключевых показателей магазина">
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Загрузка...</span>
        </div>
      ) : error ? (
        <p className="py-8 text-center text-destructive">{error}</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-card p-5 shadow-sm">
            <h2 className="mb-4 font-serif text-lg font-bold text-foreground">Последние заказы</h2>
            {orders.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Нет заказов</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="pb-3 pr-4">ID</th>
                      <th className="pb-3 pr-4">Клиент</th>
                      <th className="pb-3 pr-4">Сумма</th>
                      <th className="pb-3 pr-4">Статус</th>
                      <th className="pb-3">Дата</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map((order) => (
                      <tr key={order.id} className="border-b border-border last:border-0">
                        <td className="py-3 pr-4 font-medium text-foreground">{order.id}</td>
                        <td className="py-3 pr-4 text-foreground">{userById(order.userId)?.name ?? "N/A"}</td>
                        <td className="py-3 pr-4 text-foreground">{formatPrice(order.total)}</td>
                        <td className="py-3 pr-4">
                          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-foreground">
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-muted-foreground">{formatDate(order.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </AdminShell>
  )
}
