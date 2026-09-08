import { Request, Response } from 'express';
import { Brand } from '../models/Brand.js';

export const getBrands = async (req: Request, res: Response): Promise<void> => {
  try {
    const { visibleOnly } = req.query;
    const filter = visibleOnly === 'true' ? { visible: true } : {};
    const brands = await Brand.find(filter).sort({ displayOrder: 1, name: 1 });
    res.json({ success: true, data: brands });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, logo, category, visible, displayOrder } = req.body;
    if (!name) {
      res.status(400).json({ success: false, message: 'Brand name is required' });
      return;
    }

    const brand = new Brand({
      name,
      logo: logo || '',
      category: category || 'General',
      visible: visible !== undefined ? visible : true,
      displayOrder: displayOrder || 0,
    });

    await brand.save();
    res.status(201).json({ success: true, message: 'Brand created', data: brand });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByIdAndUpdate(id, req.body, { new: true });
    if (!brand) {
      res.status(404).json({ success: false, message: 'Brand not found' });
      return;
    }
    res.json({ success: true, message: 'Brand updated', data: brand });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) {
      res.status(404).json({ success: false, message: 'Brand not found' });
      return;
    }
    res.json({ success: true, message: 'Brand deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
