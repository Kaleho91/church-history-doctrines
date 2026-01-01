/**
 * Motion System — Refined for Intellectual Dignity
 * 
 * Core principles:
 * - Content arrives, it doesn't appear
 * - Motion communicates structure, not decoration
 * - Everything feels deliberate and composed
 */

// Single calm ease-out curve used everywhere
export const ease = [0.16, 1, 0.3, 1] as const;

export const durations = {
  micro: 0.14,      // Hover states, tiny interactions
  short: 0.22,      // Content transitions, lens changes
  medium: 0.32,     // Page sections arriving
  drawer: 0.38,     // Depth transitions (citation drawer)
} as const;

/**
 * Standard transitions - all use the same calm ease
 */
export const transitions = {
  micro: { duration: durations.micro, ease },
  short: { duration: durations.short, ease },
  medium: { duration: durations.medium, ease },
  drawer: { duration: durations.drawer, ease },
} as const;

/**
 * Page Arrival Choreography
 * Content enters from below, fading in gently
 */
export const pageArrival = {
  container: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 }
    },
  },
  section: {
    initial: { opacity: 0, y: 12 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: durations.medium, ease }
    },
  },
} as const;

/**
 * Perspective Shift — for lens changes
 * Old content fades up and out, new content settles in
 */
export const perspectiveShift = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
} as const;

/**
 * Viewport Reveal — for scroll-triggered content
 */
export const viewportReveal = {
  initial: { opacity: 0, y: 8 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.18, ease },
} as const;

/**
 * Depth Transition — for citation drawer
 */
export const depthTransition = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  drawer: {
    initial: { x: 24, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 24, opacity: 0 },
  },
} as const;

/**
 * Micro-interactions — subtle hover feedback
 */
export const microInteraction = {
  lift: { y: -1, transition: transitions.micro },
  glow: { scale: 1.02, transition: transitions.micro },
  settle: { y: 0, scale: 1, transition: transitions.micro },
} as const;

// Legacy exports for compatibility
export const easing = { easeOut: ease, easeInOut: [0.45, 0, 0.55, 1] as const } as const;
export const variants = {
  fadeSlideUp: perspectiveShift,
  drawerRight: depthTransition.drawer,
  overlay: depthTransition.overlay,
} as const;
