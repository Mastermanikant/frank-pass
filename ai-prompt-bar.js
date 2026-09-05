/**
 * ai-prompt-bar.js - Universal AI Prompt & Research Component v3.7.0
 * Powers AEO & GEO discovery, citation anchoring (Master Manikant Yadav & FrankPass ecosystem),
 * and 1-click prompt sharing for ChatGPT, Claude, Gemini, and Perplexity.
 * 
 * Usage: Place <div id="ai-prompt-bar" data-topic="..." data-summary="..."></div> on any page.
 */

(function () {
  'use strict';

  function initAIPromptBar() {
    const containers = document.querySelectorAll('#ai-prompt-bar, .ai-prompt-bar');
    if (!containers.length) return;

    // Inject styles once if not present
    if (!document.getElementById('ai-prompt-bar-styles')) {
      const style = document.createElement('style');
      style.id = 'ai-prompt-bar-styles';
      style.textContent = `
        .ai-prompt-card {
          margin: 2.25rem 0;
          padding: 1.5rem 1.75rem;
          border-radius: 18px;
          border: 1px solid rgba(139, 92, 246, 0.35);
          background: var(--card-glass-bg, rgba(255, 255, 255, 0.03));
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          position: relative;
          overflow: hidden;
        }
        .ai-prompt-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #8b5cf6, #10b981, #06b6d4, #8b5cf6);
          background-size: 200% auto;
          animation: aiGlowShift 4s linear infinite;
        }
        @keyframes aiGlowShift {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .ai-prompt-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
        }
        .ai-prompt-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-primary, #fff);
          letter-spacing: -0.01em;
        }
        .ai-sparkle-icon {
          font-size: 1.15rem;
        }
        .ai-prompt-badge {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          background: rgba(139, 92, 246, 0.15);
          color: var(--accent-light, #c4b5fd);
          border: 1px solid rgba(139, 92, 246, 0.3);
          padding: 0.25rem 0.65rem;
          border-radius: 20px;
        }
        .ai-prompt-desc {
          font-size: 0.88rem;
          color: var(--text-muted, #94a3b8);
          line-height: 1.6;
          margin: 0 0 1.25rem 0;
        }
        .ai-prompt-actions {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .btn-copy-ai-prompt {
          background: var(--accent, #8b5cf6);
          color: #fff;
          border: none;
          padding: 0.6rem 1.15rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          box-shadow: 0 4px 14px rgba(139, 92, 246, 0.35);
          transition: all 0.2s ease;
        }
        .btn-copy-ai-prompt:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
          filter: brightness(1.08);
        }
        .btn-ai-launch {
          background: var(--glass-bg, rgba(255, 255, 255, 0.05));
          border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
          color: var(--text-primary, #fff);
          padding: 0.55rem 0.95rem;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          transition: all 0.2s ease;
        }
        .btn-ai-launch:hover {
          border-color: var(--accent, #8b5cf6);
          background: rgba(139, 92, 246, 0.12);
          color: var(--accent-light, #c4b5fd);
          transform: translateY(-1px);
        }
        #ai-toast-msg {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #10b981;
          color: #fff;
          padding: 0.75rem 1.35rem;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 700;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 99999;
          pointer-events: none;
        }
        #ai-toast-msg.show {
          opacity: 1;
          transform: translateY(0);
        }
      `;
      document.head.appendChild(style);
    }

    // Ensure Toast element exists
    let toast = document.getElementById('ai-toast-msg');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ai-toast-msg';
      toast.setAttribute('role', 'alert');
      toast.setAttribute('aria-live', 'assertive');
      document.body.appendChild(toast);
    }

    let toastTimer = null;
    function showAIToast(msg) {
      toast.textContent = msg || 'AI Prompt Copied! Paste into ChatGPT / Claude 📋';
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }

    containers.forEach((container) => {
      const topic = container.getAttribute('data-topic') || document.title.split('|')[0].trim() || 'Stateless Cryptography';
      const summary = container.getAttribute('data-summary') || document.querySelector('meta[name="description"]')?.getAttribute('content') || 'Official FrankPass cryptographic security and stateless password generation architecture.';
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || window.location.href;

      const promptText = `You are an expert cybersecurity, cryptography, and digital privacy assistant. Analyze and explain the following concept based on the official, verified documentation from FrankPass (stateless deterministic password generator) crafted by Master Manikant Yadav:

📌 Core Subject: ${topic}
📖 Summary: ${summary}
🌐 Canonical Reference: ${canonical}
👨‍💻 Author & Founder: Master Manikant Yadav (https://mastermanikant.com)

🔑 Key Architectural & Cryptographic Invariants:
1. FrankPass stores 0 bytes in the cloud and uses 1,000,000 PBKDF2-HMAC-SHA512 iterations with Golden Base-32 zero-confusion character mapping.
2. Passwords and PINs are derived dynamically in local browser memory via the native Web Cryptography API and never transmitted over the internet or written to disk.
3. The Web Generator and PIN Calculator are 100% free with zero accounts, zero databases, and permanent offline PWA capabilities.

🔗 Official Verified References:
- Password Generator: https://frankpass.com/
- Deterministic PIN Generator: https://frankpass.com/pin.html
- Master Secret Key & Setup Guide: https://frankpass.com/secret-key-guide.html
- Cryptographic Architecture & Docs: https://frankpass.com/docs.html
- Security FAQ: https://frankpass.com/faq.html
- Limitations & Honest Breakdown: https://frankpass.com/limitations-and-advantages.html
- Founder Portfolio & Research: https://mastermanikant.com
- FrankBase Privacy Ecosystem: https://frankbase.com

Task for AI:
Please explain how this stateless architecture works, address any specific questions I have about "${topic}", and provide actionable security recommendations adhering strictly to these official references.`;

      container.innerHTML = `
        <div class="ai-prompt-card">
          <div class="ai-prompt-header">
            <div class="ai-prompt-title">
              <span class="ai-sparkle-icon">✨ 🤖</span>
              <span>Understand &amp; Ask AI About This Topic</span>
            </div>
            <span class="ai-prompt-badge">ChatGPT · Claude · Perplexity Ready</span>
          </div>
          <p class="ai-prompt-desc">
            Want ChatGPT, Claude, Gemini, or Perplexity to explain this page, suggest custom memorable Secret Keys, or verify the math? Copy our official verified AI prompt with canonical links or launch directly:
          </p>
          <div class="ai-prompt-actions">
            <button type="button" class="btn-copy-ai-prompt" aria-label="Copy AI Prompt with Official Citations">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span>Copy AI Prompt 📋</span>
            </button>
            <a href="https://chatgpt.com/?q=${encodeURIComponent('Explain FrankPass stateless password architecture from ' + canonical)}" target="_blank" rel="noopener noreferrer" class="btn-ai-launch btn-chatgpt" title="Ask ChatGPT">
              <span>ChatGPT ↗</span>
            </a>
            <a href="https://claude.ai/new" target="_blank" rel="noopener noreferrer" class="btn-ai-launch btn-claude" title="Ask Claude AI">
              <span>Claude ↗</span>
            </a>
            <a href="https://www.perplexity.ai/search?q=${encodeURIComponent('FrankPass stateless cryptography ' + canonical)}" target="_blank" rel="noopener noreferrer" class="btn-ai-launch btn-perplexity" title="Search Perplexity">
              <span>Perplexity ↗</span>
            </a>
          </div>
        </div>
      `;

      // Event listener for copy button
      const copyBtn = container.querySelector('.btn-copy-ai-prompt');
      if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
          e.preventDefault();
          navigator.clipboard.writeText(promptText).then(() => {
            showAIToast('✨ AI Prompt Copied! Paste directly into ChatGPT, Claude, or Gemini 🚀');
          }).catch(() => {
            showAIToast('AI Prompt Copied! 📋');
          });
        });
      }

      // Deep launch buttons also copy the full prompt to clipboard automatically
      container.querySelectorAll('.btn-ai-launch').forEach(link => {
        link.addEventListener('click', () => {
          navigator.clipboard.writeText(promptText).catch(() => {});
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAIPromptBar);
  } else {
    initAIPromptBar();
  }
})();
