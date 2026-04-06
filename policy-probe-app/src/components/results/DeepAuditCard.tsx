'use client';
import React from 'react';
import { Box, Typography, Chip, useTheme, Divider } from '@mui/material';
import { Radar, BugReport, PhonelinkLock, Gavel, CompareArrows } from '@mui/icons-material';
import { DeepAuditResult } from '@/lib/types';

interface Props {
  audit: DeepAuditResult;
}

export default function DeepAuditCard({ audit }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{
      bgcolor: 'background.paper', p: { xs: 3, md: 4 }, borderRadius: 4, mb: 3,
      boxShadow: '0px 8px 40px rgba(0,90,194,0.08)',
      border: `1px solid ${isDark ? 'rgba(77,142,255,0.2)' : 'rgba(0,90,194,0.2)'}`,
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Background flair */}
      <Box sx={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, bgcolor: 'rgba(0,90,194,0.04)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Radar sx={{ color: 'primary.main', fontSize: 28 }} />
        <Box>
          <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 800, fontSize: '1.1rem', color: 'primary.main', letterSpacing: '-0.02em' }}>Deep Audit Scan</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Behavioral Engine Results</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, position: 'relative', zIndex: 1 }}>
        {/* Trackers */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <BugReport sx={{ color: 'text.secondary', fontSize: 18 }} />
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Network Trackers Detected</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {audit.trackers_found.map((t, i) => (
              <Chip key={i} label={t} size="small" sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f1f4f6', border: 'none', borderRadius: 2, fontWeight: 600, fontSize: '0.75rem', height: 26 }} />
            ))}
            {audit.trackers_found.length === 0 && <Typography variant="body2" color="text.secondary">No trackers detected.</Typography>}
          </Box>
        </Box>

        <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />

        {/* Permissions */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <PhonelinkLock sx={{ color: 'text.secondary', fontSize: 18 }} />
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Device Permissions Requested</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {audit.permissions_requested.map((p, i) => (
              <Chip key={i} label={p} size="small" variant="outlined" sx={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderRadius: 2, fontWeight: 600, fontSize: '0.75rem', height: 26 }} />
            ))}
            {audit.permissions_requested.length === 0 && <Typography variant="body2" color="text.secondary">No permissions requested.</Typography>}
          </Box>
        </Box>

        {audit.policy_mismatches.length > 0 && (
          <>
            <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
            
            {/* Mismatches */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CompareArrows sx={{ color: 'error.main', fontSize: 18 }} />
                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Policy vs. Behavior Mismatches</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {audit.policy_mismatches.map((m, i) => (
                  <Box key={i} sx={{ p: 2, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', borderLeft: `3px solid ${m.severity === 'Critical' ? theme.palette.error.main : theme.palette.warning.main}` }}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ flex: 1, minWidth: 200 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}><Gavel fontSize="small" /> Policy Claim</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>"{m.claim}"</Typography>
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 200 }}>
                        <Typography variant="caption" sx={{ color: m.severity === 'Critical' ? 'error.main' : 'warning.main', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}><Radar fontSize="small" /> Observed Behavior</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{m.observation}</Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
