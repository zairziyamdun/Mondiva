import Order from "../models/Order.js"

// POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id
    const { items, total, address, deliveryMethod, paymentMethod } = req.body

    const order = await Order.create({
      userId,
      items,
      total,
      address,
      deliveryMethod,
      paymentMethod,
      status: "pending",
    })

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

