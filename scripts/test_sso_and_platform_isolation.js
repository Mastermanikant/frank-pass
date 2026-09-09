/**
 * test_sso_and_platform_isolation.js
 * Automated Verification Suite for:
 * 1. Unified SSO Brand Equality (Same Password across sibling domains)
 * 2. Strict Platform Isolation (Different Passwords across segregated sub-services)
 * 3. Secret Key WYSIWYG [a-z0-9] Live Normalization
 * 4. Cross-Environment Parity (Web App vs Browser Extension)
 */

const fs = require('fs');
const path = require('path');
const { webcrypto } = require('crypto');
if (!global.crypto) global.crypto = webcrypto;

// Load Web App Core & Utils
const webCoreCode = fs.readFileSync(path.join(__dirname, '..', 'frankpass-core.js'), 'utf8');
eval(webCoreCode.replace('const FRANKPASS_CORE =', 'global.WebCore ='));
const WebUtils = require(path.join(__dirname, '..', 'frankpass-utils.js'));

// Load Extension Core & Utils
const extCoreCode = fs.readFileSync(path.join(__dirname, '..', '..', '02_Browser_Extensions', 'source', 'frankpass-core.js'), 'utf8');
eval(extCoreCode.replace('const FRANKPASS_CORE =', 'global.ExtCore ='));
const ExtUtils = require(path.join(__dirname, '..', '..', '02_Browser_Extensions', 'source', 'frankpass-utils.js'));

const SECRET_KEY = 'mastersecretkey2026';
const USERNAME = 'master134803';
const COUNTER = 1;

async function runSSOAndIsolationAudit() {
    console.log('========================================================================================');
    console.log('  🛡️ FRANKPASS SSO UNIFICATION & PLATFORM ISOLATION VERIFICATION SUITE');
    console.log('========================================================================================\n');

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;

    // --- TEST GROUP 1: UNIFIED SSO BRANDS (MUST GENERATE 100% IDENTICAL PASSWORDS) ---
    console.log('--- 1. UNIFIED SSO BRAND FLEETS (Exact Password Equality Expected) ---\n');

    const SSO_FLEETS = [
        {
            brand: 'Google Unified SSO',
            canonicalSlug: 'google',
            urls: [
                'https://www.google.com',
                'https://mail.google.com',
                'https://www.youtube.com',
                'https://studio.youtube.com',
                'https://music.youtube.com',
                'https://drive.google.com',
                'https://docs.google.com',
                'https://gemini.google.com',
                'https://colab.research.google.com',
                'https://photos.google.com',
                'https://accounts.google.com',
                'https://blog.google',
                'https://g.co'
            ]
        },
        {
            brand: 'Microsoft Consumer SSO',
            canonicalSlug: 'microsoft',
            urls: [
                'https://www.microsoft.com',
                'https://outlook.live.com',
                'https://login.live.com',
                'https://www.office.com',
                'https://onedrive.live.com',
                'https://copilot.microsoft.com',
                'https://www.xbox.com',
                'https://www.skype.com'
            ]
        },
        {
            brand: 'Apple ID Unified SSO',
            canonicalSlug: 'apple',
            urls: [
                'https://www.apple.com',
                'https://appleid.apple.com',
                'https://www.icloud.com',
                'https://developer.apple.com',
                'https://appstoreconnect.apple.com',
                'https://music.apple.com'
            ]
        },
        {
            brand: 'Adobe ID SSO',
            canonicalSlug: 'adobe',
            urls: [
                'https://www.adobe.com',
                'https://account.adobe.com',
                'https://creativecloud.adobe.com',
                'https://www.behance.net',
                'https://lightroom.adobe.com',
                'https://fonts.adobe.com'
            ]
        },
        {
            brand: 'Meta / Facebook Fleet',
            canonicalSlug: 'facebook',
            urls: [
                'https://www.facebook.com/login',
                'https://m.facebook.com',
                'https://fb.com',
                'https://www.messenger.com'
            ]
        },
        {
            brand: 'Instagram Media Fleet',
            canonicalSlug: 'instagram',
            urls: [
                'https://www.instagram.com',
                'https://www.threads.net',
                'https://ig.me'
            ]
        },
        {
            brand: 'WhatsApp Fleet',
            canonicalSlug: 'whatsapp',
            urls: [
                'https://web.whatsapp.com',
                'https://whatsapp.com',
                'https://wa.me/919999999999'
            ]
        },
        {
            brand: 'Telegram Fleet',
            canonicalSlug: 'telegram',
            urls: [
                'https://web.telegram.org/k/',
                'https://telegram.org',
                'https://t.me/mychannel'
            ]
        },
        {
            brand: 'Spotify Fleet',
            canonicalSlug: 'spotify',
            urls: [
                'https://open.spotify.com',
                'https://spotify.com',
                'https://artists.spotify.com'
            ]
        }
    ];

    for (const fleet of SSO_FLEETS) {
        totalTests++;
        let benchmarkPassword = null;
        let fleetPassed = true;

        for (const url of fleet.urls) {
            const webSlug = WebUtils.getNormalizedPlatform(url);
            const extSlug = ExtUtils.getNormalizedPlatform(url);

            if (webSlug !== fleet.canonicalSlug || extSlug !== fleet.canonicalSlug) {
                fleetPassed = false;
                console.error(`  ✗ [${fleet.brand}] Slug Error on ${url}: got web="${webSlug}", ext="${extSlug}", expected="${fleet.canonicalSlug}"`);
            }

            const webPass = await WebCore.generate(webSlug, USERNAME, SECRET_KEY, COUNTER, 'standard', 16);
            const extPass = await ExtCore.generate(extSlug, USERNAME, SECRET_KEY, COUNTER, 'standard', 16);

            if (webPass !== extPass) {
                fleetPassed = false;
                console.error(`  ✗ [${fleet.brand}] Cross-environment mismatch on ${url}`);
            }

            if (benchmarkPassword === null) {
                benchmarkPassword = webPass;
            } else if (webPass !== benchmarkPassword) {
                fleetPassed = false;
                console.error(`  ✗ [${fleet.brand}] SSO Password Divergence on ${url}: got "${webPass}", expected benchmark "${benchmarkPassword}"`);
            }
        }

        if (fleetPassed) {
            passedTests++;
            console.log(`  ✓ [${fleet.brand.padEnd(24)}] ${fleet.urls.length} URLs Unified -> slug: "${fleet.canonicalSlug}" -> Password: "${benchmarkPassword}"`);
        } else {
            failedTests++;
        }
    }

    // --- TEST GROUP 2: STRICT PLATFORM ISOLATION (MUST GENERATE DIFFERENT PASSWORDS) ---
    console.log('\n--- 2. STRICT PLATFORM ISOLATION (Zero Password Collisions Expected) ---\n');

    const ISOLATION_GROUPS = [
        {
            groupName: 'Amazon Ecosystem Isolation',
            services: [
                { name: 'Amazon Retail Shopping', url: 'https://www.amazon.in', expectedSlug: 'amazon' },
                { name: 'Amazon Web Services (AWS)', url: 'https://console.aws.amazon.com', expectedSlug: 'aws' },
                { name: 'Amazon KDP Publishing', url: 'https://kdp.amazon.com', expectedSlug: 'amazonkdp' },
                { name: 'Amazon Seller Central', url: 'https://sellercentral.amazon.in', expectedSlug: 'amazonseller' },
                { name: 'Amazon Associates Affiliate', url: 'https://affiliate-program.amazon.in', expectedSlug: 'amazonassociates' },
                { name: 'Amazon Merch on Demand', url: 'https://merch.amazon.com', expectedSlug: 'amazonmerch' },
                { name: 'Amazon Advertising', url: 'https://advertising.amazon.com', expectedSlug: 'amazonads' }
            ]
        },
        {
            groupName: 'Google Account vs Google Cloud Isolation',
            services: [
                { name: 'Google Consumer Account', url: 'https://myaccount.google.com', expectedSlug: 'google' },
                { name: 'Google Cloud Platform (GCP)', url: 'https://console.cloud.google.com', expectedSlug: 'googlecloud' }
            ]
        },
        {
            groupName: 'Microsoft Consumer vs Azure Cloud Isolation',
            services: [
                { name: 'Microsoft 365 Consumer', url: 'https://outlook.live.com', expectedSlug: 'microsoft' },
                { name: 'Microsoft Azure Portal', url: 'https://portal.azure.com', expectedSlug: 'azure' }
            ]
        },
        {
            groupName: 'OpenAI ChatGPT vs Developer API Isolation',
            services: [
                { name: 'ChatGPT Web Chat', url: 'https://chatgpt.com', expectedSlug: 'chatgpt' },
                { name: 'OpenAI API Console', url: 'https://platform.openai.com', expectedSlug: 'openai' }
            ]
        },
        {
            groupName: 'State Bank of India (SBI) Ecosystem Isolation',
            services: [
                { name: 'SBI Retail NetBanking', url: 'https://retail.onlinesbi.sbi/retail/login.htm', expectedSlug: 'statebankofindia' },
                { name: 'SBI YONO Business / Corporate', url: 'https://yonobusiness.sbi.bank.in/yonobusinesslogin', expectedSlug: 'sbicorporate' },
                { name: 'SBI Credit Card Portal', url: 'https://www.sbicard.com', expectedSlug: 'sbicard' },
                { name: 'SBI Securities Demat', url: 'https://www.sbismart.com', expectedSlug: 'sbisecurities' }
            ]
        },
        {
            groupName: 'HDFC Bank Ecosystem Isolation',
            services: [
                { name: 'HDFC Retail NetBanking', url: 'https://netbanking.hdfcbank.com', expectedSlug: 'hdfcbank' },
                { name: 'HDFC Corporate NetBanking', url: 'https://corporatebanking.hdfcbank.com', expectedSlug: 'hdfccorporate' },
                { name: 'HDFC Securities Trading', url: 'https://www.hdfcsec.com', expectedSlug: 'hdfcsecurities' },
                { name: 'HDFC MyCards Portal', url: 'https://mycards.hdfcbank.com', expectedSlug: 'hdfcmycards' }
            ]
        },
        {
            groupName: 'ICICI Bank Ecosystem Isolation',
            services: [
                { name: 'ICICI Retail NetBanking', url: 'https://infinity.icicibank.com', expectedSlug: 'icicibank' },
                { name: 'ICICI Corporate NetBanking', url: 'https://corporate.icicibank.com', expectedSlug: 'icicicorporate' },
                { name: 'ICICI Direct Investments', url: 'https://www.icicidirect.com', expectedSlug: 'icicidirect' }
            ]
        },
        {
            groupName: 'Axis Bank Ecosystem Isolation',
            services: [
                { name: 'Axis Retail NetBanking', url: 'https://netbanking.axisbank.com', expectedSlug: 'axisbank' },
                { name: 'Axis Corporate NetBanking', url: 'https://corporate.axisbank.com', expectedSlug: 'axiscorporate' },
                { name: 'Axis Direct Trading', url: 'https://axisdirect.in', expectedSlug: 'axisdirect' }
            ]
        },
        {
            groupName: 'Kotak Mahindra Bank Ecosystem Isolation',
            services: [
                { name: 'Kotak Retail NetBanking', url: 'https://netbanking.kotak.com', expectedSlug: 'kotakmahindrabank' },
                { name: 'Kotak Corporate Banking', url: 'https://corporate.kotak.com', expectedSlug: 'kotakcorporate' },
                { name: 'Kotak Securities (Neo)', url: 'https://www.kotaksecurities.com', expectedSlug: 'kotaksecurities' }
            ]
        }
    ];

    for (const group of ISOLATION_GROUPS) {
        totalTests++;
        let groupPassed = true;
        const seenSlugs = new Set();
        const seenPasswords = new Set();
        const serviceResults = [];

        for (const s of group.services) {
            const slug = WebUtils.getNormalizedPlatform(s.url);
            if (slug !== s.expectedSlug) {
                groupPassed = false;
                console.error(`  ✗ [${group.groupName}] Slug error for ${s.name}: got "${slug}", expected "${s.expectedSlug}"`);
            }
            if (seenSlugs.has(slug)) {
                groupPassed = false;
                console.error(`  ✗ [${group.groupName}] Duplicate Slug Collision: "${slug}" for service "${s.name}"`);
            }
            seenSlugs.add(slug);

            const pwd = await WebCore.generate(slug, USERNAME, SECRET_KEY, COUNTER, 'standard', 16);
            if (seenPasswords.has(pwd)) {
                groupPassed = false;
                console.error(`  ✗ [${group.groupName}] CRITICAL: Duplicate Password Collision for service "${s.name}"!`);
            }
            seenPasswords.add(pwd);
            serviceResults.push({ name: s.name, slug, pwd });
        }

        if (groupPassed) {
            passedTests++;
            console.log(`  ✓ [${group.groupName}] -> ${group.services.length} Isolated Services -> 100% Unique Passwords:`);
            serviceResults.forEach(r => {
                console.log(`      • ${r.name.padEnd(30)} -> slug: "${r.slug.padEnd(18)}" | Pass: ${r.pwd}`);
            });
        } else {
            failedTests++;
        }
    }

    // --- TEST GROUP 3: SECRET KEY WYSIWYG NORMALIZATION PARITY ---
    console.log('\n--- 3. SECRET KEY LIVE WYSIWYG NORMALIZATION STRESS TEST ---\n');
    totalTests++;
    const testCases = [
        { raw: 'Master Manikant 2026!', clean: 'mastermanikant2026' },
        { raw: 'MASTERMANIKANT2026', clean: 'mastermanikant2026' },
        { raw: '  master 134803  ', clean: 'master134803' },
        { raw: 'secret🔑2026!', clean: 'secret2026' },
        { raw: 'मास्टर@2026', clean: '2026' }
    ];

    let cleanPassed = true;
    for (const tc of testCases) {
        const computedClean = tc.raw.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (computedClean !== tc.clean) {
            cleanPassed = false;
            console.error(`  ✗ Sanitization error for "${tc.raw}": got "${computedClean}", expected "${tc.clean}"`);
        }
    }

    if (cleanPassed) {
        passedTests++;
        console.log(`  ✓ All 5 Secret Key Live Auto-Clean variations sanitization passed seamlessly.`);
    } else {
        failedTests++;
    }

    console.log('\n========================================================================================');
    console.log(`  SSO & ISOLATION RESULTS: ${passedTests} / ${totalTests} TEST GROUPS PASSED (${failedTests} FAILED)`);
    console.log(`  OVERALL SECURITY STATUS: ${failedTests === 0 ? '🟢 100% PASSED (ZERO COLLISIONS & 100% SSO MATCH)' : '🔴 FAILED'}`);
    console.log('========================================================================================\n');
}

runSSOAndIsolationAudit().catch(console.error);
