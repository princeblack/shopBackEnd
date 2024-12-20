const express = require('express');
const upload = require('../middlewares/fileUpload');
const { uploadFile } = require('../controllers/fileUploadController');
const router = express.Router();

// Single file upload route
router.post('/file', upload.single('file'), uploadFile);

module.exports = router;
