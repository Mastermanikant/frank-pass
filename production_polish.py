import os
import re

# File list to process
html_files = [
    r"d:\Frank Pass all file\Frank Pass\index.html",
    r"d:\Frank Pass all file\Frank Pass\about.html",
    r"d:\Frank Pass all file\Frank Pass\meet-the-founder-MasterManikant.html",
    r"d:\Frank Pass all file\Frank Pass\support-us.html",
    r"d:\Frank Pass all file\Frank Pass\why-stateless.html",
    r"d:\Frank Pass all file\Frank Pass\guide.html",
    r"d:\Frank Pass all file\Frank Pass\faq.html"
]

# Character mapping for safe HTML entities
replacements = {
    "í": "&iacute;",
    "ó": "&oacute;",
    "ú": "&uacute;",
    "ñ": "&ntilde;",
    "¿": "&iquest;",
    "á": "&aacute;",
    "é": "&eacute;",
    "à": "&agrave;",
    "→": "&rarr;",
    'href="/faq"': 'href="faq.html"',
    'href="#faq"': 'href="faq.html"',
    'href="/faq.html"': 'href="faq.html"'
}

def polish_files():
    for file_path in html_files:
        if not os.path.exists(file_path):
            print(f"Skipping missing file: {file_path}")
            continue
            
        print(f"Polishing: {file_path}...")
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            new_content = content
            for old, new in replacements.items():
                new_content = new_content.replace(old, new)

            if new_content != content:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"  [SUCCESS] Updated {file_path}")
            else:
                print(f"  [INFO] No changes needed for {file_path}")
                
        except Exception as e:
            print(f"  [ERROR] {file_path}: {e}")

if __name__ == "__main__":
    polish_files()
