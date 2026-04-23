import { analyzePolicy } from '../src/utils/analyzer';

const dummyText = `This is a privacy policy. We collect your name, email, and location.
We share data with third party vendors and Google Analytics.
We track you with cookies and pixels. We retain data. We encrypt it with SSL.
Children under 13 are protected by COPPA. We might sell data, maybe.
`.repeat(5000); // make it long

const start = Date.now();
for (let i = 0; i < 50; i++) {
  analyzePolicy(dummyText, 'Test App');
}
const end = Date.now();
console.log(`Execution time: ${end - start} ms`);
