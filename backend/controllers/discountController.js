import Discount from "../models/Discount.js"
import Product from "../models/Product.js"
import { hasOverlappingDiscount } from "../services/discountService.js"

// GET /api/discounts
export const getDiscounts = async (req, res, next) => {
  try {
    const discounts = await Discount.find()
      .populate("productId", "name slug price")
      .sort({ createdAt: -1 })
    res.json(discounts)
  } catch (error) {
    next(error)
  }
}

// GET /api/discounts/product/:productId
export const getDiscountsByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params
    const discounts = await Discount.find({ productId }).sort({ createdAt: -1 })
    res.json(discounts)
  } catch (error) {
    next(error)
  }
}

// POST /api/discounts
export const createDiscount = async (req, res, next) => {
  try {
    const { productId, type, value, startDate, endDate } = req.body
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Товар не найден" })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const now = new Date()

    if (start < now) {
      return res.status(400).json({ message: "Дата начала не может быть в прошедшем времени" })
    }
    if (end <= start) {
      return res.status(400).json({ message: "Дата окончания должна быть позже даты начала" })
    }

    const overlapping = await hasOverlappingDiscount(productId, start, end)
    if (overlapping) {
      return res.status(400).json({ message: "Скидка пересекается с уже существующей" })
    }

    const discount = await Discount.create({
      productId,
      type,
      value,
      startDate: start,
      endDate: end,
      isActive: true,
    })
    res.status(201).json(discount)
  } catch (error) {
    next(error)
  }
}

// PATCH /api/discounts/:id
export const updateDiscount = async (req, res, next) => {
  try {
    const { id } = req.params
    const { type, value, startDate, endDate, isActive } = req.body

    const discount = await Discount.findById(id)
    if (!discount) {
      return res.status(404).json({ message: "Скидка не найдена" })
    }

    const start = startDate != null ? new Date(startDate) : discount.startDate
    const end = endDate != null ? new Date(endDate) : discount.endDate
    const now = new Date()

    if (start < now) {
      return res.status(400).json({ message: "Дата начала не может быть в прошедшем времени" })
    }
    if (end <= start) {
      return res.status(400).json({ message: "Дата окончания должна быть позже даты начала" })
    }

    const overlapping = await hasOverlappingDiscount(
      discount.productId,
      start,
      end,
      id
    )
    if (overlapping) {
      return res.status(400).json({ message: "Скидка пересекается с уже существующей" })
    }

    const update = {}
    if (type != null) update.type = type
    if (value != null) update.value = value
    if (startDate != null) update.startDate = start
    if (endDate != null) update.endDate = end
    if (isActive != null) update.isActive = isActive

    const updated = await Discount.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    })
    res.json(updated)
  } catch (error) {
    next(error)
  }
}

// DELETE /api/discounts/:id
export const deleteDiscount = async (req, res, next) => {
  try {
    const { id } = req.params
    const discount = await Discount.findByIdAndDelete(id)
    if (!discount) {
      return res.status(404).json({ message: "Скидка не найдена" })
    }
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
