"use client"

import Link from "next/link"
import { useState } from "react"
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navigation = [
  { name: "Главная", href: "/" },
  { name: "Каталог", href: "/catalog" },
  { name: "Новинки", href: "/catalog?filter=new" },
  { name: "Скидки", href: "/catalog?filter=sale" },
]

export function SiteHeader() {
  const { count } = useCart()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:h-20">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Меню</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 bg-background">
            <nav className="mt-8 flex flex-col gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="font-serif text-2xl tracking-wide text-foreground transition-colors hover:text-accent"
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-4 border-t border-border pt-4">
                <Link href="/auth/login" className="block py-2 text-sm text-muted-foreground">
                  Войти
                </Link>
                <Link href="/auth/register" className="block py-2 text-sm text-muted-foreground">
                  Регистрация
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold tracking-wider text-foreground lg:text-3xl">
            MonDiva
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-foreground"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Поиск</span>
          </Button>
          <Link href="/account">
            <Button variant="ghost" size="icon" className="hidden text-foreground sm:flex">
              <User className="h-5 w-5" />
              <span className="sr-only">Аккаунт</span>
            </Button>
          </Link>
          <Link href="/account?tab=favorites">
            <Button variant="ghost" size="icon" className="text-foreground">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Избранное</span>
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative text-foreground">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {count}
                </span>
              )}
              <span className="sr-only">Корзина</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-border bg-background px-4 py-3">
          <div className="mx-auto flex max-w-7xl items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск товаров..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
