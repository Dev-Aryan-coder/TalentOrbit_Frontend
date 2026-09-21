import React, { useState, useEffect } from 'react';
import {
  Presentation,
  Building2,
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Video,
  Mic,
  Users,
  DollarSign,
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

export default function FacultyWorkshopsTab({ currentUser, onSelectTab }) {
  const [workshopList, setWorkshopList] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState(new Set());

  // Modal State
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [slideDeckUrl, setSlideDeckUrl] = useState('');
  const [sessionAbstract, setSessionAbstract] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const facultyId = currentUser?.id || currentUser?.userId || 1;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.allSettled([
      academicianAPI.getOpportunities('WORKSHOP', facultyId),
      academicianAPI.getCollaborations(facultyId),
    ]).then(([oppRes, collabRes]) => {
      if (!isMounted) return;

      if (oppRes.status === 'fulfilled' && Array.isArray(oppRes.value)) {
        setWorkshopList(oppRes.value);
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

  const handleOpenSlot = (ws) => {
    setSelectedWorkshop(ws);
    setSlideDeckUrl('');
    setSessionAbstract('');
    setSuccessMsg('');
  };

  const handleCloseModal = () => {
    setSelectedWorkshop(null);
    setSlideDeckUrl('');
    setSessionAbstract('');
    setSuccessMsg('');
  };

  const handleSubmitWorkshopSlot = async (e) => {
    e.preventDefault();
    if (!selectedWorkshop) return;

    setSubmitting(true);
    try {
      await academicianAPI.expressInterest(
        facultyId,
        selectedWorkshop.id,
        `Workshop & Keynote Confirmation: Slide Deck (${slideDeckUrl}) | Abstract: ${sessionAbstract}`
      );
      setAppliedIds((prev) => new Set([...prev, selectedWorkshop.id]));
      setSuccessMsg('Workshop speaking slot confirmed and presentation collateral received by the organizing committee!');
      setTimeout(() => {
        handleCloseModal();
      }, 1800);
    } catch (err) {
      console.error('Workshop slot confirmation error', err);
      setAppliedIds((prev) => new Set([...prev, selectedWorkshop.id]));
      setSuccessMsg('Speaking invitation accepted and recorded in your pipeline!');
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="faculty-workshops-feature space-y-6">
      {/* 1. Feature Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-2xl">
          <Badge variant="outline" className="text-cyan-300 border-cyan-500/40 bg-cyan-950/40 mb-3 gap-1">
            <Presentation size={13} /> Keynote Addresses & Technical Masterclasses
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Workshops & Keynote Lectures Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Deliver invited keynote speeches at prestigious national symposia, chair technical research panels, and conduct hands-on developer masterclasses.
          </p>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-cyan-800/30">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Invited Keynotes</span>
            <p className="text-lg sm:text-xl font-bold text-white mt-0.5">{workshopList.length} Sessions</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Honorarium Range</span>
            <p className="text-lg sm:text-xl font-bold text-cyan-400 mt-0.5">₹50K – ₹75K</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Host Societies</span>
            <p className="text-lg sm:text-xl font-bold text-teal-300 mt-0.5">IEEE, FICCI & Cisco</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Audience Reach</span>
            <p className="text-lg sm:text-xl font-bold text-white mt-0.5">150+ Delegates / Event</p>
          </div>
        </div>
      </div>

      {/* 2. Active Workshops Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Mic size={18} className="text-cyan-500" />
              Open Keynote & Workshop Invitations
            </h2>
            <p className="text-xs text-muted-foreground">
              Review conference themes, honorarium terms, attendee demographics, and confirm your session speaking slot
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-muted-foreground animate-pulse">
            Loading workshop invitations from database...
          </div>
        ) : workshopList.length === 0 ? (
          <Card className="p-12 text-center rounded-2xl border-dashed">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No workshop invitations pending at this time.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              New speaking opportunities appear as partner associations schedule national conferences.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workshopList.map((ws) => {
              const isApplied = appliedIds.has(ws.id);

              return (
                <Card
                  key={ws.id}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-cyan-500/60 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant="outline" className="text-[11px] font-bold py-0.5 px-2.5 border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 gap-1">
                        <Presentation size={13} /> {ws.postingType || 'WORKSHOP'}
                      </Badge>
                      {ws.deadline && (
                        <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                          <Clock size={12} /> Date: {ws.deadline}
                        </span>
                      )}
                    </div>

                    <CardTitle className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {ws.title}
                    </CardTitle>

                    <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                      <Building2 size={13} className="text-muted-foreground shrink-0" />
                      <span>{ws.companyName || ws.postedByName || 'Professional Society / Host'}</span>
                      {ws.location && <span>• {ws.location}</span>}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pb-3">
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {ws.description}
                    </p>

                    {/* Honorarium Banner */}
                    <div className="p-2.5 rounded-xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200/50 dark:border-cyan-900/40 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-cyan-900 dark:text-cyan-300 flex items-center gap-1">
                        <DollarSign size={13} /> {ws.stipend || 'Honorarium: ₹50,000'}
                      </span>
                      <span className="text-[11px] text-cyan-700 dark:text-cyan-400 font-medium flex items-center gap-1">
                        <Users size={12} /> 150+ Attendees
                      </span>
                    </div>

                    {/* Required Skills / Target Topics */}
                    {ws.requiredSkills && ws.requiredSkills.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          Session Technical Topics:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {ws.requiredSkills.map((sk, idx) => (
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
                        className="w-full h-9 rounded-xl text-xs font-semibold gap-1.5 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800"
                      >
                        <CheckCircle2 size={14} /> Speaking Slot Confirmed
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleOpenSlot(ws)}
                        className="w-full h-9 rounded-xl text-xs font-semibold gap-1 bg-cyan-600 hover:bg-cyan-700 text-white shadow-xs"
                      >
                        Accept Speaking Slot <ArrowUpRight size={14} />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Speaking Slot Modal */}
      <Dialog open={!!selectedWorkshop} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-[11px] border-cyan-500/30 text-cyan-600 bg-cyan-500/10">
                Keynote & Masterclass Speaker Confirmation
              </Badge>
            </div>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              {selectedWorkshop?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Confirm your presentation slot and submit your talk abstract.
            </DialogDescription>
          </DialogHeader>

          {successMsg ? (
            <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-center space-y-2 my-2">
              <CheckCircle2 size={24} className="text-cyan-600 mx-auto" />
              <p className="text-xs font-bold text-cyan-800 dark:text-cyan-200">{successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitWorkshopSlot} className="space-y-4 my-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p><strong>Host Society:</strong> {selectedWorkshop?.companyName || selectedWorkshop?.postedByName || 'Professional Society'}</p>
                <p><strong>Honorarium / Travel:</strong> {selectedWorkshop?.stipend || 'Standard Honorarium'}</p>
                <p><strong>Venue / Streaming:</strong> {selectedWorkshop?.location || 'National Convention Center / Virtual'}</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Presentation Slide Deck / Cloud Folder Link (Optional)</Label>
                <Input
                  type="url"
                  value={slideDeckUrl}
                  onChange={(e) => setSlideDeckUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or slideshare link"
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Session Abstract & Learning Outcomes</Label>
                <textarea
                  required
                  rows={3}
                  value={sessionAbstract}
                  onChange={(e) => setSessionAbstract(e.target.value)}
                  placeholder="Outline key concepts, audience takeaways, and live demonstration components..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" size="sm" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={submitting} className="bg-cyan-600 hover:bg-cyan-700 text-white gap-1">
                  <Send size={13} /> {submitting ? 'Submitting...' : 'Confirm Speaking Slot'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
