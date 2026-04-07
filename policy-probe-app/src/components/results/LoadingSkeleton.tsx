'use client';
import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, useTheme, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Verified, Search, CloudDownload, TextSnippet, 
  Calculate, Assessment, HistoryEdu 
} from '@mui/icons-material';

const STEPS = [
  { icon: Verified, label: 'Validating URL safety...', color: '#3b82f6' },
  { icon: Search, label: 'Discovering privacy pages...', color: '#8b5cf6' },
  { icon: CloudDownload, label: 'Crawling legal content...', color: '#ec4899' },
  { icon: TextSnippet, label: 'Extracting key clauses...', color: '#f59e0b' },
  { icon: Calculate, label: 'Calculating privacy risk scores...', color: '#10b981' },
  { icon: Assessment, label: 'Generating India-first report...', color: '#ef4444' },
];

function SkeletonBlock({ width = '100%', height = 20, mb = 1, nb = false }: { width?: string | number; height?: number; mb?: number; nb?: boolean }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Box 
      className="skeleton" 
      sx={{ 
        width, height, mb, 
        borderRadius: 0,
        border: nb ? '2px solid' : 'none',
        borderColor: isDark ? '#fff' : '#000'
      }} 
    />
  );
}

export default function LoadingSkeleton() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 4500); // 4.5s per step for a "deliberate" feel
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ py: { xs: 4, md: 8 }, minHeight: '90vh', bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        {/* Progress Stepper Overlay */}
        <Box sx={{ 
          bgcolor: 'background.paper', p: { xs: 3, md: 5 }, 
          border: '3px solid', borderColor: isDark ? '#fff' : '#000',
          boxShadow: isDark ? '8px 8px 0px #fff' : '8px 8px 0px #000',
          position: 'relative', overflow: 'hidden',
          mb: 6
        }}>
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, bgcolor: 'divider' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}
              style={{ height: '100%', backgroundColor: theme.palette.primary.main }}
            />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 900, mb: 4, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 2 }}>
            <HistoryEdu sx={{ color: 'primary.main' }} />
            Policy Audit in Progress
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx < activeStep;
              const isActive = idx === activeStep;

              return (
                <Box key={idx} sx={{ 
                  display: 'flex', alignItems: 'center', gap: 2.5,
                  opacity: isActive ? 1 : isCompleted ? 0.6 : 0.2,
                  transition: 'opacity 0.3s'
                }}>
                  <Box sx={{ 
                    width: 40, height: 40, borderRadius: 0, 
                    border: '2px solid', borderColor: isDark ? '#fff' : '#000',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    bgcolor: isCompleted ? 'success.main' : isActive ? 'primary.main' : 'transparent',
                    color: (isCompleted || isActive) ? '#fff' : 'text.primary',
                    boxShadow: isActive ? '3px 3px 0px #000' : 'none'
                  }}>
                    {isCompleted ? <Verified fontSize="small" /> : <Icon fontSize="small" />}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ 
                      fontWeight: isActive ? 800 : 600, 
                      fontSize: '0.95rem',
                      color: isActive ? 'text.primary' : 'text.secondary'
                    }}>
                      {step.label}
                    </Typography>
                    {isActive && <LinearProgress sx={{ mt: 1, height: 2, borderRadius: 0 }} />}
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Box sx={{ mt: 6, p: 2, bgcolor: isDark ? 'rgba(77,142,255,0.05)' : 'rgba(0,90,194,0.05)', border: '2px dashed', borderColor: 'primary.main' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', display: 'block', mb: 0.5 }}>
              PROXIED SCRAPING ACTIVE
            </Typography>
            <Typography variant="caption" color="text.secondary">
              We are using multiple nodes to safely bypass website blocks and retrieve legal documents for processing.
            </Typography>
          </Box>
        </Box>

        {/* Placeholder Skeletons */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="nb-shadow" sx={{ p: 3, border: '2px solid', borderColor: isDark ? '#fff' : '#000', bgcolor: 'background.paper', height: 180 }}>
               <SkeletonBlock width="60%" height={24} mb={2} />
               <SkeletonBlock width="40%" height={16} mb={1} />
               <SkeletonBlock width="90%" height={12} />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="nb-shadow" sx={{ p: 3, border: '2px solid', borderColor: isDark ? '#fff' : '#000', bgcolor: 'background.paper', height: 180 }}>
               <SkeletonBlock width="50%" height={24} mb={2} />
               <SkeletonBlock width="70%" height={16} mb={1} />
               <SkeletonBlock width="80%" height={12} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

