import React, { useState, useEffect } from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Layers,
  TrendingUp,
  BookOpen,
  Users,
  Award,
  FileText,
  Building2,
  ShieldCheck,
  LogOut,
  Sun,
  Moon,
  Home,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { institutionAPI } from '../../services/api';
import './InstitutionSidebar.css';

export default function InstitutionSidebar({
  activeTab,
  onSelectTab,
  currentUser,
  currentTheme = 'light',
  onThemeChange,
  onNavigateHome,
  onLogout,
}) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const userId = currentUser?.id || currentUser?.userId || 1;
  const [profileData, setProfileData] = useState(null);
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    Promise.allSettled([
      institutionAPI.getInstitutionDetails(userId),
      institutionAPI.getDashboardStats(userId),
    ]).then(([profRes, statsRes]) => {
      if (!isMounted) return;
      if (profRes.status === 'fulfilled' && profRes.value) {
        setProfileData(profRes.value);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value) {
        setStatsData(statsRes.value.stats || statsRes.value);
      }
    });

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

  const contactPerson =
    profileData?.contactPerson ||
    profileData?.fullName ||
    currentUser?.fullName ||
    'Training & Placement Officer';

  const contactEmail =
    profileData?.email ||
    currentUser?.email ||
    'tpo@institution.edu.in';

  const institutionInitials = institutionName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'IN';

  const isDark = currentTheme === 'dark';

  const navGroups = [
    {
      group: 'Executive Overview',
      items: [
        {
          id: 'overview',
          label: 'Executive Overview',
          icon: <LayoutDashboard size={18} />,
        },
      ],
    },
    {
      group: 'Skill Intelligence',
      items: [
        {
          id: 'skill_heatmap',
          label: 'Skill Deficit Heatmap',
          icon: <Layers size={18} />,
          highlight: 'SIH Core',
        },
        {
          id: 'industry_demand',
          label: 'Macro Industry Demand',
          icon: <TrendingUp size={18} />,
        },
        {
          id: 'bootcamps',
          label: 'Remedial Bootcamps',
          icon: <BookOpen size={18} />,
        },
      ],
    },
    {
      group: 'Cohort & Outcomes',
      items: [
        {
          id: 'students',
          label: 'Cohort Students Roster',
          icon: <Users size={18} />,
          badge: statsData?.totalStudentsInCohort ? `${statsData.totalStudentsInCohort}` : null,
        },
        {
          id: 'placements',
          label: 'Placements & CTC Audit',
          icon: <Award size={18} />,
          badge: statsData?.placementReadinessPercentage ? `${statsData.placementReadinessPercentage}%` : null,
        },
      ],
    },
    {
      group: 'Accreditation & Profile',
      items: [
        {
          id: 'reports',
          label: 'NIRF & NAAC Reports',
          icon: <FileText size={18} />,
        },
        {
          id: 'profile',
          label: 'Institution Profile',
          icon: <Building2 size={18} />,
        },
      ],
    },
  ];

  return (
    <Sidebar
      collapsible="icon"
      className="institution-sidebar-container border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 select-none"
    >
      {/* 1. Header: Branding & Toggle */}
      <SidebarHeader
        className={`institution-sidebar-header border-b border-slate-100 dark:border-slate-800/80 ${
          isCollapsed ? 'p-2.5 flex flex-col items-center gap-2' : 'p-4 flex flex-col gap-3'
        }`}
      >
        {isCollapsed ? (
          <div className="flex flex-col items-center justify-center gap-2.5 w-full py-1">
            <div
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-800 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/20 cursor-pointer hover:scale-105 transition shrink-0"
              onClick={onNavigateHome}
              title="TalentOrbit Institution Portal"
            >
              TO
            </div>
            <SidebarTrigger className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center shrink-0" />
          </div>
        ) : (
          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between w-full">
              <div
                className="flex items-center gap-3 cursor-pointer group select-none"
                onClick={onNavigateHome}
                title="Return to TalentOrbit Public Home"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-800 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/20 group-hover:scale-105 transition shrink-0">
                  TO
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent leading-tight">
                    TalentOrbit
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mt-0.5">
                    Institution Portal
                  </span>
                </div>
              </div>
              <SidebarTrigger className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-1.5 transition shrink-0" />
            </div>

            {/* Institution Badge Card */}
            <div className="p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center gap-2.5 w-full">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {institutionInitials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate" title={institutionName}>
                    {institutionName}
                  </p>
                  <ShieldCheck size={13} className="text-emerald-500 shrink-0" title="Verified AISHE" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  AISHE: {aisheCode}
                </p>
              </div>
            </div>
          </div>
        )}
      </SidebarHeader>

      {/* 2. Navigation Items */}
      <SidebarContent
        className={`institution-sidebar-content ${
          isCollapsed ? 'px-1 py-2.5 space-y-1' : 'px-3 py-3 space-y-3'
        }`}
      >
        {navGroups.map((grp) => (
          <SidebarGroup key={grp.group} className="institution-nav-group py-0.5">
            {!isCollapsed && (
              <SidebarGroupLabel className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase px-2 mb-1">
                {grp.group}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className={isCollapsed ? 'space-y-1' : 'space-y-1'}>
                {grp.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <SidebarMenuItem
                      key={item.id}
                      className={isCollapsed ? 'flex justify-center w-full' : ''}
                    >
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => onSelectTab(item.id)}
                        tooltip={item.label}
                        className={`transition-all ${
                          isCollapsed
                            ? `w-11 h-11 p-0 flex items-center justify-center rounded-xl mx-auto ${
                                isActive
                                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`
                            : `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                                isActive
                                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm shadow-indigo-600/30'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-900'
                              }`
                        }`}
                      >
                        <span
                          className={`institution-nav-icon shrink-0 ${
                            isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {item.icon}
                        </span>
                        {!isCollapsed && (
                          <div className="institution-nav-label-container flex-1 min-w-0 flex items-center justify-between gap-1.5 overflow-hidden">
                            <span className="truncate text-left text-xs font-semibold">{item.label}</span>
                            {item.highlight && !isActive && (
                              <span className="shrink-0 text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                                {item.highlight}
                              </span>
                            )}
                            {item.badge && (
                              <Badge
                                variant={isActive ? 'outline' : 'default'}
                                className={`shrink-0 text-[9px] font-bold py-0 px-1.5 h-4 min-w-4 flex items-center justify-center rounded-full ${
                                  isActive
                                    ? 'border-white/50 text-white bg-white/20'
                                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                }`}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* 3. Footer: TPO Officer & Action Controls */}
      <SidebarFooter
        className={`institution-sidebar-footer border-t border-slate-100 dark:border-slate-800 ${
          isCollapsed ? 'p-2 flex flex-col items-center gap-2' : 'p-3 flex flex-col gap-2.5'
        }`}
      >
        {isCollapsed ? (
          <div className="flex flex-col items-center justify-center gap-2 w-full py-1">
            <button
              type="button"
              onClick={() => onThemeChange(isDark ? 'light' : 'dark')}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition shrink-0"
              title="Sign Out"
            >
              <LogOut size={17} />
            </button>
          </div>
        ) : (
          <>
            {/* Officer Profile Card */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {contactPerson.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate" title={contactPerson}>
                  {contactPerson}
                </p>
                <p className="text-[10px] text-slate-500 truncate" title={contactEmail}>
                  TPO Placement Officer
                </p>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={onNavigateHome}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition font-medium"
              >
                <Home size={14} />
                <span>Portal Home</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onThemeChange(isDark ? 'light' : 'dark')}
                  className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
                >
                  {isDark ? <Sun size={15} /> : <Moon size={15} />}
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                  title="Sign Out"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
