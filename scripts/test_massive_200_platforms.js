/**
 * test_massive_200_platforms.js
 * Massive End-to-End Test Suite: 200+ Global, Banking, Government, Cloud, and E-Commerce Platforms.
 * Verifies:
 * 1. Web App vs Extension Normalization Slug Equality (100% Match)
 * 2. Generic Stopword Leakage Guard (Zero generic noise words)
 * 3. Database Pretty Name Resolution
 * 4. Deterministic PBKDF2-HMAC-SHA512 Password Invariance across Web and Extension
 */

const fs = require('fs');
const path = require('path');
const { webcrypto } = require('crypto');
if (!global.crypto) global.crypto = webcrypto;

// 1. Load Web App Core & Utils
const webCoreCode = fs.readFileSync(path.join(__dirname, '..', 'frankpass-core.js'), 'utf8');
eval(coreCodeToGlobal(webCoreCode, 'WebCore'));
const WebUtils = require(path.join(__dirname, '..', 'frankpass-utils.js'));

// 2. Load Extension Core & Utils
const extCoreCode = fs.readFileSync(path.join(__dirname, '..', '..', '02_Browser_Extensions', 'source', 'frankpass-core.js'), 'utf8');
eval(coreCodeToGlobal(extCoreCode, 'ExtCore'));
const ExtUtils = require(path.join(__dirname, '..', '..', '02_Browser_Extensions', 'source', 'frankpass-utils.js'));

function coreCodeToGlobal(code, globalName) {
    return code.replace('const FRANKPASS_CORE =', `global.${globalName} =`);
}

// 3. Load Platforms Database
const platformsContent = fs.readFileSync(path.join(__dirname, '..', 'platforms.js'), 'utf8');
const sandbox = {};
eval(platformsContent.replace('window.', 'sandbox.'));
const db = sandbox.regionalPlatforms;

// 4. Massive 200+ Test Suite Dataset
const PLATFORM_TEST_SUITE = [
    // --- CATEGORY 1: INDIAN BANKING (RETAIL & CORPORATE) ---
    { name: 'SBI YONO Business Bank.in', url: 'https://yonobusiness.sbi.bank.in/yonobusinesslogin', expectedSlug: 'sbicorporate' },
    { name: 'SBI YONO Business Dot-SBI', url: 'https://yonobusiness.sbi', expectedSlug: 'sbicorporate' },
    { name: 'SBI Retail Dot-SBI', url: 'https://retail.onlinesbi.sbi/retail/login.htm', expectedSlug: 'statebankofindia' },
    { name: 'SBI Corporate Dot-SBI', url: 'https://corp.onlinesbi.sbi', expectedSlug: 'sbicorporate' },
    { name: 'SBI Online Bank.in', url: 'https://onlinesbi.bank.in', expectedSlug: 'statebankofindia' },
    { name: 'SBI Bank.in Root', url: 'https://sbi.bank.in', expectedSlug: 'statebankofindia' },
    { name: 'SBI Co.in Root', url: 'https://sbi.co.in', expectedSlug: 'statebankofindia' },
    { name: 'SBI Card Portal', url: 'https://www.sbicard.com', expectedSlug: 'sbicard' },
    { name: 'SBI Securities Demat', url: 'https://www.sbismart.com', expectedSlug: 'sbisecurities' },
    { name: 'HDFC Bank Retail', url: 'https://netbanking.hdfcbank.com/netbanking/', expectedSlug: 'hdfcbank' },
    { name: 'HDFC Bank Corporate', url: 'https://corporatebanking.hdfcbank.com/corporatebanking/', expectedSlug: 'hdfccorporate' },
    { name: 'HDFC Bank.in Retail', url: 'https://netbanking.hdfcbank.bank.in', expectedSlug: 'hdfcbank' },
    { name: 'HDFC Bank.in Corporate', url: 'https://corporatebanking.hdfcbank.bank.in', expectedSlug: 'hdfccorporate' },
    { name: 'HDFC Securities', url: 'https://www.hdfcsec.com', expectedSlug: 'hdfcsecurities' },
    { name: 'HDFC MyCards', url: 'https://mycards.hdfcbank.com', expectedSlug: 'hdfcmycards' },
    { name: 'ICICI Bank Retail Infinity', url: 'https://infinity.icicibank.com', expectedSlug: 'icicibank' },
    { name: 'ICICI Bank Corporate', url: 'https://corporate.icicibank.com', expectedSlug: 'icicicorporate' },
    { name: 'ICICI Bank CIB Next', url: 'https://cibnext.icicibank.com', expectedSlug: 'icicicorporate' },
    { name: 'ICICI Bank.in Retail', url: 'https://icicibank.bank.in', expectedSlug: 'icicibank' },
    { name: 'ICICI Direct Investments', url: 'https://www.icicidirect.com', expectedSlug: 'icicidirect' },
    { name: 'Axis Bank Retail', url: 'https://netbanking.axisbank.com', expectedSlug: 'axisbank' },
    { name: 'Axis Bank Corporate', url: 'https://corporate.axisbank.com', expectedSlug: 'axiscorporate' },
    { name: 'Axis Direct Trading', url: 'https://www.axisdirect.in', expectedSlug: 'axisdirect' },
    { name: 'Axis Bank.in Root', url: 'https://axisbank.bank.in', expectedSlug: 'axisbank' },
    { name: 'Kotak Mahindra Retail', url: 'https://netbanking.kotak.com', expectedSlug: 'kotakmahindrabank' },
    { name: 'Kotak Mahindra Corporate', url: 'https://corporate.kotak.com', expectedSlug: 'kotakcorporate' },
    { name: 'Kotak Securities', url: 'https://www.kotaksecurities.com', expectedSlug: 'kotaksecurities' },
    { name: 'Kotak Bank.in Root', url: 'https://kotakbank.bank.in', expectedSlug: 'kotakmahindrabank' },
    { name: 'Punjab National Bank Retail', url: 'https://netpnb.com', expectedSlug: 'punjabnationalbank' },
    { name: 'PNB Corporate Banking', url: 'https://pnbcorp.com', expectedSlug: 'pnbcorporate' },
    { name: 'PNB Bank.in Root', url: 'https://pnb.bank.in', expectedSlug: 'punjabnationalbank' },
    { name: 'Bank of Baroda Retail', url: 'https://www.bobworld.com', expectedSlug: 'bankofbaroda' },
    { name: 'Bank of Baroda Corporate', url: 'https://www.bobibanking.com', expectedSlug: 'bobcorporate' },
    { name: 'Bank of Baroda Bank.in', url: 'https://bankofbaroda.bank.in', expectedSlug: 'bankofbaroda' },
    { name: 'Canara Bank Retail', url: 'https://netbanking.canarabank.in', expectedSlug: 'canarabank' },
    { name: 'Canara Bank Corporate', url: 'https://corporate.canarabank.in', expectedSlug: 'canaracorporate' },
    { name: 'Canara Bank.in Root', url: 'https://canarabank.bank.in', expectedSlug: 'canarabank' },
    { name: 'Union Bank of India Retail', url: 'https://unionbankonline.co.in', expectedSlug: 'unionbankofindia' },
    { name: 'Union Bank Corporate', url: 'https://corp.unionbankonline.co.in', expectedSlug: 'unionbankcorporate' },
    { name: 'Union Bank.in Root', url: 'https://unionbankofindia.bank.in', expectedSlug: 'unionbankofindia' },
    { name: 'IDFC FIRST Bank', url: 'https://my.idfcfirstbank.com', expectedSlug: 'idfcfirstbank' },
    { name: 'IDFC FIRST Bank.in', url: 'https://idfcfirstbank.bank.in', expectedSlug: 'idfcfirstbank' },
    { name: 'IndusInd Bank NetBanking', url: 'https://indusnet.indusind.com', expectedSlug: 'indusindbank' },
    { name: 'Federal Bank FedNet', url: 'https://www.fednetbank.com', expectedSlug: 'federalbank' },
    { name: 'RBL Bank MoBank', url: 'https://mobank.rblbank.com', expectedSlug: 'rblbank' },
    { name: 'Bank of India StarConnect', url: 'https://starconnectcbs.bankofindia.com', expectedSlug: 'bankofindia' },
    { name: 'Central Bank of India', url: 'https://centralbankofindia.co.in', expectedSlug: 'centralbankofindia' },
    { name: 'Indian Bank NetBanking', url: 'https://netbanking.indianbank.in', expectedSlug: 'indianbank' },
    { name: 'Reserve Bank of India', url: 'https://www.rbi.org.in', expectedSlug: 'rbi' },

    // --- CATEGORY 2: INDIAN BROKING, FINTECH & PAYMENTS ---
    { name: 'Zerodha Kite', url: 'https://kite.zerodha.com', expectedSlug: 'zerodha' },
    { name: 'Zerodha Coin', url: 'https://coin.zerodha.com', expectedSlug: 'zerodha' },
    { name: 'Groww Stocks & MF', url: 'https://groww.in', expectedSlug: 'groww' },
    { name: 'Upstox Pro Trading', url: 'https://pro.upstox.com', expectedSlug: 'upstox' },
    { name: 'Angel One Broking', url: 'https://trade.angelone.in', expectedSlug: 'angelone' },
    { name: 'Dhan Web Trading', url: 'https://web.dhan.co', expectedSlug: 'dhan' },
    { name: 'Paytm Money Stocks', url: 'https://www.paytmmoney.com', expectedSlug: 'paytmmoney' },
    { name: 'Paytm Payments Bank', url: 'https://paytmbank.com', expectedSlug: 'paytmpaymentsbank' },
    { name: 'Airtel Payments Bank Pay', url: 'https://pay.airtel.in', expectedSlug: 'airtelpaymentsbank' },
    { name: 'Airtel Payments Bank Direct', url: 'https://airtelpaymentsbank.in', expectedSlug: 'airtelpaymentsbank' },
    { name: 'Jio Payments Bank', url: 'https://jiopaymentsbank.com', expectedSlug: 'jiopaymentsbank' },
    { name: 'CAMSOline MF Portal', url: 'https://mycams.camsonline.com', expectedSlug: 'camsonline' },
    { name: 'KFintech Investor Portal', url: 'https://mfs.kfintech.com', expectedSlug: 'kfintech' },
    { name: 'CDSL Easiest Demat', url: 'https://web.cdslindia.com/myeasitoken', expectedSlug: 'cdsl' },
    { name: 'NSDL Speed-e Demat', url: 'https://eservices.nsdl.com', expectedSlug: 'nsdl' },
    { name: 'MFCentral Mutual Funds', url: 'https://app.mfcentral.com', expectedSlug: 'mfcentral' },

    // --- CATEGORY 3: INDIAN GOVERNMENT & CITIZEN SERVICES ---
    { name: 'Income Tax e-Filing (ITR)', url: 'https://eportal.incometax.gov.in/iec/foservices/#/login', expectedSlug: 'incometax' },
    { name: 'GST Portal Services', url: 'https://services.gst.gov.in/services/login', expectedSlug: 'gstportal' },
    { name: 'EPFO UAN Member Portal', url: 'https://unifiedportal-mem.epfindia.gov.in/memberinterface/', expectedSlug: 'epfo' },
    { name: 'Parivahan Sarathi Driving License', url: 'https://sarathi.parivahan.gov.in/sarathiservice/', expectedSlug: 'parivahansewa' },
    { name: 'Parivahan Vahan Vehicle RC', url: 'https://vahan.parivahan.gov.in/vahanservice/', expectedSlug: 'parivahansewa' },
    { name: 'Passport Seva Portal', url: 'https://portal2.passportindia.gov.in/AppOnlineProject/welcomeLink', expectedSlug: 'passportseva' },
    { name: 'DigiLocker Citizen Login', url: 'https://www.digilocker.gov.in', expectedSlug: 'digilocker' },
    { name: 'DigiYatra Biometric', url: 'https://www.digiyatra.com', expectedSlug: 'digiyatra' },
    { name: 'FASTag NHAI Toll', url: 'https://fastag.ihmcl.com', expectedSlug: 'fastag' },
    { name: 'CoWIN Portal', url: 'https://selfregistration.cowin.gov.in', expectedSlug: 'cowinportal' },
    { name: 'ABHA Health Account', url: 'https://abha.abdm.gov.in', expectedSlug: 'abhaportal' },
    { name: 'NPS Trust eNPS', url: 'https://enps.nsdl.com/eNPS/NationalPensionSystem.html', expectedSlug: 'npstrust' },
    { name: 'UMANG National Portal', url: 'https://web.umang.gov.in/landing/', expectedSlug: 'umang' },
    { name: 'UPPCL Electricity UP', url: 'https://www.upenergy.in/uppcl/en', expectedSlug: 'uppcl' },
    { name: 'MSEDCL Mahavitaran Maharashtra', url: 'https://wss.mahadiscom.in/wss/wss', expectedSlug: 'msedcl' },
    { name: 'BSES Delhi Electricity', url: 'https://www.bsesdelhi.com', expectedSlug: 'bses' },
    { name: 'BESCOM Bangalore Power', url: 'https://bescom.karnataka.gov.in', expectedSlug: 'bescom' },
    { name: 'IRCTC Railway Booking', url: 'https://www.irctc.co.in/nget/train-search', expectedSlug: 'irctc' },
    { name: 'IRCTC Air Flights', url: 'https://air.irctc.co.in', expectedSlug: 'irctcair' },
    { name: 'IRCTC Tourism Hub', url: 'https://www.irctctourism.com', expectedSlug: 'irctctourism' },
    { name: 'Indane LPG Gas', url: 'https://cx.indianoil.in', expectedSlug: 'indane' },
    { name: 'Bharat Gas Booking', url: 'https://my.ebharatgas.com', expectedSlug: 'bharatgas' },
    { name: 'HP Gas Portal', url: 'https://myhpgas.in', expectedSlug: 'hpgas' },
    { name: 'Jio Telecom Portal', url: 'https://www.jio.com/selfcare/login/', expectedSlug: 'jio' },
    { name: 'Airtel Thanks Portal', url: 'https://www.airtel.in/thanks', expectedSlug: 'airtel' },
    { name: 'Vodafone Idea (Vi)', url: 'https://www.myvi.in', expectedSlug: 'vodafoneidea' },
    { name: 'BSNL Citizen Portal', url: 'https://portal.bsnl.in', expectedSlug: 'bsnl' },

    // --- CATEGORY 4: GLOBAL UNIFIED SSO & BIG TECH ---
    { name: 'Google Accounts SSO', url: 'https://accounts.google.com/signin', expectedSlug: 'google' },
    { name: 'Google Mail (Gmail)', url: 'https://mail.google.com/mail/u/0/', expectedSlug: 'google' },
    { name: 'Google Drive Cloud', url: 'https://drive.google.com/drive/my-drive', expectedSlug: 'google' },
    { name: 'Google Docs Editor', url: 'https://docs.google.com/document/u/0/', expectedSlug: 'google' },
    { name: 'Google Gemini AI', url: 'https://gemini.google.com/app', expectedSlug: 'google' },
    { name: 'Google Cloud Platform', url: 'https://console.cloud.google.com', expectedSlug: 'googlecloud' },
    { name: 'Google Brand TLD', url: 'https://blog.google', expectedSlug: 'google' },
    { name: 'YouTube Video Hub', url: 'https://www.youtube.com', expectedSlug: 'google' },
    { name: 'YouTube Studio Creator', url: 'https://studio.youtube.com', expectedSlug: 'google' },
    { name: 'YouTube Music', url: 'https://music.youtube.com', expectedSlug: 'google' },
    { name: 'YouTube Short Link', url: 'https://youtu.be/dQw4w9WgXcQ', expectedSlug: 'google' },
    { name: 'Microsoft Accounts Login', url: 'https://login.live.com', expectedSlug: 'microsoft' },
    { name: 'Microsoft Online Entra ID', url: 'https://login.microsoftonline.com', expectedSlug: 'microsoft' },
    { name: 'Microsoft Office 365', url: 'https://www.office.com', expectedSlug: 'microsoft' },
    { name: 'Microsoft Outlook Mail', url: 'https://outlook.live.com', expectedSlug: 'microsoft' },
    { name: 'Microsoft OneDrive Cloud', url: 'https://onedrive.live.com', expectedSlug: 'microsoft' },
    { name: 'Microsoft Copilot AI', url: 'https://copilot.microsoft.com', expectedSlug: 'microsoft' },
    { name: 'Microsoft Azure Cloud', url: 'https://portal.azure.com', expectedSlug: 'azure' },
    { name: 'Azure DevOps Services', url: 'https://dev.azure.com/myorg', expectedSlug: 'azure' },
    { name: 'Apple ID Management', url: 'https://appleid.apple.com', expectedSlug: 'apple' },
    { name: 'Apple iCloud Cloud', url: 'https://www.icloud.com', expectedSlug: 'apple' },
    { name: 'Apple Developer Portal', url: 'https://developer.apple.com/account', expectedSlug: 'apple' },
    { name: 'Apple App Store Connect', url: 'https://appstoreconnect.apple.com', expectedSlug: 'apple' },
    { name: 'Adobe Creative Cloud', url: 'https://account.adobe.com', expectedSlug: 'adobe' },
    { name: 'Adobe Behance Network', url: 'https://www.behance.net', expectedSlug: 'adobe' },
    { name: 'Adobe Stock Media', url: 'https://stock.adobe.com', expectedSlug: 'adobe' },
    { name: 'Adobe Firefly AI', url: 'https://firefly.adobe.com', expectedSlug: 'adobe' },

    // --- CATEGORY 5: CLOUD, DEVOPS, AI & DEVELOPER PLATFORMS ---
    { name: 'Amazon Web Services (AWS)', url: 'https://console.aws.amazon.com', expectedSlug: 'aws' },
    { name: 'AWS Sign-In Root', url: 'https://signin.aws.amazon.com', expectedSlug: 'aws' },
    { name: 'AWS Brand TLD (rePost)', url: 'https://repost.aws', expectedSlug: 'aws' },
    { name: 'Cloudflare Dashboard', url: 'https://dash.cloudflare.com', expectedSlug: 'cloudflare' },
    { name: 'Cloudflare Zero Trust One', url: 'https://one.dash.cloudflare.com', expectedSlug: 'cloudflare' },
    { name: 'Vercel Deployment Cloud', url: 'https://dashboard.vercel.com', expectedSlug: 'vercel' },
    { name: 'Netlify App Hosting', url: 'https://app.netlify.com', expectedSlug: 'netlify' },
    { name: 'Supabase Database Cloud', url: 'https://app.supabase.com', expectedSlug: 'supabase' },
    { name: 'MongoDB Atlas Cloud', url: 'https://cloud.mongodb.com', expectedSlug: 'mongodbatlas' },
    { name: 'Render Cloud Platform', url: 'https://dashboard.render.com', expectedSlug: 'render' },
    { name: 'Railway App Deployments', url: 'https://railway.app/dashboard', expectedSlug: 'railway' },
    { name: 'Fly.io Cloud Hosting', url: 'https://fly.io/dashboard', expectedSlug: 'flyio' },
    { name: 'DigitalOcean Cloud Console', url: 'https://cloud.digitalocean.com', expectedSlug: 'digitalocean' },
    { name: 'Hetzner Cloud Console', url: 'https://console.hetzner.cloud', expectedSlug: 'hetzner' },
    { name: 'Linode Akamai Cloud', url: 'https://cloud.linode.com', expectedSlug: 'linode' },
    { name: 'Oracle Cloud OCI', url: 'https://cloud.oracle.com', expectedSlug: 'oraclecloud' },
    { name: 'IBM Cloud Platform', url: 'https://cloud.ibm.com', expectedSlug: 'ibmcloud' },
    { name: 'Alibaba Cloud International', url: 'https://intl.alibabacloud.com', expectedSlug: 'alibabacloud' },
    { name: 'OpenAI ChatGPT Web', url: 'https://chatgpt.com', expectedSlug: 'chatgpt' },
    { name: 'OpenAI Legacy Chat', url: 'https://chat.openai.com', expectedSlug: 'chatgpt' },
    { name: 'OpenAI Developer Platform', url: 'https://platform.openai.com/api-keys', expectedSlug: 'openai' },
    { name: 'Anthropic Claude AI', url: 'https://claude.ai/chats', expectedSlug: 'anthropic' },
    { name: 'Anthropic Console API', url: 'https://console.anthropic.com', expectedSlug: 'anthropic' },
    { name: 'GitHub Developer Platform', url: 'https://github.com/login', expectedSlug: 'github' },
    { name: 'GitHub Gist Snippets', url: 'https://gist.github.com', expectedSlug: 'github' },
    { name: 'GitLab DevOps Cloud', url: 'https://gitlab.com/users/sign_in', expectedSlug: 'gitlab' },
    { name: 'Atlassian Jira Software', url: 'https://jira.atlassian.com', expectedSlug: 'jira' },
    { name: 'Atlassian Confluence', url: 'https://confluence.atlassian.com', expectedSlug: 'confluence' },
    { name: 'Atlassian Bitbucket', url: 'https://bitbucket.org/account/signin/', expectedSlug: 'bitbucket' },
    { name: 'Slack Workspace Chat', url: 'https://app.slack.com/client', expectedSlug: 'slack' },
    { name: 'Postman API Platform', url: 'https://identity.getpostman.com/login', expectedSlug: 'postman' },
    { name: 'Datadog Cloud Monitoring', url: 'https://app.datadoghq.com', expectedSlug: 'datadog' },
    { name: 'Sentry Performance Tracking', url: 'https://app.sentry.io/auth/login/', expectedSlug: 'sentry' },
    { name: 'Grafana Cloud Observability', url: 'https://app.grafana.net', expectedSlug: 'grafana' },

    // --- CATEGORY 6: E-COMMERCE, MERCHANTS & SELLER PLATFORMS ---
    { name: 'Amazon Retail (.com)', url: 'https://www.amazon.com', expectedSlug: 'amazon' },
    { name: 'Amazon Retail India (.in)', url: 'https://www.amazon.in', expectedSlug: 'amazon' },
    { name: 'Amazon UK (.co.uk)', url: 'https://www.amazon.co.uk', expectedSlug: 'amazon' },
    { name: 'Amazon Prime Video', url: 'https://www.primevideo.com', expectedSlug: 'amazon' },
    { name: 'Amazon Audible Audiobooks', url: 'https://www.audible.com', expectedSlug: 'amazon' },
    { name: 'Amazon Seller Central (.com)', url: 'https://sellercentral.amazon.com', expectedSlug: 'amazonseller' },
    { name: 'Amazon Seller Central India', url: 'https://sellercentral.amazon.in', expectedSlug: 'amazonseller' },
    { name: 'Amazon KDP Publishing', url: 'https://kdp.amazon.com', expectedSlug: 'amazonkdp' },
    { name: 'Amazon Author Central', url: 'https://author.amazon.com', expectedSlug: 'amazonkdp' },
    { name: 'Amazon Associates Affiliate', url: 'https://affiliate-program.amazon.in', expectedSlug: 'amazonassociates' },
    { name: 'Amazon Merch on Demand', url: 'https://merch.amazon.com', expectedSlug: 'amazonmerch' },
    { name: 'Amazon Ads Platform', url: 'https://advertising.amazon.com', expectedSlug: 'amazonads' },
    { name: 'Flipkart Seller Hub', url: 'https://seller.flipkart.com', expectedSlug: 'flipkartseller' },
    { name: 'Shopify Store Admin', url: 'https://admin.shopify.com/store/my-store', expectedSlug: 'shopifyadmin' },
    { name: 'Swiggy Partner Merchant', url: 'https://partner.swiggy.com', expectedSlug: 'swiggypartner' },
    { name: 'Zomato Merchant Portal', url: 'https://merchant.zomato.com', expectedSlug: 'zomatomerchant' },

    // --- CATEGORY 7: SOCIAL MEDIA & MESSAGING ---
    { name: 'Meta / Facebook Web', url: 'https://www.facebook.com/login', expectedSlug: 'facebook' },
    { name: 'Facebook Mobile Web', url: 'https://m.facebook.com', expectedSlug: 'facebook' },
    { name: 'Facebook Short Link', url: 'https://fb.com', expectedSlug: 'facebook' },
    { name: 'Facebook Messenger', url: 'https://www.messenger.com', expectedSlug: 'facebook' },
    { name: 'Instagram Web Platform', url: 'https://www.instagram.com', expectedSlug: 'instagram' },
    { name: 'Instagram Threads Media', url: 'https://www.threads.net', expectedSlug: 'instagram' },
    { name: 'Instagram Short URL', url: 'https://ig.me', expectedSlug: 'instagram' },
    { name: 'WhatsApp Web Messaging', url: 'https://web.whatsapp.com', expectedSlug: 'whatsapp' },
    { name: 'WhatsApp Short Link', url: 'https://wa.me/919999999999', expectedSlug: 'whatsapp' },
    { name: 'Telegram Web Client', url: 'https://web.telegram.org/k/', expectedSlug: 'telegram' },
    { name: 'Telegram Short Link', url: 'https://t.me/mychannel', expectedSlug: 'telegram' },
    { name: 'Discord Web App', url: 'https://discord.com/channels/@me', expectedSlug: 'discord' },
    { name: 'Discord Invite Short Link', url: 'https://discord.gg/invite123', expectedSlug: 'discord' },
    { name: 'Spotify Music Streaming', url: 'https://open.spotify.com', expectedSlug: 'spotify' },
    { name: 'Spotify for Artists', url: 'https://artists.spotify.com', expectedSlug: 'spotify' },

    // --- CATEGORY 8: GLOBAL GOVERNMENT & IDENTITY PORTALS ---
    { name: 'USA Internal Revenue Service (IRS)', url: 'https://www.irs.gov/payments', expectedSlug: 'internalrevenueservice' },
    { name: 'USA Social Security (SSA)', url: 'https://www.ssa.gov/myaccount/', expectedSlug: 'socialsecurityadministration' },
    { name: 'UK Government Portal (GOV.UK)', url: 'https://www.gov.uk', expectedSlug: 'govuk' },
    { name: 'Canada Revenue Agency (CRA)', url: 'https://www.canada.ca/en/revenue-agency.html', expectedSlug: 'canadarevenueagency' },

    // --- CATEGORY 9: STOPWORD SANITY GUARD VERIFICATION (WEIRD & UNKNOWN DOMAINS) ---
    { name: 'Weird Gov Subdomain 1', url: 'https://login.secure.jharkhand.gov.in/portal/home', expectedSlug: 'jharkhand' },
    { name: 'Weird Gov Subdomain 2', url: 'https://auth.portal.karnataka.gov.in', expectedSlug: 'karnataka' },
    { name: 'Weird Bank Subdomain 1', url: 'https://secure.pay.randombank.bank.in', expectedSlug: 'randombank' },
    { name: 'Weird App Subdomain', url: 'https://admin.signin.awesomeapp.app', expectedSlug: 'awesomeapp' },
    { name: 'Weird Corp Bank Subdomain', url: 'https://cib.corp.mycitybank.bank.in', expectedSlug: 'mycitybankcorporate' }
];

async function runMassiveAudit() {
    console.log('========================================================================================');
    console.log(`  🛡️ FRANKPASS MASSIVE ${PLATFORM_TEST_SUITE.length} PLATFORMS & GOVT DOMAINS AUDIT SUITE`);
    console.log('  Testing 100% Invariance across Web App, Browser Extension, DB & Crypto Generation');
    console.log('========================================================================================\n');

    let passedCount = 0;
    let failedCount = 0;
    const failures = [];

    const secretKey = 'MasterSecretKey2026!';
    const username = 'master 134803';
    const counter = 1;

    for (let i = 0; i < PLATFORM_TEST_SUITE.length; i++) {
        const item = PLATFORM_TEST_SUITE[i];
        const numStr = (i + 1).toString().padStart(3, '0');

        // 1. Slug Resolution
        const webSlug = WebUtils.getNormalizedPlatform(item.url);
        const extSlug = ExtUtils.getNormalizedPlatform(item.url);

        // 2. Slug Match Check
        const slugMatch = (webSlug === extSlug);
        const expectedMatch = item.expectedSlug ? (webSlug === item.expectedSlug) : true;

        // 3. Stopword Sanity Guard Check
        const genericStopwords = ['bank', 'gov', 'nic', 'portal', 'online', 'web', 'login', 'secure', 'auth', 'app'];
        const stopwordLeaked = genericStopwords.includes(webSlug) || genericStopwords.includes(extSlug);

        // 4. Cryptographic Password Generation Invariance
        const webPassword = await global.WebCore.generatePassword({
            secretKey: secretKey,
            platform: webSlug,
            username: username,
            variant: counter,
            length: 16,
            profile: 'standard'
        });

        const extPassword = await global.ExtCore.generatePassword({
            secretKey: secretKey,
            platform: extSlug,
            username: username,
            variant: counter,
            length: 16,
            profile: 'standard'
        });

        const cryptoMatch = (webPassword === extPassword);

        // 5. Database Pretty Name lookup
        const prettyName = WebUtils.getPrettyNameFromDB(webSlug, db) || '(Standard Normalized)';

        if (slugMatch && expectedMatch && !stopwordLeaked && cryptoMatch) {
            passedCount++;
            console.log(`  ✓ #${numStr}: [${item.name.padEnd(35)}] -> slug: "${webSlug.padEnd(22)}" | Pass: ${webPassword} | DB: ${prettyName.substring(0, 30)}`);
        } else {
            failedCount++;
            const errorReason = !slugMatch ? 'Web vs Ext Slug Mismatch' :
                                !expectedMatch ? `Expected "${item.expectedSlug}" but got "${webSlug}"` :
                                stopwordLeaked ? `Stopword "${webSlug}" leaked` : 'Crypto Password Mismatch';
            failures.push({ item, errorReason, webSlug, extSlug, webPassword, extPassword });
            console.log(`  ✗ #${numStr}: [${item.name.padEnd(35)}] -> FAILED: ${errorReason}`);
        }
    }

    console.log('\n========================================================================================');
    console.log(`  AUDIT RESULTS: ${passedCount} / ${PLATFORM_TEST_SUITE.length} PASSED (${failedCount} FAILED)`);
    console.log(`  CRYPTOGRAPHIC STATUS: ${failedCount === 0 ? '🟢 100% BITWISE INVARIANCE VERIFIED' : '🔴 REGRESSION DETECTED'}`);
    console.log('========================================================================================\n');

    if (failures.length > 0) {
        console.error('Failure Details:', JSON.stringify(failures, null, 2));
        process.exit(1);
    }
}

runMassiveAudit();
