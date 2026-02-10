"use client"

import { useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { returnRequests, orders, users, formatPrice } from "@/lib/mock-data"
import type { ReturnStatus } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const statusLabelMap: Record<
  ReturnStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "Ожидает", variant: "secondary" },
  approved: { label: "Одобрен", variant: "default" },
  rejected: { label: "Отклонён", variant: "destructive" },
  refunded: { label: "Возвращён", variant: "outline" },
}

export default function AdminReturnsPage() {
  const [statuses, setStatuses] = useState<Record<string, ReturnStatus>>(
    Object.fromEntries(returnRequests.map((r) => [r.id, r.status]))
  )

  return (
    <AdminShell title="Возвраты" description="Управление запросами на возврат">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          {returnRequests.length} запросов на возврат
        </p>
      </div>

      <div className="rounded-2xl bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="p-4">ID</th>
                <th className="p-4">Заказ</th>
                <th className="p-4">Клиент</th>
                <th className="p-4">Сумма заказа</th>
                <th className="p-4">Причина</th>
                <th className="p-4">Статус</th>
                <th className="p-4">Дата</th>
              </tr>
            </thead>
            <tbody>
              {returnRequests.map((ret) => {
                const order = orders.find((o) => o.id === ret.orderId)
                const user = users.find((u) => u.id === ret.userId)
                const currentStatus = statuses[ret.id]

                return (
                  <tr
                    key={ret.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="p-4 font-medium text-foreground">
                      {ret.id}
                    </td>
                    <td className="p-4 text-foreground">{ret.orderId}</td>
                    <td className="p-4">
                      <p className="text-foreground">{user?.name || "N/A"}</p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </td>
                    <td className="p-4 font-medium text-foreground">
                      {order ? formatPrice(order.total) : "-"}
                    </td>
                    <td className="p-4 text-muted-foreground">{ret.reason}</td>
                    <td className="p-4">
                      <Select
                        value={currentStatus}
                        onValueChange={(v) =>
                          setStatuses((prev) => ({
                            ...prev,
                            [ret.id]: v as ReturnStatus,
                          }))
                        }
                      >
                        <SelectTrigger className="h-8 w-36 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusLabelMap).map(
                            ([value, { label }]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {ret.createdAt}
                    </td>
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
