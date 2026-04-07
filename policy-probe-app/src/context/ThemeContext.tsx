'use client';
import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode, useRef } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from '@/lib/theme';

interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleTheme: (event?: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextType>({ mode: 'dark', toggleTheme: () => {} });

export const useThemeMode = () => useContext(ThemeContext);

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('policy-probe-theme') as 'light' | 'dark' | null;
    if (saved) setMode(saved);
    setMounted(true);
  }, []);

  const toggleTheme = (event?: React.MouseEvent) => {
    if (event && overlayRef.current) {
      const x = event.clientX;
      const y = event.clientY;
      document.documentElement.style.setProperty('--expand-x', `${x}px`);
      document.documentElement.style.setProperty('--expand-y', `${y}px`);
      
      setIsExpanding(true);
      // Change theme halfway through or after a tiny delay
      setTimeout(() => {
        setMode((prev) => {
          const next = prev === 'dark' ? 'light' : 'dark';
          localStorage.setItem('policy-probe-theme', next);
          return next;
        });
      }, 150);
      
      // Cleanup animation class
      setTimeout(() => setIsExpanding(false), 850);
    } else {
      setMode((prev) => {
        const next = prev === 'dark' ? 'light' : 'dark';
        localStorage.setItem('policy-probe-theme', next);
        return next;
      });
    }
  };

  const theme = useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);

  // Prevent hydration mismatch flash
  if (!mounted) {
    return (
      <MUIThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </MUIThemeProvider>
    );
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {isExpanding && (
          <div 
            ref={overlayRef}
            className="theme-expand-anim"
            style={{ 
              position: 'fixed', 
              top: 0, left: 0, right: 0, bottom: 0, 
              zIndex: 9999, 
              pointerEvents: 'none',
              backgroundColor: mode === 'dark' ? '#fefefe' : '#1a1f22' // Opposite of current mode
            }}
          />
        )}
        <div style={{ colorScheme: mode }}>
          {children}
        </div>
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}

