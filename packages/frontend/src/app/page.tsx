"use client";

import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { Loader2, Lock, Shield, Zap, MessageSquare } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { isConnected, isConnecting, connectWallet } = useWallet();

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect. Make sure you have ArgentX or Braavos installed!");
    }
  };

  const handleOpenChat = () => {
    router.push("/chat");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AgentSend
            </span>
          </div>
          {isConnected && (
            <button
              onClick={handleOpenChat}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open App
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Private Messaging
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              on Starknet
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-6">
              Send encrypted messages with true privacy using Tongo's zero-knowledge proofs
              and decentralized storage on IPFS.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            {isConnected ? (
              <button
                onClick={handleOpenChat}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-12 py-4 rounded-full text-lg transition-all shadow-lg hover:shadow-xl"
              >
                Launch App →
              </button>
            ) : (
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold px-12 py-4 rounded-full text-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Connect Wallet
                    <span className="text-sm opacity-75">(ArgentX or Braavos)</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                End-to-End Encrypted
              </h3>
              <p className="text-gray-600">
                Messages encrypted with X25519 (Curve25519). Only sender and recipient 
                can decrypt. Your private key never leaves your device.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Tongo Privacy Layer
              </h3>
              <p className="text-gray-600">
                Messages ride on Tongo's privacy-preserving transfers with ElGamal encryption
                and zero-knowledge proofs. Transaction amounts are hidden.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Decentralized Storage
              </h3>
              <p className="text-gray-600">
                Encrypted messages stored on IPFS for censorship resistance. 
                Every message is a verified Starknet transaction.
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mt-20 pt-12 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
              Built With
            </h3>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <span className="px-4 py-2 bg-white/80 rounded-full border border-gray-200">
                Starknet
              </span>
              <span className="px-4 py-2 bg-white/80 rounded-full border border-gray-200">
                Tongo SDK
              </span>
              <span className="px-4 py-2 bg-white/80 rounded-full border border-gray-200">
                X25519 Encryption
              </span>
              <span className="px-4 py-2 bg-white/80 rounded-full border border-gray-200">
                IPFS
              </span>
              <span className="px-4 py-2 bg-white/80 rounded-full border border-gray-200">
                Next.js 14
              </span>
              <span className="px-4 py-2 bg-white/80 rounded-full border border-gray-200">
                TypeScript
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-sm text-gray-500">
            <p>
              Built for Starknet Re{"{"}"define{"}"} Hackathon 2025 • Privacy Track
            </p>
            <p className="mt-2 text-xs">
              Open source on{" "}
              <a
                href="https://github.com/yourusername/agentsend"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
