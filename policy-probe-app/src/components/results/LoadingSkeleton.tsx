'use client';
import React from 'react';
import { Box, Container, Grid, useTheme } from '@mui/material';

function SkeletonBlock({ width = '100%', height = 20, mb = 1 }: { width?: string | number; height?: number; mb?: number }) {
  return <Box className="skeleton" sx={{ width, height, mb, borderRadius: 1 }} />;
}

export default function LoadingSkeleton() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        {/* Top bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <SkeletonBlock width={120} height={36} />
          <SkeletonBlock width={140} height={36} />
        </Box>

        {/* Score overview */}
        <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 4, mb: 3, boxShadow: '0 4px 40px rgba(0,0,0,0.03)' }}>
          <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
            <Box sx={{ width: 180, height: 180 }}>
              <SkeletonBlock width={180} height={180} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <SkeletonBlock width="60%" height={32} mb={2} />
              <SkeletonBlock width="40%" height={24} mb={2} />
              <SkeletonBlock width="90%" height={16} mb={1} />
              <SkeletonBlock width="70%" height={16} mb={3} />
              <Box sx={{ display: 'flex', gap: 3 }}>
                <SkeletonBlock width={60} height={40} />
                <SkeletonBlock width={60} height={40} />
                <SkeletonBlock width={60} height={40} />
                <SkeletonBlock width={60} height={40} />
              </Box>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Charts */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 4, mb: 3, boxShadow: '0 4px 40px rgba(0,0,0,0.03)' }}>
              <SkeletonBlock width="40%" height={20} mb={2} />
              <SkeletonBlock width="100%" height={280} />
            </Box>
            <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 4, boxShadow: '0 4px 40px rgba(0,0,0,0.03)' }}>
              <SkeletonBlock width="50%" height={20} mb={2} />
              <SkeletonBlock width="100%" height={250} />
            </Box>
          </Grid>
          {/* Cards */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 4, mb: 3, boxShadow: '0 4px 40px rgba(0,0,0,0.03)' }}>
              <SkeletonBlock width="35%" height={20} mb={3} />
              {[1, 2, 3, 4].map(i => (
                <Box key={i} sx={{ mb: 2, p: 2, borderRadius: 2 }}>
                  <SkeletonBlock width="50%" height={16} mb={1} />
                  <SkeletonBlock width="90%" height={14} mb={1} />
                  <SkeletonBlock width="30%" height={6} />
                </Box>
              ))}
            </Box>
            <Grid container spacing={3}>
              {[1, 2].map(i => (
                <Grid size={{ xs: 12, md: 6 }} key={i}>
                  <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 4, boxShadow: '0 4px 40px rgba(0,0,0,0.03)' }}>
                    <SkeletonBlock width="50%" height={18} mb={2} />
                    <SkeletonBlock width="100%" height={14} mb={1} />
                    <SkeletonBlock width="80%" height={14} mb={1} />
                    <SkeletonBlock width="60%" height={14} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
