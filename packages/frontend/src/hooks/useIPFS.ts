"use client";

import { useState } from "react";

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || "";
const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs/";
const USE_MOCK = !PINATA_JWT || PINATA_JWT === "your_pinata_jwt_here";

interface EncryptedMessage {
  content: string; // Encrypted message content
  sender: string;
  recipient: string;
  timestamp: number;
  nonce: string; // Encryption nonce
}

export function useIPFS() {
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Upload encrypted message to IPFS via Pinata
   * Returns the IPFS hash (CID)
   */
  const uploadMessage = async (message: EncryptedMessage): Promise<string> => {
    setUploading(true);
    setError(null);

    try {
      if (USE_MOCK) {
        // Mock mode: use localStorage
        const cid = generateMockCID();
        localStorage.setItem(`ipfs-${cid}`, JSON.stringify(message));
        console.log("📦 Uploaded to IPFS (mock):", cid);
        return cid;
      }

      // Real Pinata upload
      const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${PINATA_JWT}`,
        },
        body: JSON.stringify({
          pinataContent: message,
          pinataMetadata: {
            name: `message-${message.timestamp}`,
            keyvalues: {
              sender: message.sender.slice(0, 10),
              recipient: message.recipient.slice(0, 10),
              timestamp: message.timestamp.toString(),
            },
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Pinata upload failed: ${errorText}`);
      }

      const data = await response.json();
      const cid = data.IpfsHash;
      
      console.log("📦 Uploaded to IPFS (Pinata):", cid);
      return cid;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "IPFS upload failed";
      setError(errorMessage);
      console.error("❌ IPFS upload error:", err);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  /**
   * Download message from IPFS
   */
  const downloadMessage = async (cid: string): Promise<EncryptedMessage> => {
    setDownloading(true);
    setError(null);

    try {
      if (USE_MOCK) {
        // Mock mode: get from localStorage
        const stored = localStorage.getItem(`ipfs-${cid}`);
        if (!stored) {
          throw new Error("Message not found in local storage");
        }
        return JSON.parse(stored);
      }

      // Real IPFS download via Pinata gateway
      const response = await fetch(`${PINATA_GATEWAY}${cid}`);
      
      if (!response.ok) {
        throw new Error(`Failed to download from IPFS: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("📥 Downloaded from IPFS:", cid);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "IPFS download failed";
      setError(errorMessage);
      console.error("❌ IPFS download error:", err);
      throw new Error(errorMessage);
    } finally {
      setDownloading(false);
    }
  };

  /**
   * Pin message to ensure persistence
   */
  const pinMessage = async (cid: string): Promise<void> => {
    if (USE_MOCK) {
      console.log("📌 Pin message (mock):", cid);
      return;
    }

    try {
      const response = await fetch(`https://api.pinata.cloud/pinning/pinByHash`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${PINATA_JWT}`,
        },
        body: JSON.stringify({
          hashToPin: cid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to pin message");
      }

      console.log("📌 Pinned message:", cid);
    } catch (err) {
      console.error("❌ Pin failed:", err);
      // Non-critical error, don't throw
    }
  };

  /**
   * List user's pinned messages
   */
  const listMessages = async (): Promise<EncryptedMessage[]> => {
    if (USE_MOCK) {
      // Get all messages from localStorage
      const messages: EncryptedMessage[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("ipfs-")) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              messages.push(JSON.parse(data));
            } catch (e) {
              console.error("Failed to parse message:", key);
            }
          }
        }
      }
      return messages;
    }

    // Real Pinata list (requires additional API call)
    return [];
  };

  return {
    uploadMessage,
    downloadMessage,
    pinMessage,
    listMessages,
    uploading,
    downloading,
    error,
    isUsingMock: USE_MOCK,
  };
}

/**
 * Generate a mock IPFS CID for testing
 */
function generateMockCID(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let cid = "Qm"; // IPFS CIDs start with Qm
  for (let i = 0; i < 44; i++) {
    cid += chars[Math.floor(Math.random() * chars.length)];
  }
  return cid;
}
