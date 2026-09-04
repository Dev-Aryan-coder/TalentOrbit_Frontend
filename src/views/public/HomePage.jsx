import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroBanner } from '../../components/ui/HeroBanner';
import './HomePage.css';
import logoImg from '../../assets/logo.png';
import whoWeAreImg from '../../assets/who-we-are.jpg';

gsap.registerPlugin(ScrollTrigger);

export function HomePage({ 
  onNavigateRole, 
  onNavigateHome, 
  onNavigatePage, 
  onLogin, 
  onRegister,
  currentUser,
  currentTheme,
  onThemeChange,
  onNavigateDashboard,
  onOpenProfileSettings,
  onOpenAccountSettings,
  onOpenAppearance,
  onLogout
}) {
  const [activeRoleTab, setActiveRoleTab] = useState('student');

  const roleShowcases = {
    student: {
      tag: "For Engineering & Degree Students",
      title: "Verify Your Real-World Technical Competence",
      desc: "Stop relying on static resumes. Take diagnostic AI evaluations that map your exact topic mastery, compute your confidence gap, and cryptographically verify your skill genome on MySQL.",
      points: [
        "Dynamic On-Demand Technical MCQs for any IT topic",
        "Cryptographic SHA-256 Tamper-Proof Skill Verification",
        "Deterministic Weighted Opportunity Matching",
        "Personalized Remedial Learning Milestones"
      ],
      cta: "Launch Student Diagnostic",
      action: () => onNavigateRole && onNavigateRole('student'),
      previewStat: "94% Skill Overlap Fit",
      previewLabel: "Target Role: Full-Stack Cloud Engineer"
    },
    industry: {
      tag: "For Corporate Recruiters & Startups",
      title: "Explainable Talent Acquisition & ATS Funnels",
      desc: "Zero guessing. Specify required skills with explicit weighted importance (e.g. Java 40%, Spring Boot 30%, Docker 20%) and let our deterministic engine score the entire talent pool in 2 milliseconds.",
      points: [
        "Weighted Skill Postings (Jobs & Internships)",
        "Instant Candidate Scoring & Explainable Match Breakdowns",
        "Structured Interview Scheduling & Automated Offer Tracking",
        "Industry-Academia R&D Grant Proposals"
      ],
      cta: "Explore Recruiter ATS",
      action: () => onNavigateRole && onNavigateRole('industry'),
      previewStat: "24 Shortlisted Candidates",
      previewLabel: "Average Match: 88.4% Proficiency"
    },
    academician: {
      tag: "For Professors & Faculty Researchers",
      title: "Bridge Faculty Expertise with Corporate Grants",
      desc: "Collaborate directly with top tech firms. Publish consulting capabilities, apply for funded R&D projects, and attend AICTE-aligned Faculty Development Programs (FDPs) and sabbaticals.",
      points: [
        "Industry Consultancy & Sponsored Research Listings",
        "FDP & National Workshop Immersion Programs",
        "Joint Patent & Publication Synergy Tracking",
        "Direct Research Grant Disbursement Tracking"
      ],
      cta: "Access Faculty Portal",
      action: () => onNavigateRole && onNavigateRole('academician'),
      previewStat: "₹18.5 Lakhs",
      previewLabel: "Active Sponsored Research Grants"
    },
    institution: {
      tag: "For University Leaders & TPOs",
      title: "Real-Time NIRF & NAAC Placement Intelligence",
      desc: "Transform your accreditation posture with verifiable placement analytics, curriculum deficit heatmaps, and automated metrics computation for NIRF 5.2.1 and NAAC Criterion 5.",
      points: [
        "Live NIRF Metric 5.2.1 Placement Rate & Highest CTC Analytics",
        "Batch-wide Skill Deficit Heatmaps & Curriculum Recommendations",
        "MoU & Enterprise Industry Partnership Dashboard",
        "One-Click Automated Accreditation PDF Reports"
      ],
      cta: "Open TPO Intelligence",
      action: () => onNavigateRole && onNavigateRole('institution'),
      previewStat: "91.8% Placement Rate",
      previewLabel: "Average CTC: ₹9.4 LPA (Verified)"
    }
  };

  const whoWeAreRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Fade In Up animation for the image
      gsap.fromTo(
        '.who-we-are-image-wrapper',
        {
          opacity: 0,
          y: 60,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.who-we-are-layout',
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );

      // 2. Slide In Right animation for the content
      gsap.fromTo(
        '.who-we-are-content',
        {
          opacity: 0,
          x: 60,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.who-we-are-layout',
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );

      // 3. Subtle Pop animation for the four cards
      gsap.fromTo(
        '.who-we-are-card',
        {
          opacity: 0,
          scale: 0.88,
          y: 30,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.85,
          ease: 'back.out(1.5)',
          stagger: 0.14,
          scrollTrigger: {
            trigger: '.who-we-are-cards-grid',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, whoWeAreRef);

    return () => ctx.revert();
  }, []);

  const currentShowcase = roleShowcases[activeRoleTab];

  return (
    <div className="landing-page">
      {/* 1. Hero Banner with Fluid Silk Cyan Background & Floating Pill Navbar */}
      <HeroBanner 
        onLogin={onLogin} 
        onRegister={onRegister} 
        onNavigatePage={onNavigatePage} 
        onNavigateHome={onNavigateHome || (() => { window.scrollTo({ top: 0, behavior: 'smooth' }); window.history.pushState(null, '', '/'); })}
        currentUser={currentUser}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
        onNavigateDashboard={onNavigateDashboard}
        onOpenProfileSettings={onOpenProfileSettings}
        onOpenAccountSettings={onOpenAccountSettings}
        onOpenAppearance={onOpenAppearance}
        onLogout={onLogout}
        title="Transforming Academia & Industry"
        highlightText="Collaboration"
        description="TalentOrbit is the National Career & Higher Education Intelligence Platform bridging Students, Recruiters, Academicians, and Institutions with explainable AI benchmarking and verified placement analytics."
        primaryActionText="Explore Student Portal"
        onPrimaryAction={() => onNavigateRole ? onNavigateRole('student') : console.log('student')}
        secondaryActionText="Recruiter ATS & Talent Pool"
        onSecondaryAction={() => onNavigateRole ? onNavigateRole('industry') : console.log('industry')}
      />

      {/* 2. Who We Are Section */}
      <section id="about" className="section-who-we-are" ref={whoWeAreRef}>
          <div className="section-container">
            <div className="section-header" style={{ marginBottom: '44px' }}>
              <div className="section-pill-tag">About TalentOrbit</div>
              <h2 className="section-title">Who We Are ?</h2>
              <p className="section-subtitle">
                Pioneering India's unified career and higher education intelligence platform to bridge the 45% skill deficit.
              </p>
            </div>

            {/* Top Row: Authentic University Photo + Deep Narrative Story */}
            <div className="who-we-are-layout">
              {/* Left: Article Image */}
              <div className="who-we-are-image-wrapper">
                <img
                  src={whoWeAreImg}
                  alt="Students and University Collaboration at TalentOrbit"
                  className="who-we-are-img"
                />
                <div className="who-we-are-image-caption">
                  <span>Empowering genuine student talent through verified skills and direct hiring opportunities</span>
                </div>
              </div>

              {/* Right: Article Content */}
              <div className="who-we-are-content">
                <p className="who-we-are-lead">
                  TalentOrbit is India's next-generation Career and Higher Education Intelligence Platform. Built specifically to tackle the national disconnect between college education and industry hiring, we create a transparent, reliable bridge connecting ambitious students, corporate recruiters, colleges, and university faculty onto one unified platform.
                </p>

                <p className="who-we-are-body-text">
                  Every year, millions of bright young minds graduate from technical and professional colleges across India. However, over 45% struggle to land meaningful jobs because standard paper resumes cannot prove real-world competence. At the same time, top employers receive thousands of unverified applications, and college placement offices spend hundreds of exhausting hours manually gathering placement reports for national accreditations like NIRF and NAAC.
                </p>

                <p className="who-we-are-body-text">
                  TalentOrbit replaces this outdated, confusing process with real-time clarity, verified skills, and absolute trust. By standardizing student evaluations and aligning them directly with industry hiring criteria, we ensure that merit speaks louder than resume buzzwords.
                </p>

                <div className="who-we-are-quote-banner">
                  <div className="who-we-are-quote-text">
                    "Our mission is simple: eliminate resume noise, empower students with undeniable proof of skill, and help Indian colleges build world-class hiring ecosystems."
                  </div>
                </div>
              </div>
            </div>

            {/* Equal 4-Box Grid Placed Equally Below The Image & Story */}
            <div className="who-we-are-cards-grid">
              <div className="who-we-are-card">
                <span className="who-we-are-card-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0055ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                </span>
                <h4 className="who-we-are-card-title">Real Skill Diagnostics</h4>
                <p className="who-we-are-card-desc">
                  Students take interactive evaluations in coding, web, and data to pinpoint exact strengths, weak points, and step-by-step guidance to level up their career readiness.
                </p>
              </div>

              <div className="who-we-are-card">
                <span className="who-we-are-card-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0055ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <h4 className="who-we-are-card-title">100% Genuine Badges</h4>
                <p className="who-we-are-card-desc">
                  Students earn tamper-proof verified digital badges that employers instantly trust, removing the risk of resume exaggeration or unverified claims.
                </p>
              </div>

              <div className="who-we-are-card">
                <span className="who-we-are-card-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0055ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </span>
                <h4 className="who-we-are-card-title">Direct Job Matching</h4>
                <p className="who-we-are-card-desc">
                  Recruiters search directly for verified competency, review tested skill scores, schedule interviews, and extend offers faster with complete confidence.
                </p>
              </div>

              <div className="who-we-are-card">
                <span className="who-we-are-card-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0055ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2L2 7h20L12 2z"/></svg>
                </span>
                <h4 className="who-we-are-card-title">Accreditation Reports</h4>
                <p className="who-we-are-card-desc">
                  College TPOs gain real-time dashboards of placements and automated reports that simplify institutional accreditations like NIRF 5.2.1 and NAAC Criterion 5.
                </p>
              </div>
            </div>
          </div>
        </section>

      {/* Horizontal Divider Line */}
      <div className="section-divider-wrapper">
        <div className="section-divider" />
      </div>

      {/* 3. Career & Skill Intelligence Solution Architecture Section */}
            {/* 3. Core Features Section */}
      <section id="features" className="section-features">
        <div className="section-container">
          <div className="section-header">
            <div className="section-pill-tag">Core Platform Features</div>
            <h2 className="section-title">Built For Students, Colleges & Companies</h2>
            <p className="section-subtitle">
              A simple, all-in-one platform connecting students with top companies, helping colleges track placements, and enabling teachers to collaborate with industry.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-box"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0055ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg></div>
              <h3 className="feature-card-title">Smart Skill Assessments</h3>
              <p className="feature-card-desc">
                Students can take quick online quizzes in topics like Python, Java, or Web Development to test their practical skills and get instant feedback on what to learn next.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0055ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg></div>
              <h3 className="feature-card-title">100% Genuine Verified Skills</h3>
              <p className="feature-card-desc">
                Passed test scores are permanently locked and verified, giving companies confidence that student abilities are real with zero fake resumes or false certificates.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0055ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></div>
              <h3 className="feature-card-title">Direct Job & Internship Match</h3>
              <p className="feature-card-desc">
                Companies find the right talent immediately, while students get matched directly with relevant job and internship openings based on their real abilities.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0055ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div>
              <h3 className="feature-card-title">Campus Placement Reports</h3>
              <p className="feature-card-desc">
                College placement cells can easily monitor student hiring rates, view salary package stats, and see which skills are currently most wanted by hiring companies.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0055ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
              <h3 className="feature-card-title">Teacher & Industry Collaboration</h3>
              <p className="feature-card-desc">
                College professors can connect with companies for sponsored research projects, corporate consulting, and industry teacher training programs.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0055ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
              <h3 className="feature-card-title">Safe & Trusted Community</h3>
              <p className="feature-card-desc">
                Every student, company, college, and job listing is thoroughly checked to provide a secure, transparent, and spam-free space for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive 4-Role Portal Showcase */}
      <section id="how-it-works" className="section-showcase">
        <div className="section-container">
          <div className="section-header">
            <div className="section-pill-tag" style={{ background: 'rgba(124, 232, 255, 0.1)', color: '#7ce8ff', borderColor: 'rgba(124, 232, 255, 0.25)' }}>
              Interactive Role Ecosystem
            </div>
            <h2 className="section-title" style={{ color: '#ffffff' }}>One Platform. Four Unified Portals.</h2>
            <p className="section-subtitle" style={{ color: '#94a3b8' }}>
              Select a portal below to experience how TalentOrbit powers every stakeholder in higher education.
            </p>
          </div>

          {/* Role Switcher Pills */}
          <div className="role-tab-buttons">
            <button
              type="button"
              className={`role-tab-btn ${activeRoleTab === 'student' ? 'active' : ''}`}
              onClick={() => setActiveRoleTab('student')}
            >
              Student Portal
            </button>
            <button
              type="button"
              className={`role-tab-btn ${activeRoleTab === 'industry' ? 'active' : ''}`}
              onClick={() => setActiveRoleTab('industry')}
            >
              Industry Recruiter
            </button>
            <button
              type="button"
              className={`role-tab-btn ${activeRoleTab === 'academician' ? 'active' : ''}`}
              onClick={() => setActiveRoleTab('academician')}
            >
              Faculty & Research
            </button>
            <button
              type="button"
              className={`role-tab-btn ${activeRoleTab === 'institution' ? 'active' : ''}`}
              onClick={() => setActiveRoleTab('institution')}
            >
              Institution TPO
            </button>
          </div>

          {/* Active Role Showcase Card */}
          <div className="showcase-display-box">
            <div>
              <div className="showcase-badge">{currentShowcase.tag}</div>
              <h3 className="showcase-heading">{currentShowcase.title}</h3>
              <p className="showcase-text">{currentShowcase.desc}</p>

              <ul className="showcase-list">
                {currentShowcase.points.map((pt, i) => (
                  <li key={i} className="showcase-list-item">
                    <span className="showcase-list-check">✓</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={currentShowcase.action}
                className="hero-btn-primary"
                style={{ padding: '14px 32px', fontSize: '15px' }}
              >
                <span>{currentShowcase.cta}</span>
                <span style={{ fontWeight: 'bold' }}>→</span>
              </button>
            </div>

            <div className="showcase-preview-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Live Intelligence Telemetry</span>
                <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '9999px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 'bold' }}>Active Session</span>
              </div>

              <div style={{ fontSize: '42px', fontWeight: '900', color: '#7ce8ff', lineHeight: '1', marginBottom: '8px' }}>
                {currentShowcase.previewStat}
              </div>
              <p style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '28px' }}>
                {currentShowcase.previewLabel}
              </p>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Connected to Spring Boot API</span>
                <span style={{ fontSize: '12px', color: '#7ce8ff', fontFamily: 'monospace' }}>Port 8080 (MySQL Active)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Senior Global Footer */}
      <footer id="contact" className="landing-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <img src={logoImg} alt="TalentOrbit Emblem" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="footer-brand-title" style={{ margin: 0, lineHeight: 1.1 }}>TalentOrbit</span>
                <span style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#7ce8ff', fontWeight: 700, textTransform: 'uppercase', marginTop: '3px' }}>
                  CONNECT • GROW • SUCCEED
                </span>
              </div>
            </div>
            <p className="footer-brand-desc">
              National Higher Education & Industry Career Intelligence Network designed for Smart India Hackathon Problem Statement #26044.
            </p>
          </div>

          <div className="footer-links-group">
            <div>
              <h4 className="footer-col-title">Role Portals</h4>
              <ul className="footer-nav">
                <li><button type="button" onClick={() => onNavigateRole('student')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Student Portal</button></li>
                <li><button type="button" onClick={() => onNavigateRole('industry')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Industry Recruiter</button></li>
                <li><button type="button" onClick={() => onNavigateRole('academician')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Faculty & Research</button></li>
                <li><button type="button" onClick={() => onNavigateRole('institution')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Institution TPO</button></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-title">Architecture</h4>
              <ul className="footer-nav">
                <li><a href="#features" className="footer-link">AI Diagnostic Engine</a></li>
                <li><a href="#features" className="footer-link">SHA-256 Skill Verification</a></li>
                <li><a href="#features" className="footer-link">Explainable ATS Funnel</a></li>
                <li><a href="#features" className="footer-link">NIRF 5.2.1 Intelligence</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-title">Technology</h4>
              <ul className="footer-nav">
                <li><span className="footer-link">Spring Boot 3.4.2</span></li>
                <li><span className="footer-link">React 19 & Vite</span></li>
                <li><span className="footer-link">Groq / Qwen 3.8-27B</span></li>
                <li><span className="footer-link">MySQL 8.0</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 TalentOrbit. Built for National Higher Education & Industry Innovation .</span>
          <span style={{ color: '#7ce8ff' }}>Production Architecture Verified</span>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;


