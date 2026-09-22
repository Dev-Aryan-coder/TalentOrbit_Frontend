import React, { useState, useEffect } from 'react';
import {
  Layers,
  Search,
  Plus,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Tag,
  BarChart2,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { superAdminAPI } from '../../services/api';

export default function SuperAdminSkillsTab() {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal for adding a canonical master skill
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('TECHNICAL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusToast, setStatusToast] = useState(null);

  const fetchSkills = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await superAdminAPI.getMasterSkills();
      const list = Array.isArray(res) ? res : (res?.data || []);
      setSkills(list);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch Master Skills registry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    const trimmed = newSkillName.trim();
    if (!trimmed) {
      alert('Please enter a skill name.');
      return;
    }

    setIsSubmitting(true);
    try {
      await superAdminAPI.createMasterSkill({
        name: trimmed,
        category: newSkillCategory,
      });
      setStatusToast(`Canonical skill "${trimmed}" successfully registered!`);
      setIsModalOpen(false);
      setNewSkillName('');
      fetchSkills();
    } catch (err) {
      alert('Error creating skill: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatusToast(null), 4000);
    }
  };

  // Distinct categories
  const categories = ['ALL', ...Array.from(new Set(skills.map((s) => s.category).filter(Boolean)))];

  // Filter skills
  const filteredSkills = skills.filter((s) => {
    const catMatch = selectedCategory === 'ALL' || s.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const queryMatch = !q || s.name?.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q);
    return catMatch && queryMatch;
  });

  const totalDemand = skills.reduce((acc, curr) => acc + (curr.postingCount || 0), 0);
  const totalSupply = skills.reduce((acc, curr) => acc + (curr.studentCount || 0), 0);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto animate-fade-in">
      {/* Toast */}
      {statusToast && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <p className="text-sm font-semibold">{statusToast}</p>
          </div>
          <button
            onClick={() => setStatusToast(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-bold px-2 py-1 rounded"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center font-black">
              <Layers size={18} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Master Skill Taxonomy & Governance
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300">
              {skills.length} Canonical Skills
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Standardized national curriculum taxonomy mapping industry hiring demand directly to student credential acquisition.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSkills}
            disabled={isLoading}
            className="text-xs font-semibold gap-1.5"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
          >
            <Plus size={14} className="mr-1" />
            Add Canonical Skill
          </Button>
        </div>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Master Taxonomy Size</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{skills.length} Standards</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-[11px] font-bold text-violet-500 uppercase tracking-wider flex items-center gap-1">
            <Briefcase size={12} />
            Live Industry Postings Demand
          </div>
          <div className="text-2xl font-black text-violet-600 dark:text-violet-400 mt-1">{totalDemand} Citations</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
            <GraduationCap size={12} />
            Student Verifications Issued
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{totalSupply} Badges</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="md:col-span-5 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search taxonomy by skill name or category..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Categories */}
        <div className="md:col-span-7 flex flex-wrap items-center gap-1.5 justify-start md:justify-end">
          {categories.slice(0, 7).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <RefreshCw size={28} className="animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Loading master skill registry from database...
            </p>
          </div>
        ) : errorMsg ? (
          <div className="p-8 text-center">
            <AlertCircle size={32} className="text-rose-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{errorMsg}</p>
            <Button size="sm" variant="outline" onClick={fetchSkills} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="p-12 text-center">
            <Layers size={32} className="text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No skills match your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4">Canonical Skill Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 text-center">Industry Postings Demand</th>
                  <th className="py-3.5 px-4 text-center">Student Badges Acquired</th>
                  <th className="py-3.5 px-4 text-right">Alignment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredSkills.map((skill) => {
                  const pCount = skill.postingCount || 0;
                  const sCount = skill.studentCount || 0;
                  
                  let alignmentBadge = (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      Balanced
                    </span>
                  );
                  if (pCount > sCount) {
                    alignmentBadge = (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        High Industry Deficit
                      </span>
                    );
                  } else if (sCount > 0 && pCount === 0) {
                    alignmentBadge = (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                        Student Talent Pool
                      </span>
                    );
                  }

                  return (
                    <tr
                      key={skill.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-2">
                          <Tag size={14} className="text-indigo-500 flex-shrink-0" />
                          <span>{skill.name}</span>
                          <span className="text-[10px] font-normal text-slate-400">#SK-{skill.id}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {skill.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-violet-600 dark:text-violet-400">
                          <Briefcase size={12} />
                          {pCount} postings
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                          <GraduationCap size={12} />
                          {sCount} students
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {alignmentBadge}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Canonical Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Plus size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Register Canonical Master Skill
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">National Curriculum Standard</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSkill} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Canonical Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. Distributed Consensus (Raft), LangChain, PyTorch"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-100"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Parenthetical tags and whitespace are automatically normalized.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Skill Classification Category *
                </label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-100"
                >
                  <option value="TECHNICAL">TECHNICAL (Core Engineering & Software)</option>
                  <option value="SOFT_SKILLS">SOFT_SKILLS (Communication & Leadership)</option>
                  <option value="APTITUDE">APTITUDE (Quantitative, Reasoning & Verbal)</option>
                  <option value="DevOps & Cloud">DevOps & Cloud Infrastructure</option>
                  <option value="Database">Database & Distributed Storage</option>
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="Cybersecurity">Cybersecurity & Cryptography</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  {isSubmitting ? 'Saving...' : 'Create Master Skill'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
