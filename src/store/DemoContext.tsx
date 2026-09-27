import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getSectorConfig } from '../config';
import type { DemoAppearance, DemoData, DemoId, SectorConfig } from '../types';
import { DEMO_STORAGE_EVENT, demoRepository } from './storage';

type DataRecipe = (draft: DemoData) => void;
type AppearanceRecipe = (draft: DemoAppearance) => void;

interface DemoContextValue {
  demoId: DemoId;
  config: SectorConfig;
  data: DemoData;
  appearance: DemoAppearance;
  update: (recipe: DataRecipe) => void;
  updateData: (recipe: DataRecipe) => void;
  updateAppearance: (recipe: AppearanceRecipe) => void;
  reset: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ demoId, children }: { demoId: DemoId; children: ReactNode }) {
  const [data, setData] = useState<DemoData>(() => demoRepository.loadData(demoId));
  const [appearance, setAppearance] = useState<DemoAppearance>(() => demoRepository.loadAppearance(demoId));
  const config = getSectorConfig(demoId);

  const updateData = useCallback((recipe: DataRecipe) => {
    setData((current) => {
      const next = structuredClone(current);
      recipe(next);
      demoRepository.saveData(demoId, next);
      return next;
    });
  }, [demoId]);

  const updateAppearance = useCallback((recipe: AppearanceRecipe) => {
    setAppearance((current) => {
      const next = structuredClone(current);
      recipe(next);
      demoRepository.saveAppearance(demoId, next);
      return next;
    });
  }, [demoId]);

  const reset = useCallback(() => {
    const next = demoRepository.reset(demoId);
    setData(next.data);
    setAppearance(next.appearance);
  }, [demoId]);

  useEffect(() => {
    const refresh = (event?: Event) => {
      if (event instanceof CustomEvent && event.detail?.demoId && event.detail.demoId !== demoId) return;
      setData(demoRepository.loadData(demoId));
      setAppearance(demoRepository.loadAppearance(demoId));
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === demoRepository.dataKey(demoId) || event.key === demoRepository.appearanceKey(demoId)) refresh();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener(DEMO_STORAGE_EVENT, refresh);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(DEMO_STORAGE_EVENT, refresh);
    };
  }, [demoId]);

  const value = useMemo(() => ({ demoId, config, data, appearance, update: updateData, updateData, updateAppearance, reset }), [demoId, config, data, appearance, updateData, updateAppearance, reset]);
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used inside DemoProvider');
  return context;
}
