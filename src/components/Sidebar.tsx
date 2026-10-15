import React, { useState } from 'react';
import {
  Palette,
  FileText,
  Image as ImageIcon,
  DollarSign,
  Printer,
  Download,
  Sparkles,
  Upload,
  RefreshCw,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Layers,
  Info,
  Smartphone,
  Monitor,
  Camera,
  Trash2,
  Plus,
  RotateCcw,
  Eye,
  EyeOff,
  X,
  Radio,
  Award,
} from 'lucide-react';
import type { EventData, ThemeConfig, SlideImages, TypographyPreset, LayoutFormat, CustomSlideBlock } from '../types.ts';
import {
  defaultThemePresets,
  defaultImages,
  typographyStyles,
  curatedGalleryPresets,
  eventPresets,
  generateSingleFileHtml,
  formatCurrencyBRL,
  formatConfigs,
} from '../utils/proposalLogic.ts';

interface SidebarProps {
  eventData: EventData;
  setEventData: React.Dispatch<React.SetStateAction<EventData>>;
  theme: ThemeConfig;
  setTheme: React.Dispatch<React.SetStateAction<ThemeConfig>>;
  images: SlideImages;
  setImages: React.Dispatch<React.SetStateAction<SlideImages>>;
  format: LayoutFormat;
  setFormat: (format: LayoutFormat) => void;
  onPrint: () => void;
  currentSlideIndex: number;
  setCurrentSlideIndex: (index: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  eventData,
  setEventData,
  theme,
  setTheme,
  images,
  setImages,
  format,
  setFormat,
  onPrint,
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'baloes' | 'dados' | 'midia' | 'cotas'>('visual');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiToast, setAiToast] = useState<string | null>(null);

  // States for customizing balloons and blocks
  const [newChannelText, setNewChannelText] = useState('');
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

  const handleAddCustomBlock = () => {
    if (!newBlockTitle.trim()) return;
    const newBlock: CustomSlideBlock = {
      id: 'block_' + Date.now(),
      title: newBlockTitle.trim(),
      content: newBlockContent.trim() || 'Conteúdo do novo balão...',
    };
    setEventData((prev) => ({
      ...prev,
      customBlocksSlide3: [...(prev.customBlocksSlide3 || []), newBlock],
    }));
    setNewBlockTitle('');
    setNewBlockContent('');
    setIsAddingCustomBlock(false);
    showToast('Novo balão personalizado criado na Lâmina 3!');
  };

  const handleRemoveCustomBlock = (id: string) => {
    setEventData((prev) => ({
      ...prev,
      customBlocksSlide3: (prev.customBlocksSlide3 || []).filter((b) => b.id !== id),
    }));
    showToast('Balão personalizado removido!');
  };

  const handleRestoreAllBalloons = () => {
    setEventData((prev) => ({
      ...prev,
      showConceptStory: true,
      showManifesto: true,
      showPillars: true,
      showMediaChannels: true,
      showAudienceProfile: true,
      showDemographicsGender: true,
      showMetricAudience: true,
      showMetricImpressions: true,
      showMetricAge: true,
      showMetricPower: true,
      showStructureMetrics: true,
      showContactCard: true,
      showContactSocials: true,
      showClosingSponsors: true,
      showClosingValidity: true,
    }));
    showToast('Todos os balões foram restaurados com sucesso!');
  };

  // Helper for image upload to base64 from computer
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof SlideImages
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => ({ ...prev, [key]: reader.result as string }));
          showToast(`Imagem carregada do computador com sucesso!`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (key: keyof SlideImages) => {
    setImages((prev) => ({ ...prev, [key]: '' }));
    showToast(`Imagem removida!`);
  };

  const handleResetImage = (key: keyof SlideImages) => {
    setImages((prev) => ({ ...prev, [key]: defaultImages[key] }));
    showToast(`Imagem restaurada ao padrão!`);
  };

  const handleAddSponsorLogos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => ({
            ...prev,
            sponsorLogos: [...(prev.sponsorLogos || []), reader.result as string],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
    showToast(`${files.length} logomarca(s) de patrocinador adicionada(s)!`);
  };

  const handleRemoveSponsorLogo = (idx: number) => {
    setImages((prev) => ({
      ...prev,
      sponsorLogos: (prev.sponsorLogos || []).filter((_, i) => i !== idx),
    }));
    showToast(`Logomarca de patrocinador removida!`);
  };

  const handleApplyPreset = (presetKey: string) => {
    const preset = eventPresets[presetKey];
    if (preset) {
      setEventData(preset);
      if (presetKey === 'festivalMusica') {
        setTheme(defaultThemePresets.luxuryGold);
      } else if (presetKey === 'gastronomiaVinho') {
        setTheme(defaultThemePresets.sunsetFestival);
      } else if (presetKey === 'techInnovation') {
        setTheme(defaultThemePresets.cyberNeon);
      }
      showToast('Dados e identidade visual do preset carregados com sucesso!');
    }
  };

  const showToast = (msg: string) => {
    setAiToast(msg);
    setTimeout(() => setAiToast(null), 3500);
  };

  const handleDownloadSingleFileHtml = () => {
    const htmlContent = generateSingleFileHtml(eventData, theme, images, format);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `proposta-patrocinio-${eventData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${format}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Arquivo HTML autônomo (${formatConfigs[format].label}) exportado com sucesso!`);
  };

  const handleCopySummary = () => {
    const totalPotential = eventData.tiers.reduce((acc, t) => acc + t.price * t.quotasAvailable, 0);
    const summary = `📋 PROPOSTA DE PATROCÍNIO: ${eventData.name}
${eventData.subtitle}
🗓️ Data: ${eventData.date}
📍 Local: ${eventData.venue} - ${eventData.city}
👥 Público Estimado: ${eventData.audienceCount} | Alcance Digital: ${eventData.digitalImpressions}
🎯 Perfil: ${eventData.audienceProfileDescription}

💰 COTAS DISPONÍVEIS:
${eventData.tiers.map((t) => `• ${t.name} (${t.badge}): ${formatCurrencyBRL(t.price)} - ${t.quotasAvailable} cota(s)`).join('\n')}

💎 Meta Total de Captação: ${formatCurrencyBRL(totalPotential)}
📞 Contato: ${eventData.contactName} (${eventData.contactEmail} | ${eventData.contactPhone})`;

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
    showToast('Resumo copiado para a área de transferência!');
  };

  const handleEnhanceCopyAi = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      // High-impact polished copy generator
      setEventData((prev) => ({
        ...prev,
        subtitle: `A Plataforma Definitiva de Conexão Entre Marcas Visionárias e o Público de ${prev.category}`,
        conceptStory: `Projetado sob os mais elevados padrões de excelência internacional, o ${prev.name} transcende o conceito tradicional de evento para se consolidar como um território proprietário de ativação cultural, geração de valor e engajamento autêntico com líderes de opinião.`,
        manifestoQuote: `Grandes marcas não compram apenas espaço de mídia; elas criam momentos de protagonismo na memória afetiva das pessoas.`,
        audienceProfileDescription: `Audiência de alto valor agregado (${prev.purchasingPower}), com elevado consumo cultural, conectividade contínua e forte capacidade de influência e decisão de compra nos segmentos premium.`,
        closingCta: `Convidamos sua marca a ser protagonista da ${prev.edition}. As cotas possuem garantia de exclusividade contratual por segmento e vagas limitadas.`,
      }));
      setIsGeneratingAi(false);
      showToast('Copy aprimorado com sucesso com linguagem de alto padrão!');
    }, 600);
  };

  return (
    <aside className="sidebar-controls no-print w-full lg:w-[420px] xl:w-[460px] bg-neutral-900 border-r border-neutral-800 flex flex-col h-screen shrink-0 text-neutral-200 select-none overflow-hidden z-30">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950/50 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl text-neutral-950 font-black shadow-lg"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base text-white tracking-tight flex items-center gap-1.5">
                Media Kit & Propostas
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                  {formatConfigs[format].ratioLabel}
                </span>
              </h1>
              <p className="text-xs text-neutral-400">Direção de Arte & Branding</p>
            </div>
          </div>
        </div>

        {/* Format Selector: Mobile / iPhone (9:16), Widescreen (16:9), A4 Retrato */}
        <div className="bg-neutral-950/80 rounded-xl p-2.5 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] px-0.5">
            <span className="font-bold uppercase tracking-wider text-neutral-300 text-[10px] flex items-center gap-1">
              <span>Dimensão / Formato do PDF</span>
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
              {formatConfigs[format].shortLabel}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {/* 1. Mobile / iPhone (9:16) */}
            <button
              type="button"
              onClick={() => setFormat('mobile')}
              title="Mobile / Tela de iPhone (9:16 - Vertical): Focado em leitura pelo WhatsApp/Smartphone"
              className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                format === 'mobile'
                  ? 'border-amber-400 bg-amber-400/20 text-white shadow-lg ring-1 ring-amber-400/50'
                  : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <Smartphone className={`w-4 h-4 mb-1 ${format === 'mobile' ? 'text-amber-400' : 'text-neutral-400'}`} />
              <span className="text-[11px] font-bold leading-tight">Mobile</span>
              <span className="text-[9px] font-mono text-neutral-400 mt-0.5">9:16 iPhone</span>
            </button>

            {/* 2. Widescreen (16:9) */}
            <button
              type="button"
              onClick={() => setFormat('widescreen')}
              title="Widescreen / Apresentação (16:9 - Horizontal): O formato clássico de slides"
              className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                format === 'widescreen'
                  ? 'border-amber-400 bg-amber-400/20 text-white shadow-lg ring-1 ring-amber-400/50'
                  : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <Monitor className={`w-4 h-4 mb-1 ${format === 'widescreen' ? 'text-amber-400' : 'text-neutral-400'}`} />
              <span className="text-[11px] font-bold leading-tight">Widescreen</span>
              <span className="text-[9px] font-mono text-neutral-400 mt-0.5">16:9 Slides</span>
            </button>

            {/* 3. A4 Retrato */}
            <button
              type="button"
              onClick={() => setFormat('a4Portrait')}
              title="A4 Retrato (Padrão Documento Vertical): Para propostas formais de leitura corrida"
              className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                format === 'a4Portrait'
                  ? 'border-amber-400 bg-amber-400/20 text-white shadow-lg ring-1 ring-amber-400/50'
                  : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <FileText className={`w-4 h-4 mb-1 ${format === 'a4Portrait' ? 'text-amber-400' : 'text-neutral-400'}`} />
              <span className="text-[11px] font-bold leading-tight">A4 Retrato</span>
              <span className="text-[9px] font-mono text-neutral-400 mt-0.5">Documento</span>
            </button>
          </div>

          <p className="text-[10px] text-neutral-400 px-0.5 leading-tight">
            {formatConfigs[format].description}
          </p>
        </div>

        {/* Primary Action Button: Export PDF */}
        <button
          onClick={onPrint}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-neutral-950 transition-all shadow-lg hover:brightness-110 active:scale-[0.98] cursor-pointer"
          style={{
            background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
          }}
        >
          <Printer className="w-4 h-4 stroke-[2.5]" />
          <span>Exportar PDF ({formatConfigs[format].ratioLabel})</span>
        </button>

        {/* Action hints and quick downloads */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadSingleFileHtml}
            title="Baixar arquivo HTML autônomo com todas as lâminas e estilos embutidos"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Baixar HTML Único</span>
          </button>

          <button
            onClick={handleCopySummary}
            title="Copiar resumo comercial da proposta"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
          >
            {copiedSummary ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-neutral-400" />
            )}
            <span>{copiedSummary ? 'Copiado!' : 'Copiar Resumo'}</span>
          </button>
        </div>

        {/* Print guidance notification */}
        <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300/90 leading-tight">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
          <span>
            Ao imprimir em PDF: marque <strong>"Gráficos de plano de fundo"</strong> e margens <strong>"Nenhuma"</strong>.
          </span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-neutral-800 bg-neutral-950/40 text-[11px] font-medium overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('visual')}
          className={`flex-1 min-w-[64px] py-2.5 px-1.5 flex flex-col sm:flex-row items-center justify-center gap-1 border-b-2 transition-colors ${
            activeTab === 'visual'
              ? 'border-amber-400 text-amber-400 bg-neutral-800/40 font-bold'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Visual</span>
        </button>

        <button
          onClick={() => setActiveTab('baloes')}
          title="Excluir, readicionar e personalizar balões e blocos em qualquer lâmina"
          className={`flex-1 min-w-[78px] py-2.5 px-1.5 flex flex-col sm:flex-row items-center justify-center gap-1 border-b-2 transition-colors ${
            activeTab === 'baloes'
              ? 'border-amber-400 text-amber-400 bg-neutral-800/40 font-bold'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="font-semibold text-center leading-tight">Balões</span>
        </button>

        <button
          onClick={() => setActiveTab('dados')}
          className={`flex-1 min-w-[64px] py-2.5 px-1.5 flex flex-col sm:flex-row items-center justify-center gap-1 border-b-2 transition-colors ${
            activeTab === 'dados'
              ? 'border-amber-400 text-amber-400 bg-neutral-800/40 font-bold'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Copy</span>
        </button>

        <button
          onClick={() => setActiveTab('midia')}
          className={`flex-1 min-w-[74px] py-2.5 px-1.5 flex flex-col sm:flex-row items-center justify-center gap-1 border-b-2 transition-colors ${
            activeTab === 'midia'
              ? 'border-amber-400 text-amber-400 bg-neutral-800/40 font-bold'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Fotos</span>
        </button>

        <button
          onClick={() => setActiveTab('cotas')}
          className={`flex-1 min-w-[60px] py-2.5 px-1.5 flex flex-col sm:flex-row items-center justify-center gap-1 border-b-2 transition-colors ${
            activeTab === 'cotas'
              ? 'border-amber-400 text-amber-400 bg-neutral-800/40 font-bold'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Cotas</span>
        </button>
      </div>

      {/* Toast alert if present */}
      {aiToast && (
        <div className="mx-4 mt-3 p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-600/50 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in shadow-md">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{aiToast}</span>
        </div>
      )}

      {/* Tab Panels Container (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
        {/* ===================== TAB 1: IDENTIDADE VISUAL ===================== */}
        {activeTab === 'visual' && (
          <div className="space-y-6">
            {/* Presets de Temas */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                Paletas & Estilos Predefinidos
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {Object.values(defaultThemePresets).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      theme.id === t.id
                        ? 'border-amber-400 bg-neutral-800/80 shadow-md ring-1 ring-amber-400/40'
                        : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: t.primaryColor }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: t.secondaryColor }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: t.bgColor }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-neutral-200">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Pickers */}
            <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
                Ajuste Fino de Cores
              </span>

              {/* Primary Color */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-neutral-300 font-medium">Cor Primária (Destaques & Ouro)</span>
                  <span className="font-mono text-neutral-400">{theme.primaryColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => setTheme((prev) => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-10 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.primaryColor}
                    onChange={(e) => setTheme((prev) => ({ ...prev, primaryColor: e.target.value }))}
                    className="flex-1 bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-xs font-mono text-neutral-200"
                  />
                </div>
              </div>

              {/* Secondary Color */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-neutral-300 font-medium">Cor Secundária (Acentos)</span>
                  <span className="font-mono text-neutral-400">{theme.secondaryColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.secondaryColor}
                    onChange={(e) => setTheme((prev) => ({ ...prev, secondaryColor: e.target.value }))}
                    className="w-10 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.secondaryColor}
                    onChange={(e) => setTheme((prev) => ({ ...prev, secondaryColor: e.target.value }))}
                    className="flex-1 bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-xs font-mono text-neutral-200"
                  />
                </div>
              </div>
            </div>

            {/* Typography Pairing */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                Estilo Tipográfico
              </label>
              <div className="space-y-2">
                {(Object.entries(typographyStyles) as [TypographyPreset, typeof typographyStyles[TypographyPreset]][]).map(
                  ([key, val]) => (
                    <button
                      key={key}
                      onClick={() =>
                        setTheme((prev) => ({
                          ...prev,
                          typographyPreset: key,
                          fontFamilyHead: val.headFont,
                          fontFamilyBody: val.bodyFont,
                        }))
                      }
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        theme.typographyPreset === key
                          ? 'border-amber-400 bg-neutral-800/80 ring-1 ring-amber-400/30'
                          : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{val.label}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {val.headFont.replace(/['",]/g, '').split(' ')[0]}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1">{val.description}</p>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: PERSONALIZAR BALÕES & BLOCOS ===================== */}
        {activeTab === 'baloes' && (
          <div className="space-y-6">
            {/* Header / Intro */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/40 via-neutral-900 to-neutral-950 border border-amber-500/30 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Liberdade de Balões & Blocos
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRestoreAllBalloons}
                  title="Restaurar todos os balões originais em todas as lâminas"
                  className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-400/30 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restaurar Todos</span>
                </button>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Você tem <strong>liberdade total</strong> para excluir qualquer balão que não for utilizar (como o de canais de mídia na Lâmina 3), readicioná-los a qualquer momento e até criar novos balões personalizados!
              </p>
            </div>

            {/* ================= LÂMINA 3: PÚBLICO & MÉTRICAS ================= */}
            <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                    Lâmina 03: Público & Métricas
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Gerencie os balões de canais, perfil e grandes números
                  </span>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 font-mono font-bold">
                  Página 3
                </span>
              </div>

              {/* 1. Balão: Canais de Mídia & Transmissão (User's specific request!) */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  eventData.showMediaChannels !== false
                    ? 'border-amber-400/40 bg-neutral-900/80'
                    : 'border-dashed border-red-500/30 bg-red-950/10 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-secondaryColor" style={{ color: theme.secondaryColor }} />
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

                <p className="text-[10px] text-neutral-400 leading-tight mb-3">
                  {eventData.showMediaChannels !== false
                    ? 'Este balão está visível na Lâmina 3. Ao excluí-lo, o balão ao lado se expande automaticamente para ocupar a largura total.'
                    : 'Balão atualmente excluído/oculto. A Lâmina 3 adaptou a diagramação perfeitamente sem ele.'}
                </p>

                {/* Channels manager inside when visible */}
                {eventData.showMediaChannels !== false && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Itens de Canais ({eventData.mediaChannels?.length || 0})
                    </span>

                    <div className="space-y-1.5">
                      {(eventData.mediaChannels || []).map((ch, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-1.5 rounded-lg bg-black/40 border border-neutral-800"
                        >
                          <input
                            type="text"
                            value={ch}
                            onChange={(e) => {
                              const next = [...eventData.mediaChannels];
                              next[idx] = e.target.value;
                              setEventData((prev) => ({ ...prev, mediaChannels: next }));
                            }}
                            className="flex-1 bg-transparent text-xs text-neutral-200 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveMediaChannel(idx)}
                            title="Excluir este canal"
                            className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add new channel */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <input
                        type="text"
                        placeholder="Nome do novo canal (ex: TikTok Oficial)"
                        value={newChannelText}
                        onChange={(e) => setNewChannelText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddMediaChannel();
                          }
                        }}
                        className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddMediaChannel}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Balão: Perfil do Consumidor */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  eventData.showAudienceProfile !== false
                    ? 'border-amber-400/40 bg-neutral-900/80'
                    : 'border-dashed border-red-500/30 bg-red-950/10 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">
                      Balão: Perfil do Consumidor & Demografia
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleBlock('showAudienceProfile')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      eventData.showAudienceProfile !== false
                        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {eventData.showAudienceProfile !== false ? (
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

                <p className="text-[10px] text-neutral-400 leading-tight mb-2">
                  Exibe a persona do público qualificado e as barras de porcentagem demográfica.
                </p>

                {eventData.showAudienceProfile !== false && (
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-neutral-400 font-medium">Exibir Barras Demográficas</span>
                    <button
                      type="button"
                      onClick={() => handleToggleBlock('showDemographicsGender')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                        eventData.showDemographicsGender !== false
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                      }`}
                    >
                      {eventData.showDemographicsGender !== false ? 'Visível' : 'Oculto'}
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Balões de Grandes Números (Métricas) */}
              <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-2.5">
                <span className="text-xs font-bold text-white block">
                  Balões de Métricas Numéricas
                </span>
                <p className="text-[10px] text-neutral-400">
                  Desmarque qualquer número que não queira exibir. A diagramação se reorganiza automaticamente.
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Público */}
                  <button
                    type="button"
                    onClick={() => handleToggleBlock('showMetricAudience')}
                    className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                      eventData.showMetricAudience !== false
                        ? 'border-amber-400/40 bg-neutral-800 text-white'
                        : 'border-neutral-800 bg-neutral-950/40 text-neutral-500'
                    }`}
                  >
                    <span className="font-medium text-[11px]">1. Público</span>
                    {eventData.showMetricAudience !== false ? (
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-neutral-600" />
                    )}
                  </button>

                  {/* Alcance Digital */}
                  <button
                    type="button"
                    onClick={() => handleToggleBlock('showMetricImpressions')}
                    className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                      eventData.showMetricImpressions !== false
                        ? 'border-amber-400/40 bg-neutral-800 text-white'
                        : 'border-neutral-800 bg-neutral-950/40 text-neutral-500'
                    }`}
                  >
                    <span className="font-medium text-[11px]">2. Alcance Digital</span>
                    {eventData.showMetricImpressions !== false ? (
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-neutral-600" />
                    )}
                  </button>

                  {/* Faixa Etária */}
                  <button
                    type="button"
                    onClick={() => handleToggleBlock('showMetricAge')}
                    className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                      eventData.showMetricAge !== false
                        ? 'border-amber-400/40 bg-neutral-800 text-white'
                        : 'border-neutral-800 bg-neutral-950/40 text-neutral-500'
                    }`}
                  >
                    <span className="font-medium text-[11px]">3. Faixa Etária</span>
                    {eventData.showMetricAge !== false ? (
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-neutral-600" />
                    )}
                  </button>

                  {/* Poder Aquisitivo */}
                  <button
                    type="button"
                    onClick={() => handleToggleBlock('showMetricPower')}
                    className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                      eventData.showMetricPower !== false
                        ? 'border-amber-400/40 bg-neutral-800 text-white'
                        : 'border-neutral-800 bg-neutral-950/40 text-neutral-500'
                    }`}
                  >
                    <span className="font-medium text-[11px]">4. Poder Aquisitivo</span>
                    {eventData.showMetricPower !== false ? (
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-neutral-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* 4. Balões Customizados Criados pelo Usuário */}
              <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Balões Personalizados da Lâmina 3
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      Crie balões adicionais com títulos e informações livres
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingCustomBlock((prev) => !prev)}
                    className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{isAddingCustomBlock ? 'Fechar' : 'Novo Balão'}</span>
                  </button>
                </div>

                {/* Form to create new balloon */}
                {isAddingCustomBlock && (
                  <div className="p-3 rounded-lg bg-black/60 border border-amber-400/30 space-y-2.5">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                        Título do Balão
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Hábitos de Consumo ou Presença Regional"
                        value={newBlockTitle}
                        onChange={(e) => setNewBlockTitle(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                        Conteúdo do Balão
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Escreva as informações deste novo balão..."
                        value={newBlockContent}
                        onChange={(e) => setNewBlockContent(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-xs text-neutral-200"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCustomBlock}
                      className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Inserir Balão na Lâmina 3</span>
                    </button>
                  </div>
                )}

                {/* List of custom balloons */}
                {eventData.customBlocksSlide3 && eventData.customBlocksSlide3.length > 0 ? (
                  <div className="space-y-2">
                    {eventData.customBlocksSlide3.map((block) => (
                      <div
                        key={block.id}
                        className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 flex items-start justify-between gap-2"
                      >
                        <div>
                          <div className="text-xs font-bold text-amber-300">{block.title}</div>
                          <div className="text-[11px] text-neutral-300 line-clamp-2 mt-0.5">
                            {block.content}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomBlock(block.id)}
                          title="Excluir este balão"
                          className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-neutral-500 italic">
                    Nenhum balão personalizado criado ainda. Clique em "+ Novo Balão" para adicionar.
                  </p>
                )}
              </div>
            </div>

            {/* ================= OUTRAS LÂMINAS ================= */}
            <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-4 shadow-lg">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block border-b border-neutral-800 pb-2">
                Balões das Outras Lâminas
              </span>

              {/* Lâmina 2 */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-neutral-300 block">
                  Lâmina 02: Conceito & Experiência
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleToggleBlock('showConceptStory')}
                    className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                      eventData.showConceptStory !== false
                        ? 'border-amber-400/40 bg-neutral-800 text-white'
                        : 'border-neutral-800 bg-neutral-950/40 text-neutral-500'
                    }`}
                  >
                    <span>História & Atmosfera</span>
                    {eventData.showConceptStory !== false ? (
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-neutral-600" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleBlock('showManifesto')}
                    className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                      eventData.showManifesto !== false
                        ? 'border-amber-400/40 bg-neutral-800 text-white'
                        : 'border-neutral-800 bg-neutral-950/40 text-neutral-500'
                    }`}
                  >
                    <span>Manifesto da Marca</span>
                    {eventData.showManifesto !== false ? (
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-neutral-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Lâmina 4 */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <span className="text-[11px] font-bold text-neutral-300 block">
                  Lâmina 04: Atrações & Estrutura
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleBlock('showStructureMetrics')}
                  className={`w-full p-2 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer text-xs ${
                    eventData.showStructureMetrics !== false
                      ? 'border-amber-400/40 bg-neutral-800 text-white'
                      : 'border-neutral-800 bg-neutral-950/40 text-neutral-500'
                  }`}
                >
                  <span>Balão de Métricas de Estrutura (m², Palcos, Eco, Wi-Fi)</span>
                  {eventData.showStructureMetrics !== false ? (
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-neutral-600" />
                  )}
                </button>
              </div>

              {/* Lâmina 6 */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <span className="text-[11px] font-bold text-neutral-300 block">
                  Lâmina 06: Contato & Fechamento
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleToggleBlock('showContactCard')}
                    className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                      eventData.showContactCard !== false
                        ? 'border-amber-400/40 bg-neutral-800 text-white'
                        : 'border-neutral-800 bg-neutral-950/40 text-neutral-500'
                    }`}
                  >
                    <span>Cartão do Diretor</span>
                    {eventData.showContactCard !== false ? (
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-neutral-600" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleBlock('showClosingSponsors')}
                    className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                      eventData.showClosingSponsors !== false
                        ? 'border-amber-400/40 bg-neutral-800 text-white'
                        : 'border-neutral-800 bg-neutral-950/40 text-neutral-500'
                    }`}
                  >
                    <span>Faixa de Marcas</span>
                    {eventData.showClosingSponsors !== false ? (
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-neutral-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: DADOS & COPY ===================== */}
        {activeTab === 'dados' && (
          <div className="space-y-6">
            {/* Quick Presets */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Carregar Modelo Rápido de Evento
              </label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => handleApplyPreset('festivalMusica')}
                  className="py-2 px-3 rounded-lg bg-neutral-800/70 hover:bg-neutral-800 border border-neutral-700 text-left text-xs font-semibold flex items-center justify-between text-neutral-200 transition-colors"
                >
                  <span>🎵 Festival de Música & Artes (Aurora)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>
                <button
                  onClick={() => handleApplyPreset('gastronomiaVinho')}
                  className="py-2 px-3 rounded-lg bg-neutral-800/70 hover:bg-neutral-800 border border-neutral-700 text-left text-xs font-semibold flex items-center justify-between text-neutral-200 transition-colors"
                >
                  <span>🍷 Gastronomia & Vinhos Finos (Terroir)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>
                <button
                  onClick={() => handleApplyPreset('techInnovation')}
                  className="py-2 px-3 rounded-lg bg-neutral-800/70 hover:bg-neutral-800 border border-neutral-700 text-left text-xs font-semibold flex items-center justify-between text-neutral-200 transition-colors"
                >
                  <span>⚡ Congresso Tech & Inovação (Nexus)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>
              </div>
            </div>

            {/* AI Copy Enhancer */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/40 via-neutral-900 to-neutral-950 border border-amber-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  Gerador de Copy Estruturado
                </span>
              </div>
              <p className="text-xs text-neutral-400 mb-3">
                Aprimora automaticamente as narrativas, manifesto, slogans e CTAs das lâminas para um tom comercial persuasivo de alto luxo.
              </p>
              <button
                onClick={handleEnhanceCopyAi}
                disabled={isGeneratingAi}
                className="w-full py-2 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                <span>{isGeneratingAi ? 'Aprimorando Textos...' : 'Aprimorar Textos com IA'}</span>
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-neutral-400 font-semibold block mb-1">Nome do Evento</label>
                <input
                  type="text"
                  value={eventData.name}
                  onChange={(e) => setEventData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-neutral-400 font-semibold block mb-1">Subtítulo / Tagline</label>
                <textarea
                  rows={2}
                  value={eventData.subtitle}
                  onChange={(e) => setEventData((prev) => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 font-semibold block mb-1">Data do Evento</label>
                  <input
                    type="text"
                    value={eventData.date}
                    onChange={(e) => setEventData((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-200"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 font-semibold block mb-1">Edição</label>
                  <input
                    type="text"
                    value={eventData.edition}
                    onChange={(e) => setEventData((prev) => ({ ...prev, edition: e.target.value }))}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 font-semibold block mb-1">Local / Espaço</label>
                  <input
                    type="text"
                    value={eventData.venue}
                    onChange={(e) => setEventData((prev) => ({ ...prev, venue: e.target.value }))}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-200"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 font-semibold block mb-1">Cidade / Estado</label>
                  <input
                    type="text"
                    value={eventData.city}
                    onChange={(e) => setEventData((prev) => ({ ...prev, city: e.target.value }))}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-200"
                  />
                </div>
              </div>

              {/* Métricas do Público */}
              <div className="pt-2 border-t border-neutral-800 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Grandes Números (Lâmina 3)
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-neutral-400 font-medium block mb-1">Público Estimado</label>
                    <input
                      type="text"
                      value={eventData.audienceCount}
                      onChange={(e) => setEventData((prev) => ({ ...prev, audienceCount: e.target.value }))}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-amber-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 font-medium block mb-1">Alcance Digital</label>
                    <input
                      type="text"
                      value={eventData.digitalImpressions}
                      onChange={(e) =>
                        setEventData((prev) => ({ ...prev, digitalImpressions: e.target.value }))
                      }
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-amber-300 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-neutral-400 font-medium block mb-1">Faixa Etária</label>
                    <input
                      type="text"
                      value={eventData.ageBracket}
                      onChange={(e) => setEventData((prev) => ({ ...prev, ageBracket: e.target.value }))}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-200"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 font-medium block mb-1">Poder Aquisitivo</label>
                    <input
                      type="text"
                      value={eventData.purchasingPower}
                      onChange={(e) =>
                        setEventData((prev) => ({ ...prev, purchasingPower: e.target.value }))
                      }
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-200"
                    />
                  </div>
                </div>
              </div>

              {/* Responsável Comercial */}
              <div className="pt-2 border-t border-neutral-800 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Contato Comercial (Lâmina 6)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-neutral-400 font-medium block mb-1">Nome do Contato</label>
                    <input
                      type="text"
                      value={eventData.contactName}
                      onChange={(e) => setEventData((prev) => ({ ...prev, contactName: e.target.value }))}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-200"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 font-medium block mb-1">Cargo</label>
                    <input
                      type="text"
                      value={eventData.contactRole}
                      onChange={(e) => setEventData((prev) => ({ ...prev, contactRole: e.target.value }))}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-neutral-400 font-medium block mb-1">WhatsApp</label>
                    <input
                      type="text"
                      value={eventData.contactPhone}
                      onChange={(e) => setEventData((prev) => ({ ...prev, contactPhone: e.target.value }))}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-200"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 font-medium block mb-1">E-mail</label>
                    <input
                      type="text"
                      value={eventData.contactEmail}
                      onChange={(e) => setEventData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: LOGOMARCA & IMAGENS DO COMPUTADOR ===================== */}
        {activeTab === 'midia' && (
          <div className="space-y-6">
            {/* Informative Header */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Camera className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Imagens & Logomarcas do Seu Computador
                </span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Adicione a <strong>logomarca oficial do evento</strong>, troque fotos de capa e lâminas por arquivos do seu computador (PNG, JPG, SVG ou WebP), ou adicione <strong>marcas de patrocinadores</strong>.
              </p>
            </div>

            {/* SEÇÃO 1: LOGOMARCA DO EVENTO */}
            <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-3.5 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Logomarca Oficial do Evento
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold uppercase">
                    Capa & Lâmina 6
                  </span>
                </div>
                {images.logoUrl && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage('logoUrl')}
                    title="Remover logomarca"
                    className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remover</span>
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Logo Preview Box with checkerboard transparency background */}
                <div className="w-24 h-24 rounded-xl border border-neutral-700 p-2 shrink-0 flex items-center justify-center relative overflow-hidden bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:8px_8px] bg-neutral-900 shadow-inner">
                  {images.logoUrl ? (
                    <img
                      src={images.logoUrl}
                      alt="Logo do Evento"
                      className="max-h-full max-w-full object-contain drop-shadow-md"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-neutral-500 text-[10px] text-center">
                      <Camera className="w-6 h-6 mb-1 text-neutral-600" />
                      <span>Sem logo</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <label className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs cursor-pointer transition-all shadow-md active:scale-[0.99]">
                    <Upload className="w-4 h-4 stroke-[2.5]" />
                    <span>Carregar Logo do Computador</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logoUrl')}
                      className="hidden"
                    />
                  </label>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1">
                    <span>Recomendado: PNG transparente ou SVG</span>
                    {images.logoUrl && (
                      <button
                        type="button"
                        onClick={() => handleResetImage('logoUrl')}
                        className="text-[10px] text-neutral-400 hover:text-neutral-200 underline"
                      >
                        Padrão
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO 2: LOGOMARCAS DE PATROCINADORES / APOIADORES */}
            <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-3.5 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-white block">
                    Logomarcas de Patrocinadores & Parceiros
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Aparecem no fechamento comercial e proposta
                  </span>
                </div>
                <label className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-xs font-semibold text-white cursor-pointer transition-colors shadow-sm">
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>+ Adicionar Logos (PC)</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleAddSponsorLogos}
                    className="hidden"
                  />
                </label>
              </div>

              {images.sponsorLogos && images.sponsorLogos.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
                  {images.sponsorLogos.map((sLogo, idx) => (
                    <div
                      key={idx}
                      className="group/item relative h-16 rounded-lg border border-neutral-700 bg-neutral-900/90 p-1.5 flex items-center justify-center transition-all hover:border-amber-400"
                    >
                      <img
                        src={sLogo}
                        alt={`Patrocinador ${idx + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSponsorLogo(idx)}
                        title="Remover logotipo"
                        className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-md transition-transform hover:scale-110"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-dashed border-neutral-800 text-center text-[11px] text-neutral-500">
                  Nenhuma logomarca de patrocinador adicionada ainda. Clique no botão acima para selecionar do computador.
                </div>
              )}
            </div>

            {/* SEÇÃO 3: FOTOS E IMAGENS DAS 6 LÂMINAS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">
                  Fotos das Lâminas (Upload do PC)
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  6 Lâminas Disponíveis
                </span>
              </div>

              {/* Slot 1: Lâmina 1 Capa Hero */}
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between gap-3 hover:border-neutral-700 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={images.slide1Cover}
                    alt="Capa"
                    className="w-16 h-11 object-cover rounded-lg border border-neutral-700 shrink-0 shadow-sm"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">Lâmina 1: Foto Principal de Capa</div>
                    <div className="text-[10px] text-neutral-400 truncate">Hero background cinematográfico</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <label className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload PC</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'slide1Cover')}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleResetImage('slide1Cover')}
                    title="Restaurar padrão"
                    className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Slot 2: Lâmina 2 Conceito */}
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between gap-3 hover:border-neutral-700 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={images.slide2Concept}
                    alt="Conceito"
                    className="w-16 h-11 object-cover rounded-lg border border-neutral-700 shrink-0 shadow-sm"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">Lâmina 2: Imagem do Conceito</div>
                    <div className="text-[10px] text-neutral-400 truncate">Card experiência 360° / lifestyle</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <label className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload PC</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'slide2Concept')}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleResetImage('slide2Concept')}
                    title="Restaurar padrão"
                    className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Slot 3: Lâmina 3 Audiência */}
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between gap-3 hover:border-neutral-700 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={images.slide3Audience}
                    alt="Público"
                    className="w-16 h-11 object-cover rounded-lg border border-neutral-700 shrink-0 shadow-sm"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">Lâmina 3: Fundo de Público & Métricas</div>
                    <div className="text-[10px] text-neutral-400 truncate">Atmosfera de multidão / audiência</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <label className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload PC</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'slide3Audience')}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleResetImage('slide3Audience')}
                    title="Restaurar padrão"
                    className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Slot 4: Lâmina 4 Atração 1 */}
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between gap-3 hover:border-neutral-700 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={images.slide4Attraction1}
                    alt="Atração 1"
                    className="w-16 h-11 object-cover rounded-lg border border-neutral-700 shrink-0 shadow-sm"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">Lâmina 4: Card Atração 1</div>
                    <div className="text-[10px] text-neutral-400 truncate">Palco Principal / Headliner / Keynote</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <label className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload PC</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'slide4Attraction1')}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleResetImage('slide4Attraction1')}
                    title="Restaurar padrão"
                    className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Slot 5: Lâmina 4 Atração 2 */}
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between gap-3 hover:border-neutral-700 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={images.slide4Attraction2}
                    alt="Atração 2"
                    className="w-16 h-11 object-cover rounded-lg border border-neutral-700 shrink-0 shadow-sm"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">Lâmina 4: Card Atração 2</div>
                    <div className="text-[10px] text-neutral-400 truncate">Gastronomia / Espaço VIP / Lounge</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <label className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload PC</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'slide4Attraction2')}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleResetImage('slide4Attraction2')}
                    title="Restaurar padrão"
                    className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Slot 6: Lâmina 4 Atração 3 */}
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between gap-3 hover:border-neutral-700 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={images.slide4Attraction3}
                    alt="Atração 3"
                    className="w-16 h-11 object-cover rounded-lg border border-neutral-700 shrink-0 shadow-sm"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">Lâmina 4: Card Atração 3</div>
                    <div className="text-[10px] text-neutral-400 truncate">Ativações de Marca / Networking</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <label className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload PC</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'slide4Attraction3')}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleResetImage('slide4Attraction3')}
                    title="Restaurar padrão"
                    className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Slot 7: Lâmina 6 Encerramento */}
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between gap-3 hover:border-neutral-700 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={images.slide6Closing}
                    alt="Encerramento"
                    className="w-16 h-11 object-cover rounded-lg border border-neutral-700 shrink-0 shadow-sm"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">Lâmina 6: Foto de Fechamento</div>
                    <div className="text-[10px] text-neutral-400 truncate">Fundo da lâmina comercial de contato</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <label className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload PC</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'slide6Closing')}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleResetImage('slide6Closing')}
                    title="Restaurar padrão"
                    className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* SEÇÃO 4: GALERIA CURADA UNSPLASH */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                Ou escolha da Galeria Curada de Alta Resolução (1-Clique)
              </span>
              <div className="space-y-3">
                {curatedGalleryPresets.map((cat, cIdx) => (
                  <div key={cIdx} className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-neutral-400">{cat.category}</span>
                    <div className="grid grid-cols-2 gap-2">
                      {cat.items.map((item, iIdx) => (
                        <button
                          key={iIdx}
                          onClick={() => {
                            setImages((prev) => ({ ...prev, slide1Cover: item.url }));
                            showToast(`Imagem "${item.label}" aplicada à Capa!`);
                          }}
                          className="relative rounded-lg overflow-hidden border border-neutral-800 hover:border-amber-400 group h-14 text-left transition-all"
                        >
                          <img
                            src={item.url}
                            alt={item.label}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors flex items-end p-1.5">
                            <span className="text-[9px] font-bold text-white truncate drop-shadow">
                              {item.label}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 4: COTAS & VALORES ===================== */}
        {activeTab === 'cotas' && (
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                Cotas de Patrocínio Configuradas
              </span>
              <p className="text-xs text-neutral-400">
                Ajuste os valores, nomes e disponibilidade das cotas para atualizar a Lâmina 5 e os cálculos em tempo real.
              </p>
            </div>

            {eventData.tiers.map((tier, index) => (
              <div
                key={tier.id}
                className={`p-4 rounded-xl border backdrop-blur-md space-y-3 ${
                  tier.highlighted
                    ? 'border-amber-400/80 bg-neutral-800/80'
                    : 'border-neutral-800 bg-neutral-950/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase">{tier.name}</span>
                    {tier.highlighted && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                        Master
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-neutral-400">
                    {tier.quotasAvailable} cota(s)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-neutral-400 font-medium block mb-1">Valor (R$)</label>
                    <input
                      type="number"
                      value={tier.price}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 0;
                        setEventData((prev) => ({
                          ...prev,
                          tiers: prev.tiers.map((t, i) => (i === index ? { ...t, price: val } : t)),
                        }));
                      }}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-amber-300 font-bold font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 font-medium block mb-1">Cotas Vagas</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={tier.quotasAvailable}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 1;
                        setEventData((prev) => ({
                          ...prev,
                          tiers: prev.tiers.map((t, i) =>
                            i === index ? { ...t, quotasAvailable: val } : t
                          ),
                        }));
                      }}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-200 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-400 font-medium block mb-1 text-xs">
                    Nome da Cota
                  </label>
                  <input
                    type="text"
                    value={tier.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEventData((prev) => ({
                        ...prev,
                        tiers: prev.tiers.map((t, i) => (i === index ? { ...t, name: val } : t)),
                      }));
                    }}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-200 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-neutral-800 bg-neutral-950/40 text-center text-[11px] text-neutral-500">
        Edição Visual Interativa • Todas as lâminas suportam clique direto para editar
      </div>
    </aside>
  );
};
