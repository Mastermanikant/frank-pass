const fs = require('fs');
const path = require('path');

const targetFiles = [
  'index.html',
  'pin.html',
  'random-password-generator.html',
  'comparison-between-frankpass-all-generators-deterministic-random-pin.html',
  'get-started.html',
  'secret-key-guide.html',
  'install.html',
  'docs.html',
  'whitepaper.html',
  'frankpass-vs-cloud-password-vaults.html',
  'frankpass-vs-cloud-password-vaults-hindi.html',
  'limitations-and-advantages.html',
  'limitations-and-advantages-hindi.html',
  'faq.html',
  'about-us.html',
  'about-us-hindi.html',
  'founder-mastermanikant.html',
  'founder-mastermanikant-hindi.html',
  'products.html',
  'pro.html',
  'sponsors.html',
  'legal.html',
  'library.html',
  'library-hindi.html',
  'blog.html',
  'blog/why-i-built-frankpass-the-december-25-story.html',
  'blog/why-no-forgot-password-button-is-our-greatest-strength.html',
  'blog/why-stateless-password-generation-is-the-future.html',
  'blog/why-stateless-password-generation-is-the-future-hindi.html',
  'blog/where-password-managers-fail-keyloggers-clipboard-and-the-invisible-vault.html',
  'blog/where-password-managers-fail-keyloggers-clipboard-and-the-invisible-vault-hindi.html',
  'blog/what-makes-a-password-truly-strong-and-safe.html',
  'blog/the-no-free-lunch-paradigm-and-empowering-freemium.html',
  'blog/natural-language-passphrases-and-mmy-normalization.html'
];

const unifiedHeaderHTML = `<header class="site-header" id="site-header" role="banner">
  <div class="header-inner">
    
    <!-- Official Brand Logo -->
    <a href="/" class="header-logo" aria-label="FrankPass Home">
      <img src="/icons/logo-key-64.webp" onerror="this.src='/icons/logo-key-64.png'" alt="FrankPass 3D Key Logo" width="32" height="32" class="header-brand-icon" fetchpriority="high" decoding="async">
      <span class="logo-text"><span>Frank</span>Pass</span>
    </a>

    <!-- Country Dropdown -->
    <div class="header-country custom-country-dropdown" aria-label="Select your country">
      <button id="country-trigger" aria-haspopup="listbox" aria-expanded="false" aria-label="Country selector">
        <img id="country-flag-img" src="/flags/in.png" onerror="this.src='https://flagcdn.com/w40/in.png'" alt="India" width="20" height="15" style="display:inline-block;vertical-align:middle;border-radius:2px;" loading="lazy" decoding="async">
        <span id="country-display-name">India</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div id="country-dropdown-panel" role="listbox" aria-label="Country list">
        <input id="country-search-input" type="search" placeholder="Search country..." autocomplete="off" aria-label="Search for a country">
        <div id="country-list-scroll"></div>
      </div>
    </div>
    <input type="hidden" id="region" value="India (IN)">

    <!-- Desktop Nav -->
    <nav class="header-nav" role="navigation" aria-label="Main navigation">
      
      <!-- 1. Generators Dropdown -->
      <div class="nav-dropdown" id="dropdown-generators">
        <button class="nav-dropdown-trigger" aria-haspopup="true" aria-expanded="false" type="button" id="gen-trigger">
          Generators <span class="dropdown-chevron">▾</span>
        </button>
        <div class="nav-dropdown-menu" role="menu" aria-labelledby="gen-trigger" style="min-width:230px;">
          <a href="/" class="dropdown-item" role="menuitem">
            <span class="dropdown-icon">⚡</span>
            <span class="dropdown-title">Stateless Generator</span>
          </a>
          <a href="/random-password-generator.html" class="dropdown-item" role="menuitem">
            <span class="dropdown-icon">🎲</span>
            <span class="dropdown-title">Random Generator</span>
          </a>
          <a href="/pin.html" class="dropdown-item" role="menuitem">
            <span class="dropdown-icon">🔢</span>
            <span class="dropdown-title">PIN Generator</span>
          </a>
          <div class="dropdown-divider"></div>
          <a href="/comparison-between-frankpass-all-generators-deterministic-random-pin.html" class="dropdown-item" role="menuitem">
            <span class="dropdown-icon">⚖️</span>
            <span class="dropdown-title">Compare All Tools</span>
          </a>
        </div>
      </div>

      <!-- 2. Resources Dropdown -->
      <div class="nav-dropdown" id="dropdown-resources">
        <button class="nav-dropdown-trigger" aria-haspopup="true" aria-expanded="false" type="button" id="res-trigger">
          Resources <span class="dropdown-chevron">▾</span>
        </button>
        <div class="nav-dropdown-menu" role="menu" aria-labelledby="res-trigger" style="min-width:280px;">
          
          <!-- Category 1: Core Guides & Specs -->
          <div class="has-flyout" id="flyout-core-guides">
            <div class="flyout-header-item" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false">
              <div class="flyout-header-content">
                <span class="flyout-cat-icon">📚</span>
                <span class="flyout-cat-title">Core Guides &amp; Specs</span>
              </div>
              <span class="flyout-chevron">›</span>
            </div>
            <div class="flyout-menu" role="menu">
              <a href="/secret-key-guide.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">🔑</span>
                <span class="dropdown-title">Secret Key Guide</span>
              </a>
              <a href="/frankpass-vs-cloud-password-vaults.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">⚙️</span>
                <span class="dropdown-title">How FrankPass Works</span>
              </a>
              <a href="/faq.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">❓</span>
                <span class="dropdown-title">Security FAQ</span>
              </a>
              <a href="/whitepaper.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">📄</span>
                <span class="dropdown-title">Cryptographic Specs</span>
              </a>
              <a href="/limitations-and-advantages.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">⚖️</span>
                <span class="dropdown-title">Limitations &amp; Advantages</span>
              </a>
            </div>
          </div>

          <!-- Category 2: Cyber Threat Defense -->
          <div class="has-flyout" id="flyout-threat-defense">
            <div class="flyout-header-item" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false">
              <div class="flyout-header-content">
                <span class="flyout-cat-icon">🛡️</span>
                <span class="flyout-cat-title">Cyber Threat Defense</span>
              </div>
              <span class="flyout-chevron">›</span>
            </div>
            <div class="flyout-menu" role="menu">
              <a href="/blog/where-password-managers-fail-keyloggers-clipboard-and-the-invisible-vault.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">👁️</span>
                <span class="dropdown-title">Invisible Vault Architecture</span>
              </a>
              <a href="/frankpass-vs-cloud-password-vaults.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">☁️</span>
                <span class="dropdown-title">Cloud Vault Vulnerabilities</span>
              </a>
              <a href="/blog/why-no-forgot-password-button-is-our-greatest-strength.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">🚫</span>
                <span class="dropdown-title">No 'Forgot Password' Strength</span>
              </a>
            </div>
          </div>

          <!-- Category 3: Password Science & Math -->
          <div class="has-flyout" id="flyout-science-math">
            <div class="flyout-header-item" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false">
              <div class="flyout-header-content">
                <span class="flyout-cat-icon">🔬</span>
                <span class="flyout-cat-title">Password Science &amp; Math</span>
              </div>
              <span class="flyout-chevron">›</span>
            </div>
            <div class="flyout-menu" role="menu">
              <a href="/blog/what-makes-a-password-truly-strong-and-safe.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">🧮</span>
                <span class="dropdown-title">What Makes Passwords Strong</span>
              </a>
              <a href="/blog/why-stateless-password-generation-is-the-future.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">⚡</span>
                <span class="dropdown-title">Stateless Generation Future</span>
              </a>
              <a href="/blog/natural-language-passphrases-and-mmy-normalization.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">📝</span>
                <span class="dropdown-title">Passphrases &amp; Normalization</span>
              </a>
            </div>
          </div>

          <!-- Category 4: Founder Story & Vision -->
          <div class="has-flyout" id="flyout-founder-story">
            <div class="flyout-header-item" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false">
              <div class="flyout-header-content">
                <span class="flyout-cat-icon">💡</span>
                <span class="flyout-cat-title">Founder Story &amp; Vision</span>
              </div>
              <span class="flyout-chevron">›</span>
            </div>
            <div class="flyout-menu" role="menu">
              <a href="/blog/why-i-built-frankpass-the-december-25-story.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">🎯</span>
                <span class="dropdown-title">Why I Built FrankPass</span>
              </a>
              <a href="/blog/the-no-free-lunch-paradigm-and-empowering-freemium.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">⚖️</span>
                <span class="dropdown-title">The No-Free-Lunch Paradigm</span>
              </a>
              <div class="dropdown-divider"></div>
              <a href="/blog.html" class="dropdown-item" role="menuitem" style="color:var(--accent-light);font-weight:700;">
                <span class="dropdown-icon">📖</span>
                <span class="dropdown-title" style="color:var(--accent-light);">All Blog Articles Hub &rarr;</span>
              </a>
            </div>
          </div>

          <div class="dropdown-divider"></div>
          <a href="/library.html" class="dropdown-item" role="menuitem" style="color:var(--accent-light);font-weight:700;">
            <span class="dropdown-icon">🏛️</span>
            <span class="dropdown-title" style="color:var(--accent-light);">Master Library &amp; Directory &rarr;</span>
          </a>

        </div>
      </div>

      <!-- 3. All Products / Ecosystem Hub -->
      <a href="/products.html" class="nav-link">Products</a>

      <!-- 4. Master Library Link -->
      <a href="/library.html" class="nav-link" style="color:var(--accent-light);font-weight:600;">Library</a>

      <!-- 5. Founder Link -->
      <a href="/founder-mastermanikant.html" class="nav-link">Founder</a>

      <!-- 6. Direct High-Impact Pro CTA -->
      <a href="/pro.html" class="btn-pro" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:#fff;font-weight:700;padding:0.45rem 1rem;border-radius:10px;box-shadow:0 4px 14px rgba(139,92,246,0.35);text-decoration:none;display:inline-flex;align-items:center;gap:6px;transition:all 0.2s;">
        <span>Get Pro</span> <span style="font-size:0.85rem;">👑</span> &rarr;
      </a>
      
      <!-- 7. Theme Toggle -->
      <button class="theme-toggle-btn" id="theme-toggle" type="button" aria-label="Toggle light and dark mode" title="Toggle theme">
        <svg id="theme-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      </button>

    </nav>

    <!-- Hamburger Button for Mobile View -->
    <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false" aria-controls="mobile-menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>

<!-- Mobile Navigation Drawer -->
<nav class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation">
  <div class="mobile-section-label">⚡ Generators</div>
  <a href="/" class="mobile-nav-link"><span>⚡</span> Stateless Generator</a>
  <a href="/random-password-generator.html" class="mobile-nav-link"><span>🎲</span> Random Generator</a>
  <a href="/pin.html" class="mobile-nav-link"><span>🔢</span> PIN Generator</a>
  <a href="/comparison-between-frankpass-all-generators-deterministic-random-pin.html" class="mobile-nav-link"><span>⚖️</span> Compare All Tools</a>
  
  <div class="mobile-section-label">📚 Resources &amp; Guides</div>
  
  <!-- Mobile Accordion 1 -->
  <div class="mobile-accordion">
    <button class="mobile-acc-trigger" type="button" aria-expanded="false">
      <span>📚 Core Guides &amp; Specs</span>
      <span class="acc-chevron">▾</span>
    </button>
    <div class="mobile-acc-panel">
      <a href="/secret-key-guide.html" class="mobile-acc-item">🔑 Secret Key Guide</a>
      <a href="/frankpass-vs-cloud-password-vaults.html" class="mobile-acc-item">⚙️ How FrankPass Works</a>
      <a href="/faq.html" class="mobile-acc-item">❓ Security FAQ</a>
      <a href="/whitepaper.html" class="mobile-acc-item">📄 Cryptographic Specs</a>
      <a href="/limitations-and-advantages.html" class="mobile-acc-item">⚖️ Limitations &amp; Advantages</a>
    </div>
  </div>

  <!-- Mobile Accordion 2 -->
  <div class="mobile-accordion">
    <button class="mobile-acc-trigger" type="button" aria-expanded="false">
      <span>🛡️ Cyber Threat Defense</span>
      <span class="acc-chevron">▾</span>
    </button>
    <div class="mobile-acc-panel">
      <a href="/blog/where-password-managers-fail-keyloggers-clipboard-and-the-invisible-vault.html" class="mobile-acc-item">👁️ Invisible Vault Architecture</a>
      <a href="/frankpass-vs-cloud-password-vaults.html" class="mobile-acc-item">☁️ Cloud Vault Vulnerabilities</a>
      <a href="/blog/why-no-forgot-password-button-is-our-greatest-strength.html" class="mobile-acc-item">🚫 No 'Forgot Password' Strength</a>
    </div>
  </div>

  <!-- Mobile Accordion 3 -->
  <div class="mobile-accordion">
    <button class="mobile-acc-trigger" type="button" aria-expanded="false">
      <span>🔬 Password Science &amp; Math</span>
      <span class="acc-chevron">▾</span>
    </button>
    <div class="mobile-acc-panel">
      <a href="/blog/what-makes-a-password-truly-strong-and-safe.html" class="mobile-acc-item">🧮 What Makes Passwords Strong</a>
      <a href="/blog/why-stateless-password-generation-is-the-future.html" class="mobile-acc-item">⚡ Stateless Generation Future</a>
      <a href="/blog/natural-language-passphrases-and-mmy-normalization.html" class="mobile-acc-item">📝 Passphrases &amp; Normalization</a>
    </div>
  </div>

  <!-- Mobile Accordion 4 -->
  <div class="mobile-accordion">
    <button class="mobile-acc-trigger" type="button" aria-expanded="false">
      <span>💡 Founder Story &amp; Vision</span>
      <span class="acc-chevron">▾</span>
    </button>
    <div class="mobile-acc-panel">
      <a href="/blog/why-i-built-frankpass-the-december-25-story.html" class="mobile-acc-item">🎯 Why I Built FrankPass</a>
      <a href="/blog/the-no-free-lunch-paradigm-and-empowering-freemium.html" class="mobile-acc-item">⚖️ The No-Free-Lunch Paradigm</a>
      <a href="/blog.html" class="mobile-acc-item" style="color:var(--accent-light);font-weight:700;">📖 All Blog Articles Hub &rarr;</a>
    </div>
  </div>

  <div class="mobile-section-label">🏢 Ecosystem &amp; Directory</div>
  <a href="/library.html" class="mobile-nav-link" style="color:var(--accent-light);font-weight:700;"><span>🏛️</span> Master Library &amp; Directory</a>
  <a href="/products.html" class="mobile-nav-link"><span>🌐</span> Products Hub</a>
  <a href="/founder-mastermanikant.html" class="mobile-nav-link"><span>👨‍💻</span> Founder (Master Manikant Yadav)</a>
  
  <a href="/pro.html" class="btn-primary" style="margin-top:1rem;text-align:center;background:linear-gradient(135deg,#8b5cf6,#7c3aed);display:block;padding:0.75rem 1rem;border-radius:10px;text-decoration:none;color:#fff;font-weight:700;">Get Pro 👑 &rarr;</a>
</nav>`;

const headerPattern = /<header\s+class=["']site-header["'][\s\S]*?<\/header>\s*(?:<!--[\s\S]*?-->\s*)?(?:<nav\s+class=["']mobile-menu["'][\s\S]*?<\/nav>)?/i;

let updatedCount = 0;

targetFiles.forEach(fileRel => {
  const filePath = path.join(__dirname, '..', fileRel);
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', fileRel);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  if (!headerPattern.test(content)) {
    console.warn('Pattern did not match for:', fileRel);
    return;
  }

  content = content.replace(headerPattern, unifiedHeaderHTML);

  // Ensure footer.js is included if not present
  if (!content.includes('footer.js')) {
    content = content.replace('</body>', '<div id="site-footer"></div>\n<script src="/footer.js?v=3.8.9"></script>\n</body>');
  } else if (!content.includes('id="site-footer"')) {
    content = content.replace('<script src="/footer.js', '<div id="site-footer"></div>\n<script src="/footer.js');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[UPDATED] ${fileRel}`);
  updatedCount++;
});

console.log(`\nSuccessfully updated ${updatedCount} / ${targetFiles.length} files with Unified Header & Mobile Drawer.`);
