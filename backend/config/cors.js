const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean)

const isProduction = process.env.NODE_ENV === "production"

export const corsOptions = {
  origin: (origin, callback) => {
    if (!isProduction) {
      return callback(null, true)
    }

    // Production: только явные origins из CORS_ORIGINS
    if (!allowedOrigins.length) {
      return callback(new Error("CORS_ORIGINS must be set in production"))
    }

    if (!origin) {
      return callback(null, true)
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    callback(new Error("Not allowed by CORS"))
  },
  credentials: true,
}

