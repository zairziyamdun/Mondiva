import express from "express"
import { body, param } from "express-validator"
import {
  getCategories,
  getCategoryByIdOrSlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js"
import { protect, authorize } from "../middleware/authMiddleware.js"
import { validateRequest } from "../middleware/validateRequest.js"

const router = express.Router()

// GET /api/categories
router.get("/", getCategories)

// GET /api/categories/:idOrSlug
router.get(
  "/:idOrSlug",
  [param("idOrSlug").notEmpty().withMessage("idOrSlug обязателен")],
  validateRequest,
  getCategoryByIdOrSlug,
)

// POST /api/categories
router.post(
  "/",
  protect,
  authorize("admin"),
  [
    body("name").notEmpty().withMessage("Название обязательно"),
    body("slug").notEmpty().withMessage("Slug обязателен"),
  ],
  validateRequest,
  createCategory,
)

// PUT /api/categories/:id
router.put(
  "/:id",
  protect,
  authorize("admin"),
  [param("id").isMongoId().withMessage("Некорректный ID категории")],
  validateRequest,
  updateCategory,
)

// DELETE /api/categories/:id
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  [param("id").isMongoId().withMessage("Некорректный ID категории")],
  validateRequest,
  deleteCategory,
)

export default router

