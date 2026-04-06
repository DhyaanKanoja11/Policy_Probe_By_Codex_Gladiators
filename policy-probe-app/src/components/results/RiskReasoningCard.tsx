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
    <Box sx={{
      bgcolor: 'background.paper', p: { xs: 3, md: 4 }, borderRadius: 4,
      boxShadow: '0px 4px 40px rgba(0,0,0,0.03)',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(171,179,183,0.05)'}`,
    }}>
      <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 700, fontSize: '0.95rem', mb: 0.5 }}>Why This Score?</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7, fontSize: '0.82rem' }}>
        Score of <strong>{overallScore}/100</strong> from {reasons.length} weighted factors. {neg > pos ? 'More concerns than strengths — review recommended.' : 'More positive factors support this score.'}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {reasons.sort((a, b) => b.weight - a.weight).map((r, i) => {
          const c = config[r.impact];
          return (
            <Box key={i} sx={{
              p: 2, borderRadius: 3,
              bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8f9fa',
              transition: 'background 0.2s', '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f1f4f6' },
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: c.color, display: 'flex' }}>{c.icon}</Box>
                  <Typography variant="body2" fontWeight={600}>{r.factor}</Typography>
                </Box>
                <Chip label={c.label} size="small" sx={{ bgcolor: `${c.color}12`, color: c.color, fontWeight: 600, fontSize: '0.62rem', height: 22, borderRadius: 100 }} />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: '0.75rem', display: 'block', mb: 1 }}>{r.explanation}</Typography>
              {r.evidence_snippet && (
                <Box sx={{ mt: 1, mb: 2, p: 1.5, borderLeft: '3px solid', borderColor: c.color, bgcolor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', display: 'block', fontStyle: 'italic' }}>
                    {r.evidence_snippet}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.65rem', minWidth: 60 }}>Weight: {r.weight}%</Typography>
                <LinearProgress variant="determinate" value={r.weight * 5}
                  sx={{ flex: 1, height: 3, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', '& .MuiLinearProgress-bar': { bgcolor: c.color, borderRadius: 2 } }} />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
