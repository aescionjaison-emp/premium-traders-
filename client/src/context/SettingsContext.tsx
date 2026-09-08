import React, { createContext, useContext, useState, useEffect } from 'react';
import { ISiteSettings, INavigation } from '../types/index.js';
import { api } from '../api/endpoints.js';

interface SettingsContextType {
  settings: ISiteSettings;
  navigation: INavigation;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  refreshNavigation: () => Promise<void>;
}

const defaultSettings: ISiteSettings = {
  businessName: 'AMBROSIA ARCHITECTURAL SHOWROOM',
  tagline: 'Luxury Tiles • Exotic Granite • Fine Woodworks • Architectural Electrical',
  logo: '',
  phone: '+91 98765 43210',
  whatsapp: '+919876543210',
  email: 'sales@ambrosiashowroom.com',
  address: 'Plot 42, Architectural Boulevard, Indiranagar',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560038',
  googleMapsUrl: 'https://maps.google.com',
  openingHours: 'Mon – Sat: 9:30 AM – 8:30 PM',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  youtubeUrl: 'https://youtube.com',
  seoTitle: 'Ambrosia Showroom | Premium Tiles, Granite, Wood & Electrical Catalog',
  seoDescription: 'Explore luxury large-format tiles, exotic natural granite slabs, teak architectural doors, and minimalist designer switches.',
  footerText: 'Curating the finest building and interior materials for architects, designers, and distinguished homeowners.',
  copyrightText: '© 2026 Ambrosia Architectural Showroom. All Rights Reserved.',
};

const defaultNavigation: INavigation = {
  items: [
    { label: 'CATALOG', url: '/catalog', visible: true, displayOrder: 1 },
    { label: 'TILES', url: '/tiles', categorySlug: 'tiles', visible: true, displayOrder: 2 },
    { label: 'GRANITE & STONE', url: '/granite', categorySlug: 'granite-marble-natural-stone', visible: true, displayOrder: 3 },
    { label: 'WOODWORKS', url: '/wood', categorySlug: 'wood-works-wooden-doors-plywood', visible: true, displayOrder: 4 },
    { label: 'ELECTRICAL', url: '/electrical', categorySlug: 'electrical-products-lighting-switches', visible: true, displayOrder: 5 },
    { label: 'CONTACT', url: '/contact', visible: true, displayOrder: 6 },
  ],
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ISiteSettings>(defaultSettings);
  const [navigation, setNavigation] = useState<INavigation>(defaultNavigation);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    try {
      const res = await api.getSiteSettings();
      if (res.data.success && res.data.data) {
        setSettings(res.data.data);
      }
    } catch (e) {
      console.warn('Using default settings');
    }
  };

  const fetchNavigation = async () => {
    try {
      const res = await api.getNavigation();
      if (res.data.success && res.data.data) {
        setNavigation(res.data.data);
      }
    } catch (e) {
      console.warn('Using default navigation');
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchSettings(), fetchNavigation()]);
      setIsLoading(false);
    };
    init();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        navigation,
        isLoading,
        refreshSettings: fetchSettings,
        refreshNavigation: fetchNavigation,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
