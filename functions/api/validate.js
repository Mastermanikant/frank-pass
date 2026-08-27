function getCorsHeaders(request) {
  const origin = (request && request.headers) ? (request.headers.get("Origin") || "") : "";
  const allowed = (
    origin === "https://frankpass.com" ||
    origin === "https://www.frankpass.com" ||
    origin.startsWith("chrome-extension://") ||
    origin.startsWith("moz-extension://")
  );
  return {
    "Access-Control-Allow-Origin": allowed ? origin : "https://frankpass.com",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const corsHeaders = getCorsHeaders(request);

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { key, deviceId } = body;

    if (!key || !deviceId) {
      return new Response(JSON.stringify({ valid: false, error: "License key and device ID are required" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }
    
    if(!env.FRANKPASS_KV) {
        // Fallback for local testing if KV isn't setup
        if(key.startsWith("FRANK-TEST")) {
            return new Response(JSON.stringify({ valid: true, tier: "gold", type: "paid", label: "Gold Plan (Test)" }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
        }
        return new Response(JSON.stringify({ valid: false, error: "KV not configured" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders }});
    }

    const clientIP = request.headers.get("CF-Connecting-IP") || "unknown";
    const rlKey = "rl_validate_" + clientIP;
    let attempts = parseInt((await env.FRANKPASS_KV.get(rlKey)) || "0");
    if (attempts >= 20) {
      return new Response(JSON.stringify({ valid: false, error: "Too many validation attempts." }), { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }
    await env.FRANKPASS_KV.put(rlKey, (attempts + 1).toString(), { expirationTtl: 3600 });

    const licenseString = await env.FRANKPASS_KV.get("license_" + key);
    
    if (!licenseString) {
      return new Response(JSON.stringify({ valid: false, error: "Invalid license key" }), { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const license = JSON.parse(licenseString);

    if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
       return new Response(JSON.stringify({ valid: false, error: "License expired" }), { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }
    if (license.status !== "active") {
      return new Response(JSON.stringify({ valid: false, error: "License is " + license.status }), { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    let label = "Silver Plan";
    if (license.tier === "gold") label = "Gold Plan";
    if (license.tier === "platinum") label = "Platinum Plan";
    if (license.tier === "diamond") label = "Diamond Plan";
    if (license.type === "trial") label = "Free Trial";

    return new Response(JSON.stringify({ valid: true, tier: license.tier, type: license.type, label: label, expiresAt: license.expiresAt }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (error) {
    console.error("Error validating license:", error);
    return new Response(JSON.stringify({ valid: false, error: "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
}
