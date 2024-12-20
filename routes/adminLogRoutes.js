const express = require('express');
const { uploadFile } = require('../controllers/adminController');
const router = express.Router();

// Single file upload route
router.post('/file', upload.single('file'), uploadFile);

module.exports = router;
