'use client';
import React, { useState } from 'react';
import {
  Box, Container, Typography, TextField, Button, Card, useTheme,
  ToggleButton, ToggleButtonGroup, CircularProgress, Alert, LinearProgress, Switch, FormControlLabel
} from '@mui/material';
import { Search, Link as LinkIcon, Description, TextSnippet, ArrowForward, Lock } from '@mui/icons-material';
import { motion, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';

type InputMode = 'name' | 'url' | 'policy' | 'text';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const inputModes = [
  { value: 'name' as InputMode, label: 'App Name', icon: <Search fontSize="small" /> },
  { value: 'url' as InputMode, label: 'Website URL', icon: <LinkIcon fontSize="small" /> },
  { value: 'policy' as InputMode, label: 'Policy URL', icon: <Description fontSize="small" /> },
  { value: 'text' as InputMode, label: 'Paste Text', icon: <TextSnippet fontSize="small" /> },
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
      const body: Record<string, string> = {};
      if (mode === 'name') body.appName = value;
      else if (mode === 'url') body.url = value;
      else if (mode === 'policy') body.policyUrl = value;
      else body.rawText = value;

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
      if (deepAudit) {
        // Indicate to results page that deep audit was requested
        sessionStorage.setItem('deep-audit-requested', 'true');
      } else {
        sessionStorage.removeItem('deep-audit-requested');
      }
      // Store result in sessionStorage for the results page
      sessionStorage.setItem('analysis-result', JSON.stringify(result));
      router.push('/results?source=live');
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, minHeight: '80vh' }}>
      <Container maxWidth="md">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <Typography variant="h3" align="center" sx={{ fontWeight: 800, mb: 1.5, letterSpacing: '-0.02em', fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
            Analyze a Privacy Policy
          </Typography>
          <Typography align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 480, mx: 'auto', lineHeight: 1.7 }}>
            Enter an app name, website URL, privacy policy link, or paste the policy text directly.
          </Typography>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Box sx={{
            bgcolor: 'background.paper', p: { xs: 3, md: 5 }, borderRadius: 4,
            boxShadow: '0px 4px 40px rgba(0,0,0,0.04)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(171,179,183,0.1)'}`,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <ToggleButtonGroup
                value={mode} exclusive
                onChange={(_, v) => { if (v) { setMode(v); setValue(''); setError(''); } }}
                sx={{
                  '& .MuiToggleButton-root': {
                    px: 2.5, py: 1, textTransform: 'none', fontWeight: 600, fontSize: '0.82rem',
                    border: 'none', borderRadius: '12px !important', mx: 0.5,
                    color: 'text.secondary',
                    '&.Mui-selected': {
                      bgcolor: isDark ? 'rgba(77,142,255,0.12)' : '#d8e2ff',
                      color: 'primary.main',
                    },
                  },
                }}
              >
                {inputModes.map((m) => (
                  <ToggleButton key={m.value} value={m.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>{m.icon} {m.label}</Box>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>

            {mode === 'text' ? (
              <TextField fullWidth multiline rows={8} placeholder={placeholders[mode]} value={value} onChange={(e) => setValue(e.target.value)} variant="outlined"
                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f1f4f6', '& fieldset': { border: 'none' }, '&:focus-within': { boxShadow: `0 0 0 2px ${theme.palette.primary.main}20` } } }} />
            ) : (
              <TextField fullWidth placeholder={placeholders[mode]} value={value} onChange={(e) => setValue(e.target.value)} variant="outlined"
                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f1f4f6', py: 0.5, '& fieldset': { border: 'none' }, '&:focus-within': { boxShadow: `0 0 0 2px ${theme.palette.primary.main}20` } } }}
                InputProps={{ sx: { fontSize: '1rem' } }} />
            )}

            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

            <Box sx={{ mb: 3, p: 2, borderRadius: 3, bgcolor: isDark ? 'rgba(77,142,255,0.04)' : '#f8f9fa', border: `1px solid ${isDark ? 'rgba(77,142,255,0.1)' : 'rgba(0,90,194,0.1)'}` }}>
              <FormControlLabel
                control={<Switch checked={deepAudit} onChange={(e) => setDeepAudit(e.target.checked)} color="primary" />}
                label={
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: deepAudit ? 'primary.main' : 'text.primary' }}>Deep Audit (Behavioral Scan)</Typography>
                    <Typography variant="caption" color="text.secondary">Simulate scanning for hidden trackers and permission mismatches.</Typography>
                  </Box>
                }
              />
            </Box>

            <Button fullWidth variant="contained" size="large" disabled={!value.trim() || loading} onClick={handleAnalyze}
              endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ArrowForward />}
              sx={{
                py: 1.75, fontSize: '1rem', borderRadius: 0, border: '2px solid', borderColor: isDark ? 'text.primary' : '#000',
                boxShadow: isDark ? '4px 4px 0px #fff' : '4px 4px 0px #000',
                '&:hover': { transform: 'translate(-2px, -2px)' }, '&:disabled': { opacity: 0.5 }, transition: 'all 0.2s',
              }}
            >
              {loading ? 'Analyzing with AI...' : 'Start Analysis'}
            </Button>
            {loading && <LinearProgress sx={{ mt: 2, height: 3 }} />}

            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 4, p: 2, bgcolor: isDark ? 'rgba(74,222,128,0.05)' : 'rgba(22,163,74,0.05)', border: `2px solid ${isDark ? '#4ade80' : '#16a34a'}` }}>
              <Lock sx={{ color: 'success.main', fontSize: 20, mt: 0.2 }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: 'success.main' }}>Privacy-First Processing Mode</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.4 }}>
                  Your data is never stored. Analysis is strictly session-based and completely ephemeral.
                </Typography>
              </Box>
            </Box>

            <Alert severity="info" sx={{ mt: 3, borderRadius: 2, bgcolor: isDark ? 'rgba(77,142,255,0.06)' : '#d8e2ff', color: 'text.primary', '& .MuiAlert-icon': { color: 'primary.main' } }}>
              <Typography variant="body2">
                <strong>Powered by Gemini AI.</strong> Try "Google Classroom" or "Khan Academy" for instant analysis.
              </Typography>
            </Alert>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
