import { AnalysisResult } from './types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

const ANALYSIS_PROMPT = `You are "Probe-1", a high-precision privacy audit engine specializing in the Digital Personal Data Protection (DPDP) Act 2023 (India) and global standards.
Analyze the provided privacy policy text and generate a forensic audit report in STRICT JSON format.

CRITICAL FOCUS (DPDP Act 2023):
1. CONSENT: Does the policy mention "clear, specific, and informed consent"?
2. DATA FIDUCIARY: Does it clearly identify who controls the data?
3. GRIEVANCE REDRESSAL: Is there a "Grievance Officer" mentioned with contact details?
4. DATA MINIMIZATION: Does it only collect what is "necessary for the specified purpose"?
5. RETENTION: Does it commit to deleting data once the purpose is fulfilled?

The JSON must follow this EXACT schema:
{
  "app_name": "string - the app name",
  "overall_score": number 0-100 (Total = Sum of weighted score_breakdown categories. 100 = perfectly safe),
  "privacy_grade": "A" | "B" | "C" | "D",
  "confidence_score": number 0-100 (based on clarity of text),
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
  "risk_reasons": [{"factor": "string", "impact": "Positive"|"Negative"|"Neutral", "weight": number, "explanation": "string", "evidence_snippet": "string - exact quote from policy if found"}],
  "compliance_flags": {
    "gdpr": {"compliant": boolean, "missing_requirements": ["string"]},
    "coppa": {"compliant": boolean, "missing_requirements": ["string"]},
    "dpdp": {"compliant": boolean, "missing_requirements": ["string"]},
    "ferpa": {"compliant": boolean, "missing_requirements": ["string"]}
  },
  "integrity_check": {
    "missing_sections": ["string list"],
    "completeness": "High" | "Medium" | "Low",
    "notes": "string"
  }
}

SCORING ALGORITHM (POINTS ADDED FOR GOOD PRACTICES):
1. Data Collection (20): Zero Data / Ephemeral = +20. Minimal data=+18-19. Excessive=+0-9.
2. Third-Party Sharing (20): No sharing / Blind Relay = +20. Limited=+10-17. Broad/vague=+0-9.
3. Child / Student Data (15): Strong protection+parental consent OR "does not target/collect" = +15.
4. Retention Policy (10): Zero retention / "0 seconds" / instant destruction = +10. Clearly defined timelines=+8-9. Partial=+4-7. missing=+0-3.
5. User Rights (10): Erasure, Correction, Withdrawal of Consent=+8-10, Partial=+4-7.
6. Transparency (10): Plain language=+8-10, Legalese=+0-5.
7. Security (5): RAM-only processing / Encryption mentioned = +5. Basic/Missing=+0-3.
8. Tracking (5): Zero tracking explicitly stated = +5. Opt-out found=+4. Heavy tracking=+0-2.
9. Ambiguity (5): Start from +5. (Penalty: "may", "etc.", "including but not limited to" -> -2 each).

CRITICAL DIRECTIVE: If the policy explicitly claims to be a "zero-collection platform", "zero-retention", "ephemeral", or "acts as a blind relay" with no database writes (e.g., Policy Probe's own policy), it MUST receive a 100/100 score, an "A" Grade, and boolean 'true' for all compliant flags. Do not flag lack of deletion mechanisms or grievance officers as errors if the platform literally stores zero data.

Return ONLY valid JSON. No explanations outside the JSON block.`;


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
  
  const sanitizedKey = GEMINI_API_KEY.trim();
  console.log(`[Gemini-Probe] Initializing with key length: ${sanitizedKey.length}`);

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-goog-api-key': sanitizedKey
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
    data_collection: 15, third_party_sharing: 15, child_safety: 10, retention_clarity: 5,
    user_rights: 5, transparency: 5, security: 3, tracking_cookies: 2, ambiguity: 2
  };

  const finalScore = result.overall_score ?? 50;
  let finalGrade: 'A' | 'B' | 'C' | 'D' = 'D';
  let finalRisk: 'Low' | 'Medium' | 'High' = 'High';

  if (finalScore >= 85) { finalGrade = 'A'; finalRisk = 'Low'; }
  else if (finalScore >= 70) { finalGrade = 'B'; finalRisk = 'Medium'; }
  else if (finalScore >= 50) { finalGrade = 'C'; finalRisk = 'High'; }

  return {
    app_name: result.app_name || appName,
    overall_score: finalScore,
    risk_level: finalRisk,
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
    privacy_grade: finalGrade,
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
