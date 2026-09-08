import { Request, Response } from 'express';
import { Gallery } from '../models/Gallery.js';

export const getGallery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, featuredOnly, visibleOnly } = req.query;
    const filter: any = {};
    if (visibleOnly === 'true') filter.visible = true;
    if (featuredOnly === 'true') filter.featured = true;
    if (category) filter.category = category;

    const items = await Gallery.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category, image, thumbnail, locationOrSpace, aspectRatio, featured, visible, displayOrder } = req.body;
    if (!title || !image) {
      res.status(400).json({ success: false, message: 'Title and image are required' });
      return;
    }

    const item = new Gallery({
      title,
      category: category || 'Interior',
      image,
      thumbnail: thumbnail || '',
      locationOrSpace: locationOrSpace || '',
      aspectRatio: aspectRatio || '16:9',
      featured: featured !== undefined ? featured : false,
      visible: visible !== undefined ? visible : true,
      displayOrder: displayOrder || 0,
    });

    await item.save();
    res.status(201).json({ success: true, message: 'Gallery item created', data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await Gallery.findByIdAndUpdate(id, req.body, { new: true });
    if (!item) {
      res.status(404).json({ success: false, message: 'Gallery item not found' });
      return;
    }
    res.json({ success: true, message: 'Gallery item updated', data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await Gallery.findByIdAndDelete(id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Gallery item not found' });
      return;
    }
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
