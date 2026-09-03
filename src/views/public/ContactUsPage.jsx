import React, { useState } from 'react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import './ContactUsPage.css';

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
    <div className="contact-page">
      <PublicNavbar 
        activePage="contact" 
        onNavigateHome={onNavigateHome} 
        onNavigatePage={onNavigatePage}
        onLogin={onLogin} 
        onRegister={onRegister} 
      />

      <main className="contact-main">
        {/* Header */}
        <div className="contact-header">
          <div className="contact-tag">
            Partnerships & Communications
          </div>
          <h1 className="contact-title">
            Contact TalentOrbit
          </h1>
          <p className="contact-desc">
            Connect with our national higher education integration desk for institutional onboarding, corporate ATS partnerships, and technical support.
          </p>
        </div>

        <div className="contact-grid">
          {/* Left: Contact Info & Support Channels */}
          <div className="contact-channels-col">
            <div className="contact-channel-card">
              <h3 className="contact-channel-title">
                Institutional Onboarding Desk
              </h3>
              <p className="contact-channel-desc">
                For universities and engineering colleges seeking automated NIRF 5.2.1 compliance integration, AISHE multi-tenant partitioning, and TPO batch analytics.
              </p>
              <div className="contact-channel-details">
                <span>Email: institutions@talentorbit.gov.in</span>
                <span>Coordination: AICTE National Framework Alignment</span>
              </div>
            </div>

            <div className="contact-channel-card">
              <h3 className="contact-channel-title">
                Corporate ATS & Recruiter Solutions
              </h3>
              <p className="contact-channel-desc">
                For enterprise recruiters, tech startups, and hiring managers seeking direct API access to the cryptographically verified SHA-256 student talent pool.
              </p>
              <div className="contact-channel-details">
                <span>Email: enterprise@talentorbit.in</span>
                <span>Direct ATS Integration: REST API / Webhooks</span>
              </div>
            </div>
          </div>

          {/* Right: Interactive Inquiry Form */}
          <div className="contact-form-card">
            {submitted ? (
              <div className="contact-success-box">
                <div className="contact-success-badge">
                  ✓
                </div>
                <h3 className="contact-success-title">
                  Inquiry Dispatched
                </h3>
                <p className="contact-success-desc">
                  Thank you. Your message has been logged with our national desk. A nodal officer will contact you within 24 business hours.
                </p>
                <button 
                  type="button" 
                  onClick={() => setSubmitted(false)}
                  className="contact-reset-btn"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <h3 className="contact-form-title">
                  Send Official Correspondence
                </h3>

                <div className="contact-form-group">
                  <label className="contact-label">
                    Full Name & Title
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dr. Rajesh Sharma, Head of Placements"
                    className="contact-input"
                  />
                </div>

                <div className="contact-form-group">
                  <label className="contact-label">
                    Official Email
                  </label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tpo@university.edu.in"
                    className="contact-input"
                  />
                </div>

                <div className="contact-form-group">
                  <label className="contact-label">
                    Stakeholder Category
                  </label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="contact-select"
                  >
                    <option value="institution">University / College TPO</option>
                    <option value="industry">Corporate Recruiter</option>
                    <option value="academician">Faculty / Researcher</option>
                    <option value="student">Student Inquiry</option>
                  </select>
                </div>

                <div className="contact-form-group">
                  <label className="contact-label">
                    Message & Specific Requirements
                  </label>
                  <textarea 
                    required 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your batch size, hiring timeline, or research collaboration goals..."
                    className="contact-textarea"
                  />
                </div>

                <button 
                  type="submit"
                  className="contact-submit-btn"
                >
                  Submit Official Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <PublicFooter onNavigateHome={onNavigateHome} onNavigatePage={onNavigatePage} onNavigateRole={onNavigateRole} />
    </div>
  );
}