import React, { useState } from 'react';
import StudentSidebar from '../../components/ui/StudentSidebar';
import './StudentDashboard.css';

export default function StudentDashboard({
  currentUser,
  currentTheme,
  onThemeChange,
  onNavigateHome,
  onNavigatePage,
  onLogout
}) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const userName = currentUser?.fullName || 'Student';

  // Functional component switch case rendering the active student feature
  const renderActiveFeature = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="student-dash-canvas">
            <div className="student-dash-canvas-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
            </div>
            <h2 className="student-dash-canvas-title">Student Dashboard Overview</h2>
            <p className="student-dash-canvas-desc">
              Employability readiness score ring, skill gap analytics, stat cards, recommended jobs, and learning roadmap are connected here.
            </p>
          </div>
        );

      case 'assessment':
        return (
          <div className="student-dash-canvas">
            <div className="student-dash-canvas-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 11 3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <h2 className="student-dash-canvas-title">Skill Assessment</h2>
            <p className="student-dash-canvas-desc">
              Interactive technical skill quizzes, automated MCQ evaluations, and competency verification engine.
            </p>
          </div>
        );

      case 'skills':
        return (
          <div className="student-dash-canvas">
            <div className="student-dash-canvas-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h2 className="student-dash-canvas-title">My Skills Matrix</h2>
            <p className="student-dash-canvas-desc">
              Verified technical proficiencies, skill categories, and benchmarking against corporate hiring standards.
            </p>
          </div>
        );

      case 'career':
        return (
          <div className="student-dash-canvas">
            <div className="student-dash-canvas-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            </div>
            <h2 className="student-dash-canvas-title">Career Guidance</h2>
            <p className="student-dash-canvas-desc">
              AI-driven career path recommendations, role fit percentages, and required competency roadmaps.
            </p>
          </div>
        );

      case 'roadmap':
        return (
          <div className="student-dash-canvas">
            <div className="student-dash-canvas-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="6" x2="6" y1="3" y2="15" />
                <circle cx="18" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <path d="M18 9a9 9 0 0 1-9 9" />
              </svg>
            </div>
            <h2 className="student-dash-canvas-title">Learning Roadmap</h2>
            <p className="student-dash-canvas-desc">
              Step-by-step milestone progression, curriculum bridge modules, and career progression goals.
            </p>
          </div>
        );

      case 'opportunities':
        return (
          <div className="student-dash-canvas">
            <div className="student-dash-canvas-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <h2 className="student-dash-canvas-title">Opportunities & Placement Drives</h2>
            <p className="student-dash-canvas-desc">
              Ranked job and internship openings with explainable skill match scores and 1-click applications.
            </p>
          </div>
        );

      case 'applications':
        return (
          <div className="student-dash-canvas">
            <div className="student-dash-canvas-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" x2="8" y1="13" y2="13" />
                <line x1="16" x2="8" y1="17" y2="17" />
                <line x1="10" x2="8" y1="9" y2="9" />
              </svg>
            </div>
            <h2 className="student-dash-canvas-title">Applications Tracker</h2>
            <p className="student-dash-canvas-desc">
              Real-time recruitment funnel tracking: Applied, Shortlisted, Interview Scheduled, and Hired.
            </p>
          </div>
        );

      case 'portfolio':
        return (
          <div className="student-dash-canvas">
            <div className="student-dash-canvas-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 7h10" />
                <path d="M7 12h10" />
                <path d="M7 17h6" />
              </svg>
            </div>
            <h2 className="student-dash-canvas-title">Student Digital Portfolio</h2>
            <p className="student-dash-canvas-desc">
              Academic KYC, verified GitHub repository showcases, live project demos, and work samples.
            </p>
          </div>
        );

      case 'achievements':
        return (
          <div className="student-dash-canvas">
            <div className="student-dash-canvas-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
              </svg>
            </div>
            <h2 className="student-dash-canvas-title">Cryptographic Badges & Achievements</h2>
            <p className="student-dash-canvas-desc">
              Tamper-proof SHA-256 digital credentials verified against MySQL backend and publicly shareable.
            </p>
          </div>
        );

      case 'certificates':
        return (
          <div className="student-dash-canvas">
            <div className="student-dash-canvas-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="18" height="14" x="3" y="5" rx="2" />
                <polyline points="3 7 12 13 21 7" />
              </svg>
            </div>
            <h2 className="student-dash-canvas-title">Verified Certificates</h2>
            <p className="student-dash-canvas-desc">
              Accredited university transcripts, FDP certificates, and industry-sponsored credentials.
            </p>
          </div>
        );

      case 'settings':
        return (
          <div className="student-dash-canvas">
            <div className="student-dash-canvas-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <h2 className="student-dash-canvas-title">Account & Security Settings</h2>
            <p className="student-dash-canvas-desc">
              Manage personal details, university roll number, branch, password change, and notification preferences.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="student-dashboard-root">
      {/* 1. Dedicated Shadcn UI Sidenav (Left side) */}
      <StudentSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
        onNavigateHome={onNavigateHome}
        onLogout={onLogout}
      />

      {/* 2. Main Workspace (Right side) */}
      <div className="student-dashboard-main">
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

          {/* Active Feature Rendered via switch-case */}
          {renderActiveFeature()}
        </main>
      </div>
    </div>
  );
}
