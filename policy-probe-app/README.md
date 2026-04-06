# Policy Probe — Privacy Intelligence for Education

A privacy intelligence platform that analyzes educational app privacy policies and provides structured risk assessments, visual dashboards, and plain-language explanations.

## Features

- **Privacy Policy Analysis** — Input an app name, website URL, privacy policy URL, or raw policy text
- **Risk Scoring** — Weighted multi-factor risk scores across 8 categories
- **Visual Dashboard** — Radar charts, bar charts, pie charts, and score gauges
- **Risk Reasoning** — Detailed explanations of why the score is what it is
- **Comparison Mode** — Side-by-side privacy analysis of two apps
- **Analysis History** — Track previous analyses
- **Dark/Light Mode** — Premium theme toggle
- **Responsive Design** — Works on desktop and mobile

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **UI**: MUI v5 + Emotion
- **Animations**: Framer Motion
- **Charts**: Recharts (Radar, Bar, Pie, Gauge)
- **Backend**: Next.js API Routes
- **Analysis Engine**: Keyword-based privacy policy analyzer

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
cd policy-probe-app
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout + theme provider
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Minimal global styles
│   ├── analyze/page.tsx        # Analysis input page
│   ├── results/page.tsx        # Results dashboard
│   ├── compare/page.tsx        # App comparison page
│   ├── history/page.tsx        # Analysis history
│   └── api/analyze/route.ts    # Analysis API endpoint
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Navigation bar + theme toggle
│   │   └── Footer.tsx          # Footer
│   └── results/
│       ├── ScoreGauge.tsx      # Radial score gauge (Pie chart)
│       ├── RiskOverview.tsx     # Score + risk level header
│       ├── ScoreBreakdownChart.tsx  # Radar, Bar, and Pie charts
│       ├── RiskReasoningCard.tsx    # Why-this-score explanations
│       └── DetailCards.tsx     # Data, third-party, red flags, strengths, child safety, summary
├── context/
│   └── ThemeContext.tsx        # Dark/light theme state
└── lib/
    ├── types.ts                # TypeScript interfaces
    ├── theme.ts                # MUI theme config
    ├── mockData.ts             # Demo data (Google Classroom, Khan Academy)
    └── analyzer.ts             # Privacy policy analysis engine
```

## Analysis Engine

The analyzer detects:
- **Data collection** categories (personal, usage, device, location, educational, biometric)
- **Third-party sharing** (analytics, ads, social)
- **Child/minor data** flags (COPPA, FERPA references)
- **Tracking practices** (cookies, pixels, ad networks)
- **Red flags** (vague language, data selling, no deletion)
- **Strengths** (encryption, opt-out, transparency)
- **Readability** scoring (Flesch-Kincaid approximation)
- **Weighted risk score** across 8 categories

## API

### POST /api/analyze

```json
{
  "appName": "App Name",
  "url": "https://example.com",
  "policyUrl": "https://example.com/privacy",
  "rawText": "Full privacy policy text..."
}
```

Returns structured `AnalysisResult` JSON with scores, breakdowns, and recommendations.

## Demo

Visit the app and try:
- **"Google Classroom"** — Medium risk example (62/100)
- **"Khan Academy"** — Low risk example (78/100)

## License

MIT
