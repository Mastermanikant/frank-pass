const fs = require('fs');
const path = require('path');

const PLATFORMS_JS_PATH = path.join(__dirname, '..', 'platforms.js');
const STAGING_DIR = path.join(__dirname, '..', 'data_staging');

console.log('Loading existing platforms.js...');
const existingContent = fs.readFileSync(PLATFORMS_JS_PATH, 'utf8');
const regionalPlatforms = {};
eval(existingContent.replace('window.', 'global.'));
const existingDB = global.regionalPlatforms || {};

const countryCodes = Object.keys(existingDB);
console.log(`Found ${countryCodes.length} countries in current platforms.js.`);

// Load all staging JSON files
const stagingFiles = fs.readdirSync(STAGING_DIR).filter(f => f.endsWith('.json'));
const globalStagedSet = new Set();

stagingFiles.forEach(file => {
    try {
        const data = JSON.parse(fs.readFileSync(path.join(STAGING_DIR, file), 'utf8'));
        if (Array.isArray(data)) {
            data.forEach(item => {
                if (typeof item === 'string' && item.trim()) {
                    globalStagedSet.add(item.trim());
                }
            });
        }
    } catch (e) {
        console.error(`Error parsing ${file}:`, e.message);
    }
});

const globalStagedList = Array.from(globalStagedSet);
console.log(`Loaded ${globalStagedList.length} unique platforms from staging files.`);

// Merge into each country array
let totalMergedEntries = 0;
const allUniqueGlobal = new Set();
const mergedDB = {};

countryCodes.forEach(code => {
    const existingList = existingDB[code] || [];
    const countrySet = new Set(existingList);
    
    // Add all global staged items
    globalStagedList.forEach(item => countrySet.add(item));
    
    // Convert back to sorted array
    const sorted = Array.from(countrySet).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    mergedDB[code] = sorted;
    totalMergedEntries += sorted.length;
    sorted.forEach(p => allUniqueGlobal.add(p));
});

console.log(`\nMerge Summary:`);
console.log(`- Countries processed: ${countryCodes.length}`);
console.log(`- Total platform entries across all countries: ${totalMergedEntries}`);
console.log(`- Total unique platforms globally: ${allUniqueGlobal.size}`);

// Write back to platforms.js
const outputCode = 'window.regionalPlatforms = ' + JSON.stringify(mergedDB, null, 2) + ';\n';
fs.writeFileSync(PLATFORMS_JS_PATH, outputCode, 'utf8');

console.log(`\nSuccessfully merged and updated ${PLATFORMS_JS_PATH}!`);
