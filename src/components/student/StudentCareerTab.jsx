import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import {
  Compass,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import './StudentCareerTab.css';

export default function StudentCareerTab({ currentUser, onSelectTab }) {
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);

  const userId = currentUser?.id || currentUser?.userId;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    studentAPI.getCareerSuggestions(userId)
      .then((res) => {
        if (Array.isArray(res)) {
          setSuggestions(res);
        }
      })
      .catch((err) => {
        console.warn('Could not load career suggestions from database:', err.message);
        setSuggestions([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="student-career-container">
      <div className="career-header-area">
        <h2 className="career-header-title">AI Career Path Guidance & Role Fit</h2>
        <p className="career-header-desc">
          Compare your current verified skills against real-world corporate job requirements. Identify missing competencies to bridge the gap toward your target role.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <RefreshCw size={28} className="animate-spin text-indigo-500 mb-3" />
          <p className="text-sm font-medium">Analyzing career role compatibility from database...</p>
        </div>
      ) : suggestions.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <AlertTriangle size={36} className="text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No Career Suggestions Generated Yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
            Your career compatibility profile requires verified skills in the database. Complete your 20-question skill evaluations to generate role fit recommendations.
          </p>
          <button
            type="button"
            className="quiz-primary-btn inline-flex items-center gap-2"
            onClick={() => onSelectTab && onSelectTab('assessment')}
          >
            <Sparkles size={16} />
            <span>Take Skill Diagnostic</span>
          </button>
        </div>
      ) : (
        <div className="career-roles-grid">
          {suggestions.map((role) => {
            const fit = role.fitPercent != null ? role.fitPercent : 0;
            return (
              <div key={role.roleName} className="career-role-card">
                <div>
                  <div className="career-card-header">
                    <div>
                      <h3 className="career-role-name">{role.roleName}</h3>
                      <p className="career-role-desc">{role.description}</p>
                    </div>
                    <span className={`career-fit-pill ${fit >= 80 ? 'high' : ''}`}>
                      {fit}% Fit
                    </span>
                  </div>

                  {/* Matched Skills */}
                  <div className="career-skills-section mt-4">
                    <div className="career-skills-lbl text-emerald-600">
                      Acquired Competencies ({role.matchedSkills?.length || 0})
                    </div>
                    <div className="career-tags-wrap">
                      {role.matchedSkills?.map((sk) => (
                        <span key={sk} className="career-skill-tag matched">
                          <CheckCircle2 size={12} />
                          <span>{sk}</span>
                        </span>
                      ))}
                      {(!role.matchedSkills || role.matchedSkills.length === 0) && (
                        <span className="text-xs text-slate-400">None yet</span>
                      )}
                    </div>
                  </div>

                  {/* Missing Skills / Bridge */}
                  <div className="career-skills-section mt-3">
                    <div className="career-skills-lbl text-amber-600">
                      Target Missing Competencies ({role.missingSkills?.length || 0})
                    </div>
                    <div className="career-tags-wrap">
                      {role.missingSkills?.map((sk) => (
                        <span key={sk} className="career-skill-tag missing">
                          <AlertCircle size={12} />
                          <span>{sk}</span>
                        </span>
                      ))}
                      {(!role.missingSkills || role.missingSkills.length === 0) && (
                        <span className="text-xs text-emerald-500 font-medium">Fully aligned!</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="career-card-footer mt-5">
                  <button
                    type="button"
                    className="career-bridge-btn"
                    onClick={() => onSelectTab && onSelectTab('roadmap')}
                  >
                    <span>Bridge Gap in Roadmap</span>
                    <ArrowRight size={14} />
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
