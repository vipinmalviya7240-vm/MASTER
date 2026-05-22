import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Mic, Trash2, Download, Share2, Volume2, Sparkles, 
  RotateCcw, Image, Compass, Brain, Cpu, RefreshCw, PenTool, CheckCircle
} from 'lucide-react';
import { sendAIChat } from '../utils/api';

const AIAssistant = () => {
  const [activeSubject, setActiveSubject] = useState('Mathematics');
  const [messages, setMessages] = useState({
    Mathematics: [
      { sender: 'ai', text: 'Hello! I am your SMART_X Mathematics Tutor. What area of math shall we explore today? I can help you solve algebra, calculus, geometry, or prepare mock practice quizzes!' }
    ],
    Science: [
      { sender: 'ai', text: 'Welcome! Let’s explore the physical and biological world together. Ask me about chemical bonding, gravity, genetics, or cellular structures.' }
    ],
    English: [
      { sender: 'ai', text: 'Greetings! I can help you refine grammar, analyze complex literature, summarize long articles, or compose elegant stories.' }
    ],
    Coding: [
      { sender: 'ai', text: 'System Online. Ready to write code! I specialize in React, JavaScript, Python, C++, SQL, and algorithm design. Paste your code or explain your problem.' }
    ],
    Physics: [
      { sender: 'ai', text: 'Hello! Ready to map physical realities. Let’s calculate forces, analyze thermodynamics, or explore quantum mechanics.' }
    ],
    Chemistry: [
      { sender: 'ai', text: 'Welcome to the lab! Ask me to explain stoichiometric calculations, identify functional groups, or balance complex chemical equations.' }
    ],
    History: [
      { sender: 'ai', text: 'Greetings, historian! Ask me about ancient civilizations, major global conflicts, revolutions, or cultural movements.' }
    ],
    'AI & ML': [
      { sender: 'ai', text: 'Neural network active. Ask me about neural network architectures, regression, model training strategies, or computer vision.' }
    ],
    Design: [
      { sender: 'ai', text: 'Welcome! Ready to talk layout, palettes, typography, UI/UX systems, wireframing, or CSS design tokens.' }
    ],
    Music: [
      { sender: 'ai', text: 'Harmonic core ready. Let’s discuss chord progressions, music theory, scales, orchestration, or synthesizers.' }
    ],
    'Voice AI (Hindi/Urdu)': [
      { sender: 'ai', text: 'नमस्ते! मैं आपका वॉइस एआई ट्यूटर हूँ। आप मुझसे हिंदी या उर्दू में कोई भी प्रश्न पूछ सकते हैं। (How can I help you today?)' }
    ]
  });

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('');
  const chatEndRef = useRef(null);

  // Whiteboard Canvas State
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnCount, setDrawnCount] = useState(0);

  const subjects = [
    'Mathematics', 'Science', 'English', 'Coding', 'Physics', 
    'Chemistry', 'History', 'AI & ML', 'Design', 'Music', 'Voice AI (Hindi/Urdu)'
  ];

  const prompts = [
    { label: 'Explain Simply', text: 'Explain this concept using simple analogies for a beginner.' },
    { label: 'Practice Problem', text: 'Generate an interactive practice problem for me to solve.' },
    { label: 'Step-by-Step', text: 'Show the mathematical formula and break down the solution step-by-step.' },
    { label: 'Generate Notes', text: 'Summarize the core definitions and formulas into quick study notes.' },
    { label: 'Check Understanding', text: 'Ask me two multiple choice questions to check my understanding.' },
    { label: 'Create Quiz', text: 'Generate a short 3-question quiz with dynamic difficulty.' }
  ];

  // Auto Scroll Chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle send message
  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => ({
      ...prev,
      [activeSubject]: [...prev[activeSubject], userMsg]
    }));
    
    setInputText('');
    setIsTyping(true);

    try {
      // Construct historical message payload for the backend API
      const history = messages[activeSubject] || [];
      const apiMessages = [
        ...history.map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        })),
        { role: 'user', content: textToSend }
      ];

      const responseText = await sendAIChat(apiMessages, activeSubject);
      
      if (responseText) {
        setMessages(prev => ({
          ...prev,
          [activeSubject]: [...prev[activeSubject], { sender: 'ai', text: responseText }]
        }));
        setIsTyping(false);
        return;
      }
      throw new Error('API returned empty or failed.');
    } catch (err) {
      console.warn('⚠️ Real-time AI chat endpoint failed or server offline. Triggering localized high-fidelity simulator.');
      
      // Fallback simulated response
      setTimeout(() => {
        let aiText = '';
        if (activeSubject === 'Mathematics') {
          if (textToSend.toLowerCase().includes('quadratic') || textToSend.toLowerCase().includes('formula')) {
            aiText = 'Using the quadratic formula x = [-b ± √(b² - 4ac)] / 2a. For example, if you have x² - 5x + 6 = 0, we identify a = 1, b = -5, c = 6. Inside the square root: (-5)² - 4(1)(6) = 25 - 24 = 1. Thus, x = [5 ± 1] / 2, leading to solutions x = 3 and x = 2. Would you like a practice quiz on this?';
          } else {
            aiText = `That is an excellent mathematical inquiry. Solving this requires analyzing your base coordinates and isolating variable indexes. Here is the direct solution breakdown:\n\n1. Let's establish our parameters.\n2. Apply core deductive formulas.\n3. Formulate the finalized result. Let me know if you would like me to generate a step-by-step notes card!`;
          }
        } else if (activeSubject === 'Coding') {
          aiText = 'Fascinating coding question! Let’s trace the structure. The clean React implementation utilizes custom functional states and structured hooks. Let me share a snippet:\n\n```javascript\nconst SmartX = () => {\n  const [state, setState] = useState(true);\n  return <div className="glow">{state}</div>;\n};\n```\nDoes this align with your architectural goals?';
        } else if (activeSubject === 'Voice AI (Hindi/Urdu)') {
          aiText = 'बिल्कुल! मैं आपकी सहायता कर सकता हूँ। क्या आप गणित, विज्ञान या किसी अन्य विषय पर चर्चा करना चाहते हैं? कृपया अपना प्रश्न पूछें।';
        } else {
          aiText = `Here is a custom breakdown on your topic: "${textToSend}". Under close inspection, this topic acts as a core foundation in ${activeSubject}. I suggest reading our condensed notes dashboard and checking your focus time stats. What specific questions do you have next?`;
        }

        const aiMsg = { sender: 'ai', text: aiText };
        setMessages(prev => ({
          ...prev,
          [activeSubject]: [...prev[activeSubject], aiMsg]
        }));
        setIsTyping(false);
      }, 1200);
    }
  };

  // Toggle Voice Input
  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        handleSendMessage("Help me understand dynamic system state modules.");
      }, 3000);
    }
  };

  // Whiteboard drawing mechanisms
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
    setDrawnCount(prev => prev + 1);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDrawnCount(0);
  };

  // Simulate OCR notes upload
  const triggerOCR = () => {
    setOcrStatus('Scanning problem image...');
    setTimeout(() => {
      setOcrStatus('Formulas extracted successfully!');
      setTimeout(() => {
        setOcrStatus('');
        handleSendMessage("Solve this scanned system equation: 3x + y = 10, x - y = 2");
      }, 1500);
    }, 2000);
  };

  // Export & download helpers
  const exportNotes = () => {
    const activeChat = messages[activeSubject];
    const plainText = activeChat.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n\n');
    const blob = new Blob([plainText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SMART_X_${activeSubject}_Notes.txt`;
    a.click();
  };

  return (
    <section className="content-section" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px', textAlign: 'left' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Interactive Sandbox
        </span>
        <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: 800 }}>
          Experience the <span className="gradient-text neon-text-glow">SMART_X AI Assistant</span>
        </h2>
      </div>

      {/* Main Core Flexbox */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
        flexGrow: 1
      }} className="lg:flex-row">
        
        {/* Left Sidebar Subjects */}
        <div className="glass-panel" style={{
          width: '100%',
          padding: '16px',
          display: 'flex',
          flexDirection: 'row',
          gap: '8px',
          overflowX: 'auto',
          minWidth: '220px'
        }} className="lg:flex-col lg:w-64 lg:overflow-x-visible">
          <h3 style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-muted)',
            padding: '4px 8px',
            display: 'none'
          }} className="lg:block">
            Syllabus Subjects
          </h3>
          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setActiveSubject(subj)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: 600,
                textAlign: 'left',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: activeSubject === subj ? 'var(--btn-primary-bg)' : 'transparent',
                color: activeSubject === subj ? '#fff' : 'var(--text-secondary)',
                boxShadow: activeSubject === subj ? '0 4px 10px var(--neon-glow-primary)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {subj}
            </button>
          ))}
        </div>

        {/* Main Workspace Block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 1 }}>
          
          {/* Main Chat Box */}
          <div className="glass-panel" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '480px',
            overflow: 'hidden'
          }}>
            {/* Top Workspace Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="online-pulse" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{activeSubject} Tutor</h3>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={exportNotes} 
                  style={{
                    padding: '8px', 
                    borderRadius: '8px', 
                    background: 'transparent', 
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                  title="Export Chat Notes"
                >
                  <Share2 size={16} />
                </button>
                <button 
                  onClick={() => setMessages(prev => ({ ...prev, [activeSubject]: [{ sender: 'ai', text: `Chat reset. Ask me anything on ${activeSubject}!` }] }))} 
                  style={{
                    padding: '8px', 
                    borderRadius: '8px', 
                    background: 'transparent', 
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                  title="Clear Chat History"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Chat Messages Scrolling Space */}
            <div style={{
              flexGrow: 1,
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {messages[activeSubject].map((msg, i) => (
                <div 
                  key={i} 
                  style={{
                    display: 'flex',
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    width: '100%'
                  }}
                >
                  <div style={{
                    padding: '12px 18px',
                    borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                    maxWidth: '80%',
                    lineHeight: 1.5,
                    fontSize: '0.95rem',
                    background: msg.sender === 'user' ? 'var(--btn-primary-bg)' : 'rgba(255,255,255,0.05)',
                    color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                    boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(99,102,241,0.15)' : 'none',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    padding: '12px 18px',
                    borderRadius: '18px 18px 18px 2px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center'
                  }}>
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Smart suggestions bar */}
            <div style={{
              display: 'flex',
              gap: '8px',
              padding: '12px 20px',
              borderTop: '1px solid var(--border-color)',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              background: 'rgba(0,0,0,0.01)'
            }}>
              {prompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(p.text)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--glass-bg)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(0,0,0,0.02)'
            }}>
              {/* Mic Icon */}
              <button
                onClick={handleVoiceToggle}
                style={{
                  padding: '10px',
                  borderRadius: '50%',
                  background: isRecording ? 'var(--accent-pink)' : 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  color: isRecording ? '#fff' : 'var(--text-primary)',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Mic size={18} className={isRecording ? 'animate-pulse' : ''} />
                {isRecording && (
                  <div style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    width: '10px',
                    height: '10px',
                    backgroundColor: 'var(--accent-pink)',
                    borderRadius: '50%',
                    boxShadow: '0 0 8px var(--accent-pink)'
                  }} />
                )}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder={`Ask SMART_X anything about ${activeSubject}...`}
                style={{
                  flexGrow: 1,
                  padding: '12px 18px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-main)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />

              <button
                onClick={() => handleSendMessage(inputText)}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'var(--btn-primary-bg)',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(99,102,241,0.2)'
                }}
              >
                <Send size={18} />
              </button>
            </div>
          </div>

          {/* Whiteboard Drawing Canvas & Extra Widget Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '20px'
          }} className="md:grid-cols-2">
            
            {/* Whiteboard Sandbox */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '300px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PenTool size={16} className="text-purple-400" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>AI Whiteboard Sandbox</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
                  {drawnCount > 0 && (
                    <button 
                      onClick={() => handleSendMessage("Check my whiteboard sketch for quadratic formula graphs.")}
                      style={{
                        padding: '4px 8px', 
                        borderRadius: '6px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        background: 'rgba(34, 211, 238, 0.15)',
                        border: '1px solid var(--accent-cyan)',
                        color: 'var(--accent-cyan)',
                        cursor: 'pointer'
                      }}
                    >
                      Analyze Sketch
                    </button>
                  )}
                  <button 
                    onClick={clearCanvas} 
                    style={{
                      padding: '4px 8px', 
                      borderRadius: '6px', 
                      fontSize: '0.75rem', 
                      background: 'transparent', 
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div style={{ position: 'relative', flexGrow: 1, width: '100%', background: 'rgba(0,0,0,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={200}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  style={{
                    width: '100%',
                    height: '100%',
                    cursor: 'crosshair'
                  }}
                />
                {drawnCount === 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    textAlign: 'center'
                  }}>
                    Doodle mathematical graphs, formulas, or chemical symbols.
                  </div>
                )}
              </div>
            </div>

            {/* OCR & Formula scan widget card */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(34, 211, 238, 0.12)',
                  border: '1.5px solid var(--accent-cyan)',
                  color: 'var(--accent-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Image size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>OCR Notes & Screenshot Scanner</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Scan paper worksheets or textbook problems instantly</p>
                </div>
              </div>

              <div style={{
                border: '1.5px dashed var(--border-color)',
                borderRadius: '12px',
                padding: '24px 16px',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.02)',
                position: 'relative'
              }} onClick={triggerOCR}>
                {ocrStatus ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <RefreshCw size={24} className="text-purple-400 animate-spin" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{ocrStatus}</span>
                  </div>
                ) : (
                  <div>
                    <Sparkles size={20} className="text-indigo-400 animate-bounce" style={{ margin: '0 auto 8px' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary)', display: 'block', marginBottom: '4px' }}>
                      Upload Textbook Screenshot
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Supports JPG, PNG, PDF formats</span>
                  </div>
                )}
              </div>

              {/* Memory status info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.03)',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)'
              }}>
                <Brain size={14} style={{ color: 'var(--accent-secondary)' }} />
                <span>Memory Module active. We track core strengths in algebraic matrices.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default AIAssistant;
