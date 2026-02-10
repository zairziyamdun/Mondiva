import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: String,
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  rating: Number,
  text: String,
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Review", reviewSchema);
