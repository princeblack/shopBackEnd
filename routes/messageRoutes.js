const express = require('express');
const { sendUserMessage} = require('../controllers/adminController');

const router = express.Router();

router.post('/admin/messages', sendUserMessage);
router.post('/admin/messages', sendUserMessage);

module.exports = router;
