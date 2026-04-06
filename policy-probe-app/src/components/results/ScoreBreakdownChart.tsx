'use client';
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
import { ScoreBreakdown } from '@/lib/types';

interface Props { breakdown: ScoreBreakdown; }

const LABELS: Record<keyof ScoreBreakdown, string> = {
  data_collection: 'Data Collection', third_party_sharing: 'Third-Party', child_safety: 'Child Safety',
  transparency: 'Transparency', user_rights: 'User Rights', security: 'Security',
  retention_clarity: 'Retention', tracking_cookies: 'Tracking', ambiguity: 'Ambiguity'
};
const getColor = (v: number) => v >= 70 ? '#16A34A' : v >= 40 ? '#D97706' : '#DC2626';
const PIE_COLORS = ['#005ac2', '#5f5c78', '#16A34A', '#D97706', '#DC2626', '#3B82F6', '#EC4899', '#6366F1', '#8B5CF6'];

export default function ScoreBreakdownChart({ breakdown }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const radarData = Object.entries(breakdown).map(([k, v]) => ({ subject: LABELS[k as keyof ScoreBreakdown], score: v, fullMark: 100 }));
  const barData = Object.entries(breakdown).map(([k, v]) => ({ name: LABELS[k as keyof ScoreBreakdown], score: v }));
  const pieData = Object.entries(breakdown).map(([k, v]) => ({ name: LABELS[k as keyof ScoreBreakdown], value: v }));

  const cardSx = {
    bgcolor: 'background.paper', p: 3, borderRadius: 4, boxShadow: '0px 4px 40px rgba(0,0,0,0.03)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(171,179,183,0.05)'}`,
  };
  const tooltipStyle = { backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 12, fontSize: 12 };
  const textFill = theme.palette.text.secondary;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={cardSx}>
        <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 700, fontSize: '0.95rem', mb: 2 }}>Score Radar</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: textFill }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: textFill }} />
            <Radar name="Score" dataKey="score" stroke={theme.palette.primary.main} fill={theme.palette.primary.main} fillOpacity={0.15} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={cardSx}>
        <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 700, fontSize: '0.95rem', mb: 2 }}>Category Scores</Typography>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: textFill }} />
            <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 10, fill: textFill }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={16}>
              {barData.map((e, i) => <Cell key={i} fill={getColor(e.score)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={cardSx}>
        <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 700, fontSize: '0.95rem', mb: 2 }}>Risk Distribution</Typography>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={95} innerRadius={50} dataKey="value" stroke={theme.palette.background.paper} strokeWidth={3} fillOpacity={0.75}>
              {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11, color: textFill, paddingTop: 10 }} />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
