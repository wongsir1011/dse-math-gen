const fetch = require('node-fetch');

async function test() {
  const response = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'Generate a HKDSE math question about percentages in JSON format.' })
  });

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
