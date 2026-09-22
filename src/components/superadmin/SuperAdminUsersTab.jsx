import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  UserX,
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Mail,
  GraduationCap,
  Briefcase,
  Building2,
  FileText,
  Key,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { superAdminAPI } from '../../services/api';

export default function SuperAdminUsersTab() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessingId, setIsProcessingId] = useState(null);
  const [statusToast, setStatusToast] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await superAdminAPI.getAllUsers(selectedRole);
      const list = Array.isArray(res) ? res : (res?.data || []);
      setUsers(list);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to retrieve user directory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRole]);

  const handleToggleSuspend = async (user) => {
    const isSuspending = user.status !== 'SUSPENDED';
    const actionWord = isSuspending ? 'SUSPEND' : 'RESTORE (UNSUSPEND)';
    if (!window.confirm(`Are you sure you want to ${actionWord} the account for "${user.name || user.email}" (ID #${user.id})?`)) {
      return;
    }

    setIsProcessingId(user.id);
    try {
      await superAdminAPI.toggleSuspendUser(user.id);
      setStatusToast(`Account status updated for ${user.email}.`);
      fetchUsers();
    } catch (err) {
      alert('Error updating user suspension status: ' + (err.message || 'Unknown error'));
    } finally {
      setIsProcessingId(null);
      setTimeout(() => setStatusToast(null), 4000);
    }
  };

  // Filter users by search
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      u.email?.toLowerCase().includes(q) ||
      u.name?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q) ||
      String(u.id).includes(q)
    );
  });

  const verifiedCount = users.filter((u) => u.status === 'VERIFIED').length;
  const pendingCount = users.filter((u) => u.status === 'PENDING_VERIFICATION').length;
  const suspendedCount = users.filter((u) => u.status === 'SUSPENDED').length;

  const getRoleBadge = (role) => {
    switch (role?.toUpperCase()) {
      case 'SUPERADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <ShieldAlert size={12} />
            SUPERADMIN
          </span>
        );
      case 'STUDENT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300">
            <GraduationCap size={12} />
            STUDENT
          </span>
        );
      case 'INDUSTRY':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-violet-100 text-violet-800 dark:bg-violet-950/80 dark:text-violet-300">
            <Briefcase size={12} />
            INDUSTRY
          </span>
        );
      case 'ACADEMICIAN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300">
            <FileText size={12} />
            ACADEMICIAN
          </span>
        );
      case 'INSTITUTION_ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
            <Building2 size={12} />
            INSTITUTION
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            {role}
          </span>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
            <ShieldCheck size={12} />
            VERIFIED
          </span>
        );
      case 'PENDING_VERIFICATION':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
            <AlertTriangle size={12} />
            PENDING KYC
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300">
            <UserX size={12} />
            SUSPENDED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {status}
          </span>
        );
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black">
              <Users size={18} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Global User Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {users.length} Total Registered
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete platform registry. Manage account permissions, review credentials, and enforce suspension protocols.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchUsers}
          disabled={isLoading}
          className="text-xs font-semibold gap-1.5"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          Refresh Registry
        </Button>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Accounts</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{users.length}</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Active Verified</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{verifiedCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <div className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">Pending KYC</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{pendingCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <div className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">Suspended</div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{suspendedCount}</div>
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
            placeholder="Search directory by name, email, role, or UID..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Role Pills */}
        <div className="md:col-span-7 flex flex-wrap items-center gap-1.5 justify-start md:justify-end">
          {[
            { id: 'ALL', label: 'All Roles' },
            { id: 'STUDENT', label: 'Students' },
            { id: 'INDUSTRY', label: 'Industry' },
            { id: 'ACADEMICIAN', label: 'Academicians' },
            { id: 'INSTITUTION_ADMIN', label: 'Institutions' },
            { id: 'SUPERADMIN', label: 'SuperAdmins' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedRole(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700'
              }`}
            >
              {tab.label}
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
              Querying platform identity registry...
            </p>
          </div>
        ) : errorMsg ? (
          <div className="p-8 text-center">
            <AlertTriangle size={32} className="text-rose-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{errorMsg}</p>
            <Button size="sm" variant="outline" onClick={fetchUsers} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={32} className="text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No users found matching query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredUsers.map((user) => {
                  const isSuspended = user.status === 'SUSPENDED';
                  const isSuperAdmin = user.role === 'SUPERADMIN';

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-slate-200 to-indigo-100 dark:from-slate-800 dark:to-indigo-950 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200">
                            {user.name ? user.name[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100">
                              {user.name || 'Unnamed Account'}
                            </div>
                            <div className="text-[10px] text-slate-400">UID #{user.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                        {user.email}
                      </td>

                      <td className="py-3.5 px-4">
                        {getRoleBadge(user.role)}
                      </td>

                      <td className="py-3.5 px-4">
                        {getStatusBadge(user.status)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isSuperAdmin ? (
                          <span className="text-[11px] font-semibold text-slate-400 italic">
                            Protected Root
                          </span>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isProcessingId === user.id}
                            onClick={() => handleToggleSuspend(user)}
                            className={`h-7 px-2.5 text-xs font-bold transition-all ${
                              isSuspended
                                ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950'
                                : 'border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/50'
                            }`}
                          >
                            {isSuspended ? (
                              <>
                                <UserCheck size={13} className="mr-1" />
                                Unsuspend
                              </>
                            ) : (
                              <>
                                <UserX size={13} className="mr-1" />
                                Suspend Account
                              </>
                            )}
                          </Button>
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
    </div>
  );
}
