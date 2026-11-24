/**
 * footer.js - FrankPass Shared Footer Renderer v3.5.0 (Modern, High-Tech, Responsive)
 * Inspired by modern cryptographic UI & clean local-first engineering principles.
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
    const ver = cfg.SITE_VERSION || '5.0.1';
    const isHindi = document.documentElement.lang === 'hi' || window.location.pathname.includes('hindi');

    /* ── SVG icons ── */
    const ico = {
      x:         `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
      github:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>`,
      linkedin:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 1 0 0-3.26z"/></svg>`,
      youtube:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
      whatsapp:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.71 4.3 3.8 2.52 1.1 2.52.73 2.98.69.45-.04 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z"/></svg>`,
      instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`
    };

    /* ── Social row builder with hover micro-cards ── */
    function socialLink(href, label, icon, desc) {
      if (!href || href.includes('[')) return '';
      return `
        <div class="has-hover-card">
          <a href="${href}" class="footer-social-link" aria-label="${label}" target="_blank" rel="nofollow noopener noreferrer">${icon}</a>
          <div class="hover-card-preview" style="width:200px">
            <div class="hover-card-title">${label}</div>
            <p class="hover-card-desc">${desc}</p>
          </div>
        </div>`;
    }

    const waLink = (soc.WHATSAPP && !soc.WHATSAPP.includes('[')) ? soc.WHATSAPP : 'https://whatsapp.com/channel/0029VbAmRaDDeON1M7sWY532';

    el.innerHTML = `
<footer class="site-footer" role="contentinfo" data-nosnippet>
  <div class="footer-inner">

    <!-- 4-Column Modern Inspired Grid -->
    <div class="footer-grid">

      <!-- Col 1: Brand & Local-First Philosophy -->
      <div class="footer-brand">
        <a href="/" class="header-logo" aria-label="FrankPass Home">
          <img src="/icons/logo-key-64.webp" onerror="this.src='/icons/logo-key-64.png'" alt="FrankPass Logo" width="30" height="30" class="header-brand-icon" style="vertical-align:middle;margin-right:6px;display:inline-block;" loading="lazy" decoding="async">
          <span class="logo-text"><span>Frank</span>Pass</span>
        </a>
        
        <h3 style="font-size:1.15rem;font-weight:800;color:var(--text-primary);margin:0.85rem 0 0.35rem;letter-spacing:-0.01em;">
          ${isHindi ? 'क्रेडेंशियल्स, सीधे आपके डिवाइस पर।' : 'Credentials, derived locally.'}
        </h3>
        
        <p style="font-size:0.86rem;color:var(--text-muted);line-height:1.6;margin:0 0 1rem;max-width:320px">
          ${isHindi 
            ? '10,00,000 PBKDF2 राउंड्स द्वारा संचालित स्टेटलेस पासवर्ड जनरेशन। शून्य क्लाउड वॉल्ट, शून्य ट्रैकिंग और 100% क्लाइंट-साइड सुरक्षा।'
            : 'Deterministic passwords and PINs, computed on your device with 1,000,000 PBKDF2 iterations. Zero cloud databases, zero telemetry, and zero breach footprint.'}
        </p>

        <div class="footer-social" style="display:flex;gap:8px;flex-wrap:wrap;max-width:300px">
          ${socialLink(soc.X || 'https://x.com/frankpasshq', 'X (Twitter)', ico.x, 'Official product updates & security announcements (@frankpasshq).')}
          ${socialLink(soc.GITHUB || 'https://github.com/Mastermanikant/frank-pass', 'FrankPass on GitHub', ico.github, 'Open-source codebases, repos, and cryptographic engines.')}
          ${socialLink(soc.LINKEDIN || 'https://linkedin.com/in/mastermanikant', 'LinkedIn', ico.linkedin, 'Professional milestones & tech collaborations.')}
          ${socialLink(soc.YOUTUBE || 'https://youtube.com/@frankpasshq', 'FrankPass on YouTube', ico.youtube, 'Official video guides & product walkthroughs (@frankpasshq).')}
          ${socialLink(waLink, 'WhatsApp Channel', ico.whatsapp, 'Instant spam-free security alerts & releases.')}
          ${socialLink(soc.INSTAGRAM || 'https://instagram.com/frankpasshq', 'Instagram', ico.instagram, 'Official product visuals & feature highlights (@frankpasshq).')}
        </div>

        <div style="margin-top:1rem">
          <button type="button" id="footer-push-btn" class="footer-push-toggle-btn" onclick="togglePushNotifications()" aria-label="Toggle Push Notifications" style="display:inline-flex;align-items:center;gap:6px;background:rgba(139,92,246,0.12);border:1px solid rgba(139,92,246,0.3);color:var(--text-primary);padding:6px 12px;border-radius:8px;font-size:0.78rem;font-weight:600;cursor:pointer;transition:all 0.2s">
            <span id="footer-push-icon">🔔</span>
            <span id="footer-push-label">${isHindi ? 'अपडेट्स नोटिफिकेशन चालू करें' : 'Enable Updates Notification'}</span>
          </button>
        </div>
      </div>

      <!-- 3 Navigation Columns (One-Line Segmented Tabs on Mobile) -->
      <div class="footer-nav-columns">

        <!-- Col 2: Use FrankPass (Tools Tab) -->
        <div class="footer-col" id="footer-col-tools">
          <button type="button" class="footer-col-header-btn tab-cyan" onclick="toggleFooterTab('footer-col-tools')" aria-expanded="false">
            <span class="footer-col-pill pill-cyan">${isHindi ? 'टूल्स' : 'TOOLS'}</span>
            <span class="footer-col-accordion-toggle" aria-hidden="true">▾</span>
          </button>
          <div class="footer-col-links-wrap">
          
          <a href="/" class="footer-nav-link">
            <span>${isHindi ? 'पासवर्ड जनरेटर' : 'Password generator'}</span>
          </a>
          <a href="${isHindi ? '/pin-hindi.html' : '/pin.html'}" class="footer-nav-link">
            <span>${isHindi ? 'पिन जनरेटर' : 'PIN generator'}</span>
          </a>
          <a href="/random-password-generator.html" class="footer-nav-link">
            <span>${isHindi ? 'रैंडम पासवर्ड' : 'Random password'}</span>
          </a>
          <a href="${isHindi ? '/comparison-between-frankpass-all-generators-deterministic-random-pin-hindi.html' : '/comparison-between-frankpass-all-generators-deterministic-random-pin.html'}" class="footer-nav-link">
            <span>${isHindi ? 'सभी टूल्स की तुलना' : 'Compare all tools'}</span>
          </a>
          <a href="${isHindi ? '/pricing-hindi.html' : '/pricing.html'}" class="footer-nav-link">
            <span>${isHindi ? 'प्रो और प्राइसिंग' : 'Pro &amp; pricing'}</span>
          </a>
          </div>
        </div>

        <!-- Col 3: Learn & Verify (Resources Tab) -->
        <div class="footer-col" id="footer-col-learn">
          <button type="button" class="footer-col-header-btn tab-blue" onclick="toggleFooterTab('footer-col-learn')" aria-expanded="false">
            <span class="footer-col-pill pill-blue">${isHindi ? 'रिसोर्सेज' : 'RESOURCES'}</span>
            <span class="footer-col-accordion-toggle" aria-hidden="true">▾</span>
          </button>
          <div class="footer-col-links-wrap">
          
          <a href="${isHindi ? '/frankpass-vs-cloud-password-vaults-hindi.html' : '/frankpass-vs-cloud-password-vaults.html'}" class="footer-nav-link">
            <span>${isHindi ? 'यह कैसे काम करता है' : 'How it works'}</span>
          </a>
          <a href="${isHindi ? '/secret-key-guide-hindi.html' : '/secret-key-guide.html'}" class="footer-nav-link">
            <span>${isHindi ? 'सीक्रेट की गाइड' : 'Secret Key Guide'}</span>
          </a>
          <a href="${isHindi ? '/whitepaper-hindi.html' : '/whitepaper.html'}" class="footer-nav-link">
            <span>${isHindi ? 'टेक्निकल व्हाइटपेपर' : 'Technical whitepaper'}</span>
          </a>
          <a href="${isHindi ? '/faq-hindi.html' : '/faq.html'}" class="footer-nav-link">
            <span>${isHindi ? 'सुरक्षा FAQ' : 'Security limits &amp; FAQ'}</span>
          </a>
          <a href="${isHindi ? '/where-password-managers-fail-and-invisible-vault-hindi.html' : '/where-password-managers-fail-and-invisible-vault.html'}" class="footer-nav-link">
            <span>${isHindi ? 'इनविजिबल वॉल्ट डिफेंस' : 'Invisible Vault Defense'}</span>
          </a>
          </div>
        </div>

        <!-- Col 4: Products & Apps (Products Tab) -->
        <div class="footer-col" id="footer-col-products">
          <button type="button" class="footer-col-header-btn tab-emerald" onclick="toggleFooterTab('footer-col-products')" aria-expanded="false">
            <span class="footer-col-pill pill-emerald">${isHindi ? 'उत्पाद' : 'PRODUCTS'}</span>
            <span class="footer-col-accordion-toggle" aria-hidden="true">▾</span>
          </button>
          <div class="footer-col-links-wrap">
          
          <a href="${isHindi ? '/extension-hindi.html' : '/extension.html'}" class="footer-nav-link">
            <span>${isHindi ? 'ब्राउज़र एक्सटेंशन' : 'Browser extension'}</span>
          </a>
          <a href="${isHindi ? '/install-hindi.html' : '/install.html'}" class="footer-nav-link">
            <span>${isHindi ? 'ऑफलाइन PWA ऐप' : 'Install the PWA'}</span>
          </a>
          <a href="${isHindi ? '/install-hindi.html#android' : '/install.html#android'}" class="footer-nav-link">
            <span>${isHindi ? 'एंड्रॉइड ऐप' : 'Android App'}</span>
          </a>
          <a href="https://store.frankbase.com" target="_blank" rel="noopener" class="footer-nav-link" style="color:var(--accent-light)!important;font-weight:700;">
            <span>${isHindi ? 'स्टोर' : 'Store'} ↗</span>
          </a>
          <a href="${isHindi ? '/library-hindi.html' : '/library.html'}" class="footer-nav-link" style="color:var(--accent-light)!important;font-weight:700;">
            <span>${isHindi ? 'मास्टर रिसोर्स लाइब्रेरी' : 'Master Resource Library'}</span>
          </a>
          </div>
        </div>

      </div>

    </div>

    <!-- Responsive Ecosystem Network Bar (Hidden per user request, remove display:none to restore) -->
    <div class="footer-ecosystem-bar" style="display:none !important;" aria-hidden="true">
    
      <div class="footer-ecosystem-header">
        <span style="font-size:0.72rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--accent-light);background:rgba(139,92,246,0.15);padding:3px 8px;border-radius:10px">Ecosystem</span>
        <span style="font-size:0.85rem;color:var(--text-muted);font-weight:600">${isHindi ? 'हमारे डिजिटल प्लेटफॉर्म्स:' : 'Our Digital Platforms:'}</span>
      </div>
      
      <div class="footer-ecosystem-grid">
        
        <!-- FrankBase -->
        <div class="has-hover-card" style="width:100%">
          <a href="https://frankbase.com" target="_blank" rel="noopener" class="ecosystem-card-btn">
            <span>FrankBase</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
          <div class="hover-card-preview" style="width:230px">
            <div class="hover-card-title">FrankBase Hub</div>
            <p class="hover-card-desc">The parent ecosystem building zero-knowledge privacy tools &amp; web applications.</p>
          </div>
        </div>

        <!-- Developer Tools -->
        <div class="has-hover-card" style="width:100%">
          <a href="https://tools.frankpass.com" target="_blank" rel="noopener" class="ecosystem-card-btn">
            <span>Developer Tools</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
          <div class="hover-card-preview" style="width:230px">
            <div class="hover-card-title">tools.frankpass.com</div>
            <p class="hover-card-desc">Password strength analyzer, PBKDF2 benchmarks &amp; cryptographic hash validators.</p>
          </div>
        </div>

        <!-- EnglishVidya -->
        <div class="has-hover-card" style="width:100%">
          <a href="https://englishvidya.com" target="_blank" rel="noopener" class="ecosystem-card-btn">
            <span>EnglishVidya</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
          <div class="hover-card-preview" style="width:230px">
            <div class="hover-card-title">EnglishVidya.com</div>
            <p class="hover-card-desc">India's clean, zero-distraction English grammar, linguistics &amp; educational platform.</p>
          </div>
        </div>

        <!-- Digital Store -->
        <div class="has-hover-card" style="width:100%">
          <a href="https://store.frankbase.com" target="_blank" rel="noopener" class="ecosystem-card-btn">
            <span>Digital Store</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
          <div class="hover-card-preview" style="width:230px">
            <div class="hover-card-title">store.frankbase.com</div>
            <p class="hover-card-desc">Verified cybersecurity eBooks, password defense masterclasses &amp; digital assets.</p>
          </div>
        </div>

        <!-- Typing by FrankBase -->
        <div class="has-hover-card" style="width:100%">
          <a href="https://typing.frankbase.com" target="_blank" rel="noopener" class="ecosystem-card-btn">
            <span>Typing Engine</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
          <div class="hover-card-preview" style="width:230px">
            <div class="hover-card-title">typing.frankbase.com</div>
            <p class="hover-card-desc">Zero-load touch-typing academy, 42 master lessons &amp; government exam simulation engine.</p>
          </div>
        </div>

        <!-- Master Manikant -->
        <div class="has-hover-card" style="width:100%">
          <a href="https://mastermanikant.com" target="_blank" rel="noopener" class="ecosystem-card-btn">
            <span>Master Manikant</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
          <div class="hover-card-preview" style="width:230px">
            <div class="hover-card-title">MasterManikant.com</div>
            <p class="hover-card-desc">Founder's personal portal for mathematical research, memoirs &amp; system architecture.</p>
          </div>
        </div>

      </div>
    </div>

    <!-- Footer Bottom Copyright Bar -->
    <div class="footer-bottom">
      <!-- Line 1: Copyright left & A FrankBase project right on mobile, inline on desktop -->
      <div class="footer-bottom-copy">
        <span class="footer-copy-text">&copy; ${year} FrankPass.</span>
        <span class="footer-desktop-sep" aria-hidden="true">&middot;</span>
        <a href="https://frankbase.com" target="_blank" rel="noopener" class="footer-project-link">${isHindi ? 'फ्रैंकबेस का एक प्रोजेक्ट।' : 'A FrankBase project.'}</a>
      </div>

      <!-- Line 2: Engineered by Master Manikant Yadav (Strictly Centered) -->
      <div class="footer-author-wrap">
        <span>${isHindi ? 'आर्किटेक्ट:' : 'Engineered by'} <a href="https://mastermanikant.com" target="_blank" rel="noopener" class="footer-founder-link">${isHindi ? 'मास्टर मणिकान्त यादव' : 'Master Manikant Yadav'}</a></span>
      </div>

      <!-- Line 3: 4 Clean Legal & Resource Links in 1 Single Line -->
      <div class="footer-legal-links">
        <a href="/legal.html#privacy">${isHindi ? 'गोपनीयता नीति' : 'Privacy Policy'}</a>
        <span class="footer-copy-sep" aria-hidden="true">&middot;</span>
        <a href="/legal.html#terms">${isHindi ? 'सेवा की शर्तें' : 'Terms of Service'}</a>
        <span class="footer-copy-sep" aria-hidden="true">&middot;</span>
        <a href="${isHindi ? '/library-hindi.html' : '/library.html'}">${isHindi ? 'लाइब्रेरी' : 'Library'}</a>
        <span class="footer-copy-sep" aria-hidden="true">&middot;</span>
        <a href="https://mastermanikant.com/contact.html?ref=frankpass_footer" target="_blank" rel="noopener">${isHindi ? 'फीडबैक' : 'Feedback'}</a>
      </div>
    </div>

  </div>

    <!-- Mobile Bottom Navigation Dock Clearance Spacer -->
    <div class="mobile-bottom-dock-spacer" style="height:120px;width:100%;display:block;clear:both;" aria-hidden="true"></div>
  </footer>
    `;

    setupHeaderNav();
    syncThemeUI(document.documentElement.getAttribute('data-theme') || 'dark');
  }

  window.toggleFooterTab = function(id) {
    if (window.innerWidth > 768) return;
    const target = document.getElementById(id);
    if (!target) return;
    const isCurrentlyOpen = target.classList.contains('open');
    
    // Close all 3 tabs first (single-open accordion tab behavior)
    ['footer-col-tools', 'footer-col-learn', 'footer-col-products'].forEach(colId => {
      const col = document.getElementById(colId);
      if (col) {
        col.classList.remove('open');
        const btn = col.querySelector('.footer-col-header-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });

    // If it was not open, open it now! (If it was open, it stays closed)
    if (!isCurrentlyOpen) {
      target.classList.add('open');
      const btn = target.querySelector('.footer-col-header-btn');
      if (btn) btn.setAttribute('aria-expanded', 'true');

      // Auto-scroll so the newly opened menu card is 100% visible
      setTimeout(function() {
        const wrap = target.querySelector('.footer-col-links-wrap');
        if (wrap) {
          const rect = wrap.getBoundingClientRect();
          const dockBar = document.querySelector('.mobile-bottom-nav');
          const dockHeight = dockBar ? dockBar.offsetHeight : 64;
          const availableHeight = window.innerHeight - dockHeight;
          if (rect.bottom > availableHeight) {
            const scrollDistance = rect.bottom - availableHeight + 32;
            window.scrollBy({ top: scrollDistance, behavior: 'smooth' });
          }
        }
      }, 80);
    }
  };
  window.toggleFooterCol = window.toggleFooterTab;

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
        e.stopImmediatePropagation();
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

    // Ensure mobile menu drawer has a high-visibility theme toggle button
    if (mobileMenu && !mobileMenu.querySelector('#theme-toggle-mobile')) {
      const mobBtn = document.createElement('button');
      mobBtn.type = 'button';
      mobBtn.className = 'theme-toggle-btn mobile-theme-toggle-btn';
      mobBtn.id = 'theme-toggle-mobile';
      mobBtn.style.cssText = 'margin-top:0.85rem;width:100%;text-align:center;background:var(--card-glass-bg);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;gap:8px;padding:0.75rem 1rem;border-radius:10px;color:var(--text-primary);font-weight:700;cursor:pointer;';
      mobileMenu.appendChild(mobBtn);
      const curTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      syncThemeUI(curTheme);
    }
  }

  // Universal Header Navigation & Cascade Flyout Controller
  function setupHeaderNav() {
    const header = document.getElementById('site-header');
    if (header && !header._hasScrollListener) {
      header._hasScrollListener = true;
      window.addEventListener('scroll', function() {
        header.classList.toggle('scrolled', window.scrollY > 10);
      }, { passive: true });
    }

    // Keep header theme toggle accessible on both desktop and mobile
    const hamburger = document.getElementById('hamburger');
    const themeBtn = document.getElementById('theme-toggle');
    if (hamburger && themeBtn && themeBtn.parentElement && themeBtn.parentElement.classList.contains('header-nav')) {
      hamburger.parentElement.insertBefore(themeBtn, hamburger);
    }

    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(function(dropdown) {
      let closeTimer = null;
      dropdown.addEventListener('mouseenter', function() {
        if (closeTimer) clearTimeout(closeTimer);
        dropdowns.forEach(function(d) {
          if (d !== dropdown) d.classList.remove('is-open');
        });
        dropdown.classList.add('is-open');
      });

      dropdown.addEventListener('mouseleave', function() {
        closeTimer = setTimeout(function() {
          dropdown.classList.remove('is-open');
          dropdown.querySelectorAll('.has-flyout').forEach(function(f) { f.classList.remove('is-active'); });
        }, 280);
      });

      const trigger = dropdown.querySelector('.nav-dropdown-trigger');
      if (trigger && !trigger._hasClickListener) {
        trigger._hasClickListener = true;
        trigger.addEventListener('click', function(e) {
          e.stopPropagation();
          const isOpen = dropdown.classList.contains('is-open');
          dropdowns.forEach(function(d) { d.classList.remove('is-open'); });
          if (!isOpen) dropdown.classList.add('is-open');
        });
      }
    });

    function checkFlyoutBoundary(container) {
      const flyout = container.querySelector('.flyout-menu');
      if (!flyout) return;
      container.classList.remove('flyout-flip-left');
      const rect = flyout.getBoundingClientRect();
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      if (rect.right > viewportWidth - 14) {
        container.classList.add('flyout-flip-left');
      }
    }

    const flyoutContainers = document.querySelectorAll('.has-flyout');
    flyoutContainers.forEach(function(container) {
      let flyoutTimer = null;
      container.addEventListener('mouseenter', function() {
        if (flyoutTimer) clearTimeout(flyoutTimer);
        flyoutContainers.forEach(function(c) {
          if (c !== container) c.classList.remove('is-active');
        });
        container.classList.add('is-active');
        checkFlyoutBoundary(container);
      });

      container.addEventListener('mouseleave', function() {
        flyoutTimer = setTimeout(function() {
          container.classList.remove('is-active');
        }, 220);
      });

      const headerItem = container.querySelector('.flyout-header-item');
      if (headerItem && !headerItem._hasClickListener) {
        headerItem._hasClickListener = true;
        headerItem.addEventListener('click', function(e) {
          if (window.innerWidth < 992) {
            e.stopPropagation();
            const isActive = container.classList.contains('is-active');
            flyoutContainers.forEach(function(c) { c.classList.remove('is-active'); });
            if (!isActive) container.classList.add('is-active');
          }
        });
      }
    });

    const accTriggers = document.querySelectorAll('.mobile-acc-trigger');
    accTriggers.forEach(function(btn) {
      if (!btn._hasAccListener) {
        btn._hasAccListener = true;
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          const card = btn.closest('.mobile-accordion');
          if (!card) return;
          const wasOpen = card.classList.contains('is-open');
          document.querySelectorAll('.mobile-accordion').forEach(function(c) { c.classList.remove('is-open'); });
          if (!wasOpen) card.classList.add('is-open');
        });
      }
    });

    if (!document._headerNavClickListenerAttached) {
      document._headerNavClickListenerAttached = true;
      document.addEventListener('click', function() {
        dropdowns.forEach(function(d) { d.classList.remove('is-open'); });
        flyoutContainers.forEach(function(c) { c.classList.remove('is-active'); });
      });
    }
  }

  
  /* ── Universal Day/Night Theme Controller ── */
  const sunIco = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  const moonIco = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

  function syncThemeUI(theme) {
    const isLight = theme === 'light';
    document.querySelectorAll('.theme-toggle-btn, #theme-toggle, #theme-toggle-mobile').forEach(function(btn) {
      if (btn.classList.contains('mobile-theme-toggle-btn') || btn.id === 'theme-toggle-mobile') {
        const isHindi = document.documentElement.lang === 'hi' || window.location.pathname.includes('hindi');
        btn.innerHTML = (isLight ? moonIco : sunIco) + ' <span>' + (isLight ? (isHindi ? 'डार्क मोड' : 'Switch to Dark Mode') : (isHindi ? 'डे (लाइट) मोड' : 'Switch to Light Mode')) + '</span>';
      } else {
        btn.innerHTML = isLight ? moonIco : sunIco;
      }
      btn.setAttribute('aria-label', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
      btn.setAttribute('title', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    });
  }

  function handleThemeToggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const target = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', target);
    try {
      localStorage.setItem('fp_theme', target);
      localStorage.setItem('theme', target);
    } catch(e) {}
    syncThemeUI(target);
  }

  // Global window function for inline onclick handlers
  window.toggleTheme = handleThemeToggle;

  function initTheme() {
    let saved = 'dark';
    try {
      saved = localStorage.getItem('fp_theme') || localStorage.getItem('theme') || 'dark';
    } catch(e) {}
    document.documentElement.setAttribute('data-theme', saved);
    syncThemeUI(saved);

    // Global click listener via Event Delegation - Exactly Once Guarantee
    if (!document._themeListenerAttached) {
      document._themeListenerAttached = true;
      document.addEventListener('click', function(e) {
        const btn = e.target.closest('.theme-toggle-btn, #theme-toggle, #theme-toggle-mobile');
        if (btn) {
          e.preventDefault();
          e.stopPropagation();
          handleThemeToggle();
        }
      });
    }
  }

  /* ── Universal Web Push Notification Controller ── */
  window.togglePushNotifications = async function() {
    if (!('Notification' in window)) {
      if (typeof showToast === 'function') showToast('Notifications are not supported by your browser.', 'error');
      else alert('Notifications are not supported by your browser.');
      return;
    }
    if (Notification.permission === 'granted') {
      const isMuted = localStorage.getItem('fp_push_muted') === 'true';
      if (!isMuted) {
        localStorage.setItem('fp_push_muted', 'true');
        syncPushUI(false);
        if (typeof showToast === 'function') showToast('🔕 Notifications muted.');
      } else {
        localStorage.removeItem('fp_push_muted');
        syncPushUI(true);
        if (typeof showToast === 'function') showToast('🔔 Notifications active!', 'success');
      }
    } else {
      try {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          localStorage.removeItem('fp_push_muted');
          syncPushUI(true);
          if (typeof showToast === 'function') showToast('🔔 Notifications enabled for new security tools & articles!', 'success');
        } else {
          syncPushUI(false);
          if (typeof showToast === 'function') showToast('Notification permission denied or blocked.', 'info');
        }
      } catch (e) {
        syncPushUI(false);
      }
    }
  };

  function syncPushUI(active) {
    const btn = document.getElementById('footer-push-btn');
    const icon = document.getElementById('footer-push-icon');
    const label = document.getElementById('footer-push-label');
    if (!btn || !label || !icon) return;
    if (active) {
      icon.textContent = '🔔';
      label.textContent = 'Notifications Active';
      btn.style.borderColor = 'var(--success, #10b981)';
      btn.style.background = 'rgba(16, 185, 129, 0.12)';
    } else {
      icon.textContent = '🔕';
      label.textContent = 'Enable Updates Notification';
      btn.style.borderColor = 'rgba(139,92,246,0.3)';
      btn.style.background = 'rgba(139,92,246,0.12)';
    }
  }

  function ensureCountryDropdown() {
    if (document.getElementById('country-trigger') && typeof window.COUNTRY_LIST === 'undefined' && !window.__fp_country_dropdown_inited) {
      const s1 = document.createElement('script');
      s1.src = '/country-data.js?v=4.2.8';
      s1.onload = function() {
        if (!window.__fp_country_dropdown_inited) {
          const s2 = document.createElement('script');
          s2.src = '/country-dropdown.js?v=4.2.8';
          document.body.appendChild(s2);
        }
      };
      document.body.appendChild(s1);
    }
  }

  function registerGlobalServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        setTimeout(function () {
          navigator.serviceWorker.register('/service-worker.js?v=5.3.0').then(function(reg){reg.update();return reg;})
            .then(function (reg) {
              reg.addEventListener('updatefound', function () {
                const newWorker = reg.installing;
                if (newWorker) {
                  newWorker.addEventListener('statechange', function () {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                      // Silently active for next visit
                    }
                  });
                }
              });
            })
            .catch(function () {
              // Graceful silent fallback
            });
        }, 2500);
      });
    }
  }

  /* ── Universal PWA Install Controller ── */
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e;
    syncInstallButtons();
  });

  window.addEventListener('appinstalled', function() {
    deferredPrompt = null;
    try { localStorage.setItem('fp_pwa_installed', 'true'); } catch(e) {}
    syncInstallButtons();
    if (typeof showToast === 'function') showToast('FrankPass installed successfully!', 'success');
  });

  function isStandaloneMode() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  function syncInstallButtons() {
    const isInstalled = isStandaloneMode() || (localStorage.getItem('fp_pwa_installed') === 'true');
    document.querySelectorAll('.pwa-install-btn, #header-pwa-install-btn').forEach(function(btn) {
      if (isStandaloneMode()) {
        btn.style.display = 'none';
      } else if (isInstalled) {
        btn.innerHTML = '<span>📲</span> <span>Open in App</span>';
        btn.title = 'Open FrankPass App';
        btn.onclick = function() { window.location.href = '/'; };
      } else {
        btn.innerHTML = '<span>📲</span> <span>Install App</span>';
        btn.title = 'Install FrankPass for Offline Access';
        btn.onclick = async function() {
          if (deferredPrompt) {
            deferredPrompt.prompt();
            const choice = await deferredPrompt.userChoice;
            if (choice && choice.outcome === 'accepted') {
              try { localStorage.setItem('fp_pwa_installed', 'true'); } catch(e) {}
            }
            deferredPrompt = null;
          } else {
            window.location.href = '/install.html';
          }
        };
      }
    });
  }

  function initFooter() {
    initTheme();
    setupMobileMenu();
    setupHeaderNav();
    ensureCountryDropdown();
    buildFooter();
    setupVersionPopover();
    registerGlobalServiceWorker();
    syncInstallButtons();
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted' && localStorage.getItem('fp_push_muted') !== 'true') {
      syncPushUI(true);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooter);
  } else {
    initFooter();
  }
})();
