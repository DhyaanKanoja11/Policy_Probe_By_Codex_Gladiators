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
    <Box className="nb-shadow" sx={{
      bgcolor: isDark ? 'rgba(77,142,255,0.05)' : '#f0f5ff', 
      p: { xs: 2.5, md: 3.5 }, borderRadius: 0,
      border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827',
      mt: 3, mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'center'
    }}>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Box sx={{ 
            width: 32, height: 32, bgcolor: isDark ? '#4d8eff' : '#005ac2', color: '#fff', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827',
            boxShadow: `2px 2px 0px ${isDark ? '#fefefe' : '#111827'}`,
            borderRadius: 0
          }}>
            <VerifiedUser sx={{ fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
            AI Integrity Discovery
          </Typography>
        </Box>
        <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6, fontWeight: 600 }}>
          {check.notes}
        </Typography>
        
        {check.missing_sections.length > 0 && (
          <Box sx={{ mt: 2.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 900, color: 'error.main', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <WarningAmber sx={{ fontSize: 14 }} />
              Missing Disclosure Points:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {check.missing_sections.map(sec => (
                <Chip key={sec} label={sec} size="small" 
                  sx={{ 
                    borderRadius: 0, fontSize: '0.65rem', fontWeight: 800, 
                    border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827',
                    bgcolor: 'background.paper', color: 'text.primary'
                  }} />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2.5, 
        bgcolor: isDark ? 'background.paper' : '#fff', 
        border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827', 
        boxShadow: `4px 4px 0px ${isDark ? '#fefefe' : '#111827'}`,
        minWidth: 160 
      }}>
        <DataObject sx={{ color: 'text.secondary', mb: 0.5, fontSize: 28 }} />
        <Typography variant="h4" sx={{ fontWeight: 900, color: check.completeness === 'High' ? 'success.main' : check.completeness === 'Medium' ? 'warning.main' : 'error.main' }}>
          {check.completeness}
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 900, letterSpacing: '0.1em', color: 'text.secondary', textTransform: 'uppercase' }}>COMPLETENESS</Typography>
      </Box>
    </Box>

  );
}
