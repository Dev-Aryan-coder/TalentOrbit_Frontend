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
  AlertTriangle,
  Briefcase,
} from 'lucide-react';
import './StudentApplicationsTab.css';

export default function StudentApplicationsTab({ currentUser, onSelectTab }) {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);

  const userId = currentUser?.id || currentUser?.userId;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    applicationsAPI.getByUser(userId)
      .then((res) => {
        if (Array.isArray(res)) {
          const mapped = res.map((item) => ({
            id: item.id,
            title: item.postingTitle || item.posting?.title || 'Engineering Role',
            companyName: item.companyName || item.posting?.postedByName || 'Corporate Partner',
            appliedDate: item.appliedAt ? String(item.appliedAt).split('T')[0] : 'Recent',
            status: item.status || 'APPLIED',
            interviewDate: item.interviewScheduledAt || null,
          }));
          setApplications(mapped);
        }
      })
      .catch((err) => {
        console.warn('Could not load user applications from database:', err.message);
        setApplications([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const appliedCount = applications.filter((a) => a.status === 'APPLIED').length;
  const shortlistedCount = applications.filter((a) => a.status === 'SHORTLISTED').length;
  const interviewCount = applications.filter((a) => a.status === 'INTERVIEW_SCHEDULED').length;
  const selectedCount = applications.filter((a) => a.status === 'SELECTED' || a.status === 'COMPLETED').length;

  const renderStatusPill = (status) => {
    switch (status) {
      case 'INTERVIEW_SCHEDULED':
        return (
          <span className="app-status-badge interview">
            <Calendar size={12} />
            <span>Interview Scheduled</span>
          </span>
        );
      case 'SHORTLISTED':
        return (
          <span className="app-status-badge shortlisted">
            <CheckCircle2 size={12} />
            <span>Shortlisted</span>
          </span>
        );
      case 'SELECTED':
        return (
          <span className="app-status-badge selected">
            <CheckCircle2 size={12} />
            <span>Selected / Offered</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="app-status-badge rejected">
            <XCircle size={12} />
            <span>Archived</span>
          </span>
        );
      default:
        return (
          <span className="app-status-badge applied">
            <Clock size={12} />
            <span>Under Review</span>
          </span>
        );
    }
  };

  return (
    <div className="student-applications-container">
      <div className="applications-header-area">
        <h2 className="applications-header-title">Application Pipeline & Tracking</h2>
        <p className="applications-header-desc">
          Monitor your active candidacy status, recruiter reviews, and upcoming interview schedules in real time.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <RefreshCw size={28} className="animate-spin text-indigo-500 mb-3" />
          <p className="text-sm font-medium">Fetching application history from database...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <AlertTriangle size={36} className="text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No Job Applications Found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
            You haven't submitted applications to any corporate openings yet. Browse matched opportunities to apply with one click.
          </p>
          <button
            type="button"
            className="quiz-primary-btn inline-flex items-center gap-2"
            onClick={() => onSelectTab && onSelectTab('opportunities')}
          >
            <Briefcase size={16} />
            <span>Explore Matched Opportunities</span>
          </button>
        </div>
      ) : (
        <>
          {/* Pipeline Funnel Stats */}
          <div className="app-pipeline-stats-grid">
            <div className="app-pipeline-stat-card">
              <div className="app-pipeline-lbl">Under Review</div>
              <div className="app-pipeline-val">{appliedCount}</div>
            </div>

            <div className="app-pipeline-stat-card">
              <div className="app-pipeline-lbl">Shortlisted</div>
              <div className="app-pipeline-val text-indigo-600">{shortlistedCount}</div>
            </div>

            <div className="app-pipeline-stat-card">
              <div className="app-pipeline-lbl">Interviews Scheduled</div>
              <div className="app-pipeline-val text-amber-600">{interviewCount}</div>
            </div>

            <div className="app-pipeline-stat-card">
              <div className="app-pipeline-lbl">Selected & Placed</div>
              <div className="app-pipeline-val text-emerald-600">{selectedCount}</div>
            </div>
          </div>

          {/* Applications List */}
          <div className="applications-table-wrapper">
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Role & Position</th>
                  <th>Company</th>
                  <th>Date Applied</th>
                  <th>Candidacy Status</th>
                  <th>Interview Details</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div className="app-role-cell">
                        <FileText size={16} className="text-indigo-500 shrink-0" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {app.title}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="app-company-cell">
                        <Building size={14} className="text-slate-400" />
                        <span>{app.companyName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs text-slate-500">{app.appliedDate}</span>
                    </td>
                    <td>{renderStatusPill(app.status)}</td>
                    <td>
                      {app.interviewDate ? (
                        <div className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{String(app.interviewDate).replace('T', ' ')}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Pending Review</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
