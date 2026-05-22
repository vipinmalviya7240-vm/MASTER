// Framer Motion spring presets for premium futuristic UI transitions
export const glassPanelTransition = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
      mass: 0.8
    }
  }
};

export const containerStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

// Micro-interaction magnetic button effect
export const magneticHover = {
  rest: { x: 0, y: 0 },
  hover: (customMouseCoord = { x: 0, y: 0 }) => ({
    x: customMouseCoord.x * 0.15,
    y: customMouseCoord.y * 0.15,
    transition: { type: "spring", stiffness: 150, damping: 10 }
  })
};

// Bouncing hover indicator for badges
export const pulseScale = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10
    }
  }
};
