import React, { useRef, useState } from 'react';
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
  Camera,
  Upload,
  X,
  Trash2,
  Plus,
  RotateCcw,
  Check,
} from 'lucide-react';
import type { EventData, ThemeConfig, SlideImages, LayoutFormat, CustomSlideBlock, ExperiencePillar, AttractionCard, SponsorshipTier } from '../types.ts';
import { formatConfigs, defaultImages } from '../utils/proposalLogic.ts';
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
  setImages: React.Dispatch<React.SetStateAction<SlideImages>>;
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
  setImages,
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
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaModalTab, setMediaModalTab] = useState<'logo' | 'slides' | 'sponsors'>('logo');

  const handleUpdateText = (field: keyof EventData, value: string) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateImage = (key: keyof SlideImages, value: string) => {
    setImages((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddSponsorLogo = (logoUrl: string) => {
    setImages((prev) => ({
      ...prev,
      sponsorLogos: [...(prev.sponsorLogos || []), logoUrl],
    }));
  };

  const handleRemoveSponsorLogo = (index: number) => {
    setImages((prev) => ({
      ...prev,
      sponsorLogos: (prev.sponsorLogos || []).filter((_, i) => i !== index),
    }));
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

  const handleToggleBlock = (field: keyof EventData, show: boolean) => {
    setEventData((prev) => ({
      ...prev,
      [field]: show,
    }));
  };

  // Custom blocks handlers generator
  const createCustomBlockHandlers = (slideKey: 'customBlocksSlide1' | 'customBlocksSlide2' | 'customBlocksSlide3' | 'customBlocksSlide4' | 'customBlocksSlide5' | 'customBlocksSlide6') => ({
    onAddCustomBlock: (block: CustomSlideBlock) => {
      setEventData((prev) => ({
        ...prev,
        [slideKey]: [...(prev[slideKey] || []), block],
      }));
    },
    onRemoveCustomBlock: (id: string) => {
      setEventData((prev) => ({
        ...prev,
        [slideKey]: (prev[slideKey] || []).filter((b) => b.id !== id),
      }));
    },
    onUpdateCustomBlock: (id: string, field: 'title' | 'content', value: string) => {
      setEventData((prev) => ({
        ...prev,
        [slideKey]: (prev[slideKey] || []).map((b) =>
          b.id === id ? { ...b, [field]: value } : b
        ),
      }));
    },
  });

  const customSlide1Handlers = createCustomBlockHandlers('customBlocksSlide1');
  const customSlide2Handlers = createCustomBlockHandlers('customBlocksSlide2');
  const customSlide3Handlers = createCustomBlockHandlers('customBlocksSlide3');
  const customSlide4Handlers = createCustomBlockHandlers('customBlocksSlide4');
  const customSlide5Handlers = createCustomBlockHandlers('customBlocksSlide5');
  const customSlide6Handlers = createCustomBlockHandlers('customBlocksSlide6');

  // Lâmina 2: Pillars
  const handleAddPillar = (pillar: ExperiencePillar) => {
    setEventData((prev) => ({
      ...prev,
      pillars: [...prev.pillars, pillar],
    }));
  };

  const handleRemovePillar = (index: number) => {
    setEventData((prev) => ({
      ...prev,
      pillars: prev.pillars.filter((_, i) => i !== index),
    }));
  };

  const handleUpdatePillarIcon = (index: number, iconName: string) => {
    setEventData((prev) => ({
      ...prev,
      pillars: prev.pillars.map((p, i) => (i === index ? { ...p, iconName } : p)),
    }));
  };

  // Lâmina 3: Media channels & demographics
  const handleUpdateMediaChannels = (channels: string[]) => {
    setEventData((prev) => ({
      ...prev,
      mediaChannels: channels,
    }));
  };

  const handleUpdateDemographics = (demographics: { label: string; percentage: number }[]) => {
    setEventData((prev) => ({
      ...prev,
      demographicsGender: demographics,
    }));
  };

  // Lâmina 4: Attractions & Structure metrics
  const handleAddAttraction = (attraction: AttractionCard) => {
    setEventData((prev) => ({
      ...prev,
      attractions: [...prev.attractions, attraction],
    }));
  };

  const handleRemoveAttraction = (index: number) => {
    setEventData((prev) => ({
      ...prev,
      attractions: prev.attractions.filter((_, i) => i !== index),
    }));
  };

  const handleAddStructureMetric = (metric: { value: string; label: string }) => {
    setEventData((prev) => ({
      ...prev,
      structureMetrics: [...prev.structureMetrics, metric],
    }));
  };

  const handleRemoveStructureMetric = (index: number) => {
    setEventData((prev) => ({
      ...prev,
      structureMetrics: prev.structureMetrics.filter((_, i) => i !== index),
    }));
  };

  // Lâmina 5: Tiers & Deliverables
  const handleAddTier = (tier: SponsorshipTier) => {
    setEventData((prev) => ({
      ...prev,
      tiers: [...prev.tiers, tier],
    }));
  };

  const handleRemoveTier = (tierId: string) => {
    setEventData((prev) => ({
      ...prev,
      tiers: prev.tiers.filter((t) => t.id !== tierId),
    }));
  };

  const handleAddDeliverable = (tierId: string, deliverable: string) => {
    setEventData((prev) => ({
      ...prev,
      tiers: prev.tiers.map((t) =>
        t.id === tierId ? { ...t, deliverables: [...t.deliverables, deliverable] } : t
      ),
    }));
  };

  const handleRemoveDeliverable = (tierId: string, index: number) => {
    setEventData((prev) => ({
      ...prev,
      tiers: prev.tiers.map((t) =>
        t.id === tierId
          ? { ...t, deliverables: t.deliverables.filter((_, idx) => idx !== index) }
          : t
      ),
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
        onUpdateImage={handleUpdateImage}
        onToggleBlock={handleToggleBlock}
        {...customSlide1Handlers}
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
        onUpdateImage={handleUpdateImage}
        onToggleBlock={handleToggleBlock}
        onAddPillar={handleAddPillar}
        onRemovePillar={handleRemovePillar}
        onUpdatePillarIcon={handleUpdatePillarIcon}
        {...customSlide2Handlers}
      />
    )},
    { id: 3, title: 'Público & Métricas', component: (
      <Slide3Audience
        data={eventData}
        theme={theme}
        images={images}
        format={format}
        onUpdateText={handleUpdateText}
        onUpdateImage={handleUpdateImage}
        onToggleBlock={handleToggleBlock}
        onUpdateMediaChannels={handleUpdateMediaChannels}
        onUpdateDemographics={handleUpdateDemographics}
        {...customSlide3Handlers}
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
        onUpdateImage={handleUpdateImage}
        onToggleBlock={handleToggleBlock}
        onAddAttraction={handleAddAttraction}
        onRemoveAttraction={handleRemoveAttraction}
        onAddStructureMetric={handleAddStructureMetric}
        onRemoveStructureMetric={handleRemoveStructureMetric}
        {...customSlide4Handlers}
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
        onToggleBlock={handleToggleBlock}
        onAddTier={handleAddTier}
        onRemoveTier={handleRemoveTier}
        onAddDeliverable={handleAddDeliverable}
        onRemoveDeliverable={handleRemoveDeliverable}
        {...customSlide5Handlers}
      />
    )},
    { id: 6, title: 'Encerramento & Contato', component: (
      <Slide6Closing
        data={eventData}
        theme={theme}
        images={images}
        format={format}
        onUpdateText={handleUpdateText}
        onUpdateImage={handleUpdateImage}
        onAddSponsorLogo={handleAddSponsorLogo}
        onRemoveSponsorLogo={handleRemoveSponsorLogo}
        onToggleBlock={handleToggleBlock}
        {...customSlide6Handlers}
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

          {/* Direct Computer Images / Logo Upload Action */}
          <button
            onClick={() => setShowMediaModal(true)}
            title="Adicionar logomarca, fotos do computador ou marcas de parceiros"
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 hover:text-white font-semibold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400 stroke-[2.5]" />
            <span className="hidden sm:inline">Logos & Fotos (PC)</span>
          </button>

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
            <strong>Edição Direta:</strong> Clique em qualquer texto para editar ou passe o mouse sobre as fotos/logo para trocar por arquivos do seu computador.
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

      {/* Media Upload & Manager Modal */}
      {showMediaModal && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
              <div className="flex items-center gap-3">
                <div
                  className="p-2.5 rounded-xl text-neutral-950 font-bold"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Adicionar Logomarca & Imagens do Computador
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Selecione arquivos do seu dispositivo para atualizar instantaneamente a apresentação
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMediaModal(false)}
                className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-neutral-800 bg-neutral-950/30 text-xs font-semibold px-4 pt-2 gap-2">
              <button
                onClick={() => setMediaModalTab('logo')}
                className={`py-2 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  mediaModalTab === 'logo'
                    ? 'border-amber-400 text-amber-400 font-bold'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Logomarca do Evento</span>
              </button>
              <button
                onClick={() => setMediaModalTab('slides')}
                className={`py-2 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  mediaModalTab === 'slides'
                    ? 'border-amber-400 text-amber-400 font-bold'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Fotos das Lâminas</span>
              </button>
              <button
                onClick={() => setMediaModalTab('sponsors')}
                className={`py-2 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  mediaModalTab === 'sponsors'
                    ? 'border-amber-400 text-amber-400 font-bold'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Logos de Patrocinadores</span>
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* TAB 1: LOGO */}
              {mediaModalTab === 'logo' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Logomarca Oficial
                      </span>
                      {images.logoUrl && (
                        <button
                          type="button"
                          onClick={() => handleUpdateImage('logoUrl', '')}
                          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remover Logo</span>
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      <div className="w-32 h-32 rounded-2xl border border-neutral-700 p-2 shrink-0 flex items-center justify-center relative overflow-hidden bg-[radial-gradient(#444_1px,transparent_1px)] [background-size:8px_8px] bg-neutral-950 shadow-inner">
                        {images.logoUrl ? (
                          <img
                            src={images.logoUrl}
                            alt="Logomarca do Evento"
                            className="max-h-full max-w-full object-contain drop-shadow"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-neutral-500 text-xs text-center">
                            <Camera className="w-8 h-8 mb-1.5 text-neutral-600" />
                            <span>Sem logotipo</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 w-full space-y-3">
                        <label className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm cursor-pointer transition-all shadow-lg active:scale-98">
                          <Upload className="w-4 h-4 stroke-[2.5]" />
                          <span>Selecionar Arquivo no Computador</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  if (typeof reader.result === 'string') {
                                    handleUpdateImage('logoUrl', reader.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          Recomendamos arquivo em formato <strong>PNG com fundo transparente</strong> ou <strong>SVG</strong> para máxima fidelidade visual em fundos escuros e claros.
                        </p>
                        {images.logoUrl && (
                          <button
                            type="button"
                            onClick={() => handleUpdateImage('logoUrl', defaultImages.logoUrl)}
                            className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Restaurar logo de exemplo padrão</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: FOTOS DAS LÂMINAS */}
              {mediaModalTab === 'slides' && (
                <div className="space-y-3">
                  <p className="text-xs text-neutral-400">
                    Selecione as fotos do seu computador para cada lâmina da proposta:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'slide1Cover' as keyof SlideImages, label: 'Lâmina 1: Foto de Capa', sub: 'Hero background principal' },
                      { key: 'slide2Concept' as keyof SlideImages, label: 'Lâmina 2: Foto do Conceito', sub: 'Experiência & lifestyle 360°' },
                      { key: 'slide3Audience' as keyof SlideImages, label: 'Lâmina 3: Fundo de Audiência', sub: 'Público & atmosfera' },
                      { key: 'slide4Attraction1' as keyof SlideImages, label: 'Lâmina 4: Atração 1', sub: 'Palco principal / Headliner' },
                      { key: 'slide4Attraction2' as keyof SlideImages, label: 'Lâmina 4: Atração 2', sub: 'Gastronomia / Espaço VIP' },
                      { key: 'slide4Attraction3' as keyof SlideImages, label: 'Lâmina 4: Atração 3', sub: 'Ativações de Marca' },
                      { key: 'slide6Closing' as keyof SlideImages, label: 'Lâmina 6: Encerramento', sub: 'Fundo da lâmina comercial' },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between gap-3 hover:border-neutral-700 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={images[item.key] as string}
                            alt={item.label}
                            className="w-14 h-10 object-cover rounded-lg border border-neutral-700 shrink-0 shadow-sm"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">{item.label}</div>
                            <div className="text-[10px] text-neutral-400 truncate">{item.sub}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <label className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white cursor-pointer transition-colors">
                            <Upload className="w-3 h-3 text-amber-400" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    if (typeof reader.result === 'string') {
                                      handleUpdateImage(item.key, reader.result);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => handleUpdateImage(item.key, defaultImages[item.key] as string)}
                            title="Restaurar padrão"
                            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: SPONSORS */}
              {mediaModalTab === 'sponsors' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-white block">
                          Logomarcas de Patrocinadores & Marcas Parceiras
                        </span>
                        <span className="text-xs text-neutral-400">
                          Adicione as logos que já apoiam ou que devem constar no material
                        </span>
                      </div>
                      <label className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs cursor-pointer transition-all shadow-md">
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>+ Adicionar Logos do PC</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files) {
                              Array.from(files).forEach((file) => {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  if (typeof reader.result === 'string') {
                                    handleAddSponsorLogo(reader.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              });
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {images.sponsorLogos && images.sponsorLogos.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        {images.sponsorLogos.map((sLogo, idx) => (
                          <div
                            key={idx}
                            className="group/item relative h-16 rounded-xl border border-neutral-700 bg-neutral-900/90 p-2 flex items-center justify-center transition-all hover:border-amber-400"
                          >
                            <img
                              src={sLogo}
                              alt={`Patrocinador ${idx + 1}`}
                              className="max-h-full max-w-full object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveSponsorLogo(idx)}
                              title="Remover logotipo"
                              className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-md transition-transform hover:scale-110 cursor-pointer"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 rounded-xl border border-dashed border-neutral-800 text-center text-xs text-neutral-500">
                        Nenhum logotipo de parceiro ou patrocinador adicionado ainda.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-950/60 flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                Formatos: PNG transparente, JPG, SVG ou WebP
              </span>
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Concluir & Voltar às Lâminas
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

