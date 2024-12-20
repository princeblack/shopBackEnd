const mongoose = require("mongoose");
const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  ],
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    required: true,
  },
  country: String,
  city: String,
  region: String,
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Transaction", TransactionSchema);
