const express = require('express');
const path = require('path');
require('dotenv').config();
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Simulate Vercel Serverless Function behavior
app.post('/api/generate', async (req, res) => {
  console.log(`[Server] Received POST /api/generate`);
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt in request body.' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.MODEL_ID || 'google/gemini-3-flash-preview';

  if (!apiKey) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured in .env' });
  }

  const url = 'https://openrouter.ai/api/v1/chat/completions';

  const payload = {
    model: model,
    messages: [
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    stream: false
  };

  try {
    console.log(`[Server] Calling OpenRouter API (${model})...`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'DSE Math Generator'
      },
      body: JSON.stringify(payload)
    });
    console.log(`[Server] AI API response status: ${response.status}`);

    if (!response.ok) {
      const errText = await response.text();
      console.error('AI API Error:', errText);
      return res.status(response.status).json({ error: 'Failed to communicate with the AI API.' });
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    return res.status(200).json({ text });

  } catch (error) {
    console.error('Server execution error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
