'use client';
import React from 'react';
import { Box, Container, Typography, Button, Grid, useTheme, Chip } from '@mui/material';
import { ArrowForward, Lock, Link as LinkIcon, Psychology, Description, CompareArrows, HistoryEdu, VerifiedUser, NoAccounts, CheckCircle, Warning } from '@mui/icons-material';
import { motion, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }),
};

const steps = [
  { icon: <LinkIcon sx={{ fontSize: 36 }} />, num: '1', title: 'Scan URL', desc: 'Paste any privacy policy link or upload a PDF document for immediate processing.' },
  { icon: <Description sx={{ fontSize: 36 }} />, num: '2', title: 'Extract Clauses', desc: 'Our AI isolates data retention, sharing, and compliance clauses automatically.' },
  { icon: <Psychology sx={{ fontSize: 36 }} />, num: '3', title: 'Analyze Risks', desc: 'Risk models cross-reference findings against FERPA, GDPR, and COPPA standards.' },
  { icon: <Description sx={{ fontSize: 36 }} />, num: '4', title: 'Generate Report', desc: 'Receive a professional intelligence brief ready for school board review.' },
];

export default function LandingPage() {
  const theme = useTheme();
  const router = useRouter();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box>
      {/* Hero */}
      <Box className="hero-grid" sx={{ pb: 10, pt: 14, minHeight: '85vh', display: 'flex', alignItems: 'center', bgcolor: isDark ? '#000' : '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center" justifyContent="center">
            <Grid size={{ xs: 12, md: 10, lg: 9 }} sx={{ textAlign: 'center' }}>
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                <Chip label="DPDP ACT COMPLIANT" sx={{ bgcolor: isDark ? 'rgba(74,222,128,0.1)' : '#f0fdf4', color: 'success.main', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.15em', mb: 4, borderRadius: 0, border: '2px solid', borderColor: 'success.main' }} />
                <Typography variant="h1" sx={{ fontFamily: '"Manrope"', fontWeight: 900, fontSize: { xs: '3rem', md: '4.5rem', lg: '5rem' }, lineHeight: 1.05, mb: 3, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '-0.04em' }}>
                  India's First Student Data <Box component="span" sx={{ color: isDark ? '#ff4d4d' : '#e60000', textShadow: isDark ? '4px 4px 0px rgba(255,77,77,0.3)' : '4px 4px 0px #000' }}>Privacy Audit</Box> Platform
                </Typography>
              </motion.div>
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.3rem' }, color: 'text.secondary', maxWidth: 700, mx: 'auto', lineHeight: 1.6, mb: 6, fontWeight: 500 }}>
                  Policy Probe verifies, explains, and aligns educational apps with India's Digital Personal Data Protection (DPDP) Act. We expose hidden risks so parents and educators don't have to guess.
                </Typography>
              </motion.div>
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button variant="contained" size="large" onClick={() => router.push('/analyze')}
                    sx={{ px: 4, py: 2, fontSize: '1.1rem', fontWeight: 800, borderRadius: 0, bgcolor: 'primary.main', color: '#fff', border: '2px solid', borderColor: isDark ? '#fff' : '#000', boxShadow: isDark ? '6px 6px 0px #fff' : '6px 6px 0px #000', '&:hover': { transform: 'translate(-2px, -2px)' } }}>
                    Run Verification <ArrowForward sx={{ ml: 1 }} />
                  </Button>
                  <Button variant="outlined" size="large" onClick={() => router.push('/compare')}
                    sx={{ px: 4, py: 2, fontSize: '1.1rem', fontWeight: 800, borderRadius: 0, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#fff', color: 'text.primary', border: '2px solid', borderColor: isDark ? '#fff' : '#000', boxShadow: isDark ? '6px 6px 0px #fff' : '6px 6px 0px #000', '&:hover': { transform: 'translate(-2px, -2px)' } }}>
                    Compare Platforms
                  </Button>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works */}
      <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: isDark ? '#111416' : '#f1f4f6' }}>
        <Container maxWidth="lg">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' }, mb: 2 }}>Intelligent Analysis in Minutes</Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 520, mx: 'auto' }}>Our proprietary engine scans through thousands of words to find what matters most to your institution.</Typography>
            </Box>
          </motion.div>
          <Grid container spacing={3}>
            {steps.map((s, i) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={s.title}>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}>
                  <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 3, position: 'relative', overflow: 'hidden', height: '100%', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                    <Typography sx={{ position: 'absolute', top: -8, right: -4, fontSize: '5rem', fontWeight: 800, color: isDark ? 'rgba(77,142,255,0.06)' : 'rgba(0,90,194,0.06)', fontFamily: '"Manrope"', lineHeight: 1 }}>{s.num}</Typography>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>{s.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '1.05rem' }}>{s.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '0.82rem' }}>{s.desc}</Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Key Features Bento */}
      <Box sx={{ py: { xs: 10, md: 16 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
                <Box sx={{ bgcolor: 'background.paper', p: { xs: 4, md: 6 }, borderRadius: 4, height: '100%', boxShadow: '0px 4px 40px rgba(0,0,0,0.03)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(171,179,183,0.05)'}` }}>
                  <Chip label="KEY FEATURES" size="small" sx={{ bgcolor: isDark ? 'rgba(77,142,255,0.12)' : '#d8e2ff', color: isDark ? '#7aadff' : '#004eaa', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.12em', mb: 3, height: 24 }} />
                  <Typography variant="h3" sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, mb: 2 }}>Risk Classification and Semantic Intelligence</Typography>
                  <Typography color="text.secondary" sx={{ maxWidth: 480, lineHeight: 1.7, mb: 4 }}>
                    Go beyond keyword matching. Our system understands the legal intent behind every sentence, highlighting hidden liabilities in seconds.
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {['Automatic FERPA/COPPA Mapping', 'Negative Clause Detection'].map((f) => (
                      <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CheckCircle sx={{ color: 'primary.main', fontSize: 20 }} />
                        <Typography variant="body2" fontWeight={500}>{f}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
                  <Box sx={{ bgcolor: 'primary.main', p: 5, borderRadius: 4, color: '#fff', flex: 1, cursor: 'pointer', '&:hover': { transform: 'scale(1.01)' }, transition: 'transform 0.2s' }}
                    onClick={() => router.push('/compare')}>
                    <CompareArrows sx={{ fontSize: 40, mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#fff' }}>Comparison</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>A/B test policies between multiple vendors side-by-side.</Typography>
                  </Box>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}>
                  <Box sx={{ bgcolor: isDark ? '#1e2326' : '#dbe4e7', p: 5, borderRadius: 4, cursor: 'pointer', '&:hover': { transform: 'scale(1.01)' }, transition: 'transform 0.2s' }}
                    onClick={() => router.push('/history')}>
                    <HistoryEdu sx={{ fontSize: 40, mb: 2, color: 'text.primary' }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Audit-Ready</Typography>
                    <Typography color="text.secondary" sx={{ fontSize: '0.85rem' }}>Download white-labeled PDFs for institutional compliance records.</Typography>
                  </Box>
                </motion.div>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Security Section */}
      <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: isDark ? '#0c0f10' : '#2b3437', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, height: 800, bgcolor: 'rgba(0,90,194,0.05)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
                <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' }, mb: 2, color: '#fff' }}>Secure Analysis Intelligence</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.05rem', mb: 4 }}>
                  Your data privacy is our absolute priority. We analyze third-party policies without ever compromising your institutional security.
                </Typography>
                <Grid container spacing={3}>
                  {[
                    { icon: <NoAccounts />, title: 'No user data retained', sub: 'Volatile memory processing' },
                    { icon: <VerifiedUser />, title: 'AES-256 Encryption', sub: 'At rest and in transit' },
                  ].map((item) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={item.title}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Box sx={{ color: 'primary.main' }}>{item.icon}</Box>
                        <Box>
                          <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{item.title}</Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{item.sub}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.04)', p: 1, borderRadius: 4, border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(24px)' }}>
                  <Box sx={{ bgcolor: isDark ? '#0a0c0d' : '#1a1f22', px: 6, py: 8, borderRadius: 3.5, textAlign: 'center' }}>
                    <Lock sx={{ fontSize: 56, color: 'primary.main', mb: 3 }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '1.3rem', color: '#fff', mb: 0.5 }}>Zero-Trust Protocol</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>Enterprise Grade Security</Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
