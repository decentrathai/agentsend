"use client";

import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";

export function useWallet() {
  const { address, account, status } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const isConnected = status === "connected";
  const isConnecting = status === "connecting";

  const connectWallet = async () => {
    // Try ArgentX first, then Braavos
    const argentX = connectors.find((c) => c.id === "argentX");
    const braavos = connectors.find((c) => c.id === "braavos");
    
    const connector = argentX || braavos || connectors[0];
    if (connector) {
      connect({ connector });
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
