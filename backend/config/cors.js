const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean)

export const corsOptions = {
  origin: (origin, callback) => {
    // В dev режиме разрешаем все origin, если список пуст
    if (!allowedOrigins.length || process.env.NODE_ENV === "development") {
      return callback(null, true)
    }

    if (!origin) {
      // Запросы от серверов (Next.js) без origin разрешаем
      return callback(null, true)
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    callback(new Error("Not allowed by CORS"))
  },
  credentials: true,
}

