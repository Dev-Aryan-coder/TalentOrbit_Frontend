import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Search,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  MapPin,
  Users,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  Briefcase,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { superAdminAPI } from '../../services/api';

export default function SuperAdminModerationTab() {
  const [postings, setPostings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedType, setSelectedType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [statusToast, setStatusToast] = useState(null);

  const fetchPostings = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await superAdminAPI.getAllPostings();
      const list = Array.isArray(res) ? res : (res?.data || []);
      setPostings(list);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch postings for moderation.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostings();
  }, []);

  const handleToggleActive = async (item) => {
    const nextState = !item.isActive;
    const action = nextState ? 'ACTIVATE (PUBLISH)' : 'SUPPRESS (DELIST)';
    if (!window.confirm(`Are you sure you want to ${action} opportunity "${item.title}"?`)) {
      return;
    }

    setProcessingId(item.id);
    try {
      await superAdminAPI.togglePostingActive(item.id);
      setStatusToast(`Posting #${item.id} moderation status changed to ${nextState ? 'ACTIVE' : 'INACTIVE'}.`);
      fetchPostings();
    } catch (err) {
      alert('Error toggling posting moderation state: ' + (err.message || 'Unknown error'));
    } finally {
      setProcessingId(null);
      setTimeout(() => setStatusToast(null), 4000);
    }
  };

  const types = [
    'ALL',
    'INTERNSHIP',
    'JOB',
    'RESEARCH',
    'TRAINING',
    'FDP',
    'WORKSHOP',
    'CONSULTANCY',
  ];

  // Filter postings
  const filteredPostings = postings.filter((p) => {
    const typeMatch = selectedType === 'ALL' || p.type?.toUpperCase() === selectedType;
    const q = searchQuery.toLowerCase().trim();
    const queryMatch =
      !q ||
      p.title?.toLowerCase().includes(q) ||
      p.companyName?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q) ||
      String(p.id).includes(q);
    return typeMatch && queryMatch;
  });

  const activeCount = postings.filter((p) => p.isActive).length;
  const suppressedCount = postings.filter((p) => !p.isActive).length;

  const getTypeBadge = (type) => {
    switch (type?.toUpperCase()) {
      case 'INTERNSHIP':
        return <Badge variant="secondary" className="bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300">INTERNSHIP</Badge>;
      case 'RESEARCH':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300">RESEARCH</Badge>;
      case 'FDP':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">FDP</Badge>;
      case 'TRAINING':
        return <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300">TRAINING</Badge>;
      case 'WORKSHOP':
        return <Badge variant="secondary" className="bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300">WORKSHOP</Badge>;
      case 'CONSULTANCY':
        return <Badge variant="secondary" className="bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300">CONSULTANCY</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto animate-fade-in">
      {/* Toast */}
      {statusToast && (
        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <p className="text-sm font-semibold">{statusToast}</p>
          </div>
          <button
            onClick={() => setStatusToast(null)}
            className="text-xs text-indigo-700 hover:text-indigo-900 font-bold px-2 py-1 rounded"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center font-black">
              <FileCheck2 size={18} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Opportunity & Posting Moderation
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300">
              {postings.length} Total Postings
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Live content moderation for Internships, Research Projects, FDPs, and Industrial Training engagements.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchPostings}
          disabled={isLoading}
          className="text-xs font-semibold gap-1.5"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          Refresh Postings
        </Button>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Opportunities</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{postings.length}</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">Live & Active</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{activeCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">Delisted / Suppressed</div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{suppressedCount}</div>
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
            placeholder="Search by title, employer, location, or ID..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Types */}
        <div className="md:col-span-7 flex flex-wrap items-center gap-1.5 justify-start md:justify-end">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedType === t
                  ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t === 'ALL' ? 'All Types' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <RefreshCw size={28} className="animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Retrieving platform postings for moderation...
            </p>
          </div>
        ) : errorMsg ? (
          <div className="p-8 text-center">
            <AlertCircle size={32} className="text-rose-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{errorMsg}</p>
            <Button size="sm" variant="outline" onClick={fetchPostings} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : filteredPostings.length === 0 ? (
          <div className="p-12 text-center">
            <FileCheck2 size={32} className="text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No postings found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4">Opportunity Title</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Employer / Organization</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4 text-center">Applications</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredPostings.map((item) => {
                  const isActive = item.isActive;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100 max-w-sm truncate">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <span>ID #{item.id}</span>
                            {item.deadline && (
                              <>
                                <span>•</span>
                                <span>Deadline: {item.deadline}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {getTypeBadge(item.type)}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                          <Building2 size={13} className="text-slate-400 flex-shrink-0" />
                          <span className="truncate max-w-[180px]">{item.companyName || 'Verified Partner'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} className="text-slate-400" />
                          <span className="truncate max-w-[140px]">{item.location || 'Remote'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-slate-800 dark:text-slate-200">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                          <Users size={11} className="text-slate-400" />
                          {item.applicationsCount || 0}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            LIVE & ACTIVE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300">
                            <EyeOff size={11} />
                            SUPPRESSED
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={processingId === item.id}
                          onClick={() => handleToggleActive(item)}
                          className={`h-7 px-2.5 text-xs font-bold transition-all ${
                            isActive
                              ? 'border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400'
                              : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400'
                          }`}
                        >
                          {isActive ? (
                            <>
                              <EyeOff size={13} className="mr-1" />
                              Delist
                            </>
                          ) : (
                            <>
                              <Eye size={13} className="mr-1" />
                              Publish
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
