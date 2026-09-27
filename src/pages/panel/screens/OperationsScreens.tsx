import { useMemo, useState } from 'react';
import { CalendarDays, Check, ChevronLeft, ChevronRight, CircleAlert, Phone, Plus } from 'lucide-react';
import { EmptyState, Field, Form, Modal, StatusBadge, useToast } from '../../../components/UI';
import { useDemo } from '../../../store/DemoContext';
import type { Appointment, AppointmentStatus, Plan } from '../../../types';
import { appointmentEnd, getAvailableSlots } from '../../../utils/availability';
import { addDays, formatDate, formatShortDate, fromDateKey, todayKey, toDateKey, uid } from '../../../utils/date';
import type { PanelScreen } from '../panelTypes';

function appointmentInfo(data: ReturnType<typeof useDemo>['data'], appointment: Appointment) {
  return {
    service: data.services.find((item) => item.id === appointment.serviceId),
    staff: data.staff.find((item) => item.id === appointment.staffId),
  };
}

function AppointmentRow({ appointment, onOpen }: { appointment: Appointment; onOpen: () => void }) {
  const { data } = useDemo();
  const { service, staff } = appointmentInfo(data, appointment);
  return (
    <button className="appointment-row" type="button" onClick={onOpen}>
      <span className="appointment-time">{appointment.time}<small>{appointmentEnd(data, appointment.serviceId, appointment.time)}</small></span>
      <span className="appointment-person"><strong>{appointment.customerName}</strong><small>{service?.name} · {staff?.name}</small></span>
      <StatusBadge status={appointment.status} />
      <ChevronRight className="row-chevron" size={18} />
    </button>
  );
}

export function DashboardScreen({ plan, goTo }: { plan: Plan; goTo: (screen: PanelScreen) => void }) {
  const { data, update } = useDemo();
  const toast = useToast();
  const [manualOpen, setManualOpen] = useState(false);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const today = todayKey();
  const active = data.appointments.filter((item) => item.status !== 'cancelled');
  const todayAppointments = active.filter((item) => item.date === today).sort((a, b) => a.time.localeCompare(b.time));
  const pending = todayAppointments.filter((item) => item.status === 'pending');
  const confirmed = todayAppointments.filter((item) => item.status === 'confirmed');
  const completed = todayAppointments.filter((item) => item.status === 'completed');
  const weekEnd = toDateKey(addDays(new Date(), 7));
  const weekCount = active.filter((item) => item.date >= today && item.date <= weekEnd).length;
  const upcomingCount = active.filter((item) => item.date > today).length;
  const next = active.filter((item) => item.date >= today && !['completed', 'no_show'].includes(item.status)).sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))[0] ?? todayAppointments[0];
  const upcomingException = data.exceptions.filter((item) => item.endDate >= today).sort((a, b) => a.startDate.localeCompare(b.startDate))[0];

  const setStatus = (id: string, status: AppointmentStatus) => {
    update((draft) => { const item = draft.appointments.find((appointment) => appointment.id === id); if (item) item.status = status; });
    setSelected((current) => current ? { ...current, status } : current);
    toast(status === 'cancelled' ? 'Cita cancelada; el horario vuelve a estar disponible' : 'Estado de la reserva actualizado');
  };

  return (
    <div className="screen-stack">
      <section className="today-overview">
        <div><span>{new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}</span><h2>Buenos días</h2><p>{plan === 'managed' ? 'Este es el resumen de las citas de hoy.' : 'Tus citas de hoy, claras y siempre a mano.'}</p></div>
        <div className="today-overview-actions"><strong><b>{todayAppointments.length}</b> citas hoy</strong><button className="button primary" type="button" onClick={() => setManualOpen(true)}><Plus size={18} /> Nueva reserva</button></div>
      </section>
      <div className="today-layout">
        <section className="panel-card today-appointments">
          <header className="card-header"><div><h3>Citas de hoy</h3><p>{formatDate(today)}</p></div><button className="text-button" type="button" onClick={() => goTo('agenda')}>Abrir agenda</button></header>
          <div className="appointment-list">{todayAppointments.length ? todayAppointments.map((appointment) => <AppointmentRow key={appointment.id} appointment={appointment} onOpen={() => setSelected(appointment)} />) : <EmptyState icon={<CalendarDays />} title="Agenda despejada" text="No hay citas para hoy." action={<button className="button primary" type="button" onClick={() => setManualOpen(true)}>Crear reserva</button>} />}</div>
        </section>
        <aside className="today-side">
          <section className="panel-card day-summary"><header><h3>Resumen del día</h3><span>{weekCount} esta semana</span></header><div><p><strong>{confirmed.length}</strong><span>Confirmadas</span></p><p><strong>{pending.length}</strong><span>Pendientes</span></p><p><strong>{completed.length}</strong><span>Completadas</span></p><p><strong>{upcomingCount}</strong><span>Próximas</span></p></div></section>
          {next && <button className="next-appointment" type="button" onClick={() => setSelected(next)}><span>Próxima cita</span><strong>{next.time}</strong><p>{next.customerName}</p><small>{next.date === today ? appointmentInfo(data, next).service?.name : `${formatShortDate(next.date)} · ${appointmentInfo(data, next).service?.name}`}</small><ChevronRight /></button>}
          {pending.length > 0 && <button className="alert-card attention" type="button" onClick={() => setSelected(pending[0])}><span><CircleAlert /></span><div><strong>{pending.length} {pending.length === 1 ? 'cita pendiente' : 'citas pendientes'}</strong><p>Revisa y confirma las solicitudes del día.</p></div><ChevronRight /></button>}
          {upcomingException && <button className="alert-card" type="button" onClick={() => goTo('exceptions')}><span><CalendarDays /></span><div><strong>{upcomingException.reason}</strong><p>{formatShortDate(upcomingException.startDate)}{upcomingException.endDate !== upcomingException.startDate ? ` – ${formatShortDate(upcomingException.endDate)}` : ''}</p></div><ChevronRight /></button>}
        </aside>
      </div>
      <ManualAppointmentModal open={manualOpen} onClose={() => setManualOpen(false)} />
      <Modal open={Boolean(selected)} title="Detalle de la reserva" onClose={() => setSelected(null)}>{selected && <AppointmentDetail appointment={selected} onStatus={setStatus} />}</Modal>
    </div>
  );
}

export function AgendaScreen(props: { plan: Plan }) {
  void props.plan;
  const { data, update } = useDemo();
  const toast = useToast();
  const [date, setDate] = useState(todayKey());
  const [view, setView] = useState<'day' | 'week'>('day');
  const [manualOpen, setManualOpen] = useState(false);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const dayAppointments = data.appointments.filter((item) => item.status !== 'cancelled' && item.date === date).sort((a, b) => a.time.localeCompare(b.time));
  const weekDates = Array.from({ length: 7 }, (_, index) => toDateKey(addDays(fromDateKey(date), index)));

  const setStatus = (id: string, status: AppointmentStatus) => {
    update((draft) => { const item = draft.appointments.find((appointment) => appointment.id === id); if (item) item.status = status; });
    setSelected((current) => current ? { ...current, status } : current);
    toast(status === 'cancelled' ? 'Cita cancelada; el horario vuelve a estar disponible' : 'Estado de la reserva actualizado');
  };

  return (
    <div className="screen-stack">
      <section className="screen-intro"><div><h2>Agenda y reservas</h2><p>Consulta todas las citas y crea una nueva sin salir de la agenda.</p></div><div className="agenda-intro-actions"><div className="segmented"><button type="button" className={view === 'day' ? 'active' : ''} onClick={() => setView('day')}>Día</button><button type="button" className={view === 'week' ? 'active' : ''} onClick={() => setView('week')}>Semana</button></div><button className="button primary" type="button" onClick={() => setManualOpen(true)}><Plus size={18} /> Nueva reserva</button></div></section>
      <section className="panel-card agenda-card">
        <header className="agenda-toolbar"><button className="icon-button" type="button" onClick={() => setDate(toDateKey(addDays(fromDateKey(date), view === 'day' ? -1 : -7)))}><ChevronLeft /></button><button className="date-heading" type="button" onClick={() => setDate(todayKey())}><strong>{view === 'day' ? formatDate(date) : `Semana del ${formatShortDate(date)}`}</strong><span>{date === todayKey() ? 'Hoy' : 'Volver a hoy'}</span></button><button className="icon-button" type="button" onClick={() => setDate(toDateKey(addDays(fromDateKey(date), view === 'day' ? 1 : 7)))}><ChevronRight /></button></header>
        {view === 'day' ? (
          <div className="timeline">
            {dayAppointments.length ? dayAppointments.map((appointment) => { const { service, staff } = appointmentInfo(data, appointment); return <button className="timeline-item" type="button" key={appointment.id} onClick={() => setSelected(appointment)}><time>{appointment.time}</time><span className="timeline-line" /><span className="timeline-copy"><strong>{appointment.customerName}</strong><span>{service?.name} · {staff?.name}</span><small>{appointment.time}–{appointmentEnd(data, appointment.serviceId, appointment.time)}</small></span><StatusBadge status={appointment.status} /></button>; }) : <EmptyState icon={<CalendarDays />} title="Sin citas este día" text="La agenda está libre. Puedes crear una reserva aquí mismo." action={<button className="button primary" type="button" onClick={() => setManualOpen(true)}>Crear reserva</button>} />}
          </div>
        ) : (
          <div className="week-grid">{weekDates.map((day) => { const appointments = data.appointments.filter((item) => item.status !== 'cancelled' && item.date === day).sort((a, b) => a.time.localeCompare(b.time)); return <article className={day === todayKey() ? 'today' : ''} key={day}><header><span>{new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(fromDateKey(day))}</span><strong>{fromDateKey(day).getDate()}</strong></header><div>{appointments.map((appointment) => <button className="week-appointment" type="button" key={appointment.id} onClick={() => setSelected(appointment)}><b>{appointment.time}</b>{appointment.customerName}</button>)}{!appointments.length && <small>Sin citas</small>}</div></article>; })}</div>
        )}
      </section>
      <ManualAppointmentModal open={manualOpen} onClose={() => setManualOpen(false)} />
      <Modal open={Boolean(selected)} title="Detalle de la reserva" onClose={() => setSelected(null)}>{selected && <AppointmentDetail appointment={selected} onStatus={setStatus} />}</Modal>
    </div>
  );
}

export function AppointmentsScreen(props: { plan: Plan }) {
  void props.plan;
  const { data, update } = useDemo();
  const toast = useToast();
  const [filter, setFilter] = useState<'today' | 'upcoming' | 'all'>('today');
  const [manualOpen, setManualOpen] = useState(false);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const today = todayKey();
  const appointments = data.appointments
    .filter((item) => filter === 'all' || (filter === 'today' ? item.date === today : item.date >= today && item.status !== 'cancelled'))
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  const setStatus = (id: string, status: AppointmentStatus) => {
    update((draft) => { const item = draft.appointments.find((appointment) => appointment.id === id); if (item) item.status = status; });
    setSelected((current) => current ? { ...current, status } : current);
    toast(status === 'cancelled' ? 'Cita cancelada; el horario vuelve a estar disponible' : 'Estado de la reserva actualizado');
  };

  return (
    <div className="screen-stack">
      <section className="screen-intro"><div><h2>Reservas</h2><p>Gestiona solicitudes web, llamadas y citas presenciales.</p></div><button className="button primary" type="button" onClick={() => setManualOpen(true)}><Plus size={18} /> Reserva manual</button></section>
      <section className="panel-card">
        <div className="list-toolbar"><div className="segmented"><button type="button" className={filter === 'today' ? 'active' : ''} onClick={() => setFilter('today')}>Hoy</button><button type="button" className={filter === 'upcoming' ? 'active' : ''} onClick={() => setFilter('upcoming')}>Próximas</button><button type="button" className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Todas</button></div><span>{appointments.length} resultados</span></div>
        <div className="appointment-list grouped">{appointments.length ? appointments.map((appointment, index) => <div key={appointment.id}>{(index === 0 || appointments[index - 1].date !== appointment.date) && <h4 className="date-separator">{formatDate(appointment.date)}</h4>}<AppointmentRow appointment={appointment} onOpen={() => setSelected(appointment)} /></div>) : <EmptyState icon={<CalendarDays />} title="No hay reservas" text="Cambia el filtro o crea una reserva manual." action={<button className="button primary" type="button" onClick={() => setManualOpen(true)}>Crear reserva</button>} />}</div>
      </section>
      <ManualAppointmentModal open={manualOpen} onClose={() => setManualOpen(false)} />
      <Modal open={Boolean(selected)} title="Detalle de la reserva" onClose={() => setSelected(null)}>
        {selected && <AppointmentDetail appointment={selected} onStatus={setStatus} />}
      </Modal>
    </div>
  );
}

function AppointmentDetail({ appointment, onStatus }: { appointment: Appointment; onStatus: (id: string, status: AppointmentStatus) => void }) {
  const { data } = useDemo();
  const { service, staff } = appointmentInfo(data, appointment);
  return <div className="detail-stack"><div className="detail-hero"><span className="detail-avatar">{appointment.customerName.slice(0, 1)}</span><div><h3>{appointment.customerName}</h3><p><Phone size={15} /> {appointment.phone}</p></div><StatusBadge status={appointment.status} /></div><div className="detail-grid"><p><span>Fecha</span><strong>{formatDate(appointment.date)}</strong></p><p><span>Hora</span><strong>{appointment.time}–{appointmentEnd(data, appointment.serviceId, appointment.time)}</strong></p><p><span>Servicio</span><strong>{service?.name}</strong></p><p><span>Profesional</span><strong>{staff?.name}</strong></p><p><span>Precio</span><strong>{service?.price.toFixed(2)} €</strong></p><p><span>Origen</span><strong>{appointment.source === 'web' ? 'Web' : appointment.source === 'phone' ? 'Teléfono' : appointment.source === 'whatsapp' ? 'WhatsApp' : 'Presencial'}</strong></p></div><div className="status-actions">{appointment.status === 'pending' && <button className="button success" type="button" onClick={() => onStatus(appointment.id, 'confirmed')}><Check size={18} /> Confirmar</button>}{!['completed', 'cancelled'].includes(appointment.status) && <button className="button subtle" type="button" onClick={() => onStatus(appointment.id, 'completed')}>Marcar completada</button>}{!['no_show', 'completed', 'cancelled'].includes(appointment.status) && <button className="button subtle" type="button" onClick={() => onStatus(appointment.id, 'no_show')}>No-show</button>}{appointment.status !== 'cancelled' && <button className="button danger-ghost" type="button" onClick={() => onStatus(appointment.id, 'cancelled')}>Cancelar cita</button>}</div></div>;
}

function ManualAppointmentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data, update } = useDemo();
  const toast = useToast();
  const [serviceId, setServiceId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [date, setDate] = useState(todayKey());
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState<Appointment['source']>('phone');
  const [error, setError] = useState('');
  const slots = useMemo(() => serviceId && staffId ? getAvailableSlots(data, serviceId, staffId, date) : [], [data, serviceId, staffId, date]);
  const availableStaff = data.staff.filter((member) => member.active && member.serviceIds.includes(serviceId));

  const save = () => {
    if (!serviceId || !staffId || !date || !time || !name.trim() || !phone.trim()) { setError('Completa todos los campos obligatorios.'); return; }
    if (!getAvailableSlots(data, serviceId, staffId, date).some((slot) => slot.time === time)) { setError('Ese horario ya no está disponible.'); return; }
    update((draft) => draft.appointments.push({ id: uid('apt'), serviceId, staffId, date, time, customerName: name.trim(), phone: phone.trim(), status: 'confirmed', source, createdAt: new Date().toISOString() }));
    toast('Reserva manual creada; el hueco ya no está disponible en la web');
    onClose(); setServiceId(''); setStaffId(''); setTime(''); setName(''); setPhone(''); setError('');
  };

  return <Modal open={open} title="Nueva reserva manual" onClose={onClose} wide><Form onSubmit={save} className="form-grid"><Field label="Servicio *"><select value={serviceId} onChange={(event) => { setServiceId(event.target.value); setStaffId(''); setTime(''); }}><option value="">Selecciona un servicio</option>{data.services.filter((item) => item.active).map((item) => <option key={item.id} value={item.id}>{item.name} · {item.duration} min</option>)}</select></Field><Field label="Profesional *"><select value={staffId} disabled={!serviceId} onChange={(event) => { setStaffId(event.target.value); setTime(''); }}><option value="">Selecciona profesional</option>{availableStaff.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field><Field label="Fecha *"><input type="date" min={todayKey()} value={date} onChange={(event) => { setDate(event.target.value); setTime(''); }} /></Field><Field label="Hora *"><select value={time} disabled={!staffId} onChange={(event) => setTime(event.target.value)}><option value="">{staffId ? 'Selecciona un hueco' : 'Elige profesional primero'}</option>{slots.map((slot) => <option key={slot.time} value={slot.time}>{slot.time}</option>)}</select></Field><Field label="Cliente *"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre y apellidos" /></Field><Field label="Teléfono *"><input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" placeholder="600 000 000" /></Field><Field label="Origen"><select value={source} onChange={(event) => setSource(event.target.value as Appointment['source'])}><option value="phone">Teléfono</option><option value="whatsapp">WhatsApp</option><option value="walk_in">Presencial</option><option value="web">Web</option></select></Field>{error && <p className="inline-error form-span">{error}</p>}<div className="form-actions form-span"><button className="button ghost" type="button" onClick={onClose}>Cancelar</button><button className="button primary" type="submit">Crear reserva</button></div></Form></Modal>;
}
