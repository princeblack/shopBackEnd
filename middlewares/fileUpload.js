const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const path = require('path');
const NodeClam = require('clamscan');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Allowed MIME types
const allowedMimeTypes = {
  image: ['image/jpeg', 'image/png', 'image/gif'],
  video: ['video/mp4', 'video/mpeg', 'video/avi'],
  pdf: ['application/pdf'],
};

// Validate file extensions
const validateFileExtension = (fileName, allowedExtensions) => {
  const extension = path.extname(fileName).toLowerCase();
  return allowedExtensions.includes(extension);
};

const clamScan = new NodeClam().init({
  removeInfected: true, // Automatically remove infected files
  quarantineInfected: 'uploads/quarantine/', // Quarantine folder
  scanLog: 'logs/clamav-scan.log',
});

// Middleware to scan files
export const scanFileForMalware = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const clamscan = await clamScan;
    const isInfected = await clamscan.isInfected(req.file.path);

    if (isInfected) {
      // Remove file if infected
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Uploaded file is infected with malware' });
    }
    next();
  } catch (err) {
    console.error('ClamAV Error:', err);
    return res.status(500).json({ message: 'File scan failed' });
  }
};

// Validate file type
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mpeg', '.avi', '.pdf'];
  const dangerousExtensions = ['.exe', '.js', '.sh', '.bat'];
const fileExtension = path.extname(file.originalname).toLowerCase();

if (dangerousExtensions.includes(fileExtension)) {
  cb(new Error('Executable files are not allowed'), false);
} else {
  cb(null, true);
}
  const isMimeValid = Object.values(allowedMimeTypes).some((types) =>
    types.includes(file.mimetype)
  );
  const isExtensionValid = validateFileExtension(file.originalname, allowedExtensions);

  if (isMimeValid && isExtensionValid) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

// Multer S3 storage configuration
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB size limit
});

module.exports = upload;
