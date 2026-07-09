import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  // 1. Get environment variables
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  
  // 2. Parse the request body (e.g., getting the row ID to update)
  const { id, updatedContent } = await req.json();

  // 3. Use native fetch to call the PostgREST API
  // This endpoint: [Project URL]/rest/v1/[Table Name]
  const response = await fetch(`${supabaseUrl}/rest/v1/topics?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      "apikey": anonKey,
      "Authorization": `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation" // Optional: returns the updated row
    },
    body: JSON.stringify({ content: updatedContent }),
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});