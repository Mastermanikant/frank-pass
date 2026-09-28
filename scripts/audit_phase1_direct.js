const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');
const phase1Files = [
  'whitepaper.html',
  'whitepaper-hindi.html',
  'why-stateless-password-generation-is-the-future.html',
  'why-stateless-password-generation-is-the-future-hindi.html',
  'where-password-managers-fail-and-invisible-vault.html',
  'where-password-managers-fail-and-invisible-vault-hindi.html',
  'secret-key-guide.html',
  'secret-key-guide-hindi.html'
];

const competitors = ['1Password', 'Bitwarden', 'LastPass', 'Dashlane', 'NordPass', 'KeePass', 'RoboForm', 'Keeper'];

console.log('================================================================');
console.log('       PHASE 1: 5-POINT COMPLIANCE AUDIT (8 MASTER PILLARS)      ');
console.log('================================================================\n');

let totalViolations = 0;

for (const file of phase1Files) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`[ERROR] File not found: ${file}`);
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  
  console.log(`\n📄 FILE: ${file} (${lines.length} lines)`);
  console.log('----------------------------------------------------------------');
  
  // 1. Em Dash Check
  const emDashLines = [];
  lines.forEach((line, idx) => {
    if (line.includes('\u2014') || line.includes('&mdash;')) {
      emDashLines.push({ line: idx + 1, text: line.trim() });
    }
  });
  if (emDashLines.length === 0) {
    console.log('  1. Em Dash (U+2014 / &mdash;): ✅ PASS (0 found)');
  } else {
    console.log(`  1. Em Dash: ❌ FAIL (${emDashLines.length} found)`);
    emDashLines.forEach(e => {
      console.log(`     - Line ${e.line}: "${e.text.substring(0, 100)}"`);
      totalViolations++;
    });
  }

  // 2. Competitor Names Check
  const compFound = [];
  lines.forEach((line, idx) => {
    for (const comp of competitors) {
      const regex = new RegExp(`\\b${comp}\\b`, 'i');
      if (regex.test(line)) {
        compFound.push({ line: idx + 1, competitor: comp, text: line.trim() });
      }
    }
  });
  if (compFound.length === 0) {
    console.log('  2. Competitor Names:          ✅ PASS (0 found)');
  } else {
    console.log(`  2. Competitor Names:          ❌ FAIL (${compFound.length} found)`);
    compFound.forEach(c => {
      console.log(`     - Line ${c.line} [${c.competitor}]: "${c.text.substring(0, 100)}"`);
      totalViolations++;
    });
  }

  // 3. PBKDF2 Math & Algorithm Check
  const hasPbkdf2 = content.includes('PBKDF2') || content.includes('10,00,000') || content.includes('1,000,000');
  let mathStatus = '✅ PASS';
  const mathIssues = [];
  if (hasPbkdf2) {
    if (content.includes('SHA256') || content.includes('SHA-256')) {
      // Check if it's comparing with SHA256 or mistakenly using it
      const sha256Lines = lines.filter(l => l.includes('SHA256') || l.includes('SHA-256'));
      mathIssues.push(`SHA-256 mentions found: ${sha256Lines.length} (verify if used as FrankPass standard or comparison)`);
    }
  }
  console.log(`  3. Cryptography & Math:       ${mathIssues.length === 0 ? '✅ PASS' : '⚠️ CHECK: ' + mathIssues.join('; ')}`);

  // 4. Hreflang & Canonical
  const hreflangEn = content.includes('hreflang="en"');
  const hreflangHi = content.includes('hreflang="hi"');
  const hasCanonical = content.includes('rel="canonical"');
  if (hreflangEn && hreflangHi && hasCanonical) {
    console.log('  4. Hreflang & Canonical Tags: ✅ PASS (EN + HI + Canonical present)');
  } else {
    console.log(`  4. Hreflang & Canonical:      ❌ FAIL (EN: ${hreflangEn}, HI: ${hreflangHi}, Canonical: ${hasCanonical})`);
    totalViolations++;
  }

  // 5. Internal Links Check
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
  if (uniqueBroken.length === 0) {
    console.log('  5. Internal Links Integrity:  ✅ PASS (All targets exist)');
  } else {
    console.log(`  5. Internal Links Integrity:  ❌ FAIL (Broken: ${uniqueBroken.join(', ')})`);
    totalViolations += uniqueBroken.length;
  }
}

console.log('\n================================================================');
console.log(`PHASE 1 SUMMARY: Total Violations = ${totalViolations}`);
console.log('================================================================\n');
