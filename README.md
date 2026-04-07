# 🔍 Policy Probe — India's First Privacy Audit Platform

> 🇮🇳 **India's first AI-powered educational privacy audit platform** — paste any privacy policy URL or raw text, get instant plain-English explanations, a scored risk breakdown, DPDP Act 2023 compliance checks, and smart side-by-side app comparisons. Powered by **Gemini 2.0 Flash**.

---

## 🌐 Live Links

| Service | URL |
|---------|-----|
| 🖥️ **Frontend (Vercel)** | [https://policy-probe.vercel.app](https://policy-probe.vercel.app) |
| ⚙️ **Backend API (Render)** | [https://policy-probe.onrender.com](https://policyprobe.onrender.com/) |

> ⚠️ The backend runs on Render's **free tier** — the first request after 15 min of inactivity may take ~30 seconds to wake up.

---

## 🧠 What is Policy Probe?

Privacy policies are long, full of legalese, and deliberately hard to read. **Policy Probe** solves this by being a free, open-source tool that:

1. **Accepts** a privacy policy as a URL or raw pasted text
2. **Strips** HTML noise and sends clean text to Gemini 2.0 Flash
3. **Returns** a fully structured analysis: risk scores, data categories, red flags, compliance checks, and a plain-English summary — all in seconds

It is specifically designed with **parents, students, and educators** in mind, helping them understand what data educational apps (like Byju's, Vedantu, ClassDojo, etc.) actually collect and whether it is safe.

**Key goals:**
- 🎓 Make privacy understandable for non-lawyers
- 🔴 Surface red flags and dangerous clauses automatically
- ⚖️ Enable side-by-side comparison of any two apps
- 🌍 Check compliance against GDPR, COPPA, DPDP Act 2023, and FERPA

---

## 🎨 Design System

**Neubrutalism** — a high-contrast, bold aesthetic featuring:
- `3px` hard borders with `0px` border-radius
- Offset box shadows (`nb-shadow`) with theme-aware colors
- **Manrope 900** for headings, **Inter** for body text
- Radial expansion theme toggle (dark ↔ light)
- Top-level progress bar on route transitions
- Full `@media print` optimization for professional PDF audit exports

---

## 🛡️ Security Posture

| Layer | Protection |
|-------|------------|
| **SSRF Prevention** | DNS resolution + private IP range blocking (`ipaddr.js`) |
| **Rate Limiting** | Per-IP sliding window with `Retry-After` headers |
| **Input Validation** | 200KB raw text cap, 15s fetch timeout, HTML stripping |
| **CSP Headers** | `helmet()` with strict `Content-Security-Policy` |
| **CORS** | Allowlisted origins only (`localhost`, `policy-probe.vercel.app`) |
| **Zero Retention** | No user data stored — all analysis is ephemeral |
| **API Key Sanitization** | `.trim()` on env vars to prevent copy-paste errors |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Next.js 15 Frontend (Vercel)                │  │
│  │                                                          │  │
│  │  /           → Home / Landing page                       │  │
│  │  /analyze    → Single policy analyzer                    │  │
│  │  /compare    → Side-by-side comparison tool              │  │
│  │  /results    → Detailed results viewer                   │  │
│  │  /history    → Past analyses                             │  │
│  │  /faq        → Educational FAQ                           │  │
│  │  /privacy    → Policy Probe's own privacy page           │  │
│  └───────────────────────┬──────────────────────────────────┘  │
└──────────────────────────┼──────────────────────────────────────┘
                           │ HTTPS POST /api/analyze
                           │ (JSON body, CORS-restricted)
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│               Express + TypeScript Backend (Render)              │
│                                                                  │
│  Middleware stack:                                               │
│    helmet()      → Security headers                              │
│    cors()        → Allowlist: localhost + vercel domain          │
│    rateLimit()   → Per-IP sliding window                         │
│    json({1mb})   → Body size cap                                 │
│                                                                  │
│  Route: POST /api/analyze                                        │
│    1. Validate input (URL | rawText | appName)                   │
│    2. SSRF check (DNS resolve + private IP block)                │
│    3. Fetch + strip HTML if URL provided (15s timeout)           │
│    4. Truncate to 15,000 chars                                   │
│    5. Call analyzeWithGemini()   ──►  Gemini 2.0 Flash API       │
│       └─ on failure: fallback to analyzePolicy() (keyword scan) │
│    6. Enforce score constraints + recalculate grade              │
│    7. Return structured AnalysisResult JSON                      │
│                                                                  │
│  Route: POST /api/compare (calls /api/analyze × 2 in parallel)  │
└──────────────────────────────────────────────────────────────────┘
                           │ HTTPS POST
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│             Google Gemini 2.0 Flash API (AI Studio)              │
│                                                                  │
│  Model: gemini-2.0-flash                                         │
│  Temperature: 0.3  (deterministic, factual)                      │
│  Max output tokens: 4096                                         │
│  Response format: strict raw JSON (no markdown fences)           │
└──────────────────────────────────────────────────────────────────┘
```

**Hosting summary:**

| Layer | Service | Config |
|-------|---------|--------|
| Frontend | Vercel | Root: `policy-probe-app`, Auto-detected Next.js |
| Backend | Render | Root: `policy-probe-backend`, `node dist/server.js` |
| AI | Google AI Studio | `gemini-2.0-flash` via REST API |

---

## 🔄 Data Flow

```
User Input
    │
    │  (Option A)   URL to privacy policy page
    │  (Option B)   Raw pasted policy text
    │  (Option C)   App name only (uses AI knowledge base)
    │
    ▼
Frontend  ──── POST /api/analyze ──────────────────────────────►  Backend
              { url?, rawText?, appName? }
                                                                      │
                                              ┌───────────── URL? ────┤
                                              │                       │
                                              ▼                       │
                                     Fetch HTML page                  │
                                     (12s timeout,                    │
                                      User-Agent spoofed)             │
                                              │                       │
                                              ▼                       │
                                     Strip <script>, <style>,         │
                                     all HTML tags, HTML entities,    │
                                     collapse whitespace              │
                                              │                       │
                                              └──────────────────────►│
                                                                      │
                                                              Truncate to
                                                              15,000 chars
                                                                      │
                                                                      ▼
                                                           Gemini 2.0 Flash
                                                          (structured JSON
                                                            prompt, T=0.3)
                                                                      │
                                                              ┌───────┴──────┐
                                                              │  AI success  │
                                                              │ parse JSON   │
                                                              │ enforce      │
                                                              │ score caps   │
                                                              └──────┬───────┘
                                                                     │ Gemini fails?
                                                              ┌──────▼───────┐
                                                              │  Keyword     │
                                                              │  fallback    │
                                                              │ (analyzer.ts)│
                                                              └──────┬───────┘
                                                                     │
Frontend  ◄─── AnalysisResult JSON ──────────────────────────────────┘
              (analysis_method: 'ai' | 'keyword')
                    │
                    ▼
            Results Page renders:
            ┌──────────────────────────────────────────┐
            │  Overall Score + Grade + Risk Level       │
            │  Score Breakdown Radar Chart              │
            │  Data Categories Collected                │
            │  Third-Party Sharing Entities             │
            │  Red Flags (Warning / Critical)           │
            │  Compliance Flags: GDPR/COPPA/DPDP/FERPA │
            │  Plain-English Summary                    │
            │  Recommendations                          │
            │  Integrity Check + Missing Sections       │
            └──────────────────────────────────────────┘
```

### Compare Mode Data Flow

```
User enters URL A  +  URL B
         │
         ▼
Frontend fires two parallel fetch() calls
  ├── POST /api/analyze { url: urlA }
  └── POST /api/analyze { url: urlB }
         │
         ▼ (both resolve)
Compare page runs 20 COMPARISON_FACTORS
  ├── Overall Score, Privacy Grade
  ├── Score sub-categories (Data Collection, Third-Party Sharing, etc.)
  ├── Red Flag count, Third-Party entity count
  ├── GDPR / COPPA / DPDP / FERPA compliance booleans
  ├── Completeness, Readability, Confidence
  └── getWinner(valA, valB, direction) → 'A' | 'B' | 'Tie'
         │
         ▼
Verdict banner: "X wins N factors" → declares safer app
Side-by-side table with green/red highlights per row
Red flags comparison panel (two columns)
Plain-English summaries side by side
```

---

## 📊 Privacy Policy Components Analyzed

Every policy run through Policy Probe is broken down into the following structured components:

### 1. 📁 Data Collected
A categorized list of every type of personal data the policy mentions, with per-category risk tagging (`Low` / `Medium` / `High`). Example categories: *Identity*, *Device Info*, *Location*, *Behavioral*, *Payment*, *Health*.

### 2. ⚠️ Sensitive Data Flags
Free-text flags for unusually risky data types detected in the policy (e.g., biometrics, precise GPS, financial info, health records).

### 3. 🤝 Third-Party Sharing
Named third-party entities the policy admits to sharing data with, classified by their purpose (analytics, advertising, cloud storage) and risk level.

### 4. 👶 Child Data Flags
Specific flags for child-safety issues — mentions of COPPA, parental consent requirements, age gates, or lack thereof.

### 5. 🕐 Retention Policy
A plain-English summary of how long the app keeps data, or a flag if no retention timeline is mentioned at all.

### 6. 🔐 User Rights
A list of rights the policy grants: right to access, delete, correct, export, opt out of sale, etc.

### 7. 🛡️ Security Commitments
Statements the policy makes about encryption, access controls, breach notification, and security certifications.

### 8. 🚩 Red Flags
Automatically detected problematic clauses, each tagged as `Warning` or `Critical` with a title and full description.

### 9. ✅ Strengths
Positive privacy practices explicitly mentioned in the policy.

### 10. 📝 Plain-English Summary
A 2–3 sentence human-readable summary written for parents or non-technical users.

### 11. 💡 Recommendations
Actionable steps the app or user should take to improve privacy posture.

### 12. 📈 Score Breakdown

The overall privacy score (0–100) is composed of 9 weighted categories:

| Category | Max Points | What earns a high score |
|----------|-----------|-------------------------|
| Data Collection | 20 | Minimal, necessary data only |
| Third-Party Sharing | 20 | No sharing or clearly limited sharing |
| Child / Student Safety | 15 | Strong protections + parental consent |
| Retention Clarity | 10 | Clear, defined data retention timelines |
| User Rights | 10 | Full access / delete / export rights |
| Transparency | 10 | Clear, readable language |
| Security | 5 | Encryption + breach notification mentioned |
| Tracking / Cookies | 5 | Minimal tracking, opt-out provided |
| Ambiguity | 5 | No vague clauses or contradictions |

**Grading scale:**

| Score | Grade | Risk Level |
|-------|-------|------------|
| 85–100 | A | 🟢 Low |
| 70–84 | B | 🟡 Medium |
| 50–69 | C | 🔴 High |
| < 50 | D | 🔴 Very High |

### 13. 🔎 Risk Reasons
A list of specific factors that drove the score up or down, each with:
- Factor name
- Impact (`Positive` / `Negative` / `Neutral`)
- Weight (how much it affected the score)
- Explanation in plain English
- Evidence snippet (exact quote from the policy)

### 14. 🌍 Compliance Flags
Boolean compliance checks against four major frameworks:

| Framework | Scope |
|-----------|-------|
| **GDPR** | EU/UK data protection regulation |
| **COPPA** | US Children's Online Privacy Protection Act |
| **DPDP Act** | India's Digital Personal Data Protection Act 2023 |
| **FERPA** | US Family Educational Rights and Privacy Act |

Each flag includes a list of missing requirements if non-compliant.

### 15. 🧩 Integrity Check
Meta-analysis of the policy itself:
- Which expected sections are missing (collection, sharing, retention, rights, security, children)
- Overall completeness: `High` / `Medium` / `Low`
- Confidence score: `(sections_found / 6) × 100`

---

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js 18+
- A free [Gemini API Key](https://aistudio.google.com/apikey)

```bash
# 1. Clone the repo
git clone https://github.com/DhyaanKanoja11/CODEX_GLADIATORS_GEN_AI_HACKATHON.git
cd CODEX_GLADIATORS_GEN_AI_HACKATHON

# 2. Start the backend
cd policy-probe-backend
cp .env.example .env         # Edit .env with your GEMINI_API_KEY
npm install
npm run dev                  # → http://localhost:5000

# 3. Start the frontend (new terminal)
cd ../policy-probe-app
cp .env.example .env.local   # Uses localhost:5000 by default
npm install
npm run dev                  # → http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔐 Environment Variables

### Backend (`policy-probe-backend/.env`)
```env
GEMINI_API_KEY=your_key_here
PORT=5000
NODE_ENV=development
```

### Frontend (`policy-probe-app/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> **Never commit `.env` or `.env.local`** — they are gitignored. Only `.env.example` files (with placeholders) are committed.

---

## 🛠️ API Reference

### `POST /api/analyze`

Analyze a single privacy policy.

**Request body** (one of the following):
```json
{ "url": "https://example.com/privacy" }
{ "rawText": "We collect your name, email..." }
{ "appName": "ClassDojo" }
```

**Response:** Full `AnalysisResult` JSON (see [types.ts](./policy-probe-backend/src/utils/types.ts))

**Headers returned:**
- `X-RateLimit-Remaining` — requests left in current window
- `Retry-After` — seconds until reset (on 429)

**Limits:**
- Raw text max: 200,000 characters
- Text sent to AI: truncated to 15,000 characters
- Rate limited per IP (sliding window)
- SSRF-protected: private/reserved IPs blocked

---

## 📁 Project Structure

```
Policy Probe/
├── policy-probe-app/                # Next.js 15 frontend
│   └── src/
│       ├── app/
│       │   ├── page.tsx             # Landing page
│       │   ├── analyze/             # Policy analyzer UI
│       │   ├── compare/             # Side-by-side comparison
│       │   ├── results/             # Full results viewer
│       │   ├── history/             # Past analyses
│       │   ├── faq/                 # Educational FAQ
│       │   └── privacy/             # Policy Probe's own privacy page
│       ├── components/
│       │   ├── layout/              # Navbar, footer, theme toggle
│       │   └── results/             # DetailCards, score charts, etc.
│       ├── context/
│       │   └── ThemeContext.tsx     # Dark/light mode state
│       └── lib/
│           ├── types.ts             # Shared TypeScript interfaces
│           └── theme.ts             # MUI theme config
│
├── policy-probe-backend/            # Express API
│   └── src/
│       ├── server.ts                # Entry point, routes, middleware
│       └── utils/
│           ├── gemini.ts            # Gemini 2.0 Flash integration + prompt
│           ├── analyzer.ts          # Keyword-based fallback analyzer
│           ├── rateLimit.ts         # Per-IP rate limiting
│           └── types.ts             # AnalysisResult + all interfaces
│
├── DEPLOYMENT.md                    # Full step-by-step deployment guide
└── README.md
```

---

## 🌍 Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full guide covering Render (backend), Vercel (frontend), environment variables, and CORS configuration.

---

## 👥 Team

Built by **Team CODEX** for the **CODEX Gladiators Gen AI Hackathon** 🏆

- **Dhyaan Kanoja** — Full-Stack & AI Integration
- **Aarya Manchanda** — Frontend Development
---

## 📄 License

MIT — free to use and modify.
