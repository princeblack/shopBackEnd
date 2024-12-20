const express = require('express');
const { createStripOrder, updateOrder, getOrder, listOrders,orderTracking } = require('../controllers/ordersController');
const { getAllOrderForAdmin,updateOrderForAdmin,getOderByCountry,updateOrderForAdmin,getAllOrderForAdmin} = require('../controllers/adminController');

const router = express.Router();

router.post('/', createStripOrder);
router.get('/order-list/', listOrders);
router.put('/:id', updateOrder);
router.get('/single/:id', getOrder);
router.get('/:id/tracking', orderTracking);
router.get('/admin/orders', getAllOrderForAdmin);
router.get('/admin/orders/analytics', getOderByCountry);
router.get('/admin/orders/:id', updateOrderForAdmin);

module.exports = router;