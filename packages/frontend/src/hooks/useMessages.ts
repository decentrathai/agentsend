"use client";

import { useState, useEffect } from "react";
import { useAccount } from "@starknet-react/core";

export interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string; // Decrypted message
  ciphertext: string; // Encrypted content
  nonce: string;
  timestamp: number;
  ipfsCID: string;
  txHash?: string;
  status: "sending" | "sent" | "delivered" | "failed";
}

export interface Conversation {
  address: string;
  lastMessage?: Message;
  unreadCount: number;
  timestamp: number;
}

/**
 * Hook for managing message history and conversations
 */
export function useMessages() {
  const { address } = useAccount();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  // Load messages on mount
  useEffect(() => {
    if (address) {
      loadMessages();
    } else {
      setMessages([]);
      setConversations([]);
    }
  }, [address]);

  /**
   * Load messages from localStorage
   */
  const loadMessages = () => {
    if (!address) return;
    
    setLoading(true);
    try {
      const stored = localStorage.getItem(`messages-${address}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setMessages(parsed);
        updateConversations(parsed);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save a new message
   */
  const saveMessage = (message: Message) => {
    if (!address) return;
    
    const updated = [...messages, message];
    setMessages(updated);
    updateConversations(updated);
    
    // Persist to localStorage
    localStorage.setItem(`messages-${address}`, JSON.stringify(updated));
  };

  /**
   * Update message status
   */
  const updateMessageStatus = (
    messageId: string,
    status: Message["status"],
    txHash?: string
  ) => {
    if (!address) return;
    
    const updated = messages.map(msg =>
      msg.id === messageId
        ? { ...msg, status, ...(txHash && { txHash }) }
        : msg
    );
    
    setMessages(updated);
    localStorage.setItem(`messages-${address}`, JSON.stringify(updated));
  };

  /**
   * Get messages for a specific conversation
   */
  const getConversationMessages = (contactAddress: string): Message[] => {
    return messages
      .filter(
        msg =>
          msg.sender.toLowerCase() === contactAddress.toLowerCase() ||
          msg.recipient.toLowerCase() === contactAddress.toLowerCase()
      )
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  /**
   * Update conversations list
   */
  const updateConversations = (allMessages: Message[]) => {
    if (!address) return;
    
    const convMap = new Map<string, Conversation>();
    
    allMessages.forEach(msg => {
      const otherAddress =
        msg.sender.toLowerCase() === address.toLowerCase()
          ? msg.recipient
          : msg.sender;
      
      const existing = convMap.get(otherAddress.toLowerCase());
      
      if (!existing || msg.timestamp > existing.timestamp) {
        convMap.set(otherAddress.toLowerCase(), {
          address: otherAddress,
          lastMessage: msg,
          unreadCount: existing?.unreadCount || 0,
          timestamp: msg.timestamp,
        });
      }
    });
    
    const convList = Array.from(convMap.values()).sort(
      (a, b) => b.timestamp - a.timestamp
    );
    
    setConversations(convList);
  };

  /**
   * Mark conversation as read
   */
  const markAsRead = (contactAddress: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.address.toLowerCase() === contactAddress.toLowerCase()
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  /**
   * Delete a message
   */
  const deleteMessage = (messageId: string) => {
    if (!address) return;
    
    const updated = messages.filter(msg => msg.id !== messageId);
    setMessages(updated);
    updateConversations(updated);
    localStorage.setItem(`messages-${address}`, JSON.stringify(updated));
  };

  /**
   * Clear all messages
   */
  const clearAllMessages = () => {
    if (!address) return;
    
    setMessages([]);
    setConversations([]);
    localStorage.removeItem(`messages-${address}`);
  };

  /**
   * Export messages as JSON
   */
  const exportMessages = (): string => {
    return JSON.stringify(messages, null, 2);
  };

  return {
    messages,
    conversations,
    loading,
    saveMessage,
    updateMessageStatus,
    getConversationMessages,
    markAsRead,
    deleteMessage,
    clearAllMessages,
    exportMessages,
  };
}
