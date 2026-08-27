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

        // Indian Financial, Tax, Investment & Govt Aliases
        'boi': 'bankofindia',
        'sbi': 'statebankofindia',
        'onlinesbi': 'statebankofindia',
        'yono': 'statebankofindia',
        'yonosbi': 'statebankofindia',
        'sbicard': 'sbicard',
        'pnb': 'punjabnationalbank',
        'pnbone': 'punjabnationalbank',
        'hdfc': 'hdfcbank',
        'hdfcnetbanking': 'hdfcbank',
        'icici': 'icicibank',
        'imobile': 'icicibank',
        'axis': 'axisbank',
        'axisnetbanking': 'axisbank',
        'kotak': 'kotakmahindrabank',
        'kotak811': 'kotakmahindrabank',
        'bob': 'bankofbaroda',
        'bobworld': 'bankofbaroda',
        'canara': 'canarabank',
        'unionbank': 'unionbankofindia',
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
        'airtel': 'airtel',
        'airtelthanks': 'airtel',
        'vi': 'vodafoneidea',
        'bsnl': 'bsnl',
        'indane': 'indane',
        'indanegas': 'indane',
        'bharatgas': 'bharatgas',
        'hpgas': 'hpgas',
        'uppcl': 'uppcl',
        'mahavitaran': 'msedcl',
        'msedcl': 'msedcl',
        'tatapower': 'tatapower',
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

    // Full Domain Specific Aliases: for direct URL / domain input mapping
    const VISUAL_ALIASES = {
        'gmail.com': 'google',
        'googlemail.com': 'google',
        'mail.google.com': 'google',
        'accounts.google.com': 'google',
        'drive.google.com': 'google',
        'outlook.com': 'microsoft',
        'hotmail.com': 'microsoft',
        'live.com': 'microsoft',
        'icloud.com': 'apple',
        'appleid.apple.com': 'apple',
        'fb.com': 'facebook',
        't.me': 'telegram',
        'bit.ly': 'bitly',
        'amzn.to': 'amazon',
        'youtu.be': 'youtube',
        'incometax.gov.in': 'incometax',
        'gst.gov.in': 'gstportal',
        'epfindia.gov.in': 'epfo',
        'parivahan.gov.in': 'parivahansewa',
        'passportindia.gov.in': 'passportseva',
        'kite.zerodha.com': 'zerodha',
        'groww.in': 'groww',
        'upstox.com': 'upstox',
        'irs.gov': 'internalrevenueservice',
        'ssa.gov': 'socialsecurityadministration',
        'gov.uk': 'govuk',
        'canada.ca': 'canadarevenueagency'
    };

    // Human-friendly ecosystem labels
    const ECOSYSTEM_LABELS = {
        'google': 'Google Account',
        'microsoft': 'Microsoft Account',
        'apple': 'Apple ID',
        'facebook': 'Meta / Facebook'
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

        // 3. Strip common subdomain noise
        platform = platform.replace(/^(www\.|m\.|app\.|login\.|secure\.|auth\.|account\.|sellercentral\.)/, '');
        
        // 4. Strip parenthetical and trailing hyphen acronym suffixes (e.g. "Bank of India - BOI" -> "Bank of India", "State Bank of India (SBI)" -> "State Bank of India", "Zerodha (Kite / Coin)" -> "Zerodha")
        platform = platform.replace(/\s+[-–—]\s+[a-z0-9\s]+$/, '');
        platform = platform.replace(/\s*\([^)]*\)/g, '');

        // 5. Handle Visual Aliases (full domains)
        if (VISUAL_ALIASES[platform]) {
            return VISUAL_ALIASES[platform];
        }

        // 6. Robust Domain Extraction (handles .co.uk, .com.au, .co.in, .gov.in etc)
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
        
        // 7. Sanitize (only letters and numbers)
        platform = platform.replace(/[^a-z0-9]/g, '');

        // 8. Apply Global Aliases (e.g., sbi -> statebankofindia, itr -> incometax)
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
        const rawClean = raw.toLowerCase().trim();
        
        // If an alias changed the name (like gmail -> google), show helpful context
        if (rawClean !== normalized && (rawClean.includes('gmail') || rawClean.includes('outlook') || rawClean.includes('hotmail') || rawClean.includes('icloud') || rawClean.includes('appleid'))) {
            const label = ECOSYSTEM_LABELS[normalized] || normalized;
            return `Using as: "${normalized}" (${label})`;
        }
        
        return `Using as: "${normalized}"`;
    }

    return {
        getNormalizedPlatform: getNormalizedPlatform,
        getPrettyNameFromDB: getPrettyNameFromDB,
        getSeedHint: getSeedHint,
        GLOBAL_ALIASES: GLOBAL_ALIASES,
        VISUAL_ALIASES: VISUAL_ALIASES
    };
})();
