const express = require("express");
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

const router = express.Router();

// Ajouter un produit à la liste de souhaits
router.post("/", addToWishlist);

// Récupérer la liste de souhaits d'un utilisateur
router.get("/:userId", getWishlist);

// Supprimer un produit de la liste de souhaits
router.delete("/", removeFromWishlist);

module.exports = router;