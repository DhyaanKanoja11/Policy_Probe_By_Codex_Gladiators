'use client';
import React from 'react';
import { Box, Typography, Chip, useTheme } from '@mui/material';
import { AnalysisResult } from '@/lib/types';
import ScoreGauge from './ScoreGauge';
import { Warning, CheckCircle, Error as ErrorIcon } from '@mui/icons-material';

interface RiskOverviewProps { result: AnalysisResult; }

export default function RiskOverview({ result }: RiskOverviewProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const riskColors = { Low: theme.palette.success.main, Medium: theme.palette.warning.main, High: theme.palette.error.main };
  const riskIcons = { Low: <CheckCircle sx={{ fontSize: 16 }} />, Medium: <Warning sx={{ fontSize: 16 }} />, High: <ErrorIcon sx={{ fontSize: 16 }} /> };

  const stats = [
    { label: 'Readability', value: result.readability_score },
    { label: 'Transparency', value: result.transparency_score },
    { label: 'Red Flags', value: result.red_flags.length, isCount: true },
    { label: 'Strengths', value: result.strengths.length, isCount: true },
  ];

  return (
    <Box sx={{
      bgcolor: 'background.paper', p: { xs: 3, md: 4 }, borderRadius: 4,
      boxShadow: '0px 4px 40px rgba(0,0,0,0.03)',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(171,179,183,0.05)'}`,
    }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <ScoreGauge score={result.overall_score} label="Risk Score" size={200} grade={result.privacy_grade} confidence={result.confidence_score} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
            <Typography variant="h4" sx={{ fontFamily: '"Manrope"', fontWeight: 800, letterSpacing: '-0.02em' }}>{result.app_name}</Typography>
            <Chip icon={riskIcons[result.risk_level]} label={`${result.risk_level} Risk`}
              sx={{ bgcolor: `${riskColors[result.risk_level]}15`, color: riskColors[result.risk_level], fontWeight: 700, fontSize: '0.75rem', borderRadius: 100, height: 28 }} />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7, maxWidth: 500 }}>
            {result.summary_plain_english.substring(0, 200)}...
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {stats.map((s) => (
              <Box key={s.label} sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 700, fontSize: '1.5rem', color: s.isCount ? 'text.primary' : (s.value as number) >= 60 ? 'success.main' : 'warning.main' }}>
                  {s.isCount ? s.value : `${s.value}%`}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.6rem' }}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
