const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const path = require('path');

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

// Validate file type
const fileFilter = (req, file, cb) => {
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

  if (isMimeValid) {
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
