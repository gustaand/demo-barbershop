import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ThemeMode } from '../types';
import { themeRepository } from './storage';

interface PanelThemeValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const PanelThemeContext = createContext<PanelThemeValue | null>(null);

function resolveTheme(theme: ThemeMode) {
  return theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;
}

export function PanelThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => themeRepository.load());
  const setTheme = useCallback((next: ThemeMode) => {
    themeRepository.save(next);
    setThemeState(next);
  }, []);

  useEffect(() => {
    const apply = () => { document.documentElement.dataset.panelTheme = resolveTheme(theme); };
    apply();
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
  return <PanelThemeContext.Provider value={value}>{children}</PanelThemeContext.Provider>;
}

export function usePanelTheme() {
  const context = useContext(PanelThemeContext);
  if (!context) throw new Error('usePanelTheme must be used inside PanelThemeProvider');
  return context;
}
