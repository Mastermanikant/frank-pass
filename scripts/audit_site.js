const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

console.log(`Auditing ${htmlFiles.length} HTML files in FrankPass (with query string stripping)...`);

let issuesFound = 0;

htmlFiles.forEach(file => {
    const fullPath = path.join(rootDir, file);
    const content = fs.readFileSync(fullPath, 'utf8');

    // 1. Script checks
    const scriptRegex = /<script[^>]+src=["']([^"']+)["']/gi;
    let match;
    while ((match = scriptRegex.exec(content)) !== null) {
        let src = match[1];
        if (!src.startsWith('http') && !src.startsWith('//') && !src.startsWith('data:')) {
            src = src.split('?')[0].split('#')[0];
            const clean = src.startsWith('/') ? src.slice(1) : src;
            const target = path.join(rootDir, clean);
            if (!fs.existsSync(target)) {
                console.log(`[BROKEN SCRIPT] in ${file}: src="${match[1]}" (cleaned: ${clean}) not found`);
                issuesFound++;
            }
        }
    }

    // 2. Link stylesheet / favicon checks
    const linkRegex = /<link[^>]+href=["']([^"']+)["']/gi;
    while ((match = linkRegex.exec(content)) !== null) {
        let href = match[1];
        if (!href.startsWith('http') && !href.startsWith('//') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.endsWith('.xml') && !href.endsWith('.html') && !href.endsWith('/')) {
            href = href.split('?')[0].split('#')[0];
            const clean = href.startsWith('/') ? href.slice(1) : href;
            const target = path.join(rootDir, clean);
            if (!fs.existsSync(target)) {
                console.log(`[BROKEN LINK/ASSET] in ${file}: href="${match[1]}" (cleaned: ${clean}) not found`);
                issuesFound++;
            }
        }
    }

    // 3. Image src checks
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    while ((match = imgRegex.exec(content)) !== null) {
        let src = match[1];
        if (!src.startsWith('http') && !src.startsWith('//') && !src.startsWith('data:')) {
            src = src.split('?')[0].split('#')[0];
            const clean = src.startsWith('/') ? src.slice(1) : src;
            const target = path.join(rootDir, clean);
            if (!fs.existsSync(target)) {
                if (!src.includes('${') && !src.includes('+')) {
                    console.log(`[BROKEN IMAGE] in ${file}: src="${match[1]}" (cleaned: ${clean}) not found`);
                    issuesFound++;
                }
            }
        }
    }
});

console.log(`\nAudit complete. Genuine broken asset issues found: ${issuesFound}`);
