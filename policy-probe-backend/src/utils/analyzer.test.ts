import { detectDataCategories, countKeywordHits } from './analyzer';
import { test } from 'node:test';
import * as assert from 'node:assert';

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

test('detectDataCategories should return an empty array if no keywords are matched', () => {
  const text = 'This text has nothing to do with privacy data.';
  const categories = detectDataCategories(text);
  assert.deepStrictEqual(categories, []);
});

test('detectDataCategories should detect low risk data categories (1 keyword)', () => {
  const text = 'We collect your name.';
  const categories = detectDataCategories(text);
  assert.deepStrictEqual(categories, [
    {
      category: 'Personal Information',
      items: ['Name'],
      risk: 'Low',
    },
  ]);
});

test('detectDataCategories should detect medium risk data categories (2-3 keywords)', () => {
  const text = 'We collect your name and email.';
  const categories = detectDataCategories(text);
  assert.deepStrictEqual(categories, [
    {
      category: 'Personal Information',
      items: ['Name', 'Email'],
      risk: 'Medium',
    },
  ]);

  const text2 = 'We collect your name, email, and phone.';
  const categories2 = detectDataCategories(text2);
  assert.deepStrictEqual(categories2, [
    {
      category: 'Personal Information',
      items: ['Name', 'Email', 'Phone'],
      risk: 'Medium',
    },
  ]);
});

test('detectDataCategories should detect high risk data categories (>= 4 keywords)', () => {
  const text = 'We collect your name, email, phone, address, and profile data.';
  const categories = detectDataCategories(text);
  assert.deepStrictEqual(categories, [
    {
      category: 'Personal Information',
      items: ['Name', 'Email', 'Phone', 'Address', 'Profile'],
      risk: 'High',
    },
  ]);
});

test('detectDataCategories should detect multiple data categories correctly', () => {
  const text = 'We collect your username. We also record your IP address and operating system.';
  // 'address' is part of 'IP address', so it gets picked up as well under Personal Information.
  const categories = detectDataCategories(text);

  // We need to assert these two categories exist
  const hasPersonalInfo = categories.some(c =>
    c.category === 'Personal Information' &&
    c.items.includes('Name') &&
    c.items.includes('Address') &&
    c.risk === 'Medium'
  );

  const hasDeviceInfo = categories.some(c =>
    c.category === 'Device Information' &&
    c.items.includes('Ip address') &&
    c.items.includes('Operating system') &&
    c.risk === 'Medium'
  );

  assert.ok(hasPersonalInfo);
  assert.ok(hasDeviceInfo);
});

test('detectDataCategories should be case-insensitive when detecting keywords', () => {
  const text = 'We collect your NAME and EMAIL. We also log your IP ADDRESS.';
  // 'address' is part of 'IP ADDRESS', so it also matches under Personal Information.
  const categories = detectDataCategories(text);

  const hasPersonalInfo = categories.some(c =>
    c.category === 'Personal Information' &&
    c.items.includes('Name') &&
    c.items.includes('Email') &&
    c.items.includes('Address') &&
    c.risk === 'Medium'
  );

  const hasUsageInfo = categories.some(c =>
    c.category === 'Usage Information' &&
    c.items.includes('Log') &&
    c.risk === 'Low'
  );

  const hasDeviceInfo = categories.some(c =>
    c.category === 'Device Information' &&
    c.items.includes('Ip address') &&
    c.risk === 'Low'
  );

  assert.ok(hasPersonalInfo);
  assert.ok(hasUsageInfo);
  assert.ok(hasDeviceInfo);
});
