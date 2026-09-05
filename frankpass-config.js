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

  /* ── Central Store & Payment Links (store.frankbase.com) ──────── */
  STORE_URL: "https://store.frankbase.com",
  EBOOKS_URL: "https://store.frankbase.com/ebooks",
  PAYMENT_LINKS: {
    STANDARD: {
      INDIA:  {
        silver:   "https://store.frankbase.com/products/frankpass-silver",
        gold:     "https://store.frankbase.com/products/frankpass-gold",
        platinum: "https://store.frankbase.com/products/frankpass-platinum"
      },
      GLOBAL: {
        silver:   "https://store.frankbase.com/products/frankpass-silver-global",
        gold:     "https://store.frankbase.com/products/frankpass-gold-global",
        platinum: "https://store.frankbase.com/products/frankpass-platinum-global"
      }
    },
    SALE: {
      INDIA:  {
        silver:   "https://store.frankbase.com/products/frankpass-silver?sale=1",
        gold:     "https://store.frankbase.com/products/frankpass-gold?sale=1",
        platinum: "https://store.frankbase.com/products/frankpass-platinum?sale=1"
      },
      GLOBAL: {
        silver:   "https://store.frankbase.com/products/frankpass-silver-global?sale=1",
        gold:     "https://store.frankbase.com/products/frankpass-gold-global?sale=1",
        platinum: "https://store.frankbase.com/products/frankpass-platinum-global?sale=1"
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
    GITHUB:          "https://github.com/Mastermanikant/frank-pass",
    REDDIT:          "https://www.reddit.com/user/frankpasshq/",
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
  SITE_VERSION: "3.7.2",

  /* ── Maintenance Mode ─────────────────────────────────────────── */
  MAINTENANCE_MODE: false,
  MAINTENANCE_MESSAGE: "FrankPass is being upgraded. Back in a few hours!"
};
