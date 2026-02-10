import express from "express"
import { body, param } from "express-validator"
import { getMe, getUsers, updateUserRole, deleteUser } from "../controllers/userController.js"
import { protect, authorize } from "../middleware/authMiddleware.js"
import { validateRequest } from "../middleware/validateRequest.js"

const router = express.Router()

// Текущий пользователь
router.get("/me", protect, getMe)

// Список пользователей (admin)
router.get("/", protect, authorize("admin"), getUsers)

// Обновление роли пользователя (admin)
router.patch(
  "/:id/role",
  protect,
  authorize("admin"),
  [
    param("id").isMongoId().withMessage("Некорректный ID пользователя"),
    body("role")
      .isIn(["user", "moderator", "admin", "logistics"])
      .withMessage("Некорректная роль"),
  ],
  validateRequest,
  updateUserRole,
)

// Удаление пользователя (admin)
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  [param("id").isMongoId().withMessage("Некорректный ID пользователя")],
  validateRequest,
  deleteUser,
)

export default router

