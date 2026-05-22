import React from 'react';

const SmartXLogo = ({ 
  variant = 'main', // favicon, navbar, dashboard, main, app-icon, hero
  size, 
  spin = true, 
  glow = true,
  className = '',
  style = {}
}) => {
  const defaultSizes = {
    favicon: 32,
    navbar: 48,
    dashboard: 56,
    main: 120,
    'app-icon': 140,
    hero: 160
  };

  const finalSize = size || defaultSizes[variant] || 48;

  // Concentric glowing drop shadows for the deep cybernetic space vibe
  const glowStyle = glow 
    ? { filter: 'drop-shadow(0 8px 24px var(--neon-glow-primary)) drop-shadow(0 4px 12px var(--neon-glow-secondary))' } 
    : {};

  // Attach appropriate animations for specific premium variations
  const variantClasses = [];
  if (variant === 'hero') variantClasses.push('animate-floating');
  if (className) variantClasses.push(className);

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      width={finalSize}
      height={finalSize}
      className={variantClasses.join(' ')}
      style={{
        display: 'block',
        overflow: 'visible',
        ...glowStyle,
        ...style
      }}
    >
      <defs>
        {/* Core Sleek Metallic Gradient */}
        <linearGradient id="smartx-logo-metallic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent-primary)" />
          <stop offset="50%" stopColor="var(--accent-secondary)" />
          <stop offset="100%" stopColor="var(--accent-cyan)" />
        </linearGradient>

        {/* Soft Glassmorphism Fill Gradient */}
        <linearGradient id="smartx-glass-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.12)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.02)" />
        </linearGradient>

        {/* Glowing Double Border Gradient */}
        <linearGradient id="smartx-border-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.25)" />
          <stop offset="50%" stopColor="var(--accent-secondary)" opacity="0.6" />
          <stop offset="100%" stopColor="var(--accent-cyan)" opacity="0.7" />
        </linearGradient>

        {/* Multi-layered High-performance Neon Glow Filter */}
        <filter id="smartx-neural-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feComponentTransfer in="blur" result="glow1">
            <feFuncA type="linear" slope="0.85"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="glow1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 1. GLASSMORPHIC SHIELD BACKDROP (Rendered for 'app-icon' and 'hero') */}
      {(variant === 'app-icon' || variant === 'hero') && (
        <>
          {/* Glassmorphic plate */}
          <rect 
            x="4" 
            y="4" 
            width="92" 
            height="92" 
            rx="24" 
            fill="url(#smartx-glass-grad)" 
            stroke="url(#smartx-border-grad)" 
            strokeWidth="1.8" 
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          />
          {/* Curved Light Reflection Streak */}
          <path 
            d="M 6,35 C 30,15 70,15 94,35 L 94,6 C 94,6 80,4 50,4 C 20,4 6,6 6,6 Z" 
            fill="rgba(255, 255, 255, 0.05)" 
            pointerEvents="none" 
          />
        </>
      )}

      {/* 2. CONCENTRIC OUTER CIRCUIT TRACKS (Rendered for 'main', 'hero', 'dashboard') */}
      {(variant === 'main' || variant === 'hero' || variant === 'dashboard') && (
        <>
          {/* Outer dashed spinning circular circuit track */}
          <circle 
            cx="50" 
            cy="50" 
            r="44" 
            fill="none" 
            stroke="url(#smartx-logo-metallic)" 
            strokeWidth="1.5" 
            opacity="0.25" 
            strokeDasharray="8 5"
            className={spin ? "animate-spin-slow" : ""}
            style={{ transformOrigin: '50px 50px', animationDuration: '24s' }}
          />
          {/* Inner dashed reversing spinning circuit track */}
          <circle 
            cx="50" 
            cy="50" 
            r="38" 
            fill="none" 
            stroke="url(#smartx-logo-metallic)" 
            strokeWidth="1" 
            opacity="0.15" 
            strokeDasharray="4 6"
            className={spin ? "animate-spin-slow" : ""}
            style={{ transformOrigin: '50px 50px', animationDirection: 'reverse', animationDuration: '32s' }}
          />
        </>
      )}

      {/* 3. SLEEK VECTOR WINGS (Open Book of Academic Knowledge) */}
      <g opacity="0.85" filter="url(#smartx-neural-glow)">
        {/* Left Book Wing */}
        <path 
          d="M 50,70 C 37,58 24,58 12,66 L 12,30 C 24,22 37,22 50,34 Z" 
          fill="none" 
          stroke="url(#smartx-logo-metallic)" 
          strokeWidth="3.2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        {/* Right Book Wing */}
        <path 
          d="M 50,70 C 63,58 76,58 88,66 L 88,30 C 76,22 63,22 50,34 Z" 
          fill="none" 
          stroke="url(#smartx-logo-metallic)" 
          strokeWidth="3.2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </g>

      {/* 4. SLEEK FUTURISTIC 'X' NEURAL CROSSING BEAMS */}
      <g filter="url(#smartx-neural-glow)" opacity="0.92">
        {/* Left-to-Right Beam */}
        <path 
          d="M 28,28 L 72,72" 
          stroke="url(#smartx-logo-metallic)" 
          strokeWidth="6" 
          strokeLinecap="round" 
        />
        {/* Right-to-Left Beam */}
        <path 
          d="M 72,28 L 28,72" 
          stroke="url(#smartx-logo-metallic)" 
          strokeWidth="6" 
          strokeLinecap="round" 
        />
      </g>

      {/* 5. HOVERING DIAMOND GRADUATION CAP (Academic Goal Focus) */}
      <g filter="url(#smartx-neural-glow)">
        {/* Solid Cap Diamond Plating */}
        <path 
          d="M 50,14 L 74,23 L 50,32 L 26,23 Z" 
          fill="url(#smartx-logo-metallic)" 
          opacity="0.95"
        />
        {/* Metallic Border Accenting */}
        <path 
          d="M 50,14 L 74,23 L 50,32 L 26,23 Z" 
          fill="none" 
          stroke="#ffffff" 
          strokeWidth="1.5" 
          opacity="0.75"
        />
        {/* Hanging Tassel Circuit Connection */}
        <path 
          d="M 70,21.5 L 70,36 C 70,41 65,44 59,44 L 56,44" 
          fill="none" 
          stroke="url(#smartx-logo-metallic)" 
          strokeWidth="1.6" 
          strokeLinecap="round"
        />
      </g>

      {/* 6. NEURAL CONNECTIONS & KNOWLEDGE ENERGY WAVES */}
      <g filter="url(#smartx-neural-glow)">
        {/* Neural Network Nodes at critical cap junctions */}
        <circle cx="50" cy="14" r="3.5" fill="#ffffff" stroke="url(#smartx-logo-metallic)" strokeWidth="1.5" />
        <circle cx="26" cy="23" r="3" fill="var(--accent-cyan)" stroke="#ffffff" strokeWidth="1" />
        <circle cx="74" cy="23" r="3" fill="var(--accent-secondary)" stroke="#ffffff" strokeWidth="1" />
        <circle cx="50" cy="32" r="3" fill="var(--accent-primary)" stroke="#ffffff" strokeWidth="1" />

        {/* Pulsing Concentric Learning Waves */}
        <path 
          d="M 38,50 A 12,12 0 0,1 62,50" 
          fill="none" 
          stroke="url(#smartx-logo-metallic)" 
          strokeWidth="2" 
          strokeLinecap="round" 
          opacity="0.8" 
        />
        <path 
          d="M 32,50 A 18,18 0 0,1 68,50" 
          fill="none" 
          stroke="url(#smartx-logo-metallic)" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          opacity="0.45" 
          strokeDasharray="4 2"
        />
      </g>

      {/* 7. CENTRAL COGNITIVE ENERGY CORE */}
      <g filter="url(#smartx-neural-glow)">
        {/* Outer glowing white core halo */}
        <circle cx="50" cy="50" r="11" fill="rgba(255, 255, 255, 0.95)" />
        {/* Central metallic gradient core */}
        <circle cx="50" cy="50" r="7" fill="url(#smartx-logo-metallic)" />
      </g>
    </svg>
  );
};

export default SmartXLogo;
