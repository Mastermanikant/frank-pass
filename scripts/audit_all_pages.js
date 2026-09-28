const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');
const competitors = ['1Password', 'Bitwarden', 'LastPass', 'Dashlane', 'NordPass', 'KeePass', 'RoboForm', 'Keeper'];

const allHtmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

console.log('================================================================');
console.log(`       FULL ECOSYSTEM 5-POINT COMPLIANCE AUDIT (${allHtmlFiles.length} HTML FILES)      `);
console.log('================================================================\n');

let totalViolations = 0;
let fileReport = [];

for (const file of allHtmlFiles) {
  const filePath = path.join(dir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  
  let issues = [];
  
  // 1. Em Dash Check (U+2014 or &mdash;)
  const emDashLines = [];
  lines.forEach((line, idx) => {
    if (line.includes('\u2014') || line.includes('&mdash;')) {
      emDashLines.push(idx + 1);
    }
  });
  if (emDashLines.length > 0) {
    issues.push(`Em Dash found on lines: ${emDashLines.join(', ')}`);
    totalViolations += emDashLines.length;
  }

  // 2. Competitor Names Check
  const compFound = [];
  lines.forEach((line, idx) => {
    for (const comp of competitors) {
      const regex = new RegExp(`\\b${comp}\\b`, 'i');
      if (regex.test(line)) {
        compFound.push(`L${idx + 1}: ${comp}`);
      }
    }
  });
  if (compFound.length > 0) {
    issues.push(`Competitor names: ${compFound.join('; ')}`);
    totalViolations += compFound.length;
  }

  // 3. Robots Meta Check
  const robotsMatch = content.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  const robots = robotsMatch ? robotsMatch[1] : 'NONE';

  // 4. Hreflang Tags Check
  const isHindi = file.endsWith('-hindi.html');
  const counterpart = isHindi ? file.replace('-hindi.html', '.html') : file.replace('.html', '-hindi.html');
  const counterpartExists = fs.existsSync(path.join(dir, counterpart));
  
  const hreflangEn = content.includes('hreflang="en"');
  const hreflangHi = content.includes('hreflang="hi"');
  
  if (counterpartExists && (!hreflangEn || !hreflangHi)) {
    issues.push(`Hreflang missing (EN: ${hreflangEn}, HI: ${hreflangHi})`);
    totalViolations++;
  }

  // 5. Broken Internal Links
  const linkMatches = [...content.matchAll(/href=["']([^"'#?]+)(\?[^"'#]*)?(#[^"']*)?["']/gi)];
  const brokenLinks = [];
  for (const m of linkMatches) {
    let target = m[1];
    if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('mailto:') || target.startsWith('tel:') || target.startsWith('javascript:')) {
      continue;
    }
    if (target === '/' || target === '') continue;
    let localFile = target.startsWith('/') ? target.slice(1) : target;
    if (!fs.existsSync(path.join(dir, localFile))) {
      brokenLinks.push(target);
    }
  }
  const uniqueBroken = [...new Set(brokenLinks)];
  if (uniqueBroken.length > 0) {
    issues.push(`Broken internal links: ${uniqueBroken.join(', ')}`);
    totalViolations += uniqueBroken.length;
  }

  fileReport.push({
    file,
    lines: lines.length,
    robots,
    status: issues.length === 0 ? '✅ PASS' : '❌ FAIL',
    issues
  });
}

console.table(fileReport.map(r => ({
  File: r.file,
  Lines: r.lines,
  Robots: r.robots,
  Status: r.status,
  Issues: r.issues.length > 0 ? r.issues.join(' | ') : 'None'
})));

console.log('\n================================================================');
console.log(`OVERALL AUDIT SUMMARY: Total Violations = ${totalViolations}`);
console.log('================================================================\n');
