import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// Replace this with your actual PX API key
const PX_API_KEY = "dd3d4919-ad66-4b01-9586-3ccdd9649102";

serve(async (req) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (req.method !== "PUT") {
      return new Response("Method Not Allowed", { status: 405, headers });
    }

    const url = new URL(req.url);
    const identifyId = url.pathname.split("/").pop();

    if (!identifyId || !PX_API_KEY) {
      console.error("❌ Missing identifyId or PX API Key");
      return new Response("Missing ID or API key", { status: 400, headers });
    }

    const allowedFields = [
      "guidedTours", "onboardingBot", "productUpdates", "surveys", "trackUsage"
    ];

    const payload = await req.json();
    const preferences: Record<string, boolean> = {};

    for (const key of allowedFields) {
      if (key in payload) preferences[key] = payload[key];
    }

    console.log(`📨 Updating preferences for: ${identifyId}`);
    console.log("Payload:", preferences);

    const pxRes = await fetch(`https://api.aptrinsic.com/v1/user/preferences/${encodeURIComponent(identifyId)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-APTRINSIC-API-KEY": PX_API_KEY
      },
      body: JSON.stringify(preferences)
    });

    console.log("PX API response status:", pxRes.status);

    if (pxRes.status === 204) {
      return new Response(null, { status: 204, headers }); // ✅ must be null for 204
    }

    const errorText = await pxRes.text();
    console.warn("⚠️ PX API error:", errorText);
    return new Response(errorText, { status: pxRes.status, headers });

  } catch (err) {
    console.error("💥 Fatal error in Deno handler:", err.message);
    return new Response("Internal Server Error", { status: 500, headers });
  }
});
