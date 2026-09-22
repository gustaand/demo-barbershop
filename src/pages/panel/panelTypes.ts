export type PanelScreen = 'dashboard' | 'agenda' | 'appointments' | 'services' | 'hours' | 'team' | 'exceptions' | 'gallery' | 'business' | 'requests' | 'settings';

export const screenTitles: Record<PanelScreen, string> = {
  dashboard: 'Hoy',
  agenda: 'Agenda',
  appointments: 'Reservas',
  services: 'Servicios',
  hours: 'Horarios',
  team: 'Equipo',
  exceptions: 'Vacaciones y cierres',
  gallery: 'Galería',
  business: 'Datos del negocio',
  requests: 'Solicitudes',
  settings: 'Configuración',
};
