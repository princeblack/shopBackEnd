const express = require('express');
const {getTrafficData } = require('../controllers/adminController');
const router = express.Router();


router.post('/admin/traffic', getTrafficData);


module.exports = router;


