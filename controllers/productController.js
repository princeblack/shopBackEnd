const Product = require("../models/Product");

const getOneProduct =
  ("/products/:id",
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate(
        "category"
      );
      if (!product)
        return res.status(404).json({ error: "Produit non trouvé" });

      res.json(product);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

async function getRecommendedProducts(userId) {
  const user = await User.findById(userId).populate(
    "preferences.recentlyViewed"
  );

  // Récupérer des produits similaires aux catégories préférées
  const recommendedProducts = await Product.find({
    category: { $in: user.preferences.categories },
  }).limit(10); // Limiter à 10 recommandations

  // Ajouter des produits complémentaires basés sur les produits récemment consultés
  const complementaryProducts = [];
  for (const viewedProduct of user.preferences.recentlyViewed) {
    const similarProducts = await Product.find({
      category: viewedProduct.category,
      _id: { $ne: viewedProduct._id },
    }).limit(5); // Limiter à 5 recommandations par produit
    complementaryProducts.push(...similarProducts);
  }

  return {
    recommendedProducts,
    complementaryProducts,
  };
}
const recommendations = async (req, res) => {
  const userId = req.user._id; // ID de l'utilisateur connecté
  const recommendations = await getRecommendedProducts(userId);

  res.json({
    recommended: recommendations.recommendedProducts,
    complementary: recommendations.complementaryProducts,
  });
};



const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ error: "Produit non trouvé" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Produit non trouvé" });
    res.json({ message: "Produit supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ error: "Produit non trouvé" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getOneProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  listProducts,
  recommendations,
};
