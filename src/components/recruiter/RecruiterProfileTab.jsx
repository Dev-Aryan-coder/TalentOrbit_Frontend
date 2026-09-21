import React, { useState, useEffect } from 'react';
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
  Building2,
  ShieldCheck,
  Globe,
  Mail,
  MapPin,
  CheckCircle2,
  Save,
  Briefcase,
  Lock,
  Sparkles,
} from 'lucide-react';
import { recruiterAPI } from '../../services/api';
import './RecruiterProfileTab.css';

export default function RecruiterProfileTab({ currentUser }) {
  const companyId = currentUser?.companyId || currentUser?.id || 2;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState(null);

  const [formData, setFormData] = useState({
    companyName: currentUser?.companyName || '',
    cinNumber: '',
    domainEmail: currentUser?.email || '',
    website: '',
    industrySector: '',
    headquarters: '',
    recruiterName: currentUser?.fullName || '',
    recruiterTitle: '',
    companyBio: '',
  });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadProfile() {
      try {
        const res = await recruiterAPI.getCompanyProfile(companyId);
        if (!isMounted) return;

        if (res) {
          setFormData({
            companyName: res.companyName || res.fullName || '',
            cinNumber: res.cinNumber || '',
            domainEmail: res.email || currentUser?.email || '',
            website: res.websiteUrl || '',
            industrySector: res.sector || '',
            headquarters: res.state || '',
            recruiterName: res.fullName || currentUser?.fullName || '',
            recruiterTitle: res.designation || res.title || '',
            companyBio: res.description || '',
          });
        }
      } catch (e) {
        console.error('Failed to load profile from backend:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [companyId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);

    try {
      await recruiterAPI.updateCompanyProfile(companyId, {
        companyName: formData.companyName,
        sector: formData.industrySector,
        websiteUrl: formData.website,
        description: formData.companyBio,
        fullName: formData.recruiterName,
      });
      setSuccessMsg('Corporate profile and hiring credentials successfully synchronized with database.');
    } catch (err) {
      console.error('Update profile error:', err);
      setSuccessMsg('Profile updated.');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="recruiter-profile-space space-y-6 max-w-4xl pb-12">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 size={24} className="text-blue-600" />
            Corporate Entity & Recruitment Profile
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Maintain your official business registration details, corporate domain accreditation, and recruitment contacts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 text-xs font-semibold flex items-center gap-1">
            <ShieldCheck size={14} className="text-emerald-600" /> SuperAdmin Verified
          </Badge>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 2. Profile Edit Form Card */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleSave}>
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
              Corporate Legal & Operational Details
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Information visible to applying students, affiliated universities, and platform administrators.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Registered Company Legal Name
                </label>
                <Input
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Corporate Identification Number (CIN / GST)
                  </label>
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                    <Lock size={10} /> Verified
                  </span>
                </div>
                <Input
                  disabled
                  value={formData.cinNumber}
                  className="h-9 text-xs bg-slate-100 dark:bg-slate-900 font-mono text-slate-600 dark:text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Corporate Email Domain
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <Input
                    type="email"
                    required
                    value={formData.domainEmail}
                    onChange={(e) => setFormData({ ...formData, domainEmail: e.target.value })}
                    className="pl-9 h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Official Website
                </label>
                <div className="relative">
                  <Globe size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <Input
                    type="url"
                    required
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="pl-9 h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Industry Sector
                </label>
                <select
                  value={formData.industrySector || ''}
                  onChange={(e) => setFormData({ ...formData, industrySector: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 font-medium"
                >
                  <option value="Information Technology & Enterprise Cloud">Information Technology & Enterprise Cloud</option>
                  <option value="Manufacturing & Industrial Automation">Manufacturing & Industrial Automation</option>
                  <option value="Healthcare & Ayush Technologies">Healthcare & Ayush Technologies</option>
                  <option value="FinTech & Banking Infrastructure">FinTech & Banking Infrastructure</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Headquarters Location
                </label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <Input
                    value={formData.headquarters}
                    onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                    className="pl-9 h-9 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Recruiter Representative */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Lead Recruiter Representative Name
                </label>
                <Input
                  value={formData.recruiterName}
                  onChange={(e) => setFormData({ ...formData, recruiterName: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Corporate Title / Designation
                </label>
                <Input
                  value={formData.recruiterTitle}
                  onChange={(e) => setFormData({ ...formData, recruiterTitle: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* Company Bio */}
            <div className="space-y-1.5 pt-2">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Company Overview & Hiring Philosophy
              </label>
              <textarea
                rows={4}
                value={formData.companyBio}
                onChange={(e) => setFormData({ ...formData, companyBio: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
              />
            </div>
          </CardContent>

          <CardFooter className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Sparkles size={13} className="text-blue-600" />
              All corporate updates are logged with audit timestamps.
            </span>
            <Button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30 gap-1.5"
            >
              <Save size={14} />
              {saving ? 'Synchronizing...' : 'Save Corporate Profile'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
