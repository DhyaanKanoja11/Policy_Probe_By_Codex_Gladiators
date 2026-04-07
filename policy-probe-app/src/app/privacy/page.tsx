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
                <Storage /> 1. ABSOLUTE ZERO DATA COLLECTION
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

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
            <Box className="nb-shadow" sx={{ p: 4, border: '3px solid #000', bgcolor: 'success.main', color: '#fff' }}>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Shield /> 2. ZERO-TRACKER GUARANTEE
              </Typography>
              <Typography sx={{ lineHeight: 1.8, fontWeight: 800 }}>
                We do not track users. We do not use advertising. We do not collect cookies. We rigidly prohibit third-party data sharing. Your privacy audits remain entirely confidential and isolated. Absolutely no data is shared or sold.
              </Typography>
            </Box>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <Box className="nb-shadow" sx={{ p: 4, border: '3px solid #000', bgcolor: 'background.paper' }}>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 2.5, textTransform: 'uppercase', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DeleteForever /> 3. COMPLIANCE & ERASURE
              </Typography>
              <Typography sx={{ lineHeight: 1.8, fontWeight: 700, color: 'text.secondary', mb: 2 }}>
                Under Section 12 of the DPDP Act, data is immediately deleted. Policy Probe enforces a Zero-Retention Architecture. No search history is stored, and all data is purged instantly. Furthermore, we explicitly comply with global privacy standards:
              </Typography>
              <Box component="ul" sx={{ color: 'text.secondary', fontWeight: 700, lineHeight: 1.8, pl: 3 }}>
                <li><strong>COPPA (Children's Privacy):</strong> We absolutely do not collect, process, or store any personal data from children under 13. Parental consent is inherently managed by zero collection.</li>
                <li><strong>FERPA (Student Privacy):</strong> We do not access or store any educational records. We act in full compliance with FERPA.</li>
                <li><strong>GDPR (European Data):</strong> We do not collect or transfer personal data. We are fully compliant with GDPR data minimization principles.</li>
              </Box>
            </Box>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}>
            <Box className="nb-shadow" sx={{ p: 4, border: '3px solid #000', bgcolor: 'background.paper' }}>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 2.5, textTransform: 'uppercase', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Gavel /> 4. DATA PROCESSING TABLE (DPDP SECTION 10)
              </Typography>
              <Box sx={{ border: '2px solid #000', overflowX: 'auto', mb: 3 }}>
                <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', bgcolor: '#fefefe', color: '#000' }}>
                  <Box component="thead">
                    <Box component="tr" sx={{ borderBottom: '2px solid #000', bgcolor: 'rgba(77,142,255,0.05)' }}>
                      <Box component="th" sx={{ p: 1.5, textAlign: 'left', fontWeight: 900, borderRight: '1px solid #000', fontSize: '0.8rem' }}>Category</Box>
                      <Box component="th" sx={{ p: 1.5, textAlign: 'left', fontWeight: 900, borderRight: '1px solid #000', fontSize: '0.8rem' }}>Purpose</Box>
                      <Box component="th" sx={{ p: 1.5, textAlign: 'left', fontWeight: 900, fontSize: '0.8rem' }}>Retention</Box>
                    </Box>
                  </Box>
                  <Box component="tbody">
                    <Box component="tr" sx={{ borderBottom: '1px solid #000' }}>
                      <td style={{ padding: '12px', borderRight: '1px solid #000', fontWeight: 800, fontSize: '0.75rem' }}>Audit Logs</td>
                      <td style={{ padding: '12px', borderRight: '1px solid #000', fontSize: '0.75rem', fontWeight: 600 }}>Security Checks</td>
                      <td style={{ padding: '12px', fontSize: '0.75rem', fontWeight: 600 }}>24 Hours then erased</td>
                    </Box>
                    <Box component="tr">
                      <td style={{ padding: '12px', borderRight: '1px solid #000', fontWeight: 800, fontSize: '0.75rem' }}>User Input</td>
                      <td style={{ padding: '12px', borderRight: '1px solid #000', fontSize: '0.75rem', fontWeight: 600 }}>Policy Auditing</td>
                      <td style={{ padding: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Immediate Deletion</td>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Typography sx={{ lineHeight: 1.8, fontWeight: 700, color: 'text.secondary', mb: 2 }}>
                We collect exactly zero personal information. Under the Digital Personal Data Protection Act 2023, you have absolute rights:
              </Typography>
              <Box component="ul" sx={{ color: 'text.secondary', fontWeight: 700, lineHeight: 1.8, pl: 3 }}>
                <li><strong>Right of Access:</strong> Transparent view of how we work.</li>
                <li><strong>Right of Erasure:</strong> All data is purged instantly, ensuring absolute zero residual trails.</li>
                <li><strong>Right of Withdrawal:</strong> Stop processing any request at any time.</li>
              </Box>
            </Box>
          </motion.div>

        </Box>
      </Container>
    </Box>
  );
}
