import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { analyzeWithGemini } from './utils/gemini';
import { analyzePolicy } from './utils/analyzer';
import { AnalyzeRequest } from './utils/types';
import { rateLimit } from './utils/rateLimit';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use(helmet());

app.use(cors({
  origin: ['http://localhost:3000', 'https://policy-probe.vercel.app'],
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'Policy Probe API', version: '1.0.0' });
});

app.post('/api/analyze', async (req: Request, res: Response): Promise<void> => {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const { allowed, remaining, resetIn } = rateLimit(ip);

  if (!allowed) {
    res.set('X-RateLimit-Remaining', '0');
    res.set('Retry-After', String(Math.ceil(resetIn / 1000)));
    res.status(429).json({ error: `Rate limit exceeded. Try again in ${Math.ceil(resetIn / 1000)} seconds.` });
    return;
  }

  try {
    const body: AnalyzeRequest = req.body;
    const { appName, url, policyUrl, rawText } = body;

    if (rawText && rawText.length > 100000) {
      res.status(400).json({ error: 'Input text is too large (max 100,000 characters).' });
      return;
    }
    if (url && url.length > 2048) {
      res.status(400).json({ error: 'URL is too long.' });
      return;
    }

    let policyText = '';
    let resolvedUrl = policyUrl || url;

    if (rawText && rawText.trim().length > 0) {
      policyText = rawText;
    } else if (resolvedUrl) {
      try { new URL(resolvedUrl); } catch {
        res.status(400).json({ error: 'Invalid URL format.' });
        return;
      }
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);
        const response = await fetch(resolvedUrl, {
          headers: { 'User-Agent': 'PolicyProbe/1.0 (Privacy Analysis Tool)' },
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (!response.ok) {
          res.status(400).json({ error: `Failed to fetch: ${response.status}` });
          return;
        }
        const html = await response.text();
        policyText = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&quot;/gi, '"').replace(/&#39;/gi, "'")
          .replace(/\s+/g, ' ').trim();
      } catch {
         res.status(400).json({ error: 'Could not fetch URL. Please paste the text directly.' });
         return;
      }
    } else if (appName && appName.trim()) {
      policyText = `Privacy policy analysis request for ${appName}. Using AI knowledge base.`;
    } else {
      res.status(400).json({ error: 'Provide an app name, URL, or policy text.' });
      return;
    }

    if (policyText.length < 20) {
       res.status(400).json({ error: 'Text too short to analyze.' });
       return;
    }

    const name = appName || 'Analyzed App';

    try {
      const result = await analyzeWithGemini(policyText, name, resolvedUrl);
      res.set('X-RateLimit-Remaining', String(remaining));
      res.json({ ...result, analysis_method: 'ai' });
      return;
    } catch (aiError) {
      logger.warn('Gemini AI fallback:', aiError);
      const result = analyzePolicy(policyText, name, resolvedUrl);
      res.set('X-RateLimit-Remaining', String(remaining));
      res.json({ ...result, analysis_method: 'keyword' });
      return;
    }
  } catch (error) {
    logger.error('Analysis error:', error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
    return;
  }
});

app.listen(PORT, () => {
  logger.info(`Backend server running on http://localhost:${PORT}`);
});
