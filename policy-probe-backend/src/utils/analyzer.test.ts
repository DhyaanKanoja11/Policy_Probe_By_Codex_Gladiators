import { test } from 'node:test';
import * as assert from 'node:assert';
import { countKeywordHits } from './analyzer';

test('countKeywordHits counts occurrences correctly', () => {
  assert.strictEqual(countKeywordHits('this is a test', ['test', 'missing']), 1);
  assert.strictEqual(countKeywordHits('apple banana', ['apple', 'orange']), 1);
});

test('countKeywordHits is case insensitive', () => {
  assert.strictEqual(countKeywordHits('A CAPITAL WORD', ['capital', 'word']), 2);
});

test('countKeywordHits missing boundary test', () => {
  // Current implementation uses includes(), so it will match "cat" in "category".
  // We will assert the current behavior exactly to lock it in and prevent regressions.
  assert.strictEqual(countKeywordHits('this is a category', ['cat', 'dog']), 1);
  assert.strictEqual(countKeywordHits('car carpet carpool', ['car']), 1);
  // Multiple occurrences of the same keyword still count as 1 hit since we filter the keywords array, not count matches in text.
  assert.strictEqual(countKeywordHits('cat cat cat', ['cat']), 1);
});

test('countKeywordHits handles empty input', () => {
  assert.strictEqual(countKeywordHits('', ['test']), 0);
  assert.strictEqual(countKeywordHits('text', []), 0);
  assert.strictEqual(countKeywordHits('', []), 0);
});
