/**
 * Responsive Design Utilities
 * Provides responsive breakpoints and media query helpers
 */

import { useState, useEffect } from 'react';

// Breakpoints
export const BREAKPOINTS = {
  xs: 320,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536
};

/**
 * Hook to detect current breakpoint
 */
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : BREAKPOINTS.lg,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const breakpoint = {
    isXs: screenSize.width < BREAKPOINTS.sm,
    isSm: screenSize.width >= BREAKPOINTS.sm && screenSize.width < BREAKPOINTS.md,
    isMd: screenSize.width >= BREAKPOINTS.md && screenSize.width < BREAKPOINTS.lg,
    isLg: screenSize.width >= BREAKPOINTS.lg && screenSize.width < BREAKPOINTS.xl,
    isXl: screenSize.width >= BREAKPOINTS.xl,
    isMobile: screenSize.width < BREAKPOINTS.md,
    isTablet: screenSize.width >= BREAKPOINTS.md && screenSize.width < BREAKPOINTS.lg,
    isDesktop: screenSize.width >= BREAKPOINTS.lg,
    width: screenSize.width,
    height: screenSize.height,
  };

  return breakpoint;
};

/**
 * Common responsive styles
 */
export const responsiveStyles = {
  // Container
  container: (isMobile) => ({
    maxWidth: isMobile ? '100%' : '1200px',
    margin: '0 auto',
    padding: isMobile ? '16px' : '24px',
  }),

  // Grid
  grid: (isMobile, columns = 3) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : `repeat(${columns}, 1fr)`,
    gap: isMobile ? '12px' : '20px',
  }),

  // Flex
  flexColumn: (gap = '16px') => ({
    display: 'flex',
    flexDirection: 'column',
    gap,
  }),

  flexRow: (gap = '16px', wrap = true) => ({
    display: 'flex',
    flexDirection: 'row',
    gap,
    flexWrap: wrap ? 'wrap' : 'nowrap',
  }),

  // Text
  heading1: (isMobile) => ({
    fontSize: isMobile ? '1.5rem' : '2rem',
    lineHeight: 1.2,
  }),

  heading2: (isMobile) => ({
    fontSize: isMobile ? '1.25rem' : '1.5rem',
    lineHeight: 1.3,
  }),

  heading3: (isMobile) => ({
    fontSize: isMobile ? '1rem' : '1.25rem',
    lineHeight: 1.4,
  }),

  body: (isMobile) => ({
    fontSize: isMobile ? '0.875rem' : '1rem',
    lineHeight: 1.6,
  }),

  // Input
  input: (isMobile) => ({
    width: '100%',
    padding: isMobile ? '10px 12px' : '12px 16px',
    fontSize: isMobile ? '0.875rem' : '1rem',
    borderRadius: '6px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
  }),

  // Button
  button: (isMobile) => ({
    padding: isMobile ? '10px 16px' : '12px 24px',
    fontSize: isMobile ? '0.875rem' : '0.95rem',
    borderRadius: '6px',
    minWidth: isMobile ? '80px' : '100px',
  }),

  // Card
  card: (isMobile) => ({
    padding: isMobile ? '16px' : '24px',
    borderRadius: '8px',
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  }),

  // Modal/Overlay
  modal: (isMobile) => ({
    padding: isMobile ? '16px' : '32px',
    maxWidth: isMobile ? '100%' : '500px',
    maxHeight: isMobile ? '100vh' : '90vh',
    overflow: isMobile ? 'auto' : 'hidden',
  }),
};

/**
 * Generate responsive fontSize
 */
export const responsiveFontSize = (mobileSize, desktopSize) => {
  const mobilePixels = parseInt(mobileSize);
  const desktopPixels = parseInt(desktopSize);
  const slope = (desktopPixels - mobilePixels) / (BREAKPOINTS.lg - BREAKPOINTS.md);
  const intercept = mobilePixels - slope * BREAKPOINTS.md;

  return `clamp(${mobileSize}, calc(${slope} * 100vw + ${intercept}px), ${desktopSize})`;
};

/**
 * Generate responsive padding
 */
export const responsivePadding = (mobilePx, desktopPx) => {
  const mobile = parseInt(mobilePx);
  const desktop = parseInt(desktopPx);
  const slope = (desktop - mobile) / (BREAKPOINTS.lg - BREAKPOINTS.md);
  const intercept = mobile - slope * BREAKPOINTS.md;

  return `clamp(${mobilePx}, calc(${slope} * 100vw + ${intercept}px), ${desktopPx})`;
};

export default {
  useResponsive,
  responsiveStyles,
  responsiveFontSize,
  responsivePadding,
  BREAKPOINTS
};
