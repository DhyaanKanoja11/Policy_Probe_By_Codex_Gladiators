'use client';
import React from 'react';
import { Box, Typography, useTheme, Chip } from '@mui/material';
import { VerifiedUser, WarningAmber, DataObject } from '@mui/icons-material';

interface IntegrityCardProps {
  check?: {
    missing_sections: string[];
    completeness: 'High' | 'Medium' | 'Low';
    notes: string;
  };
}

export default function IntegrityCard({ check }: IntegrityCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!check) return null;

  return (
    <Box sx={{
      bgcolor: isDark ? 'rgba(77,142,255,0.05)' : '#f0f5ff', 
      p: { xs: 2, md: 3 }, borderRadius: 0,
      border: '2px solid', borderColor: isDark ? '#4d8eff' : '#005ac2',
      boxShadow: isDark ? '4px 4px 0px #4d8eff' : '4px 4px 0px #005ac2',
      mt: 3, mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center'
    }}>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <VerifiedUser sx={{ color: isDark ? '#8ab4f8' : '#005ac2', fontSize: 20 }} />
          <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 800, fontSize: '1rem', color: isDark ? '#8ab4f8' : '#005ac2' }}>
            Gemini Layer
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
          {check.notes}
        </Typography>
        
        {check.missing_sections.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <WarningAmber sx={{ fontSize: 14, color: 'warning.main' }} />
              MISSING SECTIONS DETECTED:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {check.missing_sections.map(sec => (
                <Chip key={sec} label={sec} size="small" variant="outlined" sx={{ borderRadius: 0, fontSize: '0.65rem', fontWeight: 600 }} />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#fff', border: '1px solid', borderColor: 'divider', minWidth: 140 }}>
        <DataObject sx={{ color: 'text.secondary', mb: 0.5 }} />
        <Typography variant="h5" sx={{ fontWeight: 800, color: check.completeness === 'High' ? 'success.main' : check.completeness === 'Medium' ? 'warning.main' : 'error.main' }}>
          {check.completeness}
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.05em', color: 'text.secondary' }}>COMPLETENESS</Typography>
      </Box>
    </Box>
  );
}
