import type { Appointment, DemoData } from '../types';
import { fromDateKey, pad } from './date';

function icsDate(date: Date) {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00Z`;
}

function escape(value: string) {
  return value.replaceAll('\\', '\\\\').replaceAll(',', '\\,').replaceAll(';', '\\;').replaceAll('\n', '\\n');
}

export function downloadAppointmentIcs(data: DemoData, appointment: Appointment, businessName: string) {
  const service = data.services.find((item) => item.id === appointment.serviceId);
  const staff = data.staff.find((item) => item.id === appointment.staffId);
  const start = fromDateKey(appointment.date, appointment.time);
  const end = new Date(start.getTime() + (service?.duration ?? 30) * 60_000);
  const content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Marques Works//Demo Reservas//ES',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${appointment.id}@marquesworks.demo`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${escape(`${service?.name ?? 'Cita'} · ${businessName}`)}`,
    `DESCRIPTION:${escape(`Profesional: ${staff?.name ?? ''}. Reserva a nombre de ${appointment.customerName}.`)}`,
    `LOCATION:${escape(data.business.address)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `cita-${appointment.date}-${appointment.time.replace(':', '')}.ics`;
  anchor.click();
  URL.revokeObjectURL(url);
}
