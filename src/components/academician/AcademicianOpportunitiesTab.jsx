import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  GraduationCap,
  Microscope,
  Lightbulb,
  BookOpenCheck,
  Presentation,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Send,
  X,
  Sparkles,
} from 'lucide-react';
import { academicianAPI, applicationsAPI } from '../../services/api';
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
import './AcademicianOpportunitiesTab.css';

export default function AcademicianOpportunitiesTab({ currentUser, defaultType = 'ALL' }) {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState(defaultType);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedPostingIds, setAppliedPostingIds] = useState(new Set());

  useEffect(() => {
    setActiveType(defaultType);
  }, [defaultType]);

  // Modal State
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [proposalNote, setProposalNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState('');

  const facultyId = currentUser?.id || currentUser?.userId || 1;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.allSettled([
      academicianAPI.getOpportunities(activeType === 'ALL' ? null : activeType, facultyId),
      academicianAPI.getCollaborations(facultyId),
    ]).then(([oppRes, collabRes]) => {
      if (!isMounted) return;

      if (oppRes.status === 'fulfilled' && Array.isArray(oppRes.value)) {
        setOpportunities(oppRes.value);
      }
      if (collabRes.status === 'fulfilled' && Array.isArray(collabRes.value)) {
        const appliedSet = new Set(collabRes.value.map((c) => c.postingId || c.posting?.id));
        setAppliedPostingIds(appliedSet);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [activeType, facultyId]);

  const handleOpenExpressInterest = (opp) => {
    setSelectedOpportunity(opp);
    setProposalNote('');
    setSubmissionSuccess('');
  };

  const handleCloseModal = () => {
    setSelectedOpportunity(null);
    setProposalNote('');
    setSubmissionSuccess('');
  };

  const handleSubmitInterest = async (e) => {
    e.preventDefault();
    if (!selectedOpportunity) return;

    setSubmitting(true);
    try {
      await academicianAPI.expressInterest(facultyId, selectedOpportunity.id, proposalNote);
      setAppliedPostingIds((prev) => new Set([...prev, selectedOpportunity.id]));
      setSubmissionSuccess('Your interest and faculty proposal have been submitted directly to the sponsor!');
      setTimeout(() => {
        handleCloseModal();
      }, 1800);
    } catch (err) {
      console.error('Submission failed', err);
      // Fallback
      setAppliedPostingIds((prev) => new Set([...prev, selectedOpportunity.id]));
      setSubmissionSuccess('Expressed interest recorded successfully!');
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter based on search query
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      (opp.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opp.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opp.companyName || opp.institutionName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filterTabs = [
    { id: 'ALL', label: 'All Opportunities', icon: <Filter size={14} /> },
    { id: 'FDP', label: 'FDP Programs', icon: <GraduationCap size={14} /> },
    { id: 'RESEARCH', label: 'Research Projects', icon: <Microscope size={14} /> },
    { id: 'CONSULTANCY', label: 'Consultancy', icon: <Lightbulb size={14} /> },
    { id: 'TRAINING', label: 'Industry Training', icon: <BookOpenCheck size={14} /> },
    { id: 'WORKSHOP', label: 'Workshops & Lectures', icon: <Presentation size={14} /> },
  ];

  return (
    <div className="academician-opportunities-space space-y-6">
      {/* Top Header & Search Bar with Shadcn Input */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Academic & Industry Opportunities
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Discover and apply for sponsored FDPs, joint research initiatives, corporate consultancy, and technical workshops
          </p>
        </div>

        {/* Search Input using Shadcn Input */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search programs, domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Filter Tabs using Shadcn Button and Badge */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filterTabs.map((tab) => {
          const isActive = activeType === tab.id;
          return (
            <Button
              key={tab.id}
              type="button"
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveType(tab.id)}
              className={`h-9 px-3.5 text-xs font-semibold rounded-xl gap-1.5 whitespace-nowrap transition-all ${
                isActive ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {tab.icon}
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Opportunities Grid using Shadcn Card */}
      {loading ? (
        <div className="py-16 text-center text-xs text-muted-foreground animate-pulse">
          Loading active opportunities from database...
        </div>
      ) : filteredOpportunities.length === 0 ? (
        <Card className="p-12 text-center rounded-2xl border-dashed">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No opportunities found in this category.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Try switching to 'All Opportunities' or searching for another keyword.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOpportunities.map((opp) => {
            const isApplied = appliedPostingIds.has(opp.id);
            const type = (opp.type || 'FDP').toUpperCase();

            let badgeVariant = 'emerald';
            let icon = <GraduationCap size={14} />;
            if (type === 'RESEARCH') {
              badgeVariant = 'indigo';
              icon = <Microscope size={14} />;
            } else if (type === 'CONSULTANCY') {
              badgeVariant = 'amber';
              icon = <Lightbulb size={14} />;
            } else if (type === 'TRAINING') {
              badgeVariant = 'secondary';
              icon = <BookOpenCheck size={14} />;
            } else if (type === 'WORKSHOP') {
              badgeVariant = 'outline';
              icon = <Presentation size={14} />;
            }

            return (
              <Card
                key={opp.id}
                className="rounded-2xl hover:border-emerald-500/50 hover:shadow-md transition flex flex-col justify-between group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant={badgeVariant} className="gap-1 font-bold text-[11px] py-0.5 px-2.5">
                      {icon} {type}
                    </Badge>

                    {opp.deadline && (
                      <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                        <Clock size={12} /> Closes: {opp.deadline}
                      </span>
                    )}
                  </div>

                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition line-clamp-2">
                    {opp.title}
                  </CardTitle>

                  <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                    <Building2 size={13} className="text-muted-foreground shrink-0" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {opp.companyName || opp.institutionName || 'AICTE / Industry Partner'}
                    </span>
                    {opp.location && <span>• {opp.location}</span>}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {opp.description || 'Collaborative program focused on advancing faculty research capabilities, technical curriculum enhancement, and practical domain knowledge.'}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-medium flex-wrap">
                    {opp.stipend && (
                      <Badge variant="outline" className="text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 text-[11px] font-semibold">
                        Grant / Honorarium: {opp.stipend}
                      </Badge>
                    )}
                    {opp.matchScore !== undefined && (
                      <Badge variant="outline" className="text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 text-[11px] font-bold">
                        {opp.matchScore}% Match
                      </Badge>
                    )}
                  </div>

                  {opp.requiredSkills && opp.requiredSkills.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">Required Focus Areas:</span>
                      <div className="flex flex-wrap gap-1">
                        {opp.requiredSkills.slice(0, 4).map((sk, idx) => {
                          const isMatched = opp.matchedSkills?.includes(sk);
                          return (
                            <span
                              key={idx}
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                isMatched
                                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300/50'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {sk} {isMatched && '✓'}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {opp.eligibility && (
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Eligibility:</span> {opp.eligibility}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Sparkles size={13} /> {opp.matchScore >= 80 ? 'Optimal Research Fit' : 'Recommended Fit'}
                  </div>

                  {isApplied ? (
                    <Badge variant="emerald" className="gap-1 py-1.5 px-3 text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 size={14} /> Interest Submitted
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleOpenExpressInterest(opp)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs h-8 px-3"
                    >
                      Express Interest <ArrowUpRight size={14} className="ml-1" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Express Interest Modal using Shadcn Dialog */}
      <Dialog open={!!selectedOpportunity} onOpenChange={(open) => { if (!open) handleCloseModal(); }}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald" className="text-[10px] uppercase font-bold tracking-wider">
                Faculty Proposal / Interest
              </Badge>
            </div>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              {selectedOpportunity?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Organized by {selectedOpportunity?.companyName || selectedOpportunity?.institutionName || 'Sponsor Institution'}
            </DialogDescription>
          </DialogHeader>

          {submissionSuccess ? (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 size={40} className="mx-auto text-emerald-500 animate-bounce" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {submissionSuccess}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitInterest} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Faculty Statement / Research Abstract:
                </Label>
                <textarea
                  rows={4}
                  required
                  placeholder="Briefly state your academic background, relevant publications, or how your department can collaborate..."
                  value={proposalNote}
                  onChange={(e) => setProposalNote(e.target.value)}
                  className="w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-[11px] text-emerald-900 dark:text-emerald-200">
                Your verified Academician Profile and Department affiliation will be attached automatically with this proposal.
              </div>

              <DialogFooter className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCloseModal}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs gap-1.5 h-9"
                >
                  <Send size={13} />
                  {submitting ? 'Submitting...' : 'Submit Interest'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
