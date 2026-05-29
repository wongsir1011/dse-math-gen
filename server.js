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

  const models = [
    process.env.MODEL_ID || 'google/gemini-2.5-flash',
    'openai/gpt-4o-mini',
    'anthropic/claude-3-haiku'
  ];

  if (!apiKey) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured in .env' });
  }

  const url = 'https://openrouter.ai/api/v1/chat/completions';

  for (const currentModel of models) {
    try {
      console.log(`[Server] Attempting generation with model: ${currentModel}`);
      const payload = {
        model: currentModel,
        messages: [{ role: 'user', content: prompt }],
        reasoning: { exclude: true },
        temperature: 0.7,
        stream: false
      };

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

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[Server] Model ${currentModel} failed:`, errText);
        continue;
      }

      const data = await response.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const text = data.choices[0].message.content;
        return res.status(200).json({ text, modelUsed: currentModel });
      } else {
        continue;
      }

    } catch (error) {
      console.error(`[Server] Error with model ${currentModel}:`, error.message);
      continue;
    }
  }

  return res.status(502).json({ error: 'All AI models failed to generate a response.' });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
