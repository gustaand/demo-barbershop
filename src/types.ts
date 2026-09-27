export type DemoId = 'barberia' | 'belleza';
export type Plan = 'managed' | 'essential';
export type ThemeMode = 'light' | 'dark' | 'system';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
export type RequestStatus = 'Nueva' | 'En proceso' | 'Esperando cliente' | 'Completada' | 'Cancelada';
export type ExceptionType = 'staff_vacation' | 'business_closure' | 'block' | 'special_hours';
export type LogoStyle = 'text' | 'monogram' | 'demo';

export interface TimeInterval {
  start: string;
  end: string;
}

export interface DaySchedule {
  open: boolean;
  intervals: TimeInterval[];
}

export type WeeklySchedule = Record<number, DaySchedule>;

export interface Business {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  description: string;
  instagram: string;
  facebook: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  active: boolean;
  imageSlot: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  active: boolean;
  serviceIds: string[];
  workingHours: WeeklySchedule;
}

export interface DemoException {
  id: string;
  type: ExceptionType;
  staffId?: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  reason: string;
}

export interface Appointment {
  id: string;
  serviceId: string;
  staffId: string;
  date: string;
  time: string;
  customerName: string;
  phone: string;
  status: AppointmentStatus;
  source: 'web' | 'phone' | 'whatsapp' | 'walk_in';
  createdAt: string;
  notes?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  imageSlot: number;
  active: boolean;
  order: number;
}

export interface SupportRequest {
  id: string;
  type: string;
  subject: string;
  description: string;
  date: string;
  status: RequestStatus;
  plan: Plan;
}

export interface DemoData {
  version: 3;
  business: Business;
  services: Service[];
  staff: StaffMember[];
  openingHours: WeeklySchedule;
  exceptions: DemoException[];
  appointments: Appointment[];
  gallery: GalleryItem[];
  requests: SupportRequest[];
}

export interface ColorTokens {
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  muted: string;
  border: string;
  success: string;
  danger: string;
}

export interface ColorPack {
  id: string;
  label: string;
  description: string;
  tokens: ColorTokens;
}

export interface FontPack {
  id: string;
  label: string;
  description: string;
  heading: string;
  body: string;
}

export interface ImagePack {
  id: string;
  label: string;
  description: string;
  hero: string;
  services: string[];
  gallery: string[];
  backdrop: string;
}

export interface HeroVariant {
  id: string;
  label: string;
  description: string;
  layout: 'cinematic' | 'split' | 'minimal' | 'editorial' | 'soft-split' | 'wellness';
}

export interface VisualSettings {
  radius: 'none' | 'subtle' | 'soft' | 'rounded';
  shadow: 'none' | 'subtle' | 'elevated';
  spacing: 'compact' | 'balanced' | 'airy';
  buttons: 'square' | 'soft' | 'pill';
  cards: 'bordered' | 'flat' | 'floating';
  imageTreatment: 'cinematic' | 'warm' | 'contrast' | 'clean' | 'soft' | 'natural' | 'luminous';
  serviceLayout: 'cards' | 'editorial' | 'list';
  staffLayout: 'portrait' | 'profile';
  galleryLayout: 'masonry' | 'grid' | 'editorial';
}

export interface AppearancePreset {
  id: string;
  label: string;
  description: string;
  colorPackId: string;
  fontPackId: string;
  imagePackId: string;
  heroVariantId: string;
  visual: VisualSettings;
}

export interface DemoAppearance {
  version: 3;
  businessName: string;
  tagline: string;
  presetId: string;
  colorPackId: string;
  fontPackId: string;
  imagePackId: string;
  heroVariantId: string;
  logoStyle: LogoStyle;
  visual: VisualSettings;
}

export interface SectorLabels {
  singular: string;
  plural: string;
  teamTitle: string;
  businessType: string;
}

export interface SectorConfig {
  id: DemoId;
  sectorLabel: string;
  defaultBusinessName: string;
  defaultTagline: string;
  publicKicker: string;
  heroEyebrow: string;
  heroTitleLead: string;
  heroTitleAccent: string;
  servicesEyebrow: string;
  servicesTitle: string;
  servicesText: string;
  teamEyebrow: string;
  teamHeading: string;
  teamText: string;
  galleryEyebrow: string;
  galleryHeading: string;
  visitHeading: string;
  labels: SectorLabels;
  presets: AppearancePreset[];
  colorPacks: ColorPack[];
  fontPacks: FontPack[];
  imagePacks: ImagePack[];
  heroVariants: HeroVariant[];
}
