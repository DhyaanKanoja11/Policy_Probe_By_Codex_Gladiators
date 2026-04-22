import { analyzeWithGemini } from '../src/utils/gemini';
import * as gemini from '../src/utils/gemini';

// Mock fetch
const originalFetch = global.fetch;
global.fetch = async (url: RequestInfo | URL, init?: RequestInit) => {
  const urlStr = url.toString();

  // Simulate fast failure for some models, or success for others
  if (urlStr.includes('gemini-2.5-flash')) {
    return { ok: false, status: 500, text: async () => 'Internal Server Error' } as Response;
  }
  if (urlStr.includes('gemini-2.0-flash:generateContent')) {
    return { ok: false, status: 503, text: async () => 'Service Unavailable' } as Response;
  }
  if (urlStr.includes('gemini-2.0-flash-lite')) {
    return { ok: false, status: 429, text: async () => 'Too Many Requests' } as Response;
  }

  // Success for 1.5-flash
  const mockResponse = {
    candidates: [{
      content: {
        parts: [{ text: '```json\n{"app_name": "Test", "overall_score": 90}\n```' }]
      }
    }]
  };

  return {
    ok: true,
    json: async () => mockResponse
  } as Response;
};

async function runBenchmark() {
  process.env.GEMINI_API_KEY = 'test_key';
  const start = Date.now();

  try {
    await analyzeWithGemini("Test policy text", "TestApp");
    const end = Date.now();
    console.log(`Benchmark finished in ${end - start}ms`);
  } catch (e) {
    console.error("Benchmark failed", e);
  } finally {
    global.fetch = originalFetch;
  }
}

runBenchmark();
