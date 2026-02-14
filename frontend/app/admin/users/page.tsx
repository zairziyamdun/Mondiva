"use client"

import { useState, useEffect } from "react"
import { Loader2, Trash2 } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { formatDate } from "@/lib/utils"
import { api } from "@/lib/api"
import type { ApiUser } from "@/lib/types"
import { normalizeUser } from "@/lib/types"
import type { User } from "@/lib/types"
import type { UserRole } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const roleLabelMap: Record<UserRole, string> = {
  user: "Пользователь",
  moderator: "Модератор",
  admin: "Администратор",
  logistics: "Логист",
}

const ROLES: UserRole[] = ["user", "moderator", "admin", "logistics"]

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    const res = await api.get<ApiUser[]>("/api/users")
    if (res.ok) {
      setUsers((res.data ?? []).map((u) => normalizeUser(u)).filter(Boolean) as User[])
    } else {
      setError(res.error?.message ?? "Не удалось загрузить пользователей")
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleRoleChange = async (userId: string, role: UserRole) => {
    setUpdatingId(userId)
    const res = await api.patch<ApiUser>(`/api/users/${userId}/role`, { role })
    setUpdatingId(null)
    if (res.ok && res.data) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? normalizeUser(res.data)! : u))
      )
    }
  }

  const handleDelete = async (userId: string) => {
    const res = await api.delete(`/api/users/${userId}`)
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    }
  }

  return (
    <AdminShell title="Пользователи" description="Управление пользователями">
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
                  <th className="p-4">Пользователь</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Телефон</th>
                  <th className="p-4">Роль</th>
                  <th className="p-4">Дата регистрации</th>
                  <th className="p-4">Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0">
                    <td className="p-4 font-medium text-foreground">{user.name}</td>
                    <td className="p-4 text-foreground">{user.email}</td>
                    <td className="p-4 text-muted-foreground">{user.phone || "—"}</td>
                    <td className="p-4">
                      <Select
                        value={user.role}
                        onValueChange={(v) => handleRoleChange(user.id, v as UserRole)}
                        disabled={updatingId === user.id}
                      >
                        <SelectTrigger className="h-8 w-36 text-xs">
                          {updatingId === user.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((value) => (
                            <SelectItem key={value} value={value}>
                              {roleLabelMap[value]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4 text-muted-foreground">{formatDate(user.createdAt)}</td>
                    <td className="p-4">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Удалить пользователя?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {user.name} ({user.email}). Это действие нельзя отменить.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDelete(user.id)}
                            >
                              Удалить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">Нет пользователей</p>
          )}
        </div>
      )}
    </AdminShell>
  )
}
