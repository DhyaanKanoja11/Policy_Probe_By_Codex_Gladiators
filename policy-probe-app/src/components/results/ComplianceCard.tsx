'use client';
import React from 'react';
import { Box, Typography, useTheme, Chip } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
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
    <Box sx={{
      bgcolor: 'background.paper', p: { xs: 3, md: 4 }, borderRadius: 0,
      border: '2px solid', borderColor: isDark ? 'text.primary' : '#000',
      boxShadow: isDark ? '4px 4px 0px #fff' : '4px 4px 0px #000',
      mb: 4
    }}>
      <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 800, fontSize: '1.2rem', mb: 1 }}>India & Global Compliance</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        India-first automated mapping of privacy policy clauses against the DPDP Act and global frameworks.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {rows.map((row) => (
          <Box key={row.key} sx={{
            p: 2, border: '2px solid', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa',
            display: 'flex', flexDirection: 'column', gap: 1.5
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>{row.label}</Typography>
                <Typography variant="caption" color="text.secondary">{row.desc}</Typography>
              </Box>
              {row.data?.compliant ? (
                <Chip icon={<CheckCircle sx={{ fontSize: 16 }} />} label="Compliant" size="small"
                  sx={{ borderRadius: 0, border: '1px solid', borderColor: 'success.main', bgcolor: 'success.main', color: '#fff', fontWeight: 800 }} />
              ) : (
                <Chip icon={<Cancel sx={{ fontSize: 16 }} />} label="At Risk" size="small"
                  sx={{ borderRadius: 0, border: '1px solid', borderColor: 'error.main', bgcolor: 'error.main', color: '#fff', fontWeight: 800 }} />
              )}
            </Box>

            {!row.data?.compliant && row.data?.missing_requirements && row.data.missing_requirements.length > 0 && (
              <Box sx={{ mt: 1, p: 1.5, bgcolor: isDark ? 'rgba(225,29,72,0.1)' : 'rgba(225,29,72,0.05)', borderLeft: '2px solid', borderColor: 'error.main' }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'error.main', display: 'block', mb: 0.5 }}>MISSING REQUIREMENTS:</Typography>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {row.data.missing_requirements.map((req, i) => (
                    <li key={i}>
                      <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 600 }}>{req}</Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}
            {row.data?.compliant && (
              <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>✓ Found sufficient protective clauses mapping to this framework.</Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
