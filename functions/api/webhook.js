/**
 * FrankPass Cloudflare Pages Function
 * Note: frankpass.com is 100% stateless. E-commerce payments & licenses are processed via store.frankbase.com.
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const rawBody = await request.clone().text();
    const signature = request.headers.get("Dodo-Signature") || request.headers.get("dodo-signature");

    // Mandatory webhook signature verification
    if (!env.DODO_WEBHOOK_SECRET) {
      return new Response(JSON.stringify({ error: 'Webhook secret not configured' }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!signature) {
      return new Response(JSON.stringify({ error: "Missing webhook signature" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(env.DODO_WEBHOOK_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    if (signature !== expectedSignature) {
      return new Response(JSON.stringify({ error: "Invalid webhook signature" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const payload = await request.json();
    const event = payload.type;
    const data = payload.data;
    
    if(!env.FRANKPASS_KV) {
        return new Response(JSON.stringify({ error: "KV not configured" }), { status: 500, headers: { "Content-Type": "application/json" }});
    }

    if (event === "payment.succeeded" || event === "subscription.created") {
      const email = data.customer?.email || "unknown@example.com";
      let tier = "silver";
      const metaTier = (data.metadata?.tier || data.product?.name || data.description || "").toLowerCase();
      if (metaTier.includes("diamond")) tier = "diamond";
      else if (metaTier.includes("platinum")) tier = "platinum";
      else if (metaTier.includes("gold")) tier = "gold";
      
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      const randomHex = Array.from(array).map(b => b.toString(16).padStart(2, "0")).join("");
      const keyStr = "FRANK-" + tier.toUpperCase().charAt(0) + "-" + randomHex.substring(0, 14).toUpperCase();

      const licenseData = {
        key: keyStr,
        tier: tier,
        type: "paid",
        email: email,
        customerId: data.customer?.id,
        subscriptionId: data.subscription_id,
        createdAt: new Date().toISOString(),
        expiresAt: event === "subscription.created" ? null : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
        deviceCount: 0
      };

      await env.FRANKPASS_KV.put("license_" + keyStr, JSON.stringify(licenseData));
      await env.FRANKPASS_KV.put("customer_" + email, keyStr);
      console.log("License generated for " + email);
    }

    if (event === "subscription.canceled") {
      const email = data.customer?.email;
      if (email) {
        const keyStr = await env.FRANKPASS_KV.get("customer_" + email);
        if (keyStr) {
           const licenseStr = await env.FRANKPASS_KV.get("license_" + keyStr);
           if (licenseStr) {
             const license = JSON.parse(licenseStr);
             license.status = "canceled";
             await env.FRANKPASS_KV.put("license_" + keyStr, JSON.stringify(license));
           }
        }
      }
    }
    return new Response(JSON.stringify({ received: true }), { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: "Webhook Error" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
}
