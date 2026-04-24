'use client';
import React, { useRef } from 'react';
import { Box, Container, Typography, Button, Grid, useTheme } from '@mui/material';
import { ArrowForward, CheckCircle, CompareArrows, VerifiedUser, Warning, Link as LinkIcon, Psychology, Description } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1, y: 0,
    transition: { delay: custom * 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }),
};

const steps = [
  { icon: <LinkIcon sx={{ fontSize: 36 }} />, num: '01', title: 'Data Ingestion', desc: 'Paste a privacy policy URL, app name, or raw text. Our engine instantly retrieves the legal document.' },
  { icon: <Psychology sx={{ fontSize: 36 }} />, num: '02', title: 'Semantic Scanning', desc: 'The Gemini 2.0 Flash model reads the document like a lawyer, hunting for aggressive data practices.' },
  { icon: <Description sx={{ fontSize: 36 }} />, num: '03', title: 'Omission Detection', desc: 'Crucially, the system identifies what is missing — like absent data deletion rights or lack of COPPA compliance.' },
  { icon: <CheckCircle sx={{ fontSize: 36 }} />, num: '04', title: 'Actionable Grading', desc: 'You receive a clear A-F grade, a plain-English summary, and specific red flags to discuss with vendors.' },
];

export default function Home() {
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <Box ref={containerRef}>
      {/* Hero Section styled like Jules.google.com landing page (center minimal) but retaining product text and adding wild animations */}
      <Box 
        component={motion.div}
        style={{ y }}
        className="hero-grid" 
        sx={{ pt: { xs: 12, md: 18 }, pb: { xs: 10, md: 16 }, position: 'relative', overflow: 'hidden', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        {/* Animated Background Elements */}
        <Box component={motion.div}
             animate={{ rotate: 360, scale: [1, 1.2, 1] }}
             transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
             sx={{ position: 'absolute', top: '-10%', right: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,115,232,0.15) 0%, rgba(0,0,0,0) 70%)', zIndex: 0 }} />
        <Box component={motion.div}
             animate={{ rotate: -360, scale: [1, 1.5, 1] }}
             transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
             sx={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,115,232,0.1) 0%, rgba(0,0,0,0) 70%)', zIndex: 0 }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <Typography component={motion.h1} animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }} align="center" sx={{ fontWeight: 900, mb: 3, letterSpacing: '-0.04em', lineHeight: 1.1, fontSize: { xs: '3rem', sm: '4rem', md: '5rem', lg: '6rem' } }}>
                <Box component={motion.span} whileHover={{ scale: 1.05, rotate: 2 }} sx={{
                  bgcolor: 'primary.main', color: '#fff', px: 1.5, py: 0.2,
                  display: 'inline-block', border: '4px solid', borderColor: isDark ? '#fefefe' : '#111827',
                  transform: 'rotate(-1deg)', mb: 2, cursor: 'pointer'
                }}>PRIVACY AUDIT SYSTEM</Box> <br/>
                FOR STUDENTS
              </Typography>
            </motion.div>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
              <Typography align="center" sx={{ fontSize: { xs: '1.2rem', md: '1.4rem' }, color: 'text.secondary', maxWidth: 750, mx: 'auto', lineHeight: 1.6, mb: 7, fontWeight: 700 }}>
                Policy Probe exposes hidden risks in educational apps. Powered by semantic intelligence to keep Indian schools compliant and students safe.
              </Typography>
            </motion.div>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button variant="contained" size="large" onClick={() => router.push('/analyze')}
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    px: 5, py: 2.2, fontSize: '1.1rem', fontWeight: 900, borderRadius: 0,
                    bgcolor: 'primary.main', color: '#fff', border: '3px solid', borderColor: isDark ? '#fefefe' : '#111827',
                    boxShadow: `6px 6px 0px ${isDark ? '#fefefe' : '#111827'}`, transition: 'all 0.1s',
                    '&:hover': { transform: 'translate(-2px, -2px)', boxShadow: `8px 8px 0px ${isDark ? '#fefefe' : '#111827'}`, bgcolor: 'primary.dark' }
                  }}>
                  VERIFY AN APP <ArrowForward sx={{ ml: 1, fontWeight: 900 }} />
                </Button>
                <Button variant="outlined" size="large" onClick={() => router.push('/compare')}
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    px: 5, py: 2.2, fontSize: '1.1rem', fontWeight: 900, borderRadius: 0,
                    bgcolor: isDark ? 'background.paper' : '#fff', color: 'text.primary', border: '3px solid', borderColor: isDark ? '#fefefe' : '#111827',
                    boxShadow: `6px 6px 0px ${isDark ? '#fefefe' : '#111827'}`, transition: 'all 0.1s',
                    '&:hover': { transform: 'translate(-2px, -2px)', boxShadow: `8px 8px 0px ${isDark ? '#fefefe' : '#111827'}`, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }
                  }}>
                  COMPARE VENDORS
                </Button>
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Stats / Proof */}
      <Box sx={{ py: 6, borderY: '3px solid', borderColor: isDark ? '#fefefe' : '#111827', bgcolor: isDark ? 'primary.dark' : 'primary.main', overflow: 'hidden' }}>
        <Box component={motion.div} animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} sx={{ display: 'flex', whiteSpace: 'nowrap', gap: 8 }}>
          {[1,2,3,4,5,6,7,8].map(i => (
            <Typography key={i} sx={{ color: '#fff', fontWeight: 900, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              • SECURE AUDIT • AI POWERED • DPDP COMPLIANT • 0.8s ANALYSIS • STUDENT PROTECTION •
            </Typography>
          ))}
        </Box>
      </Box>

      {/* How It Works */}
      <Box sx={{ py: { xs: 10, md: 16 }, bgcolor: isDark ? '#28252b' : '#f5f5f5' }}>
        <Container maxWidth="lg">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <Box sx={{ textAlign: 'center', mb: 10 }}>
              <Typography variant="h2" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', mb: 2 }}>The Audit Workflow</Typography>
              <Typography sx={{ fontWeight: 600, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>Professional privacy intelligence, simplified for school boards and parents.</Typography>
            </Box>
          </motion.div>
          <Grid container spacing={4}>
            {steps.map((s, i) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={s.title}>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}>
                  <Box component={motion.div} whileHover={{ y: -10 }} className="nb-shadow" sx={{
                    bgcolor: 'background.paper', p: 4, borderRadius: 0, height: '100%', 
                    border: '3px solid', borderColor: isDark ? '#fefefe' : '#111827', position: 'relative'
                  }}>
                    <Box sx={{ 
                      width: 48, height: 48, bgcolor: 'warning.main', color: '#000', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827', mb: 3, fontWeight: 900, fontSize: '1.2rem'
                    }}>
                      {s.num}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, textTransform: 'uppercase' }}>{s.title}</Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.7, fontWeight: 600, color: 'text.secondary' }}>{s.desc}</Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Bento Section */}
      <Box sx={{ py: 16 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <Box className="nb-shadow" sx={{
                  p: { xs: 4, md: 6 }, border: '3px solid', borderColor: isDark ? '#fefefe' : '#111827', height: '100%',
                  bgcolor: isDark ? '#353139' : '#fff'
                }}>
                  <Box sx={{ bgcolor: 'error.main', color: '#fff', px: 2, py: 0.5, border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827', display: 'inline-block', fontWeight: 900, mb: 4, fontSize: '0.7rem' }}>CORE INTELLIGENCE</Box>
                  <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, textTransform: 'uppercase' }}>Negative Clause Intelligence</Typography>
                  <Typography sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '1.1rem', mb: 4, maxWidth: 500 }}>
                    We don't just find what's there — we find what's missing. Our AI flags critical omissions that traditional scanners miss.
                  </Typography>
                  <Grid container spacing={2}>
                    {['Institutional Dashboard', 'Legal Evidence Snippets', 'Risk Categorization', 'PDF Intelligence Briefs'].map((f, i) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={f}>
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                             <CheckCircle sx={{ color: 'success.main', fontSize: 24 }} />
                             <Typography sx={{ fontWeight: 800 }}>{f}</Typography>
                          </Box>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, height: '100%' }}>
                <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} style={{ height: '100%' }}>
                  <Box component={motion.div} whileHover={{ scale: 1.02 }} className="nb-shadow" sx={{ p: 5, border: '3px solid', borderColor: isDark ? '#fefefe' : '#111827', bgcolor: 'primary.main', color: '#fff', cursor: 'pointer', height: '100%' }} onClick={() => router.push('/compare')}>
                    <CompareArrows sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>SIDE-BY-SIDE</Typography>
                    <Typography sx={{ fontWeight: 600, opacity: 0.9 }}>Compare vendor policies and pick the safest choice for your school.</Typography>
                  </Box>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} style={{ height: '100%' }}>
                  <Box component={motion.div} whileHover={{ scale: 1.02 }} className="nb-shadow" sx={{ p: 5, border: '3px solid', borderColor: isDark ? '#fefefe' : '#111827', bgcolor: 'success.main', color: '#fff', cursor: 'pointer', height: '100%' }}>
                    <VerifiedUser sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>ZERO RETAIN</Typography>
                    <Typography sx={{ fontWeight: 600, opacity: 0.9 }}>We never store institutional data. All analysis is ephemeral and secure.</Typography>
                  </Box>
                </motion.div>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Banner / CTA */}
      <Box sx={{ py: 12, bgcolor: isDark ? '#000' : '#fefefe' }}>
        <Container maxWidth="lg">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ type: 'spring', bounce: 0.4, duration: 0.8 }}>
            <Box className="nb-shadow" sx={{
              p: { xs: 4, md: 8 }, border: '4px solid', borderColor: isDark ? '#fefefe' : '#111827', bgcolor: 'warning.main', textAlign: 'center',
              position: 'relative'
            }}>
              <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, textTransform: 'uppercase', letterSpacing: '-0.04em', color: '#000' }}>Ready for a safer Digital India?</Typography>
              <Typography sx={{ fontWeight: 800, mb: 6, fontSize: '1.2rem', color: '#000', opacity: 0.8 }}>Join 50+ schools auditing their platform privacy with PolicyProbe.</Typography>
              <Button variant="contained" size="large" onClick={() => router.push('/analyze')}
                component={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                sx={{
                  px: 8, py: 2.5, fontSize: '1.2rem', fontWeight: 900, borderRadius: 0,
                  bgcolor: '#111827', color: '#fff', border: '3px solid #111827',
                  boxShadow: '5px 5px 0px rgba(0,0,0,0.3)',
                  '&:hover': { bgcolor: '#000', transform: 'translate(-2px,-2px)', boxShadow: '7px 7px 0px rgba(0,0,0,0.3)' }
                }}>
                START FREE AUDIT NOW
              </Button>
              <motion.div style={{ position: 'absolute', top: 20, left: 20, zIndex: 0 }} animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 5 }}>
                <Warning sx={{ fontSize: 40, opacity: 0.2, color: '#111827' }} />
              </motion.div>
              <motion.div style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 0 }} animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 5 }}>
                <Warning sx={{ fontSize: 40, opacity: 0.2, color: '#111827' }} />
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}
