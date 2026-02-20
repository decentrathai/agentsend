# AgentSend - TODO / Sprint Tracker

> Start: Feb 15 | Deadline: Feb 28 | 13 days

## Legend
- [ ] Not started
- [~] In progress  
- [x] Done
- **S** = 2-4h | **M** = 4-8h | **L** = 8-12h

---

## Phase 1: Foundation (Feb 15-17)

- [ ] **1.1** [S] Monorepo setup - npm workspaces, tsconfig.base, .env.example
  - Verify: `npm run build` succeeds
- [ ] **1.2** [M] Common package - types (Message, User, Conversation), X25519 crypto (tweetnacl)
  - Verify: `npm test -w packages/common` - keygen + encrypt/decrypt round-trip
- [ ] **1.3** [M] Backend skeleton - Express, health route, JWT auth, CORS
  - Verify: `curl localhost:3001/api/health` returns 200
- [ ] **1.4** [L] Tongo service - SDK integration, Fund/Transfer/Rollover wrappers
  - Verify: Fund 100 units + Transfer 1 unit on Sepolia testnet
  - ⚠️ BLOCKER: Need Tongo contract address on Sepolia
- [ ] **1.5** [M] Frontend skeleton - Next.js 14, Tailwind, starknet-react wallet connect
  - Verify: `npm run dev` + connect ArgentX wallet

## Phase 2: Core Messaging (Feb 18-20)

- [ ] **2.1** [M] Mock Zcash relay - in-memory pool, 3-stage status, configurable delays
  - Verify: Unit test - submit message, watch status transitions, delivery callback
- [ ] **2.2** [L] Send flow - POST /send -> encrypt -> Tongo transfer -> relay submit -> store
  - Verify: Send between Alice/Bob test accounts, confirm in DB + on Starkscan
- [ ] **2.3** [L] Receive flow - relay delivery -> WebSocket push -> client decryption
  - Verify: Open 2 browser tabs, send from one, see message appear in other
- [ ] **2.4** [L] Chat UI - ConversationList sidebar, ChatWindow, MessageBubble, input box
  - Verify: Visual - functional chat interface with messages displaying
- [ ] **2.5** [S] Relay status animation - progress bar/steps showing shielded pool stages
  - Verify: Visual - see "Encrypting -> Tongo ✓ -> Shielded Pool -> Delivered ✓"

## Phase 3: AI + Polish (Feb 21-23)

- [ ] **3.1** [M] AI agent - detect "/ai" prefix, OpenAI call, response via same message pipeline
  - Verify: "/ai hello" returns AI response encrypted in chat
- [ ] **3.2** [S] Privacy indicators - 🔒 🛡️ ⚡ icons on messages
  - Verify: Visual
- [ ] **3.3** [S] Tx hash links - clickable Starkscan links on each message
  - Verify: Click -> opens correct tx on Starkscan
- [ ] **3.4** [M] New conversation flow - enter Starknet address, lookup keys, start chat
  - Verify: Create new chat with a registered user
- [ ] **3.5** [S] Fund account UI - button to fund Tongo balance for demo
  - Verify: Click Fund -> balance increases

## Phase 4: Demo Prep (Feb 24-28)

- [ ] **4.1** [M] Demo automation script - `scripts/demo-flow.ts`
  - Verify: `npx tsx scripts/demo-flow.ts` runs end-to-end
- [ ] **4.2** [S] Landing page - project name, tagline, connect wallet CTA
  - Verify: Visual
- [ ] **4.3** [S] README with setup instructions
  - Verify: Fresh clone -> follow README -> app runs
- [ ] **4.4** [M] DoraHacks submission - video recording, project description, screenshots
  - Verify: Submitted on DoraHacks before Feb 28
- [ ] **4.5** [M] Bug fixes + testing
  - Verify: Manual walkthrough of full demo flow 3x

---

## Immediate Actions (Today, Feb 15)

1. [ ] Check if Tongo contract is deployed on Sepolia - `npm info @fatsolutions/tongo-sdk`
2. [ ] Install Tongo SDK and test basic import
3. [ ] Set up ArgentX wallet on Sepolia testnet
4. [ ] Get Sepolia ETH from faucet
5. [ ] Initialize monorepo structure (task 1.1)

## Blockers / Questions

- [ ] **Tongo contract address on Sepolia?** - Check docs / contact FatSolutions
- [ ] **Tongo SDK npm version?** - Check if published and working
- [ ] **ERC20 token for Tongo on Sepolia?** - Need a test token to wrap
- [ ] **Hackathon registration confirmed on DoraHacks?**

## Key Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Message encryption | X25519-XSalsa20-Poly1305 (tweetnacl) | Battle-tested, fast, simple API |
| Message transport | 1-unit Tongo transfer per message | Real on-chain tx, hidden amounts |
| Zcash relay | Mocked for hackathon | Demonstrate concept, reference ZChat for production |
| Storage | SQLite (better-sqlite3) | Zero setup, good enough for demo |
| Frontend | Next.js 14 + Tailwind | Fast to build, looks professional |
| AI | OpenAI GPT-4 | Reliable, fast, easy integration |
| Wallet | ArgentX on Sepolia | Most popular Starknet wallet |
