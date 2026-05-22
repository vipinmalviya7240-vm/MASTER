import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import AIAssistant from './components/AIAssistant';
import Dashboard from './components/Dashboard';
import QuizGenerator from './components/QuizGenerator';
import Productivity from './components/Productivity';
import Community from './components/Community';
import Pricing from './components/Pricing';
import BackgroundEffects from './components/BackgroundEffects';
import FloatingChatbot from './components/FloatingChatbot';
import AuthPage from './components/AuthPage';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('smart_x_theme');
    if (saved) return saved;
    // Default to dark mode for ultra-futuristic look
    return 'dark';
  });

  const { user } = useAuth();

  // Synchronise redirection when user auth state updates
  useEffect(() => {
    if (user) {
      if (activeSection === 'auth' || activeSection === 'home') {
        setActiveSection('dashboard');
      }
    }
  }, [user]);

  // Apply theme class to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('smart_x_theme', theme);
  }, [theme]);

  const handleAuthSuccess = (email) => {
    setActiveSection('dashboard'); // Redirect to dashboard workspace
  };



  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Helper to render correct tab workspace view
  const renderView = () => {
    switch (activeSection) {
      case 'home':
        return (
          <>
            <Hero setActiveSection={setActiveSection} />
            <Features />
            <Pricing />
          </>
        );
      case 'features':
        return <Features />;
      case 'assistant':
        return <AIAssistant />;
      case 'dashboard':
        return <Dashboard />;
      case 'quiz':
        return <QuizGenerator />;
      case 'productivity':
        return <Productivity />;
      case 'community':
        return <Community />;
      case 'pricing':
        return <Pricing />;
      case 'auth':
        return <AuthPage theme={theme} onAuthSuccess={handleAuthSuccess} />;
      default:
        return <Hero setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="app-container">
      {/* Dynamic Interactive Canvas & Glow Blobs */}
      <BackgroundEffects theme={theme} />

      {/* Floating Sticky Glassmorphism Header */}
      <Navbar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />

      {/* Dynamic Workspace Container */}
      <main style={{ flexGrow: 1 }}>
        {renderView()}
      </main>

      {/* Futuristic Grid Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '48px 24px 32px',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        marginTop: '80px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '40px',
          textAlign: 'left'
        }} className="md:grid-cols-4">
          {/* Logo & Desc */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="md:col-span-2">
            <span className="gradient-text neon-text-glow" style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              SMART_X
            </span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '340px', lineHeight: 1.5 }}>
              Next-generation AI-powered education and productivity ecosystem designed to amplify cognitive intelligence, streamline study planning, and gamify academic success.
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              © 2026 SMART_X Inc. Silicon Valley, CA. All rights reserved.
            </span>
          </div>

          {/* Links 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
              Syllabus Ecosystem
            </h4>
            {['Mathematics', 'Astrophysics', 'Neural Networks', 'UI UX Systems', 'Creative Music'].map((lnk) => (
              <a 
                key={lnk} 
                href="#subject"
                onClick={(e) => { e.preventDefault(); setActiveSection('assistant'); }}
                style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none' }}
              >
                {lnk}
              </a>
            ))}
          </div>

          {/* Links 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
              Product Features
            </h4>
            {['AI Quiz Generator', 'Kanban Study Board', 'Pomodoro Study Timer', 'Active Whiteboard Sandbox', 'Pricing Models'].map((lnk, i) => {
              const targets = ['quiz', 'productivity', 'productivity', 'assistant', 'pricing'];
              return (
                <a 
                  key={lnk} 
                  href={`#${targets[i]}`}
                  onClick={(e) => { e.preventDefault(); setActiveSection(targets[i]); }}
                  style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none' }}
                >
                  {lnk}
                </a>
              );
            })}
          </div>
        </div>
      </footer>

      {/* Persistently Mounted Futuristic AI Floating Chatbot Box */}
      <FloatingChatbot theme={theme} />
    </div>
  );
}

export default App;
