"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send, Lock, CheckCircle2, Clock, Key, MessageSquare, LogOut,
  Shield, Zap, ArrowLeft, Eye, Globe, ChevronRight, Sparkles
} from "lucide-react";

interface DemoMessage {
  id: string;
  sender: "you" | "alice" | "bob";
  content: string;
  timestamp: number;
  status: "sending" | "encrypting" | "uploading" | "sent";
  ipfsCID?: string;
  txHash?: string;
}

const DEMO_CONTACTS = [
  {
    address: "0x04a3...7f2e",
    name: "Alice (Privacy Researcher)",
    avatar: "🔐",
    online: true,
  },
  {
    address: "0x07b1...3d9a",
    name: "Bob (DeFi Developer)",
    avatar: "⚡",
    online: true,
  },
];

const INITIAL_MESSAGES: DemoMessage[] = [
  {
    id: "m1",
    sender: "alice",
    content: "Hey! Just saw your message on the Tongo channel. This E2E encryption is really solid.",
    timestamp: Date.now() - 300000,
    status: "sent",
    ipfsCID: "QmX7b2...kf9s",
    txHash: "0x03a1...8f2d",
  },
  {
    id: "m2",
    sender: "you",
    content: "Thanks! The ZK proofs hide transaction amounts too, so even on-chain analysis can't link messages to users.",
    timestamp: Date.now() - 240000,
    status: "sent",
    ipfsCID: "QmR4c8...j2m1",
    txHash: "0x07e3...4a1b",
  },
  {
    id: "m3",
    sender: "alice",
    content: "That's the key differentiator. Most messengers encrypt content but leak metadata. You're solving both.",
    timestamp: Date.now() - 180000,
    status: "sent",
    ipfsCID: "QmT9a1...p5k3",
    txHash: "0x0bc4...9e7f",
  },
];

const ALICE_REPLIES = [
  "Interesting point! The Tongo privacy layer really does make on-chain analysis practically impossible.",
  "I've been testing the key derivation - deterministic keys from wallet signatures is a clever approach.",
  "The IPFS storage means even if Starknet is congested, encrypted messages persist on the decentralized web.",
  "Have you considered adding group messaging? The X25519 key exchange could extend to multi-party.",
  "This could be huge for DAOs that need private governance discussions.",
];

const BOB_INITIAL: DemoMessage[] = [
  {
    id: "b1",
    sender: "bob",
    content: "Yo, your AgentSend demo is fire. Can I integrate this into my DeFi dashboard?",
    timestamp: Date.now() - 600000,
    status: "sent",
    ipfsCID: "QmP3k7...w1x9",
    txHash: "0x01f2...6c3a",
  },
];

interface Props {
  onExit: () => void;
}

export function DemoChatInterface({ onExit }: Props) {
  const [activeContact, setActiveContact] = useState(0);
  const [messageInput, setMessageInput] = useState("");
  const [aliceMessages, setAliceMessages] = useState<DemoMessage[]>(INITIAL_MESSAGES);
  const [bobMessages, setBobMessages] = useState<DemoMessage[]>(BOB_INITIAL);
  const [sending, setSending] = useState(false);
  const [keysInitialized, setKeysInitialized] = useState(false);
  const [initializingKeys, setInitializingKeys] = useState(false);
  const [replyIndex, setReplyIndex] = useState(0);
  const [showEncryptionViz, setShowEncryptionViz] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMessages = activeContact === 0 ? aliceMessages : bobMessages;
  const setCurrentMessages = activeContact === 0 ? setAliceMessages : setBobMessages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleInitKeys = async () => {
    setInitializingKeys(true);
    // Simulate wallet signature request
    await sleep(800);
    // Simulate key derivation
    await sleep(600);
    setKeysInitialized(true);
    setInitializingKeys(false);
  };

  const handleSend = async () => {
    if (!messageInput.trim() || sending) return;
    setSending(true);
    setShowEncryptionViz(true);

    const content = messageInput;
    setMessageInput("");

    // Stage 1: Create message (sending)
    const newMsg: DemoMessage = {
      id: `msg-${Date.now()}`,
      sender: "you",
      content,
      timestamp: Date.now(),
      status: "sending",
    };
    setCurrentMessages(prev => [...prev, newMsg]);

    // Stage 2: Encrypting
    await sleep(600);
    setCurrentMessages(prev =>
      prev.map(m => m.id === newMsg.id ? { ...m, status: "encrypting" as const } : m)
    );

    // Stage 3: Uploading to IPFS
    await sleep(800);
    const ipfsCID = "Qm" + generateHash(12);
    setCurrentMessages(prev =>
      prev.map(m => m.id === newMsg.id ? { ...m, status: "uploading" as const, ipfsCID } : m)
    );

    // Stage 4: Sent via Tongo
    await sleep(1000);
    const txHash = "0x" + generateHash(16);
    setCurrentMessages(prev =>
      prev.map(m => m.id === newMsg.id ? { ...m, status: "sent" as const, txHash } : m)
    );

    setShowEncryptionViz(false);
    setSending(false);

    // Simulate reply from Alice
    if (activeContact === 0 && replyIndex < ALICE_REPLIES.length) {
      await sleep(2000 + Math.random() * 2000);
      const reply: DemoMessage = {
        id: `reply-${Date.now()}`,
        sender: "alice",
        content: ALICE_REPLIES[replyIndex],
        timestamp: Date.now(),
        status: "sent",
        ipfsCID: "Qm" + generateHash(12),
        txHash: "0x" + generateHash(16),
      };
      setAliceMessages(prev => [...prev, reply]);
      setReplyIndex(prev => prev + 1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const StatusIcon = ({ status }: { status: DemoMessage["status"] }) => {
    switch (status) {
      case "sending": return <Clock className="w-3 h-3 animate-pulse" />;
      case "encrypting": return <Lock className="w-3 h-3 animate-pulse text-yellow-400" />;
      case "uploading": return <Globe className="w-3 h-3 animate-pulse text-blue-400" />;
      case "sent": return <CheckCircle2 className="w-3 h-3 text-green-400" />;
    }
  };

  const StatusText = ({ status }: { status: DemoMessage["status"] }) => {
    switch (status) {
      case "sending": return <span className="text-white/50">Sending...</span>;
      case "encrypting": return <span className="text-yellow-400/70">Encrypting with X25519...</span>;
      case "uploading": return <span className="text-blue-400/70">Uploading to IPFS...</span>;
      case "sent": return <span className="text-white/50">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>;
    }
  };

  return (
    <div className="h-screen flex bg-slate-900 text-white">
      {/* Sidebar */}
      <div className="w-80 bg-slate-800 border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="font-bold">AgentSend</span>
            </div>
            <button onClick={onExit} className="text-white/40 hover:text-white/80 transition-colors text-sm flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Exit
            </button>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <Eye className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-orange-300">Interactive Demo Mode</span>
          </div>
        </div>

        {/* Your address */}
        <div className="p-3 border-b border-white/10">
          <p className="text-xs text-white/40">Your address</p>
          <p className="text-sm font-mono text-white/80">0x05eF...a3b1</p>
        </div>

        {/* Keys status */}
        <div className="p-3 border-b border-white/10">
          {keysInitialized ? (
            <div className="flex items-center gap-2 text-sm text-green-400">
              <Lock className="w-4 h-4" />
              <span>Encryption enabled</span>
              <CheckCircle2 className="w-3 h-3 ml-auto" />
            </div>
          ) : (
            <button
              onClick={handleInitKeys}
              disabled={initializingKeys}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-sm font-medium transition-all"
            >
              {initializingKeys ? (
                <><Sparkles className="w-4 h-4 animate-spin" /> Deriving keys from wallet...</>
              ) : (
                <><Key className="w-4 h-4" /> Initialize Encryption Keys</>
              )}
            </button>
          )}
        </div>

        {/* Balance */}
        <div className="p-3 border-b border-white/10 bg-gradient-to-r from-purple-500/5 to-blue-500/5">
          <div className="text-xs text-white/40 mb-1">Tongo Balance</div>
          <div className="text-lg font-semibold">0.001 ETH</div>
          <div className="text-xs text-orange-400 mt-1">🎭 Mock Tongo - Demo</div>
        </div>

        {/* Contacts */}
        <div className="flex-1 overflow-y-auto">
          {DEMO_CONTACTS.map((contact, i) => (
            <button
              key={contact.address}
              onClick={() => setActiveContact(i)}
              className={`w-full p-4 border-b border-white/5 hover:bg-white/5 text-left transition-colors ${
                activeContact === i ? "bg-white/10 border-l-2 border-l-purple-500" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-lg">
                    {contact.avatar}
                  </div>
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{contact.name}</div>
                  <div className="text-xs text-white/40 font-mono">{contact.address}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="bg-slate-800 border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-lg">
                {DEMO_CONTACTS[activeContact].avatar}
              </div>
              <div>
                <h3 className="font-semibold">{DEMO_CONTACTS[activeContact].name}</h3>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Lock className="w-3 h-3 text-green-400" />
                  End-to-end encrypted - Tongo privacy layer
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Encryption visualization banner */}
        {showEncryptionViz && (
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-b border-purple-500/20 px-6 py-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-blue-400">
                <Lock className="w-4 h-4 animate-pulse" />
                <span>X25519 encrypting</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20" />
              <div className="flex items-center gap-2 text-purple-400">
                <Shield className="w-4 h-4 animate-pulse" />
                <span>Tongo ZK proof</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20" />
              <div className="flex items-center gap-2 text-pink-400">
                <Globe className="w-4 h-4 animate-pulse" />
                <span>IPFS storage</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20" />
              <div className="flex items-center gap-2 text-green-400">
                <Zap className="w-4 h-4 animate-pulse" />
                <span>Starknet tx</span>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!keysInitialized && (
            <div className="text-center py-10">
              <Lock className="w-16 h-16 mx-auto mb-4 text-white/10" />
              <p className="text-white/40 text-lg">Initialize your encryption keys to start messaging</p>
              <p className="text-white/20 text-sm mt-2">Click "Initialize Encryption Keys" in the sidebar</p>
            </div>
          )}

          {keysInitialized && currentMessages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "you" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-md group ${msg.sender === "you" ? "items-end" : "items-start"}`}>
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    msg.sender === "you"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-white/10 text-white border border-white/10"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
                <div className={`flex items-center gap-2 mt-1.5 text-xs ${msg.sender === "you" ? "justify-end" : ""}`}>
                  {msg.sender === "you" && <StatusIcon status={msg.status} />}
                  {msg.sender === "you" ? (
                    <StatusText status={msg.status} />
                  ) : (
                    <span className="text-white/30">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                  {msg.status === "sent" && msg.ipfsCID && (
                    <span className="text-white/20 font-mono hidden group-hover:inline">
                      IPFS: {msg.ipfsCID}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-slate-800 border-t border-white/10 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder={keysInitialized ? "Type an encrypted message..." : "Initialize keys to start messaging"}
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={!keysInitialized || sending}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/30 disabled:opacity-30 disabled:cursor-not-allowed outline-none transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!messageInput.trim() || sending || !keysInitialized}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition-all font-medium"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-white/30 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              End-to-end encrypted with X25519 - stored on IPFS
            </p>
            <p className="text-xs text-white/20">
              Tongo ZK proofs active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateHash(len: number) {
  const chars = "abcdef0123456789";
  let result = "";
  for (let i = 0; i < len; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
