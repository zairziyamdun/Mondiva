import express from "express"
import { body, param, query } from "express-validator"
import {
  getProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js"
import { protect, authorize } from "../middleware/authMiddleware.js"
import { validateRequest } from "../middleware/validateRequest.js"

const router = express.Router()

// GET /api/products?categorySlug=&minPrice=&maxPrice=&slug=&search=
router.get(
  "/",
  [
    query("minPrice").optional().isNumeric().withMessage("minPrice должен быть числом"),
    query("maxPrice").optional().isNumeric().withMessage("maxPrice должен быть числом"),
  ],
  validateRequest,
  getProducts,
)

// GET /api/products/:idOrSlug
router.get(
  "/:idOrSlug",
  [param("idOrSlug").notEmpty().withMessage("idOrSlug обязателен")],
  validateRequest,
  getProductByIdOrSlug,
)

// Только admin может создать продукт
router.post(
  "/",
  protect,
  authorize("admin"),
  [
    body("name").notEmpty().withMessage("Название обязательно"),
    body("slug").notEmpty().withMessage("Slug обязателен"),
    body("price").isNumeric().withMessage("Цена должна быть числом"),
  ],
  validateRequest,
  createProduct,
)

// Обновление продукта
router.put(
  "/:id",
  protect,
  authorize("admin"),
  [param("id").isMongoId().withMessage("Некорректный ID продукта")],
  validateRequest,
  updateProduct,
)

// Удаление продукта
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  [param("id").isMongoId().withMessage("Некорректный ID продукта")],
  validateRequest,
  deleteProduct,
)

export default router
