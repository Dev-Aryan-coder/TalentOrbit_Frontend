import React, { useState } from 'react';
import HomePage from './views/public/HomePage';

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <div className="min-h-screen bg-[#050811]">
      {currentView === 'home' && (
        <HomePage onNavigateRole={(role) => setCurrentView(role)} />
      )}
    </div>
  );
}
