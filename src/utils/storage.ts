import type { EventData, ThemeConfig, SlideImages, LayoutFormat } from '../types.ts';
import { defaultEventData, defaultThemePresets, defaultImages } from './proposalLogic.ts';

const STORAGE_KEY = 'aurora_commercial_proposal_project_v1';
const IDB_NAME = 'aurora_proposal_db_v1';
const IDB_STORE = 'proposal_store';
const IDB_KEY = 'saved_project_state';

export interface SavedProjectState {
  version: number;
  updatedAt: string;
  eventData: EventData;
  theme: ThemeConfig;
  images: SlideImages;
  format: LayoutFormat;
}

/**
 * Open IndexedDB database
 */
function openDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(IDB_NAME, 1);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn('Falha ao abrir IndexedDB, usando fallback de localStorage');
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
}

/**
 * Asynchronously save to IndexedDB (virtually unlimited quota for uploaded photos and rich edits)
 */
async function saveToIndexedDB(payload: SavedProjectState): Promise<void> {
  const db = await openDB();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      store.put(payload, IDB_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

/**
 * Asynchronously load from IndexedDB
 */
export async function loadSavedProjectFromIndexedDB(): Promise<SavedProjectState | null> {
  const db = await openDB();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(IDB_KEY);
      req.onsuccess = () => {
        const parsed = req.result as Partial<SavedProjectState> | undefined;
        if (!parsed || !parsed.eventData) {
          resolve(null);
          return;
        }

        resolve({
          version: parsed.version || 1,
          updatedAt: parsed.updatedAt || new Date().toISOString(),
          eventData: { ...defaultEventData, ...parsed.eventData },
          theme: parsed.theme || defaultThemePresets.luxuryGold,
          images: { ...defaultImages, ...(parsed.images || {}) },
          format: parsed.format || 'widescreen',
        });
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Loads project state synchronously from localStorage with validation and fallback to defaults
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
 * Saves project state to both localStorage and IndexedDB with full persistence safety
 */
export function saveProject(state: {
  eventData: EventData;
  theme: ThemeConfig;
  images: SlideImages;
  format: LayoutFormat;
}): boolean {
  const payload: SavedProjectState = {
    version: 1,
    updatedAt: new Date().toISOString(),
    eventData: state.eventData,
    theme: state.theme,
    images: state.images,
    format: state.format,
  };

  // Always persist full state to IndexedDB asynchronously
  saveToIndexedDB(payload).catch((err) => console.warn('IndexedDB save warning:', err));

  // Also persist to localStorage for instant synchronous reads
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (err: any) {
    // If quota exceeded due to large base64 images, save lightweight copy in localStorage while IndexedDB holds full state
    if (err?.name === 'QuotaExceededError' || err?.code === 22) {
      try {
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
        console.error('Falha ao salvar localStorage compacto:', innerErr);
        return false;
      }
    }
    console.error('Erro ao salvar no localStorage:', err);
    return false;
  }
}

/**
 * Clears saved project from both localStorage and IndexedDB
 */
export function clearSavedProject(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Erro ao limpar localStorage:', err);
  }

  openDB().then((db) => {
    if (!db) return;
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).delete(IDB_KEY);
    } catch {
      // Ignore
    }
  });
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
