import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Eye, EyeOff } from 'lucide-react';
import { api } from '../../api/endpoints.js';
import { INavItem } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';
import { useSettings } from '../../context/SettingsContext.js';

export const AdminNavigationPage: React.FC = () => {
  const [items, setItems] = useState<INavItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { success, error } = useToast();
  const { refreshNavigation } = useSettings();

  const defaultNavItems = [
    { label: 'CATALOG', url: '/catalog', visible: true, displayOrder: 1 },
    { label: 'TILES', url: '/tiles', categorySlug: 'tiles', visible: true, displayOrder: 2 },
    { label: 'GRANITE & STONE', url: '/granite', categorySlug: 'granite-marble-natural-stone', visible: true, displayOrder: 3 },
    { label: 'WOODWORKS', url: '/wood', categorySlug: 'wood-works-wooden-doors-plywood', visible: true, displayOrder: 4 },
    { label: 'ELECTRICAL', url: '/electrical', categorySlug: 'electrical-products-lighting-switches', visible: true, displayOrder: 5 },
    { label: 'CONTACT', url: '/contact', visible: true, displayOrder: 6 },
  ];

  const fetchNav = async () => {
    setIsLoading(true);
    try {
      const res = await api.getNavigation();
      if (res.data && res.data.success && res.data.data && res.data.data.items) {
        setItems(res.data.data.items || []);
      } else {
        setItems(defaultNavItems);
      }
    } catch (err) {
      setItems(defaultNavItems);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNav();
  }, []);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;

    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setItems(updated.map((item, i) => ({ ...item, displayOrder: i + 1 })));
  };

  const toggleVisibility = (index: number) => {
    const updated = [...items];
    updated[index].visible = !updated[index].visible;
    setItems(updated);
  };

  const handleUpdateField = (index: number, field: keyof INavItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        label: 'NEW LINK',
        url: '/catalog',
        visible: true,
        displayOrder: items.length + 1,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await api.updateNavigation(items);
      if (res.data.success) {
        success('Header navigation updated live!');
        await refreshNavigation();
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to save navigation');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-showroom-border">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block">
            HEADER & MENU ARCHITECTURE
          </span>
          <h1 className="font-serif text-2xl font-bold uppercase tracking-tight text-showroom-charcoal">
            NAVIGATION MENU ({items.length})
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={addItem}
            className="px-3.5 py-2 bg-showroom-sand/50 hover:bg-showroom-sand text-showroom-charcoal text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-showroom-bronze" />
            <span>Add Menu Item</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-showroom-charcoal hover:bg-showroom-charcoalLight text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-showroom-bronze" />
            <span>{isSaving ? 'Saving...' : 'Save Navigation'}</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-6 border border-showroom-border space-y-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-3 bg-showroom-bg/60 border border-showroom-border flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="font-mono text-xs font-bold text-showroom-bronze">
                0{idx + 1}
              </span>
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleUpdateField(idx, 'label', e.target.value)}
                placeholder="Link Label"
                className="bg-white border border-showroom-border px-3 py-1.5 text-xs text-showroom-charcoal focus:outline-none font-bold uppercase w-36"
              />
              <input
                type="text"
                value={item.url}
                onChange={(e) => handleUpdateField(idx, 'url', e.target.value)}
                placeholder="/tiles or https://..."
                className="bg-white border border-showroom-border px-3 py-1.5 text-xs text-showroom-charcoal focus:outline-none font-mono flex-1 sm:w-56"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => moveItem(idx, 'up')}
                disabled={idx === 0}
                className="p-1.5 bg-showroom-sand/50 text-showroom-charcoal disabled:opacity-30"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => moveItem(idx, 'down')}
                disabled={idx === items.length - 1}
                className="p-1.5 bg-showroom-sand/50 text-showroom-charcoal disabled:opacity-30"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => toggleVisibility(idx)}
                className={`p-1.5 rounded text-xs font-bold ${
                  item.visible ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {item.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => removeItem(idx)}
                className="p-1.5 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
