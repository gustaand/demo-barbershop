import type { DemoData } from '../types.ts';
import { seedDemoData } from '../data/seed.ts';

export const STORAGE_KEY = 'mw-demo-v2';

export const demoRepository = {
  load(): DemoData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return this.reset();
      const parsed = JSON.parse(raw) as DemoData;
      if (parsed.version !== 2) return this.reset();
      return parsed;
    } catch {
      return this.reset();
    }
  },
  save(data: DemoData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
  reset() {
    const seed = seedDemoData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  },
};
