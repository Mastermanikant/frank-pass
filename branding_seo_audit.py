import os
import re

def process_html(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    # 1. Update Title and OG Title to requested tagline
    new_tagline = "FrankPass | Unlimited Deterministic Password Generator"
    content = re.sub(r'<title>.*?</title>', f'<title>{new_tagline}</title>', content, flags=re.IGNORECASE)
    content = re.sub(r'<meta\s+property=["\']og:title["\']\s+content=["\'][^"\']*["\']', f'<meta property="og:title" content="{new_tagline}"', content, flags=re.IGNORECASE)
    content = re.sub(r'<meta\s+name=["\']twitter:title["\']\s+content=["\'][^"\']*["\']', f'<meta name="twitter:title" content="{new_tagline}"', content, flags=re.IGNORECASE)

    # 2. Add apple-touch-icon if missing
    if '<link rel="apple-touch-icon"' not in content:
        content = content.replace('<link rel="icon"', '<link rel="apple-touch-icon" href="icons/favicon.png">\n    <link rel="icon"', 1)
        
    # 3. Specific fix for Extensions Modal Message
    if 'extensions.html' in filepath:
        # Update the modal paragraph
        old_msg = "Follow us for the official extension launch, security tips, and latest updates!"
        new_msg = "Follow us for the official extension launch, security tips, and latest updates! (If you follow us on Instagram and DM me, I will personally notify you at launch time!)"
        content = content.replace(old_msg, new_msg)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Applied branding and SEO to {filepath}")

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
for h in html_files:
    process_html(h)

print("Done.")
