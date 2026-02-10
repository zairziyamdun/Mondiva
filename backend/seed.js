// seed.js — заполнение MongoDB тестовыми данными для MonDiva
import dotenv from "dotenv"
import mongoose from "mongoose"
import bcrypt from "bcrypt"

import connectDB from "./config/db.js"

import User from "./models/User.js"
import Product from "./models/Product.js"
import Category from "./models/Category.js"
import Order from "./models/Order.js"
import Review from "./models/Review.js"
import ReturnRequest from "./models/ReturnRequest.js"

import { users, products, categories, orders, reviews, returnRequests } from "./data.js"

dotenv.config()

const importData = async () => {
  try {
    await connectDB()

    // Очистка коллекций
    await Promise.all([
      User.deleteMany(),
      Product.deleteMany(),
      Category.deleteMany(),
      Order.deleteMany(),
      Review.deleteMany(),
      ReturnRequest.deleteMany(),
    ])

    // ===== Users (hash passwords) =====
    const hashedUsers = await Promise.all(
      users.map(async (u) => {
        const hashedPassword = await bcrypt.hash(u.password, 10)
        return {
          name: u.name,
          email: u.email,
          phone: u.phone,
          role: u.role,
          password: hashedPassword,
          createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
        }
      }),
    )

    const createdUsers = await User.insertMany(hashedUsers)
    const userByEmail = new Map(createdUsers.map((u) => [u.email, u]))

    // ===== Categories =====
    const createdCategories = await Category.insertMany(categories)
    const categoryBySlug = new Map(createdCategories.map((c) => [c.slug, c]))

    // ===== Products =====
    const enrichedProducts = products.map((p) => {
      const category = categoryBySlug.get(p.categorySlug)
      return {
        ...p,
        // category/categorySlug уже заданы строками и соответствуют схеме
        createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
      }
    })

    const createdProducts = await Product.insertMany(enrichedProducts)
    const productBySlug = new Map(createdProducts.map((p) => [p.slug, p]))

    // ===== Orders =====
    const createdOrdersWithCode = []

    for (const o of orders) {
      const user = userByEmail.get(o.userEmail)
      if (!user) continue

      const items = o.items
        .map((it) => {
          const product = productBySlug.get(it.productSlug)
          if (!product) return null

          return {
            productId: product._id,
            name: product.name,
            image: product.images?.[0] || "",
            size: it.size,
            color: it.color,
            quantity: it.quantity,
            price: it.price ?? product.price,
          }
        })
        .filter(Boolean)

      if (!items.length) continue

      const orderDoc = await Order.create({
        userId: user._id,
        items,
        total: o.total,
        status: o.status,
        address: o.address,
        deliveryMethod: o.deliveryMethod,
        paymentMethod: o.paymentMethod,
        createdAt: o.createdAt ? new Date(o.createdAt) : new Date(),
        updatedAt: o.updatedAt ? new Date(o.updatedAt) : new Date(),
      })

      createdOrdersWithCode.push({ code: o.code, doc: orderDoc })
    }

    const orderByCode = new Map(createdOrdersWithCode.map((o) => [o.code, o.doc]))

    // ===== Reviews =====
    const reviewDocs = []

    for (const r of reviews) {
      const user = userByEmail.get(r.userEmail)
      const product = productBySlug.get(r.productSlug)
      if (!user || !product) continue

      reviewDocs.push({
        userId: user._id,
        userName: r.userName || user.name,
        productId: product._id,
        rating: r.rating,
        text: r.text,
        isApproved: typeof r.isApproved === "boolean" ? r.isApproved : false,
        createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
      })
    }

    if (reviewDocs.length) {
      await Review.insertMany(reviewDocs)
    }

    // ===== Return Requests =====
    const returnDocs = []

    for (const rr of returnRequests) {
      const user = userByEmail.get(rr.userEmail)
      const order = orderByCode.get(rr.orderCode)
      if (!user || !order) continue

      returnDocs.push({
        orderId: order._id,
        userId: user._id,
        reason: rr.reason,
        status: rr.status || "pending",
        createdAt: rr.createdAt ? new Date(rr.createdAt) : new Date(),
      })
    }

    if (returnDocs.length) {
      await ReturnRequest.insertMany(returnDocs)
    }

    console.log("✅ Данные успешно загружены")
    process.exit(0)
  } catch (error) {
    console.error("❌ Ошибка при загрузке данных:", error)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
  }
}

importData()
