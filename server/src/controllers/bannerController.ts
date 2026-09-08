import { Request, Response } from 'express';
import { Banner } from '../models/Banner.js';

export const getBanners = async (req: Request, res: Response): Promise<void> => {
  try {
    const { position, visibleOnly } = req.query;
    const filter: any = {};
    if (visibleOnly === 'true') filter.visible = true;
    if (position) filter.position = position;

    const banners = await Banner.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, data: banners });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const banner = new Banner(req.body);
    await banner.save();
    res.status(201).json({ success: true, message: 'Banner created', data: banner });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndUpdate(id, req.body, { new: true });
    if (!banner) {
      res.status(404).json({ success: false, message: 'Banner not found' });
      return;
    }
    res.json({ success: true, message: 'Banner updated', data: banner });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) {
      res.status(404).json({ success: false, message: 'Banner not found' });
      return;
    }
    res.json({ success: true, message: 'Banner deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
