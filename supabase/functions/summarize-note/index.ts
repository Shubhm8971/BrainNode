import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase({ auth: ["publishable"] }, async (req, _ctx) => {
    const { content } = await req.json();

    if (!content) {
      return Response.json({ error: "Content is required" }, { status: 400 });
    }

    // Use Gemini API
    const API_KEY = Deno.env.get("GEMINI_API_KEY");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Summarize this note into a concise summary: ${content}` }] }]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json({ error: "Failed to reach Gemini" }, { status: 500 });
    }

    return Response.json({ 
      summary: data.candidates[0].content.parts[0].text 
    });
  }),
};