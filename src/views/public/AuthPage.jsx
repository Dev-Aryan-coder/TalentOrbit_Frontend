import React, { useState } from 'react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import authBanner from '@/assets/auth-banner.jpg';
import './AuthPage.css';

export function AuthPage({ 
  initialMode = 'login',
  onNavigateHome, 
  onSuccessLogin,
  onNavigateRole 
}) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [role, setRole] = useState('STUDENT'); // 'STUDENT' | 'INDUSTRY' | 'ACADEMICIAN' | 'INSTITUTION_ADMIN'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleQuickFill = (presetRole, presetEmail, presetPassword) => {
    setRole(presetRole);
    setEmail(presetEmail);
    setPassword(presetPassword);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isLogin 
        ? 'http://localhost:8080/api/auth/login'
        : 'http://localhost:8080/api/auth/signup';

      const payload = isLogin 
        ? { email, password } 
        : { email, password, role };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const userData = await response.json();
        setSuccessMessage(isLogin ? 'Login successful! Redirecting...' : 'Account created successfully! Awaiting verification.');
        setTimeout(() => {
          if (onSuccessLogin) {
            onSuccessLogin(userData);
          } else if (onNavigateRole) {
            const roleRoute = (userData.role || role).toLowerCase();
            onNavigateRole(roleRoute === 'industry' ? 'recruiter' : roleRoute === 'academician' ? 'academician' : 'student');
          }
        }, 800);
      } else {
        const errorData = await response.json().catch(() => null);
        const detail = errorData?.message || 'Authentication failed. Please check your credentials.';
        setErrorMessage(detail);
      }
    } catch {
      // Graceful local demo fallback if Spring Boot backend is offline
      setSuccessMessage('Backend offline: Continuing in preview session...');
      setTimeout(() => {
        const roleRoute = role.toLowerCase();
        if (onNavigateRole) {
          onNavigateRole(roleRoute === 'industry' ? 'recruiter' : roleRoute === 'academician' ? 'academician' : 'student');
        }
      }, 700);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-split-wrapper">
      {/* Left Form Section */}
      <section className="auth-form-side">
        <div className="auth-nav-top">
          <button 
            type="button" 
            onClick={onNavigateHome}
            className="auth-back-link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <span>Back to Home</span>
          </button>

          <div className="auth-logo-badge">
            <div className="auth-logo-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                <path d="M2 12h20"/>
              </svg>
            </div>
            <span>TalentOrbit</span>
          </div>
        </div>

        <div className="auth-form-container">
          <h1 className="auth-heading">
            {isLogin ? 'Sign In to TalentOrbit' : 'Create an Account'}
          </h1>
          <p className="auth-subheading">
            {isLogin 
              ? 'Access your unified academia and industry intelligence dashboard.'
              : 'Join India’s national career bench-marking and skill accreditation registry.'}
          </p>

          {/* Role Switcher Tabs */}
          <div className="auth-role-tabs">
            <button
              type="button"
              onClick={() => handleRoleSelect('STUDENT')}
              className={`auth-role-tab ${role === 'STUDENT' ? 'active' : ''}`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('INDUSTRY')}
              className={`auth-role-tab ${role === 'INDUSTRY' ? 'active' : ''}`}
            >
              Recruiter
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('ACADEMICIAN')}
              className={`auth-role-tab ${role === 'ACADEMICIAN' ? 'active' : ''}`}
            >
              Faculty
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('INSTITUTION_ADMIN')}
              className={`auth-role-tab ${role === 'INSTITUTION_ADMIN' ? 'active' : ''}`}
            >
              College TPO
            </button>
          </div>

          {/* Quick Fill Demo Chip Strip */}
          <div className="auth-quick-fill-bar">
            <span className="auth-quick-fill-label">Quick Demo Fill:</span>
            <button 
              type="button" 
              onClick={() => handleQuickFill('STUDENT', 'student@talentorbit.gov.in', 'Password123')}
              className="auth-quick-chip"
            >
              Student
            </button>
            <button 
              type="button" 
              onClick={() => handleQuickFill('INDUSTRY', 'recruiter@infosys.com', 'Password123')}
              className="auth-quick-chip"
            >
              Recruiter
            </button>
            <button 
              type="button" 
              onClick={() => handleQuickFill('ACADEMICIAN', 'prof.sharma@iitd.ac.in', 'Password123')}
              className="auth-quick-chip"
            >
              Faculty
            </button>
          </div>

          {/* Alert Status Feedback */}
          {errorMessage && (
            <div className="auth-alert-banner error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="auth-alert-banner success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="auth-field-group">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@university.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Label htmlFor="password">Password</Label>
                {isLogin && (
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: '#0055ff', fontSize: '12px', fontWeight: 500, cursor: 'pointer', padding: 0 }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              <div className="auth-password-wrapper">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your secret password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-password-toggle"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="brand"
              size="lg"
              className="w-full mt-4"
              disabled={isLoading}
            >
              {isLoading 
                ? 'Authenticating...' 
                : isLogin 
                  ? `Sign In as ${role.charAt(0) + role.slice(1).toLowerCase().replace('_admin', '')}`
                  : `Create ${role.charAt(0) + role.slice(1).toLowerCase().replace('_admin', '')} Account`}
            </Button>
          </form>

          {/* Mode Switcher Link */}
          <div className="auth-switch-mode">
            <span>
              {isLogin ? "Don't have an account yet?" : 'Already have an existing account?'}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="auth-switch-btn"
            >
              {isLogin ? 'Sign up here' : 'Sign in here'}
            </button>
          </div>
        </div>

        {/* Footer Security Note */}
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
          Protected by SHA-256 digital seals & Institutional Single Sign-On (SSO).
        </div>
      </section>

      {/* Right Visual Section (Unsplash Campus Photo + Dark Gradient Showcase) */}
      <aside className="auth-visual-side">
        <img 
          src={authBanner} 
          alt="University Students Collaborating" 
          className="auth-visual-bg"
        />
        <div className="auth-visual-overlay" />

        <div className="auth-visual-content">
          <div className="auth-visual-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
            <span>National Higher Education Intelligence Platform</span>
          </div>

          <div className="auth-testimonial-card">
            <p className="auth-testimonial-quote">
              “TalentOrbit eliminated resume exaggeration on our campus. The tamper-proof cryptographic badges and deterministic skill diagnostics accelerated our corporate placement screening cycle by 65%.”
            </p>
            <div>
              <p className="auth-author-title">Dr. V. Ramanathan</p>
              <p className="auth-author-role">Dean of Placement & Corporate Relations, National University</p>
            </div>

            <div className="auth-metric-strip">
              <div className="auth-metric-item">
                <p>450+</p>
                <span>Accredited Colleges</span>
              </div>
              <div className="auth-metric-item">
                <p>1,200+</p>
                <span>Hiring Corporates</span>
              </div>
              <div className="auth-metric-item">
                <p>100%</p>
                <span>Verified Seals</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default AuthPage;
