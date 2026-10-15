import React from 'react';
import { Users, TrendingUp, Calendar, CreditCard, Radio, Award, BarChart3 } from 'lucide-react';
import type { EventData, ThemeConfig, SlideImages, LayoutFormat } from '../../types.ts';

interface SlideProps {
  data: EventData;
  theme: ThemeConfig;
  images: SlideImages;
  format?: LayoutFormat;
  onUpdateText?: (field: keyof EventData, value: string) => void;
}

export const Slide3Audience: React.FC<SlideProps> = ({
  data,
  theme,
  format = 'widescreen',
  onUpdateText,
}) => {
  const isMobile = format === 'mobile';
  const isA4 = format === 'a4Portrait';

  const handleBlur = (field: keyof EventData) => (e: React.FocusEvent<HTMLElement>) => {
    if (onUpdateText) {
      onUpdateText(field, e.currentTarget.innerText.trim());
    }
  };

  const aspectClass = isMobile ? 'aspect-[9/16]' : isA4 ? 'aspect-[210/297]' : 'aspect-[16/9]';

  return (
    <div
      className={`slide-container-print relative w-full h-full ${aspectClass} flex flex-col justify-between overflow-hidden ${
        isMobile ? 'p-5 sm:p-6' : isA4 ? 'p-8 sm:p-10' : 'p-6 sm:p-8 md:p-9 lg:p-10'
      } select-text text-white shadow-2xl transition-all`}
      style={{
        background: theme.bgGradient,
        fontFamily: theme.fontFamilyBody,
      }}
    >
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
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border mb-1 backdrop-blur-md"
            style={{
              borderColor: `${theme.primaryColor}55`,
              backgroundColor: 'rgba(0,0,0,0.4)',
              color: theme.primaryColor,
            }}
          >
            <BarChart3 className="w-3 h-3" />
            Métricas de Audiência
          </span>
          <h2
            className={`${
              isMobile ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl md:text-3xl'
            } font-black uppercase tracking-tight`}
            style={{ fontFamily: theme.fontFamilyHead }}
          >
            PÚBLICO QUALIFICADO & ALCANCE
          </h2>
          <p className="text-[10px] sm:text-xs text-neutral-400 mt-0.5 max-w-xl">
            Dados consolidados de público presente, projeção de mídia e perfil de consumo.
          </p>
        </div>
        <div className="text-right text-[10px] sm:text-[11px] font-mono text-neutral-400">
          <span>{data.name}</span>
          <div className="text-neutral-500">LÂMINA 03 / 06</div>
        </div>
      </div>

      {/* 4 Big Numbers Cards: Strictly 2x2 on Mobile, 4 columns on Widescreen */}
      <div className={`relative z-10 grid ${
        isMobile ? 'grid-cols-2 gap-2.5 my-auto' : 'grid-cols-2 lg:grid-cols-4 gap-3 my-auto'
      }`}>
        {/* Card 1: Público */}
        <div
          className={`${
            isMobile ? 'p-2.5 sm:p-3' : 'p-3.5 sm:p-4'
          } rounded-xl border backdrop-blur-md flex flex-col justify-between transition-all hover:border-amber-400/40 shadow-lg`}
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.cardBorder,
          }}
        >
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">Público Estimado</span>
            <Users className="w-3.5 h-3.5" style={{ color: theme.primaryColor }} />
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

        {/* Card 2: Impressões */}
        <div
          className={`${
            isMobile ? 'p-2.5 sm:p-3' : 'p-3.5 sm:p-4'
          } rounded-xl border backdrop-blur-md flex flex-col justify-between transition-all hover:border-amber-400/40 shadow-lg`}
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.cardBorder,
          }}
        >
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">Alcance Digital</span>
            <TrendingUp className="w-3.5 h-3.5" style={{ color: theme.secondaryColor }} />
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

        {/* Card 3: Faixa Etária */}
        <div
          className={`${
            isMobile ? 'p-2.5 sm:p-3' : 'p-3.5 sm:p-4'
          } rounded-xl border backdrop-blur-md flex flex-col justify-between transition-all hover:border-amber-400/40 shadow-lg`}
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.cardBorder,
          }}
        >
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">Faixa Etária</span>
            <Calendar className="w-3.5 h-3.5" style={{ color: theme.primaryColor }} />
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

        {/* Card 4: Poder Aquisitivo */}
        <div
          className={`${
            isMobile ? 'p-2.5 sm:p-3' : 'p-3.5 sm:p-4'
          } rounded-xl border backdrop-blur-md flex flex-col justify-between transition-all hover:border-amber-400/40 shadow-lg`}
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.cardBorder,
          }}
        >
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">Poder Aquisitivo</span>
            <CreditCard className="w-3.5 h-3.5" style={{ color: theme.secondaryColor }} />
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
      </div>

      {/* Bottom Section: Profile description + Media Channels */}
      <div className={`relative z-10 ${
        isMobile ? 'flex flex-col gap-2.5' : 'grid grid-cols-1 md:grid-cols-12 gap-3.5'
      } pt-2.5 border-t border-white/10 items-stretch`}>
        {/* Left: Audience Persona */}
        <div
          className={`${
            isMobile ? 'w-full' : 'md:col-span-7'
          } p-3 rounded-lg border backdrop-blur-md flex flex-col justify-between`}
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.cardBorder,
          }}
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              <Award className="w-3.5 h-3.5" style={{ color: theme.primaryColor }} />
              Perfil do Consumidor
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
          <div className="grid grid-cols-3 gap-2 mt-2 pt-1.5 border-t border-white/10 text-[9px] sm:text-[10px]">
            {data.demographicsGender.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-neutral-300 mb-0.5 font-medium">
                  <span>{item.label}</span>
                  <span className="font-bold" style={{ color: theme.primaryColor }}>
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: idx === 0 ? theme.primaryColor : theme.secondaryColor,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Media Channels */}
        <div
          className={`${
            isMobile ? 'w-full' : 'md:col-span-5'
          } p-2.5 sm:p-3 rounded-lg border backdrop-blur-md flex flex-col justify-between`}
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.cardBorder,
          }}
        >
          <div className="flex items-center gap-1.5 mb-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            <Radio className="w-3.5 h-3.5" style={{ color: theme.secondaryColor }} />
            Canais de Mídia & Transmissão
          </div>

          <div className={`${isMobile ? 'grid grid-cols-2 gap-1.5' : 'space-y-1.5'} text-xs`}>
            {data.mediaChannels.map((channel, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 p-1.5 rounded-md bg-black/30 border border-white/5"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: theme.primaryColor }}
                />
                <span className="text-neutral-200 font-medium text-[10px] sm:text-[11px] leading-tight truncate">
                  {channel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
