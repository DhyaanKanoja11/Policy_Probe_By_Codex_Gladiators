'use client';
import { createTheme } from '@mui/material/styles';

const sharedTypography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
  h1: { fontFamily: '"Manrope", "Inter", sans-serif', fontWeight: 700, letterSpacing: '-0.02em' },
  h2: { fontFamily: '"Manrope", "Inter", sans-serif', fontWeight: 700, letterSpacing: '-0.015em' },
  h3: { fontFamily: '"Manrope", "Inter", sans-serif', fontWeight: 600, letterSpacing: '-0.01em' },
  h4: { fontFamily: '"Manrope", "Inter", sans-serif', fontWeight: 600 },
  h5: { fontFamily: '"Manrope", "Inter", sans-serif', fontWeight: 600 },
  h6: { fontFamily: '"Manrope", "Inter", sans-serif', fontWeight: 600 },
  button: { fontWeight: 600, textTransform: 'none' as const, fontFamily: '"Inter", sans-serif' },
  overline: { fontFamily: '"Inter", sans-serif', fontWeight: 600, letterSpacing: '0.12em' },
};

const sharedComponents = {
  MuiButton: {
    styleOverrides: {
      root: { 
        borderRadius: 0, 
        padding: '10px 24px', 
        fontSize: '0.9rem',
        border: '2px solid transparent',
        transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
      },
      contained: { 
        color: '#FFFFFF', 
        backgroundColor: '#005ac2',
        border: '2px solid #2b3437',
        boxShadow: '3px 3px 0px #2b3437',
        '&:hover': { 
          backgroundColor: '#004fab',
          transform: 'translate(-2px, -2px)',
          boxShadow: '5px 5px 0px #2b3437' 
        },
        '&:active': {
          transform: 'translate(2px, 2px)',
          boxShadow: '1px 1px 0px #2b3437'
        }
      },
      outlined: {
        border: '2px solid #2b3437',
        backgroundColor: '#ffffff',
        color: '#2b3437',
        boxShadow: '3px 3px 0px #2b3437',
        '&:hover': {
          backgroundColor: '#f1f4f6',
          border: '2px solid #2b3437',
          transform: 'translate(-2px, -2px)',
          boxShadow: '5px 5px 0px #2b3437' 
        },
        '&:active': {
          transform: 'translate(2px, 2px)',
          boxShadow: '1px 1px 0px #2b3437'
        }
      }
    },
  },
  MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#005ac2', light: '#4d8eff', dark: '#004fab' },
    secondary: { main: '#5f5c78' },
    error: { main: '#E11D48', light: '#fe8983' },
    warning: { main: '#F59E0B' },
    success: { main: '#16A34A' },
    background: { default: '#fefefe', paper: '#ffffff' },
    text: { primary: '#111827', secondary: '#4B5563' },
    divider: '#2b3437', // Hard divider for neobrutalism
  },
  typography: sharedTypography,
  components: {
    ...sharedComponents,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundImage: 'none',
          border: '2px solid #111827',
          boxShadow: '6px 6px 0px #111827',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '2px solid #111827',
          fontWeight: 700,
        }
      }
    }
  },
  shape: { borderRadius: 0 },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4d8eff', light: '#7aadff', dark: '#005ac2' },
    secondary: { main: '#c5c0e0' },
    error: { main: '#F43F5E', light: '#ff9e99' },
    warning: { main: '#FCD34D' },
    success: { main: '#4ADE80' },
    background: { default: '#1a1f22', paper: '#252a2e' },
    text: { primary: '#fefefe', secondary: '#d1d5db' },
    divider: '#fefefe', // Hard divider for dark mode neobrutalism
  },
  typography: sharedTypography,
  components: {
    ...sharedComponents,
    MuiButton: {
      styleOverrides: {
        ...sharedComponents.MuiButton.styleOverrides,
        contained: { 
          color: '#111827', 
          backgroundColor: '#4d8eff',
          border: '2px solid #fefefe',
          boxShadow: '3px 3px 0px #fefefe',
          '&:hover': { backgroundColor: '#7aadff', transform: 'translate(-2px, -2px)', boxShadow: '5px 5px 0px #fefefe' },
          '&:active': { transform: 'translate(2px, 2px)', boxShadow: '1px 1px 0px #fefefe' }
        },
        outlined: {
          border: '2px solid #fefefe',
          backgroundColor: '#252a2e',
          color: '#fefefe',
          boxShadow: '3px 3px 0px #fefefe',
          '&:hover': { backgroundColor: '#33393e', border: '2px solid #fefefe', transform: 'translate(-2px, -2px)', boxShadow: '5px 5px 0px #fefefe' },
          '&:active': { transform: 'translate(2px, 2px)', boxShadow: '1px 1px 0px #fefefe' }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundImage: 'none',
          border: '2px solid #fefefe',
          boxShadow: '6px 6px 0px #fefefe',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '2px solid #fefefe',
          fontWeight: 700,
        }
      }
    }
  },
  shape: { borderRadius: 0 },
});
