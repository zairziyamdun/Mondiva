import mongoose from "mongoose"
import Order from "../models/Order.js"
import Product from "../models/Product.js"

async function runCreateOrder(req, sessionOrNull) {
  const opts = sessionOrNull ? { session: sessionOrNull } : {}
  const userId = req.user?._id || req.user?.id
  const { items, total, address, deliveryMethod, paymentMethod } = req.body

  const productIds = [...new Set(items.map((i) => String(i.productId)))]

  const query = Product.find({ _id: { $in: productIds } })
  if (sessionOrNull) query.session(sessionOrNull)
  const products = await query.lean()

  const productById = new Map(products.map((p) => [String(p._id), p]))

  const qtyByProduct = {}
  for (const item of items) {
    const id = String(item.productId)
    qtyByProduct[id] = (qtyByProduct[id] || 0) + (item.quantity || 0)
  }

  for (const [productId, needQty] of Object.entries(qtyByProduct)) {
    const product = productById.get(productId)
    if (!product) {
      return { status: 400, body: { message: `Товар ${productId} не найден` } }
    }
    const stock = product.stock ?? 0
    if (stock < needQty) {
      return {
        status: 409,
        body: {
          message: `Недостаточно товара «${product.name}» (осталось: ${stock}, запрошено: ${needQty})`,
        },
      }
    }
  }

  const [order] = await Order.create(
    [
      {
        userId,
        items,
        total,
        address,
        deliveryMethod,
        paymentMethod,
        status: "pending",
      },
    ],
    opts
  )

  for (const [productId, needQty] of Object.entries(qtyByProduct)) {
    await Product.updateOne(
      { _id: productId },
      { $inc: { stock: -needQty } },
      opts
    )
  }

  return { order }
}

// POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    // Сначала пробуем с транзакцией (replica set / atlas)
    const session = await mongoose.startSession()
    let order
    try {
      await session.withTransaction(async () => {
        const result = await runCreateOrder(req, session)
        if (result.status) {
          throw Object.assign(new Error(), { status: result.status, body: result.body })
        }
        order = result.order
      })
    } catch (txErr) {
      if (txErr.status) {
        return res.status(txErr.status).json(txErr.body || { message: txErr.message })
      }
      // "Transaction numbers are only allowed on a replica set member or mongos"
      const msg = String(txErr?.message || "")
      if (msg.includes("replica set") || msg.includes("mongos")) {
        session.endSession()
        const result = await runCreateOrder(req, null)
        if (result.status) {
          return res.status(result.status).json(result.body)
        }
        return res.status(201).json(result.order)
      }
      throw txErr
    } finally {
      session.endSession()
    }
    res.status(201).json(order)
  } catch (error) {
    next(error)
  }
}

// GET /api/orders/my
export const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const orders = await Order.find({ userId }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    next(error)
  }
}

// GET /api/orders
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    next(error)
  }
}

// GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params
    const order = await Order.findById(id)

    if (!order) {
      return res.status(404).json({ message: "Заказ не найден" })
    }

    // Владелец заказа или админ видят заказ
    if (
      req.user.role !== "admin" &&
      String(order.userId) !== String(req.user._id || req.user.id)
    ) {
      return res.status(403).json({ message: "Нет доступа к этому заказу" })
    }

    res.json(order)
  } catch (error) {
    next(error)
  }
}

// PATCH /api/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const order = await Order.findById(id)
    if (!order) {
      return res.status(404).json({ message: "Заказ не найден" })
    }

    order.status = status
    order.updatedAt = new Date()
    await order.save()

    res.json(order)
  } catch (error) {
    next(error)
  }
}

