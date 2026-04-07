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
                Full Privacy Policy (Version 2.0) • Effective April 7, 2026
              </Typography>
            </Box>
            <Shield sx={{ position: 'absolute', right: -20, top: -20, fontSize: 180, opacity: 0.1, color: '#fff' }} />
          </Box>
        </motion.div>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            {
              title: "1. 0% Data Collection Commitment",
              content: (
                <>
                  <Typography sx={{ mb: 2 }}>Policy Probe is a zero-collection platform. We do not intake, observe, or store any personal identifiers. No usage statistics are recorded. No unique device fingerprints are generated. We operate with absolute purpose limitation.</Typography>
                  <Box sx={{ pl: 2, borderLeft: '3px solid', borderColor: 'primary.main', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', p: 2 }}>
                    <Typography sx={{ fontWeight: 900, mb: 1 }}>DATA INTAKE: <Box component="span" sx={{ fontWeight: 600 }}>Zero. We only process public document URLs provided for audit.</Box></Typography>
                    <Typography sx={{ fontWeight: 900 }}>COLLECTION SCOPE: <Box component="span" sx={{ fontWeight: 600 }}>Zero. We do not use cookies, trackers, or telemetry scripts.</Box></Typography>
                  </Box>
                </>
              )
            },
            {
              title: "2. Zero Third-Party Information Sharing",
              content: "User data is never shared, sold, or rented. Audit intelligence is gathered strictly from public-facing domain metadata. We act as a blind relay; no user identity, IP address, or browser footprint is ever transmitted to external services (including Google Gemini or Exodus). All external requests are anonymized at the server level before execution."
            },
            {
              title: "3. Volatile RAM Processing",
              content: "All audit logic executes exclusively in volatile server memory (RAM). Database writes are physically disabled for user-provided URLs. Analysis artifacts are never committed to permanent storage. This ensures that no data persists beyond the active processing cycle."
            },
            {
              title: "4. Instant Session Destruction",
              content: (
                <>
                  <Typography sx={{ mb: 2 }}>Policy Probe enforces a strict ephemeral session model.</Typography>
                  <Box sx={{ pl: 2, borderLeft: '3px solid', borderColor: 'primary.main', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', p: 2 }}>
                    <Typography sx={{ fontWeight: 900, mb: 1 }}>RETENTION: <Box component="span" sx={{ fontWeight: 600 }}>Zero. All session artifacts are destroyed the moment the audit report is generated.</Box></Typography>
                    <Typography sx={{ fontWeight: 900 }}>DELETION: <Box component="span" sx={{ fontWeight: 600 }}>Automatic. We maintain no user records. Closing the browser tab results in an absolute erasure of all session data.</Box></Typography>
                  </Box>
                </>
              )
            },
            {
              title: "5. Absolute Child & Student Privacy",
              content: "We are strictly compliant with the Children's Online Privacy Protection Act (COPPA) and the Family Educational Rights and Privacy Act (FERPA). We do not collect information from children under 13. We do not access, process, or store student educational records. Our platform is a public policy auditing tool, not a data-capturing service."
            },
            {
              title: "6. DPDP & GDPR Mandatory Alignment",
              content: (
                <>
                  <Typography sx={{ fontWeight: 900, mb: 1 }}>DPDP Act 2023 (India):</Typography>
                  <Typography sx={{ mb: 2 }}>We process zero personal principal data. We strictly fulfill the mandates for purpose limitation and data minimization. Without personal data collection, the risks of unauthorized processing are structurally impossible.</Typography>
                  <Typography sx={{ fontWeight: 900, mb: 1 }}>GDPR (European Union):</Typography>
                  <Typography>We exceed GDPR standards through data nihilism. Rights of access, rectification, and erasure are satisfied by default because no data exists to be accessed, rectified, or erased.</Typography>
                </>
              )
            },
            {
              title: "7. Unalterable Policy Architecture",
              content: "This policy is an architectural mandate, not a guideline. We will never introduce data collection or behavioral tracking to the Policy Probe platform. This commitment is final and hardcoded into our service deployment."
            }
          ].map((section, idx) => (
            <motion.div key={idx} initial="hidden" animate="visible" variants={fadeUp} custom={idx + 1}>
              <Box className="nb-shadow" sx={{ p: 4, border: '3px solid #000', bgcolor: 'background.paper' }}>
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 2.5, textTransform: 'uppercase', color: 'primary.main' }}>
                  {section.title}
                </Typography>
                {typeof section.content === 'string' ? (
                  <Typography sx={{ lineHeight: 1.8, fontWeight: 700, color: 'text.secondary' }}>
                    {section.content}
                  </Typography>
                ) : (
                  <Box sx={{ lineHeight: 1.8, fontWeight: 700, color: 'text.secondary' }}>
                    {section.content}
                  </Box>
                )}
              </Box>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
