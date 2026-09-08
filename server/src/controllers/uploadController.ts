import { Request, Response } from 'express';
import { processMediaUpload } from '../middleware/upload.js';

export const uploadSingleImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No media file uploaded' });
      return;
    }

    const result = await processMediaUpload(req.file);
    res.json({
      success: true,
      message: `${result.isVideo ? 'Video' : 'Image'} uploaded successfully`,
      url: result.url,
      publicId: result.publicId,
      isVideo: result.isVideo,
      mimeType: result.mimeType,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
};

export const uploadMultipleImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: 'No media files uploaded' });
      return;
    }

    const uploadPromises = files.map((file) => processMediaUpload(file));
    const results = await Promise.all(uploadPromises);

    res.json({
      success: true,
      message: `${results.length} files uploaded successfully`,
      data: results,
      urls: results.map((r) => r.url),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Multiple upload failed' });
  }
};
