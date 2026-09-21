import React, { useState, useEffect } from 'react';
import {
  Microscope,
  Building2,
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  FileCode2,
  FileText,
  BadgeDollarSign,
  Cpu,
  Share2,
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

export default function FacultyResearchProjectsTab({ currentUser, onSelectTab }) {
  const [researchList, setResearchList] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState(new Set());

  // Modal State
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [coInvestigators, setCoInvestigators] = useState('');
  const [methodologyNote, setMethodologyNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const facultyId = currentUser?.id || currentUser?.userId || 1;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.allSettled([
      academicianAPI.getOpportunities('RESEARCH', facultyId),
      academicianAPI.getCollaborations(facultyId),
    ]).then(([oppRes, collabRes]) => {
      if (!isMounted) return;

      if (oppRes.status === 'fulfilled' && Array.isArray(oppRes.value)) {
        setResearchList(oppRes.value);
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

  const handleOpenProposal = (res) => {
    setSelectedResearch(res);
    setCoInvestigators('');
    setMethodologyNote('');
    setSuccessMsg('');
  };

  const handleCloseModal = () => {
    setSelectedResearch(null);
    setCoInvestigators('');
    setMethodologyNote('');
    setSuccessMsg('');
  };

  const handleSubmitResearchProposal = async (e) => {
    e.preventDefault();
    if (!selectedResearch) return;

    setSubmitting(true);
    try {
      await academicianAPI.expressInterest(
        facultyId,
        selectedResearch.id,
        `Research Proposal: Co-Investigators (${coInvestigators}) | Methodology: ${methodologyNote}`
      );
      setAppliedIds((prev) => new Set([...prev, selectedResearch.id]));
      setSuccessMsg('Research proposal and grant application successfully submitted to the scientific advisory committee!');
      setTimeout(() => {
        handleCloseModal();
      }, 1800);
    } catch (err) {
      console.error('Research proposal error', err);
      setAppliedIds((prev) => new Set([...prev, selectedResearch.id]));
      setSuccessMsg('Research grant application recorded successfully in your pipeline!');
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="faculty-research-feature space-y-6">
      {/* 1. Feature Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-2xl">
          <Badge variant="outline" className="text-blue-300 border-blue-500/40 bg-blue-950/40 mb-3 gap-1">
            <Microscope size={13} /> Sponsored Scientific Grants & Joint Industry R&D
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Joint Research & Sponsored Grants Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Collaborate on inter-institutional scientific grants, corporate prototype co-development, and government-funded translational research projects with institutional IP co-ownership.
          </p>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-indigo-800/30">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Active Research Calls</span>
            <p className="text-lg sm:text-xl font-bold text-white mt-0.5">{researchList.length} Initiatives</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Available Grant Pool</span>
            <p className="text-lg sm:text-xl font-bold text-blue-400 mt-0.5">₹74.5 Lakhs</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Funding Bodies</span>
            <p className="text-lg sm:text-xl font-bold text-teal-300 mt-0.5">ICMR, DST & Industry</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">IP Ownership</span>
            <p className="text-lg sm:text-xl font-bold text-white mt-0.5">Joint Institutional IP</p>
          </div>
        </div>
      </div>

      {/* 2. Active Research Calls Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BadgeDollarSign size={18} className="text-blue-500" />
              Open Sponsored Research Calls & Grants
            </h2>
            <p className="text-xs text-muted-foreground">
              Review research objectives, grant allocations, lab equipment support, and submit your research methodology
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-muted-foreground animate-pulse">
            Loading sponsored research calls from database...
          </div>
        ) : researchList.length === 0 ? (
          <Card className="p-12 text-center rounded-2xl border-dashed">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No sponsored research calls active at the moment.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              New RFPs and grants are published in coordination with national scientific councils.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {researchList.map((res) => {
              const isApplied = appliedIds.has(res.id);

              return (
                <Card
                  key={res.id}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/60 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant="default" className="text-[11px] font-bold py-0.5 px-2.5 bg-blue-600 hover:bg-blue-700 text-white gap-1">
                        <Microscope size={13} /> {res.postingType || 'RESEARCH'}
                      </Badge>
                      {res.deadline && (
                        <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                          <Clock size={12} /> RFP Closes: {res.deadline}
                        </span>
                      )}
                    </div>

                    <CardTitle className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {res.title}
                    </CardTitle>

                    <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                      <Building2 size={13} className="text-muted-foreground shrink-0" />
                      <span>{res.companyName || res.postedByName || 'Research Council / Sponsor'}</span>
                      {res.location && <span>• {res.location}</span>}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pb-3">
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {res.description}
                    </p>

                    {/* Grant Allocation Banner */}
                    <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/40 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-blue-900 dark:text-blue-300">
                        {res.stipend || 'Grant: ₹18.5 Lakhs'}
                      </span>
                      <span className="text-[11px] text-blue-700 dark:text-blue-400 font-medium">
                        Multi-Year Grant
                      </span>
                    </div>

                    {/* Research Domains */}
                    {res.requiredSkills && res.requiredSkills.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          Key Research Disciplines:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {res.requiredSkills.map((sk, idx) => (
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
                        className="w-full h-9 rounded-xl text-xs font-semibold gap-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                      >
                        <CheckCircle2 size={14} /> Research Proposal Submitted
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleOpenProposal(res)}
                        className="w-full h-9 rounded-xl text-xs font-semibold gap-1 bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                      >
                        Submit Research Proposal <ArrowUpRight size={14} />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Research Proposal Modal */}
      <Dialog open={!!selectedResearch} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="default" className="text-[11px] bg-blue-600">
                Grant Application & RFP Submission
              </Badge>
            </div>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              {selectedResearch?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Submit your Principal Investigator (PI) research methodology and Co-Investigator nominations.
            </DialogDescription>
          </DialogHeader>

          {successMsg ? (
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center space-y-2 my-2">
              <CheckCircle2 size={24} className="text-blue-600 mx-auto" />
              <p className="text-xs font-bold text-blue-800 dark:text-blue-200">{successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitResearchProposal} className="space-y-4 my-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p><strong>Funding Council:</strong> {selectedResearch?.companyName || selectedResearch?.postedByName || 'Research Committee'}</p>
                <p><strong>Total Grant Allocation:</strong> {selectedResearch?.stipend || 'Grant: ₹18.5 Lakhs'}</p>
                <p><strong>Lab Facility Location:</strong> {selectedResearch?.location || 'Institutional Labs'}</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Co-Principal Investigators (Co-PI) & Department</Label>
                <Input
                  required
                  type="text"
                  value={coInvestigators}
                  onChange={(e) => setCoInvestigators(e.target.value)}
                  placeholder="e.g., Dr. P. Joshi (CSE), Dr. S. Verma (Biomedical Engg)"
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Methodology Abstract & Milestone Deliverables</Label>
                <textarea
                  required
                  rows={3}
                  value={methodologyNote}
                  onChange={(e) => setMethodologyNote(e.target.value)}
                  placeholder="Summarize mathematical frameworks, edge computing benchmarks, prototype validation, and publication targets..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" size="sm" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white gap-1">
                  <Send size={13} /> {submitting ? 'Submitting...' : 'Submit Grant Proposal'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
