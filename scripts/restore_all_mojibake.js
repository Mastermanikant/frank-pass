const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');

// 1. Files where the entire content was pristine in commit 2b1f912
const pristineFiles = [
    'about-us-hindi.html',
    'founder-mastermanikant-hindi.html',
    'limitations-and-advantages-hindi.html',
    'about-us.html',
    'founder-mastermanikant.html',
    'limitations-and-advantages.html',
    'install.html',
    'products.html'
];

console.log('--- Restoring pristine UTF-8 files from commit 2b1f912 ---');
pristineFiles.forEach(f => {
    try {
        let content = execSync(`git show 2b1f912:${f}`, { encoding: 'utf8' });
        
        // Ensure proper header logo and stylesheet versions
        content = content.replace(/logo-key-32\.png/g, 'logo-key-64.webp');
        content = content.replace(/v=3\.[0-9.]+/g, 'v=3.2.8');
        content = content.replace(/\/icons\/icon\.svg/g, '/icons/favicon.png');
        
        // Ensure skip-link / main tags are balanced
        if (content.includes('href="#main-content"') && !content.includes('id="main-content"')) {
            content = content.replace(/<main>/i, '<main id="main-content">');
        }
        
        fs.writeFileSync(path.join(rootDir, f), content, 'utf8');
        console.log(`✓ Restored clean UTF-8 for ${f}`);
    } catch (e) {
        console.error(`Error restoring ${f}:`, e.message);
    }
});

// 2. Clean index.html and get-started.html specifically
console.log('\n--- Cleaning index.html and get-started.html ---');

// Clean index.html
let indexContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

// Replace all Mojibake sequences in index.html
const replacements = [
    [/Â·Â·Â·Â·Â·Â·Â·Â·Â·Â·Â·/g, '••••••••••••'],
    [/Â·/g, '·'],
    [/ðŸ“–/g, '📖'],
    [/ðŸ‘‘/g, '👑'],
    [/ðŸš€/g, '🚀'],
    [/ðŸ”‘/g, '🔑'],
    [/ðŸ’¡/g, '💡'],
    [/ðŸ”’/g, '🔒'],
    [/ðŸ›¡ï¸ /g, '🛡️'],
    [/ðŸ›¡ï¸/g, '🛡️'],
    [/ðŸ‘†/g, '👆'],
    [/ðŸ’“/g, '💖'],
    [/ðŸŠ€/g, '🚀'],
    [/â‚¹/g, '₹'],
    [/â†’/g, '→'],
    [/â€"/g, '—'],
    [/â€¦/g, '…'],
    [/â€“/g, '–'],
    [/â€”/g, '—'],
    [/Â /g, ' '],
    [/â”€â”€/g, '──']
];

replacements.forEach(([regex, rep]) => {
    indexContent = indexContent.replace(regex, rep);
});

// Ensure placeholder and copy logic in index.html is clean
indexContent = indexContent.replace(
    /<div class="password-text masked" id="password-output"[^>]*>.*?<\/div>/,
    '<div class="password-text masked" id="password-output" aria-label="Generated Password Output" role="region" aria-live="polite">••••••••••••</div>'
);
indexContent = indexContent.replace(
    /out\.textContent = ['"](?:••••••••••••|Â·Â·Â·Â·Â·Â·Â·Â·Â·Â·Â·|···········)['"];/g,
    "out.textContent = '••••••••••••';"
);
indexContent = indexContent.replace(
    /if \(!password \|\| password === ['"][^'"]+['"]\) return;/g,
    "if (!password || password === '••••••••••••' || password === 'Â·Â·Â·Â·Â·Â·Â·Â·Â·Â·Â·') return;"
);

fs.writeFileSync(path.join(rootDir, 'index.html'), indexContent, 'utf8');
console.log('✓ Cleaned index.html (password placeholder set to ••••••••••••, emojis & symbols restored)');

// Clean get-started.html
let gsContent = fs.readFileSync(path.join(rootDir, 'get-started.html'), 'utf8');
replacements.forEach(([regex, rep]) => {
    gsContent = gsContent.replace(regex, rep);
});
// Fix broken placeholder quotes in get-started.html
gsContent = gsContent.replace(
    /placeholder="Search country[^"]*autocomplete="off"/,
    'placeholder="Search country..." autocomplete="off"'
);
// Ensure <main id="main-content"> exists
if (gsContent.includes('href="#main-content"') && !gsContent.includes('id="main-content"')) {
    gsContent = gsContent.replace(/<section class="section"/, '<main id="main-content">\n<section class="section"');
}

fs.writeFileSync(path.join(rootDir, 'get-started.html'), gsContent, 'utf8');
console.log('✓ Cleaned get-started.html');

// 3. Scan all HTML/JS/CSS files in rootDir for any remaining Mojibake
console.log('\n--- Scanning all files for remaining Mojibake ---');
const allFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html') || f.endsWith('.js') || f.endsWith('.css'));
let totalMoji = 0;

allFiles.forEach(f => {
    let content = fs.readFileSync(path.join(rootDir, f), 'utf8');
    
    // Apply common symbol fixes if found
    let modified = false;
    replacements.forEach(([regex, rep]) => {
        if (regex.test(content)) {
            content = content.replace(regex, rep);
            modified = true;
        }
    });
    
    if (modified) {
        fs.writeFileSync(path.join(rootDir, f), content, 'utf8');
        console.log(`Cleaned remaining Mojibake in ${f}`);
    }
    
    const mojiMatches = content.match(/[ÂÃð]/g);
    if (mojiMatches && mojiMatches.length > 0) {
        console.log(`  [WARNING] ${f} still has ${mojiMatches.length} suspected characters`);
        totalMoji += mojiMatches.length;
    } else {
        console.log(`  ✓ ${f} is 100% clean`);
    }
});

console.log(`\nMojibake Restoration Complete! Total unresolved: ${totalMoji}`);
