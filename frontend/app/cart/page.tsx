import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartContent } from "@/components/cart/cart-content"

export default function CartPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <h1 className="mb-8 font-serif text-3xl font-bold text-foreground lg:text-4xl">Корзина</h1>
        <CartContent />
      </main>
      <SiteFooter />
    </>
  )
}
