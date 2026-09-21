import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import InstitutionSidebar from '../../components/institution/InstitutionSidebar';
import InstitutionOverviewTab from '../../components/institution/InstitutionOverviewTab';
import InstitutionSkillHeatmapTab from '../../components/institution/InstitutionSkillHeatmapTab';
import InstitutionIndustryDemandTab from '../../components/institution/InstitutionIndustryDemandTab';
import InstitutionBootcampsTab from '../../components/institution/InstitutionBootcampsTab';
import InstitutionStudentsTab from '../../components/institution/InstitutionStudentsTab';
import InstitutionPlacementsTab from '../../components/institution/InstitutionPlacementsTab';
import InstitutionReportsTab from '../../components/institution/InstitutionReportsTab';
import InstitutionProfileTab from '../../components/institution/InstitutionProfileTab';
import {
  Building2,
  ShieldCheck,
  Zap,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { institutionAPI } from '../../services/api';
import { Separator } from '@/components/ui/separator';

export default function InstitutionDashboard({
  currentUser,
  currentTheme = 'light',
  onThemeChange,
  onNavigateHome,
  onNavigatePage,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState(null);

  const userId = currentUser?.id || currentUser?.userId || 1;

  useEffect(() => {
    let isMounted = true;
    institutionAPI.getInstitutionDetails(userId)
      .then((data) => {
        if (isMounted && data) {
          setProfileData(data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const institutionName =
    profileData?.institutionName ||
    currentUser?.institutionName ||
    currentUser?.collegeName ||
    'National Institute of Technology';

  const aisheCode =
    profileData?.aisheCode ||
    currentUser?.aisheCode ||
    'C-33772';

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <InstitutionOverviewTab
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        );

      case 'skill_heatmap':
        return (
          <InstitutionSkillHeatmapTab
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        );

      case 'industry_demand':
        return (
          <InstitutionIndustryDemandTab
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        );

      case 'bootcamps':
        return (
          <InstitutionBootcampsTab
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        );

      case 'students':
        return (
          <InstitutionStudentsTab
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        );

      case 'placements':
        return (
          <InstitutionPlacementsTab
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        );

      case 'reports':
        return (
          <InstitutionReportsTab
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        );

      case 'profile':
        return (
          <InstitutionProfileTab
            currentUser={currentUser}
            onProfileUpdated={(up) => setProfileData(up)}
          />
        );

      default:
        return (
          <InstitutionOverviewTab
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        );
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
        {/* Left Responsive Navigation Sidebar */}
        <InstitutionSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          currentUser={currentUser}
          currentTheme={currentTheme}
          onThemeChange={onThemeChange}
          onNavigateHome={onNavigateHome}
          onLogout={onLogout}
        />

        {/* Main Content Area */}
        <SidebarInset className="flex-1 overflow-x-hidden min-w-0 bg-slate-50 dark:bg-slate-950">
          {/* Top Operational Header */}
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 sm:px-6 backdrop-blur-md">
            <SidebarTrigger className="-ml-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            {/* Breadcrumbs / Context */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 min-w-0">
              <span className="truncate max-w-[180px] sm:max-w-xs">{institutionName}</span>
              <span>/</span>
              <span className="text-indigo-600 dark:text-indigo-400 capitalize">
                {activeTab.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                <ShieldCheck size={12} />
                AISHE Verified: {aisheCode}
              </span>

              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-semibold border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                onClick={() => setActiveTab('skill_heatmap')}
              >
                <Zap size={13} className="mr-1 text-amber-500" />
                <span>Heatmap</span>
              </Button>
            </div>
          </header>

          {/* Active Tab View Body */}
          <main className="flex-1 pb-16">
            {renderActiveTabContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
