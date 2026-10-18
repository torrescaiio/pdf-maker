import type { EventData, ThemeConfig, SlideImages, LayoutFormat } from '../types.ts';
import { defaultEventData, defaultThemePresets, defaultImages } from './proposalLogic.ts';

const STORAGE_KEY = 'aurora_commercial_proposal_project_v1';

export interface SavedProjectState {
  version: number;
  updatedAt: string;
  eventData: EventData;
  theme: ThemeConfig;
  images: SlideImages;
  format: LayoutFormat;
}

/**
 * Loads project state from localStorage with validation and fallback to defaults
 */
export function loadSavedProject(): SavedProjectState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedProjectState>;
    if (!parsed || !parsed.eventData) return null;

    return {
      version: parsed.version || 1,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
      eventData: { ...defaultEventData, ...parsed.eventData },
      theme: parsed.theme || defaultThemePresets.luxuryGold,
      images: { ...defaultImages, ...(parsed.images || {}) },
      format: parsed.format || 'widescreen',
    };
  } catch (err) {
    console.warn('Erro ao carregar projeto salvo do localStorage:', err);
    return null;
  }
}

/**
 * Saves project state to localStorage with safety against QuotaExceededError
 */
export function saveProject(state: {
  eventData: EventData;
  theme: ThemeConfig;
  images: SlideImages;
  format: LayoutFormat;
}): boolean {
  try {
    const payload: SavedProjectState = {
      version: 1,
      updatedAt: new Date().toISOString(),
      eventData: state.eventData,
      theme: state.theme,
      images: state.images,
      format: state.format,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (err: any) {
    // If quota exceeded due to large base64 images, try saving with lighter images
    if (err?.name === 'QuotaExceededError' || err?.code === 22) {
      try {
        console.warn('localStorage cheio. Tentando salvar dados principais e tema...');
        const lightweightPayload = {
          version: 1,
          updatedAt: new Date().toISOString(),
          eventData: state.eventData,
          theme: state.theme,
          format: state.format,
          images: defaultImages,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweightPayload));
        return true;
      } catch (innerErr) {
        console.error('Falha ao salvar mesmo em modo compacto:', innerErr);
        return false;
      }
    }
    console.error('Erro ao salvar projeto no localStorage:', err);
    return false;
  }
}

/**
 * Clears saved project from localStorage
 */
export function clearSavedProject(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Erro ao limpar projeto salvo:', err);
  }
}

/**
 * Exports current project as a JSON backup file to user's computer
 */
export function exportProjectToJsonFile(state: {
  eventData: EventData;
  theme: ThemeConfig;
  images: SlideImages;
  format: LayoutFormat;
}): void {
  const payload: SavedProjectState = {
    version: 1,
    updatedAt: new Date().toISOString(),
    eventData: state.eventData,
    theme: state.theme,
    images: state.images,
    format: state.format,
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (state.eventData.name || 'proposta')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  a.href = url;
  a.download = `${safeName}-projeto-backup.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Imports project from an uploaded JSON file
 */
export function importProjectFromJsonFile(file: File): Promise<SavedProjectState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const parsed = JSON.parse(text) as Partial<SavedProjectState>;
        if (!parsed || !parsed.eventData) {
          throw new Error('Arquivo JSON inválido ou incompatível com a proposta.');
        }

        resolve({
          version: parsed.version || 1,
          updatedAt: parsed.updatedAt || new Date().toISOString(),
          eventData: { ...defaultEventData, ...parsed.eventData },
          theme: parsed.theme || defaultThemePresets.luxuryGold,
          images: { ...defaultImages, ...(parsed.images || {}) },
          format: parsed.format || 'widescreen',
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsText(file);
  });
}
