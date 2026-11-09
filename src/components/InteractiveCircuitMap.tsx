import React, { useState, useEffect, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { MapPin, Navigation, Trophy, Sparkles, Building, ExternalLink, Compass } from 'lucide-react';
import { Language } from '../data/i18nData';

export interface MapLocationItem {
  id: string;
  name: string;
  category: 'cavaleiro' | 'galo' | 'dev';
  categoryLabel: string;
  city: string;
  state: string;
  position: { lat: number; lng: number };
  highlight: string;
  badge: string;
  color: string;
  gmapsQuery: string;
}

export const CIRCUIT_LOCATIONS: MapLocationItem[] = [
  {
    id: 'haras-realidade',
    name: 'Haras Realidade — Betim',
    category: 'cavaleiro',
    categoryLabel: 'Haras & Treinamento',
    city: 'Betim',
    state: 'MG',
    position: { lat: -19.9678, lng: -44.1983 },
    highlight: 'Centro de treinamento e paixão pelos cavalos Mangalarga Marchador.',
    badge: 'Haras Realidade',
    color: '#d4af37',
    gmapsQuery: 'Betim, Minas Gerais, Brasil',
  },
  {
    id: 'itauna-copa',
    name: 'Copa de Marcha — Itaúna',
    category: 'cavaleiro',
    categoryLabel: 'Competição',
    city: 'Itaúna',
    state: 'MG',
    position: { lat: -20.0747, lng: -44.5761 },
    highlight: 'Campeão da Categoria com Topminas e Guabi Equinos.',
    badge: 'Campeão',
    color: '#eab308',
    gmapsQuery: 'Itaúna, Minas Gerais, Brasil',
  },
  {
    id: 'catas-altas-juvenil',
    name: 'Morro D’Água Quente — Catas Altas',
    category: 'cavaleiro',
    categoryLabel: 'Competição',
    city: 'Catas Altas',
    state: 'MG',
    position: { lat: -20.0811, lng: -43.4689 },
    highlight: 'Campeão Juvenil na Pousada do Cowboy com troféu e faixa oficial.',
    badge: 'Campeão Juvenil',
    color: '#eab308',
    gmapsQuery: 'Catas Altas, Minas Gerais, Brasil',
  },
  {
    id: 'mariana-semana',
    name: 'Semana do Cavalo — Mariana',
    category: 'cavaleiro',
    categoryLabel: 'Competição',
    city: 'Mariana',
    state: 'MG',
    position: { lat: -20.3778, lng: -43.4161 },
    highlight: 'Reservado Campeão Juvenil na tradicional Semana do Cavalo.',
    badge: 'Reservado Campeão',
    color: '#f59e0b',
    gmapsQuery: 'Mariana, Minas Gerais, Brasil',
  },
  {
    id: 'santa-rita-durao',
    name: 'Copa de Marcha — Santa Rita Durão',
    category: 'cavaleiro',
    categoryLabel: 'Competição',
    city: 'Santa Rita Durão',
    state: 'MG',
    position: { lat: -20.2464, lng: -43.4394 },
    highlight: 'Reservado Campeão Juvenil — dedicação e gratidão a toda a equipe.',
    badge: 'Reservado Campeão',
    color: '#f59e0b',
    gmapsQuery: 'Santa Rita Durão, Mariana, Minas Gerais, Brasil',
  },
  {
    id: 'sao-goncalo-rio-abaixo',
    name: 'Pousada do Cowboy — São Gonçalo do Rio Abaixo',
    category: 'cavaleiro',
    categoryLabel: 'Competição',
    city: 'São Gonçalo do Rio Abaixo',
    state: 'MG',
    position: { lat: -19.8267, lng: -43.3611 },
    highlight: 'Reservado Campeão com premiação oficial em dinheiro e faixa de honra.',
    badge: 'Reservado Campeão',
    color: '#f59e0b',
    gmapsQuery: 'São Gonçalo do Rio Abaixo, Minas Gerais, Brasil',
  },
  {
    id: 'itabira-parque',
    name: 'Parque de Exposições — Itabira',
    category: 'cavaleiro',
    categoryLabel: 'Competição',
    city: 'Itabira',
    state: 'MG',
    position: { lat: -19.6194, lng: -43.2267 },
    highlight: '1º Prêmio Juvenil pelo Núcleo do Centro Leste Mineiro (NCCMMCLM).',
    badge: '1º Prêmio Juvenil',
    color: '#3b82f6',
    gmapsQuery: 'Itabira, Minas Gerais, Brasil',
  },
  {
    id: 'bh-gameleira',
    name: 'Exposição Nacional — Gameleira BH',
    category: 'cavaleiro',
    categoryLabel: 'Nacional',
    city: 'Belo Horizonte',
    state: 'MG',
    position: { lat: -19.9325, lng: -43.9875 },
    highlight: 'Top 10 na Exposição Nacional do Mangalarga Marchador (Parque Bolívar de Andrade).',
    badge: 'Top 10 Nacional',
    color: '#d4af37',
    gmapsQuery: 'Parque de Exposições Bolívar de Andrade Gameleira Belo Horizonte',
  },
  {
    id: 'arena-mrv',
    name: 'Arena MRV — A Casa do Galo',
    category: 'galo',
    categoryLabel: 'Atlético Mineiro',
    city: 'Belo Horizonte',
    state: 'MG',
    position: { lat: -19.9300, lng: -44.0139 },
    highlight: 'O caldeirão alvinegro. Paixão e vivência na arquibancada do Galo Forte e Vingador.',
    badge: 'Arena MRV',
    color: '#10b981',
    gmapsQuery: 'Arena MRV Belo Horizonte',
  },
  {
    id: 'mineirao',
    name: 'Estádio Mineirão — Gigante da Pampulha',
    category: 'galo',
    categoryLabel: 'Atlético Mineiro',
    city: 'Belo Horizonte',
    state: 'MG',
    position: { lat: -19.8658, lng: -43.9714 },
    highlight: 'Palco de títulos históricos, noites mágicas de Libertadores e Copa do Brasil.',
    badge: 'Mineirão',
    color: '#10b981',
    gmapsQuery: 'Estádio Mineirão Belo Horizonte',
  },
  {
    id: 'cidade-do-galo',
    name: 'Cidade do Galo — Centro de Treinamento',
    category: 'galo',
    categoryLabel: 'Atlético Mineiro',
    city: 'Vespasiano',
    state: 'MG',
    position: { lat: -19.6881, lng: -43.9239 },
    highlight: 'Referência continental em estrutura esportiva e formação atlética.',
    badge: 'CT do Galo',
    color: '#10b981',
    gmapsQuery: 'Cidade do Galo Vespasiano',
  },
  {
    id: 'puc-betim',
    name: 'PUC Minas — Campus Betim',
    category: 'dev',
    categoryLabel: 'Formação & Software',
    city: 'Betim',
    state: 'MG',
    position: { lat: -19.9647, lng: -44.1853 },
    highlight: 'Bacharelado em Sistemas de Informação. Laboratórios, C#, .NET e desenvolvimento full-stack.',
    badge: 'PUC Minas Betim',
    color: '#6366f1',
    gmapsQuery: 'PUC Minas Betim',
  },
];

interface InteractiveCircuitMapProps {
  language?: Language;
}

// Inner helper component to pan the map imperatively when a location is picked
function MapPanController({ target }: { target: MapLocationItem | null }) {
  const map = useMap();

  useEffect(() => {
    if (map && target) {
      map.panTo(target.position);
      map.setZoom(13);
    }
  }, [map, target]);

  return null;
}

export const InteractiveCircuitMap: React.FC<InteractiveCircuitMapProps> = ({ language = 'pt' }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'cavaleiro' | 'galo' | 'dev'>('all');
  const [activeLocation, setActiveLocation] = useState<MapLocationItem | null>(CIRCUIT_LOCATIONS[0]);
  const [apiKey, setApiKey] = useState<string>(
    (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || ''
  );

  // If client env var is not set, attempt to retrieve provisioned key from server
  useEffect(() => {
    if (!apiKey) {
      fetch('/api/maps-config')
        .then((res) => res.json())
        .then((data) => {
          if (data?.apiKey) {
            setApiKey(data.apiKey);
          }
        })
        .catch(() => {
          // Keep empty if unavailable
        });
    }
  }, [apiKey]);

  const filteredLocations = selectedFilter === 'all'
    ? CIRCUIT_LOCATIONS
    : CIRCUIT_LOCATIONS.filter((loc) => loc.category === selectedFilter);

  const handleSelectLocation = useCallback((loc: MapLocationItem) => {
    setActiveLocation(loc);
  }, []);

  return (
    <section id="mapa" className="py-16 sm:py-20 bg-gradient-to-b from-[#0a0705] via-[#110c08] to-[#070503] border-t border-[#3a2818]/60 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#d4af37]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-mono uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>{language === 'pt' ? 'Geolocalização Interativa' : 'Interactive Geolocation'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif-luxury font-bold text-white tracking-wide">
            {language === 'pt' ? 'Circuito de Conquistas & Pistas' : 'Circuit of Achievements & Arenas'}
          </h2>

          <p className="text-sm sm:text-base text-[#c7b7a6] mt-3 font-light leading-relaxed">
            {language === 'pt'
              ? 'Navegue pelo mapa oficial com todas as pistas de marcha, o Haras Realidade, arenas esportivas e o polo acadêmico em Minas Gerais.'
              : 'Explore the official interactive map featuring all march competitions, Haras Realidade, sports arenas, and academic hubs in Minas Gerais.'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'all', label: language === 'pt' ? 'Todos os Locais' : 'All Locations', icon: Compass },
            { id: 'cavaleiro', label: language === 'pt' ? 'Haras & Competições de Marcha' : 'Haras & Horse Shows', icon: Trophy },
            { id: 'galo', label: language === 'pt' ? 'Galo & Arenas' : 'Atlético-MG Arenas', icon: Navigation },
            { id: 'dev', label: language === 'pt' ? 'PUC Minas & Tech' : 'PUC Minas & Tech', icon: Building },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-[#d4af37] text-black border-[#d4af37] font-semibold shadow-md shadow-[#d4af37]/20 scale-105'
                    : 'bg-black/50 hover:bg-neutral-800 border-neutral-700/80 text-[#d9cbbe]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Map & Location Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Interactive Map */}
          <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-[#d4af37]/40 shadow-2xl bg-black/80 relative">
            <APIProvider
              apiKey={apiKey}
              libraries={['marker']}
              language="pt-BR"
              region="BR"
            >
              <div className="w-full h-[450px] sm:h-[540px] relative">
                <Map
                  mapId="DEMO_MAP_ID"
                  defaultCenter={{ lat: -19.9678, lng: -44.0 }}
                  defaultZoom={9}
                  gestureHandling="greedy"
                  disableDefaultUI={false}
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  style={{ width: '100%', height: '100%' }}
                >
                  <MapPanController target={activeLocation} />

                  {filteredLocations.map((loc) => {
                    const isSelected = activeLocation?.id === loc.id;
                    return (
                      <AdvancedMarker
                        key={loc.id}
                        position={loc.position}
                        title={loc.name}
                        onClick={() => handleSelectLocation(loc)}
                      >
                        <Pin
                          background={loc.color}
                          borderColor="#000000"
                          glyphColor="#000000"
                          scale={isSelected ? 1.3 : 1.0}
                        />
                      </AdvancedMarker>
                    );
                  })}

                  {activeLocation && (
                    <InfoWindow
                      position={activeLocation.position}
                      onCloseClick={() => setActiveLocation(null)}
                      headerContent={
                        <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                          <span>{activeLocation.name}</span>
                        </div>
                      }
                    >
                      <div className="p-1 max-w-[240px] text-neutral-800 text-xs space-y-1.5">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-200 text-neutral-800">
                          {activeLocation.badge}
                        </span>
                        <p className="text-xs text-neutral-600 leading-snug">
                          {activeLocation.highlight}
                        </p>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            activeLocation.gmapsQuery
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 pt-1"
                        >
                          <span>{language === 'pt' ? 'Rotas no Google Maps' : 'Directions'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </div>
            </APIProvider>

            {/* Bottom floating helper info */}
            <div className="p-3 bg-black/90 border-t border-neutral-800 text-xs text-[#a89684] flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>
                  {language === 'pt'
                    ? `${filteredLocations.length} marcos mapeados em Minas Gerais`
                    : `${filteredLocations.length} milestones mapped across Minas Gerais`}
                </span>
              </span>
              <span className="text-[11px] font-mono text-[#d4af37]">
                Google Maps Platform · AdvancedMarkerElement
              </span>
            </div>
          </div>

          {/* Right Column: Clickable List of Milestones */}
          <div className="lg:col-span-4 space-y-2.5 max-h-[590px] overflow-y-auto pr-1">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#d4af37] px-1 font-semibold flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'pt' ? 'Locais em Destaque' : 'Featured Locations'}</span>
            </h4>

            {filteredLocations.map((loc) => {
              const isSelected = activeLocation?.id === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => handleSelectLocation(loc)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-[#2b1f14] border-[#d4af37] shadow-lg shadow-[#d4af37]/15 translate-x-1'
                      : 'bg-black/60 hover:bg-white/5 border-neutral-800 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${loc.color}20`,
                        color: loc.color,
                        border: `1px solid ${loc.color}50`,
                      }}
                    >
                      {loc.badge}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {loc.city}, {loc.state}
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-white leading-tight">
                    {loc.name}
                  </h5>

                  <p className="text-xs text-[#b8a795] line-clamp-2 leading-relaxed">
                    {loc.highlight}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-[#d4af37] border-t border-neutral-800/60 mt-1">
                    <span>{isSelected ? '★ Visualizando no mapa' : 'Clique para focar'}</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        loc.gmapsQuery
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="hover:underline flex items-center gap-1 text-neutral-400 hover:text-white"
                      title="Abrir no Google Maps"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Abrir</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
