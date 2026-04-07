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
              title: "1. Zero-Data Architecture and Collection Scope",
              content: (
                <>
                  <Typography sx={{ mb: 2 }}>PolicyProbe operates on a strict zero-trust, zero-retention architecture. We do not collect, store, or process Personally Identifiable Information (PII), device identifiers, or location data from our users.</Typography>
                  <Box sx={{ pl: 2, borderLeft: '3px solid', borderColor: 'primary.main' }}>
                    <Typography sx={{ fontWeight: 800, mb: 1 }}>What you provide: <Box component="span" sx={{ fontWeight: 400 }}>The only input processed is the public App Store URL or Web Domain submitted into the search bar.</Box></Typography>
                    <Typography sx={{ fontWeight: 800 }}>What we collect: <Box component="span" sx={{ fontWeight: 400 }}>Nothing. We do not use cookies, analytics SDKs, or session trackers.</Box></Typography>
                  </Box>
                </>
              )
            },
            {
              title: "2. Third-Party Processing and Data Sharing",
              content: "PolicyProbe does not share, sell, or rent user data to any third parties. To generate the audit, our backend utilizes external APIs (Google Gemini, Exodus Privacy). Crucially, no user data is transmitted to these services. We exclusively transmit the public text and public metadata of the target application you are auditing. Your IP address and browser footprint are stripped locally before any external API request is made."
            },
            {
              title: "3. Security Measures and Encryption Practices",
              content: "All communications between your browser and the PolicyProbe server are secured using industry-standard TLS 1.3 encryption. Data processed during the active audit is handled exclusively in secure, isolated server memory (RAM) and is never written to a physical disk or database."
            },
            {
              title: "4. Data Retention and Deletion Mechanism",
              content: (
                <>
                  <Typography sx={{ mb: 2 }}>PolicyProbe utilizes an ephemeral processing model.</Typography>
                  <Box sx={{ pl: 2, borderLeft: '3px solid', borderColor: 'primary.main' }}>
                    <Typography sx={{ fontWeight: 800, mb: 1 }}>Retention: <Box component="span" sx={{ fontWeight: 400 }}>The URL query and subsequent report exist only for the duration of your active session. Once the audit report is rendered on your screen, all associated session memory is immediately and permanently destroyed.</Box></Typography>
                    <Typography sx={{ fontWeight: 800 }}>Data Deletion Procedures: <Box component="span" sx={{ fontWeight: 400 }}>Because we maintain no databases and store no user profiles, there is no historical data to delete. Users can execute a complete data deletion of their active session at any time simply by closing the browser tab.</Box></Typography>
                  </Box>
                </>
              )
            },
            {
              title: "5. Child Privacy and COPPA/FERPA Compliance",
              content: "PolicyProbe is an auditing tool, not a consumer application. We strictly comply with the Children's Online Privacy Protection Act (COPPA) and the Family Educational Rights and Privacy Act (FERPA). We do not knowingly collect or solicit any information from children under the age of 13, nor do we access, process, or store student educational records."
            },
            {
              title: "6. Regulatory Compliance Matrix",
              content: (
                <>
                  <Typography sx={{ fontWeight: 800, mb: 1 }}>DPDP Act 2023 (India):</Typography>
                  <Typography sx={{ mb: 2 }}>PolicyProbe processes zero personal principal data. We strictly adhere to the DPDP Act’s mandates for purpose limitation. Because no personal data is collected, the risks of data breach or unauthorized processing are structurally eliminated.</Typography>
                  <Typography sx={{ fontWeight: 800, mb: 1 }}>GDPR (EU):</Typography>
                  <Typography>Under the General Data Protection Regulation, users possess the right to access, rectify, and erase personal data. PolicyProbe fulfills these rights by default through our zero-retention architecture; we hold no data to be accessed, rectified, or erased.</Typography>
                </>
              )
            },
            {
              title: "7. Policy Updates",
              content: "This policy is static and dictates the core architecture of the PolicyProbe platform. We will not alter this policy to allow for data collection or tracking in the future."
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
