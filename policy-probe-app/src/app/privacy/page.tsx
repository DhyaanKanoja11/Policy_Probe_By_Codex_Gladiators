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
              title: "1. Data Collection & Deletion Guarantee",
              content: (
                <>
                  <Typography sx={{ mb: 2 }}>We absolutely guarantee that Policy Probe acts as a secure, ephemeral processor. We commit to a strict protocol where <strong>all data is completely deleted after you close the website.</strong> There are no exceptions to this rule.</Typography>
                  <Box sx={{ pl: 2, borderLeft: '4px solid', borderColor: 'primary.main', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', p: 3 }}>
                    <Typography sx={{ fontWeight: 900, mb: 1.5 }}>COLLECTION SCOPE: <Box component="span" sx={{ fontWeight: 600 }}>We exclusively ingest public URLs. We do not track, profile, or collect personal device identifiers.</Box></Typography>
                    <Typography sx={{ fontWeight: 900 }}>DELETION PROMISE: <Box component="span" sx={{ fontWeight: 600 }}>Closing your browser tab immediately executes a zero-recoverability wipe of your session data.</Box></Typography>
                  </Box>
                </>
              )
            },
            {
              title: "2. Third-Party Sharing & Secure Processing",
              content: "We strictly limit any third-party sharing for proper algorithm analysis only. This sharing is routed exclusively through secure TLS and SSL layering to our trusted analytical partners (Google Gemini, Exodus Privacy). We guarantee that your personal IP address and browser footprints are stripped prior to this secure transfer, acting as a complete privacy firewall."
            },
            {
              title: "3. Absolute Security & SSL Layering",
              content: "We commit to enforcing the highest cryptographic standards available. All audit logic and data streams are protected by advanced SSL layering and TLS 1.3 tunnels. Our infrastructure is fundamentally designed to execute entirely in volatile server memory (RAM), guaranteeing physical inability to write your data to any permanent database."
            },
            {
              title: "4. Explicit Rights & Consent Structure",
              content: (
                <>
                  <Typography sx={{ mb: 2 }}>We operate strictly under your specific, informed consent. We uphold the following absolute rights:</Typography>
                  <Box component="ul" sx={{ fontWeight: 800, pl: 3, lineHeight: 2 }}>
                    <li><strong>Right to Erasure:</strong> Achieved instantly when you close the website.</li>
                    <li><strong>Right to Safety:</strong> Ensured via our strict TLS and SSL layering protocols.</li>
                    <li><strong>Right to Withdrawal:</strong> You can completely terminate processing by ending your session.</li>
                  </Box>
                </>
              )
            },
            {
              title: "5. Child & Student Privacy (COPPA/FERPA)",
              content: "We absolutely commit to the protection of minors. We do not intake, process, or ever request children's PII or student educational records. Policy Probe is an infrastructure tool, maintaining safe boundaries for all users universally."
            },
            {
              title: "6. Regulatory Compliance Shield",
              content: (
                <Grid container spacing={3}>
                  {[
                    { label: "DPDP Act (India)", status: "COMPLIANT", color: "success.main" },
                    { label: "GDPR (EU)", status: "SECURED", color: "info.main" },
                  ].map((cell, i) => (
                    <Grid size={{ xs: 6 }} key={i}>
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
              title: "7. Dedicated Grievance Redressal",
              content: (
                <Box sx={{ p: 4, border: '4px solid #000', bgcolor: 'primary.main', color: '#fff' }}>
                  <Typography sx={{ fontWeight: 900, mb: 2, textTransform: 'uppercase' }}>Chief Grievance Officer: CODEX Lead</Typography>
                  <Typography sx={{ fontWeight: 700, mb: 1 }}>Contact: <Box component="span" sx={{ textDecoration: 'underline' }}>privacy@policyprobe.io</Box></Typography>
                  <Typography sx={{ fontWeight: 700 }}>Resolution Protocol: We guarantee a response and resolution mapping within 24 hours.</Typography>
                </Box>
              )
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
