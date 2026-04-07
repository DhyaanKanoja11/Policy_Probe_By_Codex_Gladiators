'use client';
import React from 'react';
import { Box, Typography, Chip, useTheme, Button } from '@mui/material';
import { Storage, Share, Warning, Error as ErrorIcon, CheckCircle, ChildCare, Recommend, Gavel, Info, Visibility } from '@mui/icons-material';
import { DataCategory, ThirdPartyEntry, RedFlag, RiskReason } from '@/lib/types';

// ... (previous cards)

export function RiskReasonsCard({ reasons }: { reasons: RiskReason[] }) {
  const isDark = useTheme().palette.mode === 'dark';
  const [expanded, setExpanded] = React.useState<number | null>(null);

  return (
    <CardWrapper>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{ 
          width: 32, height: 32, bgcolor: '#3b82f6', color: '#fff', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827',
          boxShadow: `2px 2px 0px ${isDark ? '#fefefe' : '#111827'}`,
          borderRadius: 0
        }}>
          <Info sx={{ fontSize: 18 }} />
        </Box>
        <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase' }}>Forensic Audit</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {reasons.map((r, i) => (
          <Box key={i} sx={{ borderBottom: i === reasons.length - 1 ? 'none' : '1px solid divider', pb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 900, color: r.impact === 'Negative' ? 'error.main' : r.impact === 'Positive' ? 'success.main' : 'text.primary' }}>
                {r.factor}
              </Typography>
              <Chip label={r.impact} size="small" sx={{ 
                height: 18, fontSize: '0.6rem', fontWeight: 900, borderRadius: 0,
                bgcolor: r.impact === 'Negative' ? 'error.main' : r.impact === 'Positive' ? 'success.main' : 'grey.500',
                color: '#fff', border: '1px solid #000'
              }} />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 1.5, lineHeight: 1.5 }}>
              {r.explanation}
            </Typography>
            {r.evidence_snippet && (
              <Box>
                <Button 
                  size="small" 
                  startIcon={<Visibility sx={{ fontSize: 14 }} />}
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  sx={{ 
                    fontSize: '0.65rem', fontWeight: 900, p: 0, minWidth: 0, 
                    color: 'primary.main', textTransform: 'uppercase',
                    '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                  }}
                >
                  {expanded === i ? 'Hide Evidence' : 'View Evidence'}
                </Button>
                {expanded === i && (
                  <Box sx={{ 
                    mt: 1.5, p: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fa', 
                    border: '2px solid #000', position: 'relative',
                    fontStyle: 'italic', fontSize: '0.75rem', lineHeight: 1.6, fontWeight: 500
                  }}>
                    <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.6rem', color: 'primary.main', mb: 0.5, display: 'block' }}>Policy Extract:</Typography>
                    "{r.evidence_snippet}"
                  </Box>
                )}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </CardWrapper>
  );
}


function CardWrapper({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Box className="nb-shadow" sx={{
      bgcolor: 'background.paper', p: 3, borderRadius: 0, height: '100%',
      border: `2px solid ${isDark ? '#fefefe' : '#111827'}`,
      transition: 'transform 0.1s', '&:active': { transform: 'translate(2px, 2px)' },
    }}>{children}</Box>
  );
}

export function DataCollectedCard({ data }: { data: DataCategory[] }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const riskColor = { Low: 'success.main', Medium: 'warning.main', High: 'error.main' } as const;
  return (
    <CardWrapper>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{ 
          width: 32, height: 32, bgcolor: 'primary.main', color: '#fff', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827',
          boxShadow: `2px 2px 0px ${isDark ? '#fefefe' : '#111827'}`,
          borderRadius: 0
        }}>
          <Storage sx={{ fontSize: 18 }} />
        </Box>
        <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase' }}>Data Collected</Typography>
      </Box>
      {data.map((cat) => (
        <Box key={cat.category} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
            <Typography variant="body2" sx={{ fontWeight: 800, letterSpacing: '-0.01em' }}>{cat.category}</Typography>
            <Chip label={cat.risk} size="small" 
              sx={{ 
                fontSize: '0.6rem', height: 20, borderRadius: 0, fontWeight: 900,
                bgcolor: riskColor[cat.risk], color: '#fff', border: '1px solid', borderColor: isDark ? '#fefefe' : '#111827'
              }} />
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {cat.items.map((item) => (
              <Chip key={item} label={item} size="small" 
                sx={{ 
                  fontSize: '0.75rem', fontWeight: 700, borderRadius: 0, 
                  bgcolor: isDark ? 'rgba(77,142,255,0.1)' : '#f1f4f6', 
                  border: '1px solid', borderColor: isDark ? '#fefefe' : '#111827'
                }} />
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{ 
          width: 32, height: 32, bgcolor: '#8b5cf6', color: '#fff', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827',
          boxShadow: `2px 2px 0px ${isDark ? '#fefefe' : '#111827'}`,
          borderRadius: 0
        }}>
          <Share sx={{ fontSize: 18 }} />
        </Box>
        <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase' }}>Sharing Partners</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {data.map((e) => (
          <Box key={e.name} sx={{ 
            p: 2, borderRadius: 0, border: '2px solid', borderColor: 'divider',
            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa',
            transition: 'all 0.15s', '&:hover': { transform: 'translateX(4px)', borderColor: riskColor[e.risk] }
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>{e.name}</Typography>
              <Box sx={{ width: 10, height: 10, bgcolor: riskColor[e.risk], border: '1px solid', borderColor: isDark ? '#fff' : '#000' }} />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{e.purpose}</Typography>
          </Box>
        ))}
      </Box>
    </CardWrapper>
  );
}

export function RedFlagsCard({ flags }: { flags: RedFlag[] }) {
  const isDark = useTheme().palette.mode === 'dark';
  return (
    <CardWrapper>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{ 
          width: 32, height: 32, bgcolor: 'error.main', color: '#fff', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827',
          boxShadow: `2px 2px 0px ${isDark ? '#fefefe' : '#111827'}`,
          borderRadius: 0
        }}>
          <Warning sx={{ fontSize: 18 }} />
        </Box>
        <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase' }}>Critical Concerns</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {flags.map((f, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{ color: f.severity === 'Critical' ? 'error.main' : 'warning.main', mt: 0.2 }}>
              {f.severity === 'Critical' ? <ErrorIcon /> : <Warning />}
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 800, mb: 0.5 }}>{f.title}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6, fontWeight: 500, display: 'block' }}>{f.description}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </CardWrapper>
  );
}

export function StrengthsCard({ strengths }: { strengths: string[] }) {
  const isDark = useTheme().palette.mode === 'dark';
  return (
    <CardWrapper>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{ 
          width: 32, height: 32, bgcolor: 'success.main', color: '#fff', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827',
          boxShadow: `2px 2px 0px ${isDark ? '#fefefe' : '#111827'}`,
          borderRadius: 0
        }}>
          <CheckCircle sx={{ fontSize: 18 }} />
        </Box>
        <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase' }}>Protective Strengths</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {strengths.map((s, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <CheckCircle sx={{ color: 'success.main', fontSize: 18, mt: 0.1 }} />
            <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6, fontWeight: 600 }}>{s}</Typography>
          </Box>
        ))}
      </Box>
    </CardWrapper>
  );
}

export function ChildSafetyCard({ flags }: { flags: string[] }) {
  const isDark = useTheme().palette.mode === 'dark';
  return (
    <CardWrapper>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{ 
          width: 32, height: 32, bgcolor: '#ec4899', color: '#fff', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827',
          boxShadow: `2px 2px 0px ${isDark ? '#fefefe' : '#111827'}`,
          borderRadius: 0
        }}>
          <ChildCare sx={{ fontSize: 18 }} />
        </Box>
        <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase' }}>Student Protections</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {flags.map((f, i) => (
          <Box key={i} sx={{ 
            p: 1.5, bgcolor: isDark ? 'rgba(236,72,153,0.05)' : 'rgba(236,72,153,0.03)',
            borderLeft: '4px solid', borderColor: '#ec4899'
          }}>
            <Typography variant="body2" sx={{ lineHeight: 1.7, fontWeight: 600 }}>{f}</Typography>
          </Box>
        ))}
      </Box>
    </CardWrapper>
  );
}

export function SummaryCard({ summary, recommendations }: { summary: string; recommendations: string[] }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Box className="nb-shadow" sx={{
      bgcolor: 'background.paper', p: { xs: 3, md: 4 }, borderRadius: 0,
      border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{ 
          width: 32, height: 32, bgcolor: 'primary.main', color: '#fff', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827',
          boxShadow: `2px 2px 0px ${isDark ? '#fefefe' : '#111827'}`,
          borderRadius: 0
        }}>
          <Recommend sx={{ fontSize: 18 }} />
        </Box>
        <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase' }}>Executive Summary</Typography>
      </Box>
      <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, fontWeight: 600 }}>{summary}</Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{ 
          width: 32, height: 32, bgcolor: 'warning.main', color: '#fff', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827',
          boxShadow: `2px 2px 0px ${isDark ? '#fefefe' : '#111827'}`,
          borderRadius: 0
        }}>
          <Gavel sx={{ fontSize: 18 }} />
        </Box>
        <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase' }}>Actionable Recommendations</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {recommendations.map((r, i) => (
          <Box key={i} sx={{ 
            display: 'flex', gap: 2, alignItems: 'flex-start',
            p: 2, border: '2px solid', borderColor: 'divider',
            bgcolor: isDark ? 'rgba(255,158,11,0.03)' : 'rgba(255,158,11,0.02)'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 900, color: 'warning.main', minWidth: 24 }}>{i + 1}</Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.7, fontWeight: 700 }}>{r}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

