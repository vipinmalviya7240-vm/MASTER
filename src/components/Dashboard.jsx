import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Clock, Zap, Flame, Target, Trophy, Award, 
  ArrowUpRight, ArrowDownRight, Compass, ShieldAlert, Sparkles 
} from 'lucide-react';
import { fetchDashboardStats, fetchDashboardProgress } from '../utils/api';

const Dashboard = () => {
  const [hoveredDay, setHoveredDay] = useState(null);

  // Core metrics state
  const [metrics, setMetrics] = useState([
    { label: 'Lessons Completed', value: '42', change: '+8% this week', isUp: true, icon: <BookOpen size={18} className="text-indigo-400" /> },
    { label: 'AI Study Time', value: '18.4 hrs', change: '+3.2 hrs', isUp: true, icon: <Clock size={18} className="text-purple-400" /> },
    { label: 'XP Earned', value: '8,450 XP', change: '+1,200 XP', isUp: true, icon: <Zap size={18} className="text-yellow-400" /> },
    { label: 'Daily Streak', value: '14 Days', change: '🔥 Focus Peak', isUp: true, icon: <Flame size={18} className="text-pink-400" /> },
    { label: 'Productivity Score', value: '94/100', change: '+2% optimized', isUp: true, icon: <Target size={18} className="text-emerald-400" /> },
    { label: 'Global Ranking', value: '#128', change: 'Top 1% elite', isUp: true, icon: <Trophy size={18} className="text-yellow-500" /> }
  ]);

  // Subjects progress state
  const [progressBars, setProgressBars] = useState([
    { label: 'Mathematics', percent: 85, color: 'var(--accent-primary)', xp: '2400 XP' },
    { label: 'Coding & Data Systems', percent: 92, color: 'var(--accent-cyan)', xp: '3100 XP' },
    { label: 'Science & Astrophysics', percent: 70, color: 'var(--accent-secondary)', xp: '1800 XP' },
    { label: 'English & Composition', percent: 65, color: 'var(--accent-pink)', xp: '1150 XP' }
  ]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const stats = await fetchDashboardStats();
        if (stats) {
          setMetrics([
            { label: 'Lessons Completed', value: String(stats.completedLessons), change: '+8% this week', isUp: true, icon: <BookOpen size={18} className="text-indigo-400" /> },
            { label: 'AI Study Time', value: `${stats.focusTime} hrs`, change: '+3.2 hrs', isUp: true, icon: <Clock size={18} className="text-purple-400" /> },
            { label: 'XP Earned', value: `${stats.xp.toLocaleString()} XP`, change: '+1,200 XP', isUp: true, icon: <Zap size={18} className="text-yellow-400" /> },
            { label: 'Daily Streak', value: `${stats.streak} Days`, change: '🔥 Focus Peak', isUp: true, icon: <Flame size={18} className="text-pink-400" /> },
            { label: 'Productivity Score', value: `${stats.productivityScore}/100`, change: '+2% optimized', isUp: true, icon: <Target size={18} className="text-emerald-400" /> },
            { label: 'Global Ranking', value: `#${stats.ranking}`, change: 'Top 1% elite', isUp: true, icon: <Trophy size={18} className="text-yellow-500" /> }
          ]);
        }
      } catch (err) {
        console.warn('⚠️ Error loading dashboard stats from Express API.');
      }

      try {
        const progressData = await fetchDashboardProgress();
        if (progressData && Array.isArray(progressData.progress)) {
          const colors = ['var(--accent-primary)', 'var(--accent-cyan)', 'var(--accent-secondary)', 'var(--accent-pink)'];
          setProgressBars(progressData.progress.map((p, idx) => ({
            label: p.subject,
            percent: p.percent,
            color: colors[idx % colors.length],
            xp: p.xp
          })));
        }
      } catch (err) {
        console.warn('⚠️ Error loading dashboard progress from Express API.');
      }
    };

    loadDashboardData();
  }, []);

  // Study hours data for the weekly SVG chart
  const weeklyData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.8 },
    { day: 'Wed', hours: 1.2 },
    { day: 'Thu', hours: 4.5 },
    { day: 'Fri', hours: 2.9 },
    { day: 'Sat', hours: 5.2 },
    { day: 'Sun', hours: 4.1 }
  ];

  // Achievements
  const badges = [
    { title: 'Top Learner', desc: 'Finished 5 lessons in 24 hrs', icon: '🏆', color: '#fbbf24', unlocked: true },
    { title: 'Speed Solver', desc: 'Solved quadratic in 15s', icon: '⚡', color: '#38bdf8', unlocked: true },
    { title: 'AI Master', desc: 'Interacted with AI tutor 100+ times', icon: '🤖', color: '#c084fc', unlocked: true },
    { title: 'Goal Crusher', desc: 'Finished weekly goals early', icon: '🎯', color: '#34d399', unlocked: true },
    { title: 'Quiz Champion', desc: 'Scored 100% on Expert Physics', icon: '👑', color: '#f472b6', unlocked: false }
  ];

  // Interactive study heatmap mock structure (7 days, 12 weeks)
  const heatmapWeeks = Array.from({ length: 14 }, (_, i) => i);
  const heatmapDays = Array.from({ length: 7 }, (_, i) => i);

  return (
    <section className="content-section" style={{ textAlign: 'left' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Personal Analytics Hub
        </span>
        <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: 800 }}>
          Your <span className="gradient-text neon-text-glow">SMART_X Dashboard</span>
        </h2>
      </div>

      {/* Main Grid: Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(1, 1fr)',
        gap: '20px',
        marginBottom: '32px'
      }} className="sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m, i) => (
          <div key={i} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', width: '100%' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{m.label}</span>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 'auto'
              }}>
                {m.icon}
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>{m.value}</span>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: m.isUp ? '#10b981' : '#f43f5e',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}>
                {m.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {m.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Column & Subject Progress */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '24px',
        marginBottom: '32px'
      }} className="lg:grid-cols-2">
        
        {/* Weekly Study Time SVG Chart */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Weekly Focus Heatmap</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hover bars to inspect study duration parameters</p>
          </div>

          {/* Interactive SVG Chart */}
          <div style={{ position: 'relative', height: '220px', width: '100%', marginTop: '10px' }}>
            <svg viewBox="0 0 500 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
              {/* Horizontal gridlines */}
              <line x1="30" y1="20" x2="480" y2="20" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="30" y1="70" x2="480" y2="70" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="30" y1="120" x2="480" y2="120" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="30" y1="170" x2="480" y2="170" stroke="var(--border-color)" strokeWidth="1.5" />

              {/* Bar charts rendering */}
              {weeklyData.map((d, idx) => {
                const x = 50 + idx * 60;
                const barHeight = d.hours * 25;
                const y = 170 - barHeight;
                const isHovered = hoveredDay === idx;

                return (
                  <g key={idx} onMouseEnter={() => setHoveredDay(idx)} onMouseLeave={() => setHoveredDay(null)}>
                    {/* Glowing bar background filter */}
                    <rect
                      x={x}
                      y={y}
                      width="28"
                      height={barHeight}
                      rx="6"
                      fill={isHovered ? 'var(--accent-secondary)' : 'var(--accent-primary)'}
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                        filter: isHovered ? 'drop-shadow(0px 0px 8px var(--accent-secondary))' : 'none'
                      }}
                    />
                    {/* Text values on hover */}
                    {isHovered && (
                      <text
                        x={x + 14}
                        y={y - 10}
                        textAnchor="middle"
                        fill="var(--text-primary)"
                        fontSize="11"
                        fontWeight="700"
                      >
                        {d.hours} hrs
                      </text>
                    )}
                    {/* Label */}
                    <text
                      x={x + 14}
                      y="190"
                      textAnchor="middle"
                      fill="var(--text-secondary)"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {d.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Dynamic Skill Level Progress */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>AI Syllabus Index</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Progress metrics aligned with academic benchmarks</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1, justifyContent: 'center' }}>
            {progressBars.map((p, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-primary)' }}>{p.label}</span>
                  <span style={{ color: p.color, fontWeight: 700 }}>{p.percent}% ({p.xp})</span>
                </div>
                {/* Visual Progress Bar Wrapper */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '9999px',
                  background: 'rgba(0,0,0,0.05)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${p.percent}%`,
                    height: '100%',
                    borderRadius: '9999px',
                    background: p.color,
                    boxShadow: `0 0 8px ${p.color}50`,
                    transition: 'width 1.2s cubic-bezier(0.25, 0.8, 0.25, 1)'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grid: Heatmap Grid & Badges */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '24px'
      }} className="lg:grid-cols-3">
        
        {/* Visual study heatmap block */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="lg:col-span-2">
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Daily Focus Consistency</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Year-round activity map (Simulated tracking index)</p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            overflowX: 'auto',
            paddingBottom: '10px'
          }}>
            {heatmapDays.map((dIdx) => (
              <div key={dIdx} style={{ display: 'flex', gap: '4px' }}>
                {heatmapWeeks.map((wIdx) => {
                  // Simulate random activity density
                  const seed = (dIdx * 3 + wIdx * 7) % 11;
                  let color = 'rgba(255, 255, 255, 0.03)';
                  let titleVal = 'No focus session';
                  
                  if (seed > 8) {
                    color = 'var(--accent-primary)';
                    titleVal = 'High focus (4+ hrs)';
                  } else if (seed > 5) {
                    color = 'var(--accent-secondary)';
                    titleVal = 'Medium focus (2-3 hrs)';
                  } else if (seed > 2) {
                    color = 'var(--accent-cyan)';
                    titleVal = 'Short review (1 hr)';
                  }

                  return (
                    <div
                      key={wIdx}
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '2px',
                        backgroundColor: color,
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer'
                      }}
                      title={titleVal}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            <span>Less consistent</span>
            <div style={{ display: 'flex', gap: '3px' }}>
              <div style={{ width: '10px', height: '10px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }} />
              <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--accent-cyan)' }} />
              <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--accent-secondary)' }} />
              <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--accent-primary)' }} />
            </div>
            <span>Highly consistent</span>
          </div>
        </div>

        {/* Gamified Achievements Badges */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Unlocked Achievements</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Claim rewards and custom profile badges</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {badges.map((badge, i) => (
              <div 
                key={i} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  opacity: badge.unlocked ? 1 : 0.45,
                  padding: '8px 10px',
                  borderRadius: '10px',
                  background: badge.unlocked ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                  border: badge.unlocked ? '1px solid var(--border-color)' : '1px dashed var(--border-color)',
                }}
              >
                <div style={{
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  boxShadow: badge.unlocked ? `0 0 10px ${badge.color}25` : 'none'
                }}>
                  {badge.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{badge.title}</h4>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>{badge.desc}</span>
                </div>
                {badge.unlocked && (
                  <Sparkles size={12} className="text-yellow-400" style={{ marginLeft: 'auto' }} />
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Dashboard;
