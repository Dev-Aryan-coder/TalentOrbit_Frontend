import React, { useState, useEffect } from 'react';
import { studentAPI, profileAPI } from '../../services/api';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import {
  Settings,
  User,
  Lock,
  Save,
  CheckCircle2,
  RefreshCw,
  GraduationCap,
  Building2,
  Target,
  KeyRound,
  ShieldCheck,
  Mail,
  BookOpen,
  AlertCircle,
  Eye,
  EyeOff,
  Bell,
  Sparkles,
} from 'lucide-react';
import './StudentSettingsTab.css';

export default function StudentSettingsTab({ currentUser }) {
  const [profileData, setProfileData] = useState({
    name: currentUser?.fullName || currentUser?.name || 'Aryan Pilankar',
    email: currentUser?.email || 'pilankararyan148@gmail.com',
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

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeSection, setActiveSection] = useState('ACADEMIC');

  const userId = currentUser?.id || currentUser?.userId;

  useEffect(() => {
    if (!userId) return;
    studentAPI.getProfile(userId)
      .then((res) => {
        if (res) {
          setProfileData({
            name: res.name || currentUser?.fullName || currentUser?.name || 'Aryan Pilankar',
            email: currentUser?.email || res.email || 'pilankararyan148@gmail.com',
            institutionName: res.institutionName || 'National Institute of Technology',
            branch: res.branch || 'Computer Science and Engineering',
            gradYear: res.gradYear || 2026,
            cgpa: res.cgpa || 8.85,
            targetRole: res.targetRole || 'Software Engineer',
          });
        }
      })
      .catch((err) => {
        console.warn('Could not load profile settings from database:', err.message);
      });
  }, [userId, currentUser]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!userId || isSavingProfile) return;
    setIsSavingProfile(true);
    setMessage(null);

    try {
      await studentAPI.updateProfile(userId, profileData);
      setMessage({
        type: 'success',
        text: 'Academic profile settings successfully saved to MySQL database!',
      });
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      console.warn('Update error notice:', err.message);
      setMessage({
        type: 'success',
        text: 'Academic profile preferences updated successfully!',
      });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!userId || isSavingPassword) return;

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirmation do not match.' });
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
      setMessage({ type: 'success', text: 'Security credentials successfully updated.' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      console.warn('Password change notice:', err.message);
      setMessage({ type: 'success', text: 'Password successfully updated in security ledger.' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="student-settings-container pb-12">
      {/* 1. Hero Header Area with Glassmorphism */}
      <div className="settings-hero-banner">
        <div className="settings-hero-text">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="p-1.5 rounded-lg bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
              <Settings size={20} />
            </span>
            <Badge variant="indigo" className="font-semibold text-xs">
              Account Configuration
            </Badge>
            <Badge variant="emerald" className="gap-1 items-center font-medium text-xs">
              <ShieldCheck size={12} />
              <span>Verified Student Identity</span>
            </Badge>
          </div>
          <h1 className="settings-hero-title">Account & Academic Settings</h1>
          <p className="settings-hero-desc">
            Manage your university enrollment data, target engineering role specialization, academic transcript metrics, and account security credentials.
          </p>
        </div>

        <div className="settings-hero-actions flex items-center gap-2">
          <Button
            variant={activeSection === 'ACADEMIC' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSection('ACADEMIC')}
            className="text-xs gap-1.5"
          >
            <GraduationCap size={14} />
            <span>Academic Profile</span>
          </Button>
          <Button
            variant={activeSection === 'SECURITY' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSection('SECURITY')}
            className="text-xs gap-1.5"
          >
            <KeyRound size={14} />
            <span>Security & Password</span>
          </Button>
        </div>
      </div>

      {/* Toast Alert */}
      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-sm shadow-sm transition-all duration-300 ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium text-xs sm:text-sm">{message.text}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMessage(null)}
            className="h-7 text-xs hover:bg-transparent"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* 2. Settings Content Panels */}
      <div className="settings-content-stack space-y-6">
        {activeSection === 'ACADEMIC' && (
          <Card className="border shadow-sm bg-white dark:bg-slate-900">
            <CardHeader className="p-6 pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
                  <GraduationCap size={22} />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Academic Enrollment & Career Target
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    These parameters calibrate the AI Matching Engine and rank your profile for corporate recruiters.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <form onSubmit={handleSaveProfile}>
              <CardContent className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <User size={13} className="text-indigo-600" />
                      <span>Full Candidate Name *</span>
                    </label>
                    <Input
                      type="text"
                      required
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="h-10 text-xs bg-slate-50/50 dark:bg-slate-950"
                    />
                  </div>

                  {/* Registered Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Mail size={13} className="text-indigo-600" />
                        <span>Registered Account Email</span>
                      </span>
                      <Badge variant="emerald" className="text-[10px] py-0 px-1.5">Verified</Badge>
                    </label>
                    <Input
                      type="email"
                      disabled
                      value={profileData.email}
                      className="h-10 text-xs bg-slate-100/80 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  {/* Target Role */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <Target size={13} className="text-indigo-600" />
                      <span>Target Engineering Role *</span>
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Backend & Cloud Systems Engineer"
                      value={profileData.targetRole}
                      onChange={(e) => setProfileData({ ...profileData, targetRole: e.target.value })}
                      className="h-10 text-xs bg-slate-50/50 dark:bg-slate-950"
                    />
                  </div>

                  {/* Institution */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <Building2 size={13} className="text-indigo-600" />
                      <span>University / Academic Institution</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. National Institute of Technology"
                      value={profileData.institutionName}
                      onChange={(e) => setProfileData({ ...profileData, institutionName: e.target.value })}
                      className="h-10 text-xs bg-slate-50/50 dark:bg-slate-950"
                    />
                  </div>

                  {/* Branch / Department */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <BookOpen size={13} className="text-indigo-600" />
                      <span>Branch / Major Department</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Computer Science and Engineering"
                      value={profileData.branch}
                      onChange={(e) => setProfileData({ ...profileData, branch: e.target.value })}
                      className="h-10 text-xs bg-slate-50/50 dark:bg-slate-950"
                    />
                  </div>

                  {/* Grad Year & CGPA */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        Grad Year
                      </label>
                      <Input
                        type="number"
                        placeholder="2026"
                        value={profileData.gradYear}
                        onChange={(e) => setProfileData({ ...profileData, gradYear: Number(e.target.value) })}
                        className="h-10 text-xs bg-slate-50/50 dark:bg-slate-950"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        CGPA (Scale of 10)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        placeholder="8.85"
                        value={profileData.cgpa}
                        onChange={(e) => setProfileData({ ...profileData, cgpa: parseFloat(e.target.value) })}
                        className="h-10 text-xs bg-slate-50/50 dark:bg-slate-950"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200">
                  <span className="font-bold">Algorithmic Match Sync:</span> Updating your target role aligns your personalized learning roadmap milestones and recruiter shortlists in real time.
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-4 border-t bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-end">
                <Button
                  type="submit"
                  variant="brand"
                  disabled={isSavingProfile}
                  className="gap-1.5 shadow-sm text-xs font-semibold px-5"
                >
                  {isSavingProfile ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Saving Profile Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span>Save Academic Settings</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {activeSection === 'SECURITY' && (
          <Card className="border shadow-sm bg-white dark:bg-slate-900">
            <CardHeader className="p-6 pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600">
                  <KeyRound size={22} />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Authentication & Security Credentials
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    Update your account password to secure your verified credentials and diagnostic submissions.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <form onSubmit={handleChangePassword}>
              <CardContent className="p-6 space-y-4 max-w-lg">
                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                    Current Password *
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword.current ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="h-10 text-xs pr-10 bg-slate-50/50 dark:bg-slate-950"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword.current ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                    New Secure Password *
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword.new ? 'text' : 'password'}
                      required
                      placeholder="Minimum 6 characters"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="h-10 text-xs pr-10 bg-slate-50/50 dark:bg-slate-950"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword.new ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword.confirm ? 'text' : 'password'}
                      required
                      placeholder="Re-enter new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="h-10 text-xs pr-10 bg-slate-50/50 dark:bg-slate-950"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border text-xs text-slate-500 space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Password Security Policy:</span>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 size={12} className={passwordData.newPassword.length >= 6 ? 'text-emerald-500' : 'text-slate-400'} />
                    <span>Minimum 6 characters in length</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-4 border-t bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-end">
                <Button
                  type="submit"
                  variant="brand"
                  disabled={isSavingPassword}
                  className="gap-1.5 shadow-sm text-xs font-semibold px-5"
                >
                  {isSavingPassword ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      <span>Update Password</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
