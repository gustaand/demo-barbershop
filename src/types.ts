export type Plan = 'managed' | 'essential';
export type ThemeMode = 'light' | 'dark' | 'system';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
export type RequestStatus = 'Nueva' | 'En proceso' | 'Esperando cliente' | 'Completada' | 'Cancelada';
export type ExceptionType = 'staff_vacation' | 'business_closure' | 'block' | 'special_hours';

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
  name: string;
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
  image: string;
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
  image: string;
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
  version: 2;
  business: Business;
  services: Service[];
  staff: StaffMember[];
  openingHours: WeeklySchedule;
  exceptions: DemoException[];
  appointments: Appointment[];
  gallery: GalleryItem[];
  requests: SupportRequest[];
  settings: { theme: ThemeMode };
}
