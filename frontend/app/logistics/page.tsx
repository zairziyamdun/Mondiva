"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, MapPin, Package, Truck } from "lucide-react"
import { orders, users, formatPrice } from "@/lib/mock-data"
import type { OrderStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const deliveryStatuses: { value: OrderStatus; label: string }[] = [
  { value: "confirmed", label: "Подтверждён" },
  { value: "processing", label: "Собирается" },
  { value: "shipped", label: "Отправлен" },
  { value: "in_transit", label: "В пути" },
  { value: "delivered", label: "Доставлен" },
]

export default function LogisticsPage() {
  const [orderStatuses, setOrderStatuses] = useState<
    Record<string, OrderStatus>
  >(Object.fromEntries(orders.map((o) => [o.id, o.status])))

  const [trackingCodes, setTrackingCodes] = useState<Record<string, string>>(
    Object.fromEntries(orders.map((o) => [o.id, ""]))
  )

  const updateStatus = (orderId: string, status: OrderStatus) => {
    setOrderStatuses((prev) => ({ ...prev, [orderId]: status }))
  }

  const updateTracking = (orderId: string, code: string) => {
    setTrackingCodes((prev) => ({ ...prev, [orderId]: code }))
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link
            href="/"
            className="font-serif text-xl font-bold text-foreground"
          >
            MonDiva
          </Link>
          <span className="ml-2 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
            Логистика
          </span>
        </div>
        <nav className="space-y-1 p-4">
          <Link
            href="/logistics"
            className="flex items-center gap-3 rounded-xl bg-secondary px-3 py-2.5 text-sm font-medium text-foreground"
          >
            <Truck className="h-4 w-4" />
            Доставки
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            На сайт
          </Link>
        </nav>
      </aside>

      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-foreground">
            Управление доставками
          </h1>
          <p className="text-xs text-muted-foreground">
            Обновление статуса заказов и отслеживание доставки
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">В обработке</p>
            </div>
            <p className="mt-2 text-xl font-bold text-foreground">
              {
                Object.values(orderStatuses).filter(
                  (s) => s === "processing" || s === "confirmed"
                ).length
              }
            </p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">В доставке</p>
            </div>
            <p className="mt-2 text-xl font-bold text-foreground">
              {
                Object.values(orderStatuses).filter(
                  (s) => s === "shipped" || s === "in_transit"
                ).length
              }
            </p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Доставлено</p>
            </div>
            <p className="mt-2 text-xl font-bold text-foreground">
              {
                Object.values(orderStatuses).filter((s) => s === "delivered")
                  .length
              }
            </p>
          </div>
        </div>

        {/* Orders table */}
        <div className="rounded-2xl bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="p-4">Заказ</th>
                  <th className="p-4">Клиент</th>
                  <th className="p-4">Адрес</th>
                  <th className="p-4">Способ</th>
                  <th className="p-4">Статус</th>
                  <th className="p-4">Трек-код</th>
                  <th className="p-4">Действия</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const user = users.find((u) => u.id === order.userId)
                  const currentStatus = orderStatuses[order.id]
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="p-4">
                        <p className="font-medium text-foreground">
                          {order.id}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(order.total)}
                        </p>
                      </td>
                      <td className="p-4 text-foreground">
                        {user?.name || "N/A"}
                      </td>
                      <td className="max-w-[180px] p-4 text-xs text-muted-foreground">
                        {order.address}
                      </td>
                      <td className="p-4 text-foreground">
                        {order.deliveryMethod}
                      </td>
                      <td className="p-4">
                        <Select
                          value={currentStatus}
                          onValueChange={(v) =>
                            updateStatus(order.id, v as OrderStatus)
                          }
                        >
                          <SelectTrigger className="h-8 w-40 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {deliveryStatuses.map((s) => (
                              <SelectItem key={s.value} value={s.value}>
                                {s.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4">
                        <Input
                          value={trackingCodes[order.id] ?? ""}
                          onChange={(e) =>
                            updateTracking(order.id, e.target.value)
                          }
                          placeholder="Трек-номер"
                          className="h-8 w-40 text-xs"
                        />
                      </td>
                      <td className="p-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-transparent text-xs"
                          onClick={() => {
                            const currentIdx = deliveryStatuses.findIndex(
                              (s) => s.value === currentStatus
                            )
                            if (currentIdx < deliveryStatuses.length - 1) {
                              updateStatus(
                                order.id,
                                deliveryStatuses[currentIdx + 1].value
                              )
                            }
                          }}
                        >
                          Следующий этап
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
