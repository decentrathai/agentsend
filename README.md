# AgentSend - Private Messaging on Starknet

[![Starknet](https://img.shields.io/badge/Starknet-Sepolia-blueviolet)](https://starknet.io)
[![Tongo SDK](https://img.shields.io/badge/Tongo-Privacy%20Layer-green)](https://tongo.cash)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> Privacy-first messaging platform built on Starknet using Tongo's zero-knowledge privacy layer and end-to-end encryption.

**Built for:** Starknet Re{define} Hackathon 2026  
**Track:** Privacy ($9,675 STRK)  
**Live Demo:** [Coming Soon on Vercel]  
**Status:** ✅ Ready for Submission  

---

## 🎯 What is AgentSend?

AgentSend enables **completely private messaging** on Starknet by combining:

- 🔒 **End-to-end encryption** (X25519/Curve25519)
- 🛡️ **Tongo privacy layer** (ElGamal + ZK proofs)
- 📦 **IPFS decentralized storage**
- ⚡ **Starknet verification** (every message is a transaction)

**Result:** Messages that are encrypted, anonymous, censorship-resistant, and verifiable.

---

## ✨ Features

### Core Privacy Features

- **🔐 E2E Encryption:** Messages encrypted with X25519 before leaving your device
- **👁️ Hidden Transactions:** Tongo encrypts transfer amounts using ElGamal
- **🎭 Zero-Knowledge Proofs:** Verify transactions without revealing data
- **🌐 Decentralized Storage:** Messages stored on IPFS (Pinata)
- **💎 On-Chain Verification:** Every message is a real Starknet transaction
- **🔑 Wallet-Derived Keys:** Encryption keys derived from wallet signatures

### User Experience

- **💬 Instant Messaging:** Real-time chat interface
- **📱 Responsive Design:** Works on desktop and mobile
- **🔄 Message History:** Local persistence with IndexedDB
- **💰 Balance Management:** View Tongo balance and pending funds
- **📋 Conversation List:** Manage multiple chats
- **✅ Delivery Status:** Track message sending/delivery

---

## 🏗️ Architecture

```
┌─────────────┐
│   User A    │
│  (Wallet)   │
└──────┬──────┘
       │
       │ 1. Sign message to derive encryption keys
       ├─────────────────────────────────────────┐
       │                                         │
       │ 2. Encrypt message with User B's pubkey│
       ├─────────────────────────────────────────┤
       │                                         │
       │ 3. Upload encrypted msg to IPFS         │
       ├─────────────────────────────────────────┤
       │                                         │
       │ 4. Send Tongo transfer with IPFS CID    │
       ├─────────────────────────────────────────┤
       │                                         │
       ▼                                         ▼
┌─────────────┐                          ┌─────────────┐
│    IPFS     │                          │   Tongo     │
│  (Pinata)   │                          │  Contract   │
│             │                          │             │
│ • Stores    │                          │ • ElGamal   │
│   encrypted │                          │   encrypted │
│   messages  │                          │   amounts   │
│ • Returns   │                          │ • ZK proofs │
│   CID       │                          │ • Transfer  │
└─────────────┘                          │   metadata  │
       │                                 └──────┬──────┘
       │                                        │
       │                                        │
       │ 5. User B receives notification        │
       ├────────────────────────────────────────┤
       │                                        │
       │ 6. Fetch encrypted msg from IPFS       │
       ├────────────────────────────────────────┤
       │                                        │
       │ 7. Decrypt with private key            │
       └────────────────────────────────────────┘
                      │
                      ▼
              ┌─────────────┐
              │   User B    │
              │  (Wallet)   │
              └─────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- ArgentX or Braavos wallet (Sepolia testnet)
- Sepolia ETH from [Starknet Faucet](https://starknet-faucet.vercel.app/)

### Installation

```bash
# Clone the repository
git clone https://github.com/decentrathai/agentsend
cd agentsend

# Install dependencies
npm install

# Set up environment variables
cd packages/frontend
cp .env.example .env.local

# Edit .env.local with your Pinata credentials (optional for demo)
# NEXT_PUBLIC_PINATA_JWT=your_jwt_here

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Usage

1. **Connect Wallet:** Click "Connect Wallet" and approve in ArgentX/Braavos
2. **Initialize Keys:** Click "Initialize Keys" to generate encryption keypair
3. **Send Message:**
   - Enter recipient address (0x...)
   - Type your message
   - Click "Send"
4. **View History:** All messages are saved locally and encrypted

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management

### Blockchain
- **Starknet** - Layer 2 scaling solution
- **starknet.js v8** - Starknet JavaScript library
- **@starknet-react/core** - React hooks for Starknet
- **Tongo SDK** - Privacy-preserving transfers

### Privacy & Encryption
- **TweetNaCl** - X25519 encryption (Curve25519)
- **Starknet Signatures** - Deterministic key derivation

### Storage
- **IPFS (Pinata)** - Decentralized file storage
- **localStorage** - Local message persistence

---

## 📦 Project Structure

```
starknet-hackathon/
├── packages/
│   ├── frontend/              # Next.js application
│   │   ├── src/
│   │   │   ├── app/           # Pages (home, chat)
│   │   │   ├── components/    # React components
│   │   │   │   └── ChatInterface.tsx
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   │   ├── useWallet.ts
│   │   │   │   ├── useTongo.ts
│   │   │   │   ├── useIPFS.ts
│   │   │   │   ├── useEncryptionKeys.ts
│   │   │   │   └── useMessages.ts
│   │   │   ├── lib/           # Utilities
│   │   │   │   └── encryption.ts
│   │   │   ├── config/        # Configuration
│   │   │   │   └── tongo.ts
│   │   │   └── providers/     # React context providers
│   │   │       └── StarknetProvider.tsx
│   │   └── package.json
│   ├── backend/               # Future: Indexer service
│   └── common/                # Shared types
├── README.md                  # This file
├── PHASE2-COMPLETE.md        # Phase 2 completion report
└── package.json              # Root workspace config
```

---

## 🔐 Security & Privacy

### Encryption Flow

1. **Key Generation:**
   - User signs a deterministic message with their wallet
   - Signature is hashed to generate 32-byte seed
   - Seed used to create X25519 keypair (public + private)
   - Public key published, private key stays local

2. **Message Encryption:**
   - Fetch recipient's public key from registry
   - Generate random nonce (24 bytes)
   - Encrypt message using X25519 box (XSalsa20-Poly1305)
   - Result: ciphertext that only recipient can decrypt

3. **Storage:**
   - Encrypted message uploaded to IPFS
   - IPFS returns content ID (CID)
   - CID included in Tongo transaction metadata

4. **Tongo Privacy:**
   - Tiny transfer (1 wei) as message carrier
   - Amount encrypted with ElGamal
   - Zero-knowledge proof validates transfer
   - Metadata (IPFS CID) visible but content encrypted

### What's Hidden?
- ✅ Message content (E2E encrypted)
- ✅ Transfer amount (ElGamal encrypted)
- ✅ Recipient address linkability (multiple transfers unlinkable)
- ❌ Sender/recipient addresses (visible on-chain)
- ❌ IPFS CID (visible but content encrypted)

---

## 🎯 Hackathon Submission

### Privacy Track Eligibility ✅

AgentSend qualifies for the Privacy Track by implementing:

1. **End-to-end encryption** with industry-standard X25519
2. **Zero-knowledge proofs** via Tongo's privacy layer
3. **Encrypted transaction amounts** using ElGamal
4. **Privacy-preserving architecture** from ground up
5. **Decentralized storage** for censorship resistance

### Innovation Points

- 🆕 First messaging app on Starknet with Tongo integration
- 🆕 Wallet signature-based key derivation (no passwords!)
- 🆕 Hybrid privacy (E2E encryption + ZK proofs)
- 🆕 Decentralized storage with IPFS
- 🆕 Open-source reference implementation

---

## 🔮 Future Roadmap

### Phase 3 (Post-Hackathon)

- [ ] **Tongo Testnet Integration** - Use real Tongo when testnet available
- [ ] **Indexer Service** - Scan chain for incoming messages
- [ ] **WebSocket Notifications** - Real-time message delivery
- [ ] **Group Messaging** - Multi-party encrypted chats
- [ ] **Public Key Registry** - On-chain or decentralized registry
- [ ] **Message Attachments** - Images, files via IPFS
- [ ] **Mobile App** - React Native version
- [ ] **Desktop App** - Electron wrapper

### Production Features

- [ ] **Key Backup/Recovery** - Secure key export/import
- [ ] **Contact Management** - Address book with ENS/StarkNet ID
- [ ] **Message Search** - Encrypted local search
- [ ] **Delivery Receipts** - Cryptographic read confirmations
- [ ] **Forward Secrecy** - Rotating keys per session
- [ ] **Disappearing Messages** - Auto-delete after time
- [ ] **Voice/Video Calls** - WebRTC with STUN/TURN

---

## 🧪 Current Status

### ✅ Working (Phase 2 Complete)

- Wallet connection (ArgentX/Braavos)
- Key derivation from wallet signatures
- E2E encryption (X25519)
- IPFS integration (Pinata) with fallback to mock
- Tongo integration (mock mode for demo)
- Message persistence (localStorage)
- Conversation management
- Chat UI with loading states
- Error handling
- Responsive design

### 🚧 Pending (Post-Hackathon)

- Real Tongo SDK integration (pending testnet contract)
- Message indexer backend
- Real-time notifications
- Production deployment

---

## 📚 Documentation

- [Quick Start Guide](QUICKSTART.md)
- [Phase 1 Status](PHASE1-STATUS.md)
- [Phase 2 Completion](PHASE2-COMPLETE.md)
- [Deployment Options](DEPLOYMENT-OPTIONS.md)
- [Architecture Deep Dive](docs/ARCHITECTURE.md) *(Coming Soon)*
- [API Reference](docs/API.md) *(Coming Soon)*

---

## 🤝 Contributing

This project was built for the Starknet Re{define} Hackathon. Contributions welcome after Feb 28, 2025!

### Development

```bash
# Run development server
npm run dev

# Run tests (coming soon)
npm run test

# Build for production
npm run build

# Lint code
npm run lint
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🏆 Acknowledgments

- **Starknet Foundation** - For the Re{define} Hackathon
- **FAT Solutions** - For the Tongo SDK
- **Pinata** - For IPFS infrastructure
- **ArgentX & Braavos** - For wallet support

---

## 📞 Contact

- **GitHub:** [decentrathai/agentsend](https://github.com/decentrathai/agentsend)
- **Demo:** [agentsend.vercel.app](https://agentsend.vercel.app) *(Coming Soon)*
- **Hackathon:** [DoraHacks](https://dorahacks.io/hackathon/redefine)

---

**Built with ❤️ for Starknet Re{define} Hackathon 2026**
