import React from 'react';
import './PreFooterCtaBanner.css';

export default function PreFooterCtaBanner({ 
  title = "Hundreds Of Companies Use Us To Hire",
  description = "Gain instant access to a curated pool of responsive, top-tech talent actively seeking verified career opportunities.",
  buttonText = "Get Started",
  onAction,
  imageUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
}) {
  return (
    <section className="prefooter-cta-section">
      <div className="prefooter-cta-container">
        <div className="prefooter-cta-card">
          {/* Left Column: Heading, Subtitle & Action Button */}
          <div className="prefooter-cta-content">
            <h2 className="prefooter-cta-title">
              {title}
            </h2>
            <p className="prefooter-cta-desc">
              {description}
            </p>
            <div className="prefooter-cta-action">
              <button 
                type="button" 
                onClick={onAction}
                className="prefooter-cta-btn"
              >
                <span>{buttonText}</span>
                <svg 
                  className="prefooter-cta-btn-arrow" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Column: Circular White Cutout with Smiling Professional Photo */}
          <div className="prefooter-cta-visual-wrapper">
            <div className="prefooter-cta-circle-backdrop">
              <img 
                src={imageUrl} 
                alt="TalentOrbit Verified Candidate Community" 
                className="prefooter-cta-portrait-img" 
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
