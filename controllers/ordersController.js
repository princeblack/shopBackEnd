const Order = require('../models/Order');
const Product = require('../models/Product');
const stripe = require('stripe')('sk_test_...');

const orderTracking =  async (req, res) => {
    const { trackingNumber, orderStatus } = req.body;
  
    try {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { trackingNumber, orderStatus },
        { new: true }
      );
  
      if (!order) return res.status(404).json({ error: 'Commande introuvable' });
  
      // Envoyer l'email de confirmation avec le numéro de suivi
      sendEmail(order.user.email, 'Numéro de suivi', `Votre numéro de suivi est : ${trackingNumber}`);
  
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
const createStripOrder = async (req, res) => {
  const { userId, products, totalAmount, address } = req.body;

  try {
    // Créer une session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products.map(product => ({
        price_data: {
          currency: 'usd',
          product_data: { name: product.name },
          unit_amount: product.price * 100
        },
        quantity: product.quantity
      })),
      mode: 'payment',
      success_url: 'https://yourdomain.com/success',
      cancel_url: 'https://yourdomain.com/cancel'
    });

    await createOrder(userId, products, address)

    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createOrder = async (userId, products, address) => {
  try {

    let totalAmount = 0;

    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ error: 'Produit non trouvé' });

      const stock = product.stock.get(item.size) || 0;
      if (stock < item.quantity) return res.status(400).json({ error: `Stock insuffisant pour ${product.name}` });

      product.stock.set(item.size, stock - item.quantity);
      await product.save();

      totalAmount += item.quantity * product.price;
    }

    // Enregistrer la commande dans la base de données
    const order = new Order({
      user: userId,
      products,
      totalAmount,
      address,
      paymentStatus: 'pending',
      orderStatus: 'pending'
    });

    await order.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ error: 'Commande non trouvée' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user').populate('products.productId');
    if (!order) return res.status(404).json({ error: 'Commande non trouvée' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('products.productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createStripOrder, updateOrder, getOrder, listOrders ,orderTracking};
