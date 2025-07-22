import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { ErrorResponse } from './error';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// File type validation
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allowed file types
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
  const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/flac'];
  const allowedDocTypes = ['application/pdf'];

  const allowedTypes = [...allowedImageTypes, ...allowedAudioTypes, ...allowedDocTypes];

  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error('File type not supported'));
    return;
  }

  cb(null, true);
};

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'presskit-pro',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'heic', 'mp3', 'wav', 'flac', 'pdf'],
    resource_type: 'auto'
  }
});

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB max file size
  }
});

// Middleware for handling image uploads
export const uploadImages = upload.array('images', 10); // Max 10 images

// Middleware for handling audio uploads
export const uploadAudio = upload.single('audio');

// Middleware for handling document uploads
export const uploadDocument = upload.single('document');

// Error handler for multer
export const handleUploadError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new ErrorResponse('File too large. Maximum size is 25MB', 400));
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return next(new ErrorResponse('Too many files. Maximum is 10 files', 400));
    }
    return next(new ErrorResponse(`Upload error: ${err.message}`, 400));
  }

  if (err) {
    return next(new ErrorResponse(err.message || 'File upload failed', 400));
  }

  next();
};

// Middleware to optimize images
export const optimizeImage = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file && !req.files) return next();

  try {
    const files = Array.isArray(req.files) ? req.files : [req.file];

    for (const file of files) {
      if (!file) continue;

      if (file.mimetype.startsWith('image/')) {
        // Optimize image using Cloudinary transformation
        const result = await cloudinary.uploader.upload(file.path, {
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
            { width: 2000, crop: 'limit' }
          ]
        });

        // Replace original file with optimized version
        file.path = result.secure_url;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to validate file metadata
export const validateFileMetadata = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file && !req.files) {
    return next(new ErrorResponse('No file uploaded', 400));
  }

  const files = Array.isArray(req.files) ? req.files : [req.file];

  for (const file of files) {
    if (!file) continue;

    // Check if file has required metadata
    if (!file.originalname || !file.mimetype) {
      return next(new ErrorResponse('Invalid file metadata', 400));
    }

    // Additional metadata validation can be added here
  }

  next();
};