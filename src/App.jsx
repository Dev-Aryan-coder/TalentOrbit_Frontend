import React, { useState, useEffect } from 'react';
import { HomePage } from './views/public/HomePage';
import HowItWorksPage from './views/public/HowItWorksPage';
import FeaturesPage from './views/public/FeaturesPage';
import AboutUsPage from './views/public/AboutUsPage';
import ContactUsPage from './views/public/ContactUsPage';
import StudentAchievements from './views/student/StudentAchievements';
import StudentDashboard from './views/student/StudentDashboard';
import AuthPage from './views/public/AuthPage';
import ProfileSettingsModal from './components/ui/ProfileSettingsModal';
import AccountSettingsModal from './components/ui/AccountSettingsModal';
import AppearanceModal from './components/ui/AppearanceModal';
import TalentOrbitAIChatbot from './components/ui/TalentOrbitAIChatbot';

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  // Real logged-in user state, persisted in local storage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('talentorbit_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Theme state ('light' | 'dark'), persisted in local storage
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('talentorbit_theme') || 'light';
  });

  // Modal display states
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isAppearanceModalOpen, setIsAppearanceModalOpen] = useState(false);

  // Sync theme changes with document data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('talentorbit_theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    const path = window.location.pathname.replace('/', '');
    if (['how-it-works', 'features', 'about-us', 'contact', 'student', 'dashboard', 'achievements', 'badges', 'login', 'register', 'signup'].includes(path)) {
      if (path === 'dashboard') {
        setCurrentView('student');
      } else {
        setCurrentView(path === 'signup' ? 'register' : path);
      }
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

  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('talentorbit_user', JSON.stringify(userData));
    const r = (userData.role || 'student').toLowerCase();
    if (r === 'student') {
      handleNavigateHome();
      return;
    }
    const target = r === 'industry' ? 'recruiter' : r === 'academician' ? 'academician' : r === 'institution_admin' ? 'tpo' : 'student';
    handleNavigatePage(target);
  };

  const handleLogout = () => {
    localStorage.removeItem('talentorbit_user');
    setCurrentUser(null);
    handleNavigateHome();
  };

  const handleProfileUpdated = (updatedData) => {
    const merged = { ...currentUser, ...updatedData };
    setCurrentUser(merged);
    localStorage.setItem('talentorbit_user', JSON.stringify(merged));
  };

  const handleNavigateDashboard = () => {
    if (!currentUser) {
      handleNavigatePage('login');
      return;
    }
    const r = (currentUser.role || 'student').toLowerCase();
    const target = r === 'industry' ? 'recruiter' : r === 'academician' ? 'academician' : r === 'institution_admin' ? 'tpo' : 'student';
    handleNavigatePage(target);
  };

  const sharedNavbarProps = {
    currentUser,
    currentTheme,
    onThemeChange: setCurrentTheme,
    onNavigateDashboard: handleNavigateDashboard,
    onOpenProfileSettings: () => setIsProfileModalOpen(true),
    onOpenAccountSettings: () => setIsAccountModalOpen(true),
    onOpenAppearance: () => setIsAppearanceModalOpen(true),
    onLogout: handleLogout,
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {currentView === 'home' && (
        <HomePage 
          onNavigateRole={(role) => setCurrentView(role)} 
          onNavigateHome={handleNavigateHome}
          onNavigatePage={handleNavigatePage}
          onLogin={() => handleNavigatePage('login')}
          onRegister={() => handleNavigatePage('register')}
          {...sharedNavbarProps}
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

      {(currentView === 'achievements' || currentView === 'badges') && (
        <StudentAchievements 
          onNavigateHome={handleNavigateHome}
          onNavigatePage={handleNavigatePage}
          onNavigateRole={(role) => setCurrentView(role)}
          onLogin={() => handleNavigatePage('login')}
          onRegister={() => handleNavigatePage('register')}
          {...sharedNavbarProps}
        />
      )}

      {(currentView === 'student' || currentView === 'dashboard') && (
        <StudentDashboard
          currentUser={currentUser}
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
          onNavigateHome={handleNavigateHome}
          onNavigatePage={handleNavigatePage}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'login' && (
        <AuthPage 
          initialMode="login"
          onNavigateHome={handleNavigateHome}
          onNavigateRole={(role) => setCurrentView(role)}
          onSuccessLogin={handleAuthSuccess}
        />
      )}

      {currentView === 'register' && (
        <AuthPage 
          initialMode="signup"
          onNavigateHome={handleNavigateHome}
          onNavigateRole={(role) => setCurrentView(role)}
          onSuccessLogin={handleAuthSuccess}
        />
      )}

      {/* Global Modals for Profile, Account, and Appearance */}
      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={currentUser}
        onProfileUpdated={handleProfileUpdated}
      />

      <AccountSettingsModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        user={currentUser}
      />

      <AppearanceModal
        isOpen={isAppearanceModalOpen}
        onClose={() => setIsAppearanceModalOpen(false)}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
      />

      {/* Floating Multimodal AI Chatbot (Active when user is logged in) */}
      {currentUser && <TalentOrbitAIChatbot currentUser={currentUser} />}
    </div>
  );
}