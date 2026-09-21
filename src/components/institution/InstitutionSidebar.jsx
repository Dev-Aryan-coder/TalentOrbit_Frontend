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
  CheckCircle2,
  Sparkles,
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

  const officerInitials = contactPerson
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'TP';

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
          highlight: true,
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
    <Sidebar collapsible="icon" className="institution-sidebar">
      {/* Header */}
      <SidebarHeader className="institution-sidebar-header">
        {!isCollapsed ? (
          <div className="institution-brand-badge">
            <div className="institution-brand-icon">
              <Building2 size={20} />
            </div>
            <div className="institution-brand-info">
              <div className="institution-brand-name" title={institutionName}>
                {institutionName}
              </div>
              <div className="institution-aishe-pill" title="AISHE Verified Code">
                <ShieldCheck size={11} />
                <span>AISHE: {aisheCode}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center py-2">
            <div className="institution-brand-icon">
              <Building2 size={20} />
            </div>
          </div>
        )}
      </SidebarHeader>

      {/* Navigation Groups */}
      <SidebarContent className="px-2 py-3">
        {navGroups.map((grp) => (
          <SidebarGroup key={grp.group} className="mb-2">
            {!isCollapsed && (
              <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1.5">
                {grp.group}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {grp.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={isCollapsed ? item.label : undefined}
                      >
                        <button
                          type="button"
                          className={`institution-nav-button ${isActive ? 'active' : ''}`}
                          onClick={() => onSelectTab(item.id)}
                        >
                          <span className="nav-icon">{item.icon}</span>
                          {!isCollapsed && (
                            <>
                              <span className="flex-1 truncate">{item.label}</span>
                              {item.highlight && !isActive && (
                                <span className="flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                                  SIH Core
                                </span>
                              )}
                              {item.badge && !item.highlight && (
                                <span className="institution-nav-badge">{item.badge}</span>
                              )}
                            </>
                          )}
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer / Officer Profile & Controls */}
      <SidebarFooter className="p-3 border-t border-slate-200 dark:border-slate-800">
        {!isCollapsed ? (
          <>
            <div className="institution-officer-card">
              <div className="institution-officer-avatar">{officerInitials}</div>
              <div className="institution-officer-meta">
                <div className="institution-officer-name" title={contactPerson}>
                  {contactPerson}
                </div>
                <div className="institution-officer-role" title={contactEmail}>
                  TPO Officer
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-1 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={onNavigateHome}
                title="Return to TalentOrbit Public Home"
              >
                <Home size={14} />
                <span>Home</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => onThemeChange(isDark ? 'light' : 'dark')}
                  title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
                >
                  {isDark ? <Sun size={15} /> : <Moon size={15} />}
                </button>

                <button
                  type="button"
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors"
                  onClick={onLogout}
                  title="Sign out of TPO portal"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <button
              type="button"
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => onThemeChange(isDark ? 'light' : 'dark')}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              type="button"
              className="p-2 text-rose-500 hover:text-rose-700 rounded-md hover:bg-rose-50"
              onClick={onLogout}
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
