import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import ipaddr from 'ipaddr.js';
import dns from 'dns';
import { promisify } from 'util';
import { analyzeWithGemini } from './utils/gemini';
import { analyzePolicy } from './utils/analyzer';
import { AnalyzeRequest } from './utils/types';
import { rateLimit } from './utils/rateLimit';

dotenv.config();

const lookup = promisify(dns.lookup);
const app = express();
const PORT = process.env.PORT || 5000;

// SSRF prevention: Validate if the hostname resolves to a public IP
async function isSafeUrl(urlStr: string): Promise<boolean> {
  try {
    const url = new URL(urlStr);
    if (!['http:', 'https:'].includes(url.protocol)) return false;
    
    // Resolve hostname
    const { address } = await lookup(url.hostname);
    const addr = ipaddr.parse(address);
    const range = addr.range();
    
    // Block private/reserved ranges
    const unsafeRanges = ['private', 'loopback', 'linkLocal', 'multicast', 'broadcast', 'reserved', 'uniqueLocal', 'unspecified'];
    if (unsafeRanges.includes(range)) return false;
    
    return true;
  } catch {
    return false;
  }
}

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://generativelanguage.googleapis.com"]
    }
  }
}));

app.use(cors({
  origin: ['http://localhost:3000', 'https://policy-probe.vercel.app'],
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'Policy Probe API', version: '1.1.0 (Hardened)' });
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

    if (rawText && rawText.length > 200000) {
      res.status(400).json({ error: 'Input text is too large (max 200k chars).' });
      return;
    }

    let policyText = '';
    let resolvedUrl = policyUrl || url;

    if (rawText && rawText.trim().length > 0) {
      policyText = rawText;
    } else if (resolvedUrl) {
      // SSRF Check
      if (!(await isSafeUrl(resolvedUrl))) {
        res.status(400).json({ error: 'Invalid or restricted URL. Please paste text directly.' });
        return;
      }

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout
        const response = await fetch(resolvedUrl, {
          headers: { 
            'User-Agent': 'Mozilla/5.0 (compatible; PolicyProbe/1.1; +https://policy-probe.vercel.app)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9'
          },
          signal: controller.signal,
        });
        clearTimeout(timeout);
        
        if (!response.ok) {
          res.status(400).json({ error: `Policy fetch failed (HTTP ${response.status})` });
          return;
        }

        const html = await response.text();
        policyText = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&quot;/gi, '"').replace(/&#39;/gi, "'")
          .replace(/\s+/g, ' ').trim();
      } catch (e: any) {
         res.status(400).json({ error: e.name === 'AbortError' ? 'Fetch timed out' : 'Cloudflare/Firewall blocked access. Paste text instead.' });
         return;
      }
    } else if (appName && appName.trim()) {
      policyText = `Privacy policy analysis request for ${appName}. Using AI knowledge base.`;
    } else {
      res.status(400).json({ error: 'Provide app name or URL.' });
      return;
    }

    if (policyText.length < 50) {
       res.status(400).json({ error: 'Extracted text too short to verify.' });
       return;
    }

    const name = appName || 'Analyzed Entity';

    try {
      const result = await analyzeWithGemini(policyText, name, resolvedUrl);
      res.set('X-RateLimit-Remaining', String(remaining));
      res.json({ ...result, analysis_method: 'ai' });
    } catch (aiError) {
      console.warn('Gemini AI fallback triggered.');
      const result = analyzePolicy(policyText, name, resolvedUrl);
      res.set('X-RateLimit-Remaining', String(remaining));
      res.json({ ...result, analysis_method: 'keyword' });
    }
  } catch (error) {
    console.error('Audit Engine Critical Fail:', error);
    res.status(500).json({ error: 'Audit engine encountered a critical failure.' });
  }
});

app.listen(PORT, () => {
  console.log(`Probe HQ: Active on port ${PORT}`);
});

