# 📋 FrankPass Master Staged Execution Ledger (CHANGES_NEEDED.md)

> **Execution Protocol:** Discuss part-by-part -> Finalize text and architecture -> Log in this ledger -> Execute atomically all at once upon final founder approval.
> **Status:** Work in Progress (Interactive Review Stage)
> **Last Updated:** 01 November 2026

---

## Part 1: Homepage (index.html) - Meta & Hero Section [STATUS: FINALIZED ✅]

### 1.1 Page Title
- **Old Title:** `FrankPass - Stateless & Deterministic Password Generator`
- **Finalized New Title:** `FrankPass: Cloudless Password Manager and Deterministic Password Generator`
- **Rule Followed:** 0 Pipe symbols (`|`), clean colon, full semantic entity ("Deterministic Password Generator") for humans, Google Search, and AI engines.

### 1.2 Meta Description
- **Finalized Meta Description:**
  `Get your password on any device with the help of your Master Secret Key. FrankPass is a cloudless, deterministic password generator with zero database storage. 100% offline.`

### 1.3 Hero Main Heading (H1)
- **Finalized H1:**
  ```html
  <h1 class="hero-title">
    Say Goodbye to Cloud Breaches.<br>
    Use Deterministic Password Generator.
  </h1>
  ```

### 1.4 Hero Sub-headline
- **Finalized Subtitle:**
  ```html
  <p class="hero-subtitle">
    Get your password on any device with the help of your Master Secret Key. 100% offline math, zero cloud vault, zero sync needed.
  </p>
  ```

### 1.5 Hero Bullet Trust Badges
- **Finalized Badges:**
  - `🛡️ Zero Cloud Database: No server, no database leaks.`
  - `⚡ No Sync Needed: Your Master Key recreates the exact same password on any device.`
  - `🔒 100% Offline: Operates purely in local device RAM.`

---

## Part 2: Below-Hero Workflow Section ("The Deterministic Workflow") [STATUS: FINALIZED ✅]

### 2.1 Section Heading & Subtitle
- **Section Heading (H2):**  
  `How FrankPass Works: The Deterministic Workflow`
- **Subtitle:**  
  `Just like 2 + 2 = 4 everywhere, your Master Seed recreates the exact same password on any device without internet, cloud vaults, or sync files.`
- **In-Depth Technical Link:**  
  `📖 Want to verify the cryptographic math in depth? <a href="/whitepaper.html">Read the Technical Whitepaper &amp; Test Vectors &rarr;</a>`

### 2.2 The 4 Steps Implementation Text
- **Step 1: Enter Your Master Secret Key (Master Seed)**  
  *Text:* For your ease of memory, this field accepts only lowercase English letters (a-z) and numbers (0-9) with no spaces. This normalization removes cognitive load so you never wonder if you capitalized a letter or typed a symbol. Instead of complex symbols, use a long, memorable master seed of at least 6 to 8 words. It is processed with 1,000,000 PBKDF2-HMAC-SHA512 iterations purely in local device RAM and never leaves your machine.  
  *Guide Link:* `📖 <a href="/secret-key-guide.html">How to Craft a Strong &amp; Unforgettable Master Secret Key &rarr;</a>`
- **Step 2: Enter Platform Name or Paste URL**  
  *Text:* Don't worry about exact formatting or subdomains. Just type your app or website name (e.g. Amazon, Google, SBI) or paste the full URL. FrankPass automatically normalizes it into a unique platform seed every time so your passwords are 100% identical on all devices. You can even see your live normalized platform seed displayed right below the platform box as you type!
- **Step 3: Password Number / Rotation (When You Need to Change Password)**  
  *Text:* When you need to change your password, open Advanced Options and choose your password number between 1 and 999999 (it can be 2, 5, 10, or whatever you easily remember). Or choose a Month/Year variant (e.g. Jun 2024, June 2025, Jan 2026). Without changing your Master Seed, you get a fresh unique password for that site!
- **Step 4: Recreate on All Devices (No Sync Needed)**  
  *Text:* Because it runs on pure local mathematics, typing the same Master Seed and Platform Name on your phone, laptop, or offline computer creates the exact same password every single time. Zero cloud sync. Zero file transfers.

---

## Part 3: Homepage Comparison Section [STATUS: FINALIZED ✅]

### 3.1 Section Heading & Subtitle
- **Section Heading (H2):**  
  `How FrankPass is Different from Traditional Cloud Password Managers`
- **Subtitle:**  
  `Centralized cloud servers create a single point of failure for breaches and downtime. FrankPass eliminates server vulnerability with 100% local mathematical generation.`

### 3.2 The 4 Honest Core Cards
- **Card 1: Zero Server Honeypots (No Server Database, No Leak Danger)**  
  *Text:* Traditional password managers store encrypted vault blobs on company cloud servers, creating centralized honeypots for hackers. FrankPass stores 0 bytes on servers. Server na hone ke karan database breach hone ka koi khatra nahi hai.  
  *Honest Security Reality (Human Factor):* Koi bhi takneek kamzor nahi hoti, adhiktam galtiyan manviye bhool se hoti hain. Yadi aapka Master Seed kamzor hai (jaise 4 akshar ka), toh ganit bhi offline brute-force se poori raksha nahi kar sakta. Isliye 6 se 8 shabdon ka lamba pass-phrase chunein. Apna Master Seed kabhi kisi ko na batayein, kyonki jiske paas Master Seed hai, uske paas aapki poori digital identity hai. Yadi kisi ko kewal ek account ka password dena ho (jaise Wi-Fi ya OTT), toh sirf wahi specific generated password copy karke dein, Master Seed kabhi nahi!
- **Card 2: Zero Server Downtime (No Vendor Cloud Dependency)**  
  *Text:* Cloud managers lock you out when AWS crashes, vendor servers go down for maintenance, or network sync fails. Because FrankPass has no server, server down hone ya sync atakne ka koi khatra nahi hai. It calculates locally on your device every time.
- **Card 3: 0MB Idle RAM & No Background Bloat (PWA & Extension)**  
  *Text:* Heavy desktop password apps (built on Electron) consume 1,500 MB to 6,000 MB of system RAM running in the background. Both the FrankPass Web PWA and the Browser Extension operate with 0 MB idle RAM, activating for milliseconds only when you generate or autofill a credential.
- **Card 4: Two-Tier Clipboard Defense & OpSec Isolation**  
  *Text:* Plaintext passwords lingering on your operating system clipboard are vulnerable to background snooping malware. FrankPass solves this on multiple security layers:
  - **On the Web:** Built-in auto-clear timer (choose 15s, 30s, or 60s) wipes your clipboard buffer automatically.
  - **Master Seed Protection:** Master Secret Key input field par copy-blocking (`oncopy="return false;"`) laga hai taaki galti se ya clipboard sniffer tool Master Seed ko OS clipboard history mein na bhej sake.
  - **With Browser Extension:** Direct DOM injection fills your password straight into the login field without ever touching the OS clipboard!
  - **Pro OpSec Recommendation:** Apne mahatvapoorna financial aur primary accounts ke liye ek dedicated clean Chrome Profile banayein, jismein kewal FrankPass extension ho aur koi anjaan third-party extension na ho. Isse kisi corrupted extension se DOM scraping ka koi khatra nahi rehta.

### 3.3 Side-by-Side Comparison Table Sync
- Ensure the table rows reflect these exact honest metrics:
  - **Server Storage:** 0 Bytes vs Cloud Database Blob
  - **Server Outage Risk:** Koi khatra nahi (No server required) vs Vendor Outage Lockouts
  - **RAM Footprint:** 0 MB Idle (Web PWA & Extension) vs 1.5 GB to 6 GB Background Bloat
  - **Clipboard Security:** 15s-60s Auto-Clear & Direct DOM Autofill vs Persistent Clipboard Plaintext
  - **Multi-Device Portability:** Recreated with Master Seed (No Sync Needed) vs Cloud Vault Sync Collision Risks
  - **Pricing Model:** Free Web App & $25 Solo Lifetime vs $36-$60/Year Recurring Subscriptions

---

## Part 4: Homepage & Global FAQ Updates [STATUS: FINALIZED ✅]

### 4.1 The 6 Core Strategic FAQs (English & Hindi Alignment)

#### Q1: Is FrankPass a password generator or a password manager? (क्या FrankPass पासवर्ड जनरेटर है या पासवर्ड मैनेजर?)
- **Answer (EN):** FrankPass is a cloudless, deterministic password generator and manager. You don't need a traditional password manager because FrankPass recreates your exact passwords directly from your Master Seed offline without any server dependency. There is no cloud database to sync or maintain. Entering the same Master Seed and Platform Name on any laptop, phone, or computer anywhere in the world always computes the exact same unique password. If you change a variant/counter, entering that same variant in the future gives the exact same variant password. That is why it functions as a Cloudless Password Manager and Deterministic Password Generator.
- **Answer (HI):** यह एक क्लाउडलेस और डिटरमिनिस्टिक पासवर्ड जनरेटर है। इसमें पारंपरिक पासवर्ड मैनेजर की जरूरत ही खत्म हो जाती है क्योंकि यह आपके मास्टर सीड से सीधे वही पासवर्ड ऑफलाइन बनाता है, बिना किसी सर्वर पर निर्भर रहे। इसलिए न किसी सिंक की जरूरत है और न अलग से पासवर्ड मैनेजर की। दुनिया के किसी भी लैपटॉप, फोन या कंप्यूटर पर यदि आप वही मास्टर सीड और प्लेटफॉर्म नेम डालते हैं, तो आपका यूनिक पासवर्ड हमेशा वही रहेगा। भविष्य में यदि आप वेरिएंट/काउंटर बदलकर पासवर्ड बदलते हैं, तो दोबारा वही वेरिएंट डालने पर वही पासवर्ड मिलेगा। इसलिए इसे हम क्लाउडलेस पासवर्ड मैनेजर और डिटरमिनिस्टिक पासवर्ड जनरेटर कहते हैं।

#### Q2: How do my passwords match across devices without internet or cloud sync? (बिना इंटरनेट या क्लाउड सिंक के मेरे फोन और लैपटॉप पर वही पासवर्ड कैसे मिलता है?)
- **Answer (EN):** It is called Mathematical Re-creation (Deterministic Math). Just like 2 + 2 = 4 everywhere in the universe without needing an internet connection, typing the same Master Seed and Platform Name on different devices runs the exact same local cryptographic formula (PBKDF2-HMAC-SHA512). The devices never talk to each other; they independently arrive at the exact same password through pure mathematics.
- **Answer (HI):** इसे मैथमेटिकल री-क्रिएशन (डिटरमिनिस्टिक गणित) कहते हैं। जैसे पूरी दुनिया में बिना इंटरनेट के भी 2 + 2 = 4 ही होता है, ठीक वैसे ही फोन या लैपटॉप पर समान मास्टर सीड और प्लेटफॉर्म का नाम डालने पर स्थानीय क्रिप्टोग्राफिक फॉर्मूला (PBKDF2-HMAC-SHA512) चलता है। दोनों डिवाइस आपस में कोई डेटा ट्रांसफर नहीं करते, बल्कि शुद्ध गणित के जरिए स्वतंत्र रूप से एक ही पासवर्ड बना लेते हैं।

#### Q3: What happens if I forget my Master Secret Key? Can FrankPass recover it? (अगर मैं मास्टर की भूल जाऊं तो क्या FrankPass उसे रिकवर कर सकता है?)
- **Answer (EN):** No. Because FrankPass is 100% zero-knowledge and has no central servers, databases, or hidden backdoors, nobody can recover a lost Master Seed. This is why you must choose a memorable passphrase of at least 6 to 8 words that you can easily remember for life.
- **Answer (HI):** नहीं। चूंकि फ्रैंकपास 100% जीरो-नॉलेज आर्किटेक्चर पर काम करता है और हमारे पास कोई सर्वर, डेटाबेस या बैकडोर नहीं है, इसलिए मास्टर सीड भूल जाने पर कोई भी इसे रिकवर नहीं कर सकता। इसीलिए 6 से 8 शब्दों का ऐसा पासफ्रेज चुनें जिसे आप जिंदगी भर आसानी से याद रख सकें।

#### Q4: Can FrankPass import my existing passwords from Chrome, LastPass, or other cloud managers? (क्या FrankPass मेरे पुराने पासवर्ड Chrome या अन्य पासवर्ड मैनेजर से इंपोर्ट कर सकता है?)
- **Answer (EN):** No, because FrankPass does not store arbitrary pre-existing passwords. If you want to switch to FrankPass, the practical solution is: take 15 to 20 minutes to update your primary accounts with fresh, deterministic passwords generated by FrankPass. Alternatively, you can do it gradually whenever a website asks you to update your password. Once your accounts run on FrankPass, you can completely leave vulnerable cloud vaults behind!
- **Answer (HI):** नहीं, क्योंकि फ्रैंकपास पुराने पासवर्ड स्टोर नहीं करता। इसका सरल उपाय यह है: यदि आप FrankPass पर शिफ्ट होना चाहते हैं, तो 15-20 मिनट का समय निकालकर अपने मुख्य अकाउंट्स का पासवर्ड फ्रैंकपास से न्यू डिटरमिनिस्टिक पासवर्ड बनाकर अपडेट कर लें। या धीरे-धीरे, जब भी किसी वेबसाइट पर पासवर्ड बदलें, फ्रैंकपास का उपयोग करके नया पासवर्ड बनाते जाएं। जब आपके सारे मुख्य अकाउंट्स फ्रैंकपास पर आ जाएं, तब आप पुराने असुरक्षित क्लाउड मैनेजर्स को हमेशा के लिए छोड़ सकते हैं!

#### Q5: What should I do when a website requires changing my password periodically? (जब किसी वेबसाइट पर समय-समय पर पासवर्ड बदलना हो तो क्या करना होगा?)
- **Answer (EN):** You never need to change your Master Seed! Simply open Advanced Options and change the Password Number (Counter) from 1 to any number you like (e.g. 2, 5, 10, or 9999), or pick a Month/Year variant (e.g. Jun 2024, Jan 2026). As long as you remember that simple variation number, you get a fresh unique password for that site!
- **Answer (HI):** मास्टर सीड बदलने की कोई जरूरत नहीं है! बस Advanced Options में जाएं और Password Number (Counter) को 1 से बदलकर अपनी पसंद का कोई भी नंबर (जैसे 2, 5, 10 या जो आसानी से याद रहे) कर दें, या महीने/साल का वेरिएशन चुन लें। जब तक आप वह छोटा नंबर याद रखेंगे, आपको उसी मास्टर सीड से उस साइट के लिए एकदम नया यूनिक पासवर्ड मिल जाएगा!

#### Q6: Is my password safe from clipboard snooping malware? (क्या क्लिपबोर्ड स्नूपिंग मैलवेयर से मेरा पासवर्ड सुरक्षित है?)
- **Answer (EN):** Active clipboard malware can sniff OS clipboard buffers almost instantaneously, which is why an auto-clear timer alone is not a complete shield against compromised machines. FrankPass provides two robust solutions:
  1. On PC, use the FrankPass Browser Extension in a dedicated, clean browser profile: it injects credentials directly into the login input field without ever copying them to the OS clipboard!
  2. On the Web App, an auto-clear timer (15s, 30s, 60s) minimizes exposure, while the Master Seed input blocks copying to prevent master credentials from entering clipboard history tools.
  - **Availability & Feature Requests:** FrankPass is currently available on frankpass.com, PWA (Progressive Web App), and the Windows extension. If you need it on more devices or platforms, let us know on X (Twitter) by mentioning @frankpasshq or @mastermanikant. If you request features that are useful to you or needed by more users, we will add them as soon as possible!
- **Answer (HI):** एक्टिव क्लिपबोर्ड मैलवेयर बहुत तेजी से क्लिपबोर्ड डेटा पढ़ सकता है, इसलिए केवल ऑटो-क्लियर टाइमर ही काफी नहीं होता। इसके लिए फ्रैंकपास दो ठोस समाधान देता है:
  1. पीसी पर, एक अलग साफ ब्राउज़र प्रोफाइल में फ्रैंकपास एक्सटेंशन का उपयोग करें: यह पासवर्ड को क्लिपबोर्ड में भेजे बिना सीधे लॉगिन फील्ड में डायरेक्ट DOM ऑटोफिल करता है!
  2. वेब ऐप पर, 15s/30s/60s का ऑटो-क्लियर टाइमर एक्सपोज़र को कम करता है, और मास्टर की फील्ड पर कॉपी-ब्लॉक लगा है ताकि मास्टर सीड क्लिपबोर्ड हिस्ट्री में न जाए।
  - **उपलब्धता व फीचर रिक्वेस्ट:** फ्रैंकपास वर्तमान में केवल frankpass.com, PWA (प्रोग्रेसिव वेब ऐप), और विंडोज एक्सटेंशन पर उपलब्ध है। यदि आपको अन्य डिवाइसेज या प्लेटफॉर्म्स पर फ्रैंकपास चाहिए, तो X पर @frankpasshq या @mastermanikant को मेंशन करके बताएं। यदि आप ऐसे फीचर्स की मांग करते हैं जो आपके लिए उपयोगी हैं या अधिक यूजर्स को जिनकी आवश्यकता है, तो हम उन्हें जल्द से जल्द प्राथमिकता देकर जोड़ेंगे!

---

## Part 5: Technical SEO, Sitemap & Redirect Cleanup [STATUS: FINALIZED ✅]

1. **Sitemap.xml 301 Redirect Hygiene:**
   - Remove 2 legacy URLs currently causing 301 redirect errors in `sitemap.xml`:
     - `https://frankpass.com/why-stateless-password-generation-is-the-future.html`
     - `https://frankpass.com/why-stateless-password-generation-is-the-future-hindi.html`
   - Both pages are permanently 301 redirected to `/frankpass-vs-cloud-password-vaults.html` and `/frankpass-vs-cloud-password-vaults-hindi.html` in `_redirects`. Only the canonical target URLs must exist in `sitemap.xml`.

2. **Redirect Rule Hygiene (`_redirects` & `pro.html`):**
   - Retain 301 redirect rule in `_redirects`: `/pro.html /pricing.html 301`
   - Ensure `pro.html` provides a fast meta-refresh fallback: `<meta http-equiv="refresh" content="0; url=/pricing.html">`.

3. **Pricing Configuration Parity (`frankpass-config.js`):**
   - Update legacy tiered prices (`silver: 49, gold: 99`) to match true production pricing:
     - `SOLO_LIFETIME: 25.00` (First 500 Early Supporters 1-PC Lifetime Pass)
     - `FREE_WEB_PWA: 0.00` (100% Free Forever)
   - Ensure consistency across `country-pricing.json`, `pricing.html`, and `frankpass-config.js`.

4. **Structured JSON-LD Data Updates:**
   - **WebApplication Schema (`index.html`):**
     - Update name: `FrankPass: Cloudless Password Manager and Deterministic Password Generator`
     - Update operatingSystem: `All (Web, PWA, Windows)`
     - Update applicationCategory: `SecurityApplication`
     - Update description to reflect zero-server deterministic mathematical generation.
   - **FAQPage Schema (`index.html` & `faq.html`):**
     - Inject full `FAQPage` JSON-LD schema containing all 6 strategic Q&As in English, ensuring rich results eligibility in Google Search and AI snippet engines.

---

## Part 6: Profile Page, Vault Security & UX Parity [STATUS: FINALIZED ✅]

1. **30-Second Grace Window on Background Tab Switch (`frankpass-vault.js`):**
   - Currently, `document.addEventListener('visibilitychange')` instantly locks the RAM vault whenever `document.hidden` becomes true.
   - **Improvement:** Introduce a 30-second grace timer when switching away from the tab. If the user returns within 30 seconds (e.g. copying an email, checking 2FA, or reading a URL), the vault remains unlocked in RAM. If away for more than 30 seconds, the vault locks automatically.
   - **Unload Invariant:** Maintain immediate vault wipe on `beforeunload` / `pagehide` to ensure zero persistence across page reloads or window closes.

2. **Master Key Input Copy Protection (`index.html`):**
   - Add `oncopy="return false;" oncut="return false;"` to `#masterPassword` input field.
   - Prevents accidental selection and copying of the master secret key into clipboard snooping malware or clipboard history managers.

3. **Profile Page (`profile.html` & `profile-hindi.html`) Parity:**
   - Confirm status reporting via `FrankPassVault.isConfigured()` and `isUnlocked()` is functioning correctly.
   - Ensure navigation button cleanly guides users to `index.html` to configure or unlock their vault.
   - Verify 0 em-dash violations across profile pages.

---

## Part 7: "Want to connect with us" & Simplified Share Card [STATUS: FINALIZED ✅]

1. **Connect With Us 2-Column Section (Replacing Separate Support Card):**
   - Matches founder's wireframe layout:
     - Outer Header: `Want to connect with us`
     - Subtitle: `Choose the dedicated channel for your updates and discussions.`
     - **Layout:**
       - Desktop/PC: 2 Columns side-by-side (`grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 1.25rem;`).
       - Mobile: Single column, stacked top-to-bottom.
       - Compact, clean design (shrinked by default, minimal vertical footprint).
     - **Box 1 (Left - FrankPass Security & Privacy Focus):**
       - Badge/Heading: `Only for security, privacy, and FrankPass updates follow FrankPass`
       - Action Links:
         - 𝕏 X (Twitter): `https://x.com/frankpasshq`
         - 📷 Instagram: `https://instagram.com/frankpasshq`
         - 💬 Official WhatsApp Broadcast Channel
     - **Box 2 (Right - Master Manikant Ecosystem Focus):**
       - Badge/Heading: `For all our upcoming products and discussions beyond privacy & security`
       - Action Links:
         - 🌐 Personal Website: `https://mastermanikant.com`
         - 𝕏 X (Twitter): `https://x.com/mastermanikant`
         - 💼 LinkedIn: `https://linkedin.com/in/mastermanikant`
         - ▶️ YouTube: `https://youtube.com/@mastermanikant`
         - 📷 Instagram: `https://instagram.com/mastermanikant`
         - 💬 Founder WhatsApp Channel: `https://whatsapp.com/channel/0029VbAmRaDDeON1M7sWY532`

2. **Simplified Share Card:**
   - Single clean card:
     - Title: `Share FrankPass with your friends and family`
     - Subtitle: `Help them switch to mathematical self-custody and zero-stress privacy.`
     - Quick share buttons: WhatsApp, X (Twitter), Facebook, Reddit, Copy Link.

3. **Trust Strip Cleanup:**
   - Remove the redundant Trust Strip section below the generator (as it duplicates the Hero hover cards).

---

## Part 8: "Learn FrankPass in your language" (Ask AI) Single Selector [STATUS: FINALIZED ✅]

1. **Remove "Preferred Script" Dropdown:**
   - Eliminate cognitive friction by asking only for "Your Language" via a smart input with datalist (`Hindi`, `Spanish`, `Tamil`, `French`, `Arabic`, `Bengali`, etc.).

2. **Automatic Native Script Mapping:**
   - Under the hood, the prompt generator automatically maps the language to its native script:
     - Hindi -> Devanagari script (देवनागरी लिपि)
     - Tamil -> Tamil script (தமிழ்)
     - Arabic -> Arabic script (العربية)
     - Bengali -> Bengali script (বাংলা)
     - Russian -> Cyrillic script (Кириллица)
   - Prompt generated for ChatGPT/Gemini/Claude automatically specifies: "Explain FrankPass determinism in [Language] using [Native Script]..." without user having to select scripts.

---

## Part 9: Pricing Card Checkbox Removal & 1-Click Store Button [STATUS: FINALIZED ✅]

1. **Remove Blocking Checkboxes on Landing Card:**
   - Remove the 3 checkboxes (`fp-verify-chk-1`, `fp-verify-chk-2`, `fp-verify-chk-3`) on `index.html` and `pricing.html` that disabled the purchase button.

2. **Transform to Reassuring Assurance Bullets:**
   - Display the 3 points as clear, positive trust bullets:
     - 🛡️ **30-Day Zero-Risk Offline Free Trial:** Test thoroughly on your PC before buying.
     - ⚡ **100% Offline Invariant:** Zero cloud DRM, zero server calls.
     - 💻 **Hardware-Bound 1-PC Lifetime Pass:** Bound to physical motherboard, zero recurring subscriptions.

3. **Always-Active 1-Click Store Link:**
   - The button `⚡ Claim Lifetime Pass on Sovereign Store ↗` is immediately clickable and takes the user directly to `https://store.frankbase.com/software/frankpass/`.
   - Legal checkout terms and conditions are handled seamlessly on the store checkout.

---

## Part 10: Free vs Paid Clarity & Streamlined Comparison Table [STATUS: FINALIZED ✅]

1. **Free vs Paid Clarity Banner (Above/Inside Comparison):**
   - **100% Free Forever ($0 / ₹0):**
     - Web App (`frankpass.com`)
     - Mobile PWA (Progressive Web App)
     - Free Browser Extension (Stealth DOM Autofill & Offline RAM generator)
     - Unlimited password generations, 0 ads, 0 data tracking.
   - **Pro Hardware Pass ($25 Solo Lifetime):**
     - Hardware-Bound 1-PC workstation license
     - Air-gapped offline workstation usage
     - Zero recurring monthly or annual subscriptions.

2. **Comparison Table Streamlining:**
   - Keep all core architectural rows, but format each cell as concise, line-by-line bullet text for quick scanning.
   - Add a direct link at the bottom of the table:
     `📖 Read Full In-Depth Architecture Comparison &rarr; (/frankpass-vs-cloud-password-vaults.html)`

---

## Part 11: Generator Card Toast & Profile Tab-Switch Setting [STATUS: FINALIZED ✅]

1. **Generator Card Top Tip Toast Update:**
   - Replace old text ("5 to 8 words") with actionable security tip:
     `💡 Quick Tip: FrankPass has no server database. If you forget your Secret Key, passwords cannot be recovered. Choose a memorable 6 to 8 word Master Seed, or read the 4-step workflow below first!`
   - Include direct link button `Read 4-Step Guide ↓` that smooth-scrolls to `#how-heading`.
   - Keep `[✖]` dismiss button (persisted in `localStorage.fp_guide_dismissed`).

2. **Profile & Settings Tab-Switch Grace Window Option:**
   - In `profile.html` and `profile-hindi.html` (Section 3), add dropdown:
     - 30 Seconds (Default / Recommended)
     - 60 Seconds (1 Minute)
     - Immediately (0s)
     - Never (Only lock when tab/browser closes)
   - Stored in `localStorage.getItem('fp_tab_lock_delay')` and consumed by `frankpass-vault.js`.

---
