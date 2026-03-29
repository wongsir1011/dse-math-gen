APImodule.exports = async function handler(req, res) {
  // Setup CORS to allow local HTML testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt in request body.' });
  }

  // Get the API Key securely from Vercel Environment Variables
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'DEEPSEEK_API_KEY not configured on server.' });
  }

  const url = 'https://api.deepseek.com/chat/completions';

  const payload = {
    model: 'deepseek-reasoner',
    messages: [
      { role: 'user', content: prompt }
    ],
    stream: false
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('DeepSeek API Error:', errText);
      return res.status(response.status).json({ error: 'Failed to communicate with the DeepSeek API.' });
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    // Return a standardized response
    return res.status(200).json({ text });

  } catch (error) {
    console.error('Server execution error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
