'use client';
import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Button, Box, Container, useTheme, Drawer,
  List, ListItemButton, ListItemText, Divider,
} from '@mui/material';
import { DarkMode, LightMode, Menu as MenuIcon, Close } from '@mui/icons-material';
import { useThemeMode } from '@/context/ThemeContext';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'Analyze', path: '/analyze' },
  { label: 'History', path: '/history' },
  { label: 'Comparison', path: '/compare' },
  { label: 'FAQ', path: '/faq' },
];

export default function Navbar() {
  const { mode, toggleTheme } = useThemeMode();
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isDark = mode === 'dark';

  // Simulate page loading progress on route change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Top Progress Bar */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ width: 0, opacity: 1 }}
            animate={{ width: '100%', opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={{
              position: 'fixed', top: 0, left: 0, height: 4, 
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.success.main})`,
              zIndex: 9999,
            }}
          />
        )}
      </AnimatePresence>

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: isDark ? 'rgba(26,31,34,0.85)' : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '2px solid',
          borderColor: isDark ? '#fefefe' : '#111827',
          zIndex: 1200,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 72 }}>
            <Box 
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} 
              onClick={() => router.push('/')}
            >
              <Box 
                sx={{ 
                  width: 36, height: 36, borderRadius: 0, 
                  bgcolor: 'primary.main', border: '2px solid', 
                  borderColor: isDark ? '#fefefe' : '#111827',
                  boxShadow: `3px 3px 0px ${isDark ? '#fefefe' : '#111827'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, color: '#fff', fontSize: '1.2rem'
                }}
              >
                P
              </Box>
              <Typography
                sx={{
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 900,
                  fontSize: '1.4rem',
                  letterSpacing: '-0.04em',
                  color: 'text.primary',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                PolicyProbe
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* Desktop Nav */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, mr: 2 }}>
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Box key={item.path} sx={{ position: 'relative' }}>
                    <Button
                      onClick={() => router.push(item.path)}
                      sx={{
                        color: isActive ? 'text.primary' : 'text.secondary',
                        fontWeight: isActive ? 800 : 600,
                        fontSize: '0.875rem',
                        borderRadius: 0,
                        px: 2,
                        py: 1,
                        '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                        transition: 'all 0.2s',
                      }}
                    >
                      {item.label}
                    </Button>
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        style={{
                          position: 'absolute', bottom: 4, left: 16, right: 16,
                          height: 3, background: theme.palette.primary.main,
                          borderRadius: 0,
                          border: `1px solid ${isDark ? '#fefefe' : '#111827'}`
                        }}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>

            <IconButton 
              onClick={(e) => toggleTheme(e)} 
              sx={{ 
                color: 'text.primary', 
                border: '2px solid', 
                borderColor: 'text.primary',
                borderRadius: 0,
                boxShadow: `3px 3px 0px ${isDark ? '#fefefe' : '#111827'}`,
                mr: 2,
                '&:active': { transform: 'translate(2px, 2px)', boxShadow: 'none' }
              }}
            >
              {isDark ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
            </IconButton>

            <Box sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              bgcolor: 'success.main',
              color: '#fff',
              border: '2px solid',
              borderColor: isDark ? '#fefefe' : '#111827',
              boxShadow: `3px 3px 0px ${isDark ? '#fefefe' : '#111827'}`,
              px: 2,
              py: 0.75,
              borderRadius: 0,
            }}>
              <Typography variant="caption" sx={{ fontWeight: 900, letterSpacing: '0.08em' }}>
                LIVE SCAN READY
              </Typography>
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: 'none' }, color: 'text.primary', ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ 
          sx: { 
            width: 280, bgcolor: 'background.default', pt: 2,
            borderLeft: '4px solid', borderColor: 'text.primary'
          } 
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2 }}>
          <IconButton onClick={() => setMobileOpen(false)}><Close /></IconButton>
        </Box>
        <List sx={{ px: 2 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              onClick={() => { router.push(item.path); setMobileOpen(false); }}
              selected={pathname === item.path}
              sx={{ 
                borderRadius: 0, mb: 1, 
                border: pathname === item.path ? '2px solid' : '2px solid transparent',
                borderColor: 'text.primary',
                boxShadow: pathname === item.path ? '4px 4px 0px #111827' : 'none'
              }}
            >
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ fontWeight: 800, fontSize: '1.1rem' }} 
              />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ my: 2, borderBottomWidth: 2, borderColor: 'text.primary' }} />
        <Box sx={{ px: 3 }}>
          <Box sx={{ 
            p: 2, border: '2px solid', borderColor: 'text.primary', 
            bgcolor: 'success.main', color: '#fff', textAlign: 'center',
            boxShadow: '4px 4px 0px #111827'
          }}>
            <Typography variant="caption" sx={{ fontWeight: 900 }}>SECURE AUDIT ACTIVE</Typography>
          </Box>
        </Box>
      </Drawer>

      {/* Spacer */}
      <Toolbar sx={{ height: 72 }} />
    </>
  );
}

