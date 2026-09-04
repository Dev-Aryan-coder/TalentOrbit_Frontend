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
  AlertTriangle,
} from 'lucide-react';
import './StudentOpportunitiesTab.css';

export default function StudentOpportunitiesTab({ currentUser }) {
  const [loading, setLoading] = useState(true);
  const [postings, setPostings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [applyingId, setApplyingId] = useState(null);
  const [appliedSet, setAppliedSet] = useState(new Set());
  const [toastMsg, setToastMsg] = useState(null);

  const userId = currentUser?.id || currentUser?.userId;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Fetch matched postings from database, fallback to active postings
    studentAPI.getMatchedPostings(userId)
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setPostings(res);
        } else {
          return postingsAPI.getActive();
        }
      })
      .then((allPostings) => {
        if (allPostings && Array.isArray(allPostings)) {
          setPostings(allPostings);
        }
      })
      .catch((err) => {
        console.warn('Could not load opportunities from database:', err.message);
        setPostings([]);
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
      .catch((err) => console.warn('Could not load user applications from database:', err.message));
  }, [userId]);

  const handleApply = async (postingId) => {
    if (!userId || applyingId || appliedSet.has(postingId)) return;
    setApplyingId(postingId);
    setToastMsg(null);

    try {
      await applicationsAPI.apply(userId, postingId);
      setAppliedSet((prev) => new Set([...prev, postingId]));
      setToastMsg({ type: 'success', text: 'Application submitted successfully to corporate recruiter.' });
    } catch (err) {
      console.error('Failed to submit application:', err);
      setToastMsg({ type: 'error', text: err.message || 'Failed to submit application.' });
    } finally {
      setApplyingId(null);
    }
  };

  const filtered = postings.filter((p) => {
    const q = searchQuery.toLowerCase();
    const title = (p.title || '').toLowerCase();
    const company = (p.postedByName || p.companyName || '').toLowerCase();
    const loc = (p.location || '').toLowerCase();
    return title.includes(q) || company.includes(q) || loc.includes(q);
  });

  return (
    <div className="student-opportunities-container">
      {/* Toast Alert */}
      {toastMsg && (
        <div
          className={`p-3 rounded-lg text-sm font-medium border flex items-center justify-between ${
            toastMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <span>{toastMsg.text}</span>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            className="text-xs underline hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header & Search */}
      <div className="opportunities-header-row">
        <div>
          <h2 className="opportunities-header-title">Matched Corporate Opportunities</h2>
          <p className="opportunities-header-desc">
            Explore verified internships and full-time engineering positions ranked by skill compatibility.
          </p>
        </div>

        <div className="opportunities-search-wrap">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search role, company, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="opportunities-search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <RefreshCw size={28} className="animate-spin text-indigo-500 mb-3" />
          <p className="text-sm font-medium">Fetching live opportunities from database...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <AlertTriangle size={36} className="text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {searchQuery ? 'No Matching Opportunities Found' : 'No Active Job Postings in Database'}
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
            {searchQuery
              ? 'No active postings match your search filter. Try clearing or broadening your search query.'
              : 'When industry partners publish verified internships and engineering openings, they will appear here.'}
          </p>
        </div>
      ) : (
        <div className="opportunities-cards-grid">
          {filtered.map((posting) => {
            const hasApplied = appliedSet.has(posting.id);
            const isApplying = applyingId === posting.id;
            const matchScore = posting.matchScore != null ? Math.round(posting.matchScore) : 0;
            const companyName = posting.postedByName || posting.companyName || 'Verified Partner';
            const location = posting.location || 'Remote / Hybrid';
            const stipend = posting.stipend || posting.salaryRange || 'Competitive Industry Standard';
            const deadline = posting.deadline ? String(posting.deadline).split('T')[0] : 'Open';

            const reqSkills = posting.requiredSkills || [];
            const matchedSkills = posting.matchedSkills || [];
            const missingSkills = posting.missingSkills || [];

            return (
              <div key={posting.id} className="opportunity-full-card">
                <div className="opportunity-card-main-content">
                  <div className="opportunity-top-bar">
                    <div>
                      <div className="opportunity-company-name">{companyName}</div>
                      <h3 className="opportunity-role-title">{posting.title}</h3>
                    </div>

                    {matchScore > 0 && (
                      <span className={`opportunity-match-tag ${matchScore >= 80 ? 'high' : ''}`}>
                        {matchScore}% Compatibility
                      </span>
                    )}
                  </div>

                  <div className="opportunity-meta-row">
                    <span className="opportunity-meta-item">
                      <MapPin size={14} />
                      <span>{location}</span>
                    </span>
                    <span className="opportunity-meta-item">
                      <Clock size={14} />
                      <span>Deadline: {deadline}</span>
                    </span>
                    <span className="opportunity-meta-item stipend">
                      <span>{stipend}</span>
                    </span>
                  </div>

                  {/* Skills tags */}
                  {reqSkills.length > 0 && (
                    <div className="opportunity-skills-list">
                      {reqSkills.map((sk) => {
                        const isMatched = matchedSkills.includes(sk);
                        return (
                          <span
                            key={sk}
                            className={`opp-skill-chip ${isMatched ? 'matched' : 'unmatched'}`}
                          >
                            {sk}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="opportunity-action-bar">
                  <button
                    type="button"
                    className={`opp-apply-btn ${hasApplied ? 'applied' : ''}`}
                    disabled={hasApplied || isApplying}
                    onClick={() => handleApply(posting.id)}
                  >
                    {hasApplied ? (
                      <>
                        <CheckCircle size={14} />
                        <span>Application Submitted</span>
                      </>
                    ) : isApplying ? (
                      <span>Submitting Application...</span>
                    ) : (
                      <>
                        <Briefcase size={14} />
                        <span>1-Click Apply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
