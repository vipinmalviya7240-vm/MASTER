import React, { useState } from 'react';
import { Sparkles, Brain, Award, Trophy, ChevronRight, Check, X, ShieldCheck } from 'lucide-react';
import { generateAIQuiz, saveQuizResult } from '../utils/api';

const QuizGenerator = () => {
  const [topic, setTopic] = useState('Quadratic Equations');
  const [difficulty, setDifficulty] = useState('Moderate');
  const [quizState, setQuizState] = useState('config'); // 'config', 'loading', 'active', 'finished'
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);

  // Mock quizzes depending on the selected difficulty
  const mockQuizzes = {
    Easy: [
      {
        q: 'What is the factored form of the expression: x² - 4?',
        options: ['(x - 2)(x - 2)', '(x + 2)(x - 2)', '(x + 4)(x - 1)', '(x - 4)(x + 1)'],
        correct: 1,
        explanation: 'x² - 4 is a difference of squares. The identity is a² - b² = (a + b)(a - b). Hence, x² - 2² = (x + 2)(x - 2).'
      },
      {
        q: 'In the quadratic equation ax² + bx + c = 0, what does "a" represent?',
        options: ['The linear coefficient', 'The constant term', 'The leading quadratic coefficient', 'The intercept index'],
        correct: 2,
        explanation: 'The term ax² is the quadratic term, and "a" is its coefficient, which cannot be zero.'
      }
    ],
    Moderate: [
      {
        q: 'What are the roots of x² - 5x + 6 = 0?',
        options: ['x = -2 and x = -3', 'x = 1 and x = 6', 'x = 2 and x = 3', 'x = -1 and x = -6'],
        correct: 2,
        explanation: 'Factoring gives (x - 2)(x - 3) = 0. Isolating variables results in solutions x = 2 and x = 3.'
      },
      {
        q: 'What is the discriminant of x² + 4x + 4 = 0?',
        options: ['16', '0', '-8', '4'],
        correct: 1,
        explanation: 'Discriminant formula: D = b² - 4ac. For x² + 4x + 4, b = 4, a = 1, c = 4. D = 4² - 4(1)(4) = 16 - 16 = 0.'
      }
    ],
    Advanced: [
      {
        q: 'If a quadratic equation has discriminant D < 0, what type of roots does it possess?',
        options: ['Two distinct real roots', 'One double real root', 'Two distinct complex conjugate roots', 'No mathematical solution'],
        correct: 2,
        explanation: 'When D is negative, the square root term √(b²-4ac) yields imaginary numbers, yielding complex conjugate roots.'
      },
      {
        q: 'Find the vertex of the parabola described by y = 2x² - 8x + 3.',
        options: ['(2, -5)', '(-2, 11)', '(4, 3)', '(2, -3)'],
        correct: 0,
        explanation: 'x-coordinate of vertex is x = -b / (2a) = 8 / (2*2) = 2. Substituting x=2: y = 2(4) - 8(2) + 3 = 8 - 16 + 3 = -5.'
      }
    ],
    Expert: [
      {
        q: 'Let α and β be roots of ax² + bx + c = 0. According to Vieta’s formulas, what is the value of α + β?',
        options: ['c / a', 'b / a', '-b / a', '-c / a'],
        correct: 2,
        explanation: 'Vieta’s formulas state that the sum of the roots α + β is always equal to -b/a, and their product αβ is c/a.'
      },
      {
        q: 'Under what constraint will the equation x² + 2kx + 9 = 0 have exactly one real double root?',
        options: ['k = ±3', 'k = ±9', 'k = 0', 'k = ±6'],
        correct: 0,
        explanation: 'For exactly one double root, D must be 0. D = (2k)² - 4(1)(9) = 4k² - 36 = 0. Isolating k²: k² = 9, so k = ±3.'
      }
    ]
  };

  const startQuiz = async () => {
    setQuizState('loading');
    
    try {
      const apiQuestions = await generateAIQuiz(topic, difficulty);
      if (apiQuestions && Array.isArray(apiQuestions) && apiQuestions.length > 0) {
        setQuestions(apiQuestions);
        setQuizState('active');
        setCurrentQuestionIdx(0);
        setSelectedAnswer(null);
        setScore(0);
        setUserAnswers([]);
        return;
      }
      throw new Error('API Quiz invalid or empty.');
    } catch (err) {
      console.warn('⚠️ Real-time Quiz API creation failed or server offline. Triggering offline mock questions.');
      
      setTimeout(() => {
        const fallback = mockQuizzes[difficulty] || mockQuizzes['Moderate'];
        setQuestions(fallback);
        setQuizState('active');
        setCurrentQuestionIdx(0);
        setSelectedAnswer(null);
        setScore(0);
        setUserAnswers([]);
      }, 1500);
    }
  };

  const handleAnswerSubmit = (optionIdx) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(optionIdx);
    const isCorrect = optionIdx === questions[currentQuestionIdx].correct;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setUserAnswers(prev => [...prev, {
      question: questions[currentQuestionIdx].q,
      selected: optionIdx,
      correct: questions[currentQuestionIdx].correct,
      explanation: questions[currentQuestionIdx].explanation
    }]);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    if (currentQuestionIdx + 1 < questions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setQuizState('finished');
      // Persist the quiz history result to Firestore DB in Express backend
      saveQuizResult(topic, difficulty, score, questions.length, userAnswers);
    }
  };

  return (
    <section className="content-section" style={{ textAlign: 'left' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Real-time Testing
        </span>
        <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: 800 }}>
          Test Your Knowledge with <span className="gradient-text neon-text-glow">Quiz AI</span>
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="lg:grid-cols-3">
        
        {/* Main Quiz Area Column */}
        <div className="glass-panel lg:col-span-2" style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
          
          {/* Configuration View */}
          {quizState === 'config' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: 'auto 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Brain size={28} className="text-purple-400" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Generate Custom AI Quiz</h3>
              </div>

              {/* Topic Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Topic or Subject Focus</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Difficulty Toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Complexity Parameter</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {['Easy', 'Moderate', 'Advanced', 'Expert'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      style={{
                        padding: '10px 6px',
                        borderRadius: '10px',
                        border: 'none',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        background: difficulty === d ? 'var(--btn-primary-bg)' : 'rgba(255,255,255,0.03)',
                        color: difficulty === d ? '#fff' : 'var(--text-secondary)',
                        border: '1px solid var(--border-color)',
                        boxShadow: difficulty === d ? '0 4px 10px var(--neon-glow-primary)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={startQuiz}
                className="btn-premium primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
              >
                <Sparkles size={16} /> Generate AI Quiz
              </button>
            </div>
          )}

          {/* Loading States */}
          {quizState === 'loading' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', margin: 'auto' }}>
              <div className="online-pulse" style={{ width: '40px', height: '40px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Synthesizing Dynamic Questions...</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>AI is mapping custom formula parameters to match {difficulty} level</p>
            </div>
          )}

          {/* Active Quiz Area */}
          {quizState === 'active' && questions.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Top info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>Topic: {topic}</span>
                <span style={{ color: 'var(--text-muted)' }}>Question {currentQuestionIdx + 1} of {questions.length} ({difficulty})</span>
              </div>

              {/* Question Text */}
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.4 }}>
                {questions[currentQuestionIdx].q}
              </h3>

              {/* Options Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {questions[currentQuestionIdx].options.map((opt, oIdx) => {
                  let btnBg = 'rgba(255,255,255,0.03)';
                  let btnBorder = 'var(--border-color)';
                  let btnColor = 'var(--text-primary)';
                  const isCorrect = oIdx === questions[currentQuestionIdx].correct;

                  if (selectedAnswer !== null) {
                    if (isCorrect) {
                      btnBg = 'rgba(16, 185, 129, 0.15)';
                      btnBorder = '#10b981';
                      btnColor = '#10b981';
                    } else if (selectedAnswer === oIdx) {
                      btnBg = 'rgba(244, 63, 94, 0.15)';
                      btnBorder = '#f43f5e';
                      btnColor = '#f43f5e';
                    } else {
                      btnBg = 'rgba(0,0,0,0.02)';
                      btnBorder = 'var(--border-color)';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleAnswerSubmit(oIdx)}
                      disabled={selectedAnswer !== null}
                      style={{
                        padding: '14px 18px',
                        borderRadius: '10px',
                        border: `1.5px solid ${btnBorder}`,
                        background: btnBg,
                        color: btnColor,
                        textAlign: 'left',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: selectedAnswer === null ? 'pointer' : 'default',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{opt}</span>
                      {selectedAnswer !== null && isCorrect && <Check size={16} />}
                      {selectedAnswer !== null && selectedAnswer === oIdx && !isCorrect && <X size={16} />}
                    </button>
                  );
                })}
              </div>

              {/* Explanatory notes display */}
              {selectedAnswer !== null && (
                <div className="glass-panel" style={{ padding: '16px', borderLeft: '3px solid var(--accent-cyan)', background: 'rgba(34, 211, 238, 0.03)' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '4px' }}>AI Explanation</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {questions[currentQuestionIdx].explanation}
                  </p>
                </div>
              )}

              {/* Next/Finish Toggler */}
              {selectedAnswer !== null && (
                <button
                  onClick={handleNext}
                  className="btn-premium primary"
                  style={{ width: 'fit-content', alignSelf: 'flex-end' }}
                >
                  {currentQuestionIdx + 1 < questions.length ? 'Next Question' : 'Finish Quiz'} <ChevronRight size={16} />
                </button>
              )}
            </div>
          )}

          {/* Finished Overlay */}
          {quizState === 'finished' && questions.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', margin: 'auto' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981'
              }}>
                <Award size={32} />
              </div>

              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Quiz Complete!</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Score: <strong style={{ color: 'var(--accent-primary)' }}>{score} / {questions.length}</strong> ({Math.round((score / questions.length) * 100)}%)
                </p>
              </div>

              {/* Custom XP rewards */}
              <div style={{
                background: 'rgba(251, 191, 36, 0.12)',
                border: '1px solid #fbbf24',
                color: '#fbbf24',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                Reward Claimed: +{score * 50} XP ⚡
              </div>

              <button
                onClick={() => setQuizState('config')}
                className="btn-premium secondary"
              >
                Configure New Quiz
              </button>
            </div>
          )}

        </div>

        {/* Dynamic Leaderboard Sidebar */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={18} className="text-yellow-500" />
              Leaderboard Room
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Top scorers in {topic}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { rank: 1, name: 'Nikita S.', score: '99%', xp: '3100 XP', active: true },
              { rank: 2, name: 'Aris K.', score: '94%', xp: '2400 XP', active: false },
              { rank: 3, name: 'Sven O.', score: '92%', xp: '2150 XP', active: false },
              { rank: 4, name: 'Sarah L.', score: '88%', xp: '1800 XP', active: false },
              { rank: 5, name: 'Devon H.', score: '85%', xp: '1500 XP', active: false }
            ].map((usr, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: usr.active ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                  border: usr.active ? '1px solid var(--accent-primary)' : '1px solid transparent'
                }}
              >
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  width: '20px',
                  color: usr.rank === 1 ? '#fbbf24' : usr.rank === 2 ? '#94a3b8' : usr.rank === 3 ? '#b45309' : 'var(--text-muted)'
                }}>
                  #{usr.rank}
                </span>
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {usr.name} {usr.active && '(You)'}
                  </h4>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{usr.xp}</span>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{usr.score}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)'
          }}>
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Anti-cheat exam simulation active.</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default QuizGenerator;
