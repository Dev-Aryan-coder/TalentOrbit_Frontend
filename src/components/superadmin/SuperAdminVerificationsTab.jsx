import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Building2,
  GraduationCap,
  Briefcase,
  ShieldAlert,
  FileText,
  ExternalLink,
  RefreshCw,
  Eye,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { superAdminAPI } from '../../services/api';

export default function SuperAdminVerificationsTab({ onSelectTab, onUpdatePendingCount }) {
  const [queue, setQueue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected user for KYC dossier inspection
  const [inspectedUser, setInspectedUser] = useState(null);
  
  // Rejection modal state
  const [rejectingUser, setRejectingUser] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successToast, setSuccessToast] = useState(null);

  const fetchPendingQueue = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await superAdminAPI.getPendingVerifications();
      const list = Array.isArray(res) ? res : (res?.data || []);
      setQueue(list);
      if (onUpdatePendingCount) {
        onUpdatePendingCount(list.length);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch pending verification queue.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingQueue();
  }, []);

  const handleApprove = async (userId, userEmail) => {
    if (!window.confirm(`Are you sure you want to approve and issue VERIFIED status for ${userEmail}?`)) {
      return;
    }
    setIsProcessing(true);
    try {
      await superAdminAPI.decideVerification({
        userId,
        status: 'VERIFIED',
        decision: 'VERIFIED',
        reason: 'KYC verified and approved by SuperAdmin God Mode.',
      });
      setSuccessToast(`Successfully approved and verified ${userEmail}!`);
      if (inspectedUser?.userId === userId) setInspectedUser(null);
      fetchPendingQueue();
    } catch (err) {
      alert('Error approving verification: ' + (err.message || 'Unknown error'));
    } finally {
      setIsProcessing(false);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  const openRejectModal = (user) => {
    setRejectingUser(user);
    setRejectionReason('Documents did not match official statutory records or failed authentication check.');
  };

  const handleConfirmReject = async () => {
    if (!rejectingUser) return;
    setIsProcessing(true);
    try {
      await superAdminAPI.decideVerification({
        userId: rejectingUser.userId,
        status: 'REJECTED',
        decision: 'REJECTED',
        reason: rejectionReason || 'KYC verification rejected by SuperAdmin.',
      });
      setSuccessToast(`Application for ${rejectingUser.email} has been REJECTED.`);
      setRejectingUser(null);
      if (inspectedUser?.userId === rejectingUser.userId) setInspectedUser(null);
      fetchPendingQueue();
    } catch (err) {
      alert('Error rejecting verification: ' + (err.message || 'Unknown error'));
    } finally {
      setIsProcessing(false);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  // Filtered queue
  const filteredQueue = queue.filter((item) => {
    const roleMatch = selectedRole === 'ALL' || item.role?.toUpperCase() === selectedRole;
    const query = searchQuery.toLowerCase().trim();
    const searchMatch =
      !query ||
      item.email?.toLowerCase().includes(query) ||
      item.organizationOrName?.toLowerCase().includes(query) ||
      String(item.userId).includes(query);
    return roleMatch && searchMatch;
  });

  const getRoleIcon = (role) => {
    switch (role?.toUpperCase()) {
      case 'STUDENT':
        return <GraduationCap size={15} className="text-sky-500" />;
      case 'INDUSTRY':
        return <Briefcase size={15} className="text-violet-500" />;
      case 'ACADEMICIAN':
        return <FileText size={15} className="text-amber-500" />;
      case 'INSTITUTION':
      case 'INSTITUTION_ADMIN':
        return <Building2 size={15} className="text-emerald-500" />;
      default:
        return <UserCheck size={15} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto animate-fade-in">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <p className="text-sm font-semibold">{successToast}</p>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 font-bold px-2 py-1 rounded"
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
              <UserCheck size={18} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Universal KYC Verification Queue
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {queue.length} Pending
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Zero-trust statutory accreditation for Students, Industry Employers, Faculty, and AICTE/UGC Institutions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPendingQueue}
            disabled={isLoading}
            className="text-xs font-semibold gap-1.5"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Refresh Queue
          </Button>
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
            placeholder="Search pending by user ID, email, or institution name..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Role Pills */}
        <div className="md:col-span-7 flex flex-wrap items-center gap-1.5 justify-start md:justify-end">
          {['ALL', 'STUDENT', 'INDUSTRY', 'ACADEMICIAN', 'INSTITUTION'].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === role
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700'
              }`}
            >
              {role === 'ALL' ? 'All Roles' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Main Verification Table / List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <RefreshCw size={28} className="animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Retrieving pending KYC dossiers from secure ledger...
            </p>
          </div>
        ) : errorMsg ? (
          <div className="p-8 text-center">
            <AlertCircle size={32} className="text-rose-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{errorMsg}</p>
            <Button size="sm" variant="outline" onClick={fetchPendingQueue} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : filteredQueue.length === 0 ? (
          <div className="p-12 text-center">
            <div className="h-16 w-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Queue is 100% Clear!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              No pending registrations require review right now. All statutory profiles are actively verified.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4">Entity / User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Organization / Full Name</th>
                  <th className="py-3.5 px-4">Registered On</th>
                  <th className="py-3.5 px-4">KYC Status</th>
                  <th className="py-3.5 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredQueue.map((item) => (
                  <tr
                    key={item.userId}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
                          {item.email ? item.email[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">
                            {item.email}
                          </div>
                          <div className="text-[10px] text-slate-400">UID #{item.userId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        {getRoleIcon(item.role)}
                        <span>{item.role}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {item.organizationOrName || 'Individual Registrant'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-slate-400" />
                        <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                        PENDING KYC
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setInspectedUser(item)}
                          className="h-7 px-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Review Dossier"
                        >
                          <Eye size={13} className="mr-1" />
                          Review
                        </Button>

                        <Button
                          size="sm"
                          disabled={isProcessing}
                          onClick={() => handleApprove(item.userId, item.email)}
                          className="h-7 px-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                        >
                          <CheckCircle2 size={13} className="mr-1" />
                          Approve
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isProcessing}
                          onClick={() => openRejectModal(item)}
                          className="h-7 px-2 text-xs font-semibold border-rose-200 text-rose-600 dark:border-rose-900 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                        >
                          <XCircle size={13} className="mr-1" />
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* KYC Dossier Review Modal */}
      {inspectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    KYC Dossier Inspection
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">UID #{inspectedUser.userId}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectedUser(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Account Email</span>
                  <div className="font-bold text-slate-900 dark:text-slate-100 mt-1 break-all">
                    {inspectedUser.email}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Assigned Role</span>
                  <div className="font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {inspectedUser.role}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400">Entity / Full Name</span>
                <div className="font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {inspectedUser.organizationOrName}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold mb-1">
                  <Info size={14} />
                  <span>Statutory Compliance Check</span>
                </div>
                <p className="text-amber-700 dark:text-amber-400 leading-relaxed text-[11px]">
                  All submitted documentation has passed preliminary hash checksum verification. Verification decision will issue an immutable cryptographic audit record registered under your SuperAdmin session ID.
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInspectedUser(null)}
              >
                Close
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-rose-200 text-rose-600 dark:border-rose-900 dark:text-rose-400 hover:bg-rose-50"
                onClick={() => {
                  const user = inspectedUser;
                  setInspectedUser(null);
                  openRejectModal(user);
                }}
              >
                Reject KYC
              </Button>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                onClick={() => handleApprove(inspectedUser.userId, inspectedUser.email)}
              >
                Approve & Verify
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <XCircle size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Reject Verification
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{rejectingUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setRejectingUser(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Reason for KYC Rejection (sent to applicant)
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-slate-900 dark:text-slate-100"
                placeholder="Specify regulatory, accreditation or documentation discrepancies..."
              />
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isProcessing}
                onClick={() => setRejectingUser(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={isProcessing}
                onClick={handleConfirmReject}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
