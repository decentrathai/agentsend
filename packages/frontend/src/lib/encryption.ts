import nacl from "tweetnacl";
import { encodeBase64, decodeBase64 } from "tweetnacl-util";
import { hash } from "starknet";

/**
 * Message encryption using X25519 (Curve25519) key exchange + XSalsa20-Poly1305
 * This provides end-to-end encryption between sender and recipient
 */

export interface KeyPair {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}

/**
 * Generate a new keypair for message encryption
 */
export function generateKeyPair(): KeyPair {
  return nacl.box.keyPair();
}

/**
 * Derive deterministic keypair from wallet signature
 * This allows users to recover their message keys from their wallet
 * 
 * @param walletSignature - Signature from wallet (request user to sign a message)
 * @returns Deterministic keypair for encryption
 */
export function deriveKeyPairFromSignature(walletSignature: string[]): KeyPair {
  // Concatenate signature components and hash to get 32-byte seed
  const signatureString = walletSignature.join("");
  const seed = hashToSeed(signatureString);
  return nacl.box.keyPair.fromSecretKey(seed);
}

/**
 * Request wallet to sign a deterministic message for key derivation
 * Call this when user first connects or needs to restore keys
 */
export const KEY_DERIVATION_MESSAGE = "AgentSend keygen v1";

/**
 * Encrypt a message for a specific recipient
 */
export function encryptMessage(
  message: string,
  recipientPublicKey: Uint8Array,
  senderSecretKey: Uint8Array
): { ciphertext: string; nonce: string } {
  const messageUint8 = new TextEncoder().encode(message);
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  
  const encrypted = nacl.box(
    messageUint8,
    nonce,
    recipientPublicKey,
    senderSecretKey
  );

  if (!encrypted) {
    throw new Error("Encryption failed");
  }

  return {
    ciphertext: encodeBase64(encrypted),
    nonce: encodeBase64(nonce),
  };
}

/**
 * Decrypt a message from a sender
 */
export function decryptMessage(
  ciphertext: string,
  nonce: string,
  senderPublicKey: Uint8Array,
  recipientSecretKey: Uint8Array
): string {
  const ciphertextUint8 = decodeBase64(ciphertext);
  const nonceUint8 = decodeBase64(nonce);
  
  const decrypted = nacl.box.open(
    ciphertextUint8,
    nonceUint8,
    senderPublicKey,
    recipientSecretKey
  );

  if (!decrypted) {
    throw new Error("Failed to decrypt message - invalid key or corrupted data");
  }

  return new TextDecoder().decode(decrypted);
}

/**
 * Hash a string to a 32-byte seed for NaCl
 */
function hashToSeed(data: string): Uint8Array {
  // Use Starknet's Pedersen hash for deterministic derivation
  const hashed = hash.computePedersenHash(data, "0");
  
  // Convert hash to bytes (remove 0x prefix)
  const hexStr = hashed.replace(/^0x/, "").padStart(64, "0");
  const bytes = new Uint8Array(32);
  
  for (let i = 0; i < 32; i++) {
    bytes[i] = parseInt(hexStr.substr(i * 2, 2), 16);
  }
  
  return bytes;
}

/**
 * Convert public key to base64 string for storage/transmission
 */
export function publicKeyToString(publicKey: Uint8Array): string {
  return encodeBase64(publicKey);
}

/**
 * Convert base64 string back to public key
 */
export function stringToPublicKey(str: string): Uint8Array {
  return decodeBase64(str);
}

/**
 * Store keypair in localStorage (encrypted with wallet signature would be better in production)
 */
export function storeKeyPair(address: string, keyPair: KeyPair): void {
  const data = {
    publicKey: publicKeyToString(keyPair.publicKey),
    secretKey: encodeBase64(keyPair.secretKey),
  };
  localStorage.setItem(`agentsend-keys-${address}`, JSON.stringify(data));
}

/**
 * Retrieve keypair from localStorage
 */
export function loadKeyPair(address: string): KeyPair | null {
  const stored = localStorage.getItem(`agentsend-keys-${address}`);
  if (!stored) return null;
  
  try {
    const data = JSON.parse(stored);
    return {
      publicKey: stringToPublicKey(data.publicKey),
      secretKey: decodeBase64(data.secretKey),
    };
  } catch (err) {
    console.error("Failed to load keypair:", err);
    return null;
  }
}

/**
 * Public key registry - in production this would be stored on-chain or IPFS
 * For MVP, we use localStorage
 */
export function storePublicKey(address: string, publicKey: string): void {
  const registry = getPublicKeyRegistry();
  registry[address.toLowerCase()] = publicKey;
  localStorage.setItem("agentsend-public-keys", JSON.stringify(registry));
}

export function getPublicKey(address: string): string | null {
  const registry = getPublicKeyRegistry();
  return registry[address.toLowerCase()] || null;
}

function getPublicKeyRegistry(): Record<string, string> {
  const stored = localStorage.getItem("agentsend-public-keys");
  if (!stored) return {};
  
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
}
