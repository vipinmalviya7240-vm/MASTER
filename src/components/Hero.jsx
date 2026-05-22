import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Award, Compass, MessageSquare, BookOpen, Layers, Zap, Clock, Users, ArrowRight } from 'lucide-react';

const Hero = ({ setActiveSection }) => {
  const [activeWords, setActiveWords] = useState('SMART_X');
  const words = ['SMART_X', 'AI Ecosystem', 'Future Learning'];

  // Word carousel for the main heading
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWords((prev) => {
        const nextIdx = (words.indexOf(prev) + 1) % words.length;
        return words[nextIdx];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Mini simulated live chatbot cycles
  const [chatStep, setChatStep] = useState(0);
  const chatMessages = [
    { sender: 'user', text: 'Help me solve quadratic equations.' },
    { sender: 'ai', text: 'Sure! Let’s solve it step-by-step using the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a.' },
    { sender: 'user', text: 'What is the value of x for x² - 5x + 6 = 0?' },
    { sender: 'ai', text: 'For this equation: a = 1, b = -5, c = 6. Substituting them in, we get x = 3 and x = 2!' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setChatStep((prev) => (prev + 1) % chatMessages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="content-section" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center' }}>
      <div className="grid-2" style={{ width: '100%' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            width: 'fit-content',
            marginBottom: '24px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--accent-primary)',
            boxShadow: 'var(--glass-shadow)',
          }}>
            <Sparkles size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
            Next-Gen AI Learning Ecosystem
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            lineHeight: 1.1,
            marginBottom: '20px',
            fontFamily: 'var(--font-heading)'
          }}>
            Learn Faster with <br />
            <span className="gradient-text neon-text-glow" style={{ transition: 'all 0.5s ease' }}>
              {activeWords}
            </span>
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            marginBottom: '36px',
            maxWidth: '560px',
            lineHeight: 1.6
          }}>
            An all-in-one AI-powered education ecosystem with personalized tutoring, intelligent analytics, adaptive learning, AI quizzes, voice interaction, productivity tools, and real-time progress tracking.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '48px' }}>
            <button 
              onClick={() => setActiveSection('dashboard')}
              className="btn-premium primary"
            >
              Start Learning Free <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => setActiveSection('assistant')}
              className="btn-premium secondary"
            >
              <Play size={16} fill="currentColor" /> Watch Live Demo
            </button>
          </div>

          {/* Stats Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
            padding: '24px',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '16px',
            maxWidth: '520px'
          }} className="sm:grid-cols-4">
            {[
              { value: '100K+', label: 'Students', icon: <Users size={16} /> },
              { value: '500+', label: 'AI Courses', icon: <BookOpen size={16} /> },
              { value: '99%', label: 'Accuracy', icon: <Award size={16} /> },
              { value: '24/7', label: 'AI Tutor', icon: <Clock size={16} /> }
            ].map((stat, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                  {stat.icon}
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
                </div>
                <span className="gradient-text" style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          
          {/* Main Simulated AI Assistant Dashboard Card */}
          <div className="glass-card animate-float" style={{
            width: '100%',
            maxWidth: '460px',
            padding: '24px',
            position: 'relative',
            zIndex: 10,
            overflow: 'visible'
          }}>
            {/* Ambient card background glow */}
            <div style={{
              position: 'absolute',
              top: '-15%',
              left: '-15%',
              width: '130%',
              height: '130%',
              background: 'radial-gradient(circle, var(--neon-glow-primary) 0%, transparent 60%)',
              zIndex: -1,
              pointerEvents: 'none'
            }} />

            {/* Header of AI Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-primary) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}>
                    X
                  </div>
                  <div style={{ position: 'absolute', bottom: '0', right: '0' }}>
                    <span className="online-pulse" />
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>SMART_X Tutor</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div className="audio-wave">
                      <div className="audio-bar" />
                      <div className="audio-bar" />
                      <div className="audio-bar" />
                      <div className="audio-bar" />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Voice response ready</span>
                  </div>
                </div>
              </div>
              <div style={{
                background: 'rgba(34, 211, 238, 0.1)',
                border: '1.5px solid var(--accent-cyan)',
                color: 'var(--accent-cyan)',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                99.4% Accurate
              </div>
            </div>

            {/* Dialog space */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              minHeight: '190px',
              fontSize: '0.9rem',
              justifyContent: 'flex-end',
              padding: '10px 0'
            }}>
              {chatMessages.map((msg, idx) => {
                const isVisible = idx <= chatStep;
                return (
                  <div 
                    key={idx} 
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
                      transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      width: '100%',
                      margin: isVisible ? '2px 0' : '0',
                      height: isVisible ? 'auto' : '0px',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      maxWidth: '85%',
                      lineHeight: 1.4,
                      background: msg.sender === 'user' ? 'var(--btn-primary-bg)' : 'rgba(255,255,255,0.06)',
                      color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)',
                      border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                      boxShadow: msg.sender === 'user' ? '0 4px 10px rgba(99,102,241,0.2)' : 'none'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Realtime Smart Indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '16px',
              padding: '10px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px dashed var(--border-color)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}>
              <Zap size={14} className="text-yellow-400" />
              <span>Real-time recommendation: <strong>Try quadratic practice quiz</strong></span>
            </div>
          </div>

          {/* Floating Widget 1 - Quiz Suggestions */}
          <div className="glass-panel" style={{
            position: 'absolute',
            top: '-20px',
            right: '-15px',
            padding: '12px 16px',
            zIndex: 11,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.8rem',
            fontWeight: 600,
            transform: 'rotate(4deg)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            animation: 'float 5s ease-in-out infinite alternate'
          }}>
            <Award size={16} className="text-yellow-500 animate-pulse" />
            <div>
              <p style={{ color: 'var(--text-primary)' }}>Quiz Recommendation</p>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Quadratic Mastery +25XP</span>
            </div>
          </div>

          {/* Floating Widget 2 - Study Reminder */}
          <div className="glass-panel" style={{
            position: 'absolute',
            bottom: '-25px',
            left: '-25px',
            padding: '12px 16px',
            zIndex: 11,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.8rem',
            fontWeight: 600,
            transform: 'rotate(-3deg)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            animation: 'float 5.5s ease-in-out infinite alternate-reverse'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-pink)',
              boxShadow: '0 0 6px var(--accent-pink)'
            }} />
            <div>
              <p style={{ color: 'var(--text-primary)' }}>Daily Streak Tracker</p>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>14 Days Active 🔥</span>
            </div>
          </div>

          {/* Floating Widget 3 - AI Notes */}
          <div className="glass-panel" style={{
            position: 'absolute',
            top: '45%',
            right: '-30px',
            padding: '10px 14px',
            zIndex: 9,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.75rem',
            transform: 'rotate(6deg)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
            color: 'var(--text-secondary)'
          }}>
            <BookOpen size={14} className="text-purple-400" />
            <span>AI Lecture Notes Exported</span>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;
