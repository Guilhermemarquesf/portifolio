import React, { useEffect, useState, useRef } from 'react';
import { X, Calendar, MapPin, Tag, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Heart, Share2, Check, Shield, Code2, Trophy } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface MediaLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  subtitle?: string;
  category?: string;
  year?: string;
  location?: string;
  theme?: 'tech' | 'equestrian' | 'football';
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
  currentIndex?: number;
  totalPhotos?: number;
}

export const MediaLightboxModal: React.FC<MediaLightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  subtitle,
  category,
  year,
  location,
  theme = 'equestrian',
  onNext,
  onPrev,
  hasNext = false,
  hasPrev = false,
  currentIndex,
  totalPhotos,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setIsZoomed(false);
    setLiked(false);
  }, [imageUrl]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext && hasNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev && hasPrev) onPrev();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onNext, onPrev, hasNext, hasPrev]);

  if (!isOpen) return null;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard permission errors cleanly
    }
  };

  const getBorderColor = () => {
    if (theme === 'equestrian') return 'border-[#5a432e] bg-[#140e09]';
    if (theme === 'football') return 'border-neutral-800 bg-[#0c0c0c]';
    return 'border-indigo-900/50 bg-[#090d16]';
  };

  const getAccentBtn = () => {
    if (theme === 'equestrian') return 'text-[#d4af37] hover:bg-[#d4af37]/20 border-[#d4af37]/30';
    if (theme === 'football') return 'text-emerald-400 hover:bg-emerald-400/20 border-emerald-400/30';
    return 'text-indigo-400 hover:bg-indigo-400/20 border-indigo-400/30';
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/95"
      onClick={onClose}
    >
      <div
        className={`relative max-w-5xl w-full rounded-2xl overflow-hidden border shadow-2xl ${getBorderColor()} max-h-[92vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar controls */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
          {typeof currentIndex === 'number' && currentIndex >= 0 && typeof totalPhotos === 'number' && totalPhotos > 0 && (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/85 border border-white/20 text-white/90">
              {currentIndex + 1} / {totalPhotos}
            </span>
          )}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            aria-label={isZoomed ? 'Diminuir zoom' : 'Ampliar detalhes'}
            title={isZoomed ? 'Ajustar à tela' : 'Ampliar foto'}
            className="p-2 rounded-full bg-black/75 hover:bg-black text-white/80 hover:text-white transition-colors border border-white/10"
          >
            {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            aria-label="Fechar visualizador"
            className="p-2 rounded-full bg-black/75 hover:bg-black text-white/80 hover:text-white transition-colors border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden">
          {/* Main Photo Area with Navigation */}
          <div className="relative w-full md:w-3/5 bg-black/95 flex items-center justify-center min-h-[360px] md:min-h-[520px] max-h-[60vh] md:max-h-[82vh] overflow-hidden p-2 sm:p-4 select-none">
            
            {/* Prev Button */}
            {hasPrev && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev?.();
                }}
                aria-label="Foto anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/75 hover:bg-[#c59b27] hover:text-black text-white border border-white/10 transition-all shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Next Button */}
            {hasNext && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNext?.();
                }}
                aria-label="Próxima foto"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/75 hover:bg-[#c59b27] hover:text-black text-white border border-white/10 transition-all shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Image centered and completely visible */}
            <div className={`w-full h-full flex items-center justify-center transition-transform duration-300 ${isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100'}`}
                 onClick={() => setIsZoomed(!isZoomed)}>
              <ImageWithFallback
                src={imageUrl}
                alt={title}
                domainTheme={theme}
                objectFit="contain"
                className="w-full h-full max-h-[58vh] md:max-h-[78vh]"
              />
            </div>
          </div>

          {/* Details & Visitor Actions */}
          <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 bg-inherit">
            <div>
              {category && (
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-2 opacity-80 text-[#d4af37]">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{category}</span>
                </div>
              )}
              <h3 className="text-xl md:text-2xl font-serif-luxury font-bold text-white mb-2 leading-snug tracking-wide flex items-center gap-2">
                {theme === 'equestrian' && <Shield className="w-5 h-5 text-[#d4af37] shrink-0" />}
                {theme === 'football' && <Trophy className="w-5 h-5 text-emerald-400 shrink-0" />}
                {theme === 'tech' && <Code2 className="w-5 h-5 text-indigo-400 shrink-0" />}
                <span>{title}</span>
              </h3>
              {subtitle && (
                <p className="text-sm opacity-85 leading-relaxed mb-4 text-[#ded2c3]">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              {/* Meta details */}
              <div className="space-y-2 text-xs opacity-75">
                {location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0 text-[#d4af37]" />
                    <span>{location}</span>
                  </div>
                )}
                {year && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 shrink-0 text-[#d4af37]" />
                    <span>{year}</span>
                  </div>
                )}
              </div>

              {/* Viewer Interactive Controls: Like / Celebrate & Share */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    liked
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                      : 'border-white/15 hover:border-white/30 text-white/80'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{liked ? 'Aplaudido!' : 'Aplaudir Registro'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${getAccentBtn()}`}
                  title="Copiar link"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Compartilhar'}</span>
                </button>
              </div>

              {/* Navigation help caption */}
              <p className="text-[11px] text-center text-white/50 pt-1">
                Dica: Use as setas do teclado (← / →) para navegar pelas fotos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

