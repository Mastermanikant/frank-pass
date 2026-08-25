/**
 * footer.js - FrankPass Shared Footer Renderer v3.1
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
    const ver   = cfg.SITE_VERSION || '3.1.0';

    /* ── SVG icons ── */
    const ico = {
      x:         `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
      instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`,
      youtube:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
      facebook:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
      reddit:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>`,
      whatsapp:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>`,
      mastodon:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z"/></svg>`,
      shield:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    };

    /* ── Social row builder ── */
    function socialLink(href, label, icon, rel) {
      if (!href || href.includes('[')) return '';
      const relAttr = rel ? ` rel="me noopener noreferrer"` : ` rel="noopener noreferrer"`;
      return `<a href="${href}" class="footer-social-link" aria-label="${label}" target="_blank"${relAttr}>${icon}</a>`;
    }

    const waLink = (soc.WHATSAPP && !soc.WHATSAPP.includes('[')) ? soc.WHATSAPP : '#';

    el.innerHTML = `
<footer class="site-footer" role="contentinfo">
  <div class="footer-inner">

    <!-- WhatsApp CTA Card -->
    <div class="footer-whatsapp-card" style="background:rgba(37,211,102,0.08);border:1px solid rgba(37,211,102,0.2);border-radius:14px;padding:1.25rem 1.5rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:2rem">
      ${ico.whatsapp}
      <div style="flex:1;min-width:180px">
        <strong style="color:var(--text-primary);display:block;margin-bottom:0.25rem">Get Security Tips &amp; Updates directly on WhatsApp!</strong>
        <p style="margin:0;font-size:0.85rem;color:var(--text-muted)">Latest password security insights, cryptographic upgrades, and privacy practices - 100% Privacy-First channel with zero personal data collection.</p>
      </div>
      <a href="${waLink}" class="btn-whatsapp btn-sm" target="_blank" rel="noopener noreferrer" aria-label="Join FrankPass on WhatsApp">
        Join Channel
      </a>
    </div>

    <!-- Footer grid -->
    <div class="footer-grid">

      <!-- Brand -->
      <div class="footer-brand">
        <a href="/" class="header-logo" aria-label="FrankPass Home">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
            <path d="M16 2 L28 8 L28 16 C28 23 22 28 16 30 C10 28 4 23 4 16 L4 8 Z" fill="#8b5cf6" opacity="0.2" stroke="#8b5cf6" stroke-width="1.5"/>
            <path d="M16 6 L24 10 L24 16 C24 21 20 25 16 27 C12 25 8 21 8 16 L8 10 Z" fill="#8b5cf6" opacity="0.4"/>
            <path d="M13 15 L15 17 L19 13" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
          <span class="logo-text"><span>Frank</span>Pass</span>
        </a>
        <p>Serverless Cryptography. Zero Database. Pure Math.</p>
        <div class="footer-social" style="margin-top:1rem">
          ${socialLink(soc.X,        'FrankPass on X',        ico.x)}
          ${socialLink(soc.INSTAGRAM,'FrankPass on Instagram',ico.instagram)}
          ${socialLink(soc.YOUTUBE,  'FrankPass on YouTube',  ico.youtube)}
          ${socialLink(soc.FACEBOOK, 'FrankPass on Facebook', ico.facebook)}
          ${socialLink(soc.REDDIT,   'FrankPass on Reddit',   ico.reddit)}
          ${socialLink(soc.WHATSAPP, 'FrankPass on WhatsApp', ico.whatsapp)}
          ${socialLink(soc.MASTODON_BRAND,'FrankPass on Mastodon',ico.mastodon, true)}
        </div>
      </div>

            <!-- Product links -->
      <div class="footer-col">
        <div class="footer-col-title">FrankPass</div>
        <a href="./index.html">Password Generator</a>
        <a href="./products.html">All Products Hub 📦</a>
        <a href="./install.html">Install App 📱</a>
        <a href="./get-started.html">Get Started</a>
        <a href="./pro.html">FrankPass Pro 👑</a>
        <a href="./docs.html">Documentation</a>
        <a href="./faq.html">FAQ</a>
        <a href="./about-us.html">About Us</a>
        <a href="./about-us-hindi.html">About (Hindi) 🇮🇳</a>
        <a href="./limitations-and-advantages.html">Why Our Flaws Are Strengths</a>
        <a href="./limitations-and-advantages-hindi.html">कमियां एवं अच्छाइयां (हिन्दी) 🇮🇳</a>
        <a href="./legal.html">Privacy &amp; Terms</a>
      </div>

      <!-- FrankBase Ecosystem links -->
      <div class="footer-col">
        <div class="footer-col-title">FrankBase Ecosystem</div>
        <a href="https://frankbase.com" target="_blank" rel="noopener noreferrer">FrankBase.com ↗</a>
        <a href="https://digital.frankbase.com" target="_blank" rel="noopener noreferrer">Digital Products Store ↗</a>
        <a href="https://frankbase.com/products" target="_blank" rel="noopener noreferrer">All Tools &amp; Products ↗</a>
        <a href="https://store.frankbase.com/ebooks" target="_blank" rel="noopener noreferrer">Cyber Security eBooks ↗</a>
        <a href="https://store.frankbase.com/ebooks" target="_blank" rel="noopener noreferrer">Free eBook (Pay What You Want) 📖</a>
      </div>

      <!-- Founder links -->
      <div class="footer-col">
        <div class="footer-col-title">Master Manikant</div>
        <a href="https://mastermanikant.com" target="_blank" rel="noopener noreferrer">MasterManikant.com ↗</a>
        <a href="./founder-mastermanikant.html">Founder Master Manikant</a>
        <a href="./founder-mastermanikant-hindi.html">Founder Profile (Hindi) 🇮🇳</a>
        <a href="https://whatsapp.com/channel/0029VbAmRaDDeON1M7sWY532" target="_blank" rel="noopener noreferrer">WhatsApp Channel</a>
        <a href="https://linkedin.com/in/mastermanikant" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://x.com/MasterManikant" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
        <a href="https://youtube.com/@mastermanikant" target="_blank" rel="noopener noreferrer">YouTube</a>
      </div>


    </div>

    <!-- PWA Install Strip -->
    <div id="footer-pwa-strip" style="display:none;background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.2);border-radius:12px;padding:1rem 1.5rem;margin-top:1.5rem;align-items:center;gap:1rem;flex-wrap:wrap;justify-content:space-between">
      <div>
        <strong style="color:var(--text-primary);font-size:0.95rem">📱 Install FrankPass Web App (PWA)</strong>
        <p style="margin:0.2rem 0 0;font-size:0.82rem;color:var(--text-muted)">Install once - works 100% offline without internet anytime, anywhere.</p>
      </div>
      <a href="#" class="pwa-install-btn btn-ghost" style="font-size:0.85rem;padding:0.6rem 1.2rem;white-space:nowrap">Install App ↓</a>
    </div>

    <!-- Footer bottom bar -->
    <div class="footer-bottom">
      <span>&copy; <span id="fp-copy-year">${year}</span> FrankPass &middot; Built by <a href="https://mastermanikant.com" target="_blank" rel="noopener noreferrer">Master Manikant Yadav</a> &middot; 
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
      <div class="footer-legal-links">
        <a href="./legal.html#privacy">Privacy Policy</a>
        <a href="./legal.html#terms">Terms of Service</a>
        <a href="./legal.html#disclaimer">Disclaimer</a>
      </div>
    </div>

  </div>
</footer>`;
  }

  /* Run after DOM + config ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      buildFooter();

    // Mobile click toggle for version popover
    const vWrap = document.getElementById('fp-version-wrap');
    const vBtn = document.getElementById('fp-version-btn');
    if (vWrap && vBtn) {
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

    });
  } else {
    buildFooter();
  }

})();

// PWA Install Logic
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Show footer PWA strip
  const strip = document.getElementById('footer-pwa-strip');
  if (strip) strip.style.display = 'flex';
  // Show all pwa-install-btn buttons
  document.querySelectorAll('.pwa-install-btn').forEach(btn => {
    btn.style.display = 'inline-flex';
    btn.addEventListener('click', async (ev) => {
      ev.preventDefault();
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        deferredPrompt = null;
        document.querySelectorAll('.pwa-install-btn').forEach(b => b.style.display = 'none');
        const strip2 = document.getElementById('footer-pwa-strip');
        if (strip2) strip2.style.display = 'none';
      }
    });
  });
});

// Unified Rock-Solid Theme Controller (WCAG Compliant)
(function initTheme() {
  const moonSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
  const sunSVG  = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';

  function updateIcons(isLight) {
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.innerHTML = isLight ? moonSVG : sunSVG;
      btn.setAttribute('aria-label', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
      btn.title = isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    });
  }

  function setTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('frankpass_theme', 'light');
      localStorage.setItem('fp_theme', 'light');
      updateIcons(true);
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('frankpass_theme', 'dark');
      localStorage.setItem('fp_theme', 'dark');
      updateIcons(false);
    }
  }

  // Initial theme on load
  const saved = localStorage.getItem('frankpass_theme') || localStorage.getItem('fp_theme');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  window.addEventListener('DOMContentLoaded', () => {
    const isCurrentlyLight = document.documentElement.getAttribute('data-theme') === 'light';
    updateIcons(isCurrentlyLight);

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        setTheme(isLight ? 'dark' : 'light');
      };
    });
  });
})();
