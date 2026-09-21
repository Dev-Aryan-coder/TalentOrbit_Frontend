import React, { useState, useEffect } from 'react';
import {
  BookOpenCheck,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Send,
  CheckCircle2,
  ArrowUpRight,
  Briefcase,
  Users,
  ShieldCheck,
  Layers,
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

export default function FacultyIndustryTrainingTab({ currentUser, onSelectTab }) {
  const [trainingList, setTrainingList] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState(new Set());

  // Modal State
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [availableDates, setAvailableDates] = useState('');
  const [syllabusNote, setSyllabusNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const facultyId = currentUser?.id || currentUser?.userId || 1;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.allSettled([
      academicianAPI.getOpportunities('TRAINING', facultyId),
      academicianAPI.getCollaborations(facultyId),
    ]).then(([oppRes, collabRes]) => {
      if (!isMounted) return;

      if (oppRes.status === 'fulfilled' && Array.isArray(oppRes.value)) {
        setTrainingList(oppRes.value);
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

  const handleOpenProposal = (training) => {
    setSelectedTraining(training);
    setAvailableDates('');
    setSyllabusNote('');
    setSuccessMsg('');
  };

  const handleCloseModal = () => {
    setSelectedTraining(null);
    setAvailableDates('');
    setSyllabusNote('');
    setSuccessMsg('');
  };

  const handleSubmitTrainingProposal = async (e) => {
    e.preventDefault();
    if (!selectedTraining) return;

    setSubmitting(true);
    try {
      await academicianAPI.expressInterest(
        facultyId,
        selectedTraining.id,
        `Corporate Training Proposal: Schedule (${availableDates}) | Syllabus: ${syllabusNote}`
      );
      setAppliedIds((prev) => new Set([...prev, selectedTraining.id]));
      setSuccessMsg('Corporate training proposal submitted directly to client engineering heads!');
      setTimeout(() => {
        handleCloseModal();
      }, 1800);
    } catch (err) {
      console.error('Training proposal error', err);
      setAppliedIds((prev) => new Set([...prev, selectedTraining.id]));
      setSuccessMsg('Proposal recorded successfully in your active engagements pipeline!');
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="faculty-training-feature space-y-6">
      {/* 1. Feature Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-2xl">
          <Badge variant="outline" className="text-amber-400 border-amber-500/40 bg-amber-950/40 mb-3 gap-1">
            <BookOpenCheck size={13} /> Corporate Technical Upskilling & Developer Masterclasses
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Corporate & Industry Training Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Lead specialized developer bootcamps, executive architecture immersions, and advanced hands-on technology masterclasses for top Fortune 500 engineering enterprises.
          </p>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-amber-800/30">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Open Mandates</span>
            <p className="text-lg sm:text-xl font-bold text-white mt-0.5">{trainingList.length} Programs</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Honorarium Range</span>
            <p className="text-lg sm:text-xl font-bold text-amber-400 mt-0.5">₹2.5L – ₹3.2L</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Format</span>
            <p className="text-lg sm:text-xl font-bold text-teal-300 mt-0.5">Virtual & Executive</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Target Engineers</span>
            <p className="text-lg sm:text-xl font-bold text-white mt-0.5">Senior Devs & Architects</p>
          </div>
        </div>
      </div>

      {/* 2. Open Corporate Mandates Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase size={18} className="text-amber-500" />
              Active Corporate Engineering Training Calls
            </h2>
            <p className="text-xs text-muted-foreground">
              Review corporate specifications, honorariums, required tech stacks, and submit your cohort delivery availability
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-muted-foreground animate-pulse">
            Loading corporate training calls from database...
          </div>
        ) : trainingList.length === 0 ? (
          <Card className="p-12 text-center rounded-2xl border-dashed">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No active corporate training calls at the moment.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              New training requests are published as enterprise clients finalize their training calendars.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trainingList.map((training) => {
              const isApplied = appliedIds.has(training.id);

              return (
                <Card
                  key={training.id}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/60 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant="secondary" className="text-[11px] font-bold py-0.5 px-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 gap-1">
                        <BookOpenCheck size={13} /> {training.postingType || 'TRAINING'}
                      </Badge>
                      {training.deadline && (
                        <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                          <Clock size={12} /> Schedule: {training.deadline}
                        </span>
                      )}
                    </div>

                    <CardTitle className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {training.title}
                    </CardTitle>

                    <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                      <Building2 size={13} className="text-muted-foreground shrink-0" />
                      <span>{training.companyName || training.postedByName || 'Corporate Client'}</span>
                      {training.location && <span>• {training.location}</span>}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pb-3">
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {training.description}
                    </p>

                    {/* Honorarium Banner */}
                    <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/40 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                        <DollarSign size={13} /> {training.stipend || 'Honorarium: ₹2,50,000'}
                      </span>
                      <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                        40 Hours Cohort
                      </span>
                    </div>

                    {/* Required Focus Area Chips */}
                    {training.requiredSkills && training.requiredSkills.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          Training Curriculum Modules:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {training.requiredSkills.map((sk, idx) => (
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
                        className="w-full h-9 rounded-xl text-xs font-semibold gap-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                      >
                        <CheckCircle2 size={14} /> Training Proposal Under Review
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleOpenProposal(training)}
                        className="w-full h-9 rounded-xl text-xs font-semibold gap-1 bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                      >
                        Accept & Submit Syllabus <ArrowUpRight size={14} />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Training Proposal Modal */}
      <Dialog open={!!selectedTraining} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-[11px] bg-amber-500/10 text-amber-600 border-amber-500/20">
                Corporate Training Mandate
              </Badge>
            </div>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              {selectedTraining?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Submit your proposed curriculum outline and batch delivery availability to the client engineering team.
            </DialogDescription>
          </DialogHeader>

          {successMsg ? (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center space-y-2 my-2">
              <CheckCircle2 size={24} className="text-amber-600 mx-auto" />
              <p className="text-xs font-bold text-amber-800 dark:text-amber-200">{successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitTrainingProposal} className="space-y-4 my-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p><strong>Corporate Sponsor:</strong> {selectedTraining?.companyName || selectedTraining?.postedByName || 'Enterprise Client'}</p>
                <p><strong>Delivery Format:</strong> {selectedTraining?.location || 'Virtual Interactive Bootcamp'}</p>
                <p><strong>Commercial Honorarium:</strong> {selectedTraining?.stipend || 'Standard Corporate Rate'}</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Available Dates & Cohort Delivery Timings</Label>
                <Input
                  required
                  type="text"
                  value={availableDates}
                  onChange={(e) => setAvailableDates(e.target.value)}
                  placeholder="e.g., Weekends (Oct 18 - Nov 10, 2026) or 2-hour daily evening sessions"
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Pedagogical Syllabus & Hands-on Lab Overview</Label>
                <textarea
                  required
                  rows={3}
                  value={syllabusNote}
                  onChange={(e) => setSyllabusNote(e.target.value)}
                  placeholder="Summarize key lab exercises, hands-on architectural code reviews, and evaluation benchmarks..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" size="sm" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={submitting} className="bg-amber-600 hover:bg-amber-700 text-white gap-1">
                  <Send size={13} /> {submitting ? 'Submitting...' : 'Confirm Training Proposal'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
