import { AnalysisResult } from './types';

// ─── Model Config ────────────────────────────────────────────────────────────
// gemini-2.5-flash is the latest stable model — confirmed working.
// Falls back through 2.0 and 1.5 if a model is unavailable or quota-limited.
const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
];
const GEMINI_TIMEOUT_MS = 25000; // 25 seconds — generous but bounded

// ─── Prompt ──────────────────────────────────────────────────────────────────
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

SPECIAL: If policy confirms ZERO retention and ZERO database writes (like Policy Probe), it MUST be 100/A.

CRITICAL: You MUST respond with ONLY valid JSON. No markdown fences, no explanation, no preamble. Start your response with { and end with }.`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Strips markdown code fences (```json ... ``` or ``` ... ```) that Gemini
 * sometimes wraps around JSON output even when not in JSON mode.
 */
function stripMarkdownFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();
}

/**
 * Safely parse JSON from Gemini output.
 * Handles markdown fences and trailing/leading whitespace.
 */
function safeParseJson(raw: string): AnalysisResult {
  const cleaned = stripMarkdownFences(raw);
  try {
    return JSON.parse(cleaned) as AnalysisResult;
  } catch {
    // Last-ditch: try to find the first { ... } block
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]) as AnalysisResult;
    }
    throw new Error('PARSE_ERROR: Could not extract valid JSON from Gemini response');
  }
}

/** Categorize errors for structured logging and fallback decisions. */
export type GeminiErrorReason =
  | 'missing_api_key'
  | 'invalid_api_key'
  | 'quota_exceeded'
  | 'timeout'
  | 'empty_response'
  | 'parse_error'
  | 'model_error'
  | 'network_error'
  | 'unknown';

export class GeminiError extends Error {
  constructor(
    public readonly reason: GeminiErrorReason,
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'GeminiError';
  }
}

function classifyHttpError(status: number, body: string): GeminiError {
  if (status === 400) {
    return new GeminiError('model_error', `Gemini bad request (400): ${body}`, status);
  }
  if (status === 401 || status === 403) {
    return new GeminiError('invalid_api_key', `Gemini auth error (${status}): ${body}`, status);
  }
  if (status === 429) {
    return new GeminiError('quota_exceeded', `Gemini quota/rate-limit (429): ${body}`, status);
  }
  return new GeminiError('network_error', `Gemini HTTP error (${status}): ${body}`, status);
}

// ─── Core ─────────────────────────────────────────────────────────────────────

async function callGeminiModel(
  model: string,
  prompt: string,
  apiKey: string,
): Promise<AnalysisResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 4096,
          // NOTE: responseMimeType deliberately omitted —
          // it is unreliable on REST for non-Pro models and causes empty candidates.
        },
      }),
      signal: controller.signal,
    });
  } catch (fetchErr: any) {
    clearTimeout(timeoutId);
    if (fetchErr.name === 'AbortError') {
      throw new GeminiError('timeout', `Gemini request timed out after ${GEMINI_TIMEOUT_MS}ms`);
    }
    throw new GeminiError('network_error', `Gemini fetch failed: ${fetchErr.message}`);
  }
  clearTimeout(timeoutId);

  if (!response.ok) {
    const errorBody = await response.text();
    throw classifyHttpError(response.status, errorBody);
  }

  const data = await response.json();
  const rawText: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText || rawText.trim().length === 0) {
    const finishReason = data?.candidates?.[0]?.finishReason ?? 'unknown';
    throw new GeminiError(
      'empty_response',
      `Gemini returned no text content. finishReason=${finishReason}`,
    );
  }

  try {
    return safeParseJson(rawText);
  } catch {
    throw new GeminiError(
      'parse_error',
      `Gemini response could not be parsed as JSON. First 200 chars: ${rawText.substring(0, 200)}`,
    );
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function analyzeWithGemini(
  policyText: string,
  appName: string,
  policyUrl?: string,
  deepAudit: boolean = false,
): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new GeminiError('missing_api_key', 'GEMINI_API_KEY environment variable is not set');
  }

  const truncatedText = policyText.substring(0, 15000);
  const fullPrompt = `${ANALYSIS_PROMPT}\n\nApp: ${appName}\nDeep Audit Mode: ${deepAudit ? 'ENABLED' : 'DISABLED'}\nText: ${truncatedText}`;

  let lastError: GeminiError | null = null;

  // Try each model in order (primary then fallback within Gemini)
  for (const model of GEMINI_MODELS) {
    try {
      console.log(`[Gemini] Attempting model: ${model}`);
      const raw = await callGeminiModel(model, fullPrompt, apiKey);

      // Merge with safe defaults — do NOT override valid AI scores
      const result: AnalysisResult = {
        ...raw,
        app_name: raw.app_name || appName,
        overall_score: raw.overall_score ?? 50,
        privacy_grade: raw.privacy_grade || 'C',
        risk_level: raw.risk_level || 'High',
        analyzed_at: new Date().toISOString(),
        policy_url: policyUrl,
        score_breakdown: raw.score_breakdown || {
          data_collection: 10,
          third_party_sharing: 10,
          child_safety: 10,
          retention_clarity: 5,
          user_rights: 5,
          transparency: 5,
          security: 3,
          tracking_cookies: 2,
          ambiguity: 0,
        },
      };

      console.log(`[Gemini] Success with model=${model} score=${result.overall_score}`);
      return result;
    } catch (err) {
      if (err instanceof GeminiError) {
        lastError = err;
        console.error(`[Gemini] model=${model} reason=${err.reason} message=${err.message}`);

        // Do not retry on permanent config errors
        if (err.reason === 'missing_api_key' || err.reason === 'invalid_api_key') {
          break;
        }
      } else {
        lastError = new GeminiError('unknown', String(err));
        console.error(`[Gemini] model=${model} unknown error:`, err);
      }
    }
  }

  throw lastError ?? new GeminiError('unknown', 'All Gemini models failed with no error details');
}
