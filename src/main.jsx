import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { LanguageProvider } from './contexts/LanguageContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* O LanguageProvider agora envolve todo o aplicativo */}
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)