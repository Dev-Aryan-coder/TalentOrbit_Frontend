import React from 'react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import './FeaturesPage.css';

export default function FeaturesPage({ onNavigateHome, onNavigatePage, onNavigateRole, onLogin, onRegister }) {
  const features = [
    {
      title: "Dynamic AI Diagnostics",
      tag: "Assessment Engine",
      desc: "Instantaneous generation of technical MCQs for any developer skill using Groq LLM. Categorizes questions by Tech Type (Language, Framework, Library, Tool), tracking student knowledge gaps with mathematical confidence scoring.",
      specs: ["Groq LLM Sub-Second Latency", "MySQL Dynamic Caching", "Confidence Gap Analysis", "Adaptive Difficulty"]
    },
    {
      title: "SHA-256 Verified Genome",
      tag: "Security & Trust",
      desc: "Each successfully completed evaluation produces a deterministic SHA-256 cryptographic hash stored directly in MySQL. Recruiters verify candidate skill claims instantly, eliminating fraudulent certificates and resume fabrication.",
      specs: ["Cryptographic Hash Verification", "Tamper-Proof Audit Trail", "Zero Resume Fabrication", "Instant Recruiter Scan"]
    },
    {
      title: "Explainable Match Engine",
      tag: "Algorithmic Placement",
      desc: "Calculates precise student-job fit percentages based on recruiter-weighted parameters. Transparently exposes matched requirements, partial fits, and exact missing prerequisites rather than black-box AI scores.",
      specs: ["Recruiter Weighted Criteria", "Prerequisite Gap Breakdown", "100% Transparent Overlap", "Automated Shortlisting"]
    },
    {
      title: "NIRF 5.2.1 Intelligence",
      tag: "Accreditation Automation",
      desc: "Aggregates real-time median package benchmarks, offer distributions, and batch skill heatmaps. Institutional TPOs generate official compliance exports for NIRF Metric 5.2.1 and NAAC Criterion 5 with one click.",
      specs: ["NIRF 5.2.1 Compliant", "NAAC Criterion 5 Heatmaps", "Cohort Skill Deficit Audits", "Automated TPO Reports"]
    },
    {
      title: "Faculty Industry R&D",
      tag: "Academic Immersion",
      desc: "Bridges university professors with corporate sponsored research projects, paid consultancy contracts, and AICTE industry immersion programs with integrated milestone tracking and verified deliverables.",
      specs: ["Sponsored Corporate Grants", "Consulting Milestone Escrow", "AICTE Immersion Alignment", "Patent & R&D Tracking"]
    },
    {
      title: "Platform Governance & Audit",
      tag: "Enterprise Administration",
      desc: "Complete SuperAdmin control over institutional verification, corporate account approvals, dispute moderation, system audit logs, and real client IP tracking across every session.",
      specs: ["Real Client IP Logging", "Multi-Tenant AISHE Partitioning", "Dispute Resolution Workflow", "Full Activity Auditing"]
    }
  ];

  return (
    <div className="features-page">
      <PublicNavbar 
        activePage="features" 
        onNavigateHome={onNavigateHome} 
        onNavigatePage={onNavigatePage}
        onLogin={onLogin} 
        onRegister={onRegister} 
      />

      <main className="features-main">
        {/* Header */}
        <div className="features-header">
          <div className="features-tag">
            Enterprise Capabilities
          </div>
          <h1 className="features-title">
            Platform Feature Architecture
          </h1>
          <p className="features-desc">
            Comprehensive architectural breakdown of TalentOrbit's 6 core technical pillars engineered for national higher education and corporate recruitment synergy.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="features-grid">
          {features.map((feat, idx) => (
            <div key={idx} className="features-card">
              <div>
                <span className="features-card-tag">
                  {feat.tag}
                </span>
                <h3 className="features-card-title">
                  {feat.title}
                </h3>
                <p className="features-card-desc">
                  {feat.desc}
                </p>
              </div>

              <div className="features-specs-wrap">
                <div className="features-specs-title">
                  Technical Specifications
                </div>
                <div className="features-specs-tags">
                  {feat.specs.map((sp, i) => (
                    <span key={i} className="features-spec-pill">
                      {sp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="features-cta-wrap">
          <button 
            type="button" 
            onClick={onNavigateHome}
            className="features-cta-btn"
          >
            Return to Home Overview
          </button>
        </div>
      </main>
    </div>
  );
}