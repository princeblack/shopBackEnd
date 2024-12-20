const logger = require('../utils/logger');
const File = require('../models/File');

// Handle file upload and metadata storage
const uploadFile = async (req, res) => {
  try {
    const fileUrl = req.file.location; // S3 file URL

    // Save file metadata to database
    const fileMetadata = new File({
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      fileUrl,
      uploadDate: new Date(),
      uploadedBy: req.userId,  // assuming `userId` comes from authentication
    });

    await fileMetadata.save();

    logger.info(`File uploaded: ${fileUrl}`);

    res.status(200).json({
      message: 'File uploaded successfully',
      fileUrl,
    });
  } catch (error) {
    logger.error(`File upload error: ${error.message}`);
    res.status(500).json({ message: 'File upload failed' });
  }
};

module.exports = { uploadFile };
