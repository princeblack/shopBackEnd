const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Référence à l'utilisateur
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ], // Liste des produits commandés
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  totalAmount: { type: Number, required: true }, // Montant total
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  }, // Statut du paiement
  orderStatus: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered"],
    default: "pending",
  }, // Statut de la commande
  trackingNumber: { type: String }, // Numéro de suivi
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Order", OrderSchema);
