# Tongo Contract Address Search

**Goal**: Find deployed Tongo contract address on Starknet Sepolia testnet

## Search Strategy

### 1. Official Documentation
- [x] https://docs.tongo.cash - Under construction, no deployment info
- [ ] Check if there's a deployment guide in mdbook sources

### 2. NPM Package
- [ ] Download `@fatsolutions/tongo-sdk` locally
- [ ] Check for example code with contract addresses
- [ ] Look at package.json scripts or test files

### 3. GitHub Repositories
- [ ] https://github.com/fatlabsxyz/tongo (main protocol repo)
- [ ] https://github.com/fatlabsxyz/tongo-sdk (SDK repo)
- [ ] https://github.com/fatlabsxyz/tongo-docs (docs source)
- [ ] Search issues/PRs for "deploy", "contract", "address", "sepolia"

### 4. Blockchain Explorers
- [ ] StarkScan Sepolia: https://sepolia.starkscan.co
- [ ] Voyager Sepolia: https://sepolia.voyager.online
- [ ] Search for "Tongo", "FAT Solutions", recent contract deployments

### 5. Community
- [ ] Starknet Discord - #tongo channel (if exists)
- [ ] Starknet Telegram
- [ ] Twitter: @fatsolutions_xyz, @Tongo_cash
- [ ] Ask in hackathon Discord

### 6. Direct Contact
- [ ] Email FAT Solutions team
- [ ] DM on Twitter
- [ ] Comment on recent Tongo posts

## Findings

### Attempt 1: Documentation
- Docs are "under construction"
- No deployment section yet
- Only protocol overview and SDK usage patterns

### Attempt 2: NPM Search
- Package exists: @fatsolutions/tongo-sdk
- npmjs.com page blocked (403)
- Can't access README directly

### Attempt 3: GitHub
- Repos are private or don't have public deployment info
- Git clone failed (auth required)

## Backup Plans

### Option A: Mock Tongo Contract
If no testnet deployment exists, create a mock:
```typescript
interface MockTongoContract {
  fund(token: string, amount: bigint): Promise<void>;
  transfer(to: string, amount: bigint, memo: string): Promise<string>;
  rollover(): Promise<void>;
  getBalance(address: string): Promise<{ current: bigint; pending: bigint }>;
}
```

### Option B: Deploy Tongo Ourselves
- Get Tongo Cairo contracts source
- Deploy to Sepolia testnet
- Use our deployed address
- Note this in hackathon submission

### Option C: Focus on Demo Without Tongo
- Build full messaging flow with mock
- Use regular Starknet transfers (no privacy)
- Add note: "Tongo integration pending testnet deployment"
- Still qualifies for Open track

## Next Steps

1. Try downloading SDK from npm locally:
   ```bash
   npm pack @fatsolutions/tongo-sdk
   tar -xzf fatsolutions-tongo-sdk-*.tgz
   cat package/README.md
   ```

2. Search Twitter/Discord for recent Tongo mentions

3. If no contract found by Feb 18: Go with Backup Plan A (mock)

## Decision Point

**By Feb 18 (2 days)**:
- If contract found: Integrate real Tongo
- If not found: Use mock, build full demo, note in submission

Either way, project demonstrates:
- E2E encryption ✅
- IPFS storage ✅
- Starknet integration ✅
- Privacy-focused design ✅

**Privacy track eligibility**: Still valid (encryption + privacy design)
**Open track**: Strong (innovative messaging use case)
