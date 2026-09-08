import React, { useState, useEffect } from 'react';
import { Save, Phone, Globe, Shield, MapPin, ExternalLink } from 'lucide-react';
import { api } from '../../api/endpoints.js';
import { ISiteSettings } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';
import { useSettings } from '../../context/SettingsContext.js';
import { MediaUploader } from '../../components/admin/MediaUploader.js';

export const AdminSettingsPage: React.FC = () => {
  const { settings, refreshSettings } = useSettings();
  const [formData, setFormData] = useState<ISiteSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  const { success, error } = useToast();

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (field: keyof ISiteSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await api.updateSiteSettings(formData);
      if (res.data.success) {
        success('Site & Contact settings updated live across frontend!');
        await refreshSettings();
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-showroom-border">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block">
            GLOBAL CONFIGURATION
          </span>
          <h1 className="font-serif text-2xl font-bold uppercase tracking-tight text-showroom-charcoal">
            CONTACT & SITE SETTINGS
          </h1>
          <p className="text-xs text-showroom-muted mt-0.5">
            Live parameters synchronize with all customer pages, WhatsApp triggers, and footer metadata.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-showroom-charcoal hover:bg-showroom-charcoalLight text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all disabled:opacity-50 self-start sm:self-auto"
        >
          <Save className="w-4 h-4 text-showroom-bronze" />
          <span>{isSaving ? 'Saving Changes...' : 'Save All Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Identity */}
        <div className="bg-white p-6 border border-showroom-border space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-showroom-charcoal pb-2 border-b border-showroom-sand/60 flex items-center gap-2">
            <Globe className="w-4 h-4 text-showroom-bronze" />
            <span>1. Brand Identity & Headline</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                Showroom Business Name *
              </label>
              <input
                type="text"
                required
                value={formData.businessName || ''}
                onChange={(e) => handleChange('businessName', e.target.value)}
                className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none font-bold uppercase"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                Tagline / Subheading
              </label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MediaUploader
              media={formData.logo ? [formData.logo] : []}
              onChange={(imgs) => handleChange('logo', imgs[0] || '')}
              maxFiles={1}
              acceptType="image"
              label="Showroom Logo (Drag & Drop)"
            />

            <MediaUploader
              media={formData.ogImage ? [formData.ogImage] : []}
              onChange={(imgs) => handleChange('ogImage', imgs[0] || '')}
              maxFiles={1}
              acceptType="image"
              label="Social Share Image (OG Image)"
            />
          </div>
        </div>

        {/* Live Phone & WhatsApp Integration */}
        <div className="bg-white p-6 border border-showroom-border space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-showroom-charcoal pb-2 border-b border-showroom-sand/60 flex items-center gap-2">
            <Phone className="w-4 h-4 text-showroom-bronze" />
            <span>2. Direct Communication & WhatsApp Integration</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                WhatsApp Phone Number * (e.g. +91 98765 43210)
              </label>
              <input
                type="text"
                required
                value={formData.whatsapp || ''}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                placeholder="+919876543210"
                className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none font-mono"
              />
              <span className="text-[9px] text-showroom-muted mt-0.5 block">
                Powers all 1-click quote buttons across catalog & quick views.
              </span>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                Phone Display
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                Showroom Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Physical Address & Hours */}
        <div className="bg-white p-6 border border-showroom-border space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-showroom-charcoal pb-2 border-b border-showroom-sand/60 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-showroom-bronze" />
            <span>3. Flagship Location & Operating Hours</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                City, State, Pincode
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city || ''}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={formData.state || ''}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={formData.pincode || ''}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  className="bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                Opening Hours
              </label>
              <input
                type="text"
                value={formData.openingHours || ''}
                onChange={(e) => handleChange('openingHours', e.target.value)}
                placeholder="Mon – Sat: 9:30 AM – 8:30 PM"
                className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                Google Maps URL
              </label>
              <input
                type="url"
                value={formData.googleMapsUrl || ''}
                onChange={(e) => handleChange('googleMapsUrl', e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* SEO & Meta */}
        <div className="bg-white p-6 border border-showroom-border space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-showroom-charcoal pb-2 border-b border-showroom-sand/60 flex items-center gap-2">
            <Shield className="w-4 h-4 text-showroom-bronze" />
            <span>4. SEO Meta & Footer Statements</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                Meta SEO Title
              </label>
              <input
                type="text"
                value={formData.seoTitle || ''}
                onChange={(e) => handleChange('seoTitle', e.target.value)}
                className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                Meta SEO Description
              </label>
              <textarea
                rows={2}
                value={formData.seoDescription || ''}
                onChange={(e) => handleChange('seoDescription', e.target.value)}
                className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                Footer Curated Text
              </label>
              <textarea
                rows={2}
                value={formData.footerText || ''}
                onChange={(e) => handleChange('footerText', e.target.value)}
                className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-showroom-charcoal hover:bg-showroom-charcoalLight text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-showroom-bronze" />
            <span>{isSaving ? 'Updating...' : 'Save & Publish Live Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
