"use client"

import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/types"
import { api, setAccessToken, setOnAuthFailure } from "@/lib/api"

const AUTH_STORAGE_KEY = "mondiva_access_token"

interface AuthState {
  user: User | null
  isLoading: boolean
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUserState] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const setUser = useCallback((u: User | null) => {
    setUserState(u)
  }, [])

  const clearAuth = useCallback(() => {
    setUserState(null)
    setAccessToken(null)
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(AUTH_STORAGE_KEY)
    }
    router.push("/auth/login")
  }, [router])

  useEffect(() => {
    setOnAuthFailure(clearAuth)
    return () => setOnAuthFailure(null)
  }, [clearAuth])

  useEffect(() => {
    const token = typeof window !== "undefined" ? sessionStorage.getItem(AUTH_STORAGE_KEY) : null
    if (!token) {
      setIsLoading(false)
      return
    }
    setAccessToken(token)
    api
      .get<{ id: string; name: string; email: string; phone?: string; role: string; avatar?: string; createdAt: string }>("/api/users/me")
      .then((res) => {
        if (res.ok) {
          setUserState({
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            phone: res.data.phone,
            role: res.data.role as User["role"],
            avatar: res.data.avatar,
            createdAt: res.data.createdAt ?? "",
          })
        } else {
          setAccessToken(null)
          sessionStorage.removeItem(AUTH_STORAGE_KEY)
        }
      })
      .catch(() => {
        setAccessToken(null)
        sessionStorage.removeItem(AUTH_STORAGE_KEY)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.post<{ user: User; accessToken: string }>("/api/auth/login", { email, password }, { skipAuth: true })
      if (!res.ok) {
        return { ok: false, error: res.error?.message ?? "Ошибка входа" }
      }
      const { user: u, accessToken: token } = res.data
      setAccessToken(token)
      setUserState(u)
      if (typeof window !== "undefined") {
        sessionStorage.setItem(AUTH_STORAGE_KEY, token)
      }
      return { ok: true }
    },
    []
  )

  const register = useCallback(
    async (data: { name: string; email: string; password: string; phone?: string }) => {
      const res = await api.post<{ user: User; accessToken: string }>("/api/auth/register", data, { skipAuth: true })
      if (!res.ok) {
        return { ok: false, error: res.error?.message ?? (res.error?.errors?.[0]?.message ?? "Ошибка регистрации") }
      }
      const { user: u, accessToken: token } = res.data
      setAccessToken(token)
      setUserState(u)
      if (typeof window !== "undefined") {
        sessionStorage.setItem(AUTH_STORAGE_KEY, token)
      }
      return { ok: true }
    },
    []
  )

  const logout = useCallback(async () => {
    await api.post("/api/auth/logout")
    setUserState(null)
    setAccessToken(null)
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(AUTH_STORAGE_KEY)
    }
    router.push("/")
  }, [router])

  const value: AuthContextValue = {
    user,
    isLoading,
    login,
    register,
    logout,
    setUser: setUserState,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
