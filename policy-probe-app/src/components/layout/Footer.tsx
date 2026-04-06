'use client';
import React from 'react';
import { Box, Container, Typography, Link, useTheme } from '@mui/material';

const footerLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
];

export default function Footer() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 5,
        bgcolor: isDark ? '#0a0c0d' : '#f1f4f6',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 3 }}>
          <Typography sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 800, fontSize: '1rem', color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
            PolicyProbe
          </Typography>
          <Box sx={{ display: 'flex', gap: 4 }}>
            {footerLinks.map((l) => (
              <Link key={l.label} href={l.href} underline="none" sx={{ color: 'text.secondary', fontSize: '0.8rem', '&:hover': { color: 'text.primary' }, transition: 'color 0.2s' }}>
                {l.label}
              </Link>
            ))}
          </Box>
          <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'block', mb: 0.5, fontWeight: 700 }}>
              Built By: CODEX GLADIATORS
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              © {new Date().getFullYear()} PolicyProbe. Secure Analysis Intelligence.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
