"use client"

import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground">Регистрация</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Создайте аккаунт и получите доступ к эксклюзивным предложениям
            </p>
          </div>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              window.location.href = "/account"
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName" className="text-xs text-muted-foreground">Имя</Label>
                <Input id="firstName" placeholder="Анна" className="mt-1" required />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-xs text-muted-foreground">Фамилия</Label>
                <Input id="lastName" placeholder="Иванова" className="mt-1" required />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-xs text-muted-foreground">Email</Label>
              <Input id="email" type="email" placeholder="anna@example.com" className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="phone" className="text-xs text-muted-foreground">Телефон</Label>
              <Input id="phone" type="tel" placeholder="+7 (999) 123-45-67" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password" className="text-xs text-muted-foreground">Пароль</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Минимум 8 символов"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="mt-1 rounded" required />
              <span>
                {"Я соглашаюсь с "}
                <a href="#" className="text-foreground underline">условиями использования</a>
                {" и "}
                <a href="#" className="text-foreground underline">политикой конфиденциальности</a>
              </span>
            </label>

            <Button type="submit" className="w-full rounded-full" size="lg">
              Создать аккаунт
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {"Уже есть аккаунт? "}
            <Link href="/auth/login" className="font-medium text-foreground hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
