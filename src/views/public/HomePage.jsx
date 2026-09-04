import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroBanner } from '../../components/ui/HeroBanner';
import PreFooterCtaBanner from '../../components/ui/PreFooterCtaBanner';
import CardDetailModal from '../../components/ui/CardDetailModal';
import './HomePage.css';
import logoImg from '../../assets/logo.png';
import whoWeAreImg from '../../assets/who-we-are.jpg';

gsap.registerPlugin(ScrollTrigger);

const PROBLEM_CARDS_DATA = [
  {
    id: 'p1',
    type: 'problem',
    badge: 'Challenge 01: Skill Deficit',
    title: "College Marks Don't Match Job Skills",
    simpleSubtitle: 'Why high GPAs often struggle in real technical job interviews',
    desc: 'Colleges test memorization from textbooks, but tech companies hire for practical coding and real problem-solving ability.',
    tag: 'Curriculum Deficit',
    whatItMeans: 'In college, students can score 90% by memorizing definitions the night before an exam. But when they apply for a job, companies do not ask for definitions—they ask candidates to build a feature, fix a bug, or write running code. Because traditional college exams test theory rather than practical work, students graduate without knowing what tech skills they are missing.',
    realLifeExample: 'Rahul scored an 8.8 CGPA in Computer Science. In his first job interview, the recruiter asked him to create a basic REST API connected to a database. Because his college courses only taught paper diagrams, Rahul struggled to write running code.',
    howItWorks: 'TalentOrbit provides dynamic diagnostic skill evaluations. Students take practical tests, discover their exact blindspots, and receive clear milestones to build the exact skills companies want.',
    statusTag: 'Systemic Problem Solved'
  },
  {
    id: 'p2',
    type: 'problem',
    badge: 'Challenge 02: Resume Noise',
    title: 'Companies Drown in Fake & AI Resumes',
    simpleSubtitle: 'The flood of copy-pasted resumes with exaggerated skills',
    desc: 'Recruiters get thousands of copy-pasted resumes with buzzwords and cannot tell who can actually code before interviewing.',
    tag: 'Hiring Bottleneck',
    whatItMeans: 'With generative AI tools, anyone can generate a perfect-looking resume in 30 seconds filled with impressive keywords. Recruiters now receive 2,000+ applications for a single job opening, but 90% of applicants cannot perform the required tasks, wasting weeks of interviewing time.',
    realLifeExample: 'A startup recruiter posts an opening for a junior backend developer. They receive 1,400 resumes in 48 hours. After spending three weeks screening candidates, they discover that most applicants copied their listed projects straight from YouTube tutorials.',
    howItWorks: 'TalentOrbit replaces unverified bullet points with cryptographic skill badges. Recruiters see verified proof of code competence before scheduling an interview.',
    statusTag: 'Recruitment Overhead Solved'
  },
  {
    id: 'p3',
    type: 'problem',
    badge: 'Challenge 03: College Admin',
    title: 'College Placement Records Are a Mess',
    simpleSubtitle: 'The manual chaos of gathering proof for NIRF and NAAC audits',
    desc: 'Placement officers scramble through messy spreadsheets and paper letters when preparing government NIRF and NAAC reports.',
    tag: 'Administrative Burden',
    whatItMeans: 'Every year, colleges must prove to government inspection committees (such as NIRF Metric 5.2.1 and NAAC Criterion 5) that their students are getting placed. Currently, Training and Placement Officers (TPOs) have to manually collect offer letters from hundreds of alumni over WhatsApp and email.',
    realLifeExample: 'With a NAAC audit just two weeks away, the college placement cell has to stay late every night manually calling alumni, organizing lost PDFs, and calculating median salary packages by hand on spreadsheets.',
    howItWorks: 'TalentOrbit automatically logs student offers, verified salaries, and employer MoUs into a live college dashboard. College administrators can view their verified placement statistics anytime.',
    statusTag: 'Accreditation Friction Solved'
  },
  {
    id: 'p4',
    type: 'problem',
    badge: 'Challenge 04: Academia Silos',
    title: 'Professors Are Cut Off from Industry',
    simpleSubtitle: 'Why deep academic faculty knowledge stays locked inside classrooms',
    desc: 'Experienced engineering professors lack an easy way to work with top tech firms on paid consulting or funded research.',
    tag: 'Academia Disconnect',
    whatItMeans: 'College professors often have deep PhD knowledge in specialized domains like cryptography, algorithms, and distributed systems. However, tech companies rarely know how to reach them for paid advisory or corporate-sponsored research projects.',
    realLifeExample: 'A computer science professor with 15 years of database research wants to advise tech startups on database performance during summer break, but has no institutional platform to connect with industry projects.',
    howItWorks: 'TalentOrbit includes an Academician Portal where professors publish their research capabilities, receive corporate consulting opportunities, and participate in industry Faculty Development Programs (FDPs).',
    statusTag: 'Faculty Collaboration Solved'
  }
];

const SOLUTION_CARDS_DATA = [
  {
    id: 's1',
    type: 'solution',
    badge: 'Implemented Feature',
    title: 'Tamper-Proof Digital Skill Badges',
    simpleSubtitle: 'Real certificates that cannot be forged or faked',
    desc: 'Digital certificates secured with SHA-256 codes that prove a student genuinely passed a real technical evaluation.',
    tag: 'Verified in Backend & UI',
    whatItMeans: 'Instead of an easily edited PDF certificate, TalentOrbit awards students cryptographic digital badges. Each badge has a unique digital fingerprint (SHA-256 hash) stored securely in our MySQL database.',
    realLifeExample: 'When an employer views a student’s Python Mastery badge, they can click our official verification button. Our system confirms the exact score, date, and authenticity directly from our database.',
    howItWorks: 'Implemented in our Spring Boot backend (BadgeController.java) and MySQL database. Every badge generates a SHA-256 hash that can be publicly validated by any company.',
    statusTag: 'Active in Production'
  },
  {
    id: 's2',
    type: 'solution',
    badge: 'Implemented Feature',
    title: 'Safe Accounts & Security Email Alerts',
    simpleSubtitle: 'Protecting student and recruiter accounts with instant alerts',
    desc: 'Secure logins for students, recruiters, and colleges with OTP verification and instant security notification emails.',
    tag: 'Active Spring Boot Security',
    whatItMeans: 'Every user on TalentOrbit is protected by enterprise authentication. When anyone requests a password reset or updates account credentials, our backend immediately dispatches an automated security alert email.',
    realLifeExample: 'If someone updates their password, TalentOrbit sends an immediate security notification to their inbox: "Your password was changed on September 4. If this was not you, secure your account immediately."',
    howItWorks: 'Powered by Spring Boot and JavaMailSender (SMTP). Includes a 3-phase OTP password reset workflow and transactional security alert notifications.',
    statusTag: 'Active in Production'
  },
  {
    id: 's3',
    type: 'solution',
    badge: 'Implemented Feature',
    title: 'Clear & Fair Skill Matching',
    simpleSubtitle: 'Transparent compatibility math with zero hidden bias',
    desc: 'Our system directly matches what a company needs with what a student can do, giving an honest, transparent score.',
    tag: 'Deterministic Matching API',
    whatItMeans: 'Most hiring platforms use opaque algorithms that leave applicants confused. TalentOrbit uses transparent, explainable matching: if an employer requires 40% Java and 30% Spring Boot, the system shows both parties the exact percentage match.',
    realLifeExample: 'A student sees: "You have an 85% match for this Cloud Engineer internship because your Java and SQL are verified, but you still need to verify Docker to reach 100%."',
    howItWorks: 'Executed by MatchingService.java in the Spring Boot backend, evaluating student competencies in StudentSkill against role criteria in PostingSkill.',
    statusTag: 'Active in Production'
  },
  {
    id: 's4',
    type: 'solution',
    badge: 'Implemented Feature',
    title: 'Complete Student Profile & Test Hub',
    simpleSubtitle: 'All test scores, GitHub code, and certificates in one place',
    desc: 'A single home for all test scores, verified GitHub code projects, certificates, and college achievements.',
    tag: 'Live Student Portfolio',
    whatItMeans: 'Instead of emailing separate resumes, certificates, and links, students get an integrated digital portfolio. It gathers their technical test scores, college marks, GitHub repositories, and verified milestones in one place.',
    realLifeExample: 'A recruiter opens a student’s TalentOrbit profile and immediately reviews their verified test scores, live GitHub projects, semester marks, and verified badges in one clean screen.',
    howItWorks: 'Built into our Spring Boot REST API (PortfolioController.java & AssessmentController.java), serving structured data directly to the student dashboard.',
    statusTag: 'Active in Production'
  }
];

const ROADMAP_CARDS_DATA = [
  {
    id: 'r1',
    type: 'roadmap',
    badge: 'Upcoming AI Feature',
    phaseTag: 'Phase 2 AI Engine',
    title: 'Smart AI-Generated Practice Tests',
    simpleSubtitle: 'Dynamic questions tailored to real-world coding problems',
    desc: 'Smart quizzes that generate fresh, customized coding questions to test applied skills rather than memorized theory.',
    tag: 'In Research & Prototyping',
    whatItMeans: 'Static question banks are quickly memorized or leaked online. Our planned AI test engine will generate fresh, unique technical questions on-the-fly for any programming language or framework.',
    realLifeExample: 'Two students taking a React test at the same time will get two completely different, customized coding scenarios designed to test their applied problem-solving rather than rote memorization.',
    howItWorks: 'Will integrate Google Gemini and OpenAI API webhooks with our Spring Boot assessment service to synthesize real-time question sets and evaluate coding logic.',
    statusTag: 'Roadmap Milestone 1'
  },
  {
    id: 'r2',
    type: 'roadmap',
    badge: 'Upcoming Feature',
    phaseTag: 'Accreditation Automation',
    title: '1-Click Government Audit Reports',
    simpleSubtitle: 'Instant PDF generation for NIRF and NAAC inspections',
    desc: 'Auto-generated official PDF reports for government NIRF and NAAC reviews generated in seconds.',
    tag: 'Institutional Module',
    whatItMeans: 'Instead of spending months preparing for college accreditation inspections, placement directors will be able to click one button to generate official, audit-ready PDF reports with verified numbers.',
    realLifeExample: 'When the government NAAC inspection committee asks for verified placement records, the college principal downloads a formatted, compliant PDF report in five seconds.',
    howItWorks: 'A dedicated Spring Boot PDF generation pipeline using iText to aggregate placement percentages, median salary distributions, and MoUs directly into official accreditation audit tables.',
    statusTag: 'Roadmap Milestone 2'
  },
  {
    id: 'r3',
    type: 'roadmap',
    badge: 'Upcoming Feature',
    phaseTag: 'High-Performance Scale',
    title: 'Super-Fast Candidate Search',
    simpleSubtitle: 'Searching across thousands of students in milliseconds',
    desc: 'Lightning-fast candidate matching that lets companies filter thousands of verified students in milliseconds.',
    tag: 'Enterprise Recruiter ATS',
    whatItMeans: 'When a large tech firm needs 50 qualified junior developers across 100 colleges, they shouldn’t have to wait minutes for slow searches. Our upgraded search engine will filter the national talent pool in milliseconds.',
    realLifeExample: 'A recruiter sets filters: "Need 80%+ Python, 70%+ Docker, and 8.0 CGPA." The search results update instantly with zero lag as they adjust the criteria.',
    howItWorks: 'Engineered using in-memory vector indexing and cached relational projections to execute complex multi-skill score calculations in under 2 milliseconds.',
    statusTag: 'Roadmap Milestone 3'
  },
  {
    id: 'r4',
    type: 'roadmap',
    badge: 'Upcoming Feature',
    phaseTag: 'Academia-Industry Portal',
    title: 'Company Grants for College Research',
    simpleSubtitle: 'Direct corporate funding for college professors and labs',
    desc: 'A secure portal where tech companies can directly fund college research projects and teacher training.',
    tag: 'Faculty Marketplace',
    whatItMeans: 'Tech companies often want cutting-edge research in areas like AI, renewable energy, and cybersecurity. We are building a secure marketplace where companies can fund college labs and hire professors for specialized consulting.',
    realLifeExample: 'An electric vehicle company funds a ₹15 Lakh research project with an engineering college lab to design better battery management algorithms.',
    howItWorks: 'A specialized escrow marketplace with milestone tracking, contract signoffs, and direct grant disbursement tracking connecting industry R&D teams with university faculty.',
    statusTag: 'Roadmap Milestone 4'
  }
];

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
  const [activeCardDetail, setActiveCardDetail] = useState(null);
  const landingRootRef = useRef(null);
  const whoWeAreRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ===== 1. "Who We Are ?" Section Animations =====
      // 0. Header title and badge animation
      gsap.fromTo(
        '.section-who-we-are .section-header',
        {
          opacity: 0,
          y: 35,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.section-who-we-are',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

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

      // ===== 2. "Built For Students, Colleges & Companies" Section Animations =====
      // Section Header (Fade In Up)
      gsap.fromTo(
        '.section-features .section-header',
        {
          opacity: 0,
          y: 35,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.section-features',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Cards of "Built For Students, Colleges & Companies" (Subtle Pop Animation)
      gsap.fromTo(
        '.section-features .feature-card',
        {
          opacity: 0,
          scale: 0.88,
          y: 35,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'back.out(1.5)', // Subtle springy pop
          stagger: 0.12,         // Smooth sequential pop across cards
          scrollTrigger: {
            trigger: '.section-features .features-grid',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Cards of "Why Use TalentOrbit ?" (Subtle Pop Animation)
      gsap.fromTo(
        '.section-why-talentorbit .why-card',
        {
          opacity: 0,
          scale: 0.9,
          y: 30,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.75,
          ease: 'back.out(1.4)',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.section-why-talentorbit',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Cards of "What We Are Thinking To Add" (Subtle Pop Animation)
      gsap.fromTo(
        '.section-roadmap .roadmap-card',
        {
          opacity: 0,
          scale: 0.9,
          y: 30,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.75,
          ease: 'back.out(1.4)',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.section-roadmap',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      ScrollTrigger.refresh();
    }, landingRootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="landing-page" ref={landingRootRef}>
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

      {/* 3. Why Use TalentOrbit Section */}
      <section id="how-it-works" className="section-why-talentorbit">
        <div className="section-container">
          <div className="section-header">
            <div className="section-pill-tag">
              The TalentOrbit Advantage
            </div>
            <h2 className="section-title">Why Use TalentOrbit ?</h2>
            <p className="section-subtitle">
              Higher education and technical hiring are fraught with resume inflation, unverified credentials, and manual administrative drag. Here is how our unified intelligence ecosystem transforms the landscape.
            </p>
          </div>

          {/* Block 1: What Problem We Have Solved */}
          <div className="why-section-block">
            <div className="why-sub-header">
              <div className="why-badge problem">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Current System Breakdown
              </div>
              <h3 className="why-sub-title">What Problem We Have Solved</h3>
              <p className="why-sub-desc">
                The real challenges students, recruiters, and university leadership face every day in higher education and hiring.
              </p>
            </div>

            <div className="why-cards-grid">
              {PROBLEM_CARDS_DATA.map((card, idx) => {
                const icons = [
                  <svg key="0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
                  <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>,
                  <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
                  <svg key="3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18.84 12.25l1.72-1.71a4.5 4.5 0 0 0-6.36-6.36l-1.72 1.71" /><path d="M5.16 11.75l-1.72 1.71a4.5 4.5 0 0 0 6.36 6.36l1.72-1.71" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
                ];
                return (
                  <div key={card.id} className="why-card problem-card">
                    <div className="card-top-row">
                      <div className="why-card-icon-box problem">
                        {icons[idx % icons.length]}
                      </div>
                      <button
                        type="button"
                        className="card-info-btn"
                        onClick={() => setActiveCardDetail(card)}
                        title="Click for simple & detailed explanation"
                        aria-label={`Detailed info on ${card.title}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                      </button>
                    </div>
                    <h4 className="why-card-title">{card.title}</h4>
                    <p className="why-card-desc">{card.desc}</p>
                    <div className="why-card-tag problem">{card.tag}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Block 2: How We Have Solved This Problem (Production Implemented) */}
          <div className="why-section-block">
            <div className="why-sub-header">
              <div className="why-badge solution">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Active Production Core
              </div>
              <h3 className="why-sub-title">How We Have Solved This Problem</h3>
              <p className="why-sub-desc">
                Real tools and working features already built into our Spring Boot backend, MySQL database, and frontend dashboard.
              </p>
            </div>

            <div className="why-cards-grid">
              {SOLUTION_CARDS_DATA.map((card, idx) => {
                const icons = [
                  <svg key="0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>,
                  <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
                  <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="14.31" y1="8" x2="20.05" y2="17.94" /><line x1="9.69" y1="8" x2="21.17" y2="8" /><line x1="7.38" y1="12" x2="13.12" y2="2.06" /><line x1="9.69" y1="16" x2="3.95" y2="6.06" /><line x1="14.31" y1="16" x2="2.83" y2="16" /><line x1="16.62" y1="12" x2="10.88" y2="21.94" /></svg>,
                  <svg key="3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                ];
                return (
                  <div key={card.id} className="why-card solution-card">
                    <div className="card-top-row">
                      <div className="why-card-icon-box solution">
                        {icons[idx % icons.length]}
                      </div>
                      <button
                        type="button"
                        className="card-info-btn"
                        onClick={() => setActiveCardDetail(card)}
                        title="Click for simple & detailed explanation"
                        aria-label={`Detailed info on ${card.title}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                      </button>
                    </div>
                    <h4 className="why-card-title">{card.title}</h4>
                    <p className="why-card-desc">{card.desc}</p>
                    <div className="why-card-tag solution">{card.tag}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3.1 Section Divider */}
      <div className="section-divider-wrapper">
        <hr className="section-divider" />
      </div>

      {/* 3.2 What We Are Thinking To Add (Upcoming Features / Roadmap) */}
      <section id="roadmap" className="section-roadmap">
        <div className="section-container">
          <div className="section-header">
            <div className="roadmap-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Platform Evolution
            </div>
            <h2 className="section-title">What We Are Thinking To Add</h2>
            <p className="section-subtitle">
              Our upcoming roadmap designed to bring AI-powered exams, 1-click government accreditation reports, and super-fast hiring to TalentOrbit.
            </p>
          </div>

          <div className="roadmap-cards-grid">
            {ROADMAP_CARDS_DATA.map((card, idx) => {
              const icons = [
                <svg key="0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2a4 4 0 0 1 4 4c0 1.1-.5 2.1-1.3 2.8L16 11l-2 1-2-1 1.3-2.2C12.5 8.1 12 7.1 12 6a4 4 0 0 1 4-4z" /><path d="M18 10a6 6 0 0 1-6 6v4h-4v-4a6 6 0 0 1-6-6" /></svg>,
                <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>,
                <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
                <svg key="3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
              ];
              return (
                <div key={card.id} className="roadmap-card">
                  <div className="card-top-row">
                    <div className="roadmap-card-icon-box">
                      {icons[idx % icons.length]}
                    </div>
                    <button
                      type="button"
                      className="card-info-btn"
                      onClick={() => setActiveCardDetail(card)}
                      title="Click for simple & detailed explanation"
                      aria-label={`Detailed info on ${card.title}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                    </button>
                  </div>
                  <div className="roadmap-card-phase-tag">{card.phaseTag}</div>
                  <h4 className="roadmap-card-title">{card.title}</h4>
                  <p className="roadmap-card-desc">{card.desc}</p>
                  <div className="roadmap-card-target">{card.tag}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3.5 Pre-Footer Call to Action Banner */}
      <PreFooterCtaBanner 
        title="Hundreds Of Companies Use Us To Hire"
        description="Gain instant access to a curated pool of responsive, top-tech talent actively seeking their next role with cryptographically verified skills."
        buttonText="Get Started"
        onAction={() => onRegister ? onRegister() : (onNavigateRole && onNavigateRole('industry'))}
      />

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

      {/* Card Detail Modal (Shadcn-style) */}
      <CardDetailModal
        data={activeCardDetail}
        onClose={() => setActiveCardDetail(null)}
      />
    </div>
  );
}

export default HomePage;


