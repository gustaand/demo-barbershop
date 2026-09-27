import { barberiaConfig } from './barberia';
import { bellezaConfig } from './belleza';
import type { AppearancePreset, DemoAppearance, DemoId, SectorConfig } from '../types';

export const sectorConfigs: Record<DemoId, SectorConfig> = {
  barberia: barberiaConfig,
  belleza: bellezaConfig,
};

export function getSectorConfig(demoId: DemoId) {
  return sectorConfigs[demoId];
}

export function getPreset(config: SectorConfig, presetId: string): AppearancePreset {
  return config.presets.find((item) => item.id === presetId) ?? config.presets[0];
}

export function seedAppearance(demoId: DemoId): DemoAppearance {
  const config = getSectorConfig(demoId);
  const preset = config.presets[0];
  return {
    version: 3,
    businessName: config.defaultBusinessName,
    tagline: config.defaultTagline,
    presetId: preset.id,
    colorPackId: preset.colorPackId,
    fontPackId: preset.fontPackId,
    imagePackId: preset.imagePackId,
    heroVariantId: preset.heroVariantId,
    logoStyle: 'demo',
    visual: structuredClone(preset.visual),
  };
}

export function applyPreset(appearance: DemoAppearance, preset: AppearancePreset) {
  appearance.presetId = preset.id;
  appearance.colorPackId = preset.colorPackId;
  appearance.fontPackId = preset.fontPackId;
  appearance.imagePackId = preset.imagePackId;
  appearance.heroVariantId = preset.heroVariantId;
  appearance.visual = structuredClone(preset.visual);
}

export function initials(value: string) {
  return value.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'MW';
}
