const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');

const hindiFiles = new Set([
  'why-stateless-password-generation-is-the-future-hindi.html',
  'where-password-managers-fail-and-invisible-vault-hindi.html',
  'atm-upi-pin-security-guide-hindi.html',
  'frankpass-vs-cloud-password-vaults-hindi.html',
  'limitations-and-advantages-hindi.html',
  'library-hindi.html',
  'about-us-hindi.html',
  'founder-mastermanikant-hindi.html'
]);

const englishHeaderAndMobileHTML = `<!-- STICKY HEADER -->
<header class="site-header" id="site-header" role="banner">
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
              <a href="/why-stateless-password-generation-is-the-future.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">⚡</span>
                <span class="dropdown-title">Stateless Architecture</span>
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
              <a href="/where-password-managers-fail-and-invisible-vault.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">👁️</span>
                <span class="dropdown-title">Invisible Vault Defense</span>
              </a>
              <a href="/frankpass-vs-cloud-password-vaults.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">☁️</span>
                <span class="dropdown-title">Cloud Vault Vulnerabilities</span>
              </a>
              <a href="/what-makes-a-password-strong-and-passphrase-guide.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">🧮</span>
                <span class="dropdown-title">Password Science &amp; Math</span>
              </a>
              <a href="/atm-upi-pin-security-guide.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">🔢</span>
                <span class="dropdown-title">ATM &amp; UPI PIN Security</span>
              </a>
            </div>
          </div>

          <!-- Category 3: Trust & Founder -->
          <div class="has-flyout" id="flyout-trust-founder">
            <div class="flyout-header-item" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false">
              <div class="flyout-header-content">
                <span class="flyout-cat-icon">💡</span>
                <span class="flyout-cat-title">Trust &amp; Economics</span>
              </div>
              <span class="flyout-chevron">›</span>
            </div>
            <div class="flyout-menu" role="menu">
              <a href="/about-us.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">🏢</span>
                <span class="dropdown-title">About FrankPass</span>
              </a>
              <a href="/founder-mastermanikant.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">🎯</span>
                <span class="dropdown-title">Founder Master Manikant</span>
              </a>
              <a href="/how-frankpass-is-free-without-selling-data.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">⚖️</span>
                <span class="dropdown-title">Zero-Server Economics</span>
              </a>
              <a href="/sponsors.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">🌱</span>
                <span class="dropdown-title">Green Sponsors Hub</span>
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

    <!-- Mobile Hamburger Toggle Button -->
    <button class="hamburger-btn" id="hamburger" aria-label="Toggle navigation menu" aria-expanded="false" type="button">
      <span></span>
      <span></span>
      <span></span>
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
      <a href="/why-stateless-password-generation-is-the-future.html" class="mobile-acc-item">⚡ Stateless Architecture</a>
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
      <a href="/where-password-managers-fail-and-invisible-vault.html" class="mobile-acc-item">👁️ Invisible Vault Defense</a>
      <a href="/frankpass-vs-cloud-password-vaults.html" class="mobile-acc-item">☁️ Cloud Vault Vulnerabilities</a>
      <a href="/what-makes-a-password-strong-and-passphrase-guide.html" class="mobile-acc-item">🧮 Password Science &amp; Math</a>
      <a href="/atm-upi-pin-security-guide.html" class="mobile-acc-item">🔢 ATM &amp; UPI PIN Security</a>
    </div>
  </div>

  <!-- Mobile Accordion 3 -->
  <div class="mobile-accordion">
    <button class="mobile-acc-trigger" type="button" aria-expanded="false">
      <span>💡 Trust &amp; Economics</span>
      <span class="acc-chevron">▾</span>
    </button>
    <div class="mobile-acc-panel">
      <a href="/about-us.html" class="mobile-acc-item">🏢 About FrankPass</a>
      <a href="/founder-mastermanikant.html" class="mobile-acc-item">🎯 Founder Master Manikant</a>
      <a href="/how-frankpass-is-free-without-selling-data.html" class="mobile-acc-item">⚖️ Zero-Server Economics</a>
      <a href="/sponsors.html" class="mobile-acc-item">🌱 Green Sponsors Hub</a>
    </div>
  </div>

  <div class="mobile-section-label">🏢 Ecosystem &amp; Directory</div>
  <a href="/library.html" class="mobile-nav-link" style="color:var(--accent-light);font-weight:700;"><span>🏛️</span> Master Library &amp; Directory</a>
  <a href="/products.html" class="mobile-nav-link"><span>🌐</span> Products Hub</a>
  <a href="/founder-mastermanikant.html" class="mobile-nav-link"><span>👨‍💻</span> Founder (Master Manikant Yadav)</a>
  
  <a href="/pro.html" class="btn-primary" style="margin-top:1rem;text-align:center;background:linear-gradient(135deg,#8b5cf6,#7c3aed);display:block;padding:0.75rem 1rem;border-radius:10px;text-decoration:none;color:#fff;font-weight:700;">Get Pro 👑 &rarr;</a>
</nav>`;

const hindiHeaderAndMobileHTML = `<!-- STICKY HEADER -->
<header class="site-header" id="site-header" role="banner">
  <div class="header-inner">
    
    <!-- Official Brand Logo -->
    <a href="/" class="header-logo" aria-label="फ्रैंकपास होम">
      <img src="/icons/logo-key-64.webp" onerror="this.src='/icons/logo-key-64.png'" alt="FrankPass 3D Key Logo" width="32" height="32" class="header-brand-icon" fetchpriority="high" decoding="async">
      <span class="logo-text"><span>Frank</span>Pass</span>
    </a>

    <!-- Country Dropdown -->
    <div class="header-country custom-country-dropdown" aria-label="देश चुनें">
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
    <nav class="header-nav" role="navigation" aria-label="मुख्य नेविगेशन">
      
      <!-- 1. Generators Dropdown -->
      <div class="nav-dropdown" id="dropdown-generators">
        <button class="nav-dropdown-trigger" aria-haspopup="true" aria-expanded="false" type="button" id="gen-trigger">
          जेनरेटर्स <span class="dropdown-chevron">▾</span>
        </button>
        <div class="nav-dropdown-menu" role="menu" aria-labelledby="gen-trigger" style="min-width:230px;">
          <a href="/" class="dropdown-item" role="menuitem">
            <span class="dropdown-icon">⚡</span>
            <span class="dropdown-title">स्टेटलेस जेनरेटर</span>
          </a>
          <a href="/random-password-generator.html" class="dropdown-item" role="menuitem">
            <span class="dropdown-icon">🎲</span>
            <span class="dropdown-title">रैंडम जेनरेटर</span>
          </a>
          <a href="/pin.html" class="dropdown-item" role="menuitem">
            <span class="dropdown-icon">🔢</span>
            <span class="dropdown-title">पिन (PIN) जेनरेटर</span>
          </a>
          <div class="dropdown-divider"></div>
          <a href="/comparison-between-frankpass-all-generators-deterministic-random-pin.html" class="dropdown-item" role="menuitem">
            <span class="dropdown-icon">⚖️</span>
            <span class="dropdown-title">सभी टूल्स की तुलना</span>
          </a>
        </div>
      </div>

      <!-- 2. Resources Dropdown -->
      <div class="nav-dropdown" id="dropdown-resources">
        <button class="nav-dropdown-trigger" aria-haspopup="true" aria-expanded="false" type="button" id="res-trigger">
          संसाधन <span class="dropdown-chevron">▾</span>
        </button>
        <div class="nav-dropdown-menu" role="menu" aria-labelledby="res-trigger" style="min-width:280px;">
          
          <!-- Category 1: Core Guides & Specs -->
          <div class="has-flyout" id="flyout-core-guides">
            <div class="flyout-header-item" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false">
              <div class="flyout-header-content">
                <span class="flyout-cat-icon">📚</span>
                <span class="flyout-cat-title">मुख्य गाइड्स व विवरण</span>
              </div>
              <span class="flyout-chevron">›</span>
            </div>
            <div class="flyout-menu" role="menu">
              <a href="/secret-key-guide.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">🔑</span>
                <span class="dropdown-title">सीक्रेट की गाइड</span>
              </a>
              <a href="/frankpass-vs-cloud-password-vaults-hindi.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">⚙️</span>
                <span class="dropdown-title">फ्रैंकपास कार्यविधि</span>
              </a>
              <a href="/why-stateless-password-generation-is-the-future-hindi.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">⚡</span>
                <span class="dropdown-title">स्टेटलेस पासवर्ड क्रांति</span>
              </a>
              <a href="/faq.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">❓</span>
                <span class="dropdown-title">सुरक्षा एफएक्यू (FAQ)</span>
              </a>
              <a href="/whitepaper.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">📄</span>
                <span class="dropdown-title">क्रिप्टोग्राफिक स्पेक्स</span>
              </a>
              <a href="/limitations-and-advantages-hindi.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">⚖️</span>
                <span class="dropdown-title">सीमाएं एवं फायदे</span>
              </a>
            </div>
          </div>

          <!-- Category 2: Cyber Threat Defense -->
          <div class="has-flyout" id="flyout-threat-defense">
            <div class="flyout-header-item" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false">
              <div class="flyout-header-content">
                <span class="flyout-cat-icon">🛡️</span>
                <span class="flyout-cat-title">साइबर सुरक्षा व डिफेंस</span>
              </div>
              <span class="flyout-chevron">›</span>
            </div>
            <div class="flyout-menu" role="menu">
              <a href="/where-password-managers-fail-and-invisible-vault-hindi.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">👁️</span>
                <span class="dropdown-title">अदृश्य वॉल्ट सुरक्षा</span>
              </a>
              <a href="/frankpass-vs-cloud-password-vaults-hindi.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">☁️</span>
                <span class="dropdown-title">क्लाउड वॉल्ट कमजोरियां</span>
              </a>
              <a href="/what-makes-a-password-strong-and-passphrase-guide.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">🧮</span>
                <span class="dropdown-title">पासवर्ड गणित व एंट्रॉपी</span>
              </a>
              <a href="/atm-upi-pin-security-guide-hindi.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">🔢</span>
                <span class="dropdown-title">एटीएम व यूपीआई पिन सुरक्षा</span>
              </a>
            </div>
          </div>

          <!-- Category 3: Trust & Founder -->
          <div class="has-flyout" id="flyout-trust-founder">
            <div class="flyout-header-item" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false">
              <div class="flyout-header-content">
                <span class="flyout-cat-icon">💡</span>
                <span class="flyout-cat-title">विश्वसनीयता व संस्थापक</span>
              </div>
              <span class="flyout-chevron">›</span>
            </div>
            <div class="flyout-menu" role="menu">
              <a href="/about-us-hindi.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">🏢</span>
                <span class="dropdown-title">फ्रैंकपास का परिचय</span>
              </a>
              <a href="/founder-mastermanikant-hindi.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">🎯</span>
                <span class="dropdown-title">संस्थापक मास्टर मणिकान्त</span>
              </a>
              <a href="/how-frankpass-is-free-without-selling-data.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">⚖️</span>
                <span class="dropdown-title">शून्य सर्वर अर्थशास्त्र</span>
              </a>
              <a href="/sponsors.html" class="dropdown-item" role="menuitem">
                <span class="dropdown-icon">🌱</span>
                <span class="dropdown-title">ग्रीन स्पॉन्सर हब</span>
              </a>
            </div>
          </div>

          <div class="dropdown-divider"></div>
          <a href="/library-hindi.html" class="dropdown-item" role="menuitem" style="color:var(--accent-light);font-weight:700;">
            <span class="dropdown-icon">🏛️</span>
            <span class="dropdown-title" style="color:var(--accent-light);">मास्टर लाइब्रेरी डायरेक्टरी &rarr;</span>
          </a>

        </div>
      </div>

      <!-- 3. All Products / Ecosystem Hub -->
      <a href="/products.html" class="nav-link">प्रोडक्ट्स</a>

      <!-- 4. Master Library Link -->
      <a href="/library-hindi.html" class="nav-link" style="color:var(--accent-light);font-weight:600;">लाइब्रेरी</a>

      <!-- 5. Founder Link -->
      <a href="/founder-mastermanikant-hindi.html" class="nav-link">संस्थापक</a>

      <!-- 6. Direct High-Impact Pro CTA -->
      <a href="/pro.html" class="btn-pro" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:#fff;font-weight:700;padding:0.45rem 1rem;border-radius:10px;box-shadow:0 4px 14px rgba(139,92,246,0.35);text-decoration:none;display:inline-flex;align-items:center;gap:6px;transition:all 0.2s;">
        <span>Get Pro</span> <span style="font-size:0.85rem;">👑</span> &rarr;
      </a>
      
      <!-- 7. Theme Toggle -->
      <button class="theme-toggle-btn" id="theme-toggle" type="button" aria-label="थीम बदलें" title="थीम बदलें">
        <svg id="theme-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      </button>

    </nav>

    <!-- Mobile Hamburger Toggle Button -->
    <button class="hamburger-btn" id="hamburger" aria-label="नेविगेशन मेनू खोलें" aria-expanded="false" type="button">
      <span></span>
      <span></span>
      <span></span>
    </button>

  </div>
</header>

<!-- Mobile Navigation Drawer -->
<nav class="mobile-menu" id="mobile-menu" aria-label="मोबाइल नेविगेशन">
  <div class="mobile-section-label">⚡ जेनरेटर्स</div>
  <a href="/" class="mobile-nav-link"><span>⚡</span> स्टेटलेस जेनरेटर</a>
  <a href="/random-password-generator.html" class="mobile-nav-link"><span>🎲</span> रैंडम जेनरेटर</a>
  <a href="/pin.html" class="mobile-nav-link"><span>🔢</span> पिन (PIN) जेनरेटर</a>
  <a href="/comparison-between-frankpass-all-generators-deterministic-random-pin.html" class="mobile-nav-link"><span>⚖️</span> सभी टूल्स की तुलना</a>
  
  <div class="mobile-section-label">📚 संसाधन एवं गाइड्स</div>
  
  <!-- Mobile Accordion 1 -->
  <div class="mobile-accordion">
    <button class="mobile-acc-trigger" type="button" aria-expanded="false">
      <span>📚 मुख्य गाइड्स व विवरण</span>
      <span class="acc-chevron">▾</span>
    </button>
    <div class="mobile-acc-panel">
      <a href="/secret-key-guide.html" class="mobile-acc-item">🔑 सीक्रेट की गाइड</a>
      <a href="/frankpass-vs-cloud-password-vaults-hindi.html" class="mobile-acc-item">⚙️ फ्रैंकपास कार्यविधि</a>
      <a href="/why-stateless-password-generation-is-the-future-hindi.html" class="mobile-acc-item">⚡ स्टेटलेस पासवर्ड क्रांति</a>
      <a href="/faq.html" class="mobile-acc-item">❓ सुरक्षा एफएक्यू (FAQ)</a>
      <a href="/whitepaper.html" class="mobile-acc-item">📄 क्रिप्टोग्राफिक स्पेक्स</a>
      <a href="/limitations-and-advantages-hindi.html" class="mobile-acc-item">⚖️ सीमाएं एवं फायदे</a>
    </div>
  </div>

  <!-- Mobile Accordion 2 -->
  <div class="mobile-accordion">
    <button class="mobile-acc-trigger" type="button" aria-expanded="false">
      <span>🛡️ साइबर सुरक्षा व डिफेंस</span>
      <span class="acc-chevron">▾</span>
    </button>
    <div class="mobile-acc-panel">
      <a href="/where-password-managers-fail-and-invisible-vault-hindi.html" class="mobile-acc-item">👁️ अदृश्य वॉल्ट सुरक्षा</a>
      <a href="/frankpass-vs-cloud-password-vaults-hindi.html" class="mobile-acc-item">☁️ क्लाउड वॉल्ट कमजोरियां</a>
      <a href="/what-makes-a-password-strong-and-passphrase-guide.html" class="mobile-acc-item">🧮 पासवर्ड गणित व एंट्रॉपी</a>
      <a href="/atm-upi-pin-security-guide-hindi.html" class="mobile-acc-item">🔢 एटीएम व यूपीआई पिन सुरक्षा</a>
    </div>
  </div>

  <!-- Mobile Accordion 3 -->
  <div class="mobile-accordion">
    <button class="mobile-acc-trigger" type="button" aria-expanded="false">
      <span>💡 विश्वसनीयता व संस्थापक</span>
      <span class="acc-chevron">▾</span>
    </button>
    <div class="mobile-acc-panel">
      <a href="/about-us-hindi.html" class="mobile-acc-item">🏢 फ्रैंकपास का परिचय</a>
      <a href="/founder-mastermanikant-hindi.html" class="mobile-acc-item">🎯 संस्थापक मास्टर मणिकान्त</a>
      <a href="/how-frankpass-is-free-without-selling-data.html" class="mobile-acc-item">⚖️ शून्य सर्वर अर्थशास्त्र</a>
      <a href="/sponsors.html" class="mobile-acc-item">🌱 ग्रीन स्पॉन्सर हब</a>
    </div>
  </div>

  <div class="mobile-section-label">🏢 इकोसिस्टम व डायरेक्टरी</div>
  <a href="/library-hindi.html" class="mobile-nav-link" style="color:var(--accent-light);font-weight:700;"><span>🏛️</span> मास्टर लाइब्रेरी डायरेक्टरी</a>
  <a href="/products.html" class="mobile-nav-link"><span>🌐</span> प्रोडक्ट्स हब</a>
  <a href="/founder-mastermanikant-hindi.html" class="mobile-nav-link"><span>👨‍💻</span> संस्थापक (मास्टर मणिकान्त यादव)</a>
  
  <a href="/pro.html" class="btn-primary" style="margin-top:1rem;text-align:center;background:linear-gradient(135deg,#8b5cf6,#7c3aed);display:block;padding:0.75rem 1rem;border-radius:10px;text-decoration:none;color:#fff;font-weight:700;">Get Pro 👑 &rarr;</a>
</nav>`;

const allFiles = fs.readdirSync(baseDir).filter(f => f.endsWith('.html'));

const headerPattern = /(?:<!--\s*STICKY HEADER\s*-->\s*)?<header\s+class=["']site-header["'][\s\S]*?<\/header>\s*(?:<!--[\s\S]*?-->\s*)?(?:<nav\s+class=["']mobile-menu["'][\s\S]*?<\/nav>)?/i;

let modifiedCount = 0;

for (const file of allFiles) {
  const filePath = path.join(baseDir, file);
  let html = fs.readFileSync(filePath, 'utf8');

  const isHindi = hindiFiles.has(file);
  const replacement = isHindi ? hindiHeaderAndMobileHTML : englishHeaderAndMobileHTML;

  if (headerPattern.test(html)) {
    html = html.replace(headerPattern, replacement);
  } else {
    console.warn(`[SKIP] No header pattern matched in ${file}`);
  }

  // Check and fix any leftover blog.html links in body text if any
  html = html.replace(/href=["']\/blog\.html["']/g, 'href="/library.html"');
  html = html.replace(/href=["']\/blog\/why-stateless-password-generation-is-the-future\.html["']/g, 'href="/why-stateless-password-generation-is-the-future.html"');
  html = html.replace(/href=["']\/blog\/why-stateless-password-generation-is-the-future-hindi\.html["']/g, 'href="/why-stateless-password-generation-is-the-future-hindi.html"');
  html = html.replace(/href=["']\/blog\/where-password-managers-fail-keyloggers-clipboard-and-the-invisible-vault\.html["']/g, 'href="/where-password-managers-fail-and-invisible-vault.html"');
  html = html.replace(/href=["']\/blog\/where-password-managers-fail-keyloggers-clipboard-and-the-invisible-vault-hindi\.html["']/g, 'href="/where-password-managers-fail-and-invisible-vault-hindi.html"');
  html = html.replace(/href=["']\/blog\/what-makes-a-password-truly-strong-and-safe\.html["']/g, 'href="/what-makes-a-password-strong-and-passphrase-guide.html"');
  html = html.replace(/href=["']\/blog\/natural-language-passphrases-and-mmy-normalization\.html["']/g, 'href="/what-makes-a-password-strong-and-passphrase-guide.html"');
  html = html.replace(/href=["']\/blog\/why-no-forgot-password-button-is-our-greatest-strength\.html["']/g, 'href="/why-stateless-password-generation-is-the-future.html"');
  html = html.replace(/href=["']\/blog\/why-i-built-frankpass-the-december-25-story\.html["']/g, 'href="/founder-mastermanikant.html"');
  html = html.replace(/href=["']\/blog\/frankpass-vs-traditional-cloud-password-vaults\.html["']/g, 'href="/frankpass-vs-cloud-password-vaults.html"');
  html = html.replace(/href=["']\/blog\/the-no-free-lunch-paradigm-and-empowering-freemium\.html["']/g, 'href="/how-frankpass-is-free-without-selling-data.html"');
  html = html.replace(/href=["']\/blog\/?["']/g, 'href="/library.html"');

  // Rule 32 check: replace em-dashes
  html = html.replace(/—/g, ' - ');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`[UPDATED] ${file}`);
  modifiedCount++;
}

console.log(`\nUpdated all ${modifiedCount} HTML files successfully.`);
