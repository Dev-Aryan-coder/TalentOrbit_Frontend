import React from 'react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import './FeaturesPage.css';

export default function FeaturesPage({ onNavigateHome, onNavigatePage, onNavigateRole, onLogin, onRegister }) {
  const features = [
    {
      title: "Smart Skill Assessments",
      tag: "For Students",
      desc: "Students can take quick online quizzes in topics like Python, Java, or Web Development to test their practical skills and get instant feedback on what to learn next.",
      specs: ["Instant Quiz Generation", "Covers Top Tech Skills", "Strength & Weakness Feedback", "Learn at Your Own Pace"]
    },
    {
      title: "100% Genuine Verified Skills",
      tag: "For Employers",
      desc: "Passed test scores are permanently locked and verified, giving companies confidence that student abilities are real with zero fake resumes or false certificates.",
      specs: ["Zero Fake Resumes", "100% Authentic Scores", "Verified Skill Badges", "Direct Talent Discovery"]
    },
    {
      title: "Direct Job & Internship Match",
      tag: "For Job Seekers",
      desc: "Companies find the right talent immediately, while students get matched directly with relevant job and internship openings based on their real abilities.",
      specs: ["Accurate Skill Matching", "Internships & Full-Time Jobs", "Clear Job Requirements", "Direct Applications"]
    },
    {
      title: "College Placement Reports",
      tag: "For Colleges & TPOs",
      desc: "College placement cells can easily monitor student hiring rates, view salary package stats, and see which skills are currently most wanted by hiring companies.",
      specs: ["Student Placement Tracking", "Company Hiring Trends", "Salary & Package Analytics", "Official College Exports"]
    },
    {
      title: "Teacher & Industry Collaboration",
      tag: "For Faculty & Professors",
      desc: "College professors can connect with companies for sponsored research projects, corporate consulting, and industry teacher training programs.",
      specs: ["Industry Research Projects", "Faculty Consulting Contracts", "Corporate Teacher Training", "Collaborative Grants"]
    },
    {
      title: "Safe & Trusted Community",
      tag: "For Everyone",
      desc: "Every student, company, college, and job listing is thoroughly checked to provide a secure, transparent, and spam-free space for everyone.",
      specs: ["Verified Company Accounts", "Real Student Profiles", "Spam & Scam Protection", "Help & Support Desk"]
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
            Core Platform Features
          </div>
          <h1 className="features-title">
            Built For Students, Colleges & Companies
          </h1>
          <p className="features-desc">
            A simple, all-in-one platform connecting students with top companies, helping colleges track placements, and enabling teachers to collaborate with industry.
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
                  Key Highlights
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