import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Search,
  Briefcase,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { institutionAPI } from '../../services/api';

export default function InstitutionIndustryDemandTab({ currentUser, onSelectTab }) {
  const [isLoading, setIsLoading] = useState(true);
  const [macroTrends, setMacroTrends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    institutionAPI.getMacroIndustryDemand()
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data)) {
          setMacroTrends(data);
        } else if (data?.data && Array.isArray(data.data)) {
          setMacroTrends(data.data);
        } else {
          setMacroTrends([]);
        }
      })
      .catch((err) => {
        if (isMounted) setErrorMsg(err.message);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTrends = macroTrends.filter((t) =>
    (t.skillName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="institution-tab-container animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <TrendingUp className="text-emerald-500" size={24} />
            <span>Macro Industry Hiring Demand & Market Trends</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Real-time analytics aggregating corporate opportunity postings and employer candidate search criteria across the TalentOrbit platform.
          </p>
        </div>

        <Button
          variant="outline"
          className="font-semibold flex items-center gap-2 self-start md:self-auto"
          onClick={() => onSelectTab('skill_heatmap')}
        >
          <span>Compare Local Cohort Gaps</span>
        </Button>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Search Input */}
      <div className="mb-6 max-w-md relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Filter skills by keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
      </div>

      {/* Grid of Real Macro Trends */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent mb-3" />
          <div className="text-sm font-medium">Aggregating employer hiring demand from database...</div>
        </div>
      ) : filteredTrends.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
          <Briefcase size={36} className="mx-auto mb-2 text-slate-400 opacity-60" />
          <div className="font-semibold text-slate-800 dark:text-slate-200">No industry demand records match your query</div>
          <p className="text-xs text-slate-500 mt-1">Check back as new employer postings are published.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTrends.map((trend, idx) => {
            const isHighGrowth = trend.growthRate === 'UP_24' || trend.demandPercentage >= 50;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                      {trend.skillName}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        isHighGrowth
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                          : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                      }`}
                    >
                      <ArrowUpRight size={13} />
                      {isHighGrowth ? '+24% YoY Demand' : '+12% Sustained'}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                      <span>Corporate Hiring Share</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {trend.demandPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isHighGrowth ? 'bg-emerald-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, trend.demandPercentage))}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <Lightbulb size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>
                      {isHighGrowth
                        ? 'Prioritize for 6th/7th-semester electives or certified hackathon tracks.'
                        : 'Maintain foundational core curriculum alignment with lab practice.'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Affected students: <strong className="text-slate-800 dark:text-slate-200">{trend.affectedStudents || 0}</strong>
                  </span>
                  <button
                    type="button"
                    className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    onClick={() => onSelectTab('skill_heatmap')}
                  >
                    Check Gap &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
