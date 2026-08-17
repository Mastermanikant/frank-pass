# FRANKPASS - COMPLETE BUG REPORT
**Generated:** 2026-08-17 | **Auditor:** Antigravity AI Full Codebase Scan
**Repository:** Mastermanikant/frank-pass (main)
**Version Audited:** v3.2.3

---

## HOW TO READ THIS REPORT
- **P0** = Catastrophic - Breaks core functionality RIGHT NOW. Fix immediately.
- **P1** = Critical - Affects most users visibly. Fix this week.
- **P2** = Major - Reduces quality, trust, or usability significantly.
- **P3** = Minor - Polish, edge cases, and small improvements.

---

## SECTION A - CONFIRMED CODE BUGS (Found by Static Analysis)

---

### BUG-01 - Broken Unicode Character in 3 Places
**Priority:** P0 (Visible on UI to every user)
**File:** index.html
**Lines:** 71, 194, 1061

**Description:** A broken Unicode character (BRVBAR / broken bar) has leaked into the source code at three critical locations. Appears as garbled symbol on screen.

**Line 71 - Country Search Placeholder:**
```html
ACTUAL (BROKEN):
<input id="country-search-input" placeholder="Search country&brvbar;" ...>

EXPECTED (FIXED):
<input id="country-search-input" placeholder="Search country..." ...>
```

**Line 194 - Secret Key Placeholder:**
```html
ACTUAL (BROKEN):
<input id="secret-key" placeholder="Your memorable secret&brvbar;" ...>

EXPECTED (FIXED):
<input id="secret-key" placeholder="Your memorable secret..." ...>
```

**Line 1061 - Generate Button Loading State:**
```javascript
// ACTUAL (BROKEN):
genBtn.textContent = 'Generating"[broken char]';

// EXPECTED (FIXED):
genBtn.textContent = 'Generating...';
```

**Impact:** All users see a broken character in the country search box, secret key placeholder, and the "Generating..." loading state. Destroys professionalism.

**Root Cause:** UTF-8 encoding mismatch during copy-paste or file save. The ellipsis character (U+2026) was corrupted to broken-bar (U+00A6).

---

### BUG-02 - Duplicate autocomplete Attribute on Two Inputs
**Priority:** P1 (Browser Parsing Ambiguity / Invalid HTML)
**File:** index.html
**Lines:** 166, 194

**Description:** Two input elements have autocomplete specified TWICE on the same element, creating conflicting declarations. Also spellcheck="false" appears twice on both inputs.

**Line 166 - Platform Input (has both autocomplete="off" AND autocomplete="on"):**
```html
BROKEN:
<input id="platform-input"
  autocomplete="off"      <!-- First: OFF -->
  spellcheck="false"
  ...
  autocomplete="on"       <!-- Second: ON (CONFLICT!) -->
  list="platform-list"
  spellcheck="false">     <!-- spellcheck also doubled -->

CORRECT:
<input
  id="platform-input"
  class="form-input"
  type="text"
  placeholder="e.g. instagram, gmail.com"
  autocomplete="off"
  autocorrect="off"
  autocapitalize="off"
  spellcheck="false"
  data-form-type="other"
  list="platform-list"
  aria-describedby="platform-hint">
```

**Line 194 - Secret Key Input (autocomplete="off" appears twice, spellcheck appears twice):**
```html
CORRECT:
<input
  id="secret-key"
  class="form-input"
  type="password"
  placeholder="Your memorable secret..."
  autocomplete="new-password"
  autocorrect="off"
  autocapitalize="off"
  spellcheck="false"
  data-form-type="other"
  aria-describedby="secret-hint">
```

> NOTE: Changed autocomplete="off" to autocomplete="new-password" for secret key.
> This is the correct standards-compliant way to suppress browser autofill for password fields.
> Some browsers intentionally ignore autocomplete="off" on password inputs.

---

### BUG-03 - Generate Button Text Shows Garbled String
**Priority:** P0 (Visible on Every Click)
**File:** index.html
**Line:** 1061

Same as BUG-01 but specifically the button loading state text is corrupted.
Every user who clicks Generate sees this bug.

```javascript
// BROKEN:
genBtn.textContent = 'Generating"[broken]';

// FIXED:
genBtn.textContent = 'Generating...';
```

---

### BUG-04 - Service Worker Not Registered in HTML
**Priority:** P1 (PWA Offline Mode BROKEN)
**File:** index.html (missing registration code)
**File:** service-worker.js (file exists but is never activated)

**Description:** The service-worker.js file exists and is well-written, BUT there is NO service worker registration call anywhere in index.html. The service worker will never activate.

**What is Missing (must be added before closing body tag):**
```javascript
/* Service Worker Registration */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function(reg) { console.log('[SW] Registered, scope:', reg.scope); })
      .catch(function(err) { console.warn('[SW] Registration failed:', err); });
  });
}
```

**Impact:** PWA install does NOT work. Offline mode does NOT work. The "100% Offline" trust badge on the homepage is currently FALSE for first-time visitors. This is a major trust violation.

---

### BUG-05 - LAUNCH_SALE_END_DATE Expired (May 16, 2026)
**Priority:** P1 (Business Logic Error - Showing Expired Sale)
**File:** frankpass-config.js
**Line:** 14

```javascript
// ACTUAL (EXPIRED - IT IS NOW AUGUST 2026):
LAUNCH_SALE_END_DATE: "2026-05-16T23:59:59+05:30",
SALE_MODE: true,  // Sale is still enabled!
```

**Impact:** The Pro page is showing "Launch Month Deal - 80% OFF" to users, but the sale ended 3 months ago. This is deceptive to users.

**Fix Options:**
1. Set SALE_MODE: false to disable sale display immediately
2. Update LAUNCH_SALE_END_DATE to a future date if sale is intended
3. Add date-checking logic to pro.html to auto-disable when date is past

---

### BUG-06 - All 12 Payment Links Are Placeholder Strings
**Priority:** P1 (Pro Page Non-Functional for Purchases)
**File:** frankpass-config.js
**Lines:** 26-46

```javascript
// ALL PAYMENT LINKS ARE FAKE PLACEHOLDERS:
PAYMENT_LINKS: {
  STANDARD: {
    INDIA: {
      silver:   "[DODO_IN_SILVER_STD]",   // NOT A REAL URL
      gold:     "[DODO_IN_GOLD_STD]",     // NOT A REAL URL
      platinum: "[DODO_IN_PLATINUM_STD]"  // NOT A REAL URL
    },
    GLOBAL: {
      silver:   "[DODO_USD_SILVER_STD]",  // NOT A REAL URL
      gold:     "[DODO_USD_GOLD_STD]",    // NOT A REAL URL
      platinum: "[DODO_USD_PLATINUM_STD]" // NOT A REAL URL
    }
  },
  SALE: { ... all 6 SALE links also placeholders ... }
}
```

**Impact:** Zero revenue possible from Pro tier. Business-critical. Must be fixed before promoting the Pro page.

---

### BUG-07 - Mobile Menu Missing "Products" Link
**Priority:** P2 (Navigation Inconsistency)
**File:** index.html
**Lines:** 103-109

**Desktop nav (complete):**
```
Get Started | Docs | FAQ | About | Products (external) | Get Pro button
```

**Mobile nav (missing Products):**
```
Get Started | Docs | FAQ | About | Get Pro button
```

The Products link to frankbase.com/products is completely absent from the mobile slide-down menu.

**Fix - Add to mobile-menu nav:**
```html
<a href="https://frankbase.com/products" target="_blank" rel="noopener noreferrer">Products</a>
```

---

### BUG-08 - CSP Header Too Permissive (unsafe-eval Allowed)
**Priority:** P1 (Security - Critical for a Security Tool)
**File:** _headers

**Current CSP (dangerous):**
```
Content-Security-Policy: default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
```

**Problems:**
1. unsafe-eval allows eval() - extremely dangerous for a security app
2. connect-src https: allows connecting to ANY https endpoint
3. Missing Permissions-Policy header entirely
4. Missing Strict-Transport-Security (HSTS) header
5. FrankPass uses NO eval() in its codebase - unsafe-eval is completely unnecessary

**Recommended secure _headers:**
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https://flagcdn.com https://www.frankpass.com; connect-src 'self'; worker-src 'self' blob:;
  Cache-Control: public, max-age=0, must-revalidate
```

---

### BUG-09 - Fake aggregateRating Schema Data (Google Policy Violation)
**Priority:** P2 (Trust/Legal Risk)
**File:** index.html
**Lines:** 34-38

```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.9",
  "reviewCount": "1250"
}
```

**Problem:** Google's Structured Data guidelines state aggregateRating must be based on REAL verifiable reviews. Fake numbers can cause:
1. Google manual action / search penalty
2. Rich snippet disqualification
3. Legal exposure in some jurisdictions

**Fix:** Remove aggregateRating entirely until real reviews from Chrome Web Store, G2, or Trustpilot are available.

---

### BUG-10 - Clear Form Does Not Reset Variant/Presets/Length
**Priority:** P2 (Unexpected UX Behavior)
**File:** index.html
**Lines:** 1215-1229

**What Clear Form currently resets:**
- platform input (YES)
- secret key input (YES)
- account mode to single (YES)
- output display (YES)

**What Clear Form DOES NOT reset (bugs):**
- variant counter back to 1 (NO - stays at whatever number)
- advanced panel closes (NO - stays open)
- preset button back to "Strong" (NO - stays on whatever was active)
- length slider back to 16 (NO - stays at current value)
- password type select back to "standard" (NO)

**Fix - Add to clearAllBtn click handler:**
```javascript
// Reset variant to 1
document.getElementById('variant-input').value = 1;
updateVariantDisplay();
if (currentVariantMode !== 'counter') tabCounter.click();
// Reset presets to Strong
document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
document.querySelector('[data-preset="strong"]').classList.add('active');
activeProfile = 'standard';
// Reset length
lengthSlider.value = 16;
lengthVal.textContent = '16';
// Reset type select
document.getElementById('type-select').value = 'standard';
// Close advanced panel
if (advPanel.classList.contains('open')) advToggle.click();
```

---

### BUG-11 - type-select Dropdown Conflicts With Preset Buttons
**Priority:** P1 (Critical Functional Bug - Presets Partially Broken)
**File:** index.html
**Lines:** 1056-1057

**Description:** There are TWO systems that control the password character profile:
1. type-select dropdown ("Only Number | Number+Letters | Number+Letters+Symbol")
2. activeProfile variable (set by preset buttons: Simple/Strong/Max)

**In the generate function:**
```javascript
const typeSelect = document.getElementById('type-select');
const finalProfile = typeSelect ? typeSelect.value : activeProfile;
// This always uses type-select.value!
```

**The bug:**
- User clicks "Simple" preset
- activeProfile is set to 'alphanumeric' (correct)
- But type-select.value is still 'standard' (unchanged!)
- finalProfile = typeSelect.value = 'standard' (WRONG!)
- User gets standard profile (symbols included) instead of simple (letters+numbers only)

The type-select always wins, making preset buttons partially broken.

**Fix - Sync type-select when preset changes:**
```javascript
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // ... existing code ...
    activeProfile = p.profile;
    // ADD THIS: Sync the type-select to match
    const typeSelect = document.getElementById('type-select');
    if (typeSelect) typeSelect.value = p.profile;
    // ... rest of existing code ...
  });
});
```

---

### BUG-12 - robots.txt Allows Crawling of Internal Directories
**Priority:** P1 (SEO Governance)
**File:** robots.txt

**Current robots.txt:**
```
User-agent: *
Allow: /
Sitemap: https://frankpass.com/sitemap.xml
```

**Problem:** Allows crawling of /api/, /.wrangler/ and other internal directories.

**Recommended Fix:**
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /.wrangler/

User-agent: GPTBot
Allow: /

Sitemap: https://frankpass.com/sitemap.xml
```

---

### BUG-13 - WhatsApp CTA Button Has href="#" Fallback (Non-Functional)
**Priority:** P2 (UX Bug)
**File:** index.html
**Line:** 642

```html
<!-- BROKEN: href="#" scrolls to top of page if JS fails -->
<a id="whatsapp-cta-btn" href="#" class="btn-whatsapp">Join Channel</a>
```

The href is set to "#" as a fallback and only updated via JS on DOMContentLoaded. If JS is slow or fails, clicking this button scrolls to the top of the page instead of opening WhatsApp.

**Fix - Set real URL directly in href:**
```html
<a id="whatsapp-cta-btn"
   href="https://whatsapp.com/channel/0029VbBvVfqLNSa2At2Shf2z"
   class="btn-whatsapp"
   target="_blank"
   rel="noopener noreferrer"
   aria-label="Join FrankPass WhatsApp channel">
  Join Channel
</a>
```

---

### BUG-14 - package.json is a 27-Byte Empty Stub
**Priority:** P2 (Dev/CI Broken)
**File:** package.json

The file contains only `{}` (27 bytes). No devDependencies, no scripts, no Node version. Playwright tests cannot run. No CI protection against regressions.

---

### BUG-15 - code Elements Use Courier New Instead of JetBrains Mono
**Priority:** P3 (Visual Quality)
**File:** style.css
**Line:** 78-80

```css
/* CURRENT: JetBrains Mono is loaded but not used for code blocks */
code {
  font-family: 'Courier New', monospace;
}

/* FIX: */
code {
  font-family: 'JetBrains Mono', 'Courier New', monospace;
}
```

JetBrains Mono is explicitly loaded from Google Fonts but not applied to code blocks. Password output and code examples use inferior Courier New instead.

---

### BUG-16 - aria-checked Not Updated Dynamically on Remember Toggle
**Priority:** P2 (Accessibility)
**File:** index.html
**Line:** 201

```html
<!-- aria-checked is hardcoded to false and never updated -->
<input type="checkbox" id="remember-secret" role="switch" aria-checked="false">
```

role="switch" requires aria-checked to stay in sync with the actual checked state. The JS sets rememberToggle.checked = true during init, but aria-checked always stays "false". Screen readers announce "Off" even when toggle is On.

**Fix - Add to handleSecretSave() and initRememberedSecret():**
```javascript
rememberToggle.setAttribute('aria-checked', String(rememberToggle.checked));
```

---

### BUG-17 - select Elements Missing Visible Dropdown Arrow on Safari iOS
**Priority:** P3 (Visual Bug on Safari)
**File:** style.css

The type-select password type dropdown and variant month select use appearance:none in some contexts but have no custom dropdown arrow CSS. On Safari iOS, selects appear with no dropdown indicator, making them look like non-interactive text.

---

### BUG-18 - No prefers-reduced-motion Support
**Priority:** P2 (Accessibility WCAG 2.3.3)
**File:** style.css

The CSS has multiple animations (fadeIn, fadeInUp, glow, pulse) but NO @media (prefers-reduced-motion: reduce) query. Users with vestibular disorders or motion sensitivity cannot disable animations.

**Fix - Add to end of style.css:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### BUG-19 - Anchor Scroll Target Hidden Behind Sticky Header
**Priority:** P3 (UX Polish)
**File:** style.css, index.html L132

```html
<!-- Clicking this link scrolls #generator under the 68px sticky header -->
<a href="#generator" class="btn-primary btn-lg">Try the Generator</a>
```

Without scroll-margin-top, the generator card scrolls partially behind the sticky header.

**Fix:**
```css
/* Prevent sticky header from covering scroll targets */
[id] { scroll-margin-top: calc(var(--header-h) + 1rem); }
```

---

### BUG-20 - External flagcdn.com CDN vs Local Unused flags/ Directory
**Priority:** P3 (Privacy / Consistency)
**File:** index.html, country-dropdown.js

The flags/ directory exists locally but flag images are loaded from https://flagcdn.com (external CDN). This creates:
1. External request to flagcdn.com at page load (Google can see users visit frankpass.com)
2. Local flags/ directory is dead weight in the repository
3. If flagcdn.com goes down, all country flags disappear

**Fix Options:**
- Self-host flags from the local flags/ directory (full privacy)
- Document in legal.html that flagcdn.com is used for flag images
- Add flagcdn.com to GDPR/privacy disclosures

---

## BUG SUMMARY TABLE

| ID | Bug Description | File | Priority | Category |
|:---|:----------------|:-----|:---------|:---------|
| 01 | Broken pipe char in 3 places | index.html L71,194,1061 | P0 | Code |
| 02 | Duplicate autocomplete/spellcheck attrs | index.html L166,194 | P1 | Code |
| 03 | Generate button shows garbled loading text | index.html L1061 | P0 | UI |
| 04 | Service Worker not registered in HTML | index.html | P1 | PWA |
| 05 | Sale end date expired (May 2026) | frankpass-config.js | P1 | Business |
| 06 | All 12 payment links are placeholders | frankpass-config.js | P1 | Business |
| 07 | Mobile menu missing Products link | index.html L103-109 | P2 | Nav |
| 08 | CSP header allows unsafe-eval | _headers | P1 | Security |
| 09 | Fake aggregateRating schema (1250 reviews) | index.html L34-38 | P2 | SEO/Legal |
| 10 | Clear Form leaves variant/preset/length dirty | index.html | P2 | UX |
| 11 | Preset buttons conflict with type-select | index.html L1056 | P1 | Logic |
| 12 | robots.txt allows /api/ and /.wrangler/ | robots.txt | P1 | SEO |
| 13 | WhatsApp CTA has href="#" fallback | index.html L642 | P2 | UX |
| 14 | package.json is empty stub | package.json | P2 | Dev |
| 15 | code uses Courier New not JetBrains Mono | style.css | P3 | Visual |
| 16 | aria-checked not updated on toggle | index.html L201 | P2 | A11y |
| 17 | Select has no dropdown arrow on Safari | style.css | P3 | Visual |
| 18 | No prefers-reduced-motion support | style.css | P2 | A11y |
| 19 | Anchor scroll hidden behind sticky header | style.css | P3 | UX |
| 20 | External flagcdn.com vs local flags/ dir | index.html | P3 | Privacy |

**TOTAL: 20 bugs**
- P0 Catastrophic: 2
- P1 Critical: 7
- P2 Major: 7
- P3 Minor: 4

---

## CRYPTO ENGINE AUDIT (frankpass-core.js) - VERIFIED CORRECT

The cryptographic engine was manually reviewed. These are CONFIRMED CORRECT and MUST NOT BE CHANGED:

| Component | Implementation | Verdict |
|:----------|:---------------|:--------|
| Main Algorithm | PBKDF2-HMAC-SHA512 | CORRECT |
| Iterations | 1,000,000 | CORRECT |
| Browser API | window.crypto.subtle | CORRECT |
| HMAC Expansion | Two-block expansion [1] and [...sig1, 2] | CORRECT |
| Uppercase chars | ABDEFGHJKLMNPQRTUXYZ (no I/O/C/S/V/W) | CORRECT |
| Lowercase chars | abdefghijkmnpqrtuxyz (no l/o/c/s/v/w) | CORRECT |
| Numbers | 23456789 (no 0 or 1) | CORRECT |
| Symbols | @#$%+*= (7 universal symbols) | CORRECT |
| Pepper value | FrankbaseSuperSecretMango2026! (hardcoded) | CORRECT |
| Context string | Length-prefixed all inputs (prevents length extension) | CORRECT |
| Output mapping | Modulo-bias-free (validMax = 256 - 256%charsetLen) | CORRECT |

WARNING: The getLocalPepper() function runs 1000 SHA-256 rounds PLUS PBKDF2 runs 1,000,000 iterations. This is intentional for security. DO NOT "optimize" or remove either.

---

## AES-GCM SECRET VAULT AUDIT - MOSTLY CORRECT

| Component | Implementation | Verdict |
|:----------|:---------------|:--------|
| Algorithm | AES-GCM | CORRECT |
| Key length | 256-bit (32 bytes) | CORRECT |
| IV generation | crypto.getRandomValues(new Uint8Array(12)) | CORRECT |
| IV length | 96 bits (12 bytes) | CORRECT |
| Key storage | localStorage as hex string | ACCEPTABLE (see note) |
| Error handling | Silent catch(_) returns empty string | ACCEPTABLE |

NOTE on key extractability: The AES-GCM device key is stored in localStorage.
Any XSS attack on frankpass.com could extract and use this key to decrypt stored secrets.
Since frankpass.com has no server-side code, XSS risk is lower but not zero.
This is acceptable for the current threat model but should be documented.

---

*End of Bug Report | Next: AUDIT_UX_AND_UI_REPORT.md*
