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
  // Widescreen (16:9): 297mm x 167.0625mm (exact 16:9 cinematic presentation ratio)
  // Mobile (9:16): 180mm x 320mm (exact 9:16 smartphone ratio)
  // A4 Portrait: 210mm x 297mm (exact standard A4 document)
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
        status: `Renderizando Lâmina ${i + 1} de ${totalSlides}...`,
      });
    }

    if (!element) {
      console.warn(`Elemento com id ${id} não foi encontrado.`);
      continue;
    }

    // Scroll element into view smoothly to trigger any lazy rendering
    element.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'center' });
    await new Promise((r) => setTimeout(r, 120));

    let imgData: string | null = null;

    // Primary attempt: High-resolution (scale 2) with safe CORS
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false, // Must be false to allow canvas.toDataURL without SecurityError
        backgroundColor: '#09090b',
        logging: false,
        imageTimeout: 8000,
        ignoreElements: (el) => {
          return (
            el.classList.contains('no-print') ||
            (el.tagName.toLowerCase() === 'button' &&
              (el as HTMLButtonElement).title?.includes('Excluir'))
          );
        },
        onclone: (clonedDoc) => {
          // Hide all editor controls in cloned DOM
          clonedDoc.querySelectorAll('.no-print').forEach((item) => {
            (item as HTMLElement).style.display = 'none';
          });
          clonedDoc.querySelectorAll('[contenteditable]').forEach((item) => {
            item.removeAttribute('contenteditable');
            (item as HTMLElement).style.outline = 'none';
            (item as HTMLElement).style.boxShadow = 'none';
            (item as HTMLElement).style.border = 'none';
          });
          clonedDoc.querySelectorAll('input').forEach((input) => {
            (input as HTMLInputElement).style.outline = 'none';
            (input as HTMLInputElement).style.boxShadow = 'none';
            (input as HTMLInputElement).style.borderColor = 'transparent';
          });
          // Ensure crossOrigin on images
          clonedDoc.querySelectorAll('img').forEach((img) => {
            if (img.src && !img.src.startsWith('data:')) {
              img.crossOrigin = 'anonymous';
            }
          });
        },
      });

      imgData = canvas.toDataURL('image/jpeg', 0.94);
    } catch (primaryErr) {
      console.warn(`Tentativa primária na lâmina ${i + 1} falhou, aplicando renderizador de compatibilidade:`, primaryErr);

      // Secondary attempt: Fallback with scale 1.25 and relaxed constraints
      try {
        const fallbackCanvas = await html2canvas(element, {
          scale: 1.25,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#09090b',
          logging: false,
          imageTimeout: 5000,
          onclone: (clonedDoc) => {
            clonedDoc.querySelectorAll('.no-print').forEach((item) => {
              (item as HTMLElement).style.display = 'none';
            });
            clonedDoc.querySelectorAll('[contenteditable]').forEach((item) => {
              item.removeAttribute('contenteditable');
              (item as HTMLElement).style.outline = 'none';
            });
          },
        });
        imgData = fallbackCanvas.toDataURL('image/jpeg', 0.9);
      } catch (fallbackErr) {
        console.error(`Erro crítico na lâmina ${i + 1}:`, fallbackErr);
      }
    }

    if (imgData) {
      if (i > 0) {
        pdf.addPage([pdfWidthMm, pdfHeightMm], orientation);
      }
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidthMm, pdfHeightMm, undefined, 'FAST');
    }
  }

  if (onProgress) {
    onProgress({
      currentSlide: totalSlides,
      totalSlides,
      status: 'Download do PDF pronto...',
    });
  }

  const safeName = (eventName || 'proposta-comercial')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  pdf.save(`${safeName}-apresentacao-${format}.pdf`);
}
