"use client"

import { AdminShell } from "@/components/admin/admin-shell"
import { users } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const roleLabelMap: Record<string, string> = {
  user: "Пользователь",
  moderator: "Модератор",
  admin: "Администратор",
  logistics: "Логист",
}

export default function AdminUsersPage() {
  return (
    <AdminShell title="Пользователи" description="Управление пользователями">
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
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0">
                  <td className="p-4 font-medium text-foreground">{user.name}</td>
                  <td className="p-4 text-foreground">{user.email}</td>
                  <td className="p-4 text-muted-foreground">{user.phone || "-"}</td>
                  <td className="p-4">
                    <Select defaultValue={user.role}>
                      <SelectTrigger className="h-8 w-36 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(roleLabelMap).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-4 text-muted-foreground">{user.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
