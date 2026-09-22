import type { DemoData, WeeklySchedule } from '../types.ts';
import { addDays, nextOpenDay, toDateKey } from '../utils/date.ts';

const closed = () => ({ open: false, intervals: [] });
const full = () => ({ open: true, intervals: [{ start: '09:00', end: '14:00' }, { start: '16:00', end: '20:00' }] });
const morning = () => ({ open: true, intervals: [{ start: '09:00', end: '14:00' }] });

function businessSchedule(): WeeklySchedule {
  return {
    0: closed(),
    1: full(),
    2: full(),
    3: full(),
    4: full(),
    5: full(),
    6: morning(),
  };
}

function alexSchedule(): WeeklySchedule {
  return {
    0: closed(),
    1: full(),
    2: full(),
    3: full(),
    4: full(),
    5: full(),
    6: morning(),
  };
}

function brunoSchedule(): WeeklySchedule {
  return {
    0: closed(),
    1: closed(),
    2: full(),
    3: full(),
    4: full(),
    5: full(),
    6: morning(),
  };
}

export function seedDemoData(): DemoData {
  const openingHours = businessSchedule();
  const brunoHours = brunoSchedule();
  const activeDate = nextOpenDay(brunoHours);
  let nextDateValue = addDays(new Date(`${activeDate}T12:00:00`), 1);
  while (!openingHours[nextDateValue.getDay()]?.open) nextDateValue = addDays(nextDateValue, 1);
  const nextDate = toDateKey(nextDateValue);
  const vacationStart = toDateKey(addDays(new Date(), 12));
  const vacationEnd = toDateKey(addDays(new Date(), 14));

  return {
    version: 2,
    business: {
      name: 'MW BarberShop',
      phone: '+34 603 976 985',
      whatsapp: '+34 603 976 985',
      email: 'hola@mwbarbershop.es',
      address: 'Carrer de la Indústria, 42 · Barcelona',
      description: 'Barbería contemporánea, trato cercano y técnica cuidada. Tu estilo, siempre a punto.',
      instagram: '@mwbarbershop',
      facebook: 'MW BarberShop',
    },
    services: [
      { id: 'cut', name: 'Corte clásico', description: 'Corte personalizado y acabado profesional.', price: 18, duration: 30, active: true, image: '/images/service-fade.webp' },
      { id: 'beard', name: 'Barba', description: 'Perfilado, arreglo y cuidado de barba.', price: 12, duration: 20, active: true, image: '/images/service-beard.webp' },
      { id: 'combo', name: 'Corte + Barba', description: 'El servicio completo para renovar tu estilo.', price: 27, duration: 45, active: true, image: '/images/hero-barber.webp' },
      { id: 'fade', name: 'Degradado premium', description: 'Fade de precisión con asesoramiento de estilo.', price: 22, duration: 40, active: true, image: '/images/service-fade.webp' },
      { id: 'kids', name: 'Corte infantil', description: 'Para menores de 12 años.', price: 15, duration: 30, active: true, image: '/images/barber-tools.webp' },
    ],
    staff: [
      {
        id: 'alex', name: 'Álex', role: 'Barbero senior', bio: 'Especialista en clásicos, degradados y asesoramiento de imagen.',
        avatar: '/images/alex.webp', active: true,
        serviceIds: ['cut', 'beard', 'combo', 'fade'], workingHours: alexSchedule(),
      },
      {
        id: 'bruno', name: 'Bruno', role: 'Barbero', bio: 'Precisión en barba, cortes actuales y trato cercano.',
        avatar: '/images/bruno.webp', active: true,
        serviceIds: ['cut', 'beard', 'combo', 'kids'], workingHours: brunoHours,
      },
    ],
    openingHours,
    exceptions: [
      {
        id: 'vacation-alex', type: 'staff_vacation', staffId: 'alex', startDate: vacationStart,
        endDate: vacationEnd, reason: 'Vacaciones de Álex',
      },
      {
        id: 'block-bruno', type: 'block', staffId: 'bruno', startDate: nextDate,
        endDate: nextDate, startTime: '16:00', endTime: '17:30', reason: 'Formación interna',
      },
    ],
    appointments: [
      { id: 'apt-1', serviceId: 'cut', staffId: 'alex', date: activeDate, time: '10:00', customerName: 'Carlos López', phone: '612 456 987', status: 'confirmed', source: 'web', createdAt: new Date().toISOString() },
      { id: 'apt-2', serviceId: 'beard', staffId: 'bruno', date: activeDate, time: '11:00', customerName: 'Diego Martínez', phone: '623 987 111', status: 'pending', source: 'whatsapp', createdAt: new Date().toISOString() },
      { id: 'apt-3', serviceId: 'combo', staffId: 'alex', date: activeDate, time: '12:00', customerName: 'Javier Ruiz', phone: '611 332 870', status: 'confirmed', source: 'phone', createdAt: new Date().toISOString() },
      { id: 'apt-4', serviceId: 'cut', staffId: 'bruno', date: activeDate, time: '16:00', customerName: 'Andrés García', phone: '633 555 120', status: 'confirmed', source: 'web', createdAt: new Date().toISOString() },
      { id: 'apt-5', serviceId: 'beard', staffId: 'alex', date: activeDate, time: '17:30', customerName: 'Roberto Sánchez', phone: '699 121 454', status: 'confirmed', source: 'walk_in', createdAt: new Date().toISOString() },
      { id: 'apt-6', serviceId: 'fade', staffId: 'alex', date: nextDate, time: '09:30', customerName: 'Marc Vidal', phone: '644 220 113', status: 'confirmed', source: 'web', createdAt: new Date().toISOString() },
    ],
    gallery: [
      { id: 'gallery-1', title: 'Nuestro espacio', image: '/images/barbershop-interior.webp', active: true, order: 0 },
      { id: 'gallery-2', title: 'Corte de precisión', image: '/images/service-fade.webp', active: true, order: 1 },
      { id: 'gallery-3', title: 'Cuidado de barba', image: '/images/service-beard.webp', active: true, order: 2 },
      { id: 'gallery-4', title: 'Herramientas del oficio', image: '/images/barber-tools.webp', active: true, order: 3 },
      { id: 'gallery-5', title: 'Selección de productos', image: '/images/grooming-products.webp', active: true, order: 4 },
      { id: 'gallery-6', title: 'El ritual MW', image: '/images/hero-barber.webp', active: true, order: 5 },
    ],
    requests: [
      { id: 'req-1', type: 'Cambio de diseño', subject: 'Actualizar imagen de portada', description: 'Valorar una nueva fotografía para la campaña de otoño.', date: toDateKey(new Date()), status: 'En proceso', plan: 'managed' },
    ],
    settings: { theme: 'system' },
  };
}
