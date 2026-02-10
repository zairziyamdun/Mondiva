import mongoose from "mongoose";

const returnRequestSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reason: String,
  status: { type: String, enum: ["pending","approved","rejected","refunded"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ReturnRequest", returnRequestSchema);
