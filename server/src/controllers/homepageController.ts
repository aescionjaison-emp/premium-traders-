import { Request, Response } from 'express';
import { Homepage } from '../models/Homepage.js';

const defaultSections = [
  { id: 'hero', type: 'hero', title: '01 / Hero Section', visible: true, displayOrder: 1 },
  { id: 'materials_life', type: 'materials_life', title: '02 / Materials Come to Life (Pinned Transformation)', visible: true, displayOrder: 2 },
  { id: 'chapter_granite', type: 'chapter_granite', title: '03 / Granite Collection (Visual Chapter & Live Products)', visible: true, displayOrder: 3 },
  { id: 'chapter_tiles', type: 'chapter_tiles', title: '04 / Tile Collection (Visual Chapter & Live Products)', visible: true, displayOrder: 4 },
  { id: 'chapter_wood', type: 'chapter_wood', title: '05 / Wood Collection (Visual Chapter & Live Products)', visible: true, displayOrder: 5 },
  { id: 'chapter_electrical', type: 'chapter_electrical', title: '06 / Electrical Collection (Visual Chapter & Live Products)', visible: true, displayOrder: 6 },
  { id: 'explore_materials', type: 'explore_materials', title: '07 / Explore Materials (Horizontal Glide)', visible: true, displayOrder: 7 },
  { id: 'brand_marquee', type: 'brand_marquee', title: '08 / Brand Partners Marquee Strip', visible: true, displayOrder: 8 },
  { id: 'contact_strip', type: 'contact_strip', title: '09 / Showroom Visit & Direct Contact Strip', visible: true, displayOrder: 9 },
];

const defaultMaterialsComeToLife = [
  {
    num: '01',
    category: 'GRANITE',
    name: 'Natural Stone',
    headline: 'Natural Stone',
    desc: 'Raw Slabs → Finished Spaces',
    tagline: 'Raw Slabs → Finished Spaces',
    link: '/granite',
    image: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=1400&q=85',
    textureImage: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=1400&q=85',
    imageTexture: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=1400&q=85',
    highlight: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
    imageSpace: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
    accent: '#D4AF37',
  },
  {
    num: '02',
    category: 'TILES',
    name: 'Modern Surfaces',
    headline: 'Modern Surfaces',
    desc: 'Continuous Vein Porcelain',
    tagline: 'Continuous Vein Porcelain',
    link: '/tiles',
    image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1400&q=85',
    textureImage: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1400&q=85',
    imageTexture: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1400&q=85',
    highlight: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=85',
    imageSpace: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=85',
    accent: '#C5A059',
  },
  {
    num: '03',
    category: 'WOOD WORK',
    name: 'Crafted Wood',
    headline: 'Crafted Wood',
    desc: 'Solid Teak & Architectural Joinery',
    tagline: 'Solid Teak & Architectural Joinery',
    link: '/wood',
    image: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1400&q=85',
    textureImage: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1400&q=85',
    imageTexture: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1400&q=85',
    highlight: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85',
    imageSpace: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85',
    accent: '#8C6239',
  },
  {
    num: '04',
    category: 'ELECTRICAL',
    name: 'Smart Essentials',
    headline: 'Smart Essentials',
    desc: 'Solid Brass & Magnetic Tracks',
    tagline: 'Solid Brass & Magnetic Tracks',
    link: '/electrical',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1400&q=85',
    textureImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1400&q=85',
    imageTexture: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1400&q=85',
    highlight: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1400&q=85',
    imageSpace: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1400&q=85',
    accent: '#D4AF37',
  },
];

const defaultCategoryChapters = {
  granite: {
    id: 'granite',
    num: '01',
    number: '01',
    name: 'Granite Collection',
    heading: 'Granite Collection',
    tagline: 'Natural Stone',
    subLabel: 'Natural Stone',
    title: 'Black Galaxy',
    desc: '',
    link: '/granite',
    coverImage: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=1200&q=85',
    image: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=1200&q=85',
    textureImage: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=1200&q=85',
    spaceImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    finishes: ['Polished', 'Honed', 'Leathered'],
    visible: true,
  },
  tiles: {
    id: 'tiles',
    num: '02',
    number: '02',
    name: 'Tile Collection',
    heading: 'Tile Collection',
    tagline: 'Modern Surfaces',
    subLabel: 'Modern Surfaces',
    title: 'Statuario White',
    desc: '',
    link: '/tiles',
    coverImage: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=85',
    image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=85',
    textureImage: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=85',
    spaceImage: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=85',
    finishes: ['Glossy', 'Satin Matt', 'Carving'],
    visible: true,
  },
  wood: {
    id: 'wood',
    num: '03',
    number: '03',
    name: 'Wood Collection',
    heading: 'Wood Collection',
    tagline: 'Crafted Wood',
    subLabel: 'Crafted Wood',
    title: 'Teak Entrance',
    desc: '',
    link: '/wood',
    coverImage: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1200&q=85',
    image: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1200&q=85',
    textureImage: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1200&q=85',
    spaceImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
    finishes: ['Natural Teak', 'Smoked Oak', 'Veneer'],
    visible: true,
  },
  electrical: {
    id: 'electrical',
    num: '04',
    number: '04',
    name: 'Electrical Collection',
    heading: 'Electrical Collection',
    tagline: 'Smart Essentials',
    subLabel: 'Smart Essentials',
    title: 'Brass Switch',
    desc: '',
    link: '/electrical',
    coverImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=85',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=85',
    textureImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=85',
    spaceImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85',
    finishes: ['Brushed Brass', 'Matte Black', 'Touch Glass'],
    visible: true,
  },
};

const defaultExploreMaterials = [
  { id: '01', category: 'Granite', name: 'Black Galaxy', subtitle: 'Natural Stone', link: '/granite', image: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=1200&q=85' },
  { id: '02', category: 'Tiles', name: 'Statuario White', subtitle: 'Modern Surfaces', link: '/tiles', image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=85' },
  { id: '03', category: 'Wood', name: 'Smoked Oak', subtitle: 'Crafted Wood', link: '/wood', image: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1200&q=85' },
  { id: '04', category: 'Doors', name: 'Teak Entrance', subtitle: 'Architectural Doors', link: '/wood', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85' },
  { id: '05', category: 'Surfaces', name: 'Marine Ply', subtitle: 'Engineered Panels', link: '/wood', image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=85' },
  { id: '06', category: 'Electrical', name: 'Brass Switch', subtitle: 'Smart Essentials', link: '/electrical', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=85' },
];

export const getHomepageConfig = async (req: Request, res: Response) => {
  try {
    let homepage = await Homepage.findOne({});

    if (!homepage) {
      homepage = new Homepage({
        heroSlides: [
          {
            smallLabel: 'Premium Materials',
            heading: 'Beautiful Spaces.',
            subheading: '',
            image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=2400&q=85',
            videoUrl: '/videos/hero.mp4',
            ctaText: 'Explore Collection',
            ctaLink: '/catalog',
            badge: '',
          },
        ],
        materialsComeToLife: defaultMaterialsComeToLife,
        categoryChapters: defaultCategoryChapters,
        exploreMaterials: defaultExploreMaterials,
        sections: defaultSections,
        featuredProductIds: [],
        featuredCollectionIds: [],
      });
      await homepage.save();
    } else {
      let updated = false;
      if (!homepage.materialsComeToLife || homepage.materialsComeToLife.length === 0) {
        homepage.materialsComeToLife = defaultMaterialsComeToLife;
        updated = true;
      }
      if (!homepage.categoryChapters || !homepage.categoryChapters.granite) {
        homepage.categoryChapters = defaultCategoryChapters as any;
        updated = true;
      }
      if (!homepage.exploreMaterials || homepage.exploreMaterials.length === 0) {
        homepage.exploreMaterials = defaultExploreMaterials;
        updated = true;
      }
      if (!homepage.sections || homepage.sections.length === 0 || homepage.sections.some(s => s.id === 'asymmetric_catalog' || s.id === 'granite_showcase')) {
        homepage.sections = defaultSections;
        updated = true;
      }
      if (updated) {
        await homepage.save();
      }
    }

    res.json({ success: true, data: homepage });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateHomepageConfig = async (req: Request, res: Response) => {
  try {
    const updateData: any = {};
    if (req.body.heroSlides !== undefined) updateData.heroSlides = req.body.heroSlides;
    if (req.body.materialsComeToLife !== undefined) updateData.materialsComeToLife = req.body.materialsComeToLife;
    if (req.body.categoryChapters !== undefined) updateData.categoryChapters = req.body.categoryChapters;
    if (req.body.exploreMaterials !== undefined) updateData.exploreMaterials = req.body.exploreMaterials;
    if (req.body.sections !== undefined) updateData.sections = req.body.sections;
    if (req.body.featuredProductIds !== undefined) updateData.featuredProductIds = req.body.featuredProductIds;
    if (req.body.featuredCollectionIds !== undefined) updateData.featuredCollectionIds = req.body.featuredCollectionIds;

    const homepage = await Homepage.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, message: 'Homepage configuration updated successfully', data: homepage });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reorderHomepageSections = async (req: Request, res: Response) => {
  try {
    const { sections } = req.body;
    let homepage = await Homepage.findOne({});
    if (!homepage) {
      return res.status(404).json({ success: false, message: 'Homepage configuration not found' });
    }
    if (sections && Array.isArray(sections)) {
      homepage.sections = sections;
      await homepage.save();
    }
    res.json({ success: true, message: 'Sections reordered successfully', data: homepage });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

