import React, { useRef } from 'react';
import {
  Layers,
  Music,
  Utensils,
  Sparkles,
  CheckCircle2,
  Camera,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';
import type { EventData, ThemeConfig, SlideImages, LayoutFormat, CustomSlideBlock, AttractionCard } from '../../types.ts';

interface SlideProps {
  data: EventData;
  theme: ThemeConfig;
  images: SlideImages;
  format?: LayoutFormat;
  onUpdateText?: (field: keyof EventData, value: string) => void;
  onUpdateAttraction?: (index: number, field: 'title' | 'description' | 'stats' | 'tag', value: string) => void;
  onUpdateImage?: (key: keyof SlideImages, value: string) => void;
  onToggleBlock?: (field: keyof EventData, show: boolean) => void;
  onAddAttraction?: (attraction: AttractionCard) => void;
  onRemoveAttraction?: (index: number) => void;
  onAddStructureMetric?: (metric: { value: string; label: string }) => void;
  onRemoveStructureMetric?: (index: number) => void;
  onAddCustomBlock?: (block: CustomSlideBlock) => void;
  onRemoveCustomBlock?: (id: string) => void;
  onUpdateCustomBlock?: (id: string, field: 'title' | 'content', value: string) => void;
}

export const Slide4Attractions: React.FC<SlideProps> = ({
  data,
  theme,
  images,
  format = 'widescreen',
  onUpdateText,
  onUpdateAttraction,
  onUpdateImage,
  onToggleBlock,
  onAddAttraction,
  onRemoveAttraction,
  onAddStructureMetric,
  onRemoveStructureMetric,
  onAddCustomBlock,
  onRemoveCustomBlock,
  onUpdateCustomBlock,
}) => {
  const isMobile = format === 'mobile';
  const isA4 = format === 'a4Portrait';
  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleBlur = (field: keyof EventData) => (e: React.FocusEvent<HTMLElement>) => {
    if (onUpdateText) {
      onUpdateText(field, e.currentTarget.innerText.trim());
    }
  };

  const handleAttractionFileChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateImage) {
      const keys: (keyof SlideImages)[] = ['slide4Attraction1', 'slide4Attraction2', 'slide4Attraction3'];
      const targetKey = keys[idx] || 'slide4Attraction1';
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateImage(targetKey, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getAttractionImage = (index: number) => {
    if (index === 0) return images.slide4Attraction1;
    if (index === 1) return images.slide4Attraction2;
    if (index === 2) return images.slide4Attraction3;
    return (data.attractions[index]?.imageUrl) || images.slide4Attraction1;
  };

  const handleCreateAttraction = () => {
    if (onAddAttraction) {
      onAddAttraction({
        title: 'Nova Atração / Experiência',
        tag: 'DESTAQUE EXCLUSIVO',
        description: 'Descreva os detalhes desta nova atração especial, artistas ou espaço proprietário.',
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
        stats: 'Capacidade & Entrega Garantida',
      });
    }
  };

  const handleCreateStructureMetric = () => {
    if (onAddStructureMetric) {
      onAddStructureMetric({
        value: '100%',
        label: 'Nova Métrica',
      });
    }
  };

  const handleCreateBlock = () => {
    if (onAddCustomBlock) {
      onAddCustomBlock({
        id: 'block_s4_' + Date.now(),
        title: 'Novo Balão de Infraestrutura',
        content: 'Insira aqui especificações técnicas, mapa de acessos ou credenciamento.',
      });
    }
  };

  const showIcons = !data.hideAllIcons && data.showIconsSlide4 !== false;
  const showAttractions = data.showAttractions !== false;
  const showMetrics = data.showStructureMetrics !== false;

  const hasExcludedBalloons = !showAttractions || !showMetrics;

  const attractionIcons = [
    <Music key="1" className="w-3.5 h-3.5" />,
    <Utensils key="2" className="w-3.5 h-3.5" />,
    <Layers key="3" className="w-3.5 h-3.5" />,
  ];

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
      {/* Background glow highlights */}
      <div
        className="absolute top-1/3 left-10 w-[35vw] h-[35vw] rounded-full blur-[140px] opacity-15 pointer-events-none"
        style={{ background: theme.primaryColor }}
      />
      <div
        className="absolute bottom-10 right-10 w-[30vw] h-[30vw] rounded-full blur-[120px] opacity-15 pointer-events-none"
        style={{ background: theme.secondaryColor }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between border-b border-white/10 pb-2">
        <div>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border mb-1 backdrop-blur-md"
            style={{
              borderColor: `${theme.primaryColor}55`,
              backgroundColor: 'rgba(0,0,0,0.4)',
              color: theme.primaryColor,
            }}
          >
            {showIcons && <Sparkles className="w-3 h-3" />}
            Line-up & Megaestrutura
          </span>
          <h2
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur('structureTitle')}
            className={`${
              isMobile ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl md:text-3xl'
            } font-black uppercase tracking-tight`}
            style={{ fontFamily: theme.fontFamilyHead }}
          >
            {data.structureTitle}
          </h2>
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur('structureSubtitle')}
            className="text-[10px] sm:text-xs text-neutral-400 mt-0.5 max-w-xl"
          >
            {data.structureSubtitle}
          </p>
        </div>

        <div className="text-right text-[10px] sm:text-[11px] font-mono text-neutral-400 flex flex-col items-end gap-1">
          {onToggleBlock && (
            <button
              type="button"
              onClick={() => onToggleBlock('showIconsSlide4', !showIcons)}
              title={showIcons ? 'Ocultar ícones desta lâmina' : 'Exibir ícones desta lâmina'}
              className="no-print flex items-center gap-1 px-2 py-0.5 rounded bg-black/40 hover:bg-neutral-800 border border-white/10 text-[9px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              {showIcons ? <EyeOff className="w-2.5 h-2.5 text-neutral-400" /> : <Eye className="w-2.5 h-2.5 text-amber-400" />}
              <span>{showIcons ? 'Ocultar Ícones' : 'Exibir Ícones'}</span>
            </button>
          )}
          <span>{data.name}</span>
          <div className="text-neutral-500">LÂMINA 04 / 06</div>
        </div>
      </div>

      {/* Main Attractions Area */}
      <div className="relative z-10 my-auto space-y-3">
        {showAttractions && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Atrações Principais ({data.attractions.length})
              </span>
              {onAddAttraction && (
                <button
                  type="button"
                  onClick={handleCreateAttraction}
                  className="no-print flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-[10px] font-semibold border border-white/10 transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Adicionar Atração</span>
                </button>
              )}
            </div>

            <div
              className={`grid gap-3 items-stretch ${
                isMobile
                  ? 'flex flex-col gap-2.5'
                  : data.attractions.length === 1
                  ? 'grid-cols-1 max-w-xl mx-auto'
                  : data.attractions.length === 2
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-1 md:grid-cols-3'
              }`}
            >
              {data.attractions.map((attraction, idx) => (
                <div
                  key={idx}
                  className={`group relative rounded-xl border backdrop-blur-md overflow-hidden flex transition-all hover:border-amber-400/40 shadow-lg ${
                    isMobile ? 'flex-row h-28' : 'flex-col'
                  }`}
                  style={{
                    backgroundColor: theme.cardBg,
                    borderColor: theme.cardBorder,
                  }}
                >
                  {/* Delete Attraction button on hover */}
                  {onRemoveAttraction && (
                    <button
                      type="button"
                      onClick={() => onRemoveAttraction(idx)}
                      title="Excluir este balão de atração"
                      className="no-print absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 p-1 rounded-md text-red-400 hover:text-red-200 hover:bg-red-500/20 transition-all cursor-pointer z-30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Attraction Image */}
                  <div
                    className={`relative overflow-hidden shrink-0 group/img ${
                      isMobile ? 'w-24 sm:w-28' : 'h-28 sm:h-32 md:h-36 w-full'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRefs[idx]}
                      accept="image/*"
                      onChange={handleAttractionFileChange(idx)}
                      className="hidden"
                    />
                    <img
                      src={getAttractionImage(idx)}
                      alt={attraction.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                    {/* Camera Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRefs[idx]?.current?.click()}
                      title="Trocar imagem pelo computador"
                      className="no-print absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer shadow-md"
                    >
                      <Camera className="w-3 h-3 text-amber-400" />
                    </button>

                    <div className="absolute bottom-2 left-2">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md border border-white/20"
                        style={{ color: theme.primaryColor }}
                      >
                        {showIcons && attractionIcons[idx % attractionIcons.length]}
                        {attraction.tag}
                      </span>
                    </div>
                  </div>

                  {/* Attraction Content Body */}
                  <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h3
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          onUpdateAttraction &&
                          onUpdateAttraction(idx, 'title', e.currentTarget.innerText.trim())
                        }
                        className="text-xs sm:text-sm font-bold tracking-tight text-white mb-0.5 truncate outline-none"
                      >
                        {attraction.title}
                      </h3>
                      <p
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          onUpdateAttraction &&
                          onUpdateAttraction(idx, 'description', e.currentTarget.innerText.trim())
                        }
                        className="text-[10px] sm:text-[11px] text-neutral-300 leading-snug line-clamp-2 outline-none"
                      >
                        {attraction.description}
                      </p>
                    </div>

                    {/* Stats Footer */}
                    <div className="mt-1.5 pt-1 border-t border-white/10 flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1 text-neutral-300 font-medium truncate">
                        {showIcons && (
                          <CheckCircle2
                            className="w-3 h-3 shrink-0"
                            style={{ color: theme.primaryColor }}
                          />
                        )}
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            onUpdateAttraction &&
                            onUpdateAttraction(idx, 'stats', e.currentTarget.innerText.trim())
                          }
                          className="truncate outline-none"
                        >
                          {attraction.stats}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Balloons Added by User on Slide 4 */}
        {data.customBlocksSlide4 && data.customBlocksSlide4.length > 0 && (
          <div className="grid gap-3 pt-2 grid-cols-1 sm:grid-cols-2">
            {data.customBlocksSlide4.map((b) => (
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

      {/* Bottom Structural Metrics Bar */}
      {showMetrics && (
        <div className="space-y-1 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-[10px] text-neutral-400">
            <span className="font-bold uppercase tracking-wider">Métricas de Infraestrutura</span>
            <div className="flex items-center gap-2">
              {onAddStructureMetric && (
                <button
                  type="button"
                  onClick={handleCreateStructureMetric}
                  className="no-print text-amber-400 hover:text-amber-300 flex items-center gap-0.5 cursor-pointer font-medium"
                >
                  <Plus className="w-2.5 h-2.5" /> <span>Adicionar Métrica</span>
                </button>
              )}
              {onToggleBlock && (
                <button
                  type="button"
                  onClick={() => onToggleBlock('showStructureMetrics', false)}
                  title="Excluir balão de métricas de infraestrutura"
                  className="no-print text-neutral-500 hover:text-red-400 flex items-center gap-0.5 cursor-pointer font-medium"
                >
                  <Trash2 className="w-2.5 h-2.5" /> <span>Ocultar Barra</span>
                </button>
              )}
            </div>
          </div>

          <div
            className={`relative z-10 grid gap-2 sm:gap-2.5 ${
              isMobile
                ? 'grid-cols-2'
                : data.structureMetrics.length <= 2
                ? 'grid-cols-2'
                : data.structureMetrics.length === 3
                ? 'grid-cols-3'
                : 'grid-cols-2 sm:grid-cols-4'
            }`}
          >
            {data.structureMetrics.map((metric, idx) => (
              <div
                key={idx}
                className="group/metric relative p-2 sm:p-2.5 rounded-lg border backdrop-blur-md flex items-center justify-between"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  borderColor: 'rgba(255,255,255,0.08)',
                }}
              >
                <div>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      if (data.structureMetrics) {
                        data.structureMetrics[idx].value = e.currentTarget.innerText.trim();
                      }
                    }}
                    className="text-xs sm:text-sm font-black tracking-tight outline-none"
                    style={{ color: theme.primaryColor }}
                  >
                    {metric.value}
                  </div>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      if (data.structureMetrics) {
                        data.structureMetrics[idx].label = e.currentTarget.innerText.trim();
                      }
                    }}
                    className="text-[10px] text-neutral-400 font-medium outline-none"
                  >
                    {metric.label}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {onRemoveStructureMetric && (
                    <button
                      type="button"
                      onClick={() => onRemoveStructureMetric(idx)}
                      title="Excluir esta métrica"
                      className="opacity-0 group-hover/metric:opacity-100 p-0.5 rounded text-neutral-500 hover:text-red-400 transition-all cursor-pointer"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  )}
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Restoration Toolbar */}
      <div className="no-print relative z-10 flex items-center justify-between flex-wrap gap-2 pt-1 text-[9px] sm:text-[10px] text-neutral-400">
        <div className="flex items-center gap-1.5 flex-wrap">
          {hasExcludedBalloons && onToggleBlock && (
            <>
              {!showAttractions && (
                <button
                  onClick={() => onToggleBlock('showAttractions', true)}
                  className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" /> <span>+ Balões de Atrações</span>
                </button>
              )}
              {!showMetrics && (
                <button
                  onClick={() => onToggleBlock('showStructureMetrics', true)}
                  className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" /> <span>+ Métricas de Infraestrutura</span>
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
              <span>+ Novo Balão na Estrutura</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
