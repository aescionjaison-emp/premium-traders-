import { Request, Response } from 'express';
import { Media } from '../models/Media.js';

export const getMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, limit = 60, page = 1 } = req.query;
    const filter: Record<string, any> = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search && typeof search === 'string' && search.trim()) {
      filter.filename = { $regex: search.trim(), $options: 'i' };
    }

    const pageSize = Number(limit);
    const currentPage = Number(page);
    const skip = (currentPage - 1) * pageSize;

    const [items, total] = await Promise.all([
      Media.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
      Media.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: items,
      pagination: {
        total,
        page: currentPage,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch media' });
  }
};

export const createMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { url, filename, category = 'general', mimeType, isVideo, size, publicId } = req.body;

    if (!url) {
      res.status(400).json({ success: false, message: 'Media URL is required' });
      return;
    }

    const item = await Media.create({
      url,
      filename: filename || url.split('/').pop() || 'media',
      category: category || 'general',
      mimeType: mimeType || (isVideo ? 'video/mp4' : 'image/jpeg'),
      isVideo: Boolean(isVideo),
      size: Number(size) || 0,
      publicId: publicId || '',
    });

    res.status(201).json({
      success: true,
      message: 'Media asset saved to library',
      data: item,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to save media' });
  }
};

export const deleteMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await Media.findByIdAndDelete(id);

    if (!item) {
      res.status(404).json({ success: false, message: 'Media item not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Media item removed from library',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete media' });
  }
};
