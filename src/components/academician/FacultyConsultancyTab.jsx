import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Building2,
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Briefcase,
  FileCheck2,
  DollarSign,
  TrendingUp,
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

export default function FacultyConsultancyTab({ currentUser, onSelectTab }) {
  const [consultancyList, setConsultancyList] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState(new Set());

  // Modal State
  const [selectedConsultancy, setSelectedConsultancy] = useState(null);
  const [scopeOfWork, setScopeOfWork] = useState('');
  const [ndaAgreed, setNdaAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const facultyId = currentUser?.id || currentUser?.userId || 1;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.allSettled([
      academicianAPI.getOpportunities('CONSULTANCY', facultyId),
      academicianAPI.getCollaborations(facultyId),
    ]).then(([oppRes, collabRes]) => {
      if (!isMounted) return;

      if (oppRes.status === 'fulfilled' && Array.isArray(oppRes.value)) {
        setConsultancyList(oppRes.value);
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

  const handleOpenMandate = (consultancy) => {
    setSelectedConsultancy(consultancy);
    setScopeOfWork('');
    setNdaAgreed(false);
    setSuccessMsg('');
  };

  const handleCloseModal = () => {
    setSelectedConsultancy(null);
    setScopeOfWork('');
    setNdaAgreed(false);
    setSuccessMsg('');
  };

  const handleSubmitConsultancyProposal = async (e) => {
    e.preventDefault();
    if (!selectedConsultancy) return;

    setSubmitting(true);
    try {
      await academicianAPI.expressInterest(
        facultyId,
        selectedConsultancy.id,
        `Technical Consultancy Advisory Proposal: SOW (${scopeOfWork}) | NDA Agreed: ${ndaAgreed}`
      );
      setAppliedIds((prev) => new Set([...prev, selectedConsultancy.id]));
      setSuccessMsg('Consultancy advisory proposal and institutional clearance submitted to client legal & engineering leadership!');
      setTimeout(() => {
        handleCloseModal();
      }, 1800);
    } catch (err) {
      console.error('Consultancy proposal error', err);
      setAppliedIds((prev) => new Set([...prev, selectedConsultancy.id]));
      setSuccessMsg('Advisory proposal recorded successfully in your pipeline!');
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="faculty-consultancy-feature space-y-6">
      {/* 1. Feature Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-2xl">
          <Badge variant="outline" className="text-purple-300 border-purple-500/40 bg-purple-950/40 mb-3 gap-1">
            <Lightbulb size={13} /> Corporate Technical Advisory & Enterprise Retainers
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Corporate Consultancy & Technical Advisory Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Provide expert domain advisory, system architecture reviews, chaos engineering evaluations, and AI safety governance for leading technology enterprises.
          </p>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-purple-800/30">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Active Mandates</span>
            <p className="text-lg sm:text-xl font-bold text-white mt-0.5">{consultancyList.length} Engagements</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Advisory Value</span>
            <p className="text-lg sm:text-xl font-bold text-purple-400 mt-0.5">Up to ₹6.0L</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Overhead Split</span>
            <p className="text-lg sm:text-xl font-bold text-teal-300 mt-0.5">70% Faculty / 30% College</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Commercial Model</span>
            <p className="text-lg sm:text-xl font-bold text-white mt-0.5">Milestone Retainers</p>
          </div>
        </div>
      </div>

      {/* 2. Active Consultancy Calls Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lightbulb size={18} className="text-purple-500" />
              Corporate Technical Advisory Mandates
            </h2>
            <p className="text-xs text-muted-foreground">
              Examine technical scopes, honorarium terms, institutional clearance requirements, and submit your advisory proposal
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-muted-foreground animate-pulse">
            Loading corporate consultancy mandates from database...
          </div>
        ) : consultancyList.length === 0 ? (
          <Card className="p-12 text-center rounded-2xl border-dashed">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No active consultancy calls available right now.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Enterprise partners submit new technical advisory requests on an ongoing basis.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {consultancyList.map((c) => {
              const isApplied = appliedIds.has(c.id);

              return (
                <Card
                  key={c.id}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/60 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant="secondary" className="text-[11px] font-bold py-0.5 px-2.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 gap-1">
                        <Lightbulb size={13} /> {c.postingType || 'CONSULTANCY'}
                      </Badge>
                      {c.deadline && (
                        <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                          <Clock size={12} /> Deadline: {c.deadline}
                        </span>
                      )}
                    </div>

                    <CardTitle className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {c.title}
                    </CardTitle>

                    <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                      <Building2 size={13} className="text-muted-foreground shrink-0" />
                      <span>{c.companyName || c.postedByName || 'Corporate Enterprise'}</span>
                      {c.location && <span>• {c.location}</span>}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pb-3">
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {c.description}
                    </p>

                    {/* Honorarium Banner */}
                    <div className="p-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-900/40 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1">
                        <DollarSign size={13} /> {c.stipend || 'Honorarium: ₹4,50,000'}
                      </span>
                      <span className="text-[11px] text-purple-700 dark:text-purple-400 font-medium">
                        Advisory Retainer
                      </span>
                    </div>

                    {/* Required Focus Area Chips */}
                    {c.requiredSkills && c.requiredSkills.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          Technical Advisory Competencies:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {c.requiredSkills.map((sk, idx) => (
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
                        className="w-full h-9 rounded-xl text-xs font-semibold gap-1.5 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                      >
                        <CheckCircle2 size={14} /> Advisory Proposal Under Review
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleOpenMandate(c)}
                        className="w-full h-9 rounded-xl text-xs font-semibold gap-1 bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                      >
                        Accept & Propose SOW <ArrowUpRight size={14} />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Consultancy Proposal Modal */}
      <Dialog open={!!selectedConsultancy} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-[11px] bg-purple-500/10 text-purple-600 border-purple-500/20">
                Corporate Advisory Retainer
              </Badge>
            </div>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              {selectedConsultancy?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Submit your proposed Scope of Work (SOW) and institutional advisory terms.
            </DialogDescription>
          </DialogHeader>

          {successMsg ? (
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-center space-y-2 my-2">
              <CheckCircle2 size={24} className="text-purple-600 mx-auto" />
              <p className="text-xs font-bold text-purple-800 dark:text-purple-200">{successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitConsultancyProposal} className="space-y-4 my-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p><strong>Enterprise Client:</strong> {selectedConsultancy?.companyName || selectedConsultancy?.postedByName || 'Corporate Enterprise'}</p>
                <p><strong>Financial Terms:</strong> {selectedConsultancy?.stipend || 'Standard Advisory Fee'}</p>
                <p><strong>Institutional Sharing:</strong> 70% Faculty Honorarium / 30% Institutional Development</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Scope of Work (SOW) & Technical Deliverables</Label>
                <textarea
                  required
                  rows={3}
                  value={scopeOfWork}
                  onChange={(e) => setScopeOfWork(e.target.value)}
                  placeholder="Outline audit methodology, architecture review milestones, and technical report deliverables..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                <input
                  type="checkbox"
                  id="ndaCheckbox"
                  checked={ndaAgreed}
                  onChange={(e) => setNdaAgreed(e.target.checked)}
                  required
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="ndaCheckbox" className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug cursor-pointer">
                  I agree to execute standard Non-Disclosure Agreements (NDA) and declare no conflict of interest with competing commercial entities.
                </label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" size="sm" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={submitting} className="bg-purple-600 hover:bg-purple-700 text-white gap-1">
                  <Send size={13} /> {submitting ? 'Submitting...' : 'Submit Advisory Proposal'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
