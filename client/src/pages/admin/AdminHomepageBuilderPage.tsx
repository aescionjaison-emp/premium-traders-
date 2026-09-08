import React, { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  LayoutTemplate,
  Layers,
  Film,
  Sliders,
  Compass,
} from 'lucide-react';
import { api } from '../../api/endpoints.js';
import {
  IHomepageConfig,
  IHomepageSection,
  IHeroSlide,
  IMaterialsLifeSlide,
  ICategoryChapters,
  IExploreMaterialItem,
} from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';
import { MediaUploader } from '../../components/admin/MediaUploader.js';
import { DEFAULT_HOMEPAGE_CONFIG } from '../../data/showroomCatalogData.js';

export const AdminHomepageBuilderPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hero' | 'materials_life' | 'chapters' | 'explore' | 'flow'>('hero');
  const [config, setConfig] = useState<IHomepageConfig>(DEFAULT_HOMEPAGE_CONFIG as any);
  const [sections, setSections] = useState<IHomepageSection[]>(DEFAULT_HOMEPAGE_CONFIG.sections);
  const [heroSlides, setHeroSlides] = useState<IHeroSlide[]>(DEFAULT_HOMEPAGE_CONFIG.heroSlides);
  const [materialsLife, setMaterialsLife] = useState<IMaterialsLifeSlide[]>(DEFAULT_HOMEPAGE_CONFIG.materialsComeToLife);
  const [categoryChapters, setCategoryChapters] = useState<ICategoryChapters>(DEFAULT_HOMEPAGE_CONFIG.categoryChapters as any);
  const [exploreMaterials, setExploreMaterials] = useState<IExploreMaterialItem[]>(DEFAULT_HOMEPAGE_CONFIG.exploreMaterials);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { success, error } = useToast();

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const res = await api.getHomepageConfig();
      const d = (res.data?.success && res.data?.data) ? res.data.data : DEFAULT_HOMEPAGE_CONFIG;
      setConfig(d as any);

      if (d.sections && d.sections.length > 0) {
        setSections([...d.sections].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
      } else {
        setSections(DEFAULT_HOMEPAGE_CONFIG.sections);
      }

      setHeroSlides((d.heroSlides && d.heroSlides.length > 0) ? d.heroSlides : DEFAULT_HOMEPAGE_CONFIG.heroSlides);

      if (d.materialsComeToLife && d.materialsComeToLife.length > 0) {
        const normalized = d.materialsComeToLife.map((s: any, i: number) => ({
          num: s.num || `0${i + 1}`,
          category: s.category || 'MATERIAL',
          name: s.name || s.headline || 'Natural Stone',
          desc: s.desc || s.tagline || '',
          image: s.image || s.imageTexture || s.textureImage || '',
          textureImage: s.textureImage || s.imageTexture || s.image || '',
          highlight: s.highlight || s.imageSpace || '',
          accent: s.accent || '#D4AF37',
        }));
        setMaterialsLife(normalized);
      } else {
        setMaterialsLife(DEFAULT_HOMEPAGE_CONFIG.materialsComeToLife);
      }

      if (d.categoryChapters) {
        const normChapters: any = {};
        (['granite', 'tiles', 'wood', 'electrical'] as const).forEach((k) => {
          const ch = (d.categoryChapters as any)[k] || (DEFAULT_HOMEPAGE_CONFIG.categoryChapters as any)[k] || {};
          normChapters[k] = {
            id: ch.id || k,
            num: ch.num || ch.number || '01',
            name: ch.name || ch.heading || 'Collection',
            tagline: ch.tagline || ch.subLabel || '',
            desc: ch.desc || '',
            coverImage: ch.coverImage || ch.image || '',
            textureImage: ch.textureImage || ch.image || '',
            spaceImage: ch.spaceImage || '',
            finishes: ch.finishes || [],
          };
        });
        setCategoryChapters(normChapters);
      } else {
        setCategoryChapters(DEFAULT_HOMEPAGE_CONFIG.categoryChapters as any);
      }

      if (d.exploreMaterials && d.exploreMaterials.length > 0) {
        setExploreMaterials(d.exploreMaterials);
      } else {
        setExploreMaterials(DEFAULT_HOMEPAGE_CONFIG.exploreMaterials);
      }
    } catch (err) {
      console.warn('Failed to load homepage config, fallback to default:', err);
      setConfig(DEFAULT_HOMEPAGE_CONFIG as any);
      setSections(DEFAULT_HOMEPAGE_CONFIG.sections);
      setHeroSlides(DEFAULT_HOMEPAGE_CONFIG.heroSlides);
      setMaterialsLife(DEFAULT_HOMEPAGE_CONFIG.materialsComeToLife);
      setCategoryChapters(DEFAULT_HOMEPAGE_CONFIG.categoryChapters as any);
      setExploreMaterials(DEFAULT_HOMEPAGE_CONFIG.exploreMaterials);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const moveSection = (index: number, direction: 'up' | 'down') => {
    setSections((prev) => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated.map((s, i) => ({ ...s, displayOrder: i + 1 }));
    });
  };

  const toggleSectionVisibility = (index: number) => {
    setSections((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], visible: !updated[index].visible };
      return updated;
    });
  };

  const updateHeroSlide = (index: number, field: keyof IHeroSlide, value: any) => {
    setHeroSlides((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addHeroSlide = () => {
    setHeroSlides((prev) => [
      ...prev,
      {
        smallLabel: 'Premium Materials',
        heading: 'Beautiful Spaces.',
        subheading: '',
        image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=2400&q=85',
        videoUrl: '/videos/hero.mp4',
        ctaText: 'Explore Collection',
        ctaLink: '/catalog',
        badge: 'NEW SPECIFICATION',
      },
    ]);
  };

  const removeHeroSlide = (index: number) => {
    if (heroSlides.length <= 1) {
      error('At least one hero slide is required');
      return;
    }
    setHeroSlides((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMaterialsSlide = (index: number, field: keyof IMaterialsLifeSlide, value: any) => {
    setMaterialsLife((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const updateChapter = (key: keyof ICategoryChapters, field: string, value: any) => {
    setCategoryChapters((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const updateExploreItem = (index: number, field: keyof IExploreMaterialItem, value: any) => {
    setExploreMaterials((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const singleHeroSlide = heroSlides[0] || {
        smallLabel: 'Premium Materials',
        heading: 'Beautiful Spaces.',
        subheading: '',
        image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=2400&q=85',
        videoUrl: '/videos/hero.mp4',
        ctaText: 'Explore Collection',
        ctaLink: '/catalog',
        badge: '',
      };

      const payload: Partial<IHomepageConfig> = {
        sections,
        heroSlides: [singleHeroSlide],
        materialsComeToLife: materialsLife,
        categoryChapters,
        exploreMaterials,
      };

      const res = await api.updateHomepageConfig(payload);
      if (res.data.success) {
        success('Homepage layout & visual chapters published live!');
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to save homepage builder config');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-xs uppercase font-bold tracking-widest text-showroom-muted">
        Loading Homepage Builder...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-showroom-border">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block">
            LIVE SHOWROOM EXPERIENCE BUILDER
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-tight text-showroom-charcoal">
            Homepage Control Center
          </h1>
          <p className="text-xs text-showroom-muted mt-0.5">
            Manage background videos, pinned scroll stories, visual chapters, and live section order.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2.5 bg-white hover:bg-showroom-sand border border-showroom-border text-showroom-charcoal text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-showroom-bronze" />
            <span>Preview Live Site</span>
          </a>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-5 py-2.5 bg-showroom-charcoal hover:bg-showroom-charcoalLight text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-showroom-bronze" />
            <span>{isSaving ? 'Publishing Live...' : 'Publish Live Changes'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-showroom-border bg-white p-1.5 shadow-subtle">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${
            activeTab === 'hero' ? 'bg-showroom-charcoal text-white' : 'text-showroom-charcoal hover:bg-showroom-sand/60'
          }`}
        >
          <Film className="w-4 h-4 text-showroom-bronze" />
          <span>1. Hero Video & Poster</span>
        </button>

        <button
          onClick={() => setActiveTab('materials_life')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${
            activeTab === 'materials_life' ? 'bg-showroom-charcoal text-white' : 'text-showroom-charcoal hover:bg-showroom-sand/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-showroom-bronze" />
          <span>2. Pinned Transformation (01–04)</span>
        </button>

        <button
          onClick={() => setActiveTab('chapters')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${
            activeTab === 'chapters' ? 'bg-showroom-charcoal text-white' : 'text-showroom-charcoal hover:bg-showroom-sand/60'
          }`}
        >
          <Layers className="w-4 h-4 text-showroom-bronze" />
          <span>3. Visual Chapters (Granite/Tiles/Wood/Elec)</span>
        </button>

        <button
          onClick={() => setActiveTab('explore')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${
            activeTab === 'explore' ? 'bg-showroom-charcoal text-white' : 'text-showroom-charcoal hover:bg-showroom-sand/60'
          }`}
        >
          <Compass className="w-4 h-4 text-showroom-bronze" />
          <span>4. Horizontal Glide Cards</span>
        </button>

        <button
          onClick={() => setActiveTab('flow')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${
            activeTab === 'flow' ? 'bg-showroom-charcoal text-white' : 'text-showroom-charcoal hover:bg-showroom-sand/60'
          }`}
        >
          <Sliders className="w-4 h-4 text-showroom-bronze" />
          <span>5. Section Flow & Toggles</span>
        </button>
      </div>

      {/* TAB 1: HERO SLIDE CMS (SINGLE LOOPING VIDEO SLIDE) */}
      {activeTab === 'hero' && (
        <div className="bg-white p-6 border border-showroom-border space-y-6 shadow-subtle">
          <div className="pb-3 border-b border-showroom-sand/60">
            <h2 className="text-xs font-bold uppercase tracking-widest text-showroom-charcoal">
              Cinematic Architectural Hero Video Loop & Poster
            </h2>
            <p className="text-[11px] text-showroom-muted mt-0.5">
              Upload your continuous looping video (.mp4) and high-res fallback poster image. The video automatically loops seamlessly.
            </p>
          </div>

          {heroSlides.slice(0, 1).map((slide, idx) => (
            <div
              key={idx}
              className="p-5 border border-showroom-border bg-showroom-bg/60 space-y-4 shadow-subtle"
            >
              <div className="flex items-center justify-between pb-2 border-b border-showroom-border">
                <span className="text-xs font-bold uppercase tracking-widest text-showroom-bronze">
                  Hero Video Slide Configuration
                </span>
                <span className="text-[10px] font-mono text-showroom-muted">
                  [ CONTINUOUS SEAMLESS LOOP ]
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                    Small Subtitle Tag
                  </label>
                  <input
                    type="text"
                    value={slide.smallLabel}
                    onChange={(e) => updateHeroSlide(0, 'smallLabel', e.target.value)}
                    placeholder="e.g. Premium Materials"
                    className="w-full bg-white border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                    Badge / Tag (Optional)
                  </label>
                  <input
                    type="text"
                    value={slide.badge || ''}
                    onChange={(e) => updateHeroSlide(0, 'badge', e.target.value)}
                    placeholder="e.g. NEW SPECIFICATION"
                    className="w-full bg-white border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                  Main Heading (Max ~2-3 Words Recommended)
                </label>
                <input
                  type="text"
                  value={slide.heading}
                  onChange={(e) => updateHeroSlide(0, 'heading', e.target.value)}
                  placeholder="e.g. Beautiful Spaces."
                  className="w-full bg-white border border-showroom-border px-3 py-2 text-sm font-bold text-showroom-charcoal focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={slide.ctaText}
                    onChange={(e) => updateHeroSlide(0, 'ctaText', e.target.value)}
                    placeholder="e.g. Explore Collection"
                    className="w-full bg-white border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                    Button Link Destination
                  </label>
                  <input
                    type="text"
                    value={slide.ctaLink}
                    onChange={(e) => updateHeroSlide(0, 'ctaLink', e.target.value)}
                    placeholder="e.g. /catalog"
                    className="w-full bg-white border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Drag & Drop Hero Media */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
                <div>
                  <MediaUploader
                    media={slide.videoUrl ? [slide.videoUrl] : []}
                    onChange={(files) => updateHeroSlide(0, 'videoUrl', files[0] || '')}
                    maxFiles={1}
                    acceptType="video"
                    label="Background Video Loop (.mp4, drag & drop)"
                    hint="Seamless continuous loop video (without audio)"
                  />
                </div>

                <div>
                  <MediaUploader
                    media={slide.image ? [slide.image] : []}
                    onChange={(files) => updateHeroSlide(0, 'image', files[0] || '')}
                    maxFiles={1}
                    acceptType="image"
                    label="Hero Poster / Fallback Image (drag & drop)"
                    hint="High-resolution backdrop shown when video loads or on mobile"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: PINNED TRANSFORMATION STORY ("Materials Come To Life") */}
      {activeTab === 'materials_life' && (
        <div className="bg-white p-6 border border-showroom-border space-y-6 shadow-subtle">
          <div className="border-b border-showroom-sand/60 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-showroom-charcoal">
              Pinned Transformation Story: "Materials Come to Life" (4 Slides)
            </h2>
            <p className="text-[11px] text-showroom-muted mt-0.5">
              Controls the sticky pinned viewport scroll progression (01 Granite, 02 Tiles, 03 Wood, 04 Electrical).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {materialsLife.map((slide, idx) => (
              <div
                key={idx}
                className="p-5 border border-showroom-border bg-showroom-bg/60 space-y-4 shadow-subtle"
              >
                <div className="flex items-center justify-between pb-2 border-b border-showroom-border">
                  <span className="text-xs font-mono font-bold text-showroom-bronze">
                    {slide.num} / 04 — {slide.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                      Discipline Category
                    </label>
                    <input
                      type="text"
                      value={slide.category}
                      onChange={(e) => updateMaterialsSlide(idx, 'category', e.target.value)}
                      className="w-full bg-white border border-showroom-border px-3 py-1.5 text-xs text-showroom-charcoal focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                      Display Title
                    </label>
                    <input
                      type="text"
                      value={slide.name}
                      onChange={(e) => updateMaterialsSlide(idx, 'name', e.target.value)}
                      className="w-full bg-white border border-showroom-border px-3 py-1.5 text-xs text-showroom-charcoal focus:outline-none font-bold"
                    />
                  </div>
                </div>

                {/* Texture Image & Space Image Uploaders */}
                <div className="space-y-3 pt-2">
                  <MediaUploader
                    media={slide.textureImage ? [slide.textureImage] : slide.image ? [slide.image] : []}
                    onChange={(files) => {
                      updateMaterialsSlide(idx, 'textureImage', files[0] || '');
                      if (!slide.image) updateMaterialsSlide(idx, 'image', files[0] || '');
                    }}
                    maxFiles={1}
                    acceptType="image"
                    label="Material Texture Image (Drag & Drop)"
                    hint="Close-up macro stone / wood grain / switch texture"
                  />

                  <MediaUploader
                    media={slide.highlight ? [slide.highlight] : []}
                    onChange={(files) => updateMaterialsSlide(idx, 'highlight', files[0] || '')}
                    maxFiles={1}
                    acceptType="image"
                    label="Finished Living Space Image (Drag & Drop)"
                    hint="Architectural interior context where the material is installed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: VISUAL CHAPTERS CMS */}
      {activeTab === 'chapters' && (
        <div className="bg-white p-6 border border-showroom-border space-y-6 shadow-subtle">
          <div className="border-b border-showroom-sand/60 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-showroom-charcoal">
              Category Visual Chapters (70% Visual Canvas Imagery)
            </h2>
            <p className="text-[11px] text-showroom-muted mt-0.5">
              Manage the large editorial hero slabs and architectural visuals for each material chapter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(['granite', 'tiles', 'wood', 'electrical'] as (keyof ICategoryChapters)[]).map((catKey) => {
              const ch = categoryChapters[catKey];
              return (
                <div
                  key={catKey}
                  className="p-5 border border-showroom-border bg-showroom-bg/60 space-y-4 shadow-subtle"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-showroom-border">
                    <span className="text-xs font-mono font-bold text-showroom-bronze uppercase">
                      {ch.num} / {ch.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                        Chapter Title
                      </label>
                      <input
                        type="text"
                        value={ch.name}
                        onChange={(e) => updateChapter(catKey, 'name', e.target.value)}
                        className="w-full bg-white border border-showroom-border px-3 py-1.5 text-xs text-showroom-charcoal focus:outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                        Tagline / Subheading
                      </label>
                      <input
                        type="text"
                        value={ch.tagline}
                        onChange={(e) => updateChapter(catKey, 'tagline', e.target.value)}
                        className="w-full bg-white border border-showroom-border px-3 py-1.5 text-xs text-showroom-charcoal focus:outline-none"
                      />
                    </div>
                  </div>

                  <MediaUploader
                    media={ch.coverImage ? [ch.coverImage] : []}
                    onChange={(files) => updateChapter(catKey, 'coverImage', files[0] || '')}
                    maxFiles={1}
                    acceptType="image"
                    label="Large Hero Editorial Cover Visual (Drag & Drop)"
                    hint="High-resolution monumental portrait slab or interior setting"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: EXPLORE MATERIALS GLIDE CARDS */}
      {activeTab === 'explore' && (
        <div className="bg-white p-6 border border-showroom-border space-y-6 shadow-subtle">
          <div className="border-b border-showroom-sand/60 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-showroom-charcoal">
              Horizontal Glide Cards: "Explore Materials" (6 Cards)
            </h2>
            <p className="text-[11px] text-showroom-muted mt-0.5">
              Visual showcase cards for the desktop horizontal glide stream.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {exploreMaterials.map((card, idx) => (
              <div
                key={idx}
                className="p-4 border border-showroom-border bg-showroom-bg/60 space-y-3 shadow-subtle"
              >
                <div className="flex items-center justify-between pb-1 border-b border-showroom-border">
                  <span className="text-[11px] font-mono font-bold text-showroom-bronze">
                    0{idx + 1} — {card.category}
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-showroom-charcoal">
                      Product / Material Short Name (Max 2 Words)
                    </label>
                    <input
                      type="text"
                      value={card.name}
                      onChange={(e) => updateExploreItem(idx, 'name', e.target.value)}
                      className="w-full bg-white border border-showroom-border px-2.5 py-1.5 text-xs text-showroom-charcoal focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold text-showroom-charcoal">
                      Category Tag
                    </label>
                    <input
                      type="text"
                      value={card.category}
                      onChange={(e) => updateExploreItem(idx, 'category', e.target.value)}
                      className="w-full bg-white border border-showroom-border px-2.5 py-1.5 text-xs text-showroom-charcoal focus:outline-none"
                    />
                  </div>
                </div>

                <MediaUploader
                  media={card.image ? [card.image] : []}
                  onChange={(files) => updateExploreItem(idx, 'image', files[0] || '')}
                  maxFiles={1}
                  acceptType="image"
                  label="Card Showcase Image"
                  hint="Drag and drop high-res material image"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SECTION ORDER & VISIBILITY MANAGER */}
      {activeTab === 'flow' && (
        <div className="bg-white p-6 border border-showroom-border space-y-4 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-showroom-sand/60">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-showroom-charcoal">
                Showroom Flow Sequence & Visibility Toggles
              </h2>
              <p className="text-[11px] text-showroom-muted mt-0.5">
                Reorder or disable sections to dynamically reflow the live customer homepage.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {sections.map((section, idx) => (
              <div
                key={section.id}
                className={`p-3.5 border flex items-center justify-between gap-4 transition-colors ${
                  section.visible
                    ? 'bg-white border-showroom-border hover:border-showroom-charcoal'
                    : 'bg-gray-50/70 border-dashed border-gray-300 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs font-bold text-showroom-bronze w-6">
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-xs font-bold uppercase text-showroom-charcoal truncate">
                      {section.title}
                    </h3>
                    <span className="text-[10px] font-mono text-showroom-muted">
                      ID: {section.id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Move Up */}
                  <button
                    onClick={() => moveSection(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 bg-showroom-sand/40 hover:bg-showroom-sand text-showroom-charcoal disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={() => moveSection(idx, 'down')}
                    disabled={idx === sections.length - 1}
                    className="p-1.5 bg-showroom-sand/40 hover:bg-showroom-sand text-showroom-charcoal disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Visibility */}
                  <button
                    onClick={() => toggleSectionVisibility(idx)}
                    className={`px-2.5 py-1 text-xs font-bold uppercase flex items-center gap-1.5 transition-colors ${
                      section.visible
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                    title={section.visible ? 'Visible on Homepage' : 'Hidden'}
                  >
                    {section.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline-block text-[10px]">
                      {section.visible ? 'Active' : 'Hidden'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
