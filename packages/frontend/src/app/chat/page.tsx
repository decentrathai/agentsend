"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChatInterface } from "@/components/ChatInterface";
import { useWallet } from "@/hooks/useWallet";
import { Loader2, LogOut, AlertCircle } from "lucide-react";

export default function ChatPage() {
  const router = useRouter();
  const { address, isConnected, disconnect } = useWallet();

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  const handleDisconnect = () => {
    disconnect();
    router.push("/");
  };

  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AgentSend
          </h1>
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
            onClick={handleDisconnect}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Disconnect
          </button>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="bg-orange-50 border-b border-orange-200 px-6 py-2">
        <div className="flex items-center gap-2 text-sm text-orange-800">
          <AlertCircle className="w-4 h-4" />
          <span>
            <strong>Demo Mode:</strong> Using mock Tongo for demonstration. 
            All encryption and IPFS features are functional.
          </span>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface userAddress={address} />
      </div>
    </div>
  );
}
