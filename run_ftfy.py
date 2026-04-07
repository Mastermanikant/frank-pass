import glob
import ftfy
import os

def fix_all_html():
    files = glob.glob(r'd:\Frank Pass all file\Frank Pass\*.html')
    
    # Custom fixes for things ftfy might not catch if already partially corrupted
    custom_fixes = {
        'ðŸ›¡ï¸ ': '🛡️',
        'ðŸš€': '🚀',
        'ðŸ“š': '📚',
        'ðŸ’™': '💙'
    }

    modified_files = []
    
    for filepath in files:
        changed = False
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            original_text = f.read()

        # Step 1: Automated AI-powered mojibake healing with ftfy
        fixed_text = ftfy.fix_text(original_text)
        
        # Step 2: Custom hardcore overrides just in case
        for bad, good in custom_fixes.items():
            if bad in fixed_text:
                fixed_text = fixed_text.replace(bad, good)
                
        if fixed_text != original_text:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(fixed_text)
            modified_files.append(filepath)
            print(f"Healed: {os.path.basename(filepath)}")
            
    print(f"\nDone! Automatically healed {len(modified_files)} files.")

if __name__ == "__main__":
    fix_all_html()
