import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './components/UI';
import { MWAdmin } from './pages/admin/MWAdmin';
import { PublicSite } from './pages/PublicSite';
import { PanelApp } from './pages/panel/PanelApp';
import { DemoProvider } from './store/DemoContext';

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/demo/barberia" element={<DemoProvider demoId="barberia"><PublicSite /></DemoProvider>} />
        <Route path="/demo/barberia/managed/*" element={<DemoProvider demoId="barberia"><PanelApp demoId="barberia" plan="managed" /></DemoProvider>} />
        <Route path="/demo/barberia/essential/*" element={<DemoProvider demoId="barberia"><PanelApp demoId="barberia" plan="essential" /></DemoProvider>} />

        <Route path="/demo/belleza" element={<DemoProvider demoId="belleza"><PublicSite /></DemoProvider>} />
        <Route path="/demo/belleza/managed/*" element={<DemoProvider demoId="belleza"><PanelApp demoId="belleza" plan="managed" /></DemoProvider>} />
        <Route path="/demo/belleza/essential/*" element={<DemoProvider demoId="belleza"><PanelApp demoId="belleza" plan="essential" /></DemoProvider>} />

        <Route path="/demo/mwadmin/*" element={<MWAdmin />} />

        <Route path="/demo" element={<Navigate to="/demo/barberia" replace />} />
        <Route path="/demo/managed/*" element={<Navigate to="/demo/barberia/managed" replace />} />
        <Route path="/demo/essential/*" element={<Navigate to="/demo/barberia/essential" replace />} />
        <Route path="/" element={<Navigate to="/demo/barberia" replace />} />
        <Route path="*" element={<Navigate to="/demo/barberia" replace />} />
      </Routes>
    </ToastProvider>
  );
}
