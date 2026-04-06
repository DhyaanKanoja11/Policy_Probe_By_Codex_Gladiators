# 🚀 Policy Probe — Deployment Guide

## Architecture

```
Frontend (Vercel)  ──►  Backend (Render/Railway)  ──►  Gemini 2.0 Flash API
  Next.js 16              Express + TypeScript           Google AI
  Port 3000               Port 5000
```

---

## Prerequisites

- [Node.js 18+](https://nodejs.org)
- [Gemini API Key](https://aistudio.google.com/apikey) (free)
- GitHub account

---

## 🧪 Local Development

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/Policy-Probe.git
cd Policy-Probe

# 2. Backend
cd policy-probe-backend
cp .env.example .env          # Then edit .env with your real API key
npm install
npm run dev                   # Runs on http://localhost:5000

# 3. Frontend (new terminal)
cd policy-probe-app
cp .env.example .env.local    # Uses http://localhost:5000 by default
npm install
npm run dev                   # Runs on http://localhost:3000
```

---

## ☁️ Deploy Backend → Render

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo

| Setting | Value |
|---------|-------|
| Root Directory | `policy-probe-backend` |
| Build Command | `npm install && npm run build` |
| Start Command | `node dist/server.js` |

3. Add **Environment Variables**:

| Key | Value |
|-----|-------|
| `GEMINI_API_KEY` | Your real key from [AI Studio](https://aistudio.google.com/apikey) |
| `PORT` | `5000` |
| `NODE_ENV` | `production` |

4. Deploy → Copy your URL (e.g. `https://policy-probe-api.onrender.com`)

> ⚠️ Free tier sleeps after 15min inactivity. First request after sleep takes ~30s.

---

## ☁️ Deploy Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **Import Project**
2. Select your repo

| Setting | Value |
|---------|-------|
| Root Directory | `policy-probe-app` |
| Framework | Next.js (auto-detected) |

3. Add **Environment Variable**:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://policy-probe-api.onrender.com` ← your Render URL, no trailing slash |

4. Deploy

---

## 🔗 Post-Deploy: Update CORS

Edit `policy-probe-backend/src/server.ts` — add your Vercel domain:

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://policy-probe.vercel.app',  // ← your actual Vercel URL
  ],
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

Push to GitHub → Render auto-redeploys.

---

## 🔐 Environment Variables Reference

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

> **Never commit `.env` or `.env.local`** — they are gitignored. Only `.env.example` (with placeholders) is in the repo.

---

## 🔄 Alternative: Railway (Backend)

1. [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Root Directory: `policy-probe-backend`
3. Add same 3 env vars
4. Use Railway URL as `NEXT_PUBLIC_API_URL` in Vercel
