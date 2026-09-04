import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import {
  Code2,
  CheckCircle,
  Clock,
  Plus,
  Brain,
  Layers,
  Wrench,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import './StudentSkillsTab.css';

export default function StudentSkillsTab({ currentUser, onSelectTab, onOpenSkillsModal }) {
  const [loading, setLoading] = useState(true);
  const [profileSkills, setProfileSkills] = useState({
    languages: ['Java', 'Python', 'SQL'],
    libraries: ['React', 'Pandas'],
    frameworks: ['Spring Boot', 'Next.js'],
    tools: ['Docker', 'Git', 'Postman'],
  });
  const [verifiedSet, setVerifiedSet] = useState(new Set(['Java']));

  const userId = currentUser?.id;

  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    studentAPI.getProfile(userId)
      .then((res) => {
        if (res && Array.isArray(res.skills)) {
          const verified = new Set();
          const list = res.skills.map((s) => {
            if (typeof s === 'string') {
              if (s.toLowerCase().includes('verified')) {
                const name = s.split('(')[0].trim();
                verified.add(name);
                return name;
              }
              return s.split('(')[0].trim();
            }
            return s.name;
          });

          setVerifiedSet(verified);
          if (list.length > 0) {
            setProfileSkills((prev) => ({
              ...prev,
              languages: list.slice(0, 3),
              frameworks: list.slice(3, 6),
            }));
          }
        }
      })
      .catch((err) => console.warn('Could not load student profile skills', err))
      .finally(() => setLoading(false));
  }, [userId]);

  const allSkills = [
    ...profileSkills.languages.map((name) => ({ name, category: 'Language' })),
    ...profileSkills.frameworks.map((name) => ({ name, category: 'Framework' })),
    ...profileSkills.libraries.map((name) => ({ name, category: 'Library' })),
    ...profileSkills.tools.map((name) => ({ name, category: 'Tool' })),
  ];

  const totalCount = allSkills.length;
  const verifiedCount = verifiedSet.size;
  const unverifiedCount = totalCount - verifiedCount;

  return (
    <div className="student-skills-container">
      {/* Header */}
      <div className="skills-summary-header">
        <div>
          <h2 className="skills-header-title">Technical Skill Matrix</h2>
          <p className="skills-header-desc">
            Empirically verified competencies, self-reported skills, and technical category breakdowns.
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
                    {isVerified ? 'Proficiency: Advanced' : 'Proficiency: Intermediate'}
                  </span>
                  <button
                    type="button"
                    className="skill-assess-action-btn"
                    onClick={() => onSelectTab('assessment')}
                  >
                    <Brain size={12} />
                    <span>{isVerified ? 'Retake' : 'Verify'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Frameworks Section */}
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
                    {isVerified ? 'Proficiency: Advanced' : 'Proficiency: Intermediate'}
                  </span>
                  <button
                    type="button"
                    className="skill-assess-action-btn"
                    onClick={() => onSelectTab('assessment')}
                  >
                    <Brain size={12} />
                    <span>{isVerified ? 'Retake' : 'Verify'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tools Section */}
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
                    {isVerified ? 'Proficiency: Advanced' : 'Proficiency: Intermediate'}
                  </span>
                  <button
                    type="button"
                    className="skill-assess-action-btn"
                    onClick={() => onSelectTab('assessment')}
                  >
                    <Brain size={12} />
                    <span>{isVerified ? 'Retake' : 'Verify'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
