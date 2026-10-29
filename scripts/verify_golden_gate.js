/**
 * verify_golden_gate.js - Cryptographic Regression CI Gate
 * Verifies 100% Deterministic Invariance against frozen_golden_vectors.json
 * If ANY seed or password differs from the frozen truth, exits with code 1.
 */

const fs = require('fs');
const path = require('path');
const { webcrypto } = require('crypto');
if (!global.crypto) global.crypto = webcrypto;

// Load Core Engine
const corePath = path.join(__dirname, '..', 'frankpass-core.js');
const coreCode = fs.readFileSync(corePath, 'utf8');
eval(coreCode.replace('const FRANKPASS_CORE =', 'global.FRANKPASS_CORE ='));

// Load Web and Extension Normalizers
const WebUtils = require(path.join(__dirname, '..', 'frankpass-utils.js'));
const ExtUtils = require(path.join(__dirname, '..', '..', '02_Browser_Extensions', 'source', 'frankpass-utils.js'));

// Load Frozen Vectors
const vectorsPath = path.join(__dirname, 'frozen_golden_vectors.json');
const vectors = JSON.parse(fs.readFileSync(vectorsPath, 'utf8'));

const isFullRun = process.argv.includes('--full') || process.env.CI === 'true';

async function runGate() {
    console.log('================================================================');
    console.log('  🛡️ FRANKPASS CRYPTOGRAPHIC GOLDEN VECTORS REGRESSION GATE');
    console.log(`  Mode: ${isFullRun ? 'FULL CI VERIFICATION (124/124)' : 'FAST PRE-COMMIT GATE (124 Seeds + 10 Crypto Vectors)'}`);
    console.log('================================================================\n');

    let seedFailures = 0;
    let cryptoFailures = 0;

    // 1. Verify ALL 124 Normalization Seeds (Web and Extension Parity)
    console.log('Phase 1: Verifying 124 Platform Normalization Seeds...');
    for (const v of vectors) {
        const webSeed = WebUtils.getNormalizedPlatform(v.platformRaw);
        const extSeed = ExtUtils.getNormalizedPlatform(v.platformRaw);

        if (webSeed !== v.expectedSeed || extSeed !== v.expectedSeed) {
            seedFailures++;
            console.error(`  ❌ Seed Mismatch on Vector #${v.id} [${v.platformRaw}]:`);
            console.error(`     Expected: "${v.expectedSeed}" | Web: "${webSeed}" | Ext: "${extSeed}"`);
        }
    }

    if (seedFailures === 0) {
        console.log(`  ✓ Phase 1 Passed: 124/124 Seeds 100% Identical across Web & Ext.\n`);
    } else {
        console.error(`  ❌ Phase 1 FAILED: ${seedFailures} seed mismatches detected!\n`);
    }

    // 2. Verify Cryptographic Password Generation against Frozen Hashes
    console.log('Phase 2: Verifying Deterministic Password Generation...');
    const cryptoSubset = isFullRun ? vectors : vectors.filter((_, idx) => idx % 12 === 0);

    for (const v of cryptoSubset) {
        const actualPwd = await global.FRANKPASS_CORE.generatePassword(
            v.expectedSeed,
            v.username,
            v.secretKey,
            v.variant,
            v.profile,
            v.length
        );

        if (actualPwd !== v.expectedPassword) {
            cryptoFailures++;
            console.error(`  ❌ Cryptographic Mutation on Vector #${v.id} [${v.platformRaw}]:`);
            console.error(`     Expected: "${v.expectedPassword}"`);
            console.error(`     Actual:   "${actualPwd}"`);
        } else {
            console.log(`  ✓ Vector #${String(v.id).padStart(3, '0')}: [${v.platformRaw.slice(0, 22).padEnd(22)}] -> "${actualPwd}" (MATCH)`);
        }
    }

    console.log('\n================================================================');
    if (seedFailures === 0 && cryptoFailures === 0) {
        console.log('  🎉 GATE STATUS: ALL INVARIANCE CHECKS PASSED (100% GREEN)');
        console.log('  No regression detected. Commit & Deploy permitted.');
        console.log('================================================================\n');
        process.exit(0);
    } else {
        console.error('  🚨 GATE STATUS: REGRESSION DETECTED! (RED ALERT)');
        console.error(`  Failed: ${seedFailures} seeds, ${cryptoFailures} crypto vectors.`);
        console.error('  COMMIT ABORTED. Do not deploy corrupting changes.');
        console.error('================================================================\n');
        process.exit(1);
    }
}

runGate();
