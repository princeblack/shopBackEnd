const SpecialCategory = require("../models/SpecialCategory");
const DeleteUserfromAdmin = require("../models/OnlineUser");
const TrafficLog = require("../models/Traffic");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Message = require("../models/Message");
const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const { sendEmail } = require("../utils/email");

TransactionSchema.index({ country: 1, city: 1, region: 1 });
OrderSchema.index({ country: 1, city: 1, region: 1 });

const getAllOnlineUser = async (req, res) => {
  const onlineUsers = await DeleteUserfromAdmin.find();
  res.json(onlineUsers);
};

const getOderByCountry = async (req, res) => {
  const analytics = await Order.aggregate([
    {
      $group: {
        _id: { country: "$country", region: "$region", city: "$city" },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);
  res.json(analytics);
};

const deleteUserProduitComment =async (req, res) => {
    const { productId, commentId } = req.params;
    const product = await Product.findById(productId);
    product.ratings = product.ratings.filter(
      (comment) => comment._id.toString() !== commentId
    );
    await product.save();
    res.status(204).send();
};

const sendUserMessage = async (req, res) => {
  const { userId, subject, content } = req.body;
  const message = new Message({ userId, subject, content });
  sendEmail(
    email,
    "send message",
    `${content}`
  );
  await message.save();
  res.status(201).json(message);
};

const getAllTransactions = async (req, res) => {
  const transactions = await Transaction.find().populate("userId productId");
  res.json(transactions);
};

const createCategory = async (req, res) => {
  const { name, description } = req.body;
  const category = new Category({ name, description });
  await category.save();
  res.status(201).json(category);
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    { name, description },
    { new: true }
  );
  res.json(updatedCategory);
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  await Category.findByIdAndDelete(id);
  res.status(204).send();
};

const getAllOrderForAdmin = async (req, res) => {
  const orders = await Order.find().populate("userId products.productId");
  res.json(orders);
};

const updateOrderForAdmin = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Statut : pending, shipped, delivered, cancelled
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  res.json(updatedOrder);
};

const updatedProductProperty = async (req, res) => {
  const { colors, sizes, stock } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ error: "Produit non trouvé" });

    product.colors = colors || product.colors;
    product.sizes = sizes || product.sizes;
    product.stock = stock || product.stock;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const createProduitFromAdmin = async (req, res) => {
  const { name, description, price, stock, category, images } = req.body;
  const product = new Product({
    name,
    description,
    price,
    stock,
    category,
    images,
  });
  await product.save();
  res.status(201).json(product);
};

const updatedProductFromAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category, images, isPublished } =
    req.body;
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { name, description, price, stock, category, images, isPublished },
    { new: true }
  );
  res.json(updatedProduct);
};

const deleteProdruitFromAdmin = async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.status(204).send();
};

const getSpecialCategory = async (req, res) => {
  try {
    const now = new Date();
    const categories = await SpecialCategory.find({
      isActive: true,
      "displayDuration.start": { $lte: now },
      "displayDuration.end": { $gte: now },
    }).sort({ priority: 1 });

    res.json(categories);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const updatedSpecialCategory = async (req, res) => {
    const updates = req.body;

    try {
      const specialCategory = await SpecialCategory.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true }
      );
      if (!specialCategory)
        return res
          .status(404)
          .json({ error: "Catégorie spéciale non trouvée" });

      res.json(specialCategory);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
};
const addSpecialCategory =async (req, res) => {
    const {
      name,
      contentType,
      contentData,
      position,
      displayDuration,
      priority,
      isActive,
    } = req.body;

    try {
      const specialCategory = new SpecialCategory({
        name,
        contentType,
        contentData,
        position,
        displayDuration,
        priority,
        isActive,
      });

      await specialCategory.save();
      res.status(201).json(specialCategory);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
};

const getTrafficData =async (req, res) => {
    const { interval = "day" } = req.query; // Options : 'minute', 'hour', 'day', 'month', 'year'
    const groupBy = {
      minute: {
        $dateToString: { format: "%Y-%m-%d %H:%M", date: "$timestamp" },
      },
      hour: { $dateToString: { format: "%Y-%m-%d %H:00", date: "$timestamp" } },
      day: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
      month: { $dateToString: { format: "%Y-%m", date: "$timestamp" } },
      year: { $dateToString: { format: "%Y", date: "$timestamp" } },
    };

    const analytics = await TrafficLog.aggregate([
      { $group: { _id: groupBy[interval], count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json(analytics);
};

const getAllUsersFromAdmin =  async (req, res) => {
    const users = await User.find();
    res.json(users);
};

const updatedUserFromAdmin =  async (req, res) => {
    const { id } = req.params;
    const { name, email, role, address } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role, address },
      { new: true }
    );
    res.json(updatedUser);
};

const deleteUserfromAdmin =async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(204).send();
};

module.exports(
  getAllOnlineUser,
  getOderByCountry,
  deleteProdruitFromAdmin,
  updatedProductFromAdmin,
  createProduitFromAdmin,
  createCategory,
  getAllOrderForAdmin,
  deleteCategory,
  updateCategory,
  sendUserMessage,
  getAllTransactions,
  deleteUserProduitComment,
  updatedProductProperty,
  deleteUserfromAdmin,
  updateOrderForAdmin,
  getSpecialCategory,
  updatedUserFromAdmin,
  getAllUsersFromAdmin,
  getTrafficData,
  addSpecialCategory,
  updatedSpecialCategory
);
