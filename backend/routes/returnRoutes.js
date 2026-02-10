import express from "express"
import { body, param } from "express-validator"
import {
  getMyReturnRequests,
  getAllReturnRequests,
  createReturnRequest,
  updateReturnStatus,
} from "../controllers/returnRequestController.js"
import { protect, authorize } from "../middleware/authMiddleware.js"
import { validateRequest } from "../middleware/validateRequest.js"

const router = express.Router()

// Мои запросы на возврат
router.get("/my", protect, getMyReturnRequests)

// Все запросы (admin, logistics)
router.get("/", protect, authorize("admin", "logistics"), getAllReturnRequests)

// Создать запрос
router.post(
  "/",
  protect,
  [
    body("orderId").isMongoId().withMessage("Некорректный ID заказа"),
    body("reason").notEmpty().withMessage("Причина обязательна"),
  ],
  validateRequest,
  createReturnRequest,
)

// Обновить статус (admin, logistics)
router.patch(
  "/:id/status",
  protect,
  authorize("admin", "logistics"),
  [
    param("id").isMongoId().withMessage("Некорректный ID возврата"),
    body("status")
      .isIn(["pending", "approved", "rejected", "refunded"])
      .withMessage("Некорректный статус возврата"),
  ],
  validateRequest,
  updateReturnStatus,
)

export default router

