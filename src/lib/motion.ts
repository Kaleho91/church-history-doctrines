/**
 * Quiet Luxury Motion System
 * Shared motion constants and utilities for consistent, subtle animations
 */

export const durations = {
    micro: 0.16,
    short: 0.22,
    medium: 0.30,
    drawer: 0.38,
} as const;

export const easing = {
    easeOut: [0.16, 1, 0.3, 1] as const,
    easeInOut: [0.45, 0, 0.55, 1] as const,
} as const;

/**
 * Standard transition configs
 */
export const transitions = {
    micro: {
        duration: durations.micro,
        ease: easing.easeOut,
    },
    short: {
        duration: durations.short,
        ease: easing.easeOut,
    },
    medium: {
        duration: durations.medium,
        ease: easing.easeOut,
    },
    drawer: {
        duration: durations.drawer,
        ease: easing.easeOut,
    },
} as const;

/**
 * Animation variants for common patterns
 */
export const variants = {
    // Fade + slide up (for content transitions)
    fadeSlideUp: {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 6 },
    },
    // Drawer from right
    drawerRight: {
        initial: { x: 24, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 24, opacity: 0 },
    },
    // Overlay backdrop
    overlay: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
} as const;
