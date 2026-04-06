'use client';
import React from 'react';
import { Box, Typography, Chip, useTheme } from '@mui/material';
import { Storage, Share, Warning, Error as ErrorIcon, CheckCircle, ChildCare, Recommend, Gavel } from '@mui/icons-material';
import { DataCategory, ThirdPartyEntry, RedFlag } from '@/lib/types';

function CardWrapper({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Box sx={{
      bgcolor: 'background.paper', p: 3, borderRadius: 4, height: '100%',
      boxShadow: '0px 4px 40px rgba(0,0,0,0.03)',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(171,179,183,0.05)'}`,
      transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-1px)' },
    }}>{children}</Box>
  );
}

export function DataCollectedCard({ data }: { data: DataCategory[] }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const riskColor = { Low: 'success', Medium: 'warning', High: 'error' } as const;
  return (
    <CardWrapper>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <Storage sx={{ color: 'primary.main', fontSize: 20 }} />
        <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 700, fontSize: '0.95rem' }}>Data Collected</Typography>
      </Box>
      {data.map((cat) => (
        <Box key={cat.category} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
            <Typography variant="body2" fontWeight={600}>{cat.category}</Typography>
            <Chip label={cat.risk} size="small" color={riskColor[cat.risk]} variant="outlined" sx={{ fontSize: '0.6rem', height: 20, borderRadius: 100 }} />
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {cat.items.map((item) => (
              <Chip key={item} label={item} size="small" sx={{ fontSize: '0.72rem', height: 22, bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f1f4f6', border: 'none', borderRadius: 100 }} />
            ))}
          </Box>
        </Box>
      ))}
    </CardWrapper>
  );
}

export function ThirdPartyCard({ data }: { data: ThirdPartyEntry[] }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const riskColor = { Low: 'success.main', Medium: 'warning.main', High: 'error.main' } as const;
  return (
    <CardWrapper>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <Share sx={{ color: 'primary.main', fontSize: 20 }} />
        <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 700, fontSize: '0.95rem' }}>Third-Party Sharing</Typography>
      </Box>
      {data.map((e) => (
        <Box key={e.name} sx={{ p: 2, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8f9fa', mb: 1.5, transition: 'background 0.2s', '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f1f4f6' } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="body2" fontWeight={600}>{e.name}</Typography>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: riskColor[e.risk] }} />
          </Box>
          <Typography variant="caption" color="text.secondary">{e.purpose}</Typography>
        </Box>
      ))}
    </CardWrapper>
  );
}

export function RedFlagsCard({ flags }: { flags: RedFlag[] }) {
  return (
    <CardWrapper>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <Warning sx={{ color: 'error.main', fontSize: 20 }} />
        <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 700, fontSize: '0.95rem' }}>Red Flags</Typography>
      </Box>
      {flags.map((f, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 2, alignItems: 'flex-start' }}>
          {f.severity === 'Critical' ? <ErrorIcon sx={{ color: 'error.main', fontSize: 16, mt: 0.3 }} /> : <Warning sx={{ color: 'warning.main', fontSize: 16, mt: 0.3 }} />}
          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 0.25 }}>{f.title}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: '0.72rem' }}>{f.description}</Typography>
          </Box>
        </Box>
      ))}
    </CardWrapper>
  );
}

export function StrengthsCard({ strengths }: { strengths: string[] }) {
  return (
    <CardWrapper>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
        <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 700, fontSize: '0.95rem' }}>Strengths</Typography>
      </Box>
      {strengths.map((s, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1.5, alignItems: 'flex-start' }}>
          <CheckCircle sx={{ color: 'success.main', fontSize: 14, mt: 0.4 }} />
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '0.82rem' }}>{s}</Typography>
        </Box>
      ))}
    </CardWrapper>
  );
}

export function ChildSafetyCard({ flags }: { flags: string[] }) {
  return (
    <CardWrapper>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <ChildCare sx={{ color: 'primary.main', fontSize: 20 }} />
        <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 700, fontSize: '0.95rem' }}>Child & Minor Safety</Typography>
      </Box>
      {flags.map((f, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'flex-start' }}>
          <ChildCare sx={{ fontSize: 14, mt: 0.4, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{f}</Typography>
        </Box>
      ))}
    </CardWrapper>
  );
}

export function SummaryCard({ summary, recommendations }: { summary: string; recommendations: string[] }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Box sx={{
      bgcolor: 'background.paper', p: { xs: 3, md: 4 }, borderRadius: 4,
      boxShadow: '0px 4px 40px rgba(0,0,0,0.03)',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(171,179,183,0.05)'}`,
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Recommend sx={{ color: 'primary.main', fontSize: 20 }} />
        <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 700, fontSize: '0.95rem' }}>Plain-English Summary</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8, fontSize: '0.88rem' }}>{summary}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Gavel sx={{ color: 'primary.main', fontSize: 20 }} />
        <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 700, fontSize: '0.95rem' }}>Recommendations</Typography>
      </Box>
      {recommendations.map((r, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 1, alignItems: 'flex-start' }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main', minWidth: 18 }}>{i + 1}.</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{r}</Typography>
        </Box>
      ))}
    </Box>
  );
}
