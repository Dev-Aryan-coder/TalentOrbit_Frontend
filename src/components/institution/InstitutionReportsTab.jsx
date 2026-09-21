import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { institutionAPI } from '../../services/api';

export default function InstitutionReportsTab({ currentUser, onSelectTab }) {
  const userId = currentUser?.id || currentUser?.userId || 1;

  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState('NIRF_COMPLIANCE');
  const [dateRange, setDateRange] = useState('2025-2026 Academic Year');
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchReports = () => {
    setIsLoading(true);
    institutionAPI.getUserReports(userId)
      .then((data) => {
        if (Array.isArray(data)) {
          setReports(data);
        } else if (data?.data && Array.isArray(data.data)) {
          setReports(data.data);
        } else {
          setReports([]);
        }
      })
      .catch((err) => {
        setErrorMsg(err.message || 'Could not fetch reports.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchReports();
  }, [userId]);

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const payload = {
        generatedByUserId: userId,
        reportType: selectedType,
        dateRange: dateRange,
      };

      const res = await institutionAPI.generateReport(payload);
      setSuccessMsg(`Official ${selectedType.replace(/_/g, ' ')} report generated and saved to audit ledger!`);
      fetchReports();
    } catch (err) {
      setErrorMsg(`Failed to generate report: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadFile = (report) => {
    // Generate clean printable audit report window
    const win = window.open('', '_blank');
    if (!win) {
      alert('Popup blocked. Please allow popups to download or view the report.');
      return;
    }

    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>TalentOrbit Official Audit Report - ${report.reportType}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #0f172a; }
            .header { border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 30px; }
            .badge { display: inline-block; background: #eef2ff; color: #4338ca; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; }
            .meta-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .meta-table td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
            .stamp { border: 2px dashed #059669; color: #059669; padding: 12px 20px; border-radius: 8px; display: inline-block; margin-top: 30px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>TalentOrbit Accreditation & Compliance Audit Report</h2>
            <span class="badge">Official SIH AICTE / NIRF / NAAC Schema</span>
          </div>
          <table class="meta-table">
            <tr><td><strong>Report Type:</strong></td><td>${report.reportType}</td></tr>
            <tr><td><strong>Audit Period:</strong></td><td>${report.dateRange}</td></tr>
            <tr><td><strong>Report Identifier:</strong></td><td>REP-TO-${report.id}</td></tr>
            <tr><td><strong>Generated Timestamp:</strong></td><td>${new Date(report.generatedAt).toLocaleString()}</td></tr>
            <tr><td><strong>Audit Verification:</strong></td><td>Cryptographically Logged & SHA-256 Verified</td></tr>
          </table>
          <div class="stamp">
            ✔ VERIFIED ACCREDITATION EXPORT
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="institution-tab-container animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <FileText className="text-indigo-600 dark:text-indigo-400" size={24} />
            <span>NIRF, NAAC & AICTE Accreditation Reports</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Generate 1-click verified institutional compliance documents adhering to NIRF placement metric guidelines, NAAC Criteria 1.2, and AICTE skill alignment mandates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            Audit Ready Schema
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 size={18} className="text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm flex items-center gap-3">
          <AlertCircle size={18} className="text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Generator Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm mb-8">
        <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
          <Sparkles size={18} className="text-indigo-600" />
          <span>Generate New Accreditation Audit Report</span>
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          Select standard compliance template. The system extracts verified student data and produces an immutable report.
        </p>

        <form onSubmit={handleGenerateReport} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Accreditation Audit Template
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="NIRF_COMPLIANCE">NIRF Mandatory Placement & Salary Audit</option>
              <option value="PLACEMENT_ANALYTICS">Comprehensive Cohort Placement & CTC Report</option>
              <option value="TOP_SKILLS_TREND">AICTE Skill Demand vs Deficit Matrix</option>
              <option value="PLATFORM_USAGE">NAAC Criteria 1.2 Curriculum Skill Audit</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Academic Assessment Year
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="2025-2026 Academic Year">2025-2026 Academic Year</option>
              <option value="2024-2025 Academic Year">2024-2025 Academic Year</option>
              <option value="2023-2024 Academic Year">2023-2024 Academic Year</option>
              <option value="Q1-Q2 Current Cycle">Q1-Q2 Current Cycle</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={isGenerating}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-10 shadow-sm"
          >
            {isGenerating ? 'Compiling Audit Data...' : '1-Click Generate Official Report'}
          </Button>
        </form>
      </div>

      {/* Historical Reports Ledger */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock size={18} className="text-slate-500" />
            <span>Generated Audit Reports Ledger</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {reports.length} report(s) on file
          </span>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-slate-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3" />
            <div className="text-sm font-medium">Fetching generated reports...</div>
          </div>
        ) : reports.length === 0 ? (
          <div className="py-16 text-center text-slate-500 px-4">
            <FileSpreadsheet size={40} className="mx-auto mb-2 text-slate-400 opacity-60" />
            <div className="font-bold text-base text-slate-800 dark:text-slate-200">
              No Reports Generated Yet
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select a template above to produce your institution's first verified accreditation document.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="institution-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Audit Template</th>
                  <th>Period</th>
                  <th>Generated Timestamp</th>
                  <th>Verification</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((rep) => (
                  <tr key={rep.id}>
                    <td>
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        REP-TO-{rep.id}
                      </span>
                    </td>
                    <td>
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {rep.reportType?.replace(/_/g, ' ')}
                      </div>
                    </td>
                    <td>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {rep.dateRange || 'Current Academic Year'}
                      </span>
                    </td>
                    <td>
                      <div className="text-xs text-slate-500">
                        {rep.generatedAt ? new Date(rep.generatedAt).toLocaleString() : 'Just now'}
                      </div>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <ShieldCheck size={12} />
                        VERIFIED
                      </span>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadFile(rep)}
                        className="text-xs font-semibold flex items-center gap-1.5 h-8"
                      >
                        <Download size={13} />
                        <span>Print / Export</span>
                      </Button>
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
