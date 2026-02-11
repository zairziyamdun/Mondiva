"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import type { UserRole } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  /** Требуемая роль (или несколько — достаточно одной). Не указывать для любых авторизованных */
  requiredRole?: UserRole | UserRole[]
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      const returnUrl = pathname ? `?returnUrl=${encodeURIComponent(pathname)}` : ""
      window.location.href = `/auth/login${returnUrl}`
      return
    }
    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
      const allowed = roles.includes(user.role) || user.role === "admin"
      if (!allowed) {
        window.location.href = "/"
      }
    }
  }, [user, isLoading, pathname, requiredRole])

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    )
  }
  if (!user) return null
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (!roles.includes(user.role) && user.role !== "admin") return null
  }
  return <>{children}</>
}
