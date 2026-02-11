"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AccountContent } from "@/components/account/account-content"
import { ProtectedRoute } from "@/components/auth/protected-route"

export function AccountPageClient() {
  return (
    <ProtectedRoute>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <AccountContent />
      </main>
      <SiteFooter />
    </ProtectedRoute>
  )
}
