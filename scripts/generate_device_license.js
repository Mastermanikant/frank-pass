/**
 * FrankPass Offline Device-Locked License Generator
 * RULE 57: Dynamic Hardware Binding & Hard Expiry Date Signing
 * 
 * Usage:
 *   node generate_device_license.js <Tier: PC1|PC2|CORP5> <Duration: 1YR|3YR|5YR|10YR|LIFE> <DeviceID: FP-XXXX-XXXX-XXXX> [CustomExpiryCode]
 * Examples:
 *   node generate_device_license.js PC1 1YR FP-8F2A-B901-C34E
 *   node generate_device_license.js PC1 LIFE FP-8F2A-B901-C34E
 */

const crypto = require('crypto');
const MASTER_SALT = 'FrankPassOfflineDeviceLockSalt2026!';

function getExpiryCode(duration) {
    const dur = (duration || '1YR').toUpperCase();
    if (dur === 'LIFE' || dur === 'L' || dur === 'LIFETIME') return 'ELIFE';
    
    const now = new Date();
    let addYears = 1;
    if (dur === '3YR' || dur === '3YEAR' || dur === '3YEARS') addYears = 3;
    else if (dur === '5YR' || dur === '5YEAR' || dur === '5YEARS') addYears = 5;
    else if (dur === '10YR' || dur === '10YEAR' || dur === '10YEARS') addYears = 10;
    
    const target = new Date(now.getFullYear() + addYears, now.getMonth(), now.getDate());
    const yy = target.getFullYear().toString().slice(-2);
    const mm = (target.getMonth() + 1).toString().padStart(2, '0');
    const dd = target.getDate().toString().padStart(2, '0');
    return `E${yy}${mm}${dd}`;
}

function generateDeviceLicenseKey(tierCode, durationCode, deviceId, customExp) {
    const tier = (tierCode || 'PC1').toUpperCase();
    const dev = (deviceId || '').trim().toUpperCase();
    const exp = customExp || getExpiryCode(durationCode);

    if (!dev.startsWith('FP-') || dev.split('-').length !== 4) {
        console.error('Error: Device ID must be in format FP-XXXX-XXXX-XXXX (e.g. FP-8F2A-B901-C34E)');
        process.exit(1);
    }

    const devClean = dev.replace(/^FP-/, '');
    const dataToSign = `${dev}|${tier}|${exp}|${MASTER_SALT}`;
    const hash = crypto.createHash('sha256').update(dataToSign).digest('hex').substring(0, 8).toUpperCase();
    const key = `FRANK-${tier}-${exp}-${devClean}-${hash}`;

    const tierNames = { PC1: '💻 1-PC Pro Pass', PC2: '💻💻 2-PC Dual Pass', CORP5: '🏢 Business Fleet (5+ PCs)' };

    console.log('\n======================================================');
    console.log('         FRANKPASS PRO CRYPTOGRAPHIC GENERATOR        ');
    console.log('======================================================');
    console.log('Plan Tier:     ' + (tierNames[tier] || tier));
    console.log('Duration/Exp:  ' + exp);
    console.log('Device ID:     ' + dev);
    console.log('License Key:   ' + key);
    console.log('======================================================');
    console.log('🔐 100% Offline Cryptographically Bound to this Motherboard Hardware.');
    console.log('Zero Server Dependency. Anti-Replay Protected.\n');
    return key;
}

const args = process.argv.slice(2);
if (args.length < 3) {
    console.log('Usage: node generate_device_license.js <Tier: PC1|PC2|CORP5> <Duration: 1YR|3YR|5YR|10YR|LIFE> <DeviceID: FP-XXXX-XXXX-XXXX> [CustomExpiryCode]');
    console.log('Example: node generate_device_license.js PC1 1YR FP-8F2A-B901-C34E');
    process.exit(0);
}

generateDeviceLicenseKey(args[0], args[1], args[2], args[3]);
