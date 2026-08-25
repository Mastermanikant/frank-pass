const fs = require('fs');
const path = require('path');

const PLATFORMS_JS_PATH = path.join(__dirname, '..', 'platforms.js');

console.log('=== Running FrankPass Platform Verification Test ===');

const content = fs.readFileSync(PLATFORMS_JS_PATH, 'utf8');
const sandbox = {};
eval(content.replace('window.', 'sandbox.'));

const db = sandbox.regionalPlatforms;
if (!db || typeof db !== 'object') {
    console.error('FAIL: regionalPlatforms is not defined properly.');
    process.exit(1);
}

const keys = Object.keys(db);
const countryKeys = keys.filter(k => k !== 'Global');
console.log(`PASS: Loaded ${countryKeys.length} countries + 1 Global repository.`);

const allUnique = new Set();
let totalEntries = 0;

keys.forEach(k => {
    const list = db[k];
    if (!Array.isArray(list)) {
        console.error(`FAIL: key ${k} is not an array.`);
        process.exit(1);
    }
    totalEntries += list.length;
    list.forEach(item => allUnique.add(item));
});

console.log(`PASS: Total Array Entries: ${totalEntries}`);
console.log(`PASS: Total Unique Platforms: ${allUnique.size}`);

// Required key brand checks
const mustHaveBrands = [
    "Dodo Payments",
    "Lemon Squeezy",
    "Stripe",
    "Paddle",
    "FastSpring",
    "Adyen",
    "Wise (TransferWise)",
    "PayPal",
    "FrankBase (frankbase.com)",
    "FrankPass (frankpass.com)",
    "Master Manikant (mastermanikant.com)",
    "English Vidya (englishvidya.com)",
    "OpenAI",
    "ChatGPT",
    "Anthropic Claude",
    "Google Gemini",
    "DeepSeek",
    "Cloudflare",
    "GitHub",
    "Razorpay",
    "Cashfree Payments",
    "State Bank of India (SBI)",
    "HDFC Bank",
    "ICICI Bank"
];

console.log('\n--- Checking Key Brand Inclusions ---');
let missingCount = 0;

// Helper to simulate getPrettyNameFromDB
function findInDB(brand) {
    for (let region in db) {
        if (db[region].includes(brand)) return true;
    }
    return false;
}

// Helper to simulate populatePlatformDatalist
function getCountryDatalist(countryCode) {
    const combined = new Set();
    const targetCode = countryCode.toLowerCase();
    const searchKeys = ['Global'];
    if (db[targetCode]) searchKeys.unshift(targetCode);
    searchKeys.forEach(k => {
        (db[k] || []).forEach(item => combined.add(item));
    });
    return Array.from(combined);
}

mustHaveBrands.forEach(brand => {
    const exists = findInDB(brand);
    const inIndiaList = getCountryDatalist('in').includes(brand);
    const inUSList = getCountryDatalist('us').includes(brand);
    
    if (exists && inIndiaList && inUSList) {
        console.log(`  ✓ [FOUND & ACTIVE in IN & US] ${brand}`);
    } else {
        console.error(`  ✗ [MISSING] ${brand} (exists: ${exists}, inIndia: ${inIndiaList}, inUS: ${inUSList})`);
        missingCount++;
    }
});

if (missingCount === 0) {
    console.log('\nPASS: All target brands successfully verified in multi-region database!');
} else {
    console.error(`\nFAIL: ${missingCount} target brands were missing.`);
    process.exit(1);
}
