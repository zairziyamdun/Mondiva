"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CheckoutContent } from "@/components/checkout/checkout-content"
import { ProtectedRoute } from "@/components/auth/protected-route"

export function CheckoutPageClient() {
  return (
    <ProtectedRoute>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <h1 className="mb-8 font-serif text-3xl font-bold text-foreground lg:text-4xl">
          Оформление заказа
        </h1>
        <CheckoutContent />
      </main>
      <SiteFooter />
    </ProtectedRoute>
  )
}
