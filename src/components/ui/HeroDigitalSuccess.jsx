import React, { useRef } from 'react';
import './HeroDigitalSuccess.css';
import logoImg from '../../assets/logo.png';

export function HeroDigitalSuccess({
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
  const timelineRef = useRef(null);

  return (
    <section ref={timelineRef} className="hero-container">
      {/* Top Header */}
      <header className="hero-header">
        {/* Left: Brand Logo */}
        <div className="hero-brand">
          <div className="hero-logo-wrapper">
            <img 
              src={logoImg} 
              alt="TalentOrbit Emblem" 
              className="hero-logo-img"
            />
          </div>
          <div className="hero-brand-text">
            <span className="hero-brand-name">TalentOrbit</span>
            <span className="hero-brand-tag">
              CONNECT <span className="tag-dot-teal">•</span> GROW <span className="tag-dot-blue">•</span> SUCCEED
            </span>
          </div>
        </div>

        {/* Center: Frosted Glass Floating Pill Navigation */}
        <nav className="hero-pill-nav">
          <a href="#how-it-works" className="hero-nav-link">How It Works</a>
          <a href="#features" className="hero-nav-link">Features</a>
          <a href="#about" className="hero-nav-link">About Us</a>
          <a href="#contact" className="hero-nav-link">Contact</a>
        </nav>

        {/* Right: Launch Button */}
        <button type="button" onClick={onPrimaryAction} className="hero-btn-header">
          <span className="hero-ping-dot" />
          <span>Launch Platform</span>
        </button>
      </header>

      {/* Center Hero Stage Content */}
      <div className="hero-center">
        <div className="hero-pill-badge">
          <span className="hero-badge-dot" />
          <span>Next-Gen Higher Education & Industry Alignment</span>
        </div>

        <h1 className="hero-headline">
          <span>{title}</span>{" "}
          <span className="hero-headline-highlight">{highlightText}</span>
        </h1>

        <p className="hero-description">{description}</p>

        <div className="hero-actions">
          <button type="button" onClick={onPrimaryAction} className="hero-btn-primary">
            <span>{primaryActionText}</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>→</span>
          </button>

          <button type="button" onClick={onSecondaryAction} className="hero-btn-secondary">
            {secondaryActionText}
          </button>
        </div>
      </div>

      {/* Footer Metrics Grid */}
      <div className="hero-footer">
        <div className="hero-stats-grid">
          {stats.map((item, idx) => (
            <div key={idx} className="hero-stat-card">
              <p className="hero-stat-label">{item.label}</p>
              <p className="hero-stat-sub">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroDigitalSuccess;



