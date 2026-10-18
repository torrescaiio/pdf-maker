import React, { useState, useEffect } from 'react';
import { Menu, X, Printer, Sparkles, HelpCircle, Download, Loader2, CheckCircle2 } from 'lucide-react';
import { Sidebar } from './components/Sidebar.tsx';
import { SlideViewer } from './components/SlideViewer.tsx';
import type { EventData, ThemeConfig, SlideImages, LayoutFormat } from './types.ts';
import {
  defaultEventData,
  defaultThemePresets,
  defaultImages,
  formatConfigs,
  getDynamicPrintCss,
} from './utils/proposalLogic.ts';
import { exportSlidesToPdf, type ExportProgress } from './utils/pdfExport.ts';
import {
  loadSavedProject,
  saveProject,
  clearSavedProject,
  exportProjectToJsonFile,
  importProjectFromJsonFile,
} from './utils/storage.ts';

export default function App() {
  const initialSaved = React.useMemo(() => loadSavedProject(), []);

  const [eventData, setEventData] = useState<EventData>(() => initialSaved?.eventData || defaultEventData);
  const [theme, setTheme] = useState<ThemeConfig>(() => initialSaved?.theme || defaultThemePresets.luxuryGold);
  const [images, setImages] = useState<SlideImages>(() => initialSaved?.images || defaultImages);
  const [layoutFormat, setLayoutFormat] = useState<LayoutFormat>(() => initialSaved?.format || 'widescreen');

  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(() =>
    initialSaved ? 'Restaurado da sessão anterior' : null
  );

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [viewMode, setViewMode] = useState<'all' | 'single'>('all');
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);

  // Auto-save project state to localStorage on any edit
  useEffect(() => {
    setIsSaved(false);
    const timer = setTimeout(() => {
      const ok = saveProject({
        eventData,
        theme,
        images,
        format: layoutFormat,
      });
      if (ok) {
        setIsSaved(true);
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSavedTime(timeStr);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [eventData, theme, images, layoutFormat]);

  // Synchronous flush save on page unload or reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProject({
        eventData,
        theme,
        images,
        format: layoutFormat,
      });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [eventData, theme, images, layoutFormat]);

  // Dynamic CSS injection for @media print and @page
  useEffect(() => {
    let styleTag = document.getElementById('dynamic-print-style') as HTMLStyleElement | null;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'dynamic-print-style';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = getDynamicPrintCss(layoutFormat);
  }, [layoutFormat]);

  const handleResetProject = () => {
    const confirm = window.confirm(
      'Deseja resetar todas as edições para o modelo padrão? Todas as alterações serão substituídas pelos valores originais de fábrica.'
    );
    if (confirm) {
      clearSavedProject();
      setEventData(defaultEventData);
      setTheme(defaultThemePresets.luxuryGold);
      setImages(defaultImages);
      setLayoutFormat('widescreen');
      setIsSaved(true);
      setLastSavedTime('Projeto resetado');
    }
  };

  const handleExportBackup = () => {
    exportProjectToJsonFile({
      eventData,
      theme,
      images,
      format: layoutFormat,
    });
  };

  const handleImportBackup = async (file: File) => {
    try {
      const state = await importProjectFromJsonFile(file);
      setEventData(state.eventData);
      setTheme(state.theme);
      setImages(state.images);
      setLayoutFormat(state.format);
      saveProject(state);
      setIsSaved(true);
      setLastSavedTime('Backup importado com sucesso');
    } catch (err: any) {
      alert('Erro ao importar backup: ' + (err?.message || 'Arquivo inválido'));
    }
  };

  const handlePrint = () => {
    // When printing, we need all slides visible in DOM so they all get printed
    setViewMode('all');
    setShowPrintModal(true);
  };

  const handleDirectPdfExport = async () => {
    setViewMode('all');
    setIsExportingPdf(true);
    setExportProgress({
      currentSlide: 1,
      totalSlides: 6,
      status: 'Iniciando captura fiel das 6 lâminas...',
    });

    // Small delay to ensure React DOM has rendered all slides
    await new Promise((r) => setTimeout(r, 250));

    try {
      const slideIds = [
        'slide-capture-node-1',
        'slide-capture-node-2',
        'slide-capture-node-3',
        'slide-capture-node-4',
        'slide-capture-node-5',
        'slide-capture-node-6',
      ];
      await exportSlidesToPdf(slideIds, layoutFormat, eventData.name, (progress) => {
        setExportProgress(progress);
      });
      setShowPrintModal(false);
    } catch (err) {
      console.error('Erro ao exportar PDF direto:', err);
      // Fallback to browser print if canvas fails for any reason
      executePrint();
    } finally {
      setIsExportingPdf(false);
      setExportProgress(null);
    }
  };

  const executePrint = () => {
    setShowPrintModal(false);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const activeFormatConfig = formatConfigs[layoutFormat] || formatConfigs.widescreen;

  return (
    <div className="app-root-container flex h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100 font-sans-body">
      {/* Dynamic Print Style Tag in React tree for instant SSR / DOM sync */}
      <style id="dynamic-print-style-inline">
        {getDynamicPrintCss(layoutFormat)}
      </style>

      {/* Mobile Toggle Button (hidden in print) */}
      <div className="no-print lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3.5 rounded-full shadow-2xl bg-amber-400 text-neutral-950 font-bold flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Left Sidebar Controls */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar
          eventData={eventData}
          setEventData={setEventData}
          theme={theme}
          setTheme={setTheme}
          images={images}
          setImages={setImages}
          format={layoutFormat}
          setFormat={setLayoutFormat}
          onPrint={handlePrint}
          onDirectPdfExport={handleDirectPdfExport}
          isExportingPdf={isExportingPdf}
          currentSlideIndex={currentSlide}
          setCurrentSlideIndex={setCurrentSlide}
          isSaved={isSaved}
          lastSavedTime={lastSavedTime}
          onResetProject={handleResetProject}
          onExportBackup={handleExportBackup}
          onImportBackup={handleImportBackup}
        />
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="no-print lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
        />
      )}

      {/* Right Slide Viewer */}
      <SlideViewer
        eventData={eventData}
        setEventData={setEventData}
        theme={theme}
        images={images}
        setImages={setImages}
        format={layoutFormat}
        setFormat={setLayoutFormat}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        viewMode={viewMode}
        setViewMode={setViewMode}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        onPrint={handlePrint}
        onDirectPdfExport={handleDirectPdfExport}
        isExportingPdf={isExportingPdf}
      />

      {/* Real-Time PDF Generation Progress Modal */}
      {isExportingPdf && exportProgress && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-neutral-900 border border-amber-500/40 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-lg">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Exportando PDF 100% Idêntico
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                {exportProgress.status}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-neutral-950 rounded-full h-2.5 overflow-hidden border border-neutral-800">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(exportProgress.currentSlide / exportProgress.totalSlides) * 100}%`,
                  background: `linear-gradient(90deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                }}
              />
            </div>

            <div className="text-[11px] text-neutral-400 flex items-center justify-between font-mono">
              <span>Lâmina {exportProgress.currentSlide} de {exportProgress.totalSlides}</span>
              <span>{Math.round((exportProgress.currentSlide / exportProgress.totalSlides) * 100)}%</span>
            </div>
            <p className="text-[10px] text-neutral-500 italic">
              Renderizando cores, tipografia e diagramação exatas para o arquivo final.
            </p>
          </div>
        </div>
      )}

      {/* Print Instructions / Export Choice Modal */}
      {showPrintModal && !isExportingPdf && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div
                className="p-3 rounded-xl text-neutral-950 font-bold shadow-md"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Printer className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Exportar Apresentação ({activeFormatConfig.ratioLabel})
                </h3>
                <p className="text-xs text-neutral-400">
                  {activeFormatConfig.label} • Escolha o método de exportação
                </p>
              </div>
            </div>

            {/* Option 1: Direct High-Fidelity PDF (100% Identical) */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/40 via-neutral-950 to-neutral-900 border border-amber-500/40 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Modo Recomendado: 100% Fiel à Tela
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950 font-bold uppercase">
                  Sem Erros
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Gera o arquivo <strong>PDF pronto para download</strong> capturando exatamente as cores, fotos, fontes, balões e diagramação que você está vendo agora no site, sem depender das opções de impressão do navegador.
              </p>
              <button
                type="button"
                onClick={handleDirectPdfExport}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-neutral-950 flex items-center justify-center gap-2 shadow-xl hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
                }}
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Baixar PDF Direto (100% Fiel à Tela)</span>
              </button>
            </div>

            {/* Option 2: Native Browser Print (Ctrl+P) */}
            <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Printer className="w-3.5 h-3.5 text-neutral-400" />
                  Impressão Nativa do Navegador (Ctrl + P)
                </span>
                <button
                  type="button"
                  onClick={executePrint}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors cursor-pointer"
                >
                  Abrir Impressora
                </button>
              </div>
              <p className="text-[11px] text-neutral-400">
                Se for usar a janela do navegador, lembre-se de marcar <strong>"Gráficos de segundo plano"</strong> e margens <strong>"Nenhuma"</strong>.
              </p>
            </div>

            <div className="flex items-center justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
