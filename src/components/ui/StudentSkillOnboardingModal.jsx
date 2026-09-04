import React, { useState } from 'react';
import './StudentSkillOnboardingModal.css';

export const PRESET_LANGUAGES = [
  { id: 'python', name: 'Python', category: 'OOP & Data Science', acronym: 'PY' },
  { id: 'java', name: 'Java', category: 'Enterprise & Backend', acronym: 'JV' },
  { id: 'javascript', name: 'JavaScript', category: 'Web & Fullstack', acronym: 'JS' },
  { id: 'typescript', name: 'TypeScript', category: 'Typed Web Apps', acronym: 'TS' },
  { id: 'cpp', name: 'C++', category: 'Performance & Systems', acronym: 'C++' },
  { id: 'c', name: 'C', category: 'Low-Level Systems', acronym: 'C' },
  { id: 'csharp', name: 'C#', category: '.NET & Enterprise', acronym: 'C#' },
  { id: 'golang', name: 'Go (Golang)', category: 'Cloud & Distributed', acronym: 'GO' },
  { id: 'rust', name: 'Rust', category: 'Safe Memory Systems', acronym: 'RS' },
  { id: 'sql', name: 'SQL', category: 'Relational Databases', acronym: 'SQL' },
  { id: 'kotlin', name: 'Kotlin', category: 'Modern Android & JVM', acronym: 'KT' },
  { id: 'swift', name: 'Swift', category: 'iOS & macOS Apps', acronym: 'SW' },
  { id: 'php', name: 'PHP', category: 'Web & Scripting', acronym: 'PHP' },
  { id: 'dart', name: 'Dart', category: 'Flutter Mobile Apps', acronym: 'DT' },
  { id: 'html_css', name: 'HTML5 & CSS3', category: 'Responsive Markup', acronym: 'UI' },
  { id: 'ruby', name: 'Ruby', category: 'Dynamic Scripting', acronym: 'RB' },
];

export const PRESET_LIBRARIES = [
  { id: 'react', name: 'React', category: 'Component UI Library', acronym: 'RC' },
  { id: 'recharts', name: 'Recharts', category: 'Data Visualization Charts', acronym: 'CH' },
  { id: 'redux', name: 'Redux / Zustand', category: 'State Management', acronym: 'RD' },
  { id: 'axios', name: 'Axios', category: 'REST API & HTTP Client', acronym: 'AX' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'Utility-First Styling', acronym: 'TW' },
  { id: 'pandas', name: 'Pandas', category: 'Data Analysis & Manipulation', acronym: 'PD' },
  { id: 'numpy', name: 'NumPy', category: 'Numerical Computing', acronym: 'NP' },
  { id: 'scikit_learn', name: 'Scikit-Learn', category: 'Machine Learning Models', acronym: 'SK' },
  { id: 'pytorch', name: 'PyTorch', category: 'Deep Learning & Neural Nets', acronym: 'PT' },
  { id: 'tensorflow', name: 'TensorFlow', category: 'AI & Machine Learning', acronym: 'TF' },
  { id: 'lucide', name: 'Lucide Icons', category: 'Vector Iconography', acronym: 'LC' },
  { id: 'hibernate', name: 'Hibernate / JPA', category: 'Java ORM & Data Mapping', acronym: 'HB' },
  { id: 'graphql', name: 'GraphQL Client', category: 'Schema Querying', acronym: 'GQL' },
  { id: 'lodash', name: 'Lodash', category: 'JavaScript Utilities', acronym: 'LD' },
  { id: 'rxjs', name: 'RxJS', category: 'Reactive Programming', acronym: 'RX' },
  { id: 'testing_lib', name: 'Jest / Testing Library', category: 'Automated Unit Tests', acronym: 'JT' },
];

export const PRESET_FRAMEWORKS = [
  { id: 'spring_boot', name: 'Spring Boot', category: 'Enterprise Java Microservices', acronym: 'SB' },
  { id: 'django', name: 'Django', category: 'High-Level Python Fullstack', acronym: 'DJ' },
  { id: 'express', name: 'Express.js', category: 'Node.js REST API Framework', acronym: 'EX' },
  { id: 'nextjs', name: 'Next.js', category: 'React Server Side Rendering', acronym: 'NX' },
  { id: 'fastapi', name: 'FastAPI', category: 'Modern Asynchronous Python', acronym: 'FA' },
  { id: 'angular', name: 'Angular', category: 'Enterprise TypeScript Framework', acronym: 'NG' },
  { id: 'vue', name: 'Vue.js', category: 'Progressive JavaScript Framework', acronym: 'VU' },
  { id: 'nestjs', name: 'NestJS', category: 'Scalable Enterprise Node.js', acronym: 'NT' },
  { id: 'flask', name: 'Flask', category: 'Lightweight Python Microframework', acronym: 'FL' },
  { id: 'aspnet', name: 'ASP.NET Core', category: 'Cross-Platform Microsoft .NET', acronym: 'NET' },
  { id: 'flutter', name: 'Flutter', category: 'Cross-Platform Mobile & Web', acronym: 'FL' },
  { id: 'react_native', name: 'React Native', category: 'Native iOS & Android Apps', acronym: 'RN' },
  { id: 'sveltekit', name: 'SvelteKit', category: 'Cybernetically Enhanced Web', acronym: 'SV' },
  { id: 'laravel', name: 'Laravel', category: 'Elegant PHP Web MVC', acronym: 'LV' },
  { id: 'rails', name: 'Ruby on Rails', category: 'Convention over Configuration', acronym: 'RR' },
  { id: 'remix', name: 'Remix', category: 'Edge-Ready Web Framework', acronym: 'RX' },
];

export const PRESET_TOOLS = [
  { id: 'git', name: 'Git & GitHub', category: 'Version Control & VCS', acronym: 'GIT' },
  { id: 'docker', name: 'Docker', category: 'App Containerization', acronym: 'DK' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'Container Orchestration', acronym: 'K8' },
  { id: 'postman', name: 'Postman', category: 'API Testing & Documentation', acronym: 'PM' },
  { id: 'linux', name: 'Linux / Bash', category: 'OS & Terminal Shell', acronym: 'LX' },
  { id: 'aws', name: 'AWS Cloud', category: 'Cloud Infrastructure & EC2', acronym: 'AWS' },
  { id: 'maven', name: 'Maven / Gradle', category: 'Build Automation & Dependencies', acronym: 'MV' },
  { id: 'jenkins', name: 'Jenkins', category: 'CI/CD Pipeline Automation', acronym: 'JK' },
  { id: 'vscode', name: 'VS Code', category: 'Developer IDE & Tooling', acronym: 'VSC' },
  { id: 'figma', name: 'Figma', category: 'UI/UX Product Design', acronym: 'FG' },
  { id: 'mysql', name: 'MySQL Workbench', category: 'Relational Database Tool', acronym: 'SQL' },
  { id: 'postgres', name: 'PostgreSQL', category: 'Advanced Open Source Database', acronym: 'PG' },
  { id: 'mongodb', name: 'MongoDB Compass', category: 'NoSQL Document Store', acronym: 'MG' },
  { id: 'vite', name: 'Vite', category: 'Next-Gen Frontend Bundler', acronym: 'VT' },
  { id: 'redis', name: 'Redis', category: 'In-Memory Cache & Key-Value', acronym: 'RD' },
  { id: 'gcp', name: 'Google Cloud (GCP)', category: 'Cloud Platform Services', acronym: 'GCP' },
];

export default function StudentSkillOnboardingModal({
  isOpen,
  onClose,
  currentUser,
  onComplete,
}) {
  const [currentStep, setCurrentStep] = useState(1); // 1: Languages, 2: Libraries, 3: Frameworks, 4: Tools
  const [selectedLanguages, setSelectedLanguages] = useState(['python', 'java', 'javascript', 'sql']);
  const [selectedLibraries, setSelectedLibraries] = useState(['react', 'recharts', 'axios', 'tailwind']);
  const [selectedFrameworks, setSelectedFrameworks] = useState(['spring_boot', 'nextjs']);
  const [selectedTools, setSelectedTools] = useState(['git', 'docker', 'postman', 'vscode']);

  const [searchQuery, setSearchQuery] = useState('');
  const [customInput, setCustomInput] = useState('');

  if (!isOpen) return null;

  // Toggle selection for a given step
  const toggleItem = (list, setList, itemId) => {
    if (list.includes(itemId)) {
      setList(list.filter((id) => id !== itemId));
    } else {
      setList([...list, itemId]);
    }
  };

  // Add custom skill
  const handleAddCustom = (e) => {
    e?.preventDefault();
    const clean = customInput.trim();
    if (!clean) return;
    const customId = clean.toLowerCase().replace(/\s+/g, '_');

    if (currentStep === 1) {
      if (!selectedLanguages.includes(customId)) {
        setSelectedLanguages([...selectedLanguages, customId]);
      }
    } else if (currentStep === 2) {
      if (!selectedLibraries.includes(customId)) {
        setSelectedLibraries([...selectedLibraries, customId]);
      }
    } else if (currentStep === 3) {
      if (!selectedFrameworks.includes(customId)) {
        setSelectedFrameworks([...selectedFrameworks, customId]);
      }
    } else if (currentStep === 4) {
      if (!selectedTools.includes(customId)) {
        setSelectedTools([...selectedTools, customId]);
      }
    }
    setCustomInput('');
  };

  // Step 1: Languages
  const renderLanguagesStep = () => {
    const filtered = PRESET_LANGUAGES.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="skill-onboarding-grid">
        {filtered.map((lang) => {
          const isSelected = selectedLanguages.includes(lang.id);
          return (
            <div
              key={lang.id}
              className={`skill-card-box ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleItem(selectedLanguages, setSelectedLanguages, lang.id)}
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  toggleItem(selectedLanguages, setSelectedLanguages, lang.id);
                }
              }}
            >
              <div className="skill-card-left">
                <div className="skill-card-icon">{lang.acronym}</div>
                <div className="skill-card-info">
                  <span className="skill-card-name">{lang.name}</span>
                  <span className="skill-card-category">{lang.category}</span>
                </div>
              </div>
              <div className="skill-card-radio">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Step 2: Libraries
  const renderLibrariesStep = () => {
    const filtered = PRESET_LIBRARIES.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="skill-onboarding-grid">
        {filtered.map((lib) => {
          const isSelected = selectedLibraries.includes(lib.id);
          return (
            <div
              key={lib.id}
              className={`skill-card-box ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleItem(selectedLibraries, setSelectedLibraries, lib.id)}
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  toggleItem(selectedLibraries, setSelectedLibraries, lib.id);
                }
              }}
            >
              <div className="skill-card-left">
                <div className="skill-card-icon">{lib.acronym}</div>
                <div className="skill-card-info">
                  <span className="skill-card-name">{lib.name}</span>
                  <span className="skill-card-category">{lib.category}</span>
                </div>
              </div>
              <div className="skill-card-radio">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Step 3: Frameworks
  const renderFrameworksStep = () => {
    const filtered = PRESET_FRAMEWORKS.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="skill-onboarding-grid">
        {filtered.map((fw) => {
          const isSelected = selectedFrameworks.includes(fw.id);
          return (
            <div
              key={fw.id}
              className={`skill-card-box ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleItem(selectedFrameworks, setSelectedFrameworks, fw.id)}
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  toggleItem(selectedFrameworks, setSelectedFrameworks, fw.id);
                }
              }}
            >
              <div className="skill-card-left">
                <div className="skill-card-icon">{fw.acronym}</div>
                <div className="skill-card-info">
                  <span className="skill-card-name">{fw.name}</span>
                  <span className="skill-card-category">{fw.category}</span>
                </div>
              </div>
              <div className="skill-card-radio">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Step 4: Tools
  const renderToolsStep = () => {
    const filtered = PRESET_TOOLS.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="skill-onboarding-grid">
        {filtered.map((tool) => {
          const isSelected = selectedTools.includes(tool.id);
          return (
            <div
              key={tool.id}
              className={`skill-card-box ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleItem(selectedTools, setSelectedTools, tool.id)}
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  toggleItem(selectedTools, setSelectedTools, tool.id);
                }
              }}
            >
              <div className="skill-card-left">
                <div className="skill-card-icon">{tool.acronym}</div>
                <div className="skill-card-info">
                  <span className="skill-card-name">{tool.name}</span>
                  <span className="skill-card-category">{tool.category}</span>
                </div>
              </div>
              <div className="skill-card-radio">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Step Metadata
  const getStepMeta = () => {
    switch (currentStep) {
      case 1:
        return {
          stepNum: '1 of 4',
          title: 'Languages You Like & Know',
          desc: 'Select the programming and database languages you work with. Multiple choices can be selected.',
          count: selectedLanguages.length,
          btnLabel: 'Confirm & Continue',
        };
      case 2:
        return {
          stepNum: '2 of 4',
          title: 'Libraries You Know & Use',
          desc: 'Select the client libraries, state managers, and data packages you use in your projects.',
          count: selectedLibraries.length,
          btnLabel: 'Confirm & Continue',
        };
      case 3:
        return {
          stepNum: '3 of 4',
          title: 'Frameworks You Like & Know',
          desc: 'Multiple frameworks can be selected. Pick all backend, fullstack, or mobile frameworks you know.',
          count: selectedFrameworks.length,
          btnLabel: 'Next & Proceed',
        };
      case 4:
        return {
          stepNum: '4 of 4',
          title: 'Developer Tools You Use',
          desc: 'Select developer environments, version control, containerization, and cloud platforms you are familiar with.',
          count: selectedTools.length,
          btnLabel: 'Confirm & Proceed to Dashboard',
        };
      default:
        return {};
    }
  };

  const meta = getStepMeta();

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setSearchQuery('');
    } else {
      // Final submission on Step 4
      const compiledData = {
        languages: selectedLanguages,
        libraries: selectedLibraries,
        frameworks: selectedFrameworks,
        tools: selectedTools,
        totalSkillsCount:
          selectedLanguages.length +
          selectedLibraries.length +
          selectedFrameworks.length +
          selectedTools.length,
        onboardedAt: new Date().toISOString(),
      };

      if (onComplete) {
        onComplete(compiledData);
      }
      if (onClose) {
        onClose();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setSearchQuery('');
    }
  };

  return (
    <div className="skill-onboarding-backdrop" role="dialog" aria-modal="true">
      <div className="skill-onboarding-container">
        {/* Header */}
        <div className="skill-onboarding-header">
          <div className="skill-onboarding-header-top">
            <span className="skill-onboarding-brand-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Student Skill Diagnostic
            </span>
            <span className="skill-onboarding-step-counter">Step {meta.stepNum}</span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="skill-onboarding-stepper">
            {[
              { num: 1, label: 'Languages' },
              { num: 2, label: 'Libraries' },
              { num: 3, label: 'Frameworks' },
              { num: 4, label: 'Tools' },
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

          <div className="skill-onboarding-title-area">
            <h2>{meta.title}</h2>
            <p>{meta.desc}</p>
          </div>
        </div>

        {/* Search & Selected Count */}
        <div className="skill-onboarding-controls">
          <div className="skill-onboarding-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder={`Search ${meta.title.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="skill-onboarding-selected-badge">
            {meta.count} {meta.count === 1 ? 'Skill' : 'Skills'} Selected
          </div>
        </div>

        {/* Scrollable Body Cards */}
        <div className="skill-onboarding-body">
          {currentStep === 1 && renderLanguagesStep()}
          {currentStep === 2 && renderLibrariesStep()}
          {currentStep === 3 && renderFrameworksStep()}
          {currentStep === 4 && renderToolsStep()}

          {/* Quick Add Custom Skill */}
          <form className="skill-custom-add-box" onSubmit={handleAddCustom}>
            <input
              type="text"
              placeholder="Can't find your skill? Type name here..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
            />
            <button type="submit" className="skill-custom-add-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Skill
            </button>
          </form>
        </div>

        {/* Modal Footer with Actions */}
        <div className="skill-onboarding-footer">
          <div className="skill-onboarding-footer-left">
            {currentStep > 1 && (
              <button
                type="button"
                className="skill-onboarding-back-btn"
                onClick={handleBack}
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
          >
            <span>{meta.btnLabel}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
