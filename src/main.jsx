import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { LanguageProvider } from './contexts/LanguageContext';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorProvider } from './contexts/ErrorContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <ErrorProvider>
        <App />
      </ErrorProvider>
    </LanguageProvider>
  </StrictMode>,
)