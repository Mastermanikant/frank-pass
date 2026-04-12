/**
 * footer.js — Shared footer utility for all FrankPass sub-pages.
 * BUG FIX: Sub-pages used toggleFooter() but never loaded script.js.
 * This lightweight file provides only what's needed for the footer.
 */

function toggleFooter() {
    const body = document.getElementById('footer-body');
    const icon = document.getElementById('footer-toggle-icon');
    const label = document.getElementById('footer-toggle-label');
    if (!body) return;
    const isOpen = body.style.display !== 'none' && body.style.display !== '';
    if (isOpen) {
        body.style.display = 'none';
        if (icon) { icon.setAttribute('name', 'chevron-down-outline'); icon.style.transform = 'rotate(0deg)'; }
        if (label) label.textContent = 'Show Site Footer';
    } else {
        body.style.display = 'block';
        if (icon) { icon.setAttribute('name', 'chevron-up-outline'); icon.style.transform = 'rotate(180deg)'; }
        if (label) label.textContent = 'Hide Site Footer';
    }
}

// Auto-set copyright year
document.addEventListener('DOMContentLoaded', function () {
    const cy = document.getElementById('copyright-year');
    if (cy) cy.textContent = new Date().getFullYear();

    // Dynamically inject version, strict legal notice, and GitHub link to all footers
    const footerBottoms = document.querySelectorAll('.footer-bottom');
    if(footerBottoms && footerBottoms.length > 0) {
        footerBottoms.forEach(fb => {
             // 🚀 VERSION LABEL (V2.2.1)
             const versionLabel = document.createElement('p');
             versionLabel.style.fontSize = '0.8rem';
             versionLabel.style.opacity = '0.6';
             versionLabel.style.marginBottom = '0.5rem';
             versionLabel.innerHTML = "<span style='color: var(--accent-primary); font-weight: bold;'>v2.3.0 (Stable)</span> &mdash; FrankPass Architecture";
             fb.prepend(versionLabel);


             const strictNotice = document.createElement('p');
             strictNotice.style.fontSize = '0.75rem';
             strictNotice.style.opacity = '0.85';
             strictNotice.style.marginTop = '0.8rem';
             strictNotice.innerHTML = "<strong style='color: #ef4444;'>LEGAL WARNING:</strong> All content, UI design, and intellectual property are protected. Unauthorized copying, reproduction, or commercial use is strictly prohibited. Violators will face legal action, financial penalties, and full liability for damages.";
             fb.appendChild(strictNotice);
        });
    }
});
