import express from "express";
import Product from "../models/Product.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Все могут смотреть продукты
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Только admin может создать продукт
router.post("/", protect, authorize("admin"), async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

export default router;
