"use client";

import { useState, useEffect, useRef } from "react";
import { useWallet } from "@/hooks/useWallet";
import { ChatInterface } from "@/components/ChatInterface";
import { DemoChatInterface } from "@/components/DemoChatInterface";
import {
  Loader2, Lock, Shield, Zap, MessageSquare, LogOut, AlertCircle,
  ArrowRight, Globe, Eye, EyeOff, Users, CheckCircle2
} from "lucide-react";

export default function Home() {
  const { address, isConnected, isConnecting, connectWallet, disconnect } = useWallet();
  const [demoMode, setDemoMode] = useState(false);
  const [showHow, setShowHow] = useState(false);

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  // === DEMO MODE ===
  if (demoMode) {
    return <DemoChatInterface onExit={() => setDemoMode(false)} />;
  }

  // === CONNECTED: Real chat ===
  if (isConnected && address) {
    return (
      <div className="h-screen flex flex-col bg-gray-100">
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AgentSend
              </h1>
            </div>
            <div className="h-4 w-px bg-gray-300" />
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-green-700">Connected</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500">Wallet</p>
              <p className="text-sm font-mono text-gray-900">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            </div>
            <button
              onClick={() => disconnect()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface userAddress={address} />
        </div>
      </div>
    );
  }

  // === LANDING PAGE ===
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Header */}
      <nav className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">AgentSend</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/decentrathai/agentsend"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/60 hover:text-white/90 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-purple-300 border border-purple-500/30">
            <Shield className="w-4 h-4" />
            Built for Starknet Re&#123;define&#125; Hackathon - Privacy Track
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Private Messages.
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Zero Knowledge.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            End-to-end encrypted messaging on Starknet. Messages travel through Tongo's 
            privacy layer with ZK proofs, stored on IPFS. No one sees your conversations - not even us.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 flex items-center justify-center gap-3"
            >
              {isConnecting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Connecting...</>
              ) : (
                <>
                  Connect Wallet
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <button
              onClick={() => setDemoMode(true)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all border border-white/20 flex items-center justify-center gap-3"
            >
              <Eye className="w-5 h-5" />
              Try Live Demo
            </button>
          </div>

          <p className="text-sm text-white/40">
            Requires ArgentX or Braavos wallet - or try the demo instantly
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-center text-3xl font-bold mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: <Lock className="w-6 h-6" />, step: "1", title: "Connect", desc: "Sign in with your Starknet wallet" },
            { icon: <Shield className="w-6 h-6" />, step: "2", title: "Generate Keys", desc: "Derive encryption keys from your wallet signature" },
            { icon: <MessageSquare className="w-6 h-6" />, step: "3", title: "Send Message", desc: "Type a message - it's encrypted with X25519 before leaving your device" },
            { icon: <Zap className="w-6 h-6" />, step: "4", title: "ZK Privacy", desc: "Message rides a Tongo transfer with ElGamal encryption & ZK proofs" },
          ].map((item) => (
            <div key={item.step} className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-colors">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                {item.step}
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 text-purple-400">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-white/60">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy features */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
            <EyeOff className="w-10 h-10 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">Message Privacy</h3>
            <p className="text-white/60 leading-relaxed">
              X25519 key exchange + XSalsa20-Poly1305 encryption. Messages are encrypted 
              client-side before anything touches the network.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
            <Shield className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">Transaction Privacy</h3>
            <p className="text-white/60 leading-relaxed">
              Tongo's privacy layer hides transaction amounts with ElGamal encryption 
              and zero-knowledge proofs. Even on-chain analysis reveals nothing.
            </p>
          </div>
          <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 backdrop-blur-sm rounded-2xl p-8 border border-pink-500/20">
            <Globe className="w-10 h-10 text-pink-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">Censorship Resistant</h3>
            <p className="text-white/60 leading-relaxed">
              Encrypted messages stored on IPFS. No central server to shut down. 
              Your conversations persist as long as the network exists.
            </p>
          </div>
        </div>
      </div>

      {/* Tech stack */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 border-t border-white/10">
        <h3 className="text-center text-sm font-semibold text-white/40 uppercase tracking-wider mb-8">
          Technology Stack
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          {["Starknet", "Tongo SDK", "X25519 / NaCl", "IPFS / Pinata", "Next.js 14", "TypeScript", "Zero-Knowledge Proofs"].map(tech => (
            <span key={tech} className="px-5 py-2.5 bg-white/5 rounded-full border border-white/10 text-sm text-white/70">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-white/40">
          <p>Built for Starknet Re&#123;define&#125; Hackathon 2025 - Privacy Track</p>
          <p className="mt-2">
            Open source on{" "}
            <a href="https://github.com/decentrathai/agentsend" className="text-purple-400 hover:text-purple-300 transition-colors" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </main>
  );
}
