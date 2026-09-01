import React, { useRef } from 'react';
import './HeroDigitalSuccess.css';
import logoImg from '../../assets/logo.png';
import heroBgImg from '../../assets/hero-bg.png';

export function HeroDigitalSuccess({
  title = "Transforming Academia & Industry",
  highlightText = "Collaboration",
  description = "TalentOrbit (SIH Problem #26044) empowers Students with AI skill diagnostic assessments, Recruiters with explainable talent scouting, Academicians with research grants & FDPs, and Institutions with real-time NIRF/NAAC placement intelligence.",
  primaryActionText = "Explore Student Portal",
  onPrimaryAction,
  secondaryActionText = "Recruiter ATS & Talent Pool",
  onSecondaryAction,
  stats = [
    { label: "AI Matching Engine", sub: "Deterministic & Weighted" },
    { label: "Verified Skill Genome", sub: "SHA-256 Tamper-Proof" },
    { label: "Skill Deficit Heatmaps", sub: "NIRF Metric 5.2.1 / NAAC" },
    { label: "Faculty Immersion", sub: "AICTE FDPs & Sabbaticals" }
  ]
}) {
  const timelineRef = useRef(null);

  return (
    <section 
      ref={timelineRef} 
      className="hero-container"
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#030712',
        color: '#ffffff',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      {/* Background Fluid Image */}
      <div 
        className="hero-bg-layer"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${heroBgImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.85,
          zIndex: 1
        }}
      />
      
      {/* Dark Vignette Overlay */}
      <div 
        className="hero-vignette-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 60% 30%, rgba(3, 7, 18, 0.25) 0%, rgba(3, 7, 18, 0.75) 70%, rgba(3, 7, 18, 0.94) 100%)',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      {/* Cyber Grid */}
      <div 
        className="hero-grid-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.12,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          zIndex: 3,
          pointerEvents: 'none'
        }}
      />

      {/* Top Header */}
      <header 
        className="hero-header"
        style={{
          position: 'relative',
          zIndex: 20,
          width: '100%',
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Left: Brand Logo */}
        <div 
          className="hero-brand"
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
        >
          <div 
            className="hero-logo-wrapper"
            style={{
              width: '44px',
              height: '44px',
              minWidth: '44px',
              minHeight: '44px',
              maxWidth: '44px',
              maxHeight: '44px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 0 24px rgba(0, 162, 255, 0.5)',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            <img 
              src={logoImg} 
              alt="TalentOrbit Emblem" 
              className="hero-logo-img"
              style={{
                width: '36px',
                height: '36px',
                maxWidth: '36px',
                maxHeight: '36px',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>
          <div className="hero-brand-text" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <span 
              className="hero-brand-name"
              style={{ fontWeight: 800, fontSize: '20px', letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1.1 }}
            >
              TalentOrbit
            </span>
            <span 
              className="hero-brand-tag"
              style={{ fontSize: '10px', letterSpacing: '0.12em', color: '#7ce8ff', fontFamily: 'monospace', textTransform: 'uppercase', fontWeight: 600, marginTop: '2px' }}
            >
              SIH Problem #26044
            </span>
          </div>
        </div>

        {/* Center: Frosted Glass Floating Pill-Shaped Navigation */}
        <nav 
          className="hero-pill-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(3, 7, 18, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(28px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)'
          }}
        >
          <a href="#how-it-works" className="hero-nav-link" style={{ padding: '8px 18px', borderRadius: '9999px', fontSize: '14px', fontWeight: 500, color: '#e2e8f0', textDecoration: 'none' }}>How It Works</a>
          <a href="#features" className="hero-nav-link" style={{ padding: '8px 18px', borderRadius: '9999px', fontSize: '14px', fontWeight: 500, color: '#e2e8f0', textDecoration: 'none' }}>Features</a>
          <a href="#about" className="hero-nav-link" style={{ padding: '8px 18px', borderRadius: '9999px', fontSize: '14px', fontWeight: 500, color: '#e2e8f0', textDecoration: 'none' }}>About Us</a>
          <a href="#contact" className="hero-nav-link" style={{ padding: '8px 18px', borderRadius: '9999px', fontSize: '14px', fontWeight: 500, color: '#e2e8f0', textDecoration: 'none' }}>Contact</a>
        </nav>

        {/* Right: Launch Button */}
        <button 
          type="button" 
          onClick={onPrimaryAction} 
          className="hero-btn-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 22px',
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#ffffff',
            background: 'rgba(3, 7, 18, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(16px)',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(0, 162, 255, 0.35)'
          }}
        >
          <span 
            className="hero-ping-dot"
            style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#7ce8ff', boxShadow: '0 0 10px #7ce8ff' }}
          />
          <span>Launch Platform</span>
        </button>
      </header>

      {/* Center Hero Stage Content */}
      <div 
        className="hero-center"
        style={{
          position: 'relative',
          zIndex: 10,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: '1320px',
          width: '100%',
          margin: '0 auto',
          padding: '48px 32px',
          textAlign: 'left'
        }}
      >
        {/* Pill Tag */}
        <div 
          className="hero-pill-badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            background: 'rgba(3, 7, 18, 0.55)',
            border: '1px solid rgba(124, 232, 255, 0.3)',
            backdropFilter: 'blur(16px)',
            fontSize: '13px',
            fontWeight: 500,
            color: '#7ce8ff',
            width: 'fit-content',
            marginBottom: '24px',
            boxShadow: '0 0 15px rgba(0, 162, 255, 0.25)'
          }}
        >
          <span 
            className="hero-badge-dot"
            style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00a2ff', boxShadow: '0 0 8px #00a2ff' }}
          />
          <span>Next-Gen Higher Education & Industry Alignment</span>
        </div>

        {/* Uppercase High-Contrast Serif Headline */}
        <h1 
          className="hero-headline"
          style={{
            fontFamily: "'Playfair Display', 'Instrument Serif', Georgia, serif",
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontSize: 'clamp(2.5rem, 5.5vw, 5.2rem)',
            lineHeight: 1.12,
            fontWeight: 400,
            margin: '0 0 24px 0',
            textShadow: '0 12px 35px rgba(0, 0, 0, 0.9)'
          }}
        >
          <span>{title}</span>{" "}
          <span 
            className="hero-headline-highlight"
            style={{
              background: 'linear-gradient(90deg, #c7f8ff 0%, #7ce8ff 40%, #00a2ff 80%, #0062ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              filter: 'drop-shadow(0 0 25px rgba(0, 162, 255, 0.6))'
            }}
          >
            {highlightText}
          </span>
        </h1>

        {/* Description */}
        <p 
          className="hero-description"
          style={{
            maxWidth: '780px',
            fontSize: 'clamp(1rem, 1.2vw, 1.25rem)',
            fontWeight: 300,
            lineHeight: 1.7,
            color: '#e2e8f0',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)',
            margin: '0 0 40px 0'
          }}
        >
          {description}
        </p>

        {/* Action Buttons */}
        <div 
          className="hero-actions"
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px' }}
        >
          <button 
            type="button" 
            onClick={onPrimaryAction} 
            className="hero-btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 36px',
              borderRadius: '9999px',
              fontSize: '16px',
              fontWeight: 700,
              color: '#030712',
              background: 'linear-gradient(90deg, #c7f8ff 0%, #7ce8ff 50%, #00a2ff 100%)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 35px rgba(0, 162, 255, 0.7)'
            }}
          >
            <span>{primaryActionText}</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>→</span>
          </button>

          <button 
            type="button" 
            onClick={onSecondaryAction} 
            className="hero-btn-secondary"
            style={{
              padding: '16px 32px',
              borderRadius: '9999px',
              fontSize: '16px',
              fontWeight: 500,
              color: '#f1f5f9',
              background: 'rgba(3, 7, 18, 0.55)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(16px)',
              cursor: 'pointer'
            }}
          >
            {secondaryActionText}
          </button>
        </div>
      </div>

      {/* Footer Metrics Grid */}
      <div 
        className="hero-footer"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '0 32px 36px 32px'
        }}
      >
        <div 
          className="hero-stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            padding: '24px 32px',
            borderRadius: '20px',
            background: 'rgba(3, 7, 18, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(28px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)'
          }}
        >
          {stats.map((item, idx) => (
            <div 
              key={idx} 
              className="hero-stat-card"
              style={{ borderLeft: '2px solid #00a2ff', paddingLeft: '16px', textAlign: 'left' }}
            >
              <p className="hero-stat-label" style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                {item.label}
              </p>
              <p className="hero-stat-sub" style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroDigitalSuccess;
