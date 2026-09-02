import React from 'react';
import PublicNavbar from '../../components/layout/PublicNavbar';

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
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Poppins', sans-serif", color: '#041638', overflowX: 'hidden' }}>
      <PublicNavbar 
        activePage="features" 
        onNavigateHome={onNavigateHome} 
        onNavigatePage={onNavigatePage}
        onLogin={onLogin} 
        onRegister={onRegister} 
      />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '140px 32px 100px 32px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 64px auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', borderRadius: '9999px', background: 'rgba(0, 85, 255, 0.08)', border: '1px solid rgba(0, 85, 255, 0.2)', color: '#0055ff', fontSize: '13px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            Enterprise Capabilities
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', 'Instrument Serif', Georgia, serif", fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', fontWeight: 700, color: '#041638', lineHeight: 1.15, textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 20px 0' }}>
            Platform Feature Architecture
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.7, margin: 0 }}>
            Comprehensive architectural breakdown of TalentOrbit's 6 core technical pillars engineered for national higher education and corporate recruitment synergy.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '80px' }}>
          {features.map((feat, idx) => (
            <div 
              key={idx} 
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '24px',
                padding: '36px 32px',
                boxShadow: '0 8px 30px rgba(0, 50, 150, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '9999px', background: 'rgba(0, 85, 255, 0.08)', color: '#0055ff', fontWeight: 500, display: 'inline-block', marginBottom: '16px' }}>
                  {feat.tag}
                </span>
                <h3 style={{ fontSize: '21px', fontWeight: 500, color: '#041638', margin: '0 0 14px 0', lineHeight: 1.3 }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '14.5px', color: '#64748b', lineHeight: 1.65, margin: '0 0 24px 0' }}>
                  {feat.desc}
                </p>
              </div>

              <div style={{ paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', fontWeight: 500 }}>
                  Technical Specifications
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {feat.specs.map((sp, i) => (
                    <span key={i} style={{ fontSize: '12.5px', padding: '4px 10px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155' }}>
                      {sp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={onNavigateHome}
            style={{ padding: '14px 34px', borderRadius: '9999px', background: '#041638', color: '#ffffff', border: 'none', fontSize: '15px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 6px 20px rgba(4, 22, 56, 0.25)' }}
          >
            Return to Home Overview
          </button>
        </div>
      </main>
    </div>
  );
}