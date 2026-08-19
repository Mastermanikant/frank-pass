# 🗺️ FRANKPASS — मास्टर फ़ोल्डर संरचना एवं परिवर्तन प्रभाव गाइड (Change Impact & Control Guide)

**प्रोजेक्ट नाम:** FrankPass (Stateless & Offline Zero-Knowledge Password Generator)  
**इकोसिस्टम:** Master Manikant / FrankBase Network  
**वर्जन:** `v3.2.3` | **अपडेट तिथि:** 19 अगस्त 2026

---

## 📁 1. मुख्य प्रोजेक्ट संरचना (6 मॉड्यूल्स का विवरण)

```text
D:\01_Websites_and_Content\MMY_Website_Project\07_frankpass.com\
│
├── 01_Website_App/              🚀 [लाइव प्रोडक्शन वेब ऐप - Cloudflare Pages]
│   ├── index.html               (मुख्य होमपेज + लाइव जनरेटर कार्ड + फाउंडर ट्रस्ट कार्ड)
│   ├── install.html             (5 ऑपरेटिंग सिस्टम्स के लिए PWA इंस्टॉलेशन गाइड)
│   ├── get-started.html         (5-मिनट क्विक स्टार्ट और पासवर्ड क्रिएशन ट्यूटोरियल)
│   ├── docs.html                (मैथमेटिकल डॉक्युमेंटेशन और क्रिप्टोग्राफ़िक थ्योरी)
│   ├── faq.html                 (12 सबसे महत्वपूर्ण सुरक्षा सवाल और उनके जवाब)
│   ├── about-us.html            (फाउंडर मास्टर मणिकांत की कहानी और ओरिजिन स्टोरी)
│   ├── pro.html                 (FrankPass Pro एक्सटेंशन फीचर्स और लाइफटाइम डील्स)
│   ├── legal.html               (प्राइवेसी पॉलिसी, टर्म्स ऑफ सर्विस और डिस्क्लेमर)
│   │
│   ├── frankpass-config.js      ⚙️ [सेंट्रल कंट्रोलर: प्राइजिंग, सेल, डिस्काउंट, सोशल लिंक्स]
│   ├── frankpass-core.js        🔐 [क्रिप्टो इंजन: PBKDF2-HMAC-SHA512 (10 लाख इटरेशन)]
│   ├── frankpass-utils.js       🛠️ [ब्रांड नॉर्मलाइजेशन, डोमेन एक्सट्रैक्शन और क्लिपबोर्ड टूल्स]
│   ├── country-data.js          🌍 [195 देशों का मास्टर डेटा और कंट्री कोड्स]
│   ├── country-dropdown.js      🚩 [सर्च-सक्षम कंट्री ड्रॉपडाउन और लोकल फ्लैग हैंडलर]
│   ├── footer.js                🦶 [ग्लोबल शेयर्ड फुटर, सोशल लिंक्स और थीम कंट्रोलर]
│   ├── style.css                🎨 [ग्लोबल डार्क/लाइट थीम, ग्लास-मॉर्फिज़्म, रिस्पॉन्सिव लेआउट]
│   ├── service-worker.js        ⚡ [100% ऑफलाइन PWA कैशिंग और एसेट मैनेजमेंट]
│   │
│   ├── _headers                 🛡️ [Cloudflare Edge सिक्योरिटी हेडर्स, CSP, HSTS]
│   ├── _redirects               🔀 [क्लाउडफ्लेयर यूआरएल शॉर्टकट्स: /pro, /docs, /faq आदि]
│   ├── robots.txt               🤖 [सर्च इंजन क्रॉलर और बॉट गवर्नेंस रूल्स]
│   ├── sitemap.xml              🗺️ [XML साइटमैप - इंडेक्स होने वाले पेजेस की सूची]
│   ├── llms.txt                 🧠 [AI सर्च इंजनों (ChatGPT, Claude, Gemini) के लिए नॉलेज गाइड]
│   ├── manifest.json            📱 [PWA वेब ऐप मैनिफेस्ट और इंस्टॉलेशन सेटिंग्स]
│   │
│   ├── flags/                   🚩 [195 देशों के हाई-स्पीड लोकल PNG फ्लैग्स (Offline Ready)]
│   └── icons/                   🖼️ [PWA आइकन्स (192px, 512px) और फाउंडर फोटो]
│
├── 02_Browser_Extensions/       🧩 [Chrome और Firefox ब्राउज़र एक्सटेंशन कोड (v2.3.0)]
├── 03_Security_Ebooks/          📚 [Cybersecurity Masterclass & Free Guides (EN, HI, DE, ES, AR)]
├── 04_Strategy_and_Docs/        📑 [बिजनेस स्ट्रैटेजी, Dodo ऑनबोर्डिंग चेकलिस्ट और जर्नी लॉग्स]
├── 05_Designs_and_Branding/     🎨 [सोशल मीडिया बैनर्स, YouTube/X/Facebook ग्राफिक्स]
└── 06_DevOps_and_Scripts/       ⚙️ [Wrangler डिप्लॉयमेंट ऑटोमेशन और बिल्ड स्क्रिप्ट्स]
```

---

## 🧭 2. "कहाँ बदलने से क्या बदलाव होगा?" (Change Impact Matrix)

यदि आप भविष्य में किसी भी चीज़ को अपडेट करना चाहते हैं, तो नीचे दी गई तालिका से तुरंत समझें कि किस फाइल को एडिट करना है:

| आप क्या बदलना चाहते हैं? | किस फ़ाइल में बदलाव करना है? | प्रभाव और विवरण (Impact) |
|:---|:---|:---|
| **सेल / डिस्काउंट / प्रो प्राइजिंग** | `frankpass-config.js` | • `LAUNCH_SALE_END_DATE` बदलने से प्रो पेज और बैनर की उल्टी गिनती (Timer) अपडेट होगी।<br>• `PRICES.INDIA` या `GLOBAL` बदलने से पूरी वेबसाइट पर प्रो प्लान्स की कीमतें स्वतः बदल जाएंगी। |
| **सोशल मीडिया हैंडल्स (@frankpasshq)** | `frankpass-config.js` | • `SOCIAL.X`, `INSTAGRAM`, `YOUTUBE` आदि अपडेट करने से हेडर, फुटर और सोशल शेयर बार के लिंक्स एक साथ बदल जाएंगे। |
| **Dodo Payments लाइव चेकआउट लिंक्स** | `frankpass-config.js` | • `PAYMENT_LINKS.STANDARD` और `SALE` के अंदर लाइव Dodo URLs डालने से Pro पेज के बाय बटन्स सीधे पेमेंट गेटवे पर ले जाएंगे। |
| **ग्लोबल फुटर लेआउट या सोशल आइकन्स** | `footer.js` | • फुटर के टेक्स्ट, WhatsApp बैनर, कॉपीराइट वर्ष या PWA इंस्टॉल बार में बदलाव सभी 8 पेजेस पर एक साथ लागू होगा। |
| **वेबसाइट का रंग, फॉन्ट या डार्क/लाइट थीम** | `style.css` | • `:root` और `[data-theme="light"]` के CSS वेरिएबल्स (`--bg-primary`, `--accent`, `--text-primary`) बदलने से पूरी वेबसाइट का थीम लुक बदलेगा। |
| **कंट्री लिस्ट या नए देश के फ्लैग्स जोड़ना** | `country-data.js` & `flags/` | • `country-data.js` में नया देश जोड़ने और `flags/` में उसका PNG डालने से सर्च ड्रॉपडाउन में नया देश उपलब्ध हो जाएगा। |
| **शॉर्ट यूआरएल या पेज रीडायरेक्ट्स** | `_redirects` | • `/pro -> /pro.html`, `/docs -> /docs.html` जैसे क्लीन यूआरएल और रीडायरेक्शन नियम यहाँ से तय होते हैं। |
| **सुरक्षा नीतियां (CSP) और कैशिंग** | `_headers` | • Cloudflare Edge पर Content Security Policy, X-Frame-Options, और HSTS सुरक्षा नियम यहाँ से बदलते हैं। |
| **सर्च इंजन और AI डिस्कवरी** | `robots.txt`, `sitemap.xml`, `llms.txt` | • गूगल, बिंग और AI इंजनों (Perplexity, ChatGPT) को वेबसाइट की प्रामाणिक जानकारी और इंडेक्सेशन अनुमतियाँ मिलती हैं। |
| **PWA ऐप का नाम, आइकॉन और बैकग्राउंड** | `manifest.json` | • जब कोई यूजर मोबाइल पर "Add to Home Screen" करता है, तो दिखने वाला ऐप आइकॉन, नाम और स्प्लैश बैकग्राउंड यहाँ से तय होता है। |
| **ऑफलाइन कैशे और वर्जन अपडेट** | `service-worker.js` | • `CACHE_NAME = 'frankpass-v3.2.3'` का वर्जन नंबर बढ़ाने से यूज़र्स के पुराने ब्राउज़र कैशे तुरंत नए कोड से रिफ्रेश हो जाते हैं। |

---

## ⚠️ 3. सख्त चेतावनी: क्या कभी नहीं बदलना चाहिए? (DANGER ZONE)

### 🔴 `frankpass-core.js` (क्रिप्टोग्राफिक इंजन):
- **नियम:** इस फ़ाइल के अंदर **PBKDF2-HMAC-SHA512**, **10,00,000 इटरेशन**, और **साल्ट डेरिवेशन फॉर्मूला** को **कभी भी एडिट या ऑप्टिमाइज़ न करें**।
- **कारण:** यदि इस फ़ाइल का गणित बदला गया, तो दुनिया भर के यूज़र्स द्वारा पहले से जनरेट किए गए पासवर्ड्स हमेशा के लिए बदल जाएंगे और वे अपने अकाउंट्स से लॉक हो जाएंगे!

---

## 🚀 4. लोकल Git और लाइव डिप्लॉयमेंट कमांड्स

1. **लोकल कमिट:**
   ```bash
   git add .
   git commit -m "feat/fix: descriptive commit message"
   ```
2. **GitHub पुश:**
   ```bash
   git push origin main
   ```
3. **Cloudflare Pages लाइव डिप्लॉय (Wrangler):**
   ```bash
   npx wrangler pages deploy "D:\01_Websites_and_Content\MMY_Website_Project\07_frankpass.com\01_Website_App" --project-name=frankpass --branch=main
   ```
