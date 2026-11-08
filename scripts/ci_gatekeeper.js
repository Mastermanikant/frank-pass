/**
 * ci_gatekeeper.js - Master Pre-Commit, Pre-Push & CI Production Gatekeeper
 * 
 * Strict 3-Phase Automated Verification:
 * Phase 1: Full JavaScript & HTML Inline Script Syntax Verification
 * Phase 2: Critical UI / DOM Contract & Element Integrity
 * Phase 3: Deterministic Cryptographic Golden Vectors Invariance Gate
 * 
 * If ANY check fails, process exits with code 1, aborting commit/push/deploy.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
let failures = 0;

console.log('================================================================');
console.log('  🛡️  FRANKPASS MASTER PRODUCTION & CI GATEKEEPER');
console.log('================================================================\n');

// -------------------------------------------------------------
// PHASE 1: JAVASCRIPT SYNTAX & INLINE SCRIPT VERIFICATION
// -------------------------------------------------------------
console.log('Phase 1: Validating JavaScript Syntax across all files and HTML...');
const jsFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.js'));
let jsErrors = 0;

jsFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    const code = fs.readFileSync(filePath, 'utf8');
    try {
        new vm.Script(code, { filename: file });
    } catch (err) {
        console.error(`  ❌ [SYNTAX ERROR in JS] ${file}: ${err.message}`);
        jsErrors++;
        failures++;
    }
});

const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
let inlineErrors = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    let idx = 0;

    while ((match = scriptRegex.exec(content)) !== null) {
        idx++;
        const fullTag = match[0];
        const code = match[1].trim();

        if (fullTag.includes('application/ld+json') || fullTag.includes('type="application/json"')) continue;
        if (!code) continue;

        try {
            new vm.Script(code, { filename: `${file}#script${idx}` });
        } catch (err) {
            console.error(`  ❌ [SYNTAX ERROR in HTML] ${file} (script #${idx}): ${err.message}`);
            inlineErrors++;
            failures++;
        }
    }
});

if (jsErrors === 0 && inlineErrors === 0) {
    console.log(`  ✓ Phase 1 Passed: ${jsFiles.length} JS files & ${htmlFiles.length} HTML templates are 100% syntax-valid.\n`);
} else {
    console.error(`  ❌ Phase 1 FAILED: Found ${jsErrors + inlineErrors} syntax error(s)!\n`);
}

// -------------------------------------------------------------
// PHASE 2: CRITICAL UI CONTRACT & ASSET VERIFICATION
// -------------------------------------------------------------
console.log('Phase 2: Verifying Critical UI Contract & Element IDs...');
let uiErrors = 0;

const indexPath = path.join(rootDir, 'index.html');
if (!fs.existsSync(indexPath)) {
    console.error('  ❌ index.html is missing!');
    uiErrors++;
    failures++;
} else {
    const indexHtml = fs.readFileSync(indexPath, 'utf8');
    
    // Critical IDs required by frankpass-app.min.js
    const criticalIds = [
        'platform-input',
        'secret-key',
        'advanced-toggle',
        'advanced-panel',
        'variant-input',
        'output-password',
        'copy-btn',
        'clear-all-btn'
    ];

    criticalIds.forEach(id => {
        if (!indexHtml.includes(`id="${id}"`)) {
            console.error(`  ❌ Missing critical DOM ID in index.html: id="${id}"`);
            uiErrors++;
            failures++;
        }
    });

    // Verify critical script inclusions
    const criticalScripts = [
        'frankpass-core.js',
        'frankpass-utils.min.js',
        'frankpass-vault.js',
        'frankpass-app.min.js'
    ];

    criticalScripts.forEach(script => {
        if (!indexHtml.includes(script)) {
            console.error(`  ❌ Missing critical script in index.html: ${script}`);
            uiErrors++;
            failures++;
        }
        const scriptDiskPath = path.join(rootDir, script);
        if (!fs.existsSync(scriptDiskPath)) {
            console.error(`  ❌ Script file does not exist on disk: ${script}`);
            uiErrors++;
            failures++;
        }
    });

    // Verify key functions in frankpass-app.min.js
    const appMinPath = path.join(rootDir, 'frankpass-app.min.js');
    if (fs.existsSync(appMinPath)) {
        const appCode = fs.readFileSync(appMinPath, 'utf8');
        const requiredTokens = [
            'populatePlatformDatalist',
            'advanced-toggle',
            'advanced-panel',
            'FrankPassVault'
        ];
        requiredTokens.forEach(token => {
            if (!appCode.includes(token)) {
                console.error(`  ❌ frankpass-app.min.js missing required logic token: "${token}"`);
                uiErrors++;
                failures++;
            }
        });
    }
}

if (uiErrors === 0) {
    console.log('  ✓ Phase 2 Passed: All critical DOM elements, script tags & logic tokens verified.\n');
} else {
    console.error(`  ❌ Phase 2 FAILED: Found ${uiErrors} UI contract violation(s)!\n`);
}

// -------------------------------------------------------------
// PHASE 3: CRYPTOGRAPHIC GOLDEN VECTORS INVARIANCE GATE
// -------------------------------------------------------------
console.log('Phase 3: Running Cryptographic Golden Vectors Invariance Gate...');
try {
    const goldenScript = path.join(__dirname, 'verify_golden_gate.js');
    execSync(`node "${goldenScript}"`, { stdio: 'inherit' });
    console.log('  ✓ Phase 3 Passed: 100% Deterministic Invariance verified.\n');
} catch (err) {
    console.error('  ❌ Phase 3 FAILED: Cryptographic regression detected!\n');
    failures++;
}

// -------------------------------------------------------------
// FINAL GATE SUMMARY
// -------------------------------------------------------------
console.log('================================================================');
if (failures === 0) {
    console.log('  🎉 GATE STATUS: ALL INVARIANCE & INTEGRITY CHECKS PASSED (100% GREEN)');
    console.log('  Commit, Push & Cloudflare Deploy permitted.');
    console.log('================================================================');
    process.exit(0);
} else {
    console.error(`  ⛔ GATE STATUS: ABORTED! Found ${failures} fatal failure(s).`);
    console.error('  Fix all reported errors before committing or pushing!');
    console.error('================================================================');
    process.exit(1);
}
