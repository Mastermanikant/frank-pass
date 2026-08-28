/**
 * FrankPass Offline Device-Locked License Generator
 * Usage:
 *   node generate_device_license.js <Tier: S|G|P|D> <DeviceID: FP-XXXX-XXXX-XXXX>
 * Example:
 *   node generate_device_license.js G FP-8F2A-B901-C34E
 */

const crypto = require('crypto');
const MASTER_SALT = 'FrankPassOfflineDeviceLockSalt2026!';

function generateDeviceLicenseKey(tierCode, deviceId) {
    const tier = (tierCode || 'G').toUpperCase();
    const dev = (deviceId || '').trim().toUpperCase();

    if (!dev.startsWith('FP-') || dev.split('-').length !== 4) {
        console.error('Error: Device ID must be in format FP-XXXX-XXXX-XXXX (e.g. FP-8F2A-B901-C34E)');
        process.exit(1);
    }

    const devClean = dev.replace(/^FP-/, '');
    const dataToSign = dev + '|' + tier + '|' + MASTER_SALT;
    const hash = crypto.createHash('sha256').update(dataToSign).digest('hex').substring(0, 8).toUpperCase();
    const key = 'FRANK-' + tier + '-' + devClean + '-' + hash;

    const tierNames = { S: 'Silver (1 Profile)', G: 'Gold (5 Profiles)', P: 'Platinum (10 Profiles)', D: 'Diamond (Unlimited)' };

    console.log('\n=============================================');
    console.log('       FRANKPASS PRO LICENSE GENERATOR        ');
    console.log('=============================================');
    console.log('Plan Tier:   ' + (tierNames[tier] || tier));
    console.log('Device ID:   ' + dev);
    console.log('License Key: ' + key);
    console.log('=============================================\n');
    console.log('Give this License Key to the customer. It will activate ONLY on their specific Device ID completely offline!\n');
    return key;
}

const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('Usage: node generate_device_license.js <Tier: S|G|P|D> <DeviceID: FP-XXXX-XXXX-XXXX>');
    console.log('Example: node generate_device_license.js G FP-8F2A-B901-C34E');
    process.exit(0);
}

generateDeviceLicenseKey(args[0], args[1]);
