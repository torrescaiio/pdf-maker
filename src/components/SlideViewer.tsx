import React, { useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit3,
  Layers,
  Sparkles,
  Smartphone,
  Monitor,
  FileText,
} from 'lucide-react';
import type { EventData, ThemeConfig, SlideImages, LayoutFormat } from '../types.ts';
import { formatConfigs } from '../utils/proposalLogic.ts';
import { Slide1Cover } from './Slides/Slide1Cover.tsx';
import { Slide2Concept } from './Slides/Slide2Concept.tsx';
import { Slide3Audience } from './Slides/Slide3Audience.tsx';
import { Slide4Attractions } from './Slides/Slide4Attractions.tsx';
import { Slide5Tiers } from './Slides/Slide5Tiers.tsx';
import { Slide6Closing } from './Slides/Slide6Closing.tsx';

interface SlideViewerProps {
  eventData: EventData;
  setEventData: React.Dispatch<React.SetStateAction<EventData>>;
  theme: ThemeConfig;
  images: SlideImages;
  format: LayoutFormat;
  setFormat: (format: LayoutFormat) => void;
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
  viewMode: 'all' | 'single';
  setViewMode: (mode: 'all' | 'single') => void;
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  onPrint: () => void;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({
  eventData,
  setEventData,
  theme,
  images,
  format,
  setFormat,
  zoomLevel,
  setZoomLevel,
  viewMode,
  setViewMode,
  currentSlide,
  setCurrentSlide,
  onPrint,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleUpdateText = (field: keyof EventData, value: string) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdatePillar = (
    index: number,
    field: 'title' | 'description',
    value: string
  ) => {
    setEventData((prev) => ({
      ...prev,
      pillars: prev.pillars.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    }));
  };

  const handleUpdateAttraction = (
    index: number,
    field: 'title' | 'description' | 'stats' | 'tag',
    value: string
  ) => {
    setEventData((prev) => ({
      ...prev,
      attractions: prev.attractions.map((a, i) => (i === index ? { ...a, [field]: value } : a)),
    }));
  };

  const handleUpdateTierPrice = (tierId: string, price: number) => {
    setEventData((prev) => ({
      ...prev,
      tiers: prev.tiers.map((t) => (t.id === tierId ? { ...t, price } : t)),
    }));
  };

  const handleUpdateTierQuotas = (tierId: string, quotas: number) => {
    setEventData((prev) => ({
      ...prev,
      tiers: prev.tiers.map((t) => (t.id === tierId ? { ...t, quotasAvailable: quotas } : t)),
    }));
  };

  const handleUpdateTierTitle = (tierId: string, name: string) => {
    setEventData((prev) => ({
      ...prev,
      tiers: prev.tiers.map((t) => (t.id === tierId ? { ...t, name } : t)),
    }));
  };

  const activeConfig = formatConfigs[format] || formatConfigs.widescreen;
  const containerMaxWidth = Math.round(activeConfig.previewMaxWidth * (zoomLevel / 100));

  const slideList = [
    { id: 1, title: 'Capa & Identidade', component: (
      <Slide1Cover
        data={eventData}
        theme={theme}
        images={images}
        format={format}
        onUpdateText={handleUpdateText}
      />
    )},
    { id: 2, title: 'Conceito & Experiência', component: (
      <Slide2Concept
        data={eventData}
        theme={theme}
        images={images}
        format={format}
        onUpdateText={handleUpdateText}
        onUpdatePillar={handleUpdatePillar}
      />
    )},
    { id: 3, title: 'Público & Métricas', component: (
      <Slide3Audience
        data={eventData}
        theme={theme}
        images={images}
        format={format}
        onUpdateText={handleUpdateText}
      />
    )},
    { id: 4, title: 'Atrações & Estrutura', component: (
      <Slide4Attractions
        data={eventData}
        theme={theme}
        images={images}
        format={format}
        onUpdateText={handleUpdateText}
        onUpdateAttraction={handleUpdateAttraction}
      />
    )},
    { id: 5, title: 'Cotas de Patrocínio', component: (
      <Slide5Tiers
        data={eventData}
        theme={theme}
        images={images}
        format={format}
        onUpdateText={handleUpdateText}
        onUpdateTierPrice={handleUpdateTierPrice}
        onUpdateTierQuotas={handleUpdateTierQuotas}
        onUpdateTierTitle={handleUpdateTierTitle}
      />
    )},
    { id: 6, title: 'Encerramento & Contato', component: (
      <Slide6Closing
        data={eventData}
        theme={theme}
        images={images}
        format={format}
        onUpdateText={handleUpdateText}
      />
    )},
  ];

  return (
    <main className="flex-1 flex flex-col h-screen bg-neutral-950 overflow-hidden relative">
      {/* Top Floating Control Bar */}
      <header className="no-print h-14 bg-neutral-900/90 border-b border-neutral-800 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-20">
        {/* Slide quick picker tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {slideList.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentSlide(idx);
                if (viewMode === 'all') {
                  const el = document.getElementById(`slide-anchor-${s.id}`);
                  el?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                currentSlide === idx
                  ? 'bg-amber-400 text-neutral-950 shadow-md font-bold'
                  : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700 hover:text-white'
              }`}
            >
              <span className="text-[10px] opacity-75 font-mono">0{s.id}</span>
              <span className="hidden sm:inline">{s.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Format Selector + View mode + Zoom controls */}
        <div className="flex items-center gap-2">
          {/* Format quick buttons in viewer header */}
          <div className="hidden xl:flex items-center bg-neutral-800/80 rounded-lg p-0.5 border border-neutral-700 text-xs">
            <button
              onClick={() => setFormat('mobile')}
              title="Mobile / iPhone (9:16)"
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                format === 'mobile'
                  ? 'bg-amber-400 text-neutral-950 shadow font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>9:16 Mobile</span>
            </button>
            <button
              onClick={() => setFormat('widescreen')}
              title="Widescreen / Slides (16:9)"
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                format === 'widescreen'
                  ? 'bg-amber-400 text-neutral-950 shadow font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span>16:9 Slides</span>
            </button>
            <button
              onClick={() => setFormat('a4Portrait')}
              title="A4 Retrato Documento"
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                format === 'a4Portrait'
                  ? 'bg-amber-400 text-neutral-950 shadow font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>A4 Retrato</span>
            </button>
          </div>

          {/* Mode toggle */}
          <div className="hidden md:flex items-center bg-neutral-800/80 rounded-lg p-0.5 border border-neutral-700 text-xs">
            <button
              onClick={() => setViewMode('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'all'
                  ? 'bg-neutral-700 text-white shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Todas (6)
            </button>
            <button
              onClick={() => setViewMode('single')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'single'
                  ? 'bg-neutral-700 text-white shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Individual
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center bg-neutral-800/80 rounded-lg border border-neutral-700 px-1.5 py-1 gap-1 text-xs text-neutral-300">
            <button
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 15))}
              title="Reduzir Zoom"
              className="p-1 hover:text-white transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-mono font-medium">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(130, zoomLevel + 15))}
              title="Aumentar Zoom"
              className="p-1 hover:text-white transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              title="Ajustar 100%"
              className="p-1 hover:text-white transition-colors border-l border-neutral-700 pl-1.5 ml-0.5"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>

          {/* Quick PDF button */}
          <button
            onClick={onPrint}
            title="Exportar PDF de Alta Resolução"
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold text-neutral-950 transition-all hover:brightness-110 active:scale-95"
            style={{ backgroundColor: theme.primaryColor }}
          >
            <Printer className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Exportar PDF</span>
          </button>
        </div>
      </header>

      {/* Direct Editing Notification Banner */}
      <div className="no-print bg-neutral-900/50 border-b border-neutral-800/80 px-4 py-1.5 flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
          <span>
            <strong>Edição Direta Ativa:</strong> Você pode clicar e editar qualquer palavra direto na arte da lâmina.
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-4 text-[11px] font-mono text-neutral-400">
          <span>Proporção: <strong className="text-amber-400">{activeConfig.ratioLabel}</strong> ({activeConfig.label})</span>
          <span>Página PDF: <strong className="text-neutral-300">{activeConfig.printPageSize}</strong></span>
        </div>
      </div>

      {/* Main Slides Display Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 flex flex-col items-center gap-12"
      >
        {viewMode === 'all' ? (
          // View all 6 slides in continuous scroll
          slideList.map((slide) => (
            <div
              key={slide.id}
              id={`slide-anchor-${slide.id}`}
              className="w-full flex flex-col items-center transition-all duration-300"
              style={{
                maxWidth: `${containerMaxWidth}px`,
              }}
            >
              {/* Slide numbering indicator */}
              <div className="no-print w-full flex items-center justify-between mb-2 text-xs text-neutral-400 font-mono px-2">
                <span className="flex items-center gap-2 font-semibold">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                  LÂMINA {slide.id} DE 06: {slide.title.toUpperCase()}
                </span>
                <span className="text-[11px] text-neutral-500 font-sans">
                  {activeConfig.shortLabel} • Clique no texto para editar
                </span>
              </div>

              {/* The Slide Container */}
              <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-neutral-800/80 transition-all hover:border-neutral-700">
                {slide.component}
              </div>
            </div>
          ))
        ) : (
          // Single Slide View
          <div
            className="w-full flex flex-col items-center my-auto transition-all duration-300"
            style={{
              maxWidth: `${containerMaxWidth}px`,
            }}
          >
            {/* Header info */}
            <div className="no-print w-full flex items-center justify-between mb-2 text-xs text-neutral-400 font-mono px-2">
              <span className="flex items-center gap-2 font-semibold">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: theme.primaryColor }}
                />
                LÂMINA {currentSlide + 1} DE 06: {slideList[currentSlide].title.toUpperCase()}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                  disabled={currentSlide === 0}
                  className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span>{currentSlide + 1} / 6</span>
                <button
                  onClick={() => setCurrentSlide(Math.min(5, currentSlide + 1))}
                  disabled={currentSlide === 5}
                  className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slide Component */}
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-neutral-800/80">
              {slideList[currentSlide].component}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
