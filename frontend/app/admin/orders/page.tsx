"use client"

import { AdminShell } from "@/components/admin/admin-shell"
import { orders, users } from "@/lib/mock-data"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Ожидает", variant: "secondary" },
  confirmed: { label: "Подтверждён", variant: "outline" },
  processing: { label: "В обработке", variant: "outline" },
  shipped: { label: "Отправлен", variant: "default" },
  in_transit: { label: "В пути", variant: "default" },
  delivered: { label: "Доставлен", variant: "default" },
  cancelled: { label: "Отменён", variant: "destructive" },
}

export default function AdminOrdersPage() {
  return (
    <AdminShell title="Заказы" description="Управление заказами клиентов">
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
                const user = users.find((u) => u.id === order.userId)
                return (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="p-4 font-medium text-foreground">{order.id}</td>
                    <td className="p-4">
                      <p className="text-foreground">{user?.name || "N/A"}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </td>
                    <td className="p-4 text-foreground">{order.items.length} шт.</td>
                    <td className="p-4 font-medium text-foreground">{formatPrice(order.total)}</td>
                    <td className="p-4">
                      <Select defaultValue={order.status}>
                        <SelectTrigger className="h-8 w-36 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusMap).map(([value, { label }]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4 text-muted-foreground">{order.createdAt}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
