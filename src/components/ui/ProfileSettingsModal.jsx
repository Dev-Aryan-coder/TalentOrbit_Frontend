import React, { useState, useEffect } from 'react';
import { profileAPI } from '@/services/api';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import './ProfileSettingsModal.css';

export default function ProfileSettingsModal({ isOpen, onClose, user, onProfileUpdated }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  
  // Student Specific
  const [institutionName, setInstitutionName] = useState('');
  const [branch, setBranch] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [targetRole, setTargetRole] = useState('');

  // Recruiter Specific
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [description, setDescription] = useState('');

  // Academician Specific
  const [department, setDepartment] = useState('');

  // TPO Specific
  const [state, setState] = useState('');
  const [contactPerson, setContactPerson] = useState('');

  // Load real profile from Spring Boot backend
  useEffect(() => {
    if (isOpen && user?.id) {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      profileAPI.getProfile(user.id)
        .then((data) => {
          setFullName(data.fullName || '');
          setAvatarUrl(data.avatarUrl || '');
          if (data.institutionName) setInstitutionName(data.institutionName);
          if (data.branch) setBranch(data.branch);
          if (data.gradYear) setGradYear(data.gradYear);
          if (data.cgpa) setCgpa(data.cgpa);
          if (data.targetRole) setTargetRole(data.targetRole);
          if (data.companyName) setCompanyName(data.companyName);
          if (data.sector) setSector(data.sector);
          if (data.websiteUrl) setWebsiteUrl(data.websiteUrl);
          if (data.description) setDescription(data.description);
          if (data.department) setDepartment(data.department);
          if (data.state) setState(data.state);
          if (data.contactPerson) setContactPerson(data.contactPerson);
        })
        .catch((err) => {
          setErrorMessage(err.message || 'Failed to load profile details from server.');
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, user?.id]);

  if (!isOpen) return null;

  const initials = fullName
    ? fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'TO';

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    const payload = {
      fullName: fullName.trim(),
      avatarUrl: avatarUrl.trim(),
      institutionName: institutionName.trim(),
      branch: branch.trim(),
      gradYear: gradYear ? parseInt(gradYear, 10) : null,
      cgpa: cgpa ? parseFloat(cgpa) : null,
      targetRole: targetRole.trim(),
      companyName: companyName.trim(),
      sector: sector.trim(),
      websiteUrl: websiteUrl.trim(),
      description: description.trim(),
      department: department.trim(),
      state: state.trim(),
      contactPerson: contactPerson.trim()
    };

    try {
      const updated = await profileAPI.updateProfile(user.id, payload);
      setSuccessMessage('Profile updated and saved to real MySQL database successfully!');
      if (onProfileUpdated) {
        onProfileUpdated(updated);
      }
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err) {
      setErrorMessage(err.message || 'Could not save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-card animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="profile-modal-header">
          <div>
            <h2 className="profile-modal-title">Profile Settings</h2>
            <p className="profile-modal-sub">Update your personal information and public visibility details</p>
          </div>
          <button type="button" onClick={onClose} className="profile-modal-close-btn" aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Feedback Banners */}
        {errorMessage && (
          <div className="profile-modal-alert error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="profile-modal-alert success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSave} className="profile-modal-body">
          {/* Avatar Section */}
          <div className="profile-avatar-row">
            <Avatar className="profile-preview-avatar">
              <AvatarImage src={avatarUrl} alt={fullName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="profile-avatar-inputs">
              <Label htmlFor="avatarUrl">Profile Image URL</Label>
              <Input
                id="avatarUrl"
                type="url"
                placeholder="https://images.unsplash.com/... or https://..."
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
              <span className="profile-input-hint">Paste a public image URL or keep default initials avatar.</span>
            </div>
          </div>

          {/* Full Name */}
          <div className="profile-form-group">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Student Fields */}
          {user?.role === 'STUDENT' && (
            <>
              <div className="profile-form-row">
                <div className="profile-form-group">
                  <Label htmlFor="branch">Academic Branch / Major</Label>
                  <Input
                    id="branch"
                    type="text"
                    placeholder="e.g. B.Sc. Information Technology"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  />
                </div>
                <div className="profile-form-group">
                  <Label htmlFor="gradYear">Graduation Year</Label>
                  <Input
                    id="gradYear"
                    type="number"
                    placeholder="2026"
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                  />
                </div>
              </div>

              <div className="profile-form-row">
                <div className="profile-form-group">
                  <Label htmlFor="cgpa">Current CGPA (out of 10)</Label>
                  <Input
                    id="cgpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    placeholder="9.4"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                  />
                </div>
                <div className="profile-form-group">
                  <Label htmlFor="targetRole">Target Career Role</Label>
                  <Input
                    id="targetRole"
                    type="text"
                    placeholder="e.g. Full Stack Engineer"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {/* Recruiter / Industry Fields */}
          {user?.role === 'INDUSTRY' && (
            <>
              <div className="profile-form-group">
                <Label htmlFor="companyName">Company / Organization Name</Label>
                <Input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="profile-form-row">
                <div className="profile-form-group">
                  <Label htmlFor="sector">Industry Sector</Label>
                  <Input
                    id="sector"
                    type="text"
                    placeholder="e.g. Enterprise IT & Cloud"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                  />
                </div>
                <div className="profile-form-group">
                  <Label htmlFor="websiteUrl">Official Website</Label>
                  <Input
                    id="websiteUrl"
                    type="url"
                    placeholder="https://company.example.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {/* Academician Fields */}
          {user?.role === 'ACADEMICIAN' && (
            <div className="profile-form-row">
              <div className="profile-form-group">
                <Label htmlFor="institutionName">Affiliated University / College</Label>
                <Input
                  id="institutionName"
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                />
              </div>
              <div className="profile-form-group">
                <Label htmlFor="department">Academic Department</Label>
                <Input
                  id="department"
                  type="text"
                  placeholder="e.g. Computer Science & Engineering"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="profile-modal-footer">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving to Database...' : 'Save Profile Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
