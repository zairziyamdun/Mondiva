import Discount from "../models/Discount.js"
import Product from "../models/Product.js"

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
    const discount = await Discount.create({
      productId,
      type,
      value,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
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
    const update = {}
    if (type != null) update.type = type
    if (value != null) update.value = value
    if (startDate != null) update.startDate = new Date(startDate)
    if (endDate != null) update.endDate = new Date(endDate)
    if (isActive != null) update.isActive = isActive

    const discount = await Discount.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    })
    if (!discount) {
      return res.status(404).json({ message: "Скидка не найдена" })
    }
    res.json(discount)
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
