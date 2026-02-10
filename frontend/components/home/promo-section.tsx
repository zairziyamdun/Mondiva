import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PromoSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left - big promo */}
        <div className="relative overflow-hidden rounded-3xl bg-foreground text-primary-foreground">
          <img
            src="/images/hero-2.jpg"
            alt="Коллекция осень-зима"
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="relative flex flex-col justify-end p-8 lg:min-h-[400px] lg:p-12">
            <p className="text-xs font-medium uppercase tracking-[0.3em] opacity-60">
              Коллекция
            </p>
            <h3 className="mt-2 font-serif text-3xl font-bold lg:text-4xl">
              Осень-Зима 2026
            </h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed opacity-70">
              Тёплые текстуры, элегантные силуэты и природные оттенки для идеального зимнего гардероба.
            </p>
            <Link href="/catalog?category=outerwear" className="mt-6">
              <Button
                variant="outline"
                className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                Подробнее
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right - stacked promos */}
        <div className="flex flex-col gap-6">
          <div className="flex-1 rounded-3xl bg-secondary p-8 lg:p-10">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Бесплатная доставка
            </p>
            <h3 className="mt-3 font-serif text-2xl font-bold text-foreground">
              При заказе от 5 000 &#8381;
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Доставим ваш заказ бесплатно по всей России. Курьерская доставка, СДЭК или Почта России на выбор.
            </p>
          </div>
          <div className="flex-1 rounded-3xl bg-accent/10 p-8 lg:p-10">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
              Лояльность
            </p>
            <h3 className="mt-3 font-serif text-2xl font-bold text-foreground">
              Кэшбэк до 10%
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Зарегистрируйтесь и получайте кэшбэк с каждой покупки. Накопленные бонусы можно использовать для оплаты заказов.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
