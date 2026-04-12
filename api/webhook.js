/**
 * FrankPass Dodo Payments Webhook Handler
 * Route: /api/webhook
 * Called by: Dodo Payments on every successful payment event
 *
 * MOCK MODE: Logs + returns 200 without KV write. Safe to deploy now.
 * PRODUCTION: Set DODO_WEBHOOK_SECRET + KV vars in Vercel → fully live.
 */

import { createClient } from '@vercel/kv';
import { createHmac, timingSafeEqual } from 'crypto';

const DODO_SECRET = process.env.DODO_WEBHOOK_SECRET;
const API_URL     = process.env.KV_REST_API_URL;
const API_TOKEN   = process.env.KV_REST_API_TOKEN;
const MOCK_MODE   = !DODO_SECRET || !API_URL;

// Tier → profile limit map
const TIER_MAP = {
    'frankpass-silver':   { tier: 'silver',   months: 1,  max_profiles: 1  },
    'frankpass-gold':     { tier: 'gold',      months: 1,  max_profiles: 5  },
    'frankpass-platinum': { tier: 'platinum',  months: 1,  max_profiles: 15 },
    // Yearly variants (18 months access for 12 months price)
    'frankpass-silver-yearly':   { tier: 'silver',   months: 18, max_profiles: 1  },
    'frankpass-gold-yearly':     { tier: 'gold',      months: 18, max_profiles: 5  },
    'frankpass-platinum-yearly': { tier: 'platinum',  months: 18, max_profiles: 15 },
};

export const config = { runtime: 'nodejs' }; // Need crypto — use Node runtime

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // ── Read raw body (MUST be raw for HMAC verification) ──────────────────
    const rawBody = await getRawBody(req);

    // ── Verify Dodo Signature ───────────────────────────────────────────────
    if (!MOCK_MODE) {
        const signature = req.headers['webhook-signature'];
        const timestamp  = req.headers['webhook-timestamp'];

        if (!signature || !timestamp) {
            console.warn('[webhook] Missing signature headers');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Reject if timestamp > 5 minutes old (replay attack prevention)
        if (Math.abs(Date.now() - parseInt(timestamp)) > 300000) {
            console.warn('[webhook] Timestamp too old — possible replay attack');
            return res.status(400).json({ error: 'Request too old' });
        }

        // Recompute HMAC-SHA256
        const computed = createHmac('sha256', DODO_SECRET)
            .update(rawBody + timestamp)
            .digest('hex');

        // Constant-time comparison (prevents timing attacks)
        try {
            const sigBuffer  = Buffer.from(signature, 'hex');
            const compBuffer = Buffer.from(computed,  'hex');
            if (!timingSafeEqual(sigBuffer, compBuffer)) {
                console.warn('[webhook] Signature mismatch');
                return res.status(401).json({ error: 'Unauthorized' });
            }
        } catch {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }

    // ── Parse event ────────────────────────────────────────────────────────
    let event;
    try {
        event = JSON.parse(rawBody);
    } catch {
        return res.status(400).json({ error: 'Invalid JSON' });
    }

    const eventType = event.type || event.event_type;
    const eventId   = event.id   || event.event_id;
    console.log(`[webhook] Received: ${eventType} | ID: ${eventId}`);

    // ── Idempotency: skip already-processed events ─────────────────────────
    if (!MOCK_MODE && eventId) {
        const kv = createClient({ url: API_URL, token: API_TOKEN });
        const already = await kv.get(`processed:${eventId}`);
        if (already) {
            console.log(`[webhook] Duplicate event ignored: ${eventId}`);
            return res.status(200).json({ ok: true, duplicate: true });
        }
        await kv.set(`processed:${eventId}`, true, { ex: 86400 * 7 }); // 7 days
    }

    // ── Handle event types ─────────────────────────────────────────────────
    if (eventType === 'payment.succeeded' || eventType === 'subscription.created') {
        await handleNewSubscription(event, res);
    } else if (eventType === 'subscription.cancelled' || eventType === 'subscription.expired') {
        await handleCancellation(event, res);
    } else if (eventType === 'subscription.renewed') {
        await handleRenewal(event, res);
    } else {
        // Unknown event — log and return 200 (Dodo will retry on non-200)
        console.log(`[webhook] Unhandled event type: ${eventType}`);
        return res.status(200).json({ ok: true, ignored: true });
    }
}

// ── Event Handlers ──────────────────────────────────────────────────────────

async function handleNewSubscription(event, res) {
    const productId = event.data?.product_id || event.product_id || '';
    const email     = event.data?.customer?.email || event.customer_email || '';

    const tierData = TIER_MAP[productId];
    if (!tierData) {
        console.warn(`[webhook] Unknown product_id: ${productId}`);
        return res.status(200).json({ ok: true, warning: 'Unknown product' });
    }

    // Generate license key
    const key = generateKey(tierData.tier);

    // Calculate validity
    const validUntil = new Date();
    validUntil.setMonth(validUntil.getMonth() + tierData.months);

    const licenseData = {
        tier:         tierData.tier,
        max_profiles: tierData.max_profiles,
        valid_until:  validUntil.toISOString(),
        devices:      [],
        email:        email, // For support only — not exposed to extension
        created_at:   new Date().toISOString(),
        product_id:   productId
    };

    if (MOCK_MODE) {
        console.log('[webhook] MOCK MODE — License would be:', key, licenseData);
        return res.status(200).json({ ok: true, mock: true, key });
    }

    const kv = createClient({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });
    await kv.set(`license:${key}`, licenseData);

    // Also create email→key index for support lookups
    if (email) await kv.set(`email:${email}`, key);

    console.log(`[webhook] License created: ${key} for ${email}`);

    // TODO: Send email with key to user via Dodo's built-in email or your own SMTP
    // For now, Dodo sends the key in the webhook confirmation email if configured.

    return res.status(200).json({ ok: true, key });
}

async function handleCancellation(event, res) {
    const email = event.data?.customer?.email || event.customer_email || '';
    if (!email || MOCK_MODE) {
        console.log('[webhook] Cancellation — MOCK or no email');
        return res.status(200).json({ ok: true });
    }

    const kv  = createClient({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });
    const key = await kv.get(`email:${email}`);
    if (key) {
        const license = await kv.get(`license:${key}`);
        if (license) {
            // Set expiry to now (don't delete — keep for support history)
            license.valid_until = new Date().toISOString();
            license.cancelled   = true;
            await kv.set(`license:${key}`, license);
            console.log(`[webhook] License cancelled: ${key}`);
        }
    }
    return res.status(200).json({ ok: true });
}

async function handleRenewal(event, res) {
    const email = event.data?.customer?.email || event.customer_email || '';
    if (!email || MOCK_MODE) return res.status(200).json({ ok: true });

    const kv      = createClient({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });
    const key     = await kv.get(`email:${email}`);
    if (!key) return res.status(200).json({ ok: true });

    const license = await kv.get(`license:${key}`);
    if (!license) return res.status(200).json({ ok: true });

    const productId = event.data?.product_id || '';
    const tierData  = TIER_MAP[productId] || { months: 1 };

    // Extend validity
    const currentExpiry = new Date(license.valid_until);
    const base          = currentExpiry > new Date() ? currentExpiry : new Date();
    base.setMonth(base.getMonth() + tierData.months);
    license.valid_until = base.toISOString();

    await kv.set(`license:${key}`, license);
    console.log(`[webhook] License renewed: ${key} until ${license.valid_until}`);
    return res.status(200).json({ ok: true });
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function generateKey(tier) {
    const prefix  = { silver: 'S', gold: 'G', platinum: 'P' }[tier] || 'S';
    const chars   = 'ABCDEFGHJKLMNPQRTUVWXYZ23456789'; // No I, O, 0, 1 (ambiguous)
    const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `FRANK-${prefix}-${segment()}-${segment()}`;
}

async function getRawBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end',  () => resolve(data));
        req.on('error', reject);
    });
}
