import express from "express"
import { body, param } from "express-validator"
import {
  getReviewsForProduct,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js"
import { protect, authorize } from "../middleware/authMiddleware.js"
import { validateRequest } from "../middleware/validateRequest.js"

const router = express.Router()

// Отзывы по товару
router.get(
  "/product/:productId",
  [param("productId").isMongoId().withMessage("Некорректный ID товара")],
  validateRequest,
  getReviewsForProduct,
)

// Создать отзыв
router.post(
  "/",
  protect,
  [
    body("productId").isMongoId().withMessage("Некорректный ID товара"),
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Рейтинг должен быть от 1 до 5"),
    body("text").notEmpty().withMessage("Текст отзыва обязателен"),
  ],
  validateRequest,
  createReview,
)

// Обновление отзыва (moderator/admin)
router.patch(
  "/:id",
  protect,
  authorize("moderator", "admin"),
  [param("id").isMongoId().withMessage("Некорректный ID отзыва")],
  validateRequest,
  updateReview,
)

// Удаление отзыва (moderator/admin)
router.delete(
  "/:id",
  protect,
  authorize("moderator", "admin"),
  [param("id").isMongoId().withMessage("Некорректный ID отзыва")],
  validateRequest,
  deleteReview,
)

export default router

