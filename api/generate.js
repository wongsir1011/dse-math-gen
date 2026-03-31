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
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured on server.' });
  }

  // Define models to try in order of preference
  const modelsToTry = [
    process.env.MODEL_ID, // Use environment variable if set
    'google/gemini-2.5-flash',
    'google/gemini-2.0-flash',
    'openai/gpt-4o-mini',
    'x-ai/grok-4.1-fast'
  ].filter(Boolean); // Remove null/undefined

  const url = 'https://openrouter.ai/api/v1/chat/completions';
  let lastError = null;

  // Retry Loop
  for (const currentModel of modelsToTry) {
    try {
      console.log(`[API] Attempting model: ${currentModel}`);
      
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
        console.error(`[API] Model ${currentModel} failed:`, errText);
        lastError = `Model ${currentModel} error: ${response.status} ${errText}`;
        continue; // Try next model
      }

      const data = await response.json();
      if (!data.choices || data.choices.length === 0) {
        console.error(`[API] Model ${currentModel} returned empty choices`);
        lastError = `Model ${currentModel} returned empty results.`;
        continue;
      }

      const text = data.choices[0].message.content;
      console.log(`[API] Successfully generated using: ${currentModel}`);
      
      return res.status(200).json({ 
        text, 
        modelUsed: currentModel 
      });

    } catch (error) {
      console.error(`[API] Execution error for model ${currentModel}:`, error.message);
      lastError = error.message;
      continue; // Try next model
    }
  }

  // If all models failed
  return res.status(500).json({ 
    error: 'All configured AI models failed to respond.', 
    details: lastError 
  });
}
