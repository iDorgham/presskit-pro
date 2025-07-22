import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryConfig } from '../config';
import { logger } from '../middleware/logger';
import path from 'path';
import fs from 'fs/promises';
import { ErrorResponse } from '../middleware/error';

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudinaryConfig.cloudName,
  api_key: cloudinaryConfig.apiKey,
  api_secret: cloudinaryConfig.apiSecret
});

// Interface for file upload result
interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  size: number;
  resourceType: string;
  metadata: any;
}

// Upload file to Cloudinary
export const uploadToCloudinary = async (
  filePath: string,
  folder: string = cloudinaryConfig.folder
): Promise<UploadResult> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
      resourceType: result.resource_type,
      metadata: {
        width: result.width,
        height: result.height,
        duration: result.duration
      }
    };
  } catch (error) {
    logger.error('Error uploading file to Cloudinary:', error);
    throw new ErrorResponse('Failed to upload file', 500);
  }
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
    logger.info(`File deleted from Cloudinary: ${publicId}`);
  } catch (error) {
    logger.error('Error deleting file from Cloudinary:', error);
    throw new ErrorResponse('Failed to delete file', 500);
  }
};

// Create temporary local file
export const createTempFile = async (buffer: Buffer, filename: string): Promise<string> => {
  const tempDir = path.join(__dirname, '../../temp');
  const tempPath = path.join(tempDir, filename);

  try {
    // Ensure temp directory exists
    await fs.mkdir(tempDir, { recursive: true });
    await fs.writeFile(tempPath, buffer);
    return tempPath;
  } catch (error) {
    logger.error('Error creating temporary file:', error);
    throw new ErrorResponse('Failed to create temporary file', 500);
  }
};

// Delete temporary local file
export const deleteTempFile = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath);
    logger.info(`Temporary file deleted: ${filePath}`);
  } catch (error) {
    logger.error('Error deleting temporary file:', error);
    // Don't throw error for cleanup operations
  }
};

// Get file extension
export const getFileExtension = (filename: string): string => {
  return path.extname(filename).toLowerCase();
};

// Check if file type is allowed
export const isAllowedFileType = (filename: string, allowedTypes: string[]): boolean => {
  const ext = getFileExtension(filename);
  return allowedTypes.includes(ext);
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Generate unique filename
export const generateUniqueFilename = (originalFilename: string): string => {
  const ext = path.extname(originalFilename);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}${ext}`;
};

// Clean up temporary files
export const cleanupTempFiles = async (directory: string): Promise<void> => {
  try {
    const files = await fs.readdir(directory);
    const oneHourAgo = Date.now() - 3600000; // 1 hour in milliseconds

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = await fs.stat(filePath);

      if (stats.mtimeMs < oneHourAgo) {
        await fs.unlink(filePath);
        logger.info(`Cleaned up old temporary file: ${file}`);
      }
    }
  } catch (error) {
    logger.error('Error cleaning up temporary files:', error);
    // Don't throw error for cleanup operations
  }
};