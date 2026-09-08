import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Video,
  Upload,
  Copy,
  Trash2,
  Search,
  Check,
  Play,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../api/endpoints.js';
import { IMediaItem } from '../../types/index.js';
import { MediaUploader } from '../../components/admin/MediaUploader.js';

export const AdminMediaLibraryPage: React.FC = () => {
  const [mediaList, setMediaList] = useState<IMediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<IMediaItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Media' },
    { id: 'hero', label: 'Hero / Banner' },
    { id: 'granite', label: 'Granite' },
    { id: 'tiles', label: 'Tiles' },
    { id: 'wood', label: 'Wood Work' },
    { id: 'electrical', label: 'Electrical' },
    { id: 'products', label: 'Products' },
    { id: 'general', label: 'General' },
  ];

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const res = await api.getMedia();
      if (res.data?.success && res.data.data) {
        setMediaList(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopyUrl = (url: string, id: string) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteMedia = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this media item?')) return;
    try {
      await api.deleteMedia(id);
      setMediaList((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error('Error deleting media:', err);
      alert('Failed to delete media item.');
    }
  };

  // Filter items
  const filteredList = mediaList.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesType =
      filterType === 'all' ||
      (filterType === 'video' && item.isVideo) ||
      (filterType === 'image' && !item.isVideo);
    const matchesSearch =
      !search ||
      item.filename?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-showroom-charcoalLight/60 pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block">
            ASSET MANAGEMENT
          </span>
          <h1 className="font-serif text-2xl font-bold uppercase tracking-tight text-white">
            Media Library
          </h1>
          <p className="text-xs text-white/60 mt-1">
            Central repository for drag-and-drop images & videos across the showroom website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMedia}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 bg-showroom-bronze hover:bg-showroom-bronzeHover text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Media</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-[#171615] border border-showroom-charcoalLight/60 p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search filename or tag..."
              className="w-full bg-[#201F1D] border border-showroom-charcoalLight text-white text-xs pl-9 pr-3 py-2 focus:outline-none focus:border-showroom-bronze"
            />
          </div>

          {/* Media Type Toggle */}
          <div className="flex items-center gap-1 bg-[#201F1D] p-1 border border-showroom-charcoalLight">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                filterType === 'all' ? 'bg-showroom-bronze text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setFilterType('image')}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                filterType === 'image' ? 'bg-showroom-bronze text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Images</span>
            </button>
            <button
              onClick={() => setFilterType('video')}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                filterType === 'video' ? 'bg-showroom-bronze text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Videos</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-showroom-charcoalLight/40">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-showroom-gold text-black font-bold'
                  : 'bg-[#201F1D] text-white/70 hover:text-white border border-showroom-charcoalLight'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Media Assets */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-2 border-showroom-charcoalLight border-t-showroom-bronze rounded-full animate-spin mb-3" />
          <span className="text-xs text-white/50 uppercase font-mono tracking-widest">
            Loading Media Assets...
          </span>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-showroom-charcoalLight bg-[#171615] p-8">
          <ImageIcon className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <h3 className="text-sm font-bold uppercase text-white tracking-wider mb-1">No Media Found</h3>
          <p className="text-xs text-white/50 mb-4 max-w-sm mx-auto">
            Drag and drop images or video files to populate your showroom media library.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-showroom-bronze hover:bg-showroom-bronzeHover text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload First Asset</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredList.map((item) => (
            <div
              key={item._id}
              className="group bg-[#171615] border border-showroom-charcoalLight/60 hover:border-showroom-gold transition-all duration-200 flex flex-col justify-between overflow-hidden relative shadow-md"
            >
              {/* Media Thumbnail */}
              <div
                className="relative aspect-square bg-[#0C0B0A] overflow-hidden cursor-pointer flex items-center justify-center"
                onClick={() => setPreviewMedia(item)}
              >
                {item.isVideo ? (
                  <div className="w-full h-full relative group">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      preload="metadata"
                      muted
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                      <div className="w-9 h-9 rounded-full bg-black/60 border border-white/30 flex items-center justify-center text-white">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                )}

                {/* Badge for Video or Category */}
                <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                  {item.isVideo && (
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 bg-red-600 text-white shadow">
                      VIDEO
                    </span>
                  )}
                  {item.category && (
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 bg-black/70 text-showroom-gold border border-white/10">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Asset Info & Controls */}
              <div className="p-2.5 bg-[#171615] border-t border-showroom-charcoalLight/40 flex flex-col justify-between gap-1.5">
                <span className="text-[11px] font-mono text-white/80 truncate block" title={item.filename}>
                  {item.filename}
                </span>

                <div className="flex items-center justify-between pt-1 border-t border-showroom-charcoalLight/30">
                  <button
                    onClick={() => handleCopyUrl(item.url, item._id)}
                    className="p-1 text-white/60 hover:text-showroom-gold hover:bg-white/5 transition-colors flex items-center gap-1 text-[10px] font-mono"
                    title="Copy direct URL"
                  >
                    {copiedId === item._id ? (
                      <>
                        <Check className="w-3 h-3 text-green-400" />
                        <span className="text-green-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDeleteMedia(item._id)}
                    className="p-1 text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors"
                    title="Delete media"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal with Drag & Drop */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1918] border border-showroom-charcoalLight max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-showroom-charcoalLight/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze">
                  DRAG & DROP
                </span>
                <h3 className="font-serif text-lg font-bold uppercase text-white">
                  Upload Media Asset
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-white/50 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <MediaUploader
              media={[]}
              onChange={() => {
                fetchMedia();
                setShowUploadModal(false);
              }}
              maxFiles={10}
              acceptType="all"
              label="Select or Drop Image / MP4 Video"
              hint="Supports JPG, PNG, WEBP, and MP4 videos up to 100MB."
            />

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1918] border border-showroom-charcoalLight max-w-3xl w-full p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-showroom-charcoalLight/60 pb-2">
              <span className="text-xs font-mono font-bold text-white truncate max-w-md">
                {previewMedia.filename}
              </span>
              <button
                onClick={() => setPreviewMedia(null)}
                className="text-white/50 hover:text-white text-base font-bold"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              {previewMedia.isVideo ? (
                <video
                  src={previewMedia.url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={previewMedia.url}
                  alt={previewMedia.filename}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-white/60 truncate max-w-sm">
                {previewMedia.url}
              </span>
              <button
                onClick={() => handleCopyUrl(previewMedia.url, previewMedia._id)}
                className="px-3 py-1.5 bg-showroom-bronze hover:bg-showroom-bronzeHover text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy URL</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
