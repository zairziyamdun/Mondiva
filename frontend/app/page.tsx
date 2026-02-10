import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HeroSection } from "@/components/home/hero-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { NewArrivalsSection } from "@/components/home/new-arrivals-section"
import { PopularSection } from "@/components/home/popular-section"
import { SaleSection } from "@/components/home/sale-section"
import { PromoSection } from "@/components/home/promo-section"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <CategoriesSection />
        <NewArrivalsSection />
        <PromoSection />
        <PopularSection />
        <SaleSection />
      </main>
      <SiteFooter />
    </>
  )
}
