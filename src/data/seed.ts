import type { DemoData, DemoId, WeeklySchedule } from '../types';
import { addDays, toDateKey, todayKey } from '../utils/date';

const closed = () => ({ open: false, intervals: [] });
const full = () => ({ open: true, intervals: [{ start: '09:00', end: '14:00' }, { start: '16:00', end: '20:00' }] });
const continuous = () => ({ open: true, intervals: [{ start: '09:30', end: '19:30' }] });
const morning = () => ({ open: true, intervals: [{ start: '09:00', end: '14:00' }] });

function barberBusinessSchedule(): WeeklySchedule {
  return { 0: closed(), 1: full(), 2: full(), 3: full(), 4: full(), 5: full(), 6: morning() };
}

function alexSchedule(): WeeklySchedule {
  return { 0: closed(), 1: full(), 2: full(), 3: full(), 4: full(), 5: full(), 6: morning() };
}

function brunoSchedule(): WeeklySchedule {
  return { 0: closed(), 1: closed(), 2: full(), 3: full(), 4: full(), 5: full(), 6: morning() };
}

function beautyBusinessSchedule(): WeeklySchedule {
  return { 0: closed(), 1: continuous(), 2: continuous(), 3: continuous(), 4: continuous(), 5: continuous(), 6: morning() };
}

function lauraSchedule(): WeeklySchedule {
  return { 0: closed(), 1: continuous(), 2: continuous(), 3: continuous(), 4: continuous(), 5: continuous(), 6: closed() };
}

function sofiaSchedule(): WeeklySchedule {
  return { 0: closed(), 1: closed(), 2: continuous(), 3: continuous(), 4: continuous(), 5: continuous(), 6: morning() };
}

function barberiaSeed(): DemoData {
  const today = todayKey();
  const tomorrow = toDateKey(addDays(new Date(), 1));
  const vacationStart = toDateKey(addDays(new Date(), 12));
  const vacationEnd = toDateKey(addDays(new Date(), 14));

  return {
    version: 3,
    business: {
      phone: '+34 603 97 69 85', whatsapp: '+34 603 97 69 85', email: 'hola@mwbarbershop.es',
      address: 'Carrer de la Indústria, 42 · Barcelona',
      description: 'Barbería contemporánea, trato cercano y técnica cuidada. Tu estilo, siempre a punto.',
      instagram: '@mwbarbershop', facebook: 'MW BarberShop',
    },
    services: [
      { id: 'cut', name: 'Corte clásico', description: 'Corte personalizado y acabado profesional.', price: 18, duration: 30, active: true, imageSlot: 0 },
      { id: 'beard', name: 'Barba', description: 'Perfilado, arreglo y cuidado de barba.', price: 12, duration: 20, active: true, imageSlot: 1 },
      { id: 'combo', name: 'Corte + Barba', description: 'El servicio completo para renovar tu estilo.', price: 27, duration: 45, active: true, imageSlot: 2 },
      { id: 'fade', name: 'Degradado premium', description: 'Fade de precisión con asesoramiento de estilo.', price: 22, duration: 40, active: true, imageSlot: 3 },
    ],
    staff: [
      { id: 'alex', name: 'Álex', role: 'Barbero senior', bio: 'Especialista en clásicos, degradados y asesoramiento de imagen.', avatar: '/images/alex.webp', active: true, serviceIds: ['cut', 'beard', 'combo', 'fade'], workingHours: alexSchedule() },
      { id: 'bruno', name: 'Bruno', role: 'Barbero', bio: 'Precisión en barba, cortes actuales y trato cercano.', avatar: '/images/bruno.webp', active: true, serviceIds: ['cut', 'beard', 'combo'], workingHours: brunoSchedule() },
    ],
    openingHours: barberBusinessSchedule(),
    exceptions: [
      { id: 'vacation-alex', type: 'staff_vacation', staffId: 'alex', startDate: vacationStart, endDate: vacationEnd, reason: 'Vacaciones de Álex' },
      { id: 'block-bruno', type: 'block', staffId: 'bruno', startDate: tomorrow, endDate: tomorrow, startTime: '16:00', endTime: '17:30', reason: 'Formación interna' },
    ],
    appointments: [
      { id: 'barber-apt-1', serviceId: 'cut', staffId: 'alex', date: today, time: '10:00', customerName: 'Carlos López', phone: '612 456 987', status: 'confirmed', source: 'web', createdAt: new Date().toISOString() },
      { id: 'barber-apt-2', serviceId: 'beard', staffId: 'bruno', date: today, time: '11:00', customerName: 'Diego Martínez', phone: '623 987 111', status: 'pending', source: 'whatsapp', createdAt: new Date().toISOString() },
      { id: 'barber-apt-3', serviceId: 'combo', staffId: 'alex', date: today, time: '12:00', customerName: 'Javier Ruiz', phone: '611 332 870', status: 'confirmed', source: 'phone', createdAt: new Date().toISOString() },
      { id: 'barber-apt-4', serviceId: 'cut', staffId: 'bruno', date: today, time: '16:00', customerName: 'Andrés García', phone: '633 555 120', status: 'confirmed', source: 'web', createdAt: new Date().toISOString() },
      { id: 'barber-apt-5', serviceId: 'fade', staffId: 'alex', date: tomorrow, time: '09:30', customerName: 'Marc Vidal', phone: '644 220 113', status: 'confirmed', source: 'web', createdAt: new Date().toISOString() },
    ],
    gallery: [
      { id: 'barber-gallery-1', title: 'Nuestro espacio', imageSlot: 0, active: true, order: 0 },
      { id: 'barber-gallery-2', title: 'Corte de precisión', imageSlot: 1, active: true, order: 1 },
      { id: 'barber-gallery-3', title: 'Cuidado de barba', imageSlot: 2, active: true, order: 2 },
      { id: 'barber-gallery-4', title: 'Herramientas del oficio', imageSlot: 3, active: true, order: 3 },
      { id: 'barber-gallery-5', title: 'Selección de productos', imageSlot: 4, active: true, order: 4 },
      { id: 'barber-gallery-6', title: 'El ritual MW', imageSlot: 5, active: true, order: 5 },
    ],
    requests: [
      { id: 'barber-req-1', type: 'Cambio de diseño', subject: 'Actualizar imagen de portada', description: 'Valorar una nueva fotografía para la campaña de otoño.', date: today, status: 'En proceso', plan: 'managed' },
    ],
  };
}

function bellezaSeed(): DemoData {
  const today = todayKey();
  const tomorrow = toDateKey(addDays(new Date(), 1));
  const vacationStart = toDateKey(addDays(new Date(), 18));
  const vacationEnd = toDateKey(addDays(new Date(), 20));

  return {
    version: 3,
    business: {
      phone: '34 603 97 69 85', whatsapp: '34 603 97 69 85', email: 'hola@mwbeautystudio.es',
      address: 'Carrer de Provença, 118 · Barcelona',
      description: 'Tratamientos de belleza cuidados, resultados naturales y un espacio pensado para bajar el ritmo.',
      instagram: '@mwbeautystudio', facebook: 'MW Beauty Studio',
    },
    services: [
      { id: 'brow-design', name: 'Diseño de cejas', description: 'Diseño personalizado para equilibrar y realzar tu mirada.', price: 15, duration: 30, active: true, imageSlot: 0 },
      { id: 'lash-lift', name: 'Lifting de pestañas', description: 'Curvatura natural y mirada abierta durante semanas.', price: 35, duration: 60, active: true, imageSlot: 1 },
      { id: 'manicure', name: 'Manicura semipermanente', description: 'Preparación cuidada y color duradero con acabado limpio.', price: 25, duration: 60, active: true, imageSlot: 2 },
      { id: 'pedicure', name: 'Pedicura completa', description: 'Cuidado integral, hidratación y acabado impecable.', price: 30, duration: 60, active: true, imageSlot: 3 },
      { id: 'brow-wax', name: 'Depilación de cejas', description: 'Definición rápida y delicada respetando tu forma natural.', price: 10, duration: 20, active: true, imageSlot: 0 },
    ],
    staff: [
      { id: 'laura', name: 'Laura', role: 'Especialista en mirada', bio: 'Diseño de cejas y pestañas con resultados naturales y personalizados.', avatar: '/images/laura.webp', active: true, serviceIds: ['brow-design', 'lash-lift', 'brow-wax'], workingHours: lauraSchedule() },
      { id: 'sofia', name: 'Sofía', role: 'Especialista en manos y pies', bio: 'Manicura, pedicura y atención al detalle en cada sesión.', avatar: '/images/sofia.webp', active: true, serviceIds: ['manicure', 'pedicure', 'brow-wax'], workingHours: sofiaSchedule() },
    ],
    openingHours: beautyBusinessSchedule(),
    exceptions: [
      { id: 'vacation-sofia', type: 'staff_vacation', staffId: 'sofia', startDate: vacationStart, endDate: vacationEnd, reason: 'Vacaciones de Sofía' },
      { id: 'beauty-special', type: 'special_hours', startDate: tomorrow, endDate: tomorrow, startTime: '10:00', endTime: '18:00', reason: 'Horario especial de formación' },
    ],
    appointments: [
      { id: 'beauty-apt-1', serviceId: 'brow-design', staffId: 'laura', date: today, time: '10:00', customerName: 'Marta López', phone: '612 112 987', status: 'confirmed', source: 'web', createdAt: new Date().toISOString() },
      { id: 'beauty-apt-2', serviceId: 'manicure', staffId: 'sofia', date: today, time: '11:30', customerName: 'Carla Ruiz', phone: '623 222 111', status: 'pending', source: 'whatsapp', createdAt: new Date().toISOString() },
      { id: 'beauty-apt-3', serviceId: 'lash-lift', staffId: 'laura', date: today, time: '13:00', customerName: 'Elena García', phone: '611 333 870', status: 'confirmed', source: 'phone', createdAt: new Date().toISOString() },
      { id: 'beauty-apt-4', serviceId: 'pedicure', staffId: 'sofia', date: today, time: '17:00', customerName: 'Lucía Martín', phone: '633 444 120', status: 'confirmed', source: 'web', createdAt: new Date().toISOString() },
      { id: 'beauty-apt-5', serviceId: 'brow-wax', staffId: 'laura', date: tomorrow, time: '10:30', customerName: 'Ana Torres', phone: '644 550 113', status: 'confirmed', source: 'web', createdAt: new Date().toISOString() },
    ],
    gallery: [
      { id: 'beauty-gallery-1', title: 'Nuestro estudio', imageSlot: 0, active: true, order: 0 },
      { id: 'beauty-gallery-2', title: 'Un espacio para ti', imageSlot: 1, active: true, order: 1 },
      { id: 'beauty-gallery-3', title: 'Diseño de cejas', imageSlot: 2, active: true, order: 2 },
      { id: 'beauty-gallery-4', title: 'Lifting de pestañas', imageSlot: 3, active: true, order: 3 },
      { id: 'beauty-gallery-5', title: 'Manicura cuidada', imageSlot: 4, active: true, order: 4 },
      { id: 'beauty-gallery-6', title: 'Momento de calma', imageSlot: 5, active: true, order: 5 },
    ],
    requests: [
      { id: 'beauty-req-1', type: 'Nueva sección web', subject: 'Destacar tratamientos de mirada', description: 'Queremos valorar una sección específica para cejas y pestañas.', date: today, status: 'Nueva', plan: 'managed' },
    ],
  };
}

export function seedDemoData(demoId: DemoId): DemoData {
  return demoId === 'barberia' ? barberiaSeed() : bellezaSeed();
}
