/**
 * AgentSend Cryptography Utilities
 * X25519-XSalsa20-Poly1305 for end-to-end message encryption
 */

import nacl from "tweetnacl";
import { encodeBase64, decodeBase64 } from "tweetnacl-util";

export interface KeyPair {
  publicKey: string;   // base64
  secretKey: string;   // base64
}

/**
 * Generate a new X25519 keypair for message encryption
 */
export function generateKeyPair(): KeyPair {
  const keypair = nacl.box.keyPair();
  return {
    publicKey: encodeBase64(keypair.publicKey),
    secretKey: encodeBase64(keypair.secretKey),
  };
}

/**
 * Encrypt a message for a recipient
 * @param message - Plaintext message
 * @param recipientPublicKey - Recipient's X25519 public key (base64)
 * @param senderSecretKey - Sender's X25519 secret key (base64)
 * @returns { ciphertext, nonce } both base64-encoded
 */
export function encryptMessage(
  message: string,
  recipientPublicKey: string,
  senderSecretKey: string
): { ciphertext: string; nonce: string } {
  const messageBytes = new TextEncoder().encode(message);
  const nonce = nacl.randomBytes(24);
  
  const encrypted = nacl.box(
    messageBytes,
    nonce,
    decodeBase64(recipientPublicKey),
    decodeBase64(senderSecretKey)
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
 * @param ciphertext - Encrypted message (base64)
 * @param nonce - Encryption nonce (base64)
 * @param senderPublicKey - Sender's X25519 public key (base64)
 * @param recipientSecretKey - Recipient's X25519 secret key (base64)
 * @returns Plaintext message
 */
export function decryptMessage(
  ciphertext: string,
  nonce: string,
  senderPublicKey: string,
  recipientSecretKey: string
): string {
  const decrypted = nacl.box.open(
    decodeBase64(ciphertext),
    decodeBase64(nonce),
    decodeBase64(senderPublicKey),
    decodeBase64(recipientSecretKey)
  );

  if (!decrypted) {
    throw new Error("Decryption failed - invalid ciphertext or keys");
  }

  return new TextDecoder().decode(decrypted);
}

/**
 * Hash a message (for on-chain memo field)
 * @param message - Message to hash
 * @returns SHA-256 hash as hex string
 */
export async function hashMessage(message: string): Promise<string> {
  const messageBytes = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", messageBytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
