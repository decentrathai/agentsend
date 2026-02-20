# AgentSend - Architecture Document

> Privacy Messenger on Starknet | Re{define} Hackathon 2025
> Tracks: Privacy ($9,675) + Open ($2,150) | Deadline: Feb 28 | DoraHacks

---

## 1. Executive Summary

AgentSend is a privacy-first messenger that uses **Tongo SDK** (ElGamal-encrypted ERC20 transfers on Starknet) as a message transport layer, with **Zcash shielded memos** as a cross-chain privacy relay. Messages piggyback on encrypted token transfers - every message is a real on-chain transaction with hidden amounts, making metadata analysis infeasible.

The "AI agent" angle: AgentSend includes a built-in AI assistant that can participate in encrypted conversations - a privacy-first ChatGPT inside a messenger where even the AI's responses travel through the shielded pipeline.

**Hackathon scope:** Fully working Starknet + Tongo messaging with a **mocked Zcash relay** (we demonstrate the concept and reference our production ZChat app for the real Zcash integration).

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AgentSend System                             │
│                                                                     │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────┐    │
│  │  Frontend     │     │  Backend     │     │  Mock Zcash      │    │
│  │  (Next.js)   │────>│  (Express)   │────>│  Relay Service   │    │
│  │              │<────│              │<────│                  │    │
│  │  - Chat UI   │     │  - REST API  │     │  - Shielded pool │    │
│  │  - Wallet    │     │  - Tongo ops │     │  - Memo encrypt  │    │
│  │  - AI chat   │     │  - Tx watch  │     │  - Delay sim     │    │
│  └──────┬───────┘     └──────┬───────┘     └────────┬─────────┘    │
│         │                    │                      │              │
│         │     ┌──────────────┴──────────────┐       │              │
│         └────>│     Starknet (Sepolia)       │<─────┘              │
│               │                              │                     │
│               │  ┌────────────────────────┐  │                     │
│               │  │  Tongo Contract        │  │                     │
│               │  │  - ElGamal balances    │  │                     │
│               │  │  - ZK-verified txfers  │  │                     │
│               │  │  - ~120K Cairo steps   │  │                     │
│               │  └────────────────────────┘  │                     │
│               └──────────────────────────────┘                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Tech | Purpose |
|-----------|------|---------|
| **Frontend** | Next.js 14 + React 18 | Chat UI, wallet connect, message compose/display |
| **Backend** | Express + TypeScript | Tongo operations, tx watching, message relay coordination |
| **Mock Relay** | In-process service | Simulates Zcash shielded pool (delay + encryption + delivery) |
| **Tongo SDK** | `@fatsolutions/tongo-sdk` | ElGamal encrypted transfers on Starknet |
| **AI Agent** | OpenAI API | Privacy-first assistant inside chat threads |

---

## 3. Data Flow Sequences

### 3.1 Send Message Flow

```
 Sender App          Backend            Starknet/Tongo       Mock Relay         Receiver Backend     Receiver App
    │                   │                    │                   │                    │                  │
    │ POST /send        │                    │                   │                    │                  │
    │  {to, message}    │                    │                   │                    │                  │
    │──────────────────>│                    │                   │                    │                  │
    │                   │ 1. Encrypt msg     │                   │                    │                  │
    │                   │    with receiver   │                   │                    │                  │
    │                   │    pubkey (X25519) │                   │                    │                  │
    │                   │                    │                   │                    │                  │
    │                   │ 2. Create Tongo    │                   │                    │                  │
    │                   │    Transfer(1 unit)│                   │                    │                  │
    │                   │    + embed msgHash │                   │                    │                  │
    │                   │───────────────────>│                   │                    │                  │
    │                   │                    │ 3. ZK verify +    │                    │                  │
    │                   │                    │    execute on-chain│                   │                  │
    │                   │                    │                   │                    │                  │
    │                   │ 4. Store encrypted │                   │                    │                  │
    │                   │    msg + tx hash   │                   │                    │                  │
    │                   │──────────────────────────────────────>│                    │                  │
    │                   │                    │                   │ 5. Simulate        │                  │
    │                   │                    │                   │    shielded pool   │                  │
    │                   │                    │                   │    (2-5s delay)    │                  │
    │                   │                    │                   │                    │                  │
    │                   │                    │                   │ 6. Deliver to      │                  │
    │                   │                    │                   │    receiver backend│                  │
    │                   │                    │                   │───────────────────>│                  │
    │                   │                    │                   │                    │ 7. Push to       │
    │                   │                    │                   │                    │    receiver      │
    │                   │                    │                   │                    │────────────────>│
    │                   │                    │                   │                    │                  │ 8. Decrypt
    │                   │                    │                   │                    │                  │    + display
```

### 3.2 Message Encryption Layers

```
Layer 1: Application encryption (X25519-XSalsa20-Poly1305)
  - Message plaintext -> encrypted with receiver's X25519 pubkey
  - Only receiver can decrypt

Layer 2: Tongo transfer (ElGamal on Stark curve)  
  - Encrypted message hash embedded alongside 1-unit Tongo transfer
  - Amount hidden, ZK-proved valid

Layer 3: Mock Zcash relay (simulated shielded memo)
  - In production: encrypted payload in Zcash shielded tx memo field
  - In demo: AES-256-GCM encrypted, stored in memory with simulated delay
```

### 3.3 AI Agent Flow

```
User sends "/ai What is Starknet?"
    │
    ├─> Message encrypted + sent via Tongo (same as any message)
    │
    ├─> Backend detects /ai prefix
    │
    ├─> Forwards decrypted text to OpenAI API
    │
    ├─> AI response encrypted + sent back via Tongo transfer
    │
    └─> Receiver sees AI response in chat (indistinguishable from human msg on-chain)
```

---

## 4. File Structure

```
agentsend/
├── package.json                    # Monorepo root (npm workspaces)
├── tsconfig.base.json              # Shared TypeScript config
├── .env.example                    # Environment variables template
├── README.md                       # Project overview + setup
│
├── packages/
│   ├── common/                     # Shared types & crypto utilities
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── types.ts            # Message, User, Conversation types
│   │   │   ├── crypto.ts           # X25519 key generation, encrypt/decrypt
│   │   │   ├── constants.ts        # Contract addresses, config
│   │   │   └── index.ts            # Re-exports
│   │   └── tsconfig.json
│   │
│   ├── backend/                    # Express API + Tongo integration
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── index.ts            # Express server entry point
│   │   │   ├── routes/
│   │   │   │   ├── messages.ts     # POST /send, GET /messages/:conversationId
│   │   │   │   ├── auth.ts         # POST /auth/register, POST /auth/login
│   │   │   │   ├── conversations.ts# GET /conversations, POST /conversations
│   │   │   │   └── ai.ts           # POST /ai/chat (AI agent endpoint)
│   │   │   ├── services/
│   │   │   │   ├── tongo.ts        # Tongo SDK wrapper - Fund, Transfer, Rollover
│   │   │   │   ├── relay.ts        # Mock Zcash relay service
│   │   │   │   ├── watcher.ts      # Starknet tx event watcher
│   │   │   │   ├── ai-agent.ts     # OpenAI integration for /ai commands
│   │   │   │   └── message-store.ts# In-memory message storage (SQLite for persistence)
│   │   │   ├── middleware/
│   │   │   │   └── auth.ts         # JWT auth middleware
│   │   │   └── config.ts           # Environment config loader
│   │   └── tsconfig.json
│   │
│   └── frontend/                   # Next.js chat application
│       ├── package.json
│       ├── next.config.js
│       ├── tailwind.config.js
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx      # Root layout with providers
│       │   │   ├── page.tsx        # Landing/login page
│       │   │   └── chat/
│       │   │       ├── page.tsx    # Main chat view
│       │   │       └── [id]/
│       │   │           └── page.tsx# Conversation detail
│       │   ├── components/
│       │   │   ├── ChatWindow.tsx   # Message list + input
│       │   │   ├── MessageBubble.tsx# Single message display
│       │   │   ├── ConversationList.tsx # Sidebar conversation list
│       │   │   ├── WalletConnect.tsx# Starknet wallet connection
│       │   │   ├── NewChat.tsx     # Start new conversation
│       │   │   ├── AIBadge.tsx     # Visual indicator for AI messages
│       │   │   └── PrivacyIndicator.tsx # Shows encryption status
│       │   ├── hooks/
│       │   │   ├── useTongo.ts     # Tongo SDK React hook
│       │   │   ├── useMessages.ts  # Message polling/websocket hook
│       │   │   └── useWallet.ts    # Starknet wallet hook
│       │   ├── lib/
│       │   │   ├── api.ts          # Backend API client
│       │   │   └── crypto.ts       # Frontend crypto (imports from common)
│       │   └── providers/
│       │       └── StarknetProvider.tsx # Starknet React provider
│       └── tsconfig.json
│
├── scripts/
│   ├── setup-tongo.ts              # Fund initial Tongo accounts for demo
│   ├── demo-flow.ts                # Automated demo script
│   └── generate-keys.ts            # Generate X25519 keypairs for users
│
└── docs/
    ├── ARCHITECTURE.md             # This file
    └── DEMO-SCRIPT.md              # Minute-by-minute demo guide
```

---

## 5. API Contracts

### 5.1 Authentication

```
POST /api/auth/register
  Body: { starknetAddress: string, tongoPublicKey: string, x25519PublicKey: string, signature: string }
  Response: { token: string, userId: string }

POST /api/auth/login  
  Body: { starknetAddress: string, signature: string }
  Response: { token: string }
```

### 5.2 Conversations

```
GET /api/conversations
  Headers: Authorization: Bearer <token>
  Response: { conversations: [{ id, participants, lastMessage, updatedAt }] }

POST /api/conversations
  Body: { participantAddress: string }
  Response: { conversationId: string }
```

### 5.3 Messages

```
POST /api/messages/send
  Headers: Authorization: Bearer <token>
  Body: {
    conversationId: string,
    encryptedContent: string,      // X25519-encrypted message (base64)
    nonce: string,                  // Encryption nonce (base64)
    tongoTxHash?: string            // If sender submitted Tongo tx directly
  }
  Response: {
    messageId: string,
    tongoTxHash: string,            // Tongo transfer tx hash
    relayStatus: "queued"           // Mock relay status
  }

GET /api/messages/:conversationId
  Headers: Authorization: Bearer <token>
  Query: ?after=<timestamp>&limit=50
  Response: {
    messages: [{
      id: string,
      sender: string,
      encryptedContent: string,
      nonce: string,
      tongoTxHash: string,
      relayTxHash: string,          // Mock Zcash tx hash
      timestamp: number,
      status: "sent" | "relayed" | "delivered"
    }]
  }
```

### 5.4 AI Agent

```
POST /api/ai/chat
  Headers: Authorization: Bearer <token>
  Body: {
    conversationId: string,
    encryptedPrompt: string,        // Encrypted with backend's X25519 pubkey
    nonce: string
  }
  Response: {
    messageId: string,
    status: "processing"            // AI response delivered via same message flow
  }
```

### 5.5 WebSocket Events

```
WS /api/ws?token=<jwt>

Server -> Client events:
  { type: "new_message", conversationId, message: MessageObject }
  { type: "message_status", messageId, status: "relayed" | "delivered" }
  { type: "typing", conversationId, sender }
```

---

## 6. Tongo Integration Details

### 6.1 Account Setup (One-time)

```typescript
import { Account as TongoAccount } from "@fatsolutions/tongo-sdk";
import { Account, RpcProvider } from "starknet";

// Starknet provider (Sepolia testnet)
const provider = new RpcProvider({
  nodeUrl: process.env.STARKNET_RPC_URL,
  specVersion: "0.8.1",
});

// Starknet signer (pays gas)
const signer = new Account({
  provider,
  address: process.env.STARKNET_ADDRESS,
  signer: process.env.STARKNET_PRIVATE_KEY,
});

// Tongo account (encrypted balance holder)
const tongoAccount = new TongoAccount(
  process.env.TONGO_PRIVATE_KEY,
  process.env.TONGO_CONTRACT_ADDRESS,
  provider
);
```

### 6.2 Message-as-Transfer Pattern

Each message triggers a **1-unit Tongo transfer** to the recipient. The transfer itself is the "carrier pigeon" - the encrypted message payload travels alongside it via the backend.

```typescript
// Send message = Tongo Transfer of 1 unit
async function sendMessage(recipientTongoPubkey: string, encryptedMsg: string) {
  // 1. Create Tongo transfer (1 unit = minimum, just a carrier)
  const transferOp = await tongoAccount.transfer({
    to: recipientTongoPubkey,
    amount: "1",                    // Minimum transfer - message carrier
    sender: signer.address,
  });

  // 2. Execute on Starknet
  const tx = await signer.execute([transferOp.toCalldata()]);
  const receipt = await provider.waitForTransaction(tx.transaction_hash);

  // 3. Submit encrypted message + tx hash to relay
  await relay.submit({
    txHash: tx.transaction_hash,
    encryptedContent: encryptedMsg,
    sender: tongoAccount.publicKey,
    receiver: recipientTongoPubkey,
  });

  return tx.transaction_hash;
}
```

### 6.3 Recipient Flow

```typescript
// Receiver must periodically rollover to claim pending balance
async function claimPendingMessages() {
  const rolloverOp = await tongoAccount.rollover({
    sender: signer.address,
  });
  await signer.execute([rolloverOp.toCalldata()]);
}
```

### 6.4 Initial Funding (Demo Setup)

```typescript
// Fund Tongo accounts with testnet ERC20 tokens
async function fundAccount(amount: string) {
  const fundOp = await tongoAccount.fund({
    amount,
    sender: signer.address,
  });
  await signer.execute([fundOp.toCalldata()]);
}
```

### 6.5 Why Tongo for Messaging?

| Property | Benefit for Messaging |
|----------|----------------------|
| Hidden amounts | Obscures message frequency patterns (all transfers look identical) |
| ZK proofs | Sender authenticity without revealing identity link |
| ElGamal encryption | Amounts are encrypted - no metadata leakage |
| No trusted setup | No ceremony coordinator to compromise |
| ~120K Cairo steps | Affordable per-message cost on Starknet |

---

## 7. Mock Zcash Relay Design

### 7.1 What It Simulates

In production, the relay would:
1. Pick up Tongo transfer events on Starknet
2. Extract the encrypted message payload
3. Send a Zcash shielded transaction with the encrypted message in the memo field (max 512 bytes)
4. On the receiving side, watch for shielded transactions and deliver the message

The mock simulates this with realistic delays and encryption.

### 7.2 Implementation

```typescript
// services/relay.ts

interface RelayMessage {
  id: string;
  senderTongoPubkey: string;
  receiverTongoPubkey: string;
  encryptedContent: string;         // Already X25519-encrypted by sender
  tongoTxHash: string;
  mockZcashTxHash: string;          // Simulated
  status: "pending" | "in_pool" | "confirmed" | "delivered";
  submittedAt: number;
  deliveredAt?: number;
}

class MockZcashRelay {
  private pool: Map<string, RelayMessage> = new Map();
  private subscribers: Map<string, (msg: RelayMessage) => void> = new Map();

  async submit(msg: Omit<RelayMessage, "id" | "mockZcashTxHash" | "status" | "submittedAt">) {
    const relayMsg: RelayMessage = {
      ...msg,
      id: crypto.randomUUID(),
      mockZcashTxHash: `mock_zcash_${crypto.randomBytes(16).toString("hex")}`,
      status: "pending",
      submittedAt: Date.now(),
    };

    this.pool.set(relayMsg.id, relayMsg);

    // Simulate shielded pool processing
    // Stage 1: Enter pool (1-2s)
    setTimeout(() => {
      relayMsg.status = "in_pool";
      this.emit(relayMsg);
    }, 1000 + Math.random() * 1000);

    // Stage 2: Confirm (2-4s total)
    setTimeout(() => {
      relayMsg.status = "confirmed";
      this.emit(relayMsg);
    }, 2000 + Math.random() * 2000);

    // Stage 3: Deliver (3-5s total)
    setTimeout(() => {
      relayMsg.status = "delivered";
      relayMsg.deliveredAt = Date.now();
      this.deliver(relayMsg);
    }, 3000 + Math.random() * 2000);

    return relayMsg;
  }

  private deliver(msg: RelayMessage) {
    const handler = this.subscribers.get(msg.receiverTongoPubkey);
    if (handler) handler(msg);
  }

  subscribe(tongoPubkey: string, handler: (msg: RelayMessage) => void) {
    this.subscribers.set(tongoPubkey, handler);
  }
}
```

### 7.3 Demo UI Integration

The frontend shows relay status with visual stages:

```
[Encrypting...] -> [Tongo Transfer ✓] -> [Entering Shielded Pool...] -> [In Pool ⏳] -> [Delivered ✓]
```

This makes the Zcash relay concept tangible even though it's mocked.

### 7.4 Production Path (Reference ZChat)

In production, replace `MockZcashRelay` with real Zcash integration:
- We already have **ZChat** - a production app doing Zcash shielded memo messaging
- The `relay.ts` interface stays identical; only the implementation changes
- Zcash lightwalletd for tx submission + watching
- Real shielded memo field (512 bytes, supports chunked messages)

---

## 8. Smart Contract Interfaces

### 8.1 Existing Tongo Contract (No Changes Needed)

We use the deployed Tongo contract on Starknet Sepolia as-is. Key functions:

```cairo
// We call these via the SDK, not directly
fn fund(amount: u256, proof: Proof)
fn transfer(receiver_pubkey: felt252, ct_sender: Ciphertext, ct_receiver: Ciphertext, proof: Proof)
fn rollover(proof: Proof)
fn withdraw(amount: u256, to: ContractAddress, proof: Proof)
```

### 8.2 Optional: AgentSend Registry Contract

A simple on-chain registry mapping Starknet addresses to messaging public keys:

```cairo
#[starknet::interface]
trait IAgentSendRegistry {
    fn register(ref self: ContractState, x25519_pubkey: felt252, tongo_pubkey: felt252);
    fn get_keys(self: @ContractState, address: ContractAddress) -> (felt252, felt252);
    fn is_registered(self: @ContractState, address: ContractAddress) -> bool;
}
```

**For hackathon:** This is optional. We can use the backend's database for key lookup. The contract shows we could be fully decentralized.

---

## 9. Frontend Specs

### 9.1 Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **TailwindCSS 3** + **shadcn/ui** components
- **starknet-react** for wallet connection
- **get-starknet** for wallet detection (ArgentX / Braavos)

### 9.2 Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | LandingPage | Connect wallet + intro |
| `/chat` | ChatLayout | Conversation list sidebar + chat area |
| `/chat/[id]` | ConversationView | Message thread with input |

### 9.3 Key UI Elements

**Chat Window:**
- Dark theme (privacy app aesthetic)
- Message bubbles with encryption status indicators
- Relay status animation (shielded pool visualization)
- "/ai" command prefix for AI agent queries
- Starknet tx hash links on each message (clickable to Starkscan)

**Privacy Indicators:**
- 🔒 Lock icon = end-to-end encrypted
- 🛡️ Shield icon = passed through shielded relay
- ⚡ Lightning = on-chain confirmed (Tongo transfer)

**Wallet Bar:**
- Connected wallet address (truncated)
- Tongo balance display
- "Fund Account" button for demo

---

## 10. Dependencies with Versions

### Backend
```json
{
  "@fatsolutions/tongo-sdk": "latest",
  "starknet": "^8.0.0",
  "express": "^4.18.0",
  "ws": "^8.16.0",
  "tweetnacl": "^1.0.3",
  "tweetnacl-util": "^0.15.1",
  "jsonwebtoken": "^9.0.0",
  "better-sqlite3": "^11.0.0",
  "dotenv": "^16.4.0",
  "openai": "^4.28.0",
  "typescript": "^5.4.0",
  "tsx": "^4.7.0"
}
```

### Frontend
```json
{
  "next": "^14.2.0",
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "@starknet-react/core": "^3.0.0",
  "get-starknet-core": "^4.0.0",
  "starknet": "^8.0.0",
  "tailwindcss": "^3.4.0",
  "@radix-ui/react-scroll-area": "^1.0.0",
  "lucide-react": "^0.350.0",
  "date-fns": "^3.3.0",
  "tweetnacl": "^1.0.3",
  "zustand": "^4.5.0"
}
```

---

## 11. Sprint Plan

### Phase 1: Foundation (Days 1-3, Feb 15-17)

| # | Task | Size | Verify Command | Depends |
|---|------|------|----------------|---------|
| 1.1 | Monorepo setup (workspaces, tsconfig, lint) | S | `npm run build` in root | - |
| 1.2 | Common package: types + crypto utils (X25519 keypair gen, encrypt/decrypt) | M | `npm test -w packages/common` | 1.1 |
| 1.3 | Backend skeleton: Express + routes + JWT auth | M | `curl localhost:3001/api/health` | 1.1 |
| 1.4 | Tongo service: connect to SDK, Fund + Transfer + Rollover wrappers | L | `npm run test:tongo -w packages/backend` (fund + transfer on Sepolia) | 1.2, 1.3 |
| 1.5 | Frontend skeleton: Next.js + Tailwind + wallet connect | M | `npm run dev -w packages/frontend` + connect ArgentX | 1.1 |

### Phase 2: Core Messaging (Days 4-6, Feb 18-20)

| # | Task | Size | Verify Command | Depends |
|---|------|------|----------------|---------|
| 2.1 | Mock Zcash relay service (in-memory pool, stages, delays) | M | `npm run test:relay -w packages/backend` | 1.3 |
| 2.2 | Message send flow: encrypt -> Tongo transfer -> relay submit | L | Send message between 2 test accounts, see in DB | 1.4, 2.1 |
| 2.3 | Message receive flow: relay delivery -> WebSocket push | L | Receive message on second client | 2.2 |
| 2.4 | Chat UI: conversation list, message bubbles, input | L | Visual: send/receive messages in browser | 1.5, 2.3 |
| 2.5 | Relay status animation in UI | S | Visual: see stages animate | 2.4 |

### Phase 3: AI + Polish (Days 7-9, Feb 21-23)

| # | Task | Size | Verify Command | Depends |
|---|------|------|----------------|---------|
| 3.1 | AI agent: /ai command -> OpenAI -> encrypted response | M | Send "/ai hello" -> get AI response in chat | 2.3 |
| 3.2 | Privacy indicators (lock, shield, lightning icons) | S | Visual | 2.4 |
| 3.3 | Tx hash links to Starkscan on each message | S | Click link -> opens Starkscan | 2.4 |
| 3.4 | New conversation flow (enter address -> lookup keys) | M | Start new chat with address | 2.4 |
| 3.5 | Fund account UI (for demo) | S | Click "Fund" -> Tongo balance increases | 1.5, 1.4 |

### Phase 4: Demo Prep (Days 10-13, Feb 24-28)

| # | Task | Size | Verify Command | Depends |
|---|------|------|----------------|---------|
| 4.1 | Demo script automation (`scripts/demo-flow.ts`) | M | `npx tsx scripts/demo-flow.ts` runs full flow | All |
| 4.2 | Landing page with project description | S | Visual | 1.5 |
| 4.3 | README + architecture diagrams | S | Read it | - |
| 4.4 | DoraHacks submission (video, description, links) | M | Submitted on DoraHacks | All |
| 4.5 | Bug fixes + edge cases | M | Manual testing | All |

**Size key:** S = 2-4h, M = 4-8h, L = 8-12h

---

## 12. Demo Script (5 Minutes)

### Minute 0:00-0:30 - Problem Statement
> "On-chain messages are public. Even encrypted DMs leak metadata - who talks to whom, when, how often. AgentSend fixes this."

### Minute 0:30-1:30 - Architecture Walkthrough
- Show architecture diagram
- Explain: "Messages ride on Tongo encrypted transfers. Amounts hidden, ZK-proved. Then relayed through Zcash shielded pool for metadata privacy."
- Mention: "We already have ZChat, a production Zcash messaging app. This connects Starknet to that privacy infrastructure."

### Minute 1:30-3:00 - Live Demo
1. **Open two browser windows** (Alice + Bob)
2. **Alice connects wallet** (ArgentX on Sepolia)
3. **Show Tongo balance** (pre-funded)
4. **Alice sends message to Bob:** "Hey Bob, let's talk privately"
5. **Watch the relay animation:** Encrypting -> Tongo Transfer -> Entering Shielded Pool -> Delivered
6. **Click tx hash** -> Show on Starkscan (real on-chain tx!)
7. **Bob's window:** Message appears with all privacy indicators
8. **Bob replies:** "Works perfectly!"

### Minute 3:00-4:00 - AI Agent Demo
1. **Alice types:** "/ai Explain how Tongo encryption works"
2. AI response appears in chat, encrypted and relayed same as any message
3. Show: "Even AI conversations are privacy-protected"

### Minute 4:00-5:00 - Production Vision
- "Mock relay becomes real Zcash shielded pool - we have the ZChat code ready"
- "Registry contract goes on-chain for decentralized key lookup"
- "Agent-to-agent encrypted messaging for autonomous AI coordination"
- "Privacy + Starknet + AI = the future of communication"

---

## 13. Risk Register

| # | Risk | Impact | Likelihood | Mitigation |
|---|------|--------|------------|------------|
| R1 | Tongo SDK has breaking changes / undocumented behavior | High | Medium | Read SDK source code early; have backup plan of simulating Tongo calls |
| R2 | Tongo contract not deployed on Sepolia | High | Low | Check immediately; contact FatSolutions if needed; deploy ourselves if open-source |
| R3 | Starknet Sepolia RPC unreliable during demo | High | Medium | Pre-record backup demo video; use multiple RPC providers (Alchemy, Infura, Blast) |
| R4 | Tongo ZK proof generation too slow (>30s) | Medium | Medium | Pre-generate proofs; show "Generating proof..." spinner; explain it's one-time per message |
| R5 | starknet.js v8 incompatibility | Medium | Low | Pin exact version that works with Tongo SDK; test early |
| R6 | Not enough time for AI agent feature | Low | Medium | AI is nice-to-have; core messaging is the priority; can be a "future work" slide |
| R7 | Hackathon judges question mock relay legitimacy | Medium | Medium | Reference ZChat production app; show Zcash shielded memo code from ZChat; explain integration path |
| R8 | Gas costs too high for demo (many messages) | Low | Low | Pre-fund accounts generously; Sepolia testnet ETH is free |
| R9 | Wallet connection issues (ArgentX/Braavos) | Medium | Medium | Test with both wallets; have pre-connected accounts ready |
| R10 | WebSocket drops during demo | Low | Medium | Fallback to polling; auto-reconnect logic |

---

## 14. Environment Variables

```env
# Starknet
STARKNET_RPC_URL=https://starknet-sepolia.public.blastapi.io
STARKNET_CHAIN_ID=SN_SEPOLIA

# Tongo
TONGO_CONTRACT_ADDRESS=<deployed_tongo_address>
TONGO_PRIVATE_KEY_ALICE=<alice_tongo_privkey>
TONGO_PRIVATE_KEY_BOB=<bob_tongo_privkey>

# Starknet Accounts (for gas)
STARKNET_ADDRESS_ALICE=<alice_stark_address>
STARKNET_PRIVATE_KEY_ALICE=<alice_stark_privkey>
STARKNET_ADDRESS_BOB=<bob_stark_address>
STARKNET_PRIVATE_KEY_BOB=<bob_stark_privkey>

# Backend
PORT=3001
JWT_SECRET=<random_secret>
OPENAI_API_KEY=<openai_key>

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001/api/ws
```

---

## 15. Judging Criteria Alignment

| Criterion | How AgentSend Addresses It |
|-----------|---------------------------|
| **Innovation** | Novel: using encrypted payment transfers as message carriers; dual-chain privacy (Starknet + Zcash concept) |
| **Privacy** | Three encryption layers; Tongo ZK proofs; shielded relay concept; no metadata leakage |
| **Technical** | Real on-chain Tongo transfers; ZK proofs; X25519 E2E encryption; WebSocket real-time |
| **Completeness** | Working demo: send/receive messages, AI agent, relay visualization |
| **Starknet Native** | Built entirely on Starknet; uses Tongo (Starknet-native privacy); Stark curve cryptography |
| **AI Integration** | Privacy-preserving AI assistant inside encrypted messenger |
| **Production Path** | ZChat exists as proof of Zcash integration; clear upgrade path documented |
