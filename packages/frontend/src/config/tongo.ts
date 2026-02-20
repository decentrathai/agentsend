/**
 * Tongo Configuration
 * 
 * Contract addresses and configuration for Tongo SDK integration
 */

// PLACEHOLDER: Need to find actual deployed addresses
// Check: https://docs.tongo.cash or Tongo Discord/Telegram

export const TONGO_CONTRACTS = {
  // Sepolia Testnet
  // NOTE: As of Feb 16, 2026, no public testnet deployment found
  // Options: 1) Deploy Tongo contracts ourselves, 2) Use mock for demo, 3) Check with Tongo team
  sepolia: {
    // Main Tongo contract (wraps ERC20 tokens)
    tongo: process.env.NEXT_PUBLIC_TONGO_CONTRACT || "0x0000000000000000000000000000000000000000000000000000000000000000",
    
    // Supported tokens (examples - verify actual addresses)
    tokens: {
      ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7", // Sepolia ETH
      STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d", // Sepolia STRK
    },
  },
  
  // Mainnet - VERIFIED from SDK README
  mainnet: {
    // Mainnet Tongo contract (wraps USDC with rate 1)
    tongo: "0x0415f2c3b16cc43856a0434ed151888a5797b6a22492ea6fd41c62dbb4df4e6c",
    tokens: {
      ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
      STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
      USDC: "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8", // USDC (base 10^6)
    },
  },
};

// Default network
export const DEFAULT_NETWORK = "sepolia";

// Get Tongo contract address for current network
export function getTongoAddress(network: string = DEFAULT_NETWORK): string {
  return TONGO_CONTRACTS[network as keyof typeof TONGO_CONTRACTS]?.tongo || "";
}

// Get token addresses for current network
export function getTokenAddresses(network: string = DEFAULT_NETWORK) {
  return TONGO_CONTRACTS[network as keyof typeof TONGO_CONTRACTS]?.tokens || {};
}

// Message transfer amount (smallest unit - just a carrier for the message)
export const MESSAGE_TRANSFER_AMOUNT = BigInt(1);

// IPFS Configuration
export const IPFS_CONFIG = {
  gateway: process.env.NEXT_PUBLIC_IPFS_GATEWAY || "https://ipfs.io/ipfs/",
  api: process.env.NEXT_PUBLIC_IPFS_API || "https://ipfs.infura.io:5001/api/v0",
};

// Starknet RPC endpoints
export const RPC_ENDPOINTS = {
  sepolia: process.env.NEXT_PUBLIC_RPC_URL || "https://starknet-sepolia.public.blastapi.io",
  mainnet: "https://starknet-mainnet.public.blastapi.io",
};
