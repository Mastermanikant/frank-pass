# FRANKPASS.COM - COMPLETE 360-DEGREE PROJECT AUDIT PROMPT

> **Purpose:** This prompt is designed to be fed to an AI agent (or used as a manual checklist) to perform an exhaustive, no-stone-unturned audit of the entire FrankPass ecosystem - website, codebase, business model, user experience, accessibility, security, GitHub sync, and future-proofing.
>
> **Philosophy:** Think like EVERY type of user who will ever touch frankpass.com. Think like a first-time visitor, a returning power user, a developer reading the code, a screen-reader user, a rural Indian on a 2G phone, a corporate IT admin, and a competitor reverse-engineering the product.
>
> **Golden Rule:** After this audit and all fixes are applied, the website should be SO complete and SO polished that **NO future changes are ever needed** - except:
> 1. Adding new auto-suggest platforms to the autocomplete database.
> 2. (Future) Adding a first-visit product promotion splash (shown once per 24 hours, via `localStorage` timestamp check - implemented later, placeholder HTML comment in code now).

---

==================================================
## SECTION 1: COMPLETE USER TYPE ANALYSIS
==================================================

### 1.1 Identify and Document ALL User Types

Think deeply. Who will actually visit frankpass.com? For EACH user type, document:

- **Who they are** (age, tech literacy, device, internet speed, language)
- **Why they came** (what problem brought them here)
- **What they expect** (first 5 seconds impression)
- **What confuses them** (friction points)
- **What annoys them** (things that make them leave)
- **What delights them** (things that make them stay and trust)
- **Their complete journey** (from Google search → landing → first password → returning user)

#### Mandatory User Types to Analyze:

1. **The First-Timer (Non-Technical Indian User, Hindi-speaking, Mobile)**
  - Comes from WhatsApp forward or YouTube video
  - Has never heard of "stateless password generation"
  - Uses a ₹8,000-₹15,000 Android phone on Jio/Airtel 4G
  - Needs to understand: "Is this safe? Will I lose my passwords?"

2. **The Privacy-Conscious Tech Enthusiast**
  - Knows what PBKDF2 and zero-knowledge means
  - Wants to verify the crypto implementation
  - Will read source code on GitHub
  - Wants technical proof, not marketing fluff

3. **The "I Just Need a Password Right Now" User**
  - Doesn't care about how it works
  - Wants to type a site name, get a password, copy it, and leave in under 10 seconds
  - Any extra step = annoyance

4. **The Multi-Account Professional / Corporate Employee**
  - Has 3 Gmail accounts, 2 AWS accounts, multiple GitHub orgs
  - Needs distinct passwords per username per platform
  - May need monthly/quarterly password rotation (compliance requirement)

5. **The Student / Budget User**
  - Zero budget for any paid tool
  - Will be annoyed by ANY payment prompt, donation ask, or paywall feel
  - Needs to feel: "This is 100% free, no strings attached"

6. **The Developer / Open-Source Contributor**
  - Wants clean, well-commented code
  - Wants to understand the architecture from reading the source
  - May want to fork, contribute, or audit the crypto

7. **The Accessibility User (Screen Reader / Keyboard-Only / Low Vision)**
  - Uses NVDA, JAWS, or VoiceOver
  - Navigates entirely with Tab, Enter, and Arrow keys
  - Needs proper ARIA labels, focus management, and contrast ratios

8. **The Returning Daily User**
  - Uses FrankPass 2-5 times per day
  - Has `Remember Secret Key` enabled
  - Knows the interface by heart
  - Any UI change or unexpected behavior = trust break

### 1.2 The "Single User vs Multi User" Minimum Specification

Document exactly:
- How does the current `Single Account` mode handle ALL user types above?
- How does the current `Multiple Accounts` mode handle ALL user types above?
- Is there ANY user type that is NOT served by these two modes?
- If someone has 50 accounts across 30 platforms, does this system scale without a database?
- What is the absolute MINIMUM interaction needed to generate a password?
 - Count exact clicks and keystrokes for Single Account mode
 - Count exact clicks and keystrokes for Multiple Accounts mode

---

==================================================
## SECTION 2: FRONTEND DEEP AUDIT
==================================================

### 2.1 HTML Structure & Semantic Audit

For EVERY page (`index.html`, `install.html`, `pro.html`, `docs.html`, `faq.html`, `about-us.html`, `legal.html`, `get-started.html`):

- [ ] Is there exactly ONE `<h1>` per page?
- [ ] Is the heading hierarchy correct (`h1` → `h2` → `h3`, no skips)?
- [ ] Are all interactive elements (`<button>`, `<a>`, `<input>`) properly labeled?
- [ ] Are all `<img>` tags (if any) having meaningful `alt` attributes?
- [ ] Are all `<form>` elements having proper `<label>` associations?
- [ ] Are there any `<div>` or `<span>` elements being used as buttons without proper `role="button"` and `tabindex`?
- [ ] Is semantic HTML used properly (`<main>`, `<nav>`, `<article>`, `<section>`, `<aside>`, `<footer>`)?
- [ ] Are all IDs unique across the entire page?
- [ ] Are there any broken or orphaned HTML elements?
- [ ] Are HTML comments (`<!-- ... -->`) present and helpful for developer understanding? **If not, ADD them to every major section.**

### 2.2 CSS Audit

- [ ] Are ALL styles using CSS custom properties (design tokens) from `:root`?
- [ ] Are there any hardcoded colors, font sizes, or spacings NOT using tokens?
- [ ] Is `!important` used anywhere? If yes, document WHY and whether it can be removed.
- [ ] Are there any duplicate or conflicting CSS rules?
- [ ] Are there any CSS rules that are defined but NEVER used (dead CSS)?
- [ ] Is the responsive design consistent across 320px, 375px, 414px, 768px, 1024px, 1440px, 1920px?
- [ ] Are touch targets at least 44x44px on mobile (WCAG 2.5.5)?
- [ ] Is the `:focus-visible` style distinct and visible for keyboard navigation?
- [ ] Are all transitions/animations respecting `prefers-reduced-motion`?
- [ ] Is `prefers-color-scheme` properly handled alongside the manual theme toggle?

### 2.3 JavaScript Audit

For EVERY `.js` file (`frankpass-core.js`, `frankpass-utils.js`, `frankpass-config.js`, `footer.js`, `country-data.js`, `country-dropdown.js`, `platforms.js`, `service-worker.js`):

- [ ] Is the code well-commented with `<!-- HTML comments -->` and `// JS comments` explaining WHAT and WHY?
- [ ] Are there any `console.log` statements left in production code?
- [ ] Are there any `alert()` calls?
- [ ] Are there any `eval()` calls (security risk)?
- [ ] Are there any global variable leaks (variables without `const`, `let`, or `var`)?
- [ ] Are there any unused functions or dead code?
- [ ] Are there any error-swallowing `catch` blocks (empty `catch` or `catch(_){}`)?
- [ ] Is every user-facing error handled with a meaningful toast/message?
- [ ] Are there any race conditions in async operations?
- [ ] Is the `try/catch` coverage comprehensive for all WebCrypto operations?
- [ ] Are all `addEventListener` calls properly managed (no duplicate listeners)?
- [ ] Are there any memory leaks (event listeners on removed DOM elements)?

### 2.4 Code Comments Audit (CRITICAL)

**The user explicitly wants HTML comments throughout the codebase so that:**
1. Any developer can understand each section at a glance
2. The AI agent can understand the code in future sessions
3. No section is ambiguous about its purpose

**For every HTML file, ensure comments like:**
```html
<!-- ========== HEADER SECTION START ========== -->
<!-- Logo, Navigation, Country Selector, Theme Toggle -->

<!-- ========== HERO SECTION START ========== -->
<!-- Left: Marketing Copy | Right: Live Generator Card -->

<!-- ========== GENERATOR CARD START ========== -->
<!-- Main password generation form with all inputs and controls -->

<!-- === Platform Input (Site/URL with SSO Auto-Aliasing) === -->
<!-- === Account Mode Selector (Single vs Multiple Accounts) === -->
<!-- === Secret Key Input (Master Password with Eye Toggle) === -->
<!-- === Remember Secret Key Toggle (AES-GCM Encrypted Local Storage) === -->
<!-- === Advanced Options Accordion === -->
<!-- === Variant Rotation (Counter 1-999 | Month & Year) === -->
<!-- === Character Profile Presets (Simple | Strong | Maximum | PIN) === -->
<!-- === Password Length Slider (6-64 characters) === -->
<!-- === Generate Button + Clear Form Button === -->
<!-- === Password Output Box (Tri-State Privacy Mask) === -->

<!-- ========== GENERATOR CARD END ========== -->

<!-- ========== SUPPORT/ECOSYSTEM CARD START ========== -->
<!-- Creator support: Buy Me a Coffee, eBooks, Pro, Products -->

<!-- ========== FOOTER (Dynamic via footer.js) ========== -->
```

**For every JS file, ensure comments like:**
```javascript
// ============================================================
// frankpass-core.js - Deterministic Password Generation Engine
// Algorithm: PBKDF2-HMAC-SHA256 (1,000,000 iterations)
// API: W3C WebCrypto (window.crypto.subtle)
// WARNING: DO NOT modify the salt formula or iteration count.
//          Any change will break ALL existing user passwords.
// ============================================================

// --- Salt Derivation ---
// Formula: SHA-256("Platform=" + normalized + "|User=" + username + "|Var=" + variant + "|Pepper=" + staticPepper)

// --- Character Matrix ---
// Ambiguous characters removed: O/0, I/l/1, C/c, S/s, V/v, W/w
// This ensures passwords are readable across all fonts and contexts
```

---

==================================================
## SECTION 3: WCAG ACCESSIBILITY AUDIT (AA MINIMUM, AAA TARGET)
==================================================

### 3.1 Perceivable
- [ ] Color contrast ratio ≥ 4.5:1 for normal text (AA) and ≥ 7:1 for enhanced (AAA) - check BOTH dark and light themes
- [ ] No information conveyed by color alone (e.g., error states must have text + icon, not just red border)
- [ ] All non-text content has text alternatives
- [ ] Text can be resized up to 200% without loss of content

### 3.2 Operable
- [ ] All functionality accessible via keyboard alone (Tab, Shift+Tab, Enter, Space, Escape)
- [ ] Tab order is logical and follows visual order
- [ ] Focus is visible on ALL interactive elements (buttons, inputs, links, toggles)
- [ ] No keyboard traps (can the user Tab OUT of the country modal? Out of the mobile menu?)
- [ ] Skip-to-main-content link works and is first focusable element
- [ ] Sufficient time for all timed interactions (if any)

### 3.3 Understandable
- [ ] Language is declared (`<html lang="en">`)
- [ ] Form inputs have visible labels (not just placeholders)
- [ ] Error messages are specific and helpful ("Please enter a website name" not just "Error")
- [ ] Consistent navigation across all pages
- [ ] No unexpected context changes on input

### 3.4 Robust
- [ ] Valid HTML (no parsing errors)
- [ ] ARIA attributes used correctly (not misused or overused)
- [ ] Works across Chrome, Firefox, Safari, Edge (latest 2 versions)
- [ ] Works with screen readers (NVDA, JAWS, VoiceOver)

---

==================================================
## SECTION 4: USER ANNOYANCE & FRICTION ANALYSIS
==================================================

### 4.1 Monetization Friction (CRITICAL USER SENSITIVITY)

The user (Master Manikant) wants to understand exactly how the monetization should feel to visitors:

**Current monetization touchpoints on frankpass.com:**
1. Support Card: "Buy Me a Coffee" button
2. Support Card: "Cyber Security eBooks" button (links to frankbase.com/ebooks - free? paid?)
3. Support Card: "Pro Extension" button
4. Support Card: "All Products" button
5. Footer: Donate link
6. Pro page: Subscription tiers (Silver, Gold, Platinum)

**Audit each touchpoint:**
- Does it feel like a **gentle optional suggestion** or a **pushy sales pitch**?
- Does a FREE user ever feel **guilty or pressured** for using the free tool?
- Is the eBook positioned as **"free eBook, donate if you want"** or **"buy this eBook"**?
- Does the "Pro Extension" feel like a natural upgrade or a paywall gate?
- Is the donation ask **warm and genuine** ("Love FrankPass? Support the creator!") or **transactional** ("Pay us!")?

**Recommended monetization philosophy to verify:**
```
FREE FOREVER:
- Web app password generator (100% free, no limits, no ads, no tracking)
- PWA offline app (100% free)
- All documentation and guides (100% free)

OPTIONAL SUPPORT (Donation-Based):
- Buy Me a Coffee (voluntary tip, any amount)
- Free eBook with optional "pay what you want" donation

PREMIUM UPGRADE (Paid, Clear Value):
- FrankPass Pro Browser Extension (auto-fill, biometric, multi-profile sync)
- Priced with India PPP: ₹49/mo or ₹499 lifetime
- Priced globally: $1.99/mo or $9.99 lifetime
```

### 4.2 First-Visit User Confusion Points

Walk through frankpass.com as a COMPLETE FIRST-TIME VISITOR:
- [ ] In the first 3 seconds, do I understand WHAT this product does?
- [ ] In the first 10 seconds, do I understand WHY I should trust it?
- [ ] Is "stateless password generation" explained in simple words, or does it sound scary/confusing?
- [ ] Do I understand that my password is NOT stored anywhere?
- [ ] Do I understand that I MUST remember my Secret Key?
- [ ] Do I understand what happens if I forget my Secret Key? (Answer: All passwords are lost forever)
- [ ] Is this warning prominent enough, or will users discover it only after they're locked out?

### 4.3 Returning User Friction Points

- [ ] Does the site remember my theme preference? (Yes, via localStorage)
- [ ] Does the site remember my Secret Key if I toggled "Remember"? (Yes, encrypted)
- [ ] Does the site remember my last-used platform? (via fp_settings)
- [ ] Is there any scenario where a returning user gets a DIFFERENT password for the same inputs? (This would be catastrophic - verify IMPOSSIBLE)
- [ ] If the service worker cache is stale, does the user get an old version? How is cache invalidation handled?

---

==================================================
## SECTION 5: NAVIGATION & INFORMATION ARCHITECTURE AUDIT
==================================================

### 5.1 Site Map Completeness

```
frankpass.com/
├── / (index.html)               → Homepage + Live Generator
├── /get-started                  → Quick Start Guide
├── /install                      → PWA Installation Guide (5 OS tabs)
├── /docs                         → Technical Documentation
├── /faq                          → Frequently Asked Questions
├── /about-us                     → Founder Story & Contact
├── /legal                        → Privacy Policy & Terms
├── /pro                          → Pro Extension & Pricing
├── /products → 302 → frankbase.com/products
├── /ebooks → 302 → frankbase.com/ebooks
├── /donate → 302 → buymeacoffee.com/mastermanikant
├── /app → 301 → /install
├── /download → 301 → /install
```

- [ ] Are ALL pages accessible from the header navigation?
- [ ] Are ALL pages accessible from the footer?
- [ ] Can a user reach ANY page within 2 clicks from ANY other page?
- [ ] Is the navigation order logical? (Get Started → Docs → FAQ → About → Products → Pro)
- [ ] Does the mobile hamburger menu contain ALL navigation links?
- [ ] Is the active/current page highlighted in navigation?

### 5.2 Cross-Page Consistency

- [ ] Is the header IDENTICAL across all 8 HTML pages?
- [ ] Is the footer IDENTICAL across all 8 HTML pages (via footer.js)?
- [ ] Is the theme toggle present and functional on ALL pages?
- [ ] Is the mobile menu present and functional on ALL pages?
- [ ] Are all external links (`target="_blank"`) having `rel="noopener noreferrer"`?

---

==================================================
## SECTION 6: TECH STACK & DEPENDENCY AUDIT
==================================================

### 6.1 Current Stack Inventory

List EVERY technology, library, API, and external dependency:

| Category | Technology | Version | Source | Purpose | Risk Level |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Language | HTML5 | - | Native | Structure | None |
| Language | CSS3 | - | Native | Styling | None |
| Language | JavaScript ES6+ | - | Native | Logic | None |
| Crypto | WebCrypto API | W3C Standard | Browser Native | PBKDF2 + AES-GCM | None |
| Fonts | Inter | Variable | Google Fonts CDN | Body text | Low (CDN dependency) |
| Fonts | Outfit | Variable | Google Fonts CDN | Headings | Low (CDN dependency) |
| Fonts | JetBrains Mono | Variable | Google Fonts CDN | Password display | Low (CDN dependency) |
| PWA | Service Worker | v3.2.3 | Self-hosted | Offline caching | None |
| Hosting | Cloudflare Pages | - | Cloudflare | Edge CDN delivery | None |
| Deploy | Wrangler CLI | Latest | npm | Cloudflare deployment | None |
| Testing | Playwright | Latest | npm (devDep) | E2E browser tests | None |

- [ ] Are there ANY external JavaScript libraries loaded? (Should be ZERO)
- [ ] Are there ANY external CSS frameworks loaded? (Should be ZERO)
- [ ] Are there ANY analytics or tracking scripts? (Should be ZERO)
- [ ] Are there ANY third-party iframes? (Should be ZERO)
- [ ] If Google Fonts CDN goes down, do fonts gracefully fallback? (Check `font-family` fallback chain)

### 6.2 GitHub Repository Sync Audit

**Repository:** `https://github.com/Mastermanikant/frank-pass`

- [ ] Is EVERY file in `01_Website_App/` committed and pushed?
- [ ] Are there any files in the local directory that are NOT in GitHub?
- [ ] Are there any files in GitHub that are NOT in the local directory?
- [ ] Is `.gitignore` properly configured?
- [ ] Is `.env.development.local` excluded from GitHub? (Contains sensitive config?)
- [ ] Are documentation files (`USER_GUIDE_A_TO_Z.md`, `DEVELOPER_AND_FOUNDER_BLUEPRINT.md`, `PROJECT_DISCOVERY_AUDIT.md`) committed?
- [ ] Is `package.json` meaningful or just a placeholder? (Currently 27 bytes)
- [ ] Is there a proper `README.md` on GitHub with project description, screenshots, and setup instructions?
- [ ] Is the GitHub repository description, topics, and social preview image set?
- [ ] Is the LICENSE file correct and appropriate?

---

==================================================
## SECTION 7: SECURITY & PRIVACY DEEP AUDIT
==================================================

### 7.1 Cryptographic Implementation Verification

- [ ] Is `PBKDF2-HMAC-SHA256` with exactly `1,000,000` iterations used? Verify in source.
- [ ] Is the salt derivation formula deterministic and documented?
- [ ] Are the static pepper values hardcoded in client-side JavaScript? (If yes, is this acceptable for the threat model?)
- [ ] Is `window.crypto.subtle` used correctly with proper error handling?
- [ ] Are generated passwords uniformly distributed across the character set? (No statistical bias?)
- [ ] Is the AES-GCM local vault implementation using unique random IVs for each encryption?
- [ ] Can the AES-GCM device key be extracted by another script on the same origin?
- [ ] Is there any XSS risk that could steal the Secret Key from the input field?

### 7.2 Network & Data Transmission Audit

- [ ] Open browser DevTools → Network tab → Generate a password → Are there ANY outbound requests? (Should be ZERO during generation)
- [ ] Are Google Fonts loaded at page load? (Yes - this means Google knows the user visited frankpass.com)
- [ ] Should fonts be self-hosted to achieve TRUE zero-tracking? Document tradeoff.
- [ ] Are there any `fetch()` or `XMLHttpRequest` calls in the codebase? (Should be ZERO except for service worker cache)
- [ ] Is Content Security Policy (CSP) set in `_headers`? What does it allow?

### 7.3 Cloudflare Headers Audit (`_headers` file)

- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options: DENY` or `SAMEORIGIN`
- [ ] `X-XSS-Protection: 1; mode=block`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin` (or stricter)
- [ ] `Permissions-Policy` (restrict camera, microphone, geolocation, etc.)
- [ ] `Content-Security-Policy` (restrict script-src, style-src, font-src, connect-src)
- [ ] `Strict-Transport-Security` (HSTS with includeSubDomains and preload)

---

==================================================
## SECTION 8: PERFORMANCE & OPTIMIZATION AUDIT
==================================================

### 8.1 Page Load Performance

For the homepage (`index.html`), measure and report:

- [ ] Total page weight (HTML + CSS + JS + Fonts + Images)
- [ ] Time to First Byte (TTFB)
- [ ] First Contentful Paint (FCP)
- [ ] Largest Contentful Paint (LCP)
- [ ] Time to Interactive (TTI)
- [ ] Total Blocking Time (TBT)
- [ ] Cumulative Layout Shift (CLS)

### 8.2 Asset Optimization

- [ ] Is `platforms.js` (1.17 MB!) too large? Should it be lazy-loaded or split?
- [ ] Are CSS and JS files minified for production?
- [ ] Are images (if any) optimized (WebP, compressed)?
- [ ] Is Brotli compression enabled on Cloudflare? (Should be by default)
- [ ] Are there any render-blocking resources?
- [ ] Is the critical CSS inlined for above-the-fold content?

### 8.3 Service Worker & Caching Audit

- [ ] Is the service worker cache version updated when files change?
- [ ] Is there a mechanism to force users to get the latest version?
- [ ] Are cache headers set correctly for static assets?
- [ ] Does the service worker handle cache errors gracefully?
- [ ] Is the service worker scope correct (`/`)?

---

==================================================
## SECTION 9: SEO & TRUST SIGNALS AUDIT
==================================================

### 9.1 Technical SEO (Per Page)

For EACH of the 8 HTML pages:

| Page | Title | Meta Desc | Canonical | OG Tags | Schema | Robots | H1 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |

- [ ] Are all titles unique, under 60 characters, and keyword-rich?
- [ ] Are all meta descriptions unique, 150-160 characters, and compelling?
- [ ] Are canonical URLs absolute and correct?
- [ ] Are Open Graph tags (og:title, og:description, og:image, og:url) present?
- [ ] Are Twitter Card tags present?
- [ ] Is Schema.org structured data valid (test with Google Rich Results Test)?
- [ ] Is `sitemap.xml` complete and valid?
- [ ] Is `robots.txt` correct?
- [ ] Is `llms.txt` present and useful for AI discovery?

### 9.2 Indexing Governance (Per GEMINI.md Rules)

- [ ] Are ONLY core brand pages (`/`, `/about-us`, `/legal`, `/contact`) set to `index, follow`?
- [ ] Are ALL content/educational pages set to `noindex, follow` by default?
- [ ] Is there any page accidentally set to `index` that shouldn't be?

---

==================================================
## SECTION 10: BUSINESS MODEL & PROMOTION AUDIT
==================================================

### 10.1 Current Promotion Touchpoints

List every place on the website where a product, service, or donation is promoted:
- Header nav links
- Hero section CTAs
- Support/Ecosystem card on homepage
- Footer links
- Pro page pricing
- Install page
- About page
- Docs/FAQ mentions

### 10.2 Cross-Promotion Strategy

- [ ] Is `frankbase.com` promoted naturally (not spammy)?
- [ ] Is `digital.frankbase.com` mentioned where relevant?
- [ ] Is `mastermanikant.com` positioned as the founder's authority site?
- [ ] Is the WhatsApp Channel CTA visible but not intrusive?
- [ ] Are social media links (X, YouTube, Instagram, LinkedIn) present in footer?

### 10.3 Future First-Visit Promotion Splash (Placeholder Only)

**Specification for future implementation (add HTML comment placeholder now):**
```html
<!-- ========== FUTURE: FIRST-VISIT PRODUCT PROMOTION SPLASH ========== -->
<!-- 
  Implementation Plan (DO NOT BUILD YET - placeholder only):
 - Show a modal/splash screen on FIRST visit to frankpass.com
 - Content: Brief introduction to FrankPass + link to FrankBase ecosystem
 - Frequency: Once per 24 hours (check localStorage timestamp)
 - Dismissable: Click "Got it" or click outside to close
 - localStorage key: 'fp_promo_last_shown'
 - Logic: if (Date.now() - lastShown > 86400000) showPromo();
 - Design: Minimal, non-intrusive, matches site theme
 - MUST NOT interfere with the password generator functionality
-->
```

---

==================================================
## SECTION 11: BUG HUNTING (EVERY POSSIBLE BUG)
==================================================

### 11.1 Functional Bugs

Test EVERY interaction path:
- [ ] Generate with empty platform → proper error?
- [ ] Generate with empty secret key → proper error?
- [ ] Generate with only spaces in platform → handled?
- [ ] Generate with emoji in platform name → handled?
- [ ] Generate with 1-character platform → valid password?
- [ ] Generate with 500-character platform → handled?
- [ ] Generate with special characters in secret key (`<script>alert(1)</script>`) → XSS safe?
- [ ] Copy button works on HTTP (not just HTTPS)?
- [ ] Copy button works on Safari iOS?
- [ ] Theme toggle works after page refresh?
- [ ] Secret Key remember toggle → encrypt → refresh → decrypt → same key?
- [ ] Counter increment beyond 999 → clamped?
- [ ] Counter decrement below 1 → clamped?
- [ ] Month & Year variant → generates different password than Counter 1?
- [ ] Clear Form → resets ALL fields including variant, profile, length?
- [ ] Country selector → search → select → autocomplete updates?
- [ ] Mobile menu → open → navigate → page loads → menu closes?
- [ ] PWA install → offline mode → generate password → works?

### 11.2 Visual/Layout Bugs

- [ ] Any text truncation or overflow on any screen size?
- [ ] Any overlapping elements?
- [ ] Any broken border-radius or shadow inconsistencies?
- [ ] Any z-index stacking issues (modal behind header, toast behind card)?
- [ ] Any flickering during theme switch?
- [ ] Any layout shift during page load (CLS)?
- [ ] Footer overlapping content on short pages?
- [ ] Horizontal scroll on any mobile viewport (320px to 428px)?

### 11.3 Cross-Browser Bugs

Test on:
- [ ] Chrome (Windows, macOS, Android)
- [ ] Firefox (Windows, macOS)
- [ ] Safari (macOS, iOS)
- [ ] Edge (Windows)
- [ ] Samsung Internet (Android)

### 11.4 Legacy/Orphaned Code

- [ ] Any JavaScript functions defined but never called?
- [ ] Any CSS classes defined but never used in HTML?
- [ ] Any HTML elements with IDs that no JS references?
- [ ] Any commented-out code that should be removed?
- [ ] Any TODO/FIXME/HACK comments in the code?

---

==================================================
## SECTION 12: GITHUB REPOSITORY COMPLETENESS AUDIT
==================================================

### 12.1 Files That MUST Be on GitHub

- [ ] `index.html` ✓
- [ ] `install.html` ✓
- [ ] `pro.html` ✓
- [ ] `docs.html` ✓
- [ ] `faq.html` ✓
- [ ] `about-us.html` ✓
- [ ] `legal.html` ✓
- [ ] `get-started.html` ✓
- [ ] `style.css` ✓
- [ ] `frankpass-core.js` ✓
- [ ] `frankpass-utils.js` ✓
- [ ] `frankpass-config.js` ✓
- [ ] `footer.js` ✓
- [ ] `country-data.js` ✓
- [ ] `country-dropdown.js` ✓
- [ ] `platforms.js` ✓
- [ ] `service-worker.js` ✓
- [ ] `manifest.json` ✓
- [ ] `robots.txt` ✓
- [ ] `sitemap.xml` ✓
- [ ] `_headers` ✓
- [ ] `_redirects` ✓
- [ ] `llms.txt` ✓
- [ ] `LICENSE` ✓
- [ ] `README.md` ✓
- [ ] `SECURITY.md` ✓
- [ ] `CONTRIBUTING.md` ✓
- [ ] `.gitignore` ✓
- [ ] `USER_GUIDE_A_TO_Z.md` ✓
- [ ] `DEVELOPER_AND_FOUNDER_BLUEPRINT.md` ✓
- [ ] `PROJECT_DISCOVERY_AUDIT.md` ✓
- [ ] `icons/` directory (favicon, PWA icons) - **CHECK IF PRESENT**

### 12.2 Files That MUST NOT Be on GitHub

- [ ] `.env.development.local` (contains API keys or secrets?)
- [ ] Any `node_modules/` directory
- [ ] Any `.DS_Store` files
- [ ] Any temporary/scratch files

### 12.3 GitHub Repository Metadata

- [ ] Repository description set?
- [ ] Topics/tags set? (suggested: `password-generator`, `zero-knowledge`, `pbkdf2`, `offline`, `pwa`, `security`, `privacy`)
- [ ] Social preview image uploaded?
- [ ] Branches: `main` as default and only branch?
- [ ] README has badges (license, deployment status)?

---

==================================================
## SECTION 13: FUTURE-PROOFING AUDIT
==================================================

### 13.1 What Should NEVER Change (Invariants)

1. **PBKDF2 salt derivation formula** - changing this breaks ALL existing passwords
2. **Iteration count (1,000,000)** - changing this breaks ALL existing passwords
3. **Character matrix and ambiguity filtering** - changing this breaks ALL existing passwords
4. **SSO aliasing rules** (`gmail` → `google`) - changing this breaks existing passwords
5. **URL normalization logic** - changing this breaks existing passwords
6. **AES-GCM local storage format** - changing this loses users' saved secret keys

### 13.2 What CAN Change Safely

1. Visual design, colors, animations, layout
2. Marketing copy and content
3. Adding new platforms to autocomplete database (`platforms.js`)
4. Adding new country data (`country-data.js`)
5. Adding new SSO aliases (e.g., `threads` → `meta`)
6. Adding new pages
7. Improving error messages
8. Adding the first-visit promo splash (future)

### 13.3 Code Comment Placeholders for Future Features

Add these HTML comments in `index.html` at appropriate locations:

```html
<!-- FUTURE: Auto-suggest platform detection from clipboard/URL bar -->
<!-- FUTURE: First-visit product promotion splash (once per 24h) -->
<!-- FUTURE: Password strength visual indicator bar -->
<!-- FUTURE: QR code generation for easy mobile transfer -->
<!-- FUTURE: Keyboard shortcut hints (Ctrl+Enter to generate) -->
```

---

==================================================
## SECTION 14: FINAL DELIVERABLES CHECKLIST
==================================================

After completing this audit, produce:

1. **Bug Report:** Every bug found, ranked P0-P3, with exact reproduction steps
2. **Fix Diff:** Every code change made, with before/after
3. **Comment Injection:** Verified HTML/JS comments added to all major sections
4. **GitHub Sync Report:** Files added, files removed, files modified - all committed and pushed
5. **Cloudflare Deploy Confirmation:** Latest version live on `frankpass.com`
6. **Central Ledger Entry:** Operation recorded in `00_MM_Central_Command/operation_ledger.jsonl`
7. **Future Placeholder Comments:** All future feature comments injected in code
8. **WCAG Compliance Report:** Summary of pass/fail for AA criteria
9. **Performance Report:** Core Web Vitals numbers
10. **Final Statement:** Confirmation that the website is production-complete and requires NO further changes except the two items listed at the top of this document

---

*© 2026 Master Manikant · FrankPass & FrankBase Ecosystem · This audit prompt is a living document maintained alongside the codebase.*
