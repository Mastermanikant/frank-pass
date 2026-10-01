const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html')).sort();

console.log('================================================================');
console.log(`     DEEP SEO AUDIT & BOTTLENECK ANALYSIS (${files.length} PAGES)      `);
console.log('================================================================\n');

const report = [];

for (const file of files) {
  const filePath = path.join(dir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const issues = [];
  const warnings = [];

  // 1. Title Check
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : null;
  if (!title) {
    issues.push('Missing <title> tag');
  } else if (title.length < 25) {
    warnings.push(`Short title (${title.length} chars): "${title}"`);
  } else if (title.length > 70) {
    warnings.push(`Long title (${title.length} chars, may truncate in SERP)`);
  }

  // 2. Meta Description Check
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
                    content.match(/<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i);
  const description = descMatch ? descMatch[1].trim() : null;
  if (!description) {
    issues.push('Missing meta description');
  } else if (description.length < 50) {
    warnings.push(`Short meta description (${description.length} chars)`);
  } else if (description.length > 175) {
    warnings.push(`Long meta description (${description.length} chars, may truncate)`);
  }

  // 3. Robots Meta Check
  const robotsMatch = content.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
  const robots = robotsMatch ? robotsMatch[1].trim() : 'MISSING';
  if (!robotsMatch) {
    issues.push('Missing meta robots tag');
  } else if (robots.includes('noindex')) {
    issues.push(`Meta robots has NOINDEX: "${robots}"`);
  }

  // 4. Canonical Tag Check
  const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i) ||
                         content.match(/<link\s+href=["']([^"']+)["']\s+rel=["']canonical["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : null;
  const expectedCanonical = file === 'index.html' ? 'https://frankpass.com/' : `https://frankpass.com/${file}`;
  if (!canonical) {
    issues.push('Missing canonical tag');
  } else if (canonical !== expectedCanonical && canonical !== `https://frankpass.com/${file.replace('.html', '')}`) {
    warnings.push(`Canonical mismatch: Found "${canonical}", expected "${expectedCanonical}"`);
  }

  // 5. Hreflang Tags Check
  const isHindi = file.endsWith('-hindi.html');
  const counterpart = isHindi ? file.replace('-hindi.html', '.html') : file.replace('.html', '-hindi.html');
  const hasCounterpart = fs.existsSync(path.join(dir, counterpart));
  if (hasCounterpart) {
    const hasHreflangEn = content.includes('hreflang="en"');
    const hasHreflangHi = content.includes('hreflang="hi"');
    if (!hasHreflangEn || !hasHreflangHi) {
      issues.push(`Missing hreflang pairs (EN: ${hasHreflangEn}, HI: ${hasHreflangHi})`);
    }
  }

  // 6. Open Graph & Social Meta
  const ogTitle = content.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
  const ogDesc = content.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
  const ogImage = content.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  const ogUrl = content.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i);
  if (!ogTitle || !ogDesc || !ogImage || !ogUrl) {
    warnings.push(`Incomplete OpenGraph tags (Title:${!!ogTitle}, Desc:${!!ogDesc}, Img:${!!ogImage}, Url:${!!ogUrl})`);
  }

  // 7. Headings Structure (H1 check)
  const h1Matches = [...content.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1Matches.length === 0) {
    issues.push('Missing <h1> tag');
  } else if (h1Matches.length > 1) {
    warnings.push(`Multiple <h1> tags (${h1Matches.length} found)`);
  }

  // 8. Image Alt Tags Check
  const imgMatches = [...content.matchAll(/<img\s+([^>]+)>/gi)];
  let missingAltCount = 0;
  for (const img of imgMatches) {
    if (!img[1].includes('alt=') || /alt=["']\s*["']/.test(img[1])) {
      missingAltCount++;
    }
  }
  if (missingAltCount > 0) {
    warnings.push(`${missingAltCount} image(s) missing alt attribute`);
  }

  // 9. Schema / JSON-LD Check
  const jsonLdMatches = [...content.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
  let validSchema = true;
  if (jsonLdMatches.length > 0) {
    for (const s of jsonLdMatches) {
      try {
        JSON.parse(s[1]);
      } catch (err) {
        issues.push(`Invalid JSON-LD schema syntax: ${err.message}`);
        validSchema = false;
      }
    }
  }

  // 10. Em Dash Check (Rule 32)
  if (content.includes('\u2014') || content.includes('&mdash;')) {
    issues.push('Em Dash violation found');
  }

  report.push({
    file,
    titleLength: title ? title.length : 0,
    descLength: description ? description.length : 0,
    h1Count: h1Matches.length,
    jsonLdCount: jsonLdMatches.length,
    issuesCount: issues.length,
    warningsCount: warnings.length,
    issues,
    warnings
  });
}

console.log('SUMMARY TABLE:');
console.table(report.map(r => ({
  File: r.file,
  Title_Len: r.titleLength,
  Desc_Len: r.descLength,
  H1: r.h1Count,
  Schema: r.jsonLdCount,
  Issues: r.issuesCount,
  Warnings: r.warningsCount
})));

const allIssues = report.filter(r => r.issuesCount > 0);
const allWarnings = report.filter(r => r.warningsCount > 0);

console.log(`\n================================================================`);
console.log(`TOTAL CRITICAL ISSUES (Blockers): ${allIssues.reduce((acc, r) => acc + r.issuesCount, 0)}`);
console.log(`TOTAL SEO WARNINGS (Optimizations): ${allWarnings.reduce((acc, r) => acc + r.warningsCount, 0)}`);
console.log(`================================================================\n`);

if (allIssues.length > 0) {
  console.log('--- CRITICAL ISSUES BREAKDOWN ---');
  allIssues.forEach(r => {
    console.log(`❌ ${r.file}:`);
    r.issues.forEach(i => console.log(`   - ${i}`));
  });
}

if (allWarnings.length > 0) {
  console.log('\n--- WARNINGS / OPTIMIZATION BREAKDOWN ---');
  allWarnings.forEach(r => {
    console.log(`⚠️ ${r.file}:`);
    r.warnings.forEach(w => console.log(`   - ${w}`));
  });
}
