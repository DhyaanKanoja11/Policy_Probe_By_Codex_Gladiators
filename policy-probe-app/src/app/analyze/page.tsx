'use client';
import React, { useState } from 'react';
import {
  Box, Container, Typography, TextField, Button, Card, useTheme,
  CircularProgress, Alert, LinearProgress, Switch, FormControlLabel
} from '@mui/material';
import { Search, Link as LinkIcon, Description, TextSnippet, ArrowForward, Lock } from '@mui/icons-material';
import { motion, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import LoadingSkeleton from '@/components/results/LoadingSkeleton';

type InputMode = 'name' | 'url' | 'policy' | 'text';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const inputModes = [
  { value: 'name' as InputMode, label: 'App Name', shortLabel: 'App', icon: <Search fontSize="small" /> },
  { value: 'url' as InputMode, label: 'Website URL', shortLabel: 'URL', icon: <LinkIcon fontSize="small" /> },
  { value: 'policy' as InputMode, label: 'Policy URL', shortLabel: 'Policy', icon: <Description fontSize="small" /> },
  { value: 'text' as InputMode, label: 'Paste Text', shortLabel: 'Text', icon: <TextSnippet fontSize="small" /> },
];

const placeholders: Record<InputMode, string> = {
  name: 'e.g. Google Classroom, Khan Academy, Duolingo...',
  url: 'e.g. https://classroom.google.com',
  policy: 'e.g. https://policies.google.com/privacy',
  text: 'Paste the full privacy policy text here...',
};

export default function AnalyzePage() {
  const theme = useTheme();
  const router = useRouter();
  const isDark = theme.palette.mode === 'dark';
  const [mode, setMode] = useState<InputMode>('name');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deepAudit, setDeepAudit] = useState(false);

  const handleAnalyze = async () => {
    if (!value.trim()) return;
    setLoading(true);
    setError('');

    try {
      const body: Record<string, any> = {};
      if (mode === 'name') body.appName = value;
      else if (mode === 'url') body.url = value;
      else if (mode === 'policy') body.policyUrl = value;
      else body.rawText = value;
      
      body.deepAudit = deepAudit;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Analysis failed');
      }

      const result = await res.json();
      
      // PERSISTENT HISTORY logic
      const historyStr = localStorage.getItem('probe_history') || '[]';
      const history = JSON.parse(historyStr);
      // Add to front of list, limit to last 20
      const newHistory = [result, ...history].slice(0, 20);
      localStorage.setItem('probe_history', JSON.stringify(newHistory));

      if (deepAudit) {
        sessionStorage.setItem('deep-audit-requested', 'true');
      } else {
        sessionStorage.removeItem('deep-audit-requested');
      }
      
      sessionStorage.setItem('analysis-result', JSON.stringify(result));
      router.push('/results?source=live');
    } catch (err: unknown) {
      setError(err instanceof Error && err.message ? err.message : 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, minHeight: '80vh', bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <Typography variant="h3" align="center" sx={{ fontFamily: '"Manrope"', fontWeight: 900, mb: 1.5, letterSpacing: '-0.04em', textTransform: 'uppercase', fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
            Forensic Analyzer
          </Typography>
          <Typography align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 480, mx: 'auto', lineHeight: 1.7, fontWeight: 600 }}>
            Submit an app name, website URL, or policy text for a detailed privacy breakdown.
          </Typography>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box className="nb-shadow" sx={{
            bgcolor: 'background.paper', p: { xs: 3, md: 5 }, borderRadius: 0,
            border: `3px solid ${isDark ? '#fefefe' : '#111827'}`,
          }}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
                gap: 1.5,
              }}>
                {inputModes.map((m) => (
                  <Box
                    key={m.value}
                    onClick={() => { setMode(m.value); setValue(''); setError(''); }}
                    sx={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                      px: { xs: 1, sm: 2 }, py: 1.5,
                      borderRadius: 0, cursor: 'pointer', fontWeight: 900,
                      fontSize: { xs: '0.75rem', sm: '0.85rem' },
                      textTransform: 'uppercase',
                      transition: 'all 0.1s',
                      color: mode === m.value ? '#fff' : 'text.primary',
                      bgcolor: mode === m.value ? 'primary.main' : (isDark ? 'rgba(255,255,255,0.03)' : '#f1f4f6'),
                      border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827',
                      boxShadow: mode === m.value ? `2px 2px 0px ${isDark ? '#fefefe' : '#111827'}` : 'none',
                      '&:hover': { transform: mode === m.value ? 'none' : 'translate(-1px, -1px)', boxShadow: mode === m.value ? `2px 2px 0px ${isDark ? '#fefefe' : '#111827'}` : `2px 2px 0px ${isDark ? '#fefefe' : '#111827'}` },
                      userSelect: 'none',
                    }}
                  >
                    {m.icon}
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{m.label}</Box>
                    <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>{m.shortLabel}</Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {mode === 'text' ? (
              <TextField fullWidth multiline rows={8} placeholder={placeholders[mode]} value={value} onChange={(e) => setValue(e.target.value)} variant="outlined"
                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 0, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827', '& fieldset': { border: 'none' } } }} />
            ) : (
              <TextField fullWidth placeholder={placeholders[mode]} value={value} onChange={(e) => setValue(e.target.value)} variant="outlined"
                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 0, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', py: 0.5, border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827', '& fieldset': { border: 'none' } } }}
                InputProps={{ sx: { fontSize: '1rem', fontWeight: 600 } }} />
            )}

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 0, border: '2px solid #000', fontWeight: 700 }}>{error}</Alert>}

            <Box sx={{ mb: 4, p: 2, borderRadius: 0, bgcolor: isDark ? 'rgba(77,142,255,0.04)' : '#f8f9fa', border: `2px solid ${isDark ? '#fff' : '#000'}` }}>
              <FormControlLabel
                control={<Switch checked={deepAudit} onChange={(e) => setDeepAudit(e.target.checked)} color="primary" size="small" />}
                label={
                  <Box>
                    <Typography sx={{ fontWeight: 900, fontSize: { xs: '0.85rem', sm: '0.95rem' }, color: deepAudit ? 'primary.main' : 'text.primary', textTransform: 'uppercase' }}>Deep Audit Protocol</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>Enable behavioral forensics & hidden tracker scanning.</Typography>
                  </Box>
                }
              />
            </Box>

            <Button fullWidth variant="contained" size="large" disabled={!value.trim() || loading} onClick={handleAnalyze}
              endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ArrowForward />}
              sx={{
                py: 2, fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', borderRadius: 0, border: '3px solid', borderColor: isDark ? '#fefefe' : '#111827',
                bgcolor: 'primary.main', color: '#fff',
                boxShadow: isDark ? '4px 4px 0px #fff' : '4px 4px 0px #111827',
                '&:hover': { bgcolor: 'primary.dark', transform: 'translate(-2px, -2px)' }, '&:active': { transform: 'translate(1px, 1px)', boxShadow: '1px 1px 0px #000' },
                '&:disabled': { opacity: 0.5 }, transition: 'all 0.15s',
              }}
            >
              {loading ? 'Initializing Analysis...' : 'Commence Analysis'}
            </Button>
            {loading && <LinearProgress sx={{ mt: 3, height: 4, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }} />}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 5, p: 2.5, bgcolor: isDark ? 'rgba(74,222,128,0.1)' : 'rgba(22,163,74,0.08)', border: `3px solid ${isDark ? '#4ade80' : '#16a34a'}` }}>
              <Lock sx={{ color: isDark ? '#4ade80' : '#16a34a', fontSize: 24 }} />
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: '0.95rem', color: isDark ? '#4ade80' : '#16a34a', textTransform: 'uppercase' }}>Secure Forensic Processing</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', mt: 0.25, lineHeight: 1.5 }}>
                  Stateless execution. Your data is purged immediately after the session resolves.
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

