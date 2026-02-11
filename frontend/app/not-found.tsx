import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold text-foreground">Страница не найдена</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Возможно, товар был удалён или адрес указан неверно
          </p>
          <Link href="/catalog" className="mt-6 inline-block">
            <Button className="rounded-full">В каталог</Button>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
