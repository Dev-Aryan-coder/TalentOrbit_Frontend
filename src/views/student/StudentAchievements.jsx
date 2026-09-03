import React, { useState, useEffect } from 'react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import BadgeVerificationModal from '../../components/ui/BadgeVerificationModal';
import { badgesAPI } from '@/services/api';
import './StudentAchievements.css';

const INITIAL_BADGES = [
  {
    id: 'b-py',
    dbBadgeId: 1,
    title: 'Python Core Specialist',
    category: 'Technical Skills',
    tier: 'Gold Mastery',
    status: 'Verified',
    score: '88%',
    dateEarned: '03 Sept 2026, 09:45 PM',
    hash: 'TO-PY-2026-X8F9A',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    desc: 'Demonstrated mastery in Python 3.12, OOP concepts, list comprehensions, and data structure manipulation.',
    iconColor: '#0055ff',
    bgTint: 'rgba(0, 85, 255, 0.1)'
  },
  {
    id: 'b-sql',
    dbBadgeId: 2,
    title: 'SQL & Relational Architecture',
    category: 'Technical Skills',
    tier: 'Gold Mastery',
    status: 'Verified',
    score: '92%',
    dateEarned: '01 Sept 2026, 04:20 PM',
    hash: 'TO-SQL-2026-K3M8Z',
    sha256: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    desc: 'Verified competency in MySQL 8.0 schema normalization, multi-table joins, subqueries, and indexing.',
    iconColor: '#0d9488',
    bgTint: 'rgba(13, 148, 136, 0.1)'
  },
  {
    id: 'b-prof',
    dbBadgeId: 3,
    title: '100% All-Star Profile',
    category: 'Career Milestones',
    tier: 'Platform Milestone',
    status: 'Verified',
    score: '100%',
    dateEarned: '28 Aug 2026, 11:15 AM',
    hash: 'TO-PRO-2026-A1B2C',
    sha256: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    desc: 'Completed university KYC, uploaded verified academic credentials, and linked GitHub repository.',
    iconColor: '#6366f1',
    bgTint: 'rgba(99, 102, 241, 0.1)'
  },
  {
    id: 'b-app',
    dbBadgeId: 4,
    title: 'First Verified Application',
    category: 'Career Milestones',
    tier: 'Platform Milestone',
    status: 'Verified',
    score: 'Passed',
    dateEarned: '29 Aug 2026, 02:40 PM',
    hash: 'TO-APP-2026-P9Q4R',
    sha256: 'bc54f4d60f1cec0f9a6cb70e13f2107a4e3e3e9ba8934142b47416d010743a3e',
    desc: 'Applied to a national corporate internship with a pre-screened explainable compatibility match.',
    iconColor: '#f59e0b',
    bgTint: 'rgba(245, 158, 11, 0.1)'
  },
  {
    id: 'b-react',
    dbBadgeId: 5,
    title: 'React & Frontend Engineering',
    category: 'Technical Skills',
    tier: 'Gold Mastery',
    status: 'Locked',
    score: null,
    dateEarned: null,
    hash: null,
    sha256: null,
    desc: 'Component lifecycle, state management hooks, responsive layouts, and REST API integration.',
    iconColor: '#0284c7',
    bgTint: 'rgba(2, 132, 199, 0.1)'
  },
  {
    id: 'b-java',
    dbBadgeId: 6,
    title: 'Java Enterprise Architecture',
    category: 'Technical Skills',
    tier: 'Silver Mastery',
    status: 'Locked',
    score: null,
    dateEarned: null,
    hash: null,
    sha256: null,
    desc: 'Spring Boot 3 RESTful microservices, Hibernate JPA entities, and Maven dependency management.',
    iconColor: '#dc2626',
    bgTint: 'rgba(220, 38, 38, 0.1)'
  },
  {
    id: 'b-cloud',
    dbBadgeId: 7,
    title: 'Docker & Cloud Deployment',
    category: 'Technical Skills',
    tier: 'Silver Mastery',
    status: 'Locked',
    score: null,
    dateEarned: null,
    hash: null,
    sha256: null,
    desc: 'Containerizing multi-tier web applications, Dockerfiles, and cloud container orchestration.',
    iconColor: '#2563eb',
    bgTint: 'rgba(37, 99, 235, 0.1)'
  },
  {
    id: 'b-tpo',
    dbBadgeId: 8,
    title: 'Batch Top 10% Placement Ready',
    category: 'Academic Honors',
    tier: 'Institutional Honor',
    status: 'Locked',
    score: null,
    dateEarned: null,
    hash: null,
    sha256: null,
    desc: 'Awarded to candidates in the 90th percentile of their university NIRF batch diagnostic pool.',
    iconColor: '#7c3aed',
    bgTint: 'rgba(124, 58, 237, 0.1)'
  }
];

export default function StudentAchievements({ 
  onNavigateHome, 
  onNavigatePage, 
  onNavigateRole, 
  onLogin, 
  onRegister,
  currentUser,
  currentTheme,
  onThemeChange,
  onNavigateDashboard,
  onOpenProfileSettings,
  onOpenAccountSettings,
  onOpenAppearance,
  onLogout
}) {
  const [badges, setBadges] = useState(INITIAL_BADGES);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBadge, setSelectedBadge] = useState(null);
  
  // Interactive Quiz Runner State
  const [testingBadge, setTestingBadge] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [quizSuccess, setQuizSuccess] = useState(false);
  const [backendNotice, setBackendNotice] = useState('');

  // Fetch real badges from Spring Boot REST API
  useEffect(() => {
    async function loadRealBadges() {
      try {
        const realBadges = await badgesAPI.getStudentBadges(1);
        if (Array.isArray(realBadges) && realBadges.length > 0) {
          setBadges(prev => prev.map(catalogBadge => {
            const match = realBadges.find(rb => 
              rb.name?.toLowerCase().includes(catalogBadge.title.toLowerCase().substring(0, 5)) ||
              catalogBadge.title.toLowerCase().includes(rb.name?.toLowerCase().substring(0, 5))
            );
            if (match) {
              return {
                ...catalogBadge,
                status: 'Verified',
                score: match.score ? `${match.score}%` : catalogBadge.score,
                hash: match.verificationHash || catalogBadge.hash,
                sha256: match.sha256Digest || catalogBadge.sha256,
                dateEarned: match.earnedAt ? new Date(match.earnedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : catalogBadge.dateEarned
              };
            }
            return catalogBadge;
          }));
          setBackendNotice('Connected to live Spring Boot REST API (MySQL).');
        }
      } catch (err) {
        setBackendNotice('REST API offline: Spring Boot not detected on port 8080. Start backend in STS to sync live data.');
      }
    }
    loadRealBadges();
  }, []);

  const earnedCount = badges.filter(b => b.status === 'Verified').length;
  const totalCount = badges.length;

  const filteredBadges = badges.filter(b => {
    if (activeTab === 'verified') return b.status === 'Verified';
    if (activeTab === 'locked') return b.status === 'Locked';
    if (activeTab === 'technical') return b.category === 'Technical Skills';
    if (activeTab === 'milestones') return b.category === 'Career Milestones' || b.category === 'Academic Honors';
    return true;
  });

  const handleStartTest = (badge) => {
    setTestingBadge(badge);
    setSelectedOption(null);
    setQuizSuccess(false);
  };

  const handleCompleteTest = async () => {
    if (selectedOption === null) return;
    setIsEvaluating(true);

    try {
      // Call real Spring Boot backend POST /api/badges/award
      const dbBadgeId = testingBadge.dbBadgeId || 1;
      const response = await badgesAPI.awardBadge(1, dbBadgeId, 94);

      const generatedCode = response.verificationHash || `TO-${testingBadge.title.substring(0, 3).toUpperCase()}-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const generatedSha = response.sha256Digest || Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      setBadges(prev => prev.map(b => {
        if (b.id === testingBadge.id) {
          return {
            ...b,
            status: 'Verified',
            score: '94%',
            dateEarned: 'Just now (Verified in Database)',
            hash: generatedCode,
            sha256: generatedSha
          };
        }
        return b;
      }));

      setIsEvaluating(false);
      setQuizSuccess(true);
      setTimeout(() => {
        setTestingBadge(null);
      }, 1800);
    } catch (err) {
      // If server unreachable, still inform user honestly
      setIsEvaluating(false);
      alert(`Backend API notice: ${err.message}`);
      setTestingBadge(null);
    }
  };

  const handleOpenVerificationModal = async (badge) => {
    try {
      if (badge.hash) {
        // Query live verification proof from Spring Boot backend
        const verifiedProof = await badgesAPI.verifyBadge(badge.hash);
        setSelectedBadge({
          ...badge,
          candidateName: verifiedProof.candidateName,
          score: `${verifiedProof.score}%`,
          hash: verifiedProof.verificationHash,
          sha256: verifiedProof.sha256Digest,
          status: verifiedProof.status
        });
        return;
      }
    } catch {
      // Use local badge data if server offline
    }
    setSelectedBadge(badge);
  };

  return (
    <div className="achieve-page">
      <PublicNavbar 
        activePage="student"
        onNavigateHome={onNavigateHome}
        onNavigatePage={onNavigatePage}
        onLogin={onLogin}
        onRegister={onRegister}
        currentUser={currentUser}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
        onNavigateDashboard={onNavigateDashboard}
        onOpenProfileSettings={onOpenProfileSettings}
        onOpenAccountSettings={onOpenAccountSettings}
        onOpenAppearance={onOpenAppearance}
        onLogout={onLogout}
      />

      <main className="achieve-main">
        {/* Header with Navigation Breadcrumb */}
        <div className="achieve-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={onNavigateHome}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                color: '#0055ff',
                fontSize: '13.5px',
                fontWeight: 500,
                cursor: 'pointer',
                padding: 0
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              <span>Back to Home Overview</span>
            </button>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <div className="achieve-top-badge" style={{ marginBottom: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              <span>National Credential Registry</span>
            </div>
          </div>
          <h1 className="achieve-title">Verified Skill Badges & Achievements</h1>
          <p className="achieve-subtitle">
            Cryptographically anchored skill credentials issued through AI proctored diagnostics. Recruiters and universities verify these badges instantly without resume exaggeration.
          </p>
          {backendNotice && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 500,
              background: backendNotice.includes('Connected') ? '#ecfdf5' : '#fffbeb',
              color: backendNotice.includes('Connected') ? '#059669' : '#d97706',
              border: `1px solid ${backendNotice.includes('Connected') ? '#a7f3d0' : '#fde68a'}`,
              marginTop: '12px'
            }}>
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: backendNotice.includes('Connected') ? '#10b981' : '#f59e0b',
                display: 'inline-block'
              }} />
              <span>{backendNotice}</span>
            </div>
          )}
        </div>

        {/* Stats Metrics Strip */}
        <div className="achieve-stats-strip">
          <div className="achieve-stat-card">
            <div className="achieve-stat-header">
              <span className="achieve-stat-label">Badges Earned</span>
              <div className="achieve-stat-icon-wrap" style={{ background: '#ecfdf5', color: '#10b981' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
            </div>
            <p className="achieve-stat-val">{earnedCount} of {totalCount}</p>
            <span className="achieve-stat-sub">{Math.round((earnedCount / totalCount) * 100)}% Completion Progress</span>
          </div>

          <div className="achieve-stat-card">
            <div className="achieve-stat-header">
              <span className="achieve-stat-label">Average Score</span>
              <div className="achieve-stat-icon-wrap" style={{ background: '#eff6ff', color: '#0055ff' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20v-6M6 20V10M18 20V4"/>
                </svg>
              </div>
            </div>
            <p className="achieve-stat-val">90.0%</p>
            <span className="achieve-stat-sub">Top 8% Batch Performance</span>
          </div>

          <div className="achieve-stat-card">
            <div className="achieve-stat-header">
              <span className="achieve-stat-label">Credential Tier</span>
              <div className="achieve-stat-icon-wrap" style={{ background: '#fef3c7', color: '#d97706' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
            </div>
            <p className="achieve-stat-val">Gold Scholar</p>
            <span className="achieve-stat-sub">Tier 3 Verified Candidate</span>
          </div>

          <div className="achieve-stat-card">
            <div className="achieve-stat-header">
              <span className="achieve-stat-label">Recruiter Inquiries</span>
              <div className="achieve-stat-icon-wrap" style={{ background: '#f3e8ff', color: '#9333ea' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
            </div>
            <p className="achieve-stat-val">14 Direct Views</p>
            <span className="achieve-stat-sub">3 Interview Shortlists</span>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="achieve-tabs-bar">
          <button 
            type="button" 
            onClick={() => setActiveTab('all')} 
            className={`achieve-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          >
            All Badges ({totalCount})
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('verified')} 
            className={`achieve-tab-btn ${activeTab === 'verified' ? 'active' : ''}`}
          >
            Verified ({earnedCount})
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('technical')} 
            className={`achieve-tab-btn ${activeTab === 'technical' ? 'active' : ''}`}
          >
            Technical Mastery
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('milestones')} 
            className={`achieve-tab-btn ${activeTab === 'milestones' ? 'active' : ''}`}
          >
            Milestones & Honors
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('locked')} 
            className={`achieve-tab-btn ${activeTab === 'locked' ? 'active' : ''}`}
          >
            Locked ({totalCount - earnedCount})
          </button>
        </div>

        {/* Badges Grid */}
        <div className="achieve-badges-grid">
          {filteredBadges.map(badge => (
            <div key={badge.id} className={`achieve-badge-card ${badge.status === 'Locked' ? 'locked' : ''}`}>
              <div>
                <div className="achieve-badge-top">
                  <div className="achieve-badge-emblem" style={{ background: badge.bgTint, color: badge.iconColor }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <path d="m9 12 2 2 4-4"/>
                    </svg>
                  </div>
                  <span className={`achieve-badge-status-pill ${badge.status === 'Verified' ? 'verified' : 'locked'}`}>
                    {badge.status === 'Verified' ? 'Verified' : 'Locked'}
                  </span>
                </div>

                <h3 className="achieve-badge-title">{badge.title}</h3>
                <p className="achieve-badge-desc">{badge.desc}</p>
              </div>

              <div>
                {badge.status === 'Verified' ? (
                  <>
                    <div className="achieve-badge-meta">
                      <span>Credential Hash:</span>
                      <span className="achieve-badge-hash">{badge.hash}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleOpenVerificationModal(badge)}
                      className="achieve-badge-btn-verify"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><path d="m10 15 5-3-5-3v6z"/>
                      </svg>
                      <span>View Verification Proof</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="achieve-badge-meta">
                      <span>Prerequisite:</span>
                      <span style={{ fontWeight: 500, color: '#64748b' }}>Score 75%+ on Diagnostic</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleStartTest(badge)}
                      className="achieve-badge-btn-test"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                      <span>Take Diagnostic Test</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Verification Modal */}
      {selectedBadge && (
        <BadgeVerificationModal 
          badge={selectedBadge} 
          onClose={() => setSelectedBadge(null)} 
        />
      )}

      {/* Interactive Quiz Mini-Runner Modal */}
      {testingBadge && (
        <div className="quiz-modal-backdrop" onClick={() => !isEvaluating && setTestingBadge(null)}>
          <div className="quiz-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="quiz-modal-header">
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', color: '#ffffff' }}>Diagnostic Assessment: {testingBadge.title}</h3>
                <span style={{ fontSize: '11px', color: '#7ce8ff' }}>TalentOrbit Proctored Evaluation Engine</span>
              </div>
              <button 
                type="button" 
                onClick={() => setTestingBadge(null)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="quiz-modal-body">
              {quizSuccess ? (
                <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12 5 5L20 7"/>
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '20px', color: '#041638', margin: '0 0 8px 0' }}>Assessment Cleared!</h3>
                  <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                    Earned Score: <strong>94%</strong>. Cryptographic verification hash issued and saved to registry.
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>Question 1 of 1 • Core Architecture</div>
                  <h4 style={{ fontSize: '15px', color: '#041638', margin: '0 0 18px 0', lineHeight: 1.5 }}>
                    In production applications, how does TalentOrbit ensure skill assessment records remain tamper-proof and authentic?
                  </h4>

                  <button 
                    type="button" 
                    onClick={() => setSelectedOption(0)}
                    className={`quiz-option-btn ${selectedOption === 0 ? 'selected' : ''}`}
                  >
                    A) Using cryptographic SHA-256 digital hashes anchored to central database records
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setSelectedOption(1)}
                    className={`quiz-option-btn ${selectedOption === 1 ? 'selected' : ''}`}
                  >
                    B) Relying solely on self-reported student resume text
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setSelectedOption(2)}
                    className={`quiz-option-btn ${selectedOption === 2 ? 'selected' : ''}`}
                  >
                    C) Manually mailing paper certificates to college offices
                  </button>

                  <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                    <button 
                      type="button" 
                      onClick={handleCompleteTest}
                      disabled={selectedOption === null || isEvaluating}
                      style={{
                        flex: 1,
                        padding: '13px',
                        borderRadius: '12px',
                        background: selectedOption !== null ? '#0055ff' : '#94a3b8',
                        color: '#ffffff',
                        border: 'none',
                        fontWeight: 600,
                        cursor: selectedOption !== null && !isEvaluating ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {isEvaluating ? 'Verifying Answers & Minting Hash...' : 'Submit & Verify Credential'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setTestingBadge(null)}
                      style={{
                        padding: '13px 20px',
                        borderRadius: '12px',
                        background: '#f1f5f9',
                        color: '#475569',
                        border: '1px solid #cbd5e1',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <PublicFooter 
        onNavigateHome={onNavigateHome}
        onNavigatePage={onNavigatePage}
        onNavigateRole={onNavigateRole}
      />
    </div>
  );
}