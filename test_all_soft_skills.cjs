const http = require('http');

const MODULES = [
  'Soft Skills - Professional Workplace Communication',
  'Soft Skills - Agile Teamwork & Collaboration',
  'Soft Skills - Workplace Conflict Resolution',
  'Soft Skills - Workplace Ethics & Accountability',
  'Soft Skills - Adaptability & Critical Thinking'
];

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

async function checkAll() {
  for (const mod of MODULES) {
    console.log(`\n========================================`);
    console.log(`Checking Module: "${mod}"`);
    try {
      const res = await getQuestions(mod);
      console.log(`HTTP Status: ${res.status}`);
      if (Array.isArray(res.data)) {
        console.log(`Count of Questions in DB: ${res.data.length}`);
        res.data.forEach((q, idx) => {
          console.log(`  Q${idx + 1} (ID: ${q.id}): [${q.topic}] ${q.text.substring(0, 80)}...`);
        });
      } else {
        console.log(`Response data:`, res.data || res.raw);
      }
    } catch (err) {
      console.error(`Error querying ${mod}:`, err.message);
    }
  }
}

checkAll();
