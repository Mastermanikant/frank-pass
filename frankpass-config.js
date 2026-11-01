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
    SOLO_LIFETIME: 25.00,
    FREE_WEB_PWA:  0.00,
    INDIA:  { solo_lifetime: 25, free_web_pwa: 0 },
    GLOBAL: { solo_lifetime: 25, free_web_pwa: 0 }
  },

  /* ── Central Store & Payment Links (store.frankbase.com) ──────── */
  STORE_URL: "https://store.frankbase.com/software/frankpass/",
  EBOOKS_URL: "https://store.frankbase.com/ebooks",
  PAYMENT_LINKS: {
    SOLO_LIFETIME: "https://store.frankbase.com/software/frankpass/",
    FREE_TRIAL:    "/install.html"
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
    WHATSAPP:        "https://whatsapp.com/channel/0029VbBvVfqLNSa2At2Shf2z",
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
  SITE_VERSION: "4.5.9",

  /* ── Maintenance Mode ─────────────────────────────────────────── */
  MAINTENANCE_MODE: false,
  MAINTENANCE_MESSAGE: "FrankPass is being upgraded. Back in a few hours!"
};
