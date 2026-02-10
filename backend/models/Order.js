import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  image: String,
  size: String,
  color: String,
  quantity: Number,
  price: Number,
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [orderItemSchema],
  total: Number,
  status: { 
    type: String, 
    enum: ["pending","confirmed","processing","shipped","in_transit","delivered","cancelled"], 
    default: "pending" 
  },
  address: String,
  deliveryMethod: String,
  paymentMethod: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
