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
    bgcolor: 'background.paper', p: 3, borderRadius: 0, boxShadow: '8px 8px 0px rgba(0,0,0,1)',
    border: `4px solid #000`,
  };
  const tooltipStyle = { 
    backgroundColor: theme.palette.background.paper, 
    border: `3px solid #000`, 
    borderRadius: 0, 
    fontSize: 12,
    fontWeight: 800,
    boxShadow: '4px 4px 0px rgba(0,0,0,0.1)'
  };
  const textFill = theme.palette.text.primary;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={cardSx}>
        <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 900, fontSize: '1.2rem', mb: 3, textTransform: 'uppercase' }}>
          Final Score Radar
        </Typography>
        <ResponsiveContainer width="100%" height={380}>
          <RadarChart data={radarData} margin={{ top: 30, right: 40, bottom: 30, left: 40 }}>
            <PolarGrid stroke={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'} strokeWidth={2} />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: textFill, fontWeight: 800 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar 
              name="Audit Score" 
              dataKey="score" 
              stroke={theme.palette.primary.main} 
              fill={theme.palette.primary.main} 
              fillOpacity={0.4} 
              strokeWidth={4}
              dot={{ r: 5, fill: '#000', stroke: theme.palette.primary.main, strokeWidth: 3 }}
            />
            <Tooltip contentStyle={tooltipStyle} />
          </RadarChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={cardSx}>
        <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 900, fontSize: '1.2rem', mb: 3, textTransform: 'uppercase' }}>
          Diagnostic Category Scores
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 30 }}>
            <CartesianGrid strokeDasharray="0" stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11, fill: textFill, fontWeight: 700 }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={tooltipStyle} />
            <Bar dataKey="score" radius={[0, 0, 0, 0]} barSize={20} stroke="#000" strokeWidth={2}>
              {barData.map((e, i) => <Cell key={i} fill={getColor(e.score)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={cardSx}>
        <Typography sx={{ fontFamily: '"Manrope"', fontWeight: 900, fontSize: '1.2rem', mb: 3, textTransform: 'uppercase' }}>
          Privacy Risk Distribution
        </Typography>
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
