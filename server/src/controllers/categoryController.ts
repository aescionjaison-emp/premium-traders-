import { Request, Response } from 'express';
import slugify from 'slugify';
import { Category } from '../models/Category.js';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { visibleOnly } = req.query;
    const filter = visibleOnly === 'true' ? { visible: true } : {};
    const categories = await Category.find(filter).sort({ displayOrder: 1, name: 1 });
    res.json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }
    res.json({ success: true, data: category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, image, icon, visible, featured, displayOrder } = req.body;
    if (!name) {
      res.status(400).json({ success: false, message: 'Category name is required' });
      return;
    }

    const slug = (slugify as any).default
      ? (slugify as any).default(name, { lower: true, strict: true })
      : (slugify as any)(name, { lower: true, strict: true });

    const category = new Category({
      name,
      slug,
      description,
      image,
      icon,
      visible: visible !== undefined ? visible : true,
      featured: featured !== undefined ? featured : false,
      displayOrder: displayOrder || 0,
    });

    await category.save();
    res.status(201).json({ success: true, message: 'Category created', data: category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.name && !updateData.slug) {
      updateData.slug = (slugify as any).default
        ? (slugify as any).default(updateData.name, { lower: true, strict: true })
        : (slugify as any)(updateData.name, { lower: true, strict: true });
    }

    const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }
    res.json({ success: true, message: 'Category updated', data: category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }
    res.json({ success: true, message: 'Category deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
