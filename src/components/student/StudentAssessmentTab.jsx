import React, { useState, useEffect, useRef } from 'react';
import { assessmentAPI, studentAPI, profileAPI } from '../../services/api';
import { parseSkill, stripSkillTag, formatSkillWithTag, CATEGORY_TAGS } from '@/lib/skillCategories';
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
  'Hibernate': [
    'Entity Lifecycle & States (Transient, Persistent, Detached, Removed)',
    'Association Mappings (@OneToMany, @ManyToOne, @ManyToMany, Cascades)',
    'First-Level Cache (Session) vs Second-Level Cache (RegionFactory)',
    'N+1 Select Problem & Fetch Strategies (JOIN FETCH, BatchSize)',
    'HQL, JPQL & Criteria API Query Optimization',
    'Optimistic Locking (@Version) vs Pessimistic Locking',
    'Transaction Management & Dirty Checking Mechanism',
    'Inheritance Mapping Strategies (Single Table, Joined, Table Per Class)'
  ],
  'Docker': [
    'Dockerfile Multi-Stage Builds & Image Optimization',
    'Container Lifecycle & Docker CLI Commands (run, exec, logs, ps)',
    'Docker Compose & Multi-Container Networking',
    'Volume Persistence & Bind Mount Management',
    'Container Resource Limits, Healthchecks & Security Isolation'
  ],
  'MySQL': [
    'DDL, DML & ACID Transaction Isolation Levels',
    'Complex JOINs (INNER, LEFT, RIGHT, FULL OUTER) & Subqueries',
    'Indexing Strategies (B-Tree, Composite) & EXPLAIN Query Analysis',
    'Aggregate Functions, GROUP BY, HAVING & Window Functions',
    'Foreign Keys, Constraints & Database Normalization (3NF/BCNF)'
  ],
  'JavaScript': [
    'Closures, Lexical Scoping & Execution Context',
    'Asynchronous Programming (Promises, Async/Await, Event Loop)',
    'Prototypes, Inheritance & ES6+ Class Syntax',
    'Array & Object Functional Methods (map, filter, reduce, spread)',
    'DOM Event Bubbling, Capturing & Delegation'
  ],
  'TypeScript': [
    'Type Interfaces, Type Aliases & Union/Intersection Types',
    'Generics & Generic Constraints',
    'Utility Types (Partial, Pick, Omit, Record, Readonly)',
    'Type Narrowing, Type Guards & Discriminated Unions',
    'Strict Mode & Compiler Configuration (tsconfig)'
  ],
  'Node.js': [
    'Event-Driven Architecture & Event Loop Phases',
    'Streams, Buffers & File System Operations',
    'Express Middleware Pipelines & Error Handling',
    'Cluster Module & Worker Threads for CPU Operations',
    'JWT Authentication & Environment Security'
  ],
  'Java': [
    'Object-Oriented Programming (Polymorphism, Inheritance, Interfaces)',
    'Java Collections Framework (List, Set, Map, Queue)',
    'Java 8+ Features (Lambda Expressions, Streams API, Optional)',
    'Multithreading, Concurrency & Thread Synchronization',
    'Exception Handling & JVM Memory Architecture'
  ],
  'Python': [
    'Data Structures & Memory Mutability',
    'List, Dict & Set Comprehensions',
    'Functions, *args, **kwargs & Unpacking',
    'OOP, Dunder Methods & Inheritance',
    'Classmethod vs Staticmethod vs Instance Methods',
    'Generators, Iterators & Yield Memory Semantics',
    'Decorators, Closures & Wrappers',
    'Exception Handling & Context Managers (with)',
    'GIL, Multithreading & Asynchronous IO (asyncio)',
    'Enterprise Packaging, Pytest & Security Best Practices'
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

export const generateTopicQuestions = (skillName, subtopics, count, startIndex = 0) => {
  const cleanName = stripSkillTag(skillName);
  const subs = (subtopics && subtopics.length > 0) ? subtopics : [
    `${cleanName} Core Architectural Principles`,
    `${cleanName} Declarative Configuration & Setup`,
    `${cleanName} Memory, State & Performance Optimization`,
    `${cleanName} Enterprise Security & Exception Handling`,
    `${cleanName} Production Deployment & Fault Tolerance`
  ];

  const templates = [
    {
      formatText: (sub) => `In an enterprise ${cleanName} architecture, what is the industry-standard best practice when configuring and scaling ${sub}?`,
      formatCorrect: (sub) => `Enforce declarative conventions, managed resource pooling, and bounded concurrency for ${sub}`,
      formatDistractors: (sub) => [
        `Use unbuffered synchronous execution without connection pooling or timeouts for ${sub}`,
        `Store mutable state in global shared variables across concurrent requests in ${sub}`,
        `Bypass application layer validation and rely solely on external network firewalls for ${sub}`
      ],
      formatExplanation: (sub) => `In ${cleanName}, declarative configurations combined with managed resource pooling ensure high availability and prevent thread exhaustion for ${sub}.`
    },
    {
      formatText: (sub) => `When diagnosing an unexpected performance degradation or latency spike in ${cleanName} related to ${sub}, which diagnostic approach is most effective?`,
      formatCorrect: (sub) => `Analyze execution profiling metrics, thread contention logs, and resource allocation for ${sub}`,
      formatDistractors: (sub) => [
        `Terminate worker processes indiscriminately and restart the service without telemetry for ${sub}`,
        `Disable all application logging and monitoring agents to reduce I/O overhead in ${sub}`,
        `Roll back security patches and run the process with unrestricted root permissions in ${sub}`
      ],
      formatExplanation: (sub) => `Profiling metrics and monitoring resource utilization pinpoint the exact bottleneck in ${sub} without causing production instability.`
    },
    {
      formatText: (sub) => `How does ${cleanName} prevent race conditions and maintain data consistency when handling concurrent transactions in ${sub}?`,
      formatCorrect: (sub) => `By utilizing optimistic locking with version checking or transactional isolation boundaries in ${sub}`,
      formatDistractors: (sub) => [
        `By disabling multi-core execution and processing all requests through a single thread in ${sub}`,
        `By allowing unsynchronized write operations to execute in arbitrary order in ${sub}`,
        `By silently discarding any transaction that fails to commit within 10 milliseconds in ${sub}`
      ],
      formatExplanation: (sub) => `Optimistic locking and appropriate isolation levels safeguard data consistency for ${sub} in ${cleanName} under heavy concurrent load.`
    },
    {
      formatText: (sub) => `Which configuration strategy provides optimal throughput and resource efficiency for batch or high-volume operations in ${cleanName} (${sub})?`,
      formatCorrect: (sub) => `Implementing chunk-based batching with periodic cache flushing and connection reuse for ${sub}`,
      formatDistractors: (sub) => [
        `Loading all records into unmanaged heap memory simultaneously without pagination in ${sub}`,
        `Continuous tight polling in an unthrottled while(true) loop across ${sub}`,
        `Disabling database indexing and foreign key constraints on target tables for ${sub}`
      ],
      formatExplanation: (sub) => `Chunked processing and periodic cache clearing minimize memory pressure and optimize data communication for ${sub} in ${cleanName}.`
    },
    {
      formatText: (sub) => `What is the critical security requirement when deploying production services utilizing ${cleanName} and implementing ${sub}?`,
      formatCorrect: (sub) => `Applying the principle of least privilege, strict input validation, and externalized secret management for ${sub}`,
      formatDistractors: (sub) => [
        `Hardcoding administrative access tokens directly inside application properties files for ${sub}`,
        `Exposing unauthenticated diagnostic and profiling endpoints to the public Internet for ${sub}`,
        `Permitting arbitrary remote code execution for simplified remote debugging in ${sub}`
      ],
      formatExplanation: (sub) => `Least privilege access and encrypted secret management prevent unauthorized access and credential leakage for ${sub} in ${cleanName}.`
    },
    {
      formatText: (sub) => `When refactoring code to modern enterprise standards in ${cleanName}, what is the primary advantage of modularizing ${sub}?`,
      formatCorrect: (sub) => `Improving testability, separation of concerns, and maintainability across deployment cycles for ${sub}`,
      formatDistractors: (sub) => [
        `Coupling all business logic directly into monolithic controller or presentation classes in ${sub}`,
        `Eliminating the need for unit testing and automated integration verification for ${sub}`,
        `Increasing bytecode size to prevent reverse engineering of proprietary algorithms in ${sub}`
      ],
      formatExplanation: (sub) => `Separation of concerns ensures components implementing ${sub} in ${cleanName} can be independently tested, scaled, and maintained.`
    },
    {
      formatText: (sub) => `In high-throughput environments running ${cleanName}, how should unexpected exceptions within ${sub} be handled to guarantee system resilience?`,
      formatCorrect: (sub) => `Capturing exceptions with structured error logging, circuit breakers, and graceful fallback responses for ${sub}`,
      formatDistractors: (sub) => [
        `Swallowing exceptions with empty catch blocks so client callers never receive errors in ${sub}`,
        `Immediately terminating the host runtime process on any caught exception in ${sub}`,
        `Printing the full system environment variables and passwords to the console output in ${sub}`
      ],
      formatExplanation: (sub) => `Circuit breakers and structured logging maintain service availability while giving operations teams actionable insights into failures for ${sub}.`
    },
    {
      formatText: (sub) => `What role does automated caching play when optimizing query and data access performance in ${cleanName} (${sub})?`,
      formatCorrect: (sub) => `It eliminates redundant round-trips for frequently requested immutable or read-heavy data in ${sub}`,
      formatDistractors: (sub) => [
        `It replaces permanent database persistence with volatile in-memory storage for ${sub}`,
        `It bypasses relational constraints and allows invalid data schemas to be stored in ${sub}`,
        `It forces all database read queries to execute across distributed WAN connections for ${sub}`
      ],
      formatExplanation: (sub) => `Caching avoids expensive repeated operations, drastically cutting latency and reducing host CPU utilization for ${sub} in ${cleanName}.`
    }
  ];

  const generated = [];
  const optionLetters = ['A', 'B', 'C', 'D'];

  for (let i = 0; i < count; i++) {
    const qIndex = startIndex + i;
    const subtopic = subs[qIndex % subs.length];
    const tmpl = templates[qIndex % templates.length];
    
    // Distribute correct answer across A, B, C, D cyclically
    const correctLetter = optionLetters[qIndex % 4];
    const correctText = tmpl.formatCorrect ? tmpl.formatCorrect(subtopic) : tmpl.correct;
    const dists = tmpl.formatDistractors ? tmpl.formatDistractors(subtopic) : (tmpl.distractors || []);
    
    let distCounter = 0;
    const options = {};
    optionLetters.forEach((letter) => {
      if (letter === correctLetter) {
        options[`option${letter}`] = correctText;
      } else {
        options[`option${letter}`] = dists[distCounter % dists.length] || 'Alternative configuration approach';
        distCounter++;
      }
    });

    const explanationText = tmpl.formatExplanation
      ? tmpl.formatExplanation(subtopic)
      : (tmpl.explanation || `In ${cleanName}, standard architectural conventions ensure high availability.`);

    generated.push({
      id: 30000 + qIndex + 1,
      language: cleanName,
      framework: cleanName,
      techType: 'FRAMEWORK',
      topic: subtopic,
      text: `[Scenario ${qIndex + 1}] ` + tmpl.formatText(subtopic),
      optionA: options.optionA,
      optionB: options.optionB,
      optionC: options.optionC,
      optionD: options.optionD,
      correctOption: correctLetter,
      explanation: explanationText,
    });
  }

  return generated;
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

  const [resultData, setResultData] = useState(null);
  const lastEvaluationRef = useRef(null);
  const [isSyncingMatrix, setIsSyncingMatrix] = useState(false);

  // Automatically clear error banners when the user changes skill or track
  useEffect(() => {
    setErrorMsg(null);
  }, [selectedSkill, activeTrack]);

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

  // Persists verified competency and score to MySQL student_skills and user_profile
  const persistAssessmentResultsToDatabase = async (userId, skillName, skillMeta, score, verified, profLevel) => {
    const targetId = userId || 1;
    const cleanSkillName = stripSkillTag(skillName);
    const parsed = parseSkill(cleanSkillName);
    const validCats = ['languages', 'frameworks', 'libraries', 'tools', 'aptitude', 'soft_skills'];
    let targetCategory = parsed.category;
    if (!validCats.includes(targetCategory)) {
      if (skillMeta?.category && validCats.includes(skillMeta.category)) {
        targetCategory = skillMeta.category;
      } else if (skillMeta?.type === 'LANGUAGE') {
        targetCategory = 'languages';
      } else if (skillMeta?.type === 'FRAMEWORK') {
        targetCategory = 'frameworks';
      } else if (skillMeta?.type === 'LIBRARY') {
        targetCategory = 'libraries';
      } else {
        targetCategory = 'tools';
      }
    }
    const categoryTag = CATEGORY_TAGS[targetCategory] || '[TOOL]';

    const verifiedSkillString = verified
      ? `${cleanSkillName} ${categoryTag} (Verified - ${profLevel})`
      : `${cleanSkillName} ${categoryTag} (${profLevel})`;

    const skillObject = {
      name: verifiedSkillString,
      skillName: cleanSkillName,
      category: targetCategory,
      isVerified: verified,
      verifiedFlag: verified,
      proficiencyLevel: profLevel,
      score: score,
      updatedAt: new Date().toISOString(),
    };

    // Store in immediate verified registry cache so UI reflects it immediately
    try {
      const regKey = `talentorbit_verified_skills_${targetId}`;
      const reg = JSON.parse(localStorage.getItem(regKey) || '{}');
      reg[cleanSkillName.toLowerCase()] = {
        skillName: cleanSkillName,
        category: targetCategory,
        isVerified: verified,
        proficiency: profLevel,
        score: score,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(regKey, JSON.stringify(reg));
    } catch (regErr) {
      console.warn('Could not cache verified skill locally:', regErr);
    }

    try {
      const [studRes, userProfRes] = await Promise.allSettled([
        studentAPI.getProfile(targetId),
        profileAPI.getProfile(targetId),
      ]);

      const studData = studRes.status === 'fulfilled' ? studRes.value : null;
      const userProfData = userProfRes.status === 'fulfilled' ? userProfRes.value : null;

      // 1. Prepare studentAPI (student_skills in MySQL) update with deduplication
      const existingStudSkills = Array.isArray(studData?.skills) ? [...studData.skills] : [];
      const seenStudSkills = new Set();
      const updatedStudSkills = [];
      let studSkillUpdated = false;

      existingStudSkills.forEach((sk) => {
        const { cleanName } = parseSkill(sk);
        if (!cleanName) return;
        const key = cleanName.toLowerCase().trim();
        if (seenStudSkills.has(key)) return;
        seenStudSkills.add(key);

        if (key === cleanSkillName.toLowerCase().trim()) {
          studSkillUpdated = true;
          if (typeof sk === 'object' && sk !== null) {
            updatedStudSkills.push({
              ...sk,
              name: verifiedSkillString,
              skillName: cleanSkillName,
              isVerified: verified,
              verifiedFlag: verified,
              proficiencyLevel: profLevel,
              score: score,
            });
          } else {
            updatedStudSkills.push(verifiedSkillString);
          }
        } else {
          updatedStudSkills.push(typeof sk === 'string' ? stripSkillTag(sk) : sk);
        }
      });

      if (!studSkillUpdated) {
        const hasObjects = existingStudSkills.some((s) => typeof s === 'object' && s !== null);
        if (hasObjects) {
          updatedStudSkills.push(skillObject);
        } else {
          updatedStudSkills.push(verifiedSkillString);
        }
      }

      const currentEmpScore = studData?.employabilityScore || 87;
      const newEmpScore = verified ? Math.min(99, Math.max(currentEmpScore, 87) + 3) : currentEmpScore;

      // 2. Prepare user-profile update (user_profile in MySQL) with deduplication
      const existingUserSkills = Array.isArray(userProfData?.skills) ? [...userProfData.skills] : [];
      const seenUserSkills = new Set([cleanSkillName.toLowerCase().trim()]);
      const updatedUserSkills = [verifiedSkillString];

      existingUserSkills.forEach((s) => {
        const { cleanName } = parseSkill(s);
        if (!cleanName) return;
        const key = cleanName.toLowerCase().trim();
        if (!seenUserSkills.has(key)) {
          seenUserSkills.add(key);
          updatedUserSkills.push(typeof s === 'string' ? stripSkillTag(s) : s);
        }
      });

      const categoryKey = targetCategory === 'soft_skills' ? 'soft_skills' : targetCategory;
      const categoryList = Array.isArray(userProfData?.[categoryKey]) ? [...userProfData[categoryKey]] : [];
      const hasInCat = categoryList.some((s) => stripSkillTag(s).toLowerCase().trim() === cleanSkillName.toLowerCase().trim());
      if (!hasInCat) {
        categoryList.push(cleanSkillName);
      }

      const userProfilePayload = {
        skills: updatedUserSkills,
        [categoryKey]: categoryList,
      };

      // 3. Persist to Spring Boot REST APIs
      await Promise.allSettled([
        studentAPI.updateProfile(targetId, {
          skills: updatedStudSkills,
          employabilityScore: newEmpScore,
        }),
        profileAPI.updateProfile(targetId, userProfilePayload),
      ]);

      return { success: true };
    } catch (syncErr) {
      console.warn('Backend database skill verification sync error:', syncErr);
      return { success: false, error: syncErr };
    }
  };

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
          const { cleanName, category } = parseSkill(rawName, forcedCategory);
          if (!cleanName || seenNames.has(cleanName.toLowerCase())) return;
          seenNames.add(cleanName.toLowerCase());
          const lower = cleanName.toLowerCase();

          // 1. Aptitude modules
          if (category === 'aptitude') {
            const item = { id: `apt_${cleanName}`, name: cleanName, type: 'APTITUDE', category: 'aptitude' };
            catMap.aptitude.push(item);
            allList.push(item);
          }
          // 2. Workplace Soft Skills
          else if (category === 'soft_skills') {
            const item = { id: `soft_${cleanName}`, name: cleanName, type: 'SOFT_SKILL', category: 'soft_skills' };
            catMap.soft_skills.push(item);
            allList.push(item);
          }
          // 3. Technical Stack
          else if (category === 'languages' || langMap.has(lower)) {
            const canonical = langMap.get(lower) || cleanName;
            const item = { id: `lang_${canonical}`, name: canonical, type: 'LANGUAGE', category: 'languages' };
            catMap.languages.push(item);
            allList.push(item);
          } else if (category === 'frameworks' || frameworkMap.has(lower)) {
            const canonical = frameworkMap.get(lower) || cleanName;
            const item = { id: `fw_${canonical}`, name: canonical, type: 'FRAMEWORK', category: 'frameworks' };
            catMap.frameworks.push(item);
            allList.push(item);
          } else if (category === 'libraries' || libMap.has(lower)) {
            const canonical = libMap.get(lower) || cleanName;
            const item = { id: `lib_${canonical}`, name: canonical, type: 'LIBRARY', category: 'libraries' };
            catMap.libraries.push(item);
            allList.push(item);
          } else if (category === 'tools' || toolMap.has(lower)) {
            const canonical = toolMap.get(lower) || cleanName;
            const item = { id: `tool_${canonical}`, name: canonical, type: 'TOOL', category: 'tools' };
            catMap.tools.push(item);
            allList.push(item);
          } else {
            const item = { id: `tool_${cleanName}`, name: cleanName, type: 'TOOL', category: 'tools' };
            catMap.tools.push(item);
            allList.push(item);
          }
        };

        // 1. Process user-profile controller skills directly from backend MySQL (NO LOCAL STORAGE)
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
    setTimeLeftSeconds(1200); // 20 minutes for 20 questions

    try {
      let qList = [];

      // Query Spring Boot backend REST API using existing filter endpoints
      try {
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
      } catch (queryErr) {
        console.warn('Backend database question query notice:', queryErr.message);
        qList = [];
      }

      if (!Array.isArray(qList)) {
        qList = [];
      }

      // Normalize any database questions retrieved from the user's MySQL table
      const subtopics = getSubtopicsForSkill(selectedSkill.name);
      const normalizedBase = qList.map((q, idx) => ({
        ...q,
        id: q.id != null ? q.id : idx + 1,
        language: q.language || selectedSkill.name,
        framework: q.framework || (selectedSkill.type === 'FRAMEWORK' ? selectedSkill.name : null),
        techType: q.techType || selectedSkill.type || 'FRAMEWORK',
        topic: q.topic || subtopics[idx % subtopics.length] || `${selectedSkill.name} Core Principles`,
        text: q.text || q.questionText || '',
        optionA: q.optionA || q.option_a || 'Configure standard defaults',
        optionB: q.optionB || q.option_b || 'Enforce declarative configurations and bounded resource pools',
        optionC: q.optionC || q.option_c || 'Execute unmanaged synchronous operations',
        optionD: q.optionD || q.option_d || 'Bypass isolation boundaries and security filters',
        correctOption: (q.correctOption || q.correct_option || 'B').toUpperCase().trim(),
        explanation: q.explanation || `In ${selectedSkill.name}, adhering to design principles ensures optimal reliability and throughput.`,
      }));

      // GUARANTEE: Standardize to exactly 20 questions for EVERY topic
      let finalQuestions = [...normalizedBase];

      if (finalQuestions.length < 20) {
        const needed = 20 - finalQuestions.length;
        try {
          const synthQuestions = generateTopicQuestions(selectedSkill.name, subtopics, needed, finalQuestions.length);
          finalQuestions = [...finalQuestions, ...synthQuestions];
        } catch (synthErr) {
          console.error('Question generation fallback error:', synthErr);
          // Defensive fallback so exam always starts with 20 questions
          for (let k = 0; k < needed; k++) {
            const idx = finalQuestions.length + 1;
            const sub = subtopics[k % subtopics.length] || `${selectedSkill.name} Standard Operation`;
            finalQuestions.push({
              id: 30000 + idx,
              language: selectedSkill.name,
              framework: selectedSkill.name,
              techType: 'FRAMEWORK',
              topic: sub,
              text: `[Scenario ${idx}] In enterprise ${selectedSkill.name}, what is the recommended architecture pattern for ${sub}?`,
              optionA: `Configure declarative resource management and bounded pooling for ${sub}`,
              optionB: `Execute unmanaged synchronous operations without timeouts for ${sub}`,
              optionC: `Bypass input validation and security boundaries for ${sub}`,
              optionD: `Maintain mutable global state across concurrent threads for ${sub}`,
              correctOption: 'A',
              explanation: `Declarative resource management ensures high availability and thread safety for ${sub} in ${selectedSkill.name}.`
            });
          }
        }
      } else if (finalQuestions.length > 20) {
        finalQuestions = finalQuestions.slice(0, 20);
      }

      setQuestions(finalQuestions);
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
      userId: activeUserId || 1,
      studentUserId: activeUserId || 1,
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

      const skillTitle = selectedSkill?.name || evaluation?.skillName || 'Skill';

      // 1. Calculate topic-by-topic diagnostic metrics from actual test questions
      const topicStats = {};
      questions.forEach((q) => {
        const t = q.topic || 'Core Principles';
        if (!topicStats[t]) {
          topicStats[t] = { total: 0, correct: 0 };
        }
        topicStats[t].total++;
        if (answers[q.id] && q.correctOption && answers[q.id] === q.correctOption) {
          topicStats[t].correct++;
        }
      });

      const topicLines = Object.entries(topicStats).map(([topic, stat]) => {
        const pct = Math.round((stat.correct / stat.total) * 100);
        const status = pct >= 70 ? 'Proficient / Strong' : pct >= 40 ? 'Moderate Foundation' : 'Requires Targeted Review';
        return `- **${topic}**: ${pct}% Mastery (${stat.correct}/${stat.total} correct) — *${status}*`;
      }).join('\n');

      const weakTopics = Object.entries(topicStats)
        .filter(([_, stat]) => (stat.correct / stat.total) < 0.7)
        .map(([t]) => t);

      const focusText = weakTopics.length > 0
        ? weakTopics.join(' and ')
        : `advanced architecture and optimization in ${skillTitle}`;

      // 1. Calculate actual empirical score from questions
      let correctAnswersCount = 0;
      questions.forEach((q) => {
        const studentChoice = (answers[q.id] || '').toString().trim().toUpperCase();
        const correctChoice = (q.correctOption || '').toString().trim().toUpperCase();
        if (studentChoice && correctChoice && studentChoice === correctChoice) {
          correctAnswersCount++;
        }
      });
      const empiricalPct = questions.length > 0
        ? Math.round((correctAnswersCount / questions.length) * 100)
        : 0;

      // 2. Ensure the student receives their real empirical score, not a hardcoded 0 from backend fallback
      const backendScore = (evaluation && typeof evaluation.actualScorePercentage === 'number' && evaluation.actualScorePercentage > 0)
        ? evaluation.actualScorePercentage
        : (evaluation && typeof evaluation.score === 'number' && evaluation.score > 0)
        ? evaluation.score
        : empiricalPct;

      const scorePct = Math.max(backendScore, empiricalPct);
      const selfRatingPct = (selfRating || 5) * 10;
      const gapPct = selfRatingPct - scorePct;

      const isVerified = (evaluation && evaluation.isVerified !== undefined && evaluation.actualScorePercentage > 0)
        ? Boolean(evaluation.isVerified)
        : (scorePct >= 70);

      const proficiency = scorePct >= 90
        ? 'ADVANCED'
        : scorePct >= 70
        ? 'INTERMEDIATE'
        : 'BEGINNER';

      // 3. Build or refine targeted action plan specifically for this skill
      let planText = evaluation?.aiExplanationAndActionPlan || '';

      // Detect if backend AI returned a hardcoded Java 21 template for a non-Java skill (e.g. Postman, Docker, MySQL)
      const isJavaContaminated = !skillTitle.toLowerCase().includes('java') && (
        planText.includes('Virtual Threads') ||
        planText.includes('Project Loom') ||
        planText.includes('JVM') ||
        planText.includes('Sealed Classes') ||
        planText.includes('Garbage Collection') ||
        planText.includes('JDK 21') ||
        planText.includes('POJOs')
      );

      // Clean or rebuild authentic diagnostic action plan
      if (!planText || !planText.includes('- **') || isJavaContaminated) {
        planText = `### Diagnostic Gap Analysis for ${skillTitle}

- **Self Perception**: ${selfRatingPct}% | **Empirical Score**: ${scorePct}% | **Net Gap**: ${gapPct > 0 ? `+${gapPct}%` : `${gapPct}%`}

#### Topic Mastery Diagnostic:
${topicLines || `- **Core Competencies**: ${scorePct}% Mastery`}

#### Actionable 5-Step Learning Roadmap for ${skillTitle}:
1. Focus immediately on reviewing ${focusText}.
2. Study core architectural patterns, configuration standards, and best practices in ${skillTitle}.
3. Practice hands-on scenario-based workflows and real-world diagnostics for ${skillTitle}.
4. Retake the TalentOrbit assessment to achieve the 70%+ verified credential benchmark.
5. Build a verified portfolio project demonstrating production-grade mastery of ${skillTitle}.`;
      } else {
        planText = planText
          .replace(/Java 21/gi, skillTitle)
          .replace(/\bJava\b/gi, skillTitle);
      }

      const topicBreakdownObj = {};
      Object.entries(topicStats).forEach(([topic, stat]) => {
        topicBreakdownObj[topic] = Math.round((stat.correct / stat.total) * 100);
      });

      lastEvaluationRef.current = {
        skillTitle,
        selectedSkill,
        scorePct,
        isVerified,
        proficiency,
      };

      await persistAssessmentResultsToDatabase(
        activeUserId,
        skillTitle,
        selectedSkill,
        scorePct,
        isVerified,
        proficiency
      );

      const sanitizedResult = {
        ...evaluation,
        skillName: skillTitle,
        actualScorePercentage: scorePct,
        score: scorePct,
        isVerified: isVerified,
        proficiencyLevel: proficiency,
        confidenceGapPercentage: gapPct,
        aiExplanationAndActionPlan: planText,
        topicBreakdown: evaluation?.topicBreakdown && Object.keys(evaluation.topicBreakdown).length > 0
          ? evaluation.topicBreakdown
          : topicBreakdownObj,
      };

      setResultData(sanitizedResult);
      setStage('RESULTS');
    } catch (err) {
      console.error('Evaluation API error:', err);
      setErrorMsg(err.message || 'Failed to evaluate assessment with backend REST API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewSkillMatrix = async () => {
    setIsSyncingMatrix(true);
    try {
      if (lastEvaluationRef.current) {
        const { skillTitle, selectedSkill, scorePct, isVerified, proficiency } = lastEvaluationRef.current;
        await persistAssessmentResultsToDatabase(
          activeUserId,
          skillTitle,
          selectedSkill,
          scorePct,
          isVerified,
          proficiency
        );
      }
    } catch (err) {
      console.warn('Matrix sync notice:', err);
    } finally {
      setIsSyncingMatrix(false);
      try {
        window.dispatchEvent(new CustomEvent('talentorbit_skill_verified', {
          detail: lastEvaluationRef.current
        }));
      } catch (e) {
        // ignore
      }
      if (onSelectTab) {
        onSelectTab('skills');
      }
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
                <strong>Standardized 20-Question Exam:</strong> Every assessment presents exactly 20 scenario-based questions with a 20-minute timer. Scores &ge; 70% automatically verify your skill in MySQL, award a SHA-256 cryptographic credential, and update your Employability Readiness score.
              </div>
            </div>
          </div>

          <button
            type="button"
            className="assessment-start-btn"
            onClick={handleStartAssessment}
          >
            <Brain size={18} />
            <span>Launch {selectedSkill?.name || 'Skill'} Assessment (20 Questions)</span>
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
                className={`results-metric-val ${(resultData.confidenceGapPercentage || 0) > 15
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
              disabled={isSyncingMatrix}
              onClick={handleViewSkillMatrix}
            >
              {isSyncingMatrix ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Updating Skill Matrix...</span>
                </>
              ) : (
                <>
                  <span>View Updated Skill Matrix</span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
