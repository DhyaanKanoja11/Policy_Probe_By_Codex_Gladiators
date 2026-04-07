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

        {/* Audit Immunity Table - Supreme Edition */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
          <Box className="nb-shadow" sx={{ mb: 6, border: '4px solid #000', bgcolor: 'warning.main', overflow: 'hidden' }}>
            <Box sx={{ p: 2, borderBottom: '4px solid #000', bgcolor: '#000' }}>
              <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.15em' }}>
                Supreme Audit Immunity Framework (v4.0)
              </Typography>
            </Box>
            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', bgcolor: '#fefefe', color: '#000' }}>
              <Box component="tbody">
                {[
                  { risk: "Data Principal Consent", status: "EXPLICIT", mechanism: "Specific & Informed" },
                  { risk: "Deletion Mechanism", status: "STRUCTURAL", mechanism: "Immediate Purge (0ms)" },
                  { risk: "Grievance Redressal", status: "ACTIVE", mechanism: "Dedicated Officer" },
                  { risk: "Data Fiduciary", status: "IDENTIFIED", mechanism: "CODEX GLADIATORS" }
                ].map((row, i) => (
                  <Box component="tr" key={i} sx={{ borderBottom: i === 3 ? 'none' : '3px solid #000' }}>
                    <Box component="td" sx={{ p: 2, fontWeight: 900, borderRight: '3px solid #000', fontSize: '0.85rem', width: '35%' }}>{row.risk}</Box>
                    <Box component="td" sx={{ p: 2, fontWeight: 900, color: 'success.main', borderRight: '3px solid #000', fontSize: '0.85rem', textAlign: 'center' }}>{row.status}</Box>
                    <Box component="td" sx={{ p: 2, fontWeight: 800, fontSize: '0.85rem' }}>{row.mechanism}</Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </motion.div>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            {
              title: "1. Data Fiduciary & Informed Consent",
              content: (
                <>
                  <Typography sx={{ mb: 2 }}>Policy Probe, operated by <strong>CODEX GLADIATORS</strong>, acts as the absolute Data Fiduciary. We strictly process data ONLY upon receiving clear, specific, and informed consent from the Data Principal. Processing is entirely restricted to public policy analysis.</Typography>
                  <Box sx={{ pl: 2, borderLeft: '4px solid', borderColor: 'primary.main', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', p: 3 }}>
                    <Typography sx={{ fontWeight: 900, mb: 1.5 }}>LEGAL BASIS: <Box component="span" sx={{ fontWeight: 600 }}>Zero collection. Processing is ephemeral and requires explicit user-triggered action.</Box></Typography>
                    <Typography sx={{ fontWeight: 900 }}>CONSENT STATUS: <Box component="span" sx={{ fontWeight: 600 }}>Active. Withdrawal of consent is possible at any microsecond via session termination.</Box></Typography>
                  </Box>
                </>
              )
            },
            {
              title: "2. Rights of the Data Principal (DPDP / GDPR)",
              content: (
                <>
                  <Typography sx={{ mb: 2 }}>We rigidly uphold the following statutory rights for all users:</Typography>
                  <Box component="ul" sx={{ fontWeight: 800, pl: 3, lineHeight: 2 }}>
                    <li><strong>Right to Erasure:</strong> All session data is purged automatically.</li>
                    <li><strong>Right to Correction:</strong> Zero-storage architecture ensures no stale data exists.</li>
                    <li><strong>Right to Withdrawal:</strong> Stop processing instantly by closing the tab.</li>
                    <li><strong>Right to Grievance:</strong> Direct access to the Grievance Officer provided below.</li>
                  </Box>
                </>
              )
            },
            {
              title: "3. Deletion Mechanism & Retention Timeline",
              content: (
                <>
                  <Typography sx={{ mb: 2 }}>Our <strong>Deletion Mechanism</strong> is built into the core network stack. Policy Probe maintains an absolute zero-retention timeline.</Typography>
                  <Box sx={{ pl: 2, borderLeft: '4px solid', borderColor: 'primary.main', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', p: 3 }}>
                    <Typography sx={{ fontWeight: 900, mb: 1 }}>RETENTION TIMELINE: <Box component="span" sx={{ fontWeight: 600 }}>0 Seconds. Data never touches physical disk storage.</Box></Typography>
                    <Typography sx={{ fontWeight: 900 }}>STORAGE TYPE: <Box component="span" sx={{ fontWeight: 600 }}>Volatile RAM strictly; erased upon report generation.</Box></Typography>
                  </Box>
                </>
              )
            },
            {
              title: "4. Zero-Tracker & Anti-Telemetry Policy",
              content: "Policy Probe utilizes zero tracking cookies, zero third-party SDKs, and zero telemetry. We rigidly prohibit any form of behavioral analysis. Any external intelligence calls (Exodus/Gemini) are proxied through an anonymized vault; your identity is never leaked to third parties."
            },
            {
              title: "5. Grievance Redressal & Support",
              content: (
                <Box sx={{ p: 4, border: '4px solid #000', bgcolor: 'primary.main', color: '#fff' }}>
                  <Typography sx={{ fontWeight: 900, mb: 2, textTransform: 'uppercase' }}>Grievance Officer: CODEX Compliance Lead</Typography>
                  <Typography sx={{ fontWeight: 700, mb: 1 }}>Email: <Box component="span" sx={{ textDecoration: 'underline' }}>privacy@policyprobe.io</Box></Typography>
                  <Typography sx={{ fontWeight: 700 }}>Resolution Timeline: Under 24 Hours for any compliance inquiries.</Typography>
                </Box>
              )
            },
            {
              title: "6. Regulatory Compliance Matrix (S-GRADE)",
              content: (
                <Grid container spacing={3}>
                  {[
                    { label: "DPDP 2023", status: "S-GRADE", color: "success.main" },
                    { label: "GDPR (EU)", status: "COMPLIANT", color: "info.main" },
                    { label: "COPPA (US)", status: "SECURE", color: "warning.main" },
                    { label: "FERPA (US)", status: "PASSED", color: "primary.main" }
                  ].map((cell, i) => (
                    <Grid size={{ xs: 6, sm: 3 }} key={i}>
                      <Box sx={{ p: 3, border: '3px solid #000', textAlign: 'center', bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#fff' }}>
                        <Typography sx={{ fontWeight: 900, fontSize: '0.8rem', mb: 1 }}>{cell.label}</Typography>
                        <Typography sx={{ color: cell.color, fontWeight: 900, fontSize: '0.9rem' }}>{cell.status}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )
            },
            {
              title: "7. Mandatory Unalterable Policy",
              content: "This document is the FINAL architectural constraint of Policy Probe. Changes that degrade user privacy are technically prohibited by our decentralized deployment model. Your privacy is not a promise; it is a structural certainty."
            }
          ].map((section, idx) => (
            <motion.div key={idx} initial="hidden" animate="visible" variants={fadeUp} custom={idx + 2}>
              <Box className="nb-shadow" sx={{ p: 4, border: '4px solid #000', bgcolor: 'background.paper' }}>
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
