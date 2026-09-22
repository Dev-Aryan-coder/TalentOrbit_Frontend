import React from 'react';
import {
  ShieldAlert,
  LayoutDashboard,
  UserCheck,
  Users,
  Layers,
  FileCheck2,
  Lock,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
} from 'lucide-react';
import './SuperAdminSidebar.css';

export default function SuperAdminSidebar({
  activeTab,
  onSelectTab,
  pendingCount = 0,
  isCollapsed = false,
  onToggleCollapse,
  currentUser,
  onLogout,
}) {
  const navItems = [
    {
      id: 'overview',
      label: 'Platform Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'verifications',
      label: 'Universal KYC Queue',
      icon: UserCheck,
      badge: pendingCount > 0 ? pendingCount : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'users',
      label: 'Global User Directory',
      icon: Users,
      badge: null,
    },
    {
      id: 'skills',
      label: 'Master Skill Governance',
      icon: Layers,
      badge: null,
    },
    {
      id: 'moderation',
      label: 'Opportunity Moderation',
      icon: FileCheck2,
      badge: null,
    },
    {
      id: 'audit',
      label: 'Security Audit Logs',
      icon: Lock,
      badge: null,
    },
  ];

  return (
    <aside className={`superadmin-sidebar-wrapper ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <div className="superadmin-sidebar-card">
        {/* Header */}
        <div className="superadmin-sidebar-header">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 flex-shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div className="truncate">
                <div className="text-sm font-black text-slate-900 dark:text-slate-100 leading-none tracking-tight flex items-center gap-1.5">
                  <span>TalentOrbit</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    GOD MODE
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                  Super Administrator
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            className="superadmin-toggle-btn mx-auto"
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="superadmin-sidebar-nav">
          {!isCollapsed && (
            <div className="px-2 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Administrative Control
            </div>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`superadmin-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectTab(item.id)}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={19} className="flex-shrink-0" />
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between truncate">
                    <span className="truncate">{item.label}</span>
                    {item.badge !== null && (
                      <span
                        className={`ml-2 px-2 py-0.5 rounded-full text-[11px] font-black leading-none ${
                          item.badgeColor || 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="superadmin-sidebar-footer">
          {!isCollapsed && (
            <div className="mb-3 px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                SA
              </div>
              <div className="truncate text-xs">
                <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                  {currentUser?.email || 'superadmin@talentorbit.gov.in'}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Root Authority
                </div>
              </div>
            </div>
          )}

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className={`superadmin-nav-item text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 ${
                isCollapsed ? 'justify-center p-0 w-11 h-11 mx-auto' : ''
              }`}
              title="Sign Out"
            >
              <LogOut size={18} className="flex-shrink-0" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
