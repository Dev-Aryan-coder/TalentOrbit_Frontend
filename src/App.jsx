import React, { useState, useEffect } from 'react';
import { HomePage } from './views/public/HomePage';
import HowItWorksPage from './views/public/HowItWorksPage';
import FeaturesPage from './views/public/FeaturesPage';
import AboutUsPage from './views/public/AboutUsPage';
import ContactUsPage from './views/public/ContactUsPage';
import StudentAchievements from './views/student/StudentAchievements';
import AuthPage from './views/public/AuthPage';

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    const path = window.location.pathname.replace('/', '');
    if (['how-it-works', 'features', 'about-us', 'contact', 'student', 'achievements', 'badges', 'login', 'register', 'signup'].includes(path)) {
      setCurrentView(path === 'signup' ? 'register' : path);
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
          onLogin={() => handleNavigatePage('login')}
          onRegister={() => handleNavigatePage('register')}
        />
      )}

      {currentView === 'how-it-works' && (
        <HowItWorksPage 
          onNavigateHome={handleNavigateHome}
          onNavigatePage={handleNavigatePage}
          onNavigateRole={(role) => setCurrentView(role)}
          onLogin={() => handleNavigatePage('login')}
          onRegister={() => handleNavigatePage('register')}
        />
      )}

      {currentView === 'features' && (
        <FeaturesPage 
          onNavigateHome={handleNavigateHome}
          onNavigatePage={handleNavigatePage}
          onNavigateRole={(role) => setCurrentView(role)}
          onLogin={() => handleNavigatePage('login')}
          onRegister={() => handleNavigatePage('register')}
        />
      )}

      {currentView === 'about-us' && (
        <AboutUsPage 
          onNavigateHome={handleNavigateHome}
          onNavigatePage={handleNavigatePage}
          onNavigateRole={(role) => setCurrentView(role)}
          onLogin={() => handleNavigatePage('login')}
          onRegister={() => handleNavigatePage('register')}
        />
      )}

      {currentView === 'contact' && (
        <ContactUsPage 
          onNavigateHome={handleNavigateHome}
          onNavigatePage={handleNavigatePage}
          onNavigateRole={(role) => setCurrentView(role)}
          onLogin={() => handleNavigatePage('login')}
          onRegister={() => handleNavigatePage('register')}
        />
      )}

      {(currentView === 'student' || currentView === 'achievements' || currentView === 'badges') && (
        <StudentAchievements 
          onNavigateHome={handleNavigateHome}
          onNavigatePage={handleNavigatePage}
          onNavigateRole={(role) => setCurrentView(role)}
          onLogin={() => handleNavigatePage('login')}
          onRegister={() => handleNavigatePage('register')}
        />
      )}

      {currentView === 'login' && (
        <AuthPage 
          initialMode="login"
          onNavigateHome={handleNavigateHome}
          onNavigateRole={(role) => setCurrentView(role)}
          onSuccessLogin={(user) => {
            const r = (user.role || 'student').toLowerCase();
            setCurrentView(r === 'industry' ? 'recruiter' : r === 'academician' ? 'academician' : 'student');
          }}
        />
      )}

      {currentView === 'register' && (
        <AuthPage 
          initialMode="signup"
          onNavigateHome={handleNavigateHome}
          onNavigateRole={(role) => setCurrentView(role)}
          onSuccessLogin={(user) => {
            const r = (user.role || 'student').toLowerCase();
            setCurrentView(r === 'industry' ? 'recruiter' : r === 'academician' ? 'academician' : 'student');
          }}
        />
      )}
    </div>
  );
}