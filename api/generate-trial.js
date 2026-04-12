/**
 * FrankPass Trial Key Generator API
 * Route: /api/generate-trial
 * Called by: frankpass.com/pro page (POST request)
 *
 * Generates a unique license key for the requested tier,
 * stores it in Vercel KV with a 10-day expiry.
 *
 * Body: { tier: 'silver'|'gold'|'diamond'|'platinum'|'amrol', email?: string }
 * Response: { success: true, key: 'FRANK-XXXX-XXXX-XXXX', tier, days_left: 10 }
 */

import { createClient } from '@vercel/kv';

const TIER_LIMITS = {
    silver:   1,
    gold:     5,
    diamond:  15,
    platinum: 30,
    amrol:    60
};

const TIER_LABELS = {
    silver:   'Silver',
    gold:     'Gold',
    diamond:  'Diamond',
    platinum: 'Platinum',
    amrol:    'Amrol'
};

const VALID_TIERS = Object.keys(TIER_LIMITS);
const TRIAL_DAYS  = 10;

const API_URL   = process.env.KV_REST_API_URL;
const API_TOKEN = process.env.KV_REST_API_TOKEN;
const KV_OK     = !!(API_URL && API_TOKEN);

// IP rate limiting is now handled securely in Vercel KV with a fail-open fallback.

export const config = { runtime: 'edge' };

export default async function handler(req) {

    // ── CORS ─────────────────────────────────────────────────────────────────
    const origin = req.headers.get('origin') || '';
    const allowed = ['https://frankpass.com', 'https://www.frankpass.com', 'http://localhost'];
    const corsOk  = allowed.some(o => origin.startsWith(o));

    const corsHeaders = {
        'Access-Control-Allow-Origin':  corsOk ? origin : 'https://frankpass.com',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ success: false, reason: 'method_not_allowed' }), {
            status: 405, headers: corsHeaders
        });
    }

    // ── Parse body ───────────────────────────────────────────────────────────
    let body;
    try { body = await req.json(); }
    catch {
        return new Response(JSON.stringify({ success: false, reason: 'bad_request' }), {
            status: 400, headers: corsHeaders
        });
    }

    const tier  = (body.tier || 'silver').toLowerCase();
    const email = (body.email || '').toLowerCase().trim();

    if (!VALID_TIERS.includes(tier)) {
        return new Response(JSON.stringify({ success: false, reason: 'invalid_tier' }), {
            status: 400, headers: corsHeaders
        });
    }

    // ── IP-based rate limit (3 trials per day per KV) ────────────────────────
    const ip      = req.headers.get('x-forwarded-for') || 'unknown';
    const ipKey   = `ratelimit:ip:${ip}:${new Date().toISOString().split('T')[0]}`;

    if (KV_OK) {
        try {
            const kv = createClient({ url: API_URL, token: API_TOKEN });
            const ipCount = (await kv.get(ipKey)) || 0;
            if (ipCount >= 3) {
                return new Response(JSON.stringify({ success: false, reason: 'too_many_trials', message: 'Maximum 3 trial keys per day. Try again tomorrow.' }), {
                    status: 429, headers: corsHeaders
                });
            }
            // Increment the usage directly in KV with a 24-hour expiry
            await kv.set(ipKey, ipCount + 1, { ex: 86400 });
        } catch (err) {
            console.error('KV rate limit error:', err);
            // Fail-open logic: if KV temporarily fails, do not block genuine users from trying the app out.
        }
    }

    // ── Generate unique key ──────────────────────────────────────────────────
    const key = generateKey(tier);

    // ── Build license object ─────────────────────────────────────────────────
    const now       = new Date();
    const expiresAt = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
    const license   = {
        key,
        tier,
        max_profiles: TIER_LIMITS[tier],
        label:        TIER_LABELS[tier],
        trial:        true,
        days:         TRIAL_DAYS,
        valid_until:  expiresAt.toISOString(),
        created_at:   now.toISOString(),
        email:        email || null,
        devices:      []
    };

    // ── Store in KV (production) or skip (dev) ───────────────────────────────
    if (KV_OK) {
        try {
            const kv = createClient({ url: API_URL, token: API_TOKEN });
            // TTL: TRIAL_DAYS + 2 extra days buffer (in seconds)
            const ttlSeconds = (TRIAL_DAYS + 2) * 24 * 60 * 60;
            await kv.set(`license:${key}`, license, { ex: ttlSeconds });
        } catch (err) {
            console.error('KV store error:', err);
            // Continue anyway — better a working key than a failed response
        }
    }

    // ── Respond with the key ─────────────────────────────────────────────────
    return new Response(JSON.stringify({
        success:      true,
        key,
        tier,
        label:        TIER_LABELS[tier],
        max_profiles: TIER_LIMITS[tier],
        days_left:    TRIAL_DAYS,
        valid_until:  expiresAt.toISOString(),
        dev_mode:     !KV_OK  // tells frontend if KV is missing
    }), { status: 200, headers: corsHeaders });
}

// ── Key Generator ────────────────────────────────────────────────────────────
function generateKey(tier) {
    const prefix = {
        silver:   'S',
        gold:     'G',
        diamond:  'D',
        platinum: 'P',
        amrol:    'A'
    }[tier] || 'S';

    const seg = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    return `FRANK-${prefix}-${seg()}-${seg()}`; // Standardized 3-segment format to match webhook.js
}
