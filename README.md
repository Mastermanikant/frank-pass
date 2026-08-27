# 🛡️ FrankPass - Pure Deterministic & Stateless Password Generator

**Live Production Edge:** [frankpass.com](https://frankpass.com) &nbsp;|&nbsp; **Architect:** [Master Manikant Yadav](https://frankpass.com/founder-mastermanikant.html)

![100% Offline (PWA)](https://img.shields.io/badge/Status-100%25_Offline_Ready-success?style=flat-square) 
![Zero Database](https://img.shields.io/badge/Architecture-Zero_Database-blue?style=flat-square)
![Client-Side Cryptography](https://img.shields.io/badge/Security-Client--Side_Cryptography-red?style=flat-square)
![Stateless](https://img.shields.io/badge/Privacy-100%25_Stateless-brightgreen?style=flat-square)
![Version](https://img.shields.io/badge/Version-V3.3.6-purple?style=flat-square)
![License](https://img.shields.io/badge/License-Proprietary-orange?style=flat-square)

> *"A password that was never stored on a server can never be stolen in a data breach."*

---

## 🔍 Security by Transparency

FrankPass operates on pure cryptographic transparency: **Read the code.** 

Every single password generation calculation executes entirely on your device inside your browser's native memory using the standard `crypto.subtle` WebCrypto API. 

Turn off your Wi-Fi, disconnect your Ethernet, switch on Airplane Mode, and click Generate &mdash; FrankPass runs identically without sending a single byte across the internet.

---

## 💡 What is FrankPass?

FrankPass is a stateless cryptographic utility that replaces password storage with **deterministic mathematical derivation**. Instead of saving passwords in vulnerable cloud vaults (like LastPass or Bitwarden), FrankPass calculates your password on-demand from a memorable Master Secret Key and a Platform Identifier.

- 🔒 **Zero Server Database:** Zero user accounts, zero cloud vaults, zero honeypots.
- ⚡ **1,000,000 PBKDF2-HMAC-SHA512 Iterations:** Extreme computational cost making brute-force attacks mathematically infeasible.
- 🌐 **100% Stateless & Deterministic:** Same inputs always yield the identical high-entropy output across every device.
- 📱 **Installable Offline PWA:** Instant standalone app for Android, iOS, Windows, Mac, and Linux.
- 🌍 **28,500+ Platform Auto-Suggest:** Instant normalization for domains and apps worldwide.

---

## ⚙️ Mathematical Derivation Pipeline

```
[ Master Secret Key ] ─┐
                       ├─► [ Seed Normalizer ] ─► [ 1,000,000 PBKDF2-HMAC-SHA512 Rounds ] ─► [ 16-char High-Entropy Password ]
[ Platform Identifier ] ─┘
```

1. **Input Normalization:** Strips subdomains and lowercase protocols (`https://`, `www.`).
2. **Entropy Stretcher:** Passes combined seed through 1,000,000 iterations of `PBKDF2` keyed with `HMAC-SHA512`.
3. **Safe Charset Mapping:** Maps cryptographic bytes into 55 non-ambiguous alphanumeric and safe symbols (removing `l, I, O, 0, 1`).

---

## 📂 Project Structure

```
frank-pass/
├── index.html                           # Main generator & stateless UI
├── docs.html                            # Full technical security documentation
├── faq.html                             # 12 detailed security architecture FAQs
├── get-started.html                     # Step-by-step masterclass guide
├── limitations-and-advantages.html      # Honest technical analysis & tension comparison
├── limitations-and-advantages-hindi.html # Hindi version of limitations & strengths
├── install.html                         # PWA & standalone device install guide
├── pro.html                             # Browser extension & pro plans
├── products.html                        # Digital ecosystem hub
├── about-us.html / about-us-hindi.html  # Origin mission & ecosystem values
├── founder-mastermanikant.html          # Founder profile & authentic 25 Dec memoir
├── founder-mastermanikant-hindi.html    # Hindi founder profile
├── legal.html                           # Zero-data privacy policy & terms
├── blog/                                # Deep-dive security articles
├── frankpass-core.js                    # Cryptographic engine (WebCrypto)
├── platforms.js                         # 28,500+ platform normalization database
├── style.css                            # Dual-theme WCAG AA glass design system
├── llms.txt / llms-full.txt             # AI Engine Optimization (AEO) discovery
└── _redirects / _headers                # Cloudflare Pages edge routing & security headers
```

---

## 🌐 Ecosystem Links

- **Main Platform:** [frankpass.com](https://frankpass.com)
- **Developer Utilities:** [tools.frankpass.com](https://tools.frankpass.com)
- **Sister Ecosystem:** [frankbase.com](https://frankbase.com)
- **Language Portal:** [englishvidya.com](https://englishvidya.com)
- **Digital Store:** [store.frankbase.com](https://store.frankbase.com)
- **Founder Desk:** [mastermanikant.com](https://mastermanikant.com)

---

## 🛡️ License & Copyright

Designed & Engineered with 100% integrity by **Master Manikant Yadav**.  
All rights reserved. FrankBase & FrankPass Digital Ecosystem.
