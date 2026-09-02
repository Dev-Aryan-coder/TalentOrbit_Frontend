import React from 'react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import whoWeAreImg from '../../assets/who-we-are.jpg';

export default function AboutUsPage({ onNavigateHome, onNavigatePage, onNavigateRole, onLogin, onRegister }) {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Poppins', sans-serif", color: '#041638', overflowX: 'hidden' }}>
      <PublicNavbar 
        activePage="about-us" 
        onNavigateHome={onNavigateHome} 
        onNavigatePage={onNavigatePage}
        onLogin={onLogin} 
        onRegister={onRegister} 
      />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '140px 32px 100px 32px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 64px auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', borderRadius: '9999px', background: 'rgba(0, 85, 255, 0.08)', border: '1px solid rgba(0, 85, 255, 0.2)', color: '#0055ff', fontSize: '13px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            National Mission & Vision
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', 'Instrument Serif', Georgia, serif", fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', fontWeight: 700, color: '#041638', lineHeight: 1.15, textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 20px 0' }}>
            About TalentOrbit
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.7, margin: 0 }}>
            Dedicated to solving Smart India Hackathon Problem Statement #26044: Bridging the 45% industry-academia skill deficit through verified intelligence.
          </p>
        </div>

        {/* 2-Column Article Hero */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '56px', alignItems: 'center', marginBottom: '80px' }}>
          <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0, 50, 150, 0.12)', border: '1px solid rgba(0, 85, 255, 0.12)' }}>
            <img 
              src={whoWeAreImg} 
              alt="TalentOrbit University & Industry Synergy" 
              style={{ width: '100%', height: '100%', maxHeight: '480px', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '28px', fontWeight: 700, color: '#041638', margin: 0, lineHeight: 1.25 }}>
              A Unified Ecosystem for Indian Higher Education
            </h2>
            <p style={{ fontSize: '15.5px', color: '#334155', lineHeight: 1.7, margin: 0 }}>
              TalentOrbit was engineered to replace unverified, keyword-stuffed resumes with mathematical skill verification. By bringing together students, universities, corporate recruiters, and academic researchers onto one explainable platform, we ensure transparent talent discovery.
            </p>
            <p style={{ fontSize: '15.5px', color: '#64748b', lineHeight: 1.7, margin: 0 }}>
              Under AICTE guidelines and NIRF/NAAC accreditation mandates, institutions need real-time data on student placement readiness, median packages, and industry curriculum gaps. TalentOrbit delivers automated compliance analytics directly into the hands of university Training & Placement Officers (TPOs).
            </p>
          </div>
        </div>

        {/* 3 Core Tenets */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', marginBottom: '80px' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '32px 28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#041638', margin: '0 0 12px 0' }}>
              Zero Credential Fraud
            </h3>
            <p style={{ fontSize: '14.5px', color: '#64748b', lineHeight: 1.65, margin: 0 }}>
              Every skill badge and diagnostic result is anchored to a cryptographic SHA-256 hash in MySQL, guaranteeing that every candidate credential is 100% authentic and tamper-proof.
            </p>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '32px 28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#041638', margin: '0 0 12px 0' }}>
              Explainable Algorithmic Fit
            </h3>
            <p style={{ fontSize: '14.5px', color: '#64748b', lineHeight: 1.65, margin: 0 }}>
              No opaque black-box AI filtering. Both candidate and recruiter can inspect the exact weighted compatibility breakdown across languages, frameworks, and prerequisites.
            </p>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '32px 28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#041638', margin: '0 0 12px 0' }}>
              Accreditation Automation
            </h3>
            <p style={{ fontSize: '14.5px', color: '#64748b', lineHeight: 1.65, margin: 0 }}>
              Eliminating months of manual paperwork for universities by automatically compiling NIRF Metric 5.2.1 and NAAC Criterion 5 documentation straight from active placement pipelines.
            </p>
          </div>
        </div>

        {/* Navigation Return */}
        <div style={{ textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={onNavigateHome}
            style={{ padding: '14px 34px', borderRadius: '9999px', background: '#041638', color: '#ffffff', border: 'none', fontSize: '15px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 6px 20px rgba(4, 22, 56, 0.25)' }}
          >
            Return to Home Overview
          </button>
        </div>
      </main>
    </div>
  );
}