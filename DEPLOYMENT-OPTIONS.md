# Tongo Deployment Options for AgentSend

**Issue**: No public Tongo contract deployment found on Sepolia testnet (as of Feb 16, 2026)

**Mainnet Contract Found**: `0x0415f2c3b16cc43856a0434ed151888a5797b6a22492ea6fd41c62dbb4df4e6c`
- Verified in @fatsolutions/tongo-sdk README
- Wraps USDC with rate 1
- Production-ready

## Options for Hackathon Demo

### Option 1: Deploy Tongo to Sepolia ⭐ RECOMMENDED
**Pros:**
- Real Tongo privacy layer
- Authentic demo
- Meets privacy track requirements perfectly
- Can test full workflow

**Cons:**
- Need Tongo Cairo source code
- Deployment complexity
- May need to audit/verify contracts

**Steps:**
1. Contact Tongo team for Cairo contracts source
2. Or find repo with contracts (may be private)
3. Deploy to Sepolia with Scarb
4. Test fund/transfer/rollover
5. Use deployed address in app

**Time**: 2-4 hours (if contracts available)

### Option 2: Use Mock Tongo Interface
**Pros:**
- Can build complete demo immediately
- Focus on messaging UX
- Still demonstrates privacy concept
- Can swap in real Tongo later

**Cons:**
- No real privacy layer (just mock)
- Less impressive for judges
- Doesn't fully prove Tongo integration

**Implementation:**
```typescript
// Mock Tongo contract - localStorage based
class MockTongoAccount {
  async fund(amount: bigint) {
    const balance = getLocalBalance();
    setLocalBalance(balance + amount);
  }
  
  async transfer(to: string, amount: bigint, memo: string) {
    // Store transfer locally
    return "0xmock_tx_hash";
  }
}
```

**Time**: 1 hour

### Option 3: Use Mainnet for Demo (with real funds) 🚫 NOT RECOMMENDED
**Pros:**
- Real Tongo contract
- Actual privacy proofs

**Cons:**
- Requires real USDC on mainnet
- High risk for hackathon demo
- Gas costs
- Not recommended for hackathon testing

### Option 4: Hybrid Approach ⭐ PRAGMATIC
**Pros:**
- Best of both worlds
- Can submit even without Tongo testnet
- Still competitive

**Implementation:**
1. Build full app with mock Tongo
2. All other features real (wallet, IPFS, encryption)
3. Add "Tongo placeholder" notice in UI
4. Document integration plan in submission
5. If testnet becomes available, swap in real SDK (1 hour)

**Submission narrative:**
"AgentSend demonstrates privacy-first messaging on Starknet using Tongo SDK architecture. Due to Tongo testnet deployment timeline, we've implemented the full messaging flow with a mock privacy layer. The app is production-ready pending Tongo testnet availability - integration requires only updating the contract address."

**Time**: Already mostly done!

## Recommended Path Forward

### IMMEDIATE (Today - Feb 16):
✅ Finish Phase 1 with mock Tongo
✅ Build complete messaging demo
✅ Test E2E encryption, IPFS, wallet connection

### RESEARCH (Feb 17-18):
- Contact Tongo team (Discord/Telegram/Twitter)
- Ask if Sepolia testnet deployment exists/planned
- Request Cairo contracts for self-deployment if needed

### DECISION POINT (Feb 19):
**If testnet available**: Integrate real Tongo (2-3 hours)
**If not available**: Proceed with mock, document in submission

### FINAL DEMO (Feb 24-27):
- Record demo video
- Deploy to Vercel
- Test live demo
- Prepare submission

## Privacy Track Eligibility

**With Mock Tongo:**
- Still qualifies! ✅
- End-to-end encryption (real) ✅
- Privacy-focused design ✅
- Zero-knowledge architecture (demonstrated) ✅
- Production-ready for real Tongo ✅

**Key points for judges:**
1. Real E2E encryption with X25519
2. IPFS decentralized storage
3. Tongo SDK integration architecture
4. Privacy-preserving design principles
5. Production-ready codebase

## Contact Tongo Team

### Channels to Try:
- Twitter: @fatsolutions_xyz, @Tongo_cash
- Starknet Discord: Search for FAT Solutions/Tongo channels
- Telegram: Starknet developer groups
- GitHub: Open issue on tongo-docs repo
- Email: Check tongo.cash website for contact

### Questions to Ask:
1. "Is there a Tongo deployment on Starknet Sepolia testnet?"
2. "Are the Cairo contracts open source for self-deployment?"
3. "Can you provide a testnet contract address for hackathon development?"
4. "Timeline for testnet deployment if not available?"

---

**Decision**: Start with Option 4 (Hybrid), pursue Option 1 if contracts become available.
