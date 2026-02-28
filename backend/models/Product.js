import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    discount: { type: Number },
    discountPrice: { type: Number }, // финальная цена со скидкой (если задана)
    discountStart: { type: Date },
    discountEnd: { type: Date },
    stock: { type: Number, default: 0 },
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
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Текущая цена: discountPrice если активна временная скидка, иначе price
productSchema.virtual("currentPrice").get(function () {
  const now = new Date();
  if (
    this.discountPrice != null &&
    this.discountStart &&
    this.discountEnd &&
    now >= this.discountStart &&
    now <= this.discountEnd
  ) {
    return this.discountPrice;
  }
  return this.price;
});

// Есть ли активная скидка
productSchema.virtual("hasActiveDiscount").get(function () {
  const now = new Date();
  return !!(
    this.discountPrice != null &&
    this.discountStart &&
    this.discountEnd &&
    now >= this.discountStart &&
    now <= this.discountEnd
  );
});

// Хелпер: получить currentPrice для обычного объекта (без virtual)
export function getCurrentPrice(product) {
  const now = new Date();
  if (
    product.discountPrice != null &&
    product.discountStart &&
    product.discountEnd &&
    now >= new Date(product.discountStart) &&
    now <= new Date(product.discountEnd)
  ) {
    return product.discountPrice;
  }
  return product.price;
}

export default mongoose.model("Product", productSchema);
