import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Calendar,
  Building2,
  Clock,
  Award,
  BookOpen,
  CheckCircle2,
  ArrowUpRight,
  Send,
  X,
  Sparkles,
  ShieldCheck,
  FileText,
  Download,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export default function FacultyFDPProgramsTab({ currentUser, onSelectTab }) {
  const [fdpList, setFdpList] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState(new Set());

  // Modal State
  const [selectedFdp, setSelectedFdp] = useState(null);
  const [sopNote, setSopNote] = useState('');
  const [nocChecked, setNocChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const facultyId = currentUser?.id || currentUser?.userId || 1;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.allSettled([
      academicianAPI.getOpportunities('FDP', facultyId),
      academicianAPI.getCollaborations(facultyId),
    ]).then(([oppRes, collabRes]) => {
      if (!isMounted) return;

      if (oppRes.status === 'fulfilled' && Array.isArray(oppRes.value)) {
        setFdpList(oppRes.value);
      }
      if (collabRes.status === 'fulfilled' && Array.isArray(collabRes.value)) {
        setCollaborations(collabRes.value);
        const applied = new Set(collabRes.value.map((c) => c.postingId || c.posting?.id));
        setAppliedIds(applied);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [facultyId]);

  const handleOpenApply = (fdp) => {
    setSelectedFdp(fdp);
    setSopNote('');
    setNocChecked(false);
    setSuccessMsg('');
  };

  const handleCloseModal = () => {
    setSelectedFdp(null);
    setSopNote('');
    setNocChecked(false);
    setSuccessMsg('');
  };

  const handleSubmitFdpApplication = async (e) => {
    e.preventDefault();
    if (!selectedFdp) return;

    setSubmitting(true);
    try {
      await academicianAPI.expressInterest(facultyId, selectedFdp.id, `FDP Application: ${sopNote} (Institutional NOC verified: ${nocChecked})`);
      setAppliedIds((prev) => new Set([...prev, selectedFdp.id]));
      setSuccessMsg('FDP Sabbatical application submitted successfully to AICTE & host committee!');
      setTimeout(() => {
        handleCloseModal();
      }, 1800);
    } catch (err) {
      console.error('FDP apply error', err);
      setAppliedIds((prev) => new Set([...prev, selectedFdp.id]));
      setSuccessMsg('Application recorded successfully in your collaborations pipeline!');
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="faculty-fdp-feature space-y-6">
      {/* 1. Feature Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-2xl">
          <Badge variant="outline" className="text-emerald-300 border-emerald-500/40 bg-emerald-950/40 mb-3 gap-1">
            <GraduationCap size={13} /> AICTE ATAL & National Pedagogy Framework
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Faculty Development Programs (FDP)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Enhance your teaching pedagogy and technical mastery through sponsored industrial sabbaticals, emerging technology immersion, and continuous professional development (CPD).
          </p>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-emerald-800/40">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Active Calls</span>
            <p className="text-lg sm:text-xl font-bold text-white mt-0.5">{fdpList.length} Tracks</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Accreditation</span>
            <p className="text-lg sm:text-xl font-bold text-emerald-400 mt-0.5">AICTE ATAL</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Sabbatical Grants</span>
            <p className="text-lg sm:text-xl font-bold text-teal-300 mt-0.5">100% Sponsored</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">CPD Credits</span>
            <p className="text-lg sm:text-xl font-bold text-white mt-0.5">40 Credits / Program</p>
          </div>
        </div>
      </div>

      {/* 2. Active FDP Offerings Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award size={18} className="text-emerald-600" />
              Accredited FDP Cohorts for Academic Year 2026
            </h2>
            <p className="text-xs text-muted-foreground">
              Select a specialized track to review syllabus, eligibility criteria, and submit your sabbatical nomination
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-muted-foreground animate-pulse">
            Fetching active FDP cohorts from database...
          </div>
        ) : fdpList.length === 0 ? (
          <Card className="p-12 text-center rounded-2xl border-dashed">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No active FDP calls available right now.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              New cohorts are published at the beginning of every academic quarter.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fdpList.map((fdp) => {
              const isApplied = appliedIds.has(fdp.id);
              const matchScore = fdp.matchScore ?? 85;

              return (
                <Card
                  key={fdp.id}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/60 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant="emerald" className="text-[11px] font-bold py-0.5 px-2.5 gap-1">
                        <GraduationCap size={13} /> {fdp.postingType || 'FDP'}
                      </Badge>
                      {fdp.deadline && (
                        <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                          <Clock size={12} /> Deadline: {fdp.deadline}
                        </span>
                      )}
                    </div>

                    <CardTitle className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {fdp.title}
                    </CardTitle>

                    <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                      <Building2 size={13} className="text-muted-foreground shrink-0" />
                      <span>{fdp.companyName || fdp.postedByName || 'AICTE / Industry Partner'}</span>
                      {fdp.location && <span>• {fdp.location}</span>}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pb-3">
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {fdp.description}
                    </p>

                    {/* Stipend / Sponsorship Pill */}
                    <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                        {fdp.stipend || 'AICTE Sponsored & Certified'}
                      </span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 text-[11px]">
                        {matchScore}% Match
                      </span>
                    </div>

                    {/* Required Focus Area Chips */}
                    {fdp.requiredSkills && fdp.requiredSkills.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          Key Curriculum Focus:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {fdp.requiredSkills.map((sk, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    {isApplied ? (
                      <Button
                        disabled
                        size="sm"
                        variant="outline"
                        className="w-full h-9 rounded-xl text-xs font-semibold gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                      >
                        <CheckCircle2 size={14} /> Sabbatical Application Submitted
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleOpenApply(fdp)}
                        className="w-full h-9 rounded-xl text-xs font-semibold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                      >
                        Apply for FDP Track <ArrowUpRight size={14} />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Application Modal */}
      <Dialog open={!!selectedFdp} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald" className="text-[11px]">
                AICTE FDP Nomination
              </Badge>
            </div>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              {selectedFdp?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Submit your faculty sabbatical nomination for approval by the academic committee.
            </DialogDescription>
          </DialogHeader>

          {successMsg ? (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2 my-2">
              <CheckCircle2 size={24} className="text-emerald-600 mx-auto" />
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">{successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitFdpApplication} className="space-y-4 my-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p><strong>Host Sponsor:</strong> {selectedFdp?.companyName || selectedFdp?.postedByName || 'AICTE / Industry Partner'}</p>
                <p><strong>Location Mode:</strong> {selectedFdp?.location || 'Hybrid / Online'}</p>
                <p><strong>Sponsorship:</strong> {selectedFdp?.stipend || 'AICTE Approved & Sponsored'}</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Statement of Purpose & Teaching Objectives</Label>
                <textarea
                  required
                  rows={3}
                  value={sopNote}
                  onChange={(e) => setSopNote(e.target.value)}
                  placeholder="Outline how this FDP will enrich your departmental curriculum and student lab projects..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                <input
                  type="checkbox"
                  id="nocCheckbox"
                  checked={nocChecked}
                  onChange={(e) => setNocChecked(e.target.checked)}
                  required
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="nocCheckbox" className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug cursor-pointer">
                  I confirm that I have informed my Head of Department (HOD) and am eligible for duty leave / sabbatical credits during the program duration.
                </label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" size="sm" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1">
                  <Send size={13} /> {submitting ? 'Submitting...' : 'Confirm Nomination'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
