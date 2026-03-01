/**
 * API-клиент для бэкенда MonDiva.
 * - Базовый URL из NEXT_PUBLIC_API_URL
 * - Access token в заголовке Authorization (устанавливается снаружи после логина)
 * - При 401: попытка обновить токен через POST /api/auth/refresh (httpOnly cookie), повтор запроса
 * - При неудаче refresh или повторного запроса вызывается onAuthFailure (редирект на логин / очистка auth)
 */

const getBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL
  if (!url) return "http://localhost:5000"
  return url.replace(/\/$/, "")
}

let accessToken: string | null = null
let onAuthFailure: (() => void) | null = null

export function setAccessToken(token: string | null): void {
  accessToken = token
}

export function getAccessToken(): string | null {
  return accessToken
}

/** Вызывается при 401 после неудачного refresh или повторного запроса. Приложение должно редиректить на логин и очищать auth. */
export function setOnAuthFailure(callback: (() => void) | null): void {
  onAuthFailure = callback
}

export interface ApiRequestOptions {
  body?: unknown
  headers?: Record<string, string>
  /** Не добавлять Authorization и не обрабатывать 401 (для login/register/refresh) */
  skipAuth?: boolean
}

export interface ApiError {
  message: string
  status: number
  errors?: { field: string; message: string }[]
}

async function doRefresh(): Promise<string | null> {
  const base = getBaseUrl()
  const res = await fetch(`${base}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) return null
  const data = await res.json().catch(() => ({}))
  const token = data?.accessToken
  if (token) {
    setAccessToken(token)
    return token
  }
  return null
}

async function request<T>(
  method: string,
  path: string,
  options: ApiRequestOptions = {}
): Promise<{ data: T; ok: true } | { ok: false; error: ApiError }> {
  const base = getBaseUrl()
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (!options.skipAuth && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const init: RequestInit = {
    method,
    credentials: "include",
    headers,
  }
  if (options.body !== undefined && method !== "GET") {
    init.body = JSON.stringify(options.body)
  }

  let res = await fetch(url, init)
  let triedRefresh = false

  // При 401 пробуем один раз обновить токен и повторить запрос
  if (res.status === 401 && !options.skipAuth && !triedRefresh) {
    triedRefresh = true
    const newToken = await doRefresh()
    if (newToken) {
      headers.Authorization = `Bearer ${newToken}`
      res = await fetch(url, { ...init, headers })
    }
  }

  if (res.status === 401 || res.status === 403) {
    onAuthFailure?.()
  }

  const text = await res.text()
  let json: unknown = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    // не JSON
  }

  if (!res.ok) {
    const message =
      (json && typeof json === "object" && "message" in json && String((json as { message: unknown }).message)) ||
      res.statusText ||
      "Ошибка запроса"
    const errors =
      json && typeof json === "object" && "errors" in json && Array.isArray((json as { errors: unknown }).errors)
        ? (json as { errors: { field?: string; message?: string }[] }).errors.map((e) => ({
            field: String(e?.field ?? ""),
            message: String(e?.message ?? ""),
          }))
        : undefined
    return {
      ok: false,
      error: { message: String(message), status: res.status, errors },
    }
  }

  return { ok: true, data: (json as T) ?? (null as T) }
}

export const api = {
  get<T>(path: string, options?: Omit<ApiRequestOptions, "body">) {
    return request<T>("GET", path, options)
  },

  post<T>(path: string, body?: unknown, options?: ApiRequestOptions) {
    return request<T>("POST", path, { ...options, body })
  },

  patch<T>(path: string, body?: unknown, options?: ApiRequestOptions) {
    return request<T>("PATCH", path, { ...options, body })
  },

  put<T>(path: string, body?: unknown, options?: ApiRequestOptions) {
    return request<T>("PUT", path, { ...options, body })
  },

  delete<T>(path: string, options?: ApiRequestOptions) {
    return request<T>("DELETE", path, options)
  },
}

export { getBaseUrl }
