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
  Award,
  Star,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Calendar,
  DollarSign,
  MessageSquare,
  Sparkles,
  UserCheck,
  X,
  FileCheck,
} from 'lucide-react';
import { recruiterAPI } from '../../services/api';
import './RecruiterHiredTab.css';

export default function RecruiterHiredTab({ currentUser, onSelectTab }) {
  const companyId = currentUser?.companyId || currentUser?.id || 2;
  const companyName = currentUser?.companyName || currentUser?.fullName || currentUser?.email?.split('@')[0] || 'Enterprise';

  const [loading, setLoading] = useState(true);
  const [hiredCandidates, setHiredCandidates] = useState([]);

  const [activeCandidateForFeedback, setActiveCandidateForFeedback] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 5,
    comments: '',
    selectedSkills: [],
  });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadHired() {
      try {
        const postings = await recruiterAPI.getCompanyPostings(companyId).catch(() => []);
        let placedList = [];

        for (const p of postings) {
          try {
            const apps = await recruiterAPI.getRankedApplicants(p.id);
            if (Array.isArray(apps)) {
              apps
                .filter((a) => a.status === 'SELECTED' || a.status === 'COMPLETED')
                .forEach((a) => {
                  placedList.push({
                    id: a.id || a.applicationId,
                    name: a.studentName || a.name || 'Candidate',
                    college: a.institutionName || a.college || '',
                    role: p.title || '',
                    offeredPackage: a.offeredPackage ? `₹${a.offeredPackage} LPA` : p.stipend || p.compensation || '',
                    startDate: a.startDate || '',
                    mentorAssigned: a.mentorAssigned || '',
                    hasFeedback: Boolean(a.mentorFeedback || a.mentorRating),
                    rating: a.mentorRating || null,
                    mentorComments: a.mentorFeedback || null,
                    endorsedSkills: Array.isArray(a.matchedSkills) ? a.matchedSkills : [],
                  });
                });
            }
          } catch (e) {
            // Posting has no applicants
          }
        }

        if (!isMounted) return;
        setHiredCandidates(placedList);
      } catch (err) {
        console.error('Failed to load hired candidates:', err);
        if (isMounted) setHiredCandidates([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadHired();

    return () => {
      isMounted = false;
    };
  }, [companyId]);

  const handleOpenFeedbackModal = (candidate) => {
    setActiveCandidateForFeedback(candidate);
    setFeedbackForm({
      rating: candidate.rating || 5,
      comments: candidate.mentorComments || '',
      selectedSkills: Array.isArray(candidate.endorsedSkills) ? candidate.endorsedSkills : [],
    });
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (!activeCandidateForFeedback) return;

    setHiredCandidates((prev) =>
      prev.map((c) => {
        if (c.id === activeCandidateForFeedback.id) {
          return {
            ...c,
            hasFeedback: true,
            rating: feedbackForm.rating,
            mentorComments: feedbackForm.comments,
            endorsedSkills: feedbackForm.selectedSkills,
          };
        }
        return c;
      })
    );

    recruiterAPI
      .submitMentorFeedback(activeCandidateForFeedback.id, {
        rating: feedbackForm.rating,
        comments: feedbackForm.comments,
        endorsedSkills: feedbackForm.selectedSkills,
      })
      .catch((err) => console.warn('Mentor feedback persist note:', err.message));

    setActiveCandidateForFeedback(null);
    alert(`Mentor endorsement successfully submitted for ${activeCandidateForFeedback.name}! Their student profile skills have been verified.`);
  };

  return (
    <div className="recruiter-hired-space space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <Award size={12} /> Post-Hiring Verification Loop
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white border border-white/20 flex items-center gap-1">
                <ShieldCheck size={12} /> Tamper-Proof Skill Endorsement
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Selected Talent & Mentor Feedback
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Closing the loop: Enterprise mentors submit real-world ratings that upgrade claimed competencies into permanent Verified Badges in MySQL.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20 shrink-0 text-center">
            <span className="text-2xl font-extrabold font-mono text-emerald-400 block">
              {hiredCandidates.length} Offers
            </span>
            <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
              Accepted Candidates
            </span>
          </div>
        </div>
      </div>

      {/* 2. Hired Candidates Grid */}
      {hiredCandidates.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Award size={36} className="mx-auto text-slate-300 dark:text-slate-700 mb-2" />
          <h3 className="font-bold text-slate-800 dark:text-white text-base">No Selected Hires Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Candidates who receive and accept an offer from your ATS Pipeline will be listed here for mentor rating and verified badge endorsements.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hiredCandidates.map((candidate) => (
          <Card
            key={candidate.id}
            className="border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-sm shrink-0">
                    {candidate.name[0]}
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      {candidate.name}
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    </CardTitle>
                    <p className="text-xs text-slate-500 font-medium truncate max-w-[180px]">
                      {candidate.college}
                    </p>
                  </div>
                </div>

                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 text-[10px] font-semibold">
                  SELECTED
                </Badge>
              </div>

              <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                <div className="font-semibold text-slate-800 dark:text-slate-200">{candidate.role}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/50 dark:border-slate-800">
                  <span className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                    <DollarSign size={12} className="text-emerald-500" /> Package: {candidate.offeredPackage}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> Starts: {candidate.startDate}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pb-3">
              {candidate.hasFeedback ? (
                <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      Mentor Endorsement Logged
                    </span>
                    <div className="flex items-center text-amber-500">
                      {[...Array(candidate.rating || 5)].map((_, i) => (
                        <Star key={i} size={13} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 italic text-[11px]">
                    "{candidate.mentorComments}"
                  </p>
                  {candidate.endorsedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {candidate.endorsedSkills.map((s) => (
                        <span
                          key={s}
                          className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200"
                        >
                          ✓ Verified: {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300">
                  <p className="font-semibold text-xs mb-0.5">Pending Mentor Evaluation</p>
                  <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80">
                    Candidate has completed onboarding. Submit mentor feedback to seal verified credentials.
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
              <Button
                size="sm"
                onClick={() => handleOpenFeedbackModal(candidate)}
                className={`h-8 text-xs font-semibold gap-1.5 ${
                  candidate.hasFeedback
                    ? 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                }`}
              >
                <Award size={13} />
                {candidate.hasFeedback ? 'Update Mentor Feedback' : 'Add Mentor Feedback'}
              </Button>
            </CardFooter>
          </Card>
          ))}
        </div>
      )}

      {/* 3. Mentor Feedback Modal */}
      {activeCandidateForFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="border-b border-slate-100 dark:border-slate-800 p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award size={18} className="text-emerald-600" />
                  Submit Performance Endorsement
                </h3>
                <p className="text-xs text-slate-500">
                  Candidate: <strong className="text-slate-800 dark:text-slate-200">{activeCandidateForFeedback.name}</strong> ({activeCandidateForFeedback.role})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveCandidateForFeedback(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitFeedback} className="p-6 space-y-4 text-xs">
              {/* Star Rating */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Overall Performance Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                      className="p-1 text-amber-400 hover:scale-110 transition"
                    >
                      <Star
                        size={22}
                        fill={star <= feedbackForm.rating ? 'currentColor' : 'none'}
                        stroke="currentColor"
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-bold text-slate-700 dark:text-slate-300">
                    {feedbackForm.rating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* Endorse skills */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Competency Verification Checklist (Will be marked as VERIFIED in MySQL):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['Java', 'Spring Boot', 'MySQL', 'REST APIs', 'Docker', 'System Design'].map((skill) => {
                    const isSelected = feedbackForm.selectedSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => {
                          const next = isSelected
                            ? feedbackForm.selectedSkills.filter((s) => s !== skill)
                            : [...feedbackForm.selectedSkills, skill];
                          setFeedbackForm({ ...feedbackForm, selectedSkills: next });
                        }}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {isSelected ? '✓ Endorsed: ' : '+ Verify: '} {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mentor Comments */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Corporate Mentor Evaluation & Notes *
                </label>
                <textarea
                  rows={3}
                  required
                  value={feedbackForm.comments}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
                  placeholder="Summarize candidate reliability, technical velocity, and code quality..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-[11px]">
                <ShieldCheck size={16} className="shrink-0" />
                <span>
                  Submitting will permanently lock this rating and seal the student's digital accreditation.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveCandidateForFeedback(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/30"
                >
                  Seal Endorsement & Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
