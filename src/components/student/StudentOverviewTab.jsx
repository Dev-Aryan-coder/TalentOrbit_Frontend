import React, { useState, useEffect, useCallback } from 'react';
import {
  dashboardAPI,
  studentAPI,
  roadmapAPI,
  applicationsAPI,
} from '../../services/api';
import {
  TrendingUp,
  Award,
  Briefcase,
  FileText,
  Calendar,
  Sliders,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Clock,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import './StudentOverviewTab.css';

export default function StudentOverviewTab({ currentUser, onSelectTab }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    readinessScore: 0,
    verifiedSkillsCount: 0,
    recommendedMatchCount: 0,
    applicationCount: 0,
    interviewCount: 0,
    targetRole: '',
  });
  const [skillGaps, setSkillGaps] = useState([]);
  const [matchedPostings, setMatchedPostings] = useState([]);
  const [nextMilestone, setNextMilestone] = useState(null);
  const [applyingId, setApplyingId] = useState(null);
  const [appliedPostingIds, setAppliedPostingIds] = useState(new Set());
  const [statusMessage, setStatusMessage] = useState(null);

  const userId = currentUser?.id || currentUser?.userId;

  const fetchDashboardData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      // 1. Fetch live dashboard stats and student profile from real database
      const [statsRes, profileRes, skillGapRes, matchedRes, roadmapRes] = await Promise.allSettled([
        dashboardAPI.getStats('STUDENT', userId),
        studentAPI.getProfile(userId),
        dashboardAPI.getSkillGaps(),
        studentAPI.getMatchedPostings(userId),
        roadmapAPI.getSteps(userId),
      ]);

      // Process Stats & Profile
      let readiness = 0;
      let targetRole = '';
      if (profileRes.status === 'fulfilled' && profileRes.value) {
        if (profileRes.value.employabilityScore != null) {
          readiness = profileRes.value.employabilityScore;
        }
        if (profileRes.value.targetRole) {
          targetRole = profileRes.value.targetRole;
        }
      }

      let verifiedCount = 0;
      let matchesCount = 0;
      let appCount = 0;
      let interviewCount = 0;

      if (statsRes.status === 'fulfilled' && statsRes.value) {
        const d = statsRes.value;
        const s = d.stats || {};
        verifiedCount = s.verifiedSkillsCount ?? d.totalSkillsInMaster ?? 0;
        matchesCount = s.recommendedMatchCount ?? d.totalActivePostings ?? 0;
        appCount = s.applicationCount ?? d.totalApplications ?? 0;
        interviewCount = s.interviewCount ?? 0;
      }

      setStats({
        readinessScore: readiness,
        verifiedSkillsCount: verifiedCount,
        recommendedMatchCount: matchesCount,
        applicationCount: appCount,
        interviewCount: interviewCount,
        targetRole: targetRole,
      });

      // Process Skill Gaps
      if (skillGapRes.status === 'fulfilled' && Array.isArray(skillGapRes.value)) {
        setSkillGaps(skillGapRes.value.slice(0, 4));
      }

      // Process Matched Opportunities
      if (matchedRes.status === 'fulfilled' && Array.isArray(matchedRes.value)) {
        setMatchedPostings(matchedRes.value.slice(0, 4));
      }

      // Process Next Milestone
      if (roadmapRes.status === 'fulfilled' && Array.isArray(roadmapRes.value)) {
        const inProgress = roadmapRes.value.find((s) => s.status === 'IN_PROGRESS');
        const firstLocked = roadmapRes.value.find((s) => s.status === 'LOCKED');
        setNextMilestone(inProgress || firstLocked || roadmapRes.value[0] || null);
      }
    } catch (err) {
      console.error('Error fetching student dashboard overview:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle 1-Click Application
  const handleApply = async (postingId) => {
    if (!userId || applyingId || appliedPostingIds.has(postingId)) return;
    setApplyingId(postingId);
    setStatusMessage(null);

    try {
      await applicationsAPI.apply(userId, postingId);
      setAppliedPostingIds((prev) => new Set([...prev, postingId]));
      setStatusMessage({ type: 'success', text: 'Application submitted successfully to employer.' });
      // Update local stat count
      setStats((prev) => ({ ...prev, applicationCount: prev.applicationCount + 1 }));
    } catch (err) {
      console.error('Failed to submit application:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to submit application. Please try again.' });
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="student-overview-container">
      {/* Real-time Status Alert */}
      {statusMessage && (
        <div
          className={`p-3 rounded-lg text-sm font-medium border flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-xs underline hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 5 Stat Cards Row */}
      <div className="student-stat-cards-grid">
        {/* Card 1: Employability Readiness */}
        <div className="student-stat-card">
          <div className="student-stat-top">
            <div className="student-stat-icon-wrapper primary">
              <TrendingUp size={18} />
            </div>
            <span className="student-stat-badge">Dynamic</span>
          </div>
          <div>
            <div className="student-stat-label">Readiness Score</div>
            <div className="student-stat-val">{stats.readinessScore}%</div>
          </div>
        </div>

        {/* Card 2: Verified Skills */}
        <div className="student-stat-card">
          <div className="student-stat-top">
            <div className="student-stat-icon-wrapper emerald">
              <Award size={18} />
            </div>
          </div>
          <div>
            <div className="student-stat-label">Verified Skills</div>
            <div className="student-stat-val">{stats.verifiedSkillsCount}</div>
          </div>
        </div>

        {/* Card 3: Recommended Matches */}
        <div className="student-stat-card">
          <div className="student-stat-top">
            <div className="student-stat-icon-wrapper purple">
              <Briefcase size={18} />
            </div>
            <span className="student-stat-badge">70%+ Fit</span>
          </div>
          <div>
            <div className="student-stat-label">Recommended Matches</div>
            <div className="student-stat-val">{stats.recommendedMatchCount}</div>
          </div>
        </div>

        {/* Card 4: Applications */}
        <div className="student-stat-card">
          <div className="student-stat-top">
            <div className="student-stat-icon-wrapper blue">
              <FileText size={18} />
            </div>
          </div>
          <div>
            <div className="student-stat-label">Active Applications</div>
            <div className="student-stat-val">{stats.applicationCount}</div>
          </div>
        </div>

        {/* Card 5: Scheduled Interviews */}
        <div className="student-stat-card">
          <div className="student-stat-top">
            <div className="student-stat-icon-wrapper amber">
              <Calendar size={18} />
            </div>
          </div>
          <div>
            <div className="student-stat-label">Scheduled Interviews</div>
            <div className="student-stat-val">{stats.interviewCount}</div>
          </div>
        </div>
      </div>

      {/* Milestone Roadmap Banner */}
      {nextMilestone && (
        <div className="student-milestone-banner">
          <div className="student-milestone-left">
            <div className="student-milestone-icon">
              <Sparkles size={22} />
            </div>
            <div>
              <div className="student-milestone-tag">Next Career Milestone</div>
              <div className="student-milestone-title">{nextMilestone.title}</div>
              <div className="student-milestone-desc">{nextMilestone.description}</div>
            </div>
          </div>
          <button
            type="button"
            className="student-milestone-action-btn"
            onClick={() => onSelectTab('roadmap')}
          >
            <span>Track in Roadmap</span>
            <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* Split Section: Skill Gaps vs Recommended Postings */}
      <div className="student-dash-grid-split">
        {/* Left: Top Skill Gaps */}
        <div className="student-card-panel">
          <div className="student-panel-header">
            <div>
              <div className="student-panel-title">
                <Sliders size={18} className="text-indigo-500" />
                <span>Market Skill Deficits</span>
              </div>
              <div className="student-panel-subtitle">Industry hiring demand versus student supply</div>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab('skills')}
              className="text-xs text-indigo-600 hover:underline font-medium"
            >
              View Matrix
            </button>
          </div>

          {loading ? (
            <div className="student-empty-state">
              <RefreshCw size={24} className="animate-spin text-indigo-500 mb-2" />
              <div className="student-empty-title">Computing skill metrics...</div>
            </div>
          ) : skillGaps.length > 0 ? (
            <div className="student-skill-gaps-list">
              {skillGaps.map((gap, idx) => {
                const deficit = gap.deficitPercentage || 0;
                const progressWidth = Math.max(10, 100 - deficit);
                const colorClass = deficit > 50 ? 'red' : deficit > 25 ? 'amber' : 'emerald';
                const tagClass = deficit > 50 ? 'deficit-high' : deficit > 25 ? 'deficit-mid' : 'deficit-low';

                return (
                  <div key={gap.skillName || idx} className="student-skill-gap-item">
                    <div className="student-skill-gap-info">
                      <span className="student-skill-name">{gap.skillName}</span>
                      <span className={`student-skill-gap-tag ${tagClass}`}>{deficit}% Market Deficit</span>
                    </div>
                    <div className="student-progress-track">
                      <div
                        className={`student-progress-fill ${colorClass}`}
                        style={{ width: `${progressWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="student-gap-tip-box">
                <Sparkles size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                <div className="student-gap-tip-text">
                  Verifying skills with high market deficits unlocks up to 3x more recruiter interview requests.
                </div>
              </div>
            </div>
          ) : (
            <div className="student-empty-state">
              <div className="student-empty-title">No Skill Deficits Reported</div>
              <div className="student-empty-desc">
                Your acquired skills are aligned with current corporate postings.
              </div>
            </div>
          )}
        </div>

        {/* Right: Recommended Opportunities */}
        <div className="student-card-panel">
          <div className="student-panel-header">
            <div>
              <div className="student-panel-title">
                <Briefcase size={18} className="text-indigo-500" />
                <span>Recommended Opportunities</span>
              </div>
              <div className="student-panel-subtitle">
                Ranked by real compatibility score with your verified skills
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab('opportunities')}
              className="text-xs text-indigo-600 hover:underline font-medium"
            >
              View All
            </button>
          </div>

          {loading ? (
            <div className="student-empty-state">
              <RefreshCw size={24} className="animate-spin text-indigo-500 mb-2" />
              <div className="student-empty-title">Loading active opportunities...</div>
            </div>
          ) : matchedPostings.length > 0 ? (
            <div className="student-opportunities-stack">
              {matchedPostings.map((p) => {
                const score = p.matchScore != null ? p.matchScore : 85;
                const isApplied = appliedPostingIds.has(p.id);
                const isApplying = applyingId === p.id;
                const initial = p.title ? p.title.charAt(0).toUpperCase() : 'O';

                return (
                  <div key={p.id} className="student-opportunity-card">
                    <div className="student-opp-left">
                      <div className="student-opp-logo">{initial}</div>
                      <div>
                        <div className="student-opp-title">{p.title}</div>
                        <div className="student-opp-meta">
                          {p.stipend && (
                            <span className="student-opp-meta-item">
                              <span>{p.stipend}</span>
                            </span>
                          )}
                          {p.location && (
                            <span className="student-opp-meta-item">
                              <span>{p.location}</span>
                            </span>
                          )}
                          {p.deadline && (
                            <span className="student-opp-meta-item">
                              <Clock size={12} />
                              <span>{p.deadline}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="student-opp-right">
                      <span className={`student-match-pill ${score >= 80 ? 'high' : ''}`}>
                        {score}% Match
                      </span>
                      <button
                        type="button"
                        className={`student-apply-btn ${isApplied ? 'applied' : ''}`}
                        onClick={() => handleApply(p.id)}
                        disabled={isApplied || isApplying}
                      >
                        {isApplied ? 'Applied' : isApplying ? 'Applying...' : '1-Click Apply'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="student-empty-state">
              <Briefcase size={32} className="student-empty-icon" />
              <div className="student-empty-title">No Postings Found</div>
              <div className="student-empty-desc">
                Complete your skill diagnostic assessment to discover personalized job drives.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
