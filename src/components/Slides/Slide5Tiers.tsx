import React from 'react';
import {
  Crown,
  Check,
  Star,
  ShieldCheck,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Sparkles,
  X,
} from 'lucide-react';
import type { EventData, ThemeConfig, SlideImages, LayoutFormat, CustomSlideBlock, SponsorshipTier } from '../../types.ts';
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
  onUpdateTierBadge?: (tierId: string, badge: string) => void;
  onUpdateTier?: (tierId: string, field: keyof SponsorshipTier, value: any) => void;
  onToggleBlock?: (field: keyof EventData, show: boolean) => void;
  onAddTier?: (tier: SponsorshipTier) => void;
  onRemoveTier?: (tierId: string) => void;
  onAddDeliverable?: (tierId: string, deliverable: string) => void;
  onRemoveDeliverable?: (tierId: string, index: number) => void;
  onAddCustomBlock?: (block: CustomSlideBlock) => void;
  onRemoveCustomBlock?: (id: string) => void;
  onUpdateCustomBlock?: (id: string, field: 'title' | 'content', value: string) => void;
}

export const Slide5Tiers: React.FC<SlideProps> = ({
  data,
  theme,
  format = 'widescreen',
  onUpdateText,
  onUpdateTierPrice,
  onUpdateTierQuotas,
  onUpdateTierTitle,
  onUpdateTierBadge,
  onUpdateTier,
  onToggleBlock,
  onAddTier,
  onRemoveTier,
  onAddDeliverable,
  onRemoveDeliverable,
  onAddCustomBlock,
  onRemoveCustomBlock,
  onUpdateCustomBlock,
}) => {
  const isMobile = format === 'mobile';
  const isA4 = format === 'a4Portrait';

  const handleBlur = (field: keyof EventData) => (e: React.FocusEvent<HTMLElement>) => {
    if (onUpdateText) {
      onUpdateText(field, e.currentTarget.innerText.trim());
    }
  };

  const handleCreateTier = () => {
    if (onAddTier) {
      const newId = 'tier_' + Date.now();
      onAddTier({
        id: newId,
        name: 'COTA PERSONALIZADA',
        badge: 'PATROCÍNIO EXCLUSIVO',
        price: 75000,
        quotasAvailable: 2,
        highlighted: false,
        deliverables: [
          'Logotipo em todos os materiais de divulgação',
          'Espaço para ativação de marca',
          'Ingressos VIP com acesso a camarote',
          'Menção nas redes sociais oficiais',
        ],
      });
    }
  };

  const handleCreateBlock = () => {
    if (onAddCustomBlock) {
      onAddCustomBlock({
        id: 'block_s5_' + Date.now(),
        title: 'Condições Especiais de Pagamento',
        content: 'Parcelamento em até 4x sem juros ou desconto de 5% para quitação à vista.',
      });
    }
  };

  const showIcons = !data.hideAllIcons && data.showIconsSlide5 !== false;
  const showTitle = data.showTiersTitle !== false;
  const showBadge = data.showTierBadge !== false;
  const showDeliverables = data.showTierDeliverables !== false;

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
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur('tiersBadge')}
            title="Clique para editar este título / balão"
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border mb-1 backdrop-blur-md outline-none hover:border-amber-400 cursor-text"
            style={{
              borderColor: `${theme.primaryColor}55`,
              backgroundColor: 'rgba(0,0,0,0.4)',
              color: theme.primaryColor,
            }}
          >
            {showIcons && <Crown className="w-3 h-3" />}
            {data.tiersBadge || 'Investimento & Retorno'}
          </span>
          {showTitle && (
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
          )}
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur('tiersSubtitle')}
            className="text-[10px] sm:text-xs text-neutral-400 mt-0.5 max-w-xl"
          >
            {data.tiersSubtitle}
          </p>
        </div>

        <div className="text-right text-[10px] sm:text-[11px] font-mono text-neutral-400 flex flex-col items-end gap-1">
          {onToggleBlock && (
            <button
              type="button"
              onClick={() => onToggleBlock('showIconsSlide5', !showIcons)}
              title={showIcons ? 'Ocultar ícones desta lâmina' : 'Exibir ícones desta lâmina'}
              className="no-print flex items-center gap-1 px-2 py-0.5 rounded bg-black/40 hover:bg-neutral-800 border border-white/10 text-[9px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              {showIcons ? <EyeOff className="w-2.5 h-2.5 text-neutral-400" /> : <Eye className="w-2.5 h-2.5 text-amber-400" />}
              <span>{showIcons ? 'Ocultar Ícones' : 'Exibir Ícones'}</span>
            </button>
          )}
          <span>{data.name}</span>
          <div className="text-neutral-500">LÂMINA 05 / 06</div>
        </div>
      </div>

      {/* 3 Tier Cards (with deletion, additions, and reflow) */}
      <div className="relative z-10 my-auto space-y-2">
        <div className="flex items-center justify-between text-[10px] text-neutral-400">
          <span className="font-bold uppercase tracking-wider">Cotas Configuradas ({data.tiers.length})</span>
          {onAddTier && (
            <button
              type="button"
              onClick={handleCreateTier}
              className="no-print flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-semibold border border-white/10 transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Adicionar Cota</span>
            </button>
          )}
        </div>

        <div
          className={`grid gap-3.5 items-stretch ${
            isMobile
              ? 'flex flex-col gap-2.5'
              : data.tiers.length === 1
              ? 'grid-cols-1 max-w-md mx-auto'
              : data.tiers.length === 2
              ? 'grid-cols-1 sm:grid-cols-2'
              : data.tiers.length === 3
              ? 'grid-cols-1 md:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          }`}
        >
          {data.tiers.map((tier) => (
            <div
              key={tier.id}
              className={`group/tier relative rounded-xl border backdrop-blur-md p-3.5 sm:p-4 flex flex-col justify-between shadow-xl transition-all ${
                tier.highlighted
                  ? 'border-amber-400/80 ring-1 ring-amber-400/40 shadow-amber-950/30'
                  : 'hover:border-white/30'
              }`}
              style={{
                backgroundColor: theme.cardBg,
                borderColor: tier.highlighted ? theme.primaryColor : theme.cardBorder,
              }}
            >
              {/* Delete Tier Button on hover */}
              {onRemoveTier && (
                <button
                  type="button"
                  onClick={() => onRemoveTier(tier.id)}
                  title="Excluir este balão / cota"
                  className="no-print absolute top-2 right-2 opacity-0 group-hover/tier:opacity-100 p-1 rounded-md text-red-400 hover:text-red-200 hover:bg-red-500/20 transition-all cursor-pointer z-30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              <div>
                {/* Header of Tier (Badge e Categoria) */}
                {showBadge && (
                  <>
                    {!tier.hideBadge ? (
                      <div className="group/badge relative flex items-center gap-1.5 mb-1 text-[9px] font-bold uppercase tracking-wider">
                        {showIcons && tier.highlighted && <Crown className="w-3 h-3 text-amber-400 shrink-0" />}
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const val = e.currentTarget.innerText.trim();
                            if (onUpdateTierBadge) {
                              onUpdateTierBadge(tier.id, val);
                            } else if (onUpdateTier) {
                              onUpdateTier(tier.id, 'badge', val);
                            }
                          }}
                          title="Clique para editar este texto (ex: PATROCÍNIO EXCLUSIVO, COTA MASTER, etc.)"
                          className="outline-none hover:ring-1 hover:ring-amber-400/60 rounded px-1 py-0.5 transition-all cursor-text font-bold"
                          style={{ color: tier.highlighted ? theme.primaryColor : '#a1a1aa' }}
                        >
                          {tier.badge || 'PATROCÍNIO EXCLUSIVO'}
                        </span>
                        {onUpdateTier && (
                          <button
                            type="button"
                            onClick={() => onUpdateTier(tier.id, 'hideBadge', true)}
                            title="Excluir este balão / badge"
                            className="no-print opacity-0 group-hover/badge:opacity-100 p-0.5 rounded text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-opacity cursor-pointer"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    ) : (
                      onUpdateTier && (
                        <div className="mb-1">
                          <button
                            type="button"
                            onClick={() => onUpdateTier(tier.id, 'hideBadge', false)}
                            title="Readicionar badge / balão superior"
                            className="no-print inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-white/10 transition-colors cursor-pointer"
                          >
                            <Plus className="w-2.5 h-2.5 text-amber-400" />
                            <span>+ Badge</span>
                          </button>
                        </div>
                      )
                    )}
                  </>
                )}

                <h3
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdateTierTitle && onUpdateTierTitle(tier.id, e.currentTarget.innerText.trim())
                  }
                  className="text-sm sm:text-base font-black tracking-tight text-white mb-2 outline-none hover:ring-1 hover:ring-amber-400/50 rounded px-1 transition-all cursor-text"
                  style={{ fontFamily: theme.fontFamilyHead }}
                >
                  {tier.name}
                </h3>

                {/* Price and Quotas */}
                <div className="p-2 sm:p-2.5 rounded-lg bg-black/40 border border-white/10 mb-3">
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const num = parseInt(e.currentTarget.innerText.replace(/\D/g, ''), 10) || 0;
                      onUpdateTierPrice && onUpdateTierPrice(tier.id, num);
                    }}
                    className="text-lg sm:text-xl md:text-2xl font-black tracking-tight outline-none"
                    style={{ color: tier.highlighted ? theme.primaryColor : '#FFFFFF' }}
                  >
                    {formatCurrencyBRL(tier.price)}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-0.5">
                    <span>Cotas disponíveis:</span>
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const q = parseInt(e.currentTarget.innerText.replace(/\D/g, ''), 10) || 1;
                        onUpdateTierQuotas && onUpdateTierQuotas(tier.id, q);
                      }}
                      className="font-bold text-neutral-200 outline-none"
                    >
                      {tier.quotasAvailable} {tier.quotasAvailable === 1 ? 'única' : 'disponíveis'}
                    </span>
                  </div>
                </div>

                {/* Deliverables List */}
                {showDeliverables && (
                  <div className="space-y-1.5 text-[10px] sm:text-[10.5px]">
                    <div className="flex items-center justify-between text-neutral-400 text-[9px] uppercase font-bold mb-1">
                      <span>Contrapartidas</span>
                      {onAddDeliverable && (
                        <button
                          type="button"
                          onClick={() => onAddDeliverable(tier.id, 'Nova contrapartida da cota')}
                          className="no-print text-amber-400 hover:text-amber-300 flex items-center gap-0.5 cursor-pointer font-normal"
                        >
                          <Plus className="w-2.5 h-2.5" /> <span>Adicionar</span>
                        </button>
                      )}
                    </div>

                    {tier.deliverables.map((del, dIdx) => (
                      <div
                        key={dIdx}
                        className="group/del flex items-start gap-1.5 text-neutral-200 leading-tight"
                      >
                        {showIcons && (
                          <Check
                            className="w-3 h-3 shrink-0 mt-0.5"
                            style={{ color: theme.primaryColor }}
                          />
                        )}
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            if (tier.deliverables) {
                              tier.deliverables[dIdx] = e.currentTarget.innerText.trim();
                            }
                          }}
                          className="flex-1 outline-none"
                        >
                          {del}
                        </span>
                        {onRemoveDeliverable && (
                          <button
                            type="button"
                            onClick={() => onRemoveDeliverable(tier.id, dIdx)}
                            title="Remover contrapartida"
                            className="opacity-0 group-hover/del:opacity-100 p-0.5 text-neutral-500 hover:text-red-400 transition-opacity cursor-pointer shrink-0"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Custom Balloons Added by User on Slide 5 */}
        {data.customBlocksSlide5 && data.customBlocksSlide5.length > 0 && (
          <div className="grid gap-3 pt-2 grid-cols-1 sm:grid-cols-2">
            {data.customBlocksSlide5.map((b) => (
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

      {/* Restoration Toolbar */}
      <div className="no-print relative z-10 flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-white/10 text-[9px] sm:text-[10px] text-neutral-400">
        <div className="flex items-center gap-1.5 flex-wrap">
          {(!showTitle || !showBadge || !showDeliverables || data.tiers.some((t) => t.hideBadge)) && onToggleBlock && (
            <>
              {!showTitle && (
                <button
                  type="button"
                  onClick={() => onToggleBlock('showTiersTitle', true)}
                  className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" /> <span>+ Título das Cotas</span>
                </button>
              )}
              {!showBadge && (
                <button
                  type="button"
                  onClick={() => onToggleBlock('showTierBadge', true)}
                  className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" /> <span>+ Badges das Cotas</span>
                </button>
              )}
              {!showDeliverables && (
                <button
                  type="button"
                  onClick={() => onToggleBlock('showTierDeliverables', true)}
                  className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-white/10 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" /> <span>+ Contrapartidas</span>
                </button>
              )}
              {data.tiers.some((t) => t.hideBadge) && onUpdateTier && (
                <button
                  type="button"
                  onClick={() => {
                    data.tiers.forEach((t) => {
                      if (t.hideBadge) onUpdateTier(t.id, 'hideBadge', false);
                    });
                  }}
                  className="px-2 py-0.5 rounded bg-neutral-800/90 text-amber-300 hover:text-white border border-amber-400/30 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" /> <span>+ Restaurar Badges Excluídas</span>
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
              <span>+ Novo Balão nas Cotas</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
