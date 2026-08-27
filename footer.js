/**
 * footer.js - FrankPass Shared Footer Renderer v3.4 (Clean, Minimal, Modern)
 * Call: place <div id="site-footer"></div> on every page.
 * Reads social links from FRANKPASS_CONFIG.SOCIAL.
 * Always load this script LAST.
 */

(function () {
  'use strict';

  function buildFooter() {
    const el = document.getElementById('site-footer');
    if (!el) return;

    const cfg   = (typeof FRANKPASS_CONFIG !== 'undefined') ? FRANKPASS_CONFIG : {};
    const soc   = cfg.SOCIAL || {};
    const year  = new Date().getFullYear();
    const ver   = cfg.SITE_VERSION || '3.3.9';

    /* ── SVG icons ── */
    const ico = {
      x:         `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
      github:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>`,
      linkedin:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.63 1.63 0 0 0-1.63 1.63 1.63 1.63 0 0 0 1.63 1.63 1.63 1.63 0 0 0 1.63-1.63c0-.9-.73-1.63-1.63-1.63z"/></svg>`,
      youtube:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
      whatsapp:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.71 4.3 3.8 2.52 1.1 2.52.73 2.98.69.45-.04 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z"/></svg>`,
      instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`,
      snapchat:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M12.004 2c-3.79 0-6.864 2.87-6.864 6.41 0 1.25.43 2.41 1.15 3.34-.14.49-.49 1.12-.98 1.57-.22.2-.18.55.08.69.7.38 1.63.53 2.39.46.42.54.95.99 1.57 1.3-.39.26-.95.54-1.74.83-.5.18-.84.66-.81 1.19.03.54.43.98.97 1.05 1.48.19 3.03.65 3.86 1.66.19.23.51.37.82.37s.63-.14.82-.37c.83-1.01 2.38-1.47 3.86-1.66.54-.07.94-.51.97-1.05.03-.53-.31-1.01-.81-1.19-.79-.29-1.35-.57-1.74-.83.62-.31 1.15-.76 1.57-1.3.76.07 1.69-.08 2.39-.46.26-.14.3-.49.08-.69-.49-.45-.84-1.08-.98-1.57.72-.93 1.15-2.09 1.15-3.34 0-3.54-3.074-6.41-6.864-6.41z"/></svg>`
    };

    /* ── Social row builder ── */
    function socialLink(href, label, icon) {
      if (!href || href.includes('[')) return '';
      return `<a href="${href}" class="footer-social-link" aria-label="${label}" target="_blank" rel="noopener noreferrer">${icon}</a>`;
    }

    const waLink = (soc.WHATSAPP && !soc.WHATSAPP.includes('[')) ? soc.WHATSAPP : 'https://whatsapp.com/channel/0029VbAmRaDDeON1M7sWY532';

    el.innerHTML = `
<footer class="site-footer" role="contentinfo">
  <div class="footer-inner">

    <!-- 4-Column Minimal Grid -->
    <div class="footer-grid">

      <!-- Col 1: Brand & Socials -->
      <div class="footer-brand">
        <a href="/" class="header-logo" aria-label="FrankPass Home">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
            <path d="M16 2 L28 8 L28 16 C28 23 22 28 16 30 C10 28 4 23 4 16 L4 8 Z" fill="#8b5cf6" opacity="0.2" stroke="#8b5cf6" stroke-width="1.5"/>
            <path d="M16 6 L24 10 L24 16 C24 21 20 25 16 27 C12 25 8 21 8 16 L8 10 Z" fill="#8b5cf6" opacity="0.4"/>
            <path d="M13 15 L15 17 L19 13" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
          <span class="logo-text"><span>Frank</span>Pass</span>
        </a>
        <p style="margin-top:0.65rem;font-size:0.88rem;color:var(--text-muted);line-height:1.5">Serverless Cryptography. Zero Database. Pure Math.</p>
        
        <div class="footer-social" style="margin-top:1.15rem;display:flex;gap:8px;flex-wrap:wrap">
          ${socialLink('https://x.com/mastermanikant', 'X (Twitter)', ico.x)}
          ${socialLink('https://github.com/Mastermanikant', 'GitHub', ico.github)}
          ${socialLink('https://linkedin.com/in/mastermanikant', 'LinkedIn', ico.linkedin)}
          ${socialLink('https://youtube.com/@mastermanikant', 'YouTube', ico.youtube)}
          ${socialLink(waLink, 'WhatsApp Channel', ico.whatsapp)}
          ${socialLink('https://instagram.com/mastermanikant', 'Instagram', ico.instagram)}
          ${socialLink('https://snapchat.com/add/mastermanikant', 'Snapchat', ico.snapchat)}
        </div>
      </div>

      <!-- Col 2: Products & Tools -->
      <div class="footer-col">
        <div class="footer-col-title">Products &amp; Tools</div>
        <a href="/index.html">Password Generator</a>
        <a href="/pro.html">FrankPass Pro</a>
        <a href="https://tools.frankpass.com" target="_blank" rel="noopener noreferrer">Tools Suite ↗</a>
        <a href="/install.html">Install Offline App</a>
        <a href="/products.html">All Products Hub</a>
      </div>

      <!-- Col 3: Resources & Security -->
      <div class="footer-col">
        <div class="footer-col-title">Resources</div>
        <a href="/get-started.html">Get Started Guide</a>
        <a href="/docs.html">Documentation</a>
        <a href="/faq.html">Security FAQ</a>
        <a href="/limitations-and-advantages.html">Limitations &amp; Advantages</a>
        <a href="/blog.html">Security Blog</a>
      </div>

      <!-- Col 4: Trust & Founder -->
      <div class="footer-col">
        <div class="footer-col-title">Trust &amp; Legal</div>
        <a href="/about-us.html">About FrankPass</a>
        <a href="/founder-mastermanikant.html">Master Manikant (Founder)</a>
        <a href="/legal.html#privacy">Privacy Policy</a>
        <a href="/legal.html#terms">Terms of Service</a>
        <a href="/legal.html">Legal &amp; Safety Hub</a>
      </div>

    </div>

    <!-- Horizontal Ecosystem Network Bar (Clean Buttons) -->
    <div style="margin:2.25rem 0 1.5rem 0;padding:1.15rem 1.5rem;background:var(--card-glass-bg);border:1px solid var(--border);border-radius:16px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem">
      <div style="display:flex;align-items:center;gap:0.6rem">
        <span style="font-size:0.75rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--accent-light);background:rgba(139,92,246,0.15);padding:3px 8px;border-radius:10px">Ecosystem</span>
        <span style="font-size:0.85rem;color:var(--text-muted);font-weight:500">Our Digital Platforms:</span>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <a href="https://frankbase.com" target="_blank" rel="noopener noreferrer" class="btn-ghost" style="font-size:0.8rem;padding:0.45rem 0.95rem;border-radius:8px;border:1px solid var(--border);text-decoration:none;display:inline-flex;align-items:center;gap:5px;font-weight:600">
          FrankBase.com ↗
        </a>
        <a href="https://tools.frankpass.com" target="_blank" rel="noopener noreferrer" class="btn-ghost" style="font-size:0.8rem;padding:0.45rem 0.95rem;border-radius:8px;border:1px solid var(--border);text-decoration:none;display:inline-flex;align-items:center;gap:5px;font-weight:600">
          tools.frankpass.com ↗
        </a>
        <a href="https://englishvidya.com" target="_blank" rel="noopener noreferrer" class="btn-ghost" style="font-size:0.8rem;padding:0.45rem 0.95rem;border-radius:8px;border:1px solid var(--border);text-decoration:none;display:inline-flex;align-items:center;gap:5px;font-weight:600">
          EnglishVidya.com ↗
        </a>
        <a href="https://store.frankbase.com" target="_blank" rel="noopener noreferrer" class="btn-ghost" style="font-size:0.8rem;padding:0.45rem 0.95rem;border-radius:8px;border:1px solid var(--border);text-decoration:none;display:inline-flex;align-items:center;gap:5px;font-weight:600">
          Digital Store ↗
        </a>
        <a href="https://mastermanikant.com" target="_blank" rel="noopener noreferrer" class="btn-ghost" style="font-size:0.8rem;padding:0.45rem 0.95rem;border-radius:8px;border:1px solid var(--border);text-decoration:none;display:inline-flex;align-items:center;gap:5px;font-weight:600">
          MasterManikant.com ↗
        </a>
      </div>
    </div>

    <!-- Footer Bottom Copyright Bar -->
    <div class="footer-bottom" style="padding-top:1rem;border-top:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;font-size:0.82rem;color:var(--text-muted)">
      <span>&copy; <span id="fp-copy-year">${year}</span> FrankPass &middot; Engineered by <a href="https://mastermanikant.com" target="_blank" rel="noopener noreferrer" style="color:var(--text-primary);font-weight:600;text-decoration:none">Master Manikant Yadav</a> &middot; 
        <span class="footer-version-badge-wrap" id="fp-version-wrap">
          <button type="button" class="footer-version-btn" id="fp-version-btn" aria-label="Version and Immutable Algorithm Guarantee">
            v${ver}<span class="version-dot"></span>
          </button>
          <span class="version-popover" id="fp-version-popover" role="tooltip">
            <strong class="version-popover-title">🛡️ Immutable Algorithm Guarantee</strong>
            <span class="version-popover-text">The core password derivation formula (PBKDF2-HMAC-SHA512 at 1M rounds) is <strong>permanently frozen and immutable</strong>. It will NEVER change in future updates. The same platform and secret key will always generate the exact same password, forever. Version updates only reflect UI speed, PWA caching, and theme improvements.</span>
          </span>
        </span>
      </span>
      <div class="footer-legal-links" style="display:flex;gap:1rem">
        <a href="/legal.html#privacy" style="color:var(--text-muted);text-decoration:none">Privacy Policy</a>
        <a href="/legal.html#terms" style="color:var(--text-muted);text-decoration:none">Terms of Service</a>
        <a href="/legal.html" style="color:var(--text-muted);text-decoration:none">Legal Hub</a>
      </div>
    </div>

  </div>
</footer>`;
  }

  function setupVersionPopover() {
    const vWrap = document.getElementById('fp-version-wrap');
    const vBtn = document.getElementById('fp-version-btn');
    if (vWrap && vBtn && !vBtn._hasFpListener) {
      vBtn._hasFpListener = true;
      vBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        vWrap.classList.toggle('open');
      });
      document.addEventListener('click', (e) => {
        if (!vWrap.contains(e.target)) {
          vWrap.classList.remove('open');
        }
      });
    }
  }

  // Universal Rock-Solid Mobile Hamburger Navigation Handler
  function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger && mobileMenu && !hamburger._hasMenuListener) {
      hamburger._hasMenuListener = true;
      hamburger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = mobileMenu.classList.toggle('open');
        hamburger.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
      document.addEventListener('click', function (e) {
        if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
          mobileMenu.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  function initFooter() {
    setupMobileMenu();
    buildFooter();
    setupVersionPopover();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooter);
  } else {
    initFooter();
  }
})();
