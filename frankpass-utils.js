/**
 * FrankPass Utilities
 * Centralized logic for platform normalization, SSO brand aliasing, and UI helpers.
 * Shared between Web and Extension.
 */

const FrankPassUtils = (function () {
    
    // Global Aliases: mapping input & sibling brands to canonical Single Sign-On (SSO) slug
    const GLOBAL_ALIASES = {
        // Google Ecosystem (Unified Google Account SSO)
        'gmail': 'google',
        'googlemail': 'google',
        'gdrive': 'google',
        'googleaccount': 'google',
        'goog': 'google',

        // Microsoft Ecosystem (Unified Microsoft Account SSO)
        'ms': 'microsoft',
        'outlook': 'microsoft',
        'live': 'microsoft',
        'hotmail': 'microsoft',
        'msn': 'microsoft',
        'office365': 'microsoft',
        'office': 'microsoft',
        'xbox': 'microsoft',

        // Apple Ecosystem (Unified Apple ID / iCloud SSO)
        'appleid': 'apple',
        'icloud': 'apple',
        'itunes': 'apple',
        'appstore': 'apple',

        // Meta / Social Ecosystem
        'fb': 'facebook',
        'meta': 'facebook',
        'x': 'twitter',
        'tw': 'twitter',
        'twtr': 'twitter',
        'ig': 'instagram',
        'insta': 'instagram',
        'yt': 'youtube',
        'wa': 'whatsapp',
        'amzn': 'amazon',
        'snap': 'snapchat',
        'pin': 'pinterest',
        'gpay': 'googlepay',
        'gh': 'github',
        'pp': 'paypal',
        'tt': 'tiktok',
        'nf': 'netflix',
        'tv': 'twitch',
        'st': 'steam',
        'dc': 'discord',
        'rd': 'reddit',
        'tg': 'telegram',
        'ln': 'linkedin',

        // Cloud & DevOps Independent Slugs
        'aws': 'aws',
        'azure': 'azure',
        'oraclecloud': 'oraclecloud',
        'ibmcloud': 'ibmcloud',
        'alibabacloud': 'alibabacloud',
        'digitalocean': 'digitalocean',
        'hetzner': 'hetzner',
        'linode': 'linode',
        'cloudflare': 'cloudflare',
        'vercel': 'vercel',
        'netlify': 'netlify',
        'supabase': 'supabase',
        'mongodbatlas': 'mongodbatlas',
        'render': 'render',
        'railway': 'railway',
        'flyio': 'flyio',

        // E-Commerce Merchant & Seller Specific Slugs
        'amazonseller': 'amazonseller',
        'amazonkdp': 'amazonkdp',
        'amazonassociates': 'amazonassociates',
        'amazonmerch': 'amazonmerch',
        'flipkartseller': 'flipkartseller',
        'shopifyadmin': 'shopifyadmin',
        'swiggypartner': 'swiggypartner',
        'zomatomerchant': 'zomatomerchant',

        // Indian Financial, Tax, Investment & Govt Aliases
        'boi': 'bankofindia',
        'sbi': 'statebankofindia',
        'onlinesbi': 'statebankofindia',
        'yono': 'statebankofindia',
        'yonosbi': 'statebankofindia',
        'yonobusiness': 'sbicorporate',
        'sbicorporate': 'sbicorporate',
        'sbicard': 'sbicard',
        'sbismart': 'sbisecurities',
        'sbisecurities': 'sbisecurities',
        'pnb': 'punjabnationalbank',
        'pnbone': 'punjabnationalbank',
        'pnbcorp': 'pnbcorporate',
        'pnbcorporate': 'pnbcorporate',
        'hdfc': 'hdfcbank',
        'hdfcnetbanking': 'hdfcbank',
        'hdfccorporate': 'hdfccorporate',
        'hdfcsec': 'hdfcsecurities',
        'hdfcsecurities': 'hdfcsecurities',
        'icici': 'icicibank',
        'imobile': 'icicibank',
        'icicicorporate': 'icicicorporate',
        'icicidirect': 'icicidirect',
        'axis': 'axisbank',
        'axisnetbanking': 'axisbank',
        'axiscorporate': 'axiscorporate',
        'axisdirect': 'axisdirect',
        'kotak': 'kotakmahindrabank',
        'kotak811': 'kotakmahindrabank',
        'kotakcorporate': 'kotakcorporate',
        'kotaksecurities': 'kotaksecurities',
        'bob': 'bankofbaroda',
        'bobworld': 'bankofbaroda',
        'bobcorporate': 'bobcorporate',
        'canara': 'canarabank',
        'canaracorporate': 'canaracorporate',
        'unionbank': 'unionbankofindia',
        'unionbankcorporate': 'unionbankcorporate',
        'idfc': 'idfcfirstbank',
        'idfcfirst': 'idfcfirstbank',
        'rbl': 'rblbank',
        'federal': 'federalbank',
        'indusind': 'indusindbank',
        'zerodha': 'zerodha',
        'kite': 'zerodha',
        'coin': 'zerodha',
        'groww': 'groww',
        'upstox': 'upstox',
        'angelone': 'angelone',
        'dhan': 'dhan',
        'cams': 'camsonline',
        'camsonline': 'camsonline',
        'kfin': 'kfintech',
        'kfintech': 'kfintech',
        'cdsl': 'cdsl',
        'nsdl': 'nsdl',
        'mfcentral': 'mfcentral',
        'itr': 'incometax',
        'incometax': 'incometax',
        'incometaxefiling': 'incometax',
        'gst': 'gstportal',
        'gstportal': 'gstportal',
        'gstn': 'gstportal',
        'epfo': 'epfo',
        'uan': 'epfo',
        'epfouan': 'epfo',
        'parivahan': 'parivahansewa',
        'sarathi': 'parivahansewa',
        'vahan': 'parivahansewa',
        'passport': 'passportseva',
        'passportseva': 'passportseva',
        'digilocker': 'digilocker',
        'digiyatra': 'digiyatra',
        'fastag': 'fastag',
        'cowin': 'cowinportal',
        'abha': 'abhaportal',
        'nps': 'npstrust',
        'enps': 'npstrust',
        'umang': 'umang',
        'jio': 'jio',
        'myjio': 'jio',
        'jiocinema': 'jiocinema',
        'jiosaavn': 'jiosaavn',
        'jiopay': 'jiopaymentsbank',
        'jiopaymentsbank': 'jiopaymentsbank',
        'airtel': 'airtel',
        'airtelthanks': 'airtel',
        'airtelmoney': 'airtelpaymentsbank',
        'airtelpaymentsbank': 'airtelpaymentsbank',
        'paytm': 'paytm',
        'paytmmoney': 'paytmmoney',
        'paytmbank': 'paytmpaymentsbank',
        'paytmpaymentsbank': 'paytmpaymentsbank',
        'vi': 'vodafoneidea',
        'bsnl': 'bsnl',
        'irctc': 'irctc',
        'irctcair': 'irctcair',
        'irctctourism': 'irctctourism',
        'indane': 'indane',
        'indanegas': 'indane',
        'bharatgas': 'bharatgas',
        'hpgas': 'hpgas',
        'uppcl': 'uppcl',
        'mahavitaran': 'msedcl',
        'msedcl': 'msedcl',
        'tatapower': 'tatapower',
        'tataneu': 'tataneu',
        'tatacliq': 'tatacliq',
        'adanielectricity': 'adanielectricity',
        'bses': 'bses',
        'bescom': 'bescom',

        // Global Govt & Public Services Aliases
        'irs': 'internalrevenueservice',
        'ssa': 'socialsecurityadministration',
        'dmv': 'dmvportal',
        'uscis': 'uscis',
        'logingov': 'logingov',
        'idme': 'idme',
        'usps': 'usps',
        'govuk': 'govuk',
        'hmrc': 'hmrc',
        'dvla': 'dvla',
        'nhs': 'nhs',
        'cra': 'canadarevenueagency',
        'servicecanada': 'servicecanada',
        'mygov': 'mygovau',
        'ato': 'australiantaxoffice',
        'singpass': 'singpass',
        'uaepass': 'uaepass',
        'absher': 'absher',
        'nafath': 'nafath'
    };

    // Full Domain & Subdomain Specific Exceptions (100% Comprehensive Industry Registry)
    const VISUAL_ALIASES = {
        // --- 1. Cloud, DevOps & Infrastructure Platforms ---
        'aws.amazon.com': 'aws',
        'console.aws.amazon.com': 'aws',
        'signin.aws.amazon.com': 'aws',
        'portal.azure.com': 'azure',
        'dev.azure.com': 'azure',
        'azure.microsoft.com': 'azure',
        'cloud.oracle.com': 'oraclecloud',
        'myservices.oracle.com': 'oraclecloud',
        'cloud.ibm.com': 'ibmcloud',
        'iam.cloud.ibm.com': 'ibmcloud',
        'intl.alibabacloud.com': 'alibabacloud',
        'account.alibabacloud.com': 'alibabacloud',
        'console.digitalocean.com': 'digitalocean',
        'cloud.digitalocean.com': 'digitalocean',
        'console.hetzner.cloud': 'hetzner',
        'robot.hetzner.com': 'hetzner',
        'cloud.linode.com': 'linode',
        'dash.cloudflare.com': 'cloudflare',
        'dashboard.vercel.com': 'vercel',
        'app.netlify.com': 'netlify',
        'app.supabase.com': 'supabase',
        'cloud.mongodb.com': 'mongodbatlas',
        'dashboard.render.com': 'render',
        'railway.app': 'railway',
        'fly.io': 'flyio',

        // --- 2. Amazon & E-Commerce Sub-Services ---
        'sellercentral.amazon.com': 'amazonseller',
        'sellercentral.amazon.in': 'amazonseller',
        'sellercentral-europe.amazon.com': 'amazonseller',
        'kdp.amazon.com': 'amazonkdp',
        'affiliate-program.amazon.com': 'amazonassociates',
        'affiliate-program.amazon.in': 'amazonassociates',
        'merch.amazon.com': 'amazonmerch',
        'author.amazon.com': 'amazonauthor',
        'advertising.amazon.com': 'amazonads',
        'seller.flipkart.com': 'flipkartseller',
        'admin.shopify.com': 'shopifyadmin',
        'partners.shopify.com': 'shopifyadmin',
        'partner.swiggy.com': 'swiggypartner',
        'merchant.zomato.com': 'zomatomerchant',

        // --- 3. Telecom & Fintech Payments Banks ---
        'payments.airtel.in': 'airtelpaymentsbank',
        'pay.airtel.in': 'airtelpaymentsbank',
        'airtelbank.com': 'airtelpaymentsbank',
        'airtelpaymentsbank.in': 'airtelpaymentsbank',
        'jiopay.com': 'jiopaymentsbank',
        'jiopaymentsbank.com': 'jiopaymentsbank',
        'paytmbank.com': 'paytmpaymentsbank',
        'paytmmoney.com': 'paytmmoney',

        // --- 4. Corporate NetBanking & Institutional Finance ---
        'corporate.icicibank.com': 'icicicorporate',
        'cibnext.icicibank.com': 'icicicorporate',
        'icicidirect.com': 'icicidirect',
        'corporatebanking.hdfcbank.com': 'hdfccorporate',
        'hdfcsec.com': 'hdfcsecurities',
        'yonobusiness.sbi': 'sbicorporate',
        'corp.onlinesbi.sbi': 'sbicorporate',
        'corp.onlinesbi.com': 'sbicorporate',
        'sbicard.com': 'sbicard',
        'sbismart.com': 'sbisecurities',
        'sbisecurities.in': 'sbisecurities',
        'corporate.axisbank.com': 'axiscorporate',
        'corporatebanking.axisbank.com': 'axiscorporate',
        'axisdirect.in': 'axisdirect',
        'corporate.kotak.com': 'kotakcorporate',
        'kotaksecurities.com': 'kotaksecurities',
        'bobibanking.com': 'bobcorporate',
        'pnbcorp.com': 'pnbcorporate',
        'corporate.canarabank.in': 'canaracorporate',
        'corp.unionbankonline.co.in': 'unionbankcorporate',

        // --- 5. Unified Global SSO Ecosystems ---
        'gmail.com': 'google',
        'googlemail.com': 'google',
        'mail.google.com': 'google',
        'accounts.google.com': 'google',
        'drive.google.com': 'google',
        'photos.google.com': 'google',
        'play.google.com': 'google',
        'youtube.com': 'youtube',
        'youtu.be': 'youtube',
        'outlook.com': 'microsoft',
        'hotmail.com': 'microsoft',
        'live.com': 'microsoft',
        'login.live.com': 'microsoft',
        'login.microsoftonline.com': 'microsoft',
        'icloud.com': 'apple',
        'appleid.apple.com': 'apple',
        'fb.com': 'facebook',
        'm.facebook.com': 'facebook',
        'web.whatsapp.com': 'whatsapp',
        't.me': 'telegram',
        'bit.ly': 'bitly',
        'amzn.to': 'amazon',
        'amzn.in': 'amazon',

        // --- 6. Indian & Global Public / Regulatory Services ---
        'incometax.gov.in': 'incometax',
        'incometaxindiaefiling.gov.in': 'incometax',
        'gst.gov.in': 'gstportal',
        'epfindia.gov.in': 'epfo',
        'unifiedportal-mem.epfindia.gov.in': 'epfo',
        'parivahan.gov.in': 'parivahansewa',
        'sarathi.parivahan.gov.in': 'parivahansewa',
        'vahan.parivahan.gov.in': 'parivahansewa',
        'passportindia.gov.in': 'passportseva',
        'digilocker.gov.in': 'digilocker',
        'kite.zerodha.com': 'zerodha',
        'groww.in': 'groww',
        'upstox.com': 'upstox',
        'irctc.co.in': 'irctc',
        'air.irctc.co.in': 'irctcair',
        'irctctourism.com': 'irctctourism',
        'irs.gov': 'internalrevenueservice',
        'ssa.gov': 'socialsecurityadministration',
        'gov.uk': 'govuk',
        'canada.ca': 'canadarevenueagency'
    };

    // Human-friendly ecosystem labels & hints
    const ECOSYSTEM_LABELS = {
        'google': 'Google Account SSO',
        'microsoft': 'Microsoft Account SSO',
        'apple': 'Apple ID / iCloud',
        'facebook': 'Meta / Facebook',
        'aws': 'Amazon Web Services (AWS Cloud)',
        'azure': 'Microsoft Azure Cloud',
        'oraclecloud': 'Oracle Cloud Infrastructure',
        'ibmcloud': 'IBM Cloud Platform',
        'alibabacloud': 'Alibaba Cloud',
        'amazonseller': 'Amazon Seller Central',
        'amazonkdp': 'Amazon Kindle Direct Publishing',
        'amazonassociates': 'Amazon Associates / Affiliate',
        'amazonmerch': 'Merch by Amazon',
        'flipkartseller': 'Flipkart Seller Hub',
        'shopifyadmin': 'Shopify Store Admin',
        'swiggypartner': 'Swiggy Partner Portal',
        'zomatomerchant': 'Zomato Merchant Portal',
        'airtelpaymentsbank': 'Airtel Payments Bank',
        'jiopaymentsbank': 'Jio Payments Bank',
        'paytmpaymentsbank': 'Paytm Payments Bank',
        'paytmmoney': 'Paytm Money (Stocks & MF)',
        'icicicorporate': 'ICICI Bank Corporate NetBanking',
        'icicidirect': 'ICICI Direct Investments',
        'hdfccorporate': 'HDFC Bank Corporate Banking',
        'hdfcsecurities': 'HDFC Securities',
        'sbicorporate': 'SBI YONO Business / Corporate',
        'sbicard': 'SBI Credit Card Portal',
        'sbisecurities': 'SBI Securities',
        'axiscorporate': 'Axis Bank Corporate NetBanking',
        'axisdirect': 'Axis Direct',
        'kotakcorporate': 'Kotak Corporate Banking',
        'kotaksecurities': 'Kotak Securities',
        'bobcorporate': 'Bank of Baroda Corporate',
        'pnbcorporate': 'PNB Corporate NetBanking',
        'canaracorporate': 'Canara Bank Corporate',
        'unionbankcorporate': 'Union Bank Corporate',
        'irctcair': 'IRCTC Air Flight Booking',
        'irctctourism': 'IRCTC Tourism Portal'
    };

    /**
     * Normalizes a raw input string into a standard FrankPass platform slug.
     * Guaranteed to be identical across Web and Extension.
     */
    function getNormalizedPlatform(raw) {
        if (!raw) return '';
        let platform = raw.toLowerCase().trim();
        
        // 1. Strip protocol, query parameters and hash anchors
        platform = platform.replace(/^(https?:\/\/)?/, '').split('?')[0].split('#')[0];
        
        // If it looks like a URL domain with a path (e.g. "github.com/login" or "incometax.gov.in/iec"), strip the path
        if (platform.includes('/') && (raw.startsWith('http') || /^[a-z0-9.-]+\.[a-z]{2,}\//i.test(platform))) {
            platform = platform.split('/')[0];
        }

        // 2. Handle email signatures (treat everything after @ as the platform domain)
        if (platform.includes('@')) {
            platform = platform.split('@')[1];
        }

        // 3. Priority Check: Direct match in Visual / Subdomain Exception Registry (e.g. "aws.amazon.com", "portal.azure.com")
        if (VISUAL_ALIASES[platform]) {
            return VISUAL_ALIASES[platform];
        }

        // 4. Strip common generic subdomain noise
        const strippedPlatform = platform.replace(/^(www\.|m\.|app\.|login\.|secure\.|auth\.|account\.)/, '');
        if (VISUAL_ALIASES[strippedPlatform]) {
            return VISUAL_ALIASES[strippedPlatform];
        }
        platform = strippedPlatform;
        
        // 5. Strip parenthetical and trailing hyphen acronym suffixes
        platform = platform.replace(/\s+[-–—]\s+[a-z0-9\s]+$/, '');
        platform = platform.replace(/\s*\([^)]*\)/g, '');

        // 6. Check again if cleaned string matches an alias
        if (VISUAL_ALIASES[platform]) {
            return VISUAL_ALIASES[platform];
        }

        // 7. Robust Domain Extraction (handles .co.uk, .com.au, .co.in, .gov.in etc)
        let domainParts = platform.split('.');
        if (domainParts.length > 2 && (domainParts[domainParts.length - 2].length <= 3)) {
            // e.g., amazon.co.uk -> amazon, incometax.gov.in -> incometax
            platform = domainParts[domainParts.length - 3];
        } else if (domainParts.length >= 2) {
            // e.g., google.com -> google, gmail.com -> gmail
            platform = domainParts[domainParts.length - 2];
        } else {
            platform = domainParts[0];
        }
        
        // 8. Sanitize (only letters and numbers)
        platform = platform.replace(/[^a-z0-9]/g, '');

        // 9. Apply Global Aliases (e.g., sbi -> statebankofindia, itr -> incometax, aws -> aws)
        return GLOBAL_ALIASES[platform] || platform;
    }

    /**
     * Returns the Pretty Name from the platforms list if it exists.
     * @param {string} slug - The normalized slug (e.g., 'facebook')
     * @param {Object} platformDB - The global regionalPlatforms object
     */
    function getPrettyNameFromDB(slug, platformDB) {
        if (!platformDB) return null;
        for (let region in platformDB) {
            const match = platformDB[region].find(p => getNormalizedPlatform(p) === slug);
            if (match) return match;
        }
        return null;
    }

    /**
     * Returns a user-friendly hint indicating how the platform name is interpreted.
     * @param {string} raw - The raw input string.
     */
    function getSeedHint(raw) {
        const normalized = getNormalizedPlatform(raw);
        if (!normalized) return '';
        
        const label = ECOSYSTEM_LABELS[normalized];
        if (label) {
            return `Using as: "${normalized}" (${label})`;
        }
        
        return `Using as: "${normalized}"`;
    }

    return {
        getNormalizedPlatform: getNormalizedPlatform,
        getPrettyNameFromDB: getPrettyNameFromDB,
        getSeedHint: getSeedHint,
        GLOBAL_ALIASES: GLOBAL_ALIASES,
        VISUAL_ALIASES: VISUAL_ALIASES,
        ECOSYSTEM_LABELS: ECOSYSTEM_LABELS
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FrankPassUtils;
}
