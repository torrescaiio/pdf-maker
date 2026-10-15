/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, Printer, Sparkles, HelpCircle } from 'lucide-react';
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

export default function App() {
  const [eventData, setEventData] = useState<EventData>(defaultEventData);
  const [theme, setTheme] = useState<ThemeConfig>(defaultThemePresets.luxuryGold);
  const [images, setImages] = useState<SlideImages>(defaultImages);

  const [layoutFormat, setLayoutFormat] = useState<LayoutFormat>('widescreen');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [viewMode, setViewMode] = useState<'all' | 'single'>('all');
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

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

  const handlePrint = () => {
    // When printing, we need all slides visible in DOM so they all get printed
    setViewMode('all');
    setShowPrintModal(true);
  };

  const executePrint = () => {
    setShowPrintModal(false);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const activeFormatConfig = formatConfigs[layoutFormat] || formatConfigs.widescreen;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100 font-sans-body">
      {/* Dynamic Print Style Tag in React tree for instant SSR / DOM sync */}
      <style id="dynamic-print-style-inline">
        {getDynamicPrintCss(layoutFormat)}
      </style>

      {/* Mobile Toggle Button (hidden in print) */}
      <div className="no-print lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3.5 rounded-full shadow-2xl bg-amber-400 text-neutral-950 font-bold flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
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
          currentSlideIndex={currentSlide}
          setCurrentSlideIndex={setCurrentSlide}
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
      />

      {/* Print Instructions Modal */}
      {showPrintModal && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="p-3 rounded-xl text-neutral-950 font-bold"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Printer className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Exportação para PDF ({activeFormatConfig.ratioLabel})
                </h3>
                <p className="text-xs text-neutral-400">
                  {activeFormatConfig.label} • Configurações recomendadas
                </p>
              </div>
            </div>

            <div className="bg-neutral-950/80 p-4 rounded-xl border border-neutral-800 space-y-2.5 text-xs text-neutral-300">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                Na janela de impressão do seu navegador:
              </div>
              <ul className="space-y-2 list-disc list-inside text-neutral-300">
                <li>
                  Destino: <strong>"Salvar como PDF"</strong>
                </li>
                <li>
                  Layout / Orientação:{' '}
                  <strong>
                    {layoutFormat === 'widescreen'
                      ? '"Paisagem (Horizontal)"'
                      : '"Retrato (Vertical)"'}
                  </strong>
                </li>
                <li>
                  Tamanho da Página: <strong>{activeFormatConfig.printPageSize}</strong> (ou ajuste à página)
                </li>
                <li>
                  Margens: <strong>"Nenhuma"</strong>
                </li>
                <li>
                  Opções: marque <strong>"Gráficos de segundo plano"</strong>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={executePrint}
                className="px-5 py-2.5 rounded-lg text-xs font-bold text-neutral-950 transition-all shadow-lg hover:brightness-110"
                style={{ backgroundColor: theme.primaryColor }}
              >
                Prosseguir para Impressão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
