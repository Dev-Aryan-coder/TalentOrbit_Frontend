import React, { useState, useEffect } from 'react';
import { portfolioAPI, badgesAPI } from '../../services/api';
import {
  FileCheck,
  ShieldCheck,
  Download,
  ExternalLink,
  Calendar,
  Building,
  RefreshCw,
  AlertTriangle,
  Award,
} from 'lucide-react';
import './StudentCertificatesTab.css';

export default function StudentCertificatesTab({ currentUser, onSelectTab }) {
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [activeModalCert, setActiveModalCert] = useState(null);

  const userId = currentUser?.id || currentUser?.userId;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.allSettled([
      portfolioAPI.getByUser(userId, 'CERTIFICATE'),
      badgesAPI.getStudentBadges(userId),
    ])
      .then(([portfolioRes, badgesRes]) => {
        const certList = [];

        // 1. Portfolio items marked as CERTIFICATE
        if (portfolioRes.status === 'fulfilled' && Array.isArray(portfolioRes.value)) {
          portfolioRes.value.forEach((item) => {
            certList.push({
              id: item.id,
              title: item.title,
              issuer: item.institutionName || 'Institution / Issuer',
              issueDate: item.createdAt ? String(item.createdAt).split('T')[0] : 'N/A',
              status: item.verifiedFlag ? 'AUTHENTIC & VERIFIED' : 'PENDING REVIEW',
              certificateId: `TO-CERT-${item.id}`,
              verificationSeal: item.verificationHash ? `SHA256: ${item.verificationHash}` : 'N/A',
              fileUrl: item.fileUrl,
            });
          });
        }

        // 2. High-scoring badges also serve as verifiable certificates
        if (badgesRes.status === 'fulfilled' && Array.isArray(badgesRes.value)) {
          badgesRes.value.forEach((b) => {
            if (b.score >= 70) {
              certList.push({
                id: `badge_cert_${b.id}`,
                title: `${b.name} Technical Accreditation`,
                issuer: 'TalentOrbit Credential Authority',
                issueDate: b.earnedAt ? String(b.earnedAt).split('T')[0] : 'N/A',
                status: 'AUTHENTIC & VERIFIED',
                certificateId: b.verificationHash || `TO-CERT-${b.id}`,
                verificationSeal: b.sha256Digest || b.verificationHash ? `SHA256: ${b.sha256Digest || b.verificationHash}` : 'N/A',
              });
            }
          });
        }

        setCertificates(certList);
      })
      .catch((err) => {
        console.warn('Could not load certificates from database:', err.message);
        setCertificates([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="student-cert-container">
      <div className="cert-header-area">
        <h2>Accredited Certificates & Transcripts</h2>
        <p>
          Cryptographically backed credentials verified through platform evaluations, industry partners, and academic institutions.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <RefreshCw size={28} className="animate-spin text-indigo-500 mb-3" />
          <p className="text-sm font-medium">Fetching accredited certificates from database...</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <AlertTriangle size={36} className="text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No Accredited Certificates Found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
            Verifying your technical skills with scores of 70% or higher automatically generates tamper-proof accredited certificates.
          </p>
          <button
            type="button"
            className="quiz-primary-btn inline-flex items-center gap-2"
            onClick={() => onSelectTab && onSelectTab('assessment')}
          >
            <Award size={16} />
            <span>Earn Verified Certificates</span>
          </button>
        </div>
      ) : (
        <div className="certs-grid">
          {certificates.map((cert) => (
            <div key={cert.id} className="cert-card-item">
              <div>
                <div className="cert-top-header">
                  <div className="cert-emblem">
                    <FileCheck size={24} />
                  </div>
                  <div>
                    <h3 className="cert-title">{cert.title}</h3>
                    <div className="cert-issuer">{cert.issuer}</div>
                  </div>
                </div>

                <div className="cert-meta-row mt-4">
                  <span className="cert-meta-item">
                    <Calendar size={13} />
                    <span>Issued: {cert.issueDate}</span>
                  </span>
                  <span className="cert-status-badge">
                    <ShieldCheck size={12} />
                    <span>{cert.status}</span>
                  </span>
                </div>

                <div className="cert-id-tag mt-3">ID: {cert.certificateId}</div>
              </div>

              <div className="cert-footer-row mt-4">
                <div className="cert-seal-text">{cert.verificationSeal}</div>

                <div className="cert-action-btns">
                  <button
                    type="button"
                    className="cert-inspect-btn"
                    onClick={() => setActiveModalCert(cert)}
                  >
                    <span>View Certificate</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Viewer Modal */}
      {activeModalCert && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setActiveModalCert(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto mb-3 text-emerald-600">
                <ShieldCheck size={36} />
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-1">
                Official Credential Verification
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {activeModalCert.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Issued by {activeModalCert.issuer}</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2 mb-6 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Credential ID:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {activeModalCert.certificateId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Issue Date:</span>
                <span className="text-slate-700 dark:text-slate-200">{activeModalCert.issueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Integrity:</span>
                <span className="text-emerald-600 font-semibold">{activeModalCert.status}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 break-all text-[10px] text-slate-500">
                {activeModalCert.verificationSeal}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 py-2.5 px-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-200 transition-colors"
                onClick={() => setActiveModalCert(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="flex-1 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                onClick={() => window.print()}
              >
                <Download size={14} />
                <span>Export / Print</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
