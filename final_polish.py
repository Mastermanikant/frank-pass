import os
import re

def process_html(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # 1. REMOVE DOWNLOAD ARROW in "Read Guide" button (specifically in index.html and any other button)
    content = content.replace('<ion-icon name="download-outline"></ion-icon> Read Guide', 'Read Guide')
    
    # 2. FIX FOOTER INCLUSION AND TOGGLE COMPATIBILITY
    # Ensure footer-toggle-icon and footer-toggle-label exist if footer-toggle-btn is present
    if 'footer-toggle-btn' in content:
        # Check if the internal structure has the right IDs
        if 'id="footer-toggle-label"' not in content:
            # Try to find the label span
            content = re.sub(r'(<span[^>]*>)\s*Show Site Footer\s*(</span>)', r'<span id="footer-toggle-label">\2Show Site Footer\3', content)
            
    # Ensure footer.js is included before </body>
    if 'footer-body' in content and 'footer.js' not in content:
        content = content.replace('</body>', '    <script src="footer.js"></script>\n</body>')

    # 3. FIX SVG ICONS (Regex based for any style)
    SVGS = {
        'logo-github': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px" height="20px"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 .1 1.8-.4 2.2-.8.1-.5.3-.8.5-1-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.9 1.2 2 1.2 3.3 0 4.6-2.8 5.6-5.5 5.9.3.3.6.8.6 1.6v2.4c0 .3.2.7.8.6A12 12 0 0 0 12 .3z"/></svg>',
        'logo-linkedin': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px" height="20px"><path d="M20.4 20.5H16v-5.6c0-1.3-.5-2.3-1.7-2.3-1 0-1.6.6-1.8 1.2-.1.2-.1.5-.1.8v5.9h-4.4s.1-12 0-13.3h4.4v1.9c.6-.9 1.6-2.2 4-2.2 2.9 0 5 1.9 5 5.9v7.7zM4.1 6.5A2.3 2.3 0 1 1 4.1 2a2.3 2.3 0 0 1 0 4.5zM1.9 20.5h4.4V7.2H1.9v13.3z"/></svg>',
        'logo-instagram': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px" height="20px"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.5.2.9.5 1.3.9.4.4.7.8.9 1.3.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.5-.5.9-.9 1.3-.4.4-.8.7-1.3.9-.4-.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.5-.2-.9-.5-1.3-.9-.4-.4-.7-.8-.9-1.3-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.5.5-.9.9-1.3.4-.4.8-.7 1.3-.9.4-.2 1-.3 2.2-.4 1.3-.1 1.7-.1 4.9-.1m0-2.2C8.7 0 8.3 0 7 0 5.8.1 4.9.3 4.1.6 3.3.9 2.6 1.4 2 2 1.4 2.6.9 3.3.6 4.1.3 4.9.1 5.8 0 7c0 1.3 0 1.7 0 4.9s0 3.6.1 4.9c.1 1.2.3 2.1.6 2.9.3.8.8 1.5 1.4 2.1.6.6 1.3 1.1 2.1 1.4.8.3 1.7.5 2.9.6 1.3.1 1.7.1 4.9.1s3.6 0 4.9-.1c1.2-.1 2.1-.3 2.9-.6.8-.3 1.5-.8 2.1-1.4.6-.6 1.1-1.3 1.4-2.1.3-.8.5-1.7.6-2.9.1-1.3.1-1.7.1-4.9s0-3.6-.1-4.9c-.1-1.2-.3-2.1-.6-2.9-.3-.8-.8-1.5-1.4-2.1-.6-.6-1.3-1.1-2.1-1.4-.8-.3-1.7-.5-2.9-.6C15.6 0 15.2 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.4a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0z"/></svg>',
        'logo-youtube': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px" height="20px"><path d="M21.6 7.6c-.2-1-.9-1.8-1.9-2C18 5.2 12 5.2 12 5.2s-6 0-7.7.4c-1 .2-1.7 1-1.9 2C2 9.3 2 12 2 12s0 2.7.4 4.4c.2 1 .9 1.8 1.9 2 1.7.4 7.7.4 7.7.4s6 0 7.7-.4c1-.2 1.7-1 1.9-2 .4-1.7.4-4.4.4-4.4s0-2.7-.4-4.4zM9.8 15V9l6.3 3-6.3 3z"/></svg>',
        'logo-whatsapp': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px" height="20px"><path d="M12.04 2h-.03C6.48 2 2 6.48 2 12.01c0 1.88.49 3.69 1.44 5.29L2 22l4.85-1.41c1.54.9 3.3 1.38 5.16 1.38 5.53 0 10.02-4.48 10.02-10 0-2.67-1.04-5.18-2.93-7.07A9.95 9.95 0 0 0 12.04 2zm5.72 13.92c-.22.61-1.28 1.15-1.77 1.25-.44.09-1 .18-3.04-.66-2.45-1.01-4.04-3.53-4.16-3.7-.13-.16-1-1.32-1-2.52 0-1.19.63-1.78.85-2.03.22-.24.49-.3.65-.3h.23c.16 0 .39-.06.6.45.22.52.71 1.72.77 1.85.06.13.1.28.02.43-.09.15-.13.24-.26.4-.13.15-.28.32-.39.43-.13.14-.26.3-.12.54.14.24.63 1.04 1.35 1.68.92.83 1.7 1.09 1.94 1.21.24.13.38.1.53-.06.14-.17.62-.72.78-.97.16-.24.32-.2.55-.12.22.08 1.43.68 1.68.8.24.12.4.18.46.28.06.1.06.58-.16 1.19z"/></svg>',
        'logo-facebook': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px" height="20px"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
        'chevron-down-outline': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18px" height="18px"><path d="M6 9l6 6 6-6" /></svg>',
        'chevron-up-outline': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18px" height="18px"><path d="M18 15l-6-6-6 6" /></svg>'
    }
    for icon_name, svg in SVGS.items():
        pattern = rf'<ion-icon\s+name=["\']{icon_name}["\'][^>]*>.*?</ion-icon>'
        content = re.sub(pattern, svg, content, flags=re.IGNORECASE)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Final Polish applied to {filepath}")

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
for h in html_files:
    process_html(h)

print("Done with universal polish.")
