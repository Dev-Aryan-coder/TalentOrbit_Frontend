import React from 'react';
import './StudentDashboard.css';

export default function StudentDashboard({
  currentUser,
  currentTheme,
  onThemeChange,
  onNavigateHome,
  onNavigatePage,
  onLogout
}) {
  const userName = currentUser?.fullName || 'Student';
  const userInitials = userName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'ST';

  const toggleTheme = () => {
    if (onThemeChange) {
      onThemeChange(currentTheme === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <div className="student-dashboard-root">
      {/* Internal Dashboard Navigation Bar (No PublicNavbar) */}
      <header className="student-dash-nav">
        <div className="student-dash-nav-left">
          <button 
            type="button" 
            className="student-dash-brand"
            onClick={onNavigateHome}
            aria-label="TalentOrbit Home"
          >
            <div className="student-dash-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <span className="student-dash-brand-title">TalentOrbit</span>
          </button>
          <span className="student-dash-role-badge">Student Portal</span>
        </div>

        <div className="student-dash-nav-right">
          <button
            type="button"
            className="student-dash-nav-btn"
            onClick={onNavigateHome}
            title="Return to Public Website"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Back to Home</span>
          </button>

          <button
            type="button"
            className="student-dash-theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            title={currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {currentTheme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <div className="student-dash-user-pill">
            <div className="student-dash-avatar">{userInitials}</div>
            <span className="student-dash-user-name">{userName}</span>
          </div>

          {onLogout && (
            <button
              type="button"
              className="student-dash-nav-btn"
              onClick={onLogout}
              title="Log Out"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Dashboard Canvas (No PublicFooter) */}
      <main className="student-dash-content">
        {/* Welcome Banner */}
        <div className="student-dash-hero">
          <div className="student-dash-hero-text">
            <h1>Welcome back, {userName}</h1>
            <p>
              Your personal career, skills diagnostic, and verified credential workspace. All verified competency badges and institutional placements are tracked here.
            </p>
          </div>
          <div className="student-dash-hero-badges">
            <div className="student-dash-stat-chip">
              <div className="student-dash-stat-val">Verified</div>
              <div className="student-dash-stat-lbl">Account Status</div>
            </div>
            <div className="student-dash-stat-chip">
              <div className="student-dash-stat-val">Active</div>
              <div className="student-dash-stat-lbl">Placement Cycle</div>
            </div>
          </div>
        </div>

        {/* Dashboard Canvas Container */}
        <div className="student-dash-canvas">
          <div className="student-dash-canvas-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect width="7" height="9" x="3" y="3" rx="1" />
              <rect width="7" height="5" x="14" y="3" rx="1" />
              <rect width="7" height="9" x="14" y="12" rx="1" />
              <rect width="7" height="5" x="3" y="16" rx="1" />
            </svg>
          </div>
          <h2 className="student-dash-canvas-title">Student Dashboard Ready</h2>
          <p className="student-dash-canvas-desc">
            Isolated dashboard view loaded without public navbar or public footer. Ready for your dashboard widgets, statistics, and modules.
          </p>
        </div>
      </main>
    </div>
  );
}
