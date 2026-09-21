/**
 * FrankPass PWA Local Vault & Zero-Knowledge Security Engine
 * Version: 4.3.3
 * Author: Master Manikant Yadav
 * Architecture: AES-GCM-256 + PBKDF2 (100,000 rounds) + WebAuthn Biometrics
 * Description: Client-side local encryption for Master Secret Key with PIN & Biometric protection.
 * Invariants: 0 Server Communication, 0 Plaintext Storage, 0 Em-Dash.
 */

const FrankPassVault = (function () {
  'use strict';

  const STORAGE_KEY = 'fp_vault_v1';
  const PBKDF2_ITERATIONS = 100000;
  const AUTO_LOCK_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes inactivity

  let activeSecretKey = null;
  let inactivityTimer = null;

  /* ── Base64 & Buffer Conversion Helpers ── */
  function bufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function base64ToBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /* ── Cryptographic Key Derivation (PBKDF2-HMAC-SHA256) ── */
  async function derivePinKey(pin, saltBuffer) {
    const encoder = new TextEncoder();
    const pinData = encoder.encode(String(pin).trim());

    const baseKey = await crypto.subtle.importKey(
      'raw',
      pinData,
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBuffer,
        iterations: PBKDF2_ITERATIONS,
        hash: 'SHA-256'
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /* ── AES-GCM-256 Encryption & Decryption ── */
  async function encryptText(plainText, key) {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const cipherBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(plainText)
    );
    return {
      iv: bufferToBase64(iv),
      ciphertext: bufferToBase64(cipherBuffer)
    };
  }

  async function decryptText(cipherBase64, ivBase64, key) {
    const iv = base64ToBuffer(ivBase64);
    const cipherBuffer = base64ToBuffer(cipherBase64);
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      key,
      cipherBuffer
    );
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  }

  /* ── Inactivity & Auto-Lock Monitor ── */
  function resetInactivityTimer() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    if (activeSecretKey) {
      inactivityTimer = setTimeout(() => {
        lockVault();
        if (typeof showToast === 'function') {
          showToast('Vault locked automatically due to inactivity.', 'info');
        }
      }, AUTO_LOCK_TIMEOUT_MS);
    }
  }

  function setupActivityListeners() {
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(evt => {
        window.addEventListener(evt, resetInactivityTimer, { passive: true });
      });
    }

    if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden && activeSecretKey) {
          // Automatically lock when user leaves or switches tabs
          lockVault();
        }
      });
    }
  }

  /* ── WebAuthn Biometric Helpers ── */
  async function isBiometricAvailable() {
    if (!window.PublicKeyCredential) return false;
    try {
      if (PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
        return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      }
    } catch (e) {
      return false;
    }
    return false;
  }

  async function registerBiometricCredential() {
    if (!window.PublicKeyCredential) {
      throw new Error('Biometrics not supported on this browser.');
    }

    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const userId = crypto.getRandomValues(new Uint8Array(16));

    const options = {
      publicKey: {
        challenge,
        rp: { name: 'FrankPass Vault', id: window.location.hostname },
        user: {
          id: userId,
          name: 'frankpass-user',
          displayName: 'FrankPass User'
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },  // ES256
          { type: 'public-key', alg: -257 } // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          residentKey: 'preferred'
        },
        timeout: 60000,
        attestation: 'none'
      }
    };

    const credential = await navigator.credentials.create(options);
    if (!credential) {
      throw new Error('Biometric registration was cancelled.');
    }
    return bufferToBase64(credential.rawId);
  }

  async function verifyBiometricAssertion(credentialIdBase64) {
    if (!window.PublicKeyCredential) {
      throw new Error('Biometrics not supported on this device.');
    }

    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const credIdBuffer = base64ToBuffer(credentialIdBase64);

    const options = {
      publicKey: {
        challenge,
        rpId: window.location.hostname,
        allowCredentials: [{
          type: 'public-key',
          id: new Uint8Array(credIdBuffer),
          transports: ['internal']
        }],
        userVerification: 'required',
        timeout: 60000
      }
    };

    const assertion = await navigator.credentials.get(options);
    if (!assertion) {
      throw new Error('Biometric verification cancelled.');
    }
    return true;
  }

  function dispatchVaultEvent(status, configured) {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
      window.dispatchEvent(new CustomEvent('fp-vault-changed', {
        detail: { status, configured }
      }));
    }
  }

  /* ── Public Vault API ── */
  return {
    init: function () {
      setupActivityListeners();
      return this.isConfigured();
    },

    isConfigured: function () {
      if (typeof localStorage === 'undefined') return false;
      return localStorage.getItem(STORAGE_KEY) !== null;
    },

    isUnlocked: function () {
      return activeSecretKey !== null;
    },

    getActiveSecretKey: function () {
      return activeSecretKey;
    },

    hasBiometrics: function () {
      const data = this.getVaultData();
      return data && Boolean(data.hasBiometric && data.bioCredId);
    },

    isBiometricAvailable,

    getVaultData: function () {
      try {
        if (typeof localStorage === 'undefined') return null;
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    },

    setupVault: async function (secretKey, pin, enableBio = false) {
      if (!secretKey || secretKey.trim().length === 0) {
        throw new Error('Please enter a Master Secret Key to save.');
      }
      if (!pin || String(pin).trim().length !== 4 || !/^\d{4}$/.test(String(pin).trim())) {
        throw new Error('Please choose a valid 4-digit numeric PIN.');
      }

      const normalizedKey = secretKey.toLowerCase().replace(/[^a-z0-9]/g, '');
      const pinStr = String(pin).trim();

      // 1. Generate salt and derive PIN key
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const pinKey = await derivePinKey(pinStr, salt);

      // 2. Encrypt secret key with PIN key
      const pinEncrypted = await encryptText(normalizedKey, pinKey);

      const vaultPayload = {
        version: 1,
        salt: bufferToBase64(salt),
        pinIv: pinEncrypted.iv,
        pinCiphertext: pinEncrypted.ciphertext,
        hasBiometric: false,
        bioCredId: null,
        bioSalt: null,
        bioIv: null,
        bioCiphertext: null,
        createdAt: new Date().toISOString()
      };

      // 3. Optional Biometric Setup
      if (enableBio) {
        try {
          const credId = await registerBiometricCredential();
          // Generate a secondary biometric key token
          const bioSalt = crypto.getRandomValues(new Uint8Array(16));
          const bioSecretKey = bufferToBase64(crypto.getRandomValues(new Uint8Array(32)));
          const bioDerivedKey = await derivePinKey(bioSecretKey, bioSalt);
          const bioEncrypted = await encryptText(normalizedKey, bioDerivedKey);

          vaultPayload.hasBiometric = true;
          vaultPayload.bioCredId = credId;
          vaultPayload.bioToken = bioSecretKey;
          vaultPayload.bioSalt = bufferToBase64(bioSalt);
          vaultPayload.bioIv = bioEncrypted.iv;
          vaultPayload.bioCiphertext = bioEncrypted.ciphertext;
        } catch (err) {
          console.warn('Biometric setup failed/skipped:', err);
          // Proceed with PIN only
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(vaultPayload));
      activeSecretKey = normalizedKey;
      resetInactivityTimer();

      dispatchVaultEvent('unlocked', true);
      return true;
    },

    unlockWithPin: async function (pin) {
      const data = this.getVaultData();
      if (!data) throw new Error('Vault is not set up on this device.');
      if (!pin || String(pin).trim().length !== 4) {
        throw new Error('Please enter your 4-digit PIN.');
      }

      const salt = base64ToBuffer(data.salt);
      const pinKey = await derivePinKey(String(pin).trim(), salt);

      try {
        const decrypted = await decryptText(data.pinCiphertext, data.pinIv, pinKey);
        activeSecretKey = decrypted;
        resetInactivityTimer();

        dispatchVaultEvent('unlocked', true);
        return decrypted;
      } catch (err) {
        throw new Error('Incorrect 4-digit PIN. Please try again.');
      }
    },

    unlockWithBiometric: async function () {
      const data = this.getVaultData();
      if (!data || !data.hasBiometric || !data.bioCredId) {
        throw new Error('Biometric unlock is not configured for this vault.');
      }

      await verifyBiometricAssertion(data.bioCredId);

      // Decrypt using stored biometric key
      const bioSalt = base64ToBuffer(data.bioSalt);
      const bioDerivedKey = await derivePinKey(data.bioToken, bioSalt);
      const decrypted = await decryptText(data.bioCiphertext, data.bioIv, bioDerivedKey);

      activeSecretKey = decrypted;
      resetInactivityTimer();

      dispatchVaultEvent('unlocked', true);
      return decrypted;
    },

    resetPinWithBiometric: async function (newPin) {
      if (!newPin || String(newPin).trim().length !== 4 || !/^\d{4}$/.test(String(newPin).trim())) {
        throw new Error('Please enter a valid 4-digit numeric PIN.');
      }

      // 1. First authenticate with biometrics to get active key
      let key = activeSecretKey;
      if (!key) {
        key = await this.unlockWithBiometric();
      }

      const data = this.getVaultData();
      if (!data) throw new Error('Vault data not found.');

      // 2. Re-encrypt with new PIN
      const newSalt = crypto.getRandomValues(new Uint8Array(16));
      const newPinKey = await derivePinKey(String(newPin).trim(), newSalt);
      const newPinEncrypted = await encryptText(key, newPinKey);

      data.salt = bufferToBase64(newSalt);
      data.pinIv = newPinEncrypted.iv;
      data.pinCiphertext = newPinEncrypted.ciphertext;
      data.updatedAt = new Date().toISOString();

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      resetInactivityTimer();

      dispatchVaultEvent('unlocked', true);
      return true;
    },

    lockVault: function () {
      activeSecretKey = null;
      if (inactivityTimer) clearTimeout(inactivityTimer);
      dispatchVaultEvent('locked', this.isConfigured());
    },

    clearVault: function () {
      this.lockVault();
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
      dispatchVaultEvent('cleared', false);
    }
  };
})();

// Auto-initialize on load
if (typeof window !== 'undefined') {
  window.FrankPassVault = FrankPassVault;
  FrankPassVault.init();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = FrankPassVault;
}
