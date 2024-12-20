const express = require('express');
const { createCategory, updateCategory, createCategory,deleteCategory,getSpecialCategory,addSpecialCategory,updatedSpecialCategory} = require('../controllers/adminController');
const router = express.Router();

router.post('/admin/categories', createCategory);
router.put('/admin/categories/:id', updateCategory);
router.delete('/admin/special-categories', addSpecialCategory);
router.delete('/admin/special-categories/:id', updatedSpecialCategory);
router.delete('/admin/delete-categories/:id', deleteCategory);
router.delete('/special-categories', getSpecialCategory);

module.exports = router;