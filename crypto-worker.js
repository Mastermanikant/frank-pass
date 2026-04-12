/**
 * FrankPass Crypto Worker
 * Handles heavy PBKDF2 iterations in a background thread to prevent UI freezing.
 */

// Import the core crypto engine
self.importScripts('frankpass-core.js');

self.onmessage = async function(e) {
    const { platform, username, secret, variant, profile, length } = e.data;
    
    try {
        // Call the core generator
        const password = await FRANKPASS_CORE.generate(
            platform, 
            username, 
            secret, 
            variant, 
            profile, 
            length, 
            null
        );
        
        // Send the result back
        self.postMessage({ success: true, password: password });
    } catch (error) {
        self.postMessage({ success: false, error: error.message });
    }
};
