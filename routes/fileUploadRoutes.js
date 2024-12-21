const express = require("express");
const upload = require("../middlewares/fileUpload");
const { scanFileForMalware } = require("../middlewares/fileUpload");
const File = require("../models/File");

const router = express.Router();

// Route to handle image uploads
router.post(
  "/upload/image",
  upload.single("file"),
  scanFileForMalware,
  async (req, res) => {
    try {
      const file = new File({
        fileName: req.file.filename,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        uploadedBy: req.user.id, // Assuming user authentication
        filePath: `/uploads/images/${req.file.filename}`,
      });

      await file.save();
      res.status(200).json({
        message: "File uploaded and metadata saved",
        file,
      });
    } catch (err) {
      res.status(500).json({ message: "Error saving file metadata" });
    }
  }
);

// Route to handle video uploads
router.post(
  "/upload/video",
  upload.single("file"),
  scanFileForMalware,
  async (req, res) => {
    try {
      const file = new File({
        fileName: req.file.filename,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        uploadedBy: req.user.id, // Assuming user authentication
        filePath: `/uploads/videos/${req.file.filename}`,
      });
      await file.save();
      res.status(200).json({
        message: "Video uploaded successfully",
        filePath: `/uploads/videos/${req.file.filename}`,
      });
    } catch (error) {
      return res.status(400).json({ message: "No file uploaded" });
    }
  }
);

// Route to handle PDF uploads
router.post(
  "/upload/pdf",
  upload.single("file"),
  scanFileForMalware,
  async (req, res) => {
    try {
      const file = new File({
        fileName: req.file.filename,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        uploadedBy: req.user.id, // Assuming user authentication
        filePath: `/uploads/pdf/${req.file.filename}`,
      });

      await file.save();
      res.status(200).json({
        message: "PDF uploaded successfully",
        filePath: `/uploads/pdf/${req.file.filename}`,
      });
    } catch (error) {
      return res.status(400).json({ message: "No file uploaded" });
    }
  }
);

module.exports = router;
