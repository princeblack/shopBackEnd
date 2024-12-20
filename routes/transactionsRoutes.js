const express = require('express');
const { getAllTransactions} = require('../controllers/adminController');

const router = express.Router();

router.post('/admin/transactions', getAllTransactions);

module.exports = router;
