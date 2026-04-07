'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, TextField, Button, Grid, useTheme, Alert, Chip, Skeleton } from '@mui/material';
import { CompareArrows, CheckCircle, Cancel, ArrowForward, VerifiedUser, TrendingUp, TrendingDown, Remove, SearchOutlined, AutoAwesome, Shield } from '@mui/icons-material';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { AnalysisResult } from '@/lib/types';

/** Extract a readable display name from a URL */
function getDomain(url: string): string {
  try {
    const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    // Strip www. and return capitalised root domain
    return hostname.replace(/^www\./, '').split('.')[0].charAt(0).toUpperCase() +
      hostname.replace(/^www\./, '').split('.')[0].slice(1);
  } catch {
    return url || 'App';
  }
}

/** Resolve best display name — prefer API name if it isn't the generic fallback */
function resolveAppName(apiName: string, url: string): string {
  const generic = ['Analyzed App', 'Unknown App', '', 'App'];
  if (generic.includes(apiName.trim())) return getDomain(url);
  return apiName;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Comparison factor definition for structured scoring
interface ComparisonFactor {
  label: string;
  key: string;
  getValueA: (r: AnalysisResult) => number | string | boolean;
  getValueB: (r: AnalysisResult) => number | string | boolean;
  format: (v: number | string | boolean) => string;
  /** 'higher' = higher is better, 'lower' = lower is better, 'bool' = true is better */
  direction: 'higher' | 'lower' | 'bool';
  maxScore?: number;
}

const COMPARISON_FACTORS: ComparisonFactor[] = [
  { label: 'Overall Privacy Score', key: 'overall_score', getValueA: r => r.overall_score, getValueB: r => r.overall_score, format: v => `${v}/100`, direction: 'higher', maxScore: 100 },
  { label: 'Privacy Grade', key: 'privacy_grade', getValueA: r => ({ A: 4, B: 3, C: 2, D: 1, F: 0 }[r.privacy_grade] || 0), getValueB: r => ({ A: 4, B: 3, C: 2, D: 1, F: 0 }[r.privacy_grade] || 0), format: v => ['F', 'D', 'C', 'B', 'A'][v as number] || '?', direction: 'higher' },
  { label: 'Data Collection (Max 20)', key: 'data_collection', getValueA: r => r.score_breakdown.data_collection, getValueB: r => r.score_breakdown.data_collection, format: v => `${v}/20`, direction: 'higher', maxScore: 20 },
  { label: 'Third-Party Sharing (Max 20)', key: 'third_party', getValueA: r => r.score_breakdown.third_party_sharing, getValueB: r => r.score_breakdown.third_party_sharing, format: v => `${v}/20`, direction: 'higher', maxScore: 20 },
  { label: 'Child Safety (Max 15)', key: 'child_safety', getValueA: r => r.score_breakdown.child_safety, getValueB: r => r.score_breakdown.child_safety, format: v => `${v}/15`, direction: 'higher', maxScore: 15 },
  { label: 'Retention Clarity (Max 10)', key: 'retention', getValueA: r => r.score_breakdown.retention_clarity, getValueB: r => r.score_breakdown.retention_clarity, format: v => `${v}/10`, direction: 'higher', maxScore: 10 },
  { label: 'User Rights (Max 10)', key: 'user_rights', getValueA: r => r.score_breakdown.user_rights, getValueB: r => r.score_breakdown.user_rights, format: v => `${v}/10`, direction: 'higher', maxScore: 10 },
  { label: 'Transparency (Max 10)', key: 'transparency', getValueA: r => r.score_breakdown.transparency, getValueB: r => r.score_breakdown.transparency, format: v => `${v}/10`, direction: 'higher', maxScore: 10 },
  { label: 'Security (Max 5)', key: 'security', getValueA: r => r.score_breakdown.security, getValueB: r => r.score_breakdown.security, format: v => `${v}/5`, direction: 'higher', maxScore: 5 },
  { label: 'Tracking / Cookies (Max 5)', key: 'tracking', getValueA: r => r.score_breakdown.tracking_cookies, getValueB: r => r.score_breakdown.tracking_cookies, format: v => `${v}/5`, direction: 'higher', maxScore: 5 },
  { label: 'Red Flags Count', key: 'red_flags', getValueA: r => r.red_flags.length, getValueB: r => r.red_flags.length, format: v => `${v} found`, direction: 'lower' },
  { label: 'Third-Party Entities', key: 'tp_count', getValueA: r => r.third_party_sharing.length, getValueB: r => r.third_party_sharing.length, format: v => `${v} entities`, direction: 'lower' },
  { label: 'Data Categories Collected', key: 'data_cats', getValueA: r => r.data_collected.length, getValueB: r => r.data_collected.length, format: v => `${v} categories`, direction: 'lower' },
  { label: 'GDPR Compliant', key: 'gdpr', getValueA: r => r.compliance_flags.gdpr?.compliant ?? false, getValueB: r => r.compliance_flags.gdpr?.compliant ?? false, format: v => v ? 'Yes' : 'No', direction: 'bool' },
  { label: 'COPPA Compliant', key: 'coppa', getValueA: r => r.compliance_flags.coppa?.compliant ?? false, getValueB: r => r.compliance_flags.coppa?.compliant ?? false, format: v => v ? 'Yes' : 'No', direction: 'bool' },
  { label: 'DPDP Act Compliant', key: 'dpdp', getValueA: r => r.compliance_flags.dpdp?.compliant ?? false, getValueB: r => r.compliance_flags.dpdp?.compliant ?? false, format: v => v ? 'Yes' : 'No', direction: 'bool' },
  { label: 'FERPA Compliant', key: 'ferpa', getValueA: r => r.compliance_flags.ferpa?.compliant ?? false, getValueB: r => r.compliance_flags.ferpa?.compliant ?? false, format: v => v ? 'Yes' : 'No', direction: 'bool' },
  { label: 'Completeness', key: 'completeness', getValueA: r => ({ High: 3, Medium: 2, Low: 1 }[r.integrity_check?.completeness || 'Low'] || 0), getValueB: r => ({ High: 3, Medium: 2, Low: 1 }[r.integrity_check?.completeness || 'Low'] || 0), format: v => ['', 'Low', 'Medium', 'High'][v as number] || '?', direction: 'higher' },
  { label: 'Readability Score', key: 'readability', getValueA: r => r.readability_score, getValueB: r => r.readability_score, format: v => `${v}/100`, direction: 'higher', maxScore: 100 },
  { label: 'Confidence Score', key: 'confidence', getValueA: r => r.confidence_score, getValueB: r => r.confidence_score, format: v => `${v}/100`, direction: 'higher', maxScore: 100 },
];

function getWinner(valA: number | string | boolean, valB: number | string | boolean, direction: 'higher' | 'lower' | 'bool'): 'A' | 'B' | 'Tie' {
  if (direction === 'bool') {
    if (valA === valB) return 'Tie';
    return valA ? 'A' : 'B';
  }
  const a = Number(valA);
  const b = Number(valB);
  if (a === b) return 'Tie';
  if (direction === 'higher') return a > b ? 'A' : 'B';
  return a < b ? 'A' : 'B';
}

const LOADING_STEPS = [
  { icon: SearchOutlined, label: 'Fetching privacy policies…', pct: 15 },
  { icon: AutoAwesome,    label: 'Running Gemini AI analysis on both…', pct: 45 },
  { icon: Shield,         label: 'Scoring 20 comparison factors…', pct: 75 },
  { icon: VerifiedUser,   label: 'Generating final verdict…', pct: 95 },
];

function CompareLoadingOverlay({ urlA, urlB }: { urlA: string; urlB: string }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Advance steps every ~4s
    intervalRef.current = setInterval(() => {
      setStep(s => Math.min(s + 1, LOADING_STEPS.length - 1));
    }, 4000);
    // Smooth progress bar
    const target = LOADING_STEPS[step]?.pct ?? 95;
    const tick = setInterval(() => setProgress(p => p < target ? p + 1 : p), 80);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); clearInterval(tick); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const current = LOADING_STEPS[step];
  const Icon = current.icon;

  return (
    <Box sx={{ py: 10, textAlign: 'center' }}>
      <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
        <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: isDark ? 'rgba(77,142,255,0.12)' : '#d8e2ff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <Icon sx={{ fontSize: 36, color: 'primary.main' }} />
        </Box>
      </motion.div>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Comparing Policies</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <Chip label={getDomain(urlA)} size="small" color="primary" variant="outlined" />
        <Typography sx={{ fontWeight: 800, color: 'text.secondary', lineHeight: '24px' }}>vs</Typography>
        <Chip label={getDomain(urlB)} size="small" color="secondary" variant="outlined" />
      </Box>
      {/* Progress bar */}
      <Box sx={{ maxWidth: 480, mx: 'auto', mb: 2 }}>
        <Box sx={{ height: 6, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#e5e9f0', overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ height: '100%', background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${isDark ? '#00b4d8' : '#005ac2'})`, borderRadius: 3 }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>{progress}%</Typography>
      </Box>
      {/* Step messages */}
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
          <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>{current.label}</Typography>
        </motion.div>
      </AnimatePresence>
      {/* Step dots */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
        {LOADING_STEPS.map((_, i) => (
          <Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: i <= step ? 'primary.main' : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'), transition: 'background 0.3s' }} />
        ))}
      </Box>
    </Box>
  );
}

function CompareSkeletonRow() {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr 1fr', md: '2fr 1fr 1fr' }, borderBottom: '1px solid', borderColor: 'divider', py: 0.5 }}>
      <Box sx={{ p: 2 }}><Skeleton width="60%" height={20} /></Box>
      <Box sx={{ p: 2, borderLeft: '3px solid transparent' }}><Skeleton width="50%" height={20} sx={{ mx: 'auto' }} /></Box>
      <Box sx={{ p: 2, borderLeft: '3px solid transparent' }}><Skeleton width="50%" height={20} sx={{ mx: 'auto' }} /></Box>
    </Box>
  );
}

export default function ComparePage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [urlA, setUrlA] = useState('');
  const [urlB, setUrlB] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<{ A: AnalysisResult; B: AnalysisResult; nameA: string; nameB: string } | null>(null);

  const handleCompare = async () => {
    if (!urlA || !urlB) { setError('Please enter URLs for both apps.'); return; }
    setError('');
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const [resA, resB] = await Promise.all([
        fetch(`${apiUrl}/api/analyze`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: urlA }) }),
        fetch(`${apiUrl}/api/analyze`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: urlB }) })
      ]);
      if (!resA.ok) { const d = await resA.json().catch(() => ({})); throw new Error(`App A: ${d.error || resA.statusText}`); }
      if (!resB.ok) { const d = await resB.json().catch(() => ({})); throw new Error(`App B: ${d.error || resB.statusText}`); }
      const dataA: AnalysisResult = await resA.json();
      const dataB: AnalysisResult = await resB.json();
      
      // PERSISTENT HISTORY logic for comparison
      const historyStr = localStorage.getItem('probe_history') || '[]';
      const history = JSON.parse(historyStr);
      // Add both to history, limit to last 20
      const newHistory = [dataA, dataB, ...history].slice(0, 20);
      localStorage.setItem('probe_history', JSON.stringify(newHistory));

      setResults({ A: dataA, B: dataB, nameA: resolveAppName(dataA.app_name, urlA), nameB: resolveAppName(dataB.app_name, urlB) });
    } catch (err: any) {
      setError(err.message || 'Comparison failed.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate overall verdict
  const getVerdict = () => {
    if (!results) return { winner: 'Tie' as const, winsA: 0, winsB: 0, ties: 0 };
    let winsA = 0, winsB = 0, ties = 0;
    COMPARISON_FACTORS.forEach(f => {
      const w = getWinner(f.getValueA(results.A), f.getValueB(results.B), f.direction);
      if (w === 'A') winsA++;
      else if (w === 'B') winsB++;
      else ties++;
    });
    return { winner: winsA > winsB ? 'A' as const : winsB > winsA ? 'B' as const : 'Tie' as const, winsA, winsB, ties };
  };

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <Typography variant="h3" align="center" sx={{ fontWeight: 900, mb: 1.5, letterSpacing: '-0.04em', fontSize: { xs: '2rem', md: '3rem' }, textTransform: 'uppercase' }}>
            Privacy Duel
          </Typography>
          <Typography align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 600, mx: 'auto', lineHeight: 1.7, fontWeight: 600 }}>
            Side-by-side audit of {COMPARISON_FACTORS.length} critical privacy checkpoints.
          </Typography>
        </motion.div>

        {loading && <CompareLoadingOverlay urlA={urlA} urlB={urlB} />}

        {!loading && !results && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Box className="nb-shadow" sx={{
              bgcolor: 'background.paper', p: { xs: 3, md: 5 }, borderRadius: 0,
              border: '3px solid', borderColor: isDark ? '#fefefe' : '#111827',
              maxWidth: 750, mx: 'auto'
            }}>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Typography sx={{ fontWeight: 900, mb: 1.5, textTransform: 'uppercase', fontSize: '0.8rem' }}>PRIMARY APP</Typography>
                  <TextField fullWidth placeholder="https://..." value={urlA} onChange={(e) => setUrlA(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0, border: '2px solid #000' } }} />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Box sx={{ 
                    width: 48, height: 48, bgcolor: 'text.primary', color: 'background.paper', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '3px solid', borderColor: isDark ? '#fff' : '#111827',
                    boxShadow: `4px 4px 0px ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)'}`,
                    fontWeight: 900
                  }}>
                    VS
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Typography sx={{ fontWeight: 900, mb: 1.5, textTransform: 'uppercase', fontSize: '0.8rem' }}>COMPETING APP</Typography>
                  <TextField fullWidth placeholder="https://..." value={urlB} onChange={(e) => setUrlB(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0, border: '2px solid #000' } }} />
                </Grid>
              </Grid>

              {error && <Alert severity="error" sx={{ mt: 3, borderRadius: 0, border: '2px solid #ef4444', fontWeight: 700 }}>{error}</Alert>}

              <Button fullWidth variant="contained" size="large" onClick={handleCompare}
                startIcon={<CompareArrows />}
                sx={{
                  mt: 5, py: 2, fontSize: '1.1rem', borderRadius: 0, border: '3px solid', borderColor: isDark ? '#fefefe' : '#111827',
                  bgcolor: 'primary.main', fontWeight: 900,
                  boxShadow: `6px 6px 0px ${isDark ? '#fefefe' : '#111827'}`, '&:hover': { transform: 'translate(-2px, -2px)', boxShadow: `8px 8px 0px ${isDark ? '#fefefe' : '#111827'}` }
                }}
              >
                START COMPARISON AUDIT
              </Button>
            </Box>
          </motion.div>
        )}

        {!loading && results && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Results UI */}
            {(() => {
              const v = getVerdict();
              const winnerName = v.winner === 'A' ? results.nameA : v.winner === 'B' ? results.nameB : 'TIE';
              const isTie = v.winner === 'Tie';
              
              return (
                <>
                  <Box sx={{ mb: 6 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                      <Button onClick={() => setResults(null)} 
                        sx={{ fontWeight: 900, color: 'text.primary', border: '2px solid', borderColor: 'text.primary', borderRadius: 0, px: 2 }}>
                        RE-SCAN APPS
                      </Button>
                      <Button variant="contained" disabled sx={{ fontWeight: 900, borderRadius: 0, border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827' }}>
                        EXPORT AUDIT (PDF)
                      </Button>
                    </Box>

                    <Box className="nb-shadow" sx={{ 
                      p: 5, border: '3px solid', borderColor: isDark ? '#fefefe' : '#111827',
                      bgcolor: isTie ? 'warning.main' : 'success.main',
                      color: '#fff', textAlign: 'center', position: 'relative'
                    }}>
                      <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, textTransform: 'uppercase', letterSpacing: '-0.04em' }}>
                        {isTie ? "IT'S A DEAD HEAT!" : `THE SAFER CHOICE: ${winnerName}`}
                      </Typography>
                      <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', opacity: 0.9 }}>
                        {isTie ? 'Both policies offer similar levels of protection.' : `${winnerName} outperformed across ${v.winner === 'A' ? v.winsA : v.winsB} privacy checkpoints.`}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: -2, mb: 6 }}>
                    <Chip label={`A WINS: ${v.winsA}`} sx={{ border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827', bgcolor: isDark ? 'background.paper' : '#fff', fontWeight: 900, color: 'text.primary', borderRadius: 0 }} />
                    <Chip label={`TIES: ${v.ties}`} sx={{ border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827', bgcolor: isDark ? 'background.paper' : '#fff', fontWeight: 900, color: 'text.primary', borderRadius: 0 }} />
                    <Chip label={`B WINS: ${v.winsB}`} sx={{ border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827', bgcolor: isDark ? 'background.paper' : '#fff', fontWeight: 900, color: 'text.primary', borderRadius: 0 }} />
                    </Box>
                  </Box>

                  <Box className="nb-shadow" sx={{ bgcolor: 'background.paper', border: '3px solid', borderColor: isDark ? '#fefefe' : '#111827', mb: 6 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr 1fr', md: '2.5fr 1fr 1fr' }, borderBottom: '3px solid', borderColor: isDark ? '#fefefe' : '#111827', bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}>
                      <Box sx={{ p: 3 }}><Typography sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.8rem' }}>Checkpoints</Typography></Box>
                      <Box sx={{ p: 3, borderLeft: '3px solid', borderColor: isDark ? '#fefefe' : '#111827', textAlign: 'center' }}><Typography sx={{ fontWeight: 900 }}>{results.nameA}</Typography></Box>
                      <Box sx={{ p: 3, borderLeft: '3px solid', borderColor: isDark ? '#fefefe' : '#111827', textAlign: 'center' }}><Typography sx={{ fontWeight: 900 }}>{results.nameB}</Typography></Box>
                    </Box>
                    {COMPARISON_FACTORS.map((f, idx) => {
                      const valA = f.getValueA(results.A);
                      const valB = f.getValueB(results.B);
                      const w = getWinner(valA, valB, f.direction);
                      return (
                        <Box key={f.key} sx={{ 
                          display: 'grid', gridTemplateColumns: { xs: '1fr 1fr 1fr', md: '2.5fr 1fr 1fr' }, 
                          borderBottom: idx === COMPARISON_FACTORS.length - 1 ? 'none' : '1px solid divider'
                        }}>
                          <Box sx={{ p: 2 }}><Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>{f.label}</Typography></Box>
                          <Box sx={{ p: 2, borderLeft: '1px solid divider', textAlign: 'center', bgcolor: w === 'A' ? 'rgba(16,185,129,0.05)' : 'transparent' }}>
                            <Typography sx={{ fontWeight: 900, color: w === 'A' ? 'success.main' : w === 'B' ? 'error.main' : 'text.primary' }}>{f.format(valA)}</Typography>
                          </Box>
                          <Box sx={{ p: 2, borderLeft: '1px solid divider', textAlign: 'center', bgcolor: w === 'B' ? 'rgba(16,185,129,0.05)' : 'transparent' }}>
                            <Typography sx={{ fontWeight: 900, color: w === 'B' ? 'success.main' : w === 'A' ? 'error.main' : 'text.primary' }}>{f.format(valB)}</Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </>
              );
            })()}
          </motion.div>
        )}
      </Container>
    </Box>
  );
}

