"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"

export default function LogisticsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute requiredRole="logistics">{children}</ProtectedRoute>
}
