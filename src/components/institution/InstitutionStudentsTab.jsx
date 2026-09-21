import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  Award,
  CheckCircle2,
  Briefcase,
  AlertCircle,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { institutionAPI } from '../../services/api';

export default function InstitutionStudentsTab({ currentUser, onSelectTab }) {
  const userId = currentUser?.id || currentUser?.userId || 1;

  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setErrorMsg(null);

    institutionAPI.getInstitutionDetails(userId)
      .then((prof) => {
        const aisheCode = prof?.aisheCode || currentUser?.aisheCode || 'C-33772';
        return institutionAPI.getCohortStudents(aisheCode);
      })
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data)) {
          setStudents(data);
        } else if (data?.data && Array.isArray(data.data)) {
          setStudents(data.data);
        } else {
          setStudents([]);
        }
      })
      .catch((err) => {
        if (isMounted) setErrorMsg(err.message || 'Could not fetch student cohort.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userId, currentUser]);

  // Extract unique branches from real cohort
  const availableBranches = ['ALL', ...new Set(students.map((s) => s.branch).filter(Boolean))];

  // Filtering
  const filteredStudents = students.filter((s) => {
    const matchQuery =
      (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.targetRole || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchBranch = branchFilter === 'ALL' || s.branch === branchFilter;
    const matchStatus = statusFilter === 'ALL' || s.placementStatus === statusFilter;

    return matchQuery && matchBranch && matchStatus;
  });

  const totalCount = students.length;
  const placedCount = students.filter((s) => s.placementStatus === 'PLACED').length;
  const activeAppCount = students.filter((s) => s.placementStatus === 'ACTIVE_APPLICANT').length;

  return (
    <div className="institution-tab-container animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Users className="text-indigo-600 dark:text-indigo-400" size={24} />
            <span>Cohort Students & Employability Roster</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Live student directory registered under your institution's AISHE code. Track individual skill genomes, employability index scores, and placement outcomes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            Total Cohort: {totalCount}
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            Placed: {placedCount}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student by name, email, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Branch Dropdown */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {availableBranches.map((br) => (
              <option key={br} value={br}>
                {br === 'ALL' ? 'All Engineering Branches' : br}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Placement Statuses</option>
            <option value="PLACED">Placed</option>
            <option value="ACTIVE_APPLICANT">Active In ATS</option>
            <option value="AVAILABLE">Available</option>
          </select>
        </div>
      </div>

      {/* Cohort Table (100% Real REST Data) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-16 text-center text-slate-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3" />
            <div className="text-sm font-medium">Fetching real student roster from cohort database...</div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-16 text-center text-slate-500 px-4">
            <Users size={40} className="mx-auto mb-2 text-slate-400 opacity-60" />
            <div className="font-bold text-base text-slate-800 dark:text-slate-200">
              No students found
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Ensure students have registered on TalentOrbit with your institution's AISHE code.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="institution-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Branch & Batch</th>
                  <th>CGPA</th>
                  <th>Target Role</th>
                  <th>Employability Score</th>
                  <th>Verified Skills</th>
                  <th>Placement Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((std, idx) => {
                  const empScore = std.employabilityScore || 0;
                  const isPlaced = std.placementStatus === 'PLACED';
                  const isActive = std.placementStatus === 'ACTIVE_APPLICANT';

                  return (
                    <tr key={std.userId || idx}>
                      <td>
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {std.name}
                        </div>
                        <div className="text-xs text-slate-500">{std.email}</div>
                      </td>

                      <td>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                          {std.branch}
                        </div>
                        <div className="text-[11px] text-slate-500">Class of {std.gradYear}</div>
                      </td>

                      <td>
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                          {std.cgpa ? `${std.cgpa} / 10` : '—'}
                        </span>
                      </td>

                      <td>
                        <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                          {std.targetRole}
                        </span>
                      </td>

                      <td>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 min-w-[30px]">
                            {empScore}%
                          </span>
                          <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                empScore >= 70 ? 'bg-emerald-500' : empScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(100, Math.max(0, empScore))}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {std.skills && std.skills.length > 0 ? (
                            std.skills.slice(0, 3).map((sk, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                              >
                                {sk}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">No skills assessed</span>
                          )}
                          {std.skills && std.skills.length > 3 && (
                            <span className="text-[10px] font-bold text-slate-500">
                              +{std.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        {isPlaced ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                              <CheckCircle2 size={12} />
                              PLACED
                            </span>
                            <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                              {std.placedCompany}
                            </div>
                            {std.offeredPackage && (
                              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                                ₹{std.offeredPackage} LPA
                              </div>
                            )}
                          </div>
                        ) : isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300">
                            <Briefcase size={12} />
                            IN INTERVIEW PIPELINE
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Available
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
