import { seedDemoData } from '../data/seed';
import { seedAppearance } from '../config';
import type { Business, DemoAppearance, DemoData, DemoId, GalleryItem, Service, ThemeMode } from '../types';

const PREFIX = 'mw-demo-v3';
const LEGACY_KEY = 'mw-demo-v2';
const THEME_KEY = `${PREFIX}:panel-theme`;
export const DEMO_STORAGE_EVENT = 'mw-demo-storage-change';

const key = (demoId: DemoId, section: 'data' | 'appearance') => `${PREFIX}:${demoId}:${section}`;

function parse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

function announce(demoId?: DemoId) {
  queueMicrotask(() => window.dispatchEvent(new CustomEvent(DEMO_STORAGE_EVENT, { detail: { demoId } })));
}

function migrateLegacyBarberia() {
  const raw = parse<{
    version?: number;
    business?: Business & { name?: string };
    services?: Array<Omit<Service, 'imageSlot'> & { image?: string }>;
    gallery?: Array<Omit<GalleryItem, 'imageSlot'> & { image?: string }>;
    staff?: DemoData['staff'];
    openingHours?: DemoData['openingHours'];
    exceptions?: DemoData['exceptions'];
    appointments?: DemoData['appointments'];
    requests?: DemoData['requests'];
  }>(localStorage.getItem(LEGACY_KEY));
  if (!raw || raw.version !== 2 || !raw.business || !raw.services || !raw.staff || !raw.openingHours) return null;

  const fallback = seedDemoData('barberia');
  const { name = 'MW BarberShop', ...business } = raw.business;
  const data: DemoData = {
    version: 3,
    business,
    services: raw.services.map((item, index) => {
      const service = { ...item, imageSlot: index % 4 };
      delete service.image;
      return service;
    }),
    gallery: raw.gallery
      ? raw.gallery.map((item, index) => {
        const galleryItem = { ...item, imageSlot: index % 6 };
        delete galleryItem.image;
        return galleryItem;
      })
      : fallback.gallery,
    staff: raw.staff,
    openingHours: raw.openingHours,
    exceptions: raw.exceptions ?? [],
    appointments: raw.appointments ?? [],
    requests: raw.requests ?? [],
  };
  const appearance = seedAppearance('barberia');
  appearance.businessName = name;
  localStorage.setItem(key('barberia', 'data'), JSON.stringify(data));
  localStorage.setItem(key('barberia', 'appearance'), JSON.stringify(appearance));
  return { data, appearance };
}

export const demoRepository = {
  dataKey(demoId: DemoId) { return key(demoId, 'data'); },
  appearanceKey(demoId: DemoId) { return key(demoId, 'appearance'); },

  loadData(demoId: DemoId): DemoData {
    const stored = parse<DemoData>(localStorage.getItem(key(demoId, 'data')));
    if (stored?.version === 3) return stored;
    if (demoId === 'barberia') {
      const migrated = migrateLegacyBarberia();
      if (migrated) return migrated.data;
    }
    return this.resetData(demoId);
  },

  loadAppearance(demoId: DemoId): DemoAppearance {
    const stored = parse<DemoAppearance>(localStorage.getItem(key(demoId, 'appearance')));
    if (stored?.version === 3) return stored;
    if (demoId === 'barberia' && !localStorage.getItem(key('barberia', 'data'))) {
      const migrated = migrateLegacyBarberia();
      if (migrated) return migrated.appearance;
    }
    return this.resetAppearance(demoId);
  },

  saveData(demoId: DemoId, data: DemoData) {
    localStorage.setItem(key(demoId, 'data'), JSON.stringify(data));
    announce(demoId);
  },

  saveAppearance(demoId: DemoId, appearance: DemoAppearance) {
    localStorage.setItem(key(demoId, 'appearance'), JSON.stringify(appearance));
    announce(demoId);
  },

  resetData(demoId: DemoId) {
    const data = seedDemoData(demoId);
    localStorage.setItem(key(demoId, 'data'), JSON.stringify(data));
    announce(demoId);
    return data;
  },

  resetAppearance(demoId: DemoId) {
    const appearance = seedAppearance(demoId);
    localStorage.setItem(key(demoId, 'appearance'), JSON.stringify(appearance));
    announce(demoId);
    return appearance;
  },

  reset(demoId: DemoId) {
    const data = seedDemoData(demoId);
    const appearance = seedAppearance(demoId);
    localStorage.setItem(key(demoId, 'data'), JSON.stringify(data));
    localStorage.setItem(key(demoId, 'appearance'), JSON.stringify(appearance));
    announce(demoId);
    return { data, appearance };
  },

  resetAll() {
    const barberia = this.reset('barberia');
    const belleza = this.reset('belleza');
    announce();
    return { barberia, belleza };
  },
};

export const themeRepository = {
  load(): ThemeMode {
    const value = localStorage.getItem(THEME_KEY);
    return value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
  },
  save(theme: ThemeMode) {
    localStorage.setItem(THEME_KEY, theme);
  },
};
