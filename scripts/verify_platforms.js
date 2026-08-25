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

const countryKeys = Object.keys(db);
console.log(`PASS: Loaded ${countryKeys.length} countries.`);

const allUnique = new Set();
let totalEntries = 0;

countryKeys.forEach(k => {
    const list = db[k];
    if (!Array.isArray(list)) {
        console.error(`FAIL: country ${k} is not an array.`);
        process.exit(1);
    }
    totalEntries += list.length;
    list.forEach(item => allUnique.add(item));
});

console.log(`PASS: Total Country-Mapped Entries: ${totalEntries}`);
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
    "Cashfree Payments"
];

console.log('\n--- Checking Key Brand Inclusions ---');
let missingCount = 0;
mustHaveBrands.forEach(brand => {
    // Check in 'in' and 'us'
    const inFound = db['in'] && db['in'].includes(brand);
    const usFound = db['us'] && db['us'].includes(brand);
    if (inFound && usFound) {
        console.log(`  ✓ [FOUND in IN & US] ${brand}`);
    } else {
        console.error(`  ✗ [MISSING] ${brand}`);
        missingCount++;
    }
});

if (missingCount === 0) {
    console.log('\nPASS: All target brands successfully verified in multi-region database!');
} else {
    console.error(`\nFAIL: ${missingCount} target brands were missing.`);
    process.exit(1);
}
