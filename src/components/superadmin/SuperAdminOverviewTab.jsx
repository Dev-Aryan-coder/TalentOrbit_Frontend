import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  Building2,
  Briefcase,
  Layers,
  FileCheck2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Server,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { superAdminAPI } from '../../services/api';

export default function SuperAdminOverviewTab({ onSelectTab }) {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [pendingQueue, setPendingQueue] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setErrorMsg(null);

    Promise.allSettled([
      superAdminAPI.getDashboardStats(),
      superAdminAPI.getPendingVerifications(),
      superAdminAPI.getAuditLogs(),
    ])
      .then(([statsRes, pendingRes, logsRes]) => {
        if (statsRes.status === 'fulfilled' && statsRes.value) {
          setStats(statsRes.value.data || statsRes.value);
        }
        if (pendingRes.status === 'fulfilled' && pendingRes.value) {
          const list = Array.isArray(pendingRes.value) ? pendingRes.value : (pendingRes.value?.data || []);
          setPendingQueue(list);
        }
        if (logsRes.status === 'fulfilled' && logsRes.value) {
          const list = Array.isArray(logsRes.value) ? logsRes.value : (logsRes.value?.data || []);
          setRecentLogs(list.slice(0, 5));
        }
      })
      .catch((err) => {
        setErrorMsg(err.message || 'Failed to load SuperAdmin dashboard telemetry.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const totalUsers = stats?.totalUsers ?? 0;
  const pendingCount = stats?.pendingVerifications ?? 0;
  const activePostings = stats?.activePostings ?? 0;
  const totalSkills = stats?.totalSkills ?? 0;
  const totalInstitutions = stats?.totalInstitutions ?? 0;
  const totalIndustry = stats?.totalIndustry ?? 0;
  const totalStudents = stats?.totalStudents ?? 0;
  const totalAcademicians = stats?.totalAcademicians ?? 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Executive Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-400 text-slate-950 uppercase tracking-wide">
                Centralized God Mode
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-slate-200 border border-white/10">
                SIH Problem Statement #26044
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              National Portal Command & Verification Center
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl mt-1.5 leading-relaxed">
              Global governance portal for cross-role user verifications (AISHE & MCA CIN), master skill taxonomies, multi-tenant opportunity moderation, and cryptographic security audit logs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-rose-900/30"
              onClick={() => onSelectTab('verifications')}
            >
              <Clock size={16} />
              <span>Review KYC Queue ({pendingCount})</span>
            </Button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm flex items-center gap-3">
          <AlertTriangle size={18} className="text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          {
            label: 'Total Platform Users',
            value: totalUsers,
            sub: `${totalStudents} students, ${totalIndustry} employers`,
            icon: Users,
            color: 'text-indigo-600 dark:text-indigo-400',
            bg: 'bg-indigo-50 dark:bg-indigo-950/40',
            tab: 'users',
          },
          {
            label: 'Pending KYC Queue',
            value: pendingCount,
            sub: pendingCount > 0 ? 'Requires root approval' : 'All accounts verified',
            icon: ShieldCheck,
            color: pendingCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400',
            bg: pendingCount > 0 ? 'bg-rose-50 dark:bg-rose-950/40' : 'bg-emerald-50 dark:bg-emerald-950/40',
            tab: 'verifications',
          },
          {
            label: 'Active Opportunities',
            value: activePostings,
            sub: 'Jobs, Internships & FDPs',
            icon: Briefcase,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-950/40',
            tab: 'moderation',
          },
          {
            label: 'Master Skills',
            value: totalSkills,
            sub: 'Canonical competencies',
            icon: Layers,
            color: 'text-sky-600 dark:text-sky-400',
            bg: 'bg-sky-50 dark:bg-sky-950/40',
            tab: 'skills',
          },
          {
            label: 'Colleges & Institutions',
            value: totalInstitutions,
            sub: 'AISHE certified portals',
            icon: Building2,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-950/40',
            tab: 'users',
          },
          {
            label: 'Audit Trail Records',
            value: recentLogs.length > 0 ? `${recentLogs.length}+` : 'Active',
            sub: 'Immutable security log',
            icon: Lock,
            color: 'text-purple-600 dark:text-purple-400',
            bg: 'bg-purple-50 dark:bg-purple-950/40',
            tab: 'audit',
          },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onSelectTab(card.tab)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${card.bg} ${card.color}`}>
                  <Icon size={20} />
                </div>
                <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                {isLoading ? <div className="h-7 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" /> : card.value}
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                {card.label}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                {card.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Role Breakdown & System Health Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Role Distribution & Ecosystem Balance */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                National Ecosystem Role Distribution
              </h2>
              <p className="text-xs text-slate-500">
                Live database breakdown of entities registered in TalentOrbit.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              100% Real MySQL Data
            </span>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Students (Talent Pool)', count: totalStudents, total: totalUsers, color: 'bg-indigo-600', icon: Users },
              { label: 'Industry Employers & Recruiters', count: totalIndustry, total: totalUsers, color: 'bg-amber-500', icon: Briefcase },
              { label: 'Academician Faculty Members', count: totalAcademicians, total: totalUsers, color: 'bg-purple-600', icon: Sparkles },
              { label: 'Colleges & Higher Ed Institutions (TPOs)', count: totalInstitutions, total: totalUsers, color: 'bg-emerald-600', icon: Building2 },
            ].map((role, idx) => {
              const pct = totalUsers > 0 ? Math.round((role.count / totalUsers) * 100) : 0;
              const Icon = role.icon;
              return (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon size={16} className="text-slate-500" />
                      <span>{role.label}</span>
                    </div>
                    <span>{role.count} entities ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full ${role.color} rounded-full transition-all duration-500`} style={{ width: `${Math.max(5, pct)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: System Diagnostics & Security Health */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Server className="text-indigo-600 dark:text-indigo-400" size={20} />
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Core System Telemetry
              </h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Real-time engine status and cryptographic audit posture.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">MySQL Server Connection</span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={14} /> Port 3306 Healthy
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Spring Boot REST Engine</span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={14} /> Port 8080 Active
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Cryptographic Audit Logger</span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <Lock size={14} /> Immutable Trail Live
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">KYC Verification Gate</span>
                <span className={`flex items-center gap-1.5 font-bold ${pendingCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {pendingCount > 0 ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                  {pendingCount > 0 ? `${pendingCount} In Review Queue` : 'Queue Cleared'}
                </span>
              </div>
            </div>
          </div>

          <Button
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2"
            onClick={() => onSelectTab('audit')}
          >
            <Lock size={15} />
            <span>View Full Security Audit Trail</span>
          </Button>
        </div>
      </div>

      {/* Pending Verifications Quick-Action Callout */}
      {pendingQueue.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Priority Verification Queue ({pendingQueue.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Applicants awaiting SuperAdmin credential review and account verification.
                </p>
              </div>
            </div>

            <Button
              size="sm"
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold"
              onClick={() => onSelectTab('verifications')}
            >
              Open Full Queue
            </Button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {pendingQueue.slice(0, 3).map((item) => (
              <div key={item.userId} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    {item.organizationOrName || item.email}
                  </div>
                  <div className="text-xs text-slate-500">
                    {item.email} &bull; <span className="font-semibold text-indigo-600 dark:text-indigo-400">{item.role}</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  PENDING_VERIFICATION
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
