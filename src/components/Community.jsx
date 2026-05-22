import React, { useState } from 'react';
import { Users, MessageSquare, Video, ArrowRight, Share2, Compass, ShieldAlert, Sparkles, MessageCircle } from 'lucide-react';

const Community = () => {
  const [activeRooms, setActiveRooms] = useState([
    { id: 1, title: 'Quantum Mechanics Review', users: 14, active: true },
    { id: 2, title: 'Calculus III Mock Prep', users: 8, active: true },
    { id: 3, title: 'Python Matrices Homework', users: 21, active: false }
  ]);

  const [posts, setPosts] = useState([
    { id: 1, name: 'Nikita S.', time: '10m ago', text: 'Just achieved 100% mastery score in Expert Quadratic discriminant algorithms! Highly recommend using the AI Whiteboard to map root formulas.', likes: 14, comments: 3 },
    { id: 2, name: 'Sven O.', time: '1 hr ago', text: 'Drafting study planning matrixes for final thermodynamics equations. Anyone wants to join a virtual whiteboard session tonight?', likes: 8, comments: 12 },
    { id: 3, name: 'Aris K.', time: '4 hrs ago', text: 'The multi-language Voice AI (Hindi/Urdu module) is incredibly natural. Helped me clarify complicated electromagnetic theories in minutes.', likes: 22, comments: 8 }
  ]);

  const [newPostText, setNewPostText] = useState('');

  const handleCreatePost = () => {
    if (!newPostText.trim()) return;
    const newPost = {
      id: Date.now(),
      name: 'Nikita S. (You)',
      time: 'Just now',
      text: newPostText,
      likes: 0,
      comments: 0
    };
    setPosts(prev => [newPost, ...prev]);
    setNewPostText('');
  };

  const handleLike = (postId) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <section className="content-section" style={{ textAlign: 'left' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Collaborative Spaces
        </span>
        <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: 800 }}>
          Learn Together on <span className="gradient-text neon-text-glow">SMART_X Community</span>
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="lg:grid-cols-3">
        
        {/* Discussion Forum Feed */}
        <div className="glass-panel lg:col-span-2" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Peer Collaboration Feed</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Share formulas, study cards, and progress accomplishments</p>
          </div>

          {/* Quick Post Creator */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreatePost()}
              placeholder="What have you learned today? Share a study tip..."
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
              onClick={handleCreatePost}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--btn-primary-bg)',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 600,
                boxShadow: '0 4px 10px rgba(99,102,241,0.2)'
              }}
            >
              Post
            </button>
          </div>

          {/* Posts list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {/* Author Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{post.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{post.time}</span>
                </div>

                {/* Text */}
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {post.text}
                </p>

                {/* Engagement */}
                <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <button
                    onClick={() => handleLike(post.id)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    🔥 <span>{post.likes} Likes</span>
                  </button>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MessageCircle size={14} /> <span>{post.comments} Comments</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Active Virtual Study Rooms */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Video size={18} className="text-pink-400" />
              Active Study Rooms
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Join live sessions with peer students</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeRooms.map((room) => (
              <div
                key={room.id}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{room.title}</span>
                  {room.active && (
                    <span style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      border: '1.5px solid #10b981',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.65rem',
                      fontWeight: 700
                    }}>
                      Live
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={12} /> {room.users} study buddies active
                  </span>

                  <button
                    onClick={() => alert(`Entering ${room.title} virtual whiteboard room. Synchronizing data modules...`)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    Join <ArrowRight size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Student Achievement ticker */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Recent Accomplishments
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              <span>🚀 <strong>Sven O.</strong> earned the "Speed Solver" badge.</span>
              <span>⚡ <strong>Aris K.</strong> maintained a 30-Day streak.</span>
              <span>💎 <strong>Nikita S.</strong> leveled up to Master Rank #128.</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Community;
