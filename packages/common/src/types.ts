/**
 * AgentSend Common Types
 * Shared across frontend and backend
 */

export interface User {
  id: string;
  starknetAddress: string;
  tongoPublicKey: string;      // ElGamal public key (Stark curve)
  x25519PublicKey: string;      // Message encryption public key (base64)
  createdAt: number;
}

export interface Conversation {
  id: string;
  participants: string[];       // Array of user IDs
  lastMessage?: Message;
  updatedAt: number;
  createdAt: number;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: string;               // User ID
  encryptedContent: string;     // X25519-encrypted message (base64)
  nonce: string;                // Encryption nonce (base64)
  tongoTxHash: string;          // Starknet tx hash of Tongo transfer
  relayTxHash?: string;         // Mock Zcash tx hash (simulated)
  status: MessageStatus;
  timestamp: number;
  isAI?: boolean;               // True if message is from AI agent
}

export type MessageStatus = 
  | "encrypting"    // Client-side: encrypting message
  | "sending"       // Submitting Tongo transfer
  | "pending"       // Waiting for relay to pick up
  | "in_pool"       // In shielded pool (relay processing)
  | "confirmed"     // Relay confirmed
  | "delivered"     // Delivered to recipient
  | "failed";       // Error occurred

export interface RelayMessage {
  id: string;
  senderTongoPubkey: string;
  receiverTongoPubkey: string;
  encryptedContent: string;
  nonce: string;
  tongoTxHash: string;
  mockZcashTxHash: string;
  status: MessageStatus;
  submittedAt: number;
  deliveredAt?: number;
}

export interface AuthTokenPayload {
  userId: string;
  starknetAddress: string;
  iat: number;
  exp: number;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SendMessageRequest {
  conversationId: string;
  encryptedContent: string;
  nonce: string;
  recipientTongoPubkey: string;
}

export interface SendMessageResponse {
  messageId: string;
  tongoTxHash: string;
  relayStatus: MessageStatus;
}

export interface NewConversationRequest {
  participantAddress: string;  // Starknet address
}

export interface AIPromptRequest {
  conversationId: string;
  encryptedPrompt: string;
  nonce: string;
}

export interface WebSocketMessage {
  type: "new_message" | "message_status" | "typing";
  conversationId?: string;
  message?: Message;
  messageId?: string;
  status?: MessageStatus;
  sender?: string;
}
