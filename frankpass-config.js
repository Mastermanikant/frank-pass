/**
 * frankpass-config.js — FrankPass Master Configuration
 * Owner-controlled. All other files read from this object.
 * Load this FIRST before any other script.
 * Version: 3.0.0
 */

const FRANKPASS_CONFIG = {

  /* ── Sale / Discount Controls ─────────────────────────────────── */
  SALE_MODE: true,
  DISCOUNT_PERCENT: 80,
  SALE_LABEL: "Launch Month Deal",
  LAUNCH_SALE_END_DATE: "2026-05-16T23:59:59+05:30",

  /* ── Pricing ──────────────────────────────────────────────────── */
  PRICES: {
    INDIA:  { silver: 49,   gold: 99,   platinum: 499  },
    GLOBAL: { silver: 0.99, gold: 1.99, platinum: 9.99 }
  },

  /* ── Payment Links (replace placeholders with live Dodo URLs) ─── */
  PAYMENT_LINKS: {
    STANDARD: {
      INDIA:  {
        silver:   "[DODO_IN_SILVER_STD]",
        gold:     "[DODO_IN_GOLD_STD]",
        platinum: "[DODO_IN_PLATINUM_STD]"
      },
      GLOBAL: {
        silver:   "[DODO_USD_SILVER_STD]",
        gold:     "[DODO_USD_GOLD_STD]",
        platinum: "[DODO_USD_PLATINUM_STD]"
      }
    },
    SALE: {
      INDIA:  {
        silver:   "[DODO_IN_SILVER_SALE]",
        gold:     "[DODO_IN_GOLD_SALE]",
        platinum: "[DODO_IN_PLATINUM_SALE]"
      },
      GLOBAL: {
        silver:   "[DODO_USD_SILVER_SALE]",
        gold:     "[DODO_USD_GOLD_SALE]",
        platinum: "[DODO_USD_PLATINUM_SALE]"
      }
    }
  },

  /* ── Social Links ─────────────────────────────────────────────── */
  SOCIAL: {
    /* FrankPass brand */
    X:               "https://x.com/iamfrankpass",
    INSTAGRAM:       "https://instagram.com/iamfrankpass",
    YOUTUBE:         "https://youtube.com/@iamfrankpass",
    FACEBOOK:        "https://facebook.com/iamfrankpass",
    REDDIT:          "https://reddit.com/r/FrankPass",
    WHATSAPP:        "https://whatsapp.com/channel/[CHANNEL_ID]",
    MASTODON_BRAND:  "https://fosstodon.org/@iamfrankpass",
    /* Founder — Master Manikant */
    LINKEDIN:           "https://linkedin.com/in/mastermanikant",
    MASTODON_PERSONAL:  "https://mastodon.social/@mastermanikant"
  },

  /* ── Site Metadata ────────────────────────────────────────────── */
  SITE_VERSION: "3.0.0",

  /* ── Maintenance Mode ─────────────────────────────────────────── */
  MAINTENANCE_MODE: false,
  MAINTENANCE_MESSAGE: "FrankPass is being upgraded. Back in a few hours!"
};
