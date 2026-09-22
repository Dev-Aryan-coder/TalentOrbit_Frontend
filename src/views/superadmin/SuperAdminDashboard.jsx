import React, { useState, useEffect } from 'react';
import SuperAdminSidebar from '../../components/superadmin/SuperAdminSidebar';
import SuperAdminOverviewTab from '../../components/superadmin/SuperAdminOverviewTab';
import SuperAdminVerificationsTab from '../../components/superadmin/SuperAdminVerificationsTab';
import SuperAdminUsersTab from '../../components/superadmin/SuperAdminUsersTab';
import SuperAdminSkillsTab from '../../components/superadmin/SuperAdminSkillsTab';
import SuperAdminModerationTab from '../../components/superadmin/SuperAdminModerationTab';
import SuperAdminAuditLogsTab from '../../components/superadmin/SuperAdminAuditLogsTab';
import {
  ShieldAlert,
  Server,
  Activity,
  UserCheck,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Users,
  Sun,
  Moon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { superAdminAPI } from '../../services/api';

export default function SuperAdminDashboard({
  currentUser,
  currentTheme = 'light',
  onThemeChange,
  onNavigateHome,
  onNavigatePage,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Poll or fetch pending verifications count for live sidebar badge
  useEffect(() => {
    superAdminAPI.getPendingVerifications()
      .then((res) => {
        const list = Array.isArray(res) ? res : (res?.data || []);
        setPendingCount(list.length);
      })
      .catch(() => {});
  }, []);

  const adminEmail = currentUser?.email || 'superadmin@talentorbit.gov.in';

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SuperAdminOverviewTab onSelectTab={setActiveTab} />;
      case 'verifications':
        return (
          <SuperAdminVerificationsTab
            onSelectTab={setActiveTab}
            onUpdatePendingCount={setPendingCount}
          />
        );
      case 'users':
        return <SuperAdminUsersTab />;
      case 'skills':
        return <SuperAdminSkillsTab />;
      case 'moderation':
        return <SuperAdminModerationTab />;
      case 'audit':
        return <SuperAdminAuditLogsTab />;
      default:
        return <SuperAdminOverviewTab onSelectTab={setActiveTab} />;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Platform Overview & Telemetry';
      case 'verifications': return 'Universal KYC Queue';
      case 'users': return 'Global User Directory';
      case 'skills': return 'Master Skill Governance';
      case 'moderation': return 'Opportunity Moderation';
      case 'audit': return 'Security Audit Logs';
      default: return 'Super Administrator';
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Left Responsive God Mode Sidebar */}
      <SuperAdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        pendingCount={pendingCount}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Government Executive Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-6 backdrop-blur-md">
          {/* Breadcrumb Context */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 min-w-0">
            <span className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              TalentOrbit God Mode
            </span>
            <span>/</span>
            <span className="text-indigo-600 dark:text-indigo-400 capitalize font-medium">
              {getTabTitle()}
            </span>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Live Spring Boot Server Health Status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Spring Boot : 8080 Active</span>
            </div>

            {/* Quick Switch Role Dropdown for effortless pairing & demonstration */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
              >
                <Users size={13} className="text-indigo-500" />
                <span>Switch View</span>
                <ChevronDown size={12} className="text-slate-400" />
              </button>

              {isRoleDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 text-xs animate-fade-in"
                  onClick={() => setIsRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    Switch Active Portal View
                  </div>
                  <button
                    onClick={() => onNavigatePage && onNavigatePage('student')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-200 flex items-center justify-between"
                  >
                    <span>Student Dashboard</span>
                    <span className="text-[10px] text-slate-400">/student</span>
                  </button>
                  <button
                    onClick={() => onNavigatePage && onNavigatePage('recruiter')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-200 flex items-center justify-between"
                  >
                    <span>Recruiter / Industry</span>
                    <span className="text-[10px] text-slate-400">/industry</span>
                  </button>
                  <button
                    onClick={() => onNavigatePage && onNavigatePage('academician')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-200 flex items-center justify-between"
                  >
                    <span>Academician Dashboard</span>
                    <span className="text-[10px] text-slate-400">/faculty</span>
                  </button>
                  <button
                    onClick={() => onNavigatePage && onNavigatePage('tpo')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-200 flex items-center justify-between"
                  >
                    <span>Institution / TPO</span>
                    <span className="text-[10px] text-slate-400">/tpo</span>
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => onThemeChange && onThemeChange(currentTheme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Toggle Theme"
            >
              {currentTheme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* SuperAdmin User Chip */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                SA
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">
                  National SuperAdmin
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                  {adminEmail}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Pane */}
        <main className="flex-1 pb-16">
          {renderActiveTabContent()}
        </main>
      </div>
    </div>
  );
}
