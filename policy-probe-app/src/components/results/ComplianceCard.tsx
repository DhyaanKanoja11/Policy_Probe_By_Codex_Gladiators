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
      bgcolor: 'background.paper', p: { xs: 3, md: 5 }, borderRadius: 0,
      border: '4px solid #000',
      mb: 4, position: 'relative',
      boxShadow: '10px 10px 0px rgba(0,0,0,1)'
    }}>
      <Box sx={{ 
        position: 'absolute', top: -14, right: 30, bgcolor: 'success.main', 
        color: '#fff', px: 2, py: 0.75, border: '3px solid #000', fontWeight: 900, fontSize: '0.8rem',
        textTransform: 'uppercase', letterSpacing: '0.1em', zIndex: 10
      }}>
        India-First Audit
      </Box>
      <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 900, fontSize: '1.5rem', mb: 1, textTransform: 'uppercase', color: 'primary.main' }}>Regulatory Compliance Matrix</Typography>
      <Typography variant="body2" sx={{ mb: 5, fontWeight: 700, color: 'text.secondary', maxWidth: '90%' }}>
        PolicyProbe maps extracted clauses directly to the <span style={{ color: isDark ? '#4d8eff' : '#005ac2', fontWeight: 900 }}>DPDP Act 2023</span> and major global frameworks with S-Grade forensic precision.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        {rows.map((row) => (
          <Box key={row.key} sx={{
            p: 3, border: '3px solid #000',
            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
            display: 'flex', flexDirection: 'column', gap: 2,
            transition: 'all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
            '&:hover': { transform: 'translate(-4px, -4px)', boxShadow: '4px 4px 0px #000' }
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5 }}>
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: '1.15rem', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>{row.label}</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.8, color: 'text.secondary' }}>{row.desc}</Typography>
              </Box>
              {row.data?.compliant ? (
                <Chip icon={<CheckCircle sx={{ fontSize: 16, color: '#fff !important' }} />} label="PASSED" size="small"
                  sx={{ borderRadius: 0, border: '2px solid #000', bgcolor: 'success.main', color: '#fff', fontWeight: 900, px: 1 }} />
              ) : (
                <Chip icon={<Cancel sx={{ fontSize: 16, color: '#fff !important' }} />} label="GAPS FOUND" size="small"
                  sx={{ borderRadius: 0, border: '2px solid #000', bgcolor: 'error.main', color: '#fff', fontWeight: 900, px: 1 }} />
              )}
            </Box>

            {!row.data?.compliant && row.data?.missing_requirements && row.data.missing_requirements.length > 0 && (
              <Box sx={{ 
                mt: 1, p: 2, 
                bgcolor: isDark ? 'rgba(225,29,72,0.1)' : 'rgba(225,29,72,0.05)', 
                border: '2px solid', borderColor: 'error.main' 
              }}>
                <Typography variant="caption" sx={{ fontWeight: 900, color: 'error.main', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <TrendingDown sx={{ fontSize: 16 }} />
                  DPDP GAPS IDENTIFIED:
                </Typography>
                <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                  {row.data.missing_requirements.map((req, i) => (
                    <Box component="li" key={i} sx={{ mb: 1, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Box sx={{ minWidth: 6, height: 6, borderRadius: 0, bgcolor: 'error.main', mt: 0.75 }} />
                      <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 800, lineHeight: 1.4 }}>{req}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            {row.data?.compliant && (
              <Box sx={{ mt: 1, p: 2, bgcolor: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.05)', border: '2px solid', borderColor: 'success.main' }}>
                <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1, textTransform: 'uppercase' }}>
                  <CheckCircle sx={{ fontSize: 18 }} /> Certified Compliance Shield Active
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>

  );
}
