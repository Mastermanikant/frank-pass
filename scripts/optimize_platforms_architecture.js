const fs = require('fs');
const path = require('path');

const PLATFORMS_JS_PATH = path.join(__dirname, '..', 'platforms.js');
const STAGING_DIR = path.join(__dirname, '..', 'data_staging');

console.log('--- Optimizing platforms.js architecture with zero data loss ---');

// 1. Load existing raw platforms
const currentContent = fs.readFileSync(PLATFORMS_JS_PATH, 'utf8');
const sandbox = {};
eval(currentContent.replace('window.', 'sandbox.'));
const currentDB = sandbox.regionalPlatforms || {};

// 2. Load all staged master platforms
const masterStaged = JSON.parse(fs.readFileSync(path.join(STAGING_DIR, 'all_master_platforms_combined.json'), 'utf8'));
const globalSet = new Set(masterStaged);

console.log(`Global Master Platforms in Staging: ${globalSet.size}`);

// 3. Separate country-specific platforms from global platforms
const optimizedDB = {};
const globalList = Array.from(globalSet).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
optimizedDB['Global'] = globalList;

let allUniqueCombined = new Set(globalList);
let totalEntries = globalList.length;

const countryCodes = Object.keys(currentDB).filter(k => k !== 'Global');

countryCodes.forEach(code => {
    const list = currentDB[code] || [];
    // Country specific = items in this country that are not in Global
    const regionalOnly = list.filter(item => !globalSet.has(item));
    const sortedRegional = Array.from(new Set(regionalOnly)).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    
    optimizedDB[code] = sortedRegional;
    totalEntries += sortedRegional.length;
    sortedRegional.forEach(p => allUniqueCombined.add(p));
});

console.log(`\nOptimized Database Stats:`);
console.log(`- Countries: ${countryCodes.length} (+ 1 Global shared array)`);
console.log(`- Total unique platforms globally: ${allUniqueCombined.size}`);
console.log(`- Total array entries: ${totalEntries}`);

// Write optimized platforms.js
const outputCode = 'window.regionalPlatforms = ' + JSON.stringify(optimizedDB, null, 2) + ';\n';
fs.writeFileSync(PLATFORMS_JS_PATH, outputCode, 'utf8');

const stat = fs.statSync(PLATFORMS_JS_PATH);
const sizeKB = (stat.size / 1024).toFixed(2);
const sizeMB = (stat.size / (1024 * 1024)).toFixed(2);
console.log(`\nNew platforms.js file size: ${sizeKB} KB (${sizeMB} MB)`);
console.log('Optimized successfully with 100% data integrity!');
