import type { SectorConfig } from '../types';

export const barberiaConfig: SectorConfig = {
  id: 'barberia',
  sectorLabel: 'Barbería',
  defaultBusinessName: 'MW BarberShop',
  defaultTagline: 'Precisión, carácter y un trato cercano.',
  publicKicker: 'Barbería contemporánea · Barcelona',
  heroEyebrow: 'Corte, barba y estilo propio',
  heroTitleLead: 'Tu estilo,',
  heroTitleAccent: 'siempre a punto.',
  servicesEyebrow: 'Lo que hacemos',
  servicesTitle: 'Servicios con detalle',
  servicesText: 'Escoge tu servicio y reserva en menos de un minuto.',
  teamEyebrow: 'El equipo',
  teamHeading: 'Buenas manos. Buen ambiente.',
  teamText: 'Elige a tu barbero o déjanos asignarte el primero disponible.',
  galleryEyebrow: 'Nuestro espacio',
  galleryHeading: 'El ritual de cuidarse',
  visitHeading: 'Un buen corte empieza aquí.',
  labels: { singular: 'Barbero', plural: 'Barberos', teamTitle: 'Equipo', businessType: 'barbería' },
  colorPacks: [
    {
      id: 'black-wood', label: 'Black & Wood', description: 'Carbón, madera clara y crema.',
      tokens: { primary: '#b96f3c', primaryHover: '#98552c', secondary: '#d9b58a', accent: '#d58a4f', background: '#090909', surface: '#12110f', surfaceAlt: '#1a1714', text: '#f7f2eb', muted: '#b6aca3', border: '#332a23', success: '#438461', danger: '#c65757' },
    },
    {
      id: 'graphite-gold', label: 'Graphite Gold', description: 'Grafito profundo y dorado suave.',
      tokens: { primary: '#b99a59', primaryHover: '#987b42', secondary: '#e1cf9f', accent: '#c4a665', background: '#101111', surface: '#181919', surfaceAlt: '#222323', text: '#f5f2e9', muted: '#aaa89f', border: '#373632', success: '#4f8967', danger: '#c05f58' },
    },
    {
      id: 'midnight-silver', label: 'Midnight Silver', description: 'Azul noche, grafito y plata.',
      tokens: { primary: '#8da1b5', primaryHover: '#71889e', secondary: '#c7d0d8', accent: '#a7b5c2', background: '#091018', surface: '#101923', surfaceAlt: '#182431', text: '#f0f4f7', muted: '#9caab6', border: '#293949', success: '#4a8b75', danger: '#c35f63' },
    },
    {
      id: 'cream-charcoal', label: 'Cream Charcoal', description: 'Crema luminosa y carbón.',
      tokens: { primary: '#343434', primaryHover: '#1f1f1f', secondary: '#a77a50', accent: '#94663c', background: '#eee8dd', surface: '#faf7f1', surfaceAlt: '#e4ddd1', text: '#22211f', muted: '#6d6963', border: '#d1c7b9', success: '#39795b', danger: '#b74747' },
    },
    {
      id: 'forest-barber', label: 'Forest Barber', description: 'Verde bosque, beige y carbón.',
      tokens: { primary: '#9b7b50', primaryHover: '#7f623d', secondary: '#d1c0a3', accent: '#b49567', background: '#0d1714', surface: '#15211d', surfaceAlt: '#1c2b25', text: '#f3efe7', muted: '#a9b0a7', border: '#32423a', success: '#5b916d', danger: '#c15b55' },
    },
  ],
  fontPacks: [
    { id: 'heritage', label: 'Heritage', description: 'Clásica, sólida y premium.', heading: "Georgia, 'Times New Roman', serif", body: "Inter, 'Segoe UI', sans-serif" },
    { id: 'modern', label: 'Modern', description: 'Contundente y contemporánea.', heading: "Arial Black, Inter, 'Segoe UI', sans-serif", body: "Inter, 'Segoe UI', sans-serif" },
    { id: 'urban', label: 'Urban', description: 'Compacta y geométrica.', heading: "'Arial Narrow', Impact, sans-serif", body: "Inter, 'Segoe UI', sans-serif" },
    { id: 'minimal', label: 'Minimal', description: 'Limpia y con mucho aire.', heading: "Inter, 'Segoe UI', sans-serif", body: "Inter, 'Segoe UI', sans-serif" },
  ],
  imagePacks: [
    { id: 'classic', label: 'Classic', description: 'Ritual, madera y oficio.', hero: '/images/hero-barber.webp', services: ['/images/service-fade.webp', '/images/service-beard.webp', '/images/barber-tools.webp', '/images/grooming-products.webp'], gallery: ['/images/barbershop-interior.webp', '/images/service-fade.webp', '/images/service-beard.webp', '/images/barber-tools.webp', '/images/grooming-products.webp', '/images/hero-barber.webp'], backdrop: '/images/barber-tools.webp' },
    { id: 'modern', label: 'Modern', description: 'Espacio actual y cercano.', hero: '/images/barbershop-interior.webp', services: ['/images/hero-barber.webp', '/images/service-fade.webp', '/images/grooming-products.webp', '/images/service-beard.webp'], gallery: ['/images/barbershop-interior.webp', '/images/hero-barber.webp', '/images/barber-tools.webp', '/images/service-fade.webp', '/images/grooming-products.webp', '/images/service-beard.webp'], backdrop: '/images/barbershop-interior.webp' },
    { id: 'premium', label: 'Premium', description: 'Contraste y fotografía sofisticada.', hero: '/images/service-beard.webp', services: ['/images/service-beard.webp', '/images/grooming-products.webp', '/images/hero-barber.webp', '/images/barber-tools.webp'], gallery: ['/images/service-beard.webp', '/images/grooming-products.webp', '/images/barbershop-interior.webp', '/images/hero-barber.webp', '/images/service-fade.webp', '/images/barber-tools.webp'], backdrop: '/images/grooming-products.webp' },
    { id: 'clean', label: 'Clean', description: 'Imágenes claras y sencillas.', hero: '/images/service-fade.webp', services: ['/images/service-fade.webp', '/images/barber-tools.webp', '/images/barbershop-interior.webp', '/images/hero-barber.webp'], gallery: ['/images/service-fade.webp', '/images/barbershop-interior.webp', '/images/barber-tools.webp', '/images/grooming-products.webp', '/images/hero-barber.webp', '/images/service-beard.webp'], backdrop: '/images/service-fade.webp' },
  ],
  heroVariants: [
    { id: 'barber-a', label: 'Barber Hero A', description: 'Fotografía cinematográfica a pantalla completa.', layout: 'cinematic' },
    { id: 'barber-b', label: 'Barber Hero B', description: 'Composición dividida, cálida y directa.', layout: 'split' },
    { id: 'barber-c', label: 'Barber Hero C', description: 'Versión luminosa y minimalista.', layout: 'minimal' },
  ],
  presets: [
    { id: 'dark-heritage', label: 'Dark Heritage', description: 'Barbería clásica premium contemporánea.', colorPackId: 'black-wood', fontPackId: 'heritage', imagePackId: 'classic', heroVariantId: 'barber-a', visual: { radius: 'none', shadow: 'subtle', spacing: 'balanced', buttons: 'square', cards: 'bordered', imageTreatment: 'cinematic', serviceLayout: 'cards', staffLayout: 'portrait', galleryLayout: 'masonry' } },
    { id: 'modern-wood', label: 'Modern Wood', description: 'Moderna, cálida y cercana.', colorPackId: 'black-wood', fontPackId: 'modern', imagePackId: 'modern', heroVariantId: 'barber-b', visual: { radius: 'subtle', shadow: 'subtle', spacing: 'balanced', buttons: 'soft', cards: 'flat', imageTreatment: 'warm', serviceLayout: 'cards', staffLayout: 'profile', galleryLayout: 'grid' } },
    { id: 'urban-black', label: 'Urban Black', description: 'Joven, compacta y de alto contraste.', colorPackId: 'midnight-silver', fontPackId: 'urban', imagePackId: 'premium', heroVariantId: 'barber-a', visual: { radius: 'none', shadow: 'none', spacing: 'compact', buttons: 'square', cards: 'bordered', imageTreatment: 'contrast', serviceLayout: 'list', staffLayout: 'portrait', galleryLayout: 'grid' } },
    { id: 'clean-barber', label: 'Clean Barber', description: 'Minimalista, luminosa y aireada.', colorPackId: 'cream-charcoal', fontPackId: 'minimal', imagePackId: 'clean', heroVariantId: 'barber-c', visual: { radius: 'soft', shadow: 'subtle', spacing: 'airy', buttons: 'soft', cards: 'floating', imageTreatment: 'clean', serviceLayout: 'editorial', staffLayout: 'profile', galleryLayout: 'editorial' } },
  ],
};
