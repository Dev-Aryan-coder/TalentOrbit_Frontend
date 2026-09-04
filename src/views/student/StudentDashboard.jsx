import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import StudentSidebar from '../../components/ui/StudentSidebar';
import StudentSkillOnboardingModal from '../../components/ui/StudentSkillOnboardingModal';
import StudentOverviewTab from '../../components/student/StudentOverviewTab';
import StudentAssessmentTab from '../../components/student/StudentAssessmentTab';
import StudentSkillsTab from '../../components/student/StudentSkillsTab';
import StudentCareerTab from '../../components/student/StudentCareerTab';
import StudentRoadmapTab from '../../components/student/StudentRoadmapTab';
import StudentOpportunitiesTab from '../../components/student/StudentOpportunitiesTab';
import StudentApplicationsTab from '../../components/student/StudentApplicationsTab';
import StudentPortfolioTab from '../../components/student/StudentPortfolioTab';
import StudentAchievementsTab from '../../components/student/StudentAchievementsTab';
import StudentCertificatesTab from '../../components/student/StudentCertificatesTab';
import StudentSettingsTab from '../../components/student/StudentSettingsTab';
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
  const [showSkillOnboardingModal, setShowSkillOnboardingModal] = useState(false);
  const [userSkillsData, setUserSkillsData] = useState(null);

  const userName = currentUser?.fullName || 'Student';
  const userKey = currentUser?.id || currentUser?.email || 'guest';

  // Check if current user has already completed the 4-step skill onboarding
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`talentorbit_skills_onboarded_${userKey}`);
      if (saved) {
        setUserSkillsData(JSON.parse(saved));
      } else {
        // Automatically pop up modal for new students who have not completed onboarding
        setShowSkillOnboardingModal(true);
      }
    } catch (err) {
      console.warn('Could not read onboarding state from storage', err);
      setShowSkillOnboardingModal(true);
    }
  }, [userKey]);

  const handleSkillsOnboardingComplete = (compiledData) => {
    setUserSkillsData(compiledData);
    try {
      localStorage.setItem(`talentorbit_skills_onboarded_${userKey}`, JSON.stringify(compiledData));
    } catch (err) {
      console.error('Could not persist onboarding state to storage', err);
    }
    setShowSkillOnboardingModal(false);
  };

  // Functional component switch case rendering the active student feature
  const renderActiveFeature = () => {
    switch (activeTab) {
      case 'dashboard':
        return <StudentOverviewTab currentUser={currentUser} onSelectTab={setActiveTab} />;

      case 'assessment':
        return <StudentAssessmentTab currentUser={currentUser} onSelectTab={setActiveTab} />;

      case 'skills':
        return (
          <StudentSkillsTab
            currentUser={currentUser}
            onSelectTab={setActiveTab}
            onOpenSkillsModal={() => setShowSkillOnboardingModal(true)}
          />
        );

      case 'career':
        return <StudentCareerTab currentUser={currentUser} onSelectTab={setActiveTab} />;

      case 'roadmap':
        return <StudentRoadmapTab currentUser={currentUser} onSelectTab={setActiveTab} />;

      case 'opportunities':
        return <StudentOpportunitiesTab currentUser={currentUser} onSelectTab={setActiveTab} />;

      case 'applications':
        return <StudentApplicationsTab currentUser={currentUser} onSelectTab={setActiveTab} />;

      case 'portfolio':
        return <StudentPortfolioTab currentUser={currentUser} onSelectTab={setActiveTab} />;

      case 'achievements':
        return <StudentAchievementsTab currentUser={currentUser} onSelectTab={setActiveTab} />;

      case 'certificates':
        return <StudentCertificatesTab currentUser={currentUser} onSelectTab={setActiveTab} />;

      case 'settings':
        return <StudentSettingsTab currentUser={currentUser} onSelectTab={setActiveTab} />;

      default:
        return <StudentOverviewTab currentUser={currentUser} onSelectTab={setActiveTab} />;
    }
  };

  return (
    <SidebarProvider defaultOpen={true} className="student-dashboard-root w-full min-h-screen">
      {/* 1. Official Shadcn UI Sidebar (Left side) */}
      <StudentSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
        onNavigateHome={onNavigateHome}
        onLogout={onLogout}
      />

      {/* 2. Official Shadcn SidebarInset Main Workspace (Right side) */}
      <SidebarInset className="student-dashboard-main">
        <div className="student-dash-content">
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
              <button
                type="button"
                className="student-dash-skills-btn"
                onClick={() => setShowSkillOnboardingModal(true)}
                title="Review or adjust your 4-step skill diagnostic preferences"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>{userSkillsData ? 'Edit Skills Profile' : 'Configure Skills'}</span>
              </button>
            </div>
          </div>

          {/* Active Feature Rendered via switch-case */}
          {renderActiveFeature()}
        </div>
      </SidebarInset>

      {/* 3. Official 4-Step Student Skill Diagnostic Onboarding Modal */}
      <StudentSkillOnboardingModal
        isOpen={showSkillOnboardingModal}
        onClose={() => setShowSkillOnboardingModal(false)}
        currentUser={currentUser}
        onComplete={handleSkillsOnboardingComplete}
      />
    </SidebarProvider>
  );
}
