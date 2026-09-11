/**
 * FrankPass Core Cryptography Engine
 * This file contains the "Main Part" of the application logic.
 * It is designed to be "Fixed Static" - do not edit this logic unless you want to change how passwords are generated.
 */

const FRANKPASS_CORE = (function () {
    const APP_ID = "MasterManikant_PassGen";
    const VERSION = "v1";
    // Golden Base-32 Pool (Exact 32 chars = 2^5, 100% Zero-Confusion Invariant):
    const UPPERCASE = "ADEFHLMNRT"; // removed ambiguous & identical-glyph letters (10 chars)
    const LOWERCASE = "defhmt"; // removed ambiguous, mirror & identical-glyph letters (6 chars)
    const NUMBERS = "2346789"; // removed 0, 1, 5 (7 chars)
    const SYMBOLS = "@#$%&*+=?"; // removed !, -, _, brackets, quotes; added ? (9 chars, total = 32 chars)
    // PUBLIC APPLICATION CONSTANT - This is NOT a cryptographic secret.
    // It is a public domain separator (app-level salt) used to bind derivation
    // to the FrankPass application identity. Security depends entirely on the
    // user's Secret Key strength - NOT on this constant being hidden.
    // Architecture: User Secret Key + FRANKPASS_DOMAIN_SALT + Platform + Username → KDF → Password
    const FRANKPASS_DOMAIN_SALT = "FrankbaseSuperSecretMango2026!";

    /**
     * Internal: Local pepper generation (Fallback for when API is unreachable)
     */
    async function getLocalPepper(platform, username, secretKey) {
        const encoder = new TextEncoder();
        const normalizedSecret = (secretKey || '').toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
        const normalizedUser = (username || '').toLowerCase().replace(/\s+/g, '');
        const normalizedPlat = (platform || '').toLowerCase().replace(/\s+/g, '');
        const dataStr = `Version=${VERSION}|User=${normalizedUser}|Plat=${normalizedPlat}|Key=${normalizedSecret}`;

        // HMAC-SHA512 Simulation using SubtleCrypto
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(FRANKPASS_DOMAIN_SALT),
            { name: 'HMAC', hash: 'SHA-512' },
            false,
            ['sign']
        );
        const hmacBuffer = await crypto.subtle.sign('HMAC', keyMaterial, encoder.encode(dataStr));
        let preKey = Array.from(new Uint8Array(hmacBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

        // 1000 rounds of SHA-256 (Micro-load simulation)
        for (let i = 0; i < 1000; i++) {
            const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(preKey + FRANKPASS_DOMAIN_SALT));
            preKey = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        }
        return preKey;
    }

    /**
     * Internal: Mapping bytes to characters with rule enforcement
     */
    function bytesToCharacters(byteStream, profile, targetLength) {
        let charset = "";
        let requireUpper = false, requireLower = false, requireNum = false, requireSym = false;

        if (profile === 'standard') {
            charset = UPPERCASE + LOWERCASE + NUMBERS + SYMBOLS;
            requireUpper = requireLower = requireNum = requireSym = true;
        } else if (profile === 'alphanumeric') {
            charset = UPPERCASE + LOWERCASE + NUMBERS;
            requireUpper = requireLower = requireNum = true;
        } else if (profile === 'letters') {
            charset = UPPERCASE + LOWERCASE;
            requireUpper = requireLower = true;
        } else if (profile === 'numeric') {
            charset = "0123456789";
            requireNum = false;
        }

        const charsetLen = charset.length;
        const validMax = 256 - (256 % charsetLen);
        let passwordChars = [];
        let byteIdx = 0;

        while (passwordChars.length < targetLength && byteIdx < byteStream.length) {
            const b = byteStream[byteIdx++];
            if (b < validMax) passwordChars.push(charset[b % charsetLen]);
        }

        while (passwordChars.length < targetLength) passwordChars.push(charset[0]);

        const requiredSets = [];
        if (requireUpper) requiredSets.push(UPPERCASE);
        if (requireLower) requiredSets.push(LOWERCASE);
        if (requireNum) requiredSets.push(NUMBERS);
        if (requireSym) requiredSets.push(SYMBOLS);

        let revIdx = byteStream.length - 1;
        let currentStr = passwordChars.join('');
        const usedPositions = new Set();

        requiredSets.forEach(set => {
            if (!currentStr.split('').some(c => set.includes(c))) {
                let pos = byteStream[revIdx--] % targetLength;
                while (usedPositions.has(pos) && usedPositions.size < targetLength) {
                    pos = (pos + 1) % targetLength;
                }
                usedPositions.add(pos);
                const char = set[byteStream[revIdx--] % set.length];
                passwordChars[pos] = char;
                currentStr = passwordChars.join('');
            }
        });

        return passwordChars.join('');
    }

    return {
        generate: async function (platformOrObj, username, secretKey, variant, profile, length, pepperedString = null) {
            if (typeof crypto === 'undefined' || !crypto.subtle) {
                throw new Error('WebCrypto API (crypto.subtle) is not supported or not in a secure context (HTTPS).');
            }

            let platform = platformOrObj, user = username, key = secretKey, vr = variant, prof = profile, len = length, pepStr = pepperedString;
            if (typeof platformOrObj === 'object' && platformOrObj !== null) {
                platform = platformOrObj.platform || '';
                user = platformOrObj.username || '';
                key = platformOrObj.secretKey || '';
                vr = platformOrObj.variant || '1';
                prof = platformOrObj.profile || 'standard';
                len = platformOrObj.length || 16;
                pepStr = platformOrObj.pepper || null;
            }

            platform = (platform || '').toString().toLowerCase().replace(/\s+/g, '');
            user = (user || '').toString().toLowerCase().replace(/\s+/g, '');

            try {
                const encoder = new TextEncoder();

                // 1. Use provided pepper or generate locally
                const pepper = pepStr || await getLocalPepper(platform, user, key);

                // 2. Context Vector
                const ctxString = `${APP_ID.length}:${APP_ID}|${VERSION.length}:${VERSION}|${platform.length}:${platform}|${user.length}:${user}|${pepper.length}:${pepper}|${vr.toString().length}:${vr}|${prof.length}:${prof}|${len.toString().length}:${len}`;
                const seedData = encoder.encode(ctxString.normalize('NFC'));

                // 3. PBKDF2
                const baseKey = await crypto.subtle.importKey(
                    'raw', encoder.encode(pepper.normalize('NFC')), 'PBKDF2', false, ['deriveBits']
                );
                const pbkdf2Bits = await crypto.subtle.deriveBits(
                    { name: 'PBKDF2', salt: seedData, iterations: 1000000, hash: 'SHA-512' }, baseKey, 512
                );

                // 4. HMAC Expansion
                const prkKey = await crypto.subtle.importKey(
                    'raw', pbkdf2Bits, { name: 'HMAC', hash: 'SHA-512' }, false, ['sign']
                );

                let outputBytes = new Uint8Array(0);
                let sig1 = await crypto.subtle.sign('HMAC', prkKey, new Uint8Array([1]));
                outputBytes = new Uint8Array([...outputBytes, ...new Uint8Array(sig1)]);
                let sig2 = await crypto.subtle.sign('HMAC', prkKey, new Uint8Array([...new Uint8Array(sig1), 2]));
                outputBytes = new Uint8Array([...outputBytes, ...new Uint8Array(sig2)]);

                // 5. Bytes to Chars
                return bytesToCharacters(outputBytes, prof, len);
            } catch (err) {
                console.error('FrankPass Core Generation Error:', err);
                throw err;
            }
        },
        generatePassword: async function (platformOrObj, username, secretKey, variant, profile, length, pepperedString = null) {
            return this.generate(platformOrObj, username, secretKey, variant, profile, length, pepperedString);
        }
    };
})();
