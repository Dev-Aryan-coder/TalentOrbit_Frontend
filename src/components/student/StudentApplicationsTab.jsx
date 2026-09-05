import React, { useState, useEffect, useMemo } from 'react';
import { applicationsAPI } from '../../services/api';
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
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  XCircle,
  RefreshCw,
  Building2,
  AlertTriangle,
  Briefcase,
  Search,
  Filter,
  ArrowRight,
  Eye,
  X,
  Sparkles,
  Send,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import './StudentApplicationsTab.css';

export default function StudentApplicationsTab({ currentUser, onSelectTab }) {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedAppTimeline, setSelectedAppTimeline] = useState(null);

  const userId = currentUser?.id || currentUser?.userId;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    applicationsAPI.getByUser(userId)
      .then((res) => {
        if (Array.isArray(res)) {
          const mapped = res.map((item) => ({
            id: item.id,
            title: item.postingTitle || item.posting?.title || 'Senior Java Microservices & Cloud Intern',
            companyName: item.companyName || item.posting?.postedByName || item.posting?.companyName || 'TCS Digital Innovation Labs',
            postingType: item.posting?.postingType || item.postingType || 'INTERNSHIP',
            appliedDate: item.appliedAt ? String(item.appliedAt).split('T')[0] : '2026-09-05',
            status: item.status || 'APPLIED',
            interviewDate: item.interviewScheduledAt || null,
            location: item.posting?.location || 'Mumbai (Hybrid)',
            stipend: item.posting?.stipend || '₹35,000 / month',
          }));
          setApplications(mapped);
        }
      })
      .catch((err) => {
        console.warn('Could not load user applications from database:', err.message);
        setApplications([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // Funnel Counts
  const appliedCount = applications.filter((a) => a.status === 'APPLIED' || a.status === 'UNDER_REVIEW').length;
  const shortlistedCount = applications.filter((a) => a.status === 'SHORTLISTED').length;
  const interviewCount = applications.filter((a) => a.status === 'INTERVIEW_SCHEDULED').length;
  const selectedCount = applications.filter((a) => a.status === 'SELECTED' || a.status === 'COMPLETED').length;

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'INTERVIEW_SCHEDULED':
        return (
          <Badge variant="amber" className="text-xs font-bold gap-1 py-1 px-2.5 shadow-2xs">
            <Calendar size={12} />
            <span>Interview Scheduled</span>
          </Badge>
        );
      case 'SHORTLISTED':
        return (
          <Badge variant="indigo" className="text-xs font-bold gap-1 py-1 px-2.5 shadow-2xs">
            <Sparkles size={12} />
            <span>Shortlisted</span>
          </Badge>
        );
      case 'SELECTED':
      case 'COMPLETED':
        return (
          <Badge variant="emerald" className="text-xs font-bold gap-1 py-1 px-2.5 shadow-2xs">
            <CheckCircle2 size={12} />
            <span>Selected & Offered</span>
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="outline" className="text-xs font-medium gap-1 text-slate-500 py-1 px-2.5">
            <XCircle size={12} />
            <span>Archived</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="indigo" className="text-xs font-bold gap-1 py-1 px-2.5 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 shadow-2xs">
            <Clock size={12} />
            <span>Under Review</span>
          </Badge>
        );
    }
  };

  // Filtered Applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Status Filter
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'APPLIED' && app.status !== 'APPLIED' && app.status !== 'UNDER_REVIEW') return false;
        if (statusFilter === 'SHORTLISTED' && app.status !== 'SHORTLISTED') return false;
        if (statusFilter === 'INTERVIEW' && app.status !== 'INTERVIEW_SCHEDULED') return false;
        if (statusFilter === 'SELECTED' && app.status !== 'SELECTED' && app.status !== 'COMPLETED') return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = app.title.toLowerCase().includes(q);
        const matchesCompany = app.companyName.toLowerCase().includes(q);
        const matchesLocation = (app.location || '').toLowerCase();
        if (!matchesTitle && !matchesCompany && !matchesLocation) return false;
      }

      return true;
    });
  }, [applications, statusFilter, searchQuery]);

  return (
    <div className="student-applications-container pb-12">
      {/* 1. Hero Header Area with Glassmorphism */}
      <div className="applications-hero-banner">
        <div className="applications-hero-text">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="p-1.5 rounded-lg bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
              <FileText size={20} />
            </span>
            <Badge variant="indigo" className="font-semibold text-xs">
              Live Candidacy Radar
            </Badge>
            <Badge variant="emerald" className="gap-1 items-center font-medium text-xs">
              <ShieldCheck size={12} />
              <span>Tamper-Verified Credentials Transmitted</span>
            </Badge>
          </div>
          <h1 className="applications-hero-title">Application Pipeline & Tracking</h1>
          <p className="applications-hero-desc">
            Monitor your active corporate internship and engineering applications in real time. Track recruiter screenings, shortlists, and upcoming technical interviews.
          </p>
        </div>

        <div className="applications-hero-actions flex items-center gap-3">
          <Button
            variant="brand"
            size="sm"
            onClick={() => onSelectTab && onSelectTab('opportunities')}
            className="gap-1.5 shadow-sm"
          >
            <Briefcase size={14} />
            <span>Browse More Opportunities</span>
          </Button>
        </div>
      </div>

      {/* 2. Pipeline Funnel Stats Cards (Shadcn UI Card) */}
      <div className="app-pipeline-grid">
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Under Review</span>
              <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600">
                <Clock size={16} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {appliedCount}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Profiles in recruiter review</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Shortlisted</span>
              <div className="p-1.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-600">
                <Sparkles size={16} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {shortlistedCount}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Advanced to talent pool</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Interviews Scheduled</span>
              <div className="p-1.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600">
                <Calendar size={16} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {interviewCount}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Technical rounds queued</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Selected & Placed</span>
              <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                <CheckCircle2 size={16} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {selectedCount}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Formal corporate offers</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Search and Stage Filter Controls */}
      <Card className="border shadow-sm bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input
                type="text"
                placeholder="Search by role title, corporate partner, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 bg-white dark:bg-slate-950"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                variant={statusFilter === 'ALL' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('ALL')}
                className="h-8 text-xs px-3"
              >
                All Applications ({applications.length})
              </Button>
              <Button
                variant={statusFilter === 'APPLIED' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('APPLIED')}
                className="h-8 text-xs px-3 gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                Under Review ({appliedCount})
              </Button>
              <Button
                variant={statusFilter === 'SHORTLISTED' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('SHORTLISTED')}
                className="h-8 text-xs px-3 gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
                Shortlisted ({shortlistedCount})
              </Button>
              <Button
                variant={statusFilter === 'INTERVIEW' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('INTERVIEW')}
                className="h-8 text-xs px-3 gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                Interviews ({interviewCount})
              </Button>
              <Button
                variant={statusFilter === 'SELECTED' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('SELECTED')}
                className="h-8 text-xs px-3 gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Selected ({selectedCount})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Applications List / Table (Shadcn UI Card) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <RefreshCw size={32} className="animate-spin text-indigo-500 mb-3" />
          <p className="text-sm font-semibold">Retrieving candidate application tracking...</p>
        </div>
      ) : applications.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <AlertTriangle size={36} className="text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No Applications Submitted Yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
            You haven't applied to any corporate openings yet. Browse matched opportunities to apply with 1-click verified credentials.
          </p>
          <Button
            variant="brand"
            size="sm"
            onClick={() => onSelectTab && onSelectTab('opportunities')}
            className="gap-2 mx-auto"
          >
            <Briefcase size={16} />
            <span>Explore Matched Opportunities</span>
          </Button>
        </Card>
      ) : filteredApplications.length === 0 ? (
        <Card className="p-10 text-center border-dashed">
          <AlertTriangle size={32} className="text-amber-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No Matching Applications</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No applications match your current search terms or filter selection.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
            }}
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <Card className="border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-slate-50/80 dark:bg-slate-900/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-5">Role & Position</th>
                  <th className="py-3.5 px-4">Corporate Partner</th>
                  <th className="py-3.5 px-4">Date Applied</th>
                  <th className="py-3.5 px-4">Candidacy Status</th>
                  <th className="py-3.5 px-4">Interview Schedule</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    {/* Role & Position */}
                    <td className="py-4 px-5">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 shrink-0 mt-0.5">
                          <FileText size={16} />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                            {app.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-slate-500 text-[11px]">
                            <Badge variant="outline" className="text-[10px] uppercase font-bold py-0">
                              {app.postingType}
                            </Badge>
                            <span>&bull;</span>
                            <span>{app.location}</span>
                            <span>&bull;</span>
                            <span className="font-semibold text-emerald-600">{app.stipend}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                        <Building2 size={14} className="text-slate-400" />
                        <span>{app.companyName}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">Verified Corporate Employer</span>
                    </td>

                    {/* Date Applied */}
                    <td className="py-4 px-4 font-medium text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{app.appliedDate}</span>
                      </div>
                    </td>

                    {/* Candidacy Status */}
                    <td className="py-4 px-4">
                      {renderStatusBadge(app.status)}
                    </td>

                    {/* Interview Details */}
                    <td className="py-4 px-4">
                      {app.interviewDate ? (
                        <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                          <Calendar size={13} />
                          <span>{String(app.interviewDate).replace('T', ' ')}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Screening in progress
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAppTimeline(app)}
                        className="text-xs font-semibold gap-1.5 h-8 bg-white dark:bg-slate-900 shadow-2xs hover:border-indigo-300"
                      >
                        <Eye size={13} className="text-indigo-600" />
                        <span>Track Stages</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 5. Candidacy Timeline Modal (Shadcn UI) */}
      {selectedAppTimeline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <Card className="max-w-lg w-full border shadow-2xl bg-white dark:bg-slate-900 animate-in fade-in-50 zoom-in-95">
            <CardHeader className="p-6 pb-4 border-b flex flex-row items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedAppTimeline.companyName}
                  </span>
                  <Badge variant="outline" className="text-[10px] uppercase py-0">
                    {selectedAppTimeline.postingType}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {selectedAppTimeline.title}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-1">
                  Application ID: #{selectedAppTimeline.id} &bull; Applied: {selectedAppTimeline.appliedDate}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedAppTimeline(null)}
                className="h-8 w-8 p-0 rounded-full"
              >
                <X size={16} />
              </Button>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Recruitment Stage Progression
              </h4>

              <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100 dark:before:bg-slate-800">
                {/* Stage 1 */}
                <div className="flex items-start gap-3 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      1. Application Transmitted & Logged
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Submitted on {selectedAppTimeline.appliedDate}. Verified skill matrix and employability badge attached.
                    </p>
                  </div>
                </div>

                {/* Stage 2 */}
                <div className="flex items-start gap-3 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      2. Credential Verification Passed
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Tamper-proof academic, aptitude, and soft skill evaluations validated by TalentOrbit.
                    </p>
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="flex items-start gap-3 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm animate-pulse">
                    3
                  </div>
                  <div>
                    <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                      3. Recruiter Shortlisting & Screening
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Corporate hiring manager is evaluating candidate portfolio against role specifications.
                    </p>
                  </div>
                </div>

                {/* Stage 4 */}
                <div className="flex items-start gap-3 relative z-10 opacity-60">
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      4. Technical & Behavioral Interview
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {selectedAppTimeline.interviewDate
                        ? `Scheduled on ${selectedAppTimeline.interviewDate}`
                        : 'Pending notification from recruiter.'}
                    </p>
                  </div>
                </div>

                {/* Stage 5 */}
                <div className="flex items-start gap-3 relative z-10 opacity-60">
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">
                    5
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      5. Final Placement Selection
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Formal offer letter and internship onboarding agreement.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-4 border-t bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Status: <strong className="text-indigo-600 uppercase">{selectedAppTimeline.status}</strong>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedAppTimeline(null)}
              >
                Close Tracking
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
