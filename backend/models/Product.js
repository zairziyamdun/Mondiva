import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  discount: { type: Number },
  images: [{ type: String }],
  category: { type: String },
  categorySlug: { type: String },
  brand: { type: String },
  colors: [{ type: String }],
  sizes: [{ type: String }],
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isNew: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);
