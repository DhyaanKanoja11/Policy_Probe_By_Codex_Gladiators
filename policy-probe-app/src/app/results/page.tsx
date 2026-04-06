'use client';
import React, { Suspense, useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Button, useTheme } from '@mui/material';
import { ArrowBack, CompareArrows, Download } from '@mui/icons-material';
import { motion, Variants } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnalysisResult } from '@/lib/types';
import RiskOverview from '@/components/results/RiskOverview';
import ScoreBreakdownChart from '@/components/results/ScoreBreakdownChart';
import RiskReasoningCard from '@/components/results/RiskReasoningCard';
import { DataCollectedCard, ThirdPartyCard, RedFlagsCard, StrengthsCard, ChildSafetyCard, SummaryCard } from '@/components/results/DetailCards';
import DeepAuditCard from '@/components/results/DeepAuditCard';
import ComplianceCard from '@/components/results/ComplianceCard';
import IntegrityCard from '@/components/results/IntegrityCard';
import LoadingSkeleton from '@/components/results/LoadingSkeleton';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }),
};

function ResultsContent() {
  const theme = useTheme();
  const router = useRouter();
  const params = useSearchParams();
  const isDark = theme.palette.mode === 'dark';
  const source = params.get('source');
  const demoKey = params.get('demo') || 'google-classroom';

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeepAudit, setShowDeepAudit] = useState(false);

  useEffect(() => {
    const isDeepAudit = sessionStorage.getItem('deep-audit-requested') === 'true';
    setShowDeepAudit(isDeepAudit);

    if (source === 'live') {
      const stored = sessionStorage.getItem('analysis-result');
      if (stored) {
        try { 
          const parsed = JSON.parse(stored);
          setResult(parsed); 
        } catch { 
           router.push('/analyze');
        }
      } else {
         router.push('/analyze');
      }
    } else {
       router.push('/analyze');
    }
    // Simulate brief loading for animation
    setTimeout(() => setLoading(false), 600);
  }, [source, router]);

  if (loading || !result) return <LoadingSkeleton />;

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Box className="no-print" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => router.push('/analyze')} sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.85rem' }}>
            New Analysis
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" startIcon={<CompareArrows />} onClick={() => router.push('/compare')}
              sx={{ borderColor: theme.palette.divider, fontWeight: 600, fontSize: '0.85rem', borderRadius: 3, '&:hover': { borderColor: 'primary.main' } }}>
              Compare Apps
            </Button>
            <Button variant="contained" startIcon={<Download />} onClick={() => window.print()}
              sx={{ fontWeight: 600, fontSize: '0.85rem', borderRadius: 3, background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${isDark ? '#005ac2' : theme.palette.primary.dark})` }}>
              Audit PDF
            </Button>
          </Box>
        </Box>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <RiskOverview result={result} />
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.5}>
          <IntegrityCard check={result.integrity_check} />
        </motion.div>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, lg: 5 }}>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
              <ScoreBreakdownChart breakdown={result.score_breakdown} />
            </motion.div>
          </Grid>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {showDeepAudit && result.deep_audit && (
                <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1.5}>
                  <DeepAuditCard audit={result.deep_audit} />
                </motion.div>
              )}
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1.75}>
                <ComplianceCard flags={result.compliance_flags} />
              </motion.div>
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                <RiskReasoningCard reasons={result.risk_reasons} overallScore={result.overall_score} />
              </motion.div>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
                    <DataCollectedCard data={result.data_collected} />
                  </motion.div>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}>
                    <ThirdPartyCard data={result.third_party_sharing} />
                  </motion.div>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5}>
                    <RedFlagsCard flags={result.red_flags} />
                  </motion.div>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6}>
                    <StrengthsCard strengths={result.strengths} />
                  </motion.div>
                </Grid>
              </Grid>
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7}>
                <ChildSafetyCard flags={result.child_data_flags} />
              </motion.div>
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={8}>
                <SummaryCard summary={result.summary_plain_english} recommendations={result.recommendations} />
              </motion.div>
            </Box>
          </Grid>
        </Grid>

        <Box className="print-disclaimer" sx={{ mt: 8, p: 3, borderTop: '2px solid', borderColor: 'divider', textAlign: 'center', '@media print': { display: 'block', mt: 4, pageBreakInside: 'avoid' } }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            DISCLAIMER: This is an AI-assisted analysis and should not be treated as legal advice.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ResultsContent />
    </Suspense>
  );
}
