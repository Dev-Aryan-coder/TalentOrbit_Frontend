import React, { useState, useEffect } from 'react';
import {
  Lock,
  Search,
  RefreshCw,
  AlertCircle,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Server,
  User,
  Key,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { superAdminAPI } from '../../services/api';

export default function SuperAdminAuditLogsTab() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState('ALL');

  const fetchAuditLogs = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await superAdminAPI.getAuditLogs();
      const list = Array.isArray(res) ? res : (res?.data || []);
      setLogs(list);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch security audit logs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const actionTypes = ['ALL', ...Array.from(new Set(logs.map((l) => l.actionType).filter(Boolean)))];

  const filteredLogs = logs.filter((log) => {
    const actionMatch = selectedAction === 'ALL' || log.actionType === selectedAction;
    const q = searchQuery.toLowerCase().trim();
    const queryMatch =
      !q ||
      log.actorEmail?.toLowerCase().includes(q) ||
      log.actionType?.toLowerCase().includes(q) ||
      log.ipAddress?.toLowerCase().includes(q) ||
      log.targetType?.toLowerCase().includes(q) ||
      String(log.id).includes(q) ||
      String(log.targetId).includes(q);
    return actionMatch && queryMatch;
  });

  const getActionBadge = (action) => {
    if (action?.includes('APPROVE')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
          <ShieldCheck size={11} />
          {action}
        </span>
      );
    }
    if (action?.includes('REJECT') || action?.includes('SUSPEND')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300">
          <ShieldAlert size={11} />
          {action}
        </span>
      );
    }
    if (action?.includes('LOGIN')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300">
          <Key size={11} />
          {action}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
        <Server size={11} />
        {action}
      </span>
    );
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black">
              <Lock size={18} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Security & Regulatory Audit Ledger
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {logs.length} Immutable Records
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tamper-evident statutory audit trail tracking every administrative action, KYC adjudication, and permission change.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchAuditLogs}
          disabled={isLoading}
          className="text-xs font-semibold gap-1.5"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          Refresh Ledger
        </Button>
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
            placeholder="Search by actor email, IP address, target or action..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Actions filter */}
        <div className="md:col-span-7 flex flex-wrap items-center gap-1.5 justify-start md:justify-end">
          {actionTypes.slice(0, 5).map((act) => (
            <button
              key={act}
              onClick={() => setSelectedAction(act)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedAction === act
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700'
              }`}
            >
              {act === 'ALL' ? 'All Actions' : act}
            </button>
          ))}
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <RefreshCw size={28} className="animate-spin text-emerald-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Decrypting and reading cryptographic audit ledger...
            </p>
          </div>
        ) : errorMsg ? (
          <div className="p-8 text-center">
            <AlertCircle size={32} className="text-rose-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{errorMsg}</p>
            <Button size="sm" variant="outline" onClick={fetchAuditLogs} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <Lock size={32} className="text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No audit records match query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4">Record ID</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Action Event</th>
                  <th className="py-3.5 px-4">Actor Email</th>
                  <th className="py-3.5 px-4">Target Entity</th>
                  <th className="py-3.5 px-4 text-right">Origin IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors font-mono"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-400">
                      #AUD-{String(log.id).padStart(5, '0')}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5 font-sans">
                        <Clock size={12} className="text-slate-400" />
                        <span>
                          {log.timestamp
                            ? new Date(log.timestamp).toLocaleString('en-IN', {
                                dateStyle: 'short',
                                timeStyle: 'medium',
                              })
                            : 'Timestamped'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-sans">
                      {getActionBadge(log.actionType)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-1.5">
                        <User size={12} className="text-slate-400" />
                        <span>{log.actorEmail || 'system'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-sans">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium text-[11px]">
                        {log.targetType || 'ENTITY'} #{log.targetId}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-500 dark:text-slate-400">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
