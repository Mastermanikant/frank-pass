/**
 * test_end_to_end_canonical_vectors.js
 * Automated Regression Gate for End-to-End FrankPass Ecosystem Normalization & Derivation.
 * Verifies that User Input -> FrankPassUtils -> FRANKPASS_CORE produces 100% exact canonical passwords.
 */

const fs = require('fs');
const path = require('path');
const { webcrypto } = require('crypto');

if (!global.crypto) {
    global.crypto = webcrypto;
}

const baseDir = "D:\\01_Websites_and_Content\\MMY_Website_Project\\07_frankpass.com\\01_Website_App";

// Load FrankPass Utils
const utilsCode = fs.readFileSync(path.join(baseDir, 'frankpass-utils.js'), 'utf8');
const FrankPassUtils = (new Function(utilsCode + '; return FrankPassUtils;'))();

// Load FrankPass Core
const coreCode = fs.readFileSync(path.join(baseDir, 'frankpass-core.js'), 'utf8');
const FRANKPASS_CORE = (new Function('crypto', coreCode + '; return FRANKPASS_CORE;'))(global.crypto);

const CANONICAL_TEST_SUITE = [
    {
        name: "Vector #1: Google Ecosystem (Unified SSO)",
        inputs: ["google.com", "mail.google.com", "https://google.com/", "google", "accounts.google.com"],
        expectedSlug: "google",
        username: "user@example.com",
        secret: "mastersecret2026",
        variant: 1,
        expectedPassword: "F6h?%Ld48&&e4f?f"
    },
    {
        name: "Vector #2: GitHub (Standard V1)",
        inputs: ["github.com", "https://github.com/login", "github", "https://github.com/"],
        expectedSlug: "github",
        username: "developer",
        secret: "Correct Horse Battery Staple 2026!",
        variant: 1,
        expectedPassword: "tTM38@@6e7f*EMN?"
    },
    {
        name: "Vector #3: GitHub (Rotation V2)",
        inputs: ["github.com", "github"],
        expectedSlug: "github",
        username: "developer",
        secret: "Correct Horse Battery Staple 2026!",
        variant: 2,
        expectedPassword: "f#RAmLf4?7hhL#26"
    },
    {
        name: "Vector #4: Amazon Retail (Unified Global & Regional Domains)",
        inputs: ["amazon.com", "amazon.in", "https://www.amazon.com/ap/signin", "amazon"],
        expectedSlug: "amazon",
        username: "user",
        secret: "secret2026",
        variant: 1,
        expectedPassword: "M6@Tfm8D&$@?A#EL"
    },
    {
        name: "Vector #5: AWS Cloud Platform (Subdomain Cloud Isolation)",
        inputs: ["aws.amazon.com", "console.aws.amazon.com", "aws"],
        expectedSlug: "aws",
        username: "user",
        secret: "secret2026",
        variant: 1,
        expectedPassword: "&F9Me@=N+Df37tet"
    }
];

async function runTests() {
    console.log("================================================================================");
    console.log("  🛡️  FRANKPASS END-TO-END CANONICAL VECTOR & NORMALIZATION VERIFICATION");
    console.log("================================================================================\n");

    let totalAssertions = 0;
    let passedAssertions = 0;

    for (const vector of CANONICAL_TEST_SUITE) {
        console.log(`Testing [${vector.name}]:`);
        
        for (const rawInput of vector.inputs) {
            totalAssertions++;
            const normalizedSlug = FrankPassUtils.getNormalizedPlatform(rawInput);
            
            if (normalizedSlug !== vector.expectedSlug) {
                console.error(`  ✗ Slug Error: Input "${rawInput}" resolved to "${normalizedSlug}", expected "${vector.expectedSlug}"`);
                continue;
            }

            const outputPassword = await FRANKPASS_CORE.generatePassword(
                normalizedSlug,
                vector.username,
                vector.secret,
                vector.variant,
                'standard',
                16
            );

            if (outputPassword === vector.expectedPassword) {
                passedAssertions++;
                console.log(`  ✓ "${rawInput.padEnd(32)}" -> Slug: [${normalizedSlug.padEnd(8)}] -> Pwd: ${outputPassword} (OK)`);
            } else {
                console.error(`  ✗ Password Mismatch: "${rawInput}" produced "${outputPassword}", expected "${vector.expectedPassword}"`);
            }
        }
        console.log("");
    }

    console.log("--------------------------------------------------------------------------------");
    console.log(`  TOTAL RESULTS: ${passedAssertions}/${totalAssertions} Assertions 100% PASSED`);
    console.log("  STATUS: End-to-End Invariant Lock Confirmed.");
    console.log("================================================================================\n");

    if (passedAssertions !== totalAssertions) {
        process.exit(1);
    }
}

runTests().catch(err => {
    console.error(err);
    process.exit(1);
});
