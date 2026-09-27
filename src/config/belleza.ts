import type { SectorConfig } from '../types';

export const bellezaConfig: SectorConfig = {
  id: 'belleza',
  sectorLabel: 'Belleza',
  defaultBusinessName: 'MW Beauty Studio',
  defaultTagline: 'Belleza cuidada, tiempo para ti.',
  publicKicker: 'Estética avanzada · Barcelona',
  heroEyebrow: 'Cuidado experto, resultados naturales',
  heroTitleLead: 'Tu momento.',
  heroTitleAccent: 'Tu mejor versión.',
  servicesEyebrow: 'Tratamientos',
  servicesTitle: 'Belleza pensada para ti',
  servicesText: 'Tratamientos precisos, una experiencia tranquila y reservas sin esperas.',
  teamEyebrow: 'Profesionales',
  teamHeading: 'Experiencia que se nota.',
  teamText: 'Elige a tu profesional o reserva la primera disponibilidad.',
  galleryEyebrow: 'El estudio',
  galleryHeading: 'Calma, detalle y cuidado',
  visitHeading: 'Tu espacio para parar y cuidarte.',
  labels: { singular: 'Profesional', plural: 'Profesionales', teamTitle: 'Profesionales', businessType: 'centro de estética' },
  colorPacks: [
    {
      id: 'nude-ivory', label: 'Nude Ivory', description: 'Nude, beige y marfil.',
      tokens: { primary: '#9a6f60', primaryHover: '#80584b', secondary: '#d6b9a9', accent: '#b78c79', background: '#f5efe9', surface: '#fffaf6', surfaceAlt: '#ece1d8', text: '#332b28', muted: '#756963', border: '#ddcec3', success: '#5e856b', danger: '#b75a5e' },
    },
    {
      id: 'sage-natural', label: 'Sage Natural', description: 'Verde salvia, beige y blanco roto.',
      tokens: { primary: '#71806a', primaryHover: '#586650', secondary: '#b9c1ad', accent: '#8f9d85', background: '#f1f2ec', surface: '#fbfcf8', surfaceAlt: '#e3e7dc', text: '#30362e', muted: '#6d756a', border: '#d2d8cb', success: '#578064', danger: '#ae5b5b' },
    },
    {
      id: 'soft-rose', label: 'Soft Rose', description: 'Rosa empolvado, crema y taupe.',
      tokens: { primary: '#9b7375', primaryHover: '#805b5d', secondary: '#d6b9b6', accent: '#b68f8e', background: '#f6efee', surface: '#fffafa', surfaceAlt: '#eadedd', text: '#392f30', muted: '#796a6b', border: '#ddcece', success: '#65856f', danger: '#b5545d' },
    },
    {
      id: 'terracotta-warm', label: 'Terracotta Warm', description: 'Terracota suave, marfil y arena.',
      tokens: { primary: '#ad7059', primaryHover: '#915946', secondary: '#d5ae96', accent: '#c18568', background: '#f4ede5', surface: '#fffaf4', surfaceAlt: '#e8dbcd', text: '#3d302b', muted: '#7b6b62', border: '#dccbbd', success: '#66836a', danger: '#b65655' },
    },
    {
      id: 'clean-blue', label: 'Clean Blue', description: 'Azul grisáceo, blanco y gris cálido.',
      tokens: { primary: '#607986', primaryHover: '#4b626e', secondary: '#b7c5ca', accent: '#8098a2', background: '#f2f5f5', surface: '#ffffff', surfaceAlt: '#e3e9ea', text: '#2d3639', muted: '#69777c', border: '#d1dadd', success: '#56806c', danger: '#b45a60' },
    },
  ],
  fontPacks: [
    { id: 'editorial', label: 'Editorial', description: 'Serif elegante y sans ligera.', heading: "Didot, 'Bodoni MT', Georgia, serif", body: "'Helvetica Neue', Inter, sans-serif" },
    { id: 'natural', label: 'Natural', description: 'Orgánica, suave y acogedora.', heading: "Georgia, 'Times New Roman', serif", body: "'Trebuchet MS', Inter, sans-serif" },
    { id: 'luxury', label: 'Luxury', description: 'Refinada y sofisticada.', heading: "'Bodoni MT', Didot, Georgia, serif", body: "'Helvetica Neue', Arial, sans-serif" },
    { id: 'clean', label: 'Clean', description: 'Moderna, limpia y precisa.', heading: "Inter, 'Segoe UI', sans-serif", body: "Inter, 'Segoe UI', sans-serif" },
  ],
  imagePacks: [
    { id: 'nude', label: 'Nude', description: 'Luz cálida y tonos marfil.', hero: '/images/beauty-hero-nude.webp', services: ['/images/beauty-brows.webp', '/images/beauty-lashes.webp', '/images/beauty-manicure.webp', '/images/beauty-pedicure.webp'], gallery: ['/images/beauty-hero-nude.webp', '/images/beauty-studio.webp', '/images/beauty-brows.webp', '/images/beauty-lashes.webp', '/images/beauty-manicure.webp', '/images/beauty-pedicure.webp'], backdrop: '/images/beauty-studio.webp' },
    { id: 'natural', label: 'Natural', description: 'Bienestar, salvia y texturas naturales.', hero: '/images/beauty-hero-sage.webp', services: ['/images/beauty-brows.webp', '/images/beauty-manicure.webp', '/images/beauty-lashes.webp', '/images/beauty-pedicure.webp'], gallery: ['/images/beauty-hero-sage.webp', '/images/beauty-studio.webp', '/images/beauty-manicure.webp', '/images/beauty-brows.webp', '/images/beauty-pedicure.webp', '/images/beauty-lashes.webp'], backdrop: '/images/beauty-hero-sage.webp' },
    { id: 'luxury', label: 'Luxury', description: 'Editorial, sofisticado y luminoso.', hero: '/images/beauty-hero-luxury.webp', services: ['/images/beauty-lashes.webp', '/images/beauty-brows.webp', '/images/beauty-manicure.webp', '/images/beauty-pedicure.webp'], gallery: ['/images/beauty-hero-luxury.webp', '/images/beauty-lashes.webp', '/images/beauty-studio.webp', '/images/beauty-brows.webp', '/images/beauty-manicure.webp', '/images/beauty-pedicure.webp'], backdrop: '/images/beauty-hero-luxury.webp' },
    { id: 'clean', label: 'Clean', description: 'Tratamiento preciso y estudio moderno.', hero: '/images/beauty-hero-clean.webp', services: ['/images/beauty-brows.webp', '/images/beauty-lashes.webp', '/images/beauty-manicure.webp', '/images/beauty-pedicure.webp'], gallery: ['/images/beauty-hero-clean.webp', '/images/beauty-studio.webp', '/images/beauty-brows.webp', '/images/beauty-manicure.webp', '/images/beauty-lashes.webp', '/images/beauty-pedicure.webp'], backdrop: '/images/beauty-hero-clean.webp' },
  ],
  heroVariants: [
    { id: 'beauty-a', label: 'Beauty Hero A', description: 'Editorial elegante con gran fotografía.', layout: 'editorial' },
    { id: 'beauty-b', label: 'Beauty Hero B', description: 'Split suave con contenido aireado.', layout: 'soft-split' },
    { id: 'beauty-c', label: 'Beauty Hero C', description: 'Minimal clean con enfoque wellness.', layout: 'wellness' },
  ],
  presets: [
    { id: 'nude-elegant', label: 'Nude Elegant', description: 'Premium, suave y editorial.', colorPackId: 'nude-ivory', fontPackId: 'editorial', imagePackId: 'nude', heroVariantId: 'beauty-a', visual: { radius: 'soft', shadow: 'subtle', spacing: 'airy', buttons: 'soft', cards: 'flat', imageTreatment: 'luminous', serviceLayout: 'editorial', staffLayout: 'profile', galleryLayout: 'editorial' } },
    { id: 'sage-natural', label: 'Sage Natural', description: 'Natural, orgánico y relajante.', colorPackId: 'sage-natural', fontPackId: 'natural', imagePackId: 'natural', heroVariantId: 'beauty-b', visual: { radius: 'rounded', shadow: 'subtle', spacing: 'airy', buttons: 'pill', cards: 'floating', imageTreatment: 'natural', serviceLayout: 'cards', staffLayout: 'profile', galleryLayout: 'grid' } },
    { id: 'soft-luxury', label: 'Soft Luxury', description: 'Centro de estética sofisticado.', colorPackId: 'soft-rose', fontPackId: 'luxury', imagePackId: 'luxury', heroVariantId: 'beauty-a', visual: { radius: 'subtle', shadow: 'elevated', spacing: 'airy', buttons: 'soft', cards: 'bordered', imageTreatment: 'soft', serviceLayout: 'editorial', staffLayout: 'portrait', galleryLayout: 'masonry' } },
    { id: 'clean-beauty', label: 'Clean Beauty', description: 'Moderno, joven y clínico agradable.', colorPackId: 'clean-blue', fontPackId: 'clean', imagePackId: 'clean', heroVariantId: 'beauty-c', visual: { radius: 'soft', shadow: 'none', spacing: 'balanced', buttons: 'soft', cards: 'bordered', imageTreatment: 'clean', serviceLayout: 'list', staffLayout: 'profile', galleryLayout: 'grid' } },
  ],
};
