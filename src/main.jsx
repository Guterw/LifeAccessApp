import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { LanguageProvider } from './contexts/LanguageContext';
import { FitnessProvider } from './contexts/FitnessContext';
import React from 'react';
import { ErrorProvider } from './contexts/ErrorContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <FitnessProvider>
        <ErrorProvider>
          <App />
        </ErrorProvider>
      </FitnessProvider>
    </LanguageProvider>
  </StrictMode>,
)