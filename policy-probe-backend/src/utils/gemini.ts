import { AnalysisResult } from './types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

const ANALYSIS_PROMPT = `You are "Probe-1", a high-precision privacy audit engine for the Digital Personal Data Protection (DPDP) Act 2023 (India) and global standards.
Analyze the provided privacy policy and return a forensic audit.

SCORING (0-100 total):
- Data Collection (20): Minimal/Zero=18-20, Moderate=10-17, Excessive=0-9.
- Third-Party Sharing (20): None/Blind=18-20, Limited=10-17, Broad=0-9.
- Child Safety (15): Strong+Consent=13-15, Weak=6-12, None=0-5.
- Retention (10): Zero/Instant=9-10, Clear=7-8, Vague=0-4.
- User Rights (10): Full=8-10, Partial=4-7, Missing=0-3.
- Transparency (10): Clear=8-10, Legalese=0-5.
- Security (5): RAM-only/TLS=4-5, Basic=1-3.
- Tracking (5): Zero=5, Opt-out=3-4, Heavy=0-2.
- Ambiguity (5): Start at 5. Deduct for "may", "etc", "at our discretion".

GRADING: 85+ (A, Low Risk), 70-84 (B, Medium), 50-69 (C, High), <50 (D, Very High).

DEEP AUDIT (STRICT): If "Deep Audit" is requested, you MUST populate the "deep_audit" object:
- trackers_found: ["SDK Name", ...]
- permissions_requested: ["Permission Name", ...]
- policy_mismatches: [{"claim": "string", "observation": "string", "severity": "Warning"|"Critical"}]
Identify probable trackers/SDKs based on app niche and OS permissions the app likely needs vs what it claims.

SPECIAL: If policy confirms ZERO retention and ZERO database writes (like Policy Probe), it MUST be 100/A.`;

export async function analyzeWithGemini(policyText: string, appName: string, policyUrl?: string, deepAudit: boolean = false): Promise<AnalysisResult> {
  const truncatedText = policyText.substring(0, 15000);

  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing.");
  const sanitizedKey = GEMINI_API_KEY.trim();

  const fullPrompt = `${ANALYSIS_PROMPT}\n\nApp: ${appName}\nDeep Audit Mode: ${deepAudit ? 'ENABLED' : 'DISABLED'}\nText: ${truncatedText}`;

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': sanitizedKey },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: { 
        temperature: 0.1, 
        maxOutputTokens: 2048,
        response_mime_type: "application/json" 
      }
    }),
  });

  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

  const data = await response.json();
  const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!jsonText) throw new Error('No response from Gemini API');

  const result = JSON.parse(jsonText) as AnalysisResult;

  // Final merge with defaults to ensure runtime safety without overriding grades
  return {
    ...result,
    app_name: result.app_name || appName,
    overall_score: result.overall_score ?? 50,
    privacy_grade: result.privacy_grade || 'C',
    risk_level: result.risk_level || 'High',
    analyzed_at: new Date().toISOString(),
    policy_url: policyUrl,
    score_breakdown: result.score_breakdown || {
      data_collection: 10, third_party_sharing: 10, child_safety: 10, retention_clarity: 5,
      user_rights: 5, transparency: 5, security: 3, tracking_cookies: 2, ambiguity: 0
    }
  };
}
