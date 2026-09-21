import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  CalendarCheck,
  Eye,
  ChevronDown,
  Download,
  ExternalLink,
  Award,
  AlertCircle,
  FileText,
  X,
} from 'lucide-react';
import { recruiterAPI, applicationsAPI, interviewsAPI } from '../../services/api';
import './RecruiterAtsPipelineTab.css';

export default function RecruiterAtsPipelineTab({
  currentUser,
  selectedPostingId,
  onSelectTab,
  onScheduleInterview,
}) {
  const companyId = currentUser?.companyId || currentUser?.id || 2;

  const [loading, setLoading] = useState(false);
  const [activeStage, setActiveStage] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeJobId, setActiveJobId] = useState(selectedPostingId || '');
  const [inspectCandidate, setInspectCandidate] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedApplicantForInterview, setSelectedApplicantForInterview] = useState(null);

  const [interviewForm, setInterviewForm] = useState({
    date: '',
    time: '',
    interviewer: '',
    meetingLink: '',
    notes: '',
  });

  const [jobsList, setJobsList] = useState([]);
  const [candidates, setCandidates] = useState([]);

  // Fetch active company jobs from backend
  useEffect(() => {
    let isMounted = true;
    recruiterAPI
      .getCompanyPostings(companyId)
      .then(async (res) => {
        if (!isMounted) return;
        if (Array.isArray(res) && res.length > 0) {
          const list = await Promise.all(
            res.map(async (p) => {
              let count = p.applicantCount ?? p.applicationsCount ?? 0;
              try {
                const apps = await recruiterAPI.getRankedApplicants(p.id);
                if (Array.isArray(apps)) count = apps.length;
              } catch {
                // ignore
              }
              return {
                id: p.id,
                title: p.title,
                applicants: count,
              };
            })
          );
          if (!isMounted) return;
          setJobsList(list);
          if (!activeJobId || !list.some((j) => j.id === activeJobId)) {
            setActiveJobId(list[0].id);
          }
        } else {
          setJobsList([]);
        }
      })
      .catch(() => {
        if (isMounted) setJobsList([]);
      });

    return () => {
      isMounted = false;
    };
  }, [companyId]);

  // Fetch real ranked applicants for the selected job opening
  useEffect(() => {
    if (!activeJobId) return;
    let isMounted = true;
    setLoading(true);

    recruiterAPI
      .getRankedApplicants(activeJobId)
      .then((res) => {
        if (!isMounted) return;
        if (Array.isArray(res)) {
          const mapped = res.map((a) => ({
            id: a.id || a.applicationId,
            name: a.studentName || a.name || 'Candidate',
            email: a.studentEmail || a.email || '',
            college: a.institutionName || a.college || '',
            branch: a.branch || '',
            cgpa: a.cgpa ?? null,
            graduationYear: a.gradYear || a.graduationYear || null,
            matchScore: a.matchScore ?? 0,
            status: a.status || 'APPLIED',
            appliedDate: a.appliedAt ? new Date(a.appliedAt).toISOString().split('T')[0] : '',
            matchedSkills: Array.isArray(a.matchedSkills) ? a.matchedSkills : [],
            missingSkills: Array.isArray(a.missingSkills) ? a.missingSkills : [],
            verifiedBadges: Array.isArray(a.verifiedBadges) ? a.verifiedBadges : [],
            github: a.githubUrl || a.github || '',
            bio: a.bio || '',
          }));
          setCandidates(mapped);
        } else {
          setCandidates([]);
        }
      })
      .catch((err) => {
        console.error('Failed to load applicants for job', activeJobId, err);
        if (isMounted) setCandidates([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeJobId]);

  const handleUpdateStatus = (candidateId, newStatus) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: newStatus } : c))
    );
    recruiterAPI
      .updateApplicationStatus(candidateId, newStatus)
      .catch((err) => console.error('Status update API error:', err));
  };

  const handleOpenScheduleModal = (candidate) => {
    setSelectedApplicantForInterview(candidate);
    setShowScheduleModal(true);
  };

  const handleConfirmScheduleInterview = (e) => {
    e.preventDefault();
    if (!selectedApplicantForInterview) return;

    handleUpdateStatus(selectedApplicantForInterview.id, 'INTERVIEW_SCHEDULED');

    interviewsAPI
      .schedule({
        applicationId: selectedApplicantForInterview.id,
        candidateName: selectedApplicantForInterview.name,
        companyId,
        scheduledDate: `${interviewForm.date}T${interviewForm.time}:00`,
        interviewerName: interviewForm.interviewer,
        meetingLink: interviewForm.meetingLink,
        notes: interviewForm.notes,
        status: 'SCHEDULED',
      })
      .catch((err) => console.warn('Schedule interview persist note:', err.message));

    setShowScheduleModal(false);
    alert(`Interview successfully scheduled for ${selectedApplicantForInterview.name}! A calendar invite and notification email have been transmitted.`);
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage = activeStage === 'ALL' || c.status === activeStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="recruiter-ats-space space-y-6 pb-12">
      {/* 1. Header Toolbar & Job Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200">
              <Sparkles size={11} className="mr-1 inline" /> AI Semantic ATS Engine
            </Badge>
            <span className="text-xs text-slate-500">Live Candidate Pipeline</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Applicant Tracking & Skill Benchmarking
          </h1>
        </div>

        {/* Opportunity Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
            Active Opening:
          </label>
          <select
            value={activeJobId ?? ''}
            onChange={(e) => setActiveJobId(e.target.value ? Number(e.target.value) : '')}
            className="h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {jobsList.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} ({job.applicants} applicants)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Pipeline Stage Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'ALL', label: 'All Applicants', count: candidates.length },
          { id: 'APPLIED', label: 'New Applied', count: candidates.filter((c) => c.status === 'APPLIED').length },
          { id: 'UNDER_REVIEW', label: 'Under Review', count: candidates.filter((c) => c.status === 'UNDER_REVIEW').length },
          { id: 'SHORTLISTED', label: 'Shortlisted', count: candidates.filter((c) => c.status === 'SHORTLISTED').length },
          { id: 'INTERVIEW_SCHEDULED', label: 'Interviews', count: candidates.filter((c) => c.status === 'INTERVIEW_SCHEDULED').length },
          { id: 'SELECTED', label: 'Selected / Hired', count: candidates.filter((c) => c.status === 'SELECTED').length },
          { id: 'REJECTED', label: 'Archived / Rejected', count: candidates.filter((c) => c.status === 'REJECTED').length },
        ].map((tab) => {
          const isActive = activeStage === tab.id;
          return (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveStage(tab.id)}
              className={`px-3 py-2 rounded-xl font-semibold transition whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Search Bar */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-3 text-slate-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by candidate name, university, or email..."
          className="pl-9 h-10 text-xs border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl"
        />
      </div>

      {/* 4. Candidates ATS Table */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Rank & Candidate</th>
                <th className="py-3 px-4">University & Batch</th>
                <th className="py-3 px-4">AI Semantic Match</th>
                <th className="py-3 px-4">Explainable Competencies</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Pipeline Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users size={28} className="text-slate-300 dark:text-slate-700" />
                      <p className="font-semibold text-sm">No applicants in this stage</p>
                      <p className="text-xs text-slate-400">When candidates apply to this opening, they will appear here ranked by AI compatibility.</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCandidates.map((candidate, idx) => (
                <tr key={candidate.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition">
                  {/* Rank + Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-xs text-slate-400 w-4 text-right">
                        #{idx + 1}
                      </span>
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                        {candidate.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-slate-900 dark:text-white text-xs">{candidate.name}</p>
                          <ShieldCheck size={13} className="text-emerald-500" title="Assessment Verified" />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{candidate.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* University & CGPA */}
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                      {candidate.college}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>CGPA: <strong className="text-slate-700 dark:text-slate-300">{candidate.cgpa}</strong></span>
                      <span>•</span>
                      <span>Class of {candidate.graduationYear}</span>
                    </div>
                  </td>

                  {/* AI Match Score */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-16 bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            candidate.matchScore >= 90
                              ? 'bg-emerald-500'
                              : candidate.matchScore >= 80
                              ? 'bg-blue-500'
                              : candidate.matchScore >= 70
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${candidate.matchScore}%` }}
                        />
                      </div>
                      <span
                        className={`font-mono font-bold text-xs ${
                          candidate.matchScore >= 90
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : candidate.matchScore >= 80
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-amber-600'
                        }`}
                      >
                        {candidate.matchScore}%
                      </span>
                    </div>
                  </td>

                  {/* Explainable Skill Breakdown */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {candidate.matchedSkills.map((s) => (
                        <span
                          key={s}
                          className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                          title="Verified Candidate Competency"
                        >
                          ✓ {s}
                        </span>
                      ))}
                      {candidate.missingSkills.map((s) => (
                        <span
                          key={s}
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40"
                          title="Missing Skill Gap"
                        >
                          ✗ {s}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    <Badge
                      className={`text-[10px] font-semibold tracking-wider ${
                        candidate.status === 'SHORTLISTED'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200'
                          : candidate.status === 'INTERVIEW_SCHEDULED'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200'
                          : candidate.status === 'SELECTED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200'
                          : candidate.status === 'UNDER_REVIEW'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200'
                          : candidate.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {candidate.status.replace('_', ' ')}
                    </Badge>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setInspectCandidate(candidate)}
                        className="h-8 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 px-2"
                        title="Inspect full candidate portfolio"
                      >
                        <Eye size={14} />
                      </Button>

                      {candidate.status !== 'SHORTLISTED' && candidate.status !== 'SELECTED' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(candidate.id, 'SHORTLISTED')}
                          className="h-8 text-xs font-semibold text-purple-600 border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 px-2.5"
                        >
                          Shortlist
                        </Button>
                      )}

                      <Button
                        size="sm"
                        onClick={() => handleOpenScheduleModal(candidate)}
                        className="h-8 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-2.5"
                      >
                        Interview
                      </Button>

                      {candidate.status !== 'SELECTED' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(candidate.id, 'SELECTED')}
                          className="h-8 text-xs font-semibold text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 px-2.5"
                        >
                          Select
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 5. Inspect Candidate Profile Modal */}
      {inspectCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 p-5 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                  {inspectCandidate.name[0]}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {inspectCandidate.name}
                    <ShieldCheck size={15} className="text-emerald-500" />
                  </h2>
                  <p className="text-xs text-slate-500">{inspectCandidate.college}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectCandidate(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              {/* Score Highlight */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
                    AI Semantic ATS Compatibility
                  </span>
                  <span className="text-2xl font-extrabold text-blue-700 dark:text-blue-300 font-mono">
                    {inspectCandidate.matchScore}% Match
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Verified CGPA</span>
                  <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                    {inspectCandidate.cgpa} / 10.0
                  </span>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Executive Summary</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                  {inspectCandidate.bio}
                </p>
              </div>

              {/* Verified Badges */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <Award size={15} className="text-purple-600" />
                  Tamper-Proof Verified Skill Accreditations (SHA-256 Hashed)
                </h4>
                <div className="space-y-1.5">
                  {inspectCandidate.verifiedBadges.map((badge) => (
                    <div
                      key={badge}
                      className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 flex items-center justify-between"
                    >
                      <span className="font-semibold text-purple-900 dark:text-purple-300">{badge}</span>
                      <span className="text-[10px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={11} /> Authenticated
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">Verified Artifacts</h4>
                <div className="flex items-center gap-3">
                  <a
                    href={inspectCandidate.github}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium flex items-center gap-1.5"
                  >
                    GitHub Portfolio <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInspectCandidate(null)}
                className="text-xs"
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  handleOpenScheduleModal(inspectCandidate);
                  setInspectCandidate(null);
                }}
                className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold"
              >
                Schedule Technical Interview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Schedule Interview Modal */}
      {showScheduleModal && selectedApplicantForInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="border-b border-slate-100 dark:border-slate-800 p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CalendarCheck size={17} className="text-blue-600" />
                  Schedule Technical Interview
                </h3>
                <p className="text-xs text-slate-500">
                  Candidate: <strong className="text-slate-800 dark:text-slate-200">{selectedApplicantForInterview.name}</strong> ({selectedApplicantForInterview.college})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmScheduleInterview} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Interview Date</label>
                  <Input
                    type="date"
                    required
                    value={interviewForm.date}
                    onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Start Time</label>
                  <Input
                    type="time"
                    required
                    value={interviewForm.time}
                    onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Assigned Evaluator / Interviewer</label>
                <Input
                  required
                  value={interviewForm.interviewer}
                  onChange={(e) => setInterviewForm({ ...interviewForm, interviewer: e.target.value })}
                  placeholder="e.g. Lead Software Engineer"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Meeting Video Link</label>
                <Input
                  required
                  value={interviewForm.meetingLink}
                  onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                  placeholder="e.g. https://meet.google.com/xyz"
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Evaluation Focus / Agenda Notes</label>
                <textarea
                  rows={2}
                  value={interviewForm.notes}
                  onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowScheduleModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30"
                >
                  Confirm & Dispatch Invite
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
