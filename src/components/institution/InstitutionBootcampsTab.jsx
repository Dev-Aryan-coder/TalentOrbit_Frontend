import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  Users,
  Plus,
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Search,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { institutionAPI } from '../../services/api';
import { stripSkillTag } from '@/lib/skillCategories';

export default function InstitutionBootcampsTab({ currentUser, onSelectTab }) {
  const userId = currentUser?.id || currentUser?.userId || 1;

  const [isLoading, setIsLoading] = useState(true);
  const [bootcamps, setBootcamps] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [targetSkillId, setTargetSkillId] = useState('');
  const [programDate, setProgramDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(null);

  const fetchBootcamps = () => {
    setIsLoading(true);
    setErrorMsg(null);

    const aisheCode = currentUser?.aisheCode || 'C-33772';

    Promise.allSettled([
      institutionAPI.getTrainingPrograms(userId),
      institutionAPI.getSkillHeatmap(aisheCode),
    ]).then(([bootRes, heatRes]) => {
      if (bootRes.status === 'fulfilled' && bootRes.value) {
        if (Array.isArray(bootRes.value)) {
          setBootcamps(bootRes.value);
        } else if (bootRes.value?.data && Array.isArray(bootRes.value.data)) {
          setBootcamps(bootRes.value.data);
        }
      }
      if (heatRes.status === 'fulfilled' && heatRes.value) {
        const heatmapList = Array.isArray(heatRes.value)
          ? heatRes.value
          : (heatRes.value?.data || []);
        const extractedSkills = heatmapList
          .map((g) => ({
            id: g.skillId || g.id || g.skill?.id,
            name: stripSkillTag(g.skillName || g.skill?.name || g.name || 'Core Competency'),
            category: g.category || g.skill?.category || 'Skill Deficit',
            affectedStudents: g.affectedStudents || 0,
          }))
          .filter((s) => s.id && s.name);
        setSkillsList(extractedSkills);
      }
      setIsLoading(false);
    }).catch((err) => {
      setErrorMsg(err.message);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchBootcamps();
  }, [userId]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !programDate) return;

    setIsSubmitting(true);
    setSuccessNotice(null);

    try {
      const payload = {
        institutionUserId: userId,
        title: title.trim(),
        targetSkillId: targetSkillId ? parseInt(targetSkillId, 10) : null,
        programDate: programDate,
      };

      await institutionAPI.createTrainingProgram(payload);
      setSuccessNotice('Remedial Training Program successfully created in the database!');
      setTitle('');
      setTargetSkillId('');
      setProgramDate('');
      setIsCreateModalOpen(false);
      fetchBootcamps();
    } catch (err) {
      alert(`Failed to create program: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBootcamps = bootcamps.filter((b) =>
    (b.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.targetSkill?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="institution-tab-container animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <BookOpen className="text-indigo-600 dark:text-indigo-400" size={24} />
            <span>Remedial Training Programs & Bootcamps</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Targeted skill acceleration bootcamps scheduled by your institution to address verified student curriculum deficits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => onSelectTab('skill_heatmap')}
            className="font-semibold text-xs"
          >
            Inspect Deficits
          </Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={16} />
            <span>Schedule New Bootcamp</span>
          </Button>
        </div>
      </div>

      {successNotice && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 size={18} className="text-emerald-600" />
          <span>{successNotice}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Search Filter */}
      <div className="mb-6 max-w-md relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search bootcamps by title or skill..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
      </div>

      {/* Programs List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-16 text-center text-slate-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3" />
            <div className="text-sm font-medium">Fetching active and scheduled training programs from database...</div>
          </div>
        ) : filteredBootcamps.length === 0 ? (
          <div className="py-16 text-center text-slate-500 px-4">
            <BookOpen size={42} className="mx-auto mb-3 text-slate-400 opacity-60" />
            <div className="font-bold text-base text-slate-800 dark:text-slate-200">
              No Remedial Bootcamps Scheduled Yet
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
              Use the Skill Deficit Heatmap to launch 1-click targeted bootcamps for skills with negative student supply gaps.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectTab('skill_heatmap')}
                className="text-xs font-semibold"
              >
                Go to Skill Heatmap
              </Button>
              <Button
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
                className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                Create Program Manually
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="institution-table">
              <thead>
                <tr>
                  <th>Bootcamp Program Title</th>
                  <th>Target Skill</th>
                  <th>Commencement Date</th>
                  <th>Enrolled Students</th>
                  <th>Lifecycle Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBootcamps.map((prog, idx) => (
                  <tr key={prog.id || idx}>
                    <td>
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {prog.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        Program ID: #{prog.id}
                      </div>
                    </td>
                    <td>
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                        {prog.targetSkill?.name || 'General Skill Acceleration'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{prog.programDate || 'TBD'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-bold">
                        <Users size={14} className="text-indigo-500" />
                        <span>{prog.studentsRegistered || 0} enrolled</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          prog.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : prog.status === 'ONGOING'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                        }`}
                      >
                        <Clock size={12} />
                        {prog.status || 'PLANNED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Schedule Bootcamp Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl relative">
            <button
              type="button"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setIsCreateModalOpen(false)}
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Plus size={22} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  Schedule Remedial Bootcamp
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Create a verified institutional training session to upskill your cohort.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Bootcamp Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full-Stack Docker & Cloud Native Intensive"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Curriculum Skill
                </label>
                <select
                  value={targetSkillId}
                  onChange={(e) => setTargetSkillId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">-- Select Master Skill --</option>
                  {skillsList.map((sk) => (
                    <option key={sk.id} value={sk.id}>
                      {sk.name} ({sk.category || 'General'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Commencement Date
                </label>
                <input
                  type="date"
                  required
                  value={programDate}
                  onChange={(e) => setProgramDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  {isSubmitting ? 'Saving to Database...' : 'Create Bootcamp'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
