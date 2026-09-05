import React, { useState, useEffect } from 'react';
import { assessmentAPI, studentAPI, profileAPI } from '../../services/api';
import {
  PRESET_LANGUAGES,
  PRESET_LIBRARIES,
  PRESET_FRAMEWORKS,
  PRESET_TOOLS,
} from '../ui/StudentSkillOnboardingModal';
import {
  Brain,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Award,
  RefreshCw,
  BarChart3,
  ChevronRight,
  PlusCircle,
  ShieldCheck,
  Code2,
  Layers,
  BookOpen,
  Wrench,
  Calculator,
  Users,
  Compass,
  Target,
} from 'lucide-react';
import './StudentAssessmentTab.css';

export const SKILL_SUBTOPICS_MAP = {
  'Spring Boot': [
    'Spring Core & Dependency Injection (@Component, @Autowired)',
    'REST Controller Architecture & HTTP Mappings (@GetMapping, @PostMapping)',
    'Spring Data JPA, Entity Relationships & Hibernate ORM',
    'Spring Security, Filter Chains & JWT Authentication',
    'Application Properties, YAML & Environment Profiles'
  ],
  'Java': [
    'Object-Oriented Programming (Polymorphism, Inheritance, Interfaces)',
    'Java Collections Framework (List, Set, Map, Queue)',
    'Java 8+ Features (Lambda Expressions, Streams API, Optional)',
    'Multithreading, Concurrency & Thread Synchronization',
    'Exception Handling & JVM Memory Architecture'
  ],
  'React': [
    'Functional Components & JSX Syntax',
    'State Management & Core Hooks (useState, useEffect, useMemo)',
    'Component Props, Event Handlers & Controlled Forms',
    'Virtual DOM, Reconciliation & Re-render Optimization',
    'Context API & Custom Reusable Hooks'
  ],
  'Git & GitHub': [
    'Git Core Commands (init, commit, push, pull, status)',
    'Branching Strategies & Branch Merging (git merge, git rebase)',
    'Merge Conflict Resolution & Git Stash / Cherry-Pick',
    'Remote Repositories, Pull Requests & Code Review Etiquette'
  ],
  'Postman': [
    'RESTful Endpoint Testing (GET, POST, PUT, DELETE)',
    'Headers, Bearer Token Auth & Request Payloads (JSON)',
    'Environment Variables & Collection Runners',
    'Automated Test Scripts & Response Status Assertions'
  ],
  'Aptitude - Quantitative & Numerical Ability': [
    'Percentages, Profit & Loss, and Discount Calculations',
    'Ratio, Proportion, and Partnership Mathematics',
    'Time, Speed, Distance, and Relative Velocity',
    'Time, Work, Pipes, and Cisterns',
    'Simple & Compound Interest, and Numerical Estimation'
  ],
  'Aptitude - Data Interpretation & Analytics': [
    'Tabular Data Analysis & Percentage Growth Calculations',
    'Bar Graphs, Multi-Series Charts & Trends',
    'Pie Chart Angle-to-Value Proportional Breakdowns',
    'Comparative Ratios & Business Metric Forecasting'
  ],
  'Aptitude - Logical Deduction & Syllogisms': [
    'Categorical Syllogisms & Venn Diagram Analysis',
    'Logical Deductions, Premise Validity & Inferences',
    'Statement, Assumptions & Course of Action Evaluation'
  ],
  'Aptitude - Pattern Analysis & Series': [
    'Arithmetic, Geometric & Multi-Step Number Sequences',
    'Alphabetical & Alphanumeric Matrix Series',
    'Spatial Transformation & Abstract Matrix Reasoning'
  ],
  'Aptitude - Probability & Combinatorics': [
    'Permutations & Combinations in Arrangement Scenarios',
    'Conditional Probability & Independent Events',
    'Dice, Coin, Card, and Balls Selection Probability'
  ],
  'Soft Skills - Professional Workplace Communication': [
    'Delivering Critical, Constructive & Actionable Feedback',
    'Navigating Cross-Functional Departmental Conflicts',
    'Transparently Communicating Unanticipated Project Delays',
    'Translating Complex Technical Issues for Non-Technical Stakeholders'
  ],
  'Soft Skills - Agile Teamwork & Collaboration': [
    'Managing Scope Creep During Sprint Planning Sessions',
    'De-escalating Disagreements in Daily Stand-Up Meetings',
    'Peer Code Review Etiquette, Constructive Comments & Empathy',
    'Facilitating Retrospectives & Owning Action Items'
  ],
  'Soft Skills - Workplace Conflict Resolution': [
    'De-escalation Under High-Pressure Production Deadlines',
    'Resolving Technical Architecture Disagreements Between Leads',
    'Active Listening & Consensus Building in Cross-Functional Teams'
  ],
  'Soft Skills - Workplace Ethics & Accountability': [
    'Handling Confidential Data, API Secrets & Security Protocols',
    'Blameless Postmortems & Transparent Root-Cause Ownership',
    'Professional Integrity & Ethical Sprint Commitments'
  ],
  'Soft Skills - Adaptability & Critical Thinking': [
    'Rapidly Adapting to Shifting Sprint Scope & Requirements',
    'Root-Cause Analysis & Priority Triage Under Ambiguity',
    'Trade-Off Evaluation Between Technical Debt and Delivery Velocity'
  ]
};

export function getSubtopicsForSkill(skillName) {
  if (!skillName) return [];
  if (SKILL_SUBTOPICS_MAP[skillName]) return SKILL_SUBTOPICS_MAP[skillName];

  for (const [key, subs] of Object.entries(SKILL_SUBTOPICS_MAP)) {
    if (skillName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(skillName.toLowerCase())) {
      return subs;
    }
  }

  return [
    'Core Concepts & Theoretical Principles',
    'Practical Application & Implementation Scenarios',
    'Best Practices & Industry Standards',
    'Troubleshooting, Root Cause Analysis & Optimization'
  ];
}

const APTITUDE_MODULES = [
  { id: 'apt_quant', name: 'Aptitude - Quantitative & Numerical Ability', type: 'APTITUDE', category: 'aptitude', description: 'Percentages, ratios, time & work, financial mathematics' },
  { id: 'apt_data', name: 'Aptitude - Data Interpretation & Analytics', type: 'APTITUDE', category: 'aptitude', description: 'Tabular data analysis, bar charts, growth percentages' },
  { id: 'apt_logic', name: 'Aptitude - Logical Deduction & Syllogisms', type: 'APTITUDE', category: 'aptitude', description: 'Logical sequences, premise-conclusion validity, Venn deductions' },
  { id: 'apt_pattern', name: 'Aptitude - Pattern Analysis & Series', type: 'APTITUDE', category: 'aptitude', description: 'Algorithmic progression, geometric matrices, spatial reasoning' },
  { id: 'apt_prob', name: 'Aptitude - Probability & Combinatorics', type: 'APTITUDE', category: 'aptitude', description: 'Discrete probability, permutation scenarios, statistical distributions' },
];

const SOFT_SKILLS_MODULES = [
  { id: 'soft_comm', name: 'Soft Skills - Professional Workplace Communication', type: 'SOFT_SKILL', category: 'soft_skills', description: 'Executive stakeholder reporting, proactive updates, technical clarity' },
  { id: 'soft_team', name: 'Soft Skills - Agile Teamwork & Collaboration', type: 'SOFT_SKILL', category: 'soft_skills', description: 'Cross-functional sprint coordination, peer code review etiquette' },
  { id: 'soft_conflict', name: 'Soft Skills - Workplace Conflict Resolution', type: 'SOFT_SKILL', category: 'soft_skills', description: 'Consensus building under tight deadlines, de-escalation, empathy' },
  { id: 'soft_ethics', name: 'Soft Skills - Workplace Ethics & Accountability', type: 'SOFT_SKILL', category: 'soft_skills', description: 'Data privacy handling, professional integrity, sprint ownership' },
  { id: 'soft_adapt', name: 'Soft Skills - Adaptability & Critical Thinking', type: 'SOFT_SKILL', category: 'soft_skills', description: 'Handling shifting project requirements, root-cause prioritization' },
];

export default function StudentAssessmentTab({ currentUser, onSelectTab }) {
  const [stage, setStage] = useState('IDLE'); // 'IDLE' | 'LOADING' | 'IN_TEST' | 'RESULTS'
  const [activeTrack, setActiveTrack] = useState('TECHNICAL'); // 'TECHNICAL' | 'APTITUDE' | 'SOFT_SKILLS'
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [activeSection, setActiveSection] = useState('languages'); // 'languages' | 'frameworks' | 'libraries' | 'tools' | 'aptitude' | 'soft_skills'
  const [categorizedSkills, setCategorizedSkills] = useState({
    languages: [],
    frameworks: [],
    libraries: [],
    tools: [],
    aptitude: [],
    soft_skills: [],
  });
  const [availableSkills, setAvailableSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selfRating, setSelfRating] = useState(7); // 1-10 rating for the selected language/framework

  // Questions from Database
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: 'A' | 'B' | 'C' | 'D' }
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(1200); // 20 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Evaluation Results from Backend
  const [resultData, setResultData] = useState(null);

  const activeUserId = currentUser?.id || currentUser?.userId || (() => {
    try {
      const stored = localStorage.getItem('talentorbit_user');
      if (stored) {
        const u = JSON.parse(stored);
        return u?.id || u?.userId;
      }
    } catch {
      // ignore
    }
    return 1;
  })();

  // 1. Fetch real student skills from database and categorize accurately
  useEffect(() => {
    setLoadingSkills(true);

    const langMap = new Map(PRESET_LANGUAGES.map((l) => [l.name.toLowerCase(), l.name]));
    const frameworkMap = new Map(PRESET_FRAMEWORKS.map((f) => [f.name.toLowerCase(), f.name]));
    const libMap = new Map(PRESET_LIBRARIES.map((lib) => [lib.name.toLowerCase(), lib.name]));
    const toolMap = new Map(PRESET_TOOLS.map((t) => [t.name.toLowerCase(), t.name]));

    Promise.allSettled([
      profileAPI.getProfile(activeUserId),
      studentAPI.getProfile(activeUserId),
    ])
      .then(([userProfRes, studentRes]) => {
        const catMap = {
          languages: [],
          frameworks: [],
          libraries: [],
          tools: [],
          aptitude: [],
          soft_skills: [],
        };
        const allList = [];
        const seenNames = new Set();

        const addCategorizedSkill = (rawName, forcedCategory = null) => {
          if (!rawName) return;
          const clean = (typeof rawName === 'string' ? rawName.split('(')[0].trim() : (rawName.name || rawName.skillName || '')).trim();
          if (!clean || seenNames.has(clean.toLowerCase())) return;
          seenNames.add(clean.toLowerCase());
          const lower = clean.toLowerCase();

          // 1. Aptitude modules
          if (forcedCategory === 'aptitude' || lower.includes('aptitude') || lower.includes('quantitative') || lower.includes('numerical') || lower.includes('syllogism') || lower.includes('reasoning')) {
            const item = { id: `apt_${clean}`, name: clean, type: 'APTITUDE', category: 'aptitude' };
            catMap.aptitude.push(item);
            allList.push(item);
          }
          // 2. Workplace Soft Skills
          else if (forcedCategory === 'soft_skills' || lower.includes('soft skill') || lower.includes('communication') || lower.includes('teamwork') || lower.includes('conflict') || lower.includes('workplace') || lower.includes('ethics') || lower.includes('adaptability')) {
            const item = { id: `soft_${clean}`, name: clean, type: 'SOFT_SKILL', category: 'soft_skills' };
            catMap.soft_skills.push(item);
            allList.push(item);
          }
          // 3. Technical Stack
          else if (forcedCategory === 'languages' || langMap.has(lower)) {
            const canonical = langMap.get(lower) || clean;
            const item = { id: `lang_${canonical}`, name: canonical, type: 'LANGUAGE', category: 'languages' };
            catMap.languages.push(item);
            allList.push(item);
          } else if (forcedCategory === 'frameworks' || frameworkMap.has(lower)) {
            const canonical = frameworkMap.get(lower) || clean;
            const item = { id: `fw_${canonical}`, name: canonical, type: 'FRAMEWORK', category: 'frameworks' };
            catMap.frameworks.push(item);
            allList.push(item);
          } else if (forcedCategory === 'libraries' || libMap.has(lower)) {
            const canonical = libMap.get(lower) || clean;
            const item = { id: `lib_${canonical}`, name: canonical, type: 'LIBRARY', category: 'libraries' };
            catMap.libraries.push(item);
            allList.push(item);
          } else if (forcedCategory === 'tools' || toolMap.has(lower)) {
            const canonical = toolMap.get(lower) || clean;
            const item = { id: `tool_${canonical}`, name: canonical, type: 'TOOL', category: 'tools' };
            catMap.tools.push(item);
            allList.push(item);
          } else {
            // Default unrecognized to framework only if not aptitude or soft skills
            const item = { id: `fw_${clean}`, name: clean, type: 'FRAMEWORK', category: 'frameworks' };
            catMap.frameworks.push(item);
            allList.push(item);
          }
        };

        // 1. Process local storage onboarded skills if present
        try {
          const userKey = currentUser?.id || currentUser?.email || activeUserId || 'guest';
          const saved = localStorage.getItem(`talentorbit_skills_onboarded_${userKey}`);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed.languages)) parsed.languages.forEach((s) => addCategorizedSkill(s, 'languages'));
            if (Array.isArray(parsed.frameworks)) parsed.frameworks.forEach((s) => addCategorizedSkill(s, 'frameworks'));
            if (Array.isArray(parsed.libraries)) parsed.libraries.forEach((s) => addCategorizedSkill(s, 'libraries'));
            if (Array.isArray(parsed.tools)) parsed.tools.forEach((s) => addCategorizedSkill(s, 'tools'));
          }
        } catch {
          // ignore
        }

        // 2. Process user-profile controller skills
        if (userProfRes.status === 'fulfilled' && userProfRes.value) {
          const prof = userProfRes.value;
          if (Array.isArray(prof.languages)) prof.languages.forEach((s) => addCategorizedSkill(s, 'languages'));
          if (Array.isArray(prof.frameworks)) prof.frameworks.forEach((s) => addCategorizedSkill(s, 'frameworks'));
          if (Array.isArray(prof.libraries)) prof.libraries.forEach((s) => addCategorizedSkill(s, 'libraries'));
          if (Array.isArray(prof.tools)) prof.tools.forEach((s) => addCategorizedSkill(s, 'tools'));
          if (Array.isArray(prof.skills)) prof.skills.forEach((s) => addCategorizedSkill(s));
        }

        // 3. Process student entity skills from MySQL
        if (studentRes.status === 'fulfilled' && studentRes.value?.skills) {
          const sList = studentRes.value.skills;
          if (Array.isArray(sList)) {
            sList.forEach((s) => addCategorizedSkill(s));
          }
        }

        setCategorizedSkills(catMap);
        setAvailableSkills(allList);

        if (catMap.languages.length > 0) {
          setSelectedSkill(catMap.languages[0]);
          setActiveSection('languages');
        } else if (catMap.frameworks.length > 0) {
          setSelectedSkill(catMap.frameworks[0]);
          setActiveSection('frameworks');
        } else if (catMap.libraries.length > 0) {
          setSelectedSkill(catMap.libraries[0]);
          setActiveSection('libraries');
        } else if (catMap.tools.length > 0) {
          setSelectedSkill(catMap.tools[0]);
          setActiveSection('tools');
        } else if (catMap.aptitude.length > 0) {
          setSelectedSkill(catMap.aptitude[0]);
          setActiveSection('aptitude');
        } else if (catMap.soft_skills.length > 0) {
          setSelectedSkill(catMap.soft_skills[0]);
          setActiveSection('soft_skills');
        } else if (allList.length > 0) {
          setSelectedSkill(allList[0]);
        }
      })
      .catch((err) => {
        console.error('Error fetching real skills for assessment:', err);
      })
      .finally(() => {
        setLoadingSkills(false);
      });
  }, [activeUserId, currentUser]);

  // 2. Countdown timer during test
  useEffect(() => {
    let timer = null;
    if (stage === 'IN_TEST' && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [stage, timeLeftSeconds]);

  // 3. Launch Technical Assessment - Fetch real questions from Backend REST API
  const handleStartAssessment = async () => {
    if (!selectedSkill) return;
    setStage('LOADING');
    setErrorMsg(null);
    setAnswers({});
    setCurrentIndex(0);
    setTimeLeftSeconds(1200); // 20 minutes

    try {
      let qList = [];

      // Query Spring Boot backend REST API for real database questions
      if (
        selectedSkill.type === 'APTITUDE' ||
        selectedSkill.category === 'aptitude' ||
        selectedSkill.type === 'SOFT_SKILL' ||
        selectedSkill.category === 'soft_skills'
      ) {
        qList = await assessmentAPI.getQuestionsByLanguage(selectedSkill.name);
      } else if (selectedSkill.type === 'FRAMEWORK') {
        qList = await assessmentAPI.getQuestionsByFramework(selectedSkill.name);
      } else if (selectedSkill.type === 'LIBRARY') {
        try {
          qList = await assessmentAPI.getQuestionsByFramework(selectedSkill.name);
        } catch {
          qList = await assessmentAPI.getQuestionsByLanguage(selectedSkill.name);
        }
      } else if (selectedSkill.type === 'TOOL') {
        try {
          qList = await assessmentAPI.getQuestionsByTechType('TOOL');
        } catch {
          qList = await assessmentAPI.getQuestionsByLanguage(selectedSkill.name);
        }
      } else {
        qList = await assessmentAPI.getQuestionsByLanguage(selectedSkill.name);
      }

      if (!Array.isArray(qList) || qList.length === 0) {
        throw new Error(
          `No assessment questions found in the backend database for "${selectedSkill.name}". The backend AI question generator will generate and store questions in MySQL on next sync.`
        );
      }

      setQuestions(qList);
      setStage('IN_TEST');
    } catch (err) {
      console.error('Failed to start assessment:', err);
      setErrorMsg(err.message || 'Failed to fetch assessment questions from backend REST API.');
      setStage('IDLE');
    }
  };

  const handleSelectOption = (optionKey) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionKey,
    }));
  };

  // 4. Submit Assessment & Evaluate with Backend AI REST API
  const handleSubmitTest = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    const compiledAnswers = questions.map((q) => ({
      questionId: q.id,
      selectedOption: answers[q.id] || null,
      topic: q.topic,
    }));

    const payload = {
      userId: userId || 1,
      studentUserId: userId || 1,
      skillId: (selectedSkill.id && typeof selectedSkill.id === 'number') ? selectedSkill.id : 1,
      skillName: selectedSkill.name,
      skillType: selectedSkill.type,
      selfRating: selfRating, // 1-10
      selfRatingOutOf10: selfRating,
      answers: compiledAnswers,
      totalQuestions: questions.length,
    };

    try {
      // Send real submission to Spring Boot REST API
      const evaluation = await assessmentAPI.evaluateWithAi(payload);
      setResultData(evaluation);
      setStage('RESULTS');
    } catch (err) {
      console.error('Evaluation API error:', err);
      setErrorMsg(err.message || 'Failed to evaluate assessment with backend REST API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="student-assessment-container">
      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm mb-4">
          {errorMsg}
        </div>
      )}

      {/* STAGE 1: IDLE - Skill Selection & 1 to 10 Rating */}
      {stage === 'IDLE' && (
        <div className="assessment-launch-panel">
          <div className="assessment-launch-header">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-full border border-indigo-200/50">
                SIH Tri-Pillar Evaluation Framework
              </span>
            </div>
            <h2 className="assessment-launch-title">Adaptive AI Multi-Track Skill Assessment</h2>
            <p className="assessment-launch-desc">
              Evaluate empirical capability across Technical Competency, Quantitative Aptitude, and Workplace Soft Skills. Rate your self-confidence to benchmark confidence calibration against AI-evaluated performance.
            </p>
          </div>

          {/* Tri-Pillar Track Selector */}
          <div className="assessment-track-selector">
            <button
              type="button"
              className={`assessment-track-btn ${activeTrack === 'TECHNICAL' ? 'active' : ''}`}
              onClick={() => {
                setActiveTrack('TECHNICAL');
                if (categorizedSkills[activeSection]?.length > 0) {
                  setSelectedSkill(categorizedSkills[activeSection][0]);
                } else if (availableSkills.length > 0) {
                  setSelectedSkill(availableSkills[0]);
                }
              }}
            >
              <div className="track-btn-header">
                <div className="flex items-center gap-2">
                  <Code2 size={18} className="text-indigo-600 dark:text-indigo-400" />
                  <span className="track-btn-title">1. Technical Stack</span>
                </div>
                <span className="track-btn-badge">Core IT</span>
              </div>
              <p className="track-btn-desc">
                Languages, frameworks, libraries, and developer tools configured in your student profile.
              </p>
            </button>

            <button
              type="button"
              className={`assessment-track-btn ${activeTrack === 'APTITUDE' ? 'active' : ''}`}
              onClick={() => {
                setActiveTrack('APTITUDE');
                setSelectedSkill(APTITUDE_MODULES[0]);
              }}
            >
              <div className="track-btn-header">
                <div className="flex items-center gap-2">
                  <Calculator size={18} className="text-indigo-600 dark:text-indigo-400" />
                  <span className="track-btn-title">2. Quantitative Aptitude</span>
                </div>
                <span className="track-btn-badge">Reasoning</span>
              </div>
              <p className="track-btn-desc">
                Numerical problem-solving, data interpretation, pattern sequences, and logical syllogisms.
              </p>
            </button>

            <button
              type="button"
              className={`assessment-track-btn ${activeTrack === 'SOFT_SKILLS' ? 'active' : ''}`}
              onClick={() => {
                setActiveTrack('SOFT_SKILLS');
                setSelectedSkill(SOFT_SKILLS_MODULES[0]);
              }}
            >
              <div className="track-btn-header">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-indigo-600 dark:text-indigo-400" />
                  <span className="track-btn-title">3. Workplace Soft Skills</span>
                </div>
                <span className="track-btn-badge">Professional</span>
              </div>
              <p className="track-btn-desc">
                Situational judgment, executive communication, agile teamwork, and conflict resolution.
              </p>
            </button>
          </div>

          {/* TRACK 1: TECHNICAL SKILLS */}
          {activeTrack === 'TECHNICAL' && (
            loadingSkills ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <RefreshCw size={28} className="animate-spin text-indigo-500 mb-3" />
                <p className="text-sm font-medium">Loading acquired skills from database...</p>
              </div>
            ) : availableSkills.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl mb-6">
                <AlertTriangle size={36} className="text-amber-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No Technical Skills Found in Profile</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
                  You haven't configured any languages, frameworks, libraries, or tools in your profile yet. Please complete onboarding to take a technical assessment.
                </p>
                <button
                  type="button"
                  className="assessment-start-btn inline-flex items-center gap-2"
                  onClick={() => onSelectTab && onSelectTab('skills')}
                >
                  <PlusCircle size={16} />
                  <span>Configure Skills</span>
                </button>
              </div>
            ) : (
              <>
                {/* 6 Category Section Switcher */}
                <div className="mb-2">
                  <label className="assessment-control-label mb-2 block">
                    Select Skill Category
                  </label>
                  <div className="category-tabs-container">
                    <button
                      type="button"
                      className={`category-tab-btn ${activeSection === 'languages' ? 'active' : ''}`}
                      onClick={() => {
                        setActiveSection('languages');
                        if (categorizedSkills.languages.length > 0) setSelectedSkill(categorizedSkills.languages[0]);
                      }}
                    >
                      <Code2 size={16} />
                      <span>Languages</span>
                      <span className="category-count-badge">{categorizedSkills.languages.length}</span>
                    </button>

                    <button
                      type="button"
                      className={`category-tab-btn ${activeSection === 'frameworks' ? 'active' : ''}`}
                      onClick={() => {
                        setActiveSection('frameworks');
                        if (categorizedSkills.frameworks.length > 0) setSelectedSkill(categorizedSkills.frameworks[0]);
                      }}
                    >
                      <Layers size={16} />
                      <span>Frameworks</span>
                      <span className="category-count-badge">{categorizedSkills.frameworks.length}</span>
                    </button>

                    <button
                      type="button"
                      className={`category-tab-btn ${activeSection === 'libraries' ? 'active' : ''}`}
                      onClick={() => {
                        setActiveSection('libraries');
                        if (categorizedSkills.libraries.length > 0) setSelectedSkill(categorizedSkills.libraries[0]);
                      }}
                    >
                      <BookOpen size={16} />
                      <span>Libraries</span>
                      <span className="category-count-badge">{categorizedSkills.libraries.length}</span>
                    </button>

                    <button
                      type="button"
                      className={`category-tab-btn ${activeSection === 'tools' ? 'active' : ''}`}
                      onClick={() => {
                        setActiveSection('tools');
                        if (categorizedSkills.tools.length > 0) setSelectedSkill(categorizedSkills.tools[0]);
                      }}
                    >
                      <Wrench size={16} />
                      <span>Tools</span>
                      <span className="category-count-badge">{categorizedSkills.tools.length}</span>
                    </button>

                    <button
                      type="button"
                      className={`category-tab-btn ${activeSection === 'aptitude' ? 'active' : ''}`}
                      onClick={() => {
                        setActiveSection('aptitude');
                        const aptList = (categorizedSkills.aptitude?.length > 0) ? categorizedSkills.aptitude : APTITUDE_MODULES;
                        if (aptList.length > 0) setSelectedSkill(aptList[0]);
                      }}
                    >
                      <Calculator size={16} />
                      <span>Aptitude & Reasoning</span>
                      <span className="category-count-badge">{categorizedSkills.aptitude?.length || APTITUDE_MODULES.length}</span>
                    </button>

                    <button
                      type="button"
                      className={`category-tab-btn ${activeSection === 'soft_skills' ? 'active' : ''}`}
                      onClick={() => {
                        setActiveSection('soft_skills');
                        const softList = (categorizedSkills.soft_skills?.length > 0) ? categorizedSkills.soft_skills : SOFT_SKILLS_MODULES;
                        if (softList.length > 0) setSelectedSkill(softList[0]);
                      }}
                    >
                      <Users size={16} />
                      <span>Workplace Soft Skills</span>
                      <span className="category-count-badge">{categorizedSkills.soft_skills?.length || SOFT_SKILLS_MODULES.length}</span>
                    </button>
                  </div>
                </div>

                {/* Skills Selection Cards for Active Category */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="assessment-control-label">
                      Select {
                        activeSection === 'libraries' ? 'LIBRARY' : 
                        activeSection === 'languages' ? 'LANGUAGE' : 
                        activeSection === 'frameworks' ? 'FRAMEWORK' : 
                        activeSection === 'tools' ? 'TOOL' : 
                        activeSection === 'aptitude' ? 'APTITUDE MODULE' : 
                        'WORKPLACE SOFT SKILL'
                      } to Test
                    </label>
                    {selectedSkill && (
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        Selected: {selectedSkill.name} ({selectedSkill.type})
                      </span>
                    )}
                  </div>

                  {(() => {
                    let listToRender = categorizedSkills[activeSection] || [];
                    if (activeSection === 'aptitude') {
                      listToRender = (categorizedSkills.aptitude?.length > 0) ? categorizedSkills.aptitude : APTITUDE_MODULES;
                    } else if (activeSection === 'soft_skills') {
                      listToRender = (categorizedSkills.soft_skills?.length > 0) ? categorizedSkills.soft_skills : SOFT_SKILLS_MODULES;
                    }

                    if (listToRender.length === 0) {
                      return (
                        <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl mb-4">
                          <p className="text-xs text-slate-500 mb-2">
                            No {activeSection} configured in your student profile.
                          </p>
                          <button
                            type="button"
                            className="text-xs text-indigo-600 font-semibold underline"
                            onClick={() => onSelectTab && onSelectTab('skills')}
                          >
                            Configure in My Skills
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="skills-selector-grid">
                        {listToRender.map((sk) => {
                          const isSelected = selectedSkill?.name === sk.name;
                          return (
                            <div
                              key={sk.id || sk.name}
                              className={`skill-select-card ${isSelected ? 'active' : ''}`}
                              onClick={() => setSelectedSkill(sk)}
                            >
                              <div className="skill-card-top">
                                <span className="skill-card-type-tag">
                                  {sk.type || (activeSection === 'aptitude' ? 'APTITUDE' : activeSection === 'soft_skills' ? 'SOFT SKILL' : activeSection.toUpperCase())}
                                </span>
                                <div className="skill-card-indicator">
                                  {isSelected && <CheckCircle size={12} />}
                                </div>
                              </div>
                              <div className="skill-card-name">
                                {sk.name.replace('Soft Skills - ', '').replace('Aptitude - ', '')}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </>
            )
          )}

          {/* TRACK 2: QUANTITATIVE APTITUDE */}
          {activeTrack === 'APTITUDE' && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="assessment-control-label">
                  Select Quantitative & Logical Reasoning Module
                </label>
                {selectedSkill && (
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    Selected: {selectedSkill.name}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {APTITUDE_MODULES.map((mod) => {
                  const isSelected = selectedSkill?.id === mod.id;
                  return (
                    <div
                      key={mod.id}
                      className={`module-select-card ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedSkill(mod)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calculator size={16} className="text-indigo-600 dark:text-indigo-400" />
                          <span className="module-card-title">{mod.name.replace('Aptitude - ', '')}</span>
                        </div>
                        <div className="skill-card-indicator">
                          {isSelected && <CheckCircle size={12} />}
                        </div>
                      </div>
                      <p className="module-card-desc">{mod.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TRACK 3: WORKPLACE SOFT SKILLS */}
          {activeTrack === 'SOFT_SKILLS' && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="assessment-control-label">
                  Select Workplace Competency Module
                </label>
                {selectedSkill && (
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    Selected: {selectedSkill.name}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {SOFT_SKILLS_MODULES.map((mod) => {
                  const isSelected = selectedSkill?.id === mod.id;
                  return (
                    <div
                      key={mod.id}
                      className={`module-select-card ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedSkill(mod)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-indigo-600 dark:text-indigo-400" />
                          <span className="module-card-title">{mod.name.replace('Soft Skills - ', '')}</span>
                        </div>
                        <div className="skill-card-indicator">
                          {isSelected && <CheckCircle size={12} />}
                        </div>
                      </div>
                      <p className="module-card-desc">{mod.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interactive Syllabus Subtopics Covered Panel */}
          {selectedSkill && (
            <div className="selected-skill-subtopics-panel animate-fadeIn">
              <div className="subtopics-header">
                <div className="flex items-center gap-2.5">
                  <div className="subtopics-icon-badge">
                    <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="subtopics-heading">
                      Covered Subtopics & Syllabus for {selectedSkill.name}
                    </h4>
                    <p className="subtopics-subtext">
                      The AI adaptive assessment will evaluate your core competencies across these topics:
                    </p>
                  </div>
                </div>
                <span className="subtopics-tag">
                  {selectedSkill.type || 'COMPETENCY'}
                </span>
              </div>

              {/* Subtopics Chips Grid */}
              <div className="subtopics-grid">
                {getSubtopicsForSkill(selectedSkill.name).map((sub, idx) => (
                  <div key={idx} className="subtopic-chip">
                    <div className="subtopic-bullet">
                      <CheckCircle size={13} className="text-emerald-500 flex-shrink-0" />
                    </div>
                    <span className="subtopic-text">{sub}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
              {/* Pre-Assessment 1 to 10 Self Rating */}
              <div className="assessment-control-group mb-6 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60">
                <div className="flex items-center justify-between mb-2">
                  <label className="assessment-control-label">
                    Rate Your Proficiency in {selectedSkill?.name || 'Selected Skill'} (1 to 10 Scale)
                  </label>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                    {selfRating} / 10 ({selfRating * 10}% Confidence)
                  </span>
                </div>

                {/* 10-Button Rating Selector */}
                <div className="rating-buttons-bar mb-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={`rating-num-btn ${selfRating === num ? 'selected' : ''}`}
                      onClick={() => setSelfRating(num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <div className="assessment-slider-wrapper">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={selfRating}
                    onChange={(e) => setSelfRating(Number(e.target.value))}
                    className="assessment-slider"
                  />
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  {selfRating <= 2
                    ? 'Novice (10-20% expected mastery)'
                    : selfRating <= 4
                    ? 'Beginner (30-40% expected mastery)'
                    : selfRating <= 6
                    ? 'Intermediate (50-60% expected mastery)'
                    : selfRating <= 8
                    ? 'Proficient (70-80% expected mastery)'
                    : 'Expert / Mastery (90-100% expected mastery)'}
                </div>
              </div>

              <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-xl mb-6">
                <div className="flex items-start gap-3">
                  <Sparkles size={18} className="text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                  <div className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
                    <strong>Empirical Evaluation:</strong> Questions are retrieved live from the backend database repository. Scores $\ge 70\%$ automatically verify your skill in MySQL, award a SHA-256 cryptographic credential, and update your Employability Readiness score.
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="assessment-start-btn"
                onClick={handleStartAssessment}
              >
                <Brain size={18} />
                <span>Launch {selectedSkill?.name || 'Skill'} Assessment</span>
              </button>
        </div>
      )}

      {/* STAGE 2: LOADING */}
      {stage === 'LOADING' && (
        <div className="assessment-launch-panel text-center py-16">
          <RefreshCw size={36} className="animate-spin text-indigo-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Fetching Assessment Questions from Backend Database for {selectedSkill?.name}...
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Querying Spring Boot REST API for technical scenarios and test questions.
          </p>
        </div>
      )}

      {/* STAGE 3: ACTIVE TEST */}
      {stage === 'IN_TEST' && currentQ && (
        <div className="assessment-quiz-layout">
          {/* Main Question Card */}
          <div className="assessment-card-main">
            <div className="quiz-progress-header">
              <div className="quiz-info-left">
                <div className="quiz-badge-count">
                  {currentIndex + 1}/{questions.length}
                </div>
                <div>
                  <div className="quiz-title-main">{selectedSkill?.name} Competency Assessment</div>
                  <div className="quiz-subtitle">
                    Question {currentIndex + 1} of {questions.length} &bull; Self-Rating: {selfRating}/10
                  </div>
                </div>
              </div>

              <div className="quiz-timer-pill">
                <Clock size={16} />
                <span>{formatTimer(timeLeftSeconds)}</span>
              </div>
            </div>

            <div className="question-topic-tag">{currentQ.topic || 'Core Concept'}</div>
            <h3 className="question-text-heading">{currentQ.text || currentQ.questionText}</h3>

            {/* Options */}
            <div className="mcq-options-container">
              {[
                { key: 'A', text: currentQ.optionA },
                { key: 'B', text: currentQ.optionB },
                { key: 'C', text: currentQ.optionC },
                { key: 'D', text: currentQ.optionD },
              ].map(({ key, text }) => {
                if (!text) return null;
                const isSelected = answers[currentQ.id] === key;

                return (
                  <div
                    key={key}
                    className={`mcq-option-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectOption(key)}
                  >
                    <div className="mcq-option-pill">{key}</div>
                    <div className="mcq-option-label">{text}</div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Footer */}
            <div className="quiz-nav-footer">
              <button
                type="button"
                className="quiz-secondary-btn"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              >
                <ArrowLeft size={16} />
                <span>Previous</span>
              </button>

              <div className="text-xs text-slate-500 font-medium">
                {answeredCount} of {questions.length} Answered
              </div>

              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  className="quiz-primary-btn"
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                >
                  <span>Next Question</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  className="quiz-primary-btn submit"
                  onClick={handleSubmitTest}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Evaluating...' : 'Submit Assessment'}
                  <CheckCircle size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Right Sidebar Navigator with Question Pills */}
          <div className="quiz-sidebar-panel">
            <div className="quiz-sidebar-title">
              <BarChart3 size={16} className="text-indigo-500" />
              <span>Question Navigator ({questions.length})</span>
            </div>

            <div className="quiz-question-pills-20">
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] != null;
                const isActive = idx === currentIndex;

                return (
                  <button
                    key={q.id || idx}
                    type="button"
                    className={`quiz-q-num-btn ${isActive ? 'active' : ''} ${isAnswered ? 'answered' : ''}`}
                    onClick={() => setCurrentIndex(idx)}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-slate-500 mt-1 border-t pt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span>Completed:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{answeredCount}/{questions.length}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${questions.length > 0 ? (answeredCount / questions.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {answeredCount >= 1 && (
              <button
                type="button"
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg mt-2 flex items-center justify-center gap-1.5 transition-colors"
                onClick={handleSubmitTest}
                disabled={isSubmitting}
              >
                <CheckCircle size={14} />
                <span>Submit Assessment Now</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* STAGE 4: EVALUATION RESULTS FROM BACKEND */}
      {stage === 'RESULTS' && resultData && (
        <div className="assessment-results-panel">
          <div className="results-hero-header">
            <div className={`results-icon-badge ${resultData.isVerified ? 'pass' : 'review'}`}>
              {resultData.isVerified ? <Award size={32} /> : <AlertTriangle size={32} />}
            </div>
            <h2 className="results-title">
              {resultData.isVerified
                ? `${resultData.skillName} Competency Verified`
                : `${resultData.skillName} Diagnostic Completed`}
            </h2>
            <p className="results-subtitle">
              {resultData.isVerified
                ? 'Empirical score met the platform verified threshold. Cryptographic badge awarded.'
                : 'Diagnostic completed. Targeted action plan generated from backend evaluation.'}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="results-metrics-grid">
            <div className="results-metric-card">
              <div className="results-metric-lbl">Empirical Score</div>
              <div className="results-metric-val emerald">{resultData.actualScorePercentage ?? resultData.score ?? 0}%</div>
            </div>

            <div className="results-metric-card">
              <div className="results-metric-lbl">Pre-Test Self-Rating</div>
              <div className="results-metric-val indigo">
                {resultData.selfRatingOutOf10 || selfRating}/10 ({resultData.selfRatingPercentage || selfRating * 10}%)
              </div>
            </div>

            <div className="results-metric-card">
              <div className="results-metric-lbl">AI Confidence Gap</div>
              <div
                className={`results-metric-val ${
                  (resultData.confidenceGapPercentage || 0) > 15
                    ? 'red'
                    : (resultData.confidenceGapPercentage || 0) < -10
                    ? 'emerald'
                    : 'indigo'
                }`}
              >
                {(resultData.confidenceGapPercentage || 0) > 0 ? `+${resultData.confidenceGapPercentage}%` : `${resultData.confidenceGapPercentage || 0}%`}
              </div>
            </div>
          </div>

          {/* Verified Badge Award Card */}
          {resultData.isVerified && (
            <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck size={28} className="text-emerald-600" />
                <div>
                  <div className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Verified Credential: {resultData.skillName} Competency
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-400">
                    Hash: {resultData.verificationHash || resultData.badgeHash || 'AUTHENTIC-SEAL-RECORDED'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab && onSelectTab('achievements')}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                View Badges
              </button>
            </div>
          )}

          {/* AI Explanation & Action Plan */}
          {resultData.aiExplanationAndActionPlan && (
            <div className="results-action-card">
              <div className="results-action-title">
                <Sparkles size={18} className="text-indigo-600" />
                <span>AI Confidence Gap Diagnostics & Action Plan</span>
              </div>
              <p className="results-action-text">{resultData.aiExplanationAndActionPlan}</p>
            </div>
          )}

          {/* Topic Breakdown */}
          {resultData.topicBreakdown && (
            <div className="results-topics-card">
              <div className="results-action-title">
                <BarChart3 size={18} className="text-indigo-600" />
                <span>Competency Breakdown by Topic</span>
              </div>
              <div className="results-topics-grid">
                {Object.entries(resultData.topicBreakdown).map(([topic, pct]) => (
                  <div key={topic} className="topic-bar-row">
                    <div className="topic-bar-header">
                      <span className="topic-bar-name">{topic}</span>
                      <span className="topic-bar-val">{pct}%</span>
                    </div>
                    <div className="topic-track">
                      <div
                        className="topic-fill"
                        style={{ width: `${pct}%`, background: pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="results-footer-actions">
            <button
              type="button"
              className="quiz-secondary-btn"
              onClick={() => {
                setStage('IDLE');
                setResultData(null);
                setQuestions([]);
              }}
            >
              <span>Test Another Skill</span>
            </button>

            <button
              type="button"
              className="quiz-primary-btn"
              onClick={() => onSelectTab && onSelectTab('skills')}
            >
              <span>View Updated Skill Matrix</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
