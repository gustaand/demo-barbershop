import { useMemo, useState } from 'react';
import { Check, ExternalLink, Eye, EyeOff, LockKeyhole, LogOut, Monitor, Moon, RotateCcw, Scissors, Sparkles, Sun } from 'lucide-react';
import { applyPreset, initials, resolvePresentation } from '../../config';
import { ConfirmDialog, Field, useToast } from '../../components/UI';
import { HeroHeading } from '../../components/HeroHeading';
import { DemoProvider, useDemo } from '../../store/DemoContext';
import { usePanelTheme } from '../../store/PanelThemeContext';
import type { DemoId, LogoStyle, ThemeMode } from '../../types';

const AUTH_KEY = 'mw-demo-auth-admin';
const EMAIL = 'marquesworks.mw@gmail.com';
const PASSWORD = 'mw2026';

export function MWAdmin() {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem(AUTH_KEY) === 'true');
  const [selected, setSelected] = useState<DemoId>('barberia');

  if (!authenticated) {
    return <AdminLogin onLogin={() => { sessionStorage.setItem(AUTH_KEY, 'true'); setAuthenticated(true); }} />;
  }

  return (
    <main className="mw-admin">
      <AdminHeader onLogout={() => { sessionStorage.removeItem(AUTH_KEY); setAuthenticated(false); }} />
      <section className="mw-admin-body">
        <header className="admin-welcome">
          <div><span className="eyebrow">Herramienta comercial</span><h1>Prepara una demo en menos de un minuto</h1><p>Selecciona el sector, adapta la identidad y abre la presentación lista para el cliente.</p></div>
          <div className="admin-sector-selector" aria-label="Seleccionar demo">
            <button className={selected === 'barberia' ? 'active barber' : ''} type="button" onClick={() => setSelected('barberia')}><Scissors /><span><b>Barbería</b><small>MW BarberShop</small></span>{selected === 'barberia' && <Check />}</button>
            <button className={selected === 'belleza' ? 'active beauty' : ''} type="button" onClick={() => setSelected('belleza')}><Sparkles /><span><b>Belleza</b><small>MW Beauty Studio</small></span>{selected === 'belleza' && <Check />}</button>
          </div>
        </header>

        <DemoProvider key={selected} demoId={selected}>
          <DemoEditor />
        </DemoProvider>
      </section>
    </main>
  );
}

function AdminHeader({ onLogout }: { onLogout: () => void }) {
  const { theme, setTheme } = usePanelTheme();
  const themes: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Claro', icon: Sun },
    { value: 'dark', label: 'Oscuro', icon: Moon },
    { value: 'system', label: 'Sistema', icon: Monitor },
  ];
  return (
    <header className="mw-admin-header">
      <div className="panel-brand"><span><img src="/images/marques-works-logo-gold.png" alt="" /></span><div><strong>Marques Works</strong><small>MW Admin comercial</small></div></div>
      <div className="admin-header-actions">
        <div className="admin-theme-switch" aria-label="Tema del panel">{themes.map(({ value, label, icon: Icon }) => <button className={theme === value ? 'active' : ''} type="button" key={value} onClick={() => setTheme(value)} title={label}><Icon size={17} /><span>{label}</span></button>)}</div>
        <button className="icon-button" type="button" onClick={onLogout} title="Cerrar sesión"><LogOut size={18} /></button>
      </div>
    </header>
  );
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState(EMAIL);
  const [password, setPassword] = useState(PASSWORD);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (email.trim().toLowerCase() === EMAIL && password === PASSWORD) { setError(''); onLogin(); }
    else setError('Las credenciales no coinciden con las de la demo.');
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="login-brand"><span><img src="/images/marques-works-logo-gold.png" alt="" /></span><div><strong>Marques Works</strong><small>MW Admin comercial</small></div></div>
        <div className="login-heading"><span className="plan-pill managed">Uso interno</span><h1>Prepara la próxima demo</h1><p>Personaliza Barbería y Belleza sin tocar código.</p></div>
        <form onSubmit={submit}>
          <Field label="Email"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></Field>
          <label className="field"><span className="field-label">Contraseña</span><span className="input-with-icon"><LockKeyhole size={18} /><input type={visible ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /><button type="button" onClick={() => setVisible(!visible)} aria-label="Mostrar contraseña">{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>
          {error && <p className="inline-error">{error}</p>}
          <button className="button primary full" type="submit">Entrar en MW Admin</button>
        </form>
        <div className="demo-credentials"><strong>Credenciales de demostración</strong><p>{EMAIL}</p><p>{PASSWORD}</p></div>
      </section>
      <aside className="admin-login-visual"><span>Dos sectores.<br /><em>Una demo preparada.</em></span><p>Cambia el nombre, aplica un preset y entra con una presentación adaptada al negocio.</p></aside>
    </main>
  );
}

function DemoEditor() {
  const { demoId, config, data, appearance, updateData, updateAppearance, reset } = useDemo();
  const toast = useToast();
  const [confirmReset, setConfirmReset] = useState(false);
  const presentation = resolvePresentation(config, appearance);
  const { colorPack, fontPack, imagePack, heroVariant } = presentation;
  const base = `/demo/${demoId}`;

  const setBusiness = (field: keyof typeof data.business, value: string) => updateData((draft) => { draft.business[field] = value; });
  const applySelectedPreset = (presetId: string) => {
    const preset = config.presets.find((item) => item.id === presetId);
    if (!preset) return;
    updateAppearance((draft) => applyPreset(draft, preset));
    toast(`Preset ${preset.label} aplicado sólo a ${config.sectorLabel}`);
  };

  const previewStyle = useMemo(() => ({
    backgroundImage: `linear-gradient(90deg, ${colorPack.tokens.background}f2 3%, ${colorPack.tokens.background}77 58%, transparent), url(${imagePack.hero})`,
    backgroundColor: colorPack.tokens.background,
    color: colorPack.tokens.text,
    borderColor: colorPack.tokens.border,
    fontFamily: fontPack.body,
  }), [colorPack, fontPack, imagePack]);

  return (
    <div className="admin-editor">
      <div className={`editing-banner ${demoId}`}><span>Editando</span><strong>{config.sectorLabel}</strong><p>Todos los controles de esta pantalla afectan exclusivamente a esta demo.</p></div>

      <section className={`admin-preview-card admin-preview-layout-${heroVariant.layout}`} style={previewStyle}>
        <div className="admin-preview-copy"><span style={{ color: colorPack.tokens.accent }}>{presentation.heroEyebrow}</span><HeroHeading title={presentation.heroTitle} level={2} style={{ fontFamily: fontPack.heading }} /><p>{presentation.heroDescription}</p><div><b style={{ background: colorPack.tokens.primary }}>Reservar cita</b></div></div>
        <div className="admin-preview-meta"><span>{config.presets.find((item) => item.id === appearance.presetId)?.label}</span><span>{colorPack.label}</span><span>{fontPack.label}</span><span>{imagePack.label}</span></div>
      </section>

      <nav className="admin-preview-actions" aria-label="Abrir vistas">
        <a className="button primary" href={base} target="_blank" rel="noreferrer">Ver web <ExternalLink size={17} /></a>
        <a className="button subtle" href={`${base}/managed`} target="_blank" rel="noreferrer">Ver Managed <ExternalLink size={17} /></a>
        <a className="button subtle" href={`${base}/essential`} target="_blank" rel="noreferrer">Ver Essential <ExternalLink size={17} /></a>
      </nav>

      <section className="admin-card">
        <header><span>01</span><div><h2>Datos rápidos</h2><p>Los cambios se guardan al instante.</p></div></header>
        <div className="admin-fields-grid">
          <Field label="Nombre comercial"><input value={appearance.businessName} maxLength={48} onChange={(event) => updateAppearance((draft) => { draft.businessName = event.target.value; })} /></Field>
          <Field label="Descripción del hero"><input value={appearance.tagline} maxLength={140} onChange={(event) => updateAppearance((draft) => { draft.tagline = event.target.value; })} /></Field>
          <Field label="Teléfono"><input value={data.business.phone} onChange={(event) => setBusiness('phone', event.target.value)} /></Field>
          <Field label="WhatsApp"><input value={data.business.whatsapp} onChange={(event) => setBusiness('whatsapp', event.target.value)} /></Field>
          <Field label="Dirección"><input value={data.business.address} onChange={(event) => setBusiness('address', event.target.value)} /></Field>
          <Field label="Instagram"><input value={data.business.instagram} onChange={(event) => setBusiness('instagram', event.target.value)} /></Field>
        </div>
      </section>

      <section className="admin-card">
        <header><span>02</span><div><h2>Preset completo</h2><p>Aplica una dirección visual diseñada específicamente para {config.sectorLabel.toLowerCase()}.</p></div></header>
        <div className="preset-grid">{config.presets.map((preset) => {
          const pack = config.colorPacks.find((item) => item.id === preset.colorPackId)!;
          const selected = appearance.presetId === preset.id;
          return <button className={selected ? 'selected' : ''} type="button" key={preset.id} onClick={() => applySelectedPreset(preset.id)}><span className="preset-swatch" style={{ background: `linear-gradient(135deg, ${pack.tokens.background} 50%, ${pack.tokens.primary} 50%)` }} /> <strong>{preset.label}</strong><small>{preset.description}</small>{selected && <Check />}</button>;
        })}</div>
      </section>

      <section className="admin-card">
        <header><span>03</span><div><h2>Ajustes individuales</h2><p>Cambia color, tipografía o imágenes sin perder el resto del preset.</p></div></header>
        <div className="admin-choice-section"><h3>Pack de color</h3><div className="choice-grid colors">{config.colorPacks.map((pack) => <button className={appearance.colorPackId === pack.id ? 'selected' : ''} type="button" key={pack.id} onClick={() => updateAppearance((draft) => { draft.colorPackId = pack.id; })}><span><i style={{ background: pack.tokens.background }} /><i style={{ background: pack.tokens.primary }} /><i style={{ background: pack.tokens.accent }} /></span><b>{pack.label}</b><small>{pack.description}</small>{appearance.colorPackId === pack.id && <Check />}</button>)}</div></div>
        <div className="admin-choice-section"><h3>Pack de fuentes</h3><div className="choice-grid">{config.fontPacks.map((pack) => <button className={appearance.fontPackId === pack.id ? 'selected' : ''} type="button" key={pack.id} onClick={() => updateAppearance((draft) => { draft.fontPackId = pack.id; })}><span className="font-sample" style={{ fontFamily: pack.heading }}>Aa</span><b>{pack.label}</b><small>{pack.description}</small>{appearance.fontPackId === pack.id && <Check />}</button>)}</div></div>
        <div className="admin-choice-section"><h3>Pack de imágenes</h3><div className="choice-grid images">{config.imagePacks.map((pack) => <button className={appearance.imagePackId === pack.id ? 'selected' : ''} type="button" key={pack.id} onClick={() => updateAppearance((draft) => { draft.imagePackId = pack.id; })}><img src={pack.hero} alt="" /><b>{pack.label}</b><small>{pack.description}</small>{appearance.imagePackId === pack.id && <Check />}</button>)}</div></div>
      </section>

      <section className="admin-card compact-card">
        <header><span>04</span><div><h2>Estilo de logo</h2><p>Opciones seguras, sin subir archivos pesados.</p></div></header>
        <div className="logo-style-grid">{([
          ['text', 'Nombre textual'], ['monogram', `Monograma ${initials(appearance.businessName)}`], ['demo', 'Logo demo MW'],
        ] as [LogoStyle, string][]).map(([value, label]) => <button className={appearance.logoStyle === value ? 'selected' : ''} type="button" key={value} onClick={() => updateAppearance((draft) => { draft.logoStyle = value; })}><span>{value === 'text' ? appearance.businessName.slice(0, 12) : value === 'monogram' ? initials(appearance.businessName) : 'MW'}</span><b>{label}</b>{appearance.logoStyle === value && <Check />}</button>)}</div>
      </section>

      <section className="admin-card danger-admin-card">
        <div><h2>Restablecer {config.sectorLabel}</h2><p>Borra únicamente los cambios, citas y personalización de esta demo. La otra demo no se modifica.</p></div>
        <button className="button danger-ghost" type="button" onClick={() => setConfirmReset(true)}><RotateCcw size={17} /> Restablecer {config.sectorLabel}</button>
      </section>

      <ConfirmDialog open={confirmReset} title={`¿Restablecer ${config.sectorLabel}?`} message={`Se recuperarán los datos iniciales de ${config.sectorLabel}. La otra demo conservará exactamente su estado actual.`} confirmLabel={`Sí, restablecer ${config.sectorLabel}`} destructive onConfirm={() => { reset(); setConfirmReset(false); toast(`${config.sectorLabel} restablecida sin afectar al otro tenant`); }} onClose={() => setConfirmReset(false)} />
    </div>
  );
}
