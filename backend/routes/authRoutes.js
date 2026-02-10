import express from "express"
import { body } from "express-validator"
import { register, login, refreshToken, logout } from "../controllers/authController.js"
import { validateRequest } from "../middleware/validateRequest.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

// Регистрация
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Имя обязательно"),
    body("email").isEmail().withMessage("Некорректный email"),
    body("password").isLength({ min: 6 }).withMessage("Пароль должен быть не менее 6 символов"),
  ],
  validateRequest,
  register,
)

// Логин
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Некорректный email"),
    body("password").notEmpty().withMessage("Пароль обязателен"),
  ],
  validateRequest,
  login,
)

// Обновление access token по refresh token (из cookie)
router.post("/refresh", refreshToken)

// Выход (очистка refresh cookie)
router.post("/logout", protect, logout)

export default router
