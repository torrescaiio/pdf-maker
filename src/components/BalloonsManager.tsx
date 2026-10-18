import React, { useState } from 'react';
import {
  Layers,
  RotateCcw,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Radio,
  Award,
  Sparkles,
  X,
  Camera,
} from 'lucide-react';
import type { EventData, ThemeConfig, CustomSlideBlock } from '../types.ts';
import { IconPicker } from '../utils/iconMap.tsx';

interface BalloonsManagerProps {
  eventData: EventData;
  setEventData: React.Dispatch<React.SetStateAction<EventData>>;
  theme: ThemeConfig;
  showToast: (msg: string) => void;
  selectedSlide: 'all' | 1 | 2 | 3 | 4 | 5 | 6;
  setSelectedSlide: (slide: 'all' | 1 | 2 | 3 | 4 | 5 | 6) => void;
}

export const BalloonsManager: React.FC<BalloonsManagerProps> = ({
  eventData,
  setEventData,
  theme,
  showToast,
  selectedSlide,
  setSelectedSlide,
}) => {
  const [newChannelText, setNewChannelText] = useState('');
  const [newBlockSlideTarget, setNewBlockSlideTarget] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [newBlockTitle, setNewBlockTitle] = useState('');
  const [newBlockContent, setNewBlockContent] = useState('');
  const [isAddingCustomBlock, setIsAddingCustomBlock] = useState(false);

  const handleToggleBlock = (field: keyof EventData, val?: boolean) => {
    setEventData((prev) => {
      const current = prev[field] !== false;
      const nextVal = typeof val === 'boolean' ? val : !current;
      return { ...prev, [field]: nextVal };
    });
  };

  const handleToggleAllIcons = () => {
    setEventData((prev) => {
      const willHide = !prev.hideAllIcons;
      return {
        ...prev,
        hideAllIcons: willHide,
      };
    });
    showToast(eventData.hideAllIcons ? 'Ícones ativados em toda a proposta!' : 'Ícones ocultados em toda a proposta!');
  };

  const handleAddMediaChannel = () => {
    if (!newChannelText.trim()) return;
    setEventData((prev) => ({
      ...prev,
      mediaChannels: [...(prev.mediaChannels || []), newChannelText.trim()],
    }));
    setNewChannelText('');
    showToast('Canal de mídia adicionado com sucesso!');
  };

  const handleRemoveMediaChannel = (index: number) => {
    setEventData((prev) => ({
      ...prev,
      mediaChannels: (prev.mediaChannels || []).filter((_, i) => i !== index),
    }));
    showToast('Canal de mídia excluído!');
  };

  const handleAddCustomBlockToSlide = (slideNum: 1 | 2 | 3 | 4 | 5 | 6) => {
    if (!newBlockTitle.trim()) return;
    const newBlock: CustomSlideBlock = {
      id: `block_s${slideNum}_${Date.now()}`,
      title: newBlockTitle.trim(),
      content: newBlockContent.trim() || 'Conteúdo do novo balão personalizado...',
    };
    const key = `customBlocksSlide${slideNum}` as keyof EventData;
    setEventData((prev) => ({
      ...prev,
      [key]: [...((prev[key] as CustomSlideBlock[]) || []), newBlock],
    }));
    setNewBlockTitle('');
    setNewBlockContent('');
    setIsAddingCustomBlock(false);
    showToast(`Novo balão criado na Lâmina ${slideNum}!`);
  };

  const handleRemoveCustomBlockFromSlide = (slideNum: 1 | 2 | 3 | 4 | 5 | 6, id: string) => {
    const key = `customBlocksSlide${slideNum}` as keyof EventData;
    setEventData((prev) => ({
      ...prev,
      [key]: ((prev[key] as CustomSlideBlock[]) || []).filter((b) => b.id !== id),
    }));
    showToast('Balão personalizado removido!');
  };

  const handleToggleAttractionPhoto = (idx: number) => {
    setEventData((prev) => {
      const willHide = !prev.attractions[idx]?.hideImage;
      const nextAttractions = prev.attractions.map((a, i) =>
        i === idx ? { ...a, hideImage: willHide } : a
      );
      return { ...prev, attractions: nextAttractions };
    });
    showToast('Foto da atração atualizada!');
  };

  const handleToggleAttractionTag = (idx: number) => {
    setEventData((prev) => {
      const willHide = !prev.attractions[idx]?.hideTag;
      const nextAttractions = prev.attractions.map((a, i) =>
        i === idx ? { ...a, hideTag: willHide } : a
      );
      return { ...prev, attractions: nextAttractions };
    });
    showToast('Balão de tag da atração atualizado!');
  };

  const handleUpdateAttractionTagText = (idx: number, tag: string) => {
    setEventData((prev) => ({
      ...prev,
      attractions: prev.attractions.map((a, i) => (i === idx ? { ...a, tag } : a)),
    }));
  };

  const handleRestoreAllBalloons = () => {
    setEventData((prev) => ({
      ...prev,
      hideAllIcons: false,
      // Slide 1
      showCoverBadge: true,
      showCoverCategory: true,
      showCoverEdition: true,
      showCoverSubtitle: true,
      showCoverMetaDate: true,
      showCoverMetaVenue: true,
      showIconsSlide1: true,
      // Slide 2
      showConceptStory: true,
      showManifesto: true,
      showConceptImage: true,
      showPillars: true,
      showIconsSlide2: true,
      // Slide 3
      showMediaChannels: true,
      showAudienceProfile: true,
      showDemographicsGender: true,
      showMetricAudience: true,
      showMetricImpressions: true,
      showMetricAge: true,
      showMetricPower: true,
      showIconsSlide3: true,
      // Slide 4
      showAttractions: true,
      showAttractionPhotos: true,
      attractions: prev.attractions.map((a) => ({ ...a, hideImage: false, hideTag: false })),
      showStructureMetrics: true,
      showIconsSlide4: true,
      // Slide 5
      showTiersTitle: true,
      showTierBadge: true,
      showTierDeliverables: true,
      showIconsSlide5: true,
      // Slide 6
      showClosingCta: true,
      showContactCard: true,
      showContactPhone: true,
      showContactEmail: true,
      showContactInstagram: true,
      showContactWebsite: true,
      showClosingSponsors: true,
      showClosingValidity: true,
      showIconsSlide6: true,
    }));
    showToast('Todos os balões e ícones foram restaurados em todas as lâminas!');
  };

  return (
    <div className="space-y-6">
      {/* Header / Intro */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/40 via-neutral-900 to-neutral-950 border border-amber-500/30 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Liberdade Total de Balões & Ícones
            </span>
          </div>
          <button
            type="button"
            onClick={handleRestoreAllBalloons}
            title="Restaurar todos os balões e ícones originais em todas as 6 lâminas"
            className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-400/30 text-[10px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restaurar Todos</span>
          </button>
        </div>
        <p className="text-[11px] text-neutral-300 leading-relaxed">
          Você tem <strong>liberdade absoluta em todas as páginas</strong>: pode excluir qualquer balão que não queira usar, readicionar itens excluídos, trocar ou ocultar ícones, e criar novos balões sob medida para cada lâmina.
        </p>
      </div>

      {/* Master Icon Toggle */}
      <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between gap-3 shadow-md">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            {eventData.hideAllIcons ? (
              <EyeOff className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            )}
            <span>Ícones em Todas as Lâminas</span>
          </div>
          <p className="text-[10px] text-neutral-400 mt-0.5 leading-tight">
            {eventData.hideAllIcons
              ? 'Todos os ícones estão atualmente ocultados para visual editorial limpo.'
              : 'Ícones visíveis. Você pode desativá-los globalmente ou por lâmina individual.'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleToggleAllIcons}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
            eventData.hideAllIcons
              ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
              : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
          }`}
        >
          {eventData.hideAllIcons ? 'Reativar Ícones' : 'Ocultar Todos'}
        </button>
      </div>

      {/* Slide Filter Tabs */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          Filtrar por Lâmina
        </span>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setSelectedSlide('all')}
            className={`py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer ${
              selectedSlide === 'all'
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Todas
          </button>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setSelectedSlide(num as 1 | 2 | 3 | 4 | 5 | 6)}
              className={`py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer ${
                selectedSlide === num
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Lâmina {num}
            </button>
          ))}
        </div>
      </div>

      {/* ================= LÂMINA 1: CAPA ================= */}
      {(selectedSlide === 'all' || selectedSlide === 1) && (
        <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-3.5 shadow-lg">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                Lâmina 01: Capa & Identidade
              </span>
              <span className="text-[10px] text-neutral-400">
                Balões de cabeçalho, categoria, edição e metadados
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleToggleBlock('showIconsSlide1')}
              className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
            >
              {eventData.showIconsSlide1 !== false ? <Eye className="w-2.5 h-2.5 text-amber-400" /> : <EyeOff className="w-2.5 h-2.5 text-neutral-500" />}
              <span>{eventData.showIconsSlide1 !== false ? 'Ícones Ativos' : 'Ícones Ocultos'}</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { key: 'showCoverBadge' as keyof EventData, label: 'Emblema: Proposta Comercial & Media Kit' },
              { key: 'showCoverCategory' as keyof EventData, label: 'Balão: Categoria do Evento' },
              { key: 'showCoverEdition' as keyof EventData, label: 'Balão: Edição do Evento' },
              { key: 'showCoverSubtitle' as keyof EventData, label: 'Balão: Subtítulo de Impacto' },
              { key: 'showCoverMetaDate' as keyof EventData, label: 'Balão: Data do Evento' },
              { key: 'showCoverMetaVenue' as keyof EventData, label: 'Balão: Local e Cidade' },
            ].map((item) => {
              const isVisible = eventData[item.key] !== false;
              return (
                <div
                  key={item.key}
                  className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                    isVisible
                      ? 'border-neutral-800 bg-neutral-900/60 text-white'
                      : 'border-dashed border-red-500/30 bg-red-950/10 text-neutral-400'
                  }`}
                >
                  <span className="text-[11px] font-medium">{item.label}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleBlock(item.key)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                      isVisible
                        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {isVisible ? <Trash2 className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
                    <span>{isVisible ? 'Excluir' : 'Readicionar'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Custom blocks on Slide 1 */}
          <div className="pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Balões Personalizados na Capa ({eventData.customBlocksSlide1?.length || 0})
              </span>
              <button
                type="button"
                onClick={() => {
                  setNewBlockSlideTarget(1);
                  setIsAddingCustomBlock(true);
                }}
                className="text-amber-400 hover:text-amber-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> <span>+ Novo Balão na Capa</span>
              </button>
            </div>
            {eventData.customBlocksSlide1?.map((b) => (
              <div key={b.id} className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between mb-1.5">
                <div className="text-[11px] truncate pr-2">
                  <span className="font-bold text-amber-400 block">{b.title}</span>
                  <span className="text-neutral-400 text-[10px] truncate block">{b.content}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCustomBlockFromSlide(1, b.id)}
                  className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= LÂMINA 2: CONCEITO ================= */}
      {(selectedSlide === 'all' || selectedSlide === 2) && (
        <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-3.5 shadow-lg">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                Lâmina 02: Conceito & Essência
              </span>
              <span className="text-[10px] text-neutral-400">
                Balões de história, manifesto, imagem e pilares
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleToggleBlock('showIconsSlide2')}
              className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
            >
              {eventData.showIconsSlide2 !== false ? <Eye className="w-2.5 h-2.5 text-amber-400" /> : <EyeOff className="w-2.5 h-2.5 text-neutral-500" />}
              <span>{eventData.showIconsSlide2 !== false ? 'Ícones Ativos' : 'Ícones Ocultos'}</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { key: 'showConceptStory' as keyof EventData, label: 'Balão: História & Atmosfera Única' },
              { key: 'showManifesto' as keyof EventData, label: 'Balão: Manifesto Oficial da Marca' },
              { key: 'showConceptImage' as keyof EventData, label: 'Balão: Foto de Lifestyle / Conceito' },
              { key: 'showPillars' as keyof EventData, label: 'Seção: Pilares da Experiência' },
            ].map((item) => {
              const isVisible = eventData[item.key] !== false;
              return (
                <div
                  key={item.key}
                  className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                    isVisible
                      ? 'border-neutral-800 bg-neutral-900/60 text-white'
                      : 'border-dashed border-red-500/30 bg-red-950/10 text-neutral-400'
                  }`}
                >
                  <span className="text-[11px] font-medium">{item.label}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleBlock(item.key)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                      isVisible
                        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {isVisible ? <Trash2 className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
                    <span>{isVisible ? 'Excluir' : 'Readicionar'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Individual Pillars & Icons Manager */}
          <div className="pt-2 border-t border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Pilares Individuais & Ícones ({eventData.pillars?.length || 0})
              </span>
              <button
                type="button"
                onClick={() => {
                  setEventData((prev) => ({
                    ...prev,
                    pillars: [
                      ...prev.pillars,
                      { title: 'Novo Pilar', description: 'Descrição do diferencial do evento...', iconName: 'Sparkles' },
                    ],
                  }));
                  showToast('Novo pilar adicionado à Lâmina 2!');
                }}
                className="text-amber-400 hover:text-amber-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> <span>+ Adicionar Pilar</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {eventData.pillars?.map((p, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <IconPicker
                      currentIcon={p.iconName}
                      onSelectIcon={(iconName) => {
                        setEventData((prev) => ({
                          ...prev,
                          pillars: prev.pillars.map((item, i) => (i === idx ? { ...item, iconName } : item)),
                        }));
                      }}
                      accentColor={theme.primaryColor}
                    />
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-white block truncate">{p.title}</span>
                      <span className="text-[10px] text-neutral-400 block truncate">{p.description}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEventData((prev) => ({
                        ...prev,
                        pillars: prev.pillars.filter((_, i) => i !== idx),
                      }));
                      showToast('Pilar excluído!');
                    }}
                    title="Excluir este pilar"
                    className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Custom blocks on Slide 2 */}
          <div className="pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Balões Personalizados no Conceito ({eventData.customBlocksSlide2?.length || 0})
              </span>
              <button
                type="button"
                onClick={() => {
                  setNewBlockSlideTarget(2);
                  setIsAddingCustomBlock(true);
                }}
                className="text-amber-400 hover:text-amber-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> <span>+ Novo Balão no Conceito</span>
              </button>
            </div>
            {eventData.customBlocksSlide2?.map((b) => (
              <div key={b.id} className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between mb-1.5">
                <div className="text-[11px] truncate pr-2">
                  <span className="font-bold text-amber-400 block">{b.title}</span>
                  <span className="text-neutral-400 text-[10px] truncate block">{b.content}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCustomBlockFromSlide(2, b.id)}
                  className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= LÂMINA 3: PÚBLICO & MÉTRICAS ================= */}
      {(selectedSlide === 'all' || selectedSlide === 3) && (
        <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                Lâmina 03: Público & Métricas
              </span>
              <span className="text-[10px] text-neutral-400">
                Canais de mídia, perfil demográfico e cards de grandes números
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleToggleBlock('showIconsSlide3')}
              className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
            >
              {eventData.showIconsSlide3 !== false ? <Eye className="w-2.5 h-2.5 text-amber-400" /> : <EyeOff className="w-2.5 h-2.5 text-neutral-500" />}
              <span>{eventData.showIconsSlide3 !== false ? 'Ícones Ativos' : 'Ícones Ocultos'}</span>
            </button>
          </div>

          {/* Canais de Mídia & Transmissão */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              eventData.showMediaChannels !== false
                ? 'border-amber-400/40 bg-neutral-900/80'
                : 'border-dashed border-red-500/30 bg-red-950/10 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">
                  Balão: Canais de Mídia & Transmissão
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleBlock('showMediaChannels')}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  eventData.showMediaChannels !== false
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
                    : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {eventData.showMediaChannels !== false ? (
                  <>
                    <Trash2 className="w-3 h-3" />
                    <span>Excluir Balão</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3" />
                    <span>Readicionar Balão</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[10px] text-neutral-400 leading-tight mb-2.5">
              {eventData.showMediaChannels !== false
                ? 'Ao excluir este balão, o card vizinho (Perfil do Consumidor) expande automaticamente.'
                : 'Balão atualmente excluído. O card vizinho ocupou todo o espaço disponível.'}
            </p>

            {eventData.showMediaChannels !== false && (
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Canais Transmitidos ({eventData.mediaChannels?.length || 0})
                </span>
                <div className="space-y-1.5">
                  {eventData.mediaChannels?.map((channel, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={channel}
                        onChange={(e) => {
                          const newChannels = [...(eventData.mediaChannels || [])];
                          newChannels[cIdx] = e.target.value;
                          setEventData((prev) => ({ ...prev, mediaChannels: newChannels }));
                        }}
                        className="flex-1 px-2.5 py-1 text-xs rounded-md bg-neutral-950 border border-neutral-800 text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMediaChannel(cIdx)}
                        className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  <input
                    type="text"
                    placeholder="Novo canal..."
                    value={newChannelText}
                    onChange={(e) => setNewChannelText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddMediaChannel(); }}
                    className="flex-1 px-2.5 py-1 text-xs rounded-md bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddMediaChannel}
                    className="px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold cursor-pointer"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Perfil & Demografia */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/60">
              <div>
                <span className="text-xs font-bold text-white block">Balão: Perfil do Consumidor</span>
                <span className="text-[10px] text-neutral-400">Texto descritivo do perfil de público</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleBlock('showAudienceProfile')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                  eventData.showAudienceProfile !== false
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {eventData.showAudienceProfile !== false ? <Trash2 className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
                <span>{eventData.showAudienceProfile !== false ? 'Excluir' : 'Readicionar'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/60">
              <div>
                <span className="text-xs font-bold text-white block">Gráfico de Distribuição Demográfica</span>
                <span className="text-[10px] text-neutral-400">Barras percentuais de gênero/faixa</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleBlock('showDemographicsGender')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                  eventData.showDemographicsGender !== false
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {eventData.showDemographicsGender !== false ? <Trash2 className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
                <span>{eventData.showDemographicsGender !== false ? 'Excluir' : 'Readicionar'}</span>
              </button>
            </div>
          </div>

          {/* Métricas Numéricas */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
              Cards de Grandes Números
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { key: 'showMetricAudience' as keyof EventData, label: 'Público Estimado' },
                { key: 'showMetricImpressions' as keyof EventData, label: 'Alcance Digital / Impressões' },
                { key: 'showMetricAge' as keyof EventData, label: 'Faixa Etária Principal' },
                { key: 'showMetricPower' as keyof EventData, label: 'Poder Aquisitivo' },
              ].map((m) => {
                const isVis = eventData[m.key] !== false;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => handleToggleBlock(m.key)}
                    className={`p-2 rounded-lg border text-left flex items-center justify-between cursor-pointer ${
                      isVis ? 'border-amber-400/30 bg-neutral-900 text-white' : 'border-neutral-800 bg-neutral-950 text-neutral-500'
                    }`}
                  >
                    <span className="text-[11px] truncate">{m.label}</span>
                    {isVis ? <Eye className="w-3 h-3 text-amber-400" /> : <EyeOff className="w-3 h-3 text-neutral-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom blocks on Slide 3 */}
          <div className="pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Balões Personalizados na Audiência ({eventData.customBlocksSlide3?.length || 0})
              </span>
              <button
                type="button"
                onClick={() => {
                  setNewBlockSlideTarget(3);
                  setIsAddingCustomBlock(true);
                }}
                className="text-amber-400 hover:text-amber-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> <span>+ Novo Balão na Audiência</span>
              </button>
            </div>
            {eventData.customBlocksSlide3?.map((b) => (
              <div key={b.id} className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between mb-1.5">
                <div className="text-[11px] truncate pr-2">
                  <span className="font-bold text-amber-400 block">{b.title}</span>
                  <span className="text-neutral-400 text-[10px] truncate block">{b.content}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCustomBlockFromSlide(3, b.id)}
                  className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= LÂMINA 4: ESTRUTURA ================= */}
      {(selectedSlide === 'all' || selectedSlide === 4) && (
        <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-3.5 shadow-lg">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                Lâmina 04: Line-up & Estrutura
              </span>
              <span className="text-[10px] text-neutral-400">
                Atrações principais e métricas de infraestrutura
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleToggleBlock('showIconsSlide4')}
              className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
            >
              {eventData.showIconsSlide4 !== false ? <Eye className="w-2.5 h-2.5 text-amber-400" /> : <EyeOff className="w-2.5 h-2.5 text-neutral-500" />}
              <span>{eventData.showIconsSlide4 !== false ? 'Ícones Ativos' : 'Ícones Ocultos'}</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {/* Bloco Geral: Atrações Principais */}
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/60">
              <div>
                <span className="text-xs font-bold text-white block">Balão Geral: Atrações Principais</span>
                <span className="text-[10px] text-neutral-400">Todo o grid de atrações</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleBlock('showAttractions')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                  eventData.showAttractions !== false
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {eventData.showAttractions !== false ? <Trash2 className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
                <span>{eventData.showAttractions !== false ? 'Excluir' : 'Readicionar'}</span>
              </button>
            </div>

            {/* Controle Mestre: Fotos das Atrações (Deixar apenas texto) */}
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-amber-500/20 bg-amber-950/20">
              <div>
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  Fotos das Atrações
                </span>
                <span className="text-[10px] text-neutral-400">
                  {eventData.showAttractionPhotos !== false
                    ? 'Fotos ativas nos cards. Clique em "Ocultar Fotos" para deixar apenas texto.'
                    : 'Fotos apagadas. Cards exibindo apenas os textos com diagramação limpa.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleBlock('showAttractionPhotos')}
                className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                  eventData.showAttractionPhotos !== false
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                }`}
              >
                {eventData.showAttractionPhotos !== false ? (
                  <>
                    <EyeOff className="w-2.5 h-2.5" />
                    <span>Ocultar Fotos</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-2.5 h-2.5" />
                    <span>Exibir Fotos</span>
                  </>
                )}
              </button>
            </div>

            {/* Lista individual de atrações (Fotos e Balões/Tags) */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Controle Individual por Atração ({eventData.attractions.length})
              </span>
              {eventData.attractions.map((attraction, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs truncate max-w-[200px]">
                      {attraction.title || `Atração ${idx + 1}`}
                    </span>
                    <span className="text-[9px] font-mono text-amber-400/80">#{idx + 1}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-800 text-[10px]">
                    {/* Botão Foto */}
                    <button
                      type="button"
                      onClick={() => handleToggleAttractionPhoto(idx)}
                      className={`px-2 py-1 rounded border flex items-center gap-1 font-semibold cursor-pointer ${
                        attraction.hideImage
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                          : 'border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20'
                      }`}
                    >
                      {attraction.hideImage ? (
                        <>
                          <Plus className="w-2.5 h-2.5" />
                          <span>Restaurar Foto</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-2.5 h-2.5" />
                          <span>Apagar Foto (Apenas Texto)</span>
                        </>
                      )}
                    </button>

                    {/* Botão Balão / Tag */}
                    <button
                      type="button"
                      onClick={() => handleToggleAttractionTag(idx)}
                      className={`px-2 py-1 rounded border flex items-center gap-1 font-semibold cursor-pointer ${
                        attraction.hideTag
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                          : 'border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20'
                      }`}
                    >
                      {attraction.hideTag ? (
                        <>
                          <Plus className="w-2.5 h-2.5" />
                          <span>+ Balão / Tag</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-2.5 h-2.5" />
                          <span>Excluir Balão</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Input para editar o texto do balão de tag se estiver ativo */}
                  {!attraction.hideTag && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[9px] text-neutral-400 shrink-0">Texto do Balão:</span>
                      <input
                        type="text"
                        value={attraction.tag || ''}
                        onChange={(e) => handleUpdateAttractionTagText(idx, e.target.value)}
                        placeholder="Ex: HEADLINER"
                        className="flex-1 bg-neutral-950 border border-neutral-700 rounded px-2 py-0.5 text-[10px] text-amber-300 focus:border-amber-400 outline-none"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Métrica de Infraestrutura */}
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/60 mt-2">
              <div>
                <span className="text-xs font-bold text-white block">Balão: Métricas de Infraestrutura</span>
                <span className="text-[10px] text-neutral-400">Barra de m², palcos, wifi e logística</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleBlock('showStructureMetrics')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                  eventData.showStructureMetrics !== false
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {eventData.showStructureMetrics !== false ? <Trash2 className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
                <span>{eventData.showStructureMetrics !== false ? 'Excluir' : 'Readicionar'}</span>
              </button>
            </div>
          </div>

          {/* Custom blocks on Slide 4 */}
          <div className="pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Balões Personalizados na Estrutura ({eventData.customBlocksSlide4?.length || 0})
              </span>
              <button
                type="button"
                onClick={() => {
                  setNewBlockSlideTarget(4);
                  setIsAddingCustomBlock(true);
                }}
                className="text-amber-400 hover:text-amber-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> <span>+ Novo Balão na Estrutura</span>
              </button>
            </div>
            {eventData.customBlocksSlide4?.map((b) => (
              <div key={b.id} className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between mb-1.5">
                <div className="text-[11px] truncate pr-2">
                  <span className="font-bold text-amber-400 block">{b.title}</span>
                  <span className="text-neutral-400 text-[10px] truncate block">{b.content}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCustomBlockFromSlide(4, b.id)}
                  className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= LÂMINA 5: COTAS ================= */}
      {(selectedSlide === 'all' || selectedSlide === 5) && (
        <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-3.5 shadow-lg">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                Lâmina 05: Cotas de Patrocínio
              </span>
              <span className="text-[10px] text-neutral-400">
                Cards de pacotes, valores, cotas e contrapartidas
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleToggleBlock('showIconsSlide5')}
              className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
            >
              {eventData.showIconsSlide5 !== false ? <Eye className="w-2.5 h-2.5 text-amber-400" /> : <EyeOff className="w-2.5 h-2.5 text-neutral-500" />}
              <span>{eventData.showIconsSlide5 !== false ? 'Ícones Ativos' : 'Ícones Ocultos'}</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg border border-neutral-800 bg-neutral-900/60">
              <span className="text-[11px] font-medium text-white">Título & Subtítulo das Cotas</span>
              <button
                type="button"
                onClick={() => handleToggleBlock('showTiersTitle')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                  eventData.showTiersTitle !== false
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {eventData.showTiersTitle !== false ? <Trash2 className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
                <span>{eventData.showTiersTitle !== false ? 'Excluir' : 'Readicionar'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg border border-neutral-800 bg-neutral-900/60">
              <span className="text-[11px] font-medium text-white">Emblemas das Cotas</span>
              <button
                type="button"
                onClick={() => handleToggleBlock('showTierBadge')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                  eventData.showTierBadge !== false
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {eventData.showTierBadge !== false ? <Trash2 className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
                <span>{eventData.showTierBadge !== false ? 'Excluir' : 'Readicionar'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg border border-neutral-800 bg-neutral-900/60">
              <span className="text-[11px] font-medium text-white">Lista de Contrapartidas</span>
              <button
                type="button"
                onClick={() => handleToggleBlock('showTierDeliverables')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                  eventData.showTierDeliverables !== false
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {eventData.showTierDeliverables !== false ? <Trash2 className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
                <span>{eventData.showTierDeliverables !== false ? 'Excluir' : 'Readicionar'}</span>
              </button>
            </div>
          </div>

          {/* Individual Tiers */}
          <div className="pt-2 border-t border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Cotas Ativas ({eventData.tiers?.length || 0})
              </span>
              <button
                type="button"
                onClick={() => {
                  const newId = 'tier_' + Date.now();
                  setEventData((prev) => ({
                    ...prev,
                    tiers: [
                      ...prev.tiers,
                      {
                        id: newId,
                        name: 'NOVA COTA',
                        badge: 'PATROCÍNIO EXCLUSIVO',
                        price: 50000,
                        quotasAvailable: 2,
                        highlighted: false,
                        deliverables: ['Logotipo nos materiais', 'Espaço promocional', 'Credenciais VIP'],
                      },
                    ],
                  }));
                  showToast('Nova cota adicionada!');
                }}
                className="text-amber-400 hover:text-amber-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> <span>+ Adicionar Cota</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {eventData.tiers?.map((t) => (
                <div key={t.id} className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">{t.name}</span>
                      <span className="text-[10px] text-amber-400">
                        R$ {t.price?.toLocaleString('pt-BR')} · {t.quotasAvailable} cotas
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEventData((prev) => ({
                            ...prev,
                            tiers: prev.tiers.map((item) =>
                              item.id === t.id ? { ...item, hideBadge: !item.hideBadge } : item
                            ),
                          }));
                          showToast(t.hideBadge ? 'Badge exibida!' : 'Badge excluída!');
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border flex items-center gap-1 cursor-pointer ${
                          t.hideBadge
                            ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
                            : 'border-red-500/30 text-red-300 bg-red-500/10'
                        }`}
                      >
                        {t.hideBadge ? '+ Badge' : 'Excluir Badge'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEventData((prev) => ({
                            ...prev,
                            tiers: prev.tiers.filter((item) => item.id !== t.id),
                          }));
                          showToast(`Cota ${t.name} excluída!`);
                        }}
                        className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                        title="Excluir Cota"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Input para editar o texto da Badge se estiver ativa */}
                  {!t.hideBadge && (
                    <div className="flex items-center gap-1.5 pt-1 border-t border-neutral-800">
                      <span className="text-[9px] text-neutral-400 shrink-0">Texto da Badge:</span>
                      <input
                        type="text"
                        value={t.badge || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEventData((prev) => ({
                            ...prev,
                            tiers: prev.tiers.map((item) =>
                              item.id === t.id ? { ...item, badge: val } : item
                            ),
                          }));
                        }}
                        placeholder="Ex: PATROCÍNIO EXCLUSIVO"
                        className="flex-1 bg-neutral-950 border border-neutral-700 rounded px-2 py-0.5 text-[10px] text-amber-300 focus:border-amber-400 outline-none"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Custom blocks on Slide 5 */}
          <div className="pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Balões Personalizados nas Cotas ({eventData.customBlocksSlide5?.length || 0})
              </span>
              <button
                type="button"
                onClick={() => {
                  setNewBlockSlideTarget(5);
                  setIsAddingCustomBlock(true);
                }}
                className="text-amber-400 hover:text-amber-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> <span>+ Novo Balão nas Cotas</span>
              </button>
            </div>
            {eventData.customBlocksSlide5?.map((b) => (
              <div key={b.id} className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between mb-1.5">
                <div className="text-[11px] truncate pr-2">
                  <span className="font-bold text-amber-400 block">{b.title}</span>
                  <span className="text-neutral-400 text-[10px] truncate block">{b.content}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCustomBlockFromSlide(5, b.id)}
                  className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= LÂMINA 6: CONTATO ================= */}
      {(selectedSlide === 'all' || selectedSlide === 6) && (
        <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-3.5 shadow-lg">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                Lâmina 06: Encerramento & Contato
              </span>
              <span className="text-[10px] text-neutral-400">
                Cartão do executivo comercial, telefones, redes e marcas
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleToggleBlock('showIconsSlide6')}
              className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
            >
              {eventData.showIconsSlide6 !== false ? <Eye className="w-2.5 h-2.5 text-amber-400" /> : <EyeOff className="w-2.5 h-2.5 text-neutral-500" />}
              <span>{eventData.showIconsSlide6 !== false ? 'Ícones Ativos' : 'Ícones Ocultos'}</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { key: 'showClosingCta' as keyof EventData, label: 'Balão: Mensagem de Fechamento & Ativação' },
              { key: 'showContactCard' as keyof EventData, label: 'Balão: Cartão do Executivo / Diretor' },
              { key: 'showContactPhone' as keyof EventData, label: 'Item: Telefone / WhatsApp Comercial' },
              { key: 'showContactEmail' as keyof EventData, label: 'Item: E-mail Comercial' },
              { key: 'showContactInstagram' as keyof EventData, label: 'Item: Instagram Oficial' },
              { key: 'showContactWebsite' as keyof EventData, label: 'Item: Website Oficial' },
              { key: 'showClosingSponsors' as keyof EventData, label: 'Faixa: Marcas Parceiras / Chancela' },
              { key: 'showClosingValidity' as keyof EventData, label: 'Balão: Prazo de Validade da Proposta' },
            ].map((item) => {
              const isVisible = eventData[item.key] !== false;
              return (
                <div
                  key={item.key}
                  className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                    isVisible
                      ? 'border-neutral-800 bg-neutral-900/60 text-white'
                      : 'border-dashed border-red-500/30 bg-red-950/10 text-neutral-400'
                  }`}
                >
                  <span className="text-[11px] font-medium">{item.label}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleBlock(item.key)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                      isVisible
                        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {isVisible ? <Trash2 className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
                    <span>{isVisible ? 'Excluir' : 'Readicionar'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Custom blocks on Slide 6 */}
          <div className="pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Balões Personalizados no Fechamento ({eventData.customBlocksSlide6?.length || 0})
              </span>
              <button
                type="button"
                onClick={() => {
                  setNewBlockSlideTarget(6);
                  setIsAddingCustomBlock(true);
                }}
                className="text-amber-400 hover:text-amber-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> <span>+ Novo Balão no Fechamento</span>
              </button>
            </div>
            {eventData.customBlocksSlide6?.map((b) => (
              <div key={b.id} className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between mb-1.5">
                <div className="text-[11px] truncate pr-2">
                  <span className="font-bold text-amber-400 block">{b.title}</span>
                  <span className="text-neutral-400 text-[10px] truncate block">{b.content}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCustomBlockFromSlide(6, b.id)}
                  className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal / Drawer to Add Custom Balloon to Any Slide */}
      {isAddingCustomBlock && (
        <div className="p-4 rounded-xl bg-neutral-900 border-2 border-amber-400/60 shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Criar Novo Balão Personalizado</span>
            </span>
            <button
              type="button"
              onClick={() => setIsAddingCustomBlock(false)}
              className="p-1 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
              Lâmina de Destino:
            </label>
            <select
              value={newBlockSlideTarget}
              onChange={(e) => setNewBlockSlideTarget(parseInt(e.target.value, 10) as 1 | 2 | 3 | 4 | 5 | 6)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white"
            >
              <option value={1}>Lâmina 01: Capa & Identidade</option>
              <option value={2}>Lâmina 02: Conceito & Essência</option>
              <option value={3}>Lâmina 03: Público & Métricas</option>
              <option value={4}>Lâmina 04: Line-up & Estrutura</option>
              <option value={5}>Lâmina 05: Cotas de Patrocínio</option>
              <option value={6}>Lâmina 06: Encerramento & Contato</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
              Título do Balão:
            </label>
            <input
              type="text"
              placeholder="Ex: Espaço Gastronômico Exclusivo"
              value={newBlockTitle}
              onChange={(e) => setNewBlockTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
              Conteúdo / Texto do Balão:
            </label>
            <textarea
              rows={3}
              placeholder="Descreva aqui o conteúdo informativo que aparecerá neste balão..."
              value={newBlockContent}
              onChange={(e) => setNewBlockContent(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingCustomBlock(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-400 hover:text-white cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => handleAddCustomBlockToSlide(newBlockSlideTarget)}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold cursor-pointer"
            >
              Criar Balão
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
