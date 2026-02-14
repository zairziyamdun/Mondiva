"use client"

import React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Box, Home, Layers, LayoutDashboard, Package, Star, ShoppingCart, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminShellProps {
  children: React.ReactNode
  title: string
  description?: string
}

const sidebarLinks = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/products", label: "Товары", icon: Box },
  { href: "/admin/categories", label: "Категории", icon: Layers },
  { href: "/admin/orders", label: "Заказы", icon: ShoppingCart },
  { href: "/admin/users", label: "Пользователи", icon: Users },
  { href: "/admin/reviews", label: "Отзывы", icon: Star },
  { href: "/admin/returns", label: "Возвраты", icon: Package },
  { href: "/admin/analytics", label: "Аналитика", icon: BarChart3 },
]

export function AdminShell({ children, title, description }: AdminShellProps) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/" className="font-serif text-xl font-bold text-foreground">
            MonDiva
          </Link>
          <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
            Admin
          </span>
        </div>
        <nav className="space-y-1 p-4">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                pathname === link.href
                  ? "bg-secondary font-medium text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-border p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            На сайт
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1">
        <header className="flex h-16 items-center border-b border-border bg-card px-6">
          <div className="flex items-center gap-2 lg:hidden">
            <Link href="/" className="font-serif text-lg font-bold text-foreground">MonDiva</Link>
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
              Admin
            </span>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        </header>
        <div className="p-6">
          <div className="mb-6 lg:hidden">
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          {/* Mobile nav */}
          <div className="mb-6 flex gap-2 overflow-x-auto lg:hidden">
            {sidebarLinks.slice(0, 5).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  pathname === link.href
                    ? "border-foreground bg-foreground text-primary-foreground"
                    : "border-border text-muted-foreground",
                )}
              >
                <link.icon className="h-3 w-3" />
                {link.label}
              </Link>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
