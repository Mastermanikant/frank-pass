const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
const blogFiles = fs.readdirSync(path.join(dir, 'blog')).filter(f => f.endsWith('.html')).map(f => path.join('blog', f));
const allFiles = [...files, ...blogFiles];

let filesWithMismatch = 0;

allFiles.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, '');

  const tags = ['div', 'section', 'main', 'header', 'nav', 'form', 'article'];
  const mismatches = [];

  tags.forEach(tag => {
    const o = (content.match(new RegExp('<' + tag + '(\\s+[^>]*)?>', 'gi')) || []).length;
    const c = (content.match(new RegExp('</' + tag + '>', 'gi')) || []).length;
    if (o !== c) mismatches.push(`${tag}: ${o} open vs ${c} close`);
  });

  if (mismatches.length > 0) {
    console.log(`[TAG MISMATCH] ${f}: ${mismatches.join(', ')}`);
    filesWithMismatch++;
  }
});

console.log(`\nAudited ${allFiles.length} HTML files.`);
console.log(`Files with tag mismatches: ${filesWithMismatch}`);
