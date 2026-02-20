"use client";

import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";

export function useWallet() {
  const { address, account, status } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const isConnected = status === "connected";
  const isConnecting = status === "connecting";

  const connectWallet = async () => {
    // Find any available connector - try argent first, then braavos, then whatever is available
    const argentX = connectors.find((c) => c.id === "argentX" || c.id === "argent" || c.name?.toLowerCase().includes("argent"));
    const braavosC = connectors.find((c) => c.id === "braavos" || c.name?.toLowerCase().includes("braavos"));
    
    const connector = argentX || braavosC || connectors[0];
    if (connector) {
      try {
        await connect({ connector });
      } catch (e) {
        console.error("Connect error:", e);
        // Try next connector if first fails
        const fallback = connectors.find((c) => c !== connector);
        if (fallback) {
          await connect({ connector: fallback });
        }
      }
    }
  };

  return {
    address,
    account,
    isConnected,
    isConnecting,
    connectWallet,
    disconnect,
    connectors,
  };
}
