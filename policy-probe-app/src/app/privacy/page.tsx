'use client';
import React from 'react';
import { Box, Container, Typography, useTheme, Chip, Grid } from '@mui/material';
import { motion, Variants } from 'framer-motion';
import { VerifiedUser, Gavel, Storage, Shield, Person, DeleteForever } from '@mui/icons-material';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } })
};

export default function PrivacyPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, minHeight: '85vh', bgcolor: isDark ? '#000' : '#fefefe' }}>
      <Container maxWidth="md">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <Box className="nb-shadow" sx={{ 
            p: { xs: 4, md: 6 }, border: '3px solid #000', bgcolor: 'primary.main', color: '#fff', mb: 8,
            textAlign: 'center', position: 'relative', overflow: 'hidden'
          }}>
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Chip 
                label="DPDP ACT 2023 COMPLIANT" 
                sx={{ 
                  bgcolor: '#fff', color: '#000', fontWeight: 900, mb: 3, 
                  borderRadius: 0, border: '2px solid #000' 
                }} 
              />
              <Typography variant="h2" sx={{ fontFamily: '"Manrope"', fontWeight: 900, mb: 1, textTransform: 'uppercase', letterSpacing: '-0.06em', fontSize: { xs: '2.2rem', md: '3.5rem' } }}>
                Transparency Shield
              </Typography>
              <Typography sx={{ fontWeight: 800, opacity: 0.9, fontSize: '1.1rem' }}>
                Forensic Audit Documentation for Policy Probe (v1.2)
              </Typography>
            </Box>
            <Shield sx={{ position: 'absolute', right: -20, top: -20, fontSize: 180, opacity: 0.1, color: '#fff' }} />
          </Box>
        </motion.div>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            <Box className="nb-shadow" sx={{ p: 4, border: '3px solid #000', bgcolor: 'background.paper' }}>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 2.5, textTransform: 'uppercase', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Person /> 1. DATA FIDUCIARY & GRIEVANCE
              </Typography>
              <Typography sx={{ lineHeight: 1.8, fontWeight: 700, color: 'text.secondary', mb: 3 }}>
                Policy Probe is managed by <strong>CODEX GLADIATORS</strong>, acting as the primary Data Fiduciary. In compliance with the Digital Personal Data Protection (DPDP) Act 2023, we have appointed a Grievance Officer within India.
              </Typography>
              <Box sx={{ p: 3, border: '2px solid #000', bgcolor: isDark ? 'rgba(77,142,255,0.05)' : '#f8f9fa' }}>
                <Typography sx={{ fontWeight: 900, mb: 0.5 }}>OFFICER: Institutional Compliance Lead</Typography>
                <Typography sx={{ fontWeight: 900, mb: 0.5 }}>CONTACT: privacy@policyprobe.live</Typography>
                <Typography sx={{ fontWeight: 900 }}>LOCATION: New Delhi, India</Typography>
              </Box>
            </Box>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
            <Box className="nb-shadow" sx={{ p: 4, border: '3px solid #000', bgcolor: 'background.paper' }}>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 2.5, textTransform: 'uppercase', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Storage /> 2. STATELESS DATA PROCESSING
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'success.main', mb: 1 }}>DATA WE PROCESS</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, opacity: 0.8 }}>Public URLs submitted for audit purposes. This data is handled ephemerally and processed in volatile memory only.</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'error.main', mb: 1 }}>DATA WE REJECT</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, opacity: 0.8 }}>We explicitly reject PII, biometric data, browser fingerprints, precise geolocation, device hardware IDs, and payment details.</Typography>
                </Grid>
              </Grid>
            </Box>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <Box className="nb-shadow" sx={{ p: 4, border: '3px solid #000', bgcolor: 'success.main', color: '#fff' }}>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Shield /> 3. ZERO-TRACKER GUARANTEE
              </Typography>
              <Typography sx={{ lineHeight: 1.8, fontWeight: 800 }}>
                Our platform operates on a Tracker-Free Protocol. We have completely eliminated third-party analytics scripts, marketing pixels, and behavioral beacons. Your privacy audits remain entirely confidential and isolated from any advertising networks.
              </Typography>
            </Box>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}>
            <Box className="nb-shadow" sx={{ p: 4, border: '3px solid #000', bgcolor: 'background.paper' }}>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 2.5, textTransform: 'uppercase', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DeleteForever /> 4. RETENTION & ERASURE
              </Typography>
              <Typography sx={{ lineHeight: 1.8, fontWeight: 700, color: 'text.secondary' }}>
                Under Section 12 of the DPDP Act, data must be deleted once its purpose is fulfilled. Policy Probe enforces a Zero-Retention Architecture. No search history is stored, no long-term databases are maintained, and all analysis artifacts are purged from the server memory the moment your session concludes.
              </Typography>
            </Box>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5}>
            <Box className="nb-shadow" sx={{ p: 4, border: '3px solid #000', bgcolor: 'background.paper' }}>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 2.5, textTransform: 'uppercase', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Gavel /> 5. CONSENT & USER SOVEREIGNTY
              </Typography>
              <Typography sx={{ lineHeight: 1.8, fontWeight: 700, color: 'text.secondary', mb: 2 }}>
                Every audit request is an act of explicit consent. You retain the right to:
              </Typography>
              <Box component="ul" sx={{ color: 'text.secondary', fontWeight: 700, lineHeight: 1.8, pl: 3 }}>
                <li><strong>Right of Access:</strong> Transparent view of how we analyze policies.</li>
                <li><strong>Right of Erasure:</strong> All data is purged by design, ensuring no residual footprints.</li>
                <li><strong>Right of Withdrawal:</strong> Stop processing any URL request at any time.</li>
              </Box>
            </Box>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6}>
            <Box className="nb-shadow" sx={{ p: 3, border: '3px solid #000', bgcolor: 'warning.main', textAlign: 'center' }}>
              <VerifiedUser sx={{ fontSize: 32, mb: 1 }} />
              <Typography sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
                Open-Source Verification: Verified By Researchers 100% Transparency
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
