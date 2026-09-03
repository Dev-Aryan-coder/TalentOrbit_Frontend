import React from 'react';
import { Button } from './button';
import './AppearanceModal.css';

export default function AppearanceModal({ isOpen, onClose, currentTheme, onThemeChange }) {
  if (!isOpen) return null;

  const handleSelect = (themeKey) => {
    if (onThemeChange) {
      onThemeChange(themeKey);
    }
  };

  return (
    <div className="appearance-modal-overlay" onClick={onClose}>
      <div className="appearance-modal-card animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="appearance-modal-header">
          <div>
            <h2 className="appearance-modal-title">Appearance & Theme</h2>
            <p className="appearance-modal-sub">Customize the visual interface color scheme for your workspace</p>
          </div>
          <button type="button" onClick={onClose} className="appearance-modal-close-btn" aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body Options */}
        <div className="appearance-modal-body">
          <p className="appearance-instruction">
            Choose your preferred color theme below:
          </p>

          <div className="appearance-options-grid">
            {/* Option 1: Default (Off-White / Light Mode) */}
            <div
              className={`appearance-card ${currentTheme !== 'dark' ? 'selected' : ''}`}
              onClick={() => handleSelect('light')}
            >
              <div className="appearance-preview light">
                <div className="preview-nav light">
                  <div className="preview-dot" />
                  <div className="preview-line short" />
                </div>
                <div className="preview-body light">
                  <div className="preview-card-shape light" />
                  <div className="preview-card-shape light accent" />
                </div>
              </div>

              <div className="appearance-card-footer">
                <div className="appearance-radio">
                  <input
                    type="radio"
                    id="theme-light"
                    name="site-theme"
                    checked={currentTheme !== 'dark'}
                    onChange={() => handleSelect('light')}
                  />
                  <label htmlFor="theme-light">
                    <span className="theme-title">Off-White (Default)</span>
                    <span className="theme-desc">Crisp, clean high-contrast daytime interface</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Option 2: Black Mode (Dark Mode) */}
            <div
              className={`appearance-card ${currentTheme === 'dark' ? 'selected' : ''}`}
              onClick={() => handleSelect('dark')}
            >
              <div className="appearance-preview dark">
                <div className="preview-nav dark">
                  <div className="preview-dot blue" />
                  <div className="preview-line short dark" />
                </div>
                <div className="preview-body dark">
                  <div className="preview-card-shape dark" />
                  <div className="preview-card-shape dark accent" />
                </div>
              </div>

              <div className="appearance-card-footer">
                <div className="appearance-radio">
                  <input
                    type="radio"
                    id="theme-dark"
                    name="site-theme"
                    checked={currentTheme === 'dark'}
                    onChange={() => handleSelect('dark')}
                  />
                  <label htmlFor="theme-dark">
                    <span className="theme-title">Black Mode (Dark)</span>
                    <span className="theme-desc">Deep slate dark mode engineered for eye comfort</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="appearance-modal-footer">
          <Button type="button" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
