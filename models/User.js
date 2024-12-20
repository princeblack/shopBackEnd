const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  picture: [{ type: String }], // URLs des images
  role: { type: String, enum: ["admin", "customer"], default: "customer" },
  isVerified: { type: Boolean, default: false }, // Confirmation par e-mail
  lastActiveAt: { type: Date, default: Date.now }, // Dernière activité
  isOnline: { type: Boolean, default: false }, // Statut en ligne
  address: [
    {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
  ],
  preferences: {
    categories: [String], // Ex. ['electronics', 'fashion']
    recentlyViewed: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Produits récemment consultés
    ],
    purchaseHistory: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Produits achetés
    ],
  },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("User", UserSchema);
