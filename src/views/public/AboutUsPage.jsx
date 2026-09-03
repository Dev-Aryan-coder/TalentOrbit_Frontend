import React from 'react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import whoWeAreImg from '../../assets/who-we-are.jpg';
import './AboutUsPage.css';

export default function AboutUsPage({ onNavigateHome, onNavigatePage, onNavigateRole, onLogin, onRegister }) {
  return (
    <div className="about-page">
      <PublicNavbar 
        activePage="about-us" 
        onNavigateHome={onNavigateHome} 
        onNavigatePage={onNavigatePage}
        onLogin={onLogin} 
        onRegister={onRegister} 
      />

      <main className="about-main">
        {/* Header */}
        <div className="about-header">
          <div className="about-tag">
            National Mission & Vision
          </div>
          <h1 className="about-title">
            About TalentOrbit
          </h1>
          <p className="about-desc">
            Dedicated to solving Smart India Hackathon Problem Statement #26044: Bridging the 45% industry-academia skill deficit through verified intelligence.
          </p>
        </div>

        {/* 2-Column Article Hero */}
        <div className="about-hero-grid">
          <div className="about-img-box">
            <img 
              src={whoWeAreImg} 
              alt="TalentOrbit University & Industry Synergy" 
              className="about-img"
            />
          </div>

          <div className="about-story-col">
            <h2 className="about-story-heading">
              A Unified Ecosystem for Indian Higher Education
            </h2>
            <p className="about-story-p1">
              TalentOrbit was engineered to replace unverified, keyword-stuffed resumes with mathematical skill verification. By bringing together students, universities, corporate recruiters, and academic researchers onto one explainable platform, we ensure transparent talent discovery.
            </p>
            <p className="about-story-p2">
              Under AICTE guidelines and NIRF/NAAC accreditation mandates, institutions need real-time data on student placement readiness, median packages, and industry curriculum gaps. TalentOrbit delivers automated compliance analytics directly into the hands of university Training & Placement Officers (TPOs).
            </p>
          </div>
        </div>

        {/* 3 Core Tenets */}
        <div className="about-tenets-grid">
          <div className="about-tenet-card">
            <h3 className="about-tenet-title">
              Zero Credential Fraud
            </h3>
            <p className="about-tenet-desc">
              Every skill badge and diagnostic result is anchored to a cryptographic SHA-256 hash in MySQL, guaranteeing that every candidate credential is 100% authentic and tamper-proof.
            </p>
          </div>

          <div className="about-tenet-card">
            <h3 className="about-tenet-title">
              Explainable Algorithmic Fit
            </h3>
            <p className="about-tenet-desc">
              No opaque black-box AI filtering. Both candidate and recruiter can inspect the exact weighted compatibility breakdown across languages, frameworks, and prerequisites.
            </p>
          </div>

          <div className="about-tenet-card">
            <h3 className="about-tenet-title">
              Accreditation Automation
            </h3>
            <p className="about-tenet-desc">
              Eliminating months of manual paperwork for universities by automatically compiling NIRF Metric 5.2.1 and NAAC Criterion 5 documentation straight from active placement pipelines.
            </p>
          </div>
        </div>

        {/* Navigation Return */}
        <div className="about-cta-wrap">
          <button 
            type="button" 
            onClick={onNavigateHome}
            className="about-cta-btn"
          >
            Return to Home Overview
          </button>
        </div>
      </main>
      <PublicFooter onNavigateHome={onNavigateHome} onNavigatePage={onNavigatePage} onNavigateRole={onNavigateRole} />
    </div>
  );
}