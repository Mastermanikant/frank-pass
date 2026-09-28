const fs = require('fs');
const path = require('path');

const dir = 'D:/01_Websites_and_Content/MMY_Website_Project/07_frankpass.com/01_Website_App';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let indexCount = 0;
let noindexCount = 0;
let details = [];

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf-8');
  const robotsMatch = content.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  const robots = robotsMatch ? robotsMatch[1] : 'NOT_SET (Default Index)';
  const title = titleMatch ? titleMatch[1].trim() : 'No Title';
  const isNoindex = robots.toLowerCase().includes('noindex');
  
  if (isNoindex) noindexCount++;
  else indexCount++;
  
  details.push({
    file: f,
    seoStatus: isNoindex ? 'OFF (noindex)' : 'ON (index, follow)',
    robots: robots,
    title: title
  });
});

console.log('================================================================');
console.log('  🛡️  FRANKPASS.COM SEO & PAGE AUDIT SUMMARY');
console.log('================================================================');
console.log(`TOTAL HTML PAGES: ${files.length}`);
console.log(`SEO ON (Index, Follow)    : ${indexCount}`);
console.log(`SEO OFF (Noindex / Hidden): ${noindexCount}`);
console.log('================================================================\n');

details.forEach((d, idx) => {
  console.log(`${(idx + 1).toString().padStart(2, ' ')}. [${d.seoStatus.padEnd(17)}] ${d.file.padEnd(45)} | ${d.robots}`);
});
