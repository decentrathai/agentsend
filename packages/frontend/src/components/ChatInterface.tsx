"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2, Lock, CheckCircle2, XCircle, Clock, Key } from "lucide-react";
import { useEncryptionKeys } from "@/hooks/useEncryptionKeys";
import { useMessages, Message } from "@/hooks/useMessages";
import { useTongo } from "@/hooks/useTongo";
import { useIPFS } from "@/hooks/useIPFS";
import { encryptMessage, getPublicKey, stringToPublicKey } from "@/lib/encryption";

interface ChatInterfaceProps {
  userAddress: string;
}

export function ChatInterface({ userAddress }: ChatInterfaceProps) {
  const [recipient, setRecipient] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { keyPair, initializeKeys, hasKeys, loading: keysLoading } = useEncryptionKeys();
  const { 
    messages,
    conversations,
    saveMessage,
    updateMessageStatus,
    getConversationMessages,
  } = useMessages();
  const { transfer, balance, loading: tongoLoading, isUsingMock } = useTongo();
  const { uploadMessage, uploading } = useIPFS();

  const currentMessages = recipient ? getConversationMessages(recipient) : [];

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!messageInput.trim() || !recipient.trim() || sending) return;
    if (!keyPair) {
      setError("Encryption keys not initialized. Please click 'Initialize Keys'.");
      return;
    }

    setSending(true);
    setError(null);

    try {
      // Get recipient's public key
      const recipientPubKeyStr = getPublicKey(recipient);
      if (!recipientPubKeyStr) {
        throw new Error(
          "Recipient's public key not found. They need to initialize their keys first."
        );
      }
      const recipientPubKey = stringToPublicKey(recipientPubKeyStr);

      // Encrypt message
      const { ciphertext, nonce } = encryptMessage(
        messageInput,
        recipientPubKey,
        keyPair.secretKey
      );

      // Create message object
      const messageId = `msg-${Date.now()}`;
      const message: Message = {
        id: messageId,
        sender: userAddress,
        recipient,
        content: messageInput,
        ciphertext,
        nonce,
        timestamp: Date.now(),
        ipfsCID: "",
        status: "sending",
      };

      // Save locally immediately
      saveMessage(message);

      // Upload to IPFS
      const ipfsCID = await uploadMessage({
        content: ciphertext,
        sender: userAddress,
        recipient,
        timestamp: message.timestamp,
        nonce,
      });

      // Update with IPFS CID
      message.ipfsCID = ipfsCID;

      // Send Tongo transaction
      const txHash = await transfer(
        recipient,
        1n, // Send 1 wei as message carrier
        ipfsCID
      );

      // Update message status
      updateMessageStatus(messageId, "sent", txHash);

      // Clear input
      setMessageInput("");

      console.log("✅ Message sent:", {
        to: recipient.slice(0, 10),
        ipfs: ipfsCID.slice(0, 20),
        tx: txHash.slice(0, 20),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);
      console.error("❌ Send failed:", err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Conversations */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Conversations</h2>
          <p className="text-sm text-gray-500 mt-1">
            {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
          </p>
        </div>

        {/* Keys Status */}
        <div className="p-3 border-b border-gray-100 bg-gray-50">
          {hasKeys() ? (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Lock className="w-4 h-4" />
              <span>Encryption enabled</span>
            </div>
          ) : (
            <button
              onClick={initializeKeys}
              disabled={keysLoading}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {keysLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Initializing...</>
              ) : (
                <><Key className="w-4 h-4" /> Initialize Keys</>
              )}
            </button>
          )}
        </div>

        {/* Balance */}
        <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="text-xs text-gray-600 mb-1">Tongo Balance</div>
          <div className="text-lg font-semibold text-gray-900">
            {(Number(balance.current) / 1e18).toFixed(6)} ETH
          </div>
          {isUsingMock && (
            <div className="text-xs text-orange-600 mt-1">🎭 Mock Mode</div>
          )}
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No conversations yet. Start by entering a recipient address below.
            </div>
          ) : (
            conversations.map(conv => (
              <button
                key={conv.address}
                onClick={() => setRecipient(conv.address)}
                className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 text-left transition-colors ${
                  recipient === conv.address ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
                }`}
              >
                <div className="font-medium text-gray-900 truncate">
                  {conv.address.slice(0, 10)}...{conv.address.slice(-8)}
                </div>
                {conv.lastMessage && (
                  <div className="text-sm text-gray-500 truncate mt-1">
                    {conv.lastMessage.content.slice(0, 30)}...
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">
                {recipient ? (
                  <>
                    {recipient.slice(0, 10)}...{recipient.slice(-8)}
                  </>
                ) : (
                  "Select or enter recipient"
                )}
              </h3>
              {recipient && (
                <p className="text-xs text-gray-500 mt-1">
                  End-to-end encrypted • Tongo privacy layer
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {currentMessages.length === 0 && recipient ? (
            <div className="text-center text-gray-500 mt-10">
              <Lock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No messages yet. Send an encrypted message to start!</p>
            </div>
          ) : (
            currentMessages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender.toLowerCase() === userAddress.toLowerCase()
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-md px-4 py-3 rounded-2xl ${
                    msg.sender.toLowerCase() === userAddress.toLowerCase()
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    {msg.sender.toLowerCase() === userAddress.toLowerCase() && (
                      <>
                        {msg.status === "sending" && <Clock className="w-3 h-3" />}
                        {msg.status === "sent" && <CheckCircle2 className="w-3 h-3" />}
                        {msg.status === "failed" && <XCircle className="w-3 h-3" />}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          {!recipient && (
            <input
              type="text"
              placeholder="Enter recipient address (0x...)"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
              className="w-full px-4 py-3 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}

          <div className="flex gap-3">
            <input
              type="text"
              placeholder={hasKeys() ? "Type your message..." : "Initialize encryption keys first"}
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!hasKeys() || sending || !recipient}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSend}
              disabled={!messageInput.trim() || !recipient || sending || !hasKeys()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {sending || uploading || tongoLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
              ) : (
                <><Send className="w-5 h-5" /> Send</>
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Messages are end-to-end encrypted and stored on IPFS
          </p>
        </div>
      </div>
    </div>
  );
}
