import { Request, Response } from 'express';
import slugify from 'slugify';
import { Collection } from '../models/Collection.js';
import { Product } from '../models/Product.js';

export const getCollections = async (req: Request, res: Response): Promise<void> => {
  try {
    const { visibleOnly, featuredOnly } = req.query;
    const filter: any = {};
    if (visibleOnly === 'true') filter.visible = true;
    if (featuredOnly === 'true') filter.featured = true;

    const collections = await Collection.find(filter)
      .populate({
        path: 'products',
        match: { visible: true },
        select: 'name slug images finish size material color',
        options: { limit: 8 },
      })
      .sort({ displayOrder: 1, createdAt: -1 });

    res.json({ success: true, data: collections });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCollectionBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const collection = await Collection.findOne({ slug }).populate({
      path: 'products',
      match: { visible: true },
      populate: { path: 'category', select: 'name slug' },
    });

    if (!collection) {
      res.status(404).json({ success: false, message: 'Collection not found' });
      return;
    }

    // If no products attached directly via array, search by collectionName
    let products: any = collection.products;
    if (!products || products.length === 0) {
      products = await Product.find({
        collectionName: { $regex: new RegExp(collection.name, 'i') },
        visible: true,
      }).populate('category', 'name slug');
    }

    res.json({ success: true, data: { ...collection.toObject(), products } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, image, bannerImage, featured, visible, displayOrder, products } = req.body;
    if (!name) {
      res.status(400).json({ success: false, message: 'Collection name is required' });
      return;
    }

    const slug = (slugify as any).default
      ? (slugify as any).default(name, { lower: true, strict: true })
      : (slugify as any)(name, { lower: true, strict: true });

    const collection = new Collection({
      name,
      slug,
      description,
      image,
      bannerImage,
      featured: featured !== undefined ? featured : true,
      visible: visible !== undefined ? visible : true,
      displayOrder: displayOrder || 0,
      products: products || [],
    });

    await collection.save();
    res.status(201).json({ success: true, message: 'Collection created', data: collection });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.name && !updateData.slug) {
      updateData.slug = (slugify as any).default
        ? (slugify as any).default(updateData.name, { lower: true, strict: true })
        : (slugify as any)(updateData.name, { lower: true, strict: true });
    }

    const collection = await Collection.findByIdAndUpdate(id, updateData, { new: true });
    if (!collection) {
      res.status(404).json({ success: false, message: 'Collection not found' });
      return;
    }
    res.json({ success: true, message: 'Collection updated', data: collection });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const collection = await Collection.findByIdAndDelete(id);
    if (!collection) {
      res.status(404).json({ success: false, message: 'Collection not found' });
      return;
    }
    res.json({ success: true, message: 'Collection deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
