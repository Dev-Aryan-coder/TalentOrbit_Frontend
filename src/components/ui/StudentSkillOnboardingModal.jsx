import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { studentAPI, profileAPI } from '@/services/api';
import {
  parseSkill,
  formatSkillWithTag,
  stripSkillTag,
  KNOWN_LANGUAGES,
  KNOWN_LIBRARIES,
  KNOWN_FRAMEWORKS,
  KNOWN_TOOLS,
} from '@/lib/skillCategories';
import './StudentSkillOnboardingModal.css';

export const PRESET_LANGUAGES = [
  { id: 'Python', name: 'Python', category: 'OOP & Data Science', acronym: 'PY' },
  { id: 'Java', name: 'Java', category: 'Enterprise & Backend', acronym: 'JV' },
  { id: 'JavaScript', name: 'JavaScript', category: 'Web & Fullstack', acronym: 'JS' },
  { id: 'TypeScript', name: 'TypeScript', category: 'Typed Web Apps', acronym: 'TS' },
  { id: 'C++', name: 'C++', category: 'Performance & Systems', acronym: 'C++' },
  { id: 'C', name: 'C', category: 'Low-Level Systems', acronym: 'C' },
  { id: 'C#', name: 'C#', category: '.NET & Enterprise', acronym: 'C#' },
  { id: 'Go', name: 'Go (Golang)', category: 'Cloud & Distributed', acronym: 'GO' },
  { id: 'Rust', name: 'Rust', category: 'Safe Memory Systems', acronym: 'RS' },
  { id: 'SQL', name: 'SQL', category: 'Relational Databases', acronym: 'SQL' },
  { id: 'Kotlin', name: 'Kotlin', category: 'Modern Android & JVM', acronym: 'KT' },
  { id: 'Swift', name: 'Swift', category: 'iOS & macOS Apps', acronym: 'SW' },
  { id: 'PHP', name: 'PHP', category: 'Web & Scripting', acronym: 'PHP' },
  { id: 'Dart', name: 'Dart', category: 'Flutter Mobile Apps', acronym: 'DT' },
  { id: 'HTML/CSS', name: 'HTML5 & CSS3', category: 'Responsive Markup', acronym: 'UI' },
  { id: 'Ruby', name: 'Ruby', category: 'Dynamic Scripting', acronym: 'RB' },
];

export const PRESET_LIBRARIES = [
  { id: 'React', name: 'React', category: 'Component UI Library', acronym: 'RC' },
  { id: 'Recharts', name: 'Recharts', category: 'Data Visualization Charts', acronym: 'CH' },
  { id: 'Redux', name: 'Redux / Zustand', category: 'State Management', acronym: 'RD' },
  { id: 'Axios', name: 'Axios', category: 'REST API & HTTP Client', acronym: 'AX' },
  { id: 'Tailwind CSS', name: 'Tailwind CSS', category: 'Utility-First Styling', acronym: 'TW' },
  { id: 'Pandas', name: 'Pandas', category: 'Data Analysis & Manipulation', acronym: 'PD' },
  { id: 'NumPy', name: 'NumPy', category: 'Numerical Computing', acronym: 'NP' },
  { id: 'Scikit-Learn', name: 'Scikit-Learn', category: 'Machine Learning Models', acronym: 'SK' },
  { id: 'PyTorch', name: 'PyTorch', category: 'Deep Learning & Neural Nets', acronym: 'PT' },
  { id: 'TensorFlow', name: 'TensorFlow', category: 'AI & Machine Learning', acronym: 'TF' },
  { id: 'Lucide', name: 'Lucide Icons', category: 'Vector Iconography', acronym: 'LC' },
  { id: 'Hibernate', name: 'Hibernate / JPA', category: 'Java ORM & Data Mapping', acronym: 'HB' },
  { id: 'GraphQL Client', name: 'GraphQL Client', category: 'Schema Querying', acronym: 'GQL' },
  { id: 'Lodash', name: 'Lodash', category: 'JavaScript Utilities', acronym: 'LD' },
  { id: 'RxJS', name: 'RxJS', category: 'Reactive Programming', acronym: 'RX' },
  { id: 'Jest', name: 'Jest / Testing Library', category: 'Automated Unit Tests', acronym: 'JT' },
];

export const PRESET_FRAMEWORKS = [
  { id: 'Spring Boot', name: 'Spring Boot', category: 'Enterprise Java Microservices', acronym: 'SB' },
  { id: 'Django', name: 'Django', category: 'High-Level Python Fullstack', acronym: 'DJ' },
  { id: 'Express.js', name: 'Express.js', category: 'Node.js REST API Framework', acronym: 'EX' },
  { id: 'Next.js', name: 'Next.js', category: 'React Server Side Rendering', acronym: 'NX' },
  { id: 'FastAPI', name: 'FastAPI', category: 'Modern Asynchronous Python', acronym: 'FA' },
  { id: 'Angular', name: 'Angular', category: 'Enterprise TypeScript Framework', acronym: 'NG' },
  { id: 'Vue.js', name: 'Vue.js', category: 'Progressive JavaScript Framework', acronym: 'VU' },
  { id: 'NestJS', name: 'NestJS', category: 'Scalable Enterprise Node.js', acronym: 'NT' },
  { id: 'Flask', name: 'Flask', category: 'Lightweight Python Microframework', acronym: 'FL' },
  { id: 'ASP.NET Core', name: 'ASP.NET Core', category: 'Cross-Platform Microsoft .NET', acronym: 'NET' },
  { id: 'Flutter', name: 'Flutter', category: 'Cross-Platform Mobile & Web', acronym: 'FL' },
  { id: 'React Native', name: 'React Native', category: 'Native iOS & Android Apps', acronym: 'RN' },
  { id: 'SvelteKit', name: 'SvelteKit', category: 'Cybernetically Enhanced Web', acronym: 'SV' },
  { id: 'Laravel', name: 'Laravel', category: 'Elegant PHP Web MVC', acronym: 'LV' },
  { id: 'Ruby on Rails', name: 'Ruby on Rails', category: 'Convention over Configuration', acronym: 'RR' },
  { id: 'Remix', name: 'Remix', category: 'Edge-Ready Web Framework', acronym: 'RX' },
];

export const PRESET_TOOLS = [
  { id: 'Git & GitHub', name: 'Git & GitHub', category: 'Version Control & VCS', acronym: 'GIT' },
  { id: 'Docker', name: 'Docker', category: 'App Containerization', acronym: 'DK' },
  { id: 'Kubernetes', name: 'Kubernetes', category: 'Container Orchestration', acronym: 'K8' },
  { id: 'Postman', name: 'Postman', category: 'API Testing & Documentation', acronym: 'PM' },
  { id: 'Linux / Bash', name: 'Linux / Bash', category: 'OS & Terminal Shell', acronym: 'LX' },
  { id: 'AWS', name: 'AWS Cloud', category: 'Cloud Infrastructure & EC2', acronym: 'AWS' },
  { id: 'Maven / Gradle', name: 'Maven / Gradle', category: 'Build Automation & Dependencies', acronym: 'MV' },
  { id: 'Jenkins', name: 'Jenkins', category: 'CI/CD Pipeline Automation', acronym: 'JK' },
  { id: 'VS Code', name: 'VS Code', category: 'Developer IDE & Tooling', acronym: 'VSC' },
  { id: 'Figma', name: 'Figma', category: 'UI/UX Product Design', acronym: 'FG' },
  { id: 'MySQL', name: 'MySQL Workbench', category: 'Relational Database Tool', acronym: 'SQL' },
  { id: 'PostgreSQL', name: 'PostgreSQL', category: 'Advanced Open Source Database', acronym: 'PG' },
  { id: 'MongoDB', name: 'MongoDB Compass', category: 'NoSQL Document Store', acronym: 'MG' },
  { id: 'Vite', name: 'Vite', category: 'Next-Gen Frontend Bundler', acronym: 'VT' },
  { id: 'Redis', name: 'Redis', category: 'In-Memory Cache & Key-Value', acronym: 'RD' },
  { id: 'Google Cloud', name: 'Google Cloud (GCP)', category: 'Cloud Platform Services', acronym: 'GCP' },
];

export default function StudentSkillOnboardingModal({
  isOpen,
  onClose,
  currentUser,
  onComplete,
}) {
  const [currentStep, setCurrentStep] = useState(1); // 1: Languages, 2: Libraries, 3: Frameworks, 4: Tools
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedLibraries, setSelectedLibraries] = useState([]);
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);

  // Custom skills dynamically created by user (persisted to database)
  const [customLanguages, setCustomLanguages] = useState([]);
  const [customLibraries, setCustomLibraries] = useState([]);
  const [customFrameworks, setCustomFrameworks] = useState([]);
  const [customTools, setCustomTools] = useState([]);

  const userId = currentUser?.id || currentUser?.userId || 1;

  // Helper to build skill item card
  const makeCustomSkillCard = (name, categoryName) => {
    const cleanName = stripSkillTag(name);
    const words = cleanName.split(/\s+/);
    const acronym = words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : cleanName.substring(0, 2).toUpperCase() || 'SK';
    return {
      id: cleanName,
      name: cleanName,
      category: categoryName || 'Custom Skill',
      acronym,
      isCustom: true,
    };
  };

  // Load existing saved skills strictly from MySQL database via backend REST API (NO LOCAL STORAGE)
  useEffect(() => {
    if (!userId || !isOpen) return;

    profileAPI.getProfile(userId)
      .then((prof) => {
        if (!prof) return;

        const langMap = new Map(PRESET_LANGUAGES.map((l) => [l.name.toLowerCase(), l.name]));
        const frameworkMap = new Map(PRESET_FRAMEWORKS.map((f) => [f.name.toLowerCase(), f.name]));
        const libMap = new Map(PRESET_LIBRARIES.map((lib) => [lib.name.toLowerCase(), lib.name]));
        const toolMap = new Map(PRESET_TOOLS.map((t) => [t.name.toLowerCase(), t.name]));

        const langs = new Set();
        const libs = new Set();
        const fws = new Set();
        const tls = new Set();

        const customLangs = [];
        const customLibs = [];
        const customFws = [];
        const customTls = [];

        // Parse structured category arrays returned by backend
        if (Array.isArray(prof.languages)) {
          prof.languages.forEach((s) => {
            const { cleanName } = parseSkill(s, 'languages');
            if (!cleanName) return;
            langs.add(cleanName);
            if (!langMap.has(cleanName.toLowerCase())) {
              customLangs.push(makeCustomSkillCard(cleanName, 'Custom Programming Language'));
            }
          });
        }
        if (Array.isArray(prof.libraries)) {
          prof.libraries.forEach((s) => {
            const { cleanName } = parseSkill(s, 'libraries');
            if (!cleanName) return;
            libs.add(cleanName);
            if (!libMap.has(cleanName.toLowerCase())) {
              customLibs.push(makeCustomSkillCard(cleanName, 'Custom Developer Library'));
            }
          });
        }
        if (Array.isArray(prof.frameworks)) {
          prof.frameworks.forEach((s) => {
            const { cleanName } = parseSkill(s, 'frameworks');
            if (!cleanName) return;
            fws.add(cleanName);
            if (!frameworkMap.has(cleanName.toLowerCase())) {
              customFws.push(makeCustomSkillCard(cleanName, 'Custom Application Framework'));
            }
          });
        }
        if (Array.isArray(prof.tools)) {
          prof.tools.forEach((s) => {
            const { cleanName } = parseSkill(s, 'tools');
            if (!cleanName) return;
            tls.add(cleanName);
            if (!toolMap.has(cleanName.toLowerCase())) {
              customTls.push(makeCustomSkillCard(cleanName, 'Custom Tool & Environment'));
            }
          });
        }

        // Also check prof.skills list from backend MySQL (student_skills / user_profile_skills)
        if (Array.isArray(prof.skills) && prof.skills.length > 0) {
          prof.skills.forEach((s) => {
            const { cleanName, category } = parseSkill(s);
            if (!cleanName) return;
            const lower = cleanName.toLowerCase();

            if (category === 'languages' || langMap.has(lower)) {
              const name = langMap.get(lower) || cleanName;
              langs.add(name);
              if (!langMap.has(lower) && !customLangs.some((c) => c.id.toLowerCase() === lower)) {
                customLangs.push(makeCustomSkillCard(name, 'Custom Programming Language'));
              }
            } else if (category === 'libraries' || libMap.has(lower)) {
              const name = libMap.get(lower) || cleanName;
              libs.add(name);
              if (!libMap.has(lower) && !customLibs.some((c) => c.id.toLowerCase() === lower)) {
                customLibs.push(makeCustomSkillCard(name, 'Custom Developer Library'));
              }
            } else if (category === 'frameworks' || frameworkMap.has(lower)) {
              const name = frameworkMap.get(lower) || cleanName;
              fws.add(name);
              if (!frameworkMap.has(lower) && !customFws.some((c) => c.id.toLowerCase() === lower)) {
                customFws.push(makeCustomSkillCard(name, 'Custom Application Framework'));
              }
            } else if (category === 'tools' || toolMap.has(lower)) {
              const name = toolMap.get(lower) || cleanName;
              tls.add(name);
              if (!toolMap.has(lower) && !customTls.some((c) => c.id.toLowerCase() === lower)) {
                customTls.push(makeCustomSkillCard(name, 'Custom Tool & Environment'));
              }
            }
          });
        }

        if (langs.size > 0) setSelectedLanguages(Array.from(langs));
        if (fws.size > 0) setSelectedFrameworks(Array.from(fws));
        if (libs.size > 0) setSelectedLibraries(Array.from(libs));
        if (tls.size > 0) setSelectedTools(Array.from(tls));

        if (customLangs.length > 0) {
          setCustomLanguages((prev) => {
            const existingIds = new Set(prev.map((p) => p.id.toLowerCase()));
            return [...prev, ...customLangs.filter((c) => !existingIds.has(c.id.toLowerCase()))];
          });
        }
        if (customLibs.length > 0) {
          setCustomLibraries((prev) => {
            const existingIds = new Set(prev.map((p) => p.id.toLowerCase()));
            return [...prev, ...customLibs.filter((c) => !existingIds.has(c.id.toLowerCase()))];
          });
        }
        if (customFws.length > 0) {
          setCustomFrameworks((prev) => {
            const existingIds = new Set(prev.map((p) => p.id.toLowerCase()));
            return [...prev, ...customFws.filter((c) => !existingIds.has(c.id.toLowerCase()))];
          });
        }
        if (customTls.length > 0) {
          setCustomTools((prev) => {
            const existingIds = new Set(prev.map((p) => p.id.toLowerCase()));
            return [...prev, ...customTls.filter((c) => !existingIds.has(c.id.toLowerCase()))];
          });
        }
      })
      .catch((err) => {
        console.warn('Could not pre-load user skills from database:', err.message);
      });
  }, [userId, isOpen]);

  const [searchQuery, setSearchQuery] = useState('');
  const [customInput, setCustomInput] = useState('');

  // REST API status states
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingCustom, setIsSavingCustom] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState(false);

  // Toggle selection for any tech item
  const toggleItem = (list, setList, itemName) => {
    if (list.includes(itemName)) {
      setList(list.filter((name) => name !== itemName));
    } else {
      setList([...list, itemName]);
    }
  };

  // Step Metadata
  const getStepMeta = () => {
    switch (currentStep) {
      case 1:
        return {
          stepNum: '1 of 4',
          title: 'Languages You Like & Know',
          desc: 'Select the programming and query languages you work with. Multiple selection can be done from the boxes using the radio selectors.',
          count: selectedLanguages.length,
          btnLabel: 'Confirm & Continue',
        };
      case 2:
        return {
          stepNum: '2 of 4',
          title: 'Libraries You Know',
          desc: 'Select developer libraries, UI toolkits, and data packages you know. Multiple choices can be selected using the boxes.',
          count: selectedLibraries.length,
          btnLabel: 'Confirm & Continue',
        };
      case 3:
        return {
          stepNum: '3 of 4',
          title: 'Frameworks You Work With',
          desc: 'Select the frameworks you like and know about. Multiple frameworks can be selected across the boxes.',
          count: selectedFrameworks.length,
          btnLabel: 'Next & Proceed',
        };
      case 4:
        return {
          stepNum: '4 of 4',
          title: 'Developer Tools & Environments',
          desc: 'Select the tools and platforms you know. This will save your complete diagnostic profile to the database via REST API.',
          count: selectedTools.length,
          btnLabel: isSaving ? 'Saving to Database...' : 'Confirm & Proceed to Dashboard',
        };
      default:
        return {};
    }
  };

  const meta = getStepMeta();

  // Active items list based on current step - presets combined with dynamically added custom items
  const getActiveDataset = () => {
    switch (currentStep) {
      case 1:
        return {
          items: [...PRESET_LANGUAGES, ...customLanguages],
          selected: selectedLanguages,
          setter: setSelectedLanguages,
          customSetter: setCustomLanguages,
          categoryName: 'Custom Programming Language',
        };
      case 2:
        return {
          items: [...PRESET_LIBRARIES, ...customLibraries],
          selected: selectedLibraries,
          setter: setSelectedLibraries,
          customSetter: setCustomLibraries,
          categoryName: 'Custom Developer Library',
        };
      case 3:
        return {
          items: [...PRESET_FRAMEWORKS, ...customFrameworks],
          selected: selectedFrameworks,
          setter: setSelectedFrameworks,
          customSetter: setCustomFrameworks,
          categoryName: 'Custom Application Framework',
        };
      case 4:
        return {
          items: [...PRESET_TOOLS, ...customTools],
          selected: selectedTools,
          setter: setSelectedTools,
          customSetter: setCustomTools,
          categoryName: 'Custom Tool & Environment',
        };
      default:
        return { items: [], selected: [], setter: () => {}, customSetter: () => {}, categoryName: '' };
    }
  };

  // Add custom skill: adds card to grid beside presets, auto-selects it, and immediately persists to MySQL backend
  const handleAddCustom = async (e) => {
    e?.preventDefault();
    const rawInput = customInput.trim();
    if (!rawInput) return;
    const clean = stripSkillTag(rawInput);
    if (!clean) return;

    const { items, selected, setter, customSetter, categoryName } = getActiveDataset();

    // Create the skill card object
    const newCard = makeCustomSkillCard(clean, categoryName);

    // 1. Add to custom items list so it immediately appears in the grid (e.g. beside Ruby)
    customSetter((prev) => {
      if (prev.some((it) => it.id.toLowerCase() === clean.toLowerCase())) {
        return prev;
      }
      return [...prev, newCard];
    });

    // 2. Auto-select the newly added custom skill
    const updatedSelected = selected.includes(clean) ? selected : [...selected, clean];
    setter(updatedSelected);

    // Clear the input field
    setCustomInput('');
    setIsSavingCustom(true);
    setApiError('');

    // 3. Immediately persist directly to MySQL database via Spring Boot REST API
    try {
      const activeUserId = currentUser?.id || currentUser?.userId || userId || 1;
      const currentLanguages = (currentStep === 1 ? updatedSelected : selectedLanguages).map((s) => stripSkillTag(s));
      const currentLibraries = (currentStep === 2 ? updatedSelected : selectedLibraries).map((s) => stripSkillTag(s));
      const currentFrameworks = (currentStep === 3 ? updatedSelected : selectedFrameworks).map((s) => stripSkillTag(s));
      const currentTools = (currentStep === 4 ? updatedSelected : selectedTools).map((s) => stripSkillTag(s));

      const payload = {
        fullName: currentUser?.fullName || currentUser?.name,
        languages: currentLanguages,
        libraries: currentLibraries,
        frameworks: currentFrameworks,
        tools: currentTools,
        taggedSkills: [
          ...currentLanguages.map((s) => formatSkillWithTag(s, 'languages')),
          ...currentLibraries.map((s) => formatSkillWithTag(s, 'libraries')),
          ...currentFrameworks.map((s) => formatSkillWithTag(s, 'frameworks')),
          ...currentTools.map((s) => formatSkillWithTag(s, 'tools')),
        ],
        totalSkillsCount:
          currentLanguages.length +
          currentLibraries.length +
          currentFrameworks.length +
          currentTools.length,
        onboardedAt: new Date().toISOString(),
      };

      await studentAPI.saveOnboardingSkills(activeUserId, payload);
      setApiSuccess(`✓ "${clean}" successfully added and saved to MySQL database via Spring Boot REST API!`);
      setTimeout(() => setApiSuccess(''), 4500);

      // Notify parent component so dashboard tabs immediately receive the updated skills
      if (onComplete) {
        onComplete(payload);
      }
    } catch (err) {
      console.warn('Backend REST API auto-sync note:', err.message);
      setApiError(`Could not save "${clean}" to backend database: ${err.message}`);
      setTimeout(() => setApiError(''), 4500);
    } finally {
      setIsSavingCustom(false);
    }
  };

  // Final Action: Save to Database via REST API & Proceed to Dashboard (NO LOCAL STORAGE)
  const handleSaveAndProceed = async () => {
    setIsSaving(true);
    setApiError('');

    const cleanLangs = selectedLanguages.map((s) => stripSkillTag(s));
    const cleanLibs = selectedLibraries.map((s) => stripSkillTag(s));
    const cleanFws = selectedFrameworks.map((s) => stripSkillTag(s));
    const cleanTls = selectedTools.map((s) => stripSkillTag(s));

    const compiledData = {
      fullName: currentUser?.fullName || currentUser?.name,
      languages: cleanLangs,
      libraries: cleanLibs,
      frameworks: cleanFws,
      tools: cleanTls,
      taggedSkills: [
        ...cleanLangs.map((s) => formatSkillWithTag(s, 'languages')),
        ...cleanLibs.map((s) => formatSkillWithTag(s, 'libraries')),
        ...cleanFws.map((s) => formatSkillWithTag(s, 'frameworks')),
        ...cleanTls.map((s) => formatSkillWithTag(s, 'tools')),
      ],
      totalSkillsCount:
        cleanLangs.length +
        cleanLibs.length +
        cleanFws.length +
        cleanTls.length,
      onboardedAt: new Date().toISOString(),
    };

    try {
      const activeUserId = currentUser?.id || currentUser?.userId || 1;

      // 1. Persist directly to MySQL database via Spring Boot REST API
      await studentAPI.saveOnboardingSkills(activeUserId, compiledData);

      setApiSuccess(true);

      // 2. Notify parent component to update state (NO LOCAL STORAGE)
      if (onComplete) {
        onComplete(compiledData);
      }

      setTimeout(() => {
        if (onClose) onClose();
      }, 500);
    } catch (err) {
      console.error('Backend REST API call error:', err.message);
      setApiError(err.message || 'Failed to sync skills with backend server. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setSearchQuery('');
    } else {
      handleSaveAndProceed();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setSearchQuery('');
    }
  };

  const { items, selected, setter } = getActiveDataset();
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose && onClose()}>
      <DialogContent className="skill-onboarding-container p-0 border-0 overflow-hidden">
        {/* Official Shadcn UI DialogHeader */}
        <DialogHeader className="skill-onboarding-header text-left">
          <div className="skill-onboarding-header-top">
            <span className="skill-onboarding-brand-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Student Skill Diagnostic (Shadcn UI)
            </span>
            <span className="skill-onboarding-step-counter">Step {meta.stepNum}</span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="skill-onboarding-stepper">
            {[
              { num: 1, label: '1. Languages' },
              { num: 2, label: '2. Libraries' },
              { num: 3, label: '3. Frameworks' },
              { num: 4, label: '4. Tools' },
            ].map((step) => {
              const isCompleted = step.num < currentStep;
              const isActive = step.num === currentStep;
              return (
                <div
                  key={step.num}
                  className={`skill-onboarding-stepper-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                >
                  <div className="skill-onboarding-stepper-bar" />
                  <span className="skill-onboarding-stepper-label">{step.label}</span>
                </div>
              );
            })}
          </div>

          <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {meta.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
            {meta.desc}
          </DialogDescription>
        </DialogHeader>

        {/* Search & Selected Count Bar */}
        <div className="skill-onboarding-controls">
          <div className="skill-onboarding-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder={`Filter ${meta.title.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="skill-onboarding-selected-badge">
            {meta.count} {meta.count === 1 ? 'Selected' : 'Selected'}
          </div>
        </div>

        {/* API Notification Banners */}
        {apiError && (
          <div className="mx-8 mt-3 p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-medium dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-200">
            {apiError}
          </div>
        )}
        {apiSuccess && (
          <div className="mx-8 mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold dark:bg-emerald-950/40 dark:border-emerald-900/60 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in duration-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400 shrink-0">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{typeof apiSuccess === 'string' ? apiSuccess : 'Skills successfully saved to database via REST API! Opening dashboard...'}</span>
          </div>
        )}

        {/* Modal Body Card Grid */}
        <div className="skill-onboarding-body">
          <div className="skill-onboarding-grid">
            {filteredItems.map((item) => {
              const isSelected = selected.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`skill-card-box ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleItem(selected, setter, item.id)}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      toggleItem(selected, setter, item.id);
                    }
                  }}
                >
                  <div className="skill-card-left">
                    <div className="skill-card-icon">{item.acronym}</div>
                    <div className="skill-card-info">
                      <span className="skill-card-name">{item.name}</span>
                      <span className="skill-card-category">{item.category}</span>
                    </div>
                  </div>
                  {/* Shadcn UI RadioGroupItem indicator */}
                  <RadioGroupItem
                    value={item.id}
                    isSelected={isSelected}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItem(selected, setter, item.id);
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Quick Add Custom Skill */}
          <form className="skill-custom-add-box" onSubmit={handleAddCustom}>
            <input
              type="text"
              placeholder="Can't find your skill? Type name here..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              disabled={isSavingCustom}
            />
            <button type="submit" className="skill-custom-add-btn" disabled={isSavingCustom}>
              {isSavingCustom ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Saving to DB...</span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>Add Skill</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Official Shadcn UI DialogFooter */}
        <DialogFooter className="skill-onboarding-footer">
          <div className="skill-onboarding-footer-left">
            {currentStep > 1 && (
              <button
                type="button"
                className="skill-onboarding-back-btn"
                onClick={handleBack}
                disabled={isSaving}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back
              </button>
            )}
          </div>

          <button
            type="button"
            className={`skill-onboarding-primary-btn ${currentStep === 4 ? 'skill-onboarding-final-btn' : ''}`}
            onClick={handleNext}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Saving to Database...</span>
              </>
            ) : (
              <>
                <span>{meta.btnLabel}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
