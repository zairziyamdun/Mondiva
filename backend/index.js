import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"

import connectDB from "./config/db.js"
import { corsOptions } from "./config/cors.js"

import authRoutes from "./routes/authRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js"
import returnRoutes from "./routes/returnRoutes.js"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"

dotenv.config()
connectDB()

const app = express()

// Логирование запросов
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"))
}

// Базовые middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// API роуты
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/users", userRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/returns", returnRoutes)

// 404 и глобальный обработчик ошибок
app.use(notFound)
app.use(errorHandler)

// Старт сервера
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`)
})

