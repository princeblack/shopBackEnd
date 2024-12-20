const express = require('express');
const { getOneProduct, updateProduct, deleteProduct, getProduct, listProducts,recommendations, } = require('../controllers/productController');
const { updatedProductProperty,deleteProdruitFromAdmin, createProduitFromAdmin,updatedProductFromAdmin} = require('../controllers/adminController');

const router = express.Router();

router.put('/:id', getOneProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/:id', getProduct);
router.get('/', listProducts);
router.get('/:id/recommendations', recommendations);
router.get('/admin/products', createProduitFromAdmin);
router.get('/admin/products/:id', updatedProductProperty);
router.get('/admin/products/:id', updatedProductFromAdmin);
router.get('/admin/products/:id', deleteProdruitFromAdmin);
router.get('/admin/products/:id/comments/:commentId', deleteUserProduitComment);

module.exports = router;
