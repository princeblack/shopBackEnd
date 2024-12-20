const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  colors: [{ type: String }], // Liste des couleurs disponibles, par exemple ["Rouge", "Bleu", "Noir"]
  sizes: [
    {
      sizeType: {
        type: String,
        enum: ["letter", "number", "unique"],
        required: true,
      },
      values: [{ type: String }], // Exemples : ["S", "M", "L"] ou ["26", "40", "43"] ou ["Unique"]
    },
  ],
  stock: {
    type: Map,
    of: Number,
    default: {},
  }, // Exemple: {"Rouge_M": 10, "Rouge_L": 5, "Noir_M": 3}
  images: [{ type: String }], // URLs des images
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: Number,
      comment: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Product", ProductSchema);
