import React, { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  Sparkles,
  X,
  Trash2,
  PauseCircle,
  PlayCircle,
  ArrowUpRight,
} from 'lucide-react';
import { recruiterAPI, postingsAPI } from '../../services/api';
import './RecruiterPostingsTab.css';

const PRESET_SKILLS = [
  'Java',
  'Spring Boot',
  'React',
  'JavaScript',
  'TypeScript',
  'Python',
  'MySQL',
  'PostgreSQL',
  'Docker',
  'Kubernetes',
  'AWS',
  'REST APIs',
  'Tailwind CSS',
  'Node.js',
  'Git',
  'Data Structures',
];

export default function RecruiterPostingsTab({ currentUser, onSelectTab, onNavigateToAtsWithPosting }) {
  const companyId = currentUser?.companyId || currentUser?.id || 2;
  const companyName = currentUser?.companyName || currentUser?.fullName || currentUser?.email?.split('@')[0] || 'Enterprise';

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [postings, setPostings] = useState([]);

  // Form State for Creating New Posting
  const [formData, setFormData] = useState({
    title: '',
    type: 'JOB',
    department: '',
    location: '',
    compensation: '',
    deadline: '',
    minCgpa: 6.0,
    eligibleBatches: '',
    description: '',
    mandatorySkills: [],
    preferredSkills: [],
  });

  const [previewCandidateCount, setPreviewCandidateCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadPostings() {
      try {
        const res = await recruiterAPI.getCompanyPostings(companyId);
        if (!isMounted) return;

        if (Array.isArray(res)) {
          const mapped = res.map((p) => ({
            id: p.id,
            title: p.title,
            type: p.postingType || p.type || 'JOB',
            department: p.department || '',
            location: p.location || '',
            compensation: p.stipend || p.stipendAmount || p.compensation || '',
            deadline: p.deadline || '',
            minCgpa: p.minCgpa ?? 0,
            eligibleBatches: p.eligibleBatches || '',
            status: p.isActive !== false ? 'ACTIVE' : 'PAUSED',
            applicantCount: p.applicantCount ?? p.applicationsCount ?? 0,
            shortlistedCount: p.shortlistedCount ?? 0,
            mandatorySkills: Array.isArray(p.mandatorySkills) ? p.mandatorySkills : Array.isArray(p.requiredSkills) ? p.requiredSkills : [],
            preferredSkills: Array.isArray(p.preferredSkills) ? p.preferredSkills : [],
            description: p.description || '',
          }));
          setPostings(mapped);
        } else {
          setPostings([]);
        }
      } catch (err) {
        console.error('Failed to fetch postings from backend:', err);
        setPostings([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPostings();

    return () => {
      isMounted = false;
    };
  }, [companyId]);

  const handleToggleStatus = (id) => {
    setPostings((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const handleDeletePosting = (id) => {
    if (window.confirm('Are you sure you want to archive this opportunity posting?')) {
      setPostings((prev) => prev.filter((p) => p.id !== id));
      recruiterAPI.deletePosting(id).catch((err) => console.warn('Server delete note:', err.message));
    }
  };

  const handleCreatePostingSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please provide an opportunity title.');
      return;
    }

    const newPosting = {
      id: Date.now(),
      companyId,
      companyName,
      title: formData.title,
      type: formData.type,
      department: formData.department,
      location: formData.location,
      compensation: formData.compensation,
      deadline: formData.deadline,
      minCgpa: parseFloat(formData.minCgpa) || 7.0,
      eligibleBatches: formData.eligibleBatches,
      status: 'ACTIVE',
      applicantCount: 0,
      shortlistedCount: 0,
      mandatorySkills: formData.mandatorySkills,
      preferredSkills: formData.preferredSkills,
      description: formData.description || 'Opportunity created via TalentOrbit Recruiter Portal.',
    };

    setPostings([newPosting, ...postings]);
    setShowCreateModal(false);

    try {
      await recruiterAPI.createPosting(newPosting);
    } catch (err) {
      console.warn('Backend posting persist fallback:', err.message);
    }
  };

  const handleToggleSkill = (skill, listType) => {
    setFormData((prev) => {
      const currentList = prev[listType];
      const exists = currentList.includes(skill);
      const updatedList = exists
        ? currentList.filter((s) => s !== skill)
        : [...currentList, skill];

      // Query real backend match count
      recruiterAPI
        .previewMatchCount({
          mandatorySkills: listType === 'mandatorySkills' ? updatedList : prev.mandatorySkills,
          minCgpa: prev.minCgpa,
        })
        .then((res) => {
          if (res && typeof res.matchCount === 'number') {
            setPreviewCandidateCount(res.matchCount);
          } else if (typeof res === 'number') {
            setPreviewCandidateCount(res);
          }
        })
        .catch(() => {});

      return { ...prev, [listType]: updatedList };
    });
  };

  const filteredPostings = postings.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'ALL' || p.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="recruiter-postings-space space-y-6 pb-12">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Opportunity & Opening Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure weighted technical criteria, monitor application volume, and manage corporate hiring postings.
          </p>
        </div>

        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md shadow-blue-600/30 gap-1.5 self-start sm:self-auto"
        >
          <Plus size={16} /> Create Opportunity
        </Button>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job title, department, or location..."
            className="pl-9 h-9 text-xs border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="ALL">All Types</option>
            <option value="JOB">Full-Time Jobs</option>
            <option value="INTERNSHIP">Internships</option>
            <option value="FDP">Faculty Programs (FDP)</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
          </select>
        </div>
      </div>

      {/* 3. Postings Grid */}
      {filteredPostings.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Briefcase size={36} className="mx-auto text-slate-300 dark:text-slate-700 mb-2" />
          <h3 className="font-bold text-slate-800 dark:text-white text-base">No Opportunities Listed Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click "Create Opportunity" above to publish your first verified corporate opening.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredPostings.map((posting) => (
            <Card
              key={posting.id}
              className={`border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between ${
                posting.status === 'PAUSED' ? 'opacity-70 bg-slate-50/50 dark:bg-slate-900/50' : 'bg-white dark:bg-slate-950'
              }`}
            >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      className={`text-[10px] font-semibold uppercase tracking-wider ${
                        posting.type === 'JOB'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200'
                          : posting.type === 'INTERNSHIP'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200'
                      }`}
                    >
                      {posting.type}
                    </Badge>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                      {posting.department}
                    </span>
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                    {posting.title}
                  </CardTitle>
                </div>

                <Badge
                  variant="outline"
                  className={`text-[11px] font-semibold shrink-0 ${
                    posting.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                  }`}
                >
                  {posting.status}
                </Badge>
              </div>

              <CardDescription className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                {posting.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 pb-3">
              {/* Meta details */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin size={13} className="text-slate-400 shrink-0" />
                  <span className="truncate">{posting.location}</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 truncate">
                  <DollarSign size={13} className="text-emerald-500 shrink-0" />
                  <span className="truncate">{posting.compensation}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <GraduationCap size={13} className="text-slate-400 shrink-0" />
                  <span>Min CGPA: {posting.minCgpa || 'No Cutoff'}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Clock size={13} className="text-slate-400 shrink-0" />
                  <span>Deadline: {posting.deadline}</span>
                </div>
              </div>

              {/* Skills required */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Required Competencies:
                </span>
                <div className="flex flex-wrap gap-1">
                  {(posting.mandatorySkills || []).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40"
                    >
                      ★ {s}
                    </span>
                  ))}
                  {(posting.preferredSkills || []).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-slate-900 dark:text-white font-bold">
                  <Users size={14} className="text-blue-600" />
                  <span>{posting.applicantCount}</span>
                  <span className="text-[11px] font-normal text-slate-500">applicants</span>
                </div>
                <div className="text-purple-600 dark:text-purple-400 font-semibold text-xs">
                  {posting.shortlistedCount} shortlisted
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleStatus(posting.id)}
                  className="h-8 text-xs px-2.5 text-slate-600 dark:text-slate-300"
                  title={posting.status === 'ACTIVE' ? 'Pause applications' : 'Resume applications'}
                >
                  {posting.status === 'ACTIVE' ? <PauseCircle size={14} /> : <PlayCircle size={14} />}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeletePosting(posting.id)}
                  className="h-8 text-xs px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  title="Delete opening"
                >
                  <Trash2 size={14} />
                </Button>

                <Button
                  size="sm"
                  onClick={() => {
                    if (onNavigateToAtsWithPosting) onNavigateToAtsWithPosting(posting.id);
                    else onSelectTab('ats');
                  }}
                  className="h-8 text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold gap-1 px-3"
                >
                  Screen ATS <ArrowUpRight size={13} />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      )}

      {/* 4. Create Opportunity Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 p-5 flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
                  <Briefcase size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Publish New Opportunity
                  </h2>
                  <p className="text-xs text-slate-500">
                    Define weighted skill tags for automated semantic ATS scoring.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePostingSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Opportunity Title *</label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Full Stack Cloud Developer"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Opportunity Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <option value="JOB">Full-Time Job</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="TRAINING">Corporate Training</option>
                    <option value="FDP">Faculty Development Program (FDP)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Department / Domain</label>
                  <Input
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Platform Engineering"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Pune / Hybrid"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Compensation / Stipend</label>
                  <Input
                    value={formData.compensation}
                    onChange={(e) => setFormData({ ...formData, compensation: e.target.value })}
                    placeholder="e.g. ₹12.0 LPA or ₹35,000/mo"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Application Deadline</label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Min CGPA Cutoff</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.minCgpa}
                    onChange={(e) => setFormData({ ...formData, minCgpa: e.target.value })}
                    placeholder="e.g. 7.5"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Eligible Batches</label>
                  <Input
                    value={formData.eligibleBatches}
                    onChange={(e) => setFormData({ ...formData, eligibleBatches: e.target.value })}
                    placeholder="e.g. 2025, 2026"
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {/* Mandatory Skills Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 dark:text-white">
                    ★ Mandatory Core Skills (High Weightage in ATS Match)
                  </label>
                  <span className="text-[11px] text-blue-600 font-semibold">
                    {formData.mandatorySkills.length} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_SKILLS.map((skill) => {
                    const isSelected = formData.mandatorySkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => handleToggleSkill(skill, 'mandatorySkills')}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Skills Selector */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 dark:text-white">
                    Preferred / Good-to-Have Skills
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {formData.preferredSkills.length} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_SKILLS.map((skill) => {
                    const isSelected = formData.preferredSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => handleToggleSkill(skill, 'preferredSkills')}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Candidate Pool Preview */}
              <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-blue-600 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    Estimated Available Candidates in University Network:
                  </span>
                </div>
                <span className="font-extrabold text-sm text-blue-700 dark:text-blue-300 font-mono">
                  ~{previewCandidateCount} Students
                </span>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Description & Responsibilities</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summarize the core technical expectations, project scope, and perks..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30"
                >
                  Publish to Student Ecosystem
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
