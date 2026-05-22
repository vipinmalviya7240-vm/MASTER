import React from 'react';
import { 
  MessageSquare, BarChart2, Award, BookOpen, Users, Mic, 
  FileText, Zap, Compass, Calendar, CheckSquare, TrendingUp 
} from 'lucide-react';

const Features = () => {
  const featureList = [
    {
      title: 'AI-Powered Tutoring',
      desc: 'Get step-by-step guidance, formula expansions, and intuitive explanations for any query 24/7.',
      icon: <MessageSquare size={24} style={{ color: 'var(--accent-primary)' }} />,
      glowColor: 'var(--accent-primary)'
    },
    {
      title: 'Smart Progress Analytics',
      desc: 'Track and visualize your strengths, weaknesses, focus times, and overall skill indexes visually.',
      icon: <BarChart2 size={24} style={{ color: 'var(--accent-secondary)' }} />,
      glowColor: 'var(--accent-secondary)'
    },
    {
      title: 'Gamified Learning System',
      desc: 'Earn XP, level up, maintain daily focus streaks, and earn master badges for accomplishments.',
      icon: <Award size={24} style={{ color: 'var(--accent-cyan)' }} />,
      glowColor: 'var(--accent-cyan)'
    },
    {
      title: 'Multi-Subject AI Support',
      desc: 'Deep knowledge mapping across Math, Physics, Chemistry, Languages, Design, Music, and Coding.',
      icon: <BookOpen size={24} style={{ color: 'var(--accent-pink)' }} />,
      glowColor: 'var(--accent-pink)'
    },
    {
      title: 'Real-Time Collaboration',
      desc: 'Join active virtual study rooms with active peer collaboration and shared whiteboard sessions.',
      icon: <Users size={24} style={{ color: 'var(--accent-primary)' }} />,
      glowColor: 'var(--accent-primary)'
    },
    {
      title: 'Voice AI Assistant',
      desc: 'Talk naturally with high-fidelity, multilingual audio feedback in multiple regional accents.',
      icon: <Mic size={24} style={{ color: 'var(--accent-secondary)' }} />,
      glowColor: 'var(--accent-secondary)'
    },
    {
      title: 'AI Notes Summarizer',
      desc: 'Instantly condense research documents, lecture slides, and notes into clean, digestible outlines.',
      icon: <FileText size={24} style={{ color: 'var(--accent-cyan)' }} />,
      glowColor: 'var(--accent-cyan)'
    },
    {
      title: 'Adaptive Learning Engine',
      desc: 'The platform adjusts curriculum density, test complexity, and schedules based on user accuracy.',
      icon: <Zap size={24} style={{ color: 'var(--accent-pink)' }} />,
      glowColor: 'var(--accent-pink)'
    },
    {
      title: 'AI Career Roadmap',
      desc: 'Obtain customized professional tracks, standard core syllabus guides, and career benchmarks.',
      icon: <Compass size={24} style={{ color: 'var(--accent-primary)' }} />,
      glowColor: 'var(--accent-primary)'
    },
    {
      title: 'Smart Study Planner',
      desc: 'Auto-schedule revision sessions, test dates, and assignments balanced perfectly around rest hours.',
      icon: <Calendar size={24} style={{ color: 'var(--accent-secondary)' }} />,
      glowColor: 'var(--accent-secondary)'
    },
    {
      title: 'AI Quiz Generator',
      desc: 'Custom-build exams based on customized themes, precise subject parameters, and custom difficulty.',
      icon: <CheckSquare size={24} style={{ color: 'var(--accent-cyan)' }} />,
      glowColor: 'var(--accent-cyan)'
    },
    {
      title: 'AI Productivity Tracker',
      desc: 'Organize dynamic schedules, track habits, set Pomodoros, and optimize your focus heatmaps.',
      icon: <TrendingUp size={24} style={{ color: 'var(--accent-pink)' }} />,
      glowColor: 'var(--accent-pink)'
    }
  ];

  return (
    <section className="content-section" style={{ textAlign: 'center' }}>
      {/* Title */}
      <div style={{ marginBottom: '60px' }}>
        <span style={{
          fontSize: '0.85rem',
          fontWeight: 700,
          color: 'var(--accent-primary)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '12px'
        }}>
          Revolutionary Learning
        </span>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          lineHeight: 1.2,
          fontWeight: 800,
          marginBottom: '20px'
        }}>
          Advanced AI Features Built for <br />
          <span className="gradient-text neon-text-glow">Smart Learners</span>
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto',
          fontSize: '1.05rem',
          lineHeight: 1.6
        }}>
          Unlock your true cognitive potential with our specialized stack of learning utilities powered by advanced natural language modeling.
        </p>
      </div>

      {/* Grid of Cards */}
      <div className="feature-card-grid">
        {featureList.map((card, i) => (
          <div 
            key={i} 
            className="glass-card"
            style={{
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              cursor: 'pointer'
            }}
          >
            {/* Background dynamic glow blob on hover */}
            <div style={{
              position: 'absolute',
              top: '-30%',
              left: '-30%',
              width: '160%',
              height: '160%',
              background: `radial-gradient(circle, ${card.glowColor}10 0%, transparent 60%)`,
              zIndex: 0,
              pointerEvents: 'none',
              transition: 'opacity 0.3s ease'
            }} />

            {/* Icon Wrapper */}
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--glass-shadow)',
              position: 'relative',
              zIndex: 1
            }}>
              {card.icon}
            </div>

            {/* Info */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                {card.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
