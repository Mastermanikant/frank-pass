const fs = require('fs');
const path = require('path');
const { webcrypto } = require('crypto');
if (!global.crypto) global.crypto = webcrypto;

// Load Core
const coreCode = fs.readFileSync(path.join(__dirname, '..', 'frankpass-core.js'), 'utf8');
eval(coreCode.replace('const FRANKPASS_CORE =', 'global.FRANKPASS_CORE ='));

// Load Web Utils
const utilsCode = fs.readFileSync(path.join(__dirname, '..', 'frankpass-utils.js'), 'utf8');
eval(utilsCode.replace('const FrankPassUtils =', 'global.FrankPassUtils ='));

// Load Extension Utils
const extUtilsCode = fs.readFileSync(path.join(__dirname, '..', '..', '02_Browser_Extensions', 'source', 'frankpass-utils.js'), 'utf8');
eval(extUtilsCode.replace('const FrankPassUtils =', 'global.ExtUtils ='));

async function runComparison() {
    const testCases = [
        {
            name: 'SBI YONO Business URL (Corporate Banking)',
            secretKey: 'MasterSecretKey2026!',
            platformRaw: 'https://yonobusiness.sbi.bank.in/yonobusinesslogin',
            username: 'master 134803',
            counter: 1,
            length: 16,
            profile: 'standard'
        },
        {
            name: 'SBI Retail NetBanking URL',
            secretKey: 'MasterSecretKey2026!',
            platformRaw: 'https://retail.onlinesbi.sbi/retail/login.htm',
            username: 'master 134803',
            counter: 1,
            length: 16,
            profile: 'standard'
        },
        {
            name: 'Google Accounts SSO',
            secretKey: 'MasterSecretKey2026!',
            platformRaw: 'https://accounts.google.com/signin',
            username: 'mastermanikant',
            counter: 1,
            length: 20,
            profile: 'alphanumeric'
        },
        {
            name: 'HDFC Corporate Banking',
            secretKey: 'MasterSecretKey2026!',
            platformRaw: 'https://corporatebanking.hdfcbank.bank.in',
            username: 'corp_user_99',
            counter: 1,
            length: 16,
            profile: 'standard'
        },
        {
            name: 'ATM / UPI 6-Digit PIN',
            secretKey: 'MasterSecretKey2026!',
            platformRaw: 'https://yonobusiness.sbi.bank.in/yonobusinesslogin',
            username: 'master 134803',
            counter: 1,
            length: 6,
            profile: 'numeric'
        }
    ];

    console.log('========================================================================');
    console.log('  🔍 FRANKPASS WEB APP VS BROWSER EXTENSION SEED COMPARISON AUDIT');
    console.log('========================================================================\n');

    let allMatch = true;

    for (const tc of testCases) {
        const webSlug = global.FrankPassUtils.getNormalizedPlatform(tc.platformRaw);
        const extSlug = global.ExtUtils.getNormalizedPlatform(tc.platformRaw);

        const webPass = await global.FRANKPASS_CORE.generatePassword({
            secretKey: tc.secretKey,
            platform: webSlug,
            username: tc.username,
            variant: tc.counter,
            length: tc.length,
            profile: tc.profile
        });

        const extPass = await global.FRANKPASS_CORE.generatePassword({
            secretKey: tc.secretKey,
            platform: extSlug,
            username: tc.username,
            variant: tc.counter,
            length: tc.length,
            profile: tc.profile
        });

        const isMatch = (webSlug === extSlug) && (webPass === extPass);
        if (!isMatch) allMatch = false;

        console.log(`Case: ${tc.name}`);
        console.log(`  Input URL : ${tc.platformRaw}`);
        console.log(`  Username  : "${tc.username}" | Counter: ${tc.counter} | Profile: ${tc.profile} (${tc.length} chars)`);
        console.log(`  Web App   : slug = "${webSlug}" -> Password: ${webPass}`);
        console.log(`  Extension : slug = "${extSlug}" -> Password: ${extPass}`);
        console.log(`  STATUS    : ${isMatch ? '✅ 100% PERFECT MATCH' : '❌ MISMATCH'}\n`);
    }

    console.log('========================================================================');
    console.log(`  FINAL VERDICT: ${allMatch ? '🎉 ALL PASSWORDS & SEEDS 100% IDENTICAL' : '❌ REGRESSION DETECTED'}`);
    console.log('========================================================================');
}

runComparison();
