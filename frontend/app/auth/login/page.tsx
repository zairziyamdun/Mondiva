"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get("returnUrl") ?? "/account"
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.ok) {
      window.location.href = returnUrl
    } else {
      setError(result.error ?? "Ошибка входа")
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground">Вход</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Войдите в свой аккаунт MonDiva
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
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
              <Label htmlFor="password" className="text-xs text-muted-foreground">
                Пароль
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" className="rounded" />
                Запомнить меня
              </label>
              <a href="#" className="text-sm text-accent hover:underline">
                Забыли пароль?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full rounded-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Вход..." : "Войти"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {"Нет аккаунта? "}
            <Link href="/auth/register" className="font-medium text-foreground hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
