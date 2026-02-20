/**
 * Backend Configuration
 * Loads and validates environment variables
 */

import dotenv from "dotenv";
import { STARKNET_RPC_URL } from "@agentsend/common";

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || "3001"),
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-in-production",

  // Starknet
  starknetRpcUrl: process.env.STARKNET_RPC_URL || STARKNET_RPC_URL,
  starknetChainId: process.env.STARKNET_CHAIN_ID || "SN_SEPOLIA",

  // Tongo
  tongoContractAddress: process.env.TONGO_CONTRACT_ADDRESS || "",
  
  // OpenAI (for AI agent)
  openaiApiKey: process.env.OPENAI_API_KEY || "",

  // Database
  dbPath: process.env.DB_PATH || "./agentsend.db",

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
};

// Validate critical config
if (!config.tongoContractAddress) {
  console.warn("⚠️  TONGO_CONTRACT_ADDRESS not set - Tongo features will not work");
}

if (!config.openaiApiKey) {
  console.warn("⚠️  OPENAI_API_KEY not set - AI agent will not work");
}

export default config;
