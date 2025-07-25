import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }

  // Handle actual POST
  if (req.method === "POST") {
    const data = await req.json();
    console.log("Received from PX:", data);

    // (Optional) Forward to another service here

    return new Response("PX webhook received!", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  // All other methods
  return new Response("Method Not Allowed", {
    status: 405,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  });
});
