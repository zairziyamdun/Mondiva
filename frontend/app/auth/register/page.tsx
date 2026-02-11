"use client"

import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"

export default function RegisterPage() {
  const { register } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = await register({ name: name.trim(), email: email.trim(), password, phone: phone.trim() || undefined })
    setLoading(false)
    if (result.ok) {
      window.location.href = "/account"
    } else {
      setError(result.error ?? "Ошибка регистрации")
    }
  }

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

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
            <div>
              <Label htmlFor="name" className="text-xs text-muted-foreground">
                Имя
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Анна Иванова"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-xs text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="anna@example.com"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-xs text-muted-foreground">
                Телефон
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (999) 123-45-67"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-xs text-muted-foreground">
                Пароль
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Минимум 6 символов"
                  required
                  minLength={6}
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
                <a href="#" className="text-foreground underline">
                  условиями использования
                </a>
                {" и "}
                <a href="#" className="text-foreground underline">
                  политикой конфиденциальности
                </a>
              </span>
            </label>

            <Button
              type="submit"
              className="w-full rounded-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Создание аккаунта..." : "Создать аккаунт"}
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
