import React, { useRef } from 'react';
import {
  Mail,
  Phone,
  Instagram,
  Globe,
  ShieldCheck,
  Sparkles,
  Handshake,
  CheckCircle,
  Camera,
  Upload,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';
import type { EventData, ThemeConfig, SlideImages, LayoutFormat, CustomSlideBlock } from '../../types.ts';

interface SlideProps {
  data: EventData;
  theme: ThemeConfig;
  images: SlideImages;
  format?: LayoutFormat;
  onUpdateText?: (field: keyof EventData, value: string) => void;
  onUpdateImage?: (key: keyof SlideImages, value: string) => void;
  onAddSponsorLogo?: (logoUrl: string) => void;
  onRemoveSponsorLogo?: (index: number) => void;
  onToggleBlock?: (field: keyof EventData, show: boolean) => void;
  onAddCustomBlock?: (block: CustomSlideBlock) => void;
  onRemoveCustomBlock?: (id: string) => void;
  onUpdateCustomBlock?: (id: string, field: 'title' | 'content', value: string) => void;
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
  onToggleBlock,
  onAddCustomBlock,
  onRemoveCustomBlock,
  onUpdateCustomBlock,
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

  const handleCreateBlock = () => {
    if (onAddCustomBlock) {
      onAddCustomBlock({
        id: 'block_s6_' + Date.now(),
        title: 'Próxima Reunião de Alinhamento',
        content: 'Agende uma conversa de 15 minutos pelo link de videoconferência ou WhatsApp.',
      });
    }
  };

  const showIcons = !data.hideAllIcons && data.showIconsSlide6 !== false;
  const showCta = data.showClosingCta !== false;
  const showContact = data.showContactCard !== false;
  const showPhone = data.showContactPhone !== false;
  const showEmail = data.showContactEmail !== false;
  const showInstagram = data.showContactInstagram !== false;
  const showWebsite = data.showContactWebsite !== false;
  const showSponsors = data.showClosingSponsors !== false;
  const showValidity = data.showClosingValidity !== false;

  const hasExcludedBalloons = !showCta || !showContact || !showSponsors || !showValidity;

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
            {showIcons && <Handshake className="w-3 h-3" />}
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
          <div className="flex items-center gap-1.5">
            {onToggleBlock && (
              <button
                type="button"
                onClick={() => onToggleBlock('showIconsSlide6', !showIcons)}
                title={showIcons ? 'Ocultar ícones desta lâmina' : 'Exibir ícones desta lâmina'}
                className="no-print flex items-center gap-1 px-2 py-0.5 rounded bg-black/40 hover:bg-neutral-800 border border-white/10 text-[9px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                {showIcons ? <EyeOff className="w-2.5 h-2.5 text-neutral-400" /> : <Eye className="w-2.5 h-2.5 text-amber-400" />}
                <span>{showIcons ? 'Ocultar Ícones' : 'Exibir Ícones'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => bgInputRef.current?.click()}
              title="Trocar imagem de fundo do slide do seu computador"
              className="no-print flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 hover:border-amber-400 text-[11px] font-semibold text-neutral-200 hover:text-white transition-all shadow-md cursor-pointer"
            >
              <Camera className="w-3 h-3 text-amber-400" />
              <span>Trocar Fundo (PC)</span>
            </button>
          </div>
          <div className="text-right text-[10px] sm:text-[11px] font-mono text-neutral-400">
            <span>{data.name}</span>
            <div className="text-neutral-500">LÂMINA 06 / 06</div>
          </div>
        </div>
      </div>

      {/* Center Commercial Executive Card & Channels */}
      <div className={`relative z-10 my-auto ${
        isMobile
          ? 'flex flex-col gap-2.5'
          : !showCta && !showSponsors
          ? 'grid grid-cols-1 max-w-2xl mx-auto'
          : !showContact
          ? 'grid grid-cols-1 max-w-2xl mx-auto'
          : 'grid grid-cols-1 md:grid-cols-12 gap-5 items-center'
      }`}>
        {/* Left Column: CTA message + Brand Logo & Sponsor Logos */}
        {(showCta || showSponsors) && (
          <div className={`${isMobile || !showContact ? 'w-full' : 'md:col-span-6'} space-y-2.5`}>
            {showCta && (
              <div
                className="group/cta relative p-3.5 sm:p-4 rounded-xl border backdrop-blur-md shadow-xl"
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {showIcons && <Sparkles className="w-3.5 h-3.5" style={{ color: theme.primaryColor }} />}
                    <span
                      className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider"
                      style={{ color: theme.primaryColor }}
                    >
                      Ativações Feitas Sob Medida
                    </span>
                  </div>
                  {onToggleBlock && (
                    <button
                      type="button"
                      onClick={() => onToggleBlock('showClosingCta', false)}
                      title="Excluir este balão de mensagem"
                      className="opacity-0 group-hover/cta:opacity-100 p-0.5 rounded text-red-400 hover:text-red-200 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleBlur('closingCta')}
                  className="text-xs sm:text-[13px] text-neutral-200 leading-relaxed outline-none"
                >
                  {data.closingCta}
                </p>
              </div>
            )}

            {/* Official Logo and Sponsor Logos Strip */}
            {showSponsors && (
              <div
                className="group/sponsors relative p-3 rounded-xl border backdrop-blur-md"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  borderColor: 'rgba(255,255,255,0.08)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    Chancela Oficial & Marcas Parceiras
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => sponsorInputRef.current?.click()}
                      className="no-print text-amber-400 hover:text-amber-300 text-[10px] flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Plus className="w-3 h-3" /> <span>Adicionar Logo</span>
                    </button>
                    {onToggleBlock && (
                      <button
                        type="button"
                        onClick={() => onToggleBlock('showClosingSponsors', false)}
                        title="Excluir faixa de marcas"
                        className="opacity-0 group-hover/sponsors:opacity-100 p-0.5 rounded text-neutral-500 hover:text-red-400 transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {images.logoUrl && (
                    <div className="h-9 p-1 bg-white/10 rounded-lg border border-white/20 flex items-center justify-center shrink-0">
                      <img src={images.logoUrl} alt="Logo Oficial" className="h-full object-contain" />
                    </div>
                  )}

                  {images.sponsorLogos && images.sponsorLogos.length > 0 ? (
                    images.sponsorLogos.map((logo, idx) => (
                      <div
                        key={idx}
                        className="group/slogo relative h-9 p-1 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 flex items-center justify-center transition-all shrink-0"
                      >
                        <img src={logo} alt="Sponsor" className="h-full object-contain" />
                        {onRemoveSponsorLogo && (
                          <button
                            type="button"
                            onClick={() => onRemoveSponsorLogo(idx)}
                            className="no-print absolute -top-1 -right-1 p-0.5 rounded-full bg-red-600 text-white opacity-0 group-hover/slogo:opacity-100 transition-opacity cursor-pointer shadow"
                          >
                            <Trash2 className="w-2 h-2" />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-[10px] text-neutral-500 italic">
                      Nenhuma marca de apoiador adicionada ainda.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Column: Contact Card */}
        {showContact && (
          <div className={`${isMobile || !showCta ? 'w-full' : 'md:col-span-6'}`}>
            <div
              className="group/contact relative p-4 sm:p-5 rounded-2xl border backdrop-blur-md shadow-2xl transition-all"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
              }}
            >
              {onToggleBlock && (
                <button
                  type="button"
                  onClick={() => onToggleBlock('showContactCard', false)}
                  title="Excluir este balão de contato"
                  className="no-print absolute top-2 right-2 opacity-0 group-hover/contact:opacity-100 p-1 rounded-md text-red-400 hover:text-red-200 hover:bg-red-500/20 transition-all cursor-pointer z-30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="flex items-center gap-3 mb-3 border-b border-white/10 pb-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-base text-neutral-950 shrink-0 shadow-lg"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {data.contactName.charAt(0)}
                </div>
                <div>
                  <h4
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBlur('contactName')}
                    className="text-sm sm:text-base font-black text-white outline-none"
                    style={{ fontFamily: theme.fontFamilyHead }}
                  >
                    {data.contactName}
                  </h4>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBlur('contactRole')}
                    className="text-xs text-neutral-400 font-medium outline-none"
                  >
                    {data.contactRole}
                  </div>
                </div>
              </div>

              {/* Channels List */}
              <div className="space-y-2 text-xs">
                {showPhone && (
                  <div className="group/item flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                    <div className="flex items-center gap-2 text-neutral-200 min-w-0">
                      {showIcons && <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primaryColor }} />}
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={handleBlur('contactPhone')}
                        className="truncate outline-none"
                      >
                        {data.contactPhone}
                      </span>
                    </div>
                    {onToggleBlock && (
                      <button
                        type="button"
                        onClick={() => onToggleBlock('showContactPhone', false)}
                        title="Ocultar telefone"
                        className="opacity-0 group-hover/item:opacity-100 text-neutral-500 hover:text-red-400 p-0.5 rounded transition-opacity cursor-pointer"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                )}

                {showEmail && (
                  <div className="group/item flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                    <div className="flex items-center gap-2 text-neutral-200 min-w-0">
                      {showIcons && <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: theme.secondaryColor }} />}
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={handleBlur('contactEmail')}
                        className="truncate outline-none"
                      >
                        {data.contactEmail}
                      </span>
                    </div>
                    {onToggleBlock && (
                      <button
                        type="button"
                        onClick={() => onToggleBlock('showContactEmail', false)}
                        title="Ocultar e-mail"
                        className="opacity-0 group-hover/item:opacity-100 text-neutral-500 hover:text-red-400 p-0.5 rounded transition-opacity cursor-pointer"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                )}

                {showInstagram && (
                  <div className="group/item flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                    <div className="flex items-center gap-2 text-neutral-200 min-w-0">
                      {showIcons && <Instagram className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primaryColor }} />}
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={handleBlur('contactInstagram')}
                        className="truncate outline-none"
                      >
                        {data.contactInstagram}
                      </span>
                    </div>
                    {onToggleBlock && (
                      <button
                        type="button"
                        onClick={() => onToggleBlock('showContactInstagram', false)}
                        title="Ocultar Instagram"
                        className="opacity-0 group-hover/item:opacity-100 text-neutral-500 hover:text-red-400 p-0.5 rounded transition-opacity cursor-pointer"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                )}

                {showWebsite && (
                  <div className="group/item flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                    <div className="flex items-center gap-2 text-neutral-200 min-w-0">
                      {showIcons && <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: theme.secondaryColor }} />}
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={handleBlur('contactWebsite')}
                        className="truncate outline-none"
                      >
                        {data.contactWebsite}
                      </span>
                    </div>
                    {onToggleBlock && (
                      <button
                        type="button"
                        onClick={() => onToggleBlock('showContactWebsite', false)}
                        title="Ocultar website"
                        className="opacity-0 group-hover/item:opacity-100 text-neutral-500 hover:text-red-400 p-0.5 rounded transition-opacity cursor-pointer"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Proposal Validity Card */}
              {showValidity && (
                <div className="group/val relative mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    {showIcons && <ShieldCheck className="w-3.5 h-3.5" style={{ color: theme.primaryColor }} />}
                    <span>Validade da Proposta:</span>
                    <span className="font-bold text-white">
                      {data.proposalValidityDays} dias corridos
                    </span>
                  </div>
                  {onToggleBlock && (
                    <button
                      type="button"
                      onClick={() => onToggleBlock('showClosingValidity', false)}
                      title="Excluir validade"
                      className="opacity-0 group-hover/val:opacity-100 p-0.5 rounded text-neutral-500 hover:text-red-400 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Custom Balloons Added by User on Slide 6 */}
      {data.customBlocksSlide6 && data.customBlocksSlide6.length > 0 && (
        <div className="grid gap-3 pt-2 grid-cols-1 sm:grid-cols-2 relative z-10">
          {data.customBlocksSlide6.map((b) => (
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

      {/* Restoration Toolbar */}
      <div className="no-print relative z-10 flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-white/10 text-[9px] sm:text-[10px] text-neutral-400">
        <div className="flex items-center gap-1.5 flex-wrap">
          {hasExcludedBalloons && onToggleBlock && (
            <>
              {!showCta && (
                <button
                  onClick={() => onToggleBlock('showClosingCta', true)}
                  className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" /> <span>+ Balão de Mensagem</span>
                </button>
              )}
              {!showContact && (
                <button
                  onClick={() => onToggleBlock('showContactCard', true)}
                  className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" /> <span>+ Cartão do Diretor</span>
                </button>
              )}
              {!showSponsors && (
                <button
                  onClick={() => onToggleBlock('showClosingSponsors', true)}
                  className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" /> <span>+ Faixa de Patrocinadores</span>
                </button>
              )}
              {!showValidity && (
                <button
                  onClick={() => onToggleBlock('showClosingValidity', true)}
                  className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" /> <span>+ Validade</span>
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
              <span>+ Novo Balão no Fechamento</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
