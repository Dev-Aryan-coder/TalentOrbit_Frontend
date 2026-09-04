import React, { useState, useEffect } from 'react';
import { studentAPI, profileAPI } from '../../services/api';
import {
  Code2,
  CheckCircle,
  Clock,
  Plus,
  Brain,
  Layers,
  Wrench,
  BookOpen,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import './StudentSkillsTab.css';

export default function StudentSkillsTab({ currentUser, onSelectTab, onOpenSkillsModal }) {
  const [loading, setLoading] = useState(true);
  const [profileSkills, setProfileSkills] = useState({
    languages: [],
    libraries: [],
    frameworks: [],
    tools: [],
  });
  const [verifiedSet, setVerifiedSet] = useState(new Set());

  const userId = currentUser?.id || currentUser?.userId;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);

    Promise.allSettled([
      profileAPI.getProfile(userId),
      studentAPI.getProfile(userId),
    ])
      .then(([profRes, studRes]) => {
        const verified = new Set();

        // 1. Process verified skills from backend student records
        if (studRes.status === 'fulfilled' && studRes.value?.skills) {
          studRes.value.skills.forEach((s) => {
            if (typeof s === 'string') {
              if (s.toLowerCase().includes('verified')) {
                verified.add(s.split('(')[0].trim());
              }
            } else if (s && s.isVerified) {
              verified.add(s.name || s.skillName);
            }
          });
        }
        setVerifiedSet(verified);

        // 2. Process real skills from user-profile onboarding / database
        if (profRes.status === 'fulfilled' && profRes.value) {
          const p = profRes.value;
          setProfileSkills({
            languages: Array.isArray(p.languages) ? p.languages : [],
            libraries: Array.isArray(p.libraries) ? p.libraries : [],
            frameworks: Array.isArray(p.frameworks) ? p.frameworks : [],
            tools: Array.isArray(p.tools) ? p.tools : [],
          });
        }
      })
      .catch((err) => {
        console.error('Error fetching real skills matrix from database:', err);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const allSkills = [
    ...(profileSkills.languages || []).map((name) => ({ name, category: 'Language' })),
    ...(profileSkills.frameworks || []).map((name) => ({ name, category: 'Framework' })),
    ...(profileSkills.libraries || []).map((name) => ({ name, category: 'Library' })),
    ...(profileSkills.tools || []).map((name) => ({ name, category: 'Tool' })),
  ];

  const totalCount = allSkills.length;
  const verifiedCount = Array.from(verifiedSet).filter((v) =>
    allSkills.some((s) => s.name.toLowerCase() === v.toLowerCase())
  ).length;
  const unverifiedCount = Math.max(0, totalCount - verifiedCount);

  return (
    <div className="student-skills-container">
      {/* Header */}
      <div className="skills-summary-header">
        <div>
          <h2 className="skills-header-title">Technical Skill Matrix</h2>
          <p className="skills-header-desc">
            Empirically verified competencies, self-reported skills, and technical category breakdowns from your database profile.
          </p>
        </div>

        <button
          type="button"
          className="skills-add-btn"
          onClick={onOpenSkillsModal}
        >
          <Plus size={16} />
          <span>Add / Update Skills</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <RefreshCw size={28} className="animate-spin text-indigo-500 mb-3" />
          <p className="text-sm font-medium">Loading skills matrix from database...</p>
        </div>
      ) : totalCount === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <AlertTriangle size={36} className="text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No Acquired Skills Recorded Yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
            Your database skill matrix is currently empty. Add the programming languages, libraries, frameworks, and developer tools you know to populate your matrix.
          </p>
          <button
            type="button"
            className="skills-add-btn inline-flex items-center gap-2"
            onClick={onOpenSkillsModal}
          >
            <Plus size={16} />
            <span>Select Your Skills Now</span>
          </button>
        </div>
      ) : (
        <>
          {/* 3-Col Stats */}
          <div className="skills-stat-row">
            <div className="skills-stat-box">
              <div className="skills-stat-box-lbl">Total Acquired Skills</div>
              <div className="skills-stat-box-val">{totalCount}</div>
            </div>

            <div className="skills-stat-box">
              <div className="skills-stat-box-lbl">Verified Competencies</div>
              <div className="skills-stat-box-val text-emerald-600">{verifiedCount}</div>
            </div>

            <div className="skills-stat-box">
              <div className="skills-stat-box-lbl">Pending Verification</div>
              <div className="skills-stat-box-val text-amber-600">{unverifiedCount}</div>
            </div>
          </div>

          {/* Languages Section */}
          {profileSkills.languages?.length > 0 && (
            <div className="skills-category-section">
              <div className="skills-category-title">
                <Code2 size={18} className="text-indigo-500" />
                <span>Programming Languages ({profileSkills.languages.length})</span>
              </div>
              <div className="skills-cards-grid">
                {profileSkills.languages.map((skillName) => {
                  const isVerified = verifiedSet.has(skillName);
                  return (
                    <div key={skillName} className="skill-matrix-card">
                      <div className="skill-card-top">
                        <span className="skill-card-name">{skillName}</span>
                        <span
                          className={`skill-verified-badge ${
                            isVerified ? 'verified' : 'unverified'
                          }`}
                        >
                          {isVerified ? <CheckCircle size={12} /> : <Clock size={12} />}
                          <span>{isVerified ? 'Verified' : 'Self-Reported'}</span>
                        </span>
                      </div>
                      <div className="skill-card-footer">
                        <span className="skill-proficiency-tag">
                          {isVerified ? 'Proficiency: Verified' : 'Proficiency: Self-Rated'}
                        </span>
                        <button
                          type="button"
                          className="skill-assess-action-btn"
                          onClick={() => onSelectTab && onSelectTab('assessment')}
                        >
                          <Brain size={12} />
                          <span>{isVerified ? 'Re-Evaluate' : 'Take Diagnostic'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Frameworks Section */}
          {profileSkills.frameworks?.length > 0 && (
            <div className="skills-category-section">
              <div className="skills-category-title">
                <Layers size={18} className="text-indigo-500" />
                <span>Frameworks & Core Architecture ({profileSkills.frameworks.length})</span>
              </div>
              <div className="skills-cards-grid">
                {profileSkills.frameworks.map((skillName) => {
                  const isVerified = verifiedSet.has(skillName);
                  return (
                    <div key={skillName} className="skill-matrix-card">
                      <div className="skill-card-top">
                        <span className="skill-card-name">{skillName}</span>
                        <span
                          className={`skill-verified-badge ${
                            isVerified ? 'verified' : 'unverified'
                          }`}
                        >
                          {isVerified ? <CheckCircle size={12} /> : <Clock size={12} />}
                          <span>{isVerified ? 'Verified' : 'Self-Reported'}</span>
                        </span>
                      </div>
                      <div className="skill-card-footer">
                        <span className="skill-proficiency-tag">
                          {isVerified ? 'Proficiency: Verified' : 'Proficiency: Self-Rated'}
                        </span>
                        <button
                          type="button"
                          className="skill-assess-action-btn"
                          onClick={() => onSelectTab && onSelectTab('assessment')}
                        >
                          <Brain size={12} />
                          <span>{isVerified ? 'Re-Evaluate' : 'Take Diagnostic'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Libraries Section */}
          {profileSkills.libraries?.length > 0 && (
            <div className="skills-category-section">
              <div className="skills-category-title">
                <BookOpen size={18} className="text-indigo-500" />
                <span>Libraries & Ecosystem Packages ({profileSkills.libraries.length})</span>
              </div>
              <div className="skills-cards-grid">
                {profileSkills.libraries.map((skillName) => {
                  const isVerified = verifiedSet.has(skillName);
                  return (
                    <div key={skillName} className="skill-matrix-card">
                      <div className="skill-card-top">
                        <span className="skill-card-name">{skillName}</span>
                        <span
                          className={`skill-verified-badge ${
                            isVerified ? 'verified' : 'unverified'
                          }`}
                        >
                          {isVerified ? <CheckCircle size={12} /> : <Clock size={12} />}
                          <span>{isVerified ? 'Verified' : 'Self-Reported'}</span>
                        </span>
                      </div>
                      <div className="skill-card-footer">
                        <span className="skill-proficiency-tag">
                          {isVerified ? 'Proficiency: Verified' : 'Proficiency: Self-Rated'}
                        </span>
                        <button
                          type="button"
                          className="skill-assess-action-btn"
                          onClick={() => onSelectTab && onSelectTab('assessment')}
                        >
                          <Brain size={12} />
                          <span>{isVerified ? 'Re-Evaluate' : 'Take Diagnostic'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Developer Tools Section */}
          {profileSkills.tools?.length > 0 && (
            <div className="skills-category-section">
              <div className="skills-category-title">
                <Wrench size={18} className="text-indigo-500" />
                <span>Developer Tools & Cloud Infrastructure ({profileSkills.tools.length})</span>
              </div>
              <div className="skills-cards-grid">
                {profileSkills.tools.map((skillName) => {
                  const isVerified = verifiedSet.has(skillName);
                  return (
                    <div key={skillName} className="skill-matrix-card">
                      <div className="skill-card-top">
                        <span className="skill-card-name">{skillName}</span>
                        <span
                          className={`skill-verified-badge ${
                            isVerified ? 'verified' : 'unverified'
                          }`}
                        >
                          {isVerified ? <CheckCircle size={12} /> : <Clock size={12} />}
                          <span>{isVerified ? 'Verified' : 'Self-Reported'}</span>
                        </span>
                      </div>
                      <div className="skill-card-footer">
                        <span className="skill-proficiency-tag">
                          {isVerified ? 'Proficiency: Verified' : 'Proficiency: Self-Rated'}
                        </span>
                        <button
                          type="button"
                          className="skill-assess-action-btn"
                          onClick={() => onSelectTab && onSelectTab('assessment')}
                        >
                          <Brain size={12} />
                          <span>{isVerified ? 'Re-Evaluate' : 'Take Diagnostic'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
