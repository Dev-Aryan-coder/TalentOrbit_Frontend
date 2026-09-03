import React, { useState, useEffect } from 'react';
import { HomePage } from './views/public/HomePage';
import HowItWorksPage from './views/public/HowItWorksPage';
import FeaturesPage from './views/public/FeaturesPage';
import AboutUsPage from './views/public/AboutUsPage';
import ContactUsPage from './views/public/ContactUsPage';
import StudentAchievements from './views/student/StudentAchievements';

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    const path = window.location.pathname.replace('/', '');
    if (['how-it-works', 'features', 'about-us', 'contact', 'student', 'achievements', 'badges'].includes(path)) {
      setCurrentView(path);
    }
  }, []);

  const handleNavigateHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState(null, '', '/');
  };

  const handleNavigatePage = (page) => {
    setCurrentView(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState(null, '', `/${page}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {currentView === 'home' && (
        <HomePage 
          onNavigateRole={(role) => setCurrentView(role)} 
          onNavigateHome={handleNavigateHome}
          onNavigatePage={handleNavigatePage}
        />
      )}

      {currentView === 'how-it-works' && (
        <HowItWorksPage 
          onNavigateHome={handleNavigateHome}
          onNavigatePage={handleNavigatePage}
          onNavigateRole={(role) => setCurrentView(role)}
        />
      )}

      {currentView === 'features' && (
        <FeaturesPage 
          onNavigateHome={handleNavigateHome}
          onNavigatePage={handleNavigatePage}
          onNavigateRole={(role) => setCurrentView(role)}
        />
      )}

      {currentView === 'about-us' && (
        <AboutUsPage 
          onNavigateHome={handleNavigateHome}
          onNavigatePage={handleNavigatePage}
          onNavigateRole={(role) => setCurrentView(role)}
        />
      )}

      {currentView === 'contact' && (
        <ContactUsPage 
          onNavigateHome={handleNavigateHome}
          onNavigatePage={handleNavigatePage}
          onNavigateRole={(role) => setCurrentView(role)}
        />
      )}

      {(currentView === 'student' || currentView === 'achievements' || currentView === 'badges') && (
        <StudentAchievements 
          onNavigateHome={handleNavigateHome}
          onNavigatePage={handleNavigatePage}
          onNavigateRole={(role) => setCurrentView(role)}
        />
      )}
    </div>
  );
}