import { Request, Response } from 'express';
import { Navigation } from '../models/Navigation.js';

export const getNavigation = async (req: Request, res: Response): Promise<void> => {
  try {
    let nav = await Navigation.findOne();
    const cleanDefaultItems = [
      { label: 'CATALOG', url: '/catalog', visible: true, displayOrder: 1 },
      { label: 'TILES', url: '/tiles', categorySlug: 'tiles', visible: true, displayOrder: 2 },
      { label: 'GRANITE & STONE', url: '/granite', categorySlug: 'granite-marble-natural-stone', visible: true, displayOrder: 3 },
      { label: 'WOODWORKS', url: '/wood', categorySlug: 'wood-works-wooden-doors-plywood', visible: true, displayOrder: 4 },
      { label: 'ELECTRICAL', url: '/electrical', categorySlug: 'electrical-products-lighting-switches', visible: true, displayOrder: 5 },
      { label: 'CONTACT', url: '/contact', visible: true, displayOrder: 6 },
    ];

    if (!nav) {
      nav = new Navigation({ items: cleanDefaultItems });
      await nav.save();
    } else {
      // Filter out removed sections if present in db
      const filtered = nav.items.filter(
        (item) =>
          !item.url.includes('inspired-spaces') &&
          !item.url.includes('collections') &&
          item.label.toUpperCase() !== 'INSPIRED SPACES' &&
          item.label.toUpperCase() !== 'COLLECTIONS'
      );
      if (filtered.length !== nav.items.length) {
        nav.items = filtered as any;
        await nav.save();
      }
    }
    res.json({ success: true, data: nav });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateNavigation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { items } = req.body;
    let nav = await Navigation.findOne();
    if (!nav) {
      nav = new Navigation({ items });
    } else {
      nav.items = items;
    }
    await nav.save();
    res.json({ success: true, message: 'Navigation updated', data: nav });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
