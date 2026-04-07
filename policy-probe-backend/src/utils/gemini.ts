import { AnalysisResult } from './types';

// ─── Model Config ────────────────────────────────────────────────────────────
const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'];
const GEMINI_TIMEOUT_MS = 25000;

// ─── Prompt ──────────────────────────────────────────────────────────────────
const ANALYSIS_PROMPT = `You are a privacy policy analysis engine for educational apps. Analyze the following privacy policy text and return a STRICT JSON response (no markdown, no code fences, just raw JSON).

The JSON must follow this EXACT schema:
{
  "app_name": "string",
  "overall_score": number 0-100,
  "privacy_grade": "A" | "B" | "C" | "D",
  "confidence_score": number 0-100,
  "risk_level": "Low" | "Medium" | "High",
  "readability_score": number 0-100,
  "transparency_score": number 0-100,
  "data_collected": [{"category": "string", "items": ["string"], "risk": "Low"|"Medium"|"High"}],
  "sensitive_data_flags": ["string"],
  "third_party_sharing": [{"name": "string", "purpose": "string", "risk": "Low"|"Medium"|"High"}],
  "child_data_flags": ["string"],
  "retention_policy": "string",
  "user_rights": ["string"],
  "security_commitments": ["string"],
  "red_flags": [{"title": "string", "description": "string", "severity": "Warning"|"Critical"}],
  "strengths": ["string"],
  "summary_plain_english": "string",
  "recommendations": ["string"],
  "score_breakdown": {
    "data_collection": number, "third_party_sharing": number, "child_safety": number, 
    "retention_clarity": number, "user_rights": number, "transparency": number, 
    "security": number, "tracking_cookies": number, "ambiguity": number
  },
  "risk_reasons": [{"factor": "string", "impact": "Positive"|"Negative", "weight": number, "explanation": "string"}],
  "compliance_flags": {
    "gdpr": {"compliant": boolean, "missing_requirements": ["string"]},
    "coppa": {"compliant": boolean, "missing_requirements": ["string"]},
    "dpdp": {"compliant": boolean, "missing_requirements": ["string"]},
    "ferpa": {"compliant": boolean, "missing_requirements": ["string"]}
  },
  "integrity_check": {"missing_sections": ["string"], "completeness": "High"|"Medium"|"Low", "notes": "string"}
}

SCORING: 85+ A, 70-84 B, 50-69 C, <50 D.
Return ONLY valid JSON.`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stripFences(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
}

async function callModel(model: string, prompt: string, apiKey: string): Promise<AnalysisResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), GEMINI_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 4096 }
      }),
      signal: ctrl.signal,
    });
    clearTimeout(tid);

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`HTTP ${res.status}: ${err}`);
    }

    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) throw new Error('Empty response');

    return JSON.parse(stripFences(raw)) as AnalysisResult;
  } catch (e: any) {
    clearTimeout(tid);
    throw e;
  }
}

// ─── Core ─────────────────────────────────────────────────────────────────────

export async function analyzeWithGemini(policyText: string, appName: string, policyUrl?: string): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

  const truncated = policyText.substring(0, 15000);
  const fullPrompt = `${ANALYSIS_PROMPT}\n\nApp: ${appName}\nText: ${truncated}`;

  let lastErr: any = null;

  for (const model of MODELS) {
    try {
      console.log(`[Gemini] Attempting ${model}...`);
      const result = await callModel(model, fullPrompt, apiKey);
      
      return {
        ...result,
        app_name: result.app_name || appName,
        analyzed_at: new Date().toISOString(),
        policy_url: policyUrl,
      };
    } catch (e: any) {
      lastErr = e;
      console.error(`[Gemini] ${model} failed: ${e.message}`);
      if (model !== MODELS[MODELS.length - 1]) {
        await new Promise(r => setTimeout(r, 1500)); // Small gap
      }
    }
  }

  throw lastErr || new Error("All Gemini models failed");
}
