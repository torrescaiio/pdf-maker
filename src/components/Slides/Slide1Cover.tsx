import React, { useRef } from 'react';
import {
  Calendar,
  MapPin,
  Award,
  ShieldCheck,
  Sparkles,
  Upload,
  Camera,
  Trash2,
  Plus,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { EventData, ThemeConfig, SlideImages, LayoutFormat, CustomSlideBlock } from '../../types.ts';

interface SlideProps {
  data: EventData;
  theme: ThemeConfig;
  images: SlideImages;
  format?: LayoutFormat;
  onUpdateText?: (field: keyof EventData, value: string) => void;
  onUpdateImage?: (key: keyof SlideImages, value: string) => void;
  onToggleBlock?: (field: keyof EventData, show: boolean) => void;
  onAddCustomBlock?: (block: CustomSlideBlock) => void;
  onRemoveCustomBlock?: (id: string) => void;
  onUpdateCustomBlock?: (id: string, field: 'title' | 'content', value: string) => void;
}

export const Slide1Cover: React.FC<SlideProps> = ({
  data,
  theme,
  images,
  format = 'widescreen',
  onUpdateText,
  onUpdateImage,
  onToggleBlock,
  onAddCustomBlock,
  onRemoveCustomBlock,
  onUpdateCustomBlock,
}) => {
  const isMobile = format === 'mobile';
  const isA4 = format === 'a4Portrait';
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleBlur = (field: keyof EventData) => (e: React.FocusEvent<HTMLElement>) => {
    if (onUpdateText) {
      onUpdateText(field, e.currentTarget.innerText.trim());
    }
  };

  const handleFileChange = (key: keyof SlideImages) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateImage) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateImage(key, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateImage) {
      onUpdateImage('logoUrl', '');
    }
  };

  const handleCreateBlock = () => {
    if (onAddCustomBlock) {
      onAddCustomBlock({
        id: 'block_s1_' + Date.now(),
        title: 'Novo Destaque da Capa',
        content: 'Insira aqui uma informação adicional de impacto para a capa da proposta.',
      });
    }
  };

  // Visibility and icon flags
  const showIcons = !data.hideAllIcons && data.showIconsSlide1 !== false;
  const showBadge = data.showCoverBadge !== false;
  const showCategory = data.showCoverCategory !== false;
  const showEdition = data.showCoverEdition !== false;
  const showSubtitle = data.showCoverSubtitle !== false;
  const showDate = data.showCoverMetaDate !== false;
  const showVenue = data.showCoverMetaVenue !== false;

  const hasExcludedBalloons = !showBadge || !showCategory || !showEdition || !showSubtitle || !showDate || !showVenue;

  const aspectClass = isMobile ? 'aspect-[9/16]' : isA4 ? 'aspect-[210/297]' : 'aspect-[16/9]';

  return (
    <div
      className={`slide-container-print group/slide relative w-full h-full ${aspectClass} flex flex-col justify-between overflow-hidden ${
        isMobile ? 'p-6 sm:p-7' : isA4 ? 'p-8 sm:p-10' : 'p-6 sm:p-8 md:p-10'
      } select-text text-white shadow-2xl transition-all`}
      style={{
        backgroundColor: theme.bgColor,
        backgroundImage: `linear-gradient(135deg, rgba(9, 9, 11, 0.94) 0%, rgba(15, 15, 20, 0.75) 50%, rgba(9, 9, 11, 0.96) 100%), url('${images.slide1Cover}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: theme.fontFamilyBody,
      }}
    >
      {/* Hidden file inputs for direct computer upload */}
      <input
        type="file"
        ref={logoInputRef}
        accept="image/*"
        onChange={handleFileChange('logoUrl')}
        className="hidden"
      />
      <input
        type="file"
        ref={coverInputRef}
        accept="image/*"
        onChange={handleFileChange('slide1Cover')}
        className="hidden"
      />

      {/* Decorative ambient gradients */}
      <div
        className="absolute top-0 right-0 w-[45vw] h-[45vw] rounded-full blur-[140px] opacity-25 pointer-events-none"
        style={{ background: theme.primaryColor }}
      />
      <div
        className="absolute bottom-0 left-0 w-[35vw] h-[35vw] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ background: theme.secondaryColor }}
      />

      {/* Slide Top Bar */}
      <div className="relative z-10 flex items-center justify-between w-full">
        {/* Logo / Badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            onClick={() => logoInputRef.current?.click()}
            title="Clique para adicionar ou trocar a logomarca do seu computador"
            className="group/logo relative cursor-pointer"
          >
            {images.logoUrl ? (
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl overflow-hidden border border-white/20 p-1 bg-black/40 backdrop-blur-md flex items-center justify-center shadow-lg transition-transform group-hover/logo:scale-105">
                <img
                  src={images.logoUrl}
                  alt="Logo do Evento"
                  className="h-full w-full object-contain rounded-xl"
                />
              </div>
            ) : (
              <div
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex flex-col items-center justify-center font-bold text-xs border shadow-lg transition-transform group-hover/logo:scale-105 p-1 text-center"
                style={{
                  borderColor: `${theme.primaryColor}66`,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: theme.primaryColor,
                }}
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
                <span className="text-[8px] sm:text-[9px] uppercase font-bold">+ Logo</span>
              </div>
            )}

            {/* Hover overlay on logo */}
            <div className="no-print absolute inset-0 bg-black/75 rounded-2xl opacity-0 group-hover/logo:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity text-white text-[9px] font-bold">
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Trocar</span>
              {images.logoUrl && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  title="Remover logomarca"
                  className="p-1 rounded-full bg-rose-600/80 hover:bg-rose-500 text-white mt-0.5"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1">
            {showBadge && (
              <div className="group/badge relative inline-flex items-center">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border backdrop-blur-md pr-6"
                  style={{
                    borderColor: `${theme.primaryColor}55`,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: theme.primaryColor,
                  }}
                >
                  {showIcons && <ShieldCheck className="w-3.5 h-3.5 shrink-0" />}
                  Proposta Comercial & Media Kit
                </span>
                {onToggleBlock && (
                  <button
                    type="button"
                    onClick={() => onToggleBlock('showCoverBadge', false)}
                    title="Excluir este balão/emblema"
                    className="absolute right-1 opacity-0 group-hover/badge:opacity-100 p-0.5 rounded text-red-400 hover:text-red-200 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {showCategory && (
              <div className="group/cat relative flex items-center">
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleBlur('category')}
                  className="text-xs uppercase tracking-wider text-neutral-400 font-semibold pr-5"
                >
                  {data.category}
                </div>
                {onToggleBlock && (
                  <button
                    type="button"
                    onClick={() => onToggleBlock('showCoverCategory', false)}
                    title="Excluir categoria"
                    className="opacity-0 group-hover/cat:opacity-100 p-0.5 rounded text-neutral-500 hover:text-red-400 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Direct Cover Photo Upload Button */}
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            title="Escolher nova foto de capa do seu computador"
            className="no-print flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 hover:border-amber-400 backdrop-blur-md text-xs font-semibold text-neutral-200 hover:text-white transition-all shadow-lg cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Trocar Capa (PC)</span>
          </button>

          {/* Toggle Icons Button */}
          {onToggleBlock && (
            <button
              type="button"
              onClick={() => onToggleBlock('showIconsSlide1', !showIcons)}
              title={showIcons ? 'Ocultar ícones desta lâmina' : 'Exibir ícones desta lâmina'}
              className="no-print p-1.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-neutral-300 hover:text-white transition-all cursor-pointer"
            >
              {showIcons ? <EyeOff className="w-3.5 h-3.5 text-neutral-400" /> : <Eye className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-mono text-neutral-300">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.primaryColor }} />
            CONFIDENCIAL
          </div>
        </div>
      </div>

      {/* Slide Center Hero */}
      <div className={`relative z-10 my-auto ${isMobile ? 'py-4' : 'py-6'} max-w-4xl space-y-3`}>
        {showEdition && (
          <div className="group/ed relative inline-flex items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-white/10 border border-white/15 backdrop-blur-md text-neutral-200 pr-6">
              {showIcons && <Award className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primaryColor }} />}
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={handleBlur('edition')}
              >
                {data.edition}
              </span>
            </div>
            {onToggleBlock && (
              <button
                type="button"
                onClick={() => onToggleBlock('showCoverEdition', false)}
                title="Excluir balão de edição"
                className="absolute right-1 opacity-0 group-hover/ed:opacity-100 p-0.5 rounded text-neutral-500 hover:text-red-400 transition-opacity cursor-pointer"
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        )}

        <h1
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur('name')}
          className={`${
            isMobile
              ? 'text-2xl sm:text-3xl leading-tight'
              : isA4
              ? 'text-3xl sm:text-4xl lg:text-5xl leading-tight'
              : 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05]'
          } font-black uppercase tracking-tight drop-shadow-md break-words`}
          style={{
            fontFamily: theme.fontFamilyHead,
            color: '#FFFFFF',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
          }}
        >
          {data.name}
        </h1>

        {showSubtitle && (
          <div className="group/sub relative flex items-start">
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={handleBlur('subtitle')}
              className={`${
                isMobile ? 'text-xs sm:text-sm mt-1' : 'text-sm sm:text-base md:text-lg mt-2'
              } font-medium max-w-2xl leading-relaxed pr-6`}
              style={{ color: theme.primaryColor }}
            >
              {data.subtitle}
            </div>
            {onToggleBlock && (
              <button
                type="button"
                onClick={() => onToggleBlock('showCoverSubtitle', false)}
                title="Excluir subtítulo"
                className="opacity-0 group-hover/sub:opacity-100 p-1 rounded text-neutral-500 hover:text-red-400 transition-opacity cursor-pointer mt-1"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Custom Balloons Added by User on Slide 1 */}
        {data.customBlocksSlide1 && data.customBlocksSlide1.length > 0 && (
          <div className="grid gap-2.5 pt-2 grid-cols-1 sm:grid-cols-2">
            {data.customBlocksSlide1.map((b) => (
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

      {/* Slide Footer */}
      <div className="space-y-2">
        <div className={`slide-footer relative z-10 w-full pt-3 border-t border-white/15 ${
          isMobile ? 'flex flex-col gap-2' : 'flex flex-wrap items-center justify-between gap-3'
        } text-[11px] sm:text-xs`}>
          <div className={`flex ${isMobile ? 'flex-col gap-1.5' : 'flex-wrap items-center gap-4'} text-neutral-300`}>
            {showDate && (
              <div className="group/date relative flex items-center gap-1.5 pr-4">
                {showIcons && <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primaryColor }} />}
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleBlur('date')}
                  className="font-semibold"
                >
                  {data.date}
                </span>
                {onToggleBlock && (
                  <button
                    type="button"
                    onClick={() => onToggleBlock('showCoverMetaDate', false)}
                    title="Excluir data da capa"
                    className="opacity-0 group-hover/date:opacity-100 p-0.5 rounded text-neutral-500 hover:text-red-400 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            )}

            {showVenue && (
              <div className="group/venue relative flex items-center gap-1.5 pr-4">
                {showIcons && <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primaryColor }} />}
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleBlur('venue')}
                  className="font-semibold"
                >
                  {data.venue}
                </span>
                <span className="text-neutral-500">•</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleBlur('city')}
                  className="text-neutral-400"
                >
                  {data.city}
                </span>
                {onToggleBlock && (
                  <button
                    type="button"
                    onClick={() => onToggleBlock('showCoverMetaVenue', false)}
                    title="Excluir local da capa"
                    className="opacity-0 group-hover/venue:opacity-100 p-0.5 rounded text-neutral-500 hover:text-red-400 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="text-neutral-400 text-[10px] font-mono">
            LÂMINA 01 / 06
          </div>
        </div>

        {/* Custom Balloons Added by User on Slide 1 */}
        {data.customBlocksSlide1 && data.customBlocksSlide1.length > 0 && (
          <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 pt-2">
            {data.customBlocksSlide1.map((b) => (
              <div
                key={b.id}
                className="group/cb relative p-3 rounded-xl border backdrop-blur-md bg-black/50 border-white/10 shadow-lg"
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

        {/* Toolbar to Re-add Excluded Balloons or Add Custom Balloon */}
        <div className="no-print flex items-center justify-between flex-wrap gap-2 pt-1 text-[9px] sm:text-[10px] text-neutral-400">
          <div className="flex items-center gap-1.5 flex-wrap">
            {hasExcludedBalloons && onToggleBlock && (
              <>
                {!showBadge && (
                  <button
                    onClick={() => onToggleBlock('showCoverBadge', true)}
                    className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-2.5 h-2.5" /> <span>+ Emblema Proposta</span>
                  </button>
                )}
                {!showCategory && (
                  <button
                    onClick={() => onToggleBlock('showCoverCategory', true)}
                    className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-2.5 h-2.5" /> <span>+ Categoria</span>
                  </button>
                )}
                {!showEdition && (
                  <button
                    onClick={() => onToggleBlock('showCoverEdition', true)}
                    className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-2.5 h-2.5" /> <span>+ Edição</span>
                  </button>
                )}
                {!showSubtitle && (
                  <button
                    onClick={() => onToggleBlock('showCoverSubtitle', true)}
                    className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-2.5 h-2.5" /> <span>+ Subtítulo</span>
                  </button>
                )}
                {!showDate && (
                  <button
                    onClick={() => onToggleBlock('showCoverMetaDate', true)}
                    className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-2.5 h-2.5" /> <span>+ Data</span>
                  </button>
                )}
                {!showVenue && (
                  <button
                    onClick={() => onToggleBlock('showCoverMetaVenue', true)}
                    className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-2.5 h-2.5" /> <span>+ Local</span>
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
                <span>+ Novo Balão na Capa</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
