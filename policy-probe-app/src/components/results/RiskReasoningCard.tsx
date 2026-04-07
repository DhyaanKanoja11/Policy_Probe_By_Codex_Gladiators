'use client';
import React from 'react';
import { Box, Typography, LinearProgress, Chip, useTheme } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';
import { RiskReason } from '@/lib/types';

interface Props { reasons: RiskReason[]; overallScore: number; }

export default function RiskReasoningCard({ reasons, overallScore }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const config = {
    Positive: { color: theme.palette.success.main, icon: <TrendingUp sx={{ fontSize: 15 }} />, label: 'Improves Score' },
    Negative: { color: theme.palette.error.main, icon: <TrendingDown sx={{ fontSize: 15 }} />, label: 'Reduces Score' },
    Neutral: { color: theme.palette.text.secondary, icon: <TrendingFlat sx={{ fontSize: 15 }} />, label: 'Neutral' },
  };

  const pos = reasons.filter(r => r.impact === 'Positive').length;
  const neg = reasons.filter(r => r.impact === 'Negative').length;

  return (
    <Box className="nb-shadow" sx={{
      bgcolor: 'background.paper', p: { xs: 3, md: 4 }, borderRadius: 0,
      border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827',
      mb: 4
    }}>
      <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 900, fontSize: '1.1rem', mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Risk & Logic Breakdown</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7, fontWeight: 600 }}>
        This score is derived from {reasons.length} weighted factors. {neg > pos ? 'Negative risk drivers outweigh strengths — caution advised.' : 'Positive compliance indicators mostly support this score.'}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {reasons.sort((a, b) => b.weight - a.weight).map((r, i) => {
          const c = config[r.impact];
          return (
            <Box key={i} sx={{
              p: 2.5, borderRadius: 0,
              border: '2px solid', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa',
              transition: 'all 0.2s', '&:hover': { transform: 'translateX(4px)', borderColor: c.color },
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ 
                    width: 32, height: 32, bgcolor: c.color, color: '#fff', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827',
                    boxShadow: `2px 2px 0px ${isDark ? '#fefefe' : '#111827'}`,
                    borderRadius: 0
                  }}>
                    {c.icon}
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 800, letterSpacing: '-0.01em' }}>{r.factor}</Typography>
                </Box>
                <Chip label={r.impact === 'Positive' ? `+${r.weight}%` : `-${r.weight}%`} size="small" 
                  sx={{ 
                    bgcolor: c.color, color: '#fff', fontWeight: 900, fontSize: '0.7rem', 
                    borderRadius: 0, height: 24, border: '1px solid', borderColor: isDark ? '#fefefe' : '#111827'
                  }} />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontWeight: 500, mb: 2 }}>
                {r.explanation}
              </Typography>

              {r.evidence_snippet && (
                <Box sx={{ 
                  mt: 1, p: 2, 
                  border: '1px solid', borderColor: 'divider',
                  bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)',
                  position: 'relative'
                }}>
                  <Typography variant="caption" sx={{ 
                    position: 'absolute', top: -10, left: 10, bgcolor: 'background.paper', 
                    px: 1, fontWeight: 900, color: 'text.secondary', fontSize: '0.6rem',
                    border: '1px solid', borderColor: 'divider'
                  }}>
                    EVIDENCE SNIPPET
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.primary', fontSize: '0.8rem', fontStyle: 'italic' }}>
                    “{r.evidence_snippet}”
                  </Typography>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>

  );
}
