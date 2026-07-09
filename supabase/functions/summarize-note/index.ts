import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase({ auth: ["publishable"] }, async (req, _ctx) => {
    // 1. Check if body exists
    if (!req.body) {
      return Response.json({ error: "Request body is missing" }, { status: 400 });
    }

    try {
      const { content } = await req.json(); // This is where it was crashing
      if (!content) {
        return Response.json({ error: "Content field is missing in JSON" }, { status: 400 });
      }

      // ... proceed with Gemini API call ...
      
    } catch (err) {
      console.error("Failed to parse JSON:", err);
      return Response.json({ error: "Invalid JSON format" }, { status: 400 });
    }
  }),
};