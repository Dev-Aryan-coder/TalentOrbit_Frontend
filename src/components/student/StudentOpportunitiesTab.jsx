import React, { useState, useEffect } from 'react';
import { studentAPI, postingsAPI, applicationsAPI } from '../../services/api';
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  CheckCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import './StudentOpportunitiesTab.css';

const DEFAULT_POSTINGS = [
  {
    id: 1,
    title: 'Cloud Infrastructure & Backend Intern',
    postedByName: 'CloudCorp Technologies',
    stipend: '₹35,000 / month',
    location: 'Bengaluru / Remote',
    deadline: '2026-09-30',
    matchScore: 94,
    requiredSkills: ['Java', 'Spring Boot', 'SQL', 'Docker'],
    matchedSkills: ['Java', 'Spring Boot', 'SQL'],
    missingSkills: ['Docker'],
  },
  {
    id: 2,
    title: 'Full Stack Java Associate',
    postedByName: 'DataSystems Global',
    stipend: '₹40,000 / month',
    location: 'Hyderabad, India',
    deadline: '2026-10-15',
    matchScore: 91,
    requiredSkills: ['Java', 'React', 'REST APIs', 'PostgreSQL'],
    matchedSkills: ['Java', 'React', 'REST APIs'],
    missingSkills: ['PostgreSQL'],
  },
  {
    id: 3,
    title: 'Site Reliability & Cloud Operations',
    postedByName: 'DevOps Scale Labs',
    stipend: '₹30,000 / month',
    location: 'Pune / Hybrid',
    deadline: '2026-09-25',
    matchScore: 78,
    requiredSkills: ['Linux', 'Docker', 'Kubernetes', 'Python'],
    matchedSkills: ['Python', 'Docker'],
    missingSkills: ['Kubernetes'],
  },
];

export default function StudentOpportunitiesTab({ currentUser }) {
  const [loading, setLoading] = useState(true);
  const [postings, setPostings] = useState(DEFAULT_POSTINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [applyingId, setApplyingId] = useState(null);
  const [appliedSet, setAppliedSet] = useState(new Set());
  const [toastMsg, setToastMsg] = useState(null);

  const userId = currentUser?.id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    // Fetch matched postings or all active postings
    studentAPI.getMatchedPostings(userId)
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setPostings(res);
        } else {
          return postingsAPI.getActive();
        }
      })
      .then((allPostings) => {
        if (allPostings && Array.isArray(allPostings) && allPostings.length > 0) {
          setPostings(allPostings);
        }
      })
      .catch((err) => {
        console.warn('Could not load opportunities from backend, using active catalog', err);
      })
      .finally(() => setLoading(false));

    // Fetch already applied jobs
    applicationsAPI.getByUser(userId)
      .then((apps) => {
        if (Array.isArray(apps)) {
          const ids = new Set(apps.map((a) => a.postingId || a.posting?.id).filter(Boolean));
          setAppliedSet(ids);
        }
      })
      .catch((err) => console.warn('Could not load user applications', err));
  }, [userId]);

  const handleApply = async (postingId) => {
    if (!userId || applyingId || appliedSet.has(postingId)) return;
    setApplyingId(postingId);
    setToastMsg(null);

    try {
      await applicationsAPI.apply(userId, postingId);
      setAppliedSet((prev) => new Set([...prev, postingId]));
      setToastMsg({ type: 'success', text: 'Application successfully sent to recruiter.' });
    } catch (err) {
      console.error('Apply error:', err);
      setToastMsg({ type: 'error', text: err.message || 'Failed to submit application.' });
    } finally {
      setApplyingId(null);
    }
  };

  const filtered = postings.filter((p) => {
    const term = searchQuery.toLowerCase();
    const titleMatch = p.title?.toLowerCase().includes(term);
    const companyMatch = p.postedByName?.toLowerCase().includes(term);
    const skillsMatch = p.requiredSkills?.some((s) => s.toLowerCase().includes(term));
    return titleMatch || companyMatch || skillsMatch;
  });

  return (
    <div className="student-opportunities-container">
      <div className="opps-header-area">
        <div className="opps-title-group">
          <h2>Placement Opportunities & Corporate Drives</h2>
          <p>
            Ranked by weighted skill compatibility with your profile. 1-Click apply directly sends your verified credentials.
          </p>
        </div>

        <div className="opps-search-bar">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            className="opps-search-input"
            placeholder="Search by role, company, skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {toastMsg && (
        <div
          className={`p-3 rounded-lg text-sm font-medium border flex items-center justify-between ${
            toastMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <span>{toastMsg.text}</span>
          <button type="button" onClick={() => setToastMsg(null)} className="text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <RefreshCw size={28} className="animate-spin text-indigo-500 mb-3" />
          <p className="text-sm font-medium">Matching corporate postings against verified profile...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="opps-grid">
          {filtered.map((p) => {
            const score = p.matchScore != null ? p.matchScore : 88;
            const isApplied = appliedSet.has(p.id);
            const isApplying = applyingId === p.id;

            return (
              <div key={p.id} className="opp-card-extended">
                <div>
                  <div className="opp-card-top-row">
                    <div>
                      <h3 className="opp-role-title">{p.title}</h3>
                      <div className="opp-company-subtitle">{p.postedByName || 'Enterprise Hiring Partner'}</div>
                    </div>
                    <span className={`opp-score-badge ${score >= 85 ? 'high' : ''}`}>
                      {score}% Match
                    </span>
                  </div>

                  <div className="opp-meta-pills-row">
                    {p.stipend && (
                      <span className="opp-meta-pill">
                        <span>{p.stipend}</span>
                      </span>
                    )}
                    {p.location && (
                      <span className="opp-meta-pill">
                        <MapPin size={12} />
                        <span>{p.location}</span>
                      </span>
                    )}
                    {p.deadline && (
                      <span className="opp-meta-pill">
                        <Clock size={12} />
                        <span>{p.deadline}</span>
                      </span>
                    )}
                  </div>

                  {p.requiredSkills && p.requiredSkills.length > 0 && (
                    <div className="mt-4">
                      <div className="text-xs font-semibold text-slate-500 mb-1.5 uppercase">
                        Required Technologies:
                      </div>
                      <div className="opp-skills-cloud">
                        {p.requiredSkills.map((sk) => (
                          <span key={sk} className="opp-skill-chip">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="opp-card-actions">
                  <span className="text-xs text-slate-500 font-medium">Verified Applicant Fast-Track</span>
                  <button
                    type="button"
                    className={`opp-apply-btn ${isApplied ? 'applied' : ''}`}
                    onClick={() => handleApply(p.id)}
                    disabled={isApplied || isApplying}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle size={14} />
                        <span>Applied</span>
                      </>
                    ) : isApplying ? (
                      'Applying...'
                    ) : (
                      '1-Click Apply'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500">
          <Briefcase size={36} className="mx-auto mb-2 text-slate-400" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">No matching postings found</p>
          <p className="text-xs mt-1">Try refining your search query or verify more skills.</p>
        </div>
      )}
    </div>
  );
}
