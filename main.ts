import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// PX API key (replace with your actual key)
const PX_API_KEY = "dd3d4919-ad66-4b01-9586-3ccdd9649102";

serve(async (req) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    // Validate method
    if (req.method !== "PUT") {
      return new Response("Method Not Allowed", { status: 405, headers });
    }

    // Get identifyId from URL
    const url = new URL(req.url);
    const identifyId = url.pathname.split("/").pop();

    if (!identifyId || !PX_API_KEY) {
      return new Response("Missing ID or API key", { status: 400, headers });
    }

    const allowedFields = [
      "guidedTours", "onboardingBot", "productUpdates", "surveys", "trackUsage"
    ];

    let payload = await req.json();
    const preferences: Record<string, boolean> = {};

    for (const key of allowedFields) {
      if (key in payload) preferences[key] = payload[key];
    }

    // Log to debug
    console.log("Forwarding preferences for", identifyId, preferences);

    // Call PX API
    const pxRes = await fetch(`https://api.aptrinsic.com/v1/user/preferences/${encodeURIComponent(identifyId)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-APTRINSIC-API-KEY": PX_API_KEY
      },
      body: JSON.stringify(preferences)
    });

    if (pxRes.status === 204) {
      return new Response("OK", { status: 204, headers });
    }

    const errorText = await pxRes.text();
    return new Response(errorText, { status: pxRes.status, headers });

  } catch (err) {
    console.error("💥 Deno crashed:", err);
    return new Response("Internal Server Error", { status: 500, headers });
  }
});
