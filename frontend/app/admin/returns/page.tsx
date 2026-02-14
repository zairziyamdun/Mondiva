"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { formatPrice, formatDate } from "@/lib/utils"
import { api } from "@/lib/api"
import type { ApiReturnRequest, ApiOrder, ApiUser } from "@/lib/types"
import { normalizeReturnRequest, normalizeOrder, normalizeUser } from "@/lib/types"
import type { ReturnRequest, Order, User } from "@/lib/types"
import type { ReturnStatus } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const statusLabelMap: Record<
  ReturnStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "Ожидает", variant: "secondary" },
  approved: { label: "Одобрен", variant: "default" },
  rejected: { label: "Отклонён", variant: "destructive" },
  refunded: { label: "Возвращён", variant: "outline" },
}

const STATUS_OPTIONS: ReturnStatus[] = ["pending", "approved", "rejected", "refunded"]

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    const [returnsRes, ordersRes, usersRes] = await Promise.all([
      api.get<ApiReturnRequest[]>("/api/returns"),
      api.get<ApiOrder[]>("/api/orders"),
      api.get<ApiUser[]>("/api/users"),
    ])
    if (returnsRes.ok) {
      setReturns(
        (returnsRes.data ?? []).map((r) => normalizeReturnRequest(r)).filter(Boolean) as ReturnRequest[]
      )
    } else {
      setError(returnsRes.error?.message ?? "Не удалось загрузить возвраты")
    }
    if (ordersRes.ok) {
      setOrders((ordersRes.data ?? []).map((o) => normalizeOrder(o)).filter(Boolean) as Order[])
    }
    if (usersRes.ok) {
      setUsers((usersRes.data ?? []).map((u) => normalizeUser(u)).filter(Boolean) as User[])
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const orderById = (id: string) => orders.find((o) => o.id === id)
  const userById = (id: string) => users.find((u) => u.id === id)

  const handleStatusChange = async (returnId: string, status: ReturnStatus) => {
    setUpdatingId(returnId)
    const res = await api.patch<ApiReturnRequest>(`/api/returns/${returnId}/status`, { status })
    setUpdatingId(null)
    if (res.ok && res.data) {
      setReturns((prev) =>
        prev.map((r) => (r.id === returnId ? normalizeReturnRequest(res.data)! : r))
      )
    }
  }

  return (
    <AdminShell title="Возвраты" description="Управление запросами на возврат">
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Загрузка...</span>
        </div>
      ) : error ? (
        <p className="py-8 text-center text-destructive">{error}</p>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">{returns.length} запросов на возврат</p>
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
                  {returns.map((ret) => {
                    const order = orderById(ret.orderId)
                    const user = userById(ret.userId)
                    return (
                      <tr key={ret.id} className="border-b border-border last:border-0">
                        <td className="p-4 font-medium text-foreground">{ret.id}</td>
                        <td className="p-4 text-foreground">{ret.orderId}</td>
                        <td className="p-4">
                          <p className="text-foreground">{user?.name ?? "N/A"}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </td>
                        <td className="p-4 font-medium text-foreground">
                          {order ? formatPrice(order.total) : "—"}
                        </td>
                        <td className="p-4 text-muted-foreground">{ret.reason}</td>
                        <td className="p-4">
                          <Select
                            value={ret.status}
                            onValueChange={(v) => handleStatusChange(ret.id, v as ReturnStatus)}
                            disabled={updatingId === ret.id}
                          >
                            <SelectTrigger className="h-8 w-36 text-xs">
                              {updatingId === ret.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <SelectValue />
                              )}
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map((value) => (
                                <SelectItem key={value} value={value}>
                                  {statusLabelMap[value].label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4 text-muted-foreground">{formatDate(ret.createdAt)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {returns.length === 0 && (
              <p className="py-12 text-center text-sm text-muted-foreground">Нет запросов на возврат</p>
            )}
          </div>
        </>
      )}
    </AdminShell>
  )
}
