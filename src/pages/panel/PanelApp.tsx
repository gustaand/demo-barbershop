import { useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import type { DemoId, Plan } from '../../types';
import { PanelShell } from './PanelShell';
import type { PanelScreen } from './panelTypes';
import { DashboardScreen, AgendaScreen, AppointmentsScreen } from './screens/OperationsScreens';
import { BusinessScreen, ExceptionsScreen, GalleryScreen, HoursScreen, RequestsScreen, ServicesScreen, SettingsScreen, TeamScreen } from './screens/ManagementScreens';
import { LoginPage } from './screens/LoginPage';

const authKey = (demoId: DemoId, plan: Plan) => `mw-demo-auth-${demoId}-${plan}`;

export function PanelApp({ demoId, plan }: { demoId: DemoId; plan: Plan }) {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem(authKey(demoId, plan)) === 'true');
  const [screen, setScreen] = useState<PanelScreen>('dashboard');
  const navigate = useNavigate();
  const base = `/demo/${demoId}/${plan}`;

  const login = () => {
    sessionStorage.setItem(authKey(demoId, plan), 'true');
    setAuthenticated(true);
    navigate(base, { replace: true });
  };

  const logout = () => {
    sessionStorage.removeItem(authKey(demoId, plan));
    setAuthenticated(false);
    navigate(`${base}/login`, { replace: true });
  };

  if (!authenticated) return <Routes><Route path="*" element={<LoginPage demoId={demoId} plan={plan} onLogin={login} />} /></Routes>;

  const content = (() => {
    switch (screen) {
      case 'dashboard': return <DashboardScreen plan={plan} goTo={setScreen} />;
      case 'agenda': return <AgendaScreen plan={plan} />;
      case 'appointments': return <AppointmentsScreen plan={plan} />;
      case 'services': return <ServicesScreen plan={plan} goTo={setScreen} />;
      case 'hours': return <HoursScreen plan={plan} goTo={setScreen} />;
      case 'team': return <TeamScreen plan={plan} goTo={setScreen} />;
      case 'exceptions': return <ExceptionsScreen plan={plan} goTo={setScreen} />;
      case 'gallery': return <GalleryScreen plan={plan} goTo={setScreen} />;
      case 'business': return <BusinessScreen plan={plan} goTo={setScreen} />;
      case 'requests': return <RequestsScreen plan={plan} />;
      case 'settings': return <SettingsScreen plan={plan} onLogout={logout} />;
      default: return <Navigate to={base} replace />;
    }
  })();

  return <PanelShell plan={plan} screen={screen} onScreen={setScreen} onLogout={logout}>{content}</PanelShell>;
}
