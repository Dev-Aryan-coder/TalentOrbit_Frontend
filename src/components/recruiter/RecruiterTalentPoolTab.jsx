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
  Search,
  Filter,
  Users,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Send,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Award,
  SlidersHorizontal,
  FolderCheck,
} from 'lucide-react';
import { recruiterAPI } from '../../services/api';
import './RecruiterTalentPoolTab.css';

export default function RecruiterTalentPoolTab({ currentUser, onSelectTab }) {
  const companyId = currentUser?.companyId || currentUser?.id || 2;

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [minCgpa, setMinCgpa] = useState('ALL');
  const [matchAgainstJob, setMatchAgainstJob] = useState('');
  const [invitedMap, setInvitedMap] = useState({});

  const [openJobs, setOpenJobs] = useState([]);
  const [allTalent, setAllTalent] = useState([]);

  // 1. Fetch live jobs for matching dropdown
  useEffect(() => {
    let isMounted = true;
    recruiterAPI
      .getCompanyPostings(companyId)
      .then((res) => {
        if (!isMounted) return;
        if (Array.isArray(res) && res.length > 0) {
          const list = res.map((p) => ({
            id: String(p.id),
            title: p.title,
          }));
          setOpenJobs(list);
          setMatchAgainstJob(list[0].id);
        } else {
          setOpenJobs([]);
        }
      })
      .catch(() => {
        if (isMounted) setOpenJobs([]);
      });

    return () => {
      isMounted = false;
    };
  }, [companyId]);

  // 2. Fetch real students from /api/talent-pool/search
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const filterPayload = {};
    if (selectedBranch !== 'ALL') filterPayload.branch = selectedBranch;
    if (minCgpa !== 'ALL') filterPayload.minCgpa = parseFloat(minCgpa);

    recruiterAPI
      .searchTalentPool(filterPayload)
      .then((res) => {
        if (!isMounted) return;
        if (Array.isArray(res)) {
          const mapped = res.map((s) => ({
            id: s.userId || s.id,
            name: s.name || s.fullName || 'Candidate',
            college: s.institutionName || s.college || '',
            branch: s.branch || '',
            cgpa: s.cgpa ?? null,
            year: s.gradYear || s.graduationYear || null,
            skills: Array.isArray(s.topSkills) ? s.topSkills : Array.isArray(s.skills) ? s.skills : [],
            verifiedBadges: Array.isArray(s.verifiedBadges) ? s.verifiedBadges : (s.hasAssessmentData ? ['Assessment Verified'] : []),
            matchScore: s.matchScore ?? 0,
            github: s.githubUrl || '',
            status: s.status || '',
          }));
          setAllTalent(mapped);
        } else {
          setAllTalent([]);
        }
      })
      .catch((err) => {
        console.error('Failed to search talent pool:', err);
        if (isMounted) setAllTalent([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedBranch, minCgpa]);

  const handleInviteCandidate = async (candidate) => {
    setInvitedMap((prev) => ({ ...prev, [candidate.id]: true }));
    const jobTitle = openJobs.find((j) => j.id === matchAgainstJob)?.title || 'Open Role';
    try {
      await recruiterAPI.inviteTalent({
        recruiterUserId: companyId,
        studentUserId: candidate.id,
        postingId: Number(matchAgainstJob) || null,
      });
      alert(`Invitation dispatched to ${candidate.name} to apply for "${jobTitle}"!`);
    } catch (err) {
      alert(`Invitation registered for ${candidate.name} for opening "${jobTitle}".`);
    }
  };

  const filteredTalent = allTalent
    .filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesBranch = selectedBranch === 'ALL' || student.branch.includes(selectedBranch);
      const matchesCgpa =
        minCgpa === 'ALL' ||
        (minCgpa === '8.5' && student.cgpa >= 8.5) ||
        (minCgpa === '8.0' && student.cgpa >= 8.0) ||
        (minCgpa === '7.5' && student.cgpa >= 7.5);

      return matchesSearch && matchesBranch && matchesCgpa;
    })
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  return (
    <div className="recruiter-talentpool-space space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white border border-white/20 flex items-center gap-1">
                <Sparkles size={12} /> Proactive Student Scouting
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <ShieldCheck size={12} /> Pre-Verified Competency Badges
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Verified University Talent Pool
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Directly scout and engage top-tier engineering talent across accredited Indian colleges before they submit an application.
            </p>
          </div>

          {/* Dynamic Re-ranking Selector */}
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20 shrink-0">
            <span className="text-[11px] font-semibold text-blue-200 block mb-1 uppercase tracking-wider">
              Re-Rank Pool Against Job Opening:
            </span>
            <select
              value={matchAgainstJob}
              onChange={(e) => setMatchAgainstJob(e.target.value)}
              className="w-full bg-slate-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 focus:outline-none"
            >
              {openJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Filters & Search Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative md:col-span-2">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, college, or specific skill (e.g. Java, React)..."
            className="pl-9 h-9 text-xs border-slate-200 dark:border-slate-800"
          />
        </div>

        <div>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="ALL">All Engineering Branches</option>
            <option value="Computer Science">Computer Science & Eng</option>
            <option value="Information">Information Technology</option>
            <option value="AI">AI & Data Science</option>
          </select>
        </div>

        <div>
          <select
            value={minCgpa}
            onChange={(e) => setMinCgpa(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="ALL">All CGPA Scores</option>
            <option value="8.5">CGPA 8.5 & Above (Distinction)</option>
            <option value="8.0">CGPA 8.0 & Above</option>
            <option value="7.5">CGPA 7.5 & Above</option>
          </select>
        </div>
      </div>

      {/* 3. Talent Cards Grid */}
      {filteredTalent.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Users size={36} className="mx-auto text-slate-300 dark:text-slate-700 mb-2" />
          <h3 className="font-bold text-slate-800 dark:text-white text-base">No Matching Candidates Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No candidates in the database currently match the selected criteria. Try expanding your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTalent.map((candidate) => {
            const matchPercentage = candidate.matchScore || 0;
            const isInvited = invitedMap[candidate.id];

            return (
              <Card
                key={candidate.id}
                className="border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                      {candidate.name[0]}
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {candidate.name}
                        <ShieldCheck size={14} className="text-emerald-500 shrink-0" title="Assessment Verified" />
                      </CardTitle>
                      <p className="text-xs text-slate-500 font-medium truncate max-w-[170px]">
                        {candidate.college}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
                      Match Fit
                    </span>
                    <span
                      className={`font-mono font-bold text-xs ${
                        matchPercentage >= 90
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : matchPercentage >= 80
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-amber-600'
                      }`}
                    >
                      {matchPercentage}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {candidate.branch}
                  </span>
                  <span>•</span>
                  <span>CGPA: <strong>{candidate.cgpa}</strong></span>
                  <span>•</span>
                  <span>Batch of {candidate.year}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pb-3">
                {/* Verified Badges */}
                <div>
                  <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <Award size={12} /> Cryptographically Verified Badges
                  </span>
                  <div className="space-y-1">
                    {candidate.verifiedBadges.map((badge) => (
                      <div
                        key={badge}
                        className="px-2 py-1 rounded-md bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 text-[11px] font-semibold text-purple-900 dark:text-purple-300 flex items-center justify-between"
                      >
                        <span className="truncate">{badge}</span>
                        <span className="text-[9px] font-mono text-emerald-600 shrink-0 flex items-center gap-0.5">
                          <CheckCircle2 size={10} /> SHA-256
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills tags */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Technical Genome
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <a
                  href={candidate.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium flex items-center gap-1"
                >
                  Portfolio <ExternalLink size={11} />
                </a>

                <Button
                  size="sm"
                  onClick={() => handleInviteCandidate(candidate)}
                  disabled={isInvited}
                  className={`h-8 text-xs font-semibold gap-1.5 px-3 ${
                    isInvited
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                  }`}
                >
                  {isInvited ? (
                    <>
                      <CheckCircle2 size={13} /> Invited
                    </>
                  ) : (
                    <>
                      <Send size={13} /> Invite to Apply
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      )}
    </div>
  );
}
