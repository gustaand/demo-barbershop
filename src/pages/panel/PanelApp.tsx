import { useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import type { Plan } from '../../types';
import { PanelShell } from './PanelShell';
import type { PanelScreen } from './panelTypes';
import { DashboardScreen, AgendaScreen, AppointmentsScreen } from './screens/OperationsScreens';
import { BusinessScreen, ExceptionsScreen, GalleryScreen, HoursScreen, RequestsScreen, ServicesScreen, SettingsScreen, TeamScreen } from './screens/ManagementScreens';
import { LoginPage } from './screens/LoginPage';

const authKey = (plan: Plan) => `mw-demo-auth-${plan}`;

export function PanelApp({ plan }: { plan: Plan }) {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem(authKey(plan)) === 'true');
  const [screen, setScreen] = useState<PanelScreen>('dashboard');
  const navigate = useNavigate();

  const login = () => {
    sessionStorage.setItem(authKey(plan), 'true');
    setAuthenticated(true);
    navigate(`/demo/${plan}`, { replace: true });
  };

  const logout = () => {
    sessionStorage.removeItem(authKey(plan));
    setAuthenticated(false);
    navigate(`/demo/${plan}/login`, { replace: true });
  };

  if (!authenticated) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage plan={plan} onLogin={login} />} />
      </Routes>
    );
  }

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
      default: return <Navigate to={`/demo/${plan}`} replace />;
    }
  })();

  return <PanelShell plan={plan} screen={screen} onScreen={setScreen} onLogout={logout}>{content}</PanelShell>;
}
