import type { DemoData, StaffMember, TimeInterval } from '../types.ts';
import { dateTimeValue, fromDateKey, minutes, timeFromMinutes, todayKey } from './date.ts';

export interface AvailableSlot {
  time: string;
  staffId: string;
}

function intersection(a: TimeInterval[], b: TimeInterval[]) {
  const result: TimeInterval[] = [];
  for (const left of a) {
    for (const right of b) {
      const start = Math.max(minutes(left.start), minutes(right.start));
      const end = Math.min(minutes(left.end), minutes(right.end));
      if (start < end) result.push({ start: timeFromMinutes(start), end: timeFromMinutes(end) });
    }
  }
  return result;
}

function dateInRange(date: string, start: string, end: string) {
  return date >= start && date <= end;
}

function overlaps(startA: number, endA: number, startB: number, endB: number) {
  return startA < endB && endA > startB;
}

function candidateIntervals(data: DemoData, staff: StaffMember, date: string) {
  const day = fromDateKey(date).getDay();
  const business = data.openingHours[day];
  const worker = staff.workingHours[day];
  if (!business?.open || !worker?.open) return [];
  let intervals = intersection(business.intervals, worker.intervals);

  const specials = data.exceptions.filter((item) =>
    item.type === 'special_hours' && dateInRange(date, item.startDate, item.endDate) && (!item.staffId || item.staffId === staff.id),
  );
  if (specials.length) {
    const specialIntervals = specials
      .filter((item) => item.startTime && item.endTime)
      .map((item) => ({ start: item.startTime!, end: item.endTime! }));
    if (specialIntervals.length) intervals = intersection(intervals, specialIntervals);
  }
  return intervals;
}

function isExceptionBlocked(data: DemoData, staffId: string, date: string, start: number, end: number) {
  return data.exceptions.some((item) => {
    if (item.type === 'special_hours' || !dateInRange(date, item.startDate, item.endDate)) return false;
    if (item.type === 'staff_vacation' && item.staffId !== staffId) return false;
    if (item.type === 'block' && item.staffId && item.staffId !== staffId) return false;
    if (!item.startTime || !item.endTime) return true;
    return overlaps(start, end, minutes(item.startTime), minutes(item.endTime));
  });
}

function isAppointmentBlocked(data: DemoData, staffId: string, date: string, start: number, end: number, excludeId?: string) {
  return data.appointments.some((appointment) => {
    if (appointment.id === excludeId || appointment.status === 'cancelled' || appointment.staffId !== staffId || appointment.date !== date) return false;
    const service = data.services.find((item) => item.id === appointment.serviceId);
    if (!service) return false;
    const appointmentStart = minutes(appointment.time);
    return overlaps(start, end, appointmentStart, appointmentStart + service.duration);
  });
}

export function getAvailableSlots(data: DemoData, serviceId: string, requestedStaffId: string, date: string, excludeId?: string) {
  const service = data.services.find((item) => item.id === serviceId && item.active);
  if (!service || !date) return [];
  const staff = data.staff.filter((member) =>
    member.active && member.serviceIds.includes(serviceId) && (requestedStaffId === 'any' || member.id === requestedStaffId),
  );
  const slots = new Map<string, string>();
  const now = Date.now();

  for (const member of staff) {
    for (const interval of candidateIntervals(data, member, date)) {
      const intervalStart = minutes(interval.start);
      const intervalEnd = minutes(interval.end);
      for (let start = intervalStart; start + service.duration <= intervalEnd; start += 30) {
        const time = timeFromMinutes(start);
        if (date === todayKey() && dateTimeValue(date, time) <= now + 15 * 60 * 1000) continue;
        if (isExceptionBlocked(data, member.id, date, start, start + service.duration)) continue;
        if (isAppointmentBlocked(data, member.id, date, start, start + service.duration, excludeId)) continue;
        if (!slots.has(time)) slots.set(time, member.id);
      }
    }
  }

  return [...slots.entries()]
    .map(([time, staffId]) => ({ time, staffId }))
    .sort((a, b) => a.time.localeCompare(b.time));
}

export function appointmentEnd(data: DemoData, serviceId: string, time: string) {
  const service = data.services.find((item) => item.id === serviceId);
  return timeFromMinutes(minutes(time) + (service?.duration ?? 30));
}
