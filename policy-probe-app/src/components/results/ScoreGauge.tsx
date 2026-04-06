'use client';
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: number;
  grade?: string;
  confidence?: number;
}

const getColor = (score: number): string => {
  if (score >= 85) return '#16A34A';
  if (score >= 70) return '#D97706';
  return '#DC2626';
};

export default function ScoreGauge({ score, label, size = 180, grade, confidence }: ScoreGaugeProps) {
  const theme = useTheme();
  const color = getColor(score);
  const data = [
    { value: score },
    { value: 100 - score },
  ];

  return (
    <Box sx={{ textAlign: 'center', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ position: 'relative', width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={size * 0.35}
              outerRadius={size * 0.45}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          {grade ? (
            <Typography variant="h2" sx={{ fontWeight: 800, color, lineHeight: 1 }}>{grade}</Typography>
          ) : (
            <Typography variant="h3" sx={{ fontWeight: 800, color, lineHeight: 1 }}>{score}</Typography>
          )}
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {label}
          </Typography>
        </Box>
      </Box>
      {confidence !== undefined && (
        <Box sx={{ mt: 1, px: 1, py: 0.5, border: '1px solid', borderColor: 'divider', display: 'inline-flex', alignItems: 'center', gap: 0.5, bgcolor: 'background.default' }}>
          <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.65rem' }}>AI CONFIDENCE:</Typography>
          <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.65rem', color: confidence > 85 ? 'success.main' : 'warning.main' }}>{confidence}%</Typography>
        </Box>
      )}
    </Box>
  );
}
