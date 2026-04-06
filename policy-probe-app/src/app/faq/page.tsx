'use client';
import React from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, useTheme, Chip } from '@mui/material';
import { ExpandMore, InfoOutlined } from '@mui/icons-material';
import { motion, Variants } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } })
};

const faqs = [
  {
    q: 'How is this different from ChatGPT summarizing a policy?',
    a: 'We don’t just summarize — we extract structured signals, apply a deterministic scoring model, and provide explainable, evidence-backed insights.'
  },
  {
    q: 'How accurate is your system?',
    a: 'We use a hybrid approach — rule-based extraction + AI interpretation — which reduces hallucination and improves consistency. We also provide a confidence score.'
  },
  {
    q: 'What about apps that hide behavior not mentioned in policies?',
    a: 'That’s a known limitation of policy-based systems. We address it partially through ambiguity detection and mismatch flags, and plan to extend into behavior analysis.'
  },
  {
    q: 'Why focus on India?',
    a: 'India has a massive EdTech user base and the DPDP Act makes privacy compliance critical. We’re building an India-first solution with global scalability.'
  },
  {
    q: 'Do you store user data?',
    a: 'No. Policy Probe uses a privacy-first architecture where analysis is session-based and data is not stored permanently.'
  },
  {
    q: 'Can this be used by institutions?',
    a: 'Yes. We are building an institutional mode for schools to audit apps before recommending them to students.'
  },
  {
    q: 'How scalable is this?',
    a: 'The system is cloud-based, uses modular architecture, and can scale horizontally. Cached results further improve performance.'
  },
  {
    q: 'What’s the business potential?',
    a: 'Freemium users, institutional audits, API integrations, and privacy certification — making it a strong SaaS opportunity.'
  }
];

export default function FAQPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, minHeight: '85vh', bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip label="JUDGE FAQS" sx={{ bgcolor: isDark ? 'rgba(77,142,255,0.1)' : '#e6f0ff', color: 'primary.main', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.15em', mb: 3, borderRadius: 0, border: '1px solid', borderColor: 'primary.main' }} />
            <Typography variant="h2" sx={{ fontFamily: '"Manrope"', fontWeight: 900, mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
              Methodology & Vision
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: '1.1rem', maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
              How Policy Probe achieves deterministic accuracy using AI, our scalable zero-trust architecture, and our alignment with the DPDP Act.
            </Typography>
          </Box>
        </motion.div>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {faqs.map((faq, i) => (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={i + 1} key={i}>
              <Accordion 
                disableGutters 
                elevation={0}
                sx={{ 
                  bgcolor: 'background.paper', 
                  border: '2px solid', 
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  borderRadius: '0 !important',
                  '&:before': { display: 'none' },
                  boxShadow: isDark ? '4px 4px 0px rgba(255,255,255,0.05)' : '4px 4px 0px rgba(0,0,0,0.05)',
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 3, py: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <InfoOutlined color="primary" sx={{ display: { xs: 'none', sm: 'block' } }} />
                    <Typography sx={{ fontWeight: 800, fontSize: '1.05rem' }}>{faq.q}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ px: { xs: 3, sm: 7 }, pb: 4, pt: 0 }}>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7, fontWeight: 500 }}>
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
