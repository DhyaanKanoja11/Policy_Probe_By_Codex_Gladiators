'use client';
import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Button, Box, Container, useTheme, Drawer,
  List, ListItemButton, ListItemText, Divider,
} from '@mui/material';
import { DarkMode, LightMode, Menu as MenuIcon, Close } from '@mui/icons-material';
import { useThemeMode } from '@/context/ThemeContext';
import { useRouter, usePathname } from 'next/navigation';

const navItems = [
  { label: 'Analyze', path: '/analyze' },
  { label: 'History', path: '/history' },
  { label: 'Comparison', path: '/compare' },
  { label: 'Methodology & FAQ', path: '/faq' },
];

export default function Navbar() {
  const { mode, toggleTheme } = useThemeMode();
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDark = mode === 'dark';

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: isDark ? 'rgba(12,15,16,0.8)' : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0px 20px 40px rgba(43,52,55,0.06)',
          zIndex: 1200,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 64 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => router.push('/')}>
              <Box component="img" src="/logo.png" alt="PolicyProbe" sx={{ width: 32, height: 32, borderRadius: 1 }} />
              <Typography
                sx={{
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  letterSpacing: '-0.03em',
                  color: 'text.primary',
                  '&:hover': { opacity: 0.8 },
                  transition: 'opacity 0.2s',
                }}
              >
                PolicyProbe
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* Desktop Nav */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5, mr: 2 }}>
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    sx={{
                      color: isActive ? 'primary.main' : 'text.secondary',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.875rem',
                      borderBottom: isActive ? '2px solid' : '2px solid transparent',
                      borderColor: isActive ? 'primary.main' : 'transparent',
                      borderRadius: 0,
                      px: 2,
                      py: 1,
                      '&:hover': { color: 'text.primary', bgcolor: 'transparent' },
                      transition: 'all 0.2s',
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>

            <IconButton onClick={toggleTheme} sx={{ color: 'text.secondary', mr: 1 }}>
              {isDark ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
            </IconButton>

            <Box sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              bgcolor: isDark ? 'rgba(22,163,74,0.1)' : '#f0fdf4',
              border: '1px solid',
              borderColor: 'success.main',
              px: 2,
              py: 0.5,
              borderRadius: 0,
            }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'success.main', letterSpacing: '0.05em' }}>
                EPHEMERAL SESSION ACTIVE
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
        PaperProps={{ sx: { width: 280, bgcolor: 'background.default', pt: 2 } }}
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
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ px: 3 }}>
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'success.main', bgcolor: isDark ? 'rgba(22,163,74,0.1)' : '#f0fdf4', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'success.main' }}>EPHEMERAL SESSION</Typography>
          </Box>
        </Box>
      </Drawer>

      {/* Spacer */}
      <Toolbar />
    </>
  );
}
