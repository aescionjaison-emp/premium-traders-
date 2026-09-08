import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  Star,
  Link as LinkIcon,
  Loader2,
  Film,
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../../api/endpoints.js';
import { useToast } from '../../context/ToastContext.js';

interface MediaUploaderProps {
  media: string[];
  onChange: (media: string[]) => void;
  maxFiles?: number;
  label?: string;
  acceptType?: 'all' | 'image' | 'video';
  hint?: string;
}

export const isVideoUrl = (url: string): boolean => {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.ogg') ||
    lower.endsWith('.mov') ||
    lower.includes('mixkit.co/videos') ||
    lower.includes('/video/upload/') ||
    lower.includes('youtube.com') ||
    lower.includes('vimeo.com')
  );
};

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  media = [],
  onChange,
  maxFiles = 8,
  label = 'Media Gallery (Images & Videos)',
  acceptType = 'all',
  hint,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { success, error } = useToast();

  const allowedMime =
    acceptType === 'image'
      ? 'image/jpeg,image/png,image/webp,image/jpg,image/svg+xml'
      : acceptType === 'video'
      ? 'video/mp4,video/webm,video/ogg,video/quicktime'
      : 'image/jpeg,image/png,image/webp,image/jpg,image/svg+xml,video/mp4,video/webm,video/ogg,video/quicktime';

  const processUploadedFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    if (maxFiles > 1 && media.length + files.length > maxFiles) {
      error(`Maximum ${maxFiles} items allowed`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      setUploadProgress(50);
      const res = await api.uploadMultipleImages(formData);
      setUploadProgress(90);

      if (res.data.success && res.data.urls && res.data.urls.length > 0) {
        if (maxFiles === 1) {
          // Replace single file
          onChange([res.data.urls[res.data.urls.length - 1]]);
        } else {
          // Append up to maxFiles
          const combined = [...media, ...res.data.urls].slice(0, maxFiles);
          onChange(combined);
        }
        success(`${res.data.urls.length} media file(s) processed`);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to upload media files');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processUploadedFiles(e.target.files);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDraggingOver) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    if (isUploading) return;
    if (maxFiles > 1 && media.length >= maxFiles) return;

    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files.length > 0) {
      processUploadedFiles(dt.files);
    }
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    if (maxFiles === 1) {
      onChange([manualUrl.trim()]);
    } else {
      if (media.length >= maxFiles) {
        error(`Maximum ${maxFiles} items allowed`);
        return;
      }
      onChange([...media, manualUrl.trim()]);
    }
    setManualUrl('');
    setShowUrlInput(false);
    success('Media URL updated');
  };

  const handleRemove = (index: number) => {
    const updated = media.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const selected = media[index];
    const rest = media.filter((_, i) => i !== index);
    onChange([selected, ...rest]);
    success('Set as primary cover media');
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= media.length) return;

    const updated = [...media];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Label and Link Action */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-[11px] uppercase font-bold tracking-widest text-showroom-charcoal">
            {label} ({media.length}/{maxFiles})
          </label>
          {hint && <p className="text-[10px] text-showroom-muted mt-0.5">{hint}</p>}
        </div>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] font-bold uppercase tracking-wider text-showroom-bronze hover:underline flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Close Direct URL' : 'Add Web Image/Video URL'}</span>
        </button>
      </div>

      {/* Manual URL Input Box */}
      {showUrlInput && (
        <div className="flex gap-2 p-3 bg-showroom-sand/30 border border-showroom-border rounded-sm">
          <input
            type="url"
            placeholder="Paste direct URL (e.g. https://images.unsplash.com/... or https://.../video.mp4)"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="flex-1 bg-white border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="px-4 py-2 bg-showroom-charcoal text-white text-xs font-bold uppercase tracking-wider hover:bg-showroom-charcoalLight transition-colors"
          >
            Add URL
          </button>
        </div>
      )}

      {/* Interactive Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed p-7 text-center cursor-pointer transition-all duration-200 rounded-sm select-none ${
          isDraggingOver
            ? 'border-showroom-bronze bg-showroom-sand/60 scale-[1.01] shadow-lg ring-2 ring-showroom-bronze/30'
            : 'border-showroom-border/80 hover:border-showroom-charcoal bg-white/80 hover:bg-white'
        } ${isUploading || (maxFiles > 1 && media.length >= maxFiles) ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={allowedMime}
          onChange={handleFileInputChange}
          disabled={isUploading || (maxFiles > 1 && media.length >= maxFiles)}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center pointer-events-none">
          {isUploading ? (
            <div className="py-2 flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-showroom-bronze animate-spin mb-2" />
              <span className="text-xs font-bold uppercase tracking-wider text-showroom-charcoal">
                Optimizing & Processing Media ({uploadProgress}%)...
              </span>
              <span className="text-[10px] text-showroom-muted mt-1">
                Please hold while high-res images and video streams are stored
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-full bg-showroom-sand/60 flex items-center justify-center text-showroom-bronze">
                  {acceptType === 'video' ? (
                    <Film className="w-4 h-4" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                </div>
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-showroom-charcoal">
                {isDraggingOver
                  ? 'Drop Media Files Here to Upload!'
                  : 'Drag & Drop Images or Videos here, or Click to Browse'}
              </span>

              <div className="flex items-center gap-3 text-[10px] text-showroom-muted mt-1.5 font-mono">
                <span className="flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-showroom-bronze" /> JPG, PNG, WEBP, SVG
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Film className="w-3 h-3 text-showroom-bronze" /> MP4, WEBM, MOV
                </span>
                <span>•</span>
                <span>Up to 100MB</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Uploaded Media Thumbnails / Video Previews Strip */}
      {media.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          {media.map((url, idx) => {
            const isVideo = isVideoUrl(url);

            return (
              <div
                key={idx}
                className="relative aspect-[4/5] bg-[#11100F] border border-showroom-border group overflow-hidden rounded-sm shadow-subtle flex flex-col justify-between"
              >
                {/* Visual Viewport */}
                <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                  {isVideo ? (
                    <div className="relative w-full h-full">
                      <video
                        src={url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1.5 right-1.5 bg-black/80 text-showroom-gold text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 border border-white/10 flex items-center gap-1">
                        <Film className="w-2.5 h-2.5" /> Video
                      </span>
                    </div>
                  ) : (
                    <img
                      src={url}
                      alt={`Media ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  {/* Primary Cover Badge */}
                  {idx === 0 && (
                    <span className="absolute top-1.5 left-1.5 bg-showroom-charcoal text-white text-[8px] font-bold uppercase px-1.5 py-0.5 tracking-wider border border-white/15">
                      Cover
                    </span>
                  )}
                </div>

                {/* Floating Hover Controls Overlay */}
                <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold text-white/70">
                      0{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="p-1 bg-red-800/90 text-white hover:bg-red-700 transition-colors rounded-sm"
                      title="Remove Item"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-1.5">
                    {/* Move Left */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'left')}
                      className="p-1 bg-white/20 text-white hover:bg-white hover:text-black transition-colors disabled:opacity-20 rounded-sm"
                      title="Move Left"
                    >
                      <ArrowLeft className="w-3 h-3" />
                    </button>

                    {/* Set as Primary */}
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(idx)}
                        className="p-1 bg-showroom-bronze text-white hover:bg-showroom-gold hover:text-black transition-colors rounded-sm"
                        title="Set as Primary Cover"
                      >
                        <Star className="w-3 h-3" />
                      </button>
                    )}

                    {/* Move Right */}
                    <button
                      type="button"
                      disabled={idx === media.length - 1}
                      onClick={() => handleMove(idx, 'right')}
                      className="p-1 bg-white/20 text-white hover:bg-white hover:text-black transition-colors disabled:opacity-20 rounded-sm"
                      title="Move Right"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="truncate text-[8px] font-mono text-white/60 text-center">
                    {url.split('/').pop() || 'media'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
