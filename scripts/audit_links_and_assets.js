const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
const blogFiles = fs.readdirSync(path.join(dir, 'blog')).filter(f => f.endsWith('.html')).map(f => path.join('blog', f));
const allFiles = [...files, ...blogFiles];

const brokenLinks = [];
const brokenAssets = [];
const redirects = fs.existsSync(path.join(dir, '_redirects')) ? fs.readFileSync(path.join(dir, '_redirects'), 'utf8') : '';

allFiles.forEach(fileRel => {
  const filePath = path.join(dir, fileRel);
  const content = fs.readFileSync(filePath, 'utf8');

  // Check <a> href
  const aMatches = content.matchAll(/<a\b[^>]*\bhref=["']([^"'#?]+)["']/gi);
  for (const m of aMatches) {
    let href = m[1];
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;
    
    // Resolve internal link
    let target = href;
    if (target.startsWith('/')) target = target.slice(1);
    
    // Cloudflare pages maps /foo to foo.html or /foo/index.html
    let exists = fs.existsSync(path.join(dir, target)) ||
                 fs.existsSync(path.join(dir, target + '.html')) ||
                 fs.existsSync(path.join(dir, target, 'index.html'));
    
    // Also check _redirects
    if (!exists) {
      if (redirects.includes('/' + target + ' ') || redirects.includes(href + ' ')) {
        exists = true;
      }
    }

    if (!exists) {
      brokenLinks.push({ file: fileRel, link: href });
    }
  }

  // Check <img> src, <script> src, <link> href
  const assetMatches = content.matchAll(/<(?:img|script|link)\b[^>]*\b(?:src|href)=["']([^"'#?]+)["']/gi);
  for (const m of assetMatches) {
    let src = m[1];
    if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('//')) continue;
    if (src.endsWith('.css') || src.endsWith('.js') || src.endsWith('.png') || src.endsWith('.webp') || src.endsWith('.svg') || src.endsWith('.json') || src.endsWith('.ico')) {
      let target = src;
      if (target.startsWith('/')) target = target.slice(1);
      const exists = fs.existsSync(path.join(dir, target));
      if (!exists) {
        brokenAssets.push({ file: fileRel, asset: src });
      }
    }
  }
});

console.log('Audited ' + allFiles.length + ' HTML files.');
console.log('Broken internal links count:', brokenLinks.length);
if (brokenLinks.length > 0) console.log('Sample broken links:', brokenLinks.slice(0, 10));
console.log('Broken local assets count:', brokenAssets.length);
if (brokenAssets.length > 0) console.log('Sample broken assets:', brokenAssets.slice(0, 10));
