import React, { useState } from 'react';
import { profileAPI } from '@/services/api';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import './AccountSettingsModal.css';

export default function AccountSettingsModal({ isOpen, onClose, user }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const roleLabels = {
    STUDENT: 'Verified Student Scholar',
    INDUSTRY: 'Verified Corporate Recruiter',
    ACADEMICIAN: 'Verified Faculty / Academician',
    INSTITUTION_ADMIN: 'Verified Institutional TPO',
    SUPERADMIN: 'System Super Administrator'
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!currentPassword.trim()) {
      setErrorMessage('Please enter your current password.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match. Please re-enter.');
      return;
    }

    setSaving(true);

    try {
      await profileAPI.changePassword(user.id, currentPassword, newPassword);
      setSuccessMessage(
        `Password updated in MySQL database! An official security confirmation email with your audit details (User ID, Role, Timestamp, and Protocol) has been sent to ${user.email}.`
      );
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        onClose();
      }, 3500);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update password. Please check your current password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="account-modal-overlay" onClick={onClose}>
      <div className="account-modal-card animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="account-modal-header">
          <div>
            <h2 className="account-modal-title">Account & Security Settings</h2>
            <p className="account-modal-sub">Manage your security credentials and view institutional identity</p>
          </div>
          <button type="button" onClick={onClose} className="account-modal-close-btn" aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Feedback Banners */}
        {errorMessage && (
          <div className="account-modal-alert error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="account-modal-alert success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        <div className="account-modal-body">
          {/* Section 1: Read-Only Institutional Identity */}
          <div className="account-section">
            <h3 className="account-section-title">Verified Identity (Permanent)</h3>
            <p className="account-section-desc">
              For regulatory and tamper-proof verification integrity, your registered email and role are locked and cannot be modified.
            </p>

            <div className="account-readonly-grid">
              <div className="account-readonly-field">
                <div className="account-readonly-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Primary Email Address (Locked)</span>
                </div>
                <div className="account-readonly-value">{user?.email || 'N/A'}</div>
              </div>

              <div className="account-readonly-field">
                <div className="account-readonly-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
                  </svg>
                  <span>Assigned System Role (Locked)</span>
                </div>
                <div className="account-readonly-value highlight">
                  {roleLabels[user?.role] || user?.role || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="account-divider" />

          {/* Section 2: Password Management Form */}
          <form onSubmit={handlePasswordChange} className="account-section">
            <div className="account-section-header-row">
              <div>
                <h3 className="account-section-title">Change Account Password</h3>
                <p className="account-section-desc">
                  Update your authentication credentials. An official security email alert will be sent immediately upon change.
                </p>
              </div>
              <div className="account-shield-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>SHA-256 Encrypted</span>
              </div>
            </div>

            <div className="account-form-group">
              <Label htmlFor="currentPass">Current Password</Label>
              <div className="account-pass-wrapper">
                <Input
                  id="currentPass"
                  type={showCurrentPass ? 'text' : 'password'}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="account-pass-toggle"
                  aria-label="Toggle password visibility"
                >
                  {showCurrentPass ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="account-form-row">
              <div className="account-form-group">
                <Label htmlFor="newPass">New Password (Min 6 chars)</Label>
                <div className="account-pass-wrapper">
                  <Input
                    id="newPass"
                    type={showNewPass ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="account-pass-toggle"
                    aria-label="Toggle password visibility"
                  >
                    {showNewPass ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="account-form-group">
                <Label htmlFor="confirmPass">Confirm New Password</Label>
                <Input
                  id="confirmPass"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="account-modal-footer">
              <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Updating & Sending Alert...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
