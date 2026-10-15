import React from 'react';
import { Layers, Music, Utensils, Sparkles, CheckCircle2 } from 'lucide-react';
import type { EventData, ThemeConfig, SlideImages, LayoutFormat } from '../../types.ts';

interface SlideProps {
  data: EventData;
  theme: ThemeConfig;
  images: SlideImages;
  format?: LayoutFormat;
  onUpdateText?: (field: keyof EventData, value: string) => void;
  onUpdateAttraction?: (index: number, field: 'title' | 'description' | 'stats' | 'tag', value: string) => void;
}

export const Slide4Attractions: React.FC<SlideProps> = ({
  data,
  theme,
  images,
  format = 'widescreen',
  onUpdateText,
  onUpdateAttraction,
}) => {
  const isMobile = format === 'mobile';
  const isA4 = format === 'a4Portrait';

  const handleBlur = (field: keyof EventData) => (e: React.FocusEvent<HTMLElement>) => {
    if (onUpdateText) {
      onUpdateText(field, e.currentTarget.innerText.trim());
    }
  };

  const getAttractionImage = (index: number) => {
    if (index === 0) return images.slide4Attraction1;
    if (index === 1) return images.slide4Attraction2;
    return images.slide4Attraction3;
  };

  const attractionIcons = [
    <Music key="1" className="w-3.5 h-3.5" />,
    <Utensils key="2" className="w-3.5 h-3.5" />,
    <Sparkles key="3" className="w-3.5 h-3.5" />,
  ];

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
      {/* Background ambient lighting */}
      <div
        className="absolute -top-10 right-1/3 w-[35vw] h-[35vw] rounded-full blur-[140px] opacity-15 pointer-events-none"
        style={{ background: theme.primaryColor }}
      />
      <div
        className="absolute bottom-10 left-10 w-[30vw] h-[30vw] rounded-full blur-[120px] opacity-10 pointer-events-none"
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
            <Layers className="w-3 h-3" />
            Infraestrutura & Experiências
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
        <div className="text-right text-[10px] sm:text-[11px] font-mono text-neutral-400">
          <span>{data.name}</span>
          <div className="text-neutral-500">LÂMINA 04 / 06</div>
        </div>
      </div>

      {/* Attractions Grid: Stacked 1 per row on mobile (photo left, text right), 3 cols on desktop */}
      <div className={`relative z-10 ${
        isMobile ? 'flex flex-col gap-2.5 my-auto' : 'grid grid-cols-1 md:grid-cols-3 gap-3.5 my-auto'
      }`}>
        {data.attractions.map((attraction, idx) => (
          <div
            key={idx}
            className={`group rounded-xl overflow-hidden border backdrop-blur-md transition-all duration-300 hover:border-amber-400/50 shadow-lg ${
              isMobile ? 'flex flex-row items-stretch' : 'flex flex-col justify-between'
            }`}
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.cardBorder,
            }}
          >
            {/* Attraction Image */}
            <div className={`relative overflow-hidden shrink-0 ${
              isMobile ? 'w-24 sm:w-28' : 'h-28 sm:h-32 md:h-36 w-full'
            }`}>
              <img
                src={getAttractionImage(idx)}
                alt={attraction.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
              <div className="absolute top-1.5 left-1.5">
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdateAttraction &&
                    onUpdateAttraction(idx, 'tag', e.currentTarget.innerText.trim())
                  }
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold uppercase tracking-wider backdrop-blur-md bg-black/60 border text-white"
                  style={{ borderColor: `${theme.primaryColor}88` }}
                >
                  {attractionIcons[idx]}
                  {attraction.tag.split(' ')[0]}
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
                  className="text-xs sm:text-sm font-bold tracking-tight text-white mb-0.5 truncate"
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
                  className="text-[10px] sm:text-[11px] text-neutral-300 leading-snug line-clamp-2"
                >
                  {attraction.description}
                </p>
              </div>

              {/* Stats Footer */}
              <div className="mt-1.5 pt-1 border-t border-white/10 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1 text-neutral-300 font-medium truncate">
                  <CheckCircle2
                    className="w-3 h-3 shrink-0"
                    style={{ color: theme.primaryColor }}
                  />
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdateAttraction &&
                      onUpdateAttraction(idx, 'stats', e.currentTarget.innerText.trim())
                    }
                    className="truncate"
                  >
                    {attraction.stats}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Structural Metrics Bar: 2x2 on Mobile, 4 cols on Widescreen */}
      <div className={`relative z-10 grid ${
        isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-2 sm:grid-cols-4 gap-2.5'
      } pt-2.5 border-t border-white/10`}>
        {data.structureMetrics.map((metric, idx) => (
          <div
            key={idx}
            className="p-2 sm:p-2.5 rounded-lg border backdrop-blur-md flex items-center justify-between"
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              borderColor: 'rgba(255,255,255,0.08)',
            }}
          >
            <div>
              <div
                className="text-xs sm:text-sm font-black tracking-tight"
                style={{ color: theme.primaryColor }}
              >
                {metric.value}
              </div>
              <div className="text-[10px] text-neutral-400 font-medium">
                {metric.label}
              </div>
            </div>
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: theme.primaryColor }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
