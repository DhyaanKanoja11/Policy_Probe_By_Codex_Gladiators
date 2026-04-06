'use client';
import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Grid, useTheme, CircularProgress, Alert } from '@mui/material';
import { CompareArrows, CheckCircle, Warning, ArrowForward, VerifiedUser } from '@mui/icons-material';
import { motion, Variants } from 'framer-motion';
import { AnalysisResult } from '@/lib/types';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ComparePage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [urlA, setUrlA] = useState('');
  const [urlB, setUrlB] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<{ A: AnalysisResult; B: AnalysisResult } | null>(null);

  const handleCompare = async () => {
    if (!urlA || !urlB) {
      setError('Please enter URLs for both apps.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const [resA, resB] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/analyze`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: urlA }) }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/analyze`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: urlB }) })
      ]);

      if (!resA.ok) throw new Error(`App A Analysis Failed: ${await resA.text()}`);
      if (!resB.ok) throw new Error(`App B Analysis Failed: ${await resB.text()}`);

      const dataA: AnalysisResult = await resA.json();
      const dataB: AnalysisResult = await resB.json();

      setResults({ A: dataA, B: dataB });
    } catch (err: any) {
      setError(err.message || 'Comparison failed.');
    } finally {
      setLoading(false);
    }
  };

  const renderComparisonRow = (label: string, valA: React.ReactNode, valB: React.ReactNode, saferApp: 'A' | 'B' | 'Tie' = 'Tie') => (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid', borderColor: 'divider', py: 2 }}>
      <Typography sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
        {label}
      </Typography>
      <Box sx={{ p: 1, bgcolor: saferApp === 'A' ? (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)') : 'transparent', borderLeft: saferApp === 'A' ? `3px solid ${theme.palette.success.main}` : '3px solid transparent' }}>
        {valA}
      </Box>
      <Box sx={{ p: 1, bgcolor: saferApp === 'B' ? (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)') : 'transparent', borderLeft: saferApp === 'B' ? `3px solid ${theme.palette.success.main}` : '3px solid transparent' }}>
        {valB}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <Typography variant="h3" align="center" sx={{ fontWeight: 800, mb: 1.5, letterSpacing: '-0.02em', fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
            Compare Privacy Policies
          </Typography>
          <Typography align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 600, mx: 'auto', lineHeight: 1.7 }}>
            Enter two application URLs to run a side-by-side DPDP compliance and risk assessment.
          </Typography>
        </motion.div>

        {!results ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Box sx={{
              bgcolor: 'background.paper', p: { xs: 3, md: 5 }, borderRadius: 0,
              boxShadow: isDark ? '6px 6px 0px #fff' : '6px 6px 0px #000',
              border: '2px solid', borderColor: isDark ? 'text.primary' : '#000',
              maxWidth: 700, mx: 'auto'
            }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Typography sx={{ fontWeight: 800, mb: 1 }}>App A (URL)</Typography>
                  <TextField fullWidth placeholder="e.g. https://www.vedantu.com" value={urlA} onChange={(e) => setUrlA(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }} />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'text.primary', color: 'background.paper', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.8rem' }}>VS</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Typography sx={{ fontWeight: 800, mb: 1 }}>App B (URL)</Typography>
                  <TextField fullWidth placeholder="e.g. https://pw.live" value={urlB} onChange={(e) => setUrlB(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }} />
                </Grid>
              </Grid>

              {error && <Alert severity="error" sx={{ mt: 3, borderRadius: 0 }}>{error}</Alert>}

              <Button fullWidth variant="contained" size="large" disabled={loading} onClick={handleCompare}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <CompareArrows />}
                sx={{
                  mt: 4, py: 1.75, fontSize: '1rem', borderRadius: 0, border: '2px solid', borderColor: isDark ? 'text.primary' : '#000',
                  boxShadow: isDark ? '4px 4px 0px #fff' : '4px 4px 0px #000', '&:hover': { transform: 'translate(-2px, -2px)' }
                }}
              >
                {loading ? 'Analyzing with AI...' : 'Compare Privacy Policy'}
              </Button>
            </Box>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button onClick={() => setResults(null)} startIcon={<ArrowForward sx={{ transform: 'rotate(180deg)' }} />} sx={{ fontWeight: 800, color: 'text.secondary' }}>
                New Comparison
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'success.main', color: '#fff', px: 2, py: 0.5 }}>
                <VerifiedUser fontSize="small" />
                <Typography sx={{ fontWeight: 800, fontSize: '0.8rem' }}>
                  Safer Choice: {results.A.overall_score > results.B.overall_score ? results.A.app_name : results.B.app_name}
                </Typography>
              </Box>
            </Box>

            <Box sx={{
              bgcolor: 'background.paper', p: 0, borderRadius: 0,
              boxShadow: isDark ? '6px 6px 0px #fff' : '6px 6px 0px #000',
              border: '2px solid', borderColor: isDark ? 'text.primary' : '#000',
            }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fa', borderBottom: '2px solid', borderColor: 'text.primary' }}>
                <Box sx={{ p: 3 }}></Box>
                <Box sx={{ p: 3, borderLeft: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>{results.A.app_name}</Typography>
                </Box>
                <Box sx={{ p: 3, borderLeft: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>{results.B.app_name}</Typography>
                </Box>
              </Box>

              <Box sx={{ p: 3 }}>
                {renderComparisonRow('Privacy Score (Higher is Better)',
                  <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: results.A.overall_score >= 85 ? 'success.main' : results.A.overall_score >= 70 ? 'warning.main' : 'error.main' }}>{results.A.overall_score}/100</Typography>,
                  <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: results.B.overall_score >= 85 ? 'success.main' : results.B.overall_score >= 70 ? 'warning.main' : 'error.main' }}>{results.B.overall_score}/100</Typography>,
                  results.A.overall_score > results.B.overall_score ? 'A' : 'B'
                )}
                
                {renderComparisonRow('DPDP Act Compliance',
                  results.A.compliance_flags.dpdp?.compliant ? <CheckCircle color="success" /> : <Warning color="error" />,
                  results.B.compliance_flags.dpdp?.compliant ? <CheckCircle color="success" /> : <Warning color="error" />,
                  results.A.compliance_flags.dpdp?.compliant && !results.B.compliance_flags.dpdp?.compliant ? 'A' : results.B.compliance_flags.dpdp?.compliant && !results.A.compliance_flags.dpdp?.compliant ? 'B' : 'Tie'
                )}

                {renderComparisonRow('Child Safety Tracking',
                  <Typography variant="body2">{results.A.child_data_flags[0]}</Typography>,
                  <Typography variant="body2">{results.B.child_data_flags[0]}</Typography>
                )}

                {renderComparisonRow('Third-Party Sharing',
                  <Typography variant="body2">{results.A.third_party_sharing.length} entities</Typography>,
                  <Typography variant="body2">{results.B.third_party_sharing.length} entities</Typography>,
                  results.A.third_party_sharing.length < results.B.third_party_sharing.length ? 'A' : 'B'
                )}
                
                {renderComparisonRow('Data Collection Scope',
                  <Typography variant="body2">{results.A.data_collected.length} categories</Typography>,
                  <Typography variant="body2">{results.B.data_collected.length} categories</Typography>,
                  results.A.data_collected.length < results.B.data_collected.length ? 'A' : 'B'
                )}

                {renderComparisonRow('Verification Layer (Completeness)',
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: results.A.integrity_check?.completeness === 'High' ? 'success.main' : 'warning.main' }}>{results.A.integrity_check?.completeness}</Typography>
                    {results.A.integrity_check && results.A.integrity_check.missing_sections.length > 0 && (
                      <Typography variant="caption" sx={{ color: 'error.main', display: 'block', mt: 0.5 }}>Missing: {results.A.integrity_check.missing_sections.length} critical sections</Typography>
                    )}
                  </Box>,
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: results.B.integrity_check?.completeness === 'High' ? 'success.main' : 'warning.main' }}>{results.B.integrity_check?.completeness}</Typography>
                    {results.B.integrity_check && results.B.integrity_check.missing_sections.length > 0 && (
                      <Typography variant="caption" sx={{ color: 'error.main', display: 'block', mt: 0.5 }}>Missing: {results.B.integrity_check.missing_sections.length} critical sections</Typography>
                    )}
                  </Box>,
                  results.A.integrity_check?.completeness === 'High' && results.B.integrity_check?.completeness !== 'High' ? 'A' : results.B.integrity_check?.completeness === 'High' && results.A.integrity_check?.completeness !== 'High' ? 'B' : 'Tie'
                )}
              </Box>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  );
}
