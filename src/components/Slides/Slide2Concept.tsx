import React, { useRef } from 'react';
import { Sparkles, Flame, Users, Quote, Compass, Camera, Upload } from 'lucide-react';
import type { EventData, ThemeConfig, SlideImages, LayoutFormat } from '../../types.ts';

interface SlideProps {
  data: EventData;
  theme: ThemeConfig;
  images: SlideImages;
  format?: LayoutFormat;
  onUpdateText?: (field: keyof EventData, value: string) => void;
  onUpdatePillar?: (index: number, field: 'title' | 'description', value: string) => void;
  onUpdateImage?: (key: keyof SlideImages, value: string) => void;
}

export const Slide2Concept: React.FC<SlideProps> = ({
  data,
  theme,
  images,
  format = 'widescreen',
  onUpdateText,
  onUpdatePillar,
  onUpdateImage,
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
        background: theme.bgGradient,
        fontFamily: theme.fontFamilyBody,
      }}
    >
      {/* Background glow overlay */}
      <div
        className="absolute -top-20 -left-20 w-[40vw] h-[40vw] rounded-full blur-[140px] opacity-15 pointer-events-none"
        style={{ background: theme.primaryColor }}
      />
      <div
        className="absolute bottom-0 right-0 w-[35vw] h-[35vw] rounded-full blur-[120px] opacity-10 pointer-events-none"
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
            <Compass className="w-3 h-3" />
            Propósito & Identidade
          </span>
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
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur('conceptSubtitle')}
            className="text-[10px] sm:text-xs text-neutral-400 mt-0.5 max-w-xl"
          >
            {data.conceptSubtitle}
          </p>
        </div>
        <div className="text-right text-[10px] sm:text-[11px] font-mono text-neutral-400">
          <span>{data.name}</span>
          <div className="text-neutral-500">LÂMINA 02 / 06</div>
        </div>
      </div>

      {/* Hidden file input for direct computer upload */}
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Content Area */}
      {isMobile ? (
        /* Mobile Vertical Stack: Image on top (approx 35-40%), text below */
        <div className="relative z-10 flex-1 flex flex-col justify-between py-2 space-y-2.5">
          {/* Top Image Card: ~40% of height */}
          <div
            className="group relative rounded-xl overflow-hidden border shadow-lg h-44 sm:h-48 w-full shrink-0"
            style={{ borderColor: theme.cardBorder }}
          >
            <img
              src={images.slide2Concept}
              alt="Experiência do Evento"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            
            {/* Direct upload overlay button on hover */}
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              title="Trocar imagem do seu computador"
              className="no-print absolute top-2 right-2 flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-black/80 hover:bg-black border border-white/20 hover:border-amber-400 text-[10px] font-bold text-white shadow-xl transition-all cursor-pointer"
            >
              <Camera className="w-3 h-3 text-amber-400" />
              <span>Trocar Foto (PC)</span>
            </button>

            <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md border border-white/20 text-white">
                Experiência 360°
              </span>
              <span className="text-[9px] font-mono text-neutral-300">
                Imersão Completa
              </span>
            </div>
          </div>

          {/* Story Card */}
          <div
            className="p-3 rounded-lg border backdrop-blur-md"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.cardBorder,
            }}
          >
            <h3 className="text-[9px] uppercase font-bold tracking-widest text-neutral-400 mb-1">
              A Atmosfera & Por Que É Único
            </h3>
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={handleBlur('conceptStory')}
              className="text-[11px] leading-relaxed text-neutral-200"
            >
              {data.conceptStory}
            </p>
          </div>

          {/* Manifesto Quote */}
          <div
            className="relative p-2.5 rounded-lg border-l-3 backdrop-blur-md bg-white/5 border border-white/10"
            style={{ borderLeftColor: theme.primaryColor }}
          >
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={handleBlur('manifestoQuote')}
              className="text-[11px] italic font-serif leading-tight"
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

          {/* 3 Pillars in compact stack */}
          <div className="space-y-1.5 pt-1 border-t border-white/10">
            {data.pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-1.5 rounded-md border flex items-center gap-2"
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                }}
              >
                <div
                  className="p-1 rounded bg-black/40 border shrink-0"
                  style={{ borderColor: `${theme.primaryColor}44`, color: theme.primaryColor }}
                >
                  {iconMap[pillar.iconName] || <Sparkles className="w-3.5 h-3.5" />}
                </div>
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
            ))}
          </div>
        </div>
      ) : (
        /* Widescreen / A4 Layout */
        <>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 my-auto items-center">
            {/* Left column (7 cols) - Narrative & Manifesto */}
            <div className="md:col-span-7 space-y-3">
              <div
                className="p-3.5 sm:p-4 rounded-xl border backdrop-blur-md transition-all shadow-lg"
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                }}
              >
                <h3 className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 mb-1.5">
                  A Atmosfera & Por Que É Único
                </h3>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleBlur('conceptStory')}
                  className="text-xs sm:text-[13px] leading-relaxed text-neutral-200"
                >
                  {data.conceptStory}
                </p>
              </div>

              {/* Manifesto Quote Card */}
              <div
                className="relative p-3 sm:p-3.5 rounded-xl border-l-4 backdrop-blur-md bg-white/5 border border-white/10"
                style={{ borderLeftColor: theme.primaryColor }}
              >
                <Quote
                  className="w-6 h-6 opacity-20 absolute top-2 right-2"
                  style={{ color: theme.primaryColor }}
                />
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
            </div>

            {/* Right column (5 cols) - Lifestyle Image with Luxury Glow */}
            <div className="md:col-span-5 relative group">
              <div
                className="relative rounded-xl overflow-hidden border shadow-xl aspect-[16/10] w-full max-h-44"
                style={{ borderColor: theme.cardBorder }}
              >
                <img
                  src={images.slide2Concept}
                  alt="Experiência do Evento"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                
                {/* Direct upload overlay button on hover */}
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  title="Trocar imagem do seu computador"
                  className="no-print absolute top-2 right-2 flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-black/80 hover:bg-black border border-white/20 hover:border-amber-400 text-[10px] font-bold text-white shadow-xl transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                >
                  <Camera className="w-3 h-3 text-amber-400" />
                  <span>Trocar Foto (PC)</span>
                </button>

                <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md border border-white/20 text-white">
                    Experiência 360°
                  </span>
                  <span className="text-[10px] font-mono text-neutral-300">
                    Imersão Completa
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Experience Pillars Bottom Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2.5 border-t border-white/10">
            {data.pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-2.5 sm:p-3 rounded-lg border backdrop-blur-md flex items-start gap-2.5 transition-all"
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                }}
              >
                <div
                  className="p-1.5 rounded-md bg-black/40 border shrink-0"
                  style={{
                    borderColor: `${theme.primaryColor}44`,
                    color: theme.primaryColor,
                  }}
                >
                  {iconMap[pillar.iconName] || <Sparkles className="w-4 h-4" />}
                </div>
                <div>
                  <h4
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdatePillar &&
                      onUpdatePillar(idx, 'title', e.currentTarget.innerText.trim())
                    }
                    className="text-[11px] sm:text-xs font-bold uppercase tracking-wider"
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
                    className="text-[10px] sm:text-[11px] text-neutral-300 mt-0.5 leading-tight"
                  >
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

