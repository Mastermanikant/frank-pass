# Contributing to FrankPass

First off, thank you for considering contributing to FrankPass! Every bit of help means increased digital peace for someone else.

FrankPass is built around transparency and security. Because of our strict "stateless" philosophy and cryptographic precision, the core application logic (`frankpass-core.js`) is rarely modified.

However, the fastest way to contribute is by expanding our **Platform Auto-Suggest Database**.

## 🚀 Adding a New Platform to the Auto-Suggest

FrankPass provides a smart auto-suggest feature so users don't make spelling mistakes when generating passwords for platforms (like `Facebook`, `PayTM`, etc.).

If a popular website, app, or platform from your country is missing, you can add it!

1. Fork the repository.
2. Open `platforms.js`.
3. Locate your appropriate region array (e.g., `in` for India, `us` for USA) or add it to the `global` array if it applies worldwide.
4. Add the platform name alphabetically. (Format: `"PlatformName"`).
5. Submit a Pull Request (PR) with a short description.

*Note: Please only add reasonably well-known platforms to prevent database bloat.*

## 🐛 Reporting Bugs & Feedback
- **UI/UX Bugs:** Please use the GitHub Issue Tracker.
- **Security Flaws:** DO NOT use the Issue Tracker for security flaws. Please refer to our `SECURITY.md` file for discrete reporting.

## 💻 Development
If you wish to run the project locally to test UI changes:
1. Clone the repo: `git clone https://github.com/MasterManikant/frank-pass.git`
2. No NPM or build steps required. Simply serve the directory using any local web server (e.g., VSCode Live Server, `python -m http.server 3000`, etc.).
3. Note: PWA (Service Workers) and `crypto.subtle` require `localhost` or a secure `https://` domain to function correctly.
