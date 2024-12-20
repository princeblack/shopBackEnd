const mongoose = require("mongoose");
const SpecialCategorySchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nom de la catégorie spéciale
  description: { type: String }, // Description facultative
  contentType: {
    type: String,
    enum: ["promotion", "category", "product", "image", "video", "text"],
    required: true,
  }, // Type de contenu
  contentData: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  // Contenu associé (ID de catégorie, ID de produit, URL d'image, texte, ou vidéo)
  position: {
    page: {
      type: String,
      enum: ["homepage", "productPage", "searchPage", "profilePage"],
      required: true,
    }, // Page où s’affiche la catégorie
    section: {
      type: String,
      enum: ["header", "footer", "right", "left", "center"],
      required: true,
    }, // Section de la page
  },
  displayDuration: {
    start: { type: Date, required: true }, // Date de début d’affichage
    end: { type: Date, required: true }, // Date de fin d’affichage
  },
  priority: { type: Number, required: true }, // Ordre d’affichage
  isActive: { type: Boolean, default: true }, // Activation/désactivation
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("SpecialCategory", SpecialCategorySchema);
