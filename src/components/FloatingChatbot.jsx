import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Mic, Image, Smile, Settings, Volume2, VolumeX, X, Minimize2, 
  Sparkles, Brain, Cpu, Copy, Check, RefreshCw, HelpCircle, BookOpen, 
  MessageSquare, Languages, Award, Paperclip, ChevronRight
} from 'lucide-react';
import { sendAIChat } from '../utils/api';
import SmartXLogo from './SmartXLogo';

const FloatingChatbot = ({ theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false); // TTS voice readout
  const [showSettings, setShowSettings] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [textSize, setTextSize] = useState('medium'); // small, medium, large
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Mouse coordinates for follow glow effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const chatEndRef = useRef(null);

  // Conversation memory indicator (simulated)
  const [memoryClearance, setMemoryClearance] = useState(98);

  const [messages, setMessages] = useState([
    { 
      sender: 'ai', 
      text: "Greetings! I am SMART_X, your cognitive learning assistant. I can explain complex laws, generate mock quiz cards, build study notes, or flip physics flashcards. Ask me anything!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Emojis list
  const emojis = ['🔥', '🚀', '💡', '🧠', '🔬', '💻', '📚', '🎯', '✨', '🎉', '✍️', '🔢'];

  // Mock Attachment Options
  const mockAttachments = [
    { id: 'math_eqn', name: 'Calculus_Equation.png', size: '2.4 MB', type: 'image' },
    { id: 'physics_chart', name: 'Astrophysics_Orbit.png', size: '4.1 MB', type: 'image' },
    { id: 'react_state', name: 'React_State_Hooks.png', size: '1.2 MB', type: 'image' }
  ];

  // Suggestion Chips
  const suggestionChips = [
    { label: 'Explain Simply', text: "Explain Newton's Laws simply using an analogy." },
    { label: 'Create Notes', text: "Create study notes for basic JavaScript closures." },
    { label: 'Generate Quiz', text: "Generate a short 3-question quiz about cellular biology." },
    { label: 'Solve Problem', text: "Solve this problem step-by-step: 3x + 5 = 20." },
    { label: 'Practice Questions', text: "Provide 2 practice questions about classical mechanics." },
    { label: 'Summarize Topic', text: "Summarize the core themes of Shakespeare's Hamlet." }
  ];

  // Auto-scroll on new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Web Speech TTS voice readout
  const speakText = (text) => {
    if (!isVoiceActive) return;
    // Strip markdown formatting if present
    const cleanText = text.replace(/[*#`_\-]/g, '').slice(0, 200); // limit spoken speech
    
    // Stop any ongoing speech
    window.speechSynthesis?.cancel();
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Choose appropriate voice based on selected language
    const voices = window.speechSynthesis?.getVoices() || [];
    if (selectedLanguage === 'Spanish') utterance.lang = 'es-ES';
    else if (selectedLanguage === 'French') utterance.lang = 'fr-FR';
    else if (selectedLanguage === 'German') utterance.lang = 'de-DE';
    else if (selectedLanguage === 'Japanese') utterance.lang = 'ja-JP';
    else utterance.lang = 'en-US';

    window.speechSynthesis?.speak(utterance);
  };

  // Mouse Follow Glow Effect
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Simulated Microphone Voice-to-Text Input
  const startSpeechRecognition = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }
    
    setIsRecording(true);
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLanguage === 'English' ? 'en-US' : 
                         selectedLanguage === 'Spanish' ? 'es-ES' : 
                         selectedLanguage === 'French' ? 'fr-FR' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        setInputText(spoken);
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        simulateSpeechRecognition();
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } else {
      simulateSpeechRecognition();
    }
  };

  const simulateSpeechRecognition = () => {
    setTimeout(() => {
      setInputText("Explain quantum entanglement in simple terms.");
      setIsRecording(false);
    }, 2500);
  };

  // Attach screenshot preview handler
  const handleSelectAttachment = (file) => {
    setSelectedFile(file);
    setShowAttachments(false);
  };

  const handleClearChat = () => {
    setMessages([
      { 
        sender: 'ai', 
        text: "System initialized. Memory buffer reset to 100%. How can I assist your study goals today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setMemoryClearance(100);
    setShowSettings(false);
  };

  // Dispatches actual messages to backend or localized high-fidelity simulator
  const handleSendMessage = async (textToSend, fileToSend = null) => {
    if (!textToSend.trim() && !fileToSend) return;

    const userMsg = {
      sender: 'user',
      text: textToSend,
      file: fileToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setSelectedFile(null);
    setIsTyping(true);

    // Prompt context injector based on settings
    let contextualText = textToSend;
    if (selectedLanguage !== 'English') {
      contextualText += ` (Please reply in ${selectedLanguage})`;
    }

    try {
      const history = messages.slice(-5); // take last 5 messages for memory history
      const apiMessages = [
        ...history.map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        })),
        { role: 'user', content: contextualText }
      ];

      const responseText = await sendAIChat(apiMessages, 'General Study Assistant');
      
      if (responseText) {
        setIsTyping(false);
        const aiMsg = {
          sender: 'ai',
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        // Parse special content types dynamically
        if (textToSend.toLowerCase().includes('quiz') || responseText.toLowerCase().includes('quiz')) {
          aiMsg.quiz = {
            question: "Which of the following is the power house of the cell?",
            options: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"],
            correctAnswer: 1,
            explanation: "Mitochondria convert nutrients into adenosine triphosphate (ATP), chemical energy that powers cell operations."
          };
        } else if (textToSend.toLowerCase().includes('note') || textToSend.toLowerCase().includes('summarize')) {
          aiMsg.notes = {
            title: "Study Notes: Closure in JS",
            content: "• A closure gives you access to an outer function's scope from an inner function.\n• Created every time a function is created, at function creation time.\n• Crucial for encapsulation and creating private variables."
          };
        } else if (textToSend.toLowerCase().includes('flashcard') || textToSend.toLowerCase().includes('laws')) {
          aiMsg.flashcard = {
            front: "Newton's First Law",
            back: "An object at rest remains at rest, and an object in motion remains in motion at a constant velocity unless acted upon by a net external force."
          };
        }

        setMessages(prev => [...prev, aiMsg]);
        speakText(responseText);
        setMemoryClearance(prev => Math.max(60, prev - 3));
        return;
      }
      throw new Error('API offline');
    } catch (err) {
      // Graceful high-fidelity local simulator fallback
      setTimeout(() => {
        let aiText = '';
        let quiz = null;
        let notes = null;
        let flashcard = null;

        const lowerText = textToSend.toLowerCase();

        if (fileToSend) {
          aiText = `Analyzing attached file: "${fileToSend.name}". Under close multi-modal neural network inspection, this indicates a detailed layout structure. Here are my observations:\n\n1. Parameters are organized perfectly.\n2. Identified critical structural blocks.\n3. Ready to debug or explain the core mathematics shown in the layout. What specifically should we calculate?`;
        } else if (lowerText.includes('newton') || lowerText.includes('law')) {
          aiText = "Newton's Laws describe how forces affect motion. Let's break them down simply:\n\n1. **First Law (Inertia)**: Things keep doing what they are doing unless a force pushes them.\n2. **Second Law (F=ma)**: Pushing something harder makes it accelerate faster.\n3. **Third Law (Action/Reaction)**: Every action has an equal and opposite reaction.\n\nI have generated an active-recall study flashcard for this!";
          flashcard = {
            front: "Newton's Second Law",
            back: "Force equals Mass times Acceleration (F = ma). Acceleration is produced when a force acts on a mass."
          };
        } else if (lowerText.includes('quiz') || lowerText.includes('biology')) {
          aiText = "Excellent biology request! I have compiled a dynamic 1-question practice quiz about cell biology below. Select the correct answer to check your understanding!";
          quiz = {
            question: "Which organelle is responsible for cellular protein synthesis?",
            options: ["Golgi Apparatus", "Ribosomes", "Lysosomes", "Vacuoles"],
            correctAnswer: 1,
            explanation: "Ribosomes are molecular machines found within all living cells that perform biological protein synthesis (translation)."
          };
        } else if (lowerText.includes('note') || lowerText.includes('closure')) {
          aiText = "Certainly! I have generated structured study notes summarizing basic closures in JavaScript. You can copy them directly for your study logs!";
          notes = {
            title: "JavaScript Closures Study Card",
            content: "• Closure = Function bundled together with references to its surrounding state (lexical environment).\n• Enables private methods and data hiding.\n• Solves common callback scoping challenges in asynchronous routines."
          };
        } else if (lowerText.includes('flashcard')) {
          aiText = "Active recall activated! Below is a micro flashcard representing core definitions. Click to flip!";
          flashcard = {
            front: "Mitochondria",
            back: "The powerhouse of the cell. Double-membrane organelle responsible for aerobic cellular respiration and ATP generation."
          };
        } else {
          aiText = `Under close inspection, the question "${textToSend}" highlights a foundational principle in modern study logs. Solving this requires:\n\n• Parsing primary variable weights.\n• Isolating mathematical index fields.\n• Evaluating contextual dependencies.\n\nLet me know if you would like me to generate a notes summary card or an interactive biology quiz!`;
        }

        setIsTyping(false);
        const aiMsg = {
          sender: 'ai',
          text: aiText,
          quiz,
          notes,
          flashcard,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
        speakText(aiText);
        setMemoryClearance(prev => Math.max(60, prev - 4));
      }, 1500);
    }
  };

  // Text sizes map
  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 1000,
      fontFamily: 'var(--font-sans)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      pointerEvents: 'auto'
    }}>
      {/* Floating Badge (Closed State) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="glass-panel pulse-glow-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 20px',
            borderRadius: '30px',
            border: '1px solid var(--accent-primary)',
            background: 'var(--btn-primary-bg)',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 8px 32px var(--neon-glow-primary)',
            transform: 'scale(1)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <div style={{ position: 'relative' }}>
            <SmartXLogo size={38} variant="main" spin={true} glow={true} />
            <span style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#10b981',
              border: '2px solid #fff',
              animation: 'pulse 2s infinite'
            }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.05em' }}>SMART_X AI</div>
            <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>Ready to teach • Online</div>
          </div>
        </button>
      )}

      {/* Expandable Chatbox (Open State) */}
      {isOpen && (
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="glass-panel"
          style={{
            width: isMinimized ? '280px' : '400px',
            height: isMinimized ? '55px' : '580px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: '24px',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--glass-shadow), 0 20px 50px rgba(0,0,0,0.15)',
            transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
            position: 'relative',
            opacity: 1,
            transform: 'translateY(0)',
            maxHeight: '85vh',
            maxWidth: 'calc(100vw - 48px)',
            // Custom mouse glow reflection background styling
            background: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, var(--glass-bg), rgba(255, 255, 255, 0.05))`
          }}
        >
          {/* Subtle Ambient Mesh Glowing Background */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)',
            opacity: 0.15,
            pointerEvents: 'none',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-50px',
            left: '-50px',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, var(--accent-secondary) 0%, transparent 70%)',
            opacity: 0.15,
            pointerEvents: 'none',
            zIndex: 0
          }} />

          {/* HEADER SECTION */}
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(8px)',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <SmartXLogo size={38} variant="main" spin={true} glow={true} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="metallic-shine neon-text-glow" style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                  SMART_X
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    display: 'inline-block',
                    boxShadow: '0 0 8px #10b981'
                  }} />
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Online Tutor</span>
                </div>
              </div>
            </div>

            {/* Header Icons Wrapper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* TTS Voice Readout Toggle */}
              <button
                onClick={() => setIsVoiceActive(!isVoiceActive)}
                style={{
                  background: isVoiceActive ? 'var(--neon-glow-primary)' : 'transparent',
                  border: 'none',
                  color: isVoiceActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                title={isVoiceActive ? 'Voice Readout Active' : 'Enable Voice Readout'}
              >
                {isVoiceActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              {/* Settings Toggle */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: showSettings ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Settings"
              >
                <Settings size={16} />
              </button>

              {/* Minimize Window */}
              <button
                onClick={() => {
                  setIsMinimized(!isMinimized);
                  setShowSettings(false);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={isMinimized ? 'Expand Chatbox' : 'Minimize Chatbox'}
              >
                <Minimize2 size={16} />
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(false);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Close Assistant"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* MAIN CHAT VIEW (Only visible when not minimized) */}
          {!isMinimized && (
            <>
              {/* SETTINGS OVERLAY IF OPEN */}
              {showSettings && (
                <div style={{
                  position: 'absolute',
                  top: '63px',
                  left: 0,
                  right: 0,
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(24px)',
                  borderBottom: '1px solid var(--border-color)',
                  padding: '16px 20px',
                  zIndex: 50,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  animation: 'fadeIn 0.3s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assistant Settings</h4>
                    <button onClick={() => setShowSettings(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <X size={14} />
                    </button>
                  </div>

                  {/* Subject Context / Personalities */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tutor Language Focus</label>
                    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                      {['English', 'Spanish', 'French', 'German', 'Japanese'].map(lang => (
                        <button
                          key={lang}
                          onClick={() => setSelectedLanguage(lang)}
                          style={{
                            fontSize: '0.7rem',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            border: '1px solid',
                            borderColor: selectedLanguage === lang ? 'var(--accent-primary)' : 'var(--border-color)',
                            background: selectedLanguage === lang ? 'var(--neon-glow-primary)' : 'transparent',
                            color: selectedLanguage === lang ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text Size Slider */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Chat Font Size</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['small', 'medium', 'large'].map(sz => (
                        <button
                          key={sz}
                          onClick={() => setTextSize(sz)}
                          style={{
                            flex: 1,
                            fontSize: '0.7rem',
                            padding: '5px',
                            borderRadius: '8px',
                            border: '1px solid',
                            textTransform: 'capitalize',
                            borderColor: textSize === sz ? 'var(--accent-secondary)' : 'var(--border-color)',
                            background: textSize === sz ? 'rgba(168, 85, 247, 0.08)' : 'transparent',
                            color: textSize === sz ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                            cursor: 'pointer'
                          }}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Memory Trigger */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Conversation Memory</span>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Usage: {memoryClearance}% memory index</span>
                    </div>
                    <button
                      onClick={handleClearChat}
                      className="btn-premium"
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.7rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      Reset Buffer
                    </button>
                  </div>
                </div>
              )}

              {/* CHAT AREA MESSAGES FEED */}
              <div 
                style={{
                  flexGrow: 1,
                  padding: '20px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  zIndex: 5
                }}
              >
                {messages.map((msg, index) => {
                  const isAI = msg.sender === 'ai';
                  return (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isAI ? 'flex-start' : 'flex-end',
                        maxWidth: '100%',
                        animation: 'fadeInUp 0.3s ease'
                      }}
                    >
                      {/* Avatar header for AI */}
                      {isAI && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)' }}>SMART_X Assistant</span>
                          <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{msg.timestamp}</span>
                        </div>
                      )}

                      {/* Bubble box */}
                      <div
                        style={{
                          padding: '12px 16px',
                          borderRadius: isAI ? '4px 16px 16px 16px' : '16px 16px 4px 16px',
                          background: isAI ? 'var(--glass-bg)' : 'var(--btn-primary-bg)',
                          color: isAI ? 'var(--text-primary)' : '#fff',
                          border: isAI ? '1px solid var(--glass-border)' : 'none',
                          boxShadow: isAI ? 'var(--glass-shadow)' : '0 4px 12px var(--neon-glow-primary)',
                          lineHeight: 1.5,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word'
                        }}
                        className={`${textSizeClasses[textSize]} ${isAI ? 'glass-card-no-hover' : ''}`}
                      >
                        {/* Render screenshot image preview if user attached one */}
                        {msg.file && (
                          <div style={{
                            marginBottom: '10px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(0,0,0,0.2)',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '0.75rem',
                            color: '#fff'
                          }}>
                            <Image size={24} style={{ color: 'var(--accent-cyan)' }} />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: 700 }}>{msg.file.name}</span>
                              <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>{msg.file.size} • Captured Image</span>
                            </div>
                          </div>
                        )}

                        {/* Normal Text Content */}
                        {msg.text}

                        {/* 1. INTERACTIVE WIDGET: QUIZ MCQ CARD */}
                        {msg.quiz && (
                          <QuizWidget quizData={msg.quiz} />
                        )}

                        {/* 2. INTERACTIVE WIDGET: NOTES COMPONENT */}
                        {msg.notes && (
                          <NotesWidget notesData={msg.notes} />
                        )}

                        {/* 3. INTERACTIVE WIDGET: FLASHCARD COMPONENT */}
                        {msg.flashcard && (
                          <FlashcardWidget flashData={msg.flashcard} />
                        )}
                      </div>

                      {/* User timestamp */}
                      {!isAI && (
                        <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginTop: '4px' }}>{msg.timestamp}</span>
                      )}
                    </div>
                  );
                })}

                {/* AI Thinking Animation */}
                {isTyping && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)' }}>SMART_X Thinking</span>
                    <div style={{
                      display: 'flex',
                      gap: '4px',
                      padding: '12px 20px',
                      borderRadius: '4px 16px 16px 16px',
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                      boxShadow: 'var(--glass-shadow)',
                      alignItems: 'center'
                    }}>
                      <span className="typing-dot" style={{ animationDelay: '0s' }} />
                      <span className="typing-dot" style={{ animationDelay: '0.2s' }} />
                      <span className="typing-dot" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* ATTACHMENT SLIDE PANEL IF ACTIVE */}
              {showAttachments && (
                <div style={{
                  padding: '12px 20px',
                  background: 'var(--glass-bg)',
                  borderTop: '1px solid var(--border-color)',
                  zIndex: 30,
                  animation: 'fadeInUp 0.25s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Select Screenshot Reference</span>
                    <button onClick={() => setShowAttachments(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <X size={14} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {mockAttachments.map(file => (
                      <button
                        key={file.id}
                        onClick={() => handleSelectAttachment(file)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px dashed var(--border-color)',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Image size={14} style={{ color: 'var(--accent-cyan)' }} />
                          <span>{file.name}</span>
                        </div>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{file.size}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SUGGESTION CHIPS ROW */}
              <div 
                style={{
                  padding: '8px 16px',
                  display: 'flex',
                  gap: '8px',
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                  borderTop: '1px solid var(--border-color)',
                  background: 'rgba(255,255,255,0.01)',
                  zIndex: 10
                }}
                className="no-scrollbar"
              >
                {suggestionChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip.text)}
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '6px 12px',
                      borderRadius: '14px',
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s'
                    }}
                    className="chip-btn"
                  >
                    <Sparkles size={10} style={{ color: 'var(--accent-secondary)' }} />
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* EMOJIS POPOVER GRID DRAWER */}
              {showEmojis && (
                <div style={{
                  position: 'absolute',
                  bottom: '68px',
                  right: '16px',
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '16px',
                  padding: '10px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '6px',
                  zIndex: 60,
                  boxShadow: 'var(--glass-shadow)',
                  animation: 'fadeInUp 0.2s ease'
                }}>
                  {emojis.map((em, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInputText(prev => prev + em);
                        setShowEmojis(false);
                      }}
                      style={{
                        fontSize: '1.2rem',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      className="emoji-btn"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}

              {/* INPUT SECTION PANEL FOOTER */}
              <div 
                style={{
                  padding: '12px 16px',
                  borderTop: '1px solid var(--border-color)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  zIndex: 20
                }}
              >
                {/* File Upload Attachment Bar preview if selected */}
                {selectedFile && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    fontSize: '0.7rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
                      <Image size={12} />
                      <span style={{ fontWeight: 700 }}>{selectedFile.name}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedFile(null)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}

                {/* Input Text Box Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {/* File attach Button */}
                  <button
                    onClick={() => {
                      setShowAttachments(!showAttachments);
                      setShowEmojis(false);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: showAttachments ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    title="Upload reference screenshot"
                  >
                    <Paperclip size={18} />
                  </button>

                  {/* Emoji Select Button */}
                  <button
                    onClick={() => {
                      setShowEmojis(!showEmojis);
                      setShowAttachments(false);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: showEmojis ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    title="Insert Emojis"
                  >
                    <Smile size={18} />
                  </button>

                  {/* Interactive Text Field */}
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage(inputText, selectedFile);
                    }}
                    placeholder="Ask SMART_X anything..."
                    style={{
                      flexGrow: 1,
                      padding: '10px 14px',
                      borderRadius: '20px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--glass-bg)',
                      color: 'var(--text-primary)',
                      fontSize: '0.8rem',
                      outline: 'none',
                      transition: 'border-color 0.3s'
                    }}
                    className="focus-glow-input"
                  />

                  {/* Voice Mic Input Button */}
                  <button
                    onClick={startSpeechRecognition}
                    style={{
                      background: isRecording ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                      border: 'none',
                      color: isRecording ? '#ef4444' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      padding: '8px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                    title="Speak to Assistant"
                  >
                    {isRecording && (
                      <span className="mic-pulse" />
                    )}
                    <Mic size={18} />
                  </button>

                  {/* Send Chat Action */}
                  <button
                    onClick={() => handleSendMessage(inputText, selectedFile)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'var(--btn-primary-bg)',
                      color: '#fff',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 10px var(--neon-glow-primary)',
                      transform: 'scale(1)',
                      transition: 'transform 0.2s'
                    }}
                    className="send-btn"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   INTERACTIVE CHILD COMPONENT: QUIZ WIDGET
   ========================================================================== */
const QuizWidget = ({ quizData }) => {
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (index) => {
    if (isAnswered) return;
    setSelectedOpt(index);
    setIsAnswered(true);
  };

  return (
    <div style={{
      marginTop: '12px',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-secondary)' }}>
        <Award size={14} />
        <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>SMART_X Concept Quiz</span>
      </div>
      
      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{quizData.question}</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {quizData.options.map((opt, i) => {
          const isCorrect = i === quizData.correctAnswer;
          const isSelected = i === selectedOpt;
          
          let borderCol = 'var(--border-color)';
          let bgCol = 'transparent';
          let textCol = 'var(--text-secondary)';

          if (isAnswered) {
            if (isCorrect) {
              borderCol = '#10b981';
              bgCol = 'rgba(16, 185, 129, 0.1)';
              textCol = '#10b981';
            } else if (isSelected) {
              borderCol = '#ef4444';
              bgCol = 'rgba(239, 68, 68, 0.1)';
              textCol = '#ef4444';
            }
          } else {
            bgCol = 'rgba(255,255,255,0.01)';
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              style={{
                textAlign: 'left',
                fontSize: '0.7rem',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: borderCol,
                background: bgCol,
                color: textCol,
                cursor: isAnswered ? 'default' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              className={isAnswered ? '' : 'quiz-option-hover'}
            >
              <span>{opt}</span>
              {isAnswered && isCorrect && <span style={{ fontSize: '0.75rem' }}>✅ Correct</span>}
              {isAnswered && isSelected && !isCorrect && <span style={{ fontSize: '0.75rem' }}>❌ Incorrect</span>}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div style={{
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '8px',
          marginTop: '4px',
          lineHeight: 1.4
        }}>
          <strong>Explanation:</strong> {quizData.explanation}
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   INTERACTIVE CHILD COMPONENT: STUDY NOTES WIDGET
   ========================================================================== */
const NotesWidget = ({ notesData }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${notesData.title}\n\n${notesData.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      marginTop: '12px',
      background: 'rgba(243, 239, 255, 0.05)',
      border: '1px solid rgba(168, 85, 247, 0.2)',
      boxShadow: 'inset 0 0 10px rgba(168, 85, 247, 0.05)',
      borderRadius: '12px',
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-secondary)' }}>
          <BookOpen size={14} />
          <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{notesData.title}</span>
        </div>
        <button
          onClick={handleCopy}
          style={{
            background: 'transparent',
            border: 'none',
            color: copied ? '#10b981' : 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.65rem'
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div style={{
        fontSize: '0.7rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.5,
        whiteSpace: 'pre-wrap'
      }}>
        {notesData.content}
      </div>
    </div>
  );
};

/* ==========================================================================
   INTERACTIVE CHILD COMPONENT: FLASHCARD WIDGET
   ========================================================================== */
const FlashcardWidget = ({ flashData }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div 
      onClick={() => setFlipped(!flipped)}
      style={{
        marginTop: '12px',
        perspective: '1000px',
        cursor: 'pointer',
        height: '110px'
      }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        transformStyle: 'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'none'
      }}>
        {/* FRONT SIDE */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--accent-primary)',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          gap: '6px',
          boxShadow: '0 4px 10px rgba(99, 102, 241, 0.05)'
        }}>
          <span style={{ fontSize: '0.6rem', color: 'var(--accent-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Concept Card • Click to Flip
          </span>
          <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{flashData.front}</p>
        </div>

        {/* BACK SIDE */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          background: 'rgba(99, 102, 241, 0.05)',
          border: '1px solid var(--accent-primary)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          transform: 'rotateY(180deg)',
          boxShadow: '0 4px 10px rgba(99, 102, 241, 0.1)'
        }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            {flashData.back}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FloatingChatbot;
