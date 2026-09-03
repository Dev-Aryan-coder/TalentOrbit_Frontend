import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import './UserDropdownMenu.css';

export default function UserDropdownMenu({
  user,
  currentTheme,
  onThemeChange,
  onNavigateDashboard,
  onOpenProfileSettings,
  onOpenAccountSettings,
  onOpenAppearance,
  onLogout
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : user?.email ? user.email.substring(0, 2).toUpperCase() : 'TO';

  const roleLabels = {
    STUDENT: 'Student Scholar',
    INDUSTRY: 'Corporate Recruiter',
    ACADEMICIAN: 'Faculty Member',
    INSTITUTION_ADMIN: 'College TPO',
    SUPERADMIN: 'Super Administrator'
  };

  const roleLabel = roleLabels[user?.role] || user?.role || 'User';

  return (
    <div className="user-menu-wrapper" ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`user-menu-trigger ${isOpen ? 'active' : ''}`}
        aria-expanded={isOpen}
        aria-label="User profile and account menu"
      >
        <Avatar className="user-menu-avatar">
          <AvatarImage src={user?.avatarUrl} alt={user?.fullName || 'User'} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="user-menu-name">{user?.fullName || 'My Account'}</span>
        <svg
          className={`user-menu-chevron ${isOpen ? 'rotated' : ''}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Floating Dropdown */}
      {isOpen && (
        <div className="user-dropdown-panel animate-in fade-in zoom-in-95">
          {/* User Header Profile Card */}
          <div className="user-dropdown-header">
            <Avatar className="user-dropdown-header-avatar">
              <AvatarImage src={user?.avatarUrl} alt={user?.fullName || 'User'} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="user-dropdown-header-meta">
              <p className="user-dropdown-header-name">{user?.fullName || 'User'}</p>
              <p className="user-dropdown-header-email">{user?.email || ''}</p>
              <span className="user-dropdown-header-role">{roleLabel}</span>
            </div>
          </div>

          <div className="user-dropdown-divider" />

          {/* Menu Items */}
          <div className="user-dropdown-items">
            {/* 1. Dashboard */}
            <button
              type="button"
              className="user-dropdown-item primary-action"
              onClick={() => {
                setIsOpen(false);
                if (onNavigateDashboard) onNavigateDashboard();
              }}
            >
              <div className="user-dropdown-item-icon blue">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="7" height="9" x="3" y="3" rx="1" />
                  <rect width="7" height="5" x="14" y="3" rx="1" />
                  <rect width="7" height="9" x="14" y="12" rx="1" />
                  <rect width="7" height="5" x="3" y="16" rx="1" />
                </svg>
              </div>
              <div className="user-dropdown-item-text">
                <span className="user-dropdown-item-title">Dashboard</span>
                <span className="user-dropdown-item-sub">Access your role workspace</span>
              </div>
            </button>

            {/* 2. Profile Settings */}
            <button
              type="button"
              className="user-dropdown-item"
              onClick={() => {
                setIsOpen(false);
                if (onOpenProfileSettings) onOpenProfileSettings();
              }}
            >
              <div className="user-dropdown-item-icon purple">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="user-dropdown-item-text">
                <span className="user-dropdown-item-title">Profile Settings</span>
                <span className="user-dropdown-item-sub">Edit name, avatar & bio</span>
              </div>
            </button>

            {/* 3. Account Settings */}
            <button
              type="button"
              className="user-dropdown-item"
              onClick={() => {
                setIsOpen(false);
                if (onOpenAccountSettings) onOpenAccountSettings();
              }}
            >
              <div className="user-dropdown-item-icon amber">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div className="user-dropdown-item-text">
                <span className="user-dropdown-item-title">Account Settings</span>
                <span className="user-dropdown-item-sub">Security, password & email</span>
              </div>
            </button>

            {/* 4. Appearance */}
            <button
              type="button"
              className="user-dropdown-item"
              onClick={() => {
                setIsOpen(false);
                if (onOpenAppearance) onOpenAppearance();
              }}
            >
              <div className="user-dropdown-item-icon emerald">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              </div>
              <div className="user-dropdown-item-text">
                <span className="user-dropdown-item-title">Appearance</span>
                <span className="user-dropdown-item-sub">Light & Dark theme</span>
              </div>
            </button>
          </div>

          <div className="user-dropdown-divider" />

          {/* Logout Action */}
          <div className="user-dropdown-footer">
            <button
              type="button"
              className="user-dropdown-logout-btn"
              onClick={() => {
                setIsOpen(false);
                if (onLogout) onLogout();
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
