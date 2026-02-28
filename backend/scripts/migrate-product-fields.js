// Миграция: добавляет stock, discountPrice для существующих товаров
// stock = inStock ? 100 : 0
// discountPrice = oldPrice ? price : null
import dotenv from "dotenv"
import mongoose from "mongoose"
import connectDB from "../config/db.js"
import Product from "../models/Product.js"

dotenv.config()

async function migrate() {
  try {
    await connectDB()

    const products = await Product.find({})
    let stockCount = 0
    let discountPriceCount = 0

    for (const p of products) {
      const updates = {}
      if (p.stock == null || (typeof p.stock !== "number")) {
        updates.stock = p.inStock === true ? 100 : 0
        stockCount++
      }
      if (p.oldPrice != null && p.discountPrice == null) {
        updates.discountPrice = p.price
        discountPriceCount++
      }
      if (Object.keys(updates).length) {
        await Product.updateOne({ _id: p._id }, { $set: updates })
      }
    }

    console.log(`✅ Миграция завершена: stock у ${stockCount} товаров, discountPrice у ${discountPriceCount}`)
    process.exit(0)
  } catch (error) {
    console.error("❌ Ошибка миграции:", error)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
  }
}

migrate()
