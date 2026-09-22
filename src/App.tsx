import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './components/UI';
import { PublicSite } from './pages/PublicSite';
import { PanelApp } from './pages/panel/PanelApp';

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/demo" element={<PublicSite />} />
        <Route path="/demo/managed/*" element={<PanelApp plan="managed" />} />
        <Route path="/demo/essential/*" element={<PanelApp plan="essential" />} />
        <Route path="/" element={<Navigate to="/demo" replace />} />
        <Route path="*" element={<Navigate to="/demo" replace />} />
      </Routes>
    </ToastProvider>
  );
}
