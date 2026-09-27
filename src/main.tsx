import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { PanelThemeProvider } from './store/PanelThemeContext';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PanelThemeProvider>
        <App />
      </PanelThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
