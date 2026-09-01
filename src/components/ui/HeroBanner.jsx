import React from 'react';
import './HeroBanner.css';
import logoImg from '../../assets/logo.png';

export default function HeroBanner({
  title = "Transforming Academia & Industry",
  highlightText = "Collaboration",
  description = "TalentOrbit empowers Students with AI skill diagnostic assessments, Recruiters with explainable talent scouting, Academicians with research grants & FDPs, and Institutions with real-time NIRF/NAAC placement intelligence.",
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
  return (
    <div className="hero-banner-root">
      {/* 1. Sticky Floating Glassmorphic + Neomorphic Pill Header */}
      <div className="hero-sticky-header-wrapper">
        <header className="hero-nav-header">
          {/* Left: Brand Logo & Title */}
          <div className="hero-brand-group">
            <div className="hero-brand-logo-box">
              <img 
                src={logoImg} 
                alt="TalentOrbit" 
                className="hero-brand-logo-img"
                style={{ width: '32px', height: '32px', maxWidth: '32px', maxHeight: '32px', objectFit: 'contain', display: 'block' }}
              />
            </div>
            <div className="hero-brand-text-col">
              <span className="hero-brand-title-text">TalentOrbit</span>
              <span className="hero-brand-subtag-text">
                CONNECT <span className="dot-teal">•</span> GROW <span className="dot-blue">•</span> SUCCEED
              </span>
            </div>
          </div>

          {/* Center: Frosted Glass Floating Pill Navbar */}
          <nav className="hero-center-pill-nav">
            <a href="#how-it-works" className="hero-pill-link">How It Works</a>
            <a href="#features" className="hero-pill-link">Features</a>
            <a href="#about" className="hero-pill-link">About Us</a>
            <a href="#contact" className="hero-pill-link">Contact</a>
          </nav>

          {/* Right: Launch Button */}
          <button type="button" onClick={onPrimaryAction} className="hero-header-launch-btn">
            <span className="hero-btn-pulse-dot" />
            <span>Launch Platform</span>
          </button>
        </header>
      </div>

      {/* 2. Main Center Content */}
      <div className="hero-main-stage">
        <div className="hero-top-badge">
          <span className="hero-badge-marker" />
          <span>Next-Gen Higher Education & Industry Alignment</span>
        </div>

        <h1 className="hero-display-headline">
          <span>{title}</span>{" "}
          <span className="hero-headline-italic">{highlightText}</span>
        </h1>

        <p className="hero-stage-desc">{description}</p>

        <div className="hero-stage-actions">
          <button type="button" onClick={onPrimaryAction} className="hero-primary-cta-btn">
            <span>{primaryActionText}</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>→</span>
          </button>

          <button type="button" onClick={onSecondaryAction} className="hero-secondary-cta-btn">
            {secondaryActionText}
          </button>
        </div>
      </div>

      {/* 3. Bottom Metrics Grid */}
      <div className="hero-bottom-metrics">
        <div className="hero-metrics-grid">
          {stats.map((item, idx) => (
            <div key={idx} className="hero-metric-item">
              <p className="hero-metric-title">{item.label}</p>
              <p className="hero-metric-subtitle">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
