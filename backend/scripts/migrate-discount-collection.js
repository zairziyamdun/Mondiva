/**
 * Миграция: перенос скидок из Product (oldPrice, discountPrice, discountStart, discountEnd)
 * в коллекцию Discount.
 * Запустить после обновления схемы Product.
 */
import dotenv from "dotenv"
import mongoose from "mongoose"
import connectDB from "../config/db.js"
import Product from "../models/Product.js"
import Discount from "../models/Discount.js"

dotenv.config()

async function migrate() {
  try {
    await connectDB()

    const products = await Product.find({
      $or: [
        { discountPrice: { $exists: true, $ne: null } },
        { oldPrice: { $exists: true, $ne: null } },
      ],
    }).lean()

    let created = 0
    for (const p of products) {
      if (p.discountPrice != null && p.discountStart && p.discountEnd) {
        const discountValue =
          p.price > 0
            ? Math.round((1 - p.discountPrice / p.price) * 100)
            : 0
        await Discount.create({
          productId: p._id,
          type: "percentage",
          value: discountValue,
          startDate: new Date(p.discountStart),
          endDate: new Date(p.discountEnd),
          isActive: true,
        })
        created++
      }
    }

    await Product.updateMany(
      {},
      {
        $unset: {
          oldPrice: "",
          discount: "",
          discountPrice: "",
          discountStart: "",
          discountEnd: "",
        },
      }
    )

    console.log(`✅ Миграция: создано ${created} скидок, удалены поля из Product`)
    process.exit(0)
  } catch (error) {
    console.error("❌ Ошибка миграции:", error)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
  }
}

migrate()
