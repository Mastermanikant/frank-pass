const fs = require('fs');
const path = require('path');

const utils = fs.readFileSync(path.join(__dirname, '..', 'frankpass-utils.js'), 'utf8').replace('const FrankPassUtils =', 'global.FrankPassUtils =');
eval(utils);
const content = fs.readFileSync(path.join(__dirname, '..', 'platforms.js'), 'utf8');
const sandbox = {};
eval(content.replace('window.', 'sandbox.'));
const db = sandbox.regionalPlatforms;

const queries = [
    'Zerodha', 'zerodha', 'kite', 'groww', 'upstox', 'angelone', 'dhan',
    'ITR', 'incometax', 'incometax.gov.in', 'GST', 'epfo', 'uan', 'parivahan', 'vahan', 'sarathi',
    'passport', 'digilocker', 'digiyatra', 'fastag', 'cowin', 'abha', 'nps', 'umang',
    'SBI', 'yono', 'sbicard', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'Kotak811', 'BOB', 'bobworld',
    'UPPCL', 'MSEDCL', 'BSES', 'BESCOM', 'Indane', 'Bharat Gas', 'HP Gas',
    'IRS', 'irs.gov', 'SSA', 'USCIS', 'Login.gov', 'ID.me', 'USPS', 'GOV.UK', 'HMRC', 'DVLA', 'CRA', 'myGov', 'Singpass', 'UAE PASS', 'Absher'
];

console.log('--- Testing Query Resolution ---');
let pass = 0, fail = 0;
queries.forEach(q => {
    const slug = global.FrankPassUtils.getNormalizedPlatform(q);
    const pretty = global.FrankPassUtils.getPrettyNameFromDB(slug, db);
    if (pretty) {
        pass++;
        console.log(`  ✓ ${q.padEnd(20)} -> slug: ${slug.padEnd(25)} | DB Match: ${pretty}`);
    } else {
        fail++;
        console.log(`  ✗ ${q.padEnd(20)} -> slug: ${slug.padEnd(25)} | NO MATCH`);
    }
});

console.log(`\nResult: ${pass} PASSED, ${fail} FAILED out of ${queries.length} queries.`);
if (fail > 0) process.exit(1);
