"use client"

import { DollarSign, Package, ShoppingCart, TrendingUp, Users } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { products, orders, users, reviews } from "@/lib/mock-data"
import { formatPrice } from "@/lib/mock-data"

const stats = [
  { label: "Выручка", value: formatPrice(orders.reduce((s, o) => s + o.total, 0)), icon: DollarSign, change: "+12%" },
  { label: "Заказы", value: String(orders.length), icon: ShoppingCart, change: "+5%" },
  { label: "Товары", value: String(products.length), icon: Package, change: "+3" },
  { label: "Клиенты", value: String(users.filter((u) => u.role === "user").length), icon: Users, change: "+8" },
]

export default function AdminPage() {
  return (
    <AdminShell title="Дашборд" description="Обзор ключевых показателей магазина">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="mt-8 rounded-2xl bg-card p-5 shadow-sm">
        <h2 className="mb-4 font-serif text-lg font-bold text-foreground">Последние заказы</h2>
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
              {orders.map((order) => {
                const user = users.find((u) => u.id === order.userId)
                return (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 font-medium text-foreground">{order.id}</td>
                    <td className="py-3 pr-4 text-foreground">{user?.name || "N/A"}</td>
                    <td className="py-3 pr-4 text-foreground">{formatPrice(order.total)}</td>
                    <td className="py-3 pr-4">
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-foreground">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{order.createdAt}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent reviews */}
      <div className="mt-8 rounded-2xl bg-card p-5 shadow-sm">
        <h2 className="mb-4 font-serif text-lg font-bold text-foreground">Последние отзывы</h2>
        <div className="space-y-3">
          {reviews.slice(0, 4).map((review) => (
            <div key={review.id} className="flex items-start justify-between rounded-xl bg-secondary p-3">
              <div>
                <p className="text-sm font-medium text-foreground">{review.userName}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{review.text}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${review.isApproved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                {review.isApproved ? "Одобрен" : "На модерации"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  )
}
