'use client';
import React from 'react';
import { Box, Typography, useTheme, Chip } from '@mui/material';
import { CheckCircle, Cancel, TrendingDown } from '@mui/icons-material';
import { ComplianceFlags } from '@/lib/types';

interface ComplianceCardProps {
  flags: ComplianceFlags;
}

export default function ComplianceCard({ flags }: ComplianceCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const rows = [
    { key: 'dpdp', label: 'DPDP Act (India)', desc: 'Digital Personal Data Protection Act', data: flags.dpdp },
    { key: 'gdpr', label: 'GDPR (EU)', desc: 'General Data Protection Regulation', data: flags.gdpr },
    { key: 'coppa', label: 'COPPA (US)', desc: 'Children’s Online Privacy', data: flags.coppa },
    { key: 'ferpa', label: 'FERPA (US)', desc: 'Family Educational Rights', data: flags.ferpa },
  ];

  return (
    <Box className="nb-shadow" sx={{
      bgcolor: 'background.paper', p: { xs: 3, md: 4 }, borderRadius: 0,
      border: '3px solid', borderColor: isDark ? '#fefefe' : '#111827',
      mb: 4, position: 'relative'
    }}>
      <Box sx={{ 
        position: 'absolute', top: -12, right: 20, bgcolor: 'success.main', 
        color: '#fff', px: 1.5, py: 0.5, border: '2px solid #000', fontWeight: 900, fontSize: '0.7rem',
        textTransform: 'uppercase', letterSpacing: '0.05em'
      }}>
        India-First Audit
      </Box>
      <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 900, fontSize: '1.25rem', mb: 1, textTransform: 'uppercase' }}>Regulatory Compliance Matrix</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 600 }}>
        PolicyProbe maps extracted clauses directly to the <span style={{ color: isDark ? '#4d8eff' : '#005ac2', fontWeight: 800 }}>Digital Personal Data Protection (DPDP) Act 2023</span> and major global frameworks.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {rows.map((row) => (
          <Box key={row.key} sx={{
            p: 2.5, border: '2px solid', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa',
            display: 'flex', flexDirection: 'column', gap: 1.5,
            transition: 'all 0.1s', '&:hover': { transform: 'translateY(-2px)' }
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: '1.05rem', letterSpacing: '-0.01em' }}>{row.label}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{row.desc}</Typography>
              </Box>
              {row.data?.compliant ? (
                <Chip icon={<CheckCircle sx={{ fontSize: 16, color: '#fff !important' }} />} label="Compliant" size="small"
                  sx={{ borderRadius: 0, border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827', bgcolor: 'success.main', color: '#fff', fontWeight: 900, px: 0.5 }} />
              ) : (
                <Chip icon={<Cancel sx={{ fontSize: 16, color: '#fff !important' }} />} label="Non-Compliant" size="small"
                  sx={{ borderRadius: 0, border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827', bgcolor: 'error.main', color: '#fff', fontWeight: 900, px: 0.5 }} />
              )}
            </Box>

            {!row.data?.compliant && row.data?.missing_requirements && row.data.missing_requirements.length > 0 && (
              <Box sx={{ 
                mt: 1, p: 2, 
                bgcolor: isDark ? 'rgba(225,29,72,0.1)' : 'rgba(225,29,72,0.05)', 
                border: '1px dashed', borderColor: 'error.main' 
              }}>
                <Typography variant="caption" sx={{ fontWeight: 900, color: 'error.main', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, textTransform: 'uppercase' }}>
                  <TrendingDown sx={{ fontSize: 14 }} />
                  DPDP GAPS IDENTIFIED:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {row.data.missing_requirements.map((req, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>
                      <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 700 }}>{req}</Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}
            {row.data?.compliant && (
              <Box sx={{ mt: 1, p: 1.5, bgcolor: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.05)', border: '1px dashed', borderColor: 'success.main' }}>
                <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CheckCircle sx={{ fontSize: 14 }} /> Valid Protection Clauses Found
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>

  );
}
