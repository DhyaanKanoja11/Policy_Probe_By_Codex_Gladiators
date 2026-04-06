'use client';
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Chip, useTheme, IconButton } from '@mui/material';
import { Visibility, Assessment, ArrowForward } from '@mui/icons-material';
import { motion, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AnalysisResult } from '@/lib/types';

const fadeUp: Variants = { hidden: { opacity: 0, y: 16 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }) };

export default function HistoryPage() {
  const theme = useTheme();
  const router = useRouter();
  const isDark = theme.palette.mode === 'dark';
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const riskColors = { Low: 'success', Medium: 'warning', High: 'error' } as const;

  useEffect(() => {
    // In our Ephemeral Architecture, history is only stored loosely in current active session if at all.
    const stored = sessionStorage.getItem('analysis-result');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory([parsed]);
      } catch (e) {
        setHistory([]);
      }
    }
  }, []);

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, minHeight: '80vh' }}>
      <Container maxWidth="md">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <Typography variant="h3" sx={{ fontFamily: '"Manrope"', fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>Analysis History</Typography>
          <Typography color="text.secondary" sx={{ mb: 5 }}>View your previous privacy policy analyses (Ephemeral Session)</Typography>
        </motion.div>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {history.length > 0 && history.map((item, i) => (
            <motion.div key={i} initial="hidden" animate="visible" variants={fadeUp} custom={i + 1}>
              <Box
                onClick={() => router.push(`/results?source=live`)}
                sx={{
                  bgcolor: 'background.paper', p: 3, borderRadius: 4, cursor: 'pointer',
                  boxShadow: '0px 4px 40px rgba(0,0,0,0.02)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(171,179,183,0.05)'}`,
                  transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0px 8px 40px rgba(0,0,0,0.06)' },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                     <Box sx={{ width: 44, height: 44, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: isDark ? 'rgba(77,142,255,0.1)' : '#d8e2ff' }}>
                      <Assessment sx={{ color: 'primary.main', fontSize: 22 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 700, mb: 0.25 }}>{item.app_name}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: '"Manrope"', fontWeight: 600 }}>Score: {item.overall_score}/100</Typography>
                        <Chip label={`${item.risk_level} Risk`} size="small" color={riskColors[item.risk_level]} variant="outlined" sx={{ fontSize: '0.6rem', height: 20, borderRadius: 100 }} />
                        <Typography variant="caption" color="text.secondary">{new Date(item.analyzed_at).toLocaleDateString()}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <IconButton size="small" sx={{ color: 'text.secondary' }}><Visibility fontSize="small" /></IconButton>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>

        {history.length === 0 && (
          <Box sx={{ bgcolor: 'background.paper', p: 8, textAlign: 'center', borderRadius: 4, boxShadow: '0px 4px 40px rgba(0,0,0,0.03)' }}>
            <Assessment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 700, mb: 1 }}>No analyses yet</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Start by analyzing your first privacy policy.</Typography>
            <Button variant="contained" onClick={() => router.push('/analyze')} endIcon={<ArrowForward />}
              sx={{ borderRadius: 3, background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})` }}>
              Analyze Now
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}
