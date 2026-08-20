/**
 * frankpass-config.js - FrankPass Master Configuration
 * Owner-controlled. All other files read from this object.
 * Load this FIRST before any other script.
 * Version: 3.0.0
 */

const FRANKPASS_CONFIG = {

  /* ── Sale / Discount Controls ─────────────────────────────────── */
  SALE_MODE: true,
  DISCOUNT_PERCENT: 80,
  SALE_LABEL: "Launch Month Deal",
  LAUNCH_SALE_END_DATE: "2026-12-31T23:59:59+05:30",

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
    X:               "https://x.com/frankpasshq",
    INSTAGRAM:       "https://instagram.com/frankpasshq",
    YOUTUBE:         "https://youtube.com/@frankpasshq",
    FACEBOOK:        "https://facebook.com/frankpasshq",
    REDDIT:          "https://reddit.com/r/frankpasshq",
    WHATSAPP:        "https://whatsapp.com/channel/0029VbAmRaDDeON1M7sWY532",
    MASTODON_BRAND:  "https://fosstodon.org/@frankpasshq",
    /* Founder - Master Manikant (Strict Handle: @mastermanikant everywhere) */
    FOUNDER_NAME:       "Master Manikant",
    FOUNDER_HANDLE:     "@mastermanikant",
    LINKEDIN:           "https://linkedin.com/in/mastermanikant",
    X_FOUNDER:          "https://x.com/mastermanikant",
    INSTAGRAM_FOUNDER:  "https://instagram.com/mastermanikant",
    YOUTUBE_FOUNDER:    "https://youtube.com/@mastermanikant",
    THREADS_FOUNDER:    "https://threads.net/@mastermanikant",
    FACEBOOK_FOUNDER:   "https://facebook.com/mastermanikant",
    MASTODON_PERSONAL:  "https://mastodon.social/@mastermanikant"
  },

  /* ── Site Metadata ────────────────────────────────────────────── */
  SITE_VERSION: "3.2.5",

  /* ── Maintenance Mode ─────────────────────────────────────────── */
  MAINTENANCE_MODE: false,
  MAINTENANCE_MESSAGE: "FrankPass is being upgraded. Back in a few hours!"
};
