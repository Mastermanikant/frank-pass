# Guide to Add New Platform Names to FrankPass

FrankPass uses a deterministic auto-suggestion system for platforms. This ensures that whether a user typos "Amazon" or "amazon.in", they get the same strong, unique password.

Follow these steps to add a new platform to the database.

## 📁 File Location
The platform database is stored in:
`platforms.js` (Root directory)

---

## 🛠️ Step-by-Step Instructions

### 1. Open `platforms.js`
The file contains a large array named `PLATFORMS`. Each entry is a string representing a domain or professional platform name (e.g., `google.com`, `facebook`, `x.com`).

### 2. Prepare the String
Ensure the name is:
- **Lowercase** (though the code handles case-insensitivity, lowercase is the standard).
- **Domain-based** (e.g., `netflix.com` is better than just `netflix`).
- **No spaces** (unless it's a specific brand name).

### 3. Add to the Array
Search for the alphabetical section if you want to keep it organized (optional but recommended). Add your new entry in quotes:

```javascript
// Example: Adding "spotify.com"
const PLATFORMS = [
    "google.com",
    "facebook.com",
    "spotify.com", // Your addition
    // ... thousands of other entries
];
```

### 4. Special "Search" Optimization
If you want multiple keywords to point to the same site, add them as separate entries.
**Example:**
Add both `binance.com` and `binance` so the user is guided to the official domain.

---

## 🧪 Testing Your Changes
1. Save the file.
2. Open `index.html` in your browser.
3. Start typing your new platform in the **"Platform or Website"** field.
4. It should appear in the dropdown list automatically!

---

## 🔒 Security Note
Adding a platform name does **not** change the security of the password. It only helps the user with **UI normalization**. Even if a platform isn't in the list, FrankPass will still generate a secure password for it!

---

*Last Updated for FrankPass V2.2.2*
