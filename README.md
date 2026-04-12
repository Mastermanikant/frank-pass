# 🛡️ FrankPass — The #1 Stateless Password Generator

**Live at:** [frankpass.com](https://frankpass.com) &nbsp;|&nbsp; **By:** [Master Manikant Yadav](https://frankpass.com/meet-the-founder-MasterManikant.html)

![100% Offline (PWA)](https://img.shields.io/badge/Status-100%25_Offline_Ready-success?style=flat-square) 
![Zero Database](https://img.shields.io/badge/Architecture-Zero_Database-blue?style=flat-square)
![Client-Side Cryptography](https://img.shields.io/badge/Security-Client--Side_Cryptography-red?style=flat-square)
![Stateless](https://img.shields.io/badge/Privacy-100%25_Stateless-brightgreen?style=flat-square)
![Version](https://img.shields.io/badge/Version-V2.3.1-purple?style=flat-square)
![License](https://img.shields.io/badge/License-Proprietary-orange?style=flat-square)

> *Forget your passwords. Trust the math. 100% Client-Side. 0% Database.*

<p align="center">
  <img src="https://raw.githubusercontent.com/iamfrankpass/FrankPass/main/hero.png" alt="FrankPass UI Screenshot" width="80%">
</p>

---

## 🔍 Trust The Math (Why This is Public)

We operate on the principle of **"Security by Transparency"**. If a password generator hides its code, how do you know it isn't sending your passwords to its own server? 

By making the FrankPass cryptographic engine 100% open for verification, we issue an ongoing challenge: **Read the code.** You will see that everything executes locally in your browser leveraging native WebCrypto APIs (`crypto.subtle`). 

Disconnect your Wi-Fi, turn on Airplane mode, and generate your passwords. *It will still work flawlessly.* Don't trust us. Trust the math.

---

## What is FrankPass?

FrankPass is a **deterministic, stateless password generation ecosystem** built on pure browser-side cryptography. It generates strong, unique passwords for every platform — without storing anything, anywhere. Unlike traditional password managers, there is no "vault" to hack.

- ✅ **Zero Database**: No account, no cloud, no tracking.
- ✅ **Stateless UI**: Same inputs &rarr; Same password. Every device. 
- ✅ **Adaptive Pricing**: Localized payment options (INR/USD) for Pro users.
- ✅ **Stateless Contact**: Privacy-first messaging via direct app links.
- ✅ **PWA Native**: Install on iOS/Android. Works 100% offline.
- ✅ **28,500+ Platforms**: Industry-leading auto-suggest database.

---

## How It Works

FrankPass uses a 4-stage cryptographic pipeline, entirely inside your browser:

1. **HMAC-SHA512** — Generates a local pepper from your inputs
2. **1,000 SHA-256 rounds** — Stretches the pepper
3. **PBKDF2 (1,000,000 iterations, SHA-512)** — Derives a master key
4. **HMAC expansion** — Produces the final password bytes

Your password is **calculated, never stored.** Close the tab = data gone.

---

## Key Features

| Feature | Description |
|---|---|
| 🔐 Stateless Architecture | Zero databases, zero vaults, zero tracking |
| 🌍 28,500+ Platforms | Global auto-suggest database (India, US, UK, and 190+ countries) |
| ⚡ Adaptive Pricing | Automatic currency switching (₹ / $) for global conversion |
| 💬 Stateless Contact | Send messages via WhatsApp/Email without server logs |
| 📱 PWA Support | Install as an app. Works offline. |
| 🔄 Variant Counter | Rotate passwords without changing your master key |
| 🛡️ Auto-clear Timers | Password clears in 15s. Secret key in 60s. Tab close = instant wipe. |
| 🌐 Multi-language | English, Hindi, Spanish, French guides |
| 🔒 Device Lock | WebAuthn OS PIN/Biometric for Secret Key |
| ⚡ Web Workers | Crypto offloaded to background thread — zero UI freeze |

---

## Security Design

- **No ambiguous characters** in output (removed: `l`, `I`, `O`, `0`, `1`, `C`, `c`, `S`, `s`, `V`, `v`, `W`, `w`)
- **Symbols restricted to safe set:** `@`, `#`, `$`, `%`, `+`, `*`, `=`
- **Entropy:** 55-character charset × 16+ length = astronomically secure
- **Algorithm:** PBKDF2-SHA512 with 1,000,000 iterations (industry standard)

---

## File Structure

```
frank-pass/
├── index.html              # Main generator & documentation
├── style.css               # Global design system
├── script.js               # App logic, PWA, notifications
├── frankpass-core.js       # Cryptographic engine (do not modify)
├── platforms.js            # 28,500+ platform database
├── translations.js         # Multi-language support
├── particles.js            # Background animation
├── service-worker.js       # PWA offline support
├── manifest.json           # PWA manifest
├── vercel.json             # Routing & redirect rules
├── pro.html                # Pro license & Pricing (Adaptive)
├── contact-us.html         # Stateless Contact page
├── extension.html          # Browser extension guide
├── why-stateless.html      # Why stateless architecture
└── icons/                  # PWA icons (192px, 512px)
```

---

## SEO & Meta

- ✅ Canonical URLs via `vercel.json` rewrites
- ✅ Open Graph + Twitter Card meta tags
- ✅ Schema.org `Person` structured data (founder page)
- ✅ Regional URL routing (`/in`, `/us`, `/gb`, etc.)
- ✅ PWA manifest with theme color

---

## Intellectual Property

FrankPass is the intellectual property of **Master Manikant Yadav**.  
Personal offline use is permitted. Redistribution, cloning, or republishing under a different name is strictly prohibited.  
See [`legal.html`](https://frankpass.com/legal) for full terms.

---

## Connect

| Platform | Link |
|---|---|
| 🌐 Website | [frankpass.com](https://frankpass.com) |
| 🐦 X (Twitter) | [@iamfrankpass](https://x.com/iamfrankpass) |
| 📸 Instagram | [@iamfrankpass](https://instagram.com/iamfrankpass) |
| 💬 WhatsApp | [Channel](https://whatsapp.com/channel/0029VbBvVfqLNSa2At2Shf2z) |
| 👤 Founder | [@mastermanikant](https://x.com/mastermanikant) |

---

*© 2026 FrankPass. Stateless. Serverless. Unhackable.*
