export async function onRequestPost(context) {
  const { request, env } = context;

  // Set CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://frankpass.com",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { tier } = body;
    if (!tier) {
      return new Response(JSON.stringify({ error: "Tier is required" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    const randomHex = Array.from(array).map((b) => b.toString(16).padStart(2, "0")).join("");
    const trialKey = FRANK-TRIAL- + randomHex.toUpperCase().substring(0, 12);

    const clientIP = request.headers.get("CF-Connecting-IP") || "unknown";
    const rateLimitKey = ate_limit_trial_ + clientIP;
    
    // Fallback safely if KV is not yet bound
    if(!env.FRANKPASS_KV) {
       console.error("KV binding missing");
       return new Response(JSON.stringify({ error: "KV not configured" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders }});
    }

    let requestsToday = parseInt((await env.FRANKPASS_KV.get(rateLimitKey)) || "0");
    if (requestsToday >= 3) {
       return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again tomorrow." }), { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const licenseData = {
      key: trialKey,
      tier: tier,
      type: "trial",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      deviceCount: 0
    };

    await env.FRANKPASS_KV.put(license_ + trialKey, JSON.stringify(licenseData), { expirationTtl: 864000 });
    await env.FRANKPASS_KV.put(rateLimitKey, (requestsToday + 1).toString(), { expirationTtl: 86400 });

    return new Response(JSON.stringify({ success: true, key: trialKey, message: "Trial license generated successfully", expiresIn: "10 days" }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (error) {
    console.error("Error generating trial:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
}
