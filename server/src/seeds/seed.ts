import mongoose from 'mongoose';
import dotenv from 'dotenv';
import slugify from 'slugify';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Collection } from '../models/Collection.js';
import { Brand } from '../models/Brand.js';
import { Gallery } from '../models/Gallery.js';
import { Product } from '../models/Product.js';
import { Homepage } from '../models/Homepage.js';
import { Navigation } from '../models/Navigation.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { Banner } from '../models/Banner.js';
import { initialCategories, initialCollections, initialBrands, initialGallery } from './seedData.js';
import { tileSeeds, graniteSeeds, woodSeeds, electricalSeeds } from './productSeeds.js';

dotenv.config();

const runSeed = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Clearing old showroom data...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Collection.deleteMany({}),
      Brand.deleteMany({}),
      Gallery.deleteMany({}),
      Product.deleteMany({}),
      Homepage.deleteMany({}),
      Navigation.deleteMany({}),
      SiteSettings.deleteMany({}),
      Banner.deleteMany({}),
    ]);

    // 1. Create Default Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@showroom.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
    const adminUser = new User({
      name: 'Showroom Managing Director',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    await adminUser.save();
    console.log(`[Seed] Admin user created: ${adminEmail}`);

    // 2. Create Categories
    const createdCategories = await Category.insertMany(initialCategories);
    console.log(`[Seed] Created ${createdCategories.length} Categories`);
    const categoryMap = new Map<string, mongoose.Types.ObjectId>();
    createdCategories.forEach((cat) => {
      categoryMap.set(cat.slug, cat._id as mongoose.Types.ObjectId);
    });

    // 3. Create Collections
    const createdCollections = await Collection.insertMany(initialCollections);
    console.log(`[Seed] Created ${createdCollections.length} Collections`);
    const collectionMap = new Map<string, mongoose.Types.ObjectId>();
    createdCollections.forEach((col) => {
      collectionMap.set(col.name.toUpperCase(), col._id as mongoose.Types.ObjectId);
    });

    // 4. Create Brands
    const createdBrands = await Brand.insertMany(initialBrands);
    console.log(`[Seed] Created ${createdBrands.length} Brands`);

    // 5. Create Gallery
    const createdGallery = await Gallery.insertMany(initialGallery);
    console.log(`[Seed] Created ${createdGallery.length} Gallery items`);

    // 6. Create Products
    const allProductInputs = [...tileSeeds, ...graniteSeeds, ...woodSeeds, ...electricalSeeds];
    const productDocs = allProductInputs.map((p) => {
      const catId = categoryMap.get(p.categorySlug) || createdCategories[0]._id;
      const slugHelper = (slugify as any).default || slugify;
      const slug = slugHelper(p.name, { lower: true, strict: true }) + '-' + p.sku.toLowerCase();

      return {
        name: p.name,
        slug,
        category: catId,
        categorySlug: p.categorySlug,
        subcategory: p.subcategory,
        brand: p.brand,
        collectionName: p.collectionName,
        material: p.material,
        finish: p.finish,
        surface: p.surface,
        color: p.color,
        size: p.size,
        bodyType: p.bodyType,
        sku: p.sku,
        description: p.description,
        applications: p.applications,
        specifications: p.specifications,
        images: p.images,
        installationImages: p.installationImages,
        featured: p.featured,
        newArrival: p.newArrival,
        popular: p.popular,
        available: p.available,
        visible: p.visible,
        displayOrder: p.displayOrder,
      };
    });

    const createdProducts = await Product.insertMany(productDocs);
    console.log(`[Seed] Successfully inserted ${createdProducts.length} architectural showroom products!`);

    // Link products to collections
    for (const col of createdCollections) {
      const matchingProductIds = createdProducts
        .filter((prod) => prod.collectionName && prod.collectionName.toUpperCase() === col.name.toUpperCase())
        .map((p) => p._id);
      if (matchingProductIds.length > 0) {
        col.products = matchingProductIds as any;
        await col.save();
      }
    }

    // 7. Create Homepage Builder Registry
    const featuredProds = createdProducts.filter((p) => p.featured).slice(0, 10).map((p) => p._id);
    const featuredCols = createdCollections.slice(0, 6).map((c) => c._id);

    const homepage = new Homepage({
      heroSlides: [
        {
          smallLabel: 'ARCHITECTURAL MATERIAL SHOWROOM',
          heading: 'MATERIALS THAT DEFINE SPACE.',
          subheading: 'TILES • NATURAL STONE • FINE WOOD • LUXURY ELECTRICAL',
          image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=2000&q=85',
          ctaText: 'EXPLORE CATALOG',
          ctaLink: '/catalog',
          badge: '2026 ARCHITECTURAL SPECIFICATION',
        },
        {
          smallLabel: 'EXOTIC GRANITE & MONOLITHIC SLABS',
          heading: 'TIMELESS GEOLOGICAL MASTERPIECES.',
          subheading: 'BLACK GALAXY • COLONIAL WHITE • HONED BASALT',
          image: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=2000&q=85',
          ctaText: 'VIEW STONE SLABS',
          ctaLink: '/granite',
          badge: 'DIRECT QUARRY SELECTION',
        },
        {
          smallLabel: 'BURMESE TEAK & ARCHITECTURAL WOODWORKS',
          heading: 'ORGANIC WARMTH & STATELY ENTRANCES.',
          subheading: 'CUSTOM PIVOT DOORS • SMOKED OAK LOUVERS • MARINE PLY',
          image: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=2000&q=85',
          ctaText: 'EXPLORE WOODWORKS',
          ctaLink: '/wood',
          badge: 'HANDCRAFTED HERITAGE',
        },
      ],
      sections: [
        { id: 'hero', type: 'hero', title: 'Cinematic Architectural Hero', visible: true, displayOrder: 1 },
        { id: 'categories', type: 'categories', title: 'Curated Material Disciplines', visible: true, displayOrder: 2 },
        { id: 'asymmetric_catalog', type: 'asymmetric_catalog', title: 'Curated Architectural Showcase', visible: true, displayOrder: 3 },
        { id: 'granite_showcase', type: 'granite_showcase', title: 'Natural Stone & Granite Slabs', visible: true, displayOrder: 4 },
        { id: 'wood_panorama', type: 'wood_panorama', title: 'Fine Woodworks & Entrance Doors', visible: true, displayOrder: 5 },
        { id: 'electrical_strip', type: 'electrical_strip', title: 'Architectural Lighting & Modular Switches', visible: true, displayOrder: 6 },
        { id: 'collections', type: 'collections', title: 'Curated Master Collections', visible: true, displayOrder: 7 },
        { id: 'inspired_spaces', type: 'inspired_spaces', title: 'Spaces of Distinction Gallery', visible: true, displayOrder: 8 },
        { id: 'brand_marquee', type: 'brand_marquee', title: 'Showroom Brand Partners', visible: true, displayOrder: 9 },
        { id: 'contact_strip', type: 'contact_strip', title: 'Experience Our Showroom', visible: true, displayOrder: 10 },
      ],
      featuredProductIds: featuredProds,
      featuredCollectionIds: featuredCols,
    });
    await homepage.save();
    console.log('[Seed] Homepage Builder initialized');

    // 8. Create Navigation
    const nav = new Navigation({
      items: [
        { label: 'CATALOG', url: '/catalog', visible: true, displayOrder: 1 },
        { label: 'TILES', url: '/tiles', categorySlug: 'tiles', visible: true, displayOrder: 2 },
        { label: 'GRANITE & STONE', url: '/granite', categorySlug: 'granite-marble-natural-stone', visible: true, displayOrder: 3 },
        { label: 'WOODWORKS', url: '/wood', categorySlug: 'wood-works-wooden-doors-plywood', visible: true, displayOrder: 4 },
        { label: 'ELECTRICAL', url: '/electrical', categorySlug: 'electrical-products-lighting-switches', visible: true, displayOrder: 5 },
        { label: 'COLLECTIONS', url: '/catalog?view=collections', visible: true, displayOrder: 6 },
        { label: 'INSPIRED SPACES', url: '/inspired-spaces', visible: true, displayOrder: 7 },
        { label: 'CONTACT', url: '/contact', visible: true, displayOrder: 8 },
      ],
    });
    await nav.save();
    console.log('[Seed] Navigation initialized');

    // 9. Create Site Settings
    const settings = new SiteSettings({
      businessName: 'AMBROSIA ARCHITECTURAL SHOWROOM',
      tagline: 'Luxury Tiles • Exotic Granite • Fine Woodworks • Architectural Electrical',
      logo: '',
      phone: '+91 98765 43210',
      whatsapp: '+919876543210',
      email: 'sales@ambrosiashowroom.com',
      address: 'Plot 42, Architectural Boulevard, Outer Ring Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      googleMapsUrl: 'https://maps.google.com',
      openingHours: 'Mon – Sat: 9:30 AM – 8:30 PM | Sun: 10:30 AM – 6:00 PM',
      instagramUrl: 'https://instagram.com/ambrosiashowroom',
      facebookUrl: 'https://facebook.com/ambrosiashowroom',
      youtubeUrl: 'https://youtube.com',
      seoTitle: 'Ambrosia Showroom | Premium Tiles, Granite, Wood & Electrical Catalog',
      seoDescription: 'Explore luxury large-format tiles, exotic natural granite slabs, teak architectural doors, and minimalist designer switches in our digital showroom.',
      footerText: 'Curating the finest building and interior materials for architects, interior designers, and distinguished homeowners across India.',
      copyrightText: '© 2026 Ambrosia Architectural Showroom. All Rights Reserved.',
    });
    await settings.save();
    console.log('[Seed] Site Settings initialized');

    console.log('----------------------------------------------------');
    console.log('✅ SHOWROOM DATABASE SEED COMPLETED SUCCESSFULLY!');
    console.log(`Admin Login: ${adminEmail}`);
    console.log(`Password:    ${adminPassword}`);
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

runSeed();
