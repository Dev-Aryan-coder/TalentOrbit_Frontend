import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import RecruiterSidebar from '../../components/recruiter/RecruiterSidebar';
import RecruiterOverviewTab from '../../components/recruiter/RecruiterOverviewTab';
import RecruiterPostingsTab from '../../components/recruiter/RecruiterPostingsTab';
import RecruiterAtsPipelineTab from '../../components/recruiter/RecruiterAtsPipelineTab';
import RecruiterTalentPoolTab from '../../components/recruiter/RecruiterTalentPoolTab';
import RecruiterInterviewsTab from '../../components/recruiter/RecruiterInterviewsTab';
import RecruiterHiredTab from '../../components/recruiter/RecruiterHiredTab';
import RecruiterProfileTab from '../../components/recruiter/RecruiterProfileTab';
import {
  Building2,
  Bell,
  ShieldCheck,
  Search,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import './RecruiterDashboard.css';

export default function RecruiterDashboard({
  currentUser,
  currentTheme = 'light',
  onThemeChange,
  onNavigateHome,
  onNavigatePage,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPostingId, setSelectedPostingId] = useState(null);

  const companyName = currentUser?.companyName || currentUser?.fullName || currentUser?.email?.split('@')[0] || 'Enterprise Portal';
  const recruiterName = currentUser?.fullName || currentUser?.email || 'Recruiter';

  const handleNavigateToAtsWithPosting = (postingId) => {
    setSelectedPostingId(postingId);
    setActiveTab('ats');
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <RecruiterOverviewTab
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        );

      case 'postings':
        return (
          <RecruiterPostingsTab
            currentUser={currentUser}
            onSelectTab={setActiveTab}
            onNavigateToAtsWithPosting={handleNavigateToAtsWithPosting}
          />
        );

      case 'ats':
        return (
          <RecruiterAtsPipelineTab
            currentUser={currentUser}
            selectedPostingId={selectedPostingId}
            onSelectTab={setActiveTab}
            onScheduleInterview={() => setActiveTab('interviews')}
          />
        );

      case 'talent-pool':
        return (
          <RecruiterTalentPoolTab
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        );

      case 'interviews':
        return (
          <RecruiterInterviewsTab
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        );

      case 'hired':
        return (
          <RecruiterHiredTab
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        );

      case 'profile':
        return <RecruiterProfileTab currentUser={currentUser} />;

      default:
        return (
          <RecruiterOverviewTab
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        );
    }
  };

  return (
    <SidebarProvider defaultOpen={true} className="recruiter-dashboard-root w-full h-screen max-h-screen overflow-hidden">
      {/* 1. Recruiter Enterprise Sidebar */}
      <RecruiterSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
        onNavigateHome={onNavigateHome}
        onLogout={onLogout}
      />

      {/* 2. Main Workspace Inset */}
      <SidebarInset className="recruiter-dashboard-main flex-1 h-screen overflow-y-auto bg-slate-50/50 dark:bg-slate-950">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {companyName}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-0.5">
                <ShieldCheck size={12} /> Verified Enterprise
              </span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 capitalize">
              {activeTab.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={() => setActiveTab('postings')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs h-8 shadow-sm gap-1"
            >
              <PlusCircle size={14} /> New Job Opening
            </Button>

            <button
              type="button"
              onClick={onNavigateHome}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs flex items-center gap-1 font-medium"
              title="View Public Portal"
            >
              <ExternalLink size={14} /> Public Portal
            </button>

            <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center shadow-sm">
              {recruiterName[0] || 'R'}
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
