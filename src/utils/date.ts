export const pad = (value: number) => String(value).padStart(2, '0');

export function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromDateKey(value: string, time = '12:00') {
  const [year, month, day] = value.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

export function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function formatDate(value: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('es-ES', options ?? {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(fromDateKey(value));
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' }).format(fromDateKey(value));
}

export function todayKey() {
  return toDateKey(new Date());
}

export const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function minutes(time: string) {
  const [hours, mins] = time.split(':').map(Number);
  return hours * 60 + mins;
}

export function timeFromMinutes(value: number) {
  return `${pad(Math.floor(value / 60))}:${pad(value % 60)}`;
}

export function dateTimeValue(date: string, time: string) {
  return fromDateKey(date, time).getTime();
}

export function nextOpenDay(schedule: Record<number, { open: boolean }>, offset = 0) {
  const base = addDays(new Date(), offset);
  for (let i = 0; i < 14; i += 1) {
    const candidate = addDays(base, i);
    if (schedule[candidate.getDay()]?.open) return toDateKey(candidate);
  }
  return toDateKey(base);
}

export function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
