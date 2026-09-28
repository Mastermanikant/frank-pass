const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

console.log('================================================================');
console.log('          PHASE 3: ACTIVATING FULL SITE SEO (INDEX, FOLLOW)      ');
console.log('================================================================\n');

let updatedCount = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('noindex')) {
    // Replace any variant of noindex with index, follow
    const updated = content.replace(
      /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex[^"']*["']\s*\/?>/gi,
      '<meta name="robots" content="index, follow">'
    );
    
    if (updated !== content) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`✅ Updated SEO to [index, follow]: ${file}`);
      updatedCount++;
    } else {
      console.log(`⚠️ Failed regex match on: ${file}`);
    }
  }
}

console.log(`\nSuccessfully updated ${updatedCount} files to [index, follow].`);

// Sync Sitemap.xml lastmod dates
const sitemapPath = path.join(dir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const today = '2026-09-28';
  sitemap = sitemap.replace(/<lastmod>[^<]+<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log(`✅ Updated all lastmod dates in sitemap.xml to ${today}`);
}
