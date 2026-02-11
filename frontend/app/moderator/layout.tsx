"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"

export default function ModeratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute requiredRole="moderator">{children}</ProtectedRoute>
}
