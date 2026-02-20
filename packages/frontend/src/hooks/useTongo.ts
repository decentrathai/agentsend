"use client";

import { useState, useEffect } from "react";
import { useAccount } from "@starknet-react/core";

const TONGO_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TONGO_CONTRACT || "";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_TONGO_MOCK === "true";

export interface TongoBalance {
  current: bigint;
  pending: bigint;
}

export interface TongoTransfer {
  id: string;
  to: string;
  amount: bigint;
  messageHash: string;
  timestamp: number;
  status: "pending" | "confirmed" | "failed";
  txHash?: string;
}

/**
 * Tongo SDK integration hook
 * Supports both real Tongo SDK and mock mode for demo
 */
export function useTongo() {
  const { account, address } = useAccount();
  const [initialized, setInitialized] = useState(false);
  const [balance, setBalance] = useState<TongoBalance>({ current: 0n, pending: 0n });
  const [transfers, setTransfers] = useState<TongoTransfer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize when wallet connects
  useEffect(() => {
    if (account && address) {
      initializeTongo();
    } else {
      setInitialized(false);
      setBalance({ current: 0n, pending: 0n });
    }
  }, [account, address]);

  const initializeTongo = async () => {
    try {
      setLoading(true);
      
      if (USE_MOCK) {
        // Mock mode: Initialize with demo balance
        console.log("🎭 Tongo initialized (MOCK MODE)");
        loadMockData();
        setInitialized(true);
      } else {
        // Real Tongo SDK initialization would go here
        // const tongo = new TongoAccount(privateKey, TONGO_CONTRACT_ADDRESS, provider);
        console.log("🔐 Tongo initialized (REAL MODE)");
        setInitialized(true);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Failed to initialize Tongo:", err);
      setError(err instanceof Error ? err.message : "Initialization failed");
      setLoading(false);
    }
  };

  /**
   * Fund Tongo account with tokens
   */
  const fundAccount = async (tokenAddress: string, amount: bigint) => {
    if (!initialized) {
      throw new Error("Tongo not initialized");
    }
    
    setLoading(true);
    setError(null);

    try {
      if (USE_MOCK) {
        // Mock: Simulate funding
        await simulateDelay(1500);
        const newBalance = balance.current + amount;
        setBalance({ ...balance, current: newBalance });
        
        // Store in localStorage
        saveMockBalance(newBalance);
        
        console.log("💰 Funded account (mock):", amount.toString());
        return "0xmock_fund_tx_" + Date.now();
      } else {
        // Real Tongo fund operation
        // const op = await tongoAccount.fund({ tokenAddress, amount });
        // const call = op.toCalldata();
        // const tx = await account.execute([call]);
        // return tx.transaction_hash;
        
        throw new Error("Real Tongo not implemented yet");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Fund operation failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Transfer with message hash (core messaging function)
   */
  const transfer = async (
    recipient: string,
    amount: bigint,
    messageHash: string
  ): Promise<string> => {
    if (!initialized) {
      throw new Error("Tongo not initialized");
    }
    
    setLoading(true);
    setError(null);

    try {
      if (USE_MOCK) {
        // Mock: Simulate transfer
        await simulateDelay(2000);
        
        // Check balance
        if (balance.current < amount) {
          throw new Error("Insufficient balance");
        }
        
        // Create transfer record
        const transfer: TongoTransfer = {
          id: `transfer-${Date.now()}`,
          to: recipient,
          amount,
          messageHash,
          timestamp: Date.now(),
          status: "pending",
          txHash: "0xmock_tx_" + Date.now(),
        };
        
        // Update balance
        const newBalance = balance.current - amount;
        setBalance({ current: newBalance, pending: balance.pending + amount });
        
        // Store transfer
        const newTransfers = [...transfers, transfer];
        setTransfers(newTransfers);
        saveMockTransfers(newTransfers);
        saveMockBalance(newBalance);
        
        // Simulate confirmation after delay
        setTimeout(() => {
          confirmTransfer(transfer.id);
        }, 3000);
        
        console.log("💸 Transfer sent (mock):", {
          to: recipient.slice(0, 10),
          amount: amount.toString(),
          messageHash: messageHash.slice(0, 20),
        });
        
        return transfer.txHash!;
      } else {
        // Real Tongo transfer
        // const op = await tongoAccount.transfer({
        //   to: recipient,
        //   amount,
        //   data: messageHash, // Include IPFS CID in transaction data
        // });
        // const call = op.toCalldata();
        // const tx = await account.execute([call]);
        // return tx.transaction_hash;
        
        throw new Error("Real Tongo not implemented yet");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Transfer failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Rollover (claim pending balance)
   */
  const rollover = async (): Promise<string> => {
    if (!initialized) {
      throw new Error("Tongo not initialized");
    }
    
    setLoading(true);
    setError(null);

    try {
      if (USE_MOCK) {
        await simulateDelay(1500);
        
        if (balance.pending === 0n) {
          throw new Error("No pending balance to claim");
        }
        
        const newCurrent = balance.current + balance.pending;
        setBalance({ current: newCurrent, pending: 0n });
        saveMockBalance(newCurrent);
        
        console.log("🔄 Rollover complete (mock):", balance.pending.toString());
        return "0xmock_rollover_tx_" + Date.now();
      } else {
        // Real Tongo rollover
        // const op = await tongoAccount.rollover();
        // const call = op.toCalldata();
        // const tx = await account.execute([call]);
        // return tx.transaction_hash;
        
        throw new Error("Real Tongo not implemented yet");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Rollover failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh balance from contract
   */
  const refreshBalance = async () => {
    if (!initialized) return;
    
    try {
      if (USE_MOCK) {
        loadMockData();
      } else {
        // Real balance query
        // const balance = await tongoAccount.getBalance();
        // setBalance(balance);
      }
    } catch (err) {
      console.error("Failed to refresh balance:", err);
    }
  };

  // Mock helpers
  const confirmTransfer = (transferId: string) => {
    setTransfers(prev => {
      const updated = prev.map(t => 
        t.id === transferId ? { ...t, status: "confirmed" as const } : t
      );
      saveMockTransfers(updated);
      return updated;
    });
    
    setBalance(prev => ({
      current: prev.current,
      pending: prev.pending - (transfers.find(t => t.id === transferId)?.amount || 0n),
    }));
  };

  const loadMockData = () => {
    if (!address) return;
    
    const storedBalance = localStorage.getItem(`tongo-balance-${address}`);
    if (storedBalance) {
      setBalance(JSON.parse(storedBalance, bigIntReviver));
    } else {
      // Demo balance
      setBalance({ current: 1000000000000000n, pending: 0n }); // 0.001 ETH equivalent
    }
    
    const storedTransfers = localStorage.getItem(`tongo-transfers-${address}`);
    if (storedTransfers) {
      setTransfers(JSON.parse(storedTransfers, bigIntReviver));
    }
  };

  const saveMockBalance = (newBalance: bigint) => {
    if (!address) return;
    localStorage.setItem(
      `tongo-balance-${address}`,
      JSON.stringify({ current: newBalance, pending: balance.pending }, bigIntReplacer)
    );
  };

  const saveMockTransfers = (newTransfers: TongoTransfer[]) => {
    if (!address) return;
    localStorage.setItem(
      `tongo-transfers-${address}`,
      JSON.stringify(newTransfers, bigIntReplacer)
    );
  };

  return {
    initialized,
    balance,
    transfers,
    loading,
    error,
    fundAccount,
    transfer,
    rollover,
    refreshBalance,
    isUsingMock: USE_MOCK,
  };
}

// Utility functions
function simulateDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function bigIntReplacer(key: string, value: any): any {
  return typeof value === "bigint" ? value.toString() : value;
}

function bigIntReviver(key: string, value: any): any {
  if (typeof value === "string" && /^\d+$/.test(value)) {
    try {
      return BigInt(value);
    } catch {
      return value;
    }
  }
  return value;
}
