import React, { useRef } from 'react';
import { Calendar, MapPin, Award, ShieldCheck, Sparkles, Upload, Camera, Trash2 } from 'lucide-react';
import type { EventData, ThemeConfig, SlideImages, LayoutFormat } from '../../types.ts';

interface SlideProps {
  data: EventData;
  theme: ThemeConfig;
  images: SlideImages;
  format?: LayoutFormat;
  onUpdateText?: (field: keyof EventData, value: string) => void;
  onUpdateImage?: (key: keyof SlideImages, value: string) => void;
}

export const Slide1Cover: React.FC<SlideProps> = ({
  data,
  theme,
  images,
  format = 'widescreen',
  onUpdateText,
  onUpdateImage,
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
        <div className="flex items-center gap-4">
          <div
            onClick={() => logoInputRef.current?.click()}
            title="Clique para adicionar ou trocar a logomarca do seu computador"
            className="group/logo relative cursor-pointer"
          >
            {images.logoUrl ? (
              <div className="h-14 w-14 rounded-2xl overflow-hidden border border-white/20 p-1 bg-black/40 backdrop-blur-md flex items-center justify-center shadow-lg transition-transform group-hover/logo:scale-105">
                <img
                  src={images.logoUrl}
                  alt="Logo do Evento"
                  className="h-full w-full object-contain rounded-xl"
                />
              </div>
            ) : (
              <div
                className="h-14 w-14 rounded-2xl flex flex-col items-center justify-center font-bold text-xs border shadow-lg transition-transform group-hover/logo:scale-105 p-1 text-center"
                style={{
                  borderColor: `${theme.primaryColor}66`,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: theme.primaryColor,
                }}
              >
                <Camera className="w-5 h-5 mb-0.5" />
                <span className="text-[9px] uppercase font-bold">+ Logo</span>
              </div>
            )}

            {/* Hover overlay on logo */}
            <div className="no-print absolute inset-0 bg-black/75 rounded-2xl opacity-0 group-hover/logo:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity text-white text-[9px] font-bold">
              <Upload className="w-4 h-4 text-amber-400" />
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

          <div>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border backdrop-blur-md"
              style={{
                borderColor: `${theme.primaryColor}55`,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: theme.primaryColor,
              }}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Proposta Comercial & Media Kit
            </span>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={handleBlur('category')}
              className="text-xs uppercase tracking-wider text-neutral-400 mt-1 font-semibold"
            >
              {data.category}
            </div>
          </div>
        </div>

        {/* Right side controls: Confidentiality pill + Direct Cover Photo Upload Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            title="Escolher nova foto de capa do seu computador"
            className="no-print flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 hover:border-amber-400 backdrop-blur-md text-xs font-semibold text-neutral-200 hover:text-white transition-all shadow-lg cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Trocar Capa (PC)</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-mono text-neutral-300">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.primaryColor }} />
            CONFIDENCIAL • 2026
          </div>
        </div>
      </div>

      {/* Slide Center Hero */}
      <div className={`relative z-10 my-auto ${isMobile ? 'py-4' : 'py-6'} max-w-4xl`}>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3 bg-white/10 border border-white/15 backdrop-blur-md text-neutral-200">
          <Award className="w-3.5 h-3.5" style={{ color: theme.primaryColor }} />
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur('edition')}
          >
            {data.edition}
          </span>
        </div>

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

        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur('subtitle')}
          className={`${
            isMobile ? 'text-xs sm:text-sm mt-2.5' : 'text-sm sm:text-base md:text-lg mt-3'
          } font-medium max-w-2xl leading-relaxed`}
          style={{ color: theme.primaryColor }}
        >
          {data.subtitle}
        </div>
      </div>

      {/* Slide Footer */}
      <div className={`slide-footer relative z-10 w-full pt-3 border-t border-white/15 ${
        isMobile ? 'flex flex-col gap-2' : 'flex flex-wrap items-center justify-between gap-3'
      } text-[11px] sm:text-xs`}>
        <div className={`flex ${isMobile ? 'flex-col gap-1.5' : 'flex-wrap items-center gap-4'} text-neutral-300`}>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primaryColor }} />
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={handleBlur('date')}
              className="font-semibold"
            >
              {data.date}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primaryColor }} />
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
          </div>
        </div>

        <div className="text-neutral-400 text-[10px] font-mono">
          LÂMINA 01 / 06
        </div>
      </div>
    </div>
  );
};
