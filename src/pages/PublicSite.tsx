import { useMemo, useState, type CSSProperties } from 'react';
import { CalendarDays, Camera, Check, ChevronRight, Clock3, Eye, Footprints, Hand, MapPin, Menu, MessageCircle, Phone, Scissors, Sparkles, Star, X } from 'lucide-react';
import { useDemo } from '../store/DemoContext';
import { Modal, useToast } from '../components/UI';
import { getAvailableSlots } from '../utils/availability';
import { addDays, DAY_NAMES, formatDate, todayKey, toDateKey, uid } from '../utils/date';
import { downloadAppointmentIcs } from '../utils/ics';
import { initials, resolvePresentation } from '../config';
import { HeroHeading } from '../components/HeroHeading';
import type { Appointment, ImagePack } from '../types';
import { whatsappConversationUrl } from '../utils/phone';

const barberIcons = [Scissors, Sparkles, Star, Scissors, Sparkles];
const beautyIcons = { 'brow-design': Sparkles, 'lash-lift': Eye, manicure: Hand, pedicure: Footprints, 'brow-wax': Sparkles } as const;
const radiusValues = { none: '0px', subtle: '8px', soft: '18px', rounded: '28px' } as const;
const shadowValues = { none: 'none', subtle: '0 16px 42px rgba(32,24,18,.08)', elevated: '0 22px 60px rgba(32,24,18,.16)' } as const;

function imageAt(images: string[], slot: number) {
  return images[slot % images.length] ?? images[0];
}

function BusinessLogo({ compact = false }: { compact?: boolean }) {
  const { config, appearance } = useDemo();
  const businessName = resolvePresentation(config, appearance).heroTitle;
  if (appearance.logoStyle === 'text') return <span className="business-wordmark">{businessName}</span>;
  return <><span className={`business-monogram ${compact ? 'compact' : ''}`}>{appearance.logoStyle === 'monogram' ? initials(businessName) : 'MW'}</span><span className="business-wordmark">{businessName}</span></>;
}

export function PublicSite() {
  const { demoId, config, data, appearance } = useDemo();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const services = data.services.filter((item) => item.active);
  const gallery = data.gallery.filter((item) => item.active).sort((a, b) => a.order - b.order);
  const presentation = resolvePresentation(config, appearance);
  const { colorPack: colors, fontPack: fonts, imagePack: images, heroVariant: hero, visual } = presentation;
  const businessWhatsappUrl = whatsappConversationUrl(data.business.whatsapp);

  const style = {
    '--public-primary': colors.tokens.primary,
    '--public-primary-hover': colors.tokens.primaryHover,
    '--public-secondary': colors.tokens.secondary,
    '--public-accent': colors.tokens.accent,
    '--public-bg': colors.tokens.background,
    '--public-surface': colors.tokens.surface,
    '--public-surface-alt': colors.tokens.surfaceAlt,
    '--public-text': colors.tokens.text,
    '--public-muted': colors.tokens.muted,
    '--public-line': colors.tokens.border,
    '--public-success': colors.tokens.success,
    '--public-danger': colors.tokens.danger,
    '--public-heading-font': fonts.heading,
    '--public-body-font': fonts.body,
    '--public-radius': radiusValues[visual.radius],
    '--public-shadow': shadowValues[visual.shadow],
    '--public-backdrop': `url(${images.backdrop})`,
  } as CSSProperties;

  const goTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const nav = demoId === 'barberia'
    ? [['Servicios', 'servicios'], ['Equipo', 'equipo'], ['Galería', 'galeria'], ['Ubicación', 'ubicacion']]
    : [['Tratamientos', 'servicios'], ['Profesionales', 'equipo'], ['El estudio', 'galeria'], ['Contacto', 'ubicacion']];

  return (
    <main className={`public-site sector-${demoId} preset-${appearance.presetId} layout-${hero.layout} spacing-${visual.spacing} buttons-${visual.buttons} cards-${visual.cards} images-${visual.imageTreatment} services-${visual.serviceLayout} staff-${visual.staffLayout} gallery-layout-${visual.galleryLayout}`} style={style}>
      <header className="public-header">
        <a className="brand" href="#inicio" onClick={() => goTo('inicio')}><BusinessLogo compact /></a>
        <nav className="desktop-public-nav" aria-label="Navegación principal">
          {nav.map(([label, id]) => <button type="button" key={id} onClick={() => goTo(id)}>{label}</button>)}
          <button className="button public-primary small" type="button" onClick={() => setBookingOpen(true)}>Reservar cita</button>
        </nav>
        <button className="public-menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      {menuOpen && <div className="mobile-public-menu">{nav.map(([label, id]) => <button type="button" key={id} onClick={() => goTo(id)}>{label}<ChevronRight size={18} /></button>)}<button className="button public-primary" type="button" onClick={() => { setMenuOpen(false); setBookingOpen(true); }}>Reservar cita</button></div>}

      <section className="public-hero" id="inicio">
        <div className="hero-art" aria-hidden="true"><img src={images.hero} alt="" /><div className="hero-art-label"><span>{demoId === 'barberia' ? 'Desde 2018' : 'Cuidado experto'}</span><strong>Barcelona</strong></div></div>
        <div className="hero-copy">
          <span className="public-kicker">{presentation.heroEyebrow}</span>
          <HeroHeading title={presentation.heroTitle} />
          <p>{presentation.heroDescription}</p>
          <div className="hero-actions">
            <button className="button public-primary large" type="button" onClick={() => setBookingOpen(true)}><CalendarDays size={19} /> Reservar cita</button>
            {businessWhatsappUrl && <a className="button public-secondary large" href={businessWhatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={19} /> WhatsApp</a>}
          </div>
          <div className="hero-trust"><span><Check size={16} /> Sin registro</span><span><Check size={16} /> Confirmación inmediata</span></div>
        </div>
      </section>

      {demoId === 'belleza' && <section className="beauty-values"><p><span>01</span>Atención personalizada</p><p><span>02</span>Resultados naturales</p><p><span>03</span>Tu tiempo, sin esperas</p></section>}

      <section className="public-section services-section" id="servicios">
        <div className="section-heading"><div><span className="public-kicker">{config.servicesEyebrow}</span><h2>{config.servicesTitle}</h2></div><p>{config.servicesText}</p></div>
        <div className="service-grid">
          {services.map((service, index) => {
            const Icon = demoId === 'belleza' ? beautyIcons[service.id as keyof typeof beautyIcons] ?? Sparkles : barberIcons[index % barberIcons.length];
            return <article className="public-service-card" key={service.id}><div className="service-photo"><img src={imageAt(images.services, service.imageSlot)} alt="" /><span className="service-icon"><Icon size={22} /></span></div><div className="service-copy"><span className="service-number">0{index + 1}</span><h3>{service.name}</h3><p>{service.description}</p></div><footer><span><Clock3 size={15} /> {service.duration} min</span><strong>{service.price.toFixed(0)} €</strong></footer></article>;
          })}
        </div>
      </section>

      <section className="public-section team-section" id="equipo" style={{ backgroundImage: `linear-gradient(var(--team-overlay), var(--team-overlay)), url(${images.backdrop})` }}>
        <div className="section-heading"><div><span className="public-kicker">{config.teamEyebrow}</span><h2>{config.teamHeading}</h2></div><p>{config.teamText}</p></div>
        <div className="team-grid">{data.staff.filter((item) => item.active).map((member) => <article className="team-card" key={member.id}><img src={member.avatar} alt={`Retrato de ${member.name}`} /><div><span>{member.role}</span><h3>{member.name}</h3><p>{member.bio}</p></div></article>)}</div>
      </section>

      <section className="public-section gallery-section" id="galeria">
        <div className="section-heading compact"><div><span className="public-kicker">{config.galleryEyebrow}</span><h2>{config.galleryHeading}</h2></div></div>
        <div className="gallery-grid">{gallery.map((item) => <figure key={item.id}><img src={imageAt(images.gallery, item.imageSlot)} alt={item.title} /><figcaption>{item.title}</figcaption></figure>)}</div>
      </section>

      <section className="visit-section" id="ubicacion" style={{ backgroundImage: `linear-gradient(90deg, color-mix(in srgb, var(--public-bg) 96%, transparent), color-mix(in srgb, var(--public-bg) 70%, transparent)), url(${images.backdrop})` }}>
        <div className="visit-card"><span className="public-kicker">Ven a vernos</span><h2>{config.visitHeading}</h2><p className="visit-description">{data.business.description}</p><div className="visit-details"><p><MapPin size={19} /><span>{data.business.address}</span></p><p><Phone size={19} /><span>{data.business.phone}</span></p><p><Camera size={19} /><span>{data.business.instagram}</span></p></div><button className="button public-primary large" type="button" onClick={() => setBookingOpen(true)}>Reservar ahora</button></div>
        <div className="hours-card"><span>Horario habitual</span>{[1, 2, 3, 4, 5, 6, 0].map((day) => { const schedule = data.openingHours[day]; return <p key={day}><strong>{DAY_NAMES[day]}</strong><b>{schedule.open ? schedule.intervals.map((interval) => `${interval.start}–${interval.end}`).join(' · ') : 'Cerrado'}</b></p>; })}</div>
      </section>

      <footer className="public-footer"><div className="brand"><BusinessLogo compact /></div><p>Demo creada por Marques Works · Reservas sencillas para negocios reales.</p></footer>
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} images={images} />
    </main>
  );
}

function BookingModal({ open, onClose, images }: { open: boolean; onClose: () => void; images: ImagePack }) {
  const { config, data, appearance, update } = useDemo();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState('');
  const [staffId, setStaffId] = useState('any');
  const [date, setDate] = useState(todayKey());
  const [time, setTime] = useState('');
  const [slotStaffId, setSlotStaffId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmed, setConfirmed] = useState<Appointment | null>(null);
  const [error, setError] = useState('');

  const service = data.services.find((item) => item.id === serviceId);
  const eligibleStaff = data.staff.filter((member) => member.active && member.serviceIds.includes(serviceId));
  const slots = useMemo(() => getAvailableSlots(data, serviceId, staffId, date), [data, serviceId, staffId, date]);
  const maxDate = toDateKey(addDays(new Date(), 60));

  const close = () => {
    onClose();
    window.setTimeout(() => { setStep(1); setServiceId(''); setStaffId('any'); setTime(''); setSlotStaffId(''); setName(''); setPhone(''); setConfirmed(null); setError(''); }, 250);
  };
  const chooseService = (id: string) => { setServiceId(id); setStaffId('any'); setTime(''); setSlotStaffId(''); setStep(2); };
  const chooseStaff = (id: string) => { setStaffId(id); setTime(''); setSlotStaffId(''); setStep(3); };
  const chooseSlot = (slot: { time: string; staffId: string }) => { setTime(slot.time); setSlotStaffId(slot.staffId); };

  const submit = () => {
    if (!serviceId || !date || !time || !slotStaffId || !name.trim() || !phone.trim()) { setError('Completa tu nombre y teléfono para confirmar la reserva.'); return; }
    if (phone.replace(/\D/g, '').length < 9) { setError('Introduce un teléfono válido.'); return; }
    const stillAvailable = getAvailableSlots(data, serviceId, staffId, date).some((slot) => slot.time === time && slot.staffId === slotStaffId);
    if (!stillAvailable) { setError('Ese horario acaba de dejar de estar disponible. Elige otro.'); setStep(3); return; }
    const appointment: Appointment = { id: uid('apt'), serviceId, staffId: slotStaffId, date, time, customerName: name.trim(), phone: phone.trim(), status: 'pending', source: 'web', createdAt: new Date().toISOString() };
    update((draft) => { draft.appointments.push(appointment); });
    setConfirmed(appointment); setError(''); toast(`Reserva creada y enviada al ${config.labels.businessType}`);
  };

  return (
    <Modal open={open} title={confirmed ? 'Reserva confirmada' : 'Nueva reserva'} eyebrow={appearance.businessName} onClose={close} wide fullScreen>
      {confirmed ? <div className="booking-confirmation"><div className="confirmation-mark"><Check size={30} /></div><div><span className="public-kicker">Todo listo</span><h3>¡Nos vemos pronto, {confirmed.customerName.split(' ')[0]}!</h3><p>Tu solicitud ha quedado guardada correctamente.</p></div><div className="confirmation-details"><p><span>Servicio</span><strong>{data.services.find((item) => item.id === confirmed.serviceId)?.name}</strong></p><p><span>Profesional</span><strong>{data.staff.find((item) => item.id === confirmed.staffId)?.name}</strong></p><p><span>Fecha</span><strong>{formatDate(confirmed.date)}</strong></p><p><span>Hora</span><strong>{confirmed.time}</strong></p><p><span>Duración</span><strong>{service?.duration} min</strong></p><p><span>Precio</span><strong>{service?.price.toFixed(0)} €</strong></p><p><span>Nombre</span><strong>{confirmed.customerName}</strong></p></div><button className="button primary full" type="button" onClick={() => downloadAppointmentIcs(data, confirmed, appearance.businessName)}><CalendarDays size={18} /> Añadir al calendario</button><button className="button ghost full" type="button" onClick={close}>Cerrar</button></div> :
        <div className="booking-layout"><div className="booking-progress" aria-label={`Paso ${step} de 4`}>{[1, 2, 3, 4].map((item) => <span key={item} className={step >= item ? 'active' : ''}><b>{item}</b></span>)}</div>
          {step === 1 && <div className="booking-step"><div className="step-title"><span>Paso 1 de 4</span><h3>¿Qué necesitas?</h3><p>Elige un servicio para ver la disponibilidad.</p></div><div className="booking-options">{data.services.filter((item) => item.active).map((item) => <button className="booking-option" type="button" key={item.id} onClick={() => chooseService(item.id)}><img src={imageAt(images.services, item.imageSlot)} alt="" /><span><strong>{item.name}</strong><small>{item.duration} min · {item.description}</small></span><b>{item.price.toFixed(0)} €</b><ChevronRight size={19} /></button>)}</div></div>}
          {step === 2 && <div className="booking-step"><button className="text-button" type="button" onClick={() => setStep(1)}>← Cambiar servicio</button><div className="step-title"><span>Paso 2 de 4</span><h3>Elige {config.labels.singular.toLowerCase()}</h3><p>Puedes dejarnos buscar el primer hueco disponible.</p></div><div className="staff-options"><button className="staff-choice any" type="button" onClick={() => chooseStaff('any')}><span className="any-avatar"><Sparkles /></span><span><strong>Cualquiera</strong><small>Primera disponibilidad</small></span><ChevronRight /></button>{eligibleStaff.map((member) => <button className="staff-choice" type="button" key={member.id} onClick={() => chooseStaff(member.id)}><img src={member.avatar} alt="" /><span><strong>{member.name}</strong><small>{member.role}</small></span><ChevronRight /></button>)}</div></div>}
          {step === 3 && <div className="booking-step"><button className="text-button" type="button" onClick={() => setStep(2)}>← Cambiar profesional</button><div className="step-title"><span>Paso 3 de 4</span><h3>Fecha y hora</h3><p>Solo mostramos horas realmente disponibles.</p></div><label className="date-control"><CalendarDays size={19} /><span><small>Fecha</small><input type="date" min={todayKey()} max={maxDate} value={date} onChange={(event) => { setDate(event.target.value); setTime(''); setSlotStaffId(''); }} /></span></label><p className="selected-day">{formatDate(date)}</p>{slots.length ? <div className="slot-grid">{slots.map((slot) => <button className={time === slot.time && slotStaffId === slot.staffId ? 'selected' : ''} type="button" key={`${slot.time}-${slot.staffId}`} onClick={() => chooseSlot(slot)}>{slot.time}</button>)}</div> : <div className="no-slots"><Clock3 /><strong>No quedan huecos ese día</strong><span>Prueba con otra fecha o profesional.</span></div>}<button className="button primary full" type="button" disabled={!time} onClick={() => setStep(4)}>Continuar</button></div>}
          {step === 4 && <div className="booking-step"><button className="text-button" type="button" onClick={() => setStep(3)}>← Cambiar horario</button><div className="step-title"><span>Paso 4 de 4</span><h3>Tus datos</h3><p>Sin registro. Solo necesitamos poder identificar tu cita.</p></div><div className="booking-summary"><span>{service?.name}</span><strong>{formatDate(date)} · {time}</strong><small>Con {data.staff.find((member) => member.id === slotStaffId)?.name} · {service?.price.toFixed(0)} €</small></div><label className="field"><span className="field-label">Nombre *</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Tu nombre" autoComplete="name" /></label><label className="field"><span className="field-label">Teléfono / WhatsApp *</span><input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="600 000 000" inputMode="tel" autoComplete="tel" /></label>{error && <p className="inline-error">{error}</p>}<button className="button primary full" type="button" onClick={submit}>Confirmar reserva</button><p className="privacy-note">Al confirmar, la reserva se guarda únicamente en esta demo local.</p></div>}
        </div>}
    </Modal>
  );
}
