const http = require('http');

const subPayload = JSON.stringify({
  userId: 6,
  skillName: 'Soft Skills - Professional Workplace Communication',
  selfRating: 9,
  answers: [
    { questionId: 17, selectedOption: 'B' },
    { questionId: 18, selectedOption: 'B' },
    { questionId: 19, selectedOption: 'C' },
  ],
});

const req = http.request(
  {
    hostname: 'localhost',
    port: 8080,
    path: '/api/assessment/evaluate-with-ai',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(subPayload),
    },
  },
  (res) => {
    let data = '';
    res.on('data', (c) => (data += c));
    res.on('end', () => {
      console.log('HTTP Status:', res.statusCode);
      try {
        console.log(JSON.stringify(JSON.parse(data), null, 2));
      } catch {
        console.log(data);
      }
    });
  }
);

req.on('error', (err) => console.error(err.message));
req.write(subPayload);
req.end();
