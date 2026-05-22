import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash, Check, CheckSquare, Target, Clock, Calendar } from 'lucide-react';

const Productivity = () => {
  // Pomodoro Timer States
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  // Kanban Tasks States
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Review Calculus formulas', category: 'To Do' },
    { id: 2, text: 'Complete React data metrics layout', category: 'In Progress' },
    { id: 3, text: 'Doodle chemical compound links', category: 'Done' }
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  // Habits checkoffs states (5 habits, 5 days)
  const [habitChecks, setHabitChecks] = useState({
    'No-distraction study': [true, true, false, true, false],
    'Complete AI quiz': [false, true, true, false, true],
    'Doodle whiteboard maps': [true, false, false, true, false],
    'Drink 3L Water': [true, true, true, true, true]
  });

  // Pomodoro Timer Mechanisms
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(timerRef.current);
            setIsActive(false);
            alert("Focus period complete! Take a well-deserved short break. ⚡");
            setMinutes(25);
            setSeconds(0);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, minutes, seconds]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  // Kanban Tasks Mechanisms
  const addTask = () => {
    if (!newTaskText.trim()) return;
    const newTask = {
      id: Date.now(),
      text: newTaskText,
      category: 'To Do'
    };
    setTasks(prev => [...prev, newTask]);
    setNewTaskText('');
  };

  const moveTask = (taskId, newCat) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, category: newCat } : t));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Habits checkoff mechanisms
  const toggleHabitCheck = (habitLabel, dayIdx) => {
    setHabitChecks(prev => {
      const list = [...prev[habitLabel]];
      list[dayIdx] = !list[dayIdx];
      return { ...prev, [habitLabel]: list };
    });
  };

  return (
    <section className="content-section" style={{ textAlign: 'left' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Mindfulness & Tasks
        </span>
        <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: 800 }}>
          AI <span className="gradient-text neon-text-glow">Productivity Ecosystem</span>
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="lg:grid-cols-3">
        
        {/* Kanban Task Board - Left Columns */}
        <div className="glass-panel lg:col-span-2" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Task Kanban Planner</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Auto-sync with your smart study calendar</p>
          </div>

          {/* Quick Task Adder */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add smart planning task..."
              style={{
                flexGrow: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-main)',
                color: 'var(--text-primary)',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
            <button
              onClick={addTask}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--btn-primary-bg)',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600,
                boxShadow: '0 4px 10px rgba(99,102,241,0.2)'
              }}
            >
              <Plus size={16} /> Add
            </button>
          </div>

          {/* Columns Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '16px'
          }} className="sm:grid-cols-3">
            {['To Do', 'In Progress', 'Done'].map((col) => (
              <div 
                key={col} 
                style={{
                  background: 'rgba(0,0,0,0.02)',
                  borderRadius: '12px',
                  padding: '14px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  minHeight: '220px'
                }}
              >
                <h4 style={{
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: col === 'To Do' ? 'var(--accent-pink)' : col === 'In Progress' ? 'var(--accent-cyan)' : '#10b981',
                  borderBottom: '1px solid var(--border-color)',
                  paddingBottom: '8px',
                  letterSpacing: '0.05em'
                }}>
                  {col} ({tasks.filter(t => t.category === col).length})
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
                  {tasks.filter(t => t.category === col).map((task) => (
                    <div
                      key={task.id}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        boxShadow: 'var(--glass-shadow)',
                        fontSize: '0.8rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>{task.text}</span>
                      
                      {/* Interactive Actions within Card */}
                      <div style={{ display: 'flex', gap: '4px', marginTop: '4px', alignItems: 'center' }}>
                        {col !== 'To Do' && (
                          <button 
                            onClick={() => moveTask(task.id, col === 'In Progress' ? 'To Do' : 'In Progress')}
                            style={{ padding: '2px 4px', fontSize: '0.65rem', borderRadius: '4px', background: 'transparent', border: '1px solid var(--border-color)', cursor: 'pointer', color: 'var(--text-secondary)' }}
                          >
                            ← Back
                          </button>
                        )}
                        {col !== 'Done' && (
                          <button 
                            onClick={() => moveTask(task.id, col === 'To Do' ? 'In Progress' : 'Done')}
                            style={{ padding: '2px 4px', fontSize: '0.65rem', borderRadius: '4px', background: 'transparent', border: '1px solid var(--border-color)', cursor: 'pointer', color: 'var(--text-secondary)', marginLeft: 'auto' }}
                          >
                            Next →
                          </button>
                        )}
                        <button 
                          onClick={() => deleteTask(task.id)}
                          style={{ padding: '2px 4px', fontSize: '0.65rem', borderRadius: '4px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#f43f5e', marginLeft: col === 'Done' ? 'auto' : '4px' }}
                          title="Delete Task"
                        >
                          <Trash size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pomodoro Focus Timer & Habits - Right Columns */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Pomodoro Card */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
            <div style={{ alignSelf: 'flex-start' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} style={{ color: 'var(--accent-secondary)' }} />
                Focus Pomodoro
              </h3>
            </div>

            {/* Circular Timer Visual Display */}
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, var(--glass-bg) 0%, rgba(255,255,255,0.02) 100%)',
              border: '4px solid var(--glass-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--glass-shadow), 0 0 15px var(--neon-glow-primary)',
              position: 'relative'
            }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {isActive ? 'Keep Studying' : 'Timer Idle'}
              </span>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button
                onClick={toggleTimer}
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: isActive ? 'var(--accent-pink)' : 'var(--btn-primary-bg)',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}
              >
                {isActive ? <Pause size={14} /> : <Play size={14} />} {isActive ? 'Pause' : 'Start'}
              </button>

              <button
                onClick={resetTimer}
                style={{
                  padding: '8px 12px',
                  borderRadius: '9999px',
                  border: '1px solid var(--border-color)',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Reset Timer"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Habits Tracker Card */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={18} style={{ color: 'var(--accent-cyan)' }} />
                Habit Streak Tracker
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Maintain checkoff status over the last 5 days</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.keys(habitChecks).map((habitLabel) => (
                <div key={habitLabel} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{habitLabel}</span>
                  
                  {/* Days grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                    {habitChecks[habitLabel].map((checked, dayIdx) => (
                      <button
                        key={dayIdx}
                        onClick={() => toggleHabitCheck(habitLabel, dayIdx)}
                        style={{
                          height: '24px',
                          borderRadius: '6px',
                          border: checked ? 'none' : '1px solid var(--border-color)',
                          background: checked ? 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-primary) 100%)' : 'rgba(255,255,255,0.02)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          boxShadow: checked ? '0 0 6px rgba(34, 211, 238, 0.25)' : 'none'
                        }}
                      >
                        {checked && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Productivity;
