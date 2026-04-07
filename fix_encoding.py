import os
import glob
import re

def fix_mojibake(text):
    # This function decodes mojibake that was caused by reading UTF-8 as cp1252 and saving as UTF-8
    try:
        # First, find patterns of mojibake
        # These are sequences of characters that exist in cp1252 
        # and represent the bytes of utf-8 encodings.
        # However, a simpler targeted approach for FrankPass is replacing the specific broken Indian/Foreign texts.
        
        replacements = {
            'ðŸ“ ': '📌 ',
            'ðŸŒ ': '🌐 ',
            'ðŸ‘¤': '👤 ',
            'ðŸ” ': '🔑 ',
            'ðŸ‘ ï¸ ': '👁️ ',
            'ðŸ”„': '🔄 ',
            'ðŸ”‘': '🔐 ',
            'ðŸ›¡ï¸ ': '🛡️ ',
            'ðŸš€': '🚀 ',
            'ðŸ“š': '📚 ',
            'ðŸ’™': '💙 ',
            'Ã­': 'í',
            'Ã±': 'ñ',
            'Ã©': 'é',
            'Ã¨': 'è',
            'à¤¦à¥‡à¤¶': 'देश',
            'à¤ªà¥ à¤²à¥‡à¤Ÿà¤«à¥‰à¤°à¥ à¤®': 'प्लेटफ़ॉर्म',
            'à¤µà¥‡à¤¬à¤¸à¤¾à¤‡à¤Ÿ': 'वेबसाइट',
            'à¤¯à¥‚à¤œà¤¼à¤°à¤¨à¥‡à¤®': 'यूज़रनेम',
            'à¤ˆà¤®à¥‡à¤²': 'ईमेल',
            'à¤µà¥ˆà¤•à¤²à¥ à¤ªà¤¿à¤•': 'वैकल्पिक',
            'à¤¸à¥€à¤•à¥ à¤°à¥‡à¤Ÿ': 'सीक्रेट',
            'à¤ªà¤°à¥ à¤¸à¤¨à¤²': 'पर्सनल',
            'à¤•à¥€': 'की',
            'à¤µà¥‡à¤°à¤¿à¤ à¤‚à¤Ÿ': 'वेरिएंट',
            'à¤•à¤¾à¤‰à¤‚à¤Ÿà¤°': 'काउंटर',
            'à¤ªà¤¾à¤¸à¤µà¤°à¥ à¤¡': 'पासवर्ड',
            'à¤•à¥€': 'की',
            'à¤²à¤‚à¤¬à¤¾à¤ˆ': 'लंबाई',
            'à¤œà¤¨à¤°à¥‡à¤Ÿ': 'जनरेट',
            'à¤•à¤¿à¤¯à¤¾': 'किया',
            'à¤¹à¥ à¤†': 'हुआ',
            'à¤¡à¥‡à¤Ÿà¤¾': 'डेटा',
            'à¤²à¥€à¤•': 'लीक',
            'à¤¸à¥‡': 'से',
            'à¤¸à¤¾à¤µà¤§à¤¾à¤¨': 'सावधान',
            'ðŸ‡®ðŸ‡³': '🇮🇳',
            'ðŸ‡¦ðŸ‡«': '🇦🇫',
            "ClÃ© SecrÃ¨te": "Clé Secrète",
            "ContraseÃ±a Generada": "Contraseña Generada",
            "Fuites de DonnÃ©es": "Fuites de Données",
            "GÃ©nÃ©rÃ©": "Généré",
        }
        
        modified = False
        for bad, good in replacements.items():
            if bad in text:
                text = text.replace(bad, good)
                modified = True
                
        # Now fix the datalist specifically if it got double encoded
        # we can just run a generic decode/re-encode for the whole text but that crashed due to true utf-8 mixed in.
        # Let's selectively find fragments of double encoded utf-8:
        # Basically any sequence of characters from the "latin-1" range that matches a valid utf-8 byte sequence when encoded.
        
        def double_encode_replacer(match):
            bad_str = match.group(0)
            try:
                # Convert the strange characters to their underlying bytes
                raw_bytes = bad_str.encode('windows-1252')
                # Decode the bytes as proper UTF-8
                proper_str = raw_bytes.decode('utf-8')
                return proper_str
            except:
                return bad_str

        # Matches characters typically signifying UTF-8 mapped to ISO-8859-1.
        # Starts with Ã (195), ð (240), â (226), etc.
        pattern = re.compile(r'[Ãâð][\x80-\xff]*')
        
        # apply regex
        new_text = pattern.sub(double_encode_replacer, text)
        if new_text != text:
            text = new_text
            modified = True
            
        return text, modified
    except Exception as e:
        print(e)
        return text, False

for filepath in glob.glob(r'd:\Frank Pass all file\Frank Pass\*.html'):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    
    text, modified = fix_mojibake(text)
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(text)
        print('Fixed:', filepath)

print("Done")
