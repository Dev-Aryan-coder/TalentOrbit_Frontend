import React, { useState, useEffect, useMemo } from 'react';
import { studentAPI, dashboardAPI } from '../../services/api';
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
  Compass,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  Target,
  Search,
  Filter,
  Star,
  Briefcase,
  Award,
  TrendingUp,
  Layers,
  Code2,
  Brain,
  Cloud,
  ShieldCheck,
  Zap,
  Check,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import './StudentCareerTab.css';

// 7 Industry-Standard Benchmark Career Roles
const BENCHMARK_CAREER_ROLES = [
  {
    id: 'full-stack',
    roleName: 'Full Stack Web Developer',
    domain: 'Full Stack & Web',
    iconType: 'code',
    description: 'Builds responsive web applications, modern APIs, and stateful interfaces from client to database.',
    seniority: 'Entry to Associate',
    marketDemand: 'Very High',
    salaryRange: '₹8.5 - 16 LPA',
    growthRate: '+24% YoY',
    requiredSkills: [
      'React',
      'JavaScript',
      'Node.js',
      'HTML5',
      'CSS3',
      'SQL',
      'REST APIs',
      'Git',
      'Quantitative Aptitude',
      'Agile Teamwork',
    ],
  },
  {
    id: 'backend-systems',
    roleName: 'Backend & Cloud Systems Engineer',
    domain: 'Systems & Cloud',
    iconType: 'layers',
    description: 'Designs resilient microservices, database schemas, message queues, and high-throughput server APIs.',
    seniority: 'Entry to Associate',
    marketDemand: 'High Demand',
    salaryRange: '₹9.0 - 18 LPA',
    growthRate: '+28% YoY',
    requiredSkills: [
      'Java',
      'Spring Boot',
      'Python',
      'SQL',
      'Docker',
      'REST APIs',
      'Git',
      'Quantitative Aptitude',
      'Workplace Communication',
      'Agile Teamwork',
    ],
  },
  {
    id: 'frontend-uiux',
    roleName: 'Frontend UI/UX Specialist',
    domain: 'Full Stack & Web',
    iconType: 'sparkles',
    description: 'Specializes in component architectures, state machines, sleek UI design systems, and responsive performance.',
    seniority: 'Entry Level',
    marketDemand: 'High Demand',
    salaryRange: '₹7.5 - 14 LPA',
    growthRate: '+20% YoY',
    requiredSkills: [
      'React',
      'JavaScript',
      'TypeScript',
      'CSS3',
      'HTML5',
      'Tailwind CSS',
      'Git',
      'Workplace Communication',
      'Agile Teamwork',
    ],
  },
  {
    id: 'cloud-devops',
    roleName: 'Cloud DevOps & Infrastructure Engineer',
    domain: 'Cloud & Infrastructure',
    iconType: 'cloud',
    description: 'Automates multi-cloud deployments, CI/CD pipelines, container orchestration, and server reliability.',
    seniority: 'Associate Level',
    marketDemand: 'Very High',
    salaryRange: '₹10 - 20 LPA',
    growthRate: '+32% YoY',
    requiredSkills: [
      'Docker',
      'Kubernetes',
      'Linux',
      'AWS',
      'Python',
      'Git',
      'Quantitative Aptitude',
      'Workplace Communication',
      'Agile Teamwork',
    ],
  },
  {
    id: 'ai-data-engineer',
    roleName: 'AI & Data Solutions Engineer',
    domain: 'Data & AI',
    iconType: 'brain',
    description: 'Develops data pipelines, trains predictive ML models, and integrates Generative AI APIs into software.',
    seniority: 'Associate Level',
    marketDemand: 'Surging Demand',
    salaryRange: '₹11 - 22 LPA',
    growthRate: '+38% YoY',
    requiredSkills: [
      'Python',
      'Machine Learning',
      'SQL',
      'Pandas',
      'Quantitative Aptitude',
      'Git',
      'Workplace Communication',
      'Agile Teamwork',
    ],
  },
  {
    id: 'cybersecurity-analyst',
    roleName: 'Cybersecurity & Defense Analyst',
    domain: 'Cloud & Infrastructure',
    iconType: 'shield',
    description: 'Protects enterprise systems, audits codebases for vulnerabilities, and enforces zero-trust security standards.',
    seniority: 'Entry to Associate',
    marketDemand: 'High Demand',
    salaryRange: '₹8.5 - 17 LPA',
    growthRate: '+26% YoY',
    requiredSkills: [
      'Linux',
      'Computer Networks',
      'Python',
      'Cryptography',
      'Quantitative Aptitude',
      'Workplace Communication',
      'Agile Teamwork',
    ],
  },
  {
    id: 'product-consultant',
    roleName: 'Associate Technical Consultant',
    domain: 'Consulting & Product',
    iconType: 'briefcase',
    description: 'Bridges technical teams with corporate stakeholders, assessing feasibility, analytics, and business solutions.',
    seniority: 'Entry Level',
    marketDemand: 'High Demand',
    salaryRange: '₹8.0 - 15 LPA',
    growthRate: '+19% YoY',
    requiredSkills: [
      'Quantitative Aptitude',
      'Workplace Communication',
      'Agile Teamwork',
      'SQL',
      'Problem Solving',
      'Workplace Ethics',
      'Adaptability',
    ],
  },
];

const renderDomainIcon = (iconType) => {
  switch (iconType) {
    case 'code':
      return <Code2 className="text-indigo-600 dark:text-indigo-400" size={20} />;
    case 'layers':
      return <Layers className="text-blue-600 dark:text-blue-400" size={20} />;
    case 'sparkles':
      return <Sparkles className="text-purple-600 dark:text-purple-400" size={20} />;
    case 'cloud':
      return <Cloud className="text-cyan-600 dark:text-cyan-400" size={20} />;
    case 'brain':
      return <Brain className="text-emerald-600 dark:text-emerald-400" size={20} />;
    case 'shield':
      return <ShieldCheck className="text-rose-600 dark:text-rose-400" size={20} />;
    case 'briefcase':
    default:
      return <Briefcase className="text-amber-600 dark:text-amber-400" size={20} />;
  }
};

export default function StudentCareerTab({ currentUser, onSelectTab }) {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [backendSuggestions, setBackendSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFitFilter, setSelectedFitFilter] = useState('ALL');
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [sortBy, setSortBy] = useState('FIT_DESC');
  const [settingGoalFor, setSettingGoalFor] = useState(null);
  const [goalFeedback, setGoalFeedback] = useState(null);

  const userId = currentUser?.id || currentUser?.userId;

  // 1. Fetch live suggestions and student profile skills
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    Promise.allSettled([
      studentAPI.getCareerSuggestions(userId),
      studentAPI.getProfile(userId),
      studentAPI.getStudentSkills(userId),
    ])
      .then(([suggRes, profRes, userProfRes]) => {
        if (suggRes.status === 'fulfilled' && Array.isArray(suggRes.value)) {
          setBackendSuggestions(suggRes.value);
        }

        let profData = null;
        if (profRes.status === 'fulfilled' && profRes.value) {
          profData = profRes.value;
        } else if (userProfRes.status === 'fulfilled' && userProfRes.value) {
          profData = userProfRes.value;
        }

        if (profData) {
          setUserProfile(profData);
          if (profData.targetRole) {
            setTargetRole(profData.targetRole);
          }
        }
      })
      .catch((err) => {
        console.warn('Career tab loading warning:', err.message);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // Extract set of student skills (normalized lower-case for fuzzy matching)
  const userSkillStrings = useMemo(() => {
    const set = new Set();
    if (!userProfile) return set;

    const rawList = [
      ...(Array.isArray(userProfile.skills) ? userProfile.skills : []),
      ...(Array.isArray(userProfile.languages) ? userProfile.languages : []),
      ...(Array.isArray(userProfile.frameworks) ? userProfile.frameworks : []),
      ...(Array.isArray(userProfile.libraries) ? userProfile.libraries : []),
      ...(Array.isArray(userProfile.tools) ? userProfile.tools : []),
      ...(Array.isArray(userProfile.verifiedSkills) ? userProfile.verifiedSkills : []),
    ];

    rawList.forEach((sk) => {
      if (!sk) return;
      const clean = (typeof sk === 'string' ? sk.split('(')[0] : sk.name || sk.skillName || '').trim().toLowerCase();
      if (clean) set.add(clean);
    });

    // Known test evaluation mappings (soft skills & aptitude verified in DB)
    return set;
  }, [userProfile]);

  // 2. Compute enriched role list comparing user skills with requirements
  const enrichedRoles = useMemo(() => {
    return BENCHMARK_CAREER_ROLES.map((benchRole) => {
      // Check if backend returned a matching suggestion for this role
      const backendMatch = backendSuggestions.find(
        (b) => b.roleName?.toLowerCase().includes(benchRole.roleName.toLowerCase()) ||
               benchRole.roleName.toLowerCase().includes(b.roleName?.toLowerCase())
      );

      const matchedSkills = [];
      const missingSkills = [];

      benchRole.requiredSkills.forEach((reqSkill) => {
        const reqLower = reqSkill.toLowerCase();
        let isMatched = false;

        // Direct or fuzzy match against user skill list
        for (const userSk of userSkillStrings) {
          if (
            userSk.includes(reqLower) ||
            reqLower.includes(userSk) ||
            (reqLower.includes('aptitude') && userSk.includes('aptitude')) ||
            (reqLower.includes('communication') && userSk.includes('communication')) ||
            (reqLower.includes('teamwork') && userSk.includes('teamwork')) ||
            (reqLower.includes('react') && userSk.includes('react')) ||
            (reqLower.includes('java') && userSk.includes('java')) ||
            (reqLower.includes('python') && userSk.includes('python')) ||
            (reqLower.includes('sql') && (userSk.includes('sql') || userSk.includes('mysql') || userSk.includes('postgres')))
          ) {
            isMatched = true;
            break;
          }
        }

        // Also check if backend matched it
        if (backendMatch?.matchedSkills?.some((bm) => bm.toLowerCase().includes(reqLower))) {
          isMatched = true;
        }

        if (isMatched) {
          matchedSkills.push(reqSkill);
        } else {
          missingSkills.push(reqSkill);
        }
      });

      // Calculate fit percent
      let fitPercent = Math.round((matchedSkills.length / benchRole.requiredSkills.length) * 100);

      // If backend explicitly supplied fitPercent, blend or honor it
      if (backendMatch?.fitPercent != null && backendMatch.fitPercent > 0) {
        fitPercent = Math.max(fitPercent, backendMatch.fitPercent);
      }

      const isTarget = targetRole && targetRole.toLowerCase() === benchRole.roleName.toLowerCase();

      return {
        ...benchRole,
        fitPercent,
        matchedSkills,
        missingSkills,
        isTarget,
      };
    });
  }, [backendSuggestions, userSkillStrings, targetRole]);

  // 3. Handle setting Target Career Goal
  const handleSetTargetGoal = async (role) => {
    setSettingGoalFor(role.id);
    try {
      if (userId) {
        await studentAPI.updateProfile(userId, { targetRole: role.roleName });
      }
      setTargetRole(role.roleName);
      setGoalFeedback({
        type: 'success',
        message: `Goal Set: ${role.roleName} is now your primary career benchmark! Your roadmap and recommended corporate postings will calibrate around this target.`,
      });
      setTimeout(() => setGoalFeedback(null), 5000);
    } catch (err) {
      console.error('Failed to update target role:', err);
      setGoalFeedback({
        type: 'error',
        message: `Failed to set target goal: ${err.message}`,
      });
    } finally {
      setSettingGoalFor(null);
    }
  };

  // 4. Filtering and Sorting
  const filteredRoles = useMemo(() => {
    return enrichedRoles
      .filter((role) => {
        // Search Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = role.roleName.toLowerCase().includes(q);
          const matchesDomain = role.domain.toLowerCase().includes(q);
          const matchesDesc = role.description.toLowerCase().includes(q);
          const matchesSkills = role.requiredSkills.some((s) => s.toLowerCase().includes(q));
          if (!matchesName && !matchesDomain && !matchesDesc && !matchesSkills) return false;
        }

        // Domain Filter
        if (selectedDomain !== 'ALL' && role.domain !== selectedDomain) {
          return false;
        }

        // Fit Tier Filter
        if (selectedFitFilter === 'HIGH' && role.fitPercent < 70) return false;
        if (selectedFitFilter === 'MODERATE' && (role.fitPercent < 45 || role.fitPercent >= 70)) return false;
        if (selectedFitFilter === 'DEVELOPING' && role.fitPercent >= 45) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'FIT_DESC') return b.fitPercent - a.fitPercent;
        if (sortBy === 'FIT_ASC') return a.fitPercent - b.fitPercent;
        if (sortBy === 'ALPHA') return a.roleName.localeCompare(b.roleName);
        return 0;
      });
  }, [enrichedRoles, searchQuery, selectedDomain, selectedFitFilter, sortBy]);

  // Calculate high-level stats
  const bestRole = useMemo(() => {
    return [...enrichedRoles].sort((a, b) => b.fitPercent - a.fitPercent)[0];
  }, [enrichedRoles]);

  const totalVerifiedOrMatched = useMemo(() => {
    const allMatched = new Set();
    enrichedRoles.forEach((r) => r.matchedSkills.forEach((s) => allMatched.add(s)));
    return allMatched.size;
  }, [enrichedRoles]);

  const availableDomains = useMemo(() => {
    const doms = new Set(BENCHMARK_CAREER_ROLES.map((r) => r.domain));
    return ['ALL', ...Array.from(doms)];
  }, []);

  return (
    <div className="student-career-container pb-12">
      {/* 1. Hero Header Area with Glassmorphism */}
      <div className="career-hero-banner">
        <div className="career-hero-text">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
              <Compass size={20} />
            </span>
            <Badge variant="indigo" className="font-semibold text-xs">
              AI Role Fit Engine
            </Badge>
            {targetRole && (
              <Badge variant="emerald" className="hidden sm:inline-flex gap-1 items-center">
                <Target size={11} />
                <span>Target: {targetRole}</span>
              </Badge>
            )}
          </div>
          <h1 className="career-hero-title">AI Career Path Guidance & Role Compatibility</h1>
          <p className="career-hero-desc">
            Benchmark your verified technical, analytical, and soft skill competencies against enterprise hiring standards.
            Pinpoint exact missing qualifications and immediately bridge them via your tailored milestone roadmap.
          </p>
        </div>

        <div className="career-hero-actions flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectTab && onSelectTab('skills')}
            className="gap-1.5 bg-white/80 dark:bg-slate-900/80 shadow-sm"
          >
            <Award size={14} className="text-indigo-600" />
            <span>My Verified Skills</span>
          </Button>
          <Button
            variant="brand"
            size="sm"
            onClick={() => onSelectTab && onSelectTab('roadmap')}
            className="gap-1.5 shadow-sm"
          >
            <Zap size={14} />
            <span>Open Learning Roadmap</span>
          </Button>
        </div>
      </div>

      {/* Goal Update Feedback Alert */}
      {goalFeedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-sm transition-all duration-300 shadow-sm ${
            goalFeedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium">{goalFeedback.message}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setGoalFeedback(null)}
            className="h-7 text-xs hover:bg-transparent"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* 2. Top Metric Cards (Shadcn UI Card) */}
      <div className="career-kpi-grid">
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Benchmark Roles</span>
              <div className="p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
                <Briefcase size={16} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {BENCHMARK_CAREER_ROLES.length}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Corporate tech profiles tracked</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Top Role Compatibility</span>
              <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                <TrendingUp size={16} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {bestRole ? `${bestRole.fitPercent}%` : '0%'}
              </span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate max-w-[140px]">
                {bestRole?.roleName || 'None'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Highest alignment with verified credentials</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Acquired Competencies</span>
              <div className="p-1.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-600">
                <Award size={16} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {totalVerifiedOrMatched}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Skills currently powering career matches</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Primary Target Goal</span>
              <div className="p-1.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600">
                <Target size={16} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
              {targetRole || 'Not Selected'}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {targetRole ? 'Roadmap prioritized' : 'Click "Set as Goal" on any card'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Search, Domain Filters & Sort Controls Bar */}
      <Card className="border shadow-sm bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input
                type="text"
                placeholder="Search roles by title, domain or skill (e.g. React, Java, Cloud, AI)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 bg-white dark:bg-slate-950"
              />
            </div>

            {/* Filter Pills / Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1 mr-1">
                <Filter size={13} />
                <span>Fit Tier:</span>
              </span>
              <Button
                variant={selectedFitFilter === 'ALL' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFitFilter('ALL')}
                className="h-8 text-xs px-3"
              >
                All Roles ({enrichedRoles.length})
              </Button>
              <Button
                variant={selectedFitFilter === 'HIGH' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFitFilter('HIGH')}
                className="h-8 text-xs px-3 gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Optimal (&ge;70%)
              </Button>
              <Button
                variant={selectedFitFilter === 'MODERATE' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFitFilter('MODERATE')}
                className="h-8 text-xs px-3 gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                Promising (45-69%)
              </Button>
              <Button
                variant={selectedFitFilter === 'DEVELOPING' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFitFilter('DEVELOPING')}
                className="h-8 text-xs px-3 gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                Developing (&lt;45%)
              </Button>
            </div>

            {/* Domain Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="h-10 text-xs rounded-lg border border-input bg-background px-3 py-1.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-ring text-slate-700 dark:text-slate-200"
              >
                <option value="ALL">All Tech Domains</option>
                {availableDomains.filter((d) => d !== 'ALL').map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 text-xs rounded-lg border border-input bg-background px-3 py-1.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-ring text-slate-700 dark:text-slate-200"
              >
                <option value="FIT_DESC">Sort: Highest Fit</option>
                <option value="FIT_ASC">Sort: Lowest Fit</option>
                <option value="ALPHA">Sort: Alphabetical</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Role Cards Grid Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <RefreshCw size={32} className="animate-spin text-indigo-500 mb-3" />
          <p className="text-sm font-semibold">Running AI role alignment across verified skills...</p>
        </div>
      ) : filteredRoles.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <AlertTriangle size={36} className="text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No Career Roles Match Filters</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Try adjusting your search terms, domain selector, or fit level threshold to browse all available industry tracks.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedFitFilter('ALL');
              setSelectedDomain('ALL');
            }}
          >
            Reset All Filters
          </Button>
        </Card>
      ) : (
        <div className="career-roles-grid">
          {filteredRoles.map((role) => {
            const fit = role.fitPercent;
            const isHighFit = fit >= 70;
            const isModerateFit = fit >= 45 && fit < 70;
            const isTarget = role.isTarget;

            return (
              <Card
                key={role.id}
                className={`career-role-card flex flex-col justify-between transition-all duration-200 hover:shadow-lg border ${
                  isTarget
                    ? 'ring-2 ring-indigo-500 border-indigo-400 bg-gradient-to-b from-indigo-50/30 to-white dark:from-indigo-950/20 dark:to-slate-900'
                    : 'hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <div>
                  {/* Card Header with Icon, Title, and Fit Badge */}
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                          {renderDomainIcon(role.iconType)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                              {role.roleName}
                            </CardTitle>
                            {isTarget && (
                              <Badge variant="indigo" className="text-[10px] py-0 px-1.5 font-bold">
                                Active Goal
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-xs text-slate-500 mt-0.5">
                            {role.domain} &bull; {role.seniority}
                          </CardDescription>
                        </div>
                      </div>

                      {/* Compatibility Fit Pill */}
                      <Badge
                        variant={isHighFit ? 'emerald' : isModerateFit ? 'indigo' : 'amber'}
                        className="text-xs font-bold px-2.5 py-0.5 shrink-0 shadow-sm"
                      >
                        {fit}% Fit
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3.5">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-medium text-[11px]">Skill Alignment</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {role.matchedSkills.length} of {role.requiredSkills.length} Matched
                        </span>
                      </div>
                      <Progress
                        value={fit}
                        className={`h-2 ${
                          isHighFit
                            ? '[&>div]:bg-emerald-500'
                            : isModerateFit
                            ? '[&>div]:bg-indigo-600'
                            : '[&>div]:bg-amber-500'
                        }`}
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 pt-1 space-y-4">
                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {role.description}
                    </p>

                    {/* Market Metrics Strip */}
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Market Compensation</div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">{role.salaryRange}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Job Growth</div>
                        <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 justify-end">
                          <TrendingUp size={12} />
                          <span>{role.growthRate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Acquired Competencies */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 size={13} className="text-emerald-500" />
                          <span>Acquired Competencies ({role.matchedSkills.length})</span>
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {role.matchedSkills.map((sk) => (
                          <Badge
                            key={sk}
                            variant="emerald"
                            className="text-[11px] font-medium py-0.5 px-2 gap-1 rounded-md"
                          >
                            <Check size={11} className="text-emerald-600" />
                            <span>{sk}</span>
                          </Badge>
                        ))}
                        {role.matchedSkills.length === 0 && (
                          <span className="text-xs text-slate-400 italic">No verified competencies yet</span>
                        )}
                      </div>
                    </div>

                    {/* Missing Competencies / Skill Gaps */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                          <AlertCircle size={13} className="text-amber-500" />
                          <span>Target Missing Skills ({role.missingSkills.length})</span>
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {role.missingSkills.map((sk) => (
                          <Badge
                            key={sk}
                            variant="amber"
                            className="text-[11px] font-medium py-0.5 px-2 gap-1 rounded-md"
                          >
                            <span>+ {sk}</span>
                          </Badge>
                        ))}
                        {role.missingSkills.length === 0 && (
                          <Badge variant="emerald" className="text-xs py-0.5 px-2">
                            Fully Qualified Candidate!
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </div>

                {/* Card Footer Actions */}
                <CardFooter className="p-5 pt-3 border-t bg-slate-50/50 dark:bg-slate-900/40 flex flex-col gap-2.5">
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <Button
                      variant="brand"
                      size="sm"
                      onClick={() => onSelectTab && onSelectTab('roadmap')}
                      className="text-xs font-semibold gap-1 justify-center w-full"
                    >
                      <span>Bridge in Roadmap</span>
                      <ArrowRight size={13} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectTab && onSelectTab('assessment')}
                      className="text-xs font-semibold gap-1 justify-center w-full bg-white dark:bg-slate-900"
                    >
                      <Sparkles size={12} className="text-indigo-600" />
                      <span>Take Diagnostics</span>
                    </Button>
                  </div>

                  <Button
                    variant={isTarget ? 'secondary' : 'ghost'}
                    size="sm"
                    disabled={settingGoalFor === role.id || isTarget}
                    onClick={() => handleSetTargetGoal(role)}
                    className="w-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 flex items-center justify-center gap-1.5 h-8"
                  >
                    <Star size={13} className={isTarget ? 'text-amber-500 fill-amber-500' : 'text-slate-400'} />
                    <span>
                      {settingGoalFor === role.id
                        ? 'Setting Goal...'
                        : isTarget
                        ? 'Current Target Goal'
                        : 'Set as Primary Career Goal'}
                    </span>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
