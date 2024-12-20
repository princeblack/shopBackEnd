const Wishlist = require('../models/Wishlist');

// Ajouter un produit à la liste de souhaits
const addToWishlist = async (req, res) => {
    const { userId, productId } = req.body;
    try {
      const wishlist = await Wishlist.findOne({ userId });
      if (wishlist) {
        // Vérifier si le produit est déjà dans la liste de souhaits
        if (wishlist.products.includes(productId)) {
          return res.status(400).json({ error: "Produit déjà dans la liste de souhaits" });
        }
        wishlist.products.push(productId);
        await wishlist.save();
      } else {
        // Créer une nouvelle liste de souhaits
        const newWishlist = new Wishlist({ userId, products: [productId] });
        await newWishlist.save();
      }
      res.status(201).json({ message: "Produit ajouté à la liste de souhaits" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // Récupérer la liste de souhaits d'un utilisateur
  const getWishlist = async (req, res) => {
    const { userId } = req.params;
    try {
      const wishlist = await Wishlist.findOne({ userId }).populate("products");
      if (!wishlist) {
        return res.status(404).json({ error: "Liste de souhaits non trouvée" });
      }
      res.json(wishlist);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // Supprimer un produit de la liste de souhaits
  const removeFromWishlist = async (req, res) => {
    const { userId, productId } = req.body;
    try {
      const wishlist = await Wishlist.findOne({ userId });
      if (!wishlist) {
        return res.status(404).json({ error: "Liste de souhaits non trouvée" });
      }
      wishlist.products = wishlist.products.filter(
        (product) => product.toString() !== productId
      );
      await wishlist.save();
      res.status(200).json({ message: "Produit retiré de la liste de souhaits" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
  };