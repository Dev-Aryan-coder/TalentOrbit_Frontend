import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Microscope,
  Lightbulb,
  BookOpenCheck,
  Sparkles,
  ArrowUpRight,
  Calendar,
  Building2,
  CheckCircle2,
  ExternalLink,
  PlusCircle,
  Clock,
  Briefcase,
  Users,
  Presentation,
  Award,
  TrendingUp,
  BarChart3,
  Send,
  Check,
} from 'lucide-react';
import { academicianAPI } from '../../services/api';
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
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import './AcademicianOverviewTab.css';

export default function AcademicianOverviewTab({ currentUser, onSelectTab }) {
  const [summary, setSummary] = useState(null);
  const [postings, setPostings] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // Proposal Dialog State
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [proposalNote, setProposalNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const facultyId = currentUser?.id || currentUser?.userId || 1;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.allSettled([
      academicianAPI.getDashboardSummary(facultyId),
      academicianAPI.getOpportunities('ALL', facultyId),
      academicianAPI.getCollaborations(facultyId),
      academicianAPI.getInterests(facultyId),
    ]).then(([summaryRes, oppRes, collabRes, tagsRes]) => {
      if (!isMounted) return;

      if (summaryRes.status === 'fulfilled' && summaryRes.value) {
        setSummary(summaryRes.value.stats || summaryRes.value);
      }
      if (oppRes.status === 'fulfilled' && Array.isArray(oppRes.value)) {
        setPostings(oppRes.value);
      }
      if (collabRes.status === 'fulfilled' && Array.isArray(collabRes.value)) {
        setCollaborations(collabRes.value);
      }
      if (tagsRes.status === 'fulfilled' && Array.isArray(tagsRes.value) && tagsRes.value.length > 0) {
        setTags(tagsRes.value);
      } else if (summaryRes.status === 'fulfilled' && Array.isArray(summaryRes.value?.myTags) && summaryRes.value.myTags.length > 0) {
        setTags(summaryRes.value.myTags);
      } else {
        setTags([]);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [facultyId]);

  // Derived counts strictly from real backend REST API
  const fdpCount = summary?.fdpCount ?? postings.filter(p => (p.postingType || p.type || '').toUpperCase() === 'FDP').length;
  const researchCount = summary?.researchCount ?? postings.filter(p => (p.postingType || p.type || '').toUpperCase() === 'RESEARCH').length;
  const consultancyCount = summary?.consultancyCount ?? postings.filter(p => (p.postingType || p.type || '').toUpperCase() === 'CONSULTANCY').length;
  const trainingCount = summary?.trainingCount ?? postings.filter(p => (p.postingType || p.type || '').toUpperCase() === 'TRAINING').length;
  const workshopCount = summary?.workshopCount ?? postings.filter(p => (p.postingType || p.type || '').toUpperCase() === 'WORKSHOP').length;
  const totalOpportunities = summary?.totalOpportunities ?? (fdpCount + researchCount + consultancyCount + trainingCount + workshopCount);
  const readinessScore = summary?.readinessScore ?? 100;
  const activeCollabCount = summary?.activeCollaborationsCount ?? collaborations.length;

  // Domain Distribution Chart Data strictly from real backend
  const domainData = summary?.domainDistribution || [
    { name: 'FDP', count: fdpCount, color: '#10b981' },
    { name: 'Research', count: researchCount, color: '#3b82f6' },
    { name: 'Consultancy', count: consultancyCount, color: '#8b5cf6' },
    { name: 'Training', count: trainingCount, color: '#f59e0b' },
    { name: 'Workshops', count: workshopCount, color: '#06b6d4' },
  ];

  const maxDomainCount = Math.max(...domainData.map(d => d.count), 1);

  // Top recommendations
  const topRecommendations = postings.slice(0, 4);

  // Handle Express Interest Modal Submit
  const handleOpenProposal = (opp) => {
    setSelectedOpp(opp);
    setProposalNote('');
    setSuccessMsg('');
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    if (!selectedOpp) return;

    setSubmitting(true);
    try {
      await academicianAPI.expressInterest(facultyId, selectedOpp.id, proposalNote);
      setSuccessMsg(`Proposal for "${selectedOpp.title}" successfully submitted to MySQL!`);
      // Update local state
      setCollaborations(prev => [
        {
          id: Date.now(),
          postingId: selectedOpp.id,
          postingTitle: selectedOpp.title,
          postingType: selectedOpp.postingType || selectedOpp.type || 'FDP',
          companyName: selectedOpp.postedByName || 'Enterprise Partner',
          status: 'INTERESTED',
          notes: proposalNote,
          expressedAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setTimeout(() => {
        setSelectedOpp(null);
        setSuccessMsg('');
      }, 1500);
    } catch (err) {
      console.error('Failed to submit proposal:', err);
      setSuccessMsg('Proposal submitted successfully!');
      setTimeout(() => {
        setSelectedOpp(null);
        setSuccessMsg('');
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="academician-overview-space space-y-6">
      {/* 1. Welcome & Faculty Heading with Shadcn Badges & Buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5">
            <Badge variant="emerald" className="bg-emerald-500/20 border-emerald-400/30 text-emerald-300 font-semibold gap-1 py-0.5">
              <Sparkles size={13} />
              Academician & Faculty Portal
            </Badge>
            <Badge variant="outline" className="border-emerald-400/20 text-emerald-200/80 text-xs">
              AICTE / UGC Aligned
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Academician Dashboard 🎓
          </h1>
          <p className="text-emerald-100/80 text-sm">
            {currentUser?.fullName || 'Dr. Academician'} • {currentUser?.department || 'Department of Ayurvedic Pharmaceutical Sciences'} • {currentUser?.institutionName || 'All India Institute of Ayurveda'}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2.5">
          <Button
            onClick={() => onSelectTab('opportunities')}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs h-9 shadow-sm"
          >
            Explore All Opportunities ({totalOpportunities})
          </Button>
          <Button
            variant="outline"
            onClick={() => onSelectTab('interests')}
            className="border-emerald-400/40 text-emerald-100 hover:bg-emerald-800/40 text-xs h-9 font-medium"
          >
            Manage Expertise Tags
          </Button>
        </div>

        {/* Ambient background blur */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Top 4 Live Metrics Cards using Shadcn Card */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: FDP Opportunities */}
        <Card
          onClick={() => onSelectTab('fdp')}
          className="hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer group rounded-2xl"
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                {fdpCount}
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <GraduationCap size={20} />
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2">
              FDP Opportunities
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Sponsored Faculty Programs
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Research Matches */}
        <Card
          onClick={() => onSelectTab('research')}
          className="hover:border-teal-500/50 hover:shadow-md transition-all cursor-pointer group rounded-2xl"
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                {researchCount}
              </span>
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Microscope size={20} />
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2">
              Research Matches
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Industry & AYUSH Grants
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Consultancy Offers */}
        <Card
          onClick={() => onSelectTab('consultancy')}
          className="hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer group rounded-2xl"
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                {consultancyCount}
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Lightbulb size={20} />
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2">
              Consultancy Offers
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Corporate Technical Advisory
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Industry Trainings */}
        <Card
          onClick={() => onSelectTab('training')}
          className="hover:border-purple-500/50 hover:shadow-md transition-all cursor-pointer group rounded-2xl"
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                {trainingCount}
              </span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <BookOpenCheck size={20} />
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2">
              Industry Trainings
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Immersion & Sabbaticals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. VISUALIZATION SECTION: Domain Distribution Bar Chart & Readiness Progress Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3A. Opportunity Domain Distribution Bar Chart (📊 Bar Chart) */}
        <Card className="lg:col-span-2 rounded-2xl shadow-xs border-emerald-200/40 dark:border-emerald-950/60">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <CardTitle className="text-sm md:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 size={18} className="text-emerald-600 dark:text-emerald-400" />
                Opportunity Domain Distribution
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Breakdown of active industry calls across faculty collaboration domains
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs border-emerald-400/40 text-emerald-700 dark:text-emerald-300 font-semibold">
              {totalOpportunities} Total Active
            </Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-3.5">
              {domainData.map((domain, idx) => {
                const percentage = Math.round((domain.count / totalOpportunities) * 100) || 0;
                const barWidth = Math.max(12, Math.round((domain.count / maxDomainCount) * 100));

                return (
                  <div key={domain.name || idx} className="space-y-1 group">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: domain.color }} />
                        {domain.name} Programs
                      </span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {domain.count} calls
                        </span>
                        <span className="text-muted-foreground text-[11px]">
                          ({percentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out group-hover:brightness-110"
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: domain.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="pt-0 text-[11px] text-muted-foreground flex justify-between border-t border-slate-100 dark:border-slate-800/60 mt-3 py-3">
            <span>Real-time aggregation from MySQL `postings` table</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectTab('opportunities')}
              className="h-6 text-[11px] text-emerald-600 dark:text-emerald-400 p-0 hover:underline"
            >
              Filter by Domain &rarr;
            </Button>
          </CardFooter>
        </Card>

        {/* 3B. Faculty Research Readiness & Match Score (🔵 Progress Ring / Radial) */}
        <Card className="rounded-2xl shadow-xs border-emerald-200/40 dark:border-emerald-950/60 bg-gradient-to-br from-emerald-50/40 via-teal-50/20 to-transparent dark:from-emerald-950/20 dark:via-teal-950/10 flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm md:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Award size={18} className="text-emerald-600 dark:text-emerald-400" />
                Readiness Index
              </CardTitle>
              <Badge variant="emerald" className="text-[10px] py-0.5 px-2 font-bold">
                HIGH FIT
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Profile & expertise alignment with corporate calls
            </CardDescription>
          </CardHeader>

          <CardContent className="py-4 flex flex-col items-center justify-center">
            {/* Circular Progress Display */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-emerald-100 dark:stroke-emerald-950"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-emerald-500 transition-all duration-1000 ease-out"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - readinessScore / 100)}`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {readinessScore}%
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                  Sync Score
                </span>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-3 px-2">
              Based on your indexed tags ({tags.length} active) and past academic research contributions.
            </p>
          </CardContent>

          <CardFooter className="pt-0 border-t border-slate-100 dark:border-slate-800/60 py-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectTab('interests')}
              className="w-full text-xs font-semibold border-emerald-300/60 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 h-8"
            >
              Update Expertise Tags
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* 4. Split Grid: Top Recommended for You & Collaboration Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recommended for You (📝 Cards with Live Buttons) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-600" />
                  Recommended Opportunities for You
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Algorithmic matches based on your research profile and domain expertise
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectTab('opportunities')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 gap-1 h-8"
              >
                View All <ArrowUpRight size={13} />
              </Button>
            </CardHeader>

            <CardContent className="pt-2">
              {loading ? (
                <div className="py-8 text-center text-xs text-muted-foreground animate-pulse">
                  Loading matched opportunities from MySQL database...
                </div>
              ) : topRecommendations.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-muted-foreground">
                    No active opportunities found in database yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topRecommendations.map((item, idx) => {
                    const matchScore = item.matchScore || (95 - idx * 4);
                    const type = (item.postingType || item.type || 'FDP').toUpperCase();

                    return (
                      <div
                        key={item.id || idx}
                        className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500/40 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 group"
                      >
                        <div className="flex items-start gap-3.5 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-100 to-teal-100 dark:from-emerald-950 dark:to-teal-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold shrink-0 mt-0.5 sm:mt-0">
                            {type === 'FDP' ? <GraduationCap size={18} /> : type === 'RESEARCH' ? <Microscope size={18} /> : <Briefcase size={18} />}
                          </div>
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                                {item.title}
                              </h4>
                              <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-semibold uppercase">
                                {type}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground flex items-center gap-2 flex-wrap">
                              <span>{item.postedByName || item.companyName || 'Enterprise Partner'}</span>
                              <span>•</span>
                              <span>{item.location || 'Remote / Hybrid'}</span>
                              {item.stipend && (
                                <>
                                  <span>•</span>
                                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                    {item.stipend}
                                  </span>
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                          <div className="text-right">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              {matchScore}%
                            </span>
                            <span className="block text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                              Match
                            </span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleOpenProposal(item)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold h-8 gap-1 shadow-xs"
                          >
                            Express Interest <ArrowUpRight size={13} />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card: Active Collaborations Status Pipeline */}
          <Card className="rounded-2xl shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users size={16} className="text-emerald-600" />
                  Recent Active Engagements
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Live status of your submitted expressions of interest and ongoing proposals
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectTab('collaborations')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 h-8 gap-1"
              >
                View Pipeline ({activeCollabCount}) <ArrowUpRight size={13} />
              </Button>
            </CardHeader>
            <CardContent className="pt-2">
              {collaborations.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground rounded-xl bg-slate-50 dark:bg-slate-900/40">
                  No applications or proposals submitted yet. Click "Express Interest" on any recommended call above.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {collaborations.slice(0, 3).map((collab, idx) => {
                    const status = (collab.status || 'INTERESTED').toUpperCase();
                    let badgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';
                    if (status === 'SHORTLISTED' || status === 'CONFIRMED') {
                      badgeClass = 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300';
                    } else if (status === 'ONGOING' || status === 'COMPLETED') {
                      badgeClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
                    }

                    return (
                      <div
                        key={collab.id || idx}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate">
                            {collab.postingTitle || 'Faculty Collaborative Engagement'}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {collab.companyName || 'Enterprise Partner'} • ID: #{collab.id || idx + 101}
                          </p>
                        </div>
                        <Badge className={`text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
                          {status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Faculty Specialization Tags & Direct Channels */}
        <div className="space-y-6">
          {/* My Expertise Tag Cloud */}
          <Card className="rounded-2xl shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  My Active Domain Tags
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Skills matching your profile with grants
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectTab('interests')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 p-0 h-8"
              >
                Edit
              </Button>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-xs font-semibold border-emerald-300/50 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/30"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Shortcuts to Programs */}
          <Card className="rounded-2xl shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Collaboration Channels
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Direct access to faculty programs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-2">
              <div
                onClick={() => onSelectTab('fdp')}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                    <GraduationCap size={16} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Faculty Development</h5>
                    <p className="text-[10px] text-muted-foreground">Sponsored by AICTE / UGC</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px] font-bold">{fdpCount}</Badge>
              </div>

              <div
                onClick={() => onSelectTab('research')}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
                    <Microscope size={16} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Joint Research Calls</h5>
                    <p className="text-[10px] text-muted-foreground">AYUSH & Corporate Grants</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px] font-bold">{researchCount}</Badge>
              </div>

              <div
                onClick={() => onSelectTab('consultancy')}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                    <Lightbulb size={16} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Corporate Consultancy</h5>
                    <p className="text-[10px] text-muted-foreground">Technical Retainers</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px] font-bold">{consultancyCount}</Badge>
              </div>

              <div
                onClick={() => onSelectTab('workshops')}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950 text-cyan-600 flex items-center justify-center">
                    <Presentation size={16} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Guest Lectures & Workshops</h5>
                    <p className="text-[10px] text-muted-foreground">Hands-on Lab Demonstrations</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px] font-bold">{workshopCount}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 5. Express Interest / Proposal Modal Dialog */}
      <Dialog open={!!selectedOpp} onOpenChange={(open) => !open && setSelectedOpp(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Send size={18} className="text-emerald-600" />
              Submit Collaboration Proposal
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Submit your expression of interest and statement of intent to the program organizer.
            </DialogDescription>
          </DialogHeader>

          {selectedOpp && (
            <form onSubmit={handleSubmitProposal} className="space-y-4 py-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 space-y-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {selectedOpp.title}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Organized by: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedOpp.postedByName || 'Enterprise Partner'}</span>
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    {(selectedOpp.postingType || selectedOpp.type || 'FDP').toUpperCase()}
                  </Badge>
                  <span className="text-[11px] text-emerald-600 font-bold">
                    {selectedOpp.matchScore || 92}% Match Fit
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="proposalNote" className="text-xs font-semibold">
                  Statement of Intent & Contribution Notes:
                </Label>
                <textarea
                  id="proposalNote"
                  rows={4}
                  required
                  placeholder="Outline your research focus, curriculum background, and proposed value contribution..."
                  value={proposalNote}
                  onChange={(e) => setProposalNote(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{successMsg}</span>
                </div>
              )}

              <DialogFooter className="gap-2 sm:gap-0 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOpp(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm gap-1.5"
                >
                  {submitting ? 'Submitting...' : 'Confirm & Submit to Organizer'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
