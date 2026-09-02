import React from 'react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import './HowItWorksPage.css';

export default function HowItWorksPage({ onNavigateHome, onNavigatePage, onNavigateRole, onLogin, onRegister }) {
  const steps = [
    {
      num: "01",
      title: "Multi-Stakeholder Registry & Skill Profile Ingestion",
      desc: "Students, Recruiters, Academicians, and Institutional TPOs register through AISHE-coded multi-tenant partitions. Users configure their technical genome across Programming Languages, Frameworks, Libraries, and Developer Tools.",
      metric: "Multi-Tenant Isolation",
      tag: "Step 01: Onboarding"
    },
    {
      num: "02",
      title: "Deterministic AI Diagnostics via Groq Inference",
      desc: "TalentOrbit queries Groq LLM to generate on-demand, non-repetitive diagnostic assessments for any technical topic. Questions evaluate theoretical depth, code comprehension, and problem-solving confidence.",
      metric: "Sub-Second LLM Generation",
      tag: "Step 02: Evaluation"
    },
    {
      num: "03",
      title: "Cryptographically Verified SHA-256 Skill Genome",
      desc: "Upon test completion, performance telemetry is hashed using SHA-256 and permanently stored in MySQL. This cryptographic fingerprint guarantees credential authenticity and completely eradicates resume fabrication.",
      metric: "Tamper-Proof Verification",
      tag: "Step 03: Certification"
    },
    {
      num: "04",
      title: "Explainable ATS Matching & NIRF 5.2.1 Reporting",
      desc: "Recruiters define weighted candidate requirements and view exact mathematical overlap percentages. Concurrently, University TPOs receive automated placement rate heatmaps and NIRF Metric 5.2.1 compliance audits.",
      metric: "Explainable Match Engine",
      tag: "Step 04: Alignment"
    }
  ];

  return (
    <div className="hiw-page">
      <PublicNavbar 
        activePage="how-it-works" 
        onNavigateHome={onNavigateHome} 
        onNavigatePage={onNavigatePage}
        onLogin={onLogin} 
        onRegister={onRegister} 
      />

      <main className="hiw-main">
        {/* Header */}
        <div className="hiw-header">
          <div className="hiw-tag">
            System Architecture Workflow
          </div>
          <h1 className="hiw-title">
            How TalentOrbit Works
          </h1>
          <p className="hiw-desc">
            An end-to-end deterministic intelligence pipeline bridging academic skill assessment with corporate recruitment and university accreditation compliance.
          </p>
        </div>

        {/* Step Cards Grid */}
        <div className="hiw-grid">
          {steps.map((step, idx) => (
            <div key={idx} className="hiw-card">
              <div>
                <div className="hiw-card-header">
                  <span className="hiw-card-tag">
                    {step.tag}
                  </span>
                  <span className="hiw-card-num">
                    {step.num}
                  </span>
                </div>
                <h3 className="hiw-card-title">
                  {step.title}
                </h3>
                <p className="hiw-card-desc">
                  {step.desc}
                </p>
              </div>

              <div className="hiw-card-footer">
                <span className="hiw-card-metric">{step.metric}</span>
                <span className="hiw-card-arrow">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Callout */}
        <div className="hiw-action-callout">
          <h2 className="hiw-callout-title">
            Experience Verified Skill Intelligence Today
          </h2>
          <p className="hiw-callout-desc">
            Launch a diagnostic assessment as a student or explore the verified candidate talent pool as an industry recruiter.
          </p>
          <div className="hiw-callout-actions">
            <button 
              type="button" 
              onClick={() => onNavigateRole ? onNavigateRole('student') : (onNavigateHome && onNavigateHome())}
              className="hiw-btn-primary"
            >
              Start Student Assessment
            </button>
            <button 
              type="button" 
              onClick={onNavigateHome}
              className="hiw-btn-secondary"
            >
              Return to Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}