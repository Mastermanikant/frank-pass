export async function onRequestGet(context) {
  const { env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://frankpass.com",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    if (!env.FRANKPASS_KV) {
      return new Response(JSON.stringify({ success: true, stats: { totalReviews: 0, averageRating: 0 }, reviews: [] }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const statsRaw = await env.FRANKPASS_KV.get("reviews_stats");
    const reviewsRaw = await env.FRANKPASS_KV.get("reviews_list");

    const stats = statsRaw ? JSON.parse(statsRaw) : { totalReviews: 0, averageRating: 0 };
    const reviews = reviewsRaw ? JSON.parse(reviewsRaw) : [];

    return new Response(JSON.stringify({ success: true, stats, reviews }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch reviews" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://frankpass.com",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!env.FRANKPASS_KV) {
      return new Response(JSON.stringify({ error: "Storage not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const clientIP = request.headers.get("CF-Connecting-IP") || "unknown";
    const rateLimitKey = "rl_review_" + clientIP;

    const hasReviewed = await env.FRANKPASS_KV.get(rateLimitKey);
    if (hasReviewed) {
      return new Response(JSON.stringify({ error: "You have already submitted a review recently. Thank you!" }), {
        status: 429,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const body = await request.json();
    const rating = parseInt(body.rating, 10);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return new Response(JSON.stringify({ error: "Valid star rating (1-5) is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // Clean & sanitize comment and display name (Anti-XSS)
    const rawComment = (body.comment || "").toString().trim().replace(/<[^>]*>?/gm, "").substring(0, 500);
    const rawName = (body.name || "").toString().trim().replace(/<[^>]*>?/gm, "").substring(0, 50);
    const displayName = rawName || "Anonymous Supporter";

    const newReview = {
      id: "rev_" + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      rating,
      comment: rawComment,
      name: displayName,
      date: new Date().toISOString().split("T")[0]
    };

    // Retrieve existing reviews and stats
    const statsRaw = await env.FRANKPASS_KV.get("reviews_stats");
    const reviewsRaw = await env.FRANKPASS_KV.get("reviews_list");

    let stats = statsRaw ? JSON.parse(statsRaw) : { totalReviews: 0, averageRating: 0, ratingSum: 0 };
    let reviews = reviewsRaw ? JSON.parse(reviewsRaw) : [];

    // Calculate accurate incremental stats
    stats.totalReviews = (stats.totalReviews || 0) + 1;
    stats.ratingSum = (stats.ratingSum || 0) + rating;
    stats.averageRating = parseFloat((stats.ratingSum / stats.totalReviews).toFixed(1));

    // Prepend new review (keep most recent 100 reviews)
    reviews.unshift(newReview);
    if (reviews.length > 100) reviews = reviews.slice(0, 100);

    // Save to Cloudflare KV
    await env.FRANKPASS_KV.put("reviews_stats", JSON.stringify(stats));
    await env.FRANKPASS_KV.put("reviews_list", JSON.stringify(reviews));
    // Set 24h rate limit for this IP
    await env.FRANKPASS_KV.put(rateLimitKey, "1", { expirationTtl: 86400 });

    return new Response(JSON.stringify({
      success: true,
      message: "Review submitted successfully! Thank you for your feedback.",
      review: newReview,
      stats: { totalReviews: stats.totalReviews, averageRating: stats.averageRating }
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (err) {
    console.error("Review submission error:", err);
    return new Response(JSON.stringify({ error: "Failed to submit review" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
}
