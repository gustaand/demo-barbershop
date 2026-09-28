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

export function cleanHeroText(value: string) {
  return value.replace(/^(?:\uFEFF|[\uFFFD?]){2,}\s*/u, '');
}

export function resolvePresentation(config: SectorConfig, appearance: DemoAppearance) {
  const preset = getPreset(config, appearance.presetId);
  const colorPack = config.colorPacks.find((item) => item.id === appearance.colorPackId)
    ?? config.colorPacks.find((item) => item.id === preset.colorPackId)
    ?? config.colorPacks[0];
  const fontPack = config.fontPacks.find((item) => item.id === appearance.fontPackId)
    ?? config.fontPacks.find((item) => item.id === preset.fontPackId)
    ?? config.fontPacks[0];
  const imagePack = config.imagePacks.find((item) => item.id === appearance.imagePackId)
    ?? config.imagePacks.find((item) => item.id === preset.imagePackId)
    ?? config.imagePacks[0];
  const heroVariant = config.heroVariants.find((item) => item.id === appearance.heroVariantId)
    ?? config.heroVariants.find((item) => item.id === preset.heroVariantId)
    ?? config.heroVariants[0];

  return {
    preset,
    colorPack,
    fontPack,
    imagePack,
    heroVariant,
    visual: { ...preset.visual, ...appearance.visual },
    heroTitle: cleanHeroText(appearance.businessName).trim() || config.defaultBusinessName,
    heroDescription: cleanHeroText(appearance.tagline).trim() || config.defaultTagline,
    heroEyebrow: config.publicKicker,
  };
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
