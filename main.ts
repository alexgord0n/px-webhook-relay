// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const data = await req.json();
  console.log("Received from PX:", data);

  // Example: Forward to another service (optional)
  await fetch("https://your-api.com/endpoint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // "Authorization": "Bearer your_token" // optional
    },
    body: JSON.stringify(data),
  });

  return new Response("OK", { status: 200 });
});
