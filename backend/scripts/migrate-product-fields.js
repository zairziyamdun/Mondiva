/**
 * Миграция: добавляет stock для существующих товаров (если отсутствует).
 * stock = 100 для товаров без stock.
 */
import dotenv from "dotenv"
import mongoose from "mongoose"
import connectDB from "../config/db.js"
import Product from "../models/Product.js"

dotenv.config()

async function migrate() {
  try {
    await connectDB()

    const result = await Product.updateMany(
      { $or: [{ stock: { $exists: false } }, { stock: null }] },
      { $set: { stock: 100 } }
    )

    console.log(`✅ Миграция stock: обновлено ${result.modifiedCount} товаров`)
    process.exit(0)
  } catch (error) {
    console.error("❌ Ошибка миграции:", error)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
  }
}

migrate()
