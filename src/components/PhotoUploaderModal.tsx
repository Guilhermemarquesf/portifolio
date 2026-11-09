import React, { useState } from 'react';
import { X, Upload, Check } from 'lucide-react';

interface PhotoUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPhoto: (photo: {
    id: string;
    url: string;
    title: string;
    subtitle: string;
    category: string;
    year: string;
    location: string;
  }) => void;
  defaultCategory?: string;
  categoryOptions: string[];
  theme: 'equestrian' | 'football' | 'tech';
}

export const PhotoUploaderModal: React.FC<PhotoUploaderModalProps> = ({
  isOpen,
  onClose,
  onAddPhoto,
  defaultCategory = '',
  categoryOptions,
  theme,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState(defaultCategory || categoryOptions[0] || '');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [location, setLocation] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WEBP).');
      return;
    }

    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl) {
      setErrorMsg('Selecione uma imagem para adicionar.');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Informe um título para a fotografia.');
      return;
    }

    onAddPhoto({
      id: `user-${Date.now()}`,
      url: previewUrl,
      title: title.trim(),
      subtitle: subtitle.trim() || 'Fotografia pessoal adicionada',
      category: category || 'Geral',
      year: year || 'Atual',
      location: location || 'Arquivo Pessoal',
    });

    // Reset and close
    setTitle('');
    setSubtitle('');
    setPreviewUrl(null);
    onClose();
  };

  const getThemeStyles = () => {
    if (theme === 'equestrian') {
      return {
        cardBg: 'bg-[#18110b] border-[#5a432e] text-[#f7f2ea]',
        button: 'bg-[#c59b27] hover:bg-[#b58b1f] text-black font-semibold',
        input: 'bg-[#22170f] border-[#4a3625] focus:border-[#c59b27] text-white',
      };
    }
    if (theme === 'football') {
      return {
        cardBg: 'bg-[#111111] border-neutral-800 text-white',
        button: 'bg-emerald-500 hover:bg-emerald-600 text-black font-bold',
        input: 'bg-neutral-900 border-neutral-700 focus:border-emerald-500 text-white',
      };
    }
    return {
      cardBg: 'bg-slate-900 border-indigo-900/50 text-white',
      button: 'bg-indigo-600 hover:bg-indigo-500 text-white font-medium',
      input: 'bg-slate-950 border-slate-700 focus:border-indigo-500 text-white',
    };
  };

  const styles = getThemeStyles();

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative max-w-lg w-full rounded-2xl p-6 sm:p-8 border shadow-2xl ${styles.cardBg}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold mb-1">Adicionar Fotografia à Galeria</h3>
        <p className="text-xs opacity-75 mb-6">
          Espaço preparado para inserir seus próprios registros, provas, conquistas e momentos.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-800/80 text-red-200 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5 opacity-90">
              Arquivo da Imagem
            </label>
            <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors ${
              previewUrl ? 'border-emerald-500/50' : 'border-white/20 hover:border-white/40'
            }`}>
              {previewUrl ? (
                <div className="flex items-center gap-3 w-full">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-16 h-16 object-contain bg-black/90 p-1 rounded-lg border border-white/10"
                  />
                  <div className="flex-1 truncate">
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Imagem carregada com sucesso
                    </span>
                    <span className="text-[11px] opacity-70 block truncate">Clique para trocar a imagem</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-2 text-center">
                  <Upload className="w-6 h-6 mb-2 opacity-60" />
                  <span className="text-xs font-medium">Clique para escolher uma imagem do seu computador</span>
                  <span className="text-[11px] opacity-50 mt-1">PNG, JPG, WEBP até 10MB</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 opacity-90">
              Título da Foto *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Campeão dos Campeões no CBM"
              className={`w-full px-3 py-2 text-sm rounded-lg border outline-none ${styles.input}`}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 opacity-90">
              Descrição / Legenda
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Ex: Momento da premiação na pista principal"
              className={`w-full px-3 py-2 text-sm rounded-lg border outline-none ${styles.input}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1 opacity-90">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-3 py-2 text-sm rounded-lg border outline-none ${styles.input}`}
              >
                {categoryOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-neutral-900 text-white">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 opacity-90">
                Ano / Época
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2025"
                className={`w-full px-3 py-2 text-sm rounded-lg border outline-none ${styles.input}`}
              >
              </input>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 opacity-90">
              Localização (Opcional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Haras GMF ou Arena MRV"
              className={`w-full px-3 py-2 text-sm rounded-lg border outline-none ${styles.input}`}
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg hover:bg-white/10 text-white/80 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-xs rounded-lg transition-colors shadow-sm ${styles.button}`}
            >
              Adicionar à Galeria
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
