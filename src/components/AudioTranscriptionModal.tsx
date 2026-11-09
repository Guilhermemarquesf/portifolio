import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Loader2, 
  Copy, 
  Check, 
  Sparkles, 
  X, 
  Search, 
  AlertCircle, 
  Upload, 
  RefreshCw, 
  Lock, 
  HelpCircle 
} from 'lucide-react';
import { useAudioTranscription } from '../hooks/useAudioTranscription';
import { ExperienceType } from '../types';

interface AudioTranscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySearch?: (query: string) => void;
}

export const AudioTranscriptionModal: React.FC<AudioTranscriptionModalProps> = ({
  isOpen,
  onClose,
  onApplySearch,
}) => {
  const {
    isRecording,
    isTranscribing,
    transcript,
    error,
    isPermissionDenied,
    startRecording,
    stopRecording,
    transcribeAudioFile,
    clearTranscript,
    resetError,
  } = useAudioTranscription();

  const [copied, setCopied] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await transcribeAudioFile(file);
      e.target.value = '';
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      setRecordSeconds(0);
      interval = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearchWithTranscript = () => {
    if (!transcript) return;
    onApplySearch?.(transcript);
    onClose();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full rounded-2xl bg-gradient-to-b from-[#18120c] to-[#0e0a07] border border-[#d4af37]/40 shadow-2xl p-6 sm:p-7 overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-[#d4af37]/15 rounded-full blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#291b10] border border-[#d4af37]/50 text-[#d4af37] shadow-sm">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif-luxury font-bold text-white tracking-wide">
                  Transcrição por Voz
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] font-semibold">
                  gemini-3.5-transcribe
                </span>
              </div>
              <p className="text-xs text-[#b8a795]">
                Fale com seu microfone e o Gemini transcreve seu áudio instantaneamente
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Central Record Trigger Area */}
        <div className="py-5 flex flex-col items-center justify-center text-center relative z-10">
          {/* Hidden File Input for Audio Files */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm,.aac"
            className="hidden"
          />

          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isTranscribing}
            className={`relative group w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-xl ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-rose-600/40'
                : isTranscribing
                ? 'bg-[#2b1c11] text-[#d4af37] border-2 border-[#d4af37]/40 cursor-wait'
                : 'bg-gradient-to-br from-[#c59b27] to-[#8f6d19] hover:scale-105 text-black shadow-[#c59b27]/30'
            }`}
            title={isRecording ? 'Parar Gravação' : 'Iniciar Gravação'}
          >
            {isRecording && (
              <span className="absolute -inset-2 rounded-full border-2 border-rose-500 animate-ping opacity-60" />
            )}

            {isTranscribing ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : isRecording ? (
              <MicOff className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}

            <span className="text-[10px] font-bold uppercase tracking-wider mt-1">
              {isTranscribing ? 'Processando' : isRecording ? formatTime(recordSeconds) : 'Falar'}
            </span>
          </button>

          <p className="text-xs text-[#cfc2b2] mt-3 font-light max-w-xs">
            {isRecording
              ? 'Gravando... Fale claramente com seu microfone e clique novamente para transcrever.'
              : isTranscribing
              ? 'Transcrevendo áudio com o modelo gemini-3.5-transcribe...'
              : 'Clique no botão acima para falar, ou carregue um arquivo de áudio abaixo.'}
          </p>

          {/* Quick upload audio file alternative */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isTranscribing || isRecording}
              className="text-[11px] text-[#d4af37] hover:text-[#f0d485] hover:underline flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-[#d4af37]/20 transition-all"
            >
              <Upload className="w-3 h-3" />
              <span>Ou carregar gravação de áudio (.mp3, .m4a, .wav, .ogg)</span>
            </button>
          </div>

          {/* Permission Denied Recovery Banner */}
          {isPermissionDenied ? (
            <div className="mt-4 p-4 rounded-xl bg-amber-950/40 border border-amber-600/40 text-xs text-amber-200 max-w-md text-left space-y-2.5">
              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-300">Microfone bloqueado pelo navegador</h4>
                  <p className="text-[11px] text-amber-200/90 mt-1 leading-relaxed">
                    O navegador bloqueou o acesso ao microfone. Para liberar:
                  </p>
                  <ol className="list-decimal list-inside text-[11px] text-amber-200/80 mt-1 space-y-0.5">
                    <li>Clique no <strong>ícone de cadeado (🔒)</strong> ao lado do link do site</li>
                    <li>Mude a permissão de <strong>Microfone</strong> para <strong>Permitir</strong></li>
                    <li>Recarregue a página ou clique em Tentar Novamente</li>
                  </ol>
                </div>
              </div>

              <div className="pt-2 border-t border-amber-800/40 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetError();
                    startRecording();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Tentar Novamente</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Carregar Arquivo</span>
                </button>
              </div>
            </div>
          ) : error ? (
            <div className="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2 max-w-md text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          ) : null}
        </div>

        {/* Transcript Result Box */}
        <div className="mt-2 p-4 rounded-xl bg-black/60 border border-[#382618] relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-serif-luxury uppercase tracking-wider text-[#d4af37] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Texto Transcrito
            </span>

            {transcript && (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopy}
                  className="px-2 py-1 rounded-md text-[11px] bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors flex items-center gap-1"
                  title="Copiar texto"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
                <button
                  onClick={clearTranscript}
                  className="px-2 py-1 rounded-md text-[11px] text-neutral-400 hover:text-white hover:bg-white/5"
                >
                  Limpar
                </button>
              </div>
            )}
          </div>

          <div className="min-h-[70px] max-h-[140px] overflow-y-auto text-sm text-[#f0e6d8] leading-relaxed">
            {transcript ? (
              <p className="italic font-serif-luxury text-base sm:text-lg text-[#f7f2ea]">
                “{transcript}”
              </p>
            ) : (
              <p className="text-xs text-neutral-500 italic">
                O texto transcrito pelo Gemini aparecerá aqui assim que você concluir a gravação de áudio.
              </p>
            )}
          </div>

          {/* Action buttons if transcript available */}
          {transcript && (
            <div className="mt-4 pt-3 border-t border-neutral-800 flex flex-wrap items-center gap-2">
              {onApplySearch && (
                <button
                  onClick={handleSearchWithTranscript}
                  className="px-3.5 py-1.5 rounded-lg bg-[#c59b27] hover:bg-[#b38a1e] text-black text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Pesquisar "{transcript.slice(0, 20)}..."</span>
                </button>
              )}
              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Transcrição</span>
              </button>
            </div>
          )}
        </div>

        {/* Suggestion prompts */}
        <div className="mt-4 pt-3 border-t border-[#2a1d12] flex flex-wrap items-center gap-1.5 text-[11px] text-[#9c8978]">
          <span className="font-semibold text-[#c59b27]">Exemplos para falar:</span>
          {[
            'Haras Realidade Betim',
            'Copa de Marcha em Nova Serrana',
            'Top 10 Exposição Nacional',
            'Sistemas de Informação PUC Minas',
          ].map((sample) => (
            <button
              key={sample}
              onClick={() => {
                if (onApplySearch) {
                  onApplySearch(sample);
                  onClose();
                }
              }}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
            >
              "{sample}"
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
