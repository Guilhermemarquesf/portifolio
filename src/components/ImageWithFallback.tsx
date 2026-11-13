import React, { useState, useEffect } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  domainTheme?: 'tech' | 'equestrian' | 'football' | 'neutral';
  objectFit?: 'contain' | 'cover' | 'fill' | 'scale-down' | 'none';
  imgClassName?: string;
  priority?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  fallbackTitle = 'Imagem indisponível',
  fallbackSubtitle = 'Visualização em modo reservado',
  domainTheme = 'neutral',
  objectFit = 'contain',
  priority = false,
  loading,
  decoding,
  ...rest
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Reset image loading/error state whenever src changes (e.g. inside Lightbox Next/Prev)
  useEffect(() => {
    setError(false);
    setLoaded(false);
  }, [src]);

  const getThemeFallbackBg = () => {
    switch (domainTheme) {
      case 'tech':
        return 'bg-slate-900 border border-indigo-900/40 text-indigo-300';
      case 'equestrian':
        return 'bg-[#211812] border border-[#4a3625] text-[#d4af37]';
      case 'football':
        return 'bg-neutral-900 border border-neutral-800 text-emerald-400';
      default:
        return 'bg-neutral-900 border border-neutral-800 text-neutral-400';
    }
  };

  const getObjectFitClass = () => {
    switch (objectFit) {
      case 'contain':
        return 'object-contain';
      case 'cover':
        return 'object-cover';
      case 'fill':
        return 'object-fill';
      case 'scale-down':
        return 'object-scale-down';
      default:
        return 'object-contain';
    }
  };

  if (error || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-6 text-center ${getThemeFallbackBg()} ${className}`}
        role="img"
        aria-label={alt || fallbackTitle}
      >
        <span className="text-sm font-semibold tracking-wide">{fallbackTitle}</span>
        {fallbackSubtitle && (
          <span className="text-xs opacity-75 mt-1">{fallbackSubtitle}</span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-neutral-900/60 pointer-events-none" />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading ?? (priority ? 'eager' : 'lazy')}
        decoding={decoding ?? 'async'}
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full ${getObjectFitClass()} transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
        {...rest}
      />
    </div>
  );
};
