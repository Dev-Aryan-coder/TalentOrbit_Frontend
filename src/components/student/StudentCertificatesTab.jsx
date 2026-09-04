import React, { useState } from 'react';
import {
  FileCheck,
  ShieldCheck,
  Download,
  ExternalLink,
  Calendar,
  Building,
} from 'lucide-react';
import './StudentCertificatesTab.css';

const DEFAULT_CERTIFICATES = [
  {
    id: 1,
    title: 'Certified Cloud & Backend Systems Architect',
    issuer: 'TalentOrbit Assessment Accreditation Board',
    issueDate: '2026-08-30',
    status: 'AUTHENTIC & ACTIVE',
    certificateId: 'TO-CERT-2026-B810',
    verificationSeal: 'SHA256: 4f8b91a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
  },
  {
    id: 2,
    title: 'Full Stack Java & Spring Data JPA Master',
    issuer: 'Institute Academic Council & Industry Partners',
    issueDate: '2026-09-02',
    status: 'AUTHENTIC & ACTIVE',
    certificateId: 'TO-CERT-2026-J924',
    verificationSeal: 'SHA256: 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
  },
];

export default function StudentCertificatesTab({ currentUser }) {
  const [certificates] = useState(DEFAULT_CERTIFICATES);
  const [activeModalCert, setActiveModalCert] = useState(null);

  return (
    <div className="student-cert-container">
      <div className="cert-header-area">
        <h2>Accredited Certificates & Transcripts</h2>
        <p>
          Cryptographically backed credentials verified through platform evaluations and academic institutions.
        </p>
      </div>

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
                <span className="text-slate-500">Credential ID: {cert.certificateId}</span>
                <span className="cert-status-badge">{cert.status}</span>
              </div>

              <div className="mt-2 text-[11px] font-mono text-slate-400 truncate">
                {cert.verificationSeal}
              </div>
            </div>

            <div className="cert-footer-actions">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar size={13} />
                <span>Issued: {cert.issueDate}</span>
              </span>

              <button
                type="button"
                className="cert-view-btn"
                onClick={() => setActiveModalCert(cert)}
              >
                <ShieldCheck size={14} />
                <span>View Certificate</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Modal */}
      {activeModalCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Official Credential Verification
              </h3>
              <p className="text-xs text-slate-500">TalentOrbit Cryptographic Proof</p>
            </div>

            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <div>
                <span className="text-xs text-slate-400 block">Candidate Name:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {currentUser?.fullName || 'Aryan Sharma'}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Certificate Title:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{activeModalCert.title}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Issuing Authority:</span>
                <span>{activeModalCert.issuer}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs font-mono break-all border border-slate-200 dark:border-slate-800">
                {activeModalCert.verificationSeal}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-5 mt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                onClick={() => setActiveModalCert(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
