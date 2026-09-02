import React from 'react';
import PublicNavbar from '../../components/layout/PublicNavbar';

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
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Poppins', sans-serif", color: '#041638', overflowX: 'hidden' }}>
      <PublicNavbar 
        activePage="how-it-works" 
        onNavigateHome={onNavigateHome} 
        onNavigatePage={onNavigatePage}
        onLogin={onLogin} 
        onRegister={onRegister} 
      />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '140px 32px 100px 32px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 64px auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', borderRadius: '9999px', background: 'rgba(0, 85, 255, 0.08)', border: '1px solid rgba(0, 85, 255, 0.2)', color: '#0055ff', fontSize: '13px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            System Architecture Workflow
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', 'Instrument Serif', Georgia, serif", fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', fontWeight: 700, color: '#041638', lineHeight: 1.15, textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 20px 0' }}>
            How TalentOrbit Works
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.7, margin: 0 }}>
            An end-to-end deterministic intelligence pipeline bridging academic skill assessment with corporate recruitment and university accreditation compliance.
          </p>
        </div>

        {/* Step Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', marginBottom: '80px' }}>
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              style={{
                position: 'relative',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '24px',
                padding: '36px 30px',
                boxShadow: '0 8px 30px rgba(0, 50, 150, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '9999px', background: 'rgba(0, 85, 255, 0.08)', color: '#0055ff', fontWeight: 500 }}>
                    {step.tag}
                  </span>
                  <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '28px', fontWeight: 700, color: '#94a3b8' }}>
                    {step.num}
                  </span>
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: 500, color: '#041638', lineHeight: 1.35, margin: '0 0 14px 0' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '14.5px', color: '#64748b', lineHeight: 1.65, margin: 0 }}>
                  {step.desc}
                </p>
              </div>

              <div style={{ marginTop: '28px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', color: '#0055ff', fontWeight: 500 }}>{step.metric}</span>
                <span style={{ fontSize: '14px', color: '#94a3b8' }}>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Callout */}
        <div style={{ background: 'linear-gradient(135deg, #041638 0%, #0a2560 100%)', borderRadius: '28px', padding: '56px 48px', color: '#ffffff', textAlign: 'center', boxShadow: '0 20px 50px rgba(4, 22, 56, 0.25)' }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, margin: '0 0 16px 0' }}>
            Experience Verified Skill Intelligence Today
          </h2>
          <p style={{ maxWidth: '640px', margin: '0 auto 32px auto', fontSize: '16px', color: '#94a3b8', lineHeight: 1.65 }}>
            Launch a diagnostic assessment as a student or explore the verified candidate talent pool as an industry recruiter.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              onClick={() => onNavigateRole ? onNavigateRole('student') : (onNavigateHome && onNavigateHome())}
              style={{ padding: '14px 32px', borderRadius: '9999px', background: '#0055ff', color: '#ffffff', border: 'none', fontSize: '15px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 6px 20px rgba(0, 85, 255, 0.4)' }}
            >
              Start Student Assessment
            </button>
            <button 
              type="button" 
              onClick={onNavigateHome}
              style={{ padding: '14px 30px', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.25)', fontSize: '15px', fontWeight: 400, cursor: 'pointer' }}
            >
              Return to Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}