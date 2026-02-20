/**
 * AgentSend Constants
 */

// Starknet network configuration
export const STARKNET_CHAIN_ID = "SN_SEPOLIA";

// Tongo contract address - TO BE FILLED after research
export const TONGO_CONTRACT_ADDRESS = process.env.TONGO_CONTRACT_ADDRESS || "";

// RPC endpoints
export const STARKNET_RPC_URL = 
  process.env.STARKNET_RPC_URL || "https://starknet-sepolia.public.blastapi.io";

// API configuration
export const DEFAULT_API_URL = "http://localhost:3001/api";
export const DEFAULT_WS_URL = "ws://localhost:3001/api/ws";

// Relay simulation timings (milliseconds)
export const RELAY_DELAYS = {
  ENTER_POOL: { min: 1000, max: 2000 },
  CONFIRM: { min: 2000, max: 4000 },
  DELIVER: { min: 3000, max: 5000 },
};

// Tongo transfer amount for messages (minimum transfer = 1 unit)
export const MESSAGE_TRANSFER_AMOUNT = "1";

// Maximum message length
export const MAX_MESSAGE_LENGTH = 5000;

// AI command prefix
export const AI_COMMAND_PREFIX = "/ai";
