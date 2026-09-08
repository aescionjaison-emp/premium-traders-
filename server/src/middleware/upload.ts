import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';

// Ensure uploads folder exists for local fallback
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Memory storage so we can send to Cloudinary or save locally
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    // Videos
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-msvideo',
  ];
  if (allowedMimeTypes.includes(file.mimetype) || file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG, WEBP, SVG images and MP4, WEBM, MOV video formats are supported'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for videos and high-res images
  fileFilter,
});

/**
 * Upload a single media file (image or video) to Cloudinary or save locally as fallback
 */
export const processImageUpload = async (
  file: Express.Multer.File
): Promise<{ url: string; publicId?: string; isVideo?: boolean; mimeType?: string }> => {
  const isVideo = file.mimetype.startsWith('video/');

  if (isCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const uploadOptions: Record<string, any> = {
        folder: 'showroom_catalog',
        resource_type: isVideo ? 'video' : 'image',
      };
      if (!isVideo) {
        uploadOptions.transformation = [{ quality: 'auto:best', fetch_format: 'auto' }];
      }

      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) return reject(error);
        if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            isVideo,
            mimeType: file.mimetype,
          });
        } else {
          reject(new Error('Cloudinary upload returned no result'));
        }
      });
      uploadStream.end(file.buffer);
    });
  } else {
    // Local fallback
    const ext = path.extname(file.originalname) || (isVideo ? '.mp4' : '.jpg');
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filePath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filePath, file.buffer);
    const baseUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
    return {
      url: `${baseUrl}/uploads/${filename}`,
      publicId: filename,
      isVideo,
      mimeType: file.mimetype,
    };
  }
};

export const processMediaUpload = processImageUpload;
