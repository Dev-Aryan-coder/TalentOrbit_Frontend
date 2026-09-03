import heroStudentImg from '../../assets/hero-student.jpg';
import React from 'react';
import './HeroBanner.css';
import logoImg from '../../assets/logo.png';


export function HeroBanner({
  onNavigatePage,
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
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    if (onNavigatePage) {
      const pageMap = {
        'how-it-works': 'how-it-works',
        'features': 'features',
        'about': 'about-us',
        'contact': 'contact'
      };
      const targetPage = pageMap[targetId] || targetId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      onNavigatePage(targetPage);
      return;
    }
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      window.history.pushState(null, '', `#${targetId}`);
    }
  };

    return (
    <div 
      className="hero-banner-root"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        backgroundImage: 'none',
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
              onClick={(e) => handleNavClick(e, 'how-it-works')}
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
              onClick={(e) => handleNavClick(e, 'features')}
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
              onClick={(e) => handleNavClick(e, 'about')}
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
              onClick={(e) => handleNavClick(e, 'contact')}
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

            {/* 2. Main Center Content - 2 Columns */}
      <div 
        className="hero-main-stage"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '140px 32px 30px 32px',
          textAlign: 'left',
          boxSizing: 'border-box'
        }}
      >
        <div className="hero-content-grid">
          {/* Left Column: Headline, Description & CTAs */}
          <div className="hero-text-col">
            <div 
              className="hero-top-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 18px',
                borderRadius: '9999px',
                border: '1px solid #e2e8f0',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                fontSize: '13px',
                fontWeight: 400,
                color: '#041638',
                marginBottom: '20px',
                boxShadow: '0 4px 15px rgba(0, 50, 150, 0.06)'
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
                letterSpacing: '0.05em',
                fontSize: 'clamp(2rem, 3.2vw, 3.2rem)',
                lineHeight: 1.18,
                fontWeight: 700,
                color: '#041638',
                margin: '0 0 20px 0'
              }}
            >
              {title} {highlightText}
            </h1>

            <p 
              className="hero-stage-desc"
              style={{
                fontSize: 'clamp(0.95rem, 1.1vw, 1.15rem)',
                fontWeight: 400,
                lineHeight: 1.65,
                color: '#475569',
                margin: '0 0 32px 0'
              }}
            >
              {description}
            </p>

            <div 
              className="hero-stage-actions"
              style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}
            >
              <button 
                type="button" 
                onClick={onPrimaryAction} 
                className="hero-primary-cta-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '15px 34px',
                  borderRadius: '9999px',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#ffffff',
                  background: '#041638',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(4, 22, 56, 0.3)'
                }}
              >
                <span>{primaryActionText}</span>
                <span className="hero-btn-arrow" style={{ fontSize: '18px', transition: 'transform 0.2s ease' }}>→</span>
              </button>

              <button 
                type="button" 
                onClick={onSecondaryAction} 
                className="hero-secondary-cta-btn"
                style={{
                  padding: '15px 34px',
                  borderRadius: '9999px',
                  fontSize: '15px',
                  fontWeight: 400,
                  color: '#041638',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0, 50, 150, 0.06)'
                }}
              >
                <span>{secondaryActionText}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual with Interactive Floating Badges */}
          <div className="hero-visual-col">
            <div className="hero-visual-wrapper">
              <div className="hero-visual-circle-bg" />
              <img 
                src={heroStudentImg} 
                alt="TalentOrbit Verified Graduate" 
                className="hero-visual-img" 
              />

              {/* Floating Top Right Badge */}
              <div className="hero-floating-badge badge-top-right">
                <div className="floating-badge-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0055ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <div className="floating-badge-text">
                  <span className="floating-badge-label">Verified Skill Score</span>
                  <span className="floating-badge-val">98.4% Confidence</span>
                </div>
              </div>

              {/* Floating Bottom Left Badge */}
              <div className="hero-floating-badge badge-bottom-left">
                <div className="floating-badge-icon" style={{ background: 'rgba(16, 185, 129, 0.12)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <div className="floating-badge-text">
                  <span className="floating-badge-label">Direct Placement</span>
                  <span className="floating-badge-val" style={{ color: '#10b981' }}>Top 1% Talent Pool</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
