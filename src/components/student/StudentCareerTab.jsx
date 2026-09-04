import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import {
  Compass,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import './StudentCareerTab.css';

const DEFAULT_SUGGESTIONS = [
  {
    roleName: 'Backend & Cloud Engineer',
    description: 'Design and build highly available, scalable microservices and cloud infrastructures.',
    fitPercent: 88,
    matchedSkills: ['Java', 'Spring Boot', 'SQL', 'Git'],
    missingSkills: ['Kubernetes', 'AWS', 'Redis'],
  },
  {
    roleName: 'Full Stack Developer',
    description: 'Develop end-to-end web applications combining modern frontend frameworks and robust backend APIs.',
    fitPercent: 78,
    matchedSkills: ['React', 'Java', 'SQL', 'Postman'],
    missingSkills: ['TypeScript', 'Next.js', 'Docker'],
  },
  {
    roleName: 'DevOps & Site Reliability Specialist',
    description: 'Automate CI/CD deployment pipelines, container orchestration, and real-time observability.',
    fitPercent: 62,
    matchedSkills: ['Git', 'Linux Basics'],
    missingSkills: ['Docker', 'Kubernetes', 'Terraform', 'Prometheus'],
  },
];

export default function StudentCareerTab({ currentUser, onSelectTab }) {
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);

  const userId = currentUser?.id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    studentAPI.getCareerSuggestions(userId)
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setSuggestions(res);
        }
      })
      .catch((err) => {
        console.warn('Could not load career suggestions from backend, using standard role profiles', err);
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
          <p className="text-sm font-medium">Analyzing career role compatibility...</p>
        </div>
      ) : (
        <div className="career-roles-grid">
          {suggestions.map((role) => {
            const fit = role.fitPercent != null ? role.fitPercent : 75;
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
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  {role.missingSkills && role.missingSkills.length > 0 && (
                    <div className="career-skills-section mt-3">
                      <div className="career-skills-lbl text-amber-600">
                        Missing Skills to Bridge ({role.missingSkills.length})
                      </div>
                      <div className="career-tags-wrap">
                        {role.missingSkills.map((sk) => (
                          <span key={sk} className="career-skill-tag missing">
                            + {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="career-card-action-btn"
                  onClick={() => onSelectTab('roadmap')}
                >
                  <span>Close Gap in Learning Roadmap</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
