const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html')).sort();

console.log(`Building sitemap for ${files.length} HTML files...`);

const today = '2026-09-29';

function getPriority(file) {
  if (file === 'index.html') return '1.0';
  if (['random-password-generator.html', 'pin.html', 'whitepaper.html', 'whitepaper-hindi.html', 'extension.html', 'extension-hindi.html'].includes(file)) return '0.95';
  if (file.includes('why-stateless') || file.includes('where-password-managers-fail') || file.includes('secret-key-guide') || file.includes('cloud-password-vaults')) return '0.90';
  if (file === 'library.html' || file === 'library-hindi.html' || file === 'products.html' || file === 'pro.html') return '0.90';
  return '0.85';
}

function getChangeFreq(file) {
  if (file === 'index.html') return 'daily';
  if (file.includes('whitepaper') || file.includes('legal') || file.includes('about-us') || file.includes('founder')) return 'monthly';
  return 'weekly';
}

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

for (const file of files) {
  const url = file === 'index.html' ? 'https://frankpass.com/' : `https://frankpass.com/${file}`;
  const priority = getPriority(file);
  const freq = getChangeFreq(file);

  xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
}

xml += `</urlset>
`;

fs.writeFileSync(path.join(dir, 'sitemap.xml'), xml, 'utf8');
console.log(`✅ Successfully generated sitemap.xml with exactly ${files.length} URLs!`);
