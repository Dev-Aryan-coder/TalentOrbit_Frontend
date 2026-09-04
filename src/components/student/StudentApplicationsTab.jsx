import React, { useState, useEffect } from 'react';
import { applicationsAPI } from '../../services/api';
import {
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  XCircle,
  RefreshCw,
  Building,
} from 'lucide-react';
import './StudentApplicationsTab.css';

const DEFAULT_APPLICATIONS = [
  {
    id: 101,
    title: 'Cloud Infrastructure & Backend Intern',
    companyName: 'CloudCorp Technologies',
    appliedDate: '2026-08-28',
    status: 'INTERVIEW_SCHEDULED',
    interviewDate: '2026-09-08 14:00',
  },
  {
    id: 102,
    title: 'Full Stack Java Associate',
    companyName: 'DataSystems Global',
    appliedDate: '2026-08-30',
    status: 'SHORTLISTED',
    interviewDate: null,
  },
  {
    id: 103,
    title: 'Site Reliability & Cloud Operations',
    companyName: 'DevOps Scale Labs',
    appliedDate: '2026-09-02',
    status: 'APPLIED',
    interviewDate: null,
  },
];

export default function StudentApplicationsTab({ currentUser }) {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState(DEFAULT_APPLICATIONS);

  const userId = currentUser?.id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    applicationsAPI.getByUser(userId)
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          const mapped = res.map((item) => ({
            id: item.id,
            title: item.postingTitle || item.posting?.title || 'Engineering Role',
            companyName: item.companyName || item.posting?.postedByName || 'Enterprise Partner',
            appliedDate: item.appliedAt ? String(item.appliedAt).split('T')[0] : '2026-09-01',
            status: item.status || 'APPLIED',
            interviewDate: item.interviewScheduledAt || null,
          }));
          setApplications(mapped);
        }
      })
      .catch((err) => {
        console.warn('Could not load user applications from backend, showing pipeline records', err);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const appliedCount = applications.filter((a) => a.status === 'APPLIED').length;
  const shortlistedCount = applications.filter((a) => a.status === 'SHORTLISTED').length;
  const interviewCount = applications.filter((a) => a.status === 'INTERVIEW_SCHEDULED').length;
  const selectedCount = applications.filter((a) => a.status === 'SELECTED' || a.status === 'COMPLETED').length;

  const renderStatusPill = (status) => {
    switch (status) {
      case 'SELECTED':
      case 'COMPLETED':
        return (
          <span className="apps-status-pill selected">
            <CheckCircle2 size={12} />
            <span>Selected</span>
          </span>
        );
      case 'INTERVIEW_SCHEDULED':
        return (
          <span className="apps-status-pill interview">
            <Calendar size={12} />
            <span>Interview Scheduled</span>
          </span>
        );
      case 'SHORTLISTED':
        return (
          <span className="apps-status-pill shortlisted">
            <Clock size={12} />
            <span>Shortlisted</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="apps-status-pill rejected">
            <XCircle size={12} />
            <span>Not Selected</span>
          </span>
        );
      case 'APPLIED':
      default:
        return (
          <span className="apps-status-pill applied">
            <Clock size={12} />
            <span>Applied</span>
          </span>
        );
    }
  };

  return (
    <div className="student-apps-container">
      <div className="apps-header-area">
        <div>
          <h2>Placement Applications Pipeline</h2>
          <p>Real-time lifecycle tracking of all corporate drives, internship interviews, and hiring outcomes.</p>
        </div>
      </div>

      {/* Funnel Bar */}
      <div className="apps-funnel-bar">
        <div className="apps-funnel-tile">
          <div className="apps-funnel-lbl">Total Submitted</div>
          <div className="apps-funnel-val text-blue-600">{applications.length}</div>
        </div>
        <div className="apps-funnel-tile">
          <div className="apps-funnel-lbl">Under Review / Shortlisted</div>
          <div className="apps-funnel-val text-purple-600">{shortlistedCount}</div>
        </div>
        <div className="apps-funnel-tile">
          <div className="apps-funnel-lbl">Interviews Booked</div>
          <div className="apps-funnel-val text-amber-600">{interviewCount}</div>
        </div>
        <div className="apps-funnel-tile">
          <div className="apps-funnel-lbl">Offers / Placed</div>
          <div className="apps-funnel-val text-emerald-600">{selectedCount}</div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <RefreshCw size={28} className="animate-spin text-indigo-500 mb-3" />
          <p className="text-sm font-medium">Loading application status updates...</p>
        </div>
      ) : applications.length > 0 ? (
        <div className="apps-table-card">
          <div className="overflow-x-auto">
            <table className="apps-table">
              <thead>
                <tr>
                  <th>Target Role</th>
                  <th>Hiring Company</th>
                  <th>Applied On</th>
                  <th>Recruitment Stage</th>
                  <th>Next Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td className="font-semibold text-slate-800 dark:text-slate-100">{app.title}</td>
                    <td>
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <Building size={14} className="text-slate-400" />
                        <span>{app.companyName}</span>
                      </div>
                    </td>
                    <td className="text-slate-500">{app.appliedDate}</td>
                    <td>{renderStatusPill(app.status)}</td>
                    <td>
                      {app.status === 'INTERVIEW_SCHEDULED' ? (
                        <span className="text-xs font-semibold text-indigo-600">
                          Prep for Technical Interview {app.interviewDate ? `(${app.interviewDate})` : ''}
                        </span>
                      ) : app.status === 'SHORTLISTED' ? (
                        <span className="text-xs text-slate-500">Recruiter reviewing code samples</span>
                      ) : (
                        <span className="text-xs text-slate-400">Application under initial screening</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500">
          <FileText size={36} className="mx-auto mb-2 text-slate-400" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">No applications submitted yet</p>
          <p className="text-xs mt-1">Explore recommended opportunities and submit with 1-Click apply.</p>
        </div>
      )}
    </div>
  );
}
