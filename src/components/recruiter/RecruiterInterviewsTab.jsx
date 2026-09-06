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
  CalendarCheck,
  Clock,
  Video,
  User,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  ExternalLink,
  Calendar,
  X,
  FileCheck,
} from 'lucide-react';
import { recruiterAPI, interviewsAPI } from '../../services/api';
import './RecruiterInterviewsTab.css';

export default function RecruiterInterviewsTab({ currentUser, onSelectTab }) {
  const companyId = currentUser?.companyId || currentUser?.id || 2;

  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('UPCOMING');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const [interviews, setInterviews] = useState([]);

  const [formData, setFormData] = useState({
    applicationId: null,
    candidateName: '',
    role: '',
    interviewer: '',
    date: '',
    time: '',
    meetingLink: '',
    notes: '',
  });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadInterviews() {
      try {
        // 1. Fetch company postings
        const postings = await recruiterAPI.getCompanyPostings(companyId).catch(() => []);
        let allInterviews = [];

        // 2. Fetch applications for each posting, then interviews for each application
        for (const p of postings) {
          try {
            const apps = await recruiterAPI.getRankedApplicants(p.id);
            if (Array.isArray(apps)) {
              for (const app of apps) {
                try {
                  const ivList = await interviewsAPI.getInterviewsForApplication(app.id || app.applicationId);
                  if (Array.isArray(ivList)) {
                    ivList.forEach((iv) => {
                      allInterviews.push({
                        id: iv.id,
                        candidateName: app.studentName || app.name || 'Candidate',
                        candidateEmail: app.studentEmail || app.email || '',
                        college: app.institutionName || app.college || '',
                        role: p.title || '',
                        interviewer: iv.interviewerName || '',
                        date: iv.scheduledAt ? new Date(iv.scheduledAt).toISOString().split('T')[0] : '',
                        time: iv.scheduledAt ? new Date(iv.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                        status: iv.status || 'SCHEDULED',
                        meetingLink: iv.meetingLink || '',
                        notes: iv.notes || '',
                      });
                    });
                  }
                } catch (e) {
                  // No interview for this application
                }
              }
            }
          } catch (e) {
            // No applications for this posting
          }
        }

        if (!isMounted) return;
        setInterviews(allInterviews);
      } catch (err) {
        console.error('Failed to load interviews from backend:', err);
        if (isMounted) setInterviews([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadInterviews();

    return () => {
      isMounted = false;
    };
  }, [companyId]);

  const handleUpdateStatus = (interviewId, newStatus) => {
    setInterviews((prev) =>
      prev.map((item) => (item.id === interviewId ? { ...item, status: newStatus } : item))
    );
    interviewsAPI
      .updateStatus(interviewId, newStatus)
      .catch((err) => console.warn('Interview status update notice:', err.message));
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!formData.candidateName.trim()) {
      alert('Please provide candidate name.');
      return;
    }

    const newInterview = {
      id: Date.now(),
      candidateName: formData.candidateName,
      candidateEmail: '',
      college: '',
      role: formData.role,
      interviewer: formData.interviewer,
      date: formData.date,
      time: formData.time,
      status: 'SCHEDULED',
      meetingLink: formData.meetingLink,
      notes: formData.notes,
    };

    setInterviews([newInterview, ...interviews]);
    setShowScheduleModal(false);

    interviewsAPI.schedule(newInterview).catch((err) => console.warn('Schedule interview persist note:', err.message));
  };

  const filteredInterviews = interviews.filter((item) => {
    const matchesSearch =
      item.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.interviewer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === 'ALL' ||
      (activeFilter === 'UPCOMING' && item.status === 'SCHEDULED') ||
      (activeFilter === 'COMPLETED' && item.status === 'COMPLETED');

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="recruiter-interviews-space space-y-6 pb-12">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarCheck size={24} className="text-blue-600" />
            Technical & HR Interview Pipeline
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Conduct synchronous evaluations, record evaluator feedback, and coordinate video conference links.
          </p>
        </div>

        <Button
          onClick={() => setShowScheduleModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md shadow-blue-600/30 gap-1.5 self-start sm:self-auto"
        >
          <Plus size={16} /> Schedule Interview
        </Button>
      </div>

      {/* 2. Filters & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'UPCOMING', label: 'Upcoming Sessions' },
            { id: 'COMPLETED', label: 'Completed Rounds' },
            { id: 'ALL', label: 'All Records' },
          ].map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by candidate or interviewer..."
            className="pl-8 h-8 text-xs border-slate-200 dark:border-slate-800"
          />
        </div>
      </div>

      {/* 3. Interview Cards Agenda */}
      {filteredInterviews.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <CalendarCheck size={36} className="mx-auto text-slate-300 dark:text-slate-700 mb-2" />
          <h3 className="font-bold text-slate-800 dark:text-white text-base">No Interviews Scheduled</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Candidates invited to technical rounds will appear here with live calendar slots and meeting links.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInterviews.map((item) => (
          <Card
            key={item.id}
            className="border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-sm shrink-0">
                    {item.candidateName[0]}
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                      {item.candidateName}
                    </CardTitle>
                    <p className="text-xs text-slate-500 truncate max-w-[200px]">{item.college}</p>
                  </div>
                </div>

                <Badge
                  className={`text-[10px] font-semibold tracking-wider ${
                    item.status === 'SCHEDULED'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200'
                      : item.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200'
                  }`}
                >
                  {item.status}
                </Badge>
              </div>

              <div className="mt-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs">
                <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.role}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                  <User size={12} className="text-slate-400" /> Evaluator: {item.interviewer}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pb-3">
              <div className="flex items-center gap-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-blue-600" />
                  <span>{item.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-blue-600" />
                  <span>{item.time}</span>
                </div>
              </div>

              {item.notes && (
                <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 p-2 rounded border border-slate-100 dark:border-slate-800 italic">
                  "{item.notes}"
                </p>
              )}
            </CardContent>

            <CardFooter className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <a
                href={item.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="h-8 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-xs flex items-center gap-1.5 hover:bg-emerald-100 transition"
              >
                <Video size={13} /> Launch Video Call <ExternalLink size={11} />
              </a>

              {item.status === 'SCHEDULED' && (
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(item.id, 'COMPLETED')}
                    className="h-8 text-xs text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 px-2"
                    title="Mark interview round as completed"
                  >
                    Mark Done
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleUpdateStatus(item.id, 'NO_SHOW')}
                    className="h-8 text-xs text-rose-600 hover:bg-rose-50 px-2"
                  >
                    No Show
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
          ))}
        </div>
      )}

      {/* 4. Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="border-b border-slate-100 dark:border-slate-800 p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CalendarCheck size={18} className="text-blue-600" />
                  Schedule Technical Interview Session
                </h3>
                <p className="text-xs text-slate-500">Dispatch calendar invite and meeting details.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Candidate Full Name *</label>
                <Input
                  required
                  value={formData.candidateName}
                  onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                  placeholder="Enter candidate full name"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Applied Opportunity Role</label>
                <Input
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Date</label>
                  <Input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Start Time</label>
                  <Input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Assigned Evaluator</label>
                <Input
                  required
                  value={formData.interviewer}
                  onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Video Link (Google Meet / Teams)</label>
                <Input
                  required
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Evaluation Focus / Agenda</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowScheduleModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30"
                >
                  Confirm & Schedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
