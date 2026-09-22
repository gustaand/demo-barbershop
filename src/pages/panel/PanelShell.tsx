import { useState, type ReactNode } from 'react';
import { CalendarRange, ChevronRight, Clock3, GalleryHorizontal, Home, LogOut, Menu, MessageSquareText, Scissors, Settings, Store, Users, X } from 'lucide-react';
import type { Plan } from '../../types';
import type { PanelScreen } from './panelTypes';
import { screenTitles } from './panelTypes';

const mainItems: { screen: PanelScreen; label: string; icon: typeof Home }[] = [
  { screen: 'dashboard', label: 'Hoy', icon: Home },
  { screen: 'agenda', label: 'Agenda', icon: CalendarRange },
  { screen: 'hours', label: 'Horarios', icon: Clock3 },
  { screen: 'services', label: 'Servicios', icon: Scissors },
];

const moreItems: { screen: PanelScreen; label: string; icon: typeof Home }[] = [
  { screen: 'team', label: 'Equipo', icon: Users },
  { screen: 'exceptions', label: 'Vacaciones y cierres', icon: CalendarRange },
  { screen: 'gallery', label: 'Galería', icon: GalleryHorizontal },
  { screen: 'business', label: 'Datos del negocio', icon: Store },
  { screen: 'requests', label: 'Solicitudes', icon: MessageSquareText },
  { screen: 'settings', label: 'Configuración', icon: Settings },
];

export function PanelShell({ plan, screen, onScreen, onLogout, children }: {
  plan: Plan;
  screen: PanelScreen;
  onScreen: (screen: PanelScreen) => void;
  onLogout: () => void;
  children: ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const select = (next: PanelScreen) => { onScreen(next); setDrawerOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const NavButton = ({ item }: { item: (typeof mainItems)[number] }) => {
    const Icon = item.icon;
    return <button className={screen === item.screen ? 'active' : ''} type="button" onClick={() => select(item.screen)}><Icon size={19} /><span>{item.label}</span></button>;
  };

  return (
    <div className="panel-app">
      <aside className="panel-sidebar">
        <div className="panel-brand"><span><img src="/images/marques-works-logo-gold.png" alt="" /></span><div><strong>Marques Works</strong><small>Panel de reservas</small></div></div>
        <div className={`plan-chip ${plan}`}><b>Plan {plan === 'managed' ? 'Managed' : 'Essential'}</b><span>{plan === 'managed' ? 'Gestión autónoma' : 'Gestión asistida'}</span></div>
        <nav className="sidebar-nav" aria-label="Panel">
          <span className="nav-caption">Principal</span>
          {mainItems.map((item) => <NavButton item={item} key={item.screen} />)}
          <span className="nav-caption">Gestión</span>
          {moreItems.map((item) => <NavButton item={item} key={item.screen} />)}
        </nav>
        <button className="sidebar-logout" type="button" onClick={onLogout}><LogOut size={18} /> Cerrar sesión</button>
      </aside>

      <div className="panel-main">
        <header className="panel-topbar">
          <div><span className="topbar-eyebrow">MW BarberShop</span><h1>{screenTitles[screen]}</h1></div>
          <div className="topbar-actions"><a className="button subtle small" href="/demo" target="_blank" rel="noreferrer">Ver web</a><button className="avatar-button" type="button" onClick={() => select('settings')} aria-label="Abrir configuración"><img src="/images/marques-works-logo-gold.png" alt="" /></button></div>
        </header>
        <div className="panel-content">{children}</div>
      </div>

      <nav className="bottom-nav" aria-label="Navegación móvil">
        {mainItems.map((item) => <NavButton item={item} key={item.screen} />)}
        <button className={moreItems.some((item) => item.screen === screen) ? 'active' : ''} type="button" onClick={() => setDrawerOpen(true)}><Menu size={20} /><span>Más</span></button>
      </nav>

      {drawerOpen && <div className="drawer-scrim" onMouseDown={(event) => event.target === event.currentTarget && setDrawerOpen(false)}>
        <aside className="mobile-drawer">
          <header><div><span className="eyebrow">Plan {plan === 'managed' ? 'Managed' : 'Essential'}</span><h2>Más opciones</h2></div><button className="icon-button" type="button" onClick={() => setDrawerOpen(false)}><X /></button></header>
          <nav>{moreItems.map((item) => { const Icon = item.icon; return <button className={screen === item.screen ? 'active' : ''} type="button" key={item.screen} onClick={() => select(item.screen)}><span><Icon size={20} />{item.label}</span><ChevronRight size={18} /></button>; })}</nav>
          <button className="drawer-logout" type="button" onClick={onLogout}><LogOut size={19} /> Cerrar sesión</button>
        </aside>
      </div>}
    </div>
  );
}
