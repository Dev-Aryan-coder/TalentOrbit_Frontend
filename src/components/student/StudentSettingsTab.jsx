import React, { useState, useEffect } from 'react';
import { studentAPI, profileAPI } from '../../services/api';
import {
  User,
  Lock,
  Save,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import './StudentSettingsTab.css';

export default function StudentSettingsTab({ currentUser }) {
  const [profileData, setProfileData] = useState({
    name: currentUser?.fullName || '',
    institutionName: '',
    branch: '',
    gradYear: '',
    cgpa: '',
    targetRole: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [message, setMessage] = useState(null);

  const userId = currentUser?.id || currentUser?.userId;

  useEffect(() => {
    if (!userId) return;
    studentAPI.getProfile(userId)
      .then((res) => {
        if (res) {
          setProfileData({
            name: res.name || currentUser?.fullName || '',
            institutionName: res.institutionName || '',
            branch: res.branch || '',
            gradYear: res.gradYear || '',
            cgpa: res.cgpa || '',
            targetRole: res.targetRole || '',
          });
        }
      })
      .catch((err) => console.warn('Could not load profile settings from database:', err.message));
  }, [userId, currentUser]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!userId || isSavingProfile) return;
    setIsSavingProfile(true);
    setMessage(null);

    try {
      await studentAPI.updateProfile(userId, profileData);
      setMessage({ type: 'success', text: 'Academic profile settings successfully updated.' });
    } catch (err) {
      console.error('Update error:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to update profile settings.' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!userId || isSavingPassword) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setIsSavingPassword(true);
    setMessage(null);

    try {
      await profileAPI.changePassword(
        userId,
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setMessage({ type: 'success', text: 'Password successfully changed.' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Password change error:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="student-settings-container">
      <div className="settings-header-area">
        <h2>Account & Academic Settings</h2>
        <p>Manage your university enrollment, graduation year, target engineering role, and security credentials.</p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm font-medium border flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <span>{message.text}</span>
          <button type="button" onClick={() => setMessage(null)} className="text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="settings-panels-stack">
        {/* Academic Profile Card */}
        <form onSubmit={handleSaveProfile} className="settings-card">
          <h3 className="settings-card-title">Academic & Target Role Information</h3>
          <p className="settings-card-desc">
            These parameters are used by the Matching Engine to calculate compatibility with recruiters.
          </p>

          <div className="settings-form-grid">
            <div className="settings-field-group">
              <label className="settings-field-lbl">Full Name</label>
              <input
                type="text"
                className="settings-text-input"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
            </div>

            <div className="settings-field-group">
              <label className="settings-field-lbl">Target Job Role</label>
              <input
                type="text"
                className="settings-text-input"
                value={profileData.targetRole}
                onChange={(e) => setProfileData({ ...profileData, targetRole: e.target.value })}
                required
              />
            </div>

            <div className="settings-field-group">
              <label className="settings-field-lbl">Academic Institution</label>
              <input
                type="text"
                className="settings-text-input"
                value={profileData.institutionName}
                onChange={(e) => setProfileData({ ...profileData, institutionName: e.target.value })}
                placeholder="e.g. National Institute of Technology"
              />
            </div>

            <div className="settings-field-group">
              <label className="settings-field-lbl">Branch / Department</label>
              <input
                type="text"
                className="settings-text-input"
                value={profileData.branch}
                onChange={(e) => setProfileData({ ...profileData, branch: e.target.value })}
                placeholder="e.g. Computer Science and Engineering"
              />
            </div>

            <div className="settings-field-group">
              <label className="settings-field-lbl">Graduation Year</label>
              <input
                type="number"
                className="settings-text-input"
                value={profileData.gradYear}
                onChange={(e) => setProfileData({ ...profileData, gradYear: Number(e.target.value) })}
              />
            </div>

            <div className="settings-field-group">
              <label className="settings-field-lbl">Cumulative CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                className="settings-text-input"
                value={profileData.cgpa}
                onChange={(e) => setProfileData({ ...profileData, cgpa: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="settings-save-btn"
            disabled={isSavingProfile}
          >
            <Save size={14} />
            <span>{isSavingProfile ? 'Saving Changes...' : 'Save Academic Settings'}</span>
          </button>
        </form>

        {/* Security / Password Card */}
        <form onSubmit={handleChangePassword} className="settings-card">
          <h3 className="settings-card-title">Security & Password Management</h3>
          <p className="settings-card-desc">Ensure your account uses a secure, modern password.</p>

          <div className="settings-form-grid">
            <div className="settings-field-group">
              <label className="settings-field-lbl">Current Password</label>
              <input
                type="password"
                className="settings-text-input"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </div>

            <div className="settings-field-group">
              <label className="settings-field-lbl">New Password</label>
              <input
                type="password"
                className="settings-text-input"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
              />
            </div>

            <div className="settings-field-group">
              <label className="settings-field-lbl">Confirm New Password</label>
              <input
                type="password"
                className="settings-text-input"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="settings-save-btn"
            disabled={isSavingPassword}
          >
            <Lock size={14} />
            <span>{isSavingPassword ? 'Updating Password...' : 'Update Password'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
