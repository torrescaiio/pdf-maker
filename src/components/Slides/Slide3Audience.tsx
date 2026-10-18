import React, { useRef } from 'react';
import {
  Users,
  TrendingUp,
  Calendar,
  CreditCard,
  Radio,
  Award,
  BarChart3,
  Camera,
  Trash2,
  Plus,
  X,
  RotateCcw,
  Sparkles,
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
  onUpdateMediaChannels?: (channels: string[]) => void;
  onUpdateDemographics?: (demographics: { label: string; percentage: number }[]) => void;
  onAddCustomBlock?: (block: CustomSlideBlock) => void;
  onRemoveCustomBlock?: (id: string) => void;
  onUpdateCustomBlock?: (id: string, field: 'title' | 'content', value: string) => void;
}

export const Slide3Audience: React.FC<SlideProps> = ({
  data,
  theme,
  images,
  format = 'widescreen',
  onUpdateText,
  onUpdateImage,
  onToggleBlock,
  onUpdateMediaChannels,
  onUpdateDemographics,
  onAddCustomBlock,
  onRemoveCustomBlock,
  onUpdateCustomBlock,
}) => {
  const isMobile = format === 'mobile';
  const isA4 = format === 'a4Portrait';
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleBlur = (field: keyof EventData) => (e: React.FocusEvent<HTMLElement>) => {
    if (onUpdateText) {
      onUpdateText(field, e.currentTarget.innerText.trim());
    }
  };

  const handleBgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateImage) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateImage('slide3Audience', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Media channels helpers
  const handleRemoveChannel = (indexToRemove: number) => {
    if (onUpdateMediaChannels) {
      const next = (data.mediaChannels || []).filter((_, i) => i !== indexToRemove);
      onUpdateMediaChannels(next);
    }
  };

  const handleAddChannel = () => {
    if (onUpdateMediaChannels) {
      const next = [...(data.mediaChannels || []), 'Novo Canal / Mídia'];
      onUpdateMediaChannels(next);
    }
  };

  const handleChannelTextChange = (index: number, newText: string) => {
    if (onUpdateMediaChannels) {
      const next = [...(data.mediaChannels || [])];
      next[index] = newText;
      onUpdateMediaChannels(next);
    }
  };

  // Demographics helpers
  const handleRemoveDemographic = (indexToRemove: number) => {
    if (onUpdateDemographics) {
      const next = (data.demographicsGender || []).filter((_, i) => i !== indexToRemove);
      onUpdateDemographics(next);
    }
  };

  const handleAddDemographic = () => {
    if (onUpdateDemographics) {
      const next = [...(data.demographicsGender || []), { label: 'Outro Segmento', percentage: 10 }];
      onUpdateDemographics(next);
    }
  };

  // Custom block helper
  const handleCreateNewBlock = () => {
    if (onAddCustomBlock) {
      const newBlock: CustomSlideBlock = {
        id: 'block_' + Date.now(),
        title: 'Novo Balão de Destaque',
        content: 'Insira aqui suas métricas personalizadas, canais regionais ou dados adicionais de audiência.',
      };
      onAddCustomBlock(newBlock);
    }
  };

  // Metric visibility flags
  const showMetric1 = data.showMetricAudience !== false;
  const showMetric2 = data.showMetricImpressions !== false;
  const showMetric3 = data.showMetricAge !== false;
  const showMetric4 = data.showMetricPower !== false;

  const activeMetricsCount = [showMetric1, showMetric2, showMetric3, showMetric4].filter(Boolean).length;
  const hasHiddenMetrics = !showMetric1 || !showMetric2 || !showMetric3 || !showMetric4;

  // Bottom section balloons visibility
  const showProfile = data.showAudienceProfile !== false;
  const showChannels = data.showMediaChannels !== false;
  const showDemographics = data.showDemographicsGender !== false;

  const showAudienceBgPhoto = data.showAudienceBgPhoto !== false && Boolean(images.slide3Audience);
  const showAudienceBadge = data.showAudienceBadge !== false;
  const showAudienceTitle = data.showAudienceTitle !== false;

  const showIcons = !data.hideAllIcons && data.showIconsSlide3 !== false;

  const aspectClass = isMobile ? 'aspect-[9/16]' : isA4 ? 'aspect-[210/297]' : 'aspect-[16/9]';

  return (
    <div
      className={`slide-container-print relative w-full h-full ${aspectClass} flex flex-col justify-between overflow-hidden ${
        isMobile ? 'p-5 sm:p-6' : isA4 ? 'p-8 sm:p-10' : 'p-6 sm:p-8 md:p-9 lg:p-10'
      } select-text text-white shadow-2xl transition-all`}
      style={{
        backgroundColor: theme.bgColor,
        backgroundImage: showAudienceBgPhoto
          ? `linear-gradient(135deg, rgba(9, 9, 11, 0.94) 0%, rgba(15, 15, 20, 0.90) 100%), url('${images.slide3Audience}')`
          : theme.bgGradient,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: theme.fontFamilyBody,
      }}
    >
      <input
        type="file"
        ref={bgInputRef}
        accept="image/*"
        onChange={handleBgFileChange}
        className="hidden"
      />
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[35vw] h-[35vw] rounded-full blur-[140px] opacity-15 pointer-events-none"
        style={{ background: theme.primaryColor }}
      />
      <div
        className="absolute bottom-0 right-10 w-[30vw] h-[30vw] rounded-full blur-[120px] opacity-15 pointer-events-none"
        style={{ background: theme.secondaryColor }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between border-b border-white/10 pb-2">
        <div>
          {showAudienceBadge && (
            <div className="group/ab inline-flex items-center gap-1 mb-1">
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={handleBlur('audienceBadge')}
                title="Clique para editar este texto"
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border backdrop-blur-md outline-none hover:border-amber-400 cursor-text"
                style={{
                  borderColor: `${theme.primaryColor}55`,
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  color: theme.primaryColor,
                }}
              >
                {showIcons && <BarChart3 className="w-3 h-3" />}
                {data.audienceBadge || 'Métricas de Audiência'}
              </span>
              {onToggleBlock && (
                <button
                  type="button"
                  onClick={() => onToggleBlock('showAudienceBadge', false)}
                  title="Excluir este balão"
                  className="no-print opacity-0 group-hover/ab:opacity-100 p-0.5 rounded text-neutral-400 hover:text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          )}
          {showAudienceTitle && (
            <div className="group/at flex items-center gap-2">
              <h2
                className={`${
                  isMobile ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl md:text-3xl'
                } font-black uppercase tracking-tight`}
                style={{ fontFamily: theme.fontFamilyHead }}
              >
                PÚBLICO QUALIFICADO & ALCANCE
              </h2>
              {onToggleBlock && (
                <button
                  type="button"
                  onClick={() => onToggleBlock('showAudienceTitle', false)}
                  title="Excluir título de audiência"
                  className="no-print opacity-0 group-hover/at:opacity-100 p-0.5 rounded text-neutral-400 hover:text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          )}
          <p className="text-[10px] sm:text-xs text-neutral-400 mt-0.5 max-w-xl">
            Dados consolidados de público presente, projeção de mídia e perfil de consumo.
          </p>
        </div>
        <div className="text-right text-[10px] sm:text-[11px] font-mono text-neutral-400 flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5">
            {onToggleBlock && (
              <button
                type="button"
                onClick={() => onToggleBlock('showIconsSlide3', !showIcons)}
                title={showIcons ? 'Ocultar ícones desta lâmina' : 'Exibir ícones desta lâmina'}
                className="px-2 py-0.5 rounded bg-black/40 hover:bg-neutral-800 border border-white/10 text-[9px] text-neutral-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {showIcons ? <EyeOff className="w-2.5 h-2.5 text-neutral-400" /> : <Eye className="w-2.5 h-2.5 text-amber-400" />}
                <span>{showIcons ? 'Ocultar Ícones' : 'Exibir Ícones'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => bgInputRef.current?.click()}
              title="Trocar imagem de fundo desta lâmina pelo seu computador"
              className="px-2 py-0.5 rounded bg-black/40 hover:bg-neutral-800 border border-white/10 text-[9px] text-neutral-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Camera className="w-2.5 h-2.5 text-amber-400" />
              <span>Foto de Fundo</span>
            </button>
            {onToggleBlock && (
              showAudienceBgPhoto ? (
                <button
                  type="button"
                  onClick={() => onToggleBlock('showAudienceBgPhoto', false)}
                  title="Apagar foto de fundo (deixar gradiente limpo)"
                  className="px-2 py-0.5 rounded bg-red-950/70 hover:bg-red-900 border border-red-500/30 text-[9px] text-red-200 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                  <span>Apagar Foto</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onToggleBlock('showAudienceBgPhoto', true)}
                  title="Restaurar foto de fundo"
                  className="px-2 py-0.5 rounded bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/30 text-[9px] text-emerald-200 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>+ Foto</span>
                </button>
              )
            )}
          </div>
          <span className="font-semibold text-white/90">{data.name}</span>
          <div className="text-neutral-500">LÂMINA 03 / 06</div>
        </div>
      </div>

      {/* 4 Big Numbers Cards Area (with dynamic grid and exclusion/restoration) */}
      <div className="relative z-10 my-auto space-y-2">
        {/* Dynamic Metric Grid */}
        {activeMetricsCount > 0 ? (
          <div
            className={`grid gap-2.5 sm:gap-3 ${
              isMobile
                ? activeMetricsCount === 1
                  ? 'grid-cols-1'
                  : 'grid-cols-2'
                : activeMetricsCount === 1
                ? 'grid-cols-1 max-w-md mx-auto'
                : activeMetricsCount === 2
                ? 'grid-cols-2'
                : activeMetricsCount === 3
                ? 'grid-cols-3'
                : 'grid-cols-2 lg:grid-cols-4'
            }`}
          >
            {/* Card 1: Público */}
            {showMetric1 && (
              <div
                className={`group relative ${
                  isMobile ? 'p-2.5 sm:p-3' : 'p-3.5 sm:p-4'
                } rounded-xl border backdrop-blur-md flex flex-col justify-between transition-all hover:border-amber-400/40 shadow-lg`}
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                }}
              >
                {/* Delete button on hover */}
                {onToggleBlock && (
                  <button
                    onClick={() => onToggleBlock('showMetricAudience', false)}
                    title="Excluir este balão de público"
                    className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 p-1 rounded-md text-red-400 hover:text-red-200 hover:bg-red-500/20 transition-all cursor-pointer z-20"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                <div className="flex items-center justify-between text-neutral-400 mb-1 pr-4">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">
                    Público Estimado
                  </span>
                  {showIcons && <Users className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primaryColor }} />}
                </div>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleBlur('audienceCount')}
                  className={`${
                    isMobile ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl md:text-[34px]'
                  } font-black tracking-tight leading-none my-1`}
                  style={{ color: theme.primaryColor, fontFamily: theme.fontFamilyHead }}
                >
                  {data.audienceCount}
                </div>
                <div className="text-[9.5px] sm:text-[10.5px] text-neutral-300 font-medium">
                  Pessoas presentes
                </div>
              </div>
            )}

            {/* Card 2: Impressões */}
            {showMetric2 && (
              <div
                className={`group relative ${
                  isMobile ? 'p-2.5 sm:p-3' : 'p-3.5 sm:p-4'
                } rounded-xl border backdrop-blur-md flex flex-col justify-between transition-all hover:border-amber-400/40 shadow-lg`}
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                }}
              >
                {onToggleBlock && (
                  <button
                    onClick={() => onToggleBlock('showMetricImpressions', false)}
                    title="Excluir este balão de alcance digital"
                    className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 p-1 rounded-md text-red-400 hover:text-red-200 hover:bg-red-500/20 transition-all cursor-pointer z-20"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                <div className="flex items-center justify-between text-neutral-400 mb-1 pr-4">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">
                    Alcance Digital
                  </span>
                  {showIcons && <TrendingUp className="w-3.5 h-3.5 shrink-0" style={{ color: theme.secondaryColor }} />}
                </div>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleBlur('digitalImpressions')}
                  className={`${
                    isMobile ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl md:text-[34px]'
                  } font-black tracking-tight leading-none my-1`}
                  style={{ color: theme.secondaryColor, fontFamily: theme.fontFamilyHead }}
                >
                  {data.digitalImpressions}
                </div>
                <div className="text-[9.5px] sm:text-[10.5px] text-neutral-300 font-medium">
                  Impressões em redes
                </div>
              </div>
            )}

            {/* Card 3: Faixa Etária */}
            {showMetric3 && (
              <div
                className={`group relative ${
                  isMobile ? 'p-2.5 sm:p-3' : 'p-3.5 sm:p-4'
                } rounded-xl border backdrop-blur-md flex flex-col justify-between transition-all hover:border-amber-400/40 shadow-lg`}
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                }}
              >
                {onToggleBlock && (
                  <button
                    onClick={() => onToggleBlock('showMetricAge', false)}
                    title="Excluir este balão de faixa etária"
                    className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 p-1 rounded-md text-red-400 hover:text-red-200 hover:bg-red-500/20 transition-all cursor-pointer z-20"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                <div className="flex items-center justify-between text-neutral-400 mb-1 pr-4">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">
                    Faixa Etária
                  </span>
                  {showIcons && <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primaryColor }} />}
                </div>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleBlur('ageBracket')}
                  className={`${
                    isMobile ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl md:text-[26px]'
                  } font-black tracking-tight leading-none my-1`}
                  style={{ color: theme.primaryColor, fontFamily: theme.fontFamilyHead }}
                >
                  {data.ageBracket}
                </div>
                <div className="text-[9.5px] sm:text-[10.5px] text-neutral-300 font-medium">
                  Público qualificado
                </div>
              </div>
            )}

            {/* Card 4: Poder Aquisitivo */}
            {showMetric4 && (
              <div
                className={`group relative ${
                  isMobile ? 'p-2.5 sm:p-3' : 'p-3.5 sm:p-4'
                } rounded-xl border backdrop-blur-md flex flex-col justify-between transition-all hover:border-amber-400/40 shadow-lg`}
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                }}
              >
                {onToggleBlock && (
                  <button
                    onClick={() => onToggleBlock('showMetricPower', false)}
                    title="Excluir este balão de poder aquisitivo"
                    className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 p-1 rounded-md text-red-400 hover:text-red-200 hover:bg-red-500/20 transition-all cursor-pointer z-20"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                <div className="flex items-center justify-between text-neutral-400 mb-1 pr-4">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">
                    Poder Aquisitivo
                  </span>
                  {showIcons && <CreditCard className="w-3.5 h-3.5 shrink-0" style={{ color: theme.secondaryColor }} />}
                </div>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleBlur('purchasingPower')}
                  className={`${
                    isMobile ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl md:text-[26px]'
                  } font-black tracking-tight leading-none my-1 break-words`}
                  style={{ color: theme.secondaryColor, fontFamily: theme.fontFamilyHead }}
                >
                  {data.purchasingPower}
                </div>
                <div className="text-[9.5px] sm:text-[10.5px] text-neutral-300 font-medium">
                  Consumo premium
                </div>
              </div>
            )}
          </div>
        ) : (
          /* When all 4 metrics are excluded */
          <div className="p-4 rounded-xl border border-dashed border-white/20 text-center bg-black/30 backdrop-blur-md">
            <p className="text-xs text-neutral-400 mb-2">Nenhum balão de métrica está visível.</p>
            <button
              onClick={() => {
                if (onToggleBlock) {
                  onToggleBlock('showMetricAudience', true);
                  onToggleBlock('showMetricImpressions', true);
                  onToggleBlock('showMetricAge', true);
                  onToggleBlock('showMetricPower', true);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Todos os Balões de Métricas</span>
            </button>
          </div>
        )}

        {/* Small restore pills if some metrics are hidden */}
        {hasHiddenMetrics && activeMetricsCount > 0 && onToggleBlock && (
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5 text-[9px] sm:text-[10px] text-neutral-400">
            <span className="text-neutral-500">Métricas excluídas:</span>
            {!showMetric1 && (
              <button
                onClick={() => onToggleBlock('showMetricAudience', true)}
                className="px-2 py-0.5 rounded bg-neutral-800/80 hover:bg-neutral-700 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-2.5 h-2.5" /> <span>+ Público</span>
              </button>
            )}
            {!showMetric2 && (
              <button
                onClick={() => onToggleBlock('showMetricImpressions', true)}
                className="px-2 py-0.5 rounded bg-neutral-800/80 hover:bg-neutral-700 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-2.5 h-2.5" /> <span>+ Alcance</span>
              </button>
            )}
            {!showMetric3 && (
              <button
                onClick={() => onToggleBlock('showMetricAge', true)}
                className="px-2 py-0.5 rounded bg-neutral-800/80 hover:bg-neutral-700 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-2.5 h-2.5" /> <span>+ Faixa Etária</span>
              </button>
            )}
            {!showMetric4 && (
              <button
                onClick={() => onToggleBlock('showMetricPower', true)}
                className="px-2 py-0.5 rounded bg-neutral-800/80 hover:bg-neutral-700 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-2.5 h-2.5" /> <span>+ Poder Aquisitivo</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Section: Profile description + Media Channels with dynamic flex/grid expansion */}
      <div className="relative z-10 pt-2.5 border-t border-white/10 space-y-2.5">
        {/* Main Grid for Balloons */}
        <div
          className={`grid gap-3.5 items-stretch ${
            isMobile
              ? 'grid-cols-1'
              : showProfile && showChannels
              ? 'grid-cols-1 md:grid-cols-12'
              : 'grid-cols-1'
          }`}
        >
          {/* ================= LEFT BALLOON: AUDIENCE PERSONA / PROFILE ================= */}
          {showProfile && (
            <div
              className={`group relative ${
                isMobile ? 'w-full' : showChannels ? 'md:col-span-7' : 'w-full'
              } p-3 sm:p-3.5 rounded-xl border backdrop-blur-md flex flex-col justify-between shadow-lg transition-all`}
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {showIcons && <Award className="w-3.5 h-3.5" style={{ color: theme.primaryColor }} />}
                    Perfil do Consumidor
                  </div>

                  {/* Exclude Balloon button */}
                  {onToggleBlock && (
                    <button
                      onClick={() => onToggleBlock('showAudienceProfile', false)}
                      title="Excluir este balão de Perfil do Consumidor"
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-red-400 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 opacity-70 hover:opacity-100 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                      <span>Excluir Balão</span>
                    </button>
                  )}
                </div>

                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleBlur('audienceProfileDescription')}
                  className="text-[10.5px] sm:text-[11.5px] text-neutral-200 leading-snug"
                >
                  {data.audienceProfileDescription}
                </p>
              </div>

              {/* Demographic bars */}
              {showDemographics && (
                <div className="mt-2.5 pt-2 border-t border-white/10 text-[9px] sm:text-[10px]">
                  <div className="flex items-center justify-between mb-1 text-neutral-400 font-semibold text-[9px]">
                    <span>Divisão Demográfica</span>
                    {onUpdateDemographics && (
                      <button
                        onClick={handleAddDemographic}
                        title="Adicionar nova fatia demográfica"
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-0.5 cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" /> <span>Adicionar</span>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {data.demographicsGender.map((item, idx) => (
                      <div key={idx} className="group/demo relative">
                        <div className="flex justify-between items-center text-neutral-300 mb-0.5 font-medium">
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              if (onUpdateDemographics) {
                                const next = [...data.demographicsGender];
                                next[idx].label = e.currentTarget.innerText.trim();
                                onUpdateDemographics(next);
                              }
                            }}
                            className="truncate max-w-[70px]"
                          >
                            {item.label}
                          </span>
                          <div className="flex items-center gap-1">
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => {
                                if (onUpdateDemographics) {
                                  const val = parseInt(e.currentTarget.innerText.replace(/\D/g, ''), 10) || 0;
                                  const next = [...data.demographicsGender];
                                  next[idx].percentage = val;
                                  onUpdateDemographics(next);
                                }
                              }}
                              className="font-bold"
                              style={{ color: theme.primaryColor }}
                            >
                              {item.percentage}%
                            </span>
                            {onUpdateDemographics && (
                              <button
                                onClick={() => handleRemoveDemographic(idx)}
                                title="Remover esta fatia"
                                className="opacity-0 group-hover/demo:opacity-100 text-neutral-500 hover:text-red-400 transition-all cursor-pointer"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(item.percentage, 100)}%`,
                              backgroundColor: idx === 0 ? theme.primaryColor : theme.secondaryColor,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= RIGHT BALLOON: MEDIA CHANNELS ================= */}
          {/* USER'S EXPLICIT REQUEST: freedom to delete/exclude, customize, and re-add this balloon! */}
          {showChannels && (
            <div
              className={`group relative ${
                isMobile ? 'w-full' : showProfile ? 'md:col-span-5' : 'w-full'
              } p-3 sm:p-3.5 rounded-xl border backdrop-blur-md flex flex-col justify-between shadow-lg transition-all`}
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {showIcons && <Radio className="w-3.5 h-3.5" style={{ color: theme.secondaryColor }} />}
                    Canais de Mídia & Transmissão
                  </div>

                  {/* Freedom: Exclude/Delete this balloon */}
                  {onToggleBlock && (
                    <button
                      onClick={() => onToggleBlock('showMediaChannels', false)}
                      title="Excluir este balão de Canais de Mídia (você poderá readicioná-lo a qualquer momento)"
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-red-400 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 opacity-70 hover:opacity-100 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                      <span>Excluir Balão</span>
                    </button>
                  )}
                </div>

                {/* Channels List */}
                <div
                  className={`${
                    isMobile || !showProfile ? 'grid grid-cols-2 gap-1.5' : 'space-y-1.5'
                  } text-xs`}
                >
                  {(data.mediaChannels || []).map((channel, idx) => (
                    <div
                      key={idx}
                      className="group/channel flex items-center justify-between gap-1.5 p-1.5 rounded-md bg-black/40 border border-white/5 hover:border-amber-400/30 transition-all"
                    >
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <div
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleChannelTextChange(idx, e.currentTarget.innerText.trim())}
                          className="text-neutral-200 font-medium text-[10px] sm:text-[11px] leading-tight truncate flex-1 outline-none"
                        >
                          {channel}
                        </span>
                      </div>
                      {/* Individual channel delete button */}
                      {onUpdateMediaChannels && (
                        <button
                          onClick={() => handleRemoveChannel(idx)}
                          title="Excluir este canal"
                          className="opacity-0 group-hover/channel:opacity-100 text-neutral-500 hover:text-red-400 p-0.5 rounded transition-all cursor-pointer shrink-0"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add channel button inside the balloon */}
              {onUpdateMediaChannels && (
                <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={handleAddChannel}
                    title="Adicionar mais um canal de mídia"
                    className="flex items-center gap-1 text-[9.5px] font-semibold text-neutral-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3 text-amber-400" />
                    <span>Adicionar Canal de Mídia</span>
                  </button>
                  <span className="text-[9px] text-neutral-500">
                    {(data.mediaChannels || []).length} canais
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Custom Balloons Added by User on Slide 3 */}
        {data.customBlocksSlide3 && data.customBlocksSlide3.length > 0 && (
          <div
            className={`grid gap-3 ${
              data.customBlocksSlide3.length === 1
                ? 'grid-cols-1'
                : 'grid-cols-1 md:grid-cols-2'
            }`}
          >
            {data.customBlocksSlide3.map((block) => (
              <div
                key={block.id}
                className="group relative p-3 rounded-xl border backdrop-blur-md flex flex-col justify-between shadow-lg"
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onUpdateCustomBlock?.(block.id, 'title', e.currentTarget.innerText.trim())
                      }
                      className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider outline-none"
                      style={{ color: theme.primaryColor }}
                    >
                      {block.title}
                    </h4>

                    {onRemoveCustomBlock && (
                      <button
                        onClick={() => onRemoveCustomBlock(block.id)}
                        title="Excluir este balão personalizado"
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-red-400 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 opacity-70 hover:opacity-100 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                        <span>Excluir Balão</span>
                      </button>
                    )}
                  </div>

                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdateCustomBlock?.(block.id, 'content', e.currentTarget.innerText.trim())
                    }
                    className="text-[10.5px] sm:text-[11px] text-neutral-200 leading-snug outline-none"
                  >
                    {block.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Toolbar for Re-adding Excluded Balloons and Adding Custom Balloons */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-[9px] sm:text-[10px] text-neutral-400">
          <div className="flex items-center gap-1.5 flex-wrap">
            {!showAudienceBadge && onToggleBlock && (
              <button
                onClick={() => onToggleBlock('showAudienceBadge', true)}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-800 text-amber-300 border border-white/10 text-[9px] cursor-pointer"
              >
                <Plus className="w-2.5 h-2.5" />
                <span>+ Balão do Topo</span>
              </button>
            )}

            {!showAudienceTitle && onToggleBlock && (
              <button
                onClick={() => onToggleBlock('showAudienceTitle', true)}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-800 text-amber-300 border border-white/10 text-[9px] cursor-pointer"
              >
                <Plus className="w-2.5 h-2.5" />
                <span>+ Título Audiência</span>
              </button>
            )}

            {!showDemographics && onToggleBlock && (
              <button
                onClick={() => onToggleBlock('showDemographicsGender', true)}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-800 text-amber-300 border border-white/10 text-[9px] cursor-pointer"
              >
                <Plus className="w-2.5 h-2.5" />
                <span>+ Demografia</span>
              </button>
            )}

            {/* If Media Channels was excluded, provide one-click restoration right here! */}
            {!showChannels && onToggleBlock && (
              <button
                onClick={() => onToggleBlock('showMediaChannels', true)}
                title="Restaurar e readicionar o balão de Canais de Mídia"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/70 border border-emerald-500/40 text-emerald-300 font-bold transition-all shadow cursor-pointer"
              >
                <Plus className="w-3 h-3 text-emerald-400" />
                <span>Readicionar Balão de Canais de Mídia</span>
              </button>
            )}

            {/* If Profile was excluded, provide one-click restoration */}
            {!showProfile && onToggleBlock && (
              <button
                onClick={() => onToggleBlock('showAudienceProfile', true)}
                title="Restaurar e readicionar o balão de Perfil do Consumidor"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/70 border border-emerald-500/40 text-emerald-300 font-bold transition-all shadow cursor-pointer"
              >
                <Plus className="w-3 h-3 text-emerald-400" />
                <span>Readicionar Balão de Perfil</span>
              </button>
            )}

            {/* Add Custom Balloon Button */}
            {onAddCustomBlock && (
              <button
                onClick={handleCreateNewBlock}
                title="Adicionar um novo balão personalizado a esta lâmina"
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-800/80 hover:bg-neutral-700/80 border border-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>+ Novo Balão Personalizado</span>
              </button>
            )}
          </div>

          <div className="text-neutral-500 text-[9px] italic">
            Dica: passe o mouse sobre qualquer balão para editá-lo ou excluí-lo.
          </div>
        </div>
      </div>
    </div>
  );
};
