export interface AnalysisResult {
  app_name: string;
  overall_score: number;
  privacy_grade: 'A' | 'B' | 'C' | 'D' | 'F';
  confidence_score: number;
  risk_level: 'Low' | 'Medium' | 'High';
  readability_score: number;
  transparency_score: number;
  data_collected: DataCategory[];
  sensitive_data_flags: string[];
  third_party_sharing: ThirdPartyEntry[];
  child_data_flags: string[];
  retention_policy: string;
  user_rights: string[];
  security_commitments: string[];
  red_flags: RedFlag[];
  strengths: string[];
  summary_plain_english: string;
  recommendations: string[];
  score_breakdown: ScoreBreakdown;
  risk_reasons: RiskReason[];
  compliance_flags: ComplianceFlags;
  integrity_check?: {
    missing_sections: string[];
    completeness: 'High' | 'Medium' | 'Low';
    notes: string;
  };
  analyzed_at: string;
  policy_url?: string;
  deep_audit?: DeepAuditResult;
}

export interface DeepAuditResult {
  trackers_found: string[];
  permissions_requested: string[];
  policy_mismatches: Array<{ claim: string; observation: string; severity: 'Warning' | 'Critical' }>;
}

export interface ComplianceFlags {
  gdpr: { compliant: boolean; missing_requirements: string[] };
  coppa: { compliant: boolean; missing_requirements: string[] };
  dpdp: { compliant: boolean; missing_requirements: string[] };
  ferpa: { compliant: boolean; missing_requirements: string[] };
}

export interface DataCategory {
  category: string;
  items: string[];
  risk: 'Low' | 'Medium' | 'High';
}

export interface ThirdPartyEntry {
  name: string;
  purpose: string;
  risk: 'Low' | 'Medium' | 'High';
}

export interface RedFlag {
  title: string;
  description: string;
  severity: 'Warning' | 'Critical';
}

export interface ScoreBreakdown {
  data_collection: number;
  third_party_sharing: number;
  child_safety: number;
  retention_clarity: number;
  user_rights: number;
  transparency: number;
  security: number;
  tracking_cookies: number;
  ambiguity: number;
}

export interface RiskReason {
  factor: string;
  impact: 'Positive' | 'Negative' | 'Neutral';
  weight: number;
  explanation: string;
  evidence_snippet?: string;
}

export interface AnalyzeRequest {
  appName?: string;
  url?: string;
  policyUrl?: string;
  rawText?: string;
}
