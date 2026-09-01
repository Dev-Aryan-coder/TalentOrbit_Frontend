import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './components/ui/HeroDigitalSuccess.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
