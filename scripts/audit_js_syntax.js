const fs = require('fs');
const path = require('path');
const vm = require('vm');

function checkScriptsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let scriptIdx = 0;
  let fileErrors = 0;

  while ((match = scriptRegex.exec(content)) !== null) {
    scriptIdx++;
    const code = match[1].trim();
    if (match[0].includes('application/ld+json')) continue;
    if (!code) continue;

    try {
      new vm.Script(code);
    } catch (err) {
      console.error(`[SYNTAX ERROR] ${path.basename(filePath)} (script #${scriptIdx}): ${err.message}`);
      fileErrors++;
    }
  }
  return fileErrors;
}

function checkStandaloneJS(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  try {
    new vm.Script(code);
    return 0;
  } catch (err) {
    console.error(`[SYNTAX ERROR in JS] ${path.basename(filePath)}: ${err.message}`);
    return 1;
  }
}

const dir = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
const blogFiles = fs.readdirSync(path.join(dir, 'blog')).filter(f => f.endsWith('.html')).map(f => path.join('blog', f));
const allHtml = [...htmlFiles, ...blogFiles];

let totalErrors = 0;
allHtml.forEach(f => {
  totalErrors += checkScriptsInFile(path.join(dir, f));
});

const jsFiles = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
jsFiles.forEach(f => {
  totalErrors += checkStandaloneJS(path.join(dir, f));
});

console.log(`\nAudited ${allHtml.length} HTML files and ${jsFiles.length} JS files.`);
console.log(`Total Syntax Errors Found: ${totalErrors}`);
