# 🛡️ Guide for Getting Started on the Right Foot in FrankPass
**The Sovereign, Zero-Vault Deterministic Security Standard**

*Adapted from the community philosophy of "Getting Started on the Right Foot", re-engineered for Stateless Mathematics.*  
*Authored by Founder: Master Manikant Yadav (मास्टर मणिकान्त यादव)*  
*Official Ecosystem: [frankpass.com](https://frankpass.com) | [store.frankbase.com](https://store.frankbase.com)*  

---

## The Paradigm Shift: Why Traditional Password Managers Set You Up to Fail

If you are coming from traditional password managers like Bitwarden, 1Password, or LastPass, you have been conditioned to accept unnecessary friction:
* Picking a cloud server (US vs. EU).
* Creating an account with an email address.
* Verifying emails and setting up 2FA or buying hardware YubiKeys.
* Configuring complex Argon2id memory and thread parameters.
* Constantly exporting encrypted JSON vaults and hiding backup passwords.
* Living in fear of cloud server data breaches and paying recurring subscriptions of \$36 to \$60 every year.

**FrankPass eliminates 90% of that friction through Stateless Mathematics.**  
There are **no cloud servers**, **no databases**, **no accounts**, and **no stored password files**. Your passwords do not exist anywhere in the universe until you think of your Master Passphrase. FrankPass calculates your password on the fly inside local RAM using 1,000,000 rounds of PBKDF2-HMAC-SHA512 and immediately wipes it clean.

Follow this guide once to establish unbreakable, lifetime digital sovereignty.

---

## STEP 1: Craft Your Master Secret Key (The 4 Golden Rules for Worldwide Sovereign Passphrases)

Traditional advice tells you to pick random gibberish like `P@$$w0rd!#99` (which you will forget) or standard dictionary phrases like `correct horse battery staple` (which attackers can easily crack with dictionary attacks).

Founder Master Manikant Yadav has formulated the **4 Golden Rules for Worldwide Sovereign Passphrases** on [frankpass.com](https://frankpass.com):

### 1. Personalize with a Real Human Anchor
Include your own name, a family member, a relative, or a close friend's name (e.g., *sohan, rohit, ramesh, elbert, priya*). This anchors the passphrase directly to your personal emotional memory so you never forget it.

### 2. Form an Unrealistic, Absurd Visual Sentence (4 to 7 words)
Cognitive neuroscience proves that the human brain retains bizarre visual imagery for decades with zero effort. Automated cracking tools and AI models rely on logical grammar and common associations. An absurd mental visual is virtually impossible for an algorithm to guess!

### 3. Universal Roman Script (Worldwide QWERTY Invariant)
Whether your native language is English, Hindi, Spanish, Bengali, or German, always formulate your passphrase strictly in the **standard Roman alphabet (`a-z`, `0-9`)**. This ensures you can type your secret effortlessly on any keyboard, phone, airport kiosk, or terminal across the globe without special font packs or IME software.

### 4. Phonetic Clarity (Zero Dialect Confusion)
Strictly avoid ambiguous words that have multiple spelling variants across accents or transliterations (e.g. avoid `sankar` vs `shankar`, `laxmi` vs `lakshmi`, `ph` vs `f`, silent letters). Pick crisp, single-spelling words whose pronunciation and Roman spelling are unmistakable.

#### Viral Meme & Absurd Visual Examples:
* **English:**
  * `my friend sohan will fly on elephant`
  * `my brother elbert drives aeroplane on the road`
  * `uncle ramesh drinks hot tea on moon`
  * `tiger sohan eats pizza under blue water`
* **Romanized Hindi / Multilingual:**
  * `meri nani rohit ke sath chand par chai pi rahi hai`
  * `chacha ramesh cycle se mars par gaye`
  * `mera dost sohan hathi par ud raha hai`

#### The Mathematical Engine Invariant (Whitespace & Symbol Immunity):
In FrankPass, our normalization engine strips all spaces and symbols, and converts everything to lowercase:
`normalizedSecret = (secretKey || '').toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');`
This means `my friend sohan will fly on elephant`, `My Friend Sohan Will Fly On Elephant!`, and `myfriendsohanwillflyonelephant` all produce the exact same unbreakable cryptographic password!

#### 1-Click AI Prompt for ChatGPT, Gemini, or Claude:
```text
You are my private Passphrase Architect for frankpass.com. Help me generate an unbreakable, memorable Master Secret Key.
Rules:
1. Personalize with my family member or friend's name and create an absurd, unrealistic visual sentence (4 to 7 words).
2. Universal Roman Script only: regardless of language, write exclusively in standard Roman lowercase letters (a-z) and numbers (0-9).
3. Phonetic clarity: strictly avoid words with ambiguous transliterations (e.g. avoid shankar/sankar, lakshmi/laxmi).
4. Do not include special symbols or punctuation.
5. Provide 3 hilarious, viral-level absurd options.
6. Remind me to keep my final chosen phrase completely secret!
```

---

## STEP 2: The Physical Sovereign Sheet (Your Only Emergency Backup)

Because FrankPass has no cloud servers and no "Forgot Password" links, **nobody on Earth can recover a lost Master Passphrase**. 

1. **Write it down on paper:** Take a small piece of sturdy paper or an index card. Write down your chosen Master Passphrase clearly.
2. **The 7-Day Muscle Memory Rule:** Place this card inside your desk drawer or private wallet. For the first 7 days, look at the card and type your passphrase manually into FrankPass once a day until your fingers type it automatically via muscle memory.
3. **Store or Destroy:** Once muscle memory is established, store the paper card in a secure home lockbox or sealed envelope. If you are 100% confident in your memory, you can safely destroy it.

---

## STEP 3: Platform Normalization (Type or Paste Full URL)

When you need a password for a website or service:

* **Method A (Short Brand Name):** Simply type the core service name in lowercase: `google`, `amazon`, `github`, `netflix`, `sbi`, `hdfc`.
* **Method B (Paste Full Browser URL):** If you are unsure what the exact seed is, simply copy the full web address from your browser bar (e.g. `https://mail.google.com/mail/u/0/` or `https://retail.onlinesbi.sbi/`) and paste it directly into the Platform input field.

FrankPass includes built-in intelligent normalization that strips `https://`, `www.`, subdomains, and tracking parameters down to the authoritative cryptographic root.

---

## STEP 4: Username (Salt) vs. Counter (Password Rotation)

Many users confuse the **Username** and **Counter** fields. Here is the definitive rule:

### A. When to use the Username field:
* Use this field when you have **Multiple Accounts on the same website**.
* *Example:*
  * Personal Gmail: Platform = `google`, Username = `john.personal@gmail.com`
  * Work Gmail: Platform = `google`, Username = `john.work@company.com`
  * Each distinct username acts as an independent cryptographic salt, producing two entirely different, uncrackable passwords.

### B. When to use the Counter field (1, 2, 3...):
* Use the Counter when a service mandates a password reset (e.g., your bank forces you to change your password every 90 days).
* **Never invent a new password!** Simply change the Counter:
  * Current password: `Counter = 1`
  * Next rotation: `Counter = 2`
  * Future rotation: `Counter = 3`
* The mathematical engine deterministically rotates your password without you having to remember a single new letter.

---

## STEP 5: Generating Deterministic 4 & 6-Digit Banking PINs

Traditional password managers ignore debit card ATM PINs and UPI codes, forcing users to use predictable numbers like their birth year.

1. Navigate to the **PIN Generator tab** on `frankpass.com/pin.html` or in the extension.
2. Enter your Master Passphrase and card identifier (e.g. `sbi debit card` or `phonepe upi`).
3. Select **4 Digits** (for ATM and POS terminals) or **6 Digits** (for UPI, GPay, and Paytm).
4. FrankPass automatically eliminates weak predictable sequences (such as `1234`, `0000`, `1111`, or `7777`), ensuring your financial PINs remain resilient against shoulder surfing.

---

## STEP 6: Browser Extension & Direct DOM Autofill (Defeating Clipboard Sniffers)

Operating system clipboards are notoriously insecure. Rogue background software, Android apps, and malicious browser tabs can silently read whatever you copy to your clipboard.

* **Install the FrankPass Extension:** Available on the official [Chrome Web Store](https://chromewebstore.google.com/detail/frankpass-pro-zero-vault/egkncojopinfjokdpgedkeiodghbifef) and [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/frankpass-pro-zerovaul/cjemmmpglgnchmihjcpdbbocglbphicj).
* **Direct DOM Autofill:** When you click autofill in FrankPass, it injects your password directly into the webpage's Document Object Model (DOM) inputs, **completely bypassing the system clipboard**!

---

## STEP 7: The Airplane Mode Disaster Recovery Test

With cloud password managers, if the company's servers go down, or your account is suspended, you are locked out of your digital life.

**Perform this test to verify your true independence:**
1. Disconnect your computer or phone from Wi-Fi and turn on **Airplane Mode**.
2. Open `frankpass.com` in your browser (or launch the offline PWA).
3. Type your Master Passphrase and platform name.
4. Your exact password will generate instantly in 0.1 seconds without sending a single byte across the internet!

Whether you are in a remote village without cell reception or at an airport terminal, your access is guaranteed by the immutable laws of mathematics.

---

## STEP 8: Choosing Your Tier (Free Forever vs. Hardware-Bound Pro)

FrankPass operates on a zero-server economic model with zero recurring subscription traps:

| Plan | Price | Who It Is For |
| :--- | :--- | :--- |
| **Free Web & Guest Extension** | **$0 Free Forever** | Everyday users who want zero-account deterministic passwords and autofill. |
| **Founder Lifetime Pass (Solo)** | **$25.00 (Pay Once)** | Users who want multi-profile vaults, instant 4-digit quick PIN unlock, and anti-phishing domain isolation bound to their physical PC motherboard. |
| **Volume Bundle (2 to 5 PCs)** | **$17.50 / PC (30% OFF)** | Families and small teams. Each PC receives an independent, air-gapped offline key. |
| **Volume Power Tier (6 to 20 PCs)** | **$12.50 / PC (50% OFF)** | Developers and organizations (Cap: 20 PCs per order). |

### 3 Transparent Support Channels:
1. **The Patron Channel ($25.00):** Full price support for sovereign, ad-free software development.
2. **The Silent Buyer Coupon ($20.00):** Prefer not to post on social media? Apply coupon code **`PRIVACY20`** at checkout on [store.frankbase.com](https://store.frankbase.com) for an instant 20% discount ($20.00 clean math, no .99 tricks).
3. **The Community Advocate Channel ($6.25):** Use the 30-day free trial for 10 days. Post your honest experience on X (Twitter) tagging **`@frankpasshq`** and **`@mastermanikant`**. We will DM you a private 75% off coupon ($6.25 single pass).

---

## The Golden Security Invariant: Kerckhoffs's Principle

> *"A cryptosystem should be secure even if everything about the system, except the key, is public knowledge."*  
> - Auguste Kerckhoffs

If anyone asks what password manager you use, you can freely say **FrankPass**. An attacker knowing that you use FrankPass gains zero advantage: they do not know your mental Master Passphrase, and without that key, the strongest supercomputers on Earth cannot reverse 1,000,000 PBKDF2 rounds.

Your passwords do not live in the cloud. They live in your mind.

---
*© 2026 FrankPass & Master Manikant Yadav. All rights reserved. Sovereign Privacy Architecture.*
