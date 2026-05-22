import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, Cpu, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SmartXLogo from './SmartXLogo';

const Navbar = ({ activeSection, setActiveSection, theme, toggleTheme }) => {
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const userEmail = user?.email || '';
  const userDisplayName = user?.displayName || userEmail.split('@')[0] || '';
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'assistant', label: 'AI Assistant' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'quiz', label: 'Quiz AI' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'community', label: 'Community' },
    { id: 'pricing', label: 'Pricing' }
  ];

  const handleNavClick = (id) => {
    setActiveSection(id);
    setIsOpen(false);
    
    // Scroll to top or specific section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    await logout();
    setActiveSection('home');
    setIsOpen(false);
  };

  return (
    <nav 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        padding: scrolled ? '12px 24px' : '20px 24px',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        borderBottom: scrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
        background: scrolled ? 'var(--glass-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none'
      }}
    >
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: '1.75rem',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          }}
        >
          <SmartXLogo size={48} variant="main" />
          <span className="metallic-shine neon-text-glow" style={{ transition: 'all 0.3s ease' }}>SMART_X</span>
        </div>

        {/* Desktop Links */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '8px'
        }} className="md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              style={{
                background: 'transparent',
                border: 'none',
                fontFamily: 'inherit'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Action Panel */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '16px'
        }} className="md:flex">
          {/* Day / Night Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              boxShadow: 'var(--glass-shadow)',
              position: 'relative',
              overflow: 'hidden'
            }}
            title="Toggle theme"
          >
            <div style={{
              transform: theme === 'dark' ? 'translateY(40px)' : 'translateY(0)',
              transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'absolute'
            }}>
              <Sun size={20} className="text-yellow-500" />
            </div>
            <div style={{
              transform: theme === 'dark' ? 'translateY(0)' : 'translateY(-40px)',
              transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'absolute'
            }}>
              <Moon size={20} className="text-indigo-400" />
            </div>
          </button>

          {/* Authentication Badge Options */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Profile Circle Badge */}
              <div 
                onClick={() => handleNavClick('dashboard')}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  border: '2px solid var(--glass-border)',
                  boxShadow: '0 4px 12px var(--neon-glow-primary)',
                  textTransform: 'uppercase'
                }}
                title={userEmail}
              >
                {userEmail.charAt(0)}
              </div>
              <button 
                onClick={handleSignOut}
                className="btn-premium"
                style={{
                  padding: '10px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)'
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => handleNavClick('auth')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  padding: '8px 16px'
                }}
                className="hover-underline"
              >
                Sign In
              </button>
              <button 
                onClick={() => handleNavClick('auth')}
                className="btn-premium primary"
              >
                Join Free <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }} className="md:hidden">
          <button
            onClick={toggleTheme}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-primary)'
            }}
          >
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              padding: '8px',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: '75px',
          left: '16px',
          right: '16px',
          padding: '24px',
          zIndex: 49,
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow)',
          animation: 'float 0.4s ease'
        }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                textAlign: 'left',
                width: '100%',
                background: 'transparent',
                border: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: activeSection === item.id ? 700 : 500,
                color: activeSection === item.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: activeSection === item.id ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                cursor: 'pointer'
              }}
            >
              {item.label}
            </button>
          ))}
          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 16px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userEmail}</span>
              </div>
              <button 
                onClick={handleSignOut}
                className="btn-premium"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <button 
                onClick={() => { handleNavClick('auth'); setIsOpen(false); }}
                className="btn-premium"
                style={{ width: '100%', justifyContent: 'center', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              >
                Sign In
              </button>
              <button 
                onClick={() => { handleNavClick('auth'); setIsOpen(false); }}
                className="btn-premium primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Get Started Free
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
