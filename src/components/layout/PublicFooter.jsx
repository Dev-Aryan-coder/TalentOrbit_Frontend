import React from 'react';
import logoImg from '../../assets/logo.png';
import PreFooterCtaBanner from '../ui/PreFooterCtaBanner';
import './PublicFooter.css';

export function PublicFooter({ onNavigateHome, onNavigatePage, onNavigateRole, showPreFooterCta = true }) {
  const handlePageClick = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onNavigatePage) {
      onNavigatePage(page);
    }
  };

  const handleRoleClick = (role) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onNavigateRole) {
      onNavigateRole(role);
    }
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onNavigateHome) {
      onNavigateHome();
    }
  };

  return (
    <>
      {showPreFooterCta && (
        <PreFooterCtaBanner 
          title="Hundreds Of Companies Use Us To Hire"
          description="Gain instant access to a curated pool of responsive, top-tech talent actively seeking verified career opportunities."
          buttonText="Get Started"
          onAction={() => onNavigatePage ? onNavigatePage('register') : handleRoleClick('industry')}
        />
      )}
      <footer className="public-footer">
      <div className="public-footer-top">
        <div className="public-footer-brand">
          <a 
            href="/"
            onClick={handleHomeClick}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', textDecoration: 'none' }}
          >
            <img 
              src={logoImg} 
              alt="TalentOrbit Emblem" 
              style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="public-footer-brand-title">TalentOrbit</span>
              <span style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#7ce8ff', fontWeight: 700, textTransform: 'uppercase', marginTop: '3px' }}>
                CONNECT • GROW • SUCCEED
              </span>
            </div>
          </a>
          <p className="public-footer-brand-desc">
            National Higher Education & Industry Career Intelligence Network designed for Smart India Hackathon Problem Statement #26044.
          </p>
        </div>

        <div className="public-footer-links-group">
          <div>
            <h4 className="public-footer-col-title">Role Portals</h4>
            <ul className="public-footer-nav">
              <li>
                <button type="button" onClick={() => handleRoleClick('student')} className="public-footer-link">
                  Student Portal
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleRoleClick('industry')} className="public-footer-link">
                  Industry Recruiter
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleRoleClick('academician')} className="public-footer-link">
                  Faculty & Research
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleRoleClick('institution')} className="public-footer-link">
                  Institution TPO
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="public-footer-col-title">Navigation</h4>
            <ul className="public-footer-nav">
              <li>
                <button type="button" onClick={() => handlePageClick('how-it-works')} className="public-footer-link">
                  How It Works
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handlePageClick('features')} className="public-footer-link">
                  Features
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handlePageClick('about-us')} className="public-footer-link">
                  About Us
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handlePageClick('contact')} className="public-footer-link">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="public-footer-col-title">Technology</h4>
            <ul className="public-footer-nav">
              <li><span className="public-footer-link" style={{ cursor: 'default' }}>Spring Boot 3.4.2</span></li>
              <li><span className="public-footer-link" style={{ cursor: 'default' }}>React 19 & Vite</span></li>
              <li><span className="public-footer-link" style={{ cursor: 'default' }}>Groq AI Diagnostics</span></li>
              <li><span className="public-footer-link" style={{ cursor: 'default' }}>MySQL 8.0 Verified</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="public-footer-bottom">
        <span>© 2026 TalentOrbit. Built for National Higher Education & Industry Innovation.</span>
        <span style={{ color: '#7ce8ff' }}>Production Architecture Verified</span>
      </div>
    </footer>
    </>
  );
}

export default PublicFooter;