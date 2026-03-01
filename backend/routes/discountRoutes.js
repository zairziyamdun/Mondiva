import express from "express"
import { body, param } from "express-validator"
import {
  getDiscounts,
  getDiscountsByProduct,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from "../controllers/discountController.js"
import { protect, authorize } from "../middleware/authMiddleware.js"
import { validateRequest } from "../middleware/validateRequest.js"

const router = express.Router()

router.get("/", protect, authorize("admin"), getDiscounts)
router.get(
  "/product/:productId",
  protect,
  authorize("admin"),
  [param("productId").isMongoId().withMessage("Некорректный ID товара")],
  validateRequest,
  getDiscountsByProduct
)
router.post(
  "/",
  protect,
  authorize("admin"),
  [
    body("productId").isMongoId().withMessage("productId обязателен"),
    body("type").isIn(["percentage", "fixed"]).withMessage("type: percentage или fixed"),
    body("value").isNumeric().withMessage("value обязателен"),
    body("startDate").notEmpty().withMessage("startDate обязателен"),
    body("endDate").notEmpty().withMessage("endDate обязателен"),
  ],
  validateRequest,
  createDiscount
)
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  [param("id").isMongoId().withMessage("Некорректный ID скидки")],
  validateRequest,
  updateDiscount
)
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  [param("id").isMongoId().withMessage("Некорректный ID скидки")],
  validateRequest,
  deleteDiscount
)

export default router
