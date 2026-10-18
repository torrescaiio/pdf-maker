import React, { useRef } from 'react';
import {
  Sparkles,
  Flame,
  Users,
  Quote,
  Compass,
  Camera,
  Upload,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Layers,
} from 'lucide-react';
import type { EventData, ThemeConfig, SlideImages, LayoutFormat, CustomSlideBlock, ExperiencePillar } from '../../types.ts';
import { IconPicker, renderSlideIcon } from '../../utils/iconMap.tsx';

interface SlideProps {
  data: EventData;
  theme: ThemeConfig;
  images: SlideImages;
  format?: LayoutFormat;
  onUpdateText?: (field: keyof EventData, value: string) => void;
  onUpdatePillar?: (index: number, field: 'title' | 'description', value: string) => void;
  onUpdatePillarIcon?: (index: number, iconName: string) => void;
  onUpdateImage?: (key: keyof SlideImages, value: string) => void;
  onToggleBlock?: (field: keyof EventData, show: boolean) => void;
  onAddPillar?: (pillar: ExperiencePillar) => void;
  onRemovePillar?: (index: number) => void;
  onAddCustomBlock?: (block: CustomSlideBlock) => void;
  onRemoveCustomBlock?: (id: string) => void;
  onUpdateCustomBlock?: (id: string, field: 'title' | 'content', value: string) => void;
}

export const Slide2Concept: React.FC<SlideProps> = ({
  data,
  theme,
  images,
  format = 'widescreen',
  onUpdateText,
  onUpdatePillar,
  onUpdatePillarIcon,
  onUpdateImage,
  onToggleBlock,
  onAddPillar,
  onRemovePillar,
  onAddCustomBlock,
  onRemoveCustomBlock,
  onUpdateCustomBlock,
}) => {
  const isMobile = format === 'mobile';
  const isA4 = format === 'a4Portrait';
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateImage) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateImage('slide2Concept', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlur = (field: keyof EventData) => (e: React.FocusEvent<HTMLElement>) => {
    if (onUpdateText) {
      onUpdateText(field, e.currentTarget.innerText.trim());
    }
  };

  const handleCreateNewPillar = () => {
    if (onAddPillar) {
      onAddPillar({
        title: 'Novo Pilar de Experiência',
        description: 'Descreva aqui o novo pilar, diferencial ou valor único do evento.',
        iconName: 'Sparkles',
      });
    }
  };

  const handleCreateBlock = () => {
    if (onAddCustomBlock) {
      onAddCustomBlock({
        id: 'block_s2_' + Date.now(),
        title: 'Novo Balão de Conceito',
        content: 'Insira aqui uma nova área de conteúdo, depoimento ou pilar exclusivo da experiência.',
      });
    }
  };

  const showIcons = !data.hideAllIcons && data.showIconsSlide2 !== false;
  const showConceptBadge = data.showConceptBadge !== false;
  const showConceptTitle = data.showConceptTitle !== false;
  const showStory = data.showConceptStory !== false;
  const showManifesto = data.showManifesto !== false;
  const showImage = data.showConceptImage !== false;
  const showConceptImageBadge = data.showConceptImageBadge !== false;
  const showPillars = data.showPillars !== false;

  const hasExcludedBalloons =
    !showConceptBadge ||
    !showConceptTitle ||
    !showStory ||
    !showManifesto ||
    !showImage ||
    !showConceptImageBadge ||
    !showPillars;

  const iconMap: Record<string, React.ReactNode> = {
    Sparkles: <Sparkles className="w-4 h-4" />,
    Flame: <Flame className="w-4 h-4" />,
    Users: <Users className="w-4 h-4" />,
    Compass: <Compass className="w-4 h-4" />,
  };

  const aspectClass = isMobile ? 'aspect-[9/16]' : isA4 ? 'aspect-[210/297]' : 'aspect-[16/9]';

  return (
    <div
      className={`slide-container-print relative w-full h-full ${aspectClass} flex flex-col justify-between overflow-hidden ${
        isMobile ? 'p-5 sm:p-6' : isA4 ? 'p-8 sm:p-10' : 'p-6 sm:p-8 md:p-9 lg:p-10'
      } select-text text-white shadow-2xl transition-all`}
      style={{
        backgroundColor: theme.bgColor,
        backgroundImage: theme.bgGradient,
        fontFamily: theme.fontFamilyBody,
      }}
    >
      {/* Background ambient glows */}
      <div
        className="absolute top-1/4 right-1/4 w-[35vw] h-[35vw] rounded-full blur-[130px] opacity-15 pointer-events-none"
        style={{ background: theme.primaryColor }}
      />
      <div
        className="absolute bottom-10 left-10 w-[30vw] h-[30vw] rounded-full blur-[110px] opacity-15 pointer-events-none"
        style={{ background: theme.secondaryColor }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between border-b border-white/10 pb-2">
        <div>
          {showConceptBadge && (
            <div className="group/badge inline-flex items-center gap-1 mb-1">
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={handleBlur('conceptBadge')}
                title="Clique para editar este texto"
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border backdrop-blur-md outline-none hover:border-amber-400 cursor-text"
                style={{
                  borderColor: `${theme.primaryColor}55`,
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  color: theme.primaryColor,
                }}
              >
                {showIcons && <Sparkles className="w-3 h-3" />}
                {data.conceptBadge || 'Conceito & Essência'}
              </span>
              {onToggleBlock && (
                <button
                  type="button"
                  onClick={() => onToggleBlock('showConceptBadge', false)}
                  title="Excluir este balão"
                  className="no-print opacity-0 group-hover/badge:opacity-100 p-0.5 rounded text-neutral-400 hover:text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          )}
          {showConceptTitle && (
            <div className="group/title flex items-center gap-2">
              <h2
                contentEditable
                suppressContentEditableWarning
                onBlur={handleBlur('conceptTitle')}
                className={`${
                  isMobile ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl md:text-3xl'
                } font-black uppercase tracking-tight`}
                style={{ fontFamily: theme.fontFamilyHead }}
              >
                {data.conceptTitle}
              </h2>
              {onToggleBlock && (
                <button
                  type="button"
                  onClick={() => onToggleBlock('showConceptTitle', false)}
                  title="Excluir título do conceito"
                  className="no-print opacity-0 group-hover/title:opacity-100 p-0.5 rounded text-neutral-400 hover:text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur('conceptSubtitle')}
            className="text-[10px] sm:text-xs text-neutral-400 mt-0.5 max-w-xl"
          >
            {data.conceptSubtitle}
          </p>
        </div>

        <div className="text-right text-[10px] sm:text-[11px] font-mono text-neutral-400 flex flex-col items-end gap-1">
          {/* Toggle Icons Button */}
          {onToggleBlock && (
            <button
              type="button"
              onClick={() => onToggleBlock('showIconsSlide2', !showIcons)}
              title={showIcons ? 'Ocultar ícones desta lâmina' : 'Exibir ícones desta lâmina'}
              className="no-print flex items-center gap-1 px-2 py-0.5 rounded bg-black/40 hover:bg-neutral-800 border border-white/10 text-[9px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              {showIcons ? <EyeOff className="w-2.5 h-2.5 text-neutral-400" /> : <Eye className="w-2.5 h-2.5 text-amber-400" />}
              <span>{showIcons ? 'Ocultar Ícones' : 'Exibir Ícones'}</span>
            </button>
          )}
          <span>{data.name}</span>
          <div className="text-neutral-500">LÂMINA 02 / 06</div>
        </div>
      </div>

      {/* Main Content Area */}
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {isMobile ? (
        /* Mobile Vertical Stack */
        <div className="relative z-10 flex-1 flex flex-col justify-between py-2 space-y-2.5">
          {/* Top Image Card */}
          {showImage && (
            <div className="group/img relative rounded-xl overflow-hidden border shadow-lg aspect-[16/9] w-full shrink-0"
              style={{ borderColor: theme.cardBorder }}
            >
              <img
                src={images.slide2Concept}
                alt="Conceito do Evento"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="no-print absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 hover:bg-black text-[10px] text-white border border-white/20 transition-all cursor-pointer"
              >
                <Camera className="w-3 h-3 text-amber-400" />
                <span>Trocar</span>
              </button>

              {onToggleBlock && (
                <button
                  type="button"
                  onClick={() => onToggleBlock('showConceptImage', false)}
                  title="Excluir balão de imagem"
                  className="no-print absolute top-2 left-2 p-1 rounded-md text-red-400 bg-red-950/60 border border-red-500/30 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          )}

          {/* Story Card */}
          {showStory && (
            <div
              className="group/story relative p-3 rounded-lg border backdrop-blur-md"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">
                  A Atmosfera & Por Que É Único
                </h3>
                {onToggleBlock && (
                  <button
                    type="button"
                    onClick={() => onToggleBlock('showConceptStory', false)}
                    title="Excluir este balão de história"
                    className="opacity-0 group-hover/story:opacity-100 text-red-400 hover:text-red-200 p-0.5 rounded transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={handleBlur('conceptStory')}
                className="text-[11px] leading-relaxed text-neutral-200"
              >
                {data.conceptStory}
              </p>
            </div>
          )}

          {/* Manifesto Quote */}
          {showManifesto && (
            <div
              className="group/manifesto relative p-2.5 rounded-lg border-l-3 backdrop-blur-md bg-white/5 border border-white/10"
              style={{ borderLeftColor: theme.primaryColor }}
            >
              {onToggleBlock && (
                <button
                  type="button"
                  onClick={() => onToggleBlock('showManifesto', false)}
                  title="Excluir este balão de manifesto"
                  className="absolute top-1.5 right-1.5 opacity-0 group-hover/manifesto:opacity-100 text-red-400 hover:text-red-200 p-0.5 rounded transition-opacity cursor-pointer"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              )}
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={handleBlur('manifestoQuote')}
                className="text-[11px] italic font-serif leading-tight pr-5"
                style={{ color: theme.primaryColor }}
              >
                "{data.manifestoQuote}"
              </p>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={handleBlur('manifestoAuthor')}
                className="text-[9px] uppercase text-neutral-400 mt-1 font-mono"
              >
                — {data.manifestoAuthor}
              </div>
            </div>
          )}

          {/* Pillars */}
          {showPillars && (
            <div className="space-y-1.5 pt-1 border-t border-white/10">
              {data.pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="group/pillar relative p-1.5 rounded-md border flex items-center justify-between gap-2"
                  style={{
                    backgroundColor: theme.cardBg,
                    borderColor: theme.cardBorder,
                  }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {showIcons && (
                      <IconPicker
                        currentIcon={pillar.iconName}
                        onSelectIcon={(name) => onUpdatePillarIcon?.(idx, name)}
                        accentColor={theme.primaryColor}
                        className="shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        className="text-[10px] font-bold uppercase truncate"
                        style={{ color: theme.primaryColor }}
                      >
                        {pillar.title}
                      </div>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        className="text-[9px] text-neutral-300 truncate"
                      >
                        {pillar.description}
                      </div>
                    </div>
                  </div>

                  {onRemovePillar && (
                    <button
                      type="button"
                      onClick={() => onRemovePillar(idx)}
                      title="Excluir este pilar"
                      className="opacity-0 group-hover/pillar:opacity-100 text-neutral-500 hover:text-red-400 p-0.5 rounded transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Widescreen / A4 Layout */
        <div className="relative z-10 flex-1 flex flex-col justify-between my-auto space-y-3">
          {/* Top Grid: Narrative & Manifesto (Left) + Lifestyle Image (Right) */}
          <div className={`grid gap-4 items-stretch ${
            !showImage
              ? 'grid-cols-1'
              : !showStory && !showManifesto
              ? 'grid-cols-1'
              : 'grid-cols-1 md:grid-cols-12'
          }`}>
            {/* Left column - Narrative & Manifesto */}
            {(showStory || showManifesto) && (
              <div className={`${showImage ? 'md:col-span-7' : 'w-full'} space-y-3`}>
                {showStory && (
                  <div
                    className="group/story relative p-3.5 sm:p-4 rounded-xl border backdrop-blur-md transition-all shadow-lg"
                    style={{
                      backgroundColor: theme.cardBg,
                      borderColor: theme.cardBorder,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                        A Atmosfera & Por Que É Único
                      </h3>
                      {onToggleBlock && (
                        <button
                          type="button"
                          onClick={() => onToggleBlock('showConceptStory', false)}
                          title="Excluir este balão de história"
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-red-400 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 opacity-0 group-hover/story:opacity-100 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                          <span>Excluir Balão</span>
                        </button>
                      )}
                    </div>
                    <p
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={handleBlur('conceptStory')}
                      className="text-xs sm:text-[13px] leading-relaxed text-neutral-200"
                    >
                      {data.conceptStory}
                    </p>
                  </div>
                )}

                {/* Manifesto Quote Card */}
                {showManifesto && (
                  <div
                    className="group/manifesto relative p-3 sm:p-3.5 rounded-xl border-l-4 backdrop-blur-md bg-white/5 border border-white/10"
                    style={{ borderLeftColor: theme.primaryColor }}
                  >
                    {showIcons && (
                      <Quote
                        className="w-6 h-6 opacity-20 absolute top-2 right-2 pointer-events-none"
                        style={{ color: theme.primaryColor }}
                      />
                    )}

                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-mono">
                        Manifesto Oficial
                      </span>
                      {onToggleBlock && (
                        <button
                          type="button"
                          onClick={() => onToggleBlock('showManifesto', false)}
                          title="Excluir este balão de manifesto"
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-red-400 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 opacity-0 group-hover/manifesto:opacity-100 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                          <span>Excluir Balão</span>
                        </button>
                      )}
                    </div>

                    <p
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={handleBlur('manifestoQuote')}
                      className="text-xs sm:text-sm italic font-serif leading-snug"
                      style={{ color: theme.primaryColor }}
                    >
                      "{data.manifestoQuote}"
                    </p>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={handleBlur('manifestoAuthor')}
                      className="text-[10px] uppercase tracking-wider text-neutral-400 mt-1 font-mono font-medium"
                    >
                      — {data.manifestoAuthor}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Right column - Lifestyle Image */}
            {showImage && (
              <div className={`${showStory || showManifesto ? 'md:col-span-5' : 'w-full'} relative group/img`}>
                <div
                  className="relative rounded-xl overflow-hidden border shadow-xl aspect-[16/10] w-full"
                  style={{ borderColor: theme.cardBorder }}
                >
                  <img
                    src={images.slide2Concept}
                    alt="Conceito do Evento"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    title="Escolher nova imagem de conceito do seu computador"
                    className="no-print absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 hover:bg-black border border-white/20 hover:border-amber-400 text-xs text-white transition-all shadow-lg cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>Trocar Foto (PC)</span>
                  </button>

                  {onToggleBlock && (
                    <button
                      type="button"
                      onClick={() => onToggleBlock('showConceptImage', false)}
                      title="Excluir este balão de imagem"
                      className="no-print absolute top-2 left-2 p-1.5 rounded-lg text-red-400 bg-red-950/70 border border-red-500/40 opacity-0 group-hover/img:opacity-100 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}

                  {showConceptImageBadge && (
                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between group/ib z-20">
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={handleBlur('conceptImageBadge')}
                        title="Clique para editar este balão"
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md border border-white/25 text-white outline-none hover:border-amber-400 cursor-text shadow-sm"
                      >
                        {data.conceptImageBadge || 'Experiência 360°'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={handleBlur('conceptImageSubtitle')}
                          title="Clique para editar este subtítulo"
                          className="text-[10px] font-mono text-neutral-300 outline-none hover:text-white cursor-text"
                        >
                          {data.conceptImageSubtitle || 'Imersão Completa'}
                        </span>
                        {onToggleBlock && (
                          <button
                            type="button"
                            onClick={() => onToggleBlock('showConceptImageBadge', false)}
                            title="Excluir este balão sobre a foto"
                            className="no-print opacity-0 group-hover/ib:opacity-100 p-0.5 rounded bg-black/80 text-neutral-400 hover:text-red-400 transition-opacity cursor-pointer shadow"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Experience Pillars Bottom Grid */}
          {showPillars && (
            <div className="relative z-10 pt-2.5 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Pilares da Experiência ({data.pillars.length})
                </span>
                {onAddPillar && (
                  <button
                    type="button"
                    onClick={handleCreateNewPillar}
                    className="no-print flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-[10px] font-semibold border border-white/10 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Adicionar Pilar</span>
                  </button>
                )}
              </div>

              <div
                className={`grid gap-3 ${
                  data.pillars.length === 1
                    ? 'grid-cols-1 max-w-lg mx-auto'
                    : data.pillars.length === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : data.pillars.length === 3
                    ? 'grid-cols-1 sm:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                }`}
              >
                {data.pillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="group/pillar relative p-2.5 sm:p-3 rounded-lg border backdrop-blur-md flex items-start gap-2.5 transition-all shadow-md"
                    style={{
                      backgroundColor: theme.cardBg,
                      borderColor: theme.cardBorder,
                    }}
                  >
                    {/* Delete Pillar button on hover */}
                    {onRemovePillar && (
                      <button
                        type="button"
                        onClick={() => onRemovePillar(idx)}
                        title="Excluir este balão/pilar"
                        className="no-print absolute top-1.5 right-1.5 opacity-0 group-hover/pillar:opacity-100 p-1 rounded text-red-400 hover:text-red-200 hover:bg-red-500/20 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}

                    {showIcons && (
                      <IconPicker
                        currentIcon={pillar.iconName}
                        onSelectIcon={(name) => onUpdatePillarIcon?.(idx, name)}
                        accentColor={theme.primaryColor}
                        className="shrink-0"
                      />
                    )}
                    <div className="pr-4 min-w-0">
                      <h4
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          onUpdatePillar &&
                          onUpdatePillar(idx, 'title', e.currentTarget.innerText.trim())
                        }
                        className="text-[11px] sm:text-xs font-bold uppercase tracking-wider outline-none"
                        style={{ color: theme.primaryColor }}
                      >
                        {pillar.title}
                      </h4>
                      <p
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          onUpdatePillar &&
                          onUpdatePillar(idx, 'description', e.currentTarget.innerText.trim())
                        }
                        className="text-[10px] sm:text-[11px] text-neutral-300 mt-0.5 leading-tight outline-none"
                      >
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Balloons Added by User on Slide 2 */}
          {data.customBlocksSlide2 && data.customBlocksSlide2.length > 0 && (
            <div className="grid gap-3 pt-2 grid-cols-1 sm:grid-cols-2">
              {data.customBlocksSlide2.map((b) => (
                <div
                  key={b.id}
                  className="group/cb relative p-3 rounded-xl border backdrop-blur-md shadow-lg"
                  style={{
                    backgroundColor: theme.cardBg,
                    borderColor: theme.cardBorder,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => onUpdateCustomBlock?.(b.id, 'title', e.currentTarget.innerText.trim())}
                      className="text-xs font-bold uppercase tracking-wider outline-none"
                      style={{ color: theme.primaryColor }}
                    >
                      {b.title}
                    </span>
                    {onRemoveCustomBlock && (
                      <button
                        type="button"
                        onClick={() => onRemoveCustomBlock(b.id)}
                        title="Excluir este balão"
                        className="p-1 rounded text-red-400 hover:text-red-200 hover:bg-red-500/20 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdateCustomBlock?.(b.id, 'content', e.currentTarget.innerText.trim())}
                    className="text-xs text-neutral-200 outline-none leading-snug"
                  >
                    {b.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Restoration Toolbar */}
      <div className="no-print relative z-10 flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-white/10 text-[9px] sm:text-[10px] text-neutral-400">
        <div className="flex items-center gap-1.5 flex-wrap">
          {hasExcludedBalloons && onToggleBlock && (
            <>
              {!showConceptBadge && (
                <button
                  onClick={() => onToggleBlock('showConceptBadge', true)}
                  className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" /> <span>+ Balão do Topo</span>
                </button>
              )}
              {!showConceptTitle && (
                <button
                  onClick={() => onToggleBlock('showConceptTitle', true)}
                  className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" /> <span>+ Título do Conceito</span>
                </button>
              )}
              {!showStory && (
                <button
                  onClick={() => onToggleBlock('showConceptStory', true)}
                  className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" /> <span>+ Balão História</span>
                </button>
              )}
              {!showManifesto && (
                <button
                  onClick={() => onToggleBlock('showManifesto', true)}
                  className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" /> <span>+ Balão Manifesto</span>
                </button>
              )}
              {!showImage && (
                <button
                  onClick={() => onToggleBlock('showConceptImage', true)}
                  className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" /> <span>+ Foto de Conceito</span>
                </button>
              )}
              {showImage && !showConceptImageBadge && (
                <button
                  onClick={() => onToggleBlock('showConceptImageBadge', true)}
                  className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" /> <span>+ Balão sobre a Foto</span>
                </button>
              )}
              {!showPillars && (
                <button
                  onClick={() => onToggleBlock('showPillars', true)}
                  className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" /> <span>+ Pilares de Experiência</span>
                </button>
              )}
            </>
          )}

          {onAddCustomBlock && (
            <button
              onClick={handleCreateBlock}
              className="px-2 py-0.5 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-white/10 flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>+ Novo Balão no Conceito</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
