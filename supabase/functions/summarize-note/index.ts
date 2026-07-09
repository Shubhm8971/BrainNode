Deno.serve(async (req) => {
  // Handle CORS for browser requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  const { content } = await req.json();

  // 1. Call Gemini directly using native fetch
  const API_KEY = Deno.env.get("GEMINI_API_KEY");
  const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Summarize this note: ${content}` }] }]
    }),
  });

  const aiData = await aiResponse.json();
  const summary = aiData.candidates[0].content.parts[0].text;

  // 2. Return result with standard headers (No SDK used)
  return new Response(JSON.stringify({ summary }), {
    headers: { 
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json' 
    },
  });
});