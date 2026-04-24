const assert = require('assert');

const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'];

async function simulateCall(model, delay, shouldFail, errorCode) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error(`HTTP ${errorCode}: Failed`));
      } else {
        resolve(`Success from ${model}`);
      }
    }, delay);
  });
}

async function originalLogic() {
  let lastErr = null;
  for (const model of MODELS) {
    try {
      // Simulate: first 3 models fail fast (100ms) with 500 error
      // The last one succeeds in 200ms
      const isLast = model === MODELS[MODELS.length - 1];
      const res = await simulateCall(model, 100, !isLast, 500);
      return res;
    } catch (e) {
      lastErr = e;
      if (model !== MODELS[MODELS.length - 1]) {
        await new Promise(r => setTimeout(r, 1500));
      }
    }
  }
  throw lastErr;
}

async function run() {
  const start = Date.now();
  await originalLogic();
  const end = Date.now();
  console.log(`Original took: ${end - start}ms`);
}

run();

async function optimizedLogic() {
  let lastErr = null;
  for (const model of MODELS) {
    try {
      const isLast = model === MODELS[MODELS.length - 1];
      const res = await simulateCall(model, 100, !isLast, 500);
      return res;
    } catch (e) {
      lastErr = e;
      // If the error is an HTTP 429 (Rate Limit), we should delay.
      // Otherwise, we shouldn't introduce a static delay for fast failures like 500.
      if (model !== MODELS[MODELS.length - 1] && e.message.includes('HTTP 429')) {
        await new Promise(r => setTimeout(r, 1500));
      }
    }
  }
  throw lastErr;
}

async function runOptimized() {
  const start = Date.now();
  await optimizedLogic();
  const end = Date.now();
  console.log(`Optimized took: ${end - start}ms`);
}

runOptimized();
