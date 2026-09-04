import React, { useEffect } from 'react';
import './CardDetailModal.css';

export default function CardDetailModal({ data, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!data) return null;

  const type = data.type || 'solution';

  return (
    <div className="card-detail-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="card-detail-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="card-detail-modal-header">
          <div>
            <div className={`card-detail-badge ${type}`}>
              {type === 'problem' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
              {type === 'solution' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              {type === 'roadmap' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              )}
              {data.badge || 'Detailed Explanation'}
            </div>
            <h3 className="card-detail-title">{data.title}</h3>
            <p className="card-detail-subtitle">{data.simpleSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="card-detail-close-btn"
            aria-label="Close modal"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="card-detail-modal-body">
          {/* Section 1: In Simple Words */}
          <div className="card-detail-section">
            <span className={`card-detail-section-label ${type}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              In Simple Words
            </span>
            <div className="card-detail-section-box">
              {data.whatItMeans}
            </div>
          </div>

          {/* Section 2: Real-Life Example */}
          <div className="card-detail-section">
            <span className={`card-detail-section-label ${type}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              Real-Life Scenario
            </span>
            <div className="card-detail-section-box">
              {data.realLifeExample}
            </div>
          </div>

          {/* Section 3: Technical Reality */}
          <div className="card-detail-section">
            <span className={`card-detail-section-label ${type}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
                <rect x="9" y="9" width="6" height="6" />
                <line x1="9" y1="1" x2="9" y2="4" />
                <line x1="15" y1="1" x2="15" y2="4" />
                <line x1="9" y1="20" x2="9" y2="23" />
                <line x1="15" y1="20" x2="15" y2="23" />
              </svg>
              How TalentOrbit Handles It
            </span>
            <div className="card-detail-section-box">
              {data.howItWorks}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="card-detail-modal-footer">
          <div className="card-detail-tag-pill">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            <span>{data.statusTag || 'TalentOrbit Platform'}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="card-detail-confirm-btn"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
