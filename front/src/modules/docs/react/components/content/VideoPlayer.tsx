"use client";
import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';

interface VideoPlayerProps {
  src?: string;
  poster?: string;
  title: string;
  fallbackMessage?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title,
  fallbackMessage,
}) => {
  const [isUnavailable, setIsUnavailable] = useState(false);

  if (!src || isUnavailable) {
    return (
      <div className="aspect-video bg-luminous-bg-secondary rounded-xl border border-luminous-gold-border flex flex-col items-center justify-center p-8">
        <PlayCircle className="w-16 h-16 text-luminous-gold mb-4" />
        <p className="text-luminous-text-primary font-display text-lg">
          {title}
        </p>
        <p className="text-luminous-text-secondary text-sm mt-2">
          {fallbackMessage || 'Vidéo indisponible'}
        </p>
      </div>
    );
  }

  return (
    <video
      src={src}
      controls
      className="w-full aspect-video rounded-xl border border-luminous-gold-border"
      onError={() => setIsUnavailable(true)}
    >
      <track kind="captions" />
      Votre navigateur ne supporte pas la lecture de videos.
    </video>
  );
};
