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
    // Persistent History from localStorage
    const stored = localStorage.getItem('probe_history');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      } catch (e) {
        setHistory([]);
      }
    }
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem('probe_history');
    setHistory([]);
  };

  const handleViewDetails = (item: AnalysisResult) => {
    sessionStorage.setItem('analysis-result', JSON.stringify(item));
    router.push('/results?source=live');
  };

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, minHeight: '80vh', bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="h3" sx={{ fontFamily: '"Manrope"', fontWeight: 900, letterSpacing: '-0.04em', textTransform: 'uppercase' }}>Analysis History</Typography>
            {history.length > 0 && (
              <Button size="small" variant="outlined" onClick={handleClearHistory} sx={{ fontWeight: 800, borderRadius: 0, color: 'error.main', borderColor: theme.palette.divider, '&:hover': { borderColor: 'error.main' } }}>
                Clear All
              </Button>
            )}
          </Box>
          <Typography color="text.secondary" sx={{ mb: 6, fontWeight: 600 }}>Your forensic audit history from this device.</Typography>
        </motion.div>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {history.length > 0 && history.map((item, i) => (
            <motion.div key={i} initial="hidden" animate="visible" variants={fadeUp} custom={i + 1}>
              <Box
                onClick={() => handleViewDetails(item)}
                className="nb-shadow"
                sx={{
                  bgcolor: 'background.paper', p: 3, borderRadius: 0, cursor: 'pointer',
                  border: `3px solid ${isDark ? '#fefefe' : '#111827'}`,
                  transition: 'transform 0.1s', '&:active': { transform: 'translate(2px, 2px)' },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                     <Box sx={{ 
                       width: 48, height: 48, borderRadius: 0, border: '2px solid', borderColor: 'primary.main',
                       display: 'flex', alignItems: 'center', justifyContent: 'center', 
                       bgcolor: isDark ? 'rgba(77,142,255,0.1)' : '#d8e2ff' 
                     }}>
                      <Assessment sx={{ color: 'primary.main', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 900, mb: 0.5, textTransform: 'uppercase', fontSize: '1.1rem' }}>{item.app_name}</Typography>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary' }}>Score: {item.overall_score}/100</Typography>
                        <Chip label={`${item.risk_level} Risk`} size="small" 
                          sx={{ 
                            fontSize: '0.65rem', fontWeight: 900, borderRadius: 0, bgcolor: `${riskColors[item.risk_level]}.main`, color: '#fff',
                            border: '1px solid #000'
                          }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{new Date(item.analyzed_at).toLocaleDateString()}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <IconButton size="small" sx={{ color: 'text.primary', border: '2px solid transparent', '&:hover': { border: '2px solid', borderColor: isDark ? '#fff' : '#000', borderRadius: 0 } }}>
                    <Visibility fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>

        {history.length === 0 && (
          <Box className="nb-shadow" sx={{ bgcolor: 'background.paper', p: 8, textAlign: 'center', borderRadius: 0, border: `3px solid ${isDark ? '#fefefe' : '#111827'}` }}>
            <Assessment sx={{ fontSize: 64, color: 'text.secondary', mb: 3 }} />
            <Typography variant="h5" sx={{ fontFamily: '"Manrope"', fontWeight: 900, mb: 2, textTransform: 'uppercase' }}>No forensic data yet</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 600, maxWidth: 300, mx: 'auto' }}>Start your first analysis to see your audit history here.</Typography>
            <Button 
              variant="contained" 
              onClick={() => router.push('/analyze')} 
              endIcon={<ArrowForward />}
              sx={{ 
                borderRadius: 0, py: 1.5, px: 4, fontWeight: 900, textTransform: 'uppercase', fontSize: '0.9rem',
                border: '3px solid #000', bgcolor: 'primary.main', color: '#fff',
                boxShadow: isDark ? '4px 4px 0px #fff' : '4px 4px 0px #000',
                '&:hover': { bgcolor: 'primary.dark', transform: 'translate(-2px, -2px)' }
              }}
            >
              Analyze Now
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

