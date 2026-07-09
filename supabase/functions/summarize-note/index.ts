Deno.serve(async (req) => {
  const { content } = await req.json();
  const API_KEY = Deno.env.get("GEMINI_API_KEY");

  const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Summarize this note: ${content}` }] }]
    }),
  });

  const aiData = await aiResponse.json();

  // DEBUG: Check what the API actually returned if it fails
  if (!aiData.candidates) {
    return new Response(JSON.stringify({ error: "Invalid API response", details: aiData }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  const summary = aiData.candidates[0].content.parts[0].text;

  return new Response(JSON.stringify({ summary }), {
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
  });
});