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

const AntiGravityBackground = ({ isDark }: { isDark: boolean }) => {
  const elements = Array.from({ length: 45 });
  const themeColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
  const highlightColor = isDark ? 'rgba(77, 142, 255, 0.3)' : 'rgba(26, 115, 232, 0.2)';

  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
      {elements.map((_, i) => {
        const type = i % 4; // 0: circle, 1: square, 2: plus, 3: dot
        const size = Math.random() * 30 + 10;
        const color = i % 5 === 0 ? highlightColor : themeColor;
        
        return (
          <motion.div
            key={i}
            initial={{ 
              x: `${Math.random() * 100}vw`, 
              y: `${100 + Math.random() * 20}vh`, 
              rotate: Math.random() * 360,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: '-20vh',
              rotate: Math.random() > 0.5 ? 360 : -360
            }}
            transition={{ 
              duration: Math.random() * 20 + 25, 
              repeat: Infinity, 
              ease: "linear", 
              delay: Math.random() * -30 // Negative delay so they are on screen immediately
            }}
            style={{ 
              position: 'absolute', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}
          >
            {type === 0 && (
              <Box sx={{ width: size, height: size, border: `2px solid ${color}`, borderRadius: '50%' }} />
            )}
            {type === 1 && (
              <Box sx={{ width: size, height: size, border: `2px solid ${color}` }} />
            )}
            {type === 2 && (
              <Box sx={{ position: 'relative', width: size, height: size }}>
                <Box sx={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, bgcolor: color, transform: 'translateY(-50%)' }} />
                <Box sx={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, bgcolor: color, transform: 'translateX(-50%)' }} />
              </Box>
            )}
            {type === 3 && (
              <Box sx={{ width: 6, height: 6, bgcolor: color, borderRadius: '50%' }} />
            )}
          </motion.div>
        );
      })}
    </Box>
  );
};
export default function LandingPage() {
  const theme = useTheme();
  const router = useRouter();
  const isDark = theme.palette.mode === 'dark';
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Box>
      {/* Hero */}
      <Box 
        className="hero-grid" 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)} 
        sx={{ position: 'relative', pb: 10, pt: 16, minHeight: '90vh', display: 'flex', alignItems: 'center', bgcolor: isDark ? '#000' : '#fefefe' }}
      >
        <AntiGravityBackground isDark={isDark} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>          <Grid container spacing={6} alignItems="center" justifyContent="center">
            <Grid size={{ xs: 12, md: 10, lg: 9 }} sx={{ textAlign: 'center' }}>
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                <Box className="nb-shadow" sx={{ 
                  display: 'inline-block', bgcolor: 'success.main', color: '#fff', px: 2, py: 0.5, 
                  border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827', mb: 4, fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.15em', 
                  textTransform: 'uppercase' 
                }}>
                  🇮🇳 INDIA'S FIRST · DPDP ACT 2023
                </Box>

                <Typography variant="h1" sx={{ fontFamily: '"Manrope"', fontWeight: 900, fontSize: { xs: '2.2rem', md: '3.6rem', lg: '4.2rem' }, lineHeight: 1.1, mb: 4, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '-0.06em' }}>
                  <Box component="span" sx={{ 
                    bgcolor: 'error.main', color: '#fff', px: 1.5, py: 0.5,
                    display: 'inline-block', border: '3px solid', borderColor: isDark ? '#fefefe' : '#111827',
                    boxShadow: `4px 4px 0px ${isDark ? '#fefefe' : '#111827'}`,
                    mb: 2
                  }}>INDIA'S FIRST</Box> <br/>
                  <Box component="span" sx={{ 
                    bgcolor: isDark ? 'primary.main' : 'warning.main', 
                    color: isDark ? '#fff' : '#000', px: 1.5, py: 0.2,
                    display: 'inline-block', border: '4px solid', borderColor: isDark ? '#fefefe' : '#111827',
                    transform: 'rotate(-1deg)', mb: 2
                  }}>PRIVACY AUDIT SYSTEM</Box> <br/>
                  FOR STUDENTS
                </Typography>
              </motion.div>
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                <Typography sx={{ fontSize: { xs: '1.2rem', md: '1.4rem' }, color: 'text.secondary', maxWidth: 750, mx: 'auto', lineHeight: 1.6, mb: 7, fontWeight: 700 }}>
                  Policy Probe exposes hidden risks in educational apps. Powered by semantic intelligence to keep Indian schools compliant and students safe.
                </Typography>
              </motion.div>
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button variant="contained" size="large" onClick={() => router.push('/analyze')}
                    sx={{ 
                      px: 5, py: 2.2, fontSize: '1.1rem', fontWeight: 900, borderRadius: 0, 
                      bgcolor: 'primary.main', color: '#fff', border: '3px solid', borderColor: isDark ? '#fefefe' : '#111827', 
                      boxShadow: `6px 6px 0px ${isDark ? '#fefefe' : '#111827'}`, transition: 'all 0.1s',
                      '&:hover': { transform: 'translate(-2px, -2px)', boxShadow: `8px 8px 0px ${isDark ? '#fefefe' : '#111827'}`, bgcolor: 'primary.dark' } 
                    }}>
                    VERIFY AN APP <ArrowForward sx={{ ml: 1, fontWeight: 900 }} />
                  </Button>
                  <Button variant="outlined" size="large" onClick={() => router.push('/compare')}
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
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats / Proof */}
      <Box sx={{ py: 6, borderY: '3px solid', borderColor: isDark ? '#fefefe' : '#111827', bgcolor: isDark ? 'primary.dark' : 'primary.main', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', whiteSpace: 'nowrap', gap: 8 }}>
          {[1,2,3,4,5].map(i => (
            <Typography key={i} sx={{ color: '#fff', fontWeight: 900, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              • SECURE AUDIT • AI POWERED • DPDP COMPLIANT • 0.8s ANALYSIS • STUDENT PROTECTION •
            </Typography>
          ))}
        </Box>
      </Box>

      {/* How It Works */}
      <Box sx={{ py: { xs: 10, md: 16 }, bgcolor: isDark ? '#111' : '#f5f5f5' }}>
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
                  <Box className="nb-shadow" sx={{ 
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
              <Box className="nb-shadow" sx={{ 
                p: { xs: 4, md: 6 }, border: '3px solid', borderColor: isDark ? '#fefefe' : '#111827', height: '100%',
                bgcolor: isDark ? '#1a1a1a' : '#fff'
              }}>
                <Box sx={{ bgcolor: 'error.main', color: '#fff', px: 2, py: 0.5, border: '2px solid', borderColor: isDark ? '#fefefe' : '#111827', display: 'inline-block', fontWeight: 900, mb: 4, fontSize: '0.7rem' }}>CORE INTELLIGENCE</Box>
                <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, textTransform: 'uppercase' }}>Negative Clause Intelligence</Typography>
                <Typography sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '1.1rem', mb: 4, maxWidth: 500 }}>
                  We don't just find what's there — we find what's missing. Our AI flags critical omissions that traditional scanners miss.
                </Typography>
                <Grid container spacing={2}>
                  {['Institutional Dashboard', 'Legal Evidence Snippets', 'Risk Categorization', 'PDF Intelligence Briefs'].map(f => (
                    <Grid size={{ xs: 12, sm: 6 }} key={f}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                         <CheckCircle sx={{ color: 'success.main', fontSize: 24 }} />
                         <Typography sx={{ fontWeight: 800 }}>{f}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, height: '100%' }}>
                <Box className="nb-shadow" sx={{ p: 5, border: '3px solid', borderColor: isDark ? '#fefefe' : '#111827', bgcolor: 'primary.main', color: '#fff', cursor: 'pointer' }} onClick={() => router.push('/compare')}>
                  <CompareArrows sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>SIDE-BY-SIDE</Typography>
                  <Typography sx={{ fontWeight: 600, opacity: 0.9 }}>Compare vendor policies and pick the safest choice for your school.</Typography>
                </Box>
                <Box className="nb-shadow" sx={{ p: 5, border: '3px solid', borderColor: isDark ? '#fefefe' : '#111827', bgcolor: 'success.main', color: '#fff', cursor: 'pointer' }}>
                  <VerifiedUser sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>ZERO RETAIN</Typography>
                  <Typography sx={{ fontWeight: 600, opacity: 0.9 }}>We never store institutional data. All analysis is ephemeral and secure.</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Banner / CTA */}
      <Box sx={{ py: 12, bgcolor: isDark ? '#000' : '#fefefe' }}>
        <Container maxWidth="lg">
          <Box className="nb-shadow" sx={{ 
            p: { xs: 4, md: 8 }, border: '4px solid', borderColor: isDark ? '#fefefe' : '#111827', bgcolor: 'warning.main', textAlign: 'center',
            position: 'relative'
          }}>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, textTransform: 'uppercase', letterSpacing: '-0.04em', color: '#000' }}>Ready for a safer Digital India?</Typography>
            <Typography sx={{ fontWeight: 800, mb: 6, fontSize: '1.2rem', color: '#000', opacity: 0.8 }}>Join 50+ schools auditing their platform privacy with PolicyProbe.</Typography>
            <Button variant="contained" size="large" onClick={() => router.push('/analyze')}
              sx={{ 
                px: 8, py: 2.5, fontSize: '1.2rem', fontWeight: 900, borderRadius: 0, 
                bgcolor: '#111827', color: '#fff', border: '3px solid #111827',
                boxShadow: '5px 5px 0px rgba(0,0,0,0.3)',
                '&:hover': { bgcolor: '#000', transform: 'translate(-2px,-2px)', boxShadow: '7px 7px 0px rgba(0,0,0,0.3)' }
              }}>
              START FREE AUDIT NOW
            </Button>
            <Warning sx={{ position: 'absolute', top: 20, left: 20, fontSize: 40, opacity: 0.2, color: '#111827' }} />
            <Warning sx={{ position: 'absolute', bottom: 20, right: 20, fontSize: 40, opacity: 0.2, color: '#111827' }} />
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

