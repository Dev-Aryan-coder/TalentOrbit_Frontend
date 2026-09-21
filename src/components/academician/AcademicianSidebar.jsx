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
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Compass,
  GraduationCap,
  Briefcase,
  Microscope,
  Lightbulb,
  Presentation,
  Users,
  Sparkles,
  UserCheck,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
  ShieldCheck,
  BookOpenCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { academicianAPI } from '../../services/api';
import './AcademicianSidebar.css';

export default function AcademicianSidebar({
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

  const facultyId = currentUser?.id || currentUser?.userId || 1;

  const [summaryData, setSummaryData] = useState(null);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    Promise.allSettled([
      academicianAPI.getDashboardSummary(facultyId),
      academicianAPI.getProfile(facultyId),
    ]).then(([sumRes, profRes]) => {
      if (!isMounted) return;
      if (sumRes.status === 'fulfilled' && sumRes.value) {
        setSummaryData(sumRes.value.stats || sumRes.value);
      }
      if (profRes.status === 'fulfilled' && profRes.value) {
        setProfileData(profRes.value);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [facultyId]);

  const facultyName = profileData?.name || currentUser?.fullName || 'Faculty Member';
  const facultyEmail = profileData?.user?.email || currentUser?.email || 'faculty@university.edu';
  const institutionName = profileData?.institutionName || currentUser?.institutionName || currentUser?.collegeName || 'Academic Institution';
  const departmentName = profileData?.department || 'Department of Computer Engineering';
  const facultyInitials = facultyName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'DR';

  const isDark = currentTheme === 'dark';

  // Dynamic Navigation Items with live counts from REST API
  const navItems = [
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
      group: 'Academic & Industry Programs',
      items: [
        {
          id: 'opportunities',
          label: 'All Opportunities',
          icon: <Compass size={18} />,
          badge: summaryData?.totalOpportunities != null ? `${summaryData.totalOpportunities}` : 'Live',
        },
        {
          id: 'fdp',
          label: 'FDP Programs',
          icon: <GraduationCap size={18} />,
          badge: summaryData?.fdpCount != null ? `${summaryData.fdpCount}` : '0',
        },
        {
          id: 'training',
          label: 'Industry Training',
          icon: <BookOpenCheck size={18} />,
          badge: summaryData?.trainingCount != null ? `${summaryData.trainingCount}` : '0',
        },
        {
          id: 'research',
          label: 'Research Projects',
          icon: <Microscope size={18} />,
          badge: summaryData?.researchCount != null ? `${summaryData.researchCount}` : '0',
        },
        {
          id: 'consultancy',
          label: 'Consultancy Offers',
          icon: <Lightbulb size={18} />,
          badge: summaryData?.consultancyCount != null ? `${summaryData.consultancyCount}` : '0',
        },
        {
          id: 'workshops',
          label: 'Workshops & Lectures',
          icon: <Presentation size={18} />,
          badge: summaryData?.workshopCount != null ? `${summaryData.workshopCount}` : '0',
        },
      ],
    },
    {
      group: 'Outcomes & Profile',
      items: [
        {
          id: 'collaborations',
          label: 'My Collaborations',
          icon: <Users size={18} />,
          badge: summaryData?.activeCollaborationsCount != null ? `${summaryData.activeCollaborationsCount}` : 'Track',
        },
        {
          id: 'interests',
          label: 'My Expertise & Tags',
          icon: <Sparkles size={18} />,
          badge: summaryData?.myTagsCount != null ? `${summaryData.myTagsCount}` : null,
        },
        {
          id: 'profile',
          label: 'Faculty Profile',
          icon: <UserCheck size={18} />,
        },
        {
          id: 'help',
          label: 'Support & Help',
          icon: <HelpCircle size={18} />,
        },
      ],
    },
  ];

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    if (onThemeChange) {
      onThemeChange(nextTheme);
    } else {
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
      localStorage.setItem('talentorbit_theme', nextTheme);
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="academician-sidebar-container border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 select-none"
    >
      {/* 1. Header: Academic & Institute Branding */}
      <SidebarHeader className={`academician-sidebar-header border-b border-slate-100 dark:border-slate-800/80 ${isCollapsed ? 'p-2.5 flex flex-col items-center gap-2' : 'p-4 flex flex-col gap-3'}`}>
        {isCollapsed ? (
          <div className="flex flex-col items-center justify-center gap-2.5 w-full py-1">
            <div
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-green-700 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-600/20 cursor-pointer hover:scale-105 transition shrink-0"
              onClick={onNavigateHome}
              title="TalentOrbit Academic Portal"
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
                title="Return to TalentOrbit Public Portal"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-green-700 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-600/20 group-hover:scale-105 transition shrink-0">
                  TO
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent leading-tight">
                    TalentOrbit
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mt-0.5">
                    Academician Portal
                  </span>
                </div>
              </div>
              <SidebarTrigger className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-1.5 transition shrink-0" />
            </div>

            {/* Faculty Affiliation Badge */}
            <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex items-center gap-2.5 w-full">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {facultyInitials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {institutionName}
                  </p>
                  <ShieldCheck size={13} className="text-emerald-500 shrink-0" title="Verified Academician" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {departmentName}
                </p>
              </div>
            </div>
          </div>
        )}
      </SidebarHeader>

      {/* 2. Navigation Content */}
      <SidebarContent className={`academician-sidebar-content ${isCollapsed ? 'px-1 py-2.5 space-y-1' : 'px-3 py-3.5 space-y-4'}`}>
        {navItems.map((section) => (
          <SidebarGroup key={section.group} className="academician-nav-group py-0.5">
            {!isCollapsed && (
              <SidebarGroupLabel className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase px-2 mb-1">
                {section.group}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className={isCollapsed ? 'space-y-1' : 'space-y-1'}>
                {section.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <SidebarMenuItem key={item.id} className={isCollapsed ? 'flex justify-center' : ''}>
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => onSelectTab(item.id)}
                        tooltip={item.label}
                        className={`transition-all ${
                          isCollapsed
                            ? `w-11 h-11 p-0 flex items-center justify-center rounded-xl mx-auto ${
                                isActive
                                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`
                            : `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                                isActive
                                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-600/30'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-900'
                              }`
                        }`}
                      >
                        <span className={`academician-nav-icon shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                          {item.icon}
                        </span>
                        {!isCollapsed && (
                          <span className="academician-nav-label truncate flex-1 flex items-center justify-between">
                            <span>{item.label}</span>
                            {item.badge && (
                              <Badge
                                variant={isActive ? "outline" : "emerald"}
                                className={`text-[9px] font-bold py-0 px-1.5 h-4 min-w-4 flex items-center justify-center rounded-full ${
                                  isActive ? 'border-white/50 text-white bg-white/20' : ''
                                }`}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </span>
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

      {/* 3. Footer: User Session & Actions */}
      <SidebarFooter className={`academician-sidebar-footer border-t border-slate-100 dark:border-slate-800 ${isCollapsed ? 'p-2 flex flex-col items-center gap-2' : 'p-3.5 flex flex-col gap-2.5'}`}>
        {isCollapsed ? (
          <div className="flex flex-col items-center justify-center gap-2 w-full py-1">
            <button
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
              title={`Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {currentTheme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <div
              className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-xs shadow-xs cursor-help shrink-0"
              title={`${facultyName} (${facultyEmail})`}
            >
              {facultyInitials[0] || 'D'}
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition shrink-0"
                title="Log Out of Academician Session"
              >
                <LogOut size={17} />
              </button>
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-between px-1 py-0.5 w-full">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Appearance</span>
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
                title={`Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {currentTheme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 w-full">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  {facultyInitials[0] || 'D'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {facultyName}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {facultyEmail}
                  </p>
                </div>
              </div>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition shrink-0"
                  title="Log Out of Academician Session"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
