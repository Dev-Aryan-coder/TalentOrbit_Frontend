import React, { useState } from 'react';
import HomePage from './views/public/HomePage';

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  const handleNavigateHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState(null, '', '/');
  };

  return (
    <div className="min-h-screen bg-[#050811]">
      {currentView === 'home' && (
        <HomePage 
          onNavigateRole={(role) => setCurrentView(role)} 
          onNavigateHome={handleNavigateHome}
        />
      )}
    </div>
  );
}
