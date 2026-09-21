import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AcademicianSidebar from '../../components/academician/AcademicianSidebar';
import AcademicianOverviewTab from '../../components/academician/AcademicianOverviewTab';
import AcademicianOpportunitiesTab from '../../components/academician/AcademicianOpportunitiesTab';
import FacultyFDPProgramsTab from '../../components/academician/FacultyFDPProgramsTab';
import FacultyIndustryTrainingTab from '../../components/academician/FacultyIndustryTrainingTab';
import FacultyResearchProjectsTab from '../../components/academician/FacultyResearchProjectsTab';
import FacultyConsultancyTab from '../../components/academician/FacultyConsultancyTab';
import FacultyWorkshopsTab from '../../components/academician/FacultyWorkshopsTab';
import AcademicianCollaborationsTab from '../../components/academician/AcademicianCollaborationsTab';
import AcademicianInterestsTab from '../../components/academician/AcademicianInterestsTab';
import AcademicianProfileTab from '../../components/academician/AcademicianProfileTab';
import AcademicianHelpTab from '../../components/academician/AcademicianHelpTab';
import {
  GraduationCap,
  ShieldCheck,
  PlusCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { academicianAPI } from '../../services/api';
import { Separator } from '@/components/ui/separator';
import './AcademicianDashboard.css';

export default function AcademicianDashboard({
  currentUser,
  currentTheme = 'light',
  onThemeChange,
  onNavigateHome,
  onNavigatePage,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState(null);

  const facultyId = currentUser?.id || currentUser?.userId || 1;

  useEffect(() => {
    let isMounted = true;
    academicianAPI.getProfile(facultyId)
      .then((data) => {
        if (isMounted && data) {
          setProfileData(data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [facultyId]);

  const facultyName = profileData?.name || currentUser?.fullName || 'Faculty Member';
  const institutionName = profileData?.institutionName || currentUser?.institutionName || currentUser?.collegeName || 'Academic Institution';

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <AcademicianOverviewTab
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        );

      case 'opportunities':
        return (
          <AcademicianOpportunitiesTab
            currentUser={currentUser}
            defaultType="ALL"
          />
        );

      case 'fdp':
        return (
          <FacultyFDPProgramsTab
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        );

      case 'training':
        return (
          <FacultyIndustryTrainingTab
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        );

      case 'research':
        return (
          <FacultyResearchProjectsTab
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        );

      case 'consultancy':
        return (
          <FacultyConsultancyTab
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        );

      case 'workshops':
        return (
          <FacultyWorkshopsTab
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        );

      case 'collaborations':
        return (
          <AcademicianCollaborationsTab
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        );

      case 'interests':
        return <AcademicianInterestsTab currentUser={currentUser} />;

      case 'profile':
        return <AcademicianProfileTab currentUser={currentUser} />;

      case 'help':
        return <AcademicianHelpTab currentUser={currentUser} />;

      default:
        return (
          <AcademicianOverviewTab
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        );
    }
  };

  return (
    <SidebarProvider defaultOpen={true} className="academician-dashboard-root w-full h-screen max-h-screen overflow-hidden">
      {/* 1. Emerald Academician Enterprise Sidebar */}
      <AcademicianSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
        onNavigateHome={onNavigateHome}
        onLogout={onLogout}
      />

      {/* 2. Main Workspace Inset */}
      <SidebarInset className="academician-dashboard-main flex-1 h-screen overflow-y-auto bg-slate-50/50 dark:bg-slate-950">
        {/* Top Header Bar with Shadcn Badges & Buttons */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                {institutionName}
              </span>
              <Badge variant="emerald" className="gap-1 font-semibold text-[10px] py-0 px-2 shrink-0">
                <ShieldCheck size={12} /> Verified Faculty
              </Badge>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
              {activeTab.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              size="sm"
              onClick={() => setActiveTab('opportunities')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-8 shadow-sm gap-1"
            >
              <PlusCircle size={14} /> Explore Calls
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateHome}
              className="text-xs flex items-center gap-1 font-medium h-8"
              title="View Public Portal"
            >
              <ExternalLink size={14} /> Public Portal
            </Button>

            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {facultyName[0] || 'D'}
            </div>
          </div>
        </header>

        {/* Dynamic Tab Content */}
        <main className="p-6">
          {renderActiveTabContent()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
