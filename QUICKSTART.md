# AgentSend - Quick Start Guide

**Privacy Messenger on Starknet** | Hackathon Re{define} 2025

---

## 🚀 Get Running (30 seconds)

```bash
cd /home/moltbot/clawd/starknet-hackathon

# Install dependencies (if not done)
npm install

# Start dev server
cd packages/frontend
npm run dev
```

Open http://localhost:3000

---

## 🔧 Environment Setup

Create `packages/frontend/.env.local`:

```env
# Network (sepolia for testing, mainnet for production)
NEXT_PUBLIC_STARKNET_NETWORK=sepolia

# Tongo Contract Address
# Sepolia: TBD (use mock for now)
# Mainnet: 0x0415f2c3b16cc43856a0434ed151888a5797b6a22492ea6fd41c62dbb4df4e6c
NEXT_PUBLIC_TONGO_CONTRACT=0x0000000000000000000000000000000000000000000000000000000000000000

# IPFS (optional - using localStorage mock for now)
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
NEXT_PUBLIC_IPFS_API=https://ipfs.infura.io:5001/api/v0

# Starknet RPC (optional - using public endpoint)
NEXT_PUBLIC_RPC_URL=https://starknet-sepolia.public.blastapi.io
```

---

## 📱 Testing the App

### 1. Prerequisites
- ArgentX or Braavos wallet installed
- Wallet connected to Sepolia testnet
- Some Sepolia ETH for gas (get from faucet)

**Sepolia Faucet**: https://starknet-faucet.vercel.app/

### 2. Workflow
1. Open app → Click "Connect Wallet"
2. Approve connection in wallet
3. Enter recipient address (0x...)
4. Type message → Click send
5. Message encrypted, uploaded to IPFS (mock), sent via Tongo (mock)
6. View in chat interface

---

## 🏗️ Project Structure

```
starknet-hackathon/
├── packages/
│   ├── frontend/         # Next.js app
│   │   ├── src/
│   │   │   ├── app/      # Routes (home, chat)
│   │   │   ├── components/  # React components
│   │   │   ├── hooks/    # useWallet, useTongo, useIPFS
│   │   │   ├── lib/      # Encryption utils
│   │   │   ├── config/   # Tongo config
│   │   │   └── providers/  # Starknet context
│   │   └── package.json
│   ├── backend/          # Future: Indexer
│   └── common/           # Shared types
├── README.md             # Full documentation
├── PHASE1-STATUS.md      # Progress tracking
└── package.json          # Workspace root
```

---

## 🔑 Key Files

### Hooks (packages/frontend/src/hooks/)
- `useWallet.ts` - Connect ArgentX/Braavos
- `useTongo.ts` - Tongo fund/transfer/rollover
- `useIPFS.ts` - Upload/download messages

### Components (packages/frontend/src/components/)
- `ChatInterface.tsx` - Main chat UI

### Utils (packages/frontend/src/lib/)
- `encryption.ts` - X25519 E2E encryption

### Config (packages/frontend/src/config/)
- `tongo.ts` - Contract addresses, network config

---

## 🧪 Current Status (Phase 1)

### ✅ Working
- Wallet connection (ArgentX/Braavos)
- Chat UI (message list, input, send)
- E2E encryption (X25519)
- IPFS integration (mock - localStorage)
- Tongo integration (mock - placeholders)

### 🚧 TODO (Phase 2)
- Real IPFS uploads (Pinata/Infura)
- Real Tongo SDK calls (pending testnet address)
- Encryption key derivation from wallet
- Public key registry
- Transaction history
- Error handling & polish

---

## 🎯 Testing Checklist

- [ ] Wallet connects successfully
- [ ] Can enter recipient address
- [ ] Can type and send message
- [ ] Message appears in chat
- [ ] Encrypted message stored (check localStorage for now)
- [ ] UI responsive on mobile
- [ ] Error messages clear

---

## 🐛 Troubleshooting

### "Wallet not detected"
- Install ArgentX or Braavos extension
- Refresh page after installing

### "Wrong network"
- Switch wallet to Sepolia testnet
- Get Sepolia ETH from faucet

### "Transaction failed"
- Check Sepolia ETH balance for gas
- Verify wallet is unlocked
- Check console for errors

### IPFS not working
- Using localStorage mock for MVP
- Real IPFS coming in Phase 2

### Tongo errors
- Using mock for MVP (no testnet deployment yet)
- All operations are placeholders
- Real integration pending contract address

---

## 📖 Learn More

- **Starknet Docs**: https://docs.starknet.io
- **Tongo Docs**: https://docs.tongo.cash
- **Hackathon**: https://hackathon.starknet.org
- **Full README**: [README.md](./README.md)

---

## 🆘 Need Help?

Check these files:
- `README.md` - Full project overview
- `PHASE1-STATUS.md` - Detailed progress
- `DEPLOYMENT-OPTIONS.md` - Tongo deployment strategies
- `SUBAGENT-REPORT.md` - Latest development report

---

**Built for Starknet Re{define} Hackathon 2025**
**Deadline**: Feb 28, 23:59 UTC
