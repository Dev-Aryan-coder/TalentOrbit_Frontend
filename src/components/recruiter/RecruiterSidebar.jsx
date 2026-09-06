import React from 'react';
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
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Search,
  CalendarCheck,
  Award,
  Building2,
  ExternalLink,
  LogOut,
  Sun,
  Moon,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import './RecruiterSidebar.css';

export const RECRUITER_NAV_ITEMS = [
  {
    group: 'Executive Overview',
    items: [
      {
        id: 'overview',
        label: 'Dashboard Overview',
        icon: <LayoutDashboard size={18} />,
      },
    ],
  },
  {
    group: 'Hiring & Pipelines',
    items: [
      {
        id: 'postings',
        label: 'Post Opportunities',
        icon: <Briefcase size={18} />,
      },
      {
        id: 'ats',
        label: 'Candidate ATS Pipeline',
        icon: <Users size={18} />,
      },
      {
        id: 'talent-pool',
        label: 'Talent Pool Scouting',
        icon: <Search size={18} />,
      },
      {
        id: 'interviews',
        label: 'Interview Schedule',
        icon: <CalendarCheck size={18} />,
      },
    ],
  },
  {
    group: 'Outcomes & Governance',
    items: [
      {
        id: 'hired',
        label: 'Hired & Mentor Feedback',
        icon: <Award size={18} />,
      },
      {
        id: 'profile',
        label: 'Company Profile',
        icon: <Building2 size={18} />,
      },
    ],
  },
];

export default function RecruiterSidebar({
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

  const companyName = currentUser?.companyName || currentUser?.fullName || currentUser?.email?.split('@')[0] || 'Enterprise';
  const recruiterEmail = currentUser?.email || '';
  const companyInitials = companyName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'CO';

  return (
    <Sidebar
      collapsible="icon"
      className="recruiter-sidebar-container border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
    >
      {/* 1. Header: Corporate Branding */}
      <SidebarHeader className="recruiter-sidebar-header p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={onNavigateHome}
            title="Return to TalentOrbit Public Portal"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              TO
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  TalentOrbit
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                  Industry Enterprise
                </span>
              </div>
            )}
          </div>
          <SidebarTrigger className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200" />
        </div>

        {/* Corporate Trust Badge */}
        {!isCollapsed && (
          <div className="mt-3.5 p-2.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {companyInitials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {companyName}
                </p>
                <ShieldCheck size={13} className="text-emerald-500 shrink-0" title="Verified Corporate Entity" />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                CIN: L72200MH1990PLC058
              </p>
            </div>
          </div>
        )}
      </SidebarHeader>

      {/* 2. Navigation Content */}
      <SidebarContent className="recruiter-sidebar-content px-2 py-3 space-y-4">
        {RECRUITER_NAV_ITEMS.map((section) => (
          <SidebarGroup key={section.group} className="py-1">
            {!isCollapsed && (
              <SidebarGroupLabel className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase px-2 mb-1">
                {section.group}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => onSelectTab(item.id)}
                        tooltip={item.label}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/30'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-900'
                        }`}
                      >
                        <span className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                          {item.icon}
                        </span>
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* 3. Footer: User Session & Actions */}
      <SidebarFooter className="recruiter-sidebar-footer p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        {!isCollapsed && (
          <div className="flex items-center justify-between px-1 py-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Appearance</span>
            <button
              type="button"
              onClick={() => onThemeChange && onThemeChange(currentTheme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
              title={`Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {currentTheme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        )}

        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-xs shrink-0">
              {companyInitials[0] || 'R'}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {currentUser?.fullName || 'Hiring Manager'}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {recruiterEmail}
                </p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 transition shrink-0"
            title="Log Out of Enterprise Session"
          >
            <LogOut size={16} />
          </button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
