# AgentSend - Deployment Guide

Quick guide to deploy AgentSend to Vercel for the hackathon demo.

---

## Prerequisites

- GitHub account
- Vercel account (free tier is sufficient)
- Pinata account for IPFS (optional - works without it in mock mode)

---

## Step 1: Prepare GitHub Repository

```bash
# Navigate to project root
cd /home/moltbot/clawd/starknet-hackathon

# Initialize git if not done
git init

# Add all files
git add .

# Commit
git commit -m "AgentSend - Privacy messaging on Starknet for Re{define} Hackathon"

# Create GitHub repository (via GitHub web or gh CLI)
# Then add remote
git remote add origin https://github.com/decentrathai/agentsend
git branch -M main
git push -u origin main
```

---

## Step 2: Get Pinata API Key (Optional)

1. Go to https://pinata.cloud
2. Sign up for free account
3. Go to API Keys → New Key
4. Enable "Pin to IPFS" permission
5. Copy the JWT token

---

## Step 3: Deploy to Vercel

### Option A: Via Vercel Dashboard

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `packages/frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

5. Add Environment Variables:
   ```
   NEXT_PUBLIC_STARKNET_NETWORK=sepolia
   NEXT_PUBLIC_TONGO_CONTRACT=0x0415f2c3b16cc43856a0434ed151888a5797b6a22492ea6fd41c62dbb4df4e6c
   NEXT_PUBLIC_USE_TONGO_MOCK=true
   NEXT_PUBLIC_PINATA_JWT=your_jwt_here (or leave empty for mock mode)
   NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/
   NEXT_PUBLIC_RPC_URL=https://starknet-sepolia.public.blastapi.io
   NEXT_PUBLIC_APP_NAME=AgentSend
   ```

6. Click "Deploy"

7. Wait 2-3 minutes for deployment

8. Your app will be live at: `https://agentsend-xxx.vercel.app`

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Navigate to frontend directory
cd packages/frontend

# Deploy
vercel

# Follow prompts:
# - Link to existing project? N
# - Project name? agentsend
# - Directory? ./
# - Override settings? N

# Add environment variables
vercel env add NEXT_PUBLIC_STARKNET_NETWORK
# Enter: sepolia

vercel env add NEXT_PUBLIC_TONGO_CONTRACT
# Enter: 0x0415f2c3b16cc43856a0434ed151888a5797b6a22492ea6fd41c62dbb4df4e6c

vercel env add NEXT_PUBLIC_USE_TONGO_MOCK
# Enter: true

# ... repeat for other env vars

# Deploy to production
vercel --prod
```

---

## Step 4: Test Deployment

1. Open the Vercel URL in browser
2. Connect ArgentX/Braavos wallet (Sepolia)
3. Initialize encryption keys
4. Send a test message to yourself
5. Verify message appears in chat

---

## Step 5: Update README with Demo Link

```bash
# Edit README.md
# Replace "Coming Soon" with your Vercel URL

# Commit and push
git add README.md
git commit -m "Add demo link"
git push
```

---

## Troubleshooting

### Build Fails

**Issue:** "Module not found" errors

**Solution:**
```bash
cd packages/frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Wallet Won't Connect

**Issue:** "Provider not found"

**Solution:**
- Ensure ArgentX or Braavos is installed
- Try refreshing the page
- Check browser console for errors

### IPFS Upload Fails

**Issue:** "Pinata upload failed"

**Solution:**
- Verify `NEXT_PUBLIC_PINATA_JWT` is correct
- Or leave it empty to use mock mode
- Check Pinata dashboard for API quota

### Tongo Errors

**Issue:** Any Tongo-related errors

**Solution:**
- Ensure `NEXT_PUBLIC_USE_TONGO_MOCK=true` is set
- Mock mode should work without real Tongo contract

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_STARKNET_NETWORK` | Yes | sepolia | Network to use |
| `NEXT_PUBLIC_TONGO_CONTRACT` | Yes | 0x041... | Tongo contract address |
| `NEXT_PUBLIC_USE_TONGO_MOCK` | Yes | true | Use mock Tongo |
| `NEXT_PUBLIC_PINATA_JWT` | No | - | Pinata API JWT |
| `NEXT_PUBLIC_PINATA_GATEWAY` | No | - | IPFS gateway URL |
| `NEXT_PUBLIC_RPC_URL` | No | - | Custom RPC endpoint |
| `NEXT_PUBLIC_APP_NAME` | No | AgentSend | App name |

---

## Production Checklist

- [ ] GitHub repository is public
- [ ] README has demo link
- [ ] Environment variables set in Vercel
- [ ] Deployment successful
- [ ] Wallet connection works
- [ ] Message sending works
- [ ] UI is responsive on mobile
- [ ] No console errors
- [ ] Demo link works in incognito mode

---

## Demo Video Recording

### Setup
1. Use OBS Studio or Loom
2. Resolution: 1920x1080 or 1280x720
3. Frame rate: 30 fps
4. Audio: Clear microphone

### Script (3 minutes)

**00:00-00:30 - Introduction**
- "Hi, I'm presenting AgentSend, a privacy-first messaging platform built on Starknet"
- Show landing page
- "AgentSend combines three layers of privacy: end-to-end encryption, Tongo's zero-knowledge proofs, and IPFS decentralized storage"

**00:30-01:00 - Connect Wallet**
- Click "Connect Wallet"
- Show ArgentX popup
- "First, I connect my Starknet wallet - ArgentX or Braavos"
- Wallet connects

**01:00-01:30 - Initialize Keys**
- Navigate to chat page
- Click "Initialize Keys"
- Show signature request
- "I sign a message to derive my encryption keys - no passwords needed"
- Keys generated

**01:30-02:30 - Send Message**
- Enter recipient address
- Type a message
- Click Send
- "The message is encrypted with X25519, uploaded to IPFS, and sent via a Tongo privacy transfer"
- Show message appearing in chat
- "The transaction amount is hidden using ElGamal encryption and zero-knowledge proofs"
- Show message delivered

**02:30-03:00 - Conclusion**
- Show conversation list
- "All messages are stored locally and encrypted"
- "AgentSend demonstrates that privacy on blockchain is not only possible, but practical"
- "Thank you for watching - check out the GitHub repo for technical details"
- Show demo URL and GitHub URL

---

## DoraHacks Submission

### Required Information

**Project Name:** AgentSend

**Description:** (95 words)
```
AgentSend delivers truly private messaging by combining three layers of privacy: 
end-to-end encryption (X25519), Tongo's zero-knowledge privacy layer (ElGamal + 
ZK proofs), and decentralized IPFS storage. Users connect their Starknet wallet, 
derive encryption keys from signatures (no passwords!), and send encrypted 
messages that ride on hidden-amount Tongo transfers. Messages are stored on IPFS 
and verified on-chain. The result: communications that are encrypted, anonymous, 
censorship-resistant, and verifiable. Built with Next.js, TypeScript, and Tongo 
SDK for Starknet Re{define} Privacy Track.
```

**GitHub URL:** https://github.com/decentrathai/agentsend

**Demo URL:** https://agentsend-xxx.vercel.app

**Video URL:** https://youtube.com/watch?v=xxx OR https://vimeo.com/xxx

**Tracks:** Privacy Track + Open Track

**Technologies Used:**
- Starknet
- Tongo SDK
- X25519 Encryption
- IPFS (Pinata)
- Next.js 14
- TypeScript
- TailwindCSS

**Team Members:**
- [Your Name] - Full Stack Developer

---

## Post-Submission

After submitting to DoraHacks:

1. **Share on Twitter:**
   ```
   🚀 Just submitted AgentSend to @Starknet #ReDefine Hackathon!
   
   🔒 Privacy-first messaging with E2E encryption + Tongo ZK proofs
   📦 Decentralized storage on IPFS
   ⚡ Built on Starknet
   
   Try the demo: [your-demo-url]
   
   #StarknetReDefine #Web3 #Privacy
   ```

2. **Share in Starknet Discord**

3. **Share on Reddit (r/starknet)**

4. **Update LinkedIn**

---

**Deployment Time:** 30-60 minutes  
**Demo Video Time:** 1-2 hours  
**Total to Submission:** 3-4 hours

Good luck! 🚀
