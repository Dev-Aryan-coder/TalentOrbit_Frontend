import React from 'react';
import logoImg from '../../assets/logo.png';
import './PublicNavbar.css';

export default function PublicNavbar({ activePage, onNavigateHome, onNavigatePage, onLogin, onRegister }) {
  const navItems = [
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'features', label: 'Features' },
    { id: 'about-us', label: 'About Us' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <div className="public-navbar-wrapper">
      <header className="public-nav-header">
        {/* Left: Brand Logo & Title */}
        <a 
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (onNavigateHome) onNavigateHome();
          }}
          className="public-brand-group"
        >
          <div className="public-brand-logo-box">
            <img 
              src={logoImg} 
              alt="TalentOrbit" 
              className="public-brand-logo-img"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <span className="public-brand-title">
              TalentOrbit
            </span>
            <span className="public-brand-subtag">
              CONNECT • GROW • SUCCEED
            </span>
          </div>
        </a>

        {/* Center: Frosted Glassmorphic Pill Navbar */}
        <nav className="public-center-pill-nav">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  if (onNavigatePage) onNavigatePage(item.id);
                }}
                className={`public-pill-btn ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Transparent Auth Buttons */}
        <div className="public-header-auth-group">
          <button 
            type="button" 
            onClick={onLogin}
            className="public-login-btn"
          >
            Log In
          </button>
          <button 
            type="button" 
            onClick={onRegister}
            className="public-register-btn"
          >
            Sign Up / Register
          </button>
        </div>
      </header>
    </div>
  );
}