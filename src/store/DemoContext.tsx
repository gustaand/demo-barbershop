import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { DemoData, ThemeMode } from '../types';
import { demoRepository } from './storage';

type Recipe = (draft: DemoData) => void;

interface DemoContextValue {
  data: DemoData;
  update: (recipe: Recipe) => void;
  reset: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

function resolveTheme(theme: ThemeMode) {
  return theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DemoData>(() => demoRepository.load());

  const update = useCallback((recipe: Recipe) => {
    setData((current) => {
      const next = structuredClone(current);
      recipe(next);
      demoRepository.save(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => setData(demoRepository.reset()), []);

  const setTheme = useCallback((theme: ThemeMode) => {
    update((draft) => { draft.settings.theme = theme; });
  }, [update]);

  useEffect(() => {
    const apply = () => { document.documentElement.dataset.panelTheme = resolveTheme(data.settings.theme); };
    apply();
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [data.settings.theme]);

  const value = useMemo(() => ({ data, update, reset, setTheme }), [data, update, reset, setTheme]);
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used inside DemoProvider');
  return context;
}
