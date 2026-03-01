import mongoose from "mongoose"

const discountSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  type: { type: String, enum: ["percentage", "fixed"], required: true },
  value: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
})

discountSchema.index({ productId: 1 })
discountSchema.index({ productId: 1, isActive: 1, startDate: 1, endDate: 1 })

export default mongoose.model("Discount", discountSchema)
