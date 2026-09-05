const http = require('http');

function getQuestions(moduleName) {
  return new Promise((resolve, reject) => {
    const path = `/api/assessment/filter/language/${encodeURIComponent(moduleName)}`;
    http.get({ hostname: 'localhost', port: 8080, path }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', reject);
  });
}

function submitAssessment(payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 8080,
        path: '/api/assessment/evaluate-with-ai',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function run() {
  const moduleName = 'Soft Skills - Professional Workplace Communication';
  console.log(`=== 1. FETCHING QUESTIONS FOR: "${moduleName}" ===`);
  const qRes = await getQuestions(moduleName);
  console.log('HTTP Status:', qRes.status);
  console.log('Questions Count:', qRes.data?.length);
  if (Array.isArray(qRes.data) && qRes.data.length > 0) {
    qRes.data.forEach((q, i) => {
      console.log(`\nQ${i + 1} (ID: ${q.id}) [${q.topic}]: ${q.text}`);
      console.log(`  A) ${q.optionA}`);
      console.log(`  B) ${q.optionB}`);
      console.log(`  C) ${q.optionC}`);
      console.log(`  D) ${q.optionD}`);
    });

    console.log(`\n=== 2. SUBMITTING TEST TO AI EVALUATION ENGINE ===`);
    const answers = qRes.data.map((q) => ({
      questionId: q.id,
      selectedOption: 'A', // Choose option A
    }));

    const subPayload = {
      userId: 6,
      skillName: moduleName,
      selfRating: 9,
      answers: answers,
    };

    const evalRes = await submitAssessment(subPayload);
    console.log('Submission HTTP Status:', evalRes.status);
    console.log('Evaluation Details:', JSON.stringify(evalRes.data, null, 2));
  } else {
    console.log('No questions returned or error:', qRes);
  }
}

run();
