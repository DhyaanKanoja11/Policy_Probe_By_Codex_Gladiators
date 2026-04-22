import test, { describe } from 'node:test';
import * as assert from 'node:assert';
import { analyzePolicy } from '../../src/utils/analyzer';

describe('analyzePolicy', () => {
  test('returns default AnalysisResult for empty string', () => {
    const result = analyzePolicy('');
    assert.strictEqual(result.app_name, 'Unknown App');
    assert.strictEqual(result.overall_score, 63); // 20 + 20 + 3 + 10 + 0 + 0 + 0 + 5 + 5
    assert.strictEqual(result.risk_level, 'Medium'); // 63 >= 50
  });

  test('analyzes an app with high risk policy', () => {
    const text = 'We collect your name, email, phone, address, age. We share data with third party advertiser google analytics meta facebook ad network. We may might could possibly change policy without notice. We track you using cookie pixel beacon fingerprint advertising targeted. We sell data.';
    const result = analyzePolicy(text, 'Bad App', 'http://example.com/privacy');
    assert.strictEqual(result.app_name, 'Bad App');
    assert.strictEqual(result.policy_url, 'http://example.com/privacy');
    assert.strictEqual(result.risk_level, 'High');

    assert.ok(result.data_collected.length > 0);
    assert.ok(result.third_party_sharing.length > 0);
    assert.ok(result.red_flags.length > 0);
    assert.ok(result.red_flags.some(f => f.title === 'Potential data selling'));
  });

  test('analyzes an app with low risk policy', () => {
    const text = 'We encrypt all data using ssl and tls security to protect and safeguard. We do not sell data. We comply with coppa and ferpa to protect children and student. You can delete, access, correct, and port your data. We retain data securely.';
    const result = analyzePolicy(text, 'Good App');

    assert.strictEqual(result.app_name, 'Good App');
    assert.strictEqual(result.risk_level, 'Low');

    assert.ok(result.strengths.length > 0);
    assert.ok(result.strengths.includes('Encryption mentioned for data protection'));
    assert.ok(result.compliance_flags.coppa.compliant);
    assert.ok(result.compliance_flags.ferpa.compliant);
  });

  test('computes readability correctly', () => {
    const text = 'This is a simple sentence. It is very easy to read.';
    const result = analyzePolicy(text);
    assert.ok(typeof result.readability_score === 'number');
    assert.ok(result.readability_score >= 0 && result.readability_score <= 100);
  });
});
