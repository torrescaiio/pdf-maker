import React from 'react';
import { Crown, Check, Star, ShieldCheck } from 'lucide-react';
import type { EventData, ThemeConfig, SlideImages, LayoutFormat } from '../../types.ts';
import { formatCurrencyBRL } from '../../utils/proposalLogic.ts';

interface SlideProps {
  data: EventData;
  theme: ThemeConfig;
  images: SlideImages;
  format?: LayoutFormat;
  onUpdateText?: (field: keyof EventData, value: string) => void;
  onUpdateTierPrice?: (tierId: string, price: number) => void;
  onUpdateTierQuotas?: (tierId: string, quotas: number) => void;
  onUpdateTierTitle?: (tierId: string, name: string) => void;
}

export const Slide5Tiers: React.FC<SlideProps> = ({
  data,
  theme,
  format = 'widescreen',
  onUpdateText,
  onUpdateTierPrice,
  onUpdateTierQuotas,
  onUpdateTierTitle,
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
      {/* Background glow highlights */}
      <div
        className="absolute top-10 left-1/3 w-[40vw] h-[40vw] rounded-full blur-[150px] opacity-20 pointer-events-none"
        style={{ background: theme.primaryColor }}
      />
      <div
        className="absolute bottom-0 right-10 w-[30vw] h-[30vw] rounded-full blur-[130px] opacity-15 pointer-events-none"
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
            <Crown className="w-3 h-3" />
            Investimento & Retorno
          </span>
          <h2
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur('tiersTitle')}
            className={`${
              isMobile ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl md:text-3xl'
            } font-black uppercase tracking-tight`}
            style={{ fontFamily: theme.fontFamilyHead }}
          >
            {data.tiersTitle}
          </h2>
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur('tiersSubtitle')}
            className="text-[10px] sm:text-xs text-neutral-400 mt-0.5 max-w-xl"
          >
            {data.tiersSubtitle}
          </p>
        </div>
        <div className="text-right text-[10px] sm:text-[11px] font-mono text-neutral-400">
          <span>{data.name}</span>
          <div className="text-neutral-500">LÂMINA 05 / 06</div>
        </div>
      </div>

      {/* 3 Tier Cards: Stacked vertically on mobile, 3 columns on widescreen */}
      <div className={`relative z-10 ${
        isMobile ? 'flex flex-col gap-2.5 my-auto' : 'grid grid-cols-1 md:grid-cols-3 gap-3.5 my-auto items-stretch'
      }`}>
        {data.tiers.map((tier) => {
          const isHighlight = tier.highlighted;
          const deliverableLimit = isMobile ? 3 : 6;

          return (
            <div
              key={tier.id}
              className={`relative rounded-xl ${
                isMobile ? 'p-2.5 sm:p-3' : 'p-3.5 sm:p-4'
              } backdrop-blur-md flex flex-col justify-between transition-all duration-300 shadow-xl ${
                isHighlight ? 'ring-2 ring-offset-1 ring-offset-neutral-950' : ''
              }`}
              style={{
                backgroundColor: isHighlight ? 'rgba(26, 22, 14, 0.92)' : theme.cardBg,
                borderColor: isHighlight ? theme.primaryColor : theme.cardBorder,
                borderWidth: isHighlight ? '2px' : '1px',
                boxShadow: isHighlight ? `0 0 25px ${theme.primaryColor}33` : undefined,
              }}
            >
              {/* Highlight ribbon badge */}
              {isHighlight && (
                <div
                  className={`absolute ${
                    isMobile ? '-top-2.5 right-3' : '-top-3 left-1/2 -translate-x-1/2'
                  } px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-black shadow-lg flex items-center gap-1 whitespace-nowrap`}
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <Star className="w-2.5 h-2.5 fill-black text-black" />
                  COTA PRINCIPAL
                </div>
              )}

              {/* Tier Header & Pricing */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full truncate"
                    style={{
                      backgroundColor: isHighlight
                        ? 'rgba(212, 175, 55, 0.2)'
                        : 'rgba(255, 255, 255, 0.08)',
                      color: isHighlight ? theme.primaryColor : '#a1a1aa',
                    }}
                  >
                    {tier.badge}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                    {tier.quotasAvailable} {tier.quotasAvailable === 1 ? 'cota única' : 'cotas'}
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-2">
                  <h3
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdateTierTitle &&
                      onUpdateTierTitle(tier.id, e.currentTarget.innerText.trim())
                    }
                    className={`${
                      isMobile ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
                    } font-black uppercase tracking-tight text-white leading-tight`}
                    style={{ fontFamily: theme.fontFamilyHead }}
                  >
                    {tier.name}
                  </h3>

                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const raw = e.currentTarget.innerText.replace(/[^0-9]/g, '');
                      const parsed = parseInt(raw, 10);
                      if (!isNaN(parsed) && onUpdateTierPrice) {
                        onUpdateTierPrice(tier.id, parsed);
                      }
                    }}
                    className={`${
                      isMobile ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'
                    } font-black tracking-tight shrink-0`}
                    style={{ color: theme.primaryColor }}
                  >
                    {formatCurrencyBRL(tier.price)}
                  </div>
                </div>

                {/* Deliverables Checklist */}
                <div className="space-y-1 mt-1.5 text-xs">
                  {tier.deliverables.slice(0, deliverableLimit).map((item, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-1.5 text-neutral-200 leading-tight">
                      <div
                        className="mt-0.5 p-0.5 rounded-full shrink-0"
                        style={{
                          backgroundColor: `${theme.primaryColor}33`,
                          color: theme.primaryColor,
                        }}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="text-[9.5px] sm:text-[10.5px] leading-tight truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-2.5 border-t border-white/10 text-[11px] text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
          <span>
            Os valores acima contemplam exclusividade de segmento e relatórios de métricas pós-evento.
          </span>
        </div>
        <div className="font-mono">
          LÂMINA 05 / 06
        </div>
      </div>
    </div>
  );
};
