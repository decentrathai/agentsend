"use client";

import { useState, useEffect } from "react";
import { useAccount } from "@starknet-react/core";
import {
  KeyPair,
  deriveKeyPairFromSignature,
  storeKeyPair,
  loadKeyPair,
  publicKeyToString,
  storePublicKey,
  KEY_DERIVATION_MESSAGE,
} from "@/lib/encryption";
import { typedData } from "starknet";

/**
 * Hook for managing encryption keys derived from wallet signatures
 */
export function useEncryptionKeys() {
  const { account, address } = useAccount();
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing keys on mount
  useEffect(() => {
    if (address) {
      loadExistingKeys();
    } else {
      setKeyPair(null);
    }
  }, [address]);

  /**
   * Try to load existing keys from localStorage
   */
  const loadExistingKeys = () => {
    if (!address) return;
    
    const stored = loadKeyPair(address);
    if (stored) {
      setKeyPair(stored);
      console.log("🔑 Loaded existing encryption keys");
    }
  };

  /**
   * Generate or restore keys by requesting wallet signature
   */
  const initializeKeys = async (): Promise<KeyPair> => {
    if (!account || !address) {
      throw new Error("Wallet not connected");
    }

    setLoading(true);
    setError(null);

    try {
      // Check if keys already exist
      const existing = loadKeyPair(address);
      if (existing) {
        setKeyPair(existing);
        setLoading(false);
        return existing;
      }

      // Request wallet signature to derive keys
      console.log("🔐 Requesting signature for key derivation...");
      
      // Use typed data signing for better UX
      const typedDataMessage = {
        types: {
          StarkNetDomain: [
            { name: "name", type: "felt" },
            { name: "version", type: "felt" },
            { name: "chainId", type: "felt" },
          ],
          Message: [
            { name: "purpose", type: "felt" },
            { name: "description", type: "felt" },
          ],
        },
        primaryType: "Message",
        domain: {
          name: "AgentSend",
          version: "1",
          chainId: await account.getChainId(),
        },
        message: {
          purpose: "Encryption Key Generation",
          description: KEY_DERIVATION_MESSAGE,
        },
      };

      let signature: string[];
      
      try {
        // Try typed data signing first (better UX)
        const sig = await account.signMessage(typedDataMessage);
        signature = Array.isArray(sig) ? sig : [sig.r.toString(), sig.s.toString()];
      } catch (err) {
        console.warn("Typed data signing failed, falling back to plain signature");
        // Fallback to simple message signing
        const sig = await account.signMessage({
          message: KEY_DERIVATION_MESSAGE,
        } as any);
        signature = Array.isArray(sig) ? sig : [sig.r.toString(), sig.s.toString()];
      }

      // Derive keypair from signature
      const newKeyPair = deriveKeyPairFromSignature(signature);
      
      // Store keys
      storeKeyPair(address, newKeyPair);
      
      // Store public key in registry
      const publicKeyStr = publicKeyToString(newKeyPair.publicKey);
      storePublicKey(address, publicKeyStr);
      
      setKeyPair(newKeyPair);
      console.log("✅ Encryption keys generated and stored");
      console.log("📢 Public key:", publicKeyStr.slice(0, 20) + "...");
      
      setLoading(false);
      return newKeyPair;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate keys";
      setError(errorMessage);
      console.error("❌ Key initialization failed:", err);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  /**
   * Get public key as string
   */
  const getPublicKeyString = (): string | null => {
    if (!keyPair) return null;
    return publicKeyToString(keyPair.publicKey);
  };

  /**
   * Check if keys are initialized
   */
  const hasKeys = (): boolean => {
    return keyPair !== null;
  };

  return {
    keyPair,
    loading,
    error,
    initializeKeys,
    getPublicKeyString,
    hasKeys,
  };
}
