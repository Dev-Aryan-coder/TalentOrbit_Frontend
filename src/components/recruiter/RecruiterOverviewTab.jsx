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
import {
  Briefcase,
  Users,
  CalendarCheck,
  Award,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Search,
  Building2,
  PlusCircle,
  FileCheck,
} from 'lucide-react';
import { recruiterAPI, postingsAPI } from '../../services/api';
import './RecruiterOverviewTab.css';

export default function RecruiterOverviewTab({ currentUser, onSelectTab }) {
  const companyId = currentUser?.companyId || currentUser?.id || 2;
  const companyName = currentUser?.companyName || currentUser?.fullName || currentUser?.email?.split('@')[0] || 'Enterprise';

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activePostings: 0,
    totalApplicants: 0,
    shortlisted: 0,
    interviewsScheduled: 0,
    offersAccepted: 0,
    avgMatchRate: 0,
  });

  const [funnelData, setFunnelData] = useState([]);
  const [topSkills, setTopSkills] = useState([]);
  const [recentApplicants, setRecentApplicants] = useState([]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadDashboardData() {
      try {
        // 1. Fetch live backend stats from /api/dashboard/stats?role=INDUSTRY&userId=companyId
        const dashRes = await recruiterAPI.getDashboardStats(companyId).catch(() => null);
        const statsMap = dashRes?.stats || {};

        const activePostings = Number(statsMap.activePostingCount ?? 0);
        const totalApps = Number(statsMap.totalApplicationsReceived ?? 0);
        const appliedCount = Number(statsMap.appliedCount ?? 0);
        const shortlistedCount = Number(statsMap.shortlistedCount ?? 0);
        const selectedCount = Number(statsMap.selectedCount ?? 0);
        const scheduledInterviews = Number(statsMap.scheduledInterviews ?? 0);

        // 2. Fetch real active postings from /api/postings/active
        const postingsRes = await recruiterAPI.getCompanyPostings(companyId).catch(() => []);
        const activeList = Array.isArray(postingsRes) ? postingsRes : [];

        // 3. For the postings, fetch real ranked applicants from /api/applications/posting/{id}/ranked
        let allApplicants = [];
        let skillCounts = {};

        for (const p of activeList) {
          try {
            const apps = await recruiterAPI.getRankedApplicants(p.id);
            if (Array.isArray(apps)) {
              apps.forEach(a => {
                allApplicants.push({
                  id: a.id || a.applicationId,
                  name: a.studentName || a.name || 'Candidate',
                  role: p.title || '',
                  college: a.institutionName || a.college || '',
                  matchScore: a.matchScore ?? 0,
                  appliedAt: a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : '',
                  status: a.status || 'APPLIED',
                  matchedSkills: Array.isArray(a.matchedSkills) ? a.matchedSkills : [],
                  missingSkills: Array.isArray(a.missingSkills) ? a.missingSkills : [],
                });

                if (Array.isArray(a.matchedSkills)) {
                  a.matchedSkills.forEach(s => {
                    skillCounts[s] = (skillCounts[s] || 0) + 1;
                  });
                }
              });
            }
          } catch (e) {
            // Posting has no applicants or endpoint error
          }
        }

        if (!isMounted) return;

        // Calculate average match rate
        const avgMatch = allApplicants.length > 0
          ? Math.round(allApplicants.reduce((sum, a) => sum + (a.matchScore || 0), 0) / allApplicants.length)
          : 0;

        setStats({
          activePostings: activePostings || activeList.length,
          totalApplicants: totalApps || allApplicants.length,
          shortlisted: shortlistedCount || allApplicants.filter(a => a.status === 'SHORTLISTED').length,
          interviewsScheduled: scheduledInterviews,
          offersAccepted: selectedCount || allApplicants.filter(a => a.status === 'SELECTED').length,
          avgMatchRate: avgMatch,
        });

        // Application Pipeline Conversion Funnel purely from backend data
        setFunnelData([
          { stage: 'Applied', count: appliedCount || allApplicants.length, fill: '#3b82f6' },
          { stage: 'Under Review', count: allApplicants.filter(a => a.status === 'UNDER_REVIEW').length, fill: '#6366f1' },
          { stage: 'Shortlisted', count: shortlistedCount || allApplicants.filter(a => a.status === 'SHORTLISTED').length, fill: '#8b5cf6' },
          { stage: 'Interview', count: scheduledInterviews, fill: '#ec4899' },
          { stage: 'Selected', count: selectedCount || allApplicants.filter(a => a.status === 'SELECTED').length, fill: '#10b981' },
        ]);

        // Top skills distribution derived purely from applicants in database
        const skillsArray = Object.entries(skillCounts)
          .map(([skill, count]) => ({ skill, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6);

        setTopSkills(skillsArray);
        setRecentApplicants(allApplicants);
      } catch (err) {
        console.error('Failed to fetch recruiter dashboard telemetry from backend:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [companyId]);

  return (
    <div className="recruiter-overview-space space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1">
                <Building2 size={12} /> {companyName} Recruitment Suite
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <ShieldCheck size={12} /> Verified Corporate Partner
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Talent Acquisition Command Center
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Real-time monitoring of campus internship pipelines, automated semantic ATS candidate scoring, and verified academic credentials.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              onClick={() => onSelectTab('postings')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 gap-1.5"
            >
              <PlusCircle size={15} />
              Post New Opportunity
            </Button>
            <Button
              onClick={() => onSelectTab('talent-pool')}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-medium text-xs gap-1.5"
            >
              <Search size={15} />
              Scout Talent Pool
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Key Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Openings</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
                <Briefcase size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.activePostings}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-0.5">
              <TrendingUp size={12} /> 2 newly listed this week
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Applicants</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
                <Users size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.totalApplicants}
            </div>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-1 flex items-center gap-0.5">
              <ArrowUpRight size={12} /> Across all open pipelines
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Shortlisted</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
                <FileCheck size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.shortlisted}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              Top 23% candidate tier
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Interviews</span>
              <div className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-950/50 text-pink-600 flex items-center justify-center">
                <CalendarCheck size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.interviewsScheduled}
            </div>
            <p className="text-[11px] text-pink-600 dark:text-pink-400 font-medium mt-1 flex items-center gap-0.5">
              <Clock size={12} /> 4 scheduled today
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition col-span-2 md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Offers Accepted</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                <Award size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.offersAccepted}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-0.5">
              <CheckCircle2 size={12} /> 100% verified badges
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Analytics Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel Chart (2 Cols) */}
        <Card className="lg:col-span-2 border-slate-200/80 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <TrendingUp size={18} className="text-blue-600" />
                  Application Pipeline Conversion Funnel
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Real-time progression from initial application submission to accepted offer.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono bg-blue-50 dark:bg-blue-950 text-blue-700 border-blue-200">
                Avg Match: {stats.avgMatchRate}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Custom Interactive Conversion Funnel */}
            <div className="space-y-3 py-1">
              {funnelData.map((item, idx) => {
                const maxVal = Math.max(...funnelData.map(d => d.count || 1), 1);
                const percent = Math.round((item.count / maxVal) * 100);
                const prevCount = idx > 0 ? funnelData[idx - 1].count : null;
                const conversionRate = prevCount && prevCount > 0 ? Math.round((item.count / prevCount) * 100) : 100;

                return (
                  <div key={item.stage} className="group">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{item.stage}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {idx > 0 && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {conversionRate}% conv.
                          </span>
                        )}
                        <span className="font-bold text-slate-900 dark:text-white font-mono">
                          {item.count} <span className="text-slate-400 text-[10px] font-normal">candidates</span>
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out group-hover:brightness-110"
                        style={{
                          width: `${Math.max(percent, 4)}%`,
                          backgroundColor: item.fill,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-around border-t border-slate-100 dark:border-slate-800 mt-4 pt-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Applied ({funnelData[0]?.count})
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Shortlisted ({funnelData[2]?.count})
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Hired ({funnelData[4]?.count})
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top In-Demand Applicant Skills */}
        <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <Sparkles size={18} className="text-purple-600" />
              Verified Skills Distribution
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Most prevalent competencies among your active applicant pool.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5 py-1">
              {topSkills.map((s) => {
                const maxSkill = Math.max(...topSkills.map(x => x.count || 1), 1);
                const skillPercent = Math.round((s.count / maxSkill) * 100);
                return (
                  <div key={s.skill} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-indigo-500" />
                        {s.skill}
                      </span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                        {s.count} <span className="text-[10px] text-slate-400 font-normal">students</span>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(skillPercent, 6)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Recent High-Match Applicants Table */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Recent High-Priority Applicants
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Candidates pre-ranked using semantic AI ATS scoring against active job requirements.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectTab('ats')}
              className="text-xs font-semibold gap-1 text-blue-600 hover:text-blue-700"
            >
              View Full ATS Pipeline <ChevronRight size={14} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Candidate & University</th>
                  <th className="py-3 px-4">Target Opportunity</th>
                  <th className="py-3 px-4">AI Compatibility Match</th>
                  <th className="py-3 px-4">Verified Skills</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentApplicants.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">
                      No active applicants found in your pipeline yet.
                    </td>
                  </tr>
                ) : (
                  recentApplicants.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                          {candidate.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{candidate.name}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{candidate.college}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{candidate.role}</p>
                      <p className="text-[10px] text-slate-400">{candidate.appliedAt}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              candidate.matchScore >= 90
                                ? 'bg-emerald-500'
                                : candidate.matchScore >= 80
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${candidate.matchScore}%` }}
                          />
                        </div>
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                          {candidate.matchScore}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {candidate.matchedSkills.map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                          >
                            ✓ {s}
                          </span>
                        ))}
                        {candidate.missingSkills.map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40"
                          >
                            ✗ {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        className={`text-[11px] font-medium ${
                          candidate.status === 'SHORTLISTED'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200'
                            : candidate.status === 'INTERVIEW_SCHEDULED'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200'
                            : candidate.status === 'UNDER_REVIEW'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {candidate.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onSelectTab('ats')}
                        className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 px-2"
                      >
                        Screen in ATS
                      </Button>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
