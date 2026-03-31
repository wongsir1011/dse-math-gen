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
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured in .env' });
  }

  // Define models to try in order of preference
  const modelsToTry = [
    process.env.MODEL_ID, // Use environment variable if set
    'google/gemini-2.5-flash',
    'google/gemini-2.0-flash',
    'openai/gpt-4o-mini',
    'x-ai/grok-4.1-fast'
  ].filter(Boolean);

  const url = 'https://openrouter.ai/api/v1/chat/completions';
  let lastError = null;

  for (const currentModel of modelsToTry) {
    try {
      console.log(`[Server] Attempting model: ${currentModel}`);
      
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
          'X-Title': 'DSE Math Generator (Local)'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`[Server] Model ${currentModel} failed:`, errText);
        lastError = `Model ${currentModel} error: ${response.status} ${errText}`;
        continue;
      }

      const data = await response.json();
      if (!data.choices || data.choices.length === 0) {
        lastError = `Model ${currentModel} returned empty results.`;
        continue;
      }

      const text = data.choices[0].message.content;
      console.log(`[Server] Successfully generated using: ${currentModel}`);
      
      return res.status(200).json({ 
        text,
        modelUsed: currentModel 
      });

    } catch (error) {
      console.error(`[Server] Execution error for model ${currentModel}:`, error.message);
      lastError = error.message;
      continue;
    }
  }

  return res.status(500).json({ 
    error: 'All configured AI models failed to respond.', 
    details: lastError 
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
