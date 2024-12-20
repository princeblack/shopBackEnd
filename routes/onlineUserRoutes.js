const express = require('express');
const { getOnlineUsers, addOnlineUser } = require('../controllers/onlineUserController');

const router = express.Router();

router.get('/', getOnlineUsers);
router.post('/', addOnlineUser);

module.exports = router;
