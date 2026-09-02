import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './components/ui/HeroBanner.css';
import './views/public/HomePage.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
