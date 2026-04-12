/**
 * FrankPass License Validation API
 * Route: /api/validate
 * Called by: Chrome Extension (every 24h via cached token)
 *
 * Checks if a key is valid in Vercel KV.
 * Falls back to fail-open if KV is unreachable.
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

const API_URL   = process.env.KV_REST_API_URL;
const API_TOKEN = process.env.KV_REST_API_TOKEN;
const KV_OK     = !!(API_URL && API_TOKEN);

// Global rate limiting handled in Vercel KV directly

export const config = { runtime: 'edge' };

export default async function handler(req) {

    // ── CORS ─────────────────────────────────────────────────────────────────
    const origin  = req.headers.get('origin') || '';
    const allowed = [
        'https://frankpass.com',
        'https://www.frankpass.com',
        'chrome-extension://'
    ];
    const corsOk = allowed.some(o => origin.startsWith(o));

    const corsHeaders = {
        'Access-Control-Allow-Origin':  corsOk ? origin : 'https://frankpass.com',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ valid: false, reason: 'method_not_allowed' }), {
            status: 405, headers: corsHeaders
        });
    }

    // ── Parse body ───────────────────────────────────────────────────────────
    let body;
    try { body = await req.json(); }
    catch {
        return new Response(JSON.stringify({ valid: false, reason: 'bad_request' }), {
            status: 400, headers: corsHeaders
        });
    }

    const { key, device } = body;
    if (!key || typeof key !== 'string' || key.length > 64) {
        return new Response(JSON.stringify({ valid: false, reason: 'invalid_key_format' }), {
            status: 400, headers: corsHeaders
        });
    }

    const k = key.trim().toUpperCase();

    // ── Rate limiting: 20 requests/hour per key ──────────────────────────────
    if (KV_OK) {
        try {
            const kv = createClient({ url: API_URL, token: API_TOKEN });
            const rlKey = `ratelimit:validate:${k}:${new Date().toISOString().slice(0, 13)}`; // Hourly bucket
            const count = (await kv.get(rlKey)) || 0;
            if (count > 20) {
                return new Response(JSON.stringify({ valid: false, reason: 'rate_limited' }), {
                    status: 429, headers: corsHeaders
                });
            }
            await kv.set(rlKey, count + 1, { ex: 3600 });
        } catch (err) {
            console.error('KV rate limit error:', err);
            // Fail-open for rate limits
        }
    }

    // ── KV NOT configured (local dev only) ───────────────────────────────────
    if (!KV_OK) {
        return new Response(JSON.stringify({
            valid: false,
            reason: 'service_unavailable',
            message: 'License service not yet configured. Please visit frankpass.com/pro to get your key.'
        }), { status: 503, headers: corsHeaders });
    }

    // ── PRODUCTION: Lookup key in Vercel KV ──────────────────────────────────
    try {
        const kv      = createClient({ url: API_URL, token: API_TOKEN });
        const license = await kv.get(`license:${k}`);

        // Key not found
        if (!license) {
            return new Response(JSON.stringify({ valid: false, reason: 'invalid_key' }), {
                status: 200, headers: corsHeaders
            });
        }

        // Check expiry
        if (license.valid_until && new Date() > new Date(license.valid_until)) {
            return new Response(JSON.stringify({ valid: false, reason: 'expired', message: 'Your trial has expired. Visit frankpass.com/pro to upgrade.' }), {
                status: 200, headers: corsHeaders
            });
        }

        // Device binding (1 device per key, 2 for platinum & amrol)
        if (device && typeof device === 'string' && device.length === 64) {
            const maxDevices = ['platinum', 'amrol'].includes(license.tier) ? 2 : 1;
            license.devices = license.devices || [];
            if (!license.devices.includes(device)) {
                if (license.devices.length >= maxDevices) {
                    return new Response(JSON.stringify({
                        valid: false,
                        reason: 'device_limit',
                        hint: 'This key is active on another device. Contact support@frankpass.com to reset.'
                    }), { status: 200, headers: corsHeaders });
                }
                license.devices.push(device);
                // Update device list in KV (fire & forget)
                const ttlLeft = license.valid_until
                    ? Math.ceil((new Date(license.valid_until) - new Date()) / 1000)
                    : 365 * 24 * 3600;
                kv.set(`license:${k}`, license, { ex: Math.max(ttlLeft, 60) }).catch(() => {});
            }
        }

        const daysLeft = license.valid_until
            ? Math.max(0, Math.ceil((new Date(license.valid_until) - new Date()) / 86400000))
            : 365;

        return new Response(JSON.stringify({
            valid:        true,
            tier:         license.tier,
            max_profiles: TIER_LIMITS[license.tier] || 1,
            days_left:    daysLeft,
            label:        TIER_LABELS[license.tier] || 'Silver',
            trial:        license.trial || false
        }), { status: 200, headers: corsHeaders });

    } catch (err) {
        console.error('KV error:', err);
        // Fallback: Notify extension of service failure so it can use its cached validation
        return new Response(JSON.stringify({ valid: false, reason: 'service_error' }), {
            status: 200, headers: corsHeaders
        });
    }
}
