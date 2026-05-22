import React, { useEffect, useRef } from 'react';

const BackgroundEffects = ({ theme }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 150 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const particleCount = 60;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulseDir = 1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around borders
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Pulsing opacity
        this.alpha += this.pulseSpeed * this.pulseDir;
        if (this.alpha > 0.8 || this.alpha < 0.2) {
          this.pulseDir *= -1;
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Dynamic colors based on theme
        const color = theme === 'dark' 
          ? `rgba(168, 85, 247, ${this.alpha})` // Purple in dark
          : `rgba(99, 102, 241, ${this.alpha})`; // Indigo in light
          
        ctx.fillStyle = color;
        
        // Soft glowing shadow for high size particles
        if (this.size > 1.8) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = theme === 'dark' ? '#c084fc' : '#6366f1';
        }
        
        ctx.fill();
        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update & Draw Particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw mouse interactive glowing aura
      const mouse = mouseRef.current;
      if (mouse.x > -500 && mouse.y > -500) {
        ctx.save();
        const gradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, mouse.radius
        );
        
        const glowColor = theme === 'dark' 
          ? 'rgba(192, 132, 252, 0.08)' // Cyber purple glow
          : 'rgba(99, 102, 241, 0.05)'; // Soft blue glow
          
        gradient.addColorStop(0, glowColor);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <>
      <canvas ref={canvasRef} className="interactive-canvas" />
      <div className="background-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>
    </>
  );
};

export default BackgroundEffects;
