module.exports = async function handler(req, res) {
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
  const apiKey = process.env.OPENROUTER_API_KEY;
  const models = [
    process.env.MODEL_ID || 'google/gemini-2.5-flash',
    'openai/gpt-4o-mini',
    'anthropic/claude-3-haiku'
  ];

  if (!apiKey) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured on server.' });
  }

  const url = 'https://openrouter.ai/api/v1/chat/completions';

  for (const currentModel of models) {
    try {
      console.log(`[API] Attempting generation with model: ${currentModel}`);
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
          'HTTP-Referer': 'https://dse-math-gen.vercel.app',
          'X-Title': 'DSE Math Generator'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[API] Model ${currentModel} failed:`, errText);
        continue; // Try next model
      }

      const data = await response.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const text = data.choices[0].message.content;
        return res.status(200).json({ text, modelUsed: currentModel });
      } else {
        console.warn(`[API] Model ${currentModel} returned invalid data format.`);
        continue;
      }

    } catch (error) {
      console.error(`[API] Error with model ${currentModel}:`, error.message);
      continue;
    }
  }

  return res.status(502).json({ error: 'All AI models failed to generate a response. Please try again later.' });
};
