import React from 'react';
import { MediaUploader } from './MediaUploader.js';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
  acceptType?: 'all' | 'image' | 'video';
  hint?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images = [],
  onChange,
  maxImages = 8,
  label = 'Media Gallery',
  acceptType = 'all',
  hint,
}) => {
  return (
    <MediaUploader
      media={images}
      onChange={onChange}
      maxFiles={maxImages}
      label={label}
      acceptType={acceptType}
      hint={hint}
    />
  );
};
