import os, time, http.server, socketserver, threading
from playwright.sync_api import sync_playwright

app_dir = r'D:\01_Websites_and_Content\MMY_Website_Project\07_frankpass.com\01_Website_App'
PORT = 9023

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=app_dir, **kwargs)
    def log_message(self, format, *args): pass

httpd = socketserver.TCPServer(('127.0.0.1', PORT), QuietHandler)
srv_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
srv_thread.start()

out_dir = r'C:\Users\IT CARE SAHARSA\.gemini\antigravity\brain\70f23d33-c7c3-4c6a-8c4c-179fa17dbd40'

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 900})
        
        # 1. Capture Founder Page in Day Mode
        page.goto(f'http://127.0.0.1:{PORT}/founder-mastermanikant.html')
        page.wait_for_load_state('domcontentloaded')
        page.evaluate("document.documentElement.setAttribute('data-theme', 'light')")
        time.sleep(0.5)
        page.screenshot(path=os.path.join(out_dir, 'founder_day_mode_fixed.png'))
        print("Captured founder_day_mode_fixed.png")
        
        browser.close()
finally:
    httpd.shutdown()
    httpd.server_close()
