import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Building2,
  ArrowUpRight,
  Sparkles,
  Calendar,
  FileText,
  AlertCircle,
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
import { Separator } from '@/components/ui/separator';
import './AcademicianCollaborationsTab.css';

export default function AcademicianCollaborationsTab({ currentUser, onSelectTab }) {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const facultyId = currentUser?.id || currentUser?.userId || 1;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    academicianAPI.getCollaborations(facultyId)
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data)) {
          setCollaborations(data);
        } else {
          setCollaborations([]);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch faculty collaborations', err);
        setCollaborations([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [facultyId]);

  const filteredCollaborations = collaborations.filter((c) => {
    if (statusFilter === 'ALL') return true;
    return (c.status || '').toUpperCase() === statusFilter;
  });

  const statuses = [
    { label: 'All Collaborations', value: 'ALL', count: collaborations.length },
    { label: 'Expressed Interest', value: 'INTERESTED', count: collaborations.filter(c => (c.status || '').toUpperCase() === 'INTERESTED').length },
    { label: 'Shortlisted', value: 'SHORTLISTED', count: collaborations.filter(c => (c.status || '').toUpperCase() === 'SHORTLISTED').length },
    { label: 'Confirmed', value: 'CONFIRMED', count: collaborations.filter(c => (c.status || '').toUpperCase() === 'CONFIRMED').length },
    { label: 'Ongoing', value: 'ONGOING', count: collaborations.filter(c => (c.status || '').toUpperCase() === 'ONGOING').length },
    { label: 'Completed', value: 'COMPLETED', count: collaborations.filter(c => (c.status || '').toUpperCase() === 'COMPLETED').length },
  ];

  return (
    <div className="academician-collaborations-space space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            My Academic & Industry Collaborations
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track expressed interests, approved grants, active joint research, and completed consultancy engagements
          </p>
        </div>

        <Button
          onClick={() => onSelectTab('opportunities')}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs h-9"
        >
          Explore New Programs
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
        {statuses.map((st) => (
          <button
            key={st.value}
            onClick={() => setStatusFilter(st.value)}
            className={`text-xs px-3 py-1.5 rounded-xl font-medium transition flex items-center gap-1.5 ${
              statusFilter === st.value
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>{st.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              statusFilter === st.value ? 'bg-emerald-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {st.count}
            </span>
          </button>
        ))}
      </div>

      {/* Collaborations List using Shadcn Card and Badge */}
      {loading ? (
        <div className="py-16 text-center text-xs text-muted-foreground animate-pulse">
          Loading collaboration pipeline from database...
        </div>
      ) : filteredCollaborations.length === 0 ? (
        <Card className="p-12 text-center rounded-2xl border-dashed space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <Users size={22} />
          </div>
          <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
            {statusFilter === 'ALL' ? 'No Active Collaborations Yet' : `No Collaborations in ${statusFilter} stage`}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground max-w-sm mx-auto">
            Browse through sponsored FDPs, joint research initiatives, and corporate consultancy opportunities to partner with industry leaders.
          </CardDescription>
          <Button
            size="sm"
            onClick={() => onSelectTab('opportunities')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold mt-2 h-8"
          >
            Browse Available Opportunities
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredCollaborations.map((collab, idx) => {
            const status = (collab.status || 'INTERESTED').toUpperCase();

            let badgeVariant = 'secondary';
            if (status === 'CONFIRMED' || status === 'SHORTLISTED') {
              badgeVariant = 'emerald';
            } else if (status === 'ONGOING' || status === 'SELECTED') {
              badgeVariant = 'indigo';
            } else if (status === 'COMPLETED') {
              badgeVariant = 'emerald';
            }

            return (
              <Card
                key={collab.id || idx}
                className="rounded-2xl hover:border-emerald-500/40 transition"
              >
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={badgeVariant} className="text-[10px] font-bold gap-1 py-0.5">
                        <CheckCircle2 size={11} /> {status}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        ID: #{collab.id || idx + 101}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {collab.postingTitle || collab.posting?.title || 'Faculty Collaborative Engagement'}
                    </h4>

                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <Building2 size={13} className="text-muted-foreground shrink-0" />
                      <span>{collab.companyName || collab.institutionName || 'AICTE / Industry Partner'}</span>
                      <span>•</span>
                      <Calendar size={13} className="text-muted-foreground shrink-0" />
                      <span>Applied on {collab.appliedDate?.split('T')[0] || 'Recently'}</span>
                    </p>

                    {collab.notes && (
                      <div className="text-xs text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 mt-2">
                        "{collab.notes}"
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="text-xs font-semibold py-1.5 px-3">
                      Stage: {status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
