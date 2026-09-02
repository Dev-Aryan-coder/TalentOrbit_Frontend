import React from 'react';
import './HeroBanner.css';
import logoImg from '../../assets/logo.png';
import heroBgImg from '../../assets/hero-bg.png';

export function HeroBanner({
  onNavigateHome,
  onLogin,
  onRegister,
  title = "Transforming Academia & Industry",
  highlightText = "Collaboration",
  description = "TalentOrbit empowers Students with AI skill diagnostic assessments, Recruiters with explainable talent scouting, Academicians with research grants & FDPs, and Institutions with real-time NIRF/NAAC placement intelligence.",
  primaryActionText = "Explore Student Portal",
  onPrimaryAction,
  secondaryActionText = "Recruiter ATS & Talent Pool",
  onSecondaryAction,
  stats = [
    { label: "AI Skill Testing", sub: "Live Groq Diagnostic MCQs" },
    { label: "Smart Job Matching", sub: "Weighted Skill Compatibility" },
    { label: "Placement Analytics", sub: "Real-Time College Reports" },
    { label: "Faculty Industry R&D", sub: "Corporate Research & Grants" }
  ]
}) {
    return (
    <div 
      className="hero-banner-root"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#0077ee',
        backgroundImage: `url(${heroBgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: '#041638',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. Sticky Header Bar across all scrolling */}
      <div 
        className="hero-sticky-header-wrapper"
        style={{
          position: 'fixed',
          top: '16px',
          left: 0,
          right: 0,
          pointerEvents: 'none',
          zIndex: 1000,
          width: '100%',
          maxWidth: '1520px',
          margin: '0 auto',
          padding: '0 20px',
          boxSizing: 'border-box'
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
              if (onNavigateHome) {
                onNavigateHome();
              } else {
                window.history.pushState(null, '', '/');
              }
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
                className="hero-brand-logo-img"
                style={{ width: '32px', height: '32px', maxWidth: '32px', maxHeight: '32px', objectFit: 'contain', display: 'block' }}
              />
            </div>
            <div className="hero-brand-text-col" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span 
                className="hero-brand-title-text"
                style={{ fontWeight: 400, fontSize: '22px', color: '#041638', lineHeight: 1.1, letterSpacing: '-0.02em' }}
              >
                TalentOrbit
              </span>
              <span 
                className="hero-brand-subtag-text"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontWeight: 400, letterSpacing: '0.22em', color: '#092350', textTransform: 'uppercase', marginTop: '3px', lineHeight: 1 }}
              >
                CONNECT <span className="dot-teal" style={{ color: '#14b8a6', fontSize: '11px', lineHeight: 0 }}>•</span> GROW <span className="dot-blue" style={{ color: '#2563eb', fontSize: '11px', lineHeight: 0 }}>•</span> SUCCEED
              </span>
            </div>
          </a>

          {/* CENTER: Dedicated Frosted Glassmorphic Pill Navbar with Clean Spacing */}
          <nav 
            className="hero-center-pill-nav"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px 0 rgba(0, 50, 150, 0.12), inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)'
            }}
          >
            <a 
              href="#how-it-works" 
              className="hero-pill-link"
              style={{
                display: 'inline-block',
                padding: '8px 20px',
                borderRadius: '9999px',
                fontSize: '14.5px',
                fontWeight: 400,
                color: '#041638',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              How It Works
            </a>
            <a 
              href="#features" 
              className="hero-pill-link"
              style={{
                display: 'inline-block',
                padding: '8px 20px',
                borderRadius: '9999px',
                fontSize: '14.5px',
                fontWeight: 400,
                color: '#041638',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              Features
            </a>
            <a 
              href="#about" 
              className="hero-pill-link"
              style={{
                display: 'inline-block',
                padding: '8px 20px',
                borderRadius: '9999px',
                fontSize: '14.5px',
                fontWeight: 400,
                color: '#041638',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              About Us
            </a>
            <a 
              href="#contact" 
              className="hero-pill-link"
              style={{
                display: 'inline-block',
                padding: '8px 20px',
                borderRadius: '9999px',
                fontSize: '14.5px',
                fontWeight: 400,
                color: '#041638',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              Contact
            </a>
          </nav>

          {/* Right: Full Glassmorphism Auth Buttons */}
          <div 
            className="hero-header-auth-group"
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <button 
              type="button" 
              onClick={onLogin} 
              className="hero-btn-glass-login"
              style={{
                padding: '9px 22px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 400,
                color: '#041638',
                border: '1px solid rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(16px)',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 50, 150, 0.06)',
                whiteSpace: 'nowrap'
              }}
            >
              Log In
            </button>
            <button 
              type="button" 
              onClick={onRegister} 
              className="hero-btn-glass-signup"
              style={{
                padding: '9px 22px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 400,
                color: '#041638',
                border: '1.5px solid rgba(4, 22, 56, 0.75)',
                backdropFilter: 'blur(16px)',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 50, 150, 0.08)',
                whiteSpace: 'nowrap'
              }}
            >
              Sign Up / Register
            </button>
          </div>
        </header>
      </div>

      {/* 2. Main Center Content */}
      <div 
        className="hero-main-stage"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '110px 32px 40px 32px',
          textAlign: 'left',
          boxSizing: 'border-box'
        }}
      >
        <div 
          className="hero-top-badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            fontSize: '13px',
            fontWeight: 400,
            color: '#041638',
            marginBottom: '20px',
            boxShadow: '0 4px 15px rgba(0, 50, 150, 0.08)'
          }}
        >
          <span 
            className="hero-badge-marker"
            style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#0055ff' }}
          />
          <span>Next-Gen Higher Education & Industry Alignment</span>
        </div>

        <h1 
          className="hero-display-headline"
          style={{
            fontFamily: "'Playfair Display', 'Instrument Serif', Georgia, serif",
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontSize: 'clamp(2.3rem, 5vw, 4.6rem)', lineHeight: 1.12, fontWeight: 700,
            color: '#041638',
            margin: '0 0 20px 0',
            textShadow: '0 2px 10px rgba(255, 255, 255, 0.6)'
          }}
        >
          <span>{title}</span>{" "}
          <span 
            className="hero-headline-italic"
            style={{
              color: '#003db3',
              display: 'inline-block',
              fontStyle: 'italic',
              textDecoration: 'underline',
              textDecorationColor: 'rgba(0, 85, 255, 0.4)',
              textUnderlineOffset: '8px'
            }}
          >
            {highlightText}
          </span>
        </h1>

        <p 
          className="hero-stage-desc"
          style={{
            maxWidth: '780px',
            fontSize: 'clamp(1rem, 1.2vw, 1.25rem)',
            fontWeight: 400,
            lineHeight: 1.65,
            color: '#092350',
            margin: '0 0 32px 0'
          }}
        >
          {description}
        </p>

        <div 
          className="hero-stage-actions"
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '18px' }}
        >
          <button 
            type="button" 
            onClick={onPrimaryAction} 
            className="hero-primary-cta-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 36px',
              borderRadius: '9999px',
              fontSize: '16px',
              fontWeight: 400,
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(4, 22, 56, 0.4)'
            }}
          >
            <span>{primaryActionText}</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>→</span>
          </button>

          <button 
            type="button" 
            onClick={onSecondaryAction} 
            className="hero-secondary-cta-btn"
            style={{
              padding: '16px 32px',
              borderRadius: '9999px',
              fontSize: '16px',
              fontWeight: 400,
              color: '#041638',
              border: '1px solid rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0, 50, 150, 0.08)'
            }}
          >
            {secondaryActionText}
          </button>
        </div>
      </div>

      
      

      {/* Seamless Soft Gradient Fade into White Section */}
      <div 
        className="hero-bottom-gradient-fade"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '110px',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.6) 60%, #ffffff 100%)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* 3. Bottom Metrics Grid */}
      <div className="hero-bottom-metrics">
        <div className="hero-metrics-grid">
          {stats.map((item, idx) => (
            <div 
              key={idx} 
              className="hero-metric-item"
              style={{ borderLeft: '2px solid #0055ff', paddingLeft: '14px', textAlign: 'left' }}
            >
              <p className="hero-metric-title" style={{ fontSize: '15px', fontWeight: 400, color: '#041638', margin: 0 }}>
                {item.label}
              </p>
              <p className="hero-metric-subtitle" style={{ fontSize: '13px', fontWeight: 400, color: '#09285a', margin: '4px 0 0 0' }}>
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export default HeroBanner;







