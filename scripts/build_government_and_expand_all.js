const fs = require('fs');
const path = require('path');

const STAGING_DIR = path.join(__dirname, '..', 'data_staging');

const INDIAN_GOVT_AND_PUBLIC = [
    "Income Tax e-Filing (ITR / AIS Portal)",
    "GST Portal (GSTN)",
    "EPFO (UAN / Employees' Provident Fund)",
    "Parivahan Sewa (Sarathi / Vahan)",
    "Passport Seva Portal",
    "DigiLocker (National Digital Locker)",
    "DigiYatra (Biometric Airport Travel)",
    "CoWIN Portal",
    "ABHA (Ayushman Bharat Health Account)",
    "NPS Trust (National Pension System / eNPS)",
    "FASTag (NHAI / IHMCL National Electronic Toll)",
    "UMANG (Unified Mobile App for New-age Governance)",
    "e-Courts Services (eCourts India)",
    "National Scholarship Portal (NSP)",
    "SWAYAM (Ministry of Education)",
    "NPTEL Portal",
    "SARATHI Driving Licence Portal",
    "VAHAN Vehicle Registration Portal",
    "BSE (Bombay Stock Exchange)",
    "NSE (National Stock Exchange)",
    "CDSL (Central Depository Services India)",
    "NSDL (National Securities Depository Limited)",
    "CAMS (Computer Age Management Services)",
    "KFintech (KFin Technologies)",
    "MF Central (Mutual Funds India)",
    "SBI Card (sbicard.com)",
    "Jio Financial Services",
    "Jio (MyJio Portal)",
    "Airtel Thanks Portal",
    "Vodafone Idea (Vi) Selfcare",
    "BSNL Selfcare Portal",
    "Indane (IndianOil LPG Gas)",
    "Bharat Gas (BPCL LPG Gas)",
    "HP Gas (HPCL LPG Gas)",
    "UPPCL (Uttar Pradesh Power Corporation)",
    "MSEDCL (Mahavitaran Maharashtra Electricity)",
    "Tata Power Electricity Portal",
    "Adani Electricity Mumbai",
    "BSES (Delhi Electricity - Rajdhani / Yamuna)",
    "BESCOM (Bangalore Electricity Supply Company)",
    "TANGEDCO (Tamil Nadu Electricity Board)",
    "WBSEDCL (West Bengal State Electricity)",
    "PSPCL (Punjab State Power Corporation)",
    "SBPDCL (South Bihar Power Distribution)",
    "NBPDCL (North Bihar Power Distribution)",
    "APEPDCL (Andhra Pradesh Power Distribution)",
    "TSSPDCL (Telangana Southern Power)",
    "DHBVN (Dakshin Haryana Bijli Vitran Nigam)",
    "UHBVN (Uttar Haryana Bijli Vitran Nigam)",
    "KSEB (Kerala State Electricity Board)",
    "Delhi Metro Rail (DMRC Portal)",
    "Bangalore Metro (Namma Metro BMRCL)",
    "Mumbai Metro One Portal",
    "Kolkata Metro Rail Portal",
    "Chennai Metro Rail (CMRL)",
    "Hyderabad Metro Rail Portal",
    "Zerodha (Kite / Coin)",
    "Groww (Stocks & Mutual Funds)",
    "Upstox (Pro)",
    "Angel One (SmartAPI)",
    "Dhan (Trading App)",
    "Paytm Money",
    "INDmoney App",
    "Kuvera Investment",
    "Navi Loans & Mutual Funds",
    "CRED App",
    "BharatPe App",
    "PhonePe App",
    "Paytm App",
    "BHIM UPI App"
];

const GLOBAL_GOVT_AND_PUBLIC = [
    // USA
    "Internal Revenue Service (IRS / IRS.gov)",
    "Social Security Administration (SSA / My Social Security)",
    "Login.gov (Federal Single Sign-On)",
    "ID.me (Government Identity Verification)",
    "USCIS (U.S. Citizenship and Immigration Services)",
    "USPS (United States Postal Service / Informed Delivery)",
    "Medicare.gov",
    "Medicaid.gov",
    "VA.gov (Veterans Affairs Portal)",
    "USAJOBS (Federal Employment Portal)",
    "StudentAid.gov (Federal Student Aid FAFSA)",
    "SEC EDGAR (Securities and Exchange Commission)",
    "DMV.org / State DMV Portals",
    "CDC (Centers for Disease Control and Prevention)",
    "FEMA (Federal Emergency Management Agency)",
    "FTC (Federal Trade Commission)",
    "USPTO (U.S. Patent and Trademark Office)",

    // UK
    "GOV.UK (Official UK Government Portal)",
    "HMRC (HM Revenue & Customs / Government Gateway)",
    "NHS App (National Health Service)",
    "DVLA (Driver and Vehicle Licensing Agency)",
    "Universal Credit (DWP UK)",
    "Companies House UK",
    "Student Loans Company (SLC UK)",
    "TV Licensing UK",
    "National Rail Enquiries UK",
    "Transport for London (TfL Oyster)",

    // Canada
    "Canada Revenue Agency (CRA / My Account)",
    "Service Canada (My Service Canada Account - MSCA)",
    "GCKey (Government of Canada Single Sign-In)",
    "IRCC (Immigration, Refugees and Citizenship Canada)",
    "Canada Post (Postes Canada)",
    "ServiceOntario Portal",
    "ServiceBC Portal",

    // Australia & New Zealand
    "myGov (Australian Government Portal)",
    "Australian Taxation Office (ATO)",
    "Medicare Australia",
    "Centrelink Australia",
    "Service NSW",
    "VicRoads Portal",
    "RealMe (New Zealand Identity Portal)",
    "Inland Revenue Department (IRD New Zealand)",

    // Europe & Middle East / Asia Digital IDs
    "Singpass (Singapore National Digital Identity)",
    "MyInfo (Government of Singapore)",
    "UAE PASS (National Digital Identity UAE)",
    "ICP (Federal Authority UAE)",
    "Absher (Ministry of Interior Saudi Arabia)",
    "Nafath (National Single Sign-On Saudi Arabia)",
    "ZATCA (Zakat, Tax and Customs Saudi Arabia)",
    "FranceConnect (Identity Portal France)",
    "Ameli.fr (Assurance Maladie France)",
    "Impots.gouv.fr (Tax Portal France)",
    "BundID (German Federal Identity Portal)",
    "ELSTER (Finanzamt Online Germany)",
    "Agencia Tributaria (Spanish Tax Agency)",
    "Agenzia delle Entrate (Italian Revenue Agency)",
    "SPID (Public Digital Identity System Italy)",
    "DigiD (Digital Identity Netherlands)",
    "BankID (Sweden / Norway Digital ID)",
    "MitID (Denmark National Digital ID)",
    "Suomi.fi (Finnish Public Services Portal)"
];

// Save staging JSON
const govtCombined = Array.from(new Set([...INDIAN_GOVT_AND_PUBLIC, ...GLOBAL_GOVT_AND_PUBLIC])).sort();
fs.writeFileSync(path.join(STAGING_DIR, 'global_and_indian_government.json'), JSON.stringify(govtCombined, null, 2), 'utf8');
console.log(`Saved global_and_indian_government.json: ${govtCombined.length} entries`);

// Recompile master staging
const files = fs.readdirSync(STAGING_DIR).filter(f => f.endsWith('.json') && f !== 'all_master_platforms_combined.json');
const masterSet = new Set();
files.forEach(file => {
    try {
        const data = JSON.parse(fs.readFileSync(path.join(STAGING_DIR, file), 'utf8'));
        if (Array.isArray(data)) {
            data.forEach(item => masterSet.add(item.trim()));
        }
    } catch (e) {
        console.error(e.message);
    }
});

const sortedMaster = Array.from(masterSet).sort((a, b) => a.localeCompare(b));
fs.writeFileSync(path.join(STAGING_DIR, 'all_master_platforms_combined.json'), JSON.stringify(sortedMaster, null, 2), 'utf8');
console.log(`Recompiled all_master_platforms_combined.json: ${sortedMaster.length} unique staged platforms.`);
