import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { LayoutFormat } from '../types.ts';

export interface ExportProgress {
  currentSlide: number;
  totalSlides: number;
  status: string;
}

/**
 * Captures all slide DOM elements and exports a high-fidelity PDF
 * that matches the on-screen presentation 100% pixel-for-pixel.
 */
export async function exportSlidesToPdf(
  slideElementIds: string[],
  format: LayoutFormat,
  eventName: string,
  onProgress?: (progress: ExportProgress) => void
): Promise<void> {
  const totalSlides = slideElementIds.length;
  if (totalSlides === 0) return;

  // PDF orientation and dimensions in mm based on format
  // Widescreen (16:9): 297mm x 167.0625mm
  // Mobile (9:16): 180mm x 320mm
  // A4 Portrait: 210mm x 297mm
  let orientation: 'landscape' | 'portrait' = 'landscape';
  let pdfWidthMm = 297;
  let pdfHeightMm = 167.0625;

  if (format === 'mobile') {
    orientation = 'portrait';
    pdfWidthMm = 180;
    pdfHeightMm = 320;
  } else if (format === 'a4Portrait') {
    orientation = 'portrait';
    pdfWidthMm = 210;
    pdfHeightMm = 297;
  } else {
    // Widescreen 16:9
    orientation = 'landscape';
    pdfWidthMm = 297;
    pdfHeightMm = 167.0625;
  }

  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: [pdfWidthMm, pdfHeightMm],
    compress: true,
  });

  for (let i = 0; i < totalSlides; i++) {
    const id = slideElementIds[i];
    const element = document.getElementById(id);

    if (onProgress) {
      onProgress({
        currentSlide: i + 1,
        totalSlides,
        status: `Processando Lâmina ${i + 1} de ${totalSlides}...`,
      });
    }

    if (!element) {
      console.warn(`Element with id ${id} not found.`);
      continue;
    }

    // Scroll element into view and allow any fonts or images to render
    element.scrollIntoView({ behavior: 'instant', block: 'center' });
    await new Promise((r) => setTimeout(r, 150));

    // Capture using html2canvas at scale 2 for crisp vector-like text & high-res images
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#0a0a0a',
      logging: false,
      imageTimeout: 15000,
      ignoreElements: (el) => {
        return (
          el.classList.contains('no-print') ||
          (el.tagName.toLowerCase() === 'button' && (el as HTMLButtonElement).title?.includes('Excluir'))
        );
      },
      onclone: (clonedDoc) => {
        // In the cloned DOM, make sure all buttons with no-print or edit outlines are removed
        clonedDoc.querySelectorAll('.no-print').forEach((item) => {
          (item as HTMLElement).style.display = 'none';
        });
        clonedDoc.querySelectorAll('[contenteditable]').forEach((item) => {
          item.removeAttribute('contenteditable');
          (item as HTMLElement).style.outline = 'none';
          (item as HTMLElement).style.boxShadow = 'none';
        });
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    if (i > 0) {
      pdf.addPage([pdfWidthMm, pdfHeightMm], orientation);
    }

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidthMm, pdfHeightMm, undefined, 'FAST');
  }

  if (onProgress) {
    onProgress({
      currentSlide: totalSlides,
      totalSlides,
      status: 'Finalizando e baixando PDF...',
    });
  }

  const safeName = (eventName || 'proposta-patrocinio')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  pdf.save(`${safeName}-apresentacao-${format}.pdf`);
}
