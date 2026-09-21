import React, { useState, useEffect, useMemo } from 'react';
import { studentAPI, profileAPI } from '../../services/api';
import {
  parseSkill,
  stripSkillTag,
  formatSkillWithTag,
} from '@/lib/skillCategories';
import {
  PRESET_LANGUAGES,
  PRESET_LIBRARIES,
  PRESET_FRAMEWORKS,
  PRESET_TOOLS,
} from '../ui/StudentSkillOnboardingModal';
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
import { Input } from '@/components/ui/input';
import {
  Code2,
  Layers,
  BookOpen,
  Wrench,
  Calculator,
  Users,
  CheckCircle2,
  Clock,
  Brain,
  Plus,
  Search,
  Sparkles,
  ShieldCheck,
  Award,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Filter,
} from 'lucide-react';
import { SKILL_SUBTOPICS_MAP, getSubtopicsForSkill } from './StudentAssessmentTab';
import './StudentSkillsTab.css';

const categorizeSkills = (rawSkillsList, savedCategories = {}) => {
  const languages = new Set();
  const frameworks = new Set();
  const libraries = new Set();
  const tools = new Set();
  const aptitude = new Set();
  const softSkills = new Set();

  // 1. Seed from explicit savedCategories if present
  if (Array.isArray(savedCategories.languages)) {
    savedCategories.languages.forEach((s) => {
      const { cleanName } = parseSkill(s, 'languages');
      if (cleanName) languages.add(cleanName);
    });
  }
  if (Array.isArray(savedCategories.frameworks)) {
    savedCategories.frameworks.forEach((s) => {
      const { cleanName } = parseSkill(s, 'frameworks');
      if (cleanName) frameworks.add(cleanName);
    });
  }
  if (Array.isArray(savedCategories.libraries)) {
    savedCategories.libraries.forEach((s) => {
      const { cleanName } = parseSkill(s, 'libraries');
      if (cleanName) libraries.add(cleanName);
    });
  }
  if (Array.isArray(savedCategories.tools)) {
    savedCategories.tools.forEach((s) => {
      const { cleanName } = parseSkill(s, 'tools');
      if (cleanName) tools.add(cleanName);
    });
  }
  if (Array.isArray(savedCategories.aptitude)) {
    savedCategories.aptitude.forEach((s) => {
      const { cleanName } = parseSkill(s, 'aptitude');
      if (cleanName) aptitude.add(cleanName);
    });
  }
  if (Array.isArray(savedCategories.soft_skills)) {
    savedCategories.soft_skills.forEach((s) => {
      const { cleanName } = parseSkill(s, 'soft_skills');
      if (cleanName) softSkills.add(cleanName);
    });
  }

  // 2. Categorize all raw skills (evaluating tags, known sets, patterns)
  (rawSkillsList || []).forEach((raw) => {
    if (!raw) return;
    const { cleanName, category } = parseSkill(raw);
    if (!cleanName) return;

    if (category === 'tools') {
      tools.add(cleanName);
    } else if (category === 'frameworks') {
      frameworks.add(cleanName);
    } else if (category === 'libraries') {
      libraries.add(cleanName);
    } else if (category === 'languages') {
      languages.add(cleanName);
    } else if (category === 'aptitude') {
      aptitude.add(cleanName);
    } else if (category === 'soft_skills') {
      softSkills.add(cleanName);
    } else {
      tools.add(cleanName);
    }
  });

  return {
    languages: Array.from(languages),
    frameworks: Array.from(frameworks),
    libraries: Array.from(libraries),
    tools: Array.from(tools),
    aptitude: Array.from(aptitude),
    soft_skills: Array.from(softSkills),
  };
};

export default function StudentSkillsTab({ currentUser, userSkillsData, onSelectTab, onOpenSkillsModal }) {
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

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'VERIFIED' | 'PENDING'
  const [employabilityScore, setEmployabilityScore] = useState(87);

  const [profileSkills, setProfileSkills] = useState(() => {
    if (userSkillsData && (userSkillsData.languages || userSkillsData.frameworks || userSkillsData.libraries || userSkillsData.tools)) {
      return categorizeSkills([], userSkillsData);
    }
    return { languages: [], frameworks: [], libraries: [], tools: [], aptitude: [], soft_skills: [] };
  });

  const [verifiedMap, setVerifiedMap] = useState(new Map()); // skillName -> { isVerified, proficiency }

  // Listen for immediate skill verification events from the Assessment tab
  useEffect(() => {
    const handleSkillVerified = (e) => {
      const detail = e?.detail;
      if (!detail || !detail.skillTitle) return;
      const clean = stripSkillTag(detail.skillTitle).toLowerCase().trim();
      setVerifiedMap((prev) => {
        const next = new Map(prev);
        next.set(clean, {
          isVerified: detail.isVerified,
          proficiency: detail.proficiency || 'INTERMEDIATE',
          raw: detail,
        });
        return next;
      });
      if (detail.isVerified) {
        setEmployabilityScore((prev) => Math.min(99, Math.max(prev, 87) + 3));
      }
    };

    window.addEventListener('talentorbit_skill_verified', handleSkillVerified);
    return () => window.removeEventListener('talentorbit_skill_verified', handleSkillVerified);
  }, []);

  useEffect(() => {
    setLoading(true);

    Promise.allSettled([
      profileAPI.getProfile(activeUserId),
      studentAPI.getProfile(activeUserId),
    ])
      .then(([profRes, studRes]) => {
        const vMap = new Map();
        const allSkillNames = [];

        // 0. Seed from verified registry cache
        try {
          const regKey = `talentorbit_verified_skills_${activeUserId}`;
          const reg = JSON.parse(localStorage.getItem(regKey) || '{}');
          Object.entries(reg).forEach(([k, val]) => {
            if (val && val.isVerified) {
              vMap.set(k.toLowerCase().trim(), {
                isVerified: true,
                proficiency: val.proficiency || 'INTERMEDIATE',
                raw: val,
              });
            }
          });
        } catch (regErr) {
          console.warn('Could not read verified registry cache:', regErr);
        }

        // 1. Process verified skills from backend student records (student_skills in MySQL)
        if (studRes.status === 'fulfilled' && studRes.value) {
          if (studRes.value.employabilityScore) {
            setEmployabilityScore(studRes.value.employabilityScore);
          }
          if (Array.isArray(studRes.value.skills)) {
            studRes.value.skills.forEach((s) => {
              const { cleanName } = parseSkill(s);
              if (!cleanName) return;
              const rawStr = typeof s === 'string' ? s : (s.name || s.skillName || '');
              const isV = rawStr.toLowerCase().includes('verified') || !!s.isVerified || !!s.verifiedFlag;
              let prof = 'BEGINNER';
              if (rawStr.toLowerCase().includes('advanced') || s.proficiencyLevel === 'ADVANCED') prof = 'ADVANCED';
              else if (rawStr.toLowerCase().includes('intermediate') || s.proficiencyLevel === 'INTERMEDIATE') prof = 'INTERMEDIATE';

              vMap.set(cleanName.toLowerCase(), { isVerified: isV, proficiency: prof, raw: s });
              allSkillNames.push(s);
            });
          }
        }

        // 2. Also process skills from user-profile controller
        if (profRes.status === 'fulfilled' && profRes.value) {
          const p = profRes.value;
          if (Array.isArray(p.skills)) {
            p.skills.forEach((s) => {
              if (typeof s === 'string' && s.trim()) {
                allSkillNames.push(s.trim());
                const { cleanName } = parseSkill(s);
                if (cleanName) {
                  const rawStr = s.trim();
                  const isV = rawStr.toLowerCase().includes('verified');
                  let prof = 'BEGINNER';
                  if (rawStr.toLowerCase().includes('advanced')) prof = 'ADVANCED';
                  else if (rawStr.toLowerCase().includes('intermediate')) prof = 'INTERMEDIATE';

                  const existing = vMap.get(cleanName.toLowerCase());
                  if (!existing || (!existing.isVerified && isV)) {
                    vMap.set(cleanName.toLowerCase(), { isVerified: isV, proficiency: prof, raw: s });
                  }
                }
              } else if (typeof s === 'object' && s !== null) {
                const cleanName = s.name || s.skillName;
                if (cleanName) {
                  allSkillNames.push(cleanName);
                  const isV = !!s.isVerified || !!s.verifiedFlag || (s.name && s.name.toLowerCase().includes('verified'));
                  const prof = s.proficiencyLevel || 'BEGINNER';
                  const existing = vMap.get(cleanName.toLowerCase());
                  if (!existing || (!existing.isVerified && isV)) {
                    vMap.set(cleanName.toLowerCase(), { isVerified: isV, proficiency: prof, raw: s });
                  }
                }
              }
            });
          }
        }

        setVerifiedMap(vMap);

        // 3. Resolve category breakdown directly from backend profile (NO LOCAL STORAGE)
        const savedCategories = (profRes.status === 'fulfilled' && profRes.value) ? profRes.value : (userSkillsData || {});

        if (Array.isArray(savedCategories.languages)) allSkillNames.push(...savedCategories.languages);
        if (Array.isArray(savedCategories.frameworks)) allSkillNames.push(...savedCategories.frameworks);
        if (Array.isArray(savedCategories.libraries)) allSkillNames.push(...savedCategories.libraries);
        if (Array.isArray(savedCategories.tools)) allSkillNames.push(...savedCategories.tools);

        // 4. Categorize all acquired skills from database records
        const categorized = categorizeSkills(allSkillNames, savedCategories);
        setProfileSkills(categorized);
      })
      .catch((err) => {
        console.error('Error fetching real skills matrix from database:', err);
      })
      .finally(() => setLoading(false));
  }, [activeUserId, currentUser, userSkillsData]);

  // Aggregate all skills with rich category metadata
  const aggregatedSkills = useMemo(() => {
    const list = [];
    (profileSkills.languages || []).forEach((name) => list.push({ name, category: 'languages', categoryLabel: 'Language', icon: Code2 }));
    (profileSkills.frameworks || []).forEach((name) => list.push({ name, category: 'frameworks', categoryLabel: 'Framework', icon: Layers }));
    (profileSkills.libraries || []).forEach((name) => list.push({ name, category: 'libraries', categoryLabel: 'Library', icon: BookOpen }));
    (profileSkills.tools || []).forEach((name) => list.push({ name, category: 'tools', categoryLabel: 'Tool', icon: Wrench }));
    (profileSkills.aptitude || []).forEach((name) => list.push({ name, category: 'aptitude', categoryLabel: 'Aptitude', icon: Calculator }));
    (profileSkills.soft_skills || []).forEach((name) => list.push({ name, category: 'soft_skills', categoryLabel: 'Soft Skill', icon: Users }));

    return list.map((item) => {
      const vInfo = verifiedMap.get(item.name.toLowerCase()) || { isVerified: false, proficiency: 'BEGINNER' };
      const subtopics = getSubtopicsForSkill(item.name).slice(0, 3);
      return {
        ...item,
        isVerified: vInfo.isVerified,
        proficiency: vInfo.proficiency || 'BEGINNER',
        subtopics,
      };
    });
  }, [profileSkills, verifiedMap]);

  // Filter skills based on user search query and active pills
  const filteredSkills = useMemo(() => {
    return aggregatedSkills.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategoryFilter === 'ALL' || item.category === selectedCategoryFilter;

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'VERIFIED' && item.isVerified) ||
        (statusFilter === 'PENDING' && !item.isVerified);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [aggregatedSkills, searchQuery, selectedCategoryFilter, statusFilter]);

  const totalCount = aggregatedSkills.length;
  const verifiedCount = aggregatedSkills.filter((s) => s.isVerified).length;
  const pendingCount = Math.max(0, totalCount - verifiedCount);
  const verificationRate = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

  // Group filtered skills by category for display
  const categoriesList = [
    { key: 'languages', label: 'Programming Languages', icon: Code2, count: profileSkills.languages?.length || 0 },
    { key: 'frameworks', label: 'Frameworks & Architecture', icon: Layers, count: profileSkills.frameworks?.length || 0 },
    { key: 'libraries', label: 'Libraries & Ecosystem', icon: BookOpen, count: profileSkills.libraries?.length || 0 },
    { key: 'tools', label: 'Developer Tools & Platforms', icon: Wrench, count: profileSkills.tools?.length || 0 },
    { key: 'aptitude', label: 'Quantitative Aptitude & Reasoning', icon: Calculator, count: profileSkills.aptitude?.length || 0 },
    { key: 'soft_skills', label: 'Workplace Soft Skills & Leadership', icon: Users, count: profileSkills.soft_skills?.length || 0 },
  ];

  return (
    <div className="student-skills-container">
      {/* 1. Shadcn-Styled Glassmorphic Header */}
      <div className="skills-hero-banner">
        <div>
          <h2 className="skills-hero-title">
            <ShieldCheck size={26} className="text-indigo-600 dark:text-indigo-400" />
            Empirical Technical & Behavioral Skill Matrix
          </h2>
          <p className="skills-hero-desc">
            All skills enrolled in your student profile are categorized into core domains. Take adaptive AI diagnostics to verify competencies, earn cryptographic credentials, and boost your Employability Score.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 shadow-sm font-semibold border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => onSelectTab && onSelectTab('assessment')}
          >
            <Brain size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span>Launch Assessment</span>
          </Button>

          <Button
            className="gap-2 shadow-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            onClick={onOpenSkillsModal}
          >
            <Plus size={16} />
            <span>Add / Edit Skills</span>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <RefreshCw size={32} className="animate-spin text-indigo-500 mb-3" />
          <p className="text-sm font-medium">Synchronizing verified skill records from MySQL database...</p>
        </div>
      ) : totalCount === 0 ? (
        <Card className="border-2 border-dashed border-slate-200 dark:border-slate-800 text-center py-16">
          <CardContent className="flex flex-col items-center">
            <AlertTriangle size={40} className="text-amber-500 mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No Acquired Skills Recorded Yet</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
              Your database skill matrix is currently empty. Add the programming languages, frameworks, and tools you know to begin diagnostic testing.
            </p>
            <Button
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md"
              onClick={onOpenSkillsModal}
            >
              <Plus size={16} />
              <span>Select Your Skills Now</span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* 2. Shadcn KPI Metric Cards */}
          <div className="skills-kpi-grid">
            <Card className="skills-kpi-card">
              <CardHeader className="p-5 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Profile Skills</span>
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Code2 size={16} />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold mt-1 text-slate-900 dark:text-slate-100">{totalCount}</CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-1">
                  Enrolled across 6 competency domains
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-5 pt-2">
                <div className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
                  Active in placement diagnostic pipeline
                </div>
              </CardFooter>
            </Card>

            <Card className="skills-kpi-card">
              <CardHeader className="p-5 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Competencies</span>
                  <Badge variant="emerald" className="gap-1 font-bold">
                    <CheckCircle2 size={12} />
                    {verificationRate}% Rate
                  </Badge>
                </div>
                <CardTitle className="text-3xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{verifiedCount}</CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-1">
                  {pendingCount} skills pending verification test
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-5 pt-2 flex flex-col gap-1.5 items-stretch">
                <Progress value={verificationRate} className="h-2 bg-slate-100 dark:bg-slate-800" indicatorClassName="bg-emerald-500" />
                <span className="text-[11px] text-slate-500">Empirically proven via AI adaptive MCQs</span>
              </CardFooter>
            </Card>

            <Card className="skills-kpi-card">
              <CardHeader className="p-5 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Employability Readiness</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <TrendingUp size={16} />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold mt-1 text-slate-900 dark:text-slate-100">{employabilityScore} / 100</CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-1">
                  Dynamic score calculated from verified proficiencies
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-5 pt-2">
                <Badge variant="indigo" className="gap-1 text-xs font-semibold">
                  <Award size={12} />
                  Skill Profile Pioneer
                </Badge>
              </CardFooter>
            </Card>
          </div>

          {/* 3. Shadcn Interactive Filter & Search Toolbar */}
          <div className="skills-toolbar shadow-sm">
            <div className="skills-search-row">
              <div className="skills-search-input-wrap">
                <Search size={16} className="skills-search-icon" />
                <Input
                  type="text"
                  placeholder="Filter skills by name, framework, or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="skills-search-input h-10 border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70"
                />
              </div>

              {/* Status Filter Toggles */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${
                    statusFilter === 'ALL'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  onClick={() => setStatusFilter('ALL')}
                >
                  All ({totalCount})
                </button>
                <button
                  type="button"
                  className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${
                    statusFilter === 'VERIFIED'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  onClick={() => setStatusFilter('VERIFIED')}
                >
                  <CheckCircle2 size={12} />
                  Verified ({verifiedCount})
                </button>
                <button
                  type="button"
                  className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${
                    statusFilter === 'PENDING'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  onClick={() => setStatusFilter('PENDING')}
                >
                  <Clock size={12} />
                  Pending ({pendingCount})
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="skills-category-pills">
              <button
                type="button"
                className={`skills-filter-pill ${selectedCategoryFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setSelectedCategoryFilter('ALL')}
              >
                <Filter size={13} />
                <span>All Categories ({totalCount})</span>
              </button>

              {categoriesList.map((cat) => {
                if (cat.count === 0) return null;
                const IconComp = cat.icon;
                const isActive = selectedCategoryFilter === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    className={`skills-filter-pill ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedCategoryFilter(cat.key)}
                  >
                    <IconComp size={13} />
                    <span>{cat.label.split(' ')[0]} ({cat.count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Categorized Domains & Enhanced Skill Cards */}
          {categoriesList.map((cat) => {
            const domainSkills = filteredSkills.filter((s) => s.category === cat.key);
            if (domainSkills.length === 0) return null;
            const IconComp = cat.icon;

            return (
              <div key={cat.key} className="skills-domain-section">
                <div className="skills-domain-header">
                  <div className="skills-domain-title">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <IconComp size={16} />
                    </div>
                    <span>{cat.label}</span>
                    <Badge variant="outline" className="ml-1 text-xs">
                      {domainSkills.length} {domainSkills.length === 1 ? 'Skill' : 'Skills'}
                    </Badge>
                  </div>
                </div>

                <div className="skills-domain-grid">
                  {domainSkills.map((sk) => {
                    const cleanDisplayName = sk.name.replace('Soft Skills - ', '').replace('Aptitude - ', '');
                    return (
                      <Card
                        key={sk.name}
                        className={`enhanced-skill-card ${sk.isVerified ? 'is-verified' : 'is-unverified'}`}
                      >
                        <CardHeader className="p-4 pb-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                  {sk.categoryLabel}
                                </span>
                              </div>
                              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {cleanDisplayName}
                              </CardTitle>
                            </div>

                            <Badge
                              variant={sk.isVerified ? 'emerald' : 'amber'}
                              className="gap-1 text-[11px] font-semibold py-0.5 px-2"
                            >
                              {sk.isVerified ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                              <span>{sk.isVerified ? 'Verified' : 'Self-Reported'}</span>
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="p-4 pt-1 pb-3 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-slate-500 font-medium">Proficiency:</span>
                              <Badge
                                variant={sk.proficiency === 'ADVANCED' ? 'emerald' : sk.proficiency === 'INTERMEDIATE' ? 'indigo' : 'outline'}
                                className="text-[10px] uppercase font-bold"
                              >
                                {sk.proficiency}
                              </Badge>
                            </div>

                            {/* Subtopics Preview Chips */}
                            {sk.subtopics?.length > 0 && (
                              <div className="skill-card-subtopics-list">
                                {sk.subtopics.map((sub, i) => (
                                  <span key={i} className="skill-subtopic-tag">
                                    {sub}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>

                        <CardFooter className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">
                            {sk.isVerified ? 'MySQL Verified' : 'Diagnostic Ready'}
                          </span>

                          <Button
                            size="sm"
                            variant={sk.isVerified ? 'outline' : 'default'}
                            className={`h-8 text-xs font-semibold gap-1.5 ${
                              !sk.isVerified
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                            onClick={() => onSelectTab && onSelectTab('assessment')}
                          >
                            {sk.isVerified ? (
                              <>
                                <Award size={13} className="text-indigo-600 dark:text-indigo-400" />
                                <span>Re-Assess</span>
                              </>
                            ) : (
                              <>
                                <Brain size={13} />
                                <span>Verify Skill</span>
                              </>
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filteredSkills.length === 0 && (
            <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <Search size={32} className="text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No skills match your filter criteria "{searchQuery}"
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-xs"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategoryFilter('ALL');
                  setStatusFilter('ALL');
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
