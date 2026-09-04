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
} from 'lucide-react';
import './StudentRoadmapTab.css';

const DEFAULT_STEPS = [
  {
    id: 1,
    stepOrder: 1,
    title: 'Master Java 21 & OOP Paradigms',
    description: 'Core syntax, collections framework, lambda streams, memory model, and concurrency basics.',
    status: 'DONE',
    linkedSkillName: 'Java',
  },
  {
    id: 2,
    stepOrder: 2,
    title: 'Master Spring Boot & REST APIs',
    description: 'Dependency injection, Spring Data JPA, Hibernate ORM, and secure stateless endpoint architectures.',
    status: 'IN_PROGRESS',
    linkedSkillName: 'Spring Boot',
  },
  {
    id: 3,
    stepOrder: 3,
    title: 'Relational Database Optimization & SQL',
    description: 'Schema indexing, B-Tree lookups, ACID transaction boundaries, and query execution plans.',
    status: 'LOCKED',
    linkedSkillName: 'SQL',
  },
  {
    id: 4,
    stepOrder: 4,
    title: 'Containerization with Docker & Microservices',
    description: 'Multi-stage Dockerfiles, network isolation, compose orchestrations, and container lifecycles.',
    status: 'LOCKED',
    linkedSkillName: 'Docker',
  },
  {
    id: 5,
    stepOrder: 5,
    title: 'Cloud Orchestration & CI/CD Pipelines',
    description: 'Kubernetes Pod deployments, ingress controllers, GitHub Actions automation, and zero-downtime releases.',
    status: 'LOCKED',
    linkedSkillName: 'Kubernetes',
  },
];

export default function StudentRoadmapTab({ currentUser, onSelectTab }) {
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState(DEFAULT_STEPS);
  const [updatingId, setUpdatingId] = useState(null);

  const userId = currentUser?.id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    roadmapAPI.getSteps(userId)
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setSteps(res);
        }
      })
      .catch((err) => {
        console.warn('Could not load roadmap from backend, using standard roadmap milestones', err);
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
      console.warn('Could not persist roadmap status to backend, updating locally', err);
      setSteps((prev) =>
        prev.map((s) => (s.id === step.id ? { ...s, status: nextStatus } : s))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const doneCount = steps.filter((s) => s.status === 'DONE').length;
  const progressPct = steps.length > 0 ? Math.round((doneCount / steps.length) * 100) : 0;

  return (
    <div className="student-roadmap-container">
      {/* Progress Header */}
      <div className="roadmap-progress-header">
        <div>
          <h2 className="roadmap-header-title">Personalized Career Learning Roadmap</h2>
          <p className="roadmap-header-desc">
            Guided competency bridge from fundamental syntax to cloud-scale production deployment.
          </p>
        </div>

        <div className="roadmap-progress-box">
          <div className="roadmap-progress-bar-wrap">
            <div
              className="roadmap-progress-bar-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="roadmap-progress-pct">{progressPct}% Complete</span>
        </div>
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <RefreshCw size={28} className="animate-spin text-indigo-500 mb-3" />
          <p className="text-sm font-medium">Loading milestone curriculum...</p>
        </div>
      ) : (
        <div className="roadmap-timeline">
          {steps.map((step) => {
            const isDone = step.status === 'DONE';
            const isInProgress = step.status === 'IN_PROGRESS';
            const isLocked = step.status === 'LOCKED';

            return (
              <div
                key={step.id}
                className={`roadmap-step-card ${isInProgress ? 'in-progress' : ''}`}
              >
                <div
                  className={`roadmap-step-indicator ${
                    isDone ? 'done' : isInProgress ? 'in-progress' : 'locked'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 size={22} />
                  ) : isInProgress ? (
                    <span>{step.stepOrder}</span>
                  ) : (
                    <Lock size={18} />
                  )}
                </div>

                <div className="roadmap-step-content">
                  <div className="roadmap-step-top">
                    <h3 className="roadmap-step-title">{step.title}</h3>
                    <span
                      className={`roadmap-status-badge ${
                        isDone ? 'done' : isInProgress ? 'in-progress' : 'locked'
                      }`}
                    >
                      {step.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="roadmap-step-desc">{step.description}</p>

                  <div className="roadmap-action-bar">
                    {isInProgress && (
                      <button
                        type="button"
                        className="roadmap-btn-primary"
                        onClick={() => onSelectTab('assessment')}
                      >
                        <Brain size={14} />
                        <span>Verify Competency in Assessment</span>
                      </button>
                    )}

                    {!isLocked && (
                      <button
                        type="button"
                        className="roadmap-btn-outline"
                        onClick={() => handleToggleDone(step)}
                        disabled={updatingId === step.id}
                      >
                        {isDone ? 'Mark as In Progress' : 'Mark Completed'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
