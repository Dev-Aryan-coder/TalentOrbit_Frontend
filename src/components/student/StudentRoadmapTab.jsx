import React, { useState, useEffect, useMemo } from 'react';
import { roadmapAPI, studentAPI } from '../../services/api';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  Circle,
  Lock,
  ArrowRight,
  Brain,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  Target,
  Zap,
  Clock,
  BookOpen,
  Layers,
  Check,
  Play,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Trophy,
  Compass,
  Filter,
} from 'lucide-react';
import './StudentRoadmapTab.css';

// Fallback milestone syllabus submodules
const DEFAULT_STAGE_SUBTOPICS = {
  'Java 21': [
    'Object-Oriented Architecture & Clean Design Principles',
    'Java Collections Framework & Memory Optimization',
    'Lambdas, Functional Interfaces & Streams API',
    'Multithreading, Locks & Virtual Threads (Project Loom)',
    'JVM Garbage Collection & Performance Profiling',
  ],
  'Spring Boot 3.3': [
    'Spring Core, Dependency Injection & Application Context',
    'REST Controller Design, Request Validation & Exception Handlers',
    'Spring Data JPA, Hibernate ORM & Transaction Management',
    'Spring Security 6 with JWT Bearer Token Filter Chains',
    'Production Observability: Micrometer, Actuator & Logging',
  ],
  'MySQL': [
    'Relational Schema Design & 3NF Normalization Rules',
    'Indexing Strategies: B-Tree, Composite & Covering Indexes',
    'Complex Joins, Subqueries & Window Functions',
    'Transaction Isolation Levels (ACID) & Row-Level Locking',
    'Query Execution Plan Optimization via EXPLAIN ANALYZE',
  ],
  'Docker': [
    'Dockerfile Best Practices & Multi-Stage Builds',
    'Container Lifecycle, Networking & Volume Storage',
    'Docker Compose for Multi-Service Local Environments',
    'Container Security, Non-Root Users & Minimal Images',
    'Image Registry Publishing & CI/CD Pipeline Build Steps',
  ],
  'Kubernetes': [
    'Pod Architecture, ReplicaSets & Declarative Deployments',
    'Cluster Networking, Services (ClusterIP, NodePort) & Ingress',
    'ConfigMaps, Kubernetes Secrets & Environment Variables',
    'Horizontal Pod Autoscaling (HPA) & Health Probes (Liveness/Readiness)',
    'Helm Charts & Production Rolling Release Strategies',
  ],
};

const DEFAULT_ROADMAP_STEPS = [
  {
    id: 1,
    stepOrder: 1,
    title: 'Master Java 21',
    description: 'Core skill module required for Backend Developer (Priority Weight: 5)',
    linkedSkillName: 'Java 21',
    status: 'IN_PROGRESS',
    estimatedHours: 18,
    priority: 'Critical Prerequisite',
  },
  {
    id: 2,
    stepOrder: 2,
    title: 'Master Spring Boot 3.3',
    description: 'Core skill module required for Backend Developer (Priority Weight: 5)',
    linkedSkillName: 'Spring Boot 3.3',
    status: 'LOCKED',
    estimatedHours: 24,
    priority: 'Core Framework',
  },
  {
    id: 3,
    stepOrder: 3,
    title: 'Master MySQL',
    description: 'Core skill module required for Backend Developer (Priority Weight: 4)',
    linkedSkillName: 'MySQL',
    status: 'LOCKED',
    estimatedHours: 14,
    priority: 'Database & ORM',
  },
  {
    id: 4,
    stepOrder: 4,
    title: 'Master Docker',
    description: 'Core skill module required for Backend Developer (Priority Weight: 4)',
    linkedSkillName: 'Docker',
    status: 'LOCKED',
    estimatedHours: 12,
    priority: 'DevOps & Tooling',
  },
  {
    id: 5,
    stepOrder: 5,
    title: 'Master Kubernetes',
    description: 'Core skill module required for Backend Developer (Priority Weight: 3)',
    linkedSkillName: 'Kubernetes',
    status: 'LOCKED',
    estimatedHours: 16,
    priority: 'Cloud Orchestration',
  },
];

export default function StudentRoadmapTab({ currentUser, onSelectTab }) {
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState([]);
  const [targetRole, setTargetRole] = useState('Backend & Cloud Systems Engineer');
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedSyllabus, setExpandedSyllabus] = useState({});
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [notification, setNotification] = useState(null);

  const userId = currentUser?.id || currentUser?.userId;

  // 1. Fetch roadmap steps and target role
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setSteps(DEFAULT_ROADMAP_STEPS);
      return;
    }

    setLoading(true);

    Promise.allSettled([
      roadmapAPI.getSteps(userId),
      studentAPI.getProfile(userId),
    ])
      .then(([stepsRes, profRes]) => {
        if (profRes.status === 'fulfilled' && profRes.value?.targetRole) {
          setTargetRole(profRes.value.targetRole);
        }

        if (stepsRes.status === 'fulfilled' && Array.isArray(stepsRes.value) && stepsRes.value.length > 0) {
          // Normalize steps from backend
          const normalized = stepsRes.value.map((s, idx) => ({
            ...s,
            stepOrder: s.stepOrder || idx + 1,
            estimatedHours: s.estimatedHours || 12 + idx * 3,
            priority: s.priority || (idx === 0 ? 'Critical Prerequisite' : idx === 1 ? 'Core Framework' : 'Production Skill'),
          }));
          setSteps(normalized);
        } else {
          // Fallback to rich benchmark milestones
          setSteps(DEFAULT_ROADMAP_STEPS);
        }
      })
      .catch((err) => {
        console.warn('Roadmap loading notice:', err.message);
        setSteps(DEFAULT_ROADMAP_STEPS);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // 2. Toggle milestone status (DONE <-> IN_PROGRESS)
  const handleToggleDone = async (step) => {
    if (updatingId || step.status === 'LOCKED') return;
    setUpdatingId(step.id);

    const isCurrentlyDone = step.status === 'DONE';
    const nextStatus = isCurrentlyDone ? 'IN_PROGRESS' : 'DONE';

    // Optimistically update local steps and unlock next stage if completing
    setSteps((prevSteps) => {
      const updated = prevSteps.map((s) => {
        if (s.id === step.id) {
          return { ...s, status: nextStatus };
        }
        return s;
      });

      // If marking as DONE, automatically unlock the immediate next stage
      if (!isCurrentlyDone) {
        const currentIndex = updated.findIndex((s) => s.id === step.id);
        if (currentIndex !== -1 && currentIndex + 1 < updated.length) {
          const nextStep = updated[currentIndex + 1];
          if (nextStep.status === 'LOCKED') {
            updated[currentIndex + 1] = { ...nextStep, status: 'IN_PROGRESS' };
          }
        }
      }

      return updated;
    });

    // Provide immediate feedback toast
    if (!isCurrentlyDone) {
      setNotification({
        type: 'success',
        title: 'Milestone Finalized!',
        message: `Stage ${step.stepOrder || ''}: ${step.title} completed! The next milestone has been unlocked.`,
      });
      setTimeout(() => setNotification(null), 4500);
    }

    try {
      if (step.id) {
        await roadmapAPI.updateStepStatus(step.id, nextStatus);
      }
    } catch (err) {
      console.warn('Could not persist status to backend API:', err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleSyllabus = (stepId) => {
    setExpandedSyllabus((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  // Calculations
  const completedCount = steps.filter((s) => s.status === 'DONE').length;
  const inProgressCount = steps.filter((s) => s.status === 'IN_PROGRESS').length;
  const lockedCount = steps.filter((s) => s.status === 'LOCKED').length;
  const totalCount = steps.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const currentActiveStep = steps.find((s) => s.status === 'IN_PROGRESS') || steps[0];

  // Filtering
  const filteredSteps = useMemo(() => {
    if (activeFilter === 'COMPLETED') return steps.filter((s) => s.status === 'DONE');
    if (activeFilter === 'IN_PROGRESS') return steps.filter((s) => s.status === 'IN_PROGRESS');
    if (activeFilter === 'LOCKED') return steps.filter((s) => s.status === 'LOCKED');
    return steps;
  }, [steps, activeFilter]);

  return (
    <div className="student-roadmap-container pb-12">
      {/* 1. Hero Header Area with Glassmorphism */}
      <div className="roadmap-hero-banner">
        <div className="roadmap-hero-text">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="p-1.5 rounded-lg bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
              <Compass size={20} />
            </span>
            <Badge variant="indigo" className="font-semibold text-xs">
              Adaptive Curriculum
            </Badge>
            <Badge variant="emerald" className="gap-1 items-center font-medium text-xs">
              <Target size={12} />
              <span>Target Role: {targetRole}</span>
            </Badge>
          </div>
          <h1 className="roadmap-hero-title">Personalized Milestone Learning Roadmap</h1>
          <p className="roadmap-hero-desc">
            Structured, milestone-driven technical learning path dynamically calibrated to your verified competencies and career objectives.
            Complete stages sequentially to unlock diagnostic credentials and increase placement shortlisting.
          </p>
        </div>

        <div className="roadmap-hero-actions flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectTab && onSelectTab('career')}
            className="gap-1.5 bg-white/80 dark:bg-slate-900/80 shadow-sm"
          >
            <Compass size={14} className="text-indigo-600" />
            <span>Role Fit Analysis</span>
          </Button>
          <Button
            variant="brand"
            size="sm"
            onClick={() => onSelectTab && onSelectTab('assessment')}
            className="gap-1.5 shadow-sm"
          >
            <Brain size={14} />
            <span>Launch Skill Diagnostic</span>
          </Button>
        </div>
      </div>

      {/* Interactive Toast Notification */}
      {notification && (
        <div className="p-4 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 shadow-sm flex items-center justify-between transition-all duration-300">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded-full bg-emerald-600 text-white">
              <Check size={14} />
            </div>
            <div>
              <span className="font-bold text-xs uppercase tracking-wide mr-1.5">{notification.title}</span>
              <span className="text-xs font-medium">{notification.message}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setNotification(null)}
            className="h-7 text-xs hover:bg-transparent"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* 2. Executive Progress Dashboard Card (Shadcn UI Card) */}
      <Card className="border shadow-sm bg-gradient-to-r from-indigo-50/50 via-white to-blue-50/40 dark:from-indigo-950/20 dark:via-slate-900 dark:to-blue-950/20">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  {progressPercent}%
                </span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Milestones Completed
                </span>
                <Badge variant={progressPercent === 100 ? 'emerald' : 'indigo'} className="text-[11px]">
                  {progressPercent === 100 ? 'Curriculum Finalized' : 'Active Progress'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {completedCount} of {totalCount} stages finalized &bull; {inProgressCount} active milestone in sprint
              </p>
            </div>

            {/* Micro KPI Strip */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="px-3 py-1.5 rounded-lg border bg-white dark:bg-slate-900 text-center shadow-2xs">
                <div className="text-xs text-slate-400 uppercase font-bold">Completed</div>
                <div className="text-sm font-bold text-emerald-600">{completedCount} Stages</div>
              </div>
              <div className="px-3 py-1.5 rounded-lg border bg-white dark:bg-slate-900 text-center shadow-2xs">
                <div className="text-xs text-slate-400 uppercase font-bold">In Progress</div>
                <div className="text-sm font-bold text-indigo-600">{inProgressCount} Stage</div>
              </div>
              <div className="px-3 py-1.5 rounded-lg border bg-white dark:bg-slate-900 text-center shadow-2xs">
                <div className="text-xs text-slate-400 uppercase font-bold">Remaining</div>
                <div className="text-sm font-bold text-slate-600 dark:text-slate-300">{lockedCount} Stages</div>
              </div>
              <div className="px-3 py-1.5 rounded-lg border bg-white dark:bg-slate-900 text-center shadow-2xs">
                <div className="text-xs text-slate-400 uppercase font-bold">Employability Boost</div>
                <div className="text-sm font-bold text-purple-600">+{completedCount * 4}%</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <Progress
              value={progressPercent}
              className="h-3 bg-slate-200 dark:bg-slate-800 [&>div]:bg-gradient-to-r [&>div]:from-indigo-600 [&>div]:to-purple-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>Foundation Setup</span>
              <span>Core Frameworks</span>
              <span>Production Readiness</span>
              <span>Placement Ready</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Filter Controls Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter size={13} />
            <span>Filter Stages:</span>
          </span>
          <Button
            variant={activeFilter === 'ALL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('ALL')}
            className="h-8 text-xs px-3"
          >
            All Milestones ({steps.length})
          </Button>
          <Button
            variant={activeFilter === 'IN_PROGRESS' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('IN_PROGRESS')}
            className="h-8 text-xs px-3 gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
            In Progress ({inProgressCount})
          </Button>
          <Button
            variant={activeFilter === 'COMPLETED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('COMPLETED')}
            className="h-8 text-xs px-3 gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Completed ({completedCount})
          </Button>
          <Button
            variant={activeFilter === 'LOCKED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('LOCKED')}
            className="h-8 text-xs px-3 gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
            Upcoming ({lockedCount})
          </Button>
        </div>

        {currentActiveStep && (
          <div className="text-xs text-slate-500 font-medium hidden sm:flex items-center gap-1.5">
            <Zap size={14} className="text-indigo-600 animate-pulse" />
            <span>Current Sprint: </span>
            <strong className="text-slate-800 dark:text-slate-200">
              Stage {currentActiveStep.stepOrder}: {currentActiveStep.title}
            </strong>
          </div>
        )}
      </div>

      {/* 4. Stepper Timeline Milestone List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <RefreshCw size={32} className="animate-spin text-indigo-500 mb-3" />
          <p className="text-sm font-semibold">Calibrating milestone track from database...</p>
        </div>
      ) : filteredSteps.length === 0 ? (
        <Card className="p-10 text-center border-dashed">
          <AlertTriangle size={36} className="text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No Stages Found in Filter</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No milestones match the selected stage filter. Reset to view the complete curriculum.
          </p>
          <Button variant="outline" size="sm" onClick={() => setActiveFilter('ALL')}>
            Show All Milestones
          </Button>
        </Card>
      ) : (
        <div className="roadmap-timeline-wrapper">
          {filteredSteps.map((step, idx) => {
            const isDone = step.status === 'DONE';
            const isInProgress = step.status === 'IN_PROGRESS';
            const isLocked = step.status === 'LOCKED';
            const stepId = step.id || idx + 1;
            const isSyllabusOpen = expandedSyllabus[stepId];

            // Subtopics lookup
            const subtopics =
              DEFAULT_STAGE_SUBTOPICS[step.linkedSkillName] || [
                'Foundational Architecture & Core Syntax',
                'Design Patterns & Industry Implementation Standards',
                'Performance Tuning, Profiling & Security Protocols',
                'Production Deployment & Comprehensive Testing',
              ];

            return (
              <div key={stepId} className="roadmap-timeline-item">
                {/* Visual Timeline Left Pillar */}
                <div className="roadmap-pillar">
                  <div
                    className={`roadmap-node-circle ${
                      isDone
                        ? 'completed'
                        : isInProgress
                        ? 'in-progress'
                        : 'locked'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 size={20} className="text-white" />
                    ) : isInProgress ? (
                      <Play size={16} className="text-white fill-white ml-0.5" />
                    ) : (
                      <Lock size={16} className="text-slate-400" />
                    )}
                  </div>
                  {idx < filteredSteps.length - 1 && (
                    <div
                      className={`roadmap-connector-line ${
                        isDone ? 'completed' : 'pending'
                      }`}
                    />
                  )}
                </div>

                {/* Main Shadcn UI Card for Step */}
                <Card
                  className={`roadmap-step-card flex-1 transition-all duration-200 border ${
                    isInProgress
                      ? 'ring-2 ring-indigo-500/40 border-indigo-300 dark:border-indigo-800 bg-white dark:bg-slate-900 shadow-md'
                      : isDone
                      ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/15 dark:bg-emerald-950/10'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 opacity-80'
                  }`}
                >
                  <CardHeader className="p-5 pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant={isDone ? 'emerald' : isInProgress ? 'indigo' : 'outline'}
                          className="font-bold text-[11px]"
                        >
                          Stage {step.stepOrder || idx + 1}
                        </Badge>
                        {step.linkedSkillName && (
                          <Badge variant="outline" className="font-semibold text-[11px] bg-slate-100 dark:bg-slate-800">
                            {step.linkedSkillName}
                          </Badge>
                        )}
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock size={12} />
                          <span>~{step.estimatedHours || 15} hrs</span>
                        </span>
                        <span className="text-xs font-medium text-slate-400">&bull;</span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {step.priority || 'Core Prerequisite'}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <Badge
                        variant={isDone ? 'emerald' : isInProgress ? 'indigo' : 'outline'}
                        className="text-xs font-bold px-2.5 py-0.5 shrink-0 self-start sm:self-auto"
                      >
                        {isDone ? 'Completed' : isInProgress ? 'In Progress' : 'Locked'}
                      </Badge>
                    </div>

                    <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2">
                      {step.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                      {step.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 space-y-3">
                    {/* Collapsible Curriculum Preview */}
                    <div className="border rounded-lg bg-white/80 dark:bg-slate-950/60 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleSyllabus(stepId)}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <BookOpen size={14} className="text-indigo-600" />
                          <span>Curriculum Syllabus & Covered Subtopics ({subtopics.length} modules)</span>
                        </span>
                        {isSyllabusOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      {isSyllabusOpen && (
                        <div className="p-3.5 pt-2 border-t space-y-2 bg-slate-50/40 dark:bg-slate-900/40">
                          {subtopics.map((sub, sIdx) => (
                            <div key={sIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                              <span className="text-indigo-500 font-bold mt-0.5">•</span>
                              <span>{sub}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>

                  {/* Card Footer Actions */}
                  <CardFooter className="p-5 pt-3 border-t bg-slate-50/50 dark:bg-slate-900/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {isDone ? (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 size={15} />
                          <span>Competency Stage Finalized</span>
                        </div>
                      ) : isInProgress ? (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                          <Zap size={15} />
                          <span>Sprint Milestone Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                          <Lock size={13} />
                          <span>Complete Stage {(step.stepOrder || idx + 1) - 1} to unlock</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Interactive Toggle Button */}
                      {!isLocked ? (
                        <Button
                          variant={isDone ? 'outline' : 'brand'}
                          size="sm"
                          disabled={updatingId === step.id}
                          onClick={() => handleToggleDone(step)}
                          className="text-xs font-semibold gap-1.5"
                        >
                          {isDone ? (
                            <>
                              <RotateCcwIcon />
                              <span>Mark as In Progress</span>
                            </>
                          ) : (
                            <>
                              <Check size={14} />
                              <span>Mark Stage Complete</span>
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={true}
                          className="text-xs font-medium gap-1 text-slate-400 border-dashed"
                        >
                          <Lock size={13} />
                          <span>Prerequisite Locked</span>
                        </Button>
                      )}

                      {/* Launch Diagnostic Assessment for this skill */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectTab && onSelectTab('assessment')}
                        className="text-xs font-semibold gap-1.5 bg-white dark:bg-slate-900"
                      >
                        <Brain size={13} className="text-indigo-600" />
                        <span>Assess Skill</span>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RotateCcwIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
