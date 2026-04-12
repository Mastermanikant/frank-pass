/**
 * FrankPass Utilities
 * Centralized logic for platform normalization and UI helpers.
 * Shared between Web and Extension.
 */

const FrankPassUtils = (function () {
    
    // Global Aliases: mapping input to canonical slug
    const GLOBAL_ALIASES = {
        'x': 'twitter', 'tw': 'twitter', 'twtr': 'twitter',
        'ig': 'instagram', 'insta': 'instagram',
        'fb': 'facebook', 'yt': 'youtube', 'wa': 'whatsapp', 'amzn': 'amazon',
        'snap': 'snapchat', 'pin': 'pinterest', 'gpay': 'googlepay', 'appleid': 'apple',
        'ms': 'microsoft', 'outlook': 'microsoft', 'live': 'microsoft',
        'gh': 'github', 'pp': 'paypal', 'tt': 'tiktok', 'nf': 'netflix',
        'tv': 'twitch', 'st': 'steam', 'dc': 'discord', 'rd': 'reddit',
        'tg': 'telegram', 'ln': 'linkedin'
    };

    // Full Domain Specific Aliases: for extra visual cleanup
    const VISUAL_ALIASES = {
        'fb.com': 'facebook',
        't.me': 'telegram',
        'bit.ly': 'bitly',
        'amzn.to': 'amazon',
        'youtu.be': 'youtube'
    };

    /**
     * Normalizes a raw input string into a standard FrankPass platform slug.
     * Guaranteed to be identical across Web and Extension.
     */
    function getNormalizedPlatform(raw) {
        if (!raw) return '';
        let platform = raw.toLowerCase().trim();
        
        // 1. Strip protocol and URI noise
        platform = platform.replace(/^(https?:\/\/)?/, '').split('/')[0].split('?')[0].split('#')[0];
        
        // 2. Strip subdomain noise
        platform = platform.replace(/^(www\.|m\.|app\.|login\.|secure\.|auth\.|account\.)/, '');
        
        // 3. Handle Visual Aliases (full domains)
        if (VISUAL_ALIASES[platform]) {
            return VISUAL_ALIASES[platform];
        }

        // 4. Robust Domain Extraction (handles .co.uk, .com.au etc)
        let domainParts = platform.split('.');
        if (domainParts.length > 2 && (domainParts[domainParts.length - 2].length <= 3)) {
            // e.g., amazon.co.uk -> amazon
            platform = domainParts[domainParts.length - 3];
        } else if (domainParts.length >= 2) {
            // e.g., google.com -> google
            platform = domainParts[domainParts.length - 2];
        } else {
            platform = domainParts[0];
        }
        
        // 5. Sanitize (only letters and numbers)
        platform = platform.replace(/[^a-z0-9]/g, '');

        // 6. Apply Global Aliases (e.g., fb -> facebook)
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
