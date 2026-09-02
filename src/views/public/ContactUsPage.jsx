import React, { useState } from 'react';
import PublicNavbar from '../../components/layout/PublicNavbar';

export default function ContactUsPage({ onNavigateHome, onNavigatePage, onNavigateRole, onLogin, onRegister }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'institution',
    institutionName: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Poppins', sans-serif", color: '#041638', overflowX: 'hidden' }}>
      <PublicNavbar 
        activePage="contact" 
        onNavigateHome={onNavigateHome} 
        onNavigatePage={onNavigatePage}
        onLogin={onLogin} 
        onRegister={onRegister} 
      />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '140px 32px 100px 32px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 64px auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', borderRadius: '9999px', background: 'rgba(0, 85, 255, 0.08)', border: '1px solid rgba(0, 85, 255, 0.2)', color: '#0055ff', fontSize: '13px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            Partnerships & Communications
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', 'Instrument Serif', Georgia, serif", fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', fontWeight: 700, color: '#041638', lineHeight: 1.15, textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 20px 0' }}>
            Contact TalentOrbit
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.7, margin: 0 }}>
            Connect with our national higher education integration desk for institutional onboarding, corporate ATS partnerships, and technical support.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '48px', alignItems: 'start' }}>
          {/* Left: Contact Info & Support Channels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '36px 32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 500, color: '#041638', margin: '0 0 12px 0' }}>
                Institutional Onboarding Desk
              </h3>
              <p style={{ fontSize: '14.5px', color: '#64748b', lineHeight: 1.65, margin: '0 0 20px 0' }}>
                For universities and engineering colleges seeking automated NIRF 5.2.1 compliance integration, AISHE multi-tenant partitioning, and TPO batch analytics.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#0055ff', fontWeight: 500 }}>
                <span>Email: institutions@talentorbit.gov.in</span>
                <span>Coordination: AICTE National Framework Alignment</span>
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '36px 32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 500, color: '#041638', margin: '0 0 12px 0' }}>
                Corporate ATS & Recruiter Solutions
              </h3>
              <p style={{ fontSize: '14.5px', color: '#64748b', lineHeight: 1.65, margin: '0 0 20px 0' }}>
                For enterprise recruiters, tech startups, and hiring managers seeking direct API access to the cryptographically verified SHA-256 student talent pool.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#0055ff', fontWeight: 500 }}>
                <span>Email: enterprise@talentorbit.in</span>
                <span>Direct ATS Integration: REST API / Webhooks</span>
              </div>
            </div>
          </div>

          {/* Right: Interactive Inquiry Form */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '40px 36px', boxShadow: '0 12px 40px rgba(0, 50, 150, 0.06)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', fontSize: '24px', fontWeight: 'bold' }}>
                  ✓
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 500, color: '#041638', margin: '0 0 10px 0' }}>
                  Inquiry Dispatched
                </h3>
                <p style={{ fontSize: '14.5px', color: '#64748b', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                  Thank you. Your message has been logged with our national desk. A nodal officer will contact you within 24 business hours.
                </p>
                <button 
                  type="button" 
                  onClick={() => setSubmitted(false)}
                  style={{ padding: '10px 24px', borderRadius: '9999px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#041638', fontSize: '14px', cursor: 'pointer' }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 500, color: '#041638', margin: 0 }}>
                  Send Official Correspondence
                </h3>

                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 500, color: '#334155', marginBottom: '8px' }}>
                    Full Name & Title
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dr. Rajesh Sharma, Head of Placements"
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14.5px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 500, color: '#334155', marginBottom: '8px' }}>
                    Official Email
                  </label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tpo@university.edu.in"
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14.5px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 500, color: '#334155', marginBottom: '8px' }}>
                    Stakeholder Category
                  </label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14.5px', outline: 'none', boxSizing: 'border-box', background: '#ffffff' }}
                  >
                    <option value="institution">University / College TPO</option>
                    <option value="industry">Corporate Recruiter</option>
                    <option value="academician">Faculty / Researcher</option>
                    <option value="student">Student Inquiry</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 500, color: '#334155', marginBottom: '8px' }}>
                    Message & Specific Requirements
                  </label>
                  <textarea 
                    required 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your batch size, hiring timeline, or research collaboration goals..."
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14.5px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>

                <button 
                  type="submit"
                  style={{ padding: '14px 28px', borderRadius: '9999px', background: '#0055ff', color: '#ffffff', border: 'none', fontSize: '15px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 6px 20px rgba(0, 85, 255, 0.35)' }}
                >
                  Submit Official Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}