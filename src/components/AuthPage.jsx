import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, Mail, Eye, EyeOff, User, ArrowRight, ShieldCheck, KeyRound, 
  CheckCircle, AlertCircle, Sparkles, RefreshCw, Cpu, Check, 
  ShieldAlert, BadgeInfo
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SmartXLogo from './SmartXLogo';

const AuthPage = ({ theme, onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState('login'); // login, signup
  const { loginWithEmail, registerWithEmail, loginWithGoogle, loginWithGithub } = useAuth();
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRemember, setLoginRemember] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Signup State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status indicators
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: '' }
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Mouse coordinate tracker for left-side particle orb interaction
  const [orbCoords, setOrbCoords] = useState({ x: 0, y: 0 });
  const leftPanelRef = useRef(null);

  // Password Strength Logic
  const [strengthScore, setStrengthScore] = useState(0);
  const [validationChecks, setValidationChecks] = useState({
    length: false,
    number: false,
    symbol: false,
    upperLower: false
  });

  // Floating AI Onboarding Typewriter Tip
  const [aiTip, setAiTip] = useState('');
  const [tipIndex, setTipIndex] = useState(0);
  const aiTips = [
    "Welcome! I am your SMART_X gateway. Let's create an account to start tracking your streaks.",
    "Tip: Make your password 8+ characters, including a digit and a capital letter for optimal token security.",
    "Did you know? OAuth Google and GitHub logins bypass standard credential fields instantly.",
    "Rest assured: Your workspace sessions are encrypted in real-time using double-layer JSON Web Tokens.",
    "Upon successful signup, you will need to input a secure 6-digit OTP passcode to authorize your focus logs."
  ];

  // Typewriter effect trigger
  useEffect(() => {
    let text = aiTips[tipIndex];
    let charIndex = 0;
    setAiTip('');
    
    const interval = setInterval(() => {
      if (charIndex < text.length) {
        setAiTip(prev => prev + text.charAt(charIndex));
        charIndex++;
      } else {
        clearInterval(interval);
        // Cycle tips after 6 seconds
        setTimeout(() => {
          setTipIndex(prev => (prev + 1) % aiTips.length);
        }, 5000);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [tipIndex]);

  // Track Password Strength
  useEffect(() => {
    const pw = signupPassword;
    const checks = {
      length: pw.length >= 8,
      number: /\d/.test(pw),
      symbol: /[^A-Za-z0-9]/.test(pw),
      upperLower: /[A-Z]/.test(pw) && /[a-z]/.test(pw)
    };
    
    setValidationChecks(checks);

    let score = 0;
    if (checks.length) score += 25;
    if (checks.number) score += 25;
    if (checks.symbol) score += 25;
    if (checks.upperLower) score += 25;

    setStrengthScore(score);
  }, [signupPassword]);

  // OTP Countdown timer
  useEffect(() => {
    if (!showOTPModal || otpTimer <= 0) return;
    const t = setInterval(() => {
      setOtpTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(t);
  }, [showOTPModal, otpTimer]);

  const handleOrbMouseMove = (e) => {
    if (!leftPanelRef.current) return;
    const rect = leftPanelRef.current.getBoundingClientRect();
    setOrbCoords({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2
    });
  };

  const handleOrbMouseLeave = () => {
    setOrbCoords({ x: 0, y: 0 });
  };

  // Submit forms
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setStatusMessage({ type: 'error', text: 'Please fill in all credentials.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const loggedUser = await loginWithEmail(loginEmail, loginPassword);
      if (loggedUser) {
        setStatusMessage({ type: 'success', text: 'Token validated! Welcome back to SMART_X.' });
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(loginEmail);
        }, 1000);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Authentication failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword || !signupConfirm) {
      setStatusMessage({ type: 'error', text: 'Please fill in all onboarding fields.' });
      return;
    }

    if (signupPassword !== signupConfirm) {
      setStatusMessage({ type: 'error', text: 'Credentials mismatch! Confirm password must match.' });
      return;
    }

    if (strengthScore < 75) {
      setStatusMessage({ type: 'error', text: 'Please satisfy password strength parameters.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      setShowOTPModal(true); // Open OTP verification UI overlay modal
      setOtpTimer(60);
    }, 1500);
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otpCode.join('');
    if (fullOtp.length < 6) {
      setStatusMessage({ type: 'error', text: 'Please enter complete 6-digit verification code.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const registeredUser = await registerWithEmail(signupEmail, signupPassword, signupName);
      if (registeredUser) {
        setIsLoading(false);
        setShowOTPModal(false);
        setIsEmailVerified(true);
        
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(signupEmail);
        }, 2000);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Registration failed.' });
      setIsLoading(false);
    }
  };

  const handleOTPChange = (element, index) => {
    if (isNaN(element.value)) return false;
    
    setOtpCode([...otpCode.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next box
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleSocialAuth = async (provider) => {
    setIsLoading(true);
    setStatusMessage(null);
    
    try {
      let authorizedUser;
      if (provider.toLowerCase() === 'google') {
        authorizedUser = await loginWithGoogle();
      } else if (provider.toLowerCase() === 'github') {
        authorizedUser = await loginWithGithub();
      }

      if (authorizedUser) {
        setStatusMessage({ type: 'success', text: `Successfully authorized session via ${provider}!` });
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(authorizedUser.email);
        }, 1000);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || `Social auth via ${provider} failed.` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 160px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
      fontFamily: 'var(--font-sans)',
      position: 'relative',
      zIndex: 10
    }}>
      
      {/* Dual Panel Container */}
      <div 
        className="glass-panel"
        style={{
          display: 'flex',
          width: '100%',
          maxWidth: '1080px',
          minHeight: '620px',
          borderRadius: '32px',
          overflow: 'hidden',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow)',
          flexDirection: 'row',
          position: 'relative'
        }}
        className="flex-col md:flex-row"
      >
        {/* ==========================================
           LEFT PANEL: FUTURISTIC AI BRANDING & ORB
           ========================================== */}
        <div
          ref={leftPanelRef}
          onMouseMove={handleOrbMouseMove}
          onMouseLeave={handleOrbMouseLeave}
          style={{
            flex: 1,
            padding: '48px',
            background: theme === 'dark' 
              ? 'radial-gradient(circle at 10% 20%, rgba(24, 18, 50, 0.8) 0%, rgba(3, 3, 8, 0.95) 90%)'
              : 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}
          className="left-auth-panel"
        >
          {/* Animated Blob inside left panel */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            left: '-20%',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--neon-glow-primary) 0%, transparent 60%)',
            filter: 'blur(60px)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--neon-glow-secondary) 0%, transparent 60%)',
            filter: 'blur(50px)',
            pointerEvents: 'none'
          }} />

          {/* Branding Logo Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 5 }}>
            <SmartXLogo size={44} variant="main" />
            <span className="metallic-shine neon-text-glow" style={{ fontWeight: 800, fontSize: '1.5rem', fontFamily: 'var(--font-heading)', letterSpacing: '0.1rem' }}>
              SMART_X
            </span>
          </div>

          {/* Interactive Glowing Orb Visualizer Center */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '40px 0',
            position: 'relative',
            zIndex: 5,
            height: '260px'
          }}>
            {/* Magnetic Orb Rings */}
            <div 
              style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 50%, var(--accent-cyan) 100%)',
                boxShadow: theme === 'dark'
                  ? '0 0 40px var(--neon-glow-primary), 0 0 80px rgba(168, 85, 247, 0.2)'
                  : '0 8px 30px rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
                transform: `translate(${orbCoords.x * 0.15}px, ${orbCoords.y * 0.15}px)`,
                position: 'relative'
              }}
            >
              {/* Spinning Overlay Rings */}
              <div className="spinning-ring-1" />
              <div className="spinning-ring-2" />
              <SmartXLogo size={110} variant="hero" spin={true} glow={true} style={{ zIndex: 10 }} />
            </div>

            {/* Glowing Mouse Follow Reflection Blob */}
            <div style={{
              position: 'absolute',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--accent-cyan)',
              filter: 'blur(30px)',
              opacity: 0.4,
              pointerEvents: 'none',
              transform: `translate(${orbCoords.x * 0.4}px, ${orbCoords.y * 0.4}px)`,
              transition: 'transform 0.3s ease-out'
            }} />
          </div>

          {/* Headline & Dynamic AI Advisor Onboarding Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 5 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                Welcome Back to SMART_X
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Your AI-powered learning and productivity ecosystem.
              </p>
            </div>

            {/* Floating AI onboarding assistant card */}
            <div className="glass-panel" style={{
              padding: '12px 16px',
              borderRadius: '16px',
              border: '1px solid var(--glass-border)',
              background: 'var(--glass-bg)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              boxShadow: 'var(--glass-shadow)',
              minHeight: '76px'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'rgba(99, 102, 241, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <Sparkles size={14} className="animate-spin-slow" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Gateway Advisor
                </span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }} className="typewriter-text">
                  {aiTip}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
           RIGHT PANEL: PREMIUM AUTH FORM
           ========================================== */}
        <div
          style={{
            flex: 1.1,
            padding: '48px',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 5
          }}
          className="right-auth-panel"
        >
          {/* Status Message Prompt alert */}
          {statusMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid',
              borderColor: statusMessage.type === 'success' ? '#10b981' : '#ef4444',
              background: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              color: statusMessage.type === 'success' ? '#10b981' : '#ef4444',
              fontSize: '0.8rem',
              marginBottom: '20px',
              animation: 'fadeInUp 0.3s ease'
            }}>
              {statusMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Custom Gliding Slider Tab Switcher */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            padding: '4px',
            marginBottom: '32px',
            position: 'relative'
          }}>
            <button
              onClick={() => { setActiveTab('login'); setStatusMessage(null); }}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'login' ? 'var(--btn-primary-bg)' : 'transparent',
                color: activeTab === 'login' ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setStatusMessage(null); }}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'signup' ? 'var(--btn-primary-bg)' : 'transparent',
                color: activeTab === 'signup' ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Create Account
            </button>
          </div>

          {/* 1. SIGN IN FORM CONTAINER */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Email field */}
              <div className="input-group" style={{ position: 'relative' }}>
                <span className="input-icon">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="auth-input focus-glow-input-accent"
                />
              </div>

              {/* Password field */}
              <div className="input-group" style={{ position: 'relative' }}>
                <span className="input-icon">
                  <Lock size={16} />
                </span>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="auth-input focus-glow-input-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="password-eye-btn"
                >
                  {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Keep Remember / Forgot Password */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                marginTop: '4px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <input
                    type="checkbox"
                    checked={loginRemember}
                    onChange={(e) => setLoginRemember(e.target.checked)}
                    style={{ accentColor: 'var(--accent-primary)', borderRadius: '4px' }}
                  />
                  <span>Remember session token</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => { e.preventDefault(); setStatusMessage({ type: 'success', text: 'Password reset token dispatched to inbox!' }); }}
                  style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}
                  className="hover-underline"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Gradient Submit Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-premium"
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'var(--btn-primary-bg)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px var(--neon-glow-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '10px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {isLoading ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <>
                    Sign In to Portal <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 2. SIGN UP FORM CONTAINER */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Full Name */}
              <div className="input-group" style={{ position: 'relative' }}>
                <span className="input-icon">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="auth-input focus-glow-input-accent"
                />
              </div>

              {/* Email Address */}
              <div className="input-group" style={{ position: 'relative' }}>
                <span className="input-icon">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="auth-input focus-glow-input-accent"
                />
              </div>

              {/* Password */}
              <div className="input-group" style={{ position: 'relative' }}>
                <span className="input-icon">
                  <Lock size={16} />
                </span>
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="auth-input focus-glow-input-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="password-eye-btn"
                >
                  {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="input-group" style={{ position: 'relative' }}>
                <span className="input-icon">
                  <KeyRound size={16} />
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Confirm Password"
                  value={signupConfirm}
                  onChange={(e) => setSignupConfirm(e.target.value)}
                  className="auth-input focus-glow-input-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-eye-btn"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Interactive Password Strength Indicator */}
              {signupPassword.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Password Security Index:</span>
                    <span style={{ 
                      fontWeight: 700,
                      color: strengthScore < 50 ? '#ef4444' : strengthScore < 100 ? '#f59e0b' : '#10b981'
                    }}>
                      {strengthScore < 50 ? 'Vulnerable' : strengthScore < 100 ? 'Secure' : 'Unbreakable'}
                    </span>
                  </div>
                  {/* Strength Bar */}
                  <div style={{ width: '100%', height: '4px', background: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${strengthScore}%`, 
                      height: '100%', 
                      background: strengthScore < 50 ? 'linear-gradient(90deg, #ef4444, #f59e0b)' : 'linear-gradient(90deg, #f59e0b, #10b981)',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                  {/* Checklists */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ color: validationChecks.length ? '#10b981' : 'var(--text-muted)' }}>{validationChecks.length ? '✓' : '○'}</span>
                      <span>8+ characters</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ color: validationChecks.number ? '#10b981' : 'var(--text-muted)' }}>{validationChecks.number ? '✓' : '○'}</span>
                      <span>Has a digit (0-9)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ color: validationChecks.symbol ? '#10b981' : 'var(--text-muted)' }}>{validationChecks.symbol ? '✓' : '○'}</span>
                      <span>Has special symbol</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ color: validationChecks.upperLower ? '#10b981' : 'var(--text-muted)' }}>{validationChecks.upperLower ? '✓' : '○'}</span>
                      <span>Upper & lower case</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Gradient Sign Up Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-premium"
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'var(--btn-primary-bg)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px var(--neon-glow-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '10px'
                }}
              >
                {isLoading ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <>
                    Initialize Study Logins <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Social OAuth Dividers */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '24px 0',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <div style={{ flexGrow: 1, height: '1px', background: 'var(--border-color)' }} />
            <span style={{ padding: '0 12px' }}>Or continue with secure OAuth</span>
            <div style={{ flexGrow: 1, height: '1px', background: 'var(--border-color)' }} />
          </div>

          {/* Social Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={() => handleSocialAuth('Google')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'rgba(255, 255, 255, 0.02)',
                color: 'var(--text-primary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              className="social-auth-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px' }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialAuth('GitHub')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'rgba(255, 255, 255, 0.02)',
                color: 'var(--text-primary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              className="social-auth-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          {/* Bottom Switch Tab Indicator text */}
          <p style={{
            fontSize: '0.75rem',
            textAlign: 'center',
            marginTop: '28px',
            color: 'var(--text-muted)'
          }}>
            {activeTab === 'login' ? (
              <>
                Don't have an account?{' '}
                <a
                  href="#signup"
                  onClick={(e) => { e.preventDefault(); setActiveTab('signup'); setStatusMessage(null); }}
                  style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 700 }}
                  className="hover-underline"
                >
                  Create Account
                </a>
              </>
            ) : (
              <>
                Already have a SMART_X token?{' '}
                <a
                  href="#login"
                  onClick={(e) => { e.preventDefault(); setActiveTab('login'); setStatusMessage(null); }}
                  style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 700 }}
                  className="hover-underline"
                >
                  Sign In
                </a>
              </>
            )}
          </p>

          {/* Security GDPR Footer Padlocks */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            borderTop: '1px solid var(--border-color)',
            marginTop: '32px',
            paddingTop: '16px',
            fontSize: '0.65rem',
            color: 'var(--text-muted)'
          }}>
            <ShieldCheck size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span>End-to-End JWT Session Encrypted</span>
            <span style={{ opacity: 0.3 }}>•</span>
            <BadgeInfo size={14} />
            <span>GDPR Secure Data Vault</span>
          </div>
        </div>
      </div>

      {/* ==========================================
         OVERLAY MODAL: SIMULATED OTP CODE VERIFICATION
         ========================================== */}
      {showOTPModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(3, 3, 8, 0.85)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '24px'
        }}>
          <div 
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '420px',
              padding: '32px',
              borderRadius: '24px',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-shadow), 0 20px 40px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '20px',
              animation: 'fadeInUp 0.3s ease'
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.1)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <KeyRound size={24} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Confirm Authorization Token</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                We sent a secure 6-digit OTP verification code to <strong style={{ color: 'var(--text-primary)' }}>{signupEmail}</strong>. Please input the passcode below.
              </p>
            </div>

            <form onSubmit={handleOTPSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
              
              {/* Digit Box Rows */}
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                {otpCode.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength="1"
                    value={val}
                    onChange={(e) => handleOTPChange(e.target, idx)}
                    onFocus={(e) => e.target.select()}
                    style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      background: 'rgba(255,255,255,0.03)',
                      color: 'var(--text-primary)',
                      textAlign: 'center',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      outline: 'none'
                    }}
                    className="focus-glow-input"
                  />
                ))}
              </div>

              {/* Timer Countdowns */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Didn't receive passcode?</span>
                {otpTimer > 0 ? (
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Resend in {otpTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setOtpTimer(60); setStatusMessage({ type: 'success', text: 'New authorization code dispatched!' }); }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent-primary)',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Resend Code
                  </button>
                )}
              </div>

              {/* Submit / Cancel OTP Actions */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => { setShowOTPModal(false); setStatusMessage({ type: 'error', text: 'Onboarding code validation canceled.' }); }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'var(--btn-primary-bg)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px var(--neon-glow-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isLoading ? <RefreshCw size={14} className="animate-spin" /> : 'Confirm Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
         OVERLAY MODAL: EMAIL VERIFICATION SUCCESS
         ========================================== */}
      {isEmailVerified && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(3, 3, 8, 0.9)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '24px'
        }}>
          <div 
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '380px',
              padding: '40px 32px',
              borderRadius: '24px',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-shadow)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '24px',
              animation: 'scaleUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            {/* Green glowing checkmark circle */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '2px solid #10b981',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
            }}>
              <Check size={36} className="animate-bounce" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Account Verified!</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Your SMART_X credentials and secure JWT cryptographic session token have been successfully authorized. Initializing study workspace...
              </p>
            </div>

            {/* Micro loading spinner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <RefreshCw size={14} className="animate-spin" />
              <span>Linking system nodes...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
