import React from 'react';
import logoImg from '../../assets/logo.png';

export default function PublicNavbar({ activePage, onNavigateHome, onNavigatePage, onLogin, onRegister }) {
  const navItems = [
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'features', label: 'Features' },
    { id: 'about-us', label: 'About Us' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <div 
      className="hero-sticky-header-wrapper" 
      style={{ 
        position: 'fixed', 
        top: '16px', 
        left: 0, 
        right: 0, 
        zIndex: 9999, 
        width: '100%', 
        maxWidth: '1520px', 
        margin: '0 auto', 
        padding: '0 20px', 
        boxSizing: 'border-box', 
        pointerEvents: 'none' 
      }}
    >
      <header 
        className="hero-nav-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'auto',
          border: 'none',
          padding: 0,
          width: '100%'
        }}
      >
        {/* Left: Brand Logo & Title */}
        <a 
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (onNavigateHome) onNavigateHome();
          }}
          className="hero-brand-group"
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textDecoration: 'none' }}
        >
          <div 
            className="hero-brand-logo-box"
            style={{
              width: '44px',
              height: '44px',
              minWidth: '44px',
              maxWidth: '44px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              boxSizing: 'border-box',
              boxShadow: '0 6px 18px rgba(0, 50, 150, 0.12)'
            }}
          >
            <img 
              src={logoImg} 
              alt="TalentOrbit" 
              style={{ width: '32px', height: '32px', maxWidth: '32px', maxHeight: '32px', objectFit: 'contain', display: 'block' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <span style={{ fontWeight: 500, fontSize: '22px', color: '#041638', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              TalentOrbit
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontWeight: 400, letterSpacing: '0.22em', color: '#092350', textTransform: 'uppercase', marginTop: '3px', lineHeight: 1 }}>
              CONNECT • GROW • SUCCEED
            </span>
          </div>
        </a>

        {/* Center: Frosted Glassmorphic Pill Navbar */}
        <nav 
          className="hero-center-pill-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px 0 rgba(0, 50, 150, 0.12)'
          }}
        >
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
                style={{
                  display: 'inline-block',
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  fontSize: '14.5px',
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? '#0055ff' : '#041638',
                  background: isActive ? 'rgba(0, 85, 255, 0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(0, 85, 255, 0.2)' : '1px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Transparent Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            type="button" 
            onClick={onLogin}
            style={{
              padding: '9px 20px',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: 400,
              color: '#041638',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Log In
          </button>
          <button 
            type="button" 
            onClick={onRegister}
            style={{
              padding: '9px 22px',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: 400,
              color: '#041638',
              background: 'transparent',
              border: '1.5px solid rgba(4, 22, 56, 0.7)',
              backdropFilter: 'blur(16px)',
              cursor: 'pointer'
            }}
          >
            Sign Up / Register
          </button>
        </div>
      </header>
    </div>
  );
}