import { Request, Response } from 'express';
import slugify from 'slugify';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category,
      categorySlug,
      collection,
      finish,
      surface,
      material,
      color,
      size,
      bodyType,
      brand,
      application,
      search,
      featured,
      newArrival,
      popular,
      available,
      visible,
      sort,
      page = 1,
      limit = 50,
      admin,
    } = req.query;

    const query: any = {};

    // For public frontend, only show visible by default
    if (admin !== 'true') {
      query.visible = true;
    } else if (visible !== undefined) {
      query.visible = visible === 'true';
    }

    if (category) query.category = category;
    if (categorySlug) {
      const cat = await Category.findOne({ slug: categorySlug as string });
      if (cat) query.category = cat._id;
    }
    if (collection) query.collectionName = { $regex: new RegExp(collection as string, 'i') };
    if (finish) query.finish = { $in: Array.isArray(finish) ? finish : [finish] };
    if (surface) query.surface = { $in: Array.isArray(surface) ? surface : [surface] };
    if (material) query.material = { $in: Array.isArray(material) ? material : [material] };
    if (color) query.color = { $in: Array.isArray(color) ? color : [color] };
    if (size) query.size = { $in: Array.isArray(size) ? size : [size] };
    if (bodyType) query.bodyType = { $in: Array.isArray(bodyType) ? bodyType : [bodyType] };
    if (brand) query.brand = { $in: Array.isArray(brand) ? brand : [brand] };
    if (application) query.applications = { $in: Array.isArray(application) ? application : [application] };
    if (featured !== undefined) query.featured = featured === 'true';
    if (newArrival !== undefined) query.newArrival = newArrival === 'true';
    if (popular !== undefined) query.popular = popular === 'true';
    if (available !== undefined) query.available = available === 'true';

    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      query.$or = [
        { name: searchRegex },
        { sku: searchRegex },
        { material: searchRegex },
        { finish: searchRegex },
        { collectionName: searchRegex },
        { brand: searchRegex },
        { color: searchRegex },
      ];
    }

    let sortOption: any = { displayOrder: 1, createdAt: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'name_asc') sortOption = { name: 1 };
    if (sort === 'name_desc') sortOption = { name: -1 };
    if (sort === 'featured') sortOption = { featured: -1, displayOrder: 1 };

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 50;
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug }).populate('category', 'name slug description').lean();

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRelatedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const current = await Product.findById(id);
    if (!current) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const related = await Product.find({
      _id: { $ne: current._id },
      visible: true,
      $or: [
        { category: current.category },
        { material: current.material },
        { finish: current.finish },
        { collectionName: current.collectionName },
      ],
    })
      .populate('category', 'name slug')
      .limit(6)
      .lean();

    res.json({ success: true, data: related });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFilterOptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categorySlug } = req.query;
    let matchQuery: any = { visible: true };

    if (categorySlug) {
      const cat = await Category.findOne({ slug: categorySlug as string });
      if (cat) matchQuery.category = cat._id;
    }

    const [finishes, materials, sizes, surfaces, colors, brands, bodyTypes, applications, collections] =
      await Promise.all([
        Product.distinct('finish', matchQuery),
        Product.distinct('material', matchQuery),
        Product.distinct('size', matchQuery),
        Product.distinct('surface', matchQuery),
        Product.distinct('color', matchQuery),
        Product.distinct('brand', matchQuery),
        Product.distinct('bodyType', matchQuery),
        Product.distinct('applications', matchQuery),
        Product.distinct('collectionName', matchQuery),
      ]);

    res.json({
      success: true,
      data: {
        finishes: finishes.filter(Boolean),
        materials: materials.filter(Boolean),
        sizes: sizes.filter(Boolean),
        surfaces: surfaces.filter(Boolean),
        colors: colors.filter(Boolean),
        brands: brands.filter(Boolean),
        bodyTypes: bodyTypes.filter(Boolean),
        applications: applications.filter(Boolean),
        collections: collections.filter(Boolean),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData = req.body;

    if (!productData.name) {
      res.status(400).json({ success: false, message: 'Product name is required' });
      return;
    }

    let slug = productData.slug
      ? (slugify as any).default
        ? (slugify as any).default(productData.slug, { lower: true, strict: true })
        : (slugify as any)(productData.slug, { lower: true, strict: true })
      : (slugify as any).default
      ? (slugify as any).default(productData.name, { lower: true, strict: true })
      : (slugify as any)(productData.name, { lower: true, strict: true });

    // Ensure unique slug
    let existing = await Product.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }
    productData.slug = slug;

    // Check category slug sync
    if (productData.category) {
      const cat = await Category.findById(productData.category);
      if (cat) productData.categorySlug = cat.slug;
    }

    const product = new Product(productData);
    await product.save();

    res.status(201).json({ success: true, message: 'Product created successfully', data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.name && !updateData.slug) {
      updateData.slug = (slugify as any).default
        ? (slugify as any).default(updateData.name, { lower: true, strict: true })
        : (slugify as any)(updateData.name, { lower: true, strict: true });
    }

    if (updateData.category) {
      const cat = await Category.findById(updateData.category);
      if (cat) updateData.categorySlug = cat.slug;
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.json({ success: true, message: 'Product updated successfully', data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleProductFeature = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    product.featured = !product.featured;
    await product.save();
    res.json({ success: true, message: `Product ${product.featured ? 'featured' : 'unfeatured'}`, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleProductVisibility = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    product.visible = !product.visible;
    await product.save();
    res.json({ success: true, message: `Product visibility toggled to ${product.visible ? 'Visible' : 'Hidden'}`, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const duplicateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const original = await Product.findById(id).lean();
    if (!original) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const { _id, createdAt, updatedAt, ...rest } = original as any;
    const newName = `${rest.name} (Copy)`;
    const newSlug = `${rest.slug}-copy-${Date.now().toString().slice(-4)}`;
    const newSku = `${rest.sku}-CP`;

    const duplicate = new Product({
      ...rest,
      name: newName,
      slug: newSlug,
      sku: newSku,
      featured: false,
    });

    await duplicate.save();
    res.status(201).json({ success: true, message: 'Product duplicated successfully', data: duplicate });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
