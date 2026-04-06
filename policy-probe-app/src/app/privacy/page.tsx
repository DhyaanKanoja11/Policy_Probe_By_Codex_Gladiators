'use client';
import React from 'react';
import { Box, Container, Typography, useTheme, Chip } from '@mui/material';
import { motion, Variants } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } })
};

export default function PrivacyPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, minHeight: '85vh', bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <Box sx={{ mb: 6 }}>
            <Chip label="DPDP COMPLIANT" sx={{ bgcolor: isDark ? 'rgba(77,142,255,0.1)' : '#e6f0ff', color: 'primary.main', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.15em', mb: 3, borderRadius: 0, border: '1px solid', borderColor: 'primary.main' }} />
            <Typography variant="h2" sx={{ fontFamily: '"Manrope"', fontWeight: 900, mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
              The Full Privacy Policy
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
              Built By: CODEX GLADIATORS
            </Typography>
          </Box>
        </motion.div>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: 'text.primary' }}>
              1. Our Philosophy: "Audit the App, Not the User"
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
              PolicyProbe is an open-source privacy forensics engine. Our mission is to deconstruct educational technology platforms to protect student data. Because of this, our platform operates on a strict principle of data minimization. We do not want your data, and we do not collect it.
            </Typography>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: 'text.primary' }}>
              2. What Information We Collect (And What We Don’t)
            </Typography>
            <Box component="ul" sx={{ color: 'text.secondary', lineHeight: 1.7, pl: 3, m: 0 }}>
              <li><strong>We Do Not Collect PII:</strong> We do not require you to create an account, provide an email address, or log in to use the audit tool. We do not collect Personally Identifiable Information (PII).</li>
              <li><strong>What We Process:</strong> The only data we process is the App Store URL or Web Domain you submit into the search bar.</li>
            </Box>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: 'text.primary' }}>
              3. How We Process the Data (The "Under the Hood" Transparency)
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>
              When you submit a URL for auditing, here is exactly what happens:
            </Typography>
            <Box component="ol" sx={{ color: 'text.secondary', lineHeight: 1.7, pl: 3, m: 0 }}>
              <li><strong>Local Scraping:</strong> Our Node.js backend fetches the public metadata and privacy policy text of the requested app.</li>
              <li><strong>API Processing:</strong> We securely transmit the publicly available privacy policy text to Google's Gemini API for linguistic analysis and the Exodus Privacy API for tracker identification.</li>
              <li><strong>No Cross-Linking:</strong> We do not link the URLs you search for with your IP address or browser fingerprint.</li>
            </Box>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: 'text.primary' }}>
              4. Data Retention (Ephemeral Architecture)
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
              We do not store your search history. Once the POST request is resolved and the "Privacy Risk Report" is generated on your screen, the session data is wiped from our active memory. There are no databases storing "who searched for what."
            </Typography>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: 'text.primary' }}>
              5. Cookies and Tracking
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
              We do not use tracking cookies, marketing pixels, or third-party analytics (like Google Analytics or Meta Pixel) on the PolicyProbe dashboard.
            </Typography>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: 'text.primary' }}>
              6. Compliance (DPDP Act 2023)
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
              PolicyProbe is designed to be fully compliant with India's Digital Personal Data Protection (DPDP) Act of 2023. By not collecting personal data, we eliminate the risk of data breaches on our end.
            </Typography>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: 'text.primary' }}>
              7. Open Source Verification
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
              Don't just take our word for it. Our codebase is open-source. Any security researcher or student can inspect our GitHub repository to verify that our data pipeline behaves exactly as described above.
            </Typography>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
