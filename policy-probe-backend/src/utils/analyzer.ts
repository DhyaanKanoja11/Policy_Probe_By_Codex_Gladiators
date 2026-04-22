import { AnalysisResult, DataCategory, ThirdPartyEntry, RedFlag, RiskReason, ScoreBreakdown } from './types';

// Keyword sets for clause detection
const DATA_KEYWORDS = {
  personal: ['name', 'email', 'phone', 'address', 'age', 'birthday', 'birth date', 'profile', 'gender', 'photo'],
  usage: ['activity', 'usage', 'browsing', 'clickstream', 'log', 'interaction', 'session', 'time spent', 'history'],
  device: ['device', 'ip address', 'browser', 'operating system', 'hardware', 'identifier', 'cookie', 'pixel'],
  location: ['location', 'gps', 'geolocation', 'coordinates', 'geographic'],
  financial: ['payment', 'credit card', 'billing', 'financial', 'purchase', 'transaction'],
  educational: ['grade', 'score', 'assignment', 'course', 'enrollment', 'student', 'academic', 'attendance'],
  biometric: ['biometric', 'fingerprint', 'facial', 'voice', 'iris'],
};

const THIRD_PARTY_KEYWORDS = ['third party', 'third-party', 'partner', 'affiliate', 'vendor', 'advertiser', 'analytics', 'google analytics', 'facebook', 'meta'];
const CHILD_KEYWORDS = ['child', 'children', 'minor', 'student', 'under 13', 'under 16', 'coppa', 'ferpa', 'parental', 'school'];
const TRACKING_KEYWORDS = ['track', 'cookie', 'pixel', 'beacon', 'fingerprint', 'advertising', 'ad network', 'targeted', 'personalized ad', 'retarget'];
const RETENTION_KEYWORDS = ['retain', 'retention', 'delete', 'deletion', 'remove', 'erase', 'store', 'storage', 'keep', 'preserve'];
const RIGHTS_KEYWORDS = ['access', 'correct', 'delete', 'port', 'opt-out', 'opt out', 'withdraw consent', 'right to', 'request'];
const SECURITY_KEYWORDS = ['encrypt', 'ssl', 'tls', 'secure', 'security', 'protect', 'safeguard', 'firewall', 'audit'];
const VAGUE_KEYWORDS = ['may', 'might', 'could', 'possible', 'certain circumstances', 'as needed', 'as necessary', 'from time to time', 'at our discretion'];

export function countKeywordHits(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.filter(k => lower.includes(k)).length;
}

function detectDataCategories(text: string): DataCategory[] {
  const lower = text.toLowerCase();
  const categories: DataCategory[] = [];

  for (const [cat, keywords] of Object.entries(DATA_KEYWORDS)) {
    const found = keywords.filter(k => lower.includes(k));
    if (found.length > 0) {
      const risk = found.length >= 4 ? 'High' : found.length >= 2 ? 'Medium' : 'Low';
      categories.push({
        category: cat.charAt(0).toUpperCase() + cat.slice(1) + ' Information',
        items: found.map(f => f.charAt(0).toUpperCase() + f.slice(1)),
        risk,
      });
    }
  }
  return categories;
}

function detectThirdParties(text: string): ThirdPartyEntry[] {
  const lower = text.toLowerCase();
  const entries: ThirdPartyEntry[] = [];
  const found = THIRD_PARTY_KEYWORDS.filter(k => lower.includes(k));

  if (lower.includes('google analytics')) entries.push({ name: 'Google Analytics', purpose: 'Usage analytics and reporting', risk: 'Medium' });
  if (lower.includes('facebook') || lower.includes('meta')) entries.push({ name: 'Meta/Facebook', purpose: 'Advertising and social integration', risk: 'High' });
  if (lower.includes('advertiser') || lower.includes('ad network')) entries.push({ name: 'Advertising Networks', purpose: 'Targeted advertising', risk: 'High' });
  if (found.length > 0 && entries.length === 0) entries.push({ name: 'Third-Party Partners', purpose: 'Various services and analytics', risk: 'Medium' });

  return entries;
}

function detectRedFlags(text: string): RedFlag[] {
  const lower = text.toLowerCase();
  const flags: RedFlag[] = [];

  if (countKeywordHits(lower, VAGUE_KEYWORDS) >= 3) {
    flags.push({ title: 'Vague language detected', description: 'Policy uses non-committal phrases like "may," "might," or "as necessary" frequently, reducing accountability.', severity: 'Warning' });
  }
  if (countKeywordHits(lower, TRACKING_KEYWORDS) >= 3) {
    flags.push({ title: 'Extensive tracking practices', description: 'Policy references multiple tracking technologies including cookies, pixels, and/or ad networks.', severity: 'Critical' });
  }
  if (lower.includes('sell') && (lower.includes('data') || lower.includes('information'))) {
    flags.push({ title: 'Potential data selling', description: 'Policy language suggests user data may be sold to third parties.', severity: 'Critical' });
  }
  if (!lower.includes('delete') && !lower.includes('deletion') && !lower.includes('erase')) {
    flags.push({ title: 'No deletion mechanism mentioned', description: 'Policy does not describe how users can request deletion of their data.', severity: 'Critical' });
  }
  if (lower.includes('change') && lower.includes('policy') && lower.includes('without notice')) {
    flags.push({ title: 'Policy changes without notice', description: 'Company reserves the right to change the privacy policy without notifying users.', severity: 'Warning' });
  }

  return flags;
}

function detectStrengths(text: string): string[] {
  const lower = text.toLowerCase();
  const strengths: string[] = [];

  if (countKeywordHits(lower, SECURITY_KEYWORDS) >= 2) strengths.push('Security measures described');
  if (lower.includes('encrypt')) strengths.push('Encryption mentioned for data protection');
  if (lower.includes('opt-out') || lower.includes('opt out')) strengths.push('Opt-out mechanisms available');
  if (lower.includes('delete') || lower.includes('erasure')) strengths.push('Data deletion options mentioned');
  if (lower.includes('coppa') || lower.includes('ferpa')) strengths.push('Regulatory compliance referenced');
  if (!lower.includes('sell')) strengths.push('No indication of data selling');
  if (lower.includes('transparent') || lower.includes('transparency')) strengths.push('Commitment to transparency stated');

  return strengths;
}

function calculateReadability(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;
  const words = text.split(/\s+/).filter(w => w.length > 0).length || 1;
  const syllables = words * 1.5; // simplified
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateScoreBreakdown(text: string): ScoreBreakdown {
  const lower = text.toLowerCase();

  const dataHits = Object.values(DATA_KEYWORDS).reduce((sum, kw) => sum + countKeywordHits(lower, kw), 0);
  
  const tpHits = countKeywordHits(lower, THIRD_PARTY_KEYWORDS);
  const childHits = countKeywordHits(lower, CHILD_KEYWORDS);
  const vagueHits = countKeywordHits(lower, VAGUE_KEYWORDS);
  const rightsHits = countKeywordHits(lower, RIGHTS_KEYWORDS);
  const secHits = countKeywordHits(lower, SECURITY_KEYWORDS);
  const retHits = countKeywordHits(lower, RETENTION_KEYWORDS);
  
  const trackingHits = countKeywordHits(lower, TRACKING_KEYWORDS);
  const tracking_cookies = Math.min(5, Math.max(0, 5 - trackingHits * 2));

  const ambiguityHits = countKeywordHits(lower, VAGUE_KEYWORDS);
  const ambiguity = Math.min(5, Math.max(0, 5 - ambiguityHits * 2));

  // Scale other weights down to fit the strict 100 point total exactly
  const data_collection = Math.max(0, Math.min(20, 20 - dataHits * 3));
  const third_party_sharing = Math.max(0, Math.min(20, 20 - tpHits * 4));
  const child_safety = childHits >= 3 ? 15 : childHits >= 1 ? 10 : 3;
  const transparency = Math.max(0, Math.min(10, 10 - vagueHits * 2));
  const user_rights = Math.min(10, Math.max(0, rightsHits * 3));
  const security = Math.min(5, Math.max(0, secHits * 2));
  const retention_clarity = Math.min(10, Math.max(0, retHits * 3));

  return { data_collection, third_party_sharing, child_safety, transparency, user_rights, security, retention_clarity, tracking_cookies, ambiguity };
}

function buildRiskReasons(text: string, breakdown: ScoreBreakdown): RiskReason[] {
  const reasons: RiskReason[] = [];
  const lower = text.toLowerCase();

  if (breakdown.data_collection < 60) {
    reasons.push({ factor: 'Extensive data collection', impact: 'Negative', weight: 18, explanation: 'The policy describes collecting multiple categories of personal and usage data.' });
  } else {
    reasons.push({ factor: 'Moderate data collection', impact: 'Positive', weight: 12, explanation: 'Data collection appears limited to essential categories.' });
  }

  if (breakdown.third_party_sharing < 60) {
    reasons.push({ factor: 'Third-party data sharing', impact: 'Negative', weight: 15, explanation: 'Data is shared with multiple third-party services or partners.' });
  }

  if (breakdown.child_safety >= 70) {
    reasons.push({ factor: 'Child privacy protections', impact: 'Positive', weight: 15, explanation: 'Policy references specific child privacy regulations and protections.' });
  } else if (countKeywordHits(lower, CHILD_KEYWORDS) === 0) {
    reasons.push({ factor: 'No child privacy considerations', impact: 'Negative', weight: 20, explanation: 'Policy does not mention protections for children or minors.' });
  }

  if (breakdown.transparency < 50) {
    reasons.push({ factor: 'Vague policy language', impact: 'Negative', weight: 12, explanation: 'Frequent use of non-committal language reduces trust and accountability.' });
  }

  if (breakdown.security >= 70) {
    reasons.push({ factor: 'Security commitments', impact: 'Positive', weight: 10, explanation: 'Policy describes specific security measures and encryption.' });
  }

  if (breakdown.user_rights >= 60) {
    reasons.push({ factor: 'User rights provisions', impact: 'Positive', weight: 10, explanation: 'Users are provided with rights to access, correct, or delete their data.' });
  }

  if (countKeywordHits(lower, TRACKING_KEYWORDS) >= 3) {
    reasons.push({ factor: 'Tracking and advertising', impact: 'Negative', weight: 16, explanation: 'Multiple tracking technologies and advertising practices detected.' });
  }

  return reasons;
}

export function analyzePolicy(text: string, appName: string = 'Unknown App', policyUrl?: string): AnalysisResult {
  const data_collected = detectDataCategories(text);
  const third_party_sharing = detectThirdParties(text);
  const red_flags = detectRedFlags(text);
  const strengths = detectStrengths(text);
  const readability_score = calculateReadability(text);
  const score_breakdown = calculateScoreBreakdown(text);
  const risk_reasons = buildRiskReasons(text, score_breakdown);

  const lower = text.toLowerCase();
  const child_data_flags = CHILD_KEYWORDS.filter(k => lower.includes(k)).map(k =>
    `References "${k}" in the privacy policy`
  );

  const user_rights = RIGHTS_KEYWORDS.filter(k => lower.includes(k)).map(k =>
    `${k.charAt(0).toUpperCase() + k.slice(1)} rights mentioned`
  );

  const security_commitments = SECURITY_KEYWORDS.filter(k => lower.includes(k)).map(k =>
    `${k.charAt(0).toUpperCase() + k.slice(1)} measures described`
  );

  const sensitive_data_flags = [
    ...(data_collected.filter(d => d.risk === 'High').map(d => `High-risk: ${d.category}`)),
    ...(child_data_flags.length > 0 ? ['Processes data related to minors'] : []),
  ];

  // Calculate overall score deterministically (Sum of breakdown)
  const overall_score = Math.round(
    score_breakdown.data_collection + score_breakdown.third_party_sharing + score_breakdown.child_safety + 
    score_breakdown.retention_clarity + score_breakdown.user_rights + score_breakdown.transparency + 
    score_breakdown.security + score_breakdown.tracking_cookies + score_breakdown.ambiguity
  );

  const risk_level = overall_score >= 70 ? 'Low' : overall_score >= 50 ? 'Medium' : 'High';
  let privacy_grade: 'A' | 'B' | 'C' | 'D' = 'D';
  if (overall_score >= 85) privacy_grade = 'A';
  else if (overall_score >= 70) privacy_grade = 'B';
  else if (overall_score >= 50) privacy_grade = 'C';
  
  const transparency_score = score_breakdown.transparency * 10;

  // Retention policy detection
  const retSentences = text.split(/[.!?]+/).filter(s =>
    RETENTION_KEYWORDS.some(k => s.toLowerCase().includes(k))
  );
  const retention_policy = retSentences.length > 0
    ? retSentences[0].trim()
    : 'No specific retention policy language detected.';

  const summary_plain_english = `${appName} ${risk_level === 'Low' ? 'demonstrates generally good' : risk_level === 'Medium' ? 'shows mixed' : 'raises significant concerns about'} privacy practices. ${red_flags.length > 0 ? `There are ${red_flags.length} red flag(s) identified including ${red_flags[0].title.toLowerCase()}.` : 'No major red flags were detected.'} ${strengths.length > 0 ? `Positive aspects include ${strengths[0].toLowerCase()}.` : ''} The policy has a readability score of ${readability_score}/100.`;

  const recommendations = [
    ...(red_flags.length > 0 ? ['Address identified red flags, particularly around data sharing and vague language'] : []),
    ...(score_breakdown.transparency < 60 ? ['Improve policy language clarity — avoid vague terms like "may" and "as necessary"'] : []),
    ...(score_breakdown.child_safety < 60 ? ['Strengthen child privacy protections and COPPA compliance'] : []),
    ...(score_breakdown.security < 60 ? ['Document specific security measures and encryption practices'] : []),
    'Review and update the privacy policy regularly',
    'Provide clear data deletion procedures for users',
  ];

  return {
    app_name: appName,
    overall_score,
    privacy_grade,
    confidence_score: 50,
    risk_level,
    readability_score,
    transparency_score,
    data_collected,
    sensitive_data_flags,
    third_party_sharing,
    child_data_flags,
    retention_policy,
    user_rights,
    security_commitments,
    red_flags,
    strengths,
    summary_plain_english,
    recommendations,
    score_breakdown,
    risk_reasons,
    compliance_flags: {
      gdpr: { compliant: false, missing_requirements: ['Full GDPR assessment required'] },
      coppa: { compliant: countKeywordHits(lower, CHILD_KEYWORDS) >= 3, missing_requirements: ['COPPA compliance status unclear'] },
      dpdp: { compliant: false, missing_requirements: ['Indian DPDP alignment check required'] },
      ferpa: { compliant: countKeywordHits(lower, CHILD_KEYWORDS) >= 2, missing_requirements: ['FERPA compliance unverified'] }
    },
    integrity_check: {
      missing_sections: [],
      completeness: 'Medium',
      notes: 'Fallback keyword analysis used.'
    },
    analyzed_at: new Date().toISOString(),
    policy_url: policyUrl,
  };
}
