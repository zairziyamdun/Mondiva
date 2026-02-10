import express from "express"
import { body, param } from "express-validator"
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js"
import { protect, authorize } from "../middleware/authMiddleware.js"
import { validateRequest } from "../middleware/validateRequest.js"

const router = express.Router()

// Заказ текущего пользователя
router.post(
  "/",
  protect,
  [
    body("items").isArray({ min: 1 }).withMessage("Корзина не может быть пустой"),
    body("total").isNumeric().withMessage("Итоговая сумма обязательна"),
    body("address").notEmpty().withMessage("Адрес обязателен"),
    body("deliveryMethod").notEmpty().withMessage("Способ доставки обязателен"),
    body("paymentMethod").notEmpty().withMessage("Способ оплаты обязателен"),
  ],
  validateRequest,
  createOrder,
)

// Мои заказы
router.get("/my", protect, getMyOrders)

// Все заказы (admin)
router.get("/", protect, authorize("admin"), getAllOrders)

// Конкретный заказ (владелец или admin)
router.get(
  "/:id",
  protect,
  [param("id").isMongoId().withMessage("Некорректный ID заказа")],
  validateRequest,
  getOrderById,
)

// Обновление статуса заказа (admin, logistics)
router.patch(
  "/:id/status",
  protect,
  authorize("admin", "logistics"),
  [
    param("id").isMongoId().withMessage("Некорректный ID заказа"),
    body("status")
      .isIn([
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "in_transit",
        "delivered",
        "cancelled",
      ])
      .withMessage("Некорректный статус заказа"),
  ],
  validateRequest,
  updateOrderStatus,
)

export default router

