import os
import html

# Target directory
target_dir = r"d:\Frank Pass all file\Frank Pass"

# Extended mapping for specific symbols that html.escape might skip or handle differently
custom_mapping = {
    "→": "&rarr;",
    "📍": "&#128205;",
    "🌐": "&#127760;",
    "👤": "&#128100;",
    "🔐": "&#128272;",
    "🔄": "&#128260;",
    "⚙️": "&#9881;&#65039;",
    "📏": "&#128207;",
    "🛡️": "&#128737;&#65039;",
    "😩": "&#128553;",
    "✅": "&#9989;",
    "🚀": "&#128640;",
    "⚓": "&#9875;",
    "💡": "&#128161;",
    "📧": "&#128231;",
    "🔗": "&#128279;"
}

def heal_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Step 1: Replace custom symbols first
        for char, entity in custom_mapping.items():
            content = content.replace(char, entity)

        # Step 2: Convert all other non-ASCII characters to numeric entities
        healed_content = ""
        for char in content:
            if ord(char) > 127:
                healed_content += f"&#{ord(char)};"
            else:
                healed_content += char

        if healed_content != content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(healed_content)
            print(f"  [HEALED] {file_path}")
        else:
            print(f"  [CLEAN] {file_path}")

    except Exception as e:
        print(f"  [ERROR] {file_path}: {e}")

def main():
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            if file.endswith(".html"):
                heal_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
