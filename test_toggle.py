import os, time, http.server, socketserver, threading
from playwright.sync_api import sync_playwright

app_dir = r'D:\01_Websites_and_Content\MMY_Website_Project\07_frankpass.com\01_Website_App'
PORT = 9024

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=app_dir, **kwargs)
    def log_message(self, format, *args): pass

httpd = socketserver.TCPServer(('127.0.0.1', PORT), QuietHandler)
srv_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
srv_thread.start()

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto(f'http://127.0.0.1:{PORT}/')
    page.wait_for_load_state('domcontentloaded')
    
    # Let's see the console logs
    page.on("console", lambda msg: print(f"Browser console: {msg.text}"))
    
    # 1. Type secret
    page.fill('#secret-input', 'my-secret-key')
    
    # 2. Click toggle
    page.click('#toggle-secret')
    print("Clicked toggle (should be visible)")
    
    # 3. Enable remember
    page.click('#remember-device-toggle')
    time.sleep(0.5)
    
    # Click skip to fallback to blind
    page.click('#btn-skip-bio')
    time.sleep(0.5)
    
    # 4. Refresh page to load remembered secret
    page.goto(f'http://127.0.0.1:{PORT}/')
    time.sleep(0.5)
    
    # 5. Click toggle to reveal
    page.click('#toggle-secret')
    time.sleep(0.5)
    
    # Capture toast
    toast = page.locator('#toast-container').inner_text()
    print("Toast message after clicking eye on blind encrypted:", toast)
    
    browser.close()

httpd.shutdown()
httpd.server_close()
