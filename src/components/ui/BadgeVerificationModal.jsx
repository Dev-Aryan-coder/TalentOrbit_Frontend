import React, { useState } from 'react';
import logoImg from '../../assets/logo.png';
import './BadgeVerificationModal.css';

export function BadgeVerificationModal({ badge, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!badge) return null;

  const verificationUrl = `https://talentorbit.in/verify/${badge.hash || 'TO-2026-VERIFIED'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="badge-modal-backdrop" onClick={onClose}>
      <div className="badge-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header with National Registry Seal */}
        <div className="badge-modal-header">
          <div className="badge-modal-header-brand">
            <img src={logoImg} alt="TalentOrbit" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            <div>
              <h3 className="badge-modal-header-title">Official Credential Verification</h3>
              <div className="badge-modal-header-subtitle">National Career & Skill Registry • SIH #26044</div>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="badge-modal-close-btn"
            aria-label="Close modal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Certificate Body */}
        <div className="badge-modal-body">
          {/* Badge Seal Banner */}
          <div className="badge-certificate-seal">
            <div className="badge-seal-left">
              <div className="badge-seal-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              <div>
                <h4 className="badge-seal-badge-name">{badge.title}</h4>
                <div className="badge-seal-badge-category">{badge.category} • Tier: {badge.tier || 'Mastery'}</div>
              </div>
            </div>
            <div className="badge-status-pill-verified">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12 5 5L20 7"/>
              </svg>
              <span>{badge.status || 'Verified'}</span>
            </div>
          </div>

          {/* Assessment Metadata Grid */}
          <div className="badge-details-grid">
            <div className="badge-detail-card">
              <div className="badge-detail-label">Candidate Name</div>
              <div className="badge-detail-value">{badge.candidateName || 'Aryan Sharma'}</div>
            </div>
            <div className="badge-detail-card">
              <div className="badge-detail-label">Verified Score</div>
              <div className="badge-detail-value" style={{ color: '#0055ff' }}>{badge.score || '88%'} (Top 10% Batch)</div>
            </div>
            <div className="badge-detail-card">
              <div className="badge-detail-label">Evaluation Engine</div>
              <div className="badge-detail-value">Groq AI Proctored Diagnostic</div>
            </div>
            <div className="badge-detail-card">
              <div className="badge-detail-label">Date Verified</div>
              <div className="badge-detail-value">{badge.dateEarned || '03 Sept 2026, 09:45 PM'}</div>
            </div>
          </div>

          {/* Cryptographic Hash Details */}
          <div className="badge-hash-box">
            <div className="badge-hash-header">
              <span className="badge-hash-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Tamper-Proof Credential Hash ID
              </span>
              <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>Active In Registry</span>
            </div>
            <div className="badge-hash-code">{badge.hash || 'TO-PY-2026-X8F9A'}</div>
            <div className="badge-sha256-row">
              SHA-256 Digest: {badge.sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
            </div>
          </div>

          {/* Actions */}
          <div className="badge-modal-actions">
            <button 
              type="button" 
              onClick={handleCopyLink} 
              className="badge-btn-copy"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
              <span>{copied ? 'Verification Link Copied!' : 'Copy Public Verification Link'}</span>
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="badge-btn-close-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BadgeVerificationModal;