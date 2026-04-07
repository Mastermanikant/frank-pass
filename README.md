# 🛡️ FrankPass — Stateless Password Generator

**Live at:** [frankpass.com](https://frankpass.com)  |  **By:** [Master Manikant Yadav](https://frankpass.com/meet-the-founder-MasterManikant.html)

![100% Offline (PWA)](https://img.shields.io/badge/Status-100%25_Offline_Ready-success?style=flat-square) 
![Zero Database](https://img.shields.io/badge/Architecture-Zero_Database-blue?style=flat-square)
![Client-Side Cryptography](https://img.shields.io/badge/Security-Client--Side_Cryptography-red?style=flat-square)
![Stateless](https://img.shields.io/badge/Privacy-100%25_Stateless-brightgreen?style=flat-square)
![Version](https://img.shields.io/badge/Version-V2.2.1-purple?style=flat-square)
![License](https://img.shields.io/badge/License-Proprietary-orange?style=flat-square)

> *One phrase. Every password. Zero storage.*

<p align="center">
  <img src="./hero.png" alt="FrankPass UI Screenshot" width="80%">
</p>

---

## 🔍 Trust The Math (Why This is Public)

We operate on the principle of **"Security by Transparency"**. If a password generator hides its code, how do you know it isn't sending your passwords to its own server? 

By making the FrankPass cryptographic engine 100% open for verification, we issue an ongoing challenge: **Read the code.** You will see that everything executes locally in your browser leveraging native WebCrypto APIs (`crypto.subtle`). 

Disconnect your Wi-Fi, turn on Airplane mode, and generate your passwords. *It will still work flawlessly.* Don't trust us. Trust the math.

---

## What is FrankPass?

FrankPass is a **deterministic, stateless password generator** built on pure browser-side cryptography. It generates strong, unique passwords for every platform — without storing anything, anywhere.

- ✅ No database. No account. No cloud.
- ✅ Same input → Same password. Every device. Every time.
- ✅ Works 100% offline (PWA)
- ✅ 28,500+ global platforms in Auto-Suggest

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
| 📱 PWA Support | Install as an app. Works offline. |
| 🔄 Variant Counter | Rotate passwords without changing your master key |
| 🛡️ Auto-clear Timers | Password clears in 15s. Secret key in 60s. Tab close = instant wipe. |
| 🌐 Multi-language | English, Hindi, Spanish, French guides |
| ♿ Accessible | ARIA labels, keyboard navigation, unique IDs |
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
├── about.html              # About FrankPass
├── contact.html            # Contact page
├── guide.html              # Security guide & ebooks
├── legal.html              # Legal, IP & license
├── support-us.html            # Support / donations
├── founder-mastermanikant.html  # Founder story
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
| 🐦 X (Twitter) | [@iamfrankpass](https://frankpass.com/x) |
| 📸 Instagram | [@iamfrankpass](https://frankpass.com/instagram) |
| 💬 WhatsApp | [Channel](https://frankpass.com/whatsapp) |
| 👤 Founder | [@mastermanikant](https://frankpass.com/mastermanikant/x) |

---

*© 2026 FrankPass. Stateless. Serverless. Unhackable.*
