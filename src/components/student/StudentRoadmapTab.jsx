import React, { useState, useEffect } from 'react';
import { roadmapAPI } from '../../services/api';
import {
  CheckCircle2,
  Circle,
  Lock,
  ArrowRight,
  Brain,
  RefreshCw,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import './StudentRoadmapTab.css';

export default function StudentRoadmapTab({ currentUser, onSelectTab }) {
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  const userId = currentUser?.id || currentUser?.userId;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    roadmapAPI.getSteps(userId)
      .then((res) => {
        if (Array.isArray(res)) {
          setSteps(res);
        }
      })
      .catch((err) => {
        console.warn('Could not load roadmap from database:', err.message);
        setSteps([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleToggleDone = async (step) => {
    if (updatingId || step.status === 'LOCKED') return;
    setUpdatingId(step.id);

    const nextStatus = step.status === 'DONE' ? 'IN_PROGRESS' : 'DONE';

    try {
      await roadmapAPI.updateStepStatus(step.id, nextStatus);
      setSteps((prev) =>
        prev.map((s) => (s.id === step.id ? { ...s, status: nextStatus } : s))
      );
    } catch (err) {
      console.warn('Could not persist roadmap status to backend, updating locally:', err.message);
      setSteps((prev) =>
        prev.map((s) => (s.id === step.id ? { ...s, status: nextStatus } : s))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const completedCount = steps.filter((s) => s.status === 'DONE').length;
  const inProgressCount = steps.filter((s) => s.status === 'IN_PROGRESS').length;
  const totalCount = steps.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="student-roadmap-container">
      <div className="roadmap-header-area">
        <h2 className="roadmap-header-title">Personalized Milestone Learning Roadmap</h2>
        <p className="roadmap-header-desc">
          Structured, milestone-driven technical learning path dynamically generated from your assessed skill gaps and career objectives.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <RefreshCw size={28} className="animate-spin text-indigo-500 mb-3" />
          <p className="text-sm font-medium">Loading roadmap milestones from database...</p>
        </div>
      ) : steps.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <AlertTriangle size={36} className="text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No Learning Milestones Found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
            Your personalized learning roadmap is generated after you complete technical assessments. Evaluate your skills to map out targeted milestone steps.
          </p>
          <button
            type="button"
            className="quiz-primary-btn inline-flex items-center gap-2"
            onClick={() => onSelectTab && onSelectTab('assessment')}
          >
            <Brain size={16} />
            <span>Launch Skill Assessment</span>
          </button>
        </div>
      ) : (
        <>
          {/* Progress Overview */}
          <div className="roadmap-summary-card">
            <div className="roadmap-progress-top">
              <div>
                <span className="roadmap-pct-text">{progressPercent}% Milestones Completed</span>
                <span className="roadmap-count-text">
                  ({completedCount} of {totalCount} stages finalized &bull; {inProgressCount} active)
                </span>
              </div>
              <button
                type="button"
                className="roadmap-assess-btn"
                onClick={() => onSelectTab && onSelectTab('assessment')}
              >
                <Brain size={14} />
                <span>Verify Competency</span>
              </button>
            </div>
            <div className="roadmap-track">
              <div
                className="roadmap-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="roadmap-stepper-list">
            {steps.map((step, idx) => {
              const isDone = step.status === 'DONE';
              const isInProgress = step.status === 'IN_PROGRESS';
              const isLocked = step.status === 'LOCKED';

              return (
                <div
                  key={step.id || idx}
                  className={`roadmap-step-card ${step.status?.toLowerCase()}`}
                >
                  <div className="roadmap-step-left">
                    <button
                      type="button"
                      className={`roadmap-status-btn ${step.status?.toLowerCase()}`}
                      disabled={isLocked || updatingId === step.id}
                      onClick={() => handleToggleDone(step)}
                      title={isLocked ? 'Step is locked' : 'Click to toggle status'}
                    >
                      {isDone ? (
                        <CheckCircle2 size={20} className="text-emerald-500" />
                      ) : isInProgress ? (
                        <Circle size={20} className="text-indigo-500 fill-indigo-100" />
                      ) : (
                        <Lock size={18} className="text-slate-400" />
                      )}
                    </button>

                    <div className="roadmap-step-details">
                      <div className="roadmap-step-num">Stage {step.stepOrder || idx + 1}</div>
                      <h3 className="roadmap-step-title">{step.title}</h3>
                      <p className="roadmap-step-desc">{step.description}</p>
                    </div>
                  </div>

                  <div className="roadmap-step-right">
                    {step.linkedSkillName && (
                      <span className="roadmap-linked-skill">
                        {step.linkedSkillName}
                      </span>
                    )}
                    <span
                      className={`roadmap-badge-status ${step.status?.toLowerCase()}`}
                    >
                      {isDone ? 'Completed' : isInProgress ? 'In Progress' : 'Locked'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
