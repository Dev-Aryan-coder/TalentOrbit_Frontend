import React, { useState, useEffect } from 'react';
import {
  Layers,
  Search,
  Filter,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
  ArrowRight,
  Clock,
  X,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { institutionAPI } from '../../services/api';
import { stripSkillTag } from '@/lib/skillCategories';
import './InstitutionSkillHeatmapTab.css';

export default function InstitutionSkillHeatmapTab({
  currentUser,
  onSelectTab,
}) {
  const userId = currentUser?.id || currentUser?.userId || 1;

  const [isLoading, setIsLoading] = useState(true);
  const [skillGaps, setSkillGaps] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [errorMsg, setErrorMsg] = useState(null);

  // Modal State for 1-Click Launch Bootcamp
  const [selectedSkillForBootcamp, setSelectedSkillForBootcamp] = useState(null);
  const [bootcampTitle, setBootcampTitle] = useState('');
  const [bootcampDate, setBootcampDate] = useState('');
  const [isSubmittingBootcamp, setIsSubmittingBootcamp] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);

  const fetchHeatmap = () => {
    setIsLoading(true);
    setErrorMsg(null);

    institutionAPI.getInstitutionDetails(userId)
      .then((prof) => {
        const aisheCode = prof?.aisheCode || currentUser?.aisheCode || 'C-33772';
        return institutionAPI.getSkillHeatmap(aisheCode);
      })
      .then((res) => {
        if (Array.isArray(res)) {
          setSkillGaps(res);
        } else if (res?.data && Array.isArray(res.data)) {
          setSkillGaps(res.data);
        } else {
          setSkillGaps([]);
        }
      })
      .catch((err) => {
        setErrorMsg(err.message || 'Could not fetch skill heatmap.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchHeatmap();
  }, [userId, currentUser]);

  const handleOpenBootcampModal = (gap) => {
    const clean = stripSkillTag(gap.skillName || '');
    const netGap = gap.deficitPercentage ?? gap.netDeficitPercentage ?? gap.gapPercentage ?? 0;
    setSelectedSkillForBootcamp({ ...gap, cleanSkillName: clean, displayGap: netGap });
    setBootcampTitle(`${clean} Industry-Ready Remedial Bootcamp`);
    // Default scheduled date to 7 days from now
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setBootcampDate(nextWeek.toISOString().split('T')[0]);
    setActionSuccessMsg(null);
  };

  const handleScheduleBootcampSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSkillForBootcamp || !bootcampDate) return;

    setIsSubmittingBootcamp(true);
    setActionSuccessMsg(null);

    try {
      const payload = {
        institutionId: userId,
        scheduledDate: bootcampDate,
      };

      const skillId = selectedSkillForBootcamp.skillId || selectedSkillForBootcamp.id || 1;
      await institutionAPI.scheduleRemedialTraining(skillId, payload);

      const displayName = selectedSkillForBootcamp.cleanSkillName || selectedSkillForBootcamp.skillName;
      setActionSuccessMsg(`Bootcamp successfully registered and scheduled for ${displayName}!`);
      setTimeout(() => {
        setSelectedSkillForBootcamp(null);
        if (onSelectTab) onSelectTab('bootcamps');
      }, 1400);
    } catch (err) {
      alert(`Error scheduling bootcamp: ${err.message}`);
    } finally {
      setIsSubmittingBootcamp(false);
    }
  };

  // Filter skills based on search & severity
  const filteredSkills = skillGaps.filter((g) => {
    const clean = stripSkillTag(g.skillName || '');
    const nameMatch = clean.toLowerCase().includes(searchQuery.toLowerCase());
    const gapVal = g.deficitPercentage ?? g.netDeficitPercentage ?? g.gapPercentage ?? 0;

    if (!nameMatch) return false;

    if (filterSeverity === 'CRITICAL') return gapVal >= 25;
    if (filterSeverity === 'MODERATE') return gapVal > 0 && gapVal < 25;
    if (filterSeverity === 'BALANCED') return gapVal <= 0;

    return true;
  });

  return (
    <div className="institution-tab-container animate-fade-in">
      {/* Header & SIH Overview */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
              <Layers className="text-indigo-600 dark:text-indigo-400" size={24} />
              <span>Skill Deficit Heatmap (Demand vs Supply)</span>
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              SIH Problem Statement #26044
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
            Live comparison matrix cross-referencing industry opportunity skill requirements with your verified student assessment scores. Launch 1-click remedial bootcamps to eliminate critical curriculum gaps.
          </p>
        </div>

        <Button
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2 self-start md:self-auto"
          onClick={() => onSelectTab('bootcamps')}
        >
          <Clock size={16} />
          <span>View Active Bootcamps</span>
        </Button>
      </div>

      {actionSuccessMsg && (
        <div className="mb-5 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 size={18} className="text-emerald-600" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-5 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm flex items-center gap-3">
          <AlertTriangle size={18} className="text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search skill (e.g. Docker, Python, React)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Skills' },
            { id: 'CRITICAL', label: 'Critical Deficit (≥25%)' },
            { id: 'MODERATE', label: 'Moderate Deficit (<25%)' },
            { id: 'BALANCED', label: 'Balanced / Surplus' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterSeverity === f.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              onClick={() => setFilterSeverity(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Data Table (100% Real REST Data) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-16 text-center text-slate-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3" />
            <div className="text-sm font-medium">Computing demand vs supply deficit matrix from live database...</div>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="py-16 text-center text-slate-500 px-4">
            <CheckCircle2 size={40} className="mx-auto mb-3 text-emerald-500 opacity-80" />
            <div className="font-semibold text-base text-slate-800 dark:text-slate-200">No skill gaps match the selected criteria</div>
            <p className="text-xs text-slate-500 mt-1">Try switching filters or adjusting your search term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="institution-table">
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>Skill Name</th>
                  <th style={{ width: '28%' }}>Demand vs Supply Comparison</th>
                  <th style={{ width: '15%' }}>Net Gap %</th>
                  <th style={{ width: '15%' }}>Affected Students</th>
                  <th style={{ width: '20%' }}>1-Click Remedial Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSkills.map((gap, idx) => {
                  const cleanName = stripSkillTag(gap.skillName || 'Competency');
                  const demand = gap.demandPercentage || 0;
                  const supply = gap.supplyPercentage ?? gap.studentPercentage ?? 0;
                  const netGap = gap.deficitPercentage ?? gap.netDeficitPercentage ?? gap.gapPercentage ?? 0;
                  const isCritical = netGap >= 25;
                  const isModerate = netGap > 0 && netGap < 25;

                  return (
                    <tr key={gap.skillId || idx}>
                      <td>
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {cleanName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {gap.recommendedAction || (isCritical ? 'Immediate Bootcamp Recommended' : 'Routine Curriculum Alignment')}
                        </div>
                      </td>

                      <td>
                        <div className="heatmap-comparison-bar">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-indigo-600 dark:text-indigo-400">Industry Demand: {demand}%</span>
                            <span className="text-emerald-600 dark:text-emerald-400">Student Supply: {supply}%</span>
                          </div>
                          {/* Demand Track */}
                          <div className="heatmap-bar-track" title={`Demand: ${demand}%`}>
                            <div
                              className="heatmap-bar-fill-demand"
                              style={{ width: `${Math.min(100, Math.max(0, demand))}%` }}
                            />
                          </div>
                          {/* Supply Track */}
                          <div className="heatmap-bar-track" title={`Supply: ${supply}%`}>
                            <div
                              className="heatmap-bar-fill-supply"
                              style={{ width: `${Math.min(100, Math.max(0, supply))}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td>
                        {netGap > 0 ? (
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold ${
                              isCritical ? 'skill-gap-badge-critical' : 'skill-gap-badge-moderate'
                            }`}
                          >
                            -{netGap}% Deficit
                          </span>
                        ) : supply > demand ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold skill-gap-badge-balanced">
                            Surplus (+{supply - demand}%)
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold skill-gap-badge-balanced">
                            Balanced (0%)
                          </span>
                        )}
                      </td>

                      <td>
                        {gap.affectedStudents > 0 ? (
                          <>
                            <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                              {gap.affectedStudents} {gap.affectedStudents === 1 ? 'student' : 'students'}
                            </div>
                            <div className="text-[11px] text-rose-500 font-medium">
                              Lacking verified badge
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-1">
                              <CheckCircle2 size={14} className="text-emerald-500" />
                              <span>100% Verified</span>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Cohort requirement met
                            </div>
                          </>
                        )}
                      </td>

                      <td>
                        {gap.affectedStudents > 0 && netGap > 0 ? (
                          <Button
                            size="sm"
                            className={`text-xs font-bold shadow-sm flex items-center gap-1.5 ${
                              isCritical
                                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                            }`}
                            onClick={() => handleOpenBootcampModal(gap)}
                          >
                            <Zap size={14} />
                            <span>1-Click Launch Bootcamp</span>
                          </Button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 size={13} className="text-emerald-500" />
                            <span>Benchmark Met</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 1-Click Launch Bootcamp Scheduling Modal */}
      {selectedSkillForBootcamp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl relative">
            <button
              type="button"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setSelectedSkillForBootcamp(null)}
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Zap size={22} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  Launch Remedial Bootcamp
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Instantly schedule a remedial training program targeted at {selectedSkillForBootcamp.affectedStudents} deficit students.
                </p>
              </div>
            </div>

            <form onSubmit={handleScheduleBootcampSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Skill
                </label>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm text-indigo-600 dark:text-indigo-400">
                  {selectedSkillForBootcamp.cleanSkillName || selectedSkillForBootcamp.skillName} (Current Net Deficit: -{selectedSkillForBootcamp.displayGap ?? selectedSkillForBootcamp.deficitPercentage ?? selectedSkillForBootcamp.gapPercentage ?? 0}%)
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Bootcamp Program Title
                </label>
                <input
                  type="text"
                  required
                  value={bootcampTitle}
                  onChange={(e) => setBootcampTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Scheduled Commencement Date
                </label>
                <input
                  type="date"
                  required
                  value={bootcampDate}
                  onChange={(e) => setBootcampDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                />
              </div>

              <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-800 dark:text-indigo-300 flex items-start gap-2">
                <Info size={16} className="flex-shrink-0 mt-0.5 text-indigo-600" />
                <span>
                  This action will create an official <strong>TrainingProgram</strong> record in the database. All {selectedSkillForBootcamp.affectedStudents} students with this skill deficit will receive notifications on their roadmap.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedSkillForBootcamp(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingBootcamp}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  {isSubmittingBootcamp ? 'Registering in DB...' : 'Confirm & Launch Bootcamp'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
