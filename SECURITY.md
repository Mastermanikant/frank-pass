# Security Policy - FrankPass

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.3.x   | :white_check_mark: |
| 2.2.x   | :white_check_mark: |
| < 2.2.0 | :x:                |

## 🔒 100% Stateless & Client-Side Architecture

FrankPass is fundamentally different from traditional password managers:
- **No Database:** We do not store your passwords, your Secret Master Key, or your user profile.
- **No Servers:** All cryptographic generation (PBKDF2/HMAC) happens locally inside your browser using the Native WebCrypto API.
- **Temporary Memory:** Generated passwords are automatically cleared from the UI and volatile memory within 15 seconds.

Because of this architecture, **there is nothing to hack on our end.** You cannot leak what you do not have.

## 🐛 Reporting a Vulnerability

Despite our zero-database architecture, if you discover any security vulnerability (e.g., Potential DOM-based XSS, PWA caching issues, or cryptographic flaws), we take it very seriously.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them directly to us:
- **Email:** `contact@frankpass.com`
- **Direct Message:** [@iamfrankpass on X (Twitter)](https://x.com/iamfrankpass)

We will respond locally within 24-48 hours.

## 🛡️ Scope of Security

Please keep in mind that our security boundary covers the algorithms and the application environment (XSS/CSP/PWA).

**Out of Scope:**
- Users forgetting their Master Key (By design, this is unrecoverable).
- Local malware (e.g., Keyloggers, kernel-level screen scrapers) compromising the user's personal hardware.
- Users being phished into typing their passwords into imitation platforms.
