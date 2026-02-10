import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import heroImage from "@/public/images/hero.jpg"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-foreground text-primary-foreground">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        {/* Content */}
        <div className="flex flex-col justify-center px-6 py-20 lg:px-12 lg:py-32">
          <p className="text-xs font-medium uppercase tracking-[0.3em] opacity-50">
            Новая коллекция 2026
          </p>
          <h1 className="mt-4 font-serif text-5xl font-bold leading-tight tracking-tight lg:text-7xl">
            Стильно жить
            <br />
            не запретишь
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed opacity-70">
            Откройте для себя мир премиальной женской моды. Элегантность, качество и индивидуальный стиль в каждой детали.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/catalog">
              <Button
                size="lg"
                className="rounded-full bg-primary-foreground px-8 text-foreground hover:bg-primary-foreground/90"
              >
                Смотреть каталог
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/catalog?filter=new">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-primary-foreground/30 px-8 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                Новинки
              </Button>
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="relative hidden lg:block">
          <img
            src={heroImage.src}
            alt="Новая коллекция MonDiva"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/30 to-transparent" />
        </div>
      </div>
    </section>
  )
}
