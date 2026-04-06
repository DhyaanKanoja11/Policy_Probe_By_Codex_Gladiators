import { AnalysisResult } from './types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`;

const ANALYSIS_PROMPT = `You are a privacy policy analysis engine for educational apps. Analyze the following privacy policy text and return a STRICT JSON response (no markdown, no code fences, just raw JSON).

The JSON must follow this EXACT schema:
{
  "app_name": "string - the app name",
  "overall_score": number 0-100 (Total = Sum of all categories. 100 = perfectly safe, 0 = critical risk),
  "privacy_grade": "A" | "B" | "C" | "D",
  "confidence_score": number 0-100 (Formula: (sections_found / 6 expected_sections) * 100),
  "risk_level": "Low" | "Medium" | "High",
  "readability_score": number 0-100,
  "transparency_score": number 0-100,
  "data_collected": [{"category": "string", "items": ["string"], "risk": "Low"|"Medium"|"High"}],
  "sensitive_data_flags": ["string"],
  "third_party_sharing": [{"name": "string", "purpose": "string", "risk": "Low"|"Medium"|"High"}],
  "child_data_flags": ["string"],
  "retention_policy": "string summary",
  "user_rights": ["string"],
  "security_commitments": ["string"],
  "red_flags": [{"title": "string", "description": "string", "severity": "Warning"|"Critical"}],
  "strengths": ["string"],
  "summary_plain_english": "string - 2-3 sentence plain English summary for parents",
  "recommendations": ["string"],
  "score_breakdown": {
    "data_collection": number (Max 20),
    "third_party_sharing": number (Max 20),
    "child_safety": number (Max 15),
    "retention_clarity": number (Max 10),
    "user_rights": number (Max 10),
    "transparency": number (Max 10),
    "security": number (Max 5),
    "tracking_cookies": number (Max 5),
    "ambiguity": number (Max 5)
  },
  "risk_reasons": [{"factor": "string", "impact": "Positive"|"Negative"|"Neutral", "weight": number, "explanation": "string", "evidence_snippet": "string - exact quote from policy"}],
  "compliance_flags": {
    "gdpr": {"compliant": boolean, "missing_requirements": ["string"]},
    "coppa": {"compliant": boolean, "missing_requirements": ["string"]},
    "dpdp": {"compliant": boolean, "missing_requirements": ["string"]},
    "ferpa": {"compliant": boolean, "missing_requirements": ["string"]}
  },
  "integrity_check": {
    "missing_sections": ["string list of missing expected sections like collection, sharing, retention, rights, security, children"],
    "completeness": "High" | "Medium" | "Low",
    "notes": "string"
  }
}

SCORING ALGORITHM (POINTS ADDED FOR GOOD PRACTICES):
1. Data Collection (20): Minimal data=+18-20, Moderate=+10-17, Excessive=+0-9. (Penalty: Sensitive data -> -5).
2. Third-Party Sharing (20): No sharing=+18-20, Limited=+10-17, Broad/vague=+0-9. (Penalty: "may share with partners" -> -5).
3. Child / Student Data (15): Strong protection+parental consent=+13-15, Mentioned but weak=+6-12, Not mentioned=+0-5. (Penalty: Collects without safeguards -> -5).
4. Retention Policy (10): Clearly defined=+8-10, Partial=+4-7, Not mentioned=+0-3.
5. User Rights (10): Full rights=+8-10, Partial=+4-7, Missing=+0-3.
6. Transparency (10): Clear/readable=+8-10, Moderate=+4-7, Complex=+0-3.
7. Security (5): Strong encryption=+4-5, Basic=+2-3, Missing=+0-1.
8. Tracking (5): Minimal=+4-5, Moderate=+2-3, Heavy=+0-1.
9. Ambiguity (5): Start from +5. (Penalty: vague language -> -2, unclear clauses -> -2, contradictions -> -1).

FINAL SCORE = Sum of all categories.
GRADE: 85-100 = A (Low Risk), 70-84 = B (Medium Risk), 50-69 = C (High Risk), <50 = D (Very High Risk).

Return ONLY valid JSON. No explanations outside the JSON.`;

export async function analyzeWithGemini(policyText: string, appName: string, policyUrl?: string): Promise<AnalysisResult> {
  const truncatedText = policyText.substring(0, 15000); // Keep within token limits

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `${ANALYSIS_PROMPT}\n\nApp Name: ${appName}\n\nPrivacy Policy Text:\n${truncatedText}`
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 4096,
    }
  };

  if (!GEMINI_API_KEY) {
     throw new Error("GEMINI_API_KEY is not defined in environment variables.");
  }

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-goog-api-key': GEMINI_API_KEY
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  // Extract the generated text
  const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!generatedText) {
    throw new Error('No response from Gemini API');
  }

  // Clean up the response - remove markdown code fences if present
  let jsonText = generatedText.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.slice(7);
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.slice(3);
  }
  if (jsonText.endsWith('```')) {
    jsonText = jsonText.slice(0, -3);
  }
  jsonText = jsonText.trim();

  const result = JSON.parse(jsonText) as AnalysisResult;

  // Ensure all required fields exist with defaults
  const breakdown = result.score_breakdown || {
    data_collection: 20, third_party_sharing: 20, child_safety: 15, retention_clarity: 10,
    user_rights: 10, transparency: 10, security: 5, tracking_cookies: 5, ambiguity: 5
  };

  // Enforce score constraints strictly
  breakdown.data_collection = Math.min(20, Math.max(0, breakdown.data_collection || 0));
  breakdown.third_party_sharing = Math.min(20, Math.max(0, breakdown.third_party_sharing || 0));
  breakdown.child_safety = Math.min(15, Math.max(0, breakdown.child_safety || 0));
  breakdown.retention_clarity = Math.min(10, Math.max(0, breakdown.retention_clarity || 0));
  breakdown.user_rights = Math.min(10, Math.max(0, breakdown.user_rights || 0));
  breakdown.transparency = Math.min(10, Math.max(0, breakdown.transparency || 0));
  breakdown.security = Math.min(5, Math.max(0, breakdown.security || 0));
  breakdown.tracking_cookies = Math.min(5, Math.max(0, breakdown.tracking_cookies || 0));
  breakdown.ambiguity = Math.min(5, Math.max(0, breakdown.ambiguity || 0));

  const strictScore = Math.round(
    breakdown.data_collection + breakdown.third_party_sharing + breakdown.child_safety +
    breakdown.retention_clarity + breakdown.user_rights + breakdown.transparency +
    breakdown.security + breakdown.tracking_cookies + breakdown.ambiguity
  );

  let strictGrade: 'A'|'B'|'C'|'D' = 'D';
  let strictRisk: 'Low'|'Medium'|'High' = 'High';
  if (strictScore >= 85) { strictGrade = 'A'; strictRisk = 'Low'; }
  else if (strictScore >= 70) { strictGrade = 'B'; strictRisk = 'Medium'; }
  else if (strictScore >= 50) { strictGrade = 'C'; strictRisk = 'High'; }

  return {
    app_name: result.app_name || appName,
    overall_score: strictScore,
    risk_level: strictRisk,
    readability_score: result.readability_score ?? 50,
    transparency_score: result.transparency_score ?? 50,
    data_collected: result.data_collected || [],
    sensitive_data_flags: result.sensitive_data_flags || [],
    third_party_sharing: result.third_party_sharing || [],
    child_data_flags: result.child_data_flags || [],
    retention_policy: result.retention_policy || 'Not specified',
    user_rights: result.user_rights || [],
    security_commitments: result.security_commitments || [],
    red_flags: result.red_flags || [],
    strengths: result.strengths || [],
    summary_plain_english: result.summary_plain_english || 'Analysis complete.',
    recommendations: result.recommendations || [],
    score_breakdown: breakdown,
    risk_reasons: result.risk_reasons || [],
    privacy_grade: strictGrade,
    confidence_score: result.confidence_score ?? 80,
    compliance_flags: result.compliance_flags || {
      gdpr: { compliant: false, missing_requirements: ['Full assessment required'] },
      coppa: { compliant: false, missing_requirements: ['Full assessment required'] },
      dpdp: { compliant: false, missing_requirements: ['Full assessment required'] },
      ferpa: { compliant: false, missing_requirements: ['Full assessment required'] },
    },
    integrity_check: result.integrity_check || {
      missing_sections: [],
      completeness: 'Medium',
      notes: 'Initial check completed.'
    },
    analyzed_at: new Date().toISOString(),
    policy_url: policyUrl,
  };
}
