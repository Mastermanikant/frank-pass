const fs = require('fs');
const path = require('path');

const STAGING_DIR = path.join(__dirname, '..', 'data_staging');
const files = fs.readdirSync(STAGING_DIR).filter(f => f.endsWith('.json') && f !== 'all_master_platforms_combined.json');

const masterSet = new Set();
let fileStats = {};

files.forEach(file => {
    const filePath = path.join(STAGING_DIR, file);
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (Array.isArray(data)) {
            data.forEach(item => masterSet.add(item.trim()));
            fileStats[file] = data.length;
        }
    } catch (e) {
        console.error(`Error reading ${file}:`, e.message);
    }
});

const sortedMaster = Array.from(masterSet).sort((a, b) => a.localeCompare(b));
fs.writeFileSync(path.join(STAGING_DIR, 'all_master_platforms_combined.json'), JSON.stringify(sortedMaster, null, 2), 'utf8');

console.log('--- Staging Files Summary ---');
console.table(fileStats);
console.log(`\nTotal Unique Master Staged Platforms: ${sortedMaster.length}`);
