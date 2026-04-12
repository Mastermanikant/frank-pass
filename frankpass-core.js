/**
 * FrankPass Core Cryptography Engine
 * This file contains the "Main Part" of the application logic.
 * It is designed to be "Fixed Static" - do not edit this logic unless you want to change how passwords are generated.
 */

const FRANKPASS_CORE = (function () {
    const APP_ID = "MasterManikant_PassGen";
    const VERSION = "v1";
    const UPPERCASE = "ABDEFGHJKLMNPQRTUXYZ"; // removed I, O, C, S, V, W
    const LOWERCASE = "abdefghijkmnpqrtuxyz"; // removed l, o, c, s, v, w
    const NUMBERS = "23456789"; // removed 0, 1
    const SYMBOLS = "@#$%+*="; // simplified: widely accepted across all platforms
    const DEFAULT_PEPPER = "FrankbaseSuperSecretMango2026!";

    /**
     * Internal: Local pepper generation (Fallback for when API is unreachable)
     */
    async function getLocalPepper(platform, username, secretKey) {
        const encoder = new TextEncoder();
        const normalizedSecret = secretKey.toLowerCase().replace(/\s+/g, '');
        const dataStr = `Version=${VERSION}|User=${username.toLowerCase()}|Plat=${platform.toLowerCase()}|Key=${normalizedSecret}`;

        // HMAC-SHA512 Simulation using SubtleCrypto
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(DEFAULT_PEPPER),
            { name: 'HMAC', hash: 'SHA-512' },
            false,
            ['sign']
        );
        const hmacBuffer = await crypto.subtle.sign('HMAC', keyMaterial, encoder.encode(dataStr));
        let preKey = Array.from(new Uint8Array(hmacBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

        // 1000 rounds of SHA-256 (Micro-load simulation)
        for (let i = 0; i < 1000; i++) {
            const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(preKey + DEFAULT_PEPPER));
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
        } else if (profile === 'numeric') {
            charset = NUMBERS;
            requireNum = true;
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

        requiredSets.forEach(set => {
            if (!currentStr.split('').some(c => set.includes(c))) {
                const pos = byteStream[revIdx--] % targetLength;
                const char = set[byteStream[revIdx--] % set.length];
                passwordChars[pos] = char;
                currentStr = passwordChars.join('');
            }
        });

        return passwordChars.join('');
    }

    return {
        generate: async function (platform, username, secretKey, variant, profile, length, pepperedString = null) {
            const encoder = new TextEncoder();

            // 1. Use provided pepper or generate locally
            const pepper = pepperedString || await getLocalPepper(platform, username, secretKey);

            // 2. Context Vector
            const ctxString = `${APP_ID.length}:${APP_ID}|${VERSION.length}:${VERSION}|${platform.length}:${platform}|${username.length}:${username}|${pepper.length}:${pepper}|${variant.toString().length}:${variant}|${profile.length}:${profile}|${length.toString().length}:${length}`;
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
            return bytesToCharacters(outputBytes, profile, length);
        }
    };
})();
