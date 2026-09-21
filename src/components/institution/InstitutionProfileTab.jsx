import React, { useState, useEffect } from 'react';
import {
  Building2,
  ShieldCheck,
  Award,
  MapPin,
  Mail,
  User,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { institutionAPI } from '../../services/api';

export default function InstitutionProfileTab({ currentUser, onProfileUpdated }) {
  const userId = currentUser?.id || currentUser?.userId || 1;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Form Fields
  const [institutionName, setInstitutionName] = useState('');
  const [aisheCode, setAisheCode] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [naacGrade, setNaacGrade] = useState('A++');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    institutionAPI.getInstitutionDetails(userId)
      .then((data) => {
        if (!isMounted || !data) return;
        setInstitutionName(data.institutionName || '');
        setAisheCode(data.aisheCode || '');
        setState(data.state || '');
        setCity(data.city || '');
        setNaacGrade(data.naacGrade || 'A++');
        setContactPerson(data.contactPerson || data.fullName || '');
        setContactEmail(data.email || '');
      })
      .catch((err) => {
        if (isMounted) setErrorMsg(err.message);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const payload = {
        institutionName: institutionName.trim(),
        aisheCode: aisheCode.trim(),
        state: state.trim(),
        city: city.trim(),
        contactPerson: contactPerson.trim(),
      };

      const updated = await institutionAPI.updateInstitutionDetails(userId, payload);
      setSuccessMsg('Institution details successfully saved to database!');
      if (onProfileUpdated) onProfileUpdated(updated);
    } catch (err) {
      setErrorMsg(`Failed to save: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="institution-tab-container animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <Building2 className="text-indigo-600 dark:text-indigo-400" size={24} />
          <span>Institution Profile & AISHE Verification</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Maintain your college's AISHE identifier, NAAC accreditation tier, and TPO officer contact details.
        </p>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 size={18} className="text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm flex items-center gap-3">
          <AlertCircle size={18} className="text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Profile Form Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        {isLoading ? (
          <div className="py-16 text-center text-slate-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3" />
            <div className="text-sm font-medium">Loading institutional records...</div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Institution Name */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Official Institution Name
                </label>
                <input
                  type="text"
                  required
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="e.g. National Institute of Technology, Karnataka"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* AISHE Code */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span>AISHE Code (Ministry of Education)</span>
                </label>
                <input
                  type="text"
                  required
                  value={aisheCode}
                  onChange={(e) => setAisheCode(e.target.value)}
                  placeholder="e.g. C-33772"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  All students registering with this code will join your institutional cohort.
                </span>
              </div>

              {/* NAAC Grade */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Award size={14} className="text-amber-500" />
                  <span>NAAC Accreditation Tier</span>
                </label>
                <select
                  value={naacGrade}
                  onChange={(e) => setNaacGrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="A++">A++ (Highest National Tier)</option>
                  <option value="A+">A+ Tier</option>
                  <option value="A">A Grade</option>
                  <option value="B++">B++ Grade</option>
                  <option value="B+">B+ Grade</option>
                  <option value="In Progress">Accreditation In Progress</option>
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Maharashtra"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Pune"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User size={14} className="text-slate-400" />
                  <span>TPO Officer Name</span>
                </label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Sharma"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Contact Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mail size={14} className="text-slate-400" />
                  <span>Official Placement Email</span>
                </label>
                <input
                  type="email"
                  disabled
                  value={contactEmail}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500 font-medium cursor-not-allowed"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Managed by institutional authentication claim.
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 shadow-sm flex items-center gap-2"
              >
                <Save size={16} />
                <span>{isSaving ? 'Saving to Database...' : 'Save Changes'}</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
