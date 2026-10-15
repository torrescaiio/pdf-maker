import React, { useRef } from 'react';
import { Mail, Phone, Instagram, Globe, ShieldCheck, Sparkles, Handshake, CheckCircle, Camera, Upload, Plus, Trash2 } from 'lucide-react';
import type { EventData, ThemeConfig, SlideImages, LayoutFormat } from '../../types.ts';

interface SlideProps {
  data: EventData;
  theme: ThemeConfig;
  images: SlideImages;
  format?: LayoutFormat;
  onUpdateText?: (field: keyof EventData, value: string) => void;
  onUpdateImage?: (key: keyof SlideImages, value: string) => void;
  onAddSponsorLogo?: (logoUrl: string) => void;
  onRemoveSponsorLogo?: (index: number) => void;
}

export const Slide6Closing: React.FC<SlideProps> = ({
  data,
  theme,
  images,
  format = 'widescreen',
  onUpdateText,
  onUpdateImage,
  onAddSponsorLogo,
  onRemoveSponsorLogo,
}) => {
  const isMobile = format === 'mobile';
  const isA4 = format === 'a4Portrait';
  const bgInputRef = useRef<HTMLInputElement>(null);
  const sponsorInputRef = useRef<HTMLInputElement>(null);

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
          onUpdateImage('slide6Closing', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSponsorLogosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !onAddSponsorLogo) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onAddSponsorLogo(reader.result);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const aspectClass = isMobile ? 'aspect-[9/16]' : isA4 ? 'aspect-[210/297]' : 'aspect-[16/9]';

  return (
    <div
      className={`slide-container-print relative w-full h-full ${aspectClass} flex flex-col justify-between overflow-hidden ${
        isMobile ? 'p-5 sm:p-6' : isA4 ? 'p-8 sm:p-10' : 'p-6 sm:p-8 md:p-9 lg:p-10'
      } select-text text-white shadow-2xl transition-all`}
      style={{
        backgroundColor: theme.bgColor,
        backgroundImage: `linear-gradient(135deg, rgba(9, 9, 11, 0.94) 0%, rgba(18, 16, 24, 0.88) 50%, rgba(9, 9, 11, 0.96) 100%), url('${images.slide6Closing}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: theme.fontFamilyBody,
      }}
    >
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={bgInputRef}
        accept="image/*"
        onChange={handleBgFileChange}
        className="hidden"
      />
      <input
        type="file"
        ref={sponsorInputRef}
        multiple
        accept="image/*"
        onChange={handleSponsorLogosUpload}
        className="hidden"
      />

      {/* Background glow effects */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45vw] h-[45vw] rounded-full blur-[160px] opacity-20 pointer-events-none"
        style={{ background: theme.primaryColor }}
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
            <Handshake className="w-3 h-3" />
            Parceria & Próximos Passos
          </span>
          <h2
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur('closingTitle')}
            className={`${
              isMobile ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl md:text-3xl'
            } font-black uppercase tracking-tight max-w-2xl`}
            style={{ fontFamily: theme.fontFamilyHead }}
          >
            {data.closingTitle}
          </h2>
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur('closingSubtitle')}
            className="text-[10px] sm:text-xs text-neutral-400 mt-0.5 max-w-xl"
          >
            {data.closingSubtitle}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <button
            type="button"
            onClick={() => bgInputRef.current?.click()}
            title="Trocar imagem de fundo do slide do seu computador"
            className="no-print flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 hover:border-amber-400 text-[11px] font-semibold text-neutral-200 hover:text-white transition-all shadow-md cursor-pointer"
          >
            <Camera className="w-3 h-3 text-amber-400" />
            <span>Trocar Fundo (PC)</span>
          </button>
          <div className="text-right text-[10px] sm:text-[11px] font-mono text-neutral-400">
            <span>{data.name}</span>
            <div className="text-neutral-500">LÂMINA 06 / 06</div>
          </div>
        </div>
      </div>

      {/* Center Commercial Executive Card & Channels */}
      <div className={`relative z-10 ${
        isMobile ? 'flex flex-col gap-2.5 my-auto' : 'grid grid-cols-1 md:grid-cols-12 gap-5 my-auto items-center'
      }`}>
        {/* Left Column: CTA message + Brand Logo & Sponsor Logos */}
        <div className={`${isMobile ? 'w-full' : 'md:col-span-6'} space-y-2.5`}>
          <div
            className="p-3.5 sm:p-4 rounded-xl border backdrop-blur-md shadow-xl"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.cardBorder,
            }}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" style={{ color: theme.primaryColor }} />
              <span
                className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider"
                style={{ color: theme.primaryColor }}
              >
                Ativações Feitas Sob Medida
              </span>
            </div>

            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={handleBlur('closingCta')}
              className="text-[11px] sm:text-xs leading-relaxed text-neutral-200 font-medium"
            >
              {data.closingCta}
            </p>

            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-[11px] text-neutral-400">
              <span className="flex items-center gap-1 text-neutral-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Atendimento consultivo direto
              </span>
              <span>Edição Limitada</span>
            </div>
          </div>

          {/* Sponsor & Partner Logos Strip */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Marcas & Patrocinadores Confirmados
              </span>
              <button
                type="button"
                onClick={() => sponsorInputRef.current?.click()}
                title="Adicionar logomarcas de patrocinadores do seu computador"
                className="no-print flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 text-[10px] font-bold cursor-pointer transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>+ Logo (PC)</span>
              </button>
            </div>

            {images.sponsorLogos && images.sponsorLogos.length > 0 ? (
              <div className="flex items-center gap-2 flex-wrap">
                {images.sponsorLogos.map((sLogo, sIdx) => (
                  <div
                    key={sIdx}
                    className="group/slogo relative h-9 px-2 py-1 rounded-lg bg-white/5 border border-white/15 flex items-center justify-center transition-all hover:bg-white/10"
                  >
                    <img
                      src={sLogo}
                      alt="Logo Parceiro"
                      className="h-full max-w-[70px] object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveSponsorLogo && onRemoveSponsorLogo(sIdx)}
                      title="Remover logotipo de patrocinador"
                      className="no-print absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white opacity-0 group-hover/slogo:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-neutral-400 italic">
                Nenhum logotipo de patrocinador adicionado ainda. Clique em "+ Logo (PC)" para carregar do seu computador.
              </p>
            )}
          </div>

          {/* Confidentiality seal card */}
          <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex items-center gap-2 text-[10px] sm:text-[11px] text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-neutral-200 font-semibold">Proposta Oficial:</span>{' '}
              Válida por {data.proposalValidityDays} dias a contar da apresentação comercial.
            </div>
          </div>
        </div>

        {/* Right Column: Contact Card with Channels & Signature space */}
        <div className={`${isMobile ? 'w-full' : 'md:col-span-6'}`}>
          <div
            className="p-4 sm:p-5 rounded-xl border backdrop-blur-md shadow-xl relative"
            style={{
              backgroundColor: 'rgba(20, 20, 26, 0.92)',
              borderColor: theme.primaryColor,
              borderWidth: '1.5px',
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 font-mono">
                  Contato Comercial Direto
                </span>
                <h3
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleBlur('contactName')}
                  className="text-lg sm:text-xl font-black tracking-tight text-white mt-0.5"
                >
                  {data.contactName}
                </h3>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleBlur('contactRole')}
                  className="text-[11px] sm:text-xs font-semibold mt-0.5"
                  style={{ color: theme.primaryColor }}
                >
                  {data.contactRole}
                </div>
              </div>

              {images.logoUrl && (
                <img
                  src={images.logoUrl}
                  alt="Logo"
                  className="w-10 h-10 rounded-lg object-cover border border-white/10"
                />
              )}
            </div>

            {/* Channels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2.5 border-t border-white/10">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-black/50 border border-white/5">
                <Phone className="w-3.5 h-3.5" style={{ color: theme.primaryColor }} />
                <div>
                  <div className="text-[9px] text-neutral-400 uppercase font-bold">WhatsApp / Telefone</div>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBlur('contactPhone')}
                    className="font-medium text-neutral-200 font-mono text-[11px]"
                  >
                    {data.contactPhone}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-black/50 border border-white/5">
                <Mail className="w-3.5 h-3.5" style={{ color: theme.primaryColor }} />
                <div>
                  <div className="text-[9px] text-neutral-400 uppercase font-bold">E-mail Corporativo</div>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBlur('contactEmail')}
                    className="font-medium text-neutral-200 truncate text-[11px]"
                  >
                    {data.contactEmail}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-black/50 border border-white/5">
                <Instagram className="w-3.5 h-3.5" style={{ color: theme.secondaryColor }} />
                <div>
                  <div className="text-[9px] text-neutral-400 uppercase font-bold">Instagram Oficial</div>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBlur('contactInstagram')}
                    className="font-medium text-neutral-200 text-[11px]"
                  >
                    {data.contactInstagram}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-black/50 border border-white/5">
                <Globe className="w-3.5 h-3.5" style={{ color: theme.secondaryColor }} />
                <div>
                  <div className="text-[9px] text-neutral-400 uppercase font-bold">Portal Web</div>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBlur('contactWebsite')}
                    className="font-medium text-neutral-200 truncate text-[11px]"
                  >
                    {data.contactWebsite}
                  </div>
                </div>
              </div>
            </div>

            {/* Signature Area */}
            <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-end justify-between">
              <div>
                <div className="text-[9px] uppercase font-bold tracking-wider text-neutral-400">
                  Assinatura do Responsável
                </div>
                <div className="h-6 flex items-end font-serif italic text-xs text-neutral-300">
                  {data.contactName}
                </div>
              </div>

              <div className="text-right text-[9px] text-neutral-500 font-mono">
                {data.city}, {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Footer */}
      <div className="slide-footer relative z-10 w-full pt-4 border-t border-white/15 flex items-center justify-between text-xs text-neutral-400">
        <div>
          {data.name} • Todos os direitos reservados • {data.edition}
        </div>
        <div className="font-mono">
          LÂMINA 06 / 06
        </div>
      </div>
    </div>
  );
};
